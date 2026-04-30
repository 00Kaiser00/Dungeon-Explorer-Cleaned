import { useCallback } from "react";

export default function useItemActions({
  character,
  setCharacter,
  currentItems,
  setCurrentItems,
  favoritedItem,
  setFavoritedItem,
  setTrapSaved,
}) {
  // --------------------------------------------
  // INTERNAL: apply item effects (shared logic)
  // --------------------------------------------
  const applyItemEffects = (item, updatedCharacter) => {
    switch (item.name) {
      case "Health Potion":
        if (updatedCharacter.health >= updatedCharacter.maxHealth) {
          alert("Health is already full!");
          return false;
        }
        updatedCharacter.health = Math.min(
          updatedCharacter.health + 5,
          updatedCharacter.maxHealth
        );
        break;

      case "Big Health Potion":
        if (updatedCharacter.health >= updatedCharacter.maxHealth) {
          alert("Health is already full!");
          return false;
        }
        updatedCharacter.health = Math.min(
          updatedCharacter.health + 10,
          updatedCharacter.maxHealth
        );
        break;

      case "Mana Potion":
        if (updatedCharacter.mana >= updatedCharacter.maxMana) {
          alert("Mana is already full!");
          return false;
        }
        updatedCharacter.mana = Math.min(
          updatedCharacter.mana + 2,
          updatedCharacter.maxMana
        );
        break;

      case "Big Mana Potion":
        if (updatedCharacter.mana >= updatedCharacter.maxMana) {
          alert("Mana is already full!");
          return false;
        }
        updatedCharacter.mana = Math.min(
          updatedCharacter.mana + 5,
          updatedCharacter.maxMana
        );
        break;

      case "Bear Potion":
        updatedCharacter.attack += 2;
        updatedCharacter.maxHealth += 5;
        updatedCharacter.health += 5;
        updatedCharacter.img = "/Pixel Art/Misc/Bear.png";
        break;

      case "Turtle Potion":
        updatedCharacter.defense += 2;
        updatedCharacter.maxHealth += 5;
        updatedCharacter.health += 5;
        updatedCharacter.img = "/Pixel Art/Misc/Franklin-Right.png";
        break;

      case "Cat Potion":
        updatedCharacter.magic += 4;
        updatedCharacter.maxMana += 1;
        updatedCharacter.mana += 1;
        updatedCharacter.img = "/Pixel Art/Misc/Cat.png";
        break;

      case "Lizard Potion":
        updatedCharacter.maxHealth += 15;
        updatedCharacter.health += 15;
        updatedCharacter.img = "/Pixel Art/Misc/Lizard.png";
        break;

      case "Danger Sense Potion":
        setTrapSaved(true);
        break;  

      default:
        alert("Unknown item effect!");
        return false;
    }

    return true;
  };

  // --------------------------------------------
  // USE ITEM (by index)
  // --------------------------------------------
  const useItem = useCallback(
    (index) => {
      const item = currentItems[index];
      if (!item || !item.cost) return;

      let updatedCharacter = { ...character };

      const ok = applyItemEffects(item, updatedCharacter);
      if (!ok) return;

      const updatedItems = currentItems.filter((_, i) => i !== index);

      setCharacter(updatedCharacter);
      setCurrentItems(updatedItems);

      alert(`${item.name} used!`);
    },
    [character, currentItems]
  );

  // --------------------------------------------
  // USE FAVORITED ITEM (by ID)
  // --------------------------------------------
  const useFavoritedItem = useCallback(() => {
    if (!favoritedItem || !favoritedItem.id) return;

    // find the item inside the inventory
    const index = currentItems.findIndex((i) => i.id === favoritedItem.id);
    if (index === -1) {
      alert("Favorited item not found!");
      return;
    }

    const item = currentItems[index];
    if (!item.cost) return;

    let updatedCharacter = { ...character };

    const ok = applyItemEffects(item, updatedCharacter);
    if (!ok) return;

    // remove the item by ID
    const updatedItems = currentItems.filter((i) => i.id !== item.id);

    setCharacter(updatedCharacter);
    setCurrentItems(updatedItems);

    // clear favorite
    setFavoritedItem(null);

    alert(`${item.name} used!`);
  }, [
    favoritedItem,
    character,
    currentItems,
    setCharacter,
    setCurrentItems,
    setFavoritedItem,
  ]);

  return { useItem, useFavoritedItem };
}
