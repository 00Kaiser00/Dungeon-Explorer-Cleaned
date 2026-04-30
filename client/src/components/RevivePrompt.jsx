export default function RevivePrompt({ visible, onConfirm, onDeny }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[999]">
      <div className="bg-yellow-200 border-4 border-yellow-500 p-6 rounded-xl shadow-xl text-center w-[320px]">
        <p className="font-bold text-xl mb-4">
          You have fallen... Revive and retry?
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-6 mt-4">
          {/* Revive Button */}
          <button
            onClick={onConfirm}
            className="w-36 h-16 hover:scale-110 transition-transform select-none"
          >
            <div className="relative w-full h-full">
              <img
                src="/Pixel Art/Misc/Rectangular Button.png"
                alt="Revive"
                className="w-full h-full"
              />
              <span className="absolute inset-0 flex items-center justify-center
                              text-black font-bold text-lg pointer-events-none">
                Revive
              </span>
            </div>
          </button>

          {/* No Button */}
          <button
            onClick={onDeny}
            className="w-36 h-16 hover:scale-110 transition-transform select-none"
          >
            <div className="relative w-full h-full">
              <img
                src="/Pixel Art/Misc/Rectangular Button.png"
                alt="No"
                className="w-full h-full"
              />
              <span className="absolute inset-0 flex items-center justify-center
                              text-black font-bold text-lg pointer-events-none">
                No
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
