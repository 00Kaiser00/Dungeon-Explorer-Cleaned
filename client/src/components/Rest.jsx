import { useEffect } from "react";

function Rest ({ character, setCharacter, onClose }) {

    useEffect(() => {
        setCharacter({...character, health: character.maxHealth, mana: character.maxMana,});
        //console.log("You have rested and recovered.");
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
                className="relative w-[600px] h-[450px] p-6 border-4 border-yellow-300 rounded-lg shadow-2xl text-white text-center bg-no-repeat bg-center"
                style={{
                backgroundImage: "url('/Pixel Art/Tiles/Forest.png')",
                backgroundSize: "100% 100%",
                }}
            >
                <h1 className="text-3xl font-bold mt-32 text-yellow-200">You have rested and recovered.</h1>

                {/* CLOSE */}
                <button
                onClick={onClose}
                className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-4 py-2 border-2 border-white rounded hover:bg-blue-300 hover:text-black transition"
                >
                Leave The Forest
                </button>
            </div>
        </div>
    )
}

export default Rest;