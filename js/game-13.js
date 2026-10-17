
/* All actions use the existing V226 stamina and V228-V234 hit pipeline.
 * Status ownership is per side/per strain; events are resolved once in the
 * outermost attack resolver, never from HUD draws. */
const V235_SECONDARY={
 gorilla:{0:['30%: next foe attack −5','weaken',.30,5],1:['25%: drain 15 STM','drain',.25,15],3:['+10 DMG vs debuff','combo',1,10]},
 northern:{1:['25%: drain 10 STM','drain',.25,10],2:['30%: +10 foe move cost','tax',.30,10],3:['Clear foe ATK boost','dispel',1,0]},
 star:{0:['25%: recover 10 STM','recover',.25,10],1:['30%: evade next attack','evade',.30,1],3:['+10 DMG vs debuff','combo',1,10]},
 cheese:{0:['30%: drain 10 STM','drain',.30,10],2:['+8 DMG vs Fumes','fumescombo',1,8],3:['25%: foe attack −10','weaken',.25,10]},
 trainwreck:{0:['30%: guard next hit −5','guard',.30,5],1:['25%: drain 10 STM','drain',.25,10],3:['+12 DMG vs Burn','burncombo',1,12]},
 sourdiesel:{0:['30%: foe attack −8','weaken',.30,8],2:['25%: recover 15 STM','recover',.25,15],3:['+12 DMG vs Smog','smogcombo',1,12]},
 rs11:{0:['30%: recover 10 STM','recover',.30,10],1:['30%: +15 foe move cost','tax',.30,15],2:['+10 DMG if Overclocked','overclockcombo',1,10]},
 jealousy:{0:['25%: steal 10 STM','steal',.25,10],2:['30%: +20% next dodge','dodge',.30,.20],3:['Reflect next hit: 10 HP','reflect',1,10]},
 lunarrock:{0:['25%: drain 10 STM','drain',.25,10],1:['25%: foe attack −8','weaken',.25,8],3:['+12 DMG vs Gravity','gravitycombo',1,12]},
 angolaroja:{0:['+10 DMG vs Burn','firecombo',1,10],1:['30%: foe attack −10','weaken',.30,10],2:['30%: recover 15 STM','recover',.30,15]}
};
function v235Debuffs(side,id){return side==='enemy'?v230Debuffs().enemy:v230PlayerDebuffs(id)}
function v235Positive(){
 if(!battle)return null;
 return battle._v235Buffs||(battle._v235Buffs={enemy:{},player:Object.create(null)});
}
function v235Buff(side,id){const x=v235Positive();if(!x)return {};
 if(side==='enemy')return x.enemy;
 return x.player[id]||(x.player[id]={});
}
function v235ExtraCost(side,id){return Number(v235Debuffs(side,id)?.costTax)||0}
function v235ConsumeTax(side,id){if(battle)v235Debuffs(side,id).costTax=0}
function v235Move(side,id,index){
 const base=V235_SECONDARY[id]?.[index];if(!base)return null;
 const [desc,kind,prob,value]=base,steps=v236Steps(v236Level(side,id));
 let scaledProb=prob,scaledValue=value;
 if(prob<1)scaledProb=Math.min(1,prob+.02*steps);
 if(['drain','steal','recover','tax','combo','fumescombo','burncombo','smogcombo','overclockcombo','gravitycombo','firecombo','reflect','guard'].includes(kind))
   scaledValue=value+(kind==='guard'?steps:steps*2);
 if(kind==='weaken')scaledValue=value+steps;
 if(kind==='dodge')scaledValue=Math.min(.95,value+.02*steps);
 // Evasion lasts one attack; the activation probability improves instead.
 const chance=scaledProb<1?`${Math.round(scaledProb*100)}%: `:'';
 const target={drain:`drain ${scaledValue} STM`,steal:`steal ${scaledValue} STM`,recover:`recover ${scaledValue} STM`,
 tax:`next foe move +${scaledValue} STM`,weaken:`foe next attack −${scaledValue} DMG`,guard:`guard next hit −${scaledValue}`,
 evade:'evade next attack',dodge:`+${Math.round(scaledValue*100)}% dodge next hit`,reflect:`reflect ${scaledValue} HP`,
 combo:`+${scaledValue} DMG vs debuff`,fumescombo:`+${scaledValue} DMG vs Fumes`,
 burncombo:`+${scaledValue} DMG vs Burn`,firecombo:`+${scaledValue} DMG vs Burn`,
 smogcombo:`+${scaledValue} DMG vs Smog`,gravitycombo:`+${scaledValue} DMG vs Gravity`,
 overclockcombo:`+${scaledValue} DMG if Overclocked`,dispel:steps?`clear ATK boost; +${steps*2} STM if cleared`:'clear foe ATK boost'};
 return [chance+(target[kind]||desc),kind,scaledProb,scaledValue];
}
function v235AffordableMoves(side,id,options){
 staminaInitialize();const stamina=side==='enemy'?battle.stamina.enemy:staminaPlayerValue(id);
 return options.map((_,i)=>i).filter(i=>STAMINA_MOVE_COSTS[i]!==undefined&&
    !(typeof v238Cooldown==='function'&&v238Cooldown(side,id,i)>0)&&
    stamina>=STAMINA_MOVE_COSTS[i]+v235ExtraCost(side,id));
}
function v235IsNegative(side,id){return Object.entries(v235Debuffs(side,id)).some(([key,val])=>key!=='costTax'&&key!=='weaken'&&!!val)||!!v235Debuffs(side,id).costTax||!!v235Debuffs(side,id).weaken;}
function v235Combo(side,id,kind,defenderSide,defenderId){
 const status=v235Debuffs(defenderSide,defenderId);
 if(kind==='combo')return v235IsNegative(defenderSide,defenderId);
 if(kind==='fumescombo')return !!status.fumes;
 if(kind==='burncombo')return !!status.burn;
 if(kind==='firecombo')return !!status.burn||!!status.inferno;
 if(kind==='smogcombo')return !!status.smog;
 if(kind==='gravitycombo')return !!status.gravity;
 if(kind==='overclockcombo')return v232OverclockEnabled(side,id);
 return false;
}
function v235ApplySecondary(side,id,index,defenderId,hit){
 const other=side==='enemy'?'player':'enemy';
 const effect=v235Move(side,id,index);
 if(!effect||!hit||hit.dodged||hit.damage<=0)return hit;
 const [description,kind,prob,value]=effect;
 // Each random effect is rolled once, after an actual hit.
 const styleBonus=(typeof v238Data==='function'&&((side==='player'?battle?._v238CurrentPlayerStyle:battle?._v238CurrentEnemyStyle)==='precision')&&prob<1)?.10:0;
 if(Math.random()>Math.min(1,prob+styleBonus))return hit;
 const attackerBuff=v235Buff(side,id),defenderBuff=v235Buff(other,defenderId);
 const debuffs=v235Debuffs(other,defenderId);
 let notice='';
 if(['combo','fumescombo','burncombo','smogcombo','overclockcombo','gravitycombo','firecombo'].includes(kind)){
  if(v235Combo(side,id,kind,other,defenderId)){
   const realBonus=hit._v235Defended?Math.ceil(value/2):value;
   hit.damage+=realBonus;notice=`⚡ COMBO BONUS! +${realBonus} DAMAGE`;
   battle._v235ComboUntil=Date.now()+1350;
   battle._v235ComboText=notice;
  }
 }else if(kind==='drain'||kind==='steal'){
  staminaInitialize();
  const current=other==='enemy'?battle.stamina.enemy:staminaPlayerValue(defenderId);
  const stolen=Math.min(value,Math.max(0,current));
  if(other==='enemy')battle.stamina.enemy=current-stolen;
  else battle.stamina.player[defenderId]=current-stolen;
  if(kind==='steal'){
   const own=side==='enemy'?battle.stamina.enemy:staminaPlayerValue(id);
   const raised=Math.min(staminaMaximum(side==='enemy'?battle.enemy.level:progressFor(id).level),own+stolen);
   if(side==='enemy')battle.stamina.enemy=raised;else battle.stamina.player[id]=raised;
  }
  notice=`⚡ ${kind==='steal'?'STOLEN':'DRAINED'} ${stolen} STAMINA!`;
 }else if(kind==='recover'){
  const own=side==='enemy'?battle.stamina.enemy:staminaPlayerValue(id);
  const raised=Math.min(staminaMaximum(side==='enemy'?battle.enemy.level:progressFor(id).level),own+value);
  if(side==='enemy')battle.stamina.enemy=raised;else battle.stamina.player[id]=raised;
  notice=`⚡ RECOVERED ${raised-own} STAMINA!`;
 }else if(kind==='weaken'){
  debuffs.weaken=Math.max(Number(debuffs.weaken)||0,value);notice=`📉 NEXT ATTACK −${value} DAMAGE!`;
 }else if(kind==='tax'){
  debuffs.costTax=Math.max(Number(debuffs.costTax)||0,value);notice=`⚡ NEXT MOVE COST +${value}!`;
 }else if(kind==='dispel'){
  if(defenderId==='rs11'&&v232OverclockEnabled(other,defenderId)){
   v232SetOverclock(other,defenderId,false);const restored=v236Recover(side,id,v236Steps(v236Level(side,id))*2);notice=`✨ ENEMY ATTACK BOOST DISPELLED!${restored?' +'+restored+' STM':''}`;
  }
 }else if(kind==='guard'){
  attackerBuff.guard=Math.max(Number(attackerBuff.guard)||0,value);notice=`🛡️ GUARD: −${value} DAMAGE NEXT HIT!`;
 }else if(kind==='evade'){
  attackerBuff.evade=true;notice='💨 EVASION READY: NEXT ATTACK DODGED!';
 }else if(kind==='dodge'){
  attackerBuff.dodge=value;notice=`🌑 +${Math.round(value*100)}% DODGE NEXT ATTACK!`;
 }else if(kind==='reflect'){
  attackerBuff.reflect=value;notice=`🪞 MIRROR READY: REFLECT ${value} HP!`;
 }
 if(notice){hit.note=((hit.note||'')+' '+notice).trim();if(battle)battle._v235LatestEffect=notice;}
 return hit;
}
function v235TryEvade(side,id,base){
 if(!battle||base<=0)return '';
 const buff=v235Buff(side,id);
 if(buff.evade){buff.evade=false;return '💨 EVADED NEXT ATTACK!';}
 if(buff.dodge){const chance=buff.dodge;buff.dodge=0;if(Math.random()<chance)return '🌑 NIGHTFALL DODGE!';}
 return '';
}
function v235Incoming(side,id,attackerId,hit){
 if(!battle||!hit)return hit;
 const buff=v235Buff(side,id),debuff=v235Debuffs(side,id);
 const attackerSide=side==='enemy'?'player':'enemy';
 const attackerStatus=v235Debuffs(attackerSide,attackerId);
 const outgoingWeaken=Number(attackerStatus.weaken)||0;
 if(outgoingWeaken)attackerStatus.weaken=0; // one ATTACK attempt, including misses
 let changes=[];
 if(!hit.dodged){
  if(buff.defend){buff.defend=false;const perfect=!!buff.perfectGuard;buff.perfectGuard=false;hit.damage=Math.ceil(hit.damage*(perfect?.30:.50));hit._v235Defended=true;changes.push(perfect?'🛡️ PERFECT GUARD! 70% REDUCTION!':'🛡️ DEFENDED! DAMAGE HALVED!');}
  if(buff.switchGuard){hit.damage=Math.max(0,Math.ceil(hit.damage*.70));buff.switchGuard=false;changes.push('🔄 ADVANTAGE SWITCH −30%!');}
  if(buff.guard){hit.damage=Math.max(0,hit.damage-buff.guard);changes.push(`🛡️ GUARDED −${buff.guard}!`);buff.guard=0;}
  if(outgoingWeaken){hit.damage=Math.max(0,hit.damage-outgoingWeaken);changes.push(`📉 WEAKENED −${outgoingWeaken}!`);}
  if(buff.reflect&&hit.damage>0){
   const val=buff.reflect;buff.reflect=0;
   if(side==='enemy'){
    const current=team[battle.active];battle.hp[current]=Math.max(0,battle.hp[current]-val);
   }else{
    battle.enemy.hp=Math.max(0,battle.enemy.hp-val);
    if(battle.enemy.hp<=0&&typeof v233ScheduleEnemyHexKnockout==='function')v233ScheduleEnemyHexKnockout(battle);
   }
   changes.push(`🪞 MIRROR REFLECTED ${val} HP!`);
  }
 }
 if(changes.length){hit.note=((hit.note||'')+' '+changes.join(' ')).trim();battle._v235LatestEffect=changes.join(' ');}
 return hit;
}
// Register both attacker/defender once at the outside of the V234 resolver chain.
const v235OldPlayerResolver=v152ResolvePlayerAttack;
v152ResolvePlayerAttack=function(attackerId,defenderId,attackerLevel,defenderLevel,base){
 const b=battle,idx=b?b._v235PlayerMove:null;
 if(b)b._v235PlayerMove=null;
 const evaded=v235TryEvade('enemy',defenderId,base);
 const previousMiss=b?b._v235ForceMiss:false;
 if(b)b._v235ForceMiss=!!evaded;
 let hit;
 try{hit=v235OldPlayerResolver(attackerId,defenderId,attackerLevel,defenderLevel,base)}
 finally{if(b)b._v235ForceMiss=previousMiss;}
 if(!battle||battle!==b||base<=0)return hit;
 if(evaded){hit.dodged=true;hit.damage=0;hit.note=((hit.note||'')+' '+evaded).trim();battle._v235LatestEffect=evaded;}
 hit=v235Incoming('enemy',defenderId,attackerId,hit);
 if(Number.isInteger(idx))hit=v235ApplySecondary('player',attackerId,idx,defenderId,hit);
 return hit;
};
const v235OldEnemyResolver=v26ResolveAttack;
v26ResolveAttack=function(attackerId,defenderId,attackerLevel,defenderLevel,base){
 const enemyAttack=!!(battle&&!v229InsidePlayerResolver&&attackerId===battle.enemy.id&&defenderId===team[battle.active]&&base>0);
 const idx=enemyAttack?battle._v235EnemyMove:null;
 if(enemyAttack)battle._v235EnemyMove=null;
 const evaded=enemyAttack?v235TryEvade('player',defenderId,base):'';
 const originalMiss=battle?battle._v235ForceMiss:false;
 if(battle)battle._v235ForceMiss=!!evaded;
 let hit;
 try{hit=v235OldEnemyResolver(attackerId,defenderId,attackerLevel,defenderLevel,base)}
 finally{if(battle)battle._v235ForceMiss=originalMiss;}
 if(!enemyAttack||!battle)return hit;
 if(evaded){hit.dodged=true;hit.damage=0;hit.note=((hit.note||'')+' '+evaded).trim();battle._v235LatestEffect=evaded;}
 hit=v235Incoming('player',defenderId,attackerId,hit);
 if(Number.isInteger(idx))hit=v235ApplySecondary('enemy',attackerId,idx,defenderId,hit);
 return hit;
};
// REST already clears every entry from the V230 debuff store, including
// V235's weaken and extra stamina cost. Positive guards remain battle-local.
function v235PlanEnemy(options){
 if(!battle)return null;
 staminaInitialize();
 const id=battle.enemy.id,level=battle.enemy.level||1,st=battle.stamina.enemy;
 const legal=v235AffordableMoves('enemy',id,options);
 const hpRatio=battle.enemy.hp/Math.max(1,battle.enemy.maxHp||maxHealth(id,level));
 const status=v235Debuffs('enemy',id),target=team[battle.active];
 const difficulty=battle.mode==='gym'||battle.mode==='langy'||battle.mode==='hobo'?'boss':level>=8?'advanced':level>=4?'normal':'beginner';
 const dot=(Number(status.fumes)||0)+(Number(status.burn)||0)+(Number(status.smog)||0)+(Number(status.inferno)||0);
 const risky=dot>=20||status.hex||status.gravity;
 if(!legal.length)return {kind:'rest',label:'⚡ RECOVERING'};
 if(st<=40&&Math.random()<(difficulty==='beginner'?.35:.7))return {kind:'rest',label:'⚡ RECOVERING'};
 if(risky&&Math.random()<(difficulty==='boss'?.70:difficulty==='advanced'?.55:difficulty==='normal'?.40:.23))return {kind:'rest',label:'⚡ RECOVERING'};
 if(difficulty!=='beginner'&&hpRatio<.32&&Math.random()<.27)return {kind:'defend',label:'🛡️ DEFENDING'};
 if(difficulty==='boss'&&Math.random()<.09)return {kind:'defend',label:'🛡️ DEFENDING'};
 // Lower-level wild enemies choose more randomly. Trained enemies value
 // finishers and synergies, but cannot exceed their own available energy.
 const weighted=legal.map(i=>{
  let score=1;
  const [name,dmg]=options[i];
  if(difficulty!=='beginner'){
   score+=(dmg||0)/70;
   if(st<70&&i>=2)score-=.5;
   const entry=v235Move('enemy',id,i);
   if(entry&&['combo','fumescombo','burncombo','smogcombo','overclockcombo','gravitycombo','firecombo'].includes(entry[1])&&v235Combo('enemy',id,entry[1],'player',target))score+=difficulty==='boss'?2.6:1.4;
   if(battle.hp[target]<=dmg+15)score+=2;
  }
  return Math.max(.1,score);
 });
 let dice=Math.random()*weighted.reduce((a,b)=>a+b,0),selected=legal[0];
 for(let j=0;j<legal.length;j++){dice-=weighted[j];if(dice<=0){selected=legal[j];break;}}
 const sig=[2,0,1,2,1,3,1,2,3,3];
 const order=['gorilla','northern','cheese','trainwreck','sourdiesel','rs11','jealousy','lunarrock','star','angolaroja'];
 const style=typeof v238ChooseEnemyStyle==='function'?v238ChooseEnemyStyle(id,selected,difficulty,st):'standard';
 return {kind:'attack',index:selected,style,label:v237EnemyIntentLabel(id,selected,options)+(style==='power'?' · POWER':style==='precision'?' · PRECISION':'')};
}
// Called inside the V226 chooser, before the older special-attack wrappers.
function v235EnemyForcedAction(options){
 if(!battle)return null;
 const plan=battle._v235EnemyPlan;
 if(!plan)return null;
 if(battle._v228EnemyStuck)return null; // Sticky wrapper owns the skipped turn.
 if(plan.kind==='attack')return null;
 if(plan.kind==='rest'){
  battle.stamina.enemy=Math.min(staminaMaximum(battle.enemy.level||1),battle.stamina.enemy+STAMINA_REST_BONUS);
  battle._staminaEnemyRested=true;
  return -1;
 }
 if(plan.kind==='defend'){
  battle.stamina.enemy=Math.min(staminaMaximum(battle.enemy.level||1),battle.stamina.enemy+10);
  v235Buff('enemy',battle.enemy.id).defend=true;
  battle._staminaEnemyRested=false;
  battle._v235EnemyDefendedThisTurn=true;
  return -1;
 }
 return null;
}
const v235PreviousEnemyChooser=staminaChooseEnemyIndex;
staminaChooseEnemyIndex=function(options){
 if(battle&&!battle._v235EnemyPlan)battle._v235EnemyPlan=v235PlanEnemy(options);
 const out=v235PreviousEnemyChooser(options);
 if(battle){
  battle._v235EnemyMove=out>=0?out:null;
  if(typeof v238EnemyActionSelected==='function')v238EnemyActionSelected(out);
  if(battle._v228SkipInProgress)battle._v235EnemyDefendedThisTurn=false;
  battle._v235EnemyPlan=null;
 }
 return out;
};
// All player attacks still pass through the old stamina and signature pipeline.
const v235PreviousBattleAction=battleAction;
battleAction=function(action){
 if(!battle||battle.busy)return;
 if(action==='v235-defend')return v235PlayerDefend();
 const i=Number(action),id=team[battle.active];
 if(Number.isInteger(i)&&i>=0&&i<4){
  const extra=v235ExtraCost('player',id),total=STAMINA_MOVE_COSTS[i]+extra;
  if(staminaPlayerValue(id)<total){battleMessage(`${CREATURES[id].name} needs ${total} stamina for this move.`);renderSideBattle();return;}
  battle._v235PlayerMove=i;
  if(extra){battle.stamina.player[id]-=extra;v235ConsumeTax('player',id);}
 }else battle._v235PlayerMove=null;
 return v235PreviousBattleAction(action);
};
function v235PlayerDefend(){
 if(!battle||battle.busy)return;
 const id=team[battle.active];
 staminaInitialize();
 v235Buff('player',id).defend=true;
 if(typeof v238PerfectGuard==='function')v238PerfectGuard(id);
 battle._v235PlayerMove=null;
 battle._v235PlayerDefendedThisTurn=true;
 // Use the original V226 turn sequence without the later REST cleansing
 // hooks. Its +35 bonus is adjusted to +10 before the action starts.
 battle.stamina.player[id]-=25;
 v230PriorPlayerRest();
}
const v235OldBattleMessage=battleMessage;
battleMessage=function(message){
 if(battle&&battle._v235PlayerDefendedThisTurn&&/rests and recovers 35 stamina/i.test(message)){
  message=`🛡️ ${CREATURES[team[battle.active]].name} DEFENDS! +10 stamina; next attack deals half damage.`;
  battle._v235PlayerDefendedThisTurn=false;
 }
 if(battle&&battle._v235EnemyDefendedThisTurn&&/used Recover|rested and recovered|dodged/i.test(message)){
  message=`🛡️ ${CREATURES[battle.enemy.id].name} DEFENDS! +10 stamina and prepares a guard.`;
 }
 // Some old battle modes drop attack resolver notes.
 if(battle&&battle._v235LatestEffect&&/dealt \d+ damage|took \d+ damage|hit for \d+ damage|dodged/i.test(message)){
  if(!message.includes(battle._v235LatestEffect))message+=' '+battle._v235LatestEffect;
  battle._v235LatestEffect='';
 }
 return v235OldBattleMessage(message);
};
const v235OldStaminaEndRound=staminaEndRound;
staminaEndRound=function(){
 const done=!!(battle&&battle._staminaPendingRegen&&!battle.busy);
 const b=battle;
 const result=v235OldStaminaEndRound();
 if(battle&&battle===b&&done)battle._v235EnemyDefendedThisTurn=false;
 return result;
};
const v235OldHpMarkup=hpMarkup;
hpMarkup=function(id,hp,side){
 let html=v235OldHpMarkup(id,hp,side);
 if(!battle)return html;
 const d=v235Debuffs(side,id),buff=v235Buff(side,id),parts=[];
 if(d.weaken)parts.push(['📉 −'+d.weaken,'Next attack −'+d.weaken+' damage',true]);
 if(d.costTax)parts.push(['⚡ +'+d.costTax,'Next attack costs +'+d.costTax+' stamina',true]);
 if(buff.defend)parts.push(['🛡️ HALF','Defending: halves next received hit',false]);
 if(buff.guard)parts.push(['🛡️ −'+buff.guard,'Guard next received hit',false]);
 if(buff.evade)parts.push(['💨 DODGE','Evades next incoming hit',false]);
 if(buff.dodge)parts.push(['🌑 DODGE','Bonus dodge chance on next attack',false]);
 if(buff.reflect)parts.push(['🪞 REFLECT','Reflects 10 HP on next successful hit',false]);
 if(!parts.length)return html;
 const statuses='<div class="v235-statuses">'+parts.map(([label,title,negative])=>`<span class="v235-status ${negative?'negative':''}" role="button" tabindex="0" aria-label="${title}" title="${title}" data-v235-tooltip="${title}">${label}</span>`).join('')+'</div>';
 return html.replace(/(<\/div>\s*)$/,statuses+'$1');
};
const v235OldRenderSideBattle=renderSideBattle;
renderSideBattle=function(){
 v235OldRenderSideBattle();
 if(!battle||creatureMode!=='battle')return;
 const id=team[battle.active],buttons=cContent.querySelectorAll('.battle-moves button[data-attack]');
 buttons.forEach(btn=>{
  const index=Number(btn.dataset.attack),details=v235Move('player',id,index);
  if(details){
   const small=btn.querySelector('small');
   if(small&&!small.querySelector('.v235-move-info'))small.insertAdjacentHTML('beforeend',`<span class="v235-move-info">${details[0]}</span>`);
   btn.title=`${currentMove(id,index)[0]}: ${details[0]}. ${btn.title||''}`;
  }
  const extra=v235ExtraCost('player',id);
  if(extra){
   const total=STAMINA_MOVE_COSTS[index]+extra;
   btn.disabled=!!battle.busy||staminaPlayerValue(id)<total;
   const cost=btn.querySelector('.stamina-cost');if(cost)cost.textContent=`${total}⚡`;
  }
 });
 const moves=cContent.querySelector('.battle-moves');
 if(moves){
  const defend=document.createElement('button');defend.type='button';defend.id='v235DefendButton';
  defend.disabled=!!battle.busy;
  defend.innerHTML='🛡️ DEFEND <small>+10 STM · half next hit</small>';
  defend.title='Halve damage on the next enemy attack. Gain 10 stamina. Does not clear debuffs.';
  moves.appendChild(defend);
 }
 if(!battle.busy){
  if(!battle._v235EnemyPlan)battle._v235EnemyPlan=v235PlanEnemy(enemyMoves[battle.enemy.id]||ATTACKS[battle.enemy.id]||[['Strike',10]]);
 }
 const field=cContent.querySelector('.battle-field');
 if(field&&battle._v235ComboUntil>Date.now()){
  const toast=document.createElement('div');toast.className='v235-combo';toast.textContent=battle._v235ComboText||'⚡ COMBO!';field.appendChild(toast);
  setTimeout(()=>{if(toast.isConnected)toast.remove();},Math.max(100,battle._v235ComboUntil-Date.now()));
 }
 if(field&&battle._v235EnemyPlan){
  const indicator=document.createElement('div');indicator.className='v235-intent';
  indicator.textContent=`ENEMY INTENT: ${battle._v235EnemyPlan.label}`;
  field.appendChild(indicator);
 }
};
cContent.addEventListener('click',event=>{
 const tag=event.target.closest('.v235-status[data-v235-tooltip]');
 if(tag){event.preventDefault();event.stopImmediatePropagation();battleMessage(tag.dataset.v235Tooltip);return;}
 const btn=event.target.closest('#v235DefendButton');if(!btn)return;
 event.preventDefault();event.stopImmediatePropagation();battleAction('v235-defend');
},true);
cContent.addEventListener('keydown',event=>{
 if((event.key==='Enter'||event.key===' ')&&event.target.matches('.v235-status[data-v235-tooltip]')){
  event.preventDefault();battleMessage(event.target.dataset.v235Tooltip);
 }
});
