import { useState, useEffect } from "react";
import ItemTooltip from "./itemTooltips";
import useItemActions from "../functions/useItems";

function Druid({ character, setCharacter, onClose, onOpenCharacter }) {
  const [items, setItems] = useState([]);
  const [druidUsed, setDruidUsed] = useState(false);

  useEffect(() => {
    fetch("./druidItemData.json")
      .then((response) => response.json())
      .then((data) => {
        setItems(data.druid_items);
      })
      .catch((err) => {
        console.error("Error loading item data:", err);
      });
  }, []);

    const { useItem } = useItemActions({
    character,
    setCharacter,
    currentItems: items,
    setCurrentItems: setItems,
    favoritedItem: null,
    setFavoritedItem: () => {},
    setTrapSaved: () => {},
    });

  const handleDruidItemUse = (index) => {
    if (druidUsed) return;

    useItem(index);      // applies effect + removes clicked item
    setItems([]);        // removes ALL other items
    setDruidUsed(true);  // locks the choice
    };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
            className="relative w-[600px] h-[450px] p-6 border-4 border-yellow-300 rounded-lg shadow-2xl text-white text-center bg-no-repeat bg-center"
            style={{
            backgroundImage: "url('/Pixel Art/Tiles/Forest.png')",
            backgroundSize: "100% 100%",
            }}
        >

        <h1 className="text-3xl font-bold mt-2 text-yellow-300">You have encountered a choice, will you change your form?</h1>

        {/* Items Grid */}
        <div className="grid grid-cols-4 gap-6 justify-items-center mt-10">
            {items.map((item, index) => (
            <div
                key={item.id}
                onClick={() => handleDruidItemUse(index)}
                className="group relative flex flex-col items-center cursor-pointer"
            >
                <ItemTooltip item={item} >
                    {/* Item image */}
                    <img
                        src={item.img}
                        alt={item.name}
                        className="h-24 w-24 border-2 border-white rounded-md group-hover:scale-110 group-hover:shadow-lg transition-transform duration-200 ease-out"
                    />
                </ItemTooltip>
            </div>
            ))}
        </div>

        {/* CLOSE */}
        <button
            onClick={onClose}
            className="absolute bottom-4 right-4
                        w-60 h-20
                        hover:scale-110 transition-transform select-none"
            >
            <div className="relative w-full h-full">
                <img
                src="/Pixel Art/Misc/Rectangular Button.png"
                alt="Leave The Forest"
                className="w-full h-full"
                />

                <span
                className="absolute inset-0 flex items-center justify-center
                            text-black font-bold text-lg
                            pointer-events-none"
                >
                Leave The Forest
                </span>
            </div>
        </button>

        {/* Character Button*/}
        <button
          onClick={() => onOpenCharacter()}
          className="absolute bottom-4 left-4 hover:scale-110 transition-transform"
        >
          <img src={character.img} alt="Character" className="h-20 w-20" />
        </button>
      </div>
    </div>
  );
}

export default Druid;