import { useState } from "react";
import useItemActions from "../functions/useItems";
import DisplayItemInformation from "./DisplayItemInformation";

function Backpack({
  currentItems,
  setCurrentItems,
  favoritedItem,
  setFavoritedItem,
  character,
  setCharacter,
  coins,
  setCoins,
  onClose,
  setTrapSaved,
}) {
  const [confirmUse, setConfirmUse] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const { useItem } = useItemActions({
    character,
    setCharacter,
    currentItems,
    setCurrentItems,
    favoritedItem,
    setFavoritedItem,
    setTrapSaved,
  });

  // -----------------------------
  // Confirm
  // -----------------------------
  const handleItemClick = (index) => {
    setSelectedItem({ ...currentItems[index], index });
  };

  // -----------------------------
  // Sell
  // -----------------------------
  const handleSellItem = (index) => {
    const item = currentItems[index];
    let sellPrice = 0;

    const weapons = currentItems.filter(i => i.weaponType && i.weaponType !== "Shield");
    const shields = currentItems.filter(i => i.weaponType === "Shield");

    const isWeapon = item.weaponType && item.weaponType !== "Shield";
    const isShield = item.weaponType === "Shield";
    const isConsumable = item.cost !== undefined;

    // -----------------------------
    // Prevent selling last weapon
    // -----------------------------
    if (isWeapon && weapons.length <= 1) {
        alert("You must keep at least one weapon!");
        return;
    }

    // -----------------------------
    // Price calculation
    // -----------------------------
    if (isConsumable) {
        const rawSell = item.cost / 2;
        sellPrice = rawSell - Math.floor(rawSell) >= 0.5
        ? Math.ceil(rawSell)
        : Math.floor(rawSell);

    } else {
        // weapons + shields with no cost use rarity
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
    }

    // -----------------------------
    // Remove item + add gold
    // -----------------------------
    const updatedItems = currentItems.filter((_, i) => i !== index);
    setCurrentItems(updatedItems);
    setCoins(coins + sellPrice);

    alert(`You sold ${item.name} for ${sellPrice} gold!`);
    };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-cover z-[100]"
      style={{ backgroundImage: "url('/Pixel Art/Tiles/Dungeon Tile.png')" }}
    >
      <div className="relative border-2 rounded border-black w-[700px] h-[512px] p-6 bg-no-repeat bg-center flex flex-col"
       style={{ backgroundImage: "url('/Pixel Art/Misc/Storage.png')",
        backgroundSize: "100% 100%",
        }}
      >
        <h1 className="font-bold text-3xl text-yellow-300 mb-2 text-center">
          Bag
        </h1>

        <hr className="text-white" />

        {/* Items List */}
        <div className="flex flex-col gap-2 mt-4 pr-2 flex-grow">
          <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-2 scrollbar-hide">
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => {
                const isFavorited = favoritedItem?.id === item.id;

                return (
                  <div
                    key={item.id || index}
                    className="flex items-center gap-4 bg-black/40 px-4 py-2 rounded hover:bg-black/60 cursor-move transition"
                    draggable
                    onDragStart={() => setDragIndex(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragIndex === null || dragIndex === index) return;
                      const updated = [...currentItems];
                      const draggedItem = updated[dragIndex];
                      updated.splice(dragIndex, 1);
                      updated.splice(index, 0, draggedItem);
                      setCurrentItems(updated);
                      setDragIndex(null);
                    }}
                    onClick={() => handleItemClick(index)}
                  >
                    <img src={item.img} alt={item.name} className="h-12 w-12" />
                    <div className="flex flex-col">
                      <p className="text-white text-lg">{item.name}</p>
                      {item.rarity && (
                        <p className="text-yellow-300 text-sm">{item.rarity}</p>
                      )}
                    </div>

                    {/* Favorite Button mapped per item */}
                    {item.cost && (
                      <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent confirm popup
                            if (isFavorited) {
                            setFavoritedItem(null);
                            } else {
                            setFavoritedItem(item);
                            }
                        }}
                        className="ml-auto text-white hover:text-yellow-300 transition"
                        >
                        {isFavorited ? <img src="/Pixel Art/Misc/Gold Star.png" alt="Gold Star" className="h-12 w-12" /> : <img src="/Pixel Art/Misc/Empty Star.png" alt="Star Outline" className="h-12 w-12" />}
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-white text-center">Backpack is empty</p>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button onClick={onClose} className="absolute bottom-10 left-1/2 -translate-x-1/2 relative hover:scale-110 transition-transform h-32 w-50" > 
          <img src="/Pixel Art/Misc/Rectangular Button.png" alt="Leave Backpack" className="h-32 w-50" /> 
          <span className="absolute inset-0 flex items-center justify-center text-black font-bold text-lg pointer-events-none"> 
            Leave Backpack
          </span> 
       </button>
      </div>

      <DisplayItemInformation
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onUse={() => {
            if (!selectedItem) return;
            useItem(selectedItem.index);
            setSelectedItem(null);
        }}
        onSell={() => {
            if (!selectedItem) return;
            handleSellItem(selectedItem.index);
            setSelectedItem(null);
        }}
      />
    </div>
  );
}

export default Backpack;