
/* V232:
 * SOUR DIESEL / SMOG RUSH: The original second move (35 stamina, 21 base
 * damage) is now called Smog Rush. On a landed attack it applies SMOG,
 * a persistent -10 HP at the end of each completed turn until that target
 * chooses REST. Neither repeat Smog Rush hits nor switching stack it.
 * REST purges smog along with existing Fumes and Burn.
 *
 * RS-11 / OVERCLOCK CORE: fourth move (55 stamina, 44 base damage).
 * After a successful hit, ALWAYS roll the same 25% chance (independent of
 * the combatants' levels) to enable +15 FINAL damage for subsequent RS-11
 * attacks for the battle. Does not stack. RS-11's REST removes the boost.
 * Player and opponent strains obey identical status rules.
 */
const V232_SMOG_DAMAGE=10;
const V232_OVERCLOCK_BONUS=15;
const V232_OVERCLOCK_CHANCE=.25;
function v232OverclockStore(){
 if(!battle)return null;
 if(!battle._v232Overclock)battle._v232Overclock={player:Object.create(null),enemy:false};
 return battle._v232Overclock;
}
function v232OverclockEnabled(side,id){
 const store=v232OverclockStore();
 return !!(store&&(side==='enemy'?store.enemy:store.player[id]));
}
function v232SetOverclock(side,id,active){
 if(!battle)return;
 const store=v232OverclockStore();
 if(side==='enemy')store.enemy=!!active;
 else store.player[id]=!!active;
}
function v232ApplySmog(side,id,level){
 if(!battle)return;
 const statuses=side==='enemy'?v230Debuffs().enemy:v230PlayerDebuffs(id);
 statuses.smog=v236Dot(level,10);
}
// Only actual affordable moves can arm either effect; other actions reset.
const v232PreviousBattleAction=battleAction;
battleAction=function(action){
 if(battle&&!battle.busy){
  const id=team[battle.active],i=Number(action);
  const valid=Number.isInteger(i)&&i>=0&&i<4&&staminaPlayerValue(id)>=STAMINA_MOVE_COSTS[i];
  battle._v232PlayerSmogArmed=!!(valid&&id==='sourdiesel'&&i===1&&currentMove(id,i)[0]==='Smog Rush');
  battle._v232PlayerOverclockArmed=!!(valid&&id==='rs11'&&i===3&&currentMove(id,i)[0]==='Overclock Core');
 }
 return v232PreviousBattleAction(action);
};
const v232PreviousPlayerResolver=v152ResolvePlayerAttack;
v152ResolvePlayerAttack=function(attackerId,defenderId,attackerLevel,defenderLevel,base){
 const smog=!!(battle&&battle._v232PlayerSmogArmed&&attackerId==='sourdiesel');
 const overclock=!!(battle&&battle._v232PlayerOverclockArmed&&attackerId==='rs11');
 const boosted=!!(battle&&attackerId==='rs11'&&v232OverclockEnabled('player',attackerId));
 if(battle){battle._v232PlayerSmogArmed=false;battle._v232PlayerOverclockArmed=false;}
 const hit=v232PreviousPlayerResolver(attackerId,defenderId,attackerLevel,defenderLevel,base);
 if(!battle||hit.dodged||hit.damage<=0)return hit;
 if(boosted){
  hit.damage+=v236OverclockBonus(attackerLevel);
  hit.note=((hit.note||'')+` ⚙️ OVERCLOCK +${v236OverclockBonus(attackerLevel)}!`).trim();
 }
 if(smog){
  v232ApplySmog('enemy',null,attackerLevel);
  hit.note=((hit.note||'')+` 🌫️ SMOG! -${v236Dot(attackerLevel,10)} HP per round until REST!`).trim();
  hit.smogRushApplied=true;
 }
 if(overclock&&Math.random()<V232_OVERCLOCK_CHANCE){
  v232SetOverclock('player',attackerId,true);
  hit.note=((hit.note||'')+` ⚙️ OVERCLOCK ACTIVATED! RS-11 attacks +${v236OverclockBonus(attackerLevel)} until REST!`).trim();
  hit.overclockApplied=true;
 }
 return hit;
};
// Enemy chooser handles all trainer/wild battle types, including exhaustion.
const v232PreviousEnemyChooser=staminaChooseEnemyIndex;
staminaChooseEnemyIndex=function(options){
 const index=v232PreviousEnemyChooser(options);
 if(battle){
  battle._v232EnemySmogArmed=!!(index===1&&battle.enemy.id==='sourdiesel'&&options[index]?.[0]==='Smog Rush');
  battle._v232EnemyOverclockArmed=!!(index===3&&battle.enemy.id==='rs11'&&options[index]?.[0]==='Overclock Core');
  if(index<0&&battle._staminaEnemyRested&&!battle._v228SkipInProgress&&battle.enemy.id==='rs11'){
   if(v232OverclockEnabled('enemy')){
    v232SetOverclock('enemy',null,false);
    battle._v232EnemyOverclockCleared=true;
   }
  }
 }
 return index;
};
const v232PreviousEnemyResolver=v26ResolveAttack;
v26ResolveAttack=function(attackerId,defenderId,attackerLevel,defenderLevel,base){
 const isEnemy=!!(battle&&!v229InsidePlayerResolver&&base>0&&attackerId===battle.enemy.id&&defenderId===team[battle.active]);
 const smog=!!(isEnemy&&battle._v232EnemySmogArmed&&attackerId==='sourdiesel');
 const overclock=!!(isEnemy&&battle._v232EnemyOverclockArmed&&attackerId==='rs11');
 const boosted=!!(isEnemy&&attackerId==='rs11'&&v232OverclockEnabled('enemy'));
 const weakened=!!(isEnemy&&battle._v229EnemyWeakened);
 const hit=v232PreviousEnemyResolver(attackerId,defenderId,attackerLevel,defenderLevel,base);
 if(isEnemy){battle._v232EnemySmogArmed=false;battle._v232EnemyOverclockArmed=false;}
 if(!isEnemy||!battle||hit.dodged||hit.damage<=0)return hit;
 if(boosted){
  // Spark Zap halves the already-calculated final hit; if present, this
  // halves the bonus too rather than adding 15 after mitigation.
  hit.damage+=weakened?Math.ceil(v236OverclockBonus(attackerLevel)/2):v236OverclockBonus(attackerLevel);
  hit.note=((hit.note||'')+` ⚙️ OVERCLOCK +${v236OverclockBonus(attackerLevel)} attack!`).trim();
 }
 if(smog){
  v232ApplySmog('player',defenderId,attackerLevel);
  hit.note=((hit.note||'')+` 🌫️ SMOG! -${v236Dot(attackerLevel,10)} HP per round until REST!`).trim();
  hit.smogRushApplied=true;
 }
 if(overclock&&Math.random()<V232_OVERCLOCK_CHANCE){
  v232SetOverclock('enemy',null,true);
  hit.note=((hit.note||'')+` ⚙️ ENEMY OVERCLOCK! +${v236OverclockBonus(attackerLevel)} attack damage until REST!`).trim();
  hit.overclockApplied=true;
 }
 return hit;
};
// Cleanse only RS-11's own Overclock boost when that strain rests.
const v232PreviousPlayerRest=staminaPlayerRest;
staminaPlayerRest=function(){
 if(battle&&!battle.busy){
  const id=team[battle.active];
  if(id==='rs11'&&v232OverclockEnabled('player',id)){
   v232SetOverclock('player',id,false);
   battle._v232PlayerOverclockCleared=true;
  }
 }
 return v232PreviousPlayerRest();
};
const v232PreviousBattleMessage=battleMessage;
battleMessage=function(message){
 if(battle&&battle._v232PlayerOverclockCleared&&/rests and recovers/i.test(message)){
  message+=' ⚙️ Overclock cleared.';battle._v232PlayerOverclockCleared=false;
 }
 if(battle&&battle._v232EnemyOverclockCleared&&/rested and recovered|used Recover/i.test(message)){
  message+=' ⚙️ Overclock cleared.';battle._v232EnemyOverclockCleared=false;
 }
 return v232PreviousBattleMessage(message);
};
// Apply smog damage exactly once per full round, after the previous status
// implementations. Reuse their REST cleanup without touching stamina regen.
const v232PreviousStaminaEndRound=staminaEndRound;
staminaEndRound=function(){
 const current=battle;
 const completed=!!(current&&current._staminaPendingRegen&&!current.busy);
 const result=v232PreviousStaminaEndRound();
 if(!completed||!battle||battle!==current)return result;
 const statuses=v230Debuffs(),hitNames=[];
 if(statuses.enemy.smog&&battle.enemy.hp>0){
  const dmg=Number(statuses.enemy.smog)||V232_SMOG_DAMAGE;
  battle.enemy.hp=Math.max(0,battle.enemy.hp-dmg);
  hitNames.push(`${CREATURES[battle.enemy.id].name} -${dmg} HP`);
 }
 for(const [id,effects] of Object.entries(statuses.player)){
  if(!effects.smog||!(battle.hp[id]>0))continue;
  const dmg=Number(effects.smog)||V232_SMOG_DAMAGE;
  battle.hp[id]=Math.max(0,battle.hp[id]-dmg);
  hitNames.push(`${CREATURES[id].name} -${dmg} HP`);
 }
 if(hitNames.length)battleMessage(`🌫️ Smog Rush: ${hitNames.join(' · ')} this round! REST to cleanse.`);
 if(battle.enemy.hp<=0){
  battle.busy=true;
  const token=battleToken;
  setTimeout(()=>{if(battle===current&&battleToken===token)finishBattleVictory()},0);
 }else if(!(battle.hp[team[battle.active]]>0)){
  const activeId=team[battle.active],next=team.findIndex(id=>battle.hp[id]>0);
  if(next>=0){
   battle.active=next;
   battleMessage(`🌫️ ${CREATURES[activeId].name} fainted from Smog! ${CREATURES[team[next]].name}, you're up!`);
  }else{
   battle.busy=true;
   const token=battleToken;
   setTimeout(()=>{if(battle===current&&battleToken===token)finishBattleDefeat()},0);
  }
 }
 return result;
};
const v232PreviousHpMarkup=hpMarkup;
hpMarkup=function(id,hp,who){
 let html=v232PreviousHpMarkup(id,hp,who);
 if(!battle)return html;
 const affected=who==='enemy'?v230Debuffs().enemy:v230PlayerDebuffs(id);
 let marker='';
 if(affected.smog)marker+='<span class="v232-smog-marker"> · 🌫️ SMOG -10</span>';
 if(id==='rs11'&&v232OverclockEnabled(who,id))marker+='<span class="v232-overclock-marker"> · ⚙️ +15 ATK</span>';
 if(marker)html=html.replace(/(<div class="type-line">[\s\S]*?)(<\/div>)/,'$1'+marker+'$2');
 return html;
};
const v232PreviousRenderSideBattle=renderSideBattle;
renderSideBattle=function(){
 v232PreviousRenderSideBattle();
 if(!battle)return;
 const active=team[battle.active];
 const i=active==='sourdiesel'?1:active==='rs11'?3:-1;
 if(i<0)return;
 const move=cContent.querySelector(`.battle-moves button[data-attack="${i}"]`);
 if(!move)return;
 const small=move.querySelector('small');
 if(active==='sourdiesel'){
  move.classList.add('v232-smog-move');
  move.title='Smog Rush: 21 base damage + 10 HP at the end of each round until the target RESTS. Does not stack.';
  if(small&&!small.querySelector('.v232-smog-label'))small.insertAdjacentHTML('beforeend',' · <span class="v232-smog-label">🌫️ Smog</span>');
 }else{
  move.classList.add('v232-overclock-move');
  move.title='Overclock Core: 25% chance on hit to power up RS-11 attacks by 15 HP damage until REST. Does not stack.';
  if(small&&!small.querySelector('.v232-overclock-label'))small.insertAdjacentHTML('beforeend',' · <span class="v232-overclock-label">⚙️ 25% +15 ATK</span>');
 }
};
