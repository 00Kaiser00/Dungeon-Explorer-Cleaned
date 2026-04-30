import { useState, useEffect, useRef } from "react";
import ItemTooltip from "./itemTooltips";

function Library({ spells, setSpells, onClose, floor, onOpenSpellBook }) {
  const [grimoire, setGrimoire] = useState(null);
  const [chosenSpell, setChosenSpell] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const hasFetched = useRef(false);

  // -----------------------------
  // RARITY SYSTEM
  // -----------------------------
  const getRarityOdds = (floor) => {
    if (floor === 1) {
      return {
        common: 0.7,
        uncommon: 0.25,
        rare: 0.05,
        epic: 0,
        legendary: 0,
      };
    } else if (floor <= 3) {
      return {
        common: 0.6,
        uncommon: 0.25,
        rare: 0.1,
        epic: 0.03,
        legendary: 0.02,
      };
    } else if (floor <= 5) {
      return {
        common: 0.4,
        uncommon: 0.25,
        rare: 0.2,
        epic: 0.1,
        legendary: 0.05,
      };
    } else {
      return {
        common: 0.2,
        uncommon: 0.25,
        rare: 0.25,
        epic: 0.15,
        legendary: 0.15,
      };
    }
  };

  const chooseRarity = (odds) => {
    const rand = Math.random();
    let cumulative = 0;

    for (const [rarity, chance] of Object.entries(odds)) {
      cumulative += chance;
      if (rand < cumulative) return rarity;
    }
    return "common";
  };

  // -----------------------------
  // LOAD GRIMOIRE + SPELL
  // -----------------------------
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const loadLibrary = async () => {
        try {
        const [grimoireRes, spellRes] = await Promise.all([
            fetch("/grimoireData.json"),
            fetch("/spellData.json"),
        ]);

        const grimoireData = await grimoireRes.json();
        const spellData = await spellRes.json();

        const allGrimoires = grimoireData.grimoires;
        const chosenGrimoire =
            allGrimoires[Math.floor(Math.random() * allGrimoires.length)];

        setGrimoire(chosenGrimoire);

        const odds = getRarityOdds(floor);
        const chosenRarity = chooseRarity(odds);

        const possibleSpells = spellData.spells.filter(
            (s) =>
            s.spellElement === chosenGrimoire.element &&
            s.rarity.toLowerCase() === chosenRarity.toLowerCase()
        );

        let finalSpell = null;

        if (possibleSpells.length > 0) {
            const selected = possibleSpells[Math.floor(Math.random() * possibleSpells.length)];
            // 🔥 Assign a unique id here
            finalSpell = { ...selected, id: Date.now() + Math.random() };
        }

        setChosenSpell(finalSpell);
        } catch (err) {
        console.error("Library loading error:", err);
        }
    };

    loadLibrary();
    }, [floor]);

  // -----------------------------
  // LEARN SPELL (limit 5)
  // -----------------------------
  const learnSpell = () => {
    if (!chosenSpell) return;

    if (spells.length >= 5) {
      setErrorMessage("Your spellbook is full — open the spellbook to forget a spell.");
      return;
    }

    setSpells([...spells, chosenSpell]);
    setShowConfirm(false);
    setErrorMessage(null);
    setGrimoire(null);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="relative w-[600px] h-[450px] p-6 border-2 border-black rounded-lg shadow-2xl text-white text-center bg-no-repeat bg-center"
        style={{
          backgroundImage: "url('/Pixel Art/Misc/Library.png')",
          backgroundSize: "100% 100%",
        }}
      >
        {grimoire ? (
          <>
            <h2 className="text-3xl font-bold mb-4">
              You found the{" "}
              <span className="text-yellow-300">{grimoire.name}</span>!
            </h2>

            {/* Grimoire Image */}
            <div className="flex flex-col items-center mt-10 group">
              <ItemTooltip item={grimoire}>
                <img
                  src={grimoire.img}
                  alt={grimoire.name}
                  onClick={() => {
                    // 🔥 Prevent opening confirm popup if spellbook is full
                    if (spells.length >= 5) {
                      setErrorMessage(
                        "Your spellbook is full — open the spellbook to forget a spell."
                      );
                      setShowConfirm(true);
                    } else {
                      setErrorMessage(null);
                      setShowConfirm(true);
                    }
                  }}
                  className="h-28 w-28 border-2 border-white rounded-md cursor-pointer hover:scale-110 transition-transform"
                />
              </ItemTooltip>

              <p className="text-gray-300 mt-2">Click to read Grimoire</p>
            </div>
          </>
        ) : (
          <p>Library is empty</p>
        )}

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute bottom-4 right-4
                    w-48 h-20
                    hover:scale-110 transition-transform select-none"
        >
          <div className="relative w-full h-full">
            <img
              src="/Pixel Art/Misc/Rectangular Button.png"
              alt="Leave Spell Book"
              className="w-full h-full"
            />

            <span
              className="absolute inset-0 flex items-center justify-center
                        text-black font-bold text-lg
                        pointer-events-none"
            >
              Leave Spell Book
            </span>
          </div>
        </button>

        {/* Spellbook Button */}
        <button
          onClick={() => onOpenSpellBook()}
          className="absolute bottom-4 left-4 hover:scale-110 transition-transform"
        >
          <img
            src="/Pixel Art/Misc/Open Book.png"
            alt="Spell Book"
            className="h-20 w-20"
          />
        </button>

        {/* CONFIRMATION POPUP */}
        {showConfirm && chosenSpell && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[60]">
            <div className="bg-gray-900 border-2 border-blue-400 p-6 rounded-lg text-center w-80">
              <h3 className="text-xl font-bold mb-4">
                Learn spell "{chosenSpell.name}"?
              </h3>

              {errorMessage && (
                <p className="text-red-400 mb-4">{errorMessage}</p>
              )}

              <ItemTooltip item={chosenSpell}>
                <img
                  src={chosenSpell.img}
                  alt={chosenSpell.name}
                  className="h-20 w-20 border-2 border-white rounded-md cursor-pointer hover:scale-110 transition-transform"
                />
              </ItemTooltip>

              <div className="flex justify-center gap-6 mt-6">
                {/* YES - Green */}
                <button
                  onClick={learnSpell}
                  className="w-28 h-14 hover:scale-110 transition-transform select-none"
                >
                  <div className="relative w-full h-full">
                    <img
                      src="/Pixel Art/Misc/Green Rectangular Button.png"
                      alt="Yes"
                      className="w-full h-full"
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-black font-bold pointer-events-none">
                      Yes
                    </span>
                  </div>
                </button>

                {/* NO - Red */}
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setErrorMessage(null);
                  }}
                  className="w-28 h-14 hover:scale-110 transition-transform select-none"
                >
                  <div className="relative w-full h-full">
                    <img
                      src="/Pixel Art/Misc/Red Rectangular Button.png"
                      alt="No"
                      className="w-full h-full"
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-black font-bold pointer-events-none">
                      No
                    </span>
                  </div>
                </button>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Library;