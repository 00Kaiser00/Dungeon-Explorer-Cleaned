export const skillEffects = {
  "On attack, steal 10 gold.": {
    trigger: "onAttack",
    effect: ({ setCoins }) => {
      setCoins((prev) => Math.max(0, prev - 10));
    },
  },
  "On death, spawn two random slimes.": {
    trigger: "onDeath",
    effect: ({ addEnemies, getTwoRandomSlimes }) => {
      const newSlimes = getTwoRandomSlimes();
      addEnemies(newSlimes);
    },
  },
  "On death, spawns a copy without a skill.": {
    trigger: "onDeath",
    effect: ({ addEnemies, boss }) => {
      const respawn = {
        ...boss,
        id: boss.id + "_respawn_" + Date.now(),
        Skill: null, // no skill on respawn
      };
      addEnemies([respawn]);
    },
  },
};