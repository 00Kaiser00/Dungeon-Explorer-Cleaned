import React from "react";

const ItemTooltip = ({ item, children }) => {
  if (!item) return null;

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
  // Element colors (weapons/spells/grimoires)
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

  const rarityClass =
    rarityColors[item.rarity?.toLowerCase()] || "text-white";

  const elementClass = item.spellElement
    ? elementColors[item.spellElement.toLowerCase()]
    : item.element
    ? elementColors[item.element.toLowerCase()]
    : "";

  // -----------------------------
  // Sell values (applies to weapons)
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

  // -----------------------------
  // Tooltip rendering
  // -----------------------------
  return (
    <div className="relative group inline-block">
      {children}

      <div
        className="
        absolute bottom-full mb-10 left-1/2 -translate-x-1/2 
        bg-black text-white text-sm p-3 rounded-md opacity-0 
        group-hover:opacity-100 transition duration-200 w-52 text-center 
        pointer-events-none shadow-lg border border-gray-700 z-50"
      >
        {/* Name */}
        <p className={`font-bold mb-1 ${rarityClass}`}>{item.name}</p>

        {/* =====================================================
            1. GRIMOIRE (usable)
           ===================================================== */}
        {item.element && item.description && !item.minDamage && (
          <>
            <p className={`${elementClass} font-bold`}>
              Element: {item.element}
            </p>
            <p className="text-gray-300 text-xs italic mt-1">
              {item.description}
            </p>
          </>
        )}

        {/* =====================================================
            2. SPELL (from spellsData.json)
           ===================================================== */}
        {item.spellElement && item.minDamage !== undefined && (
          <>
            <p className={`${elementClass} font-bold`}>
              {item.spellElement} Spell
            </p>
            <p className="text-gray-200 mt-1">
              Damage: {item.minDamage}-{item.maxDamage}
            </p>
            <p className="text-gray-200 mt-1"> 
              Mana Cost: {item.manaCost}
            </p>
            <p className="text-gray-300 text-xs italic">
              Rarity: {item.rarity}
            </p>
          </>
        )}

        {/* =====================================================
            3. POTIONS / SIMPLE USABLE ITEMS
           ===================================================== */}
        {item.cost && !item.minDamage && !item.element && !item.spellElement && (
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

        {/* =====================================================
            4. WEAPONS (old system)
           ===================================================== */}
        {!item.cost && item.weaponType != "Shield" &&
          item.minDamage !== undefined &&
          !item.spellElement &&
          !item.element && (
            <>
              <p className="text-red-400">
                Damage: {item.minDamage}-{item.maxDamage}
              </p>

              {/* Attack Cooldown */}
              {item.attackCooldown && (
                <p className="text-gray-300">
                  Cooldown: {item.attackCooldown}
                </p>
              )}

              {/* Rarity */}
              <p className="text-gray-300">Rarity: {item.rarity}</p>

              {/* Enchantment */}
              {item.enchantment && (
                <>
                  <p className="text-blue-400 mt-1">
                    ✨ {item.enchantment.name}
                  </p>
                  <p className="text-gray-400 text-xs italic">
                    {item.enchantment.description}
                  </p>
                </>
              )}

              {/* Sell price */}
              <p className="text-green-400 mt-1">
                Sell Price: {weaponSellValues[item.rarity] || 1}
              </p>
            </>
          )}

          {/* =====================================================
              5. Shields
            ===================================================== */}
          {!item.cost && item.weaponType === "Shield" && (
            <>
              {/* Damage Reduction */}
              <p className="text-green-600">
                Damage Reduction: {Math.round(item.damageReduction * 100)}%
              </p>

              {/* Defense Cooldown */}
              {item.defenseCooldown && (
                <p className="text-gray-300">
                  Cooldown: {item.defenseCooldown}
                </p>
              )}

              {/* Rarity */}
              <p className="text-gray-300">Rarity: {item.rarity}</p>

              {/* Sell price */}
              <p className="text-green-400 mt-1">
                Sell Price: {weaponSellValues[item.rarity] || 1}
              </p>
            </>
          )}

      </div>
    </div>
  );
};

export default ItemTooltip;