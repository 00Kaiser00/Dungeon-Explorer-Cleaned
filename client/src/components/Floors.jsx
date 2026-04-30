import { useState, useEffect } from "react";

function Floors({
  floor,
  setFloor,
  gridTiles,
  setGridTiles,
  onOpenShop,
  onOpenSkill,
  onOpenTreasure,
  onOpenEnemy,
  onOpenBoss,
  onOpenLibrary,
  onOpenDruid,
  onOpenRest,
  onOpenTrap,
}) {
  const [clickLocked, setClickLocked] = useState(false);
  const [stairsTileImg, setStairsTileImg] = useState(null);

  //Set grid size
  const getGridSize = () => {
    return floor === 1 ? 3 : 4;
  };

  // ----------------------------
  // Load tiles for a given floor
  // ----------------------------
  const loadFloorTiles = (floorNumber) => {
    fetch("/tiles.json")
      .then((res) => res.json())
      .then((data) => {
        const floorConfig = data.floors.find((f) => f.id === floorNumber);
        if (!floorConfig) return;

        const { tileCounts, tiles } = floorConfig;

        const builtTiles = [];
        Object.entries(tileCounts).forEach(([type, count]) => {
          const tileDef = tiles.find((t) => t.type === type);
          if (!tileDef) return;

          for (let i = 0; i < count; i++) {
            builtTiles.push({
              type,
              img: tileDef.img,
              revealed: false,
              visited: false,
            });
          }
        });

        // Store the stairs tile image URL
        const stairsTile = tiles.find((t) => t.type === "stairs");
        if (stairsTile) {
          setStairsTileImg(stairsTile.img);
        }

        // Shuffle tiles
        const shuffledTiles = builtTiles
          .map((tile) => ({ ...tile, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ sort, ...tile }) => tile);

        setGridTiles(shuffledTiles);
      });
  };

  // ----------------------------
  // Load initial floor tiles
  // ----------------------------
  useEffect(() => {
    if (gridTiles.length === 0) loadFloorTiles(floor);
  }, [floor]);

  // ----------------------------
  // Tile click handler
  // ----------------------------
  const handleTileClick = (index) => {
    if (clickLocked) return;
    setClickLocked(true);
    setTimeout(() => setClickLocked(false), 1000);

    const clickedTile = gridTiles[index];
    if (clickedTile.visited) return;

    const unvisitedIndexes = gridTiles
      .map((t, i) => (!t.visited ? i : null))
      .filter((i) => i !== null);

    const revealedCount = gridTiles.filter((t) => t.visited).length;

    // ----------------------------
    // Boss clicked early
    // ----------------------------
    if (clickedTile.type === "boss" && unvisitedIndexes.length > 1) {
      const swapCandidates = unvisitedIndexes.filter(
        (i) => i !== index && gridTiles[i].type !== "boss"
      );
      if (swapCandidates.length > 0) {
        const swapIndex =
          swapCandidates[Math.floor(Math.random() * swapCandidates.length)];

        setGridTiles((prev) => {
          const updated = [...prev];
          [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
          updated[index] = { ...updated[index], revealed: true, visited: true };
          return updated;
        });

        setTimeout(() => {
          const swappedTile = gridTiles[swapIndex];
          if (swappedTile.type === "shop") onOpenShop();
          else if (swappedTile.type === "skill") onOpenSkill();
          else if (swappedTile.type === "treasure") onOpenTreasure();
          else if (swappedTile.type === "enemy") onOpenEnemy();
          else if (swappedTile.type === "library") onOpenLibrary();
          else if (swappedTile.type === "druid") onOpenDruid();
          else if (swappedTile.type === "rest") onOpenRest();
          else if (swappedTile.type === "trap") onOpenTrap();
        }, 1000);

        return; // do not reveal boss yet
      }
    }

    // ----------------------------
    // Enemy reveal only after 2 clicks
    // ----------------------------
    if (clickedTile.type === "enemy" && revealedCount < 2) {
      const swapCandidates = unvisitedIndexes.filter(
        (i) => i !== index && gridTiles[i].type !== "boss" && gridTiles[i].type !== "enemy"
      );
      if (swapCandidates.length > 0) {
        const swapIndex =
          swapCandidates[Math.floor(Math.random() * swapCandidates.length)];

        setGridTiles((prev) => {
          const updated = [...prev];
          [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
          updated[index] = { ...updated[index], revealed: true, visited: true };
          return updated;
        });

        setTimeout(() => {
          const swappedTile = gridTiles[swapIndex];
          if (swappedTile.type === "shop") onOpenShop();
          else if (swappedTile.type === "skill") onOpenSkill();
          else if (swappedTile.type === "treasure") onOpenTreasure();
          else if (swappedTile.type === "library") onOpenLibrary();
          else if (swappedTile.type === "druid") onOpenDruid();
          else if (swappedTile.type === "rest") onOpenRest();
          else if (swappedTile.type === "trap") onOpenTrap();
        }, 1000);

        return;
      }
    }

    // ----------------------------
    // Normal click: reveal tile
    // ----------------------------
    setGridTiles((prev) =>
      prev.map((tile, i) =>
        i === index ? { ...tile, revealed: true, visited: true } : tile
      )
    );

    setTimeout(() => {
      if (clickedTile.type === "shop") onOpenShop();
      else if (clickedTile.type === "skill") onOpenSkill();
      else if (clickedTile.type === "treasure") onOpenTreasure();
      else if (clickedTile.type === "library") onOpenLibrary();
      else if (clickedTile.type === "druid") onOpenDruid();
      else if (clickedTile.type === "enemy") onOpenEnemy();
      else if (clickedTile.type === "rest") onOpenRest();
      else if (clickedTile.type === "trap") onOpenTrap();
      else if (clickedTile.type === "boss") {
        onOpenBoss();
        // Replace boss with stairs
        setGridTiles((prev) =>
          prev.map((tile, i) =>
            i === index
              ? {
                  ...tile,
                  type: "stairs",
                  img: stairsTileImg,
                  revealed: true,
                  visited: false,
                }
              : tile
          )
        );
      } else if (clickedTile.type === "stairs") {
        // ----------------------------
        // Go to next floor
        // ----------------------------
        // Cover tiles
        setGridTiles((prev) =>
          prev.map((tile) => ({ ...tile, revealed: false, visited: false }))
        );

        // Increment floor and load next floor
        setFloor((prev) => {
          const nextFloor = prev + 1;

          setTimeout(() => {
            loadFloorTiles(nextFloor);
          }, 200);

          return nextFloor;
        });
      }
    }, 1000);
  };

  return (
    <div>
      <div
        className={`border-2 rounded border-black w-1/2 mx-auto bg-white 
                    grid mt-10 mb-10 gap-0`}
        style={{ gridTemplateColumns: `repeat(${getGridSize()}, 1fr)` }}
      >
        {gridTiles.map((tile, index) => (
          <button
            key={index}
            onClick={() => handleTileClick(index)}
            className={`p-0 m-0 border border-white aspect-square ${
              tile.revealed ? "bg-white" : "bg-black"
            }`}
          >
            {tile.revealed ? (
              <img
                src={tile.img}
                alt={tile.type}
                className="w-full h-full object-cover block"
              />
            ) : (
              <div className="w-full h-full bg-black"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Floors;