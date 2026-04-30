import { useState } from "react";

export default function useBattleLogic({
  character,
  setCharacter,
  actors,            // enemies OR bosses array
  setActors,         // setEnemies OR setBosses
  selectedActor,     // selectedEnemy OR selectedBoss
  hitIds,            // enemyHitIds OR bossHitIds
  setHitIds,
  setGoldPopups,
  setActorHealthPopups,
  setPendingGold,
  cooldowns,
  setCooldowns,
  getOnDeathSpawns,  // function for special boss mechanics (optional)
  getOnDeath,
  bossShield,
  getSlotForActor,
  tempAttackReduction,
  triggerBossEffectPopup,
  shieldReductionModifier,
  shieldCooldownReduction,
  weaponCooldownReduction,
}) {
  // ---------------------------------------------------
  // UNIVERSAL WEAPON ATTACK
  // ---------------------------------------------------
  const handleAttack = (weapon, isRecursive = false) => {
    if (!selectedActor) return alert("Select a target first!");
    if (!isRecursive && cooldowns[weapon.id])
      return alert(`${weapon.name} is cooling down!`);

    const attackCooldown = Math.max(
      0,
      (Number(weapon.attackCooldown) || 0) - weaponCooldownReduction
    );
    const newActors = [];
    const newGold = [];

    actors.forEach((actor) => {
      if (actor.instanceId !== selectedActor.instanceId) {
        newActors.push(actor);
        return;
      }  

      // ---------- BASE DAMAGE ----------
      const attackBonus =
        Math.max(0, (character.attack || 0) - (tempAttackReduction || 0));

      let baseDamage =
        Math.floor(Math.random() * (weapon.maxDamage - weapon.minDamage + 1)) +
        weapon.minDamage +
        attackBonus;

      // ---------- ELEMENTAL DAMAGE ----------
      let elementalDamage = 0;
      const enchantElement = weapon.elementalType;
      const enchantValue = weapon.elementalDamage || 0;

      if (enchantElement) {
        elementalDamage += enchantValue;

        const weakness = actor["Element Weakness"];
        if (weakness && enchantElement === weakness) {
          elementalDamage *= 1.5;
        }
      }

      if (actor["Weapon Weakness"] && weapon.weaponType === actor["Weapon Weakness"]) {
        baseDamage *= 1.5;
      }

      let totalDamage = Math.floor(baseDamage + elementalDamage);

      // -----------------------------
      // Boss shield logic (boss only)
      // -----------------------------
      if (bossShield?.activeUntil && Date.now() < bossShield.activeUntil) {
        //console.log("BossShield active!");
        let reduction = Number(actor.damageReduction) || 0;
        if (reduction > 1) reduction /= 100;

        reduction = Math.max(0, reduction - shieldReductionModifier);
        reduction = Math.min(Math.max(reduction, 0), 0.99);

        const original = totalDamage;
        totalDamage = +(totalDamage * (1 - reduction)).toFixed(1);

        /*console.log(
          `[BossShield] Reduced damage ${original} → ${totalDamage}`
        );*/
      }

      const updatedHealth = actor.health - totalDamage;

      const id = Date.now() + Math.random();
      const slot = getSlotForActor?.(actor.instanceId);
      //console.log("totalDamage", totalDamage);

      setActorHealthPopups((prev) => [
        ...prev,
        {
          id,
          amount: totalDamage,
          slot,
        },
      ]);

      setTimeout(() => {
        setActorHealthPopups((prev) => prev.filter((p) => p.id !== id));
      }, 1000);

      // ---------- HIT FLASH ----------
      setHitIds((prev) => [...prev, actor.instanceId]);
      setTimeout(
        () => setHitIds((prev) => prev.filter((id) => id !== actor.instanceId)),
        200
      );

      // ---------- DEATH ----------
      if (updatedHealth <= 0) {
        const goldEarned =
          actor.gold ||
          Math.floor(Math.random() * (actor.maxGold - actor.minGold + 1)) +
            actor.minGold;

        const goldPopupId = Date.now() + Math.random();

        setGoldPopups(prev => [
          ...prev,
          {
            id: goldPopupId,
            amount: goldEarned,
            slot, // 👈 store where it died
          }
        ]);

        setTimeout(() => {
          setGoldPopups(prev => prev.filter(p => p.id !== id));
        }, 1000);

        newGold.push(goldEarned);

        // Boss special spawns
        if (getOnDeathSpawns) {
          const result = getOnDeathSpawns(actor);

          if (result?.spawns?.length) {
            newActors.push(...result.spawns);
          }

          if (result?.text && triggerBossEffectPopup) {
            triggerBossEffectPopup(result.text, actor.instanceId);
          }
        }

        //Boss death effects
        if (getOnDeath) {
          const popupText = getOnDeath(actor);

          if (popupText && triggerBossEffectPopup) {
            triggerBossEffectPopup(popupText, actor.instanceId);
          }
        }
      } else {
        newActors.push({ ...actor, health: updatedHealth });
      }

      // ---------- LIFESTEAL ----------
      if (weapon.lifeSteal) {
        setCharacter((prev) => ({
          ...prev,
          health: Math.min(prev.maxHealth, prev.health + weapon.lifeSteal),
        }));
      }

      // ---------- DOUBLE ATTACK RECURSION ----------
      if (weapon.doubleAttack && !isRecursive) {
        handleAttack(weapon, true);
      }
    });

    setActors(newActors);

    if (newGold.length > 0) {
      setPendingGold((prev) => [...prev, ...newGold.map((g) => ({ amount: g }))]);
    }

    // ---------- COOLDOWN ----------
    if (!isRecursive && attackCooldown > 0) {
      setCooldowns((prev) => ({
        ...prev,
        [weapon.id]: attackCooldown,
      }));

      const interval = setInterval(() => {
        setCooldowns((prev) => {
          const timeLeft = prev[weapon.id];
          if (!timeLeft) {
            clearInterval(interval);
            return prev;
          }
          const newTime = timeLeft - 1;
          if (newTime <= 0) {
            clearInterval(interval);
            const { [weapon.id]: _, ...rest } = prev;
            return rest;
          }
          return { ...prev, [weapon.id]: newTime };
        });
      }, 1000);
    }
  };

  // ---------------------------------------------------
  // UNIVERSAL SPELL ATTACK
  // ---------------------------------------------------
  const handleSpell = (spell) => {
    if (!selectedActor) return alert("Select a target first!");
    if (character.mana < spell.manaCost) return alert("Not enough mana!");

    const newActors = [];
    const newGold = [];

    actors.forEach((actor) => {
      if (actor.instanceId !== selectedActor.instanceId) {
        newActors.push(actor);
        return;
      }

      // ---------- SPELL DAMAGE ----------
      let spellDamage =
        Math.floor(Math.random() * (spell.maxDamage - spell.minDamage + 1)) +
        spell.minDamage +
        (character.magic || 0);

      const weakness = actor["Element Weakness"];
      if (
        weakness &&
        spell.spellElement?.toLowerCase() === weakness.toLowerCase()
      ) {
        spellDamage *= 1.5;
      }

      const updatedHealth = actor.health - spellDamage;

      const id = Date.now() + Math.random();
      const slot = getSlotForActor?.(actor.instanceId);
      //console.log("spellDamage", spellDamage);

      setActorHealthPopups((prev) => [
        ...prev,
        {
          id,
          amount: spellDamage,
          slot,
        },
      ]);

      setTimeout(() => {
        setActorHealthPopups((prev) => prev.filter((p) => p.id !== id));
      }, 1000);

      // HIT FLASH
      setHitIds((prev) => [...prev, actor.instanceId]);
      setTimeout(
        () => setHitIds((prev) => prev.filter((id) => id !== actor.instanceId)),
        200
      );

      // DEATH
      if (updatedHealth <= 0) {
        const goldEarned =
          actor.gold ||
          Math.floor(Math.random() * (actor.maxGold - actor.minGold + 1)) +
            actor.minGold;

        const goldPopupId = Date.now() + Math.random();

        setGoldPopups(prev => [
          ...prev,
          {
            id: goldPopupId,
            amount: goldEarned,
            slot, // 👈 store where it died
          }
        ]);

        setTimeout(() => {
          setGoldPopups(prev => prev.filter(p => p.id !== id));
        }, 1000);

        newGold.push(goldEarned);

        if (getOnDeathSpawns) {
          const result = getOnDeathSpawns(actor);

          if (result?.spawns?.length) {
            newActors.push(...result.spawns);
          }

          if (result?.text && triggerBossEffectPopup) {
            triggerBossEffectPopup(result.text, actor.instanceId);
          }
        }

        //Boss death effects
        if (getOnDeath) {
          const popupText = getOnDeath(actor);

          if (popupText && triggerBossEffectPopup) {
            triggerBossEffectPopup(popupText, actor.instanceId);
          }
        }
      } else {
        newActors.push({ ...actor, health: updatedHealth });
      }
    });

    setActors(newActors);

    if (newGold.length > 0)
      setPendingGold((prev) => [...prev, ...newGold.map((g) => ({ amount: g }))]);

    // MANA COST
    setCharacter((prev) => ({
      ...prev,
      mana: Math.max(0, prev.mana - spell.manaCost),
    }));
  };

  const useShield = (shield) => {
    if (!shield) return alert("You don't have a shield equipped!");

    const id = shield.id;

    if (cooldowns[id]) {
        return alert(`${shield.name} is cooling down!`);
    }

    const now = Date.now();
    const activeUntil = now + 1000; // 1 second window

    //console.log(`[useShield] Shield active until ${activeUntil}`);

    // Mark shield active with expiry timestamp
    setCooldowns(prev => ({
        ...prev,
        activeShield: {
        id,
        expiresAt: activeUntil,
        }
    }));

    // Cleanup active flag AFTER expiry (visual/UI only)
    setTimeout(() => {
        setCooldowns(prev => {
        if (prev.activeShield?.id === id) {
            const { activeShield, ...rest } = prev;
            return rest;
        }
        return prev;
        });
    }, 1000);

    // Start cooldown AFTER shield ends
    const cd = Math.max(
      0,
      (shield.defenseCooldown || 5) - shieldCooldownReduction
    );

    setTimeout(() => {
        setCooldowns(prev => ({
        ...prev,
        [id]: cd
        }));

        const timer = setInterval(() => {
        setCooldowns(prev => {
            const time = prev[id];
            if (time <= 1) {
            clearInterval(timer);
            const { [id]: _, ...rest } = prev;
            return rest;
            }
            return { ...prev, [id]: time - 1 };
        });
        }, 1000);
    }, 1000);
    };

    const applyDirectDamageToAll = (amount) => {
      const newActors = [];
      const newGold = [];

      actors.forEach(actor => {
          const updatedHealth = actor.health - amount;
          const slot = getSlotForActor?.(actor.instanceId);
          const id = Date.now() + Math.random();

          setActorHealthPopups(prev => [
              ...prev,
              { id, amount, slot }
          ]);

          setTimeout(() => {
              setActorHealthPopups(prev => prev.filter(p => p.id !== id));
          }, 1000);

          if (updatedHealth <= 0) {
              const goldEarned = actor.gold || 
                  Math.floor(Math.random() * (actor.maxGold - actor.minGold + 1)) + actor.minGold;
                  
              newGold.push(goldEarned);

              if (getOnDeathSpawns) {
                  const result = getOnDeathSpawns(actor);
                  if (result?.spawns?.length) {
                      newActors.push(...result.spawns);
                  }
                  if (result?.text && triggerBossEffectPopup) {
                      triggerBossEffectPopup(result.text, actor.instanceId);
                  }
              }

              if (getOnDeath) {
                  const popupText = getOnDeath(actor);
                  if (popupText && triggerBossEffectPopup) {
                      triggerBossEffectPopup(popupText, actor.instanceId);
                  }
              }
          } else {
              newActors.push({ ...actor, health: updatedHealth });
          }
      });

      setActors(newActors);

      if (newGold.length > 0) {
          setPendingGold(prev => [
              ...prev,
              ...newGold.map(g => ({ amount: g }))
          ]);
      }
  };

  return { handleAttack, handleSpell, useShield, applyDirectDamageToAll };
}