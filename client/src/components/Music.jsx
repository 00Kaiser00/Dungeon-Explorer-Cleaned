import { useState, useRef, useEffect } from "react";

function Music ({ gameState }) {
    const currentAudioRef = useRef(new Audio());
    const nextAudioRef = useRef(new Audio());
    const [muted, setMuted] = useState(true);

    // map your game states to songs
    const tracks = {
        general: "/Music/Tavern.mp3",
        enemy: "/Music/Enemy.mp3",
        boss: "/Music/Boss.mp3",
        finalBoss: "/Music/Final Boss.mp3",
    };

    useEffect(() => {
        if (!tracks[gameState]) return;

        const current = currentAudioRef.current;
        const next = nextAudioRef.current;

        const newSrc = tracks[gameState];

        if (current.src.includes(newSrc)) return;

        next.src = newSrc;
        next.loop = true;
        next.volume = 0;

        if (!muted) next.play();

        const fadeDuration = 500; // ms
        const steps = 20;
        const stepTime = fadeDuration / steps;

        let step = 0;

        const interval = setInterval(() => {
            step++;

            const progress = step / steps;

            // fade out current
            current.volume = 1 - progress;

            // fade in next
            next.volume = progress;

            if (step >= steps) {
            clearInterval(interval);

            current.pause();

            // swap refs
            currentAudioRef.current = next;
            nextAudioRef.current = current;
            }
        }, stepTime);
        }, [gameState]);

      const buttonClicked = () => {
        const current = currentAudioRef.current;
        const next = nextAudioRef.current;

        if (muted) {
            // unmuting → resume playback
            current.play().catch(() => {});
            next.play().catch(() => {});
        } else {
            // muting → stop everything
            current.pause();
            next.pause();
        }

        setMuted(!muted);
        };

    return (
        <div>
            <button className="fixed top-4 right-4" onClick={buttonClicked}>
                {muted ? (
                    <img src="/Pixel Art/Misc/Music Button.png" alt="Music Button" className="w-20 h-20" />
                ) : (
                    <img src="/Pixel Art/Misc/Mute Music Button.png" alt="Mute Music Button" className="w-20 h-20" />
                )}
            </button>
        </div>
    )
}

export default Music;