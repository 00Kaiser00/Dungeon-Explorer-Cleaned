import { useState, useEffect } from "react";

import useItemActions from "../functions/useItems";

const BattleUI = ({
  character,
  selectedEnemy,
  setSelectedEnemy,
  grid,
  enemyHitIds,
  playerHit,
  weapons,
  shield,
  spells,
  favoritedItem,
  showWeapons,
  showSpells,
  handleAttack,
  handleSpell,
  useShield,
  cooldowns,
  setShowWeapons,
  setShowSpells,
  battleStatus,
  goldPopups,
  healthPopups,
  bossEffectPopups,
  enemyHealthPopups,
  currentItems,
  setCurrentItems,
  setFavoritedItem,
  setCharacter,
  floor,
  enemyAttackTimers,
  bossShield,
  setTrapSaved,
  onUseCombatItem,
}) => {
  const { useFavoritedItem } = useItemActions({
    character,
    setCharacter,
    currentItems,
    setCurrentItems,
    favoritedItem,
    setFavoritedItem,
    setTrapSaved,
  });

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
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50">
      {/* Main Battle Box */}
      <div
        className={`relative w-[600px] h-[500px] p-6 border-4 border-yellow-300 rounded-lg shadow-2xl text-white text-center bg-cover bg-center
        ${playerHit ? "animate-shake" : ""}`}
        style={{
        backgroundImage: dungeonTileImg
            ? `url(${encodeURI(dungeonTileImg)})`
            : "none",
        }}
      >
        <p className="text-3xl font-bold mb-2 text-yellow-300 drop-shadow-lg">Fight</p>
        <hr className="border-white mb-4 opacity-70" />

        {/* Victory / Defeat */}
        {battleStatus === "victory" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 text-green-400 text-5xl font-bold">
            Victory!
          </div>
        )}
        {battleStatus === "defeat" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 text-red-400 text-5xl font-bold">
            You Died...
          </div>
        )}

        {/* Enemy Grid */}
        <div className="grid grid-cols-3 gap-4">
          {grid.map((enemy, index) => (
            <div key={`${enemy?.instanceId || "empty"}-${index}`} className="relative flex flex-col items-center">
              {enemy ? (
                <div
                  className={`group cursor-pointer transition duration-150 ${
                    selectedEnemy?.instanceId === enemy.instanceId ? "ring-4 ring-yellow-400 rounded-lg" : ""
                  } ${enemyHitIds.includes(enemy.instanceId) ? "bg-red-500/50 rounded-lg" : ""}`}
                  onClick={() => setSelectedEnemy(enemy)}
                >
                  {/* Attack Countdown */}
                  {enemyAttackTimers && enemyAttackTimers[enemy.instanceId] !== undefined && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-yellow-300 font-bold text-lg">
                    {enemyAttackTimers[enemy.instanceId] === 0
                        ? <img src="/Pixel Art/Misc/Damage.png" alt="Attack" className="h-12 w-12" />
                        : `${enemyAttackTimers[enemy.instanceId]}s`}
                  </div>
                  )}

                  {/* BOSS SHIELD ICON */}
                  {enemy &&
                    bossShield?.[enemy.instanceId]?.activeUntil > Date.now() && (
                      <img
                        src="/Pixel Art/Misc/Boss Shield.png"
                        alt="Boss Shield"
                        className="absolute -top-16 left-1/2 transform -translate-x-1/2 
                                  h-12 w-12 drop-shadow-lg animate-pulse"
                      />
                  )}

                  <img
                    src={enemy.img}
                    alt={enemy.name}
                    className="w-24 h-24 mx-auto transition-transform group-hover:scale-110"
                  />

                  <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-black bg-opacity-80 text-yellow-300 p-2 rounded-lg text-sm">
                    <p className="font-bold">{enemy.name}</p>
                    <div className="flex items-center mb-2">
                        <img src="/Pixel Art/Misc/Heart.png" alt="Heart" className="h-12 w-12" />
                        <p className="font-bold">{enemy.health}</p>
                    </div>

                    <div className="flex items-center mb-2">
                        <img src="/Pixel Art/Misc/Damage.png" alt="Damage" className="h-12 w-12" />
                        <p className="font-bold">{enemy.damage}</p>
                    </div>

                    <div className="flex items-center mb-2">
                        <img src="/Pixel Art/Misc/Clock.png" alt="Cooldown" className="h-12 w-12" />
                        <p className="font-bold">{enemy["attack cooldown"]}s</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-24 h-24"></div>
              )}
            </div>
          ))}
        </div>

        {/* GOLD POPUPS */}
        <div className="absolute inset-0 pointer-events-none">
          {goldPopups.map(popup => {
            const leftPercent = popup.slot != null
              ? popup.slot * 33 + 16
              : 50;

            return (
              <div
                key={popup.id}
                className="absolute text-yellow-300 font-bold animate-fall"
                style={{
                  left: `${leftPercent}%`,
                  top: "38%",
                  transform: "translateX(-50%)",
                }}
              >
                +{popup.amount}💰
              </div>
            );
          })}
        </div>

        {/* Enemy Health POPUPS */}
        <div className="absolute inset-0 pointer-events-none">
          {enemyHealthPopups.map(popup => {
            const leftPercent = popup.slot != null
              ? popup.slot * 33 + 16
              : 50;

            return (
              <div
                key={popup.id}
                className="absolute font-bold animate-fall"
                style={{
                  left: `${leftPercent}%`,
                  top: "38%",
                  transform: "translateX(-50%)",
                }}
              >
                <div
                    className={`font-bold animate-fall ${
                      popup.amount > 0 ? "text-red-500" : "text-white"
                    }`}
                  >
                    {popup.amount > 0 ? `-${popup.amount}` : "Blocked"}
                  </div>
              </div>
            );
          })}
        </div>

        {/* BOSS EFFECT POPUPS */}
        <div className="absolute inset-0 pointer-events-none">
          {bossEffectPopups?.map(popup => {
            const leftPercent = popup.slot != null
              ? popup.slot * 33 + 16
              : 50;

            return (
              <div
                key={popup.id}
                className="absolute text-yellow-300 font-bold animate-fall"
                style={{
                  left: `${leftPercent}%`,
                  top: "38%",
                  transform: "translateX(-50%)",
                }}
              >
                {popup.text}
              </div>
            );
          })}
        </div>

        {/* Player */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <p></p>
          <div className={`relative transition duration-150 ${playerHit ? "bg-white/50 rounded-lg" : ""}`}>
            {/* SHIELD ICON WHEN ACTIVE */}
            {shield &&
            cooldowns.activeShield?.id === shield.id &&
            cooldowns.activeShield.expiresAt > Date.now() && (
            <img
                src="/Pixel Art/Misc/Boss Shield.png"
                alt="Shield"
                className="absolute -top-14 left-1/2 transform -translate-x-1/2 
                        h-12 w-12 drop-shadow-lg"
            />
            )}

            <img src={character.img} alt="Character" className="w-32 h-32 mx-auto" />

            {/* Health Popup */}
            <div className="absolute inset-0 pointer-events-none">
              {healthPopups.map(popup => (
                <div
                  key={popup.id}
                  className="absolute left-1/2 top-40"
                  style={{ transform: "translateX(-50%)" }}
                >
                  <div
                    className={`font-bold animate-fall ${
                      popup.damage > 0 ? "text-red-500" : "text-white"
                    }`}
                  >
                    {popup.damage > 0 ? `-${popup.damage}` : "Blocked"}
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-yellow-300 text-sm">
                <div className="flex items-center mb-1">
                    <img src="/Pixel Art/Misc/Heart.png" alt="Heart" className="h-10 w-10" />
                    <p className="text-red-700 ml-1">{character.health} / {character.maxHealth}</p>
                </div>
                <div className="flex items-center mb-1">
                    <img src="/Pixel Art/Misc/Blue Star.png" alt="Mana" className="h-10 w-10" />
                    <p className="text-blue-700 ml-1">{character.mana} / {character.maxMana}</p>
                </div>
            </div>
          </div>
          <p></p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4 mt-20">
          <button
            onClick={() => { setShowWeapons(true); setShowSpells(false); }}
            className={`bg-white text-black font-bold py-2 px-4 hover:bg-gray-200 ${showWeapons ? "ring-4 ring-yellow-300" : ""}`}
          >
            Weapons
          </button>
          <button
            onClick={() => { setShowWeapons(false); setShowSpells(true); }}
            className={`bg-white text-black font-bold py-2 px-4 hover:bg-gray-200 ${showSpells ? "ring-4 ring-yellow-300" : ""}`}
          >
            Spells
          </button>
        </div>
      </div>

      {/* Sheild/ Weapons / Spells / Favorited */}
      <div className="flex gap-4 mt-6">
        {/* Shield */} 
        <div className="relative p-6 w-[300px] border-4 border-yellow-300 rounded-lg shadow-2xl text-white text-center bg-cover bg-center" 
        style={{ backgroundImage: "url('/Pixel Art/Tiles/Dungeon Tile.png')" }} > 
            {shield !== null ? (
                <div>
                    <p className="text-xl font-bold text-yellow-300 mb-2">Shield</p> 
                    <div className="bg-gray-800 rounded-xl p-4 w-28 h-28 mx-auto flex items-center justify-center">
                        <button
                            onClick={() => useShield(shield)}
                            disabled={!!cooldowns[shield.id]}
                            className={`bg-gray-800 rounded-xl p-4 w-28 h-28 mx-auto
                                ${cooldowns[shield.id] ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                            <img
                                src={shield.img}
                                alt={shield.name}
                                className="w-full h-full object-contain"
                            />
                        </button>

                        {cooldowns[shield.id] && (
                        <p className="text-sm text-red-400 mt-1">
                            {cooldowns[shield.id]}s
                        </p>
                        )}
                    </div>
                </div>
                ) : (
                <p className="text-xl font-bold text-yellow-300 mb-2">You have no shield</p>
                )
            }
        </div> 

        <div className="relative p-6 w-[600px] border-4 border-yellow-300 rounded-lg shadow-2xl text-white text-center bg-cover bg-center"
         style={{ backgroundImage: "url('/Pixel Art/Tiles/Dungeon Tile.png')" }}
        > 
          {/* Weapons */}
          {showWeapons && weapons.length > 0 && (
            <div className="mt-6 bg-black bg-opacity-60 border-2 border-yellow-400 rounded-lg p-3 max-h-[120px] overflow-y-auto scrollbar-hide">
              <p className="text-xl font-bold text-yellow-300 mb-2">Your Weapons</p>
              <div className="flex flex-col gap-2">
                {weapons.map((weapon) => (
                  <div
                    key={weapon.id}
                    className={`flex items-center justify-between gap-4 bg-gray-800 bg-opacity-60 rounded-lg p-2 ${
                      cooldowns[weapon.id] ? "opacity-50" : "hover:bg-gray-700"
                    } transition cursor-pointer`}
                    onClick={() => handleAttack(weapon)}
                  >
                    <div className="flex items-center gap-3">
                      <img src={weapon.img} alt={weapon.name} className="w-10 h-10 object-contain" />
                      <div className="text-left">
                        <p className="font-bold text-sm text-yellow-300">{weapon.name}</p>
                        <p className="text-xs">⚔️ {weapon.minDamage} - {weapon.maxDamage} dmg</p>
                        <p className="text-xs">🔹 Type: {weapon.weaponType || "None"}</p>
                        <p className="text-xs">⏱️ Cooldown: {weapon.attackCooldown || 0}s</p>
                        {weapon.enchantment && (
                          <>
                            <p className="text-blue-400 mt-1 text-xs">✨ {weapon.enchantment.name}</p>
                            <p className="text-gray-400 text-xs italic">{weapon.enchantment.description}</p>
                          </>
                        )}
                      </div>
                    </div>
                    {cooldowns[weapon.id] && <p className="text-red-400 text-sm">{cooldowns[weapon.id]}s</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spells */}
          {showSpells && spells.length > 0 && (
            <div className="mt-6 bg-black bg-opacity-60 border-2 border-yellow-400 rounded-lg p-3 max-h-[120px] overflow-y-auto scrollbar-hide">
              <p className="text-xl font-bold text-yellow-300 mb-2">Your Spells</p>
              <div className="flex flex-col gap-2">
                {spells.map((spell) => (
                  <div
                    key={spell.id}
                    className={`flex items-center justify-between gap-4 bg-gray-800 bg-opacity-60 rounded-lg p-2 hover:bg-gray-700 transition cursor-pointer`}
                    onClick={() => handleSpell(spell)}
                  >
                    <div className="flex items-center gap-3">
                      <img src={spell.img} alt={spell.name} className="w-10 h-10 object-contain" />
                      <div className="text-left">
                        <p className="font-bold text-sm text-yellow-300">{spell.name}</p>
                        <p className="text-xs">⚔️ {spell.minDamage} - {spell.maxDamage} dmg</p>
                        <p className="text-xs">🔹 Element {spell.spellElement}</p>
                        <p className="text-xs">🔹Mana Cost: {spell.manaCost}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Favorited Item */} 
        <div className="relative p-6 w-[300px] border-4 border-yellow-300 rounded-lg shadow-2xl text-white text-center bg-cover bg-center" 
        style={{ backgroundImage: "url('/Pixel Art/Tiles/Dungeon Tile.png')" }} > 
            {favoritedItem ? (
                <div>
                    <p className="text-xl font-bold text-yellow-300 mb-2">Your Favorited Item</p> 
                    <div className="bg-gray-800 rounded-xl p-4 w-28 h-28 mx-auto flex items-center justify-center" onClick={() => {
                      if (favoritedItem?.type === "Combat") {
                        onUseCombatItem(favoritedItem);
                      } else {
                        useFavoritedItem();
                      }
                    }}>
                        <img
                        src={favoritedItem.img}
                        alt={favoritedItem.name}
                        className="w-full h-full object-contain"
                        />
                    </div>
                </div>
                ) : (
                <p className="text-xl font-bold text-yellow-300 mb-2">You have no favorited item</p> 
                )}
        </div>
      </div>
    </div>
  );
};

export default BattleUI;