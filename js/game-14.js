
/* V238 additions operate on the current V237 battle and save formats only. */
const V238_TYPES={
 Lightning:['Strength','Stink','Robot'],Strength:['Cosmic','Fire'],Cosmic:['Lightning','Dark'],
 Stink:['Strength','Dark'],Robot:['Cosmic','Stink'],Dark:['Lightning','Fire'],Fire:['Robot','Stink']
};
function v238TypeMultiplier(a,d){
 if(V238_TYPES[a]?.includes(d))return 1.25;
 if(V238_TYPES[d]?.includes(a))return .85;
 return 1;
}
const V238_COOLDOWNS={gorilla:2,lunarrock:2,angolaroja:3,rs11:3};
function v238SignatureIndex(id){return V238_COOLDOWNS[id]??-1;}
function v238Data(){
 if(!battle)return null;
 return battle._v238||(battle._v238={style:'standard',playerCD:Object.create(null),enemyCD:Object.create(null),round:0});
}
function v238CDStore(side,id){
 const state=v238Data();if(!state)return {};
 if(side==='enemy')return state.enemyCD;
 return state.playerCD[id]||(state.playerCD[id]=Object.create(null));
}
function v238Cooldown(side,id,index){return Number(v238CDStore(side,id)[index])||0;}
function v238SetCooldown(side,id,index){
 if(index===v238SignatureIndex(id))v238CDStore(side,id)[index]=3; // decreases to 2 after the current round
}
function v238AttackStyle(attackerId,defenderId){
 if(!battle)return 'standard';
 const st=v238Data();
 if(v229InsidePlayerResolver)
   return battle._v238CurrentPlayerStyle||st.style||'standard';
 if(attackerId===battle.enemy.id&&defenderId===team[battle.active])
   return battle._v238CurrentEnemyStyle||'standard';
 return 'standard';
}
function v238ChooseEnemyStyle(id,index,difficulty,stamina){
 const raw=STAMINA_MOVE_COSTS[index]+v235ExtraCost('enemy',id);
 if(stamina>=raw+10&&difficulty!=='beginner'&&Math.random()<(difficulty==='boss'?.27:.14))return 'power';
 if(Math.random()<(difficulty==='boss'?.25:difficulty==='advanced'?.18:.08))return 'precision';
 return 'standard';
}
function v238EnemyActionSelected(index){
 if(!battle)return;
 const plan=battle._v235EnemyPlan;
 battle._v238CurrentEnemyStyle=index>=0&&(plan?.index===index)?plan.style||'standard':'standard';
 if(index>=0){v238SetCooldown('enemy',battle.enemy.id,index);}
 if(battle._v238Interrupted){
  battle._v238Interrupted=false;
  battle._v235LatestEffect='⚠️ Intended move interrupted: insufficient stamina; enemy must recover.';
 }
}
function v238PerfectGuard(id){
 if(!battle)return;
 const plan=battle._v235EnemyPlan;
 if(plan?.kind==='attack'&&plan.index===3){
   v235Buff('player',id).perfectGuard=true;
   v236Recover('player',id,10); // +10 beyond normal DEFEND; no random roll
 }
}
function v238IncomingIntent(){
 if(!battle)return;
 const plan=battle._v235EnemyPlan;
 if(plan?.kind==='attack'&&plan.index===3)plan.label='💥 HEAVY ATTACK'+(plan.style==='power'?' · POWER':'');
}
function v238AfterSwitch(id,previous){
 if(!battle||id===previous)return;
 v238Data().style='standard';
 const advantaged=v238TypeMultiplier(CREATURES[id].type,CREATURES[battle.enemy.id].type)>1;
 if(advantaged)v235Buff('player',id).switchGuard=true;
 const energy=staminaPlayerValue(id);
 // Switching costs the full turn: reuse the pre-cleanse REST opponent-turn
 // pipeline but immediately cancel its +35 gain. No debuffs are removed.
 if(typeof v230PriorPlayerRest==='function'){
  v230PriorPlayerRest();
  if(battle?.stamina?.player)battle.stamina.player[id]=energy;
  battleMessage(`🔄 ${CREATURES[id].name} switches in! ${advantaged?'ADVANTAGE SWITCH! Next hit −30%.':'Enemy still takes its turn.'}`);
  renderSideBattle();
 }else battleMessage(`🔄 Go, ${CREATURES[id].name}!`);
}
function v238TrimDots(side,id){
 if(!battle)return '';
 const d=v235Debuffs(side,id),k=['fumes','burn','smog','inferno'];
 const present=k.filter(x=>Number(d[x])>0);
 if(present.length<=2)return '';
 // Keep two strongest; on ties preserve earlier-listed debuff.
 const top=present.slice().sort((a,b)=>Number(d[b])-Number(d[a])||k.indexOf(a)-k.indexOf(b)).slice(0,2);
 const gone=present.filter(x=>!top.includes(x));
 for(const x of gone)d[x]=false;
 const txt=`🧼 Status limit: ${gone.join(', ')} replaced by stronger effects.`;
 battle._v235LatestEffect=txt;
 return txt;
}
// Limit harmful DOT after all earlier on-hit handlers finish, not during UI render.
const v238OldPlayerResolver=v152ResolvePlayerAttack;
v152ResolvePlayerAttack=function(...args){
 const hit=v238OldPlayerResolver(...args);
 if(battle&&hit&&!hit.dodged)v238TrimDots('enemy',battle.enemy.id);
 return hit;
};
const v238OldEnemyResolver=v26ResolveAttack;
v26ResolveAttack=function(...args){
 const hit=v238OldEnemyResolver(...args);
 if(battle&&!v229InsidePlayerResolver&&hit&&!hit.dodged&&args[0]===battle.enemy.id)
    v238TrimDots('player',args[1]);
 return hit;
};
// Precision also improves random utility effects; original fixed signature
// chances (especially RS-11 Overclock at 25%) never change.
const v238OldPlan=v235PlanEnemy;
v235PlanEnemy=function(options){
 const plan=v238OldPlan(options);
 if(plan?.kind==='attack'&&plan.style==='power'){
  const tax=STAMINA_MOVE_COSTS[plan.index]+v235ExtraCost('enemy',battle.enemy.id)+10;
  if(battle.stamina.enemy<tax)plan.style='standard';
 }
 return plan;
};
const v238OldAction=battleAction;
battleAction=function(action){
 if(!battle||battle.busy)return;
 if(action==='v235-defend'||action==='stamina-rest'||action==='switch')return v238OldAction(action);
 const i=Number(action),id=team[battle.active];
 if(!Number.isInteger(i)||i<0||i>3||!id)return v238OldAction(action);
 const style=v238Data().style;
 const styleCost=style==='power'?10:0;
 const total=STAMINA_MOVE_COSTS[i]+v235ExtraCost('player',id)+styleCost;
 if(v238Cooldown('player',id,i)>0){battleMessage(`⏳ ${currentMove(id,i)[0]} is cooling down for ${v238Cooldown('player',id,i)} turn(s).`);renderSideBattle();return;}
 if(staminaPlayerValue(id)<total){battleMessage(`${CREATURES[id].name} needs ${total} stamina for this ${style} move.`);renderSideBattle();return;}
 battle._v238CurrentPlayerStyle=style;
 if(styleCost)battle.stamina.player[id]-=styleCost;
 v238SetCooldown('player',id,i);
 return v238OldAction(action);
};
// CD clock and common-strain stamina advantage run once per finished combat round.
const v238PreviousEndRound=staminaEndRound;
staminaEndRound=function(){
 const b=battle,done=!!(b&&b._staminaPendingRegen&&!b.busy);
 const out=v238PreviousEndRound();
 if(!done||!battle||battle!==b)return out;
 const state=v238Data();state.round++;
 for(const id of Object.keys(state.playerCD))for(const key of Object.keys(state.playerCD[id]))state.playerCD[id][key]=Math.max(0,state.playerCD[id][key]-1);
 for(const key of Object.keys(state.enemyCD))state.enemyCD[key]=Math.max(0,state.enemyCD[key]-1);
 // Non-rare strains gain +5 extra stamina per completed round, capped normally.
 staminaInitialize();
 for(const id of team)if(!CREATURES[id].rarity)
   battle.stamina.player[id]=Math.min(staminaMaximum(progressFor(id).level),battle.stamina.player[id]+5);
 if(!CREATURES[battle.enemy.id].rarity)battle.stamina.enemy=Math.min(staminaMaximum(battle.enemy.level||1),battle.stamina.enemy+5);
 battle._v238CurrentPlayerStyle='standard';battle._v238CurrentEnemyStyle='standard';
 return out;
};
// Combo: Spark Zap weakening must still be active when Thunder Flash lands.
const v238OldSecondary=v235ApplySecondary;
v235ApplySecondary=function(side,id,index,defenderId,hit){
 const enemySide=side==='player'?'enemy':'player';
 const status=side==='player'?!!battle?._v229EnemyWeakened:false;
 const combo=!!(battle&&id==='northern'&&index===2&&status&&hit&&!hit.dodged&&hit.damage>0);
 const resolved=v238OldSecondary(side,id,index,defenderId,hit);
 if(combo){
  const st=enemySide==='enemy'?battle.stamina.enemy:staminaPlayerValue(defenderId);
  const drained=Math.min(st,8+2*v236Steps(v236Level(side,id)));
  if(enemySide==='enemy')battle.stamina.enemy-=drained;else battle.stamina.player[defenderId]-=drained;
  const text=`⚡ COMBO ACTIVATED! Spark Zap + Thunder Flash drains ${drained} STM.`;
  resolved.note=((resolved.note||'')+' '+text).trim();battle._v235ComboUntil=Date.now()+1350;battle._v235ComboText=text;
 }
 return resolved;
};
// UI changes happen after V237 UI wrappers so they survive every redraw.
const v238OldRenderSideBattle=renderSideBattle;
renderSideBattle=function(){
 if(battle&&!battle.busy&&battle._v235EnemyPlan)v238IncomingIntent();
 v238OldRenderSideBattle();
 if(!battle||creatureMode!=='battle')return;
 const id=team[battle.active],s=v238Data();
 const grid=cContent.querySelector('.battle-moves');
 if(!grid)return;
 const picker=document.createElement('div');picker.className='v238-style-switch';
 picker.innerHTML='<strong>Attack style</strong>'+['standard','precision','power'].map(mode=>`<button type="button" data-v238-style="${mode}" class="${s.style===mode?'selected':''}" title="${mode==='standard'?'Normal attack':mode==='precision'?'10% less damage, +10% accuracy and eligible ability chance':'15% more damage, +10 stamina cost'}">${mode.toUpperCase()}</button>`).join('');
 grid.prepend(picker);
 const eff=v238TypeMultiplier(CREATURES[id].type,CREATURES[battle.enemy.id].type);
 cContent.querySelectorAll('.battle-moves button[data-attack]').forEach(btn=>{
  const i=Number(btn.dataset.attack),cd=v238Cooldown('player',id,i),cost=STAMINA_MOVE_COSTS[i]+v235ExtraCost('player',id)+(s.style==='power'?10:0);
  const move=currentMove(id,i),desc=v235Move('player',id,i)?.[0]||v236SignatureLabel(id,i,progressFor(id).level,battle.enemy.level||1);
  const styleMult=s.style==='power'?1.15:s.style==='precision'?.9:1;
  const estimate=Math.max(1,Math.round(scaledDamage(move[1],progressFor(id).level,battle.enemy.level||1)*eff*styleMult));
  const small=btn.querySelector('small');
  if(small)small.innerHTML=`≈${estimate} DMG · ${cost}⚡${eff!==1?` · <span class="v238-type-hint ${eff<1?'resist':''}">${eff>1?'▲ SUPER':'▼ RESIST'} ${Math.round(eff*100)}%</span>`:''}${desc?`<span class="v236-move-detail">${desc}</span>`:''}${cd?`<span class="v236-move-detail">⏳ COOLDOWN: ${cd} TURN${cd===1?'':'S'}</span>`:''}`;
  btn.disabled=!!battle.busy||staminaPlayerValue(id)<cost||cd>0;
  btn.classList.toggle('v238-locked',cd>0);
  btn.title=`${move[0]} | ${move[1]} base DMG, ≈${estimate} before active status/defence | ${cost} STM | ${desc||'Normal hit'} | ${eff>1?'Super effective':eff<1?'Resisted':'Neutral'}${cd?' | Cooldown '+cd:''}`;
 });
 const switchPanel=cContent.querySelector('#v47SwitchPanel');
 if(switchPanel)switchPanel.querySelectorAll('[data-v47-switch]').forEach(btn=>{
  const option=btn.dataset.v47Switch,match=v238TypeMultiplier(CREATURES[option].type,CREATURES[battle.enemy.id].type);
  const text=document.createElement('span');text.className='v238-swap-hint';text.textContent=match>1?' · ▲ Advantage, guard −30%':match<1?' · ▼ Disadvantage':' · Neutral';btn.appendChild(text);
 });
 const intention=cContent.querySelector('.v235-intent');
 if(intention&&battle._v235EnemyPlan?.kind==='attack'&&battle._v235EnemyPlan.index===3)
   intention.textContent=`ENEMY INTENT: 💥 HEAVY ATTACK${battle._v235EnemyPlan.style==='power'?' · POWER':''}`;
 if(battle._v235EnemyPlan?.kind==='attack'&&battle._v235EnemyPlan.index===3){
  const defend=cContent.querySelector('#v235DefendButton');if(defend)defend.title+=' PERFECT GUARD available against the planned heavy attack.';
 }
};
cContent.addEventListener('click',event=>{
 const btn=event.target.closest('[data-v238-style]');if(!btn)return;
 event.preventDefault();event.stopImmediatePropagation();
 if(!battle||battle.busy)return;
 v238Data().style=btn.dataset.v238Style;renderSideBattle();
},true);
