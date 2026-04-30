import { useState } from "react";

function Skills({ coins, setCoins, character, setCharacter, onClose }) {
  const [sessionPoints, setSessionPoints] = useState({
    maxHealth: 0,
    maxMana: 0,
    attack: 0,
    magic: 0,
    defense: 0,
  });

  const COST_PER_POINT = 5;

  const STAT_INCREASES = {
    maxHealth: 5,
    maxMana: 1,
    attack: 1,
    magic: 2,
    defense: 1,
  };

  const handleIncrease = (stat) => {
    if (coins >= COST_PER_POINT) {
        const newCoins = coins - COST_PER_POINT;

        const increase = STAT_INCREASES[stat];
        const updatedCharacter = { ...character };

        // Update stat
        updatedCharacter[stat] += increase;

        // If maxHealth or maxMana increased, raise health/mana by same amount
        if (stat === "maxHealth") {
        updatedCharacter.health = Math.min(
            updatedCharacter.health + increase,
            updatedCharacter.maxHealth
        );
        } else if (stat === "maxMana") {
        updatedCharacter.mana = Math.min(
            updatedCharacter.mana + increase,
            updatedCharacter.maxMana
        );
        }

        const updatedSession = {
        ...sessionPoints,
        [stat]: sessionPoints[stat] + increase,
        };

        setCoins(newCoins);
        setCharacter(updatedCharacter);
        setSessionPoints(updatedSession);

        localStorage.setItem("coins", JSON.stringify(newCoins));
        localStorage.setItem("character", JSON.stringify(updatedCharacter));
    } else {
        alert("Not enough coins!");
    }
    };

    const handleDecrease = (stat) => {
    if (sessionPoints[stat] > 0) {
        const newCoins = coins + COST_PER_POINT;
        const decrease = STAT_INCREASES[stat];

        const updatedCharacter = { ...character };

        updatedCharacter[stat] -= decrease;

        // If maxHealth or maxMana decreased, lower health/mana by same amount (but not below 1)
        if (stat === "maxHealth") {
        updatedCharacter.health = Math.max(
            1,
            Math.min(updatedCharacter.health - decrease, updatedCharacter.maxHealth)
        );
        } else if (stat === "maxMana") {
        updatedCharacter.mana = Math.max(
            0,
            Math.min(updatedCharacter.mana - decrease, updatedCharacter.maxMana)
        );
        }

        const updatedSession = {
        ...sessionPoints,
        [stat]: sessionPoints[stat] - decrease,
        };

        setCoins(newCoins);
        setCharacter(updatedCharacter);
        setSessionPoints(updatedSession);

        localStorage.setItem("coins", JSON.stringify(newCoins));
        localStorage.setItem("character", JSON.stringify(updatedCharacter));
    }
    };


  const filteredStats = Object.entries(character).filter(
    ([stat]) => stat !== "health" && stat !== "mana" && stat !== "img"
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="relative w-[600px] h-[460px] p-6 border-4 border-yellow-300 rounded-lg shadow-2xl text-white text-center bg-no-repeat bg-center"
        style={{
          backgroundImage: "url('/Pixel Art/Misc/Training Ground.png')",
          backgroundSize: "100% 100%",
        }}
      >

        <h1 className="font-bold text-3xl text-White mb-2">Skill Points</h1>
        <hr />
        <p className="font-bold text-2xl text-white mb-4">Coins: {coins}</p>

        {/* Only shows filtered stats */}
        {filteredStats.map(([stat, value]) => (
          <div key={stat} className="flex justify-center items-center gap-4 mb-2">
            <p className="font-bold text-2xl capitalize">
              {stat.replace("max", "Max ")}: {value}
              {sessionPoints[stat] > 0 && (
                <span className="text-green-700 ml-2 text-xl">
                  (+{sessionPoints[stat]})
                </span>
              )}
            </p>

            {/* Minus Button */}
            <button
              onClick={() => handleDecrease(stat)}
              disabled={sessionPoints[stat] <= 0}
              className="w-12 h-12 hover:scale-110 transition-transform disabled:cursor-not-allowed"
            >
              <img
                src={
                  sessionPoints[stat] > 0
                    ? "/Pixel Art/Misc/Red Minus Button.png"
                    : "/Pixel Art/Misc/Gray Minus Button.png"
                }
                alt="Decrease"
                className="w-full h-full"
              />
            </button>

            {/* Plus Button */}
            <button
              onClick={() => handleIncrease(stat)}
              disabled={coins < COST_PER_POINT}
              className="w-12 h-12 hover:scale-110 transition-transform disabled:cursor-not-allowed"
            >
              <img
                src="/Pixel Art/Misc/Plus Button.png"
                alt="Increase"
                className="w-full h-full"
              />
            </button>
          </div>
        ))}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute bottom-0 right-4
                    w-60 h-20
                    hover:scale-110 transition-transform select-none"
        >
          <div className="relative w-full h-full">
            <img
              src="/Pixel Art/Misc/Rectangular Button.png"
              alt="Leave Training Room"
              className="w-full h-full"
            />

            <span
              className="absolute inset-0 flex items-center justify-center
                        text-black font-bold text-lg
                        pointer-events-none"
            >
              Leave Training Room
            </span>
          </div>
        </button>

      </div>
    </div>
  );
}

export default Skills;