import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import BattleUI from "./BattleUI";
import useOneTimeRevive from "../functions/useOneTimeRevive";
import RevivePrompt from "./RevivePrompt";
import useBattleLogic from "../functions/useBattleLogic";
import useCombatItems from "../functions/useBattleItems";

function Enemy({
  character,
  setCharacter,
  spells,
  currentItems,
  setCurrentItems,
  favoritedItem,
  setFavoritedItem,
  setCoins,
  floor,
  onClose,
  onDeath,
  reviveUsed,
  setReviveUsed,
  setTrapSaved,
}) {
  const navigate = useNavigate();
  const [enemies, setEnemies] = useState([]);
  const [selectedEnemy, setSelectedEnemy] = useState(null);
  const [cooldowns, setCooldowns] = useState({});
  const [goldPopups, setGoldPopups] = useState([]);
  const [healthPopups, setHealthPopups] = useState([]);
  const [enemyHealthPopups, setEnemyHealthPopups] = useState([]);
  const [battleStatus, setBattleStatus] = useState(null);
  const [enemiesLoaded, setEnemiesLoaded] = useState(false);
  const [enemyHitIds, setEnemyHitIds] = useState([]);
  const [playerHit, setPlayerHit] = useState(false);
  const [pendingDamage, setPendingDamage] = useState(0);
  const [pendingGold, setPendingGold] = useState([]);
  const hasRandomizedRef = useRef(false);
  const [showWeapons, setShowWeapons] = useState(true);
  const [showSpells, setShowSpells] = useState(false);
  const [enemySlots, setEnemySlots] = useState({});

  const {
    pendingRevive,
    requestRevive,
    confirmRevive,
    denyRevive,
  } = useOneTimeRevive({ character, setCharacter, reviveUsed, setReviveUsed });

  // Load enemies for the current floor
  useEffect(() => {
    if (hasRandomizedRef.current) return;
    fetch("/enemyData.json")
      .then((res) => res.json())
      .then((data) => {
        const floorEnemies = data.enemies.filter(
          (e) => Number(e.floor) === Number(floor)
        );
        const shuffled = [...floorEnemies].sort(() => 0.5 - Math.random());
        const randomCount = Math.random() < 0.5 ? 1 : 2;
        const enemiesWithUniqueIds = shuffled.slice(0, randomCount).map((enemy) => ({
          ...enemy,
          instanceId: Date.now() + Math.random(),
        }));
        setEnemies(enemiesWithUniqueIds);
        hasRandomizedRef.current = true;
      })
      .catch((err) => console.error("Error loading enemy data:", err));
  }, [floor]);

  useEffect(() => {
    if (enemies.length > 0) setEnemiesLoaded(true);
  }, [enemies]);

  const weapons = currentItems?.filter((item) => !item.cost && item.weaponType !== "Shield") || [];
  const shield = currentItems?.find((item) => !item.cost && item.weaponType === "Shield") || null;

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

  const { handleAttack, handleSpell, useShield, applyDirectDamageToAll } = useBattleLogic({
    character,
    setCharacter,
    actors: enemies,
    setActors: setEnemies,
    selectedActor: selectedEnemy,
    hitIds: enemyHitIds,
    setHitIds: setEnemyHitIds,
    setGoldPopups,
    setActorHealthPopups: setEnemyHealthPopups,
    setPendingGold,
    cooldowns,
    setCooldowns,
    getOnDeathSpawns: null, // enemies do not spawn anything
    getSlotForActor: (id) => enemySlots[id],
    triggerBossEffectPopup: null,
    bossShield: null,
    tempAttackReduction: 0,
    shieldReductionModifier,
    shieldCooldownReduction,
    weaponCooldownReduction,
  });

  const handleBattleItem = (item) => {

    // Fire Bomb
    if (item.name === "Fire Bomb") {
      applyDirectDamageToAll(10);
    }

    // Corrosion Potion (ONLY IF boss shield exists)
    if (item.name === "Corrosion Potion") {
      // Enemies do not have shields — so skip
      //console.log("Corrosion Potion has no effect on normal enemies.");
    }

    // Remove from inventory
    setCurrentItems(prev =>
      prev.filter(i => i.id !== item.id)
    );

    setFavoritedItem(prev =>
      prev?.id === item.id ? null : prev
    );

    useCombatItem(item);
  };

  const [enemyAttackTimers, setEnemyAttackTimers] = useState({});

  // Initialize attack countdowns
  useEffect(() => {
    if (enemies.length === 0) return;

    const timers = {};
    enemies.forEach(enemy => {
      const cd = Number(enemy["attack cooldown"]) || 3;
      timers[enemy.instanceId] = cd;
    });

    setEnemyAttackTimers(timers);
  }, [enemies]);

  // Countdown ticker (runs every 1s)
  useEffect(() => {
    const interval = setInterval(() => {
      setEnemyAttackTimers(prev => {
        const updated = { ...prev };
        enemies.forEach(enemy => {
          const id = enemy.instanceId;
          const cd = Number(enemy["attack cooldown"]) || 3;

          if (updated[id] <= 0) {
            updated[id] = cd;     // reset when attack happens
          } else {
            updated[id] = updated[id] - 1;
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [enemies]);

  // Enemy auto-attacks
  useEffect(() => {
    if (!enemyAttackTimers) return;
    Object.entries(enemyAttackTimers).forEach(([id, time]) => {
      if (time === 0) {
        const enemy = enemies.find((e) => e.instanceId == id);
        if (!enemy) return;

        handleEnemyAttack(enemy);

        setTimeout(() => {
          setEnemyAttackTimers(prev => {
            const updated = { ...prev };
            const baseCd = Number(enemy["attack cooldown"]) || 3;
            updated[id] = baseCd + tempAttackCooldownIncrease;
            return updated;
          });
        }, 50);
      }
    });
  }, [enemyAttackTimers, enemies, tempAttackCooldownIncrease]);

  const handleEnemyAttack = (enemy) => {
    let damage = Math.max(enemy.damage - (character.defense || 0), 0);
    damage = damage * (1 - tempDamageReduction);
    const now = Date.now();

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
      //console.log(`[enemy attack] Shield active! ${original} → ${damage}`);
    }

    const id = Date.now() + Math.random();
    setHealthPopups((prev) => [...prev, { id, damage }]);

    setTimeout(() => {
      setHealthPopups((prev) => prev.filter((p) => p.id !== id));
    }, 1000);

    if (damage > 0) {
      setCharacter((prev) => ({
        ...prev,
        health: +Math.max(0, +(prev.health || 0) - damage).toFixed(1),
      }));

      setPlayerHit(true);
      setTimeout(() => setPlayerHit(false), 200);
    }

    if ((character.health || 0) - damage <= 0) {
      setBattleStatus("defeat");
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

  // Detect victory
  useEffect(() => {
    if (!enemiesLoaded || battleStatus) return;
    if (enemies.length === 0) {
      setTimeout(() => setBattleStatus("victory"), 1500);
    }
  }, [enemies, enemiesLoaded, battleStatus]);

  // Post-battle effects
  useEffect(() => {
    if (battleStatus === "victory") {
      const timeout = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timeout);
    }
    if (battleStatus === "defeat") {
      const timeout = setTimeout(() => {
        const allowed = requestRevive();
        if (!allowed) {
          onDeath(); // already used revive before
        }
      }, 1200);

      return () => clearTimeout(timeout);
    }
  }, [battleStatus, onClose, navigate]);

  //Enemy Grid
  useEffect(() => {
    if (enemies.length === 0) return;

    setEnemySlots(prev => {
      const updated = { ...prev };
      const usedSlots = new Set(Object.values(updated));

      enemies.forEach(enemy => {
        if (updated[enemy.instanceId] == null) {
          // find first free slot
          for (let i = 0; i < 3; i++) {
            if (!usedSlots.has(i)) {
              updated[enemy.instanceId] = i;
              usedSlots.add(i);
              break;
            }
          }
        }
      });

      // cleanup removed bosses
      Object.keys(updated).forEach(id => {
        if (!enemies.find(e => e.instanceId == id)) {
          delete updated[id];
        }
      });

      return updated;
    });
  }, [enemies]);

  const grid = Array(3).fill(null);

  enemies.forEach(enemy => {
    const slot = enemySlots[enemy.instanceId];
    if (slot != null) {
      grid[slot] = enemy;
    }
  });

  // Apply queued gold safely
  useEffect(() => {
    if (pendingGold.length === 0) return;
    pendingGold.forEach((g) => setCoins((prev) => prev + g.amount));
    setPendingGold([]);
  }, [pendingGold, setCoins]);

  const resetEnemiesHealth = () => { 
    setEnemies((prev) =>
      prev.map((enemy) => ({
        ...enemy,
        health: enemy.maxHealth, // restore full hp
      }))
    );
  };

  return (
    <div>
      <BattleUI
        character={character}
        setCharacter={setCharacter}
        selectedEnemy={selectedEnemy}
        setSelectedEnemy={setSelectedEnemy}
        grid={grid}
        enemyHitIds={enemyHitIds}
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
        enemyHealthPopups={enemyHealthPopups}
        currentItems={currentItems}
        setCurrentItems={setCurrentItems}
        setFavoritedItem={setFavoritedItem}
        floor={floor}
        enemyAttackTimers={enemyAttackTimers}
        setTrapSaved={setTrapSaved}
        onUseCombatItem={handleBattleItem}
      />

      <RevivePrompt
        visible={pendingRevive}
        onConfirm={() => {
          confirmRevive();
          resetEnemiesHealth(); 

          // reset the battle state
          setSelectedEnemy(null);
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

export default Enemy;