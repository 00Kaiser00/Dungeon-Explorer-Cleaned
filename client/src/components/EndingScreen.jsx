import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function EndingScreen({ character, coins, currentItems, spells, floor }) {
  const navigate = useNavigate();
  const [finalFloor, setFinalFloor] = useState(false);

  useEffect(() => {
    if (floor === 8) {
      setFinalFloor(true);
    }
  }, [floor]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-cover bg-center"
    style={{
        backgroundImage: "url('/Pixel Art/Tiles/Dungeon Tile.png')",
    }}>
      <div
        className="
          relative w-[600px] max-w-[90%] h-[600px] 
          p-8 border-4 border-yellow-300 rounded-2xl shadow-2xl 
          text-white bg-no-repeat bg-center
          flex flex-col overflow-y-auto scrollbar-hide
        "
        style={{
          backgroundImage: "url('/Pixel Art/Misc/Ending.png')",
          backgroundSize: "100% 100%",
        }}
      >
        {/* Title */}
        {finalFloor ? (
          <h1 className="text-5xl font-extrabold mb-6 text-yellow-300 drop-shadow-lg">
            You Cleared the Dungeon!
          </h1>
        ) : (
          <h1 className="text-5xl font-extrabold mb-6 text-yellow-300 drop-shadow-lg">
            You Died.
          </h1>
        )}

        {/* Stats Section */}
        <div className="space-y-2 text-2xl text-center">
          <p>
            Floor: <span className="font-bold text-yellow-300">{floor}</span>
          </p>
        </div>

        {/* Character Stats */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-lg bg-black/40 p-4 rounded-lg border border-yellow-300/40">
          <div className="flex items-center mb-2">
              <img src="/Pixel Art/Misc/Heart.png" alt="Heart" className="h-12 w-12" />
              <p className="font-bold">Max Health: {character.maxHealth}</p>
          </div>

          <div className="flex items-center mb-2">
              <img src="/Pixel Art/Misc/Blue Star.png" alt="Mana" className="h-12 w-12" />
              <p className="font-bold">Max Mana: {character.maxMana}</p>
          </div>

          <div className="flex items-center mb-2">
              <img src="/Pixel Art/Misc/Damage.png" alt="Attack" className="h-12 w-12" />
              <p className="font-bold">Attack: {character.attack}</p>
          </div>

          <div className="flex items-center mb-2">
              <img src="/Pixel Art/Misc/Magic Attack.png" alt="Magic Attack" className="h-12 w-12" />
              <p className="font-bold">Magic Attack: {character.magic}</p>
          </div>

          <div className="flex items-center mb-2">
              <img src="/Pixel Art/Shield/Shield.png" alt="Defense" className="h-12 w-12" />
              <p className="font-bold">Defense: {character.defense}</p>
          </div>

          <div className="flex items-center mb-2">
              <img src="/Pixel Art/Misc/Coin.png.png" alt="Coin" className="h-12 w-12" />
              <p className="font-bold">Coins: {coins}</p>
          </div>
        </div>

        {/* Character Image 
        <img
          src={character.img}
          alt="Character"
          className="w-32 h-32 mx-auto my-4 drop-shadow-lg"
        />
        */}

        {/* Inventory Sections */}
        <div className="grid grid-cols-2 gap-4 mt-4">

          {/* Spells */}
          <div className="bg-black/50 p-4 rounded-lg border border-yellow-300/40 max-h-40 overflow-y-auto scrollbar-hide">
            <h2 className="text-2xl font-bold text-yellow-300 mb-2">Spells</h2>
            <ul className="text-sm space-y-1">
              {spells.length > 0 ? (
                spells.map((spell, index) => (
                  <li key={index}>{spell.name}</li>
                ))
              ) : (
                <li className="italic opacity-60">No spells learned.</li>
              )}
            </ul>
          </div>

          {/* Items */}
          <div className="bg-black/50 p-4 rounded-lg border border-yellow-300/40 max-h-40 overflow-y-auto scrollbar-hide">
            <h2 className="text-2xl font-bold text-yellow-300 mb-2">Items</h2>
            <ul className="text-sm space-y-1">
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <li key={index}>{item.name}</li>
                ))
              ) : (
                <li className="italic opacity-60">No items acquired.</li>
              )}
            </ul>
          </div>

        </div>

        {/* Restart Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="w-64 h-20 hover:scale-110 transition-transform select-none"
          >
            <div className="relative w-full h-full">
              <img
                src="/Pixel Art/Misc/Rectangular Button.png"
                alt="Restart"
                className="w-full h-full"
              />
              <span
                className="absolute inset-0 flex items-center justify-center
                          text-black font-extrabold text-2xl pointer-events-none"
              >
                Restart
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default EndingScreen;