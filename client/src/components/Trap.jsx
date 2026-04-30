import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import useOneTimeRevive from "../functions/useOneTimeRevive";
import RevivePrompt from "./RevivePrompt";

function Trap({
  character,
  setCharacter,
  coins,
  setCoins,
  currentItems,
  setCurrentItems,
  spells,
  setSpells,
  floor,
  reviveUsed,
  setReviveUsed,
  onDeath,
  onClose,
  trapSaved,
  setTrapSaved,
}) {
  const navigate = useNavigate();
  const [trap, setTrap] = useState(null);
  const [hasDied, setHasDied] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const hasTriggered = useRef(false);
  const backgroundCharacter = [
    "/Pixel Art/Enemies/Stick Goblin.png.png",
    "/Pixel Art/Enemies/Stone Golem.png",
    "/Pixel Art/Enemies/Water Fish Man.png",
  ];
  const [trapHasBeenSaved, setTrapHasBeenSaved] = useState(false);

  const { pendingRevive, requestRevive, confirmRevive, denyRevive } =
      useOneTimeRevive({
        character,
        setCharacter,
        reviveUsed,
        setReviveUsed,
      });

  // ---------------------------------
  // RARITY ODDS (Danger 1–3 tiers)
  // ---------------------------------
  const getRarityOdds = (floor) => {
    if (floor <= 2) {
      return { 1: 1.0, 2: 0.0, 3: 0.0 };
    } else if (floor <= 5) {
      return { 1: 0.5, 2: 0.5, 3: 0.0 };
    } else if (floor <= 8) {
      return { 1: 0.0, 2: 0.5, 3: 0.5 };
    } else {
      return { 1: 0.0, 2: 0.0, 3: 1.0 };
    }
  };

  const chooseDanger = (odds) => {
    const rand = Math.random();
    let cumulative = 0;

    for (const [tier, chance] of Object.entries(odds)) {
      cumulative += chance;
      if (rand < cumulative) return Number(tier);
    }

    return 1;
  };

  // ---------------------------------
  // LOAD + ACTIVATE TRAP
  // ---------------------------------
  useEffect(() => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;

    //Check if trap has been saved
    if (trapSaved) {
      setTrapSaved(false);           
      setTrapHasBeenSaved(true);    
      return;                        
    }

    const triggerTrap = async () => {
      try {
        const res = await fetch("/trapEffects.json");
        const data = await res.json();

        const odds = getRarityOdds(floor);
        const chosenTier = chooseDanger(odds);

        const possibleTraps = data.traps.filter(
          (t) => t.danger === chosenTier
        );

        if (possibleTraps.length === 0) return;

        const selectedTrap =
          possibleTraps[Math.floor(Math.random() * possibleTraps.length)];

        setTrap(selectedTrap);

        activateTrap(selectedTrap);
      } catch (err) {
        console.error("Trap load error:", err);
      }
    };

    triggerTrap();
  }, [floor]);

  //Detect Death
  useEffect(() => {
    if (hasDied) {
      const timeout = setTimeout(() => {
        const allowed = requestRevive();
        if (!allowed) onDeath();
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [hasDied]);

  const resetDeath = () => {
    setHasDied(false);
  };

  // ---------------------------------
  // APPLY TRAP EFFECT
  // ---------------------------------
  const activateTrap = (trap) => {
    const effect = trap.effect;

    // ---------------- HEALTH LOSS
    if (effect.includes("health")) {
      const amount = parseInt(effect.match(/\d+/)[0]);

      setBackgroundImage(backgroundCharacter[0]);

      setCharacter((prev) => {
        const newHealth = Math.max(prev.health - amount, 0);

        if (newHealth <= 0) {
          setTimeout(() => setHasDied(true), 2000);
        }

        return {
          ...prev,
          health: newHealth,
        };
      });
    }

    // ---------------- MANA LOSS
    else if (effect.includes("mana")) {
      const amount = parseInt(effect.match(/\d+/)[0]);

      setBackgroundImage(backgroundCharacter[1]);

      setCharacter((prev) => ({
        ...prev,
        mana: Math.max(prev.mana - amount, 0),
      }));
    }

    // ---------------- GOLD LOSS
    else if (effect.includes("gold")) {
      const amount = parseInt(effect.match(/\d+/)[0]);

      setBackgroundImage(backgroundCharacter[0]);
      setCoins((prev) => Math.max(prev - amount, 0));
    }

    // ---------------- WEAPON BREAK
    else if (effect.includes("weapon")) {
      const currentWeapons = currentItems.filter(
        (i) => i.weaponType && i.weaponType !== "Shield"
      );

      // Must always keep at least one weapon
      if (currentWeapons.length <= 1) return;

      const randomWeapon =
        currentWeapons[Math.floor(Math.random() * currentWeapons.length)];

      setBackgroundImage(backgroundCharacter[0]);  

      setCurrentItems((prev) =>
        prev.filter((item) => item.id !== randomWeapon.id)
      );
    }

    // ---------------- SPELL LOSS
    else if (effect.includes("spell")) {
      if (spells.length === 0) return;

      const randomSpell =
        spells[Math.floor(Math.random() * spells.length)];

      setBackgroundImage(backgroundCharacter[2]);  

      setSpells((prev) =>
        prev.filter((spell) => spell.id !== randomSpell.id)
      );
    }
  };

  const [dungeonTileImg, setDungeonTileImg] = useState(null);

    useEffect(() => {
    async function loadTile() {
        const res = await fetch("/tiles.json");
        const data = await res.json();

        // Find the current floor
        const floorData = data.floors.find(f => f.id === floor);

        if (!floorData) return;

        // Find the "dungeon" tile image for this floor
        const dungeonTile = floorData.tiles.find(t => t.type === "dungeon");

        if (dungeonTile) {
        setDungeonTileImg(dungeonTile.img);
        //console.log("Dungeon tile image loaded:", dungeonTile.img);
        }
    }

    loadTile();
    }, [floor]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="relative w-[600px] h-[450px] p-6 border-4 border-black rounded-lg shadow-2xl text-white text-center bg-cover bg-center"
        style={{ backgroundImage: dungeonTileImg
            ? `url(${encodeURI(dungeonTileImg)})`
            : "none",

          }}
      >
        <h1 className="text-3xl font-bold mt-24 text-red-400">
          You have encountered a trap!
        </h1>

        {trap && (
          <div className="mt-8 text-xl text-yellow-300">
            <p className="font-bold">{trap.description}</p>

            <img
              src= {backgroundImage}
              alt="Enemy"
              className="w-20 h-20 mt-6 mx-auto"
            />
          </div>
        )}

        {trapHasBeenSaved && (
          <div className="absolute inset-0 flex items-center justify-center text-green-400 text-5xl font-bold">
            You escaped the trap!
          </div>
        )}

        {hasDied && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 text-red-400 text-5xl font-bold">
            You Died...
          </div>
        )}

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
              alt="Keep Exploring"
              className="w-full h-full"
            />
            <span className="absolute inset-0 flex items-center justify-center text-black font-bold text-lg pointer-events-none">
              Keep Exploring
            </span>
          </div>
        </button>
      </div>

      <RevivePrompt
              visible={pendingRevive}
              onConfirm={() => {
                confirmRevive();
                resetDeath();
              }}
              onDeny={() => {
                denyRevive();
                onDeath();
              }}
        />
    </div>
  );
}

export default Trap;