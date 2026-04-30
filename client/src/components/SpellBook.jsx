import { useState } from "react";
import DisplayItemInformation from "./DisplayItemInformation";

function SpellBook({ spells, setSpells, onClose }) {
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [chosenSpellIndex, setChosenSpellIndex] = useState(null);

  const rarityColors = {
    dull: "text-gray-400",
    common: "text-white",
    uncommon: "text-green-400",
    rare: "text-blue-500",
    epic: "text-purple-400",
    legendary: "text-orange-400",
  };

  const elementColors = {
    fire: "text-red-500",
    water: "text-blue-400",
    wind: "text-green-400",
    earth: "text-brown-400",
    light: "text-white",
    dark: "text-purple-600",
    lightning: "text-yellow-300",
    ice: "text-cyan-400",
  };

  const handleForgetSpell = (index) => {
    const updated = [...spells];
    updated.splice(index, 1);
    setSpells(updated);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-cover z-[100]"
    style={{ backgroundImage: "url('/Pixel Art/Tiles/Dungeon Tile.png')" }}
    >
      <div
        className="relative border-2 border-black rounded-xl shadow-2xl w-[700px] h-[512px] p-6
                   bg-no-repeat bg-center backdrop-blur-sm flex flex-col bg-opacity-60"
        style={{ backgroundImage: "url('/Pixel Art/Misc/Spell Book.png')",
            backgroundSize: "100% 100%",
         }}
      >
        {/* Title */}
        <h1 className="font-bold text-3xl text-yellow-300 text-center mb-4 mt-4">
          Spell Book
        </h1>

        {/* Scrollable Spells List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-hide">
          {spells.length === 0 && (
            <p className="text-center text-gray-500 italic mt-10">
              You haven't learned any spells yet.
            </p>
          )}

          {spells.map((spell, index) => (
            <div
              key={spell.id || index}
              draggable
              onDragStart={() => setChosenSpellIndex(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (chosenSpellIndex === null || chosenSpellIndex === index) return;
                const updated = [...spells];
                const dragged = updated[chosenSpellIndex];
                updated.splice(chosenSpellIndex, 1);
                updated.splice(index, 0, dragged);
                setSpells(updated);
                setChosenSpellIndex(null);
              }}
              onClick={() => setSelectedSpell({ ...spell, index })} // <<< NEW
              className="flex items-center bg-black/60 border border-black rounded-lg p-3
                         hover:bg-black/80 transition-all shadow-md cursor-pointer"
            >
              <img src={spell.img} alt={spell.name} className="w-20 h-20 mr-3 drop-shadow-lg" />

              <div className="flex flex-col text-white">
                <span
                  className={`font-bold text-lg ${
                    rarityColors[spell.rarity.toLowerCase()] || "text-white"
                  }`}
                >
                  {spell.name}
                </span>

                {spell.spellElement && (
                  <span
                    className={`text-sm ${
                      elementColors[spell.spellElement.toLowerCase()] || "text-gray-300"
                    }`}
                  >
                    {spell.spellElement.charAt(0).toUpperCase() +
                      spell.spellElement.slice(1)}{" "}
                    Spell
                  </span>
                )}

                <span className="text-sm opacity-90">{spell.description}</span>

                <span className="text-sm mt-1">
                  <span className="text-blue-300 font-medium">Damage:</span>{" "}
                  {spell.minDamage} - {spell.maxDamage}
                </span>

                <span className="text-sm">
                  <span className="text-blue-300 font-medium">Mana Cost:</span>{" "}
                  {spell.manaCost}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <div className="mt-0 flex justify-center">
          <button
            onClick={onClose}
            className="text-black px-6 py-2 hover:scale-110 transition-transform relative"
          >
            <img src="/Pixel Art/Misc/Rectangular Button.png" alt="Leave Backpack" className="h-32 w-50" /> 
            <span className="absolute inset-0 flex items-center justify-center text-black font-bold text-lg pointer-events-none"> 
              Leave Spell Book
            </span> 
          </button>
        </div>
      </div>

      {/* DisplayItemInformation Popup */}
      {selectedSpell && (
        <DisplayItemInformation
          item={selectedSpell}
          onClose={() => setSelectedSpell(null)}
          onForget={() => {
            handleForgetSpell(selectedSpell.index);
            setSelectedSpell(null);
          }}
        />
      )}
    </div>
  );
}

export default SpellBook;