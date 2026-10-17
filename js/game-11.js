
// V226: stamina is specific to each strain, and every opponent obeys the same rules.
// Four moves, ordered weakest to strongest: 15 / 20 / 30 / 40 energy.
// Regain 15 per completed round; choose REST for an extra 35.
const STAMINA_MOVE_COSTS=[15,20,30,40];
const STAMINA_ROUND_RECOVERY=15;
const STAMINA_REST_BONUS=35;
function staminaMaximum(level){return 100+5*Math.max(0,(Math.max(1,Number(level)||1))-1)}
function staminaInitialize(){
 if(!battle)return;
 if(!battle.stamina){battle.stamina={player:Object.create(null),enemy:0};battle._staminaPendingRegen=false;}
 for(const id of team){if(battle.stamina.player[id]===undefined)battle.stamina.player[id]=staminaMaximum(progressFor(id).level)}
 if(!battle.stamina.enemyInitialized){
  battle.stamina.enemy=staminaMaximum(battle.enemy.level||1);
  battle.stamina.enemyInitialized=true;
 }
}
function staminaPlayerValue(id){staminaInitialize();return battle.stamina.player[id]??staminaMaximum(progressFor(id).level)}
function staminaChooseEnemyIndex(options){
 staminaInitialize();
 // V235: planned enemy actions share the same underlying stamina transaction.
 if(typeof v235EnemyForcedAction==='function'){
  const forced=v235EnemyForcedAction(options);
  if(forced!==null)return forced;
 }
 const available=options.map((_,i)=>i).filter(i=>STAMINA_MOVE_COSTS[i]!==undefined&&
  !(typeof v238Cooldown==='function'&&v238Cooldown('enemy',battle.enemy.id,i)>0)&&
  battle.stamina.enemy>=STAMINA_MOVE_COSTS[i]+(typeof v235ExtraCost==='function'?v235ExtraCost('enemy',battle.enemy.id):0)+
  (battle._v235EnemyPlan?.kind==='attack'&&battle._v235EnemyPlan.index===i&&battle._v235EnemyPlan.style==='power'?10:0));
 if(!available.length){
  battle.stamina.enemy=Math.min(staminaMaximum(battle.enemy.level||1),battle.stamina.enemy+STAMINA_REST_BONUS);
  battle._staminaEnemyRested=true;
  return -1;
 }
 const wanted=battle._v235EnemyPlan?.kind==='attack'?battle._v235EnemyPlan.index:null;
 // Committed intentions cannot secretly change moves after the player's action.
 if(wanted!==null&&!available.includes(wanted)){
  battle.stamina.enemy=Math.min(staminaMaximum(battle.enemy.level||1),battle.stamina.enemy+STAMINA_REST_BONUS);
  battle._staminaEnemyRested=true;battle._v238Interrupted=true;return -1;
 }
 const choice=available.includes(wanted)?wanted:available[Math.floor(Math.random()*available.length)];
 const extra=typeof v235ExtraCost==='function'?v235ExtraCost('enemy',battle.enemy.id):0;
 const powerExtra=(battle._v235EnemyPlan?.index===choice&&battle._v235EnemyPlan.style==='power')?10:0;
 battle.stamina.enemy-=STAMINA_MOVE_COSTS[choice]+extra+powerExtra;
 if(extra&&typeof v235ConsumeTax==='function')v235ConsumeTax('enemy',battle.enemy.id);
 battle._staminaEnemyRested=false;
 return choice;
}
// Applied exactly once at the end of each complete turn (even when a hit missed).
function staminaEndRound(){
 if(!battle||!battle._staminaPendingRegen||battle.busy)return;
 staminaInitialize();
 battle._staminaPendingRegen=false;
 for(const id of team){
  if(battle.stamina.player[id]===undefined)continue;
  battle.stamina.player[id]=Math.min(staminaMaximum(progressFor(id).level),battle.stamina.player[id]+STAMINA_ROUND_RECOVERY);
 }
 battle.stamina.enemy=Math.min(staminaMaximum(battle.enemy.level||1),battle.stamina.enemy+STAMINA_ROUND_RECOVERY);
 battle._staminaEnemyRested=false;
}
const v226PreviousHpMarkup=hpMarkup;
hpMarkup=function(id,hp,who){
 let original=v226PreviousHpMarkup(id,hp,who);
 if(!battle)return original;
 staminaInitialize();
 const maximum=who==='enemy'?staminaMaximum(battle.enemy.level||1):staminaMaximum(progressFor(id).level);
 const current=who==='enemy'?battle.stamina.enemy:staminaPlayerValue(id);
 const pct=Math.max(0,Math.min(100,100*current/maximum));
 const extra=`<div class="stamina-caption"><span>⚡ STAMINA</span><span>${Math.floor(current)} / ${maximum}</span></div><div class="stamina-track"><div class="stamina-fill ${pct<20?'empty':pct<40?'low':''}" style="width:${pct}%"></div></div>`;
 return original.endsWith('</div>')?original.slice(0,-6)+extra+'</div>':original+extra;
};
const v226PreviousRenderSideBattle=renderSideBattle;
renderSideBattle=function(){
 if(battle)staminaEndRound();
 v226PreviousRenderSideBattle();
 if(!battle)return;
 staminaInitialize();
 const id=team[battle.active];
 const buttons=cContent.querySelectorAll('.battle-moves button[data-attack]');
 buttons.forEach(btn=>{
  const index=Number(btn.dataset.attack),cost=STAMINA_MOVE_COSTS[index];
  if(cost===undefined)return;
  const affordable=staminaPlayerValue(id)>=cost;
  btn.disabled=!!battle.busy||!affordable;
  btn.classList.toggle('stamina-unaffordable',!affordable);
  const small=btn.querySelector('small');
  if(small){small.innerHTML=small.textContent+' · <span class="stamina-cost">⚡ '+cost+'</span>'}
  if(!affordable)btn.title='Not enough stamina — choose a cheaper move or REST.';
 });
 const actions=cContent.querySelector('.battle-moves');
 if(actions){
  const rest=document.createElement('button');rest.type='button';rest.id='v226RestButton';
  rest.disabled=!!battle.busy;
  rest.innerHTML='⚡ REST / RECOVER <small>+35 stamina · enemy gets a turn</small>';
  actions.appendChild(rest);
 }
 // Most recent battle types have custom help; add a short universal stamina hint.
 if(creatureMode==='battle'){
  const hint='⚡ Stamina: +15 each round; REST for +35 extra.';
  if(cHelp.textContent && !cHelp.textContent.includes('Stamina:'))cHelp.textContent+=' · '+hint;
  else if(!cHelp.textContent)cHelp.textContent=hint;
 }
};
const v226OldBattleMessage=battleMessage;
battleMessage=function(message){
 if(battle&&battle._staminaEnemyRested){
  if(/used Recover!|used Recover\b/i.test(message)||/dodged/i.test(message))
    message=`${CREATURES[battle.enemy.id].name} rested and recovered ${STAMINA_REST_BONUS} stamina!`;
 }
 return v226OldBattleMessage(message);
};
const v226OldMoveSound=moveSound;
moveSound=function(id,index){if(index<0)return;return v226OldMoveSound(id,index)};
const v226OriginalBattleAction=battleAction;
battleAction=function(action){
 if(!battle||battle.busy)return;
 staminaInitialize();
 if(action==='stamina-rest')return staminaPlayerRest();
 if(action==='switch')return v226OriginalBattleAction(action);
 const i=Number(action),id=team[battle.active];
 if(!id||!Number.isInteger(i)||i<0||i>3)return;
 const cost=STAMINA_MOVE_COSTS[i];
 if(staminaPlayerValue(id)<cost){
  battleMessage(`${CREATURES[id].name} needs ${cost} stamina for that move. Choose a cheaper move or REST!`);
  renderSideBattle();return;
 }
 battle.stamina.player[id]-=cost;
 battle._staminaPendingRegen=true;
 battle._staminaEnemyRested=false;
 return v226OriginalBattleAction(action);
};
function staminaPlayerRest(){
 if(!battle||battle.busy)return;
 const id=team[battle.active];if(!id)return;
 battle.stamina.player[id]=Math.min(staminaMaximum(progressFor(id).level),staminaPlayerValue(id)+STAMINA_REST_BONUS);
 battle._staminaPendingRegen=true;
 battle._staminaEnemyRested=false;
 battle.busy=true;
 const token=++battleToken;
 battleMessage(`${CREATURES[id].name} rests and recovers ${STAMINA_REST_BONUS} stamina!`);
 renderSideBattle();
 setTimeout(()=>{
  if(!battle||token!==battleToken)return;
  const e=battle.enemy,options=enemyMoves[e.id]||ATTACKS[e.id]||[['Wild Strike',12]];
  const index=staminaChooseEnemyIndex(options),move=index<0?['Recover',0]:options[index];
  const label=battle.mode==='wild'?'Wild strain':battle.mode==='hobo'?'Woodland Hobo':battle.mode==='langy'?'Langy':'Trainer';
  battleMessage(index<0?`${CREATURES[e.id].name} rested and recovered ${STAMINA_REST_BONUS} stamina!`:`${label}'s Lv. ${e.level||1} ${CREATURES[e.id].name} used ${move[0]}!`);
  if(index>=0){moveSound(e.id,index);animateBattleSprite('enemy','strike')}
  renderSideBattle();
  setTimeout(()=>{
   if(!battle||token!==battleToken)return;
   const target=team[battle.active];
   if(index>=0){
    const hit=v26ResolveAttack(e.id,target,e.level||1,progressFor(target).level,move[1]);
    if(!hit.dodged){battle.hp[target]=Math.max(0,battle.hp[target]-hit.damage);hitSound()}
    battleMessage(hit.dodged?`${CREATURES[target].name} dodged the attack!`:`${CREATURES[target].name} took ${hit.damage} damage! ${hit.note}`);
   }
   renderSideBattle();
   setTimeout(()=>{
    if(!battle||token!==battleToken)return;
    if(battle.hp[target]<=0){
     const next=team.findIndex(candidate=>battle.hp[candidate]>0);
     if(next<0){finishBattleDefeat();return;}
     battle.active=next;
     battleMessage(`${CREATURES[team[next]].name}, you're up!`);
    }
    battle.busy=false;
    renderSideBattle();
    if(battle&&battle.hp[target]>0)battleMessage(`What will ${CREATURES[team[battle.active]].name} do?`);
   },520);
  },500);
 },480);
}
// Catch REST before the original collection click handler; it only handles numeric moves.
cContent.addEventListener('click',event=>{
 const rest=event.target.closest('#v226RestButton');if(!rest)return;
 event.preventDefault();event.stopImmediatePropagation();battleAction('stamina-rest');
},true);
// Successful and unsuccessful wild captures keep the stamina turn cycle consistent.
const v226OldWildCapture=attemptWildCapture;
attemptWildCapture=function(){
 if(battle?.mode==='wild'&&!battle.busy&&(inventory.baggy||0)>0){
  staminaInitialize();battle._staminaPendingRegen=true;
 }
 return v226OldWildCapture();
};
// Show the maximum stamina gained through the existing XP/level system in the collection.
const v226OldRefresh=refreshCreatures;
refreshCreatures=function(){
 v226OldRefresh();
 if(creatureMode!=='collection')return;
 if(selectedCreature&&collection.includes(selectedCreature)){
  const label=cContent.querySelector('.monCard.selected small');
  if(label)label.innerHTML+=`<br>⚡ Stamina ${staminaMaximum(progressFor(selectedCreature).level)} max (+5/level)`;
 }else{
  cContent.querySelectorAll('.monCard').forEach(card=>{
   const btn=card.querySelector('[data-detail]');if(!btn)return;
   const label=card.querySelector('small');
   if(label)label.innerHTML+=`<br>⚡ ${staminaMaximum(progressFor(btn.dataset.detail).level)} max stamina`;
  });
 }
};
