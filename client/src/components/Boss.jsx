import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BattleUI from "./BattleUI";
import useOneTimeRevive from "../functions/useOneTimeRevive";
import RevivePrompt from "./RevivePrompt";
import useBattleLogic from "../functions/useBattleLogic";
import useCombatItems from "../functions/useBattleItems";

function Boss({
  character,
  setCharacter,
  currentItems,
  setCurrentItems,
  favoritedItem,
  setFavoritedItem,
  spells,
  setSpells,
  setCoins,
  floor,
  onClose,
  onDeath,
  onClear,
  reviveUsed,
  setReviveUsed,
  setTrapSaved,
}) {
  if (!character) return null;

  const navigate = useNavigate();

  const { pendingRevive, requestRevive, confirmRevive, denyRevive } =
    useOneTimeRevive({
      character,
      setCharacter,
      reviveUsed,
      setReviveUsed,
    });

  const [bosses, setBosses] = useState([]);
  const [selectedBoss, setSelectedBoss] = useState(null);
  const [cooldowns, setCooldowns] = useState({});
  const [goldPopups, setGoldPopups] = useState([]);
  const [healthPopups, setHealthPopups] = useState([]);
  const [bossEffectPopups, setBossEffectPopups] = useState([]);
  const [bossHealthPopups, setBossHealthPopups] = useState([]);
  const [battleStatus, setBattleStatus] = useState(null);
  const [bossesLoaded, setBossesLoaded] = useState(false);
  const [bossHitIds, setBossHitIds] = useState([]);
  const [playerHit, setPlayerHit] = useState(false);
  const [pendingGold, setPendingGold] = useState([]);
  const hasRandomizedRef = useRef(false);
  const attackTimersInitializedRef = useRef(false);
  const [slimePool, setSlimePool] = useState([]);
  const [showWeapons, setShowWeapons] = useState(true);
  const [showSpells, setShowSpells] = useState(false);

  const [bossShield, setBossShield] = useState({});
  const [bossSlots, setBossSlots] = useState({});
  const [tempAttackReduction, setTempAttackReduction] = useState(0);

  // -----------------------------
  // Load boss for floor
  // -----------------------------
  useEffect(() => {
    if (hasRandomizedRef.current) return;

    fetch("/bossData.json")
      .then((res) => res.json())
      .then((data) => {
        const floorBosses = data.bosses.filter(
          (b) => Number(b.floor) === Number(floor)
        );

        setBosses(
          floorBosses.slice(0, 1).map((b) => ({
            ...b,
            instanceId: Date.now() + Math.random(),
          }))
        );

        hasRandomizedRef.current = true;
        attackTimersInitializedRef.current = false;
      })
      .catch((err) => console.error("Error loading boss data:", err));
  }, [floor]);

  useEffect(() => {
    if (bosses.length > 0) setBossesLoaded(true);
  }, [bosses]);

  //Boss Shield Logic
  useEffect(() => {
    if (bosses.length === 0) return;

    const interval = setInterval(() => {
      setBossShield(prev => {
        const updated = { ...prev };
        const now = Date.now();

        bosses.forEach(boss => {
          if (boss.minShield == null || boss.maxShield == null) return;

          const shield = updated[boss.instanceId];

          // Shield active → do nothing
          if (shield?.activeUntil && now < shield.activeUntil) return;

          // Cooldown active → do nothing
          if (shield?.cooldownUntil && now < shield.cooldownUntil) return;

          // Activate shield
          const duration = 1000; // 1 second
          const cooldown =
            Math.floor(
              Math.random() * (boss.maxShield - boss.minShield + 1)
            ) + boss.minShield;

          /*console.log(
            `[BossShield] ${boss.name} shield ON (${cooldown}s CD)`
          );*/

          updated[boss.instanceId] = {
            activeUntil: now + duration,
            cooldownUntil: now + duration + cooldown * 1000,
          };
        });

        return updated;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [bosses]);

  // Boss Effects Popup
  const triggerBossEffectPopup = (text, bossInstanceId) => {
    const id = Date.now() + Math.random();
    const slot = bossSlots[bossInstanceId];

    setBossEffectPopups(prev => [
      ...prev,
      { id, text, slot }
    ]);

    setTimeout(() => {
      setBossEffectPopups(prev => prev.filter(p => p.id !== id));
    }, 1000);
  };

  // -----------------------------
  // Load slime pool
  // -----------------------------
  useEffect(() => {
    fetch("/enemyData.json")
      .then((res) => res.json())
      .then((data) => {
        const slimes = data.enemies.filter((e) => e.id >= 1 && e.id <= 4);
        setSlimePool(slimes);
      })
      .catch((err) => console.error("Error loading enemyData:", err));
  }, []);

  // -----------------------------
  // Spawn two slimes with instanceId
  // -----------------------------
  const getTwoRandomSlimes = () => {
    if (slimePool.length < 2) return [];

    const a = slimePool[Math.floor(Math.random() * slimePool.length)];
    const b = slimePool[Math.floor(Math.random() * slimePool.length)];

    return [
      { ...a, instanceId: Date.now() + Math.random() },
      { ...b, instanceId: Date.now() + Math.random() },
    ];
  };

  const weapons =
    currentItems?.filter((i) => !i.cost && i.weaponType !== "Shield") || [];
  const shield =
    currentItems?.find((i) => !i.cost && i.weaponType === "Shield") || null; 

  const {
    tempAttackCooldownIncrease,
    tempDamageReduction,
    shieldReductionModifier,
    poisonStacks,
    setPoisonStacks,
    shieldCooldownReduction,
    weaponCooldownReduction,
    useCombatItem,
  } = useCombatItems({
    battleStatus,
  });    

  // -----------------------------
  // Battle logic hook (same as enemy)
  // -----------------------------
  const { handleAttack, handleSpell, useShield, applyDirectDamageToAll } = useBattleLogic({
    character,
    setCharacter,
    actors: bosses,
    setActors: setBosses,
    selectedActor: selectedBoss,
    hitIds: bossHitIds,
    setHitIds: setBossHitIds,
    setGoldPopups,
    setActorHealthPopups: setBossHealthPopups,
    setPendingGold,
    cooldowns,
    setCooldowns,
    getOnDeathSpawns: (boss) => {
      if (boss.Skill === "On death, spawn two random slimes.") {
        const spawnedSlimes = getTwoRandomSlimes();

        if (spawnedSlimes.length > 0) {
          setBosses((prevBosses) => [...prevBosses, ...spawnedSlimes]);
        }

        return {
          spawns: spawnedSlimes,
          text: "The Slime King Called Upon His Minions!",
        };
      }

      if (boss.Skill === "On death, spawns a copy without a skill.") {
        const clone = {
          ...boss,
          instanceId: Date.now() + Math.random(),
          health: boss.maxHealth,
          Skill: null,
        };

        setBosses((prevBosses) => [...prevBosses, clone]);

        return {
          spawns: [clone],
          text: "The Zombie Skeleton Rises Once More!",
        };
      }
      return null;
    },
    getOnDeath: (boss) => {
      if (boss.Skill === "On death, player forgets a random spell.") {
        deleteRandomSpell();
        return "The Arcane Golem made you forget a spell.";
      }
    },
    bossShield: bossShield[selectedBoss?.instanceId],
    getSlotForActor: (id) => bossSlots[id],
    tempAttackReduction,
    triggerBossEffectPopup,
    shieldReductionModifier,
    shieldCooldownReduction,
    weaponCooldownReduction,
  });

  const handleBattleItem = (item) => {
    if (item.name === "Fire Bomb") {
      applyDirectDamageToAll(10);
    }

    // Remove from inventory
    setCurrentItems(prev =>
      prev.filter(i => i.id !== item.id)
    );

    // Remove from favorite if it was that
    setFavoritedItem(prev =>
      prev?.id === item.id ? null : prev
    );
    useCombatItem(item);
  }; 

  //Delete Random Spell
  const deleteRandomSpell = () => {
    setSpells(prev => {
      if (!prev || prev.length === 0) return prev;

      const index = Math.floor(Math.random() * prev.length);

      /*console.log(
        "[Boss Skill] Player forgot spell:",
        prev[index].name
      );*/

      return prev.filter((_, i) => i !== index);
    });
  };

  // -----------------------------
  // Boss attack countdowns (COPIED FROM ENEMY)
  // -----------------------------
  const [enemyAttackTimers, setEnemyAttackTimers] = useState({});

  useEffect(() => {
    if (bosses.length === 0) return;

    setEnemyAttackTimers((prev) => {
      const updated = { ...prev };
      let changed = false;

      bosses.forEach((boss) => {
        if (updated[boss.instanceId] == null) {
          const cd = Number(boss["attack cooldown"]) || 3;
          updated[boss.instanceId] = cd;
          changed = true;
        }
      });

      return changed ? updated : prev;
    });
  }, [bosses]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnemyAttackTimers((prev) => {
        const updated = { ...prev };

        bosses.forEach((boss) => {
          const id = boss.instanceId;
          const baseCd = Number(boss["attack cooldown"]) || 3;
          const modifiedCd = baseCd + tempAttackCooldownIncrease;

          if (updated[id] <= 0) {
            updated[id] = modifiedCd;
          } else {
            updated[id] -= 1;
          }
        });

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [bosses, tempAttackCooldownIncrease]);

  useEffect(() => {
    Object.entries(enemyAttackTimers).forEach(([id, time]) => {
      if (time === 0) {
        const boss = bosses.find((b) => b.instanceId == id);
        if (!boss) return;

        handleBossAttack(boss);

        // Reset timer AFTER 1 tick so UI can show the attack icon
        setTimeout(() => {
          setEnemyAttackTimers(prev => {
            const updated = { ...prev };
            const baseCd = Number(boss["attack cooldown"]) || 3;
            updated[id] = baseCd + tempAttackCooldownIncrease;
            return updated;
          });
        }, 50); // very small delay so UI renders 0 first
      }
    });
  }, [enemyAttackTimers, bosses, tempAttackCooldownIncrease]);

  const handleBossAttack = (boss) => {
    let damage = Math.max(boss.damage - (character.defense || 0), 0);
    damage = damage * (1 - tempDamageReduction);
    const now = Date.now();

    // -----------------------------
    // Shield logic (same as Enemy)
    // -----------------------------
    const shieldActive =
      shield &&
      cooldowns.activeShield?.id === shield.id &&
      cooldowns.activeShield.expiresAt > now;

    if (shieldActive) {
      let reduction = Number(shield.damageReduction) || 0;
      if (reduction > 1) reduction /= 100; // support whole-number percentages
      reduction = Math.min(Math.max(reduction, 0), 0.99);

      const original = damage;
      damage = +(damage * (1 - reduction)).toFixed(1);
      //console.log(`[boss attack] Shield active! ${original} → ${damage}`);
    }

    // -----------------------------
    // Boss skill: steal gold
    // -----------------------------
    if (boss.Skill === "On attack, steal 10 gold.") {
      setCoins((prev) => Math.max(0, prev - 10));
      triggerBossEffectPopup("The Goblin King Stole 10 Gold!", boss.instanceId);
    }

    //boss skill: "On attack, lower player max health by 5."
    if (boss.Skill === "On attack, lower player max health by 5.") {
      if (character.maxHealth <= 5) return;
      setCharacter((prev) => ({
        ...prev,
        maxHealth: Math.max(0, prev.maxHealth - 5),
      }));

      triggerBossEffectPopup(
        "The Vampire King Lowered Your Max Health by 5!",
        boss.instanceId
      );
    }

    //boss skill: "On attack, lower player max mana by 2."
    if (boss.Skill === "On attack, lower player max mana by 2.") {
      if (character.maxMana <= 2) return;
      setCharacter((prev) => ({
        ...prev,
        maxMana: Math.max(0, prev.maxMana - 2),
      }));

      triggerBossEffectPopup(
        "The Ghost Shark Lowered Your Max Mana by 2!",
        boss.instanceId
      );
    }

    //boss skill: "On attack, temporarily lower player attack by 1."
    if (boss.Skill === "On attack, temporarily lower player attack by 1.") {
      setTempAttackReduction(prev =>
        Math.min(prev + 1, character.attack || 0)
      );

      triggerBossEffectPopup(
        "The Deep Sea Fish Lowered Your Attack by 1!",
        boss.instanceId
      );
    }

    //boss skill: "On attack, increases player shield cooldown by 1."
    if (boss.Skill === "On attack, increases player shield cooldown by 1.") {
      if (!shield) return; // no shield equipped

      setCooldowns(prev => {
        const current = prev[shield.id];

        // Only increase if shield is already cooling down
        if (!current) return prev;

        return {
          ...prev,
          [shield.id]: current + 1,
        };
      });

      triggerBossEffectPopup(
        "????? Increased Your Shield Cooldown by 1!",
        boss.instanceId
      );
    }

    const id = Date.now() + Math.random();
    setHealthPopups((prev) => [...prev, { id, damage }]);

    setTimeout(() => {
      setHealthPopups((prev) => prev.filter((p) => p.id !== id));
    }, 1000);

    // -----------------------------
    // Apply damage + death check
    // -----------------------------
    if (damage > 0) {
      setCharacter((prev) => {
        const newHealth = +Math.max(0, +(prev.health || 0) - damage).toFixed(1);
        if (newHealth <= 0) {
          setBattleStatus("defeat");
        }
        return { ...prev, health: newHealth };
      });

      setPlayerHit(true);
      setTimeout(() => setPlayerHit(false), 200);
    }
  };

  useEffect(() => {
    if (poisonStacks <= 0) return;

    const interval = setInterval(() => {
      setPoisonStacks(prev => {
        if (prev <= 0) return 0;

        applyDirectDamageToAll(5);
        //console.log("Poison Tick");

        return prev - 1;
      });
    }, 1000); // 1 tick per second

    return () => clearInterval(interval);
  }, [poisonStacks]);

  useEffect(() => {
    if (battleStatus === "victory" || battleStatus === "defeat") {
      setTempAttackReduction(0);
    }
  }, [battleStatus]);

  // -----------------------------
  // Victory detection
  // -----------------------------
  useEffect(() => {
    if (!bossesLoaded || battleStatus) return;
    if (bosses.length === 0) {
      setTimeout(() => setBattleStatus("victory"), 1500);
    }
  }, [bosses, bossesLoaded, battleStatus]);

  // -----------------------------
  // End of battle transitions
  // -----------------------------
  useEffect(() => {
    if (battleStatus === "victory") {
      const timeout = setTimeout(() => {
        if (floor === 8) onClear();
        else onClose();
      }, 2000);
      return () => clearTimeout(timeout);
    }

    if (battleStatus === "defeat") {
      const timeout = setTimeout(() => {
        const allowed = requestRevive();
        if (!allowed) onDeath();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [battleStatus, onClose, navigate]);

  // -----------------------------
  // Boss grid
  // -----------------------------
  useEffect(() => {
    if (bosses.length === 0) return;

    setBossSlots(prev => {
      const updated = { ...prev };
      const usedSlots = new Set(Object.values(updated));

      bosses.forEach(boss => {
        if (updated[boss.instanceId] == null) {
          // find first free slot
          for (let i = 0; i < 3; i++) {
            if (!usedSlots.has(i)) {
              updated[boss.instanceId] = i;
              usedSlots.add(i);
              break;
            }
          }
        }
      });

      // cleanup removed bosses
      Object.keys(updated).forEach(id => {
        if (!bosses.find(b => b.instanceId == id)) {
          delete updated[id];
        }
      });

      return updated;
    });
  }, [bosses]);

  const grid = Array(3).fill(null);

  bosses.forEach(boss => {
    const slot = bossSlots[boss.instanceId];
    if (slot != null) {
      grid[slot] = boss;
    }
  });

  const resetBossesHealth = () => {
    setBosses((prev) =>
      prev.map((boss) => ({ ...boss, health: boss.maxHealth }))
    );
    attackTimersInitializedRef.current = false;
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div>
      <BattleUI
        character={character}
        setCharacter={setCharacter}
        selectedEnemy={selectedBoss}
        setSelectedEnemy={setSelectedBoss}
        grid={grid}
        enemyHitIds={bossHitIds}
        playerHit={playerHit}
        weapons={weapons}
        shield={shield}
        spells={spells}
        favoritedItem={favoritedItem}
        showWeapons={showWeapons}
        showSpells={showSpells}
        handleAttack={handleAttack}
        handleSpell={handleSpell}
        useShield={useShield}
        cooldowns={cooldowns}
        setShowWeapons={setShowWeapons}
        setShowSpells={setShowSpells}
        battleStatus={battleStatus}
        goldPopups={goldPopups}
        healthPopups={healthPopups}
        bossEffectPopups={bossEffectPopups}
        enemyHealthPopups={bossHealthPopups}
        currentItems={currentItems}
        setCurrentItems={setCurrentItems}
        setFavoritedItem={setFavoritedItem}
        floor={floor}
        enemyAttackTimers={enemyAttackTimers}
        bossShield={bossShield}
        setTrapSaved={setTrapSaved}
        onUseCombatItem={handleBattleItem}
      />

      <RevivePrompt
        visible={pendingRevive}
        onConfirm={() => {
          confirmRevive();
          resetBossesHealth();
          setSelectedBoss(null);
          setBattleStatus(null);
          setCooldowns({});
        }}
        onDeny={() => {
          denyRevive();
          onDeath();
        }}
      />
    </div>
  );
}

export default Boss;