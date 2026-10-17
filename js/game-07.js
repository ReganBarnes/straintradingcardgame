
/* V178 — Forest Lodge: Furry's Wear a Costume quest, Costume Shop, usable hats. */
var furryQuestStarted=false, furryQuestCompleted=false, furryDialogueStep=-1;
window.furryQuestStarted=false;window.furryQuestCompleted=false;
const furryLodge=groveHouses.find(h=>h.n==='FOREST LODGE');
const costumeHouse={x:1640,y:555,n:'COSTUME SHOP',c:'#e7b5d6'};
const costumeDoor={x:costumeHouse.x+120,y:costumeHouse.y+181};
const costumeCatalog={
  beanie:{name:'Forest Beanie',price:20,sell:12},
  cap:{name:'Leaf Cap',price:30,sell:19},
  cowboy:{name:'Cowboy Hat',price:45,sell:30}
};
var wornCostume=null;
for(const key of Object.keys(costumeCatalog))inventory['hat_'+key]=inventory['hat_'+key]||0;
// Reserve room for the store before drawing/collision so woodland remains navigable.
for(let i=groveForestTrees.length-1;i>=0;i--){const t=groveForestTrees[i];
 if(t.x>costumeHouse.x-80&&t.x<costumeHouse.x+320&&t.y>costumeHouse.y-130&&t.y<costumeHouse.y+235)groveForestTrees.splice(i,1);
}
for(let i=groveBoulders.length-1;i>=0;i--){const b=groveBoulders[i];
 if(b.x>costumeHouse.x-70&&b.x<costumeHouse.x+310&&b.y>costumeHouse.y-90&&b.y<costumeHouse.y+260)groveBoulders.splice(i,1);
}
const oldCostumeGroveBlocked=groveBlocked;
groveBlocked=function(x,y){
 if(x>costumeHouse.x-20&&x<costumeHouse.x+260&&y>costumeHouse.y-75&&y<costumeHouse.y+180)return true;
 return oldCostumeGroveBlocked(x,y);
};
function furryAtDoor(h){return jjNearDoor(h)}
function costumeNearDoor(){return Math.hypot(player.x-costumeDoor.x,player.y-costumeDoor.y)<125}
var costumeReturn=null;
function costumeOpenRoom(which){
 costumeReturn={x:player.x,y:player.y};interior=which;keys.clear();player.x=450;player.y=535;player.dir='up';closeDialog();
 document.querySelector('#hud strong').textContent=which==='furrylodge'?'🏡 FOREST LODGE':'🎩 COSTUME SHOP';
}
function costumeLeaveRoom(){
 const prev=interior;interior=null;keys.clear();
 const door=prev==='furrylodge'?jjDoor(furryLodge):costumeDoor;
 player.x=costumeReturn?.x??door.x;player.y=costumeReturn?.y??(door.y+60);
 player.dir='down';closeDialog();document.querySelector('#hud strong').textContent='🌲 EASTERN GROVE';
}
function furryRefreshJournal(){window.furryQuestStarted=furryQuestStarted;window.furryQuestCompleted=furryQuestCompleted;missionList();}
const furryLines=['You look so boring','go to the costume shop and pick a costume','Come back wearing your new costume'];
function furrySpeak(){
 if(furryQuestCompleted){show('🐾 FURRY','Looking good! That costume suits you.');return;}
 if(!furryQuestStarted){furryDialogueStep=0;show('🐾 FURRY',furryLines[0]);return;}
 if(wornCostume){
  // This runs once only: finished quests return via the guard above.
  furryQuestCompleted=true;
  coins+=60;
  const xpRewards=[];
  for(const id of [...new Set(collection)]){
   const p=progressFor(id),previousLevel=p.level;
   p.xp+=25;
   while(p.level<100&&p.xp>=xpNeeded(p.level)){
    p.xp-=xpNeeded(p.level);p.level++;
    p.bonuses=p.bonuses.map(v=>v+2+Math.floor(Math.random()*4));
   }
   xpRewards.push(`${CREATURES[id]?.name||id}: +25 XP${p.level>previousLevel?' (LEVEL UP!)':''}`);
  }
  furryRefreshJournal();
  if(typeof v44RefreshWallet==='function')v44RefreshWallet();
  if(typeof v44RefreshBag==='function')v44RefreshBag();
  show('✅ MISSION COMPLETE — DRESS TO IMPRESS',`Furry loves your ${costumeCatalog[wornCostume].name}! Reward: £60 and 25 XP for each collected strain.${xpRewards.length?' '+xpRewards.join(' · '):''}`);
  return;
 }
 show('🐾 FURRY','Come back wearing your new costume! Buy a hat at the Costume Shop, then equip it from Bag Pack.');
}
function furryAdvance(){
 closeDialog();furryDialogueStep++;
 if(furryDialogueStep<furryLines.length){show('🐾 FURRY',furryLines[furryDialogueStep]);return;}
 furryDialogueStep=-1;furryQuestStarted=true;furryRefreshJournal();
 show('🎩 NEW MISSION: DRESS TO IMPRESS','Visit the Costume Shop in Eastern Grove. Buy one of the three hats, equip it using Bag Pack, then return to Furry in Forest Lodge.');
}
// Shop uses its own click-friendly panel; nothing about Cure Shop is replaced.
const costumePanel=document.createElement('div');costumePanel.id='costumePanel';costumePanel.style.cssText='position:fixed;inset:0;z-index:9500;background:rgba(10,19,14,.86);display:none;align-items:center;justify-content:center;padding:18px;box-sizing:border-box';
costumePanel.innerHTML=`<div style="width:min(520px,96vw);max-height:85vh;overflow:auto;background:linear-gradient(#62432b,#342719);border:4px solid #caa46c;border-radius:16px;color:#fff5d8;padding:22px;text-align:center;box-shadow:0 18px 55px #000b;font-family:system-ui,sans-serif"><h2 style="margin:0 0 8px;color:#ffdf91">🎩 COSTUME SHOP</h2><p id="costumeWallet" style="margin:8px 0 16px"></p><div id="costumeOptions"></div><p id="costumeFeedback" style="min-height:22px;color:#ffe0a5"></p><button id="costumeDone" style="padding:12px 38px;border-radius:9px;border:2px solid #edc98b;background:#486b45;color:#fff;font-weight:bold;cursor:pointer">BACK</button></div>`;
document.body.appendChild(costumePanel);
const costumeOptions=costumePanel.querySelector('#costumeOptions');
function costumeInventory(){return Object.keys(costumeCatalog).filter(h=>(inventory['hat_'+h]||0)>0)}
function costumeDrawShop(message=''){
 costumePanel.querySelector('#costumeWallet').textContent='Your money: £'+coins;
 costumePanel.querySelector('#costumeFeedback').textContent=message;
 costumeOptions.innerHTML=Object.entries(costumeCatalog).map(([id,h])=>{
  const own=inventory['hat_'+id]||0;
  return `<div style="background:#251d16a8;border:1px solid #a18c65;border-radius:9px;margin:9px 0;padding:11px;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap"><span style="font-weight:700">${h.name}<small style="display:block;color:#c7c2ac">£${h.price} · Own ${own} · Resale £${h.sell}</small></span><span><button data-hatbuy="${id}" style="padding:9px;border:1px solid #baa87e;border-radius:7px;background:#385f3e;color:white;cursor:pointer">BUY</button> <button data-hatsell="${id}" ${own?'':'disabled'} style="padding:9px;border:1px solid #baa87e;border-radius:7px;background:#865534;color:white;cursor:pointer;opacity:${own?1:.35}">SELL</button></span></div>`;
 }).join('');
}
function costumeOpenShop(){costumeDrawShop();costumePanel.style.display='flex';keys.clear();}
function costumeCloseShop(){costumePanel.style.display='none';keys.clear();}
costumePanel.querySelector('#costumeDone').addEventListener('click',costumeCloseShop);
costumeOptions.addEventListener('click',e=>{
 const buy=e.target.closest('[data-hatbuy]'),sell=e.target.closest('[data-hatsell]');
 if(!buy&&!sell)return;
 const id=buy?buy.dataset.hatbuy:sell.dataset.hatsell,h=costumeCatalog[id];if(!h)return;
 if(buy){if(coins<h.price){costumeDrawShop('Not enough money for that hat.');return;}
  coins-=h.price;inventory['hat_'+id]=(inventory['hat_'+id]||0)+1;costumeDrawShop(`Bought ${h.name}! Open Bag Pack to wear it.`);
 }else{
  if(!(inventory['hat_'+id]>0)){costumeDrawShop('You do not own that hat.');return;}
  inventory['hat_'+id]--;coins+=h.sell;if(wornCostume===id&&inventory['hat_'+id]===0)wornCostume=null;
  costumeDrawShop(`Sold ${h.name} for £${h.sell}.`);
 }
 v44RefreshWallet();
});
const costumeOldRefreshBag=v44RefreshBag;
v44RefreshBag=function(){
 costumeOldRefreshBag();const target=document.getElementById('bagPackContents');if(!target)return;
 const owned=costumeInventory();if(!owned.length)return;
 const blank=target.querySelector('p');if(blank&&/bag is empty/i.test(blank.textContent))blank.remove();
 for(const id of owned){const h=costumeCatalog[id],isWorn=wornCostume===id;
  const row=document.createElement('div');row.className='bagItem';
  row.innerHTML=`<span>🎩 ${h.name}${isWorn?' (WORN)':''}</span><strong>× ${inventory['hat_'+id]}</strong> <button type="button" data-hatwear="${id}" style="border:1px solid #bda56d;border-radius:6px;background:#456747;color:#fff;padding:8px;cursor:pointer">${isWorn?'TAKE OFF':'WEAR'}</button>`;
  target.prepend(row);
 }
};
document.getElementById('bagPackContents').addEventListener('click',e=>{
 const b=e.target.closest('button[data-hatwear]');if(!b)return;
 const id=b.dataset.hatwear;if(!(inventory['hat_'+id]>0))return;
 wornCostume=wornCostume===id?null:id;v44RefreshBag();
});
// Distinct headwear is always visible on the player's overworld and indoor sprite.
const costumeOldDrawHero=drawHero;
drawHero=function(x,y,dir,step){
 costumeOldDrawHero(x,y,dir,step);if(!wornCostume)return;
 ctx.save();ctx.translate(x,y-63);
 if(wornCostume==='beanie'){
  ctx.fillStyle='#db4f55';ctx.beginPath();ctx.ellipse(0,-5,24,15,0,Math.PI,0);ctx.fill();ctx.fillRect(-23,-7,46,9);
  ctx.fillStyle='#fff2cd';ctx.beginPath();ctx.arc(0,-21,5,0,Math.PI*2);ctx.fill();
 }else if(wornCostume==='cap'){
  ctx.fillStyle='#45874c';ctx.beginPath();ctx.ellipse(0,-10,23,15,0,Math.PI,0);ctx.fill();ctx.fillRect(-22,-11,44,8);
  ctx.fillStyle='#25482c';ctx.fillRect(dir==='left'?-31:-10,-8,40,7);
 }else{
  ctx.fillStyle='#9c693f';ctx.fillRect(-17,-27,34,22);ctx.fillStyle='#6e4229';ctx.fillRect(-19,-12,38,6);
  ctx.fillStyle='#af8151';ctx.beginPath();ctx.ellipse(0,-8,34,7,0,0,Math.PI*2);ctx.fill();
 }
 ctx.restore();
};
// Draw the distinct pink-roof Costume Shop into Eastern Grove scenery; cloud layer stays above.
const costumeOldDrawEasternDistrict=drawEasternDistrict;
drawEasternDistrict=function(){
 // Use the existing world painter; store is overlaid afterwards, without touching the player logic.
 costumeOldDrawEasternDistrict();
 // The shop appears just north of the horizontal main trail and beside a clear walkway.
 drawGroveHouse(costumeHouse);
 if(Math.hypot(player.x-costumeDoor.x,player.y-costumeDoor.y)<185)
  text('A: ENTER COSTUME SHOP',costumeDoor.x,costumeDoor.y+43,16,'#fff0b8');
 // Cloud layer: existing renderer invokes groveDrawClouds on top in its wrapper.
};
// The world collision check already handles the shop footprint, and we prevent
// introducing new overlap with Grove House leaflet stops.
const costumeOldDrawInterior=drawInterior;
drawInterior=function(){
 if(interior!=='furrylodge'&&interior!=='costumeshop')return costumeOldDrawInterior();
 ctx.fillStyle=interior==='furrylodge'?'#56674a':'#71596b';ctx.fillRect(0,0,900,680);
 for(let y=65;y<605;y+=45)for(let x=50;x<860;x+=45){ctx.fillStyle=(x+y)%2?'#b69b75':'#a88a65';ctx.fillRect(x,y,43,43);}
 ctx.fillStyle='#433c31';ctx.fillRect(34,34,832,34);ctx.fillRect(34,34,34,590);ctx.fillRect(832,34,34,590);
 text(interior==='furrylodge'?'FOREST LODGE':'COSTUME SHOP',450,105,32,'#fff0ba');
 if(interior==='furrylodge'){
  ctx.fillStyle='#82664b';ctx.fillRect(88,390,235,90);ctx.fillStyle='#3f573c';ctx.fillRect(660,290,145,175);
  // Furry — playful woodland resident wearing animal ears and a tail.
  const furryNPC=window.SAActorRoutes?.point('furry',450,378)||{x:450,y:378};
  ctx.save();ctx.translate(furryNPC.x-450,furryNPC.y-378);ctx.translate(450,378);ctx.scale(88/185,88/185);ctx.translate(-450,-378);
  ctx.fillStyle='#6c4835';ctx.beginPath();ctx.ellipse(450,330,38,16,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#806342';ctx.fillRect(413,275,74,72);ctx.fillStyle='#45352d';ctx.fillRect(419,337,21,41);ctx.fillRect(459,337,21,41);
  ctx.fillStyle='#e5b38c';ctx.beginPath();ctx.arc(450,252,31,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#9d7b56';ctx.beginPath();ctx.moveTo(418,229);ctx.lineTo(420,193);ctx.lineTo(444,226);ctx.fill();ctx.beginPath();ctx.moveTo(456,225);ctx.lineTo(480,193);ctx.lineTo(481,232);ctx.fill();
  ctx.fillStyle='#2c302a';ctx.fillRect(439,247,5,5);ctx.fillRect(460,247,5,5);
  ctx.restore();
  text('FURRY',furryNPC.x,furryNPC.y-200,21,'#fff3b4');if(Math.hypot(player.x-furryNPC.x,player.y-(furryNPC.y-71))<170)text('A: TALK',furryNPC.x,furryNPC.y+36,19,'#fff3a7');
 }else{
  ctx.fillStyle='#523e31';ctx.fillRect(110,190,680,90);ctx.fillStyle='#dbba80';text('HATS FOR SALE!',450,220,24,'#fff0c6');
  for(let i=0;i<3;i++){ctx.fillStyle=['#d45057','#3d8b59','#b5874c'][i];ctx.fillRect(220+i*155,260,96,45);ctx.fillRect(237+i*155,238,62,30);}
  ctx.fillStyle='#715239';ctx.fillRect(273,317,353,93);text('A: SHOP',450,373,25,'#fff5bc');
 }
 ctx.fillStyle='#254c3b';ctx.fillRect(360,574,180,70);text('EXIT ↓',450,617,26,'#fff5c7');
 drawHero(player.x,player.y,player.dir,player.step);
};
const costumeOldRender=render;
render=function(){
 if(currentDistrict==='grove'&&(interior==='furrylodge'||interior==='costumeshop'))return v34Render();
 return costumeOldRender();
};
const costumeOldMove=move;
move=function(dt){
 if(costumePanel.style.display==='flex')return;
 if(currentDistrict==='grove'&&(interior==='furrylodge'||interior==='costumeshop')){
  const result=v34Move(dt);
     // Furry dialogue requires the A button; no proximity conversation.
  return result;
 }
 return costumeOldMove(dt);
};
const costumeOldInteract=interact;
interact=function(){
 if(costumePanel.style.display==='flex'){costumeCloseShop();return;}
 if(currentDistrict==='grove'){
  if(interior==='furrylodge'){
   if(dialogOpen){if(furryDialogueStep>=0)furryAdvance();else closeDialog();return;}
   if(player.y>555&&player.x>335&&player.x<565){costumeLeaveRoom();return;}
   const furryPoint=window.SAActorRoutes?.point('furry',450,378)||{x:450,y:378};
   if(Math.hypot(player.x-furryPoint.x,player.y-(furryPoint.y-71))<150){furrySpeak();return;}
   show('🏡 FOREST LODGE','Talk to Furry or use EXIT to leave.');return;
  }
  if(interior==='costumeshop'){
   if(dialogOpen){closeDialog();return;}
   if(player.y>555&&player.x>335&&player.x<565){costumeLeaveRoom();return;}
   if(player.y<430){costumeOpenShop();return;}
   show('🎩 COSTUME SHOP','Walk towards the counter and press A to buy or sell hats.');return;
  }
  if(!interior&&!dialogOpen){
   if(costumeNearDoor()){costumeOpenRoom('costumeshop');return;}
   if(furryAtDoor(furryLodge)){costumeOpenRoom('furrylodge');return;}
  }
 }
 return costumeOldInteract();
};
// Genuine pointer interaction at the Forest Lodge and Costume Shop doors.
canvas.addEventListener('pointerdown',e=>{
 if(!running||currentDistrict!=='grove'||interior||dialogOpen||shopOpen||missionOpen||battle||costumePanel.style.display==='flex')return;
 const rect=canvas.getBoundingClientRect(),sx=(e.clientX-rect.left)*(W/rect.width),sy=(e.clientY-rect.top)*(H/rect.height);
 const scale=Math.max(.53,Math.min(1.08,W/950));
 const cx=Math.max(0,Math.min(world.w-W/scale,player.x-W/(2*scale))),cy=Math.max(0,Math.min(world.h-H/scale,player.y-H/(2*scale)));
 const x=sx/scale+cx,y=sy/scale+cy;
 if(costumeNearDoor()&&Math.hypot(x-costumeDoor.x,y-costumeDoor.y)<85){e.preventDefault();e.stopImmediatePropagation();costumeOpenRoom('costumeshop');}
 else if(furryAtDoor(furryLodge)&&Math.hypot(x-jjDoor(furryLodge).x,y-jjDoor(furryLodge).y)<85){e.preventDefault();e.stopImmediatePropagation();costumeOpenRoom('furrylodge');}
},true);

