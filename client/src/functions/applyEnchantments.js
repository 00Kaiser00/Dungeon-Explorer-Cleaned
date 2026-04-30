function applyEnchantment(weapon, enchantment) {
  const newWeapon = { ...weapon, enchantment };

  switch (enchantment.name) {
    // --- Attack Up ---
    case "Attack Up 1":
      newWeapon.minDamage += 1;
      newWeapon.maxDamage += 1;
      break;
    case "Attack Up 2":
      newWeapon.minDamage += 2;
      newWeapon.maxDamage += 2;
      break;
    case "Attack Up 3":
      newWeapon.minDamage += 3;
      newWeapon.maxDamage += 3;
      break;

    // --- Elemental Enchants ---
    case "Water Enchantment 1":
    case "Fire Enchantment 1":
    case "Earth Enchantment 1":
    case "Wind Enchantment 1":
    case "Ice Enchantment 1":
    case "Lightning Enchantment 1":
    case "Light Enchantment 1":
    case "Dark Enchantment 1":  
      newWeapon.elementalType = enchantment.name.split(" ")[0]; // e.g. "Fire"
      newWeapon.elementalDamage = 2; // flat elemental bonus
      break;

    case "Water Enchantment 2":
    case "Fire Enchantment 2":
    case "Earth Enchantment 2":
    case "Wind Enchantment 2":
    case "Ice Enchantment 2":
    case "Lightning Enchantment 2":
    case "Light Enchantment 2":
    case "Dark Enchantment 2":  
      newWeapon.elementalType = enchantment.name.split(" ")[0];
      newWeapon.elementalDamage = 4; // flat elemental bonus
      break;

    // --- Life Steal ---
    case "Life Steal 1":
      newWeapon.lifeSteal = 2;
      break;
    case "Life Steal 2":
      newWeapon.lifeSteal = 4;
      break;

    // --- Double Attack ---
    case "Double Attack":
      newWeapon.doubleAttack = true;
      break;

    // --- Cooldown Modifiers ---
    case "Half Cooldown 1":
      newWeapon.minDamage = Math.max(0, newWeapon.minDamage - 2);
      newWeapon.maxDamage = Math.max(0, newWeapon.maxDamage - 2);
      newWeapon.attackCooldown = Math.max(
        0.5,
        (newWeapon.attackCooldown || 1) / 2
      );
      break;

    case "Half Cooldown 2":
      newWeapon.attackCooldown = Math.max(
        0.5,
        (newWeapon.attackCooldown || 1) / 2
      );
      break;

    default:
      break;
  }

  return newWeapon;
}

export default applyEnchantment;