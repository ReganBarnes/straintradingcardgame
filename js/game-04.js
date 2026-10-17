

// V151 — standalone HOME mission. The HOUSE lighter quest is deliberately untouched.

(()=>{
 const home=quietHouses.find(h=>h.name==='HOME');
 const overlay=document.getElementById('oldLadyPinOverlay');
 const choices=overlay.querySelector('#oldLadyPinChoices');
 const feedback=document.getElementById('oldLadyPinFeedback');
 const lines=["I’m so silly — I forgot my PIN number.", "I wrote down a few clues that reveal the correct four-digit PIN.", "Could you solve the riddle and give me the code? I’m so old that I’ve forgotten it."];
 const oldLadyFrameData={
   down:['assets/v204_5e2a67e353eb166290e2144f.png','assets/v204_cc2fb692fec1b2c293a97f10.png','assets/v204_7650e72a7b6d318aa5439c93.png','assets/v204_cbc0ac0d3d1097bc9f15c0b5.png'],
   left:['assets/v204_c3148f5fa8d313719346b5c0.png','assets/v204_378d060ffbaef067a2e0d22e.png','assets/v204_f4ac1fad41831a36882e81eb.png','assets/v204_5cf9969541511bf575dd9c7d.png'],
   right:['assets/v204_668ecfd8f433c91cabf7f604.png','assets/v204_d98c592d4ad84d9bac23b82d.png','assets/v204_eb86bcbb21587e3fa40e6328.png','assets/v204_ca36046230c342c25b1ea30b.png'],
   up:['assets/v204_cfe8840ade7345bd8aea61a3.png','assets/v204_85eab747f23f26c7e1a0ac51.png','assets/v204_a34e820367cdef66fb7f65aa.png','assets/v204_997e1080c8b8546caa512e56.png']
 };
 const oldLadyFrames=Object.fromEntries(Object.entries(oldLadyFrameData).map(([dir,arr])=>[dir,arr.map(src=>{const img=new Image();img.src=src;return img;})]));
 const allOldLadyFrames=Object.values(oldLadyFrames).flat();
 const oldLadyState={
   x:450,y:330,
   route:[
     {x:450,y:330},
     {x:405,y:330},
     {x:405,y:365},
     {x:530,y:365},
     {x:530,y:330},
     {x:450,y:330}
   ],
   targetIndex:1,
   direction:'down',
   stepClock:0,
   moving:false,
   wait:0.28,
   speed:44,
   targetMaxH:108,
   scale:0.42,
   ready:false
 };
 window.saOldLadyNPC=oldLadyState;
 function refreshOldLadyScale(){
   let maxH=0;
   for(const img of allOldLadyFrames){ if(img.complete&&img.naturalHeight) maxH=Math.max(maxH,img.naturalHeight); }
   if(maxH>0){ oldLadyState.scale=oldLadyState.targetMaxH/maxH; oldLadyState.ready=true; }
 }
 allOldLadyFrames.forEach(img=>img.addEventListener('load',refreshOldLadyScale));
 refreshOldLadyScale();
 function resetOldLady(){
   oldLadyState.x=oldLadyState.route[0].x;
   oldLadyState.y=oldLadyState.route[0].y;
   oldLadyState.targetIndex=1;
   oldLadyState.direction='down';
   oldLadyState.stepClock=0;
   oldLadyState.moving=false;
   oldLadyState.wait=0.35;
 }
 function closePuzzle(){oldLadyPinOpen=false;overlay.classList.remove('active');keys.clear()}
 function openPuzzle(){if(oldLadyMissionComplete)return;closeDialog();oldLadyDialogueStep=-1;oldLadyPinOpen=true;feedback.textContent='';overlay.querySelectorAll('[data-pin]').forEach(b=>{b.disabled=false;b.classList.remove('wrong')});keys.clear();overlay.classList.add('active')}
 function earnReward(){
   if(oldLadyMissionComplete)return;
   oldLadyMissionComplete=true;oldLadySpoken=true;
   coins+=25;
   if(typeof v44RefreshWallet==='function')v44RefreshWallet();
   else {const coinText=document.getElementById('coins');if(coinText)coinText.textContent='£'+coins;}
   const earned=[];
   for(const id of collection){
     const p=progressFor(id),oldLevel=p.level;
     p.xp+=20;
     while(p.level<100 && p.xp>=xpNeeded(p.level)){
       p.xp-=xpNeeded(p.level);p.level++;p.bonuses=p.bonuses.map(v=>v+2);
     }
     earned.push(CREATURES[id].name+' +20 XP'+(p.level>oldLevel?' (LEVEL UP!)':''));
   }
   if(typeof v44RefreshBag==='function')v44RefreshBag();
   closePuzzle();missionList();
   show('✅ FORGETFUL MOMENTS COMPLETED','That’s my PIN! Thank you, dear! You earned £25.'+(earned.length?' Your strains gained '+earned.join(', ')+'.':' Collect strains to earn XP rewards.'));
 }
 choices.addEventListener('click',e=>{
   const btn=e.target.closest('[data-pin]');if(!btn||oldLadyMissionComplete||!oldLadyPinOpen)return;
   if(btn.dataset.pin==='4238'){earnReward();return;}
   feedback.textContent='Incorrect PIN! Try another code.';
   btn.classList.remove('wrong');void btn.offsetWidth;btn.classList.add('wrong');
   setTimeout(()=>btn.classList.remove('wrong'),1100);
 });
 overlay.querySelector('#oldLadyPinExit').addEventListener('click',closePuzzle);
 overlay.addEventListener('click',e=>{if(e.target===overlay)closePuzzle()});
 addEventListener('keydown',e=>{
   if(!oldLadyPinOpen)return;
   if(e.key==='Escape'){closePuzzle()}
   e.preventDefault();e.stopImmediatePropagation();
 },true);
 function advanceDialogue(){
   if(oldLadyMissionComplete){oldLadyDialogueStep=-1;show('👵 OLD LADY','Thank you for reminding me of my PIN, dear!');return;}
   oldLadyDialogueStep++;
   if(oldLadyDialogueStep<lines.length){
     show('👵 OLD LADY',lines[oldLadyDialogueStep]);
     const hint=document.querySelector('#dialog small');if(hint)hint.textContent='Press A / Enter to continue';
   }else{
     oldLadyDialogueStep=-1;oldLadySpoken=true;closeDialog();missionList();openPuzzle();
   }
 }
 function updateOldLady(dt){
   if(interior!=='oldladyhome' || dialogOpen || oldLadyPinOpen || missionOpen || shopOpen || battle) return;
   dt=Math.max(0,Math.min(Number(dt)||0,0.05));
   if(!dt) return;
   if(window.SAActorRoutes?.drive('old-lady',oldLadyState,dt))return;
   if(oldLadyState.wait>0){
     oldLadyState.wait=Math.max(0,oldLadyState.wait-dt);
     oldLadyState.moving=false;
     return;
   }
   const target=oldLadyState.route[oldLadyState.targetIndex];
   const dx=target.x-oldLadyState.x, dy=target.y-oldLadyState.y;
   const distLeft=Math.hypot(dx,dy);
   if(distLeft<=1.2){
     oldLadyState.x=target.x; oldLadyState.y=target.y;
     oldLadyState.moving=false;
     oldLadyState.stepClock=0;
     oldLadyState.wait=0.45;
     oldLadyState.targetIndex=(oldLadyState.targetIndex+1)%oldLadyState.route.length;
     return;
   }
   let mx=0,my=0;
   if(Math.abs(dx)>0.8){
     mx=Math.sign(dx)*Math.min(Math.abs(dx),oldLadyState.speed*dt);
     oldLadyState.direction=mx>0?'right':'left';
   }else if(Math.abs(dy)>0.8){
     my=Math.sign(dy)*Math.min(Math.abs(dy),oldLadyState.speed*dt);
     oldLadyState.direction=my>0?'down':'up';
   }
   oldLadyState.x+=mx; oldLadyState.y+=my;
   oldLadyState.moving=!!(mx||my);
   if(oldLadyState.moving) oldLadyState.stepClock+=dt;
  }
 function drawOldLady(){
   const dir=oldLadyFrames[oldLadyState.direction] ? oldLadyState.direction : 'down';
   const frames=oldLadyFrames[dir];
   const frameIndex=oldLadyState.moving ? (Math.floor(oldLadyState.stepClock*7)%4) : 0;
   const img=frames[frameIndex]||frames[0];
   let dw=47,dh=88;
   if(img && img.complete && img.naturalWidth){
     dh=88;
     dw=Math.max(1,Math.round(img.naturalWidth*(dh/img.naturalHeight)));
   }
   const x=Math.round(oldLadyState.x), y=Math.round(oldLadyState.y);
   ctx.save();
   ctx.imageSmoothingEnabled=false;
   ctx.fillStyle='rgba(28,22,18,.33)';
   ctx.beginPath();
   ctx.ellipse(x, y+1, Math.max(11,Math.round(dw*0.21)), Math.max(3,Math.round(dw*0.055)), 0, 0, Math.PI*2);
   ctx.fill();
   if(img && img.complete && img.naturalWidth){
     ctx.drawImage(img, Math.round(x-dw/2), Math.round(y-dh), dw, dh);
   }
   ctx.restore();
   ctx.save();
   ctx.fillStyle='#fff4c1';
   ctx.strokeStyle='#42362b';
   ctx.lineWidth=4;
   ctx.font='900 20px system-ui';
   ctx.textAlign='center';
   ctx.strokeText('OLD LADY',x,y-dh-12);
   ctx.fillText('OLD LADY',x,y-dh-12);
   ctx.fillStyle=oldLadyMissionComplete?'#9cffaa':'#fff0a1';
   ctx.strokeStyle='#4f4325';
   ctx.lineWidth=3;
   ctx.font='900 29px system-ui';
   ctx.strokeText(oldLadyMissionComplete?'✓':'!',x,y-dh-36);
   ctx.fillText(oldLadyMissionComplete?'✓':'!',x,y-dh-36);
   ctx.restore();
 }
 window.__v220DrawOldLady=drawOldLady;
 const originalEnter=enterRoom;
 enterRoom=function(kind){
   originalEnter(kind);
   if(kind==='oldladyhome'){
     document.querySelector('#hud strong').textContent='🏡 HOME';
     closeDialog();keys.clear();resetOldLady();
   }
 };
 const moveBeforeOldLady=move;
 move=function(dt){
   moveBeforeOldLady(dt);
   updateOldLady(dt);
 };
 const originalDraw=drawInterior;
 drawInterior=function(){
   originalDraw();
   if(interior!=='oldladyhome')return;
   ctx.save();
   // Paint over the previous static Old Lady so only the sprite-based NPC remains.
   ctx.fillStyle='#ead9bb';
   ctx.fillRect(300,170,300,240);
   for(let y=155;y<478;y+=54){ctx.strokeStyle='rgba(127,92,61,.25)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(300,y);ctx.lineTo(600,y);ctx.stroke()}
   drawOldLady();
   drawHero(player.x,player.y,player.dir,player.step);
   ctx.fillStyle='#425d50';ctx.fillRect(365,572,170,8);
   text('EXIT ↓',450,625,20,'#f3e7c7');
   ctx.restore();
 };
 const originalInteract=interact;
 interact=function(){
   if(oldLadyPinOpen)return;
   if(oldLadyDialogueStep>=0){advanceDialogue();return;}
   if(interior==='oldladyhome'){
     if(dialogOpen){closeDialog();return;}
     if(player.y>550&&player.x>335&&player.x<565){leaveRoom();return;}
     if(Math.hypot(player.x-oldLadyState.x,player.y-oldLadyState.y)<160){
       if(oldLadyMissionComplete)show('👵 OLD LADY','You remembered my PIN! Such a kind soul.');
       else if(oldLadySpoken)openPuzzle();
       else {oldLadyDialogueStep=-1;advanceDialogue();}
       return;
     }
     show('🏡 HOME','Approach Old Lady and press A to speak.');return;
   }
   if(!interior && home && !dialogOpen && !shopOpen && !missionOpen && !(typeof battle!=='undefined'&&battle)){
     const px=home.x+home.w/2,py=home.y+home.h+12;
     if(Math.hypot(player.x-px,player.y-py)<138){enterRoom('oldladyhome');return;}
   }
   originalInteract();
 };
 const canvas=document.getElementById('game');
 if(canvas)canvas.addEventListener('click',e=>{
   if(interior!=='oldladyhome'||oldLadyPinOpen||missionOpen||shopOpen)return;
   const scale=Math.max(.53,Math.min(1.08,W/950));
   const rect=canvas.getBoundingClientRect();
   const xx=(e.clientX-rect.left)*(W/rect.width),yy=(e.clientY-rect.top)*(H/rect.height);
   const roomX=xx/scale-(W/scale-900)/2;
   const roomY=yy/scale-(H/scale-680)/2;
   // Old Lady speaks only through the A control, not a direct canvas tap.
 });

// V152 — usable Cure Shop supplies. Preserve every existing battle, quest and inventory handler.
const v152Style=document.createElement('style');
v152Style.textContent=`
#bagPackContents .v152-use-btn{background:#417b39;color:#fff7dd;border:2px solid #b9d98a;border-radius:9px;padding:7px 12px;font-weight:850;cursor:pointer}
#bagPackContents .v152-use-btn:hover{background:#5b9b41}
#v152Select{display:none;margin:12px 0;background:#10291f;border:2px solid #d6b56a;border-radius:12px;padding:12px;max-height:min(45vh,300px);overflow:auto}
#v152Select.open{display:block}#v152Select h3{font-size:17px;margin:0 0 8px;color:#ffe0a4}
#v152Select p{font-size:13px;margin:6px 0;color:#e8dfc5}
#v152Select button{display:block;width:100%;margin:5px 0;background:#38604a;border:1px solid #acd084;border-radius:8px;color:white;padding:10px;text-align:left;cursor:pointer}
#v152Select button:disabled{opacity:.4;cursor:not-allowed}#v152Select button:not(:disabled):hover{background:#548662}
#v152Select .v152-cancel{background:#654336;text-align:center}
#v152TerpButton{background:#39774b!important;color:#fff6c7!important;border:2px solid #c0e393!important;cursor:pointer}
#v152TerpButton:disabled{opacity:.55;cursor:not-allowed}
`;
document.head.appendChild(v152Style);
const v152BagPanel=document.getElementById('bagPackWindow');
const v152Selector=document.createElement('div');v152Selector.id='v152Select';
v152BagPanel.insertBefore(v152Selector,document.getElementById('bagPackClose'));
let v152SelectedItem=null;
const v152ItemHelp={jar:'Heals 25% of the chosen strain’s maximum HP. Can revive a fainted strain.',bong:'Awards 50 XP to one chosen strain.',spray:'Can only be used during a battle on your active strain.'};
function v152UpdateBag(){
 const holder=document.getElementById('bagPackContents');
 for(const id of ['jar','bong','spray']){
  const row=[...holder.querySelectorAll('.bagItem')].find(el=>el.textContent.includes(shopItems[id].name));
  if(!row||row.querySelector('.v152-use-btn'))continue;
  const use=document.createElement('button');use.type='button';use.className='v152-use-btn';
  use.textContent=id==='spray'?'BATTLE ONLY':'USE';
  use.disabled=id==='spray';
  use.title=v152ItemHelp[id];
  use.addEventListener('click',()=>v152ChooseStrain(id));
  row.appendChild(use);
 }
}
const v152OriginalRefreshBag=v44RefreshBag;
v44RefreshBag=function(){v152OriginalRefreshBag();v152UpdateBag()};
function v152ChooseStrain(itemId){
 if(battle||!['jar','bong'].includes(itemId)||(inventory[itemId]||0)<1)return;
 v152SelectedItem=itemId;
 syncCreatureHealth();
 const ids=[...new Set(collection)].filter(id=>CREATURES[id]);
 v152Selector.classList.add('open');
 v152Selector.replaceChildren();
 const heading=document.createElement('h3');heading.textContent=itemId==='jar'?'🫙 Heal a strain':'🧪 Give 50 XP';v152Selector.appendChild(heading);
 const info=document.createElement('p');info.textContent=v152ItemHelp[itemId];v152Selector.appendChild(info);
 if(!ids.length){const n=document.createElement('p');n.textContent='You have no strains yet.';v152Selector.appendChild(n)}
 ids.forEach(id=>{
  const p=progressFor(id),hp=Math.max(0,creatureHealth[id]??maxHealth(id)),max=maxHealth(id);
  const b=document.createElement('button');b.type='button';
  b.textContent=`${CREATURES[id].name} · Lv.${p.level} · HP ${hp}/${max}`;
  b.disabled=itemId==='jar'&&hp>=max;
  b.addEventListener('click',()=>v152UseSupply(itemId,id));
  v152Selector.appendChild(b);
 });
 const close=document.createElement('button');close.className='v152-cancel';close.textContent='← CANCEL';close.addEventListener('click',v152CloseSelector);v152Selector.appendChild(close);
}
function v152CloseSelector(){v152SelectedItem=null;v152Selector.classList.remove('open');v152Selector.replaceChildren()}
function v152UseSupply(itemId,id){
 if(battle||v152SelectedItem!==itemId||(inventory[itemId]||0)<1||!collection.includes(id))return;
 const name=CREATURES[id]?.name;if(!name)return;
 let message='';
 if(itemId==='jar'){
  const maximum=maxHealth(id),before=Math.max(0,creatureHealth[id]??maximum);
  if(before>=maximum)return;
  const amount=Math.max(1,Math.ceil(maximum*.25));
  creatureHealth[id]=Math.min(maximum,before+amount);
  message=`${name} recovered ${creatureHealth[id]-before} HP (${creatureHealth[id]}/${maximum}).`;
 }else if(itemId==='bong'){
  const p=progressFor(id),before=p.level;
  p.xp+=50;
  while(p.level<100&&p.xp>=xpNeeded(p.level)){
   p.xp-=xpNeeded(p.level);p.level++;
   p.bonuses=p.bonuses.map(x=>x+2+Math.floor(Math.random()*4));
  }
  message=`${name} gained 50 XP${p.level>before?' and reached Lv. '+p.level+'!':'!'}`;
 }else return;
 inventory[itemId]--;
 v152CloseSelector();v44RefreshBag();
 const note=document.createElement('p');note.style.cssText='color:#d9f3a9;font-weight:800;padding:8px 4px';note.textContent=message;
 document.getElementById('bagPackContents').prepend(note);
}
const v152CloseBagPrevious=v44CloseBag;
v44CloseBag=function(){v152CloseSelector();v152CloseBagPrevious()};
// Existing registered close handlers use their earlier function. Hide selector whenever bag reopens.
bagPackBtn.addEventListener('click',()=>{if(bagPackOverlay.classList.contains('open'))v152CloseSelector()});
const v152OldRenderBattle=renderSideBattle;
renderSideBattle=function(){
 v152OldRenderBattle();
 if(!battle)return;
 const actions=cContent.querySelector('.battle-moves');if(!actions)return;
 const button=document.createElement('button');button.type='button';button.id='v152TerpButton';
 const activeId=team[battle.active],used=!!battle.terpTarget;
 button.disabled=!!battle.busy||used||(inventory.spray||0)<1;
 button.innerHTML=used?'💨 TERP ACTIVE <small>+20% '+(CREATURES[battle.terpTarget]?.name||'')+'</small>':`💨 TERP SPRAY <small>× ${inventory.spray||0} · +20% attack</small>`;
 actions.appendChild(button);
};
cContent.addEventListener('click',event=>{
 const btn=event.target.closest('#v152TerpButton');if(!btn)return;
 event.preventDefault();event.stopImmediatePropagation();
 if(!battle||battle.busy||battle.terpTarget||(inventory.spray||0)<1)return;
 const chosen=team[battle.active];if(!chosen)return;
 inventory.spray--;
 battle.terpTarget=chosen;
 battleMessage(`${CREATURES[chosen].name} used Terp Spray! Its attacks deal 20% more damage for this battle.`);
 v44RefreshBag();renderSideBattle();
},true);
// Called only by player attack paths (Gym, wild and Woodland Hobo), never by enemy attacks.
function v152ResolvePlayerAttack(attackerId,defenderId,attackerLevel,defenderLevel,base){
 const result=v26ResolveAttack(attackerId,defenderId,attackerLevel,defenderLevel,base);
 if(battle&&battle.terpTarget===attackerId&&!result.dodged){result.damage=Math.max(1,Math.round(result.damage*1.20))}
 return result;
}
// If the Bag is closed with its original handler, don't leave a selector open on the next visit.
const v152OldBagButton=bagPackBtn.onclick;
document.getElementById('bagPackClose').addEventListener('click',v152CloseSelector);
bagPackOverlay.addEventListener('click',e=>{if(e.target===bagPackOverlay)v152CloseSelector()});
addEventListener('keydown',e=>{if(e.key==='Escape')v152CloseSelector()});

})();
