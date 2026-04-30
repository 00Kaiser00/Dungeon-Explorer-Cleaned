import { useState } from "react";

export default function useOneTimeRevive({ character, setCharacter, reviveUsed, setReviveUsed }) {
  const [pendingRevive, setPendingRevive] = useState(false);

  // Call this when the player dies
  const requestRevive = () => {
    if (reviveUsed) return false; // not allowed anymore
    setPendingRevive(true);       // show UI prompt
    return true;
  };

  // Player chooses "Revive"
  const confirmRevive = () => {
    if (reviveUsed) return;

    setReviveUsed(true);
    setPendingRevive(false);

    // Restore stats (adjust to your game logic)
    setCharacter((prev) => ({
      ...prev,
      health: prev.maxHealth,
      mana: prev.maxMana,
    }));

    return true;
  };

  // Player refuses
  const denyRevive = () => {
    setPendingRevive(false);
  };

  return {
    reviveUsed,
    pendingRevive,
    requestRevive,
    confirmRevive,
    denyRevive,
  };
}
