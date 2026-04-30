import { useState, useEffect, use } from "react";
import Floors from "./Floors";
import Shop from "./Shop";
import Skills from "./Skills";
import Treasure from "./Treasure";
import Enemy from "./Enemy";
import Boss from "./Boss";
import Backpack from "./Backpack";
import Character from "./Character";
import Library from "./Library";
import SpellBook from "./SpellBook";
import EndingScreen from "./EndingScreen";
import Druid from "./Druid";
import Rest from "./Rest";
import Trap from "./Trap";
import HelpScreen from "./HelpScreen";

function Dashboard({setGameState}) {
  const [showBackpack, setShowBackpack] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [showTreasure, setShowTreasure] = useState(false);
  const [showEnemy, setShowEnemy] = useState(false);
  const [showBoss, setShowBoss] = useState(false);
  const [showCharacter, setShowCharacter] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showSpellBook, setShowSpellBook] = useState(false);
  const [showEnding, setShowEnding] = useState(false);
  const [showDruid, setShowDruid] = useState(false);
  const [showRest, setShowRest] = useState(false);
  const [showTrap, setShowTrap] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const [coins, setCoins] = useState(() => {
    const savedCoins = localStorage.getItem("coins");
    return savedCoins ? JSON.parse(savedCoins) : 100;
  });

  const [currentItems, setCurrentItems] = useState(() => {
    const savedItems = localStorage.getItem("currentItems");
    return savedItems ? JSON.parse(savedItems) : [{
      id: 1,
      name: "Sword",
      img: "/Pixel Art/Sword/Sword.png",
      minDamage: 1,
      maxDamage: 2,
      rarity: "Dull",
      weaponType: "Sword",
      attackCooldown: 3,
    },
    {
      name: "Shield",
      id: 25,
      img: "/Pixel Art/Shield/Shield.png",
      damageReduction: 0.30,
      rarity: "Dull",
      weaponType: "Shield",
      defenseCooldown: 5,
    }];
  });

  const [character, setCharacter] = useState(() => {
    const savedCharacter = localStorage.getItem("character");
    return savedCharacter ? JSON.parse(savedCharacter) : 
      {      
        maxHealth: 10,
        maxMana: 5,
        health: 10,
        mana: 5,
        magic: 0,
        attack: 5,
        defense: 0,
        img: "/Pixel Art/Misc/Player Right.png",
    };
  });

  const [floor, setFloor] = useState(() => {
    const savedFloor = localStorage.getItem("floor");
    return savedFloor ? JSON.parse(savedFloor) : 1;
  });

  const [gridTiles, setGridTiles] = useState(() => {
    const saved = localStorage.getItem("gridTiles");
    return saved ? JSON.parse(saved) : [];
  });

  const [spells, setSpells] = useState(() => {
    const saved = localStorage.getItem("spells");
    return saved ? JSON.parse(saved) : [];
  });

  const [favoritedItem, setFavoritedItem] = useState(() => {
    const saved = localStorage.getItem("favoritedItem");
    return saved ? JSON.parse(saved) : {};
  })

  const [reviveUsed, setReviveUsed] = useState(() => {
    const saved = localStorage.getItem("reviveUsed");
    return saved ? JSON.parse(saved) : false;
  });

  const [trapSaved, setTrapSaved] = useState(() => {
    const saved = localStorage.getItem("trapSaved");
    return saved ? JSON.parse(saved) : false;
  });

  //Save grid to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("gridTiles", JSON.stringify(gridTiles));
  }, [gridTiles]);

  useEffect (( ) => {
      localStorage.setItem("coins", JSON.stringify(coins));
  }, [coins]);

  useEffect(() => {
    localStorage.setItem("currentItems", JSON.stringify(currentItems));
  }, [currentItems]);

  useEffect(() => {
    localStorage.setItem("character", JSON.stringify(character));
  }, [character]);

  useEffect(() => {
    localStorage.setItem("floor", JSON.stringify(floor));
  }, [floor]);

  useEffect(() => {
    localStorage.setItem("spells", JSON.stringify(spells));
  }, [spells]);

  useEffect(() => {
    localStorage.setItem("favoritedItem", JSON.stringify(favoritedItem));
  }, [favoritedItem]);

  useEffect(() => {
    localStorage.setItem("reviveUsed", JSON.stringify(reviveUsed));
  }, [reviveUsed]);

  useEffect(() => {
    localStorage.setItem("trapSaved", JSON.stringify(trapSaved));
  }, [trapSaved]);

  useEffect(() => {
    if (showEnemy) setGameState("enemy");
    else if (!showEnemy) setGameState("general");
  }, [showEnemy]);

  useEffect(() => {
    if (showBoss && floor === 8) setGameState("finalBoss");
    else if (showBoss) setGameState("boss");
    else if (!showBoss) setGameState("general");
  }, [showBoss]);

  return (
    <div className="h-2/3 w-2/3 mx-auto my-auto overflow-hidden relative">
      <div className="text-center border-2 border-black bg-no-repeat bg-center"
      style={{ backgroundImage: "url('/Pixel Art/Misc/Map.png')",
        backgroundSize: "100% 100%",
       }}
      >
      <p className="text-white font-bold text-3xl mt-2 mb-2 text-center">Floor: {floor}</p>
        <Floors
          floor={floor}
          setFloor={setFloor}
          gridTiles={gridTiles}
          setGridTiles={setGridTiles}
          onOpenShop={() => setShowShop(true)}
          onOpenSkill={() => setShowSkills(true)}
          onOpenTreasure={() => setShowTreasure(true)}
          onOpenEnemy={() => setShowEnemy(true)}
          onOpenBoss={() => setShowBoss(true)}
          onOpenLibrary={() => setShowLibrary(true)}
          onOpenDruid={() => setShowDruid(true)}
          onOpenRest={() => setShowRest(true)}
          onOpenTrap={() => setShowTrap(true)}
        />

        {/* Help button */}
        <button className="absolute top-4 left-6"
          onClick={() => setShowHelp(!showHelp)}
        >
          <img src="/Pixel Art/Misc/Help Button.png" alt="Help Button" className="w-20 h-20" />
        </button>

        {/* Backpack button */}
        <button
          onClick={() => setShowBackpack(!showBackpack)}
          className="absolute bottom-4 left-4 hover:scale-110 transition-transform"
        >
          <img src="/Pixel Art/Misc/Backpack.png.png" alt="Backpack" className="h-20 w-20" />
        </button>

        {/* Spell Book button */}
        <button
          onClick={() => setShowSpellBook(!showSpellBook)}
          className="absolute bottom-4 left-20 hover:scale-110 transition-transform"
        >
          <img src="/Pixel Art/Misc/Open Book.png" alt="Spell Book" className="h-20 w-20" />
        </button>       

        {/* Coins, Health, and Mana */}
        {character && (
          <div className="absolute top-4 right-6 font-bold">
            <div className="flex items-center gap-2">
              <img src="/Pixel Art/Misc/Coin.png.png" alt="Coin" className="h-10 w-10" />
              <p className="text-white font-bold text-lg">x {coins}</p>
            </div>
            <div className="flex items-center mb-2">
              <img src="/Pixel Art/Misc/Heart.png" alt="Heart" className="h-12 w-12" />
              <p className="text-red-700">{character.health} / {character.maxHealth}</p>
            </div>

            <div className="flex items-center mb-2">
              <img src="/Pixel Art/Misc/Blue Star.png" alt="Mana" className="h-12 w-12" />
              <p className="text-blue-700">{character.mana} / {character.maxMana}</p>
            </div>
          </div>
        )}

        {/* Character */}
        <button
          onClick={() => setShowCharacter(!showCharacter)}
          className="absolute bottom-4 right-4 hover:scale-110 transition-transform"
        >
          <img src={character.img} alt="Character" className="h-20 w-20" />
        </button>
      </div>

        {/* Backpack window */}
        {showBackpack && (
          <Backpack
            currentItems={currentItems}
            setCurrentItems={setCurrentItems}
            favoritedItem={favoritedItem}
            setFavoritedItem={setFavoritedItem}
            character={character}
            setCharacter={setCharacter}
            coins={coins}
            setCoins={setCoins}
            onClose={() => setShowBackpack(false)}
            setTrapSaved={setTrapSaved}
          />
        )}


      {/* Character window */}
      {showCharacter && character && (
        <Character
          character={character}
          onClose={() => setShowCharacter(false)}
        />
      )}

      {/* Help overlay */}
      {showHelp && (
        <div className="fixed inset-0 flex justify-center items-center bg-cover z-50"
          style={{ backgroundImage: "url('/Pixel Art/Tiles/Dungeon Tile.png')" }}
        >
          <HelpScreen onClose={() => setShowHelp(false)} />
        </div>
      )}

      {/* Shop overlay */}
        {showShop && (
        <div className="fixed inset-0 flex justify-center items-center bg-cover z-50"
          style={{ backgroundImage: "url('/Pixel Art/Tiles/Dungeon Tile.png')" }}
        >
            <Shop
            coins={coins}
            setCoins={setCoins}
            currentItems={currentItems}
            setCurrentItems={setCurrentItems}
            onClose={() => setShowShop(false)}
            onOpenBackpack={() => setShowBackpack(true)}
            />
        </div>
        )}

      {/* Skills overlay */}
      {showSkills && (
        <div className="fixed inset-0 flex justify-center items-center bg-cover z-50"
          style={{ backgroundImage: "url('/Pixel Art/Tiles/Dungeon Tile.png')" }}
        >
          <Skills
            coins={coins}
            setCoins={setCoins}
            character={character}
            setCharacter={setCharacter}
            onClose={() => setShowSkills(false)}
          />
        </div>
      )}

      {/* Treasure overlay */}
      {showTreasure && (
        <div className="fixed inset-0 flex justify-center items-center bg-cover z-50"
          style={{ backgroundImage: "url('/Pixel Art/Tiles/Dungeon Tile.png')" }}
        >
          <Treasure
            currentItems={currentItems}
            setCurrentItems={setCurrentItems}
            coins={coins}
            setCoins={setCoins}
            onClose={() => setShowTreasure(false)}
            onOpenBackpack={() => setShowBackpack(true)}
          />
        </div>
      )}

      {/* Enemy Overlay */}
      {showEnemy && (
        <div className="fixed inset-0 flex justify-center items-center bg-cover z-50"
          style={{ backgroundImage: "url('/Pixel Art/Tiles/Dungeon Tile.png')" }}
        >
          <Enemy
            character={character}
            setCharacter={setCharacter}
            currentItems={currentItems}
            setCurrentItems={setCurrentItems}
            favoritedItem={favoritedItem}
            setFavoritedItem={setFavoritedItem}
            spells={spells}
            setCoins={setCoins}
            floor={floor}
            onClose={() => setShowEnemy(false)}
            onDeath={() => {
              setShowEnemy(false);
              setShowEnding(true);
            }}
            reviveUsed={reviveUsed}
            setReviveUsed={setReviveUsed}
            setTrapSaved={setTrapSaved}
          />
        </div>
      )}

      {/* Boss Overlay */}
      {showBoss && (
        <div className="fixed inset-0 flex justify-center items-center bg-cover z-50"
          style={{ backgroundImage: "url('/Pixel Art/Tiles/Dungeon Tile.png')" }}
        >
          <Boss
            character={character}
            setCharacter={setCharacter}
            currentItems={currentItems}
            setCurrentItems={setCurrentItems}
            favoritedItem={favoritedItem}
            setFavoritedItem={setFavoritedItem}
            spells={spells}
            setSpells={setSpells}
            setCoins={setCoins}
            floor={floor}
            setFloor={setFloor}
            onClose={() => setShowBoss(false)}
            onDeath={() => {
              setShowEnemy(false);
              setShowEnding(true);
            }}
            onClear={() => {
              setShowEnemy(false);
              setShowEnding(true);
            }}
            reviveUsed={reviveUsed}
            setReviveUsed={setReviveUsed}
            setTrapSaved={setTrapSaved}
          />
        </div>
      )}

      {/* Library Overlay */}
      {showLibrary && (
        <div className="fixed inset-0 flex justify-center items-center bg-cover z-50"
          style={{ backgroundImage: "url('/Pixel Art/Tiles/Dungeon Tile.png')" }}
        >
          <Library
            spells={spells}
            setSpells={setSpells}
            onClose={() => setShowLibrary(false)}
            floor={floor}
            onOpenSpellBook={() => setShowSpellBook(true)}
          />
        </div>
      )}

      {/* Spell Book Overlay */}
      {showSpellBook && (
        <SpellBook
            spells={spells}
            setSpells={setSpells}
            onClose={() => setShowSpellBook(false)}
        />
      )}

      {/* Ending Overlay */}
      {showEnding && (
        <EndingScreen
          character={character}
          coins={coins}
          currentItems={currentItems}
          spells={spells}
          floor={floor}
        />
      )}

      {/* Druid Overlay */}
      {showDruid && (
        <div className="fixed inset-0 flex justify-center items-center bg-cover z-50"
          style={{ backgroundImage: "url('/Pixel Art/Tiles/Dungeon Tile.png')" }}
        >
          <Druid
            character={character}
            setCharacter={setCharacter}
            onClose={() => setShowDruid(false)}
            onOpenCharacter={() => setShowCharacter(true)}
          />
        </div>  
      )}

      {/* Rest Overlay */}
      {showRest && (
        <div className="fixed inset-0 flex justify-center items-center bg-cover z-50"
          style={{ backgroundImage: "url('/Pixel Art/Tiles/Dungeon Tile.png')" }}
        >
          <Rest
            character={character}
            setCharacter={setCharacter}
            onClose={() => setShowRest(false)}
          />
        </div>  
      )}

      {/* Trap Overlay */}
      {showTrap && (
        <div className="fixed inset-0 flex justify-center items-center bg-cover z-50"
          style={{ backgroundImage: "url('/Pixel Art/Tiles/Dungeon Tile.png')" }}
        >
          <Trap
            character={character}
            setCharacter={setCharacter}
            coins={coins}
            setCoins={setCoins}
            currentItems={currentItems}
            setCurrentItems={setCurrentItems}
            spells={spells}
            setSpells={setSpells}
            floor={floor}
            reviveUsed={reviveUsed}
            setReviveUsed={setReviveUsed}
            onDeath={() => {
              setShowTrap(false);
              setShowEnding(true);
            }}
            onClose={() => setShowTrap(false)}
            trapSaved={trapSaved}
            setTrapSaved={setTrapSaved}
          />
        </div>  
      )}
    </div>
  );
}

export default Dashboard;                  