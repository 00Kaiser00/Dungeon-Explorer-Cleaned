import { useState, useEffect, useRef } from "react";
import applyEnchantment from "../functions/applyEnchantments";
import ItemTooltip from "./itemTooltips";

function Treasure({
  currentItems,
  setCurrentItems,
  coins,
  setCoins,
  onClose,
  floor,
  onOpenBackpack,
}) {
  const [item, setItem] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const hasFetched = useRef(false);

  // Rarity odds
  const getRarityOdds = (floor) => {
    if (floor === 1) {
      return {
        dull: 0.0,
        common: 0.7,
        uncommon: 0.25,
        rare: 0.05,
        epic: 0.0,
        legendary: 0.0
      };
    } else if (floor <= 3) {
      return {
        dull: 0.25,
        common: 0.35,
        uncommon: 0.25,
        rare: 0.1,
        epic: 0.03,
        legendary: 0.02
      };
    } else if (floor <= 5) {
      return {
        dull: 0.15,
        common: 0.25,
        uncommon: 0.25,
        rare: 0.2,
        epic: 0.1,
        legendary: 0.05
      };
    } else {
      return {
        dull: 0.05,
        common: 0.15,
        uncommon: 0.25,
        rare: 0.25,
        epic: 0.15,
        legendary: 0.15
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

  // Load treasure item on open
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const loadData = async () => {
      try {
        const [weaponRes, enchantRes] = await Promise.all([
          fetch("/weaponData.json"),
          fetch("/weaponEnchantments.json"),
        ]);

        const weaponData = await weaponRes.json();
        const enchantData = await enchantRes.json();

        const odds = getRarityOdds(floor);
        const chosenRarity = chooseRarity(odds);

        const possibleWeapons = weaponData.weapons.filter(
          (w) => w.rarity.toLowerCase() === chosenRarity
        );

        if (possibleWeapons.length > 0) {
          const randomWeapon =
            possibleWeapons[Math.floor(Math.random() * possibleWeapons.length)];

          let finalWeapon = {
            ...randomWeapon,
            id: Date.now() + Math.random(),
          };

          // 10% enchant chance
          if (
            randomWeapon.weaponType !== "Shield" &&
            Math.random() < 0.1 &&
            !["dull", "special"].includes(chosenRarity)
          ) {
            const rarityMatch = enchantData.enchantments.filter(
              (e) => e.rarity.toLowerCase() === chosenRarity.toLowerCase()
            );

            if (rarityMatch.length > 0) {
              const randomEnchant =
                rarityMatch[Math.floor(Math.random() * rarityMatch.length)];
              finalWeapon = applyEnchantment(finalWeapon, randomEnchant);
            }
          }

          setItem(finalWeapon);
        }
      } catch (err) {
        console.error("Error loading treasure:", err);
      }
    };

    loadData();
  }, [floor]);

  // Handle user clicking "Take Weapon"
  const attemptPickup = () => {
    if (!item) return;

    // classification helpers
    const isWeapon = item.weaponType && item.weaponType !== "Shield";
    const isShield = item.weaponType === "Shield";

    const currentWeapons = currentItems.filter(i => i.weaponType && i.weaponType !== "Shield");
    const currentShields = currentItems.filter(i => i.weaponType === "Shield");

    // Backpack space check
    if (currentItems.length >= 9) {
      setErrorMessage("Your backpack is full (9 items max).");
      return;
    }

    // ----------------------------
    // WEAPON LIMIT (3 max)
    // ----------------------------
    if (isWeapon && currentWeapons.length >= 3) {
      setErrorMessage("You can only carry 3 weapons at a time.");
      return;
    }

    // ----------------------------
    // SHIELD LIMIT (1 max)
    // ----------------------------
    if (isShield && currentShields.length >= 1) {
      setErrorMessage("You can only carry one shield at a time — sell the old one first.");
      return;
    }

    // SUCCESS → Add item
    setCurrentItems([...currentItems, item]);
    setShowConfirm(false);
    setErrorMessage(null);
    setItem(null);
  };

  // Sell Item
  const handleSellItem = (item) => {
    let sellPrice = 0;

    if (!item.cost) {
      const rarityValues = {
        Dull: 1,
        Common: 3,
        Uncommon: 5,
        Rare: 7,
        Epic: 10,
        Legendary: 15,
        Special: 15,
      };

      sellPrice = rarityValues[item.rarity] || 1;
    } else {
      const rawSell = item.cost / 2;
      const decimal = rawSell - Math.floor(rawSell);
      sellPrice = decimal >= 0.5 ? Math.ceil(rawSell) : Math.floor(rawSell);
    }
    setCoins(coins + sellPrice);

    alert(`You sold ${item.name} for ${sellPrice} gold!`);
    setShowConfirm(false);
    setErrorMessage(null);
    setItem(null);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="relative w-[600px] h-[450px] p-6 border-4 border-yellow-300 rounded-lg shadow-2xl text-white text-center bg-no-repeat bg-center"
        style={{
          backgroundImage: "url('/Pixel Art/Misc/Treasure BG.png')",
          backgroundSize: "100% 100%",
        }}
      >
        {item ? (
          <>
            <h2 className="text-3xl text-yellow-300 font-bold mb-6">
              You found a {item.name}!
            </h2>

            {/* Click weapon to open confirm popup */}
            <div className="relative group flex flex-col items-center justify-center mt-16">
              <ItemTooltip item={item}>
                <img
                  src={item.img}
                  alt={item.name}
                  onClick={() => {
                    const isWeapon = item.weaponType && item.weaponType !== "Shield";
                    const isShield = item.weaponType === "Shield";

                    const currentWeapons = currentItems.filter(i => i.weaponType && i.weaponType !== "Shield");
                    const currentShields = currentItems.filter(i => i.weaponType === "Shield");

                    if (isWeapon && currentWeapons.length >= 3) {
                      setErrorMessage("Your backpack is full — open the backpack to sell a weapon.");
                      setShowConfirm(true);
                      return;
                    }

                    if (isShield && currentShields.length >= 1) {
                      setErrorMessage("You can only carry one shield — open the backpack to sell your current one.");
                      setShowConfirm(true);
                      return;
                    }

                    setErrorMessage(null);
                    setShowConfirm(true);
                  }}
                  className="h-24 w-24 border-2 border-white rounded-md cursor-pointer transition-transform hover:scale-110"
                />
              </ItemTooltip>
              <p className="mt-2 text-gray-300">Click to inspect & pick up</p>
            </div>

            {/* Backpack Button */}
            <button
              onClick={onOpenBackpack}
              className="absolute bottom-4 left-4 hover:scale-110 transition-transform"
            >
              <img
                src="/Pixel Art/Misc/Backpack.png.png"
                alt="Backpack"
                className="h-20 w-20"
              />
            </button>
          </>
        ) : (
          <p>Treasure Room is empty</p>
        )}

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute bottom-4 right-4
                    w-62 h-20
                    hover:scale-110 transition-transform select-none"
        >
          <div className="relative w-full h-full">
            <img
              src="/Pixel Art/Misc/Rectangular Button.png"
              alt="Leave Treasure Room"
              className="w-full h-full"
            />

            <span
              className="absolute inset-0 flex items-center justify-center
                        text-black font-bold text-lg
                        pointer-events-none"
            >
              Leave Treasure Room
            </span>
          </div>
        </button>

        {/* ------------------------------- */}
        {/* CONFIRMATION POPUP */}
        {/* ------------------------------- */}
        {showConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[60]">
            <div className="bg-gray-900 border-2 border-yellow-400 p-6 rounded-lg text-center w-80">
              <h3 className="text-xl font-bold mb-4">
                Take {item?.name}?
              </h3>

              {errorMessage && (
                <p className="text-red-400 mb-4">{errorMessage}</p>
              )}

              <div className="flex justify-center gap-4 mt-6 flex-wrap">
                {/* YES - Green */}
                <button
                  onClick={attemptPickup}
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

                {/* SELL - Yellow */}
                <button
                  onClick={() => handleSellItem(item)}
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

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Treasure;