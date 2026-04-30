import { useState } from "react";

function HelpScreen({ onClose }) {
  const helpContent = {
    Stats: [
        {
            title: "Health",
            content: "Your Health represents your endurance in battle. It indicates how much damage you can withstand before falling in combat.",
            image: "/Pixel Art/Misc/Heart.png"
        },
        {
            title: "Mana",
            content: "Your Mana is the source of your magical power. Each spell requires a certain amount of mana to cast, so manage it wisely!",
            image: "/Pixel Art/Misc/Blue Star.png"
        },
        {
            title: "Attack",
            content: "Your Attack stat increases the damage you inflict on enemies. For instance, if your weapon deals 2-3 damage and your attack is 1, you'll inflict 3-4 damage total.",
            image: "/Pixel Art/Misc/Damage.png"
        },
        {
            title: "Magic Attack",
            content: "Your Magic Attack enhances the power of your spells. If a spell does 3-4 magic damage and your magic attack is 2, you'll deal 5-6 magic damage.",
            image: "/Pixel Art/Misc/Magic Attack.png"
        },
        {
            title: "Defense",
            content: "Your Defense reduces the damage taken from enemy attacks. For example, if an enemy with an attack power of 1 strikes you and you have 1 defense, you'll take 0 damage. However, if the enemy's attack is 2, and you have 1 defense, you'll take 1 damage.",
            image: "/Pixel Art/Shield/Shield.png"
        }
    ],
    Items: [
        {
            title: "Inventory",
            content: "Access your inventory by clicking the bag icon. Here, you’ll find your Weapons, Shields, Normal Items, and Combat Items. Remember, you can carry a maximum of 9 items at a time.",
            image: "/Pixel Art/Misc/Backpack.png.png"
        },
        {
            title: "Gold",
            content: "Gold is collected throughout the game by defeating enemies and bosses. It can be used to purchase items and upgrade your stats.",
            image: "/Pixel Art/Misc/Coin.png.png"
        },
        {
            title: "Rarity",
            content: "Each Weapon, Shield, and Enchantment has a rarity that reflects its quality and value. Higher rarity means more powerful items. The rarity tiers are as follows: Common (White), Uncommon (Green), Rare (Blue), Epic (Purple), and Legendary (Orange).",
            image: "/Pixel Art/Sword/Sword Rare 2.png"
        },
        {
            title: "Weapons",
            content: "Weapons are essential for attacking enemies. Each weapon has a specific damage range and cooldown period, and some may even come with rare enchantments that add unique abilities. Click on a weapon to view its description. You can carry a maximum of three weapons at a time. For further details, visit the Combat tab.",
            image: "/Pixel Art/Sword/Sword.png"
        },
        {
            title: "Shields",
            content: "Shields mitigate incoming damage based on their rarity. Each shield has a cooldown of five seconds, so use them wisely! Click on a shield to see its description. You can only carry one shield at a time. For more information, check the Combat tab.",
            image: "/Pixel Art/Shield/Shield.png"
        },
        {
            title: "Normal Items",
            content: "Normal Items provide various effects outside of combat, except for health and mana potions, which can be used during combat as well. Click on an item to view its description.",
            image: "/Pixel Art/Misc/Health Potion.png"
        },
        {
            title: "Combat Items",
            content: "Combat Items trigger various effects in battles. Note that the Corrosion Potion can only be used on bosses, as only they have shields. Click on an item to see its description.",
            image: "/Pixel Art/Misc/Fire Bomb.png"
        },
        {
            title: "Using Items",
            content: "To see an item's description and effects, click on it. From there, you can use a Normal Item, sell it, or exit the description. To use a Combat Item, first mark it as a favorite by clicking the empty star, then you can deploy it in combat.",
            image: "/Pixel Art/Misc/Description Example.png"
        }
    ],
    Spells: [
      {
        title: "Spell Book",
        content: "To access your spellbook, click the spellbook icon. Here, you can explore your spells and opt to forget older ones. Remember, you can only hold a maximum of 5 spells at any given time.",
        image: "/Pixel Art/Misc/Open Book.png"
      },
      {
        title: "Spells",
        content: "Spells provide a powerful means to inflict damage on enemies. Unlike weapons, spells do not have cooldown periods; however, they do come with a mana cost. Spells typically have greater power than weapons. Click on any spell to view its detailed description. For further information, consult the Combat tab.",
        image: "/Pixel Art/Misc/Spell Example.png"
      },
      {
        title: "Elements",
        content: "Each spell is associated with one of the following elements: Fire, Water, Wind, Earth, Ice, Lightning, Dark, and Light. Every enemy or boss has a specific elemental weakness. Click on an element to view its details. For more insights, refer to the Combat tab.",
        image: "/Pixel Art/Misc/Light Element.png"
      }
    ],
    Tiles: [
        {
            title: "Tiles",
            content: "Tiles are the foundation of your dungeon adventure! On the main screen, you'll encounter a grid of black tiles, representing the dungeon's floors. Click on these tiles to uncover their identity and effects. Each floor has its own set of tiles and aesthetics.",
            image: "/Pixel Art/Misc/Grid Example.png"
        },
        {
            title: "Dungeon Tiles",
            content: "These Dungeon Tiles are standard tiles with no special effects, forming the basic layout of the dungeon.",
            image: "/Pixel Art/Tiles/Grass Tile.png"
        },
        {
            title: "Treasure Tiles",
            content: "Treasure Tiles hold a random weapon or shield. The rarity of the items scales with the floor you're on.",
            image: "/Pixel Art/Tiles/Grass Treasure Tile.png"
        },
        {
            title: "Shop Tiles",
            content: "Shop Tiles provide an opportunity to purchase normal or combat items from the Goblin Merchant using your gold. You can also re-roll the shop by clciking on the re-roll button, which costs 5 gold.",
            image: "/Pixel Art/Tiles/Grass Shop Tile.png"
        },
        {
            title: "Rest Tiles",
            content: "Rest Tiles allow you to recuperate, restoring both your health and mana. A crucial spot for recovery during your journey!",
            image: "/Pixel Art/Tiles/Grass Rest Tile.png"
        },
        {
            title: "Library Tiles",
            content: "Library Tiles offer the chance to learn a random spell, with rarity tied to the floor level. Expand your magical repertoire!",
            image: "/Pixel Art/Tiles/Grass Library Tile.png"
        },
        {
            title: "Trap Tiles",
            content: "Trap Tiles contain traps that become more severe with each passing floor. Use a Danger Sense Potion before stepping on these to avoid mishaps!",
            image: "/Pixel Art/Tiles/Grass Trap Tile.png"
        },
        {
            title: "Enemy Tiles",
            content: "Enemy Tiles challenge you with 1-2 enemies, whose strength increases as you descend through the dungeon.",
            image: "/Pixel Art/Tiles/Grass Enemy Tile.png"
        },
        {
            title: "Boss Tiles",
            content: "Boss Tiles feature powerful bosses, with increasing strength. Each boss comes with its own unique skills and a protective shield.",
            image: "/Pixel Art/Tiles/Grass Boss Tile.png"
        },
        {
            title: "Training Tiles",
            content: "Training Tiles enable you to improve your stats by spending gold. Each stat offers different boosts: Health adds 5, Mana adds 2, Attack adds 1, Magic Attack adds 2, and Defense adds 1.",
            image: "/Pixel Art/Tiles/Grass Training Tile.png"
        },
        {
            title: "Druid Tiles",
            content: "Druid Tiles grant you the ability to permanently change your form, each offering unique stat bonuses. There is only one Druid Tile, located on the fourth floor.",
            image: "/Pixel Art/Tiles/Mossy Dungeon Druid Tile.png"
        },
        {
            title: "Stairs Tiles",
            content: "Stairs Tiles appear after you defeat the floor's boss, guiding you to the next level of the dungeon.",
            image: "/Pixel Art/Tiles/Grass Stairs Tile.png"
        }
    ],
    Combat: [
        {
            title: "Combat",
            content: "In Dungeon Explorer, combat unfolds in real time. Engage enemies by attacking, casting spells, and using items on the fly. Be prepared, as enemies and bosses will also strike back in real time!",
            image: "/Pixel Art/Misc/Battle Example 2.png"
        },
        {
            title: "Selecting Enemies / Bosses",
            content: "To focus your attacks, simply click on an enemy or boss. The selected target will be highlighted, allowing you to unleash your weapons and spells on them.",
            image: "/Pixel Art/Misc/Selected Enemy Example.png"
        },
        {
            title: "Enemies",
            content: "Enemies possess various stats, including health, damage, and attack cooldown. Each enemy has a designated weapon and elemental weakness. Exploit their weaknesses to deal 1.5x damage! The attack cooldown dictates how often they can strike—if it’s 3 seconds, they can attack once every 3 seconds. Hover over enemies during battle to reveal their stats!",
            image: "/Pixel Art/Enemies/Gray Slime.png"
        },
        {
            title: "Bosses",
            content: "Bosses come equipped with health, damage, attack cooldown, and unique mechanics such as shield cooldowns and special skills. Like regular enemies, they also have weapon and elemental weaknesses, allowing you to deal 1.5x damage when attacked effectively. Their shield cooldown is randomized between a minimum and maximum value. To check their stats, hover over them in combat.",
            image: "/Pixel Art/Bosses/Multi Slime.png"
        },
        {
            title: "Weapons",
            content: "Use weapons to deal damage to selected targets. After an attack, that weapon will enter cooldown, but you can switch to another weapon in the meantime.",
            image: "/Pixel Art/Sword/Sword.png"
        },
        {
            title: "Shields",
            content: "Shields activate in real time, blocking a percentage of incoming damage based on their rarity. Once used, they enter a 5-second cooldown, preventing further use during that time.",
            image: "/Pixel Art/Shield/Shield.png"
        },
        {
            title: "Spells",
            content: "You can cast spells to inflict damage without the restriction of cooldowns, although casting spells does cost mana.",
            image: "/Pixel Art/Misc/Ice Element.png"
        },
        {
            title: "Items",
            content: "During combat, use items to heal yourself, restore mana, deal damage, reduce damage taken, shorten weapon cooldowns, and more!",
            image: "/Pixel Art/Misc/Fire Bomb.png"
        },
        {
            title: "Revive",
            content: "You have one revive per game, activated upon your death. This will restore both your health and mana to maximum, while resetting the health of enemies or bosses back to full.",
            image: "/Pixel Art/Misc/Revive Example.png"
        }
    ],
  };

  const tabs = Object.keys(helpContent);

  const [activeTab, setActiveTab] = useState("Stats");
  const [pageIndex, setPageIndex] = useState(0);

  const currentPages = helpContent[activeTab];
  const currentPage = currentPages[pageIndex];

  const goNext = () => {
    if (pageIndex < currentPages.length - 1) {
      setPageIndex(prev => prev + 1);
    }
  };

  const goPrev = () => {
    if (pageIndex > 0) {
      setPageIndex(prev => prev - 1);
    }
  };

  const canGoNext = pageIndex < currentPages.length - 1;
  const canGoPrev = pageIndex > 0;

  const changeTab = (tab) => {
    setActiveTab(tab);
    setPageIndex(0); // reset to first page when switching tabs
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="relative w-[800px] h-[650px] p-6 text-black text-center bg-no-repeat bg-center"
        style={{
          backgroundImage: "url('/Pixel Art/Misc/Spell Book.png')",
          backgroundSize: "100% 100%"
        }}
      >
        {/* ===== TABS ===== */}
        <div className="absolute top-10 left-0 right-0 flex justify-center gap-4">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => changeTab(tab)}
              className={`px-4 py-2 font-bold ${
                activeTab === tab
                  ? "text-yellow-500"
                  : "text-yellow-300 hover:text-yellow-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ===== PAGE CONTENT ===== */}
        <h1 className="text-3xl font-bold mt-32 text-yellow-500">
          {currentPage.title}
        </h1>

        <div className="mt-6 px-16 flex items-center justify-center gap-8">
            {/* IMAGE (if exists) */}
            {currentPage.image && (
                <img
                src={currentPage.image}
                alt={currentPage.title}
                className="w-40 h-40 object-contain"
                />
            )}

            {/* TEXT */}
            <p className="text-lg whitespace-pre-line max-w-md text-left">
                {currentPage.content}
            </p>
        </div>

        {/* ===== LEFT ARROW ===== */}
        <button
          onClick={goPrev}
          disabled={!canGoPrev}
          className="absolute left-[-70px] top-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
        >
          <img
            src={
              canGoPrev
                ? "/Pixel Art/Misc/Left Arrow Button.png"
                : "/Pixel Art/Misc/Gray Left Arrow Button.png"
            }
            alt="Previous"
            className="w-16 h-16"
          />
        </button>

        {/* ===== RIGHT ARROW ===== */}
        <button
          onClick={goNext}
          disabled={!canGoNext}
          className="absolute right-[-70px] top-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
        >
          <img
            src={
              canGoNext
                ? "/Pixel Art/Misc/Right Arrow Button.png"
                : "/Pixel Art/Misc/Gray Right Arrow Button.png"
            }
            alt="Next"
            className="w-16 h-16"
          />
        </button>

        {/* ===== CLOSE BUTTON ===== */}
        <button
          onClick={onClose}
          className="absolute bottom-4 right-4 hover:scale-110 transition-transform w-52 h-20"
        >
          <img
            src="/Pixel Art/Misc/Rectangular Button.png"
            alt="Close"
            className="w-full h-full"
          />
          <span className="absolute inset-0 flex items-center justify-center text-black font-bold text-lg pointer-events-none">
            Close
          </span>
        </button>
      </div>
    </div>
  );
}

export default HelpScreen;