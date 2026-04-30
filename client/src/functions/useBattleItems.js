import { useState, useEffect } from "react";

export default function useCombatItems({
  battleStatus,
}) {
  // Temporary encounter modifiers
  const [tempAttackCooldownIncrease, setTempAttackCooldownIncrease] = useState(0);
  const [tempDamageReduction, setTempDamageReduction] = useState(0);
  const [shieldReductionModifier, setShieldReductionModifier] = useState(0);
  const [poisonStacks, setPoisonStacks] = useState(0);
  const [shieldCooldownReduction, setShieldCooldownReduction] = useState(0);
  const [weaponCooldownReduction, setWeaponCooldownReduction] = useState(0);

    useEffect(() => {
        if (battleStatus === "victory" || battleStatus === "defeat") {
        setTempAttackCooldownIncrease(0);
        setTempDamageReduction(0);
        setShieldReductionModifier(0);
        setPoisonStacks(0);
        }
    }, [battleStatus]);

  const useCombatItem = (item) => {
    switch (item.name) {
        case "Slow Potion":
            setTempAttackCooldownIncrease(prev => prev + 1);
            break;

        case "Barrier Potion":
            setTempDamageReduction(0.2);
            break;    

        case "Corrosion Potion":
            setShieldReductionModifier(prev => prev + 0.05);
            break;    

        case "Fire Bomb":
            // Handled in boss/enemy logic
            break;

        case "Poison Potion":
            setPoisonStacks(4); // 4 attack triggers
            break;    

        case "Acceleration Potion":
            setShieldCooldownReduction(prev => prev + 1);
            break;  
            
        case "Fury Potion":
            setWeaponCooldownReduction(prev => prev + 1);
            break;       

        default:
            break;
    }
  };

  return {
    tempAttackCooldownIncrease,
    tempDamageReduction,
    shieldReductionModifier,
    poisonStacks,
    setPoisonStacks,
    shieldCooldownReduction,
    weaponCooldownReduction,
    useCombatItem,
  };
}