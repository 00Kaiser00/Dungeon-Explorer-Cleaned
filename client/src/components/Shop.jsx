import { useState, useEffect } from "react";

function Shop({ coins, setCoins, currentItems, setCurrentItems, onClose, onOpenBackpack }) {
  const [items, setItems] = useState([]);
  const [isRerolled, setIsRerolled] = useState(false);

  useEffect(() => {
    fetch("/itemData.json")
      .then((res) => res.json())
      .then((data) => {
        const shuffled = [...data.items]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map((item) => ({
            ...item,
            id: Date.now() + Math.random(), // unique id for duplicates
          }));
        setItems(shuffled);
      })
      .catch((err) => console.error("Error loading item data:", err));
  }, []);

  const handlePurchase = (item) => {
    if (coins < item.cost) {
      alert("Not enough coins to purchase this item!");
      return;
    }

    if (currentItems.length >= 9) {
      alert("Your backpack is full! You can only carry 9 items. Sell an item first.");
      return; // Early exit, don't deduct coins or remove item
    }

    // SUCCESS → Deduct coins and add item
    const newCoins = coins - item.cost;
    setCoins(newCoins);
    setCurrentItems((prevItems) => [...prevItems, item]);

    // Update localStorage
    localStorage.setItem("coins", JSON.stringify(newCoins));
    localStorage.setItem(
      "currentItems",
      JSON.stringify([...currentItems, item])
    );

    // Remove item from the Shop
    const updatedItems = items.filter((i) => i.id !== item.id);
    setItems(updatedItems);
  };

  const handleReroll = () => {
    if (coins < 5) {
      alert("Not enough coins to re-roll!");
      return;
    }

    setIsRerolled(true);
    setCoins(coins - 5); // Deduct 5 coins

    fetch("/itemData.json")
      .then((res) => res.json())
      .then((data) => {
        const shuffled = [...data.items]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map((item) => ({
            ...item,
            id: Date.now() + Math.random(), // unique id for duplicates
          }));
        setItems(shuffled);
      })
      .catch((err) => console.error("Error loading item data:", err))
      .finally(() => setIsRerolled(false)); // Reset the isRerolled state variable after fetching
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Shop Window */}
      <div
        className="relative w-[600px] h-[450px] p-6 border-4 border-yellow-300 rounded-lg shadow-2xl text-white text-center bg-no-repeat bg-center"
        style={{
          backgroundImage: "url('/Pixel Art/Misc/Shop BG.png')",
          backgroundSize: "100% 100%",
        }}
      >
        {/* Shop Title */}
        <p className="text-4xl font-bold mb-2 text-white drop-shadow-lg">Shop</p>
        <hr className="border-white mb-4 opacity-70" />

        {/* Coins */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <img src="/Pixel Art/Misc/Coin.png.png" alt="Coin" className="h-10 w-10" />
          <p className="text-white font-bold text-lg">x {coins}</p>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-3 gap-6 justify-items-center mt-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col items-center cursor-pointer"
            >
              {/* Item image */}
              <img
                src={item.img}
                alt={item.name}
                className="h-24 w-24 border-2 border-white rounded-md group-hover:scale-110 group-hover:shadow-lg transition-transform duration-200 ease-out"
                onClick={() => handlePurchase(item)}
              />

              {/* Tooltip */}
              <div className="absolute -top-28 left-1/2 transform -translate-x-1/2 hidden group-hover:flex flex-col items-center bg-black bg-opacity-90 text-white text-sm border border-white rounded p-2 w-44 z-10 shadow-md">
                <p className="font-bold text-yellow-300">{item.name}</p>
                <p className="text-gray-300 italic">{item.effect}</p>
                <p className="text-yellow-400 mt-1">Cost: {item.cost} Gold</p>
              </div>
            </div>
          ))}
        </div>

        {/*Re-roll button*/}
        <div className="absolute bottom-24 right-4">
          <button
          onClick={handleReroll}
          className="px-4 py-2 hover:scale-110 transition-transform"
        >
          <img src="/Pixel Art/Misc/Re-Roll Button.png" alt="Reroll" className="h-16 w-16" />
        </button>
        <p className="text-yellow-400 text-sm">Cost: 5 Gold</p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute bottom-2 right-2 hover:scale-110 transition-transform"
        >
          <img
            src="/Pixel Art/Misc/Rectangular Button.png"
            alt="Leave Shop"
            className="h-32 w-32"
          />

          <span className="absolute inset-0 flex items-center justify-center text-black font-bold text-lg pointer-events-none">
            Leave Shop
          </span>
        </button>

        {/* Backpack button */}
        <button
          onClick={onOpenBackpack}
          className="absolute bottom-4 left-4 hover:scale-110 transition-transform"
        >
          <img src="/Pixel Art/Misc/Backpack.png.png" alt="Backpack" className="h-20 w-20" />
        </button>

      </div>
    </div>
  );
}

export default Shop;
