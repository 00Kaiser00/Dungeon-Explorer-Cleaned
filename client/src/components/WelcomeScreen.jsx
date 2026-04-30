import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function WelcomeScreen() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);

    const pages = [
    {
        title: "Welcome",
        content: `Welcome to an exhilarating adventure through a pseudo-random dungeon where danger and excitement await at every turn!
                    On each floor, you'll encounter a unique set of rooms and valuable items that can aid you in your quest. Gather powerful loot to enhance your skills and prepare for the challenges ahead.`
    },
    {
        title: "Treasures",
        content: `As you explore, you’ll meet a variety of new enemies to battle, culminating in a fierce boss fight at the end of each level.
                    To keep track of your progress, simply click on the bag icon to view the items you've collected. Click on each item to discover its special abilities and how it can help you on your journey. 
                    Remember, each enemy wields a specific weapon and elemental weaknesses that you'll need to strategize against.`
    },
    {
        title: "Help",
        content: `To learn more about the game, click on the "Question Mark" button, on the main screen to view a list of mechanics and game instructions.`
    },
    {
        title: "Beginings",
        content: `When you’re ready to embark on this epic journey, click the "Start Game" button to dive into the depths of the first floor of the dungeon.`
    }
    ];

    useEffect(() => {
        localStorage.clear();
    }, []);

    const goNext = () => {
    if (currentPage < pages.length - 1) {
        setCurrentPage(prev => prev + 1);
    }
    };

    const goPrev = () => {
    if (currentPage > 0) {
        setCurrentPage(prev => prev - 1);
    }
    };

    const canGoNext = currentPage < pages.length - 1;
    const canGoPrev = currentPage > 0;

    return (
        <div className="relative w-1/2 mx-auto">
            <div
                className="text-center border-2 rounded border-black px-6 py-10 bg-white bg-no-repeat bg-center"
                style={{
                backgroundImage: "url('/Pixel Art/Misc/Spell Book.png')",
                backgroundSize: "100% 100%",
                }}
            >
                <h1 className="text-3xl font-bold mt-10 mb-4">
                {pages[currentPage].title}
                </h1>

                <p className="text-xl px-10 py-4 whitespace-pre-line">
                {pages[currentPage].content}
                </p>

                {/* Start button only on last page */}
                {currentPage === pages.length - 1 && (
                <button
                    onClick={() => navigate("/dashboard")}
                    className="relative mt-6 hover:scale-110 transition-transform w-52 h-20"
                >
                    <img
                    src="/Pixel Art/Misc/Rectangular Button.png"
                    alt="Start Game"
                    className="w-full h-full"
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-black font-bold text-lg pointer-events-none">
                    Start Game
                    </span>
                </button>
                )}
            </div>

            {/* LEFT ARROW */}
            <button
                onClick={goPrev}
                disabled={!canGoPrev}
                className="absolute left-[-80px] top-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
            >
                <img
                src={
                    canGoPrev
                    ? "/Pixel Art/Misc/Left Arrow Button.png"
                    : "/Pixel Art/Misc/Gray Left Arrow Button.png"
                }
                alt="Previous"
                className="w-16 h-16"
                />
            </button>

            {/* RIGHT ARROW */}
            <button
                onClick={goNext}
                disabled={!canGoNext}
                className="absolute right-[-80px] top-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
            >
                <img
                src={
                    canGoNext
                    ? "/Pixel Art/Misc/Right Arrow Button.png"
                    : "/Pixel Art/Misc/Gray Right Arrow Button.png"
                }
                alt="Next"
                className="w-16 h-16"
                />
            </button>
            </div>
    )
}

export default WelcomeScreen;