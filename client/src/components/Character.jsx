function Character ({ character, onClose }) {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-cover z-75"
        style={{
            backgroundImage: "url('/Pixel Art/Tiles/Dungeon Tile.png')",
        }}
        >
          <div
            className="border-2 rounded border-black w-[700px] h-[512px] bg-cover grid grid-cols-2 gap-4 p-6"
            style={{
              backgroundImage: "url('/Pixel Art/Misc/Bedroom.png')",
            }}
          >
            {/* Character Image */}
            <div className="absolute bottom-40 left-140">
              <img
                src={character.img}
                alt='Player'
                className="w-1/2"
              />
            </div>

            <p></p>

            {/* Character Stats */}
            <div className="flex flex-col justify-center items-center text-white">
              <h1 className="font-bold text-3xl text-yellow-300">Character Stats</h1>
              <p className="font-bold text-2xl">Max Health: {character.maxHealth}</p>
              <p className="font-bold text-2xl">Max Mana: {character.maxMana}</p>
              <p className="font-bold text-2xl">
                Attack: {character.attack}
            </p>
            <p className="font-bold text-2xl">
                Magic Attack: {character.magic}
            </p>
            <p className="font-bold text-2xl">
                Defense: {character.defense}
            </p>
            </div>

            <p></p>

            {/* Close Button */}
            <div className="col-span-2 flex justify-end mt-6">
              <button
                onClick={onClose}
                className="w-72 h-20 hover:scale-110 transition-transform select-none"
              >
                <div className="relative w-full h-full">
                  <img
                    src="/Pixel Art/Misc/Rectangular Button.png"
                    alt="Leave Character Page"
                    className="w-full h-full"
                  />
                  <span
                    className="absolute inset-0 flex items-center justify-center
                              text-black font-bold text-lg pointer-events-none"
                  >
                    Leave Character Page
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
    );
}

export default Character;