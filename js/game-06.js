
// V170 COMBAT FIX: V152 put this attack resolver inside a private IIFE,
// but gym, wild, Woodland Hobo, and Langy battle actions call it globally.
// Expose the same damage logic in the shared game scope so the delayed
// player-attack callback no longer throws ReferenceError after a move.
function v152ResolvePlayerAttack(attackerId, defenderId, attackerLevel, defenderLevel, base) {
  const result = v26ResolveAttack(attackerId, defenderId, attackerLevel, defenderLevel, base);
  if (battle && battle.terpTarget === attackerId && !result.dodged) {
    result.damage = Math.max(1, Math.round(result.damage * 1.20));
  }
  return result;
}

// V168: Secret sewer bonus level and the one-time Langy challenge.
const langyManhole={x:1920,y:1550};
function sewerUnlocked(){
  // An optional mission check must never throw during world drawing.
  try { return !!(oldLadyMissionComplete && cabinMissionFinished && lighterDelivered && player.badges>0 &&
    cottagePipesFixed && flowerDeliveryDone && flowerConversationDone); }
  catch(error){ console.warn('Sewer unlock pending mission data:',error); return false; }
}
const langySewer={inside:false,exit:{x:452,y:547},npc:{x:450,y:397,dir:'down',moving:false},routeIndex:1,pace:0,lastPaceTime:0};
// V251: walkable sewer platform traced to the approved room art; water and walls remain solid.
const langyPlatform=[
 [250,220],[380,220],[380,238],[488,238],[488,220],[650,220],
 [650,236],[711,236],[711,260],[746,260],[746,380],[710,380],
 [710,431],[573,431],[573,456],[505,456],[505,474],[502,474],
 [502,531],[397,531],[397,474],[395,474],[395,456],[309,456],
 [309,431],[186,431],[186,380],[129,380],[129,262],[177,262],
 [177,238],[250,238]
];
// Pipes, crates, barrels and other raised props are impassable. Floor grates remain walkable.
const langyObstacles=[
 [181,211,240,283],[181,212,386,430],[680,704,382,429],
 [138,165,351,392],[679,708,326,367]
];
function langyOnPlatform(x,y){
 let inside=false;
 for(let i=0,j=langyPlatform.length-1;i<langyPlatform.length;j=i++){
  const a=langyPlatform[i],b=langyPlatform[j];
  if(((a[1]>y)!==(b[1]>y))&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])inside=!inside;
 }
 return inside;
}
function langyCanWalk(x,y,radius=10){
 for(const dx of [-radius,radius])for(const dy of [-radius,radius]){
  if(!langyOnPlatform(x+dx,y+dy))return false;
 }
 for(const [x1,x2,y1,y2] of langyObstacles){
  if(x+radius>x1&&x-radius<x2&&y+radius>y1&&y-radius<y2)return false;
 }
 return true;
}
// Point 1 is always the central spawn; all following segments are cardinal directions.
const langyPatrol=[{x:450,y:397},{x:520,y:397},{x:520,y:445},
 {x:380,y:445},{x:380,y:397},{x:450,y:397}];
function langyUpdatePatrol(dt){
 const npc=langySewer.npc;
 npc.moving=false;
 if(dialogOpen||langyChoiceOpen||battle||!dt)return;
 const target=langyPatrol[langySewer.routeIndex];
 const dx=target.x-npc.x,dy=target.y-npc.y;
 if(Math.hypot(dx,dy)<0.5){
  npc.x=target.x;npc.y=target.y;
  langySewer.routeIndex=(langySewer.routeIndex+1)%langyPatrol.length;
  return;
 }
 const horizontal=Math.abs(dx)>0.5;
 const step=Math.min(Math.abs(horizontal?dx:dy),49*dt);
 const signed=Math.sign(horizontal?dx:dy)*step;
 const nx=npc.x+(horizontal?signed:0),ny=npc.y+(horizontal?0:signed);
 npc.dir=horizontal?(signed>0?'right':'left'):(signed>0?'down':'up');
 if(langyCanWalk(nx,ny,9)){
  npc.x=nx;npc.y=ny;npc.moving=true;
  langySewer.pace+=dt*8;
 } else {
  // Retarget rather than walking into a wall, water or prop.
  langySewer.routeIndex=(langySewer.routeIndex+1)%langyPatrol.length;
 }
}

// V209: Approved Langy animation and approved large-platform sewer interior.
// These assets augment only Langy's existing optional sewer challenge.
const langyRoomArtwork=new Image();langyRoomArtwork.src='assets/langy_sewer_room.png';
const langyWalkArtwork=new Image();langyWalkArtwork.src='editor/npcs/langy_walk.png';
const langyAngryArtwork='assets/langy_angry_dialogue.png';

const langyStyles=document.createElement('style');
langyStyles.textContent=`
#langyChoice{position:fixed;inset:0;z-index:100050;display:none;justify-content:center;align-items:center;background:rgba(3,12,9,.8);padding:16px;box-sizing:border-box}
#langyChoice.visible{display:flex}
#langyChoice .panel{border:5px solid #8fae87;background:linear-gradient(145deg,#233b35,#142521);color:#fff1c6;max-width:510px;width:100%;box-shadow:0 15px 55px #000b,0 0 32px #609a7170;text-align:center;padding:25px 18px;border-radius:17px;font-family:system-ui,sans-serif}
#langyChoice h2{margin:0 0 13px;color:#d6f8bc;font-size:26px}
#langyChoice p{font-size:18px;line-height:1.45}
#langyChoice .answers{display:flex;gap:15px;justify-content:center;flex-wrap:wrap;margin-top:21px}
#langyChoice button{border:3px solid #b8d19d;border-radius:10px;background:#45674d;color:white;cursor:pointer;padding:13px 23px;font-weight:900;font-size:18px;transition:transform .15s,background .15s}
#langyChoice button:hover{background:#388a54;transform:scale(1.07)}
#langyChoice #langyWalk{background:#795143;border-color:#cca587}
#langyChoice #langyWalk:hover{background:#a75e4c}
#langyChoice .langyDialoguePortrait{display:block;max-width:min(48vw,235px);height:min(31vh,260px);object-fit:contain;margin:0 auto 7px;filter:drop-shadow(0 4px 8px #000b);image-rendering:auto}
@media(max-height:490px){#langyChoice .panel{padding:8px 14px;max-height:96dvh;overflow:auto}#langyChoice h2{font-size:16px;margin:0}#langyChoice p{font-size:13px;margin:3px auto}#langyChoice .langyDialoguePortrait{height:23vh}#langyChoice .answers{margin-top:8px}#langyChoice button{padding:7px 12px;font-size:13px}}
`;
document.head.appendChild(langyStyles);
const langyChoice=document.createElement('div');langyChoice.id='langyChoice';
langyChoice.innerHTML='<div class="panel"><h2>🕳️ LANGY — SEWER CHALLENGE</h2><img class="langyDialoguePortrait" src="'+langyAngryArtwork+'" alt="Langy looking furious and pointing"><p>"If you don\'t battle me I\'m going to have a seizure"</p><div class="answers"><button id="langyBattle" type="button">⚔️ BATTLE</button><button id="langyWalk" type="button">🚶 WALK AWAY</button></div><p style="font-size:13px;opacity:.8">Walking away permanently forfeits this challenge.</p></div>';
document.body.appendChild(langyChoice);
function langyShowChoice(){if(langyWon){show('LANGY','Fair play! You already beat me.');return}if(langyDeclined){show('LANGY','You walked away. No second chance.');return}if(battle)return;langyChoiceOpen=true;keys.clear();langyChoice.classList.add('visible')}
function langyHideChoice(){langyChoiceOpen=false;langyChoice.classList.remove('visible');keys.clear()}
function langyEnterSewer(){if(!sewerUnlocked())return;
  langySewer.inside=true;interior='sewer';returnSpot={x:langyManhole.x,y:langyManhole.y};
  const start=langyPatrol[0];
  Object.assign(langySewer.npc,{x:start.x,y:start.y,dir:'down',moving:false});
  langySewer.routeIndex=1;langySewer.pace=0;langySewer.lastPaceTime=performance.now();
  player.x=450;player.y=517;player.dir='up';keys.clear();closeDialog();
  document.querySelector('#hud strong').textContent='🕳️ LEAF TOWN SEWERS';
  show('🕳️ THE SEWERS','The hidden manhole leads to a damp underground tunnel. Find Langy near the back. Return to the ladder to leave.');
}
// V171: Find a genuinely walkable tile outside the manhole. Fixed offsets could
// place the hero inside the hitbox of a nearby house and trap them there.
function langySafeSurfaceSpot(){
  const ox=langyManhole.x,oy=langyManhole.y;
  const candidates=[];
  for(const r of [120,145,175,215,260,310,370]){
    for(let i=0;i<16;i++){
      const a=Math.PI*2*i/16;
      candidates.push({x:ox+Math.cos(a)*r,y:oy+Math.sin(a)*r});
    }
  }
  const free=(x,y)=>{
    if(x<40||y<45||x>world.w-40||y>world.h-45)return false;
    if(buildings.some(b=>x>b.x+15&&x<b.x+b.w-15&&y>b.y+30&&y<b.y+b.h+17))return false;
    if(x>gym.x&&x<gym.x+gym.w&&y>gym.y&&y<gym.y+gym.h+17)return false;
    return true;
  };
  return candidates.find(p=>free(p.x,p.y))||{x:Math.max(40,Math.min(world.w-40,ox)),y:Math.max(45,Math.min(world.h-45,oy))};
}
function langyLeaveSewer(){
  if(battle||langyChoiceOpen)return;
  langySewer.inside=false;
  interior=null;
  const exit=langySafeSurfaceSpot();
  player.x=exit.x;player.y=exit.y;player.dir='down';
  keys.clear();
  document.querySelector('#hud strong').textContent='🌿 LEAF TOWN';
  // A dialog freezes movement in the base game; do not open one on exit.
  closeDialog();
}
function langyDrawSewer(){
  // Exactly the approved sewer room art, with its original aspect ratio intact.
  ctx.fillStyle='#060b0d';ctx.fillRect(0,0,900,680);
  if(langyRoomArtwork.complete&&langyRoomArtwork.naturalWidth){
    ctx.save();ctx.imageSmoothingEnabled=false;
    const factor=Math.min(900/langyRoomArtwork.naturalWidth,680/langyRoomArtwork.naturalHeight);
    const dw=langyRoomArtwork.naturalWidth*factor,dh=langyRoomArtwork.naturalHeight*factor;
    ctx.drawImage(langyRoomArtwork,(900-dw)/2,(680-dh)/2,dw,dh);
    ctx.restore();
  }else{
    // Keep the room playable when an image is still loading.
    ctx.fillStyle='#364940';ctx.fillRect(92,168,716,360);
    ctx.fillStyle='#15524b';ctx.fillRect(80,530,745,78);
  }
  // Four-direction walking, feet-anchored at the exact platform coordinates.
  const ms=performance.now();
  const dt=langySewer.lastPaceTime?Math.min(.05,Math.max(0,(ms-langySewer.lastPaceTime)/1000)):0;
  langySewer.lastPaceTime=ms;
  langyUpdatePatrol(dt);
  const {x,y,dir,moving}=langySewer.npc;
  const row={down:0,left:1,right:2,up:3}[dir]??0;
  const frame=moving?[1,2,3,0][Math.floor(langySewer.pace)%4]:0;
  ctx.save();ctx.imageSmoothingEnabled=false;
  ctx.fillStyle='rgba(5,9,7,.42)';ctx.beginPath();ctx.ellipse(x,y+2,30,7,0,0,Math.PI*2);ctx.fill();
  if(langyWalkArtwork.complete&&langyWalkArtwork.naturalWidth){
    // Unclipped 128x160 pose cells; the transparent silhouettes are fully preserved.
    ctx.drawImage(langyWalkArtwork,frame*128,row*160,128,160,Math.round(x-35),Math.round(y-84),70,88);
  }else{
    ctx.fillStyle='#735d3f';ctx.fillRect(x-18,y-67,36,65);
    ctx.fillStyle='#c88961';ctx.beginPath();ctx.arc(x,y-76,18,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
  text('LANGY',x,y-96,19,'#ffe6a4');
  if(!langyWon&&!langyDeclined)text('!',x,y-115,31,'#ffda60');
  else text(langyWon?'✓':'×',x,y-115,30,langyWon?'#a3ffaa':'#ff998e');
  // Entrance/exit stays at the bottom ladder, exactly as the existing quest expects.
  text('EXIT LADDER',450,610,17,'#f0dfa4');
  drawHero(player.x,player.y,player.dir,player.step);
}
function langyRenderSewer(){
  ctx.clearRect(0,0,W,H);ctx.save();
  const scale=Math.max(.53,Math.min(1.08,W/950));
  ctx.scale(scale,scale);
  ctx.translate((W/scale-900)/2,(H/scale-680)/2);
  langyDrawSewer();ctx.restore();
}
function langyDrawManhole(){
 if(currentDistrict!=='leaf'||!sewerUnlocked())return;
 const {x,y}=langyManhole;ctx.save();ctx.translate(x,y);
 ctx.fillStyle='#20352b';ctx.beginPath();ctx.ellipse(0,3,47,24,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#56615d';ctx.beginPath();ctx.ellipse(0,0,43,22,0,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle='#a0a8a0';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(0,0,43,22,0,0,Math.PI*2);ctx.stroke();
 ctx.strokeStyle='#36403c';ctx.lineWidth=3;
 for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(i*9,-10);ctx.lineTo(i*9+4,11);ctx.stroke()}
 if(Math.hypot(player.x-x,player.y-y)<115)text('A: ENTER SEWERS',0,-50,16,'#ffefb8');ctx.restore();
}
const v168OldInteract=interact;
interact=function(){
 if(langyChoiceOpen)return;
 if(langySewer.inside){
   if(dialogOpen){closeDialog();return}
   // The exit always takes priority when standing on the ladder, even if Langy is close.
   if(player.y>490&&player.x>340&&player.x<565){langyLeaveSewer();return}
   if(Math.hypot(player.x-langySewer.npc.x,player.y-langySewer.npc.y)<125){langyShowChoice();return}
   show('🕳️ SEWERS','Approach Langy to speak, or the exit ladder to leave.');return;
 }
 if(!interior&&currentDistrict==='leaf'&&sewerUnlocked()&&Math.hypot(player.x-langyManhole.x,player.y-langyManhole.y)<95){langyEnterSewer();return}
 return v168OldInteract();
};
const v168OldMove=move;
move=function(dt){
 if(langyChoiceOpen)return;
 if(!langySewer.inside)return v168OldMove(dt);
 if(dialogOpen||battle||shopOpen||missionOpen)return;
 let dx=0,dy=0;
 if(keys.has('left')||keys.has('ArrowLeft')||keys.has('a'))dx--;
 if(keys.has('right')||keys.has('ArrowRight')||keys.has('d'))dx++;
 if(keys.has('up')||keys.has('ArrowUp')||keys.has('w'))dy--;
 if(keys.has('down')||keys.has('ArrowDown')||keys.has('s'))dy++;
 if(!dx&&!dy)return;
 // Movement remains four-directional; keep the currently facing axis on diagonals.
 if(dx&&dy){if(player.dir==='left'||player.dir==='right')dy=0;else dx=0;}
 player.dir=dx?(dx>0?'right':'left'):(dy>0?'down':'up');
 const step=152*Math.min(dt,.04);
 const nextX=player.x+dx*step,nextY=player.y+dy*step;
 if(dx&&langyCanWalk(nextX,player.y,10))player.x=nextX;
 if(dy&&langyCanWalk(player.x,nextY,10))player.y=nextY;
 player.step+=dt;
};
function langyStartBattle(){
 if(langyWon||langyDeclined)return;
 syncCreatureHealth();
 if(!team.length||!team.some(id=>(creatureHealth[id]??maxHealth(id))>0)){
  show('🌿 HEAL YOUR STRAINS','Your team must be healthy to battle Langy. Visit the Cure Shop and return.');return;
 }
 battleToken++;
 const level=10,enemyId='star';
 battle={mode:'langy',active:team.findIndex(id=>(creatureHealth[id]??maxHealth(id))>0),
  hp:Object.fromEntries(team.map(id=>[id,Math.max(0,creatureHealth[id]??maxHealth(id))])),
  enemy:{id:enemyId,level,maxHp:maxHealth(enemyId,level),hp:maxHealth(enemyId,level)},
  busy:false,log:'Langy sends out his Level 10 Star Dawg! You cannot capture a trainer-owned strain.'};
 keys.clear();openCreatures('battle');
 if(musicOn){startMusic();if(audio&&audio.state==='suspended')audio.resume().catch(()=>{});beat=0;lastMusicBattleMode=false;musicTick()}
}
langyChoice.querySelector('#langyBattle').addEventListener('click',()=>{langyHideChoice();langyStartBattle()});
langyChoice.querySelector('#langyWalk').addEventListener('click',()=>{langyHideChoice();langyDeclined=true;missionList();show('LANGY','You walked away. Langy will not challenge you again.');});
const v168OldBattleAction=battleAction;
battleAction=function(action){
 if(battle?.mode!=='langy')return v168OldBattleAction(action);
 if(battle.busy)return;
 const index=Number(action);if(action==='switch')return;
 if(!Number.isInteger(index)||index<0||index>3)return;
 const attacker=team[battle.active];if(!attacker)return;
 battle.busy=true;const token=++battleToken,move=currentMove(attacker,index);
 battleMessage(`${CREATURES[attacker].name} used ${move[0]}!`);
 moveSound(attacker,index);renderSideBattle();animateBattleSprite('player','strike');
 setTimeout(()=>{
  if(!battle||battle.mode!=='langy'||token!==battleToken)return;
  const hit=v152ResolvePlayerAttack(attacker,'star',progressFor(attacker).level,10,move[1]);
  if(!hit.dodged){battle.enemy.hp=Math.max(0,battle.enemy.hp-hit.damage);hitSound()}
  renderSideBattle();if(!hit.dodged)animateBattleSprite('enemy','hit');
  battleMessage(hit.dodged?'Star Dawg dodged!':`${move[0]} dealt ${hit.damage} damage! ${hit.note}`);
  if(battle.enemy.hp<=0){setTimeout(()=>{if(battle?.mode==='langy'&&token===battleToken)finishBattleVictory()},720);return}
  setTimeout(()=>{
   if(!battle||battle.mode!=='langy'||token!==battleToken)return;
   const moves=ATTACKS.star,n=staminaChooseEnemyIndex(moves),enemyMove=n<0?['Recover',0]:moves[n];
   battleMessage(`Langy’s Lv. 10 Star Dawg used ${enemyMove[0]}!`);
   moveSound('star',n);animateBattleSprite('enemy','strike');
   setTimeout(()=>{
    if(!battle||battle.mode!=='langy'||token!==battleToken)return;
    const target=team[battle.active];
    const hit=v26ResolveAttack('star',target,10,progressFor(target).level,enemyMove[1]);
    if(!hit.dodged){battle.hp[target]=Math.max(0,battle.hp[target]-hit.damage);hitSound()}
    renderSideBattle();if(!hit.dodged)animateBattleSprite('player','hit');
    battleMessage(hit.dodged?`${CREATURES[target].name} dodged!`:`${CREATURES[target].name} took ${hit.damage} damage! ${hit.note}`);
    setTimeout(()=>{
     if(!battle||battle.mode!=='langy'||token!==battleToken)return;
     if(battle.hp[target]<=0){const next=team.findIndex(id=>battle.hp[id]>0);if(next<0){finishBattleDefeat();return}
       battle.active=next;battleMessage(`${CREATURES[team[next]].name}, you're up!`);
     }else battleMessage(`What will ${CREATURES[team[battle.active]].name} do?`);
     battle.busy=false;renderSideBattle();
    },480);
   },440);
  },550);
 },390);
};
const v168OldVictory=finishBattleVictory;
finishBattleVictory=function(){
 if(battle?.mode!=='langy')return v168OldVictory();
 saveBattleHealth();battleToken++;battle=null;closeBeforeSideBattle();
 if(!langyWon){langyWon=true;coins+=75;inventory.baggy=(inventory.baggy||0)+2;inventory.spray=(inventory.spray||0)+1;v44RefreshWallet();v44RefreshBag();missionList()}
 show('🏆 LANGY DEFEATED!','You beat Langy’s Level 10 Star Dawg! Earned £75, 2 Baggies and 1 Terp Spray. The sewer bonus mission is complete!');
};
const v168OldDefeat=finishBattleDefeat;
finishBattleDefeat=function(){
 if(battle?.mode!=='langy')return v168OldDefeat();
 saveBattleHealth();battleToken++;battle=null;closeBeforeSideBattle();
 show('💫 LANGY WINS','Your team fainted! You can heal your strains and challenge Langy again, unless you walk away.');
};
const v168OldRenderBattle=renderSideBattle;
renderSideBattle=function(){v168OldRenderBattle();if(battle?.mode!=='langy')return;
 cTitle.textContent='🕳️ SEWERS — LANGY';cHelp.textContent='Trainer battle · Level 10 Star Dawg · No captures';
 const enemyBadge=document.querySelector('.battle-hud.enemy .row span:last-child');if(enemyBadge)enemyBadge.textContent='Lv. 10';
 const enemyBar=document.querySelector('.battle-hud.enemy .hp');if(enemyBar)enemyBar.textContent='HP '+battle.enemy.hp+' / '+battle.enemy.maxHp;
 const enemyFill=document.querySelector('.battle-hud.enemy .fill');if(enemyFill)enemyFill.style.width=Math.max(0,100*battle.enemy.hp/battle.enemy.maxHp)+'%';
 const capture=document.querySelector('#captureWildButton');if(capture)capture.remove();
};
