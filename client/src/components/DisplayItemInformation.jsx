import React from "react";

function DisplayItemInformation({
  item,
  onClose,
  onUse,
  onSell,
  onForget,
}) {
  if (!item) return null;
  const isUsable = item.cost && item.type !== "Combat";

  // -----------------------------
  // Rarity colors
  // -----------------------------
  const rarityColors = {
    dull: "text-gray-400",
    common: "text-white",
    uncommon: "text-green-400",
    rare: "text-blue-500",
    epic: "text-purple-400",
    legendary: "text-orange-400",
    special:
      "bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 bg-clip-text text-transparent font-bold",
  };

  // -----------------------------
  // Element colors
  // -----------------------------
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

  const rarityClass = rarityColors[item.rarity?.toLowerCase()] || "text-white";

  const elementClass = item.spellElement
    ? elementColors[item.spellElement.toLowerCase()]
    : item.element
    ? elementColors[item.element.toLowerCase()]
    : "";

  const isSpell = item.spellElement && item.minDamage !== undefined;
  const isShield = item.weaponType === "Shield";

  // -----------------------------
  // Sell values (for weapons)
  // -----------------------------
  const weaponSellValues = {
    Dull: 1,
    Common: 3,
    Uncommon: 5,
    Rare: 7,
    Epic: 10,
    Legendary: 15,
    Special: 15,
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[999] p-4">
      <div className="bg-gray-900 border-2 border-yellow-500 rounded-xl p-6 w-[320px] text-center shadow-xl">
        {/* Name */}
        <p className={`font-bold text-xl mb-2 ${rarityClass}`}>{item.name}</p>

        {/* Image */}
        <div className="mb-2 mt-2 border border-gray-700">
          <img src={item.img} alt={item.name} className="w-16 h-16 mx-auto mb-2" />
        </div>

        {/* Elemental / Spell Info */}
        {item.element && !isSpell && (
          <>
            <p className={`${elementClass} font-bold`}>Element: {item.element}</p>
            <p className="text-gray-300 text-xs italic mt-1">{item.description}</p>
          </>
        )}

        {isSpell && (
          <>
            <p className={`${elementClass} font-bold`}>
              {item.spellElement} Spell
            </p>
            <p className="text-gray-200 mt-1">
              Damage: {item.minDamage} - {item.maxDamage}
            </p>
            <p className="text-gray-200 mt-1">Mana Cost: {item.manaCost}</p>
            <p className="text-gray-300 text-xs italic">Rarity: {item.rarity}</p>
          </>
        )}

        {/* Potions / simple usable items */}
        {item.cost && !isSpell && !item.element && !item.minDamage && (
          <>
            <p className="italic text-gray-300">{item.effect}</p>

            {item.type === "Normal" && (
              <p className="text-green-400 mt-1">
                Sell Price:{" "}
                {Math.round(item.cost / 2) === item.cost / 2
                  ? item.cost / 2
                  : Math.ceil(item.cost / 2)}
              </p>
            )}
          </>
        )}

        {/* Shields */}
        {isShield && (
          <>
            {/* Damage Reduction */}
            <p className="text-green-600">Damage Reduction: %{item.damageReduction * 100}</p>

            <p className="text-gray-300">Cooldown: {item.defenseCooldown}</p>
            <p className="text-gray-300 text-xs italic">Rarity: {item.rarity}</p>
            <p className="text-green-400 mt-1">
              Sell Price: {weaponSellValues[item.rarity] || 1}
            </p>
          </>
        )}

        {/* Weapons (non-spell) */}
        {!item.cost && item.minDamage !== undefined && !isSpell && !item.element && item.weaponType !== "Shield" && (
          <>
            <p className="text-red-400">
              Damage: {item.minDamage} - {item.maxDamage}
            </p>

            {item.attackCooldown && (
              <p className="text-gray-300">Cooldown: {item.attackCooldown}</p>
            )}

            <p className="text-gray-300">Rarity: {item.rarity}</p>

            {item.enchantment && (
              <>
                <p className="text-blue-400 mt-1">✨ {item.enchantment.name}</p>
                <p className="text-gray-400 text-xs italic">
                  {item.enchantment.description}
                </p>
              </>
            )}

            <p className="text-green-400 mt-1">
              Sell Price: {weaponSellValues[item.rarity] || 1}
            </p>
          </>
        )}

        {/* -----------------------------
            Pixel Buttons
        ----------------------------- */}
        <div className="mt-6 flex justify-center gap-4 flex-wrap">

          {/* SPELL BUTTONS */}
          {isSpell && (
            <>
              {/* Forget - Red */}
              <button
                onClick={onForget}
                className="w-28 h-14 hover:scale-110 transition-transform select-none"
              >
                <div className="relative w-full h-full">
                  <img
                    src="/Pixel Art/Misc/Red Rectangular Button.png"
                    alt="Forget"
                    className="w-full h-full"
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-black font-bold pointer-events-none">
                    Forget
                  </span>
                </div>
              </button>

              {/* Cancel - Gray */}
              <button
                onClick={onClose}
                className="w-28 h-14 hover:scale-110 transition-transform select-none"
              >
                <div className="relative w-full h-full">
                  <img
                    src="/Pixel Art/Misc/Gray Rectangular Button.png"
                    alt="Cancel"
                    className="w-full h-full"
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-black font-bold pointer-events-none">
                    Cancel
                  </span>
                </div>
              </button>
            </>
          )}

          {/* NORMAL ITEM BUTTONS */}
          {!isSpell && (
            <>
              {/* Use - Green (or Gray if disabled) */}
              <button
                onClick={onUse}
                disabled={!isUsable}
                className={`w-28 h-14 transition-transform select-none ${
                  isUsable ? "hover:scale-110" : "opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="relative w-full h-full">
                  <img
                    src={
                      isUsable
                        ? "/Pixel Art/Misc/Green Rectangular Button.png"
                        : "/Pixel Art/Misc/Gray Rectangular Button.png"
                    }
                    alt="Use"
                    className="w-full h-full"
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-black font-bold pointer-events-none">
                    Use
                  </span>
                </div>
              </button>

              {/* Sell - Yellow */}
              <button
                onClick={onSell}
                className="w-28 h-14 hover:scale-110 transition-transform select-none"
              >
                <div className="relative w-full h-full">
                  <img
                    src="/Pixel Art/Misc/Yellow Rectangular Button.png"
                    alt="Sell"
                    className="w-full h-full"
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-black font-bold pointer-events-none">
                    Sell
                  </span>
                </div>
              </button>

              {/* Cancel - Red */}
              <button
                onClick={onClose}
                className="w-28 h-14 hover:scale-110 transition-transform select-none"
              >
                <div className="relative w-full h-full">
                  <img
                    src="/Pixel Art/Misc/Red Rectangular Button.png"
                    alt="Cancel"
                    className="w-full h-full"
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-black font-bold pointer-events-none">
                    Cancel
                  </span>
                </div>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DisplayItemInformation;