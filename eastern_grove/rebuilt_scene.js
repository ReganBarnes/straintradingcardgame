/* Strain Adventures V240 — Eastern Grove native Leaf Town-style scene.
 * Original lake village ILLUSTRATION IS NOT LOADED OR DRAWN. This is geometry,
 * Leaf Town building/tree art and runtime painted terrain with editable objects.
 */
(()=>{
 'use strict';
 const SCALE=2, REF_W=1448,REF_H=1086, WW=REF_W*SCALE,HH=REF_H*SCALE;
 const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
 const img=(file)=>{let im=new Image();im.src='eastern_grove/'+file;return im;};
 const lake=img('lake_footprint.png'),shore=img('shore_footprint.png');
 const treeSprites=new Map(['tree_pine','tree_pine_bluegreen','tree_oak','tree_pine_dense','tree_oak_bright'].map(name=>{let im=new Image();im.src='editor/art/'+name+'.png';return [name,im];}));
 let maskBits=null,painted=null,brushScale=1;
 const ROUTES=[[[255,210],[300,206],[365,211],[490,209],[575,215],[700,224],[826,222],[1000,225],[1130,232],[1278,233]],[[255,210],[242,288],[202,350],[158,388],[167,490],[159,589],[210,670],[218,765],[218,882]],[[218,882],[330,871],[425,901],[521,943]],[[521,943],[590,880],[670,805],[741,804],[828,814],[945,851],[1033,944]],[[1033,944],[1140,908],[1260,840],[1320,750],[1296,665],[1190,605],[1202,500],[1323,438]],[[1323,438],[1268,365],[1170,295],[1278,233]],[[750,220],[725,261],[725,291]],[[1278,233],[1370,236],[1410,260]],[[157,589],[238,644],[316,689]],[[220,765],[300,741],[348,720]],[[521,943],[480,982],[440,1034]],[[1033,944],[1080,986],[1110,1025]]];
 const BRIDGES=[{"x":493,"y":213,"w":102,"h":44,"orientation":0},{"x":329,"y":478,"w":74,"h":41,"orientation":1.5707963267948966},{"x":746,"y":807,"w":90,"h":48,"orientation":0},{"x":1190,"y":519,"w":72,"h":40,"orientation":1.5707963267948966},{"x":398,"y":877,"w":55,"h":38,"orientation":0},{"x":983,"y":886,"w":54,"h":35,"orientation":0},{"x":1186,"y":893,"w":54,"h":35,"orientation":0},{"x":1187,"y":568,"w":62,"h":36,"orientation":1.5707963267948966},{"x":1252,"y":376,"w":59,"h":38,"orientation":1.5707963267948966}];
 const HOUSES=[{"name":"FOREST LODGE","doorX":514,"doorY":414},{"name":"RANGER HUT","doorX":2556,"doorY":440},{"name":"PINE COTTAGE","doorX":300,"doorY":772},{"name":"FERN HOUSE","doorX":2646,"doorY":876},{"name":"MOSSY HOME","doorX":314,"doorY":1178},{"name":"WOODSMAN HOME","doorX":2642,"doorY":1508},{"name":"GROVE HOUSE","doorX":438,"doorY":1766},{"name":"WILLOW CABIN","doorX":1042,"doorY":1886},{"name":"OAK LODGE","doorX":2066,"doorY":1890},{"name":"EASTERN GROVE HALL","doorX":1654,"doorY":410}];
 const houseMap=new Map(HOUSES.map(h=>[h.name,h]));
 const rand=(seed)=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 const noise=rand(190241);
 function imageDataLoad(){
  if(!lake.complete||!lake.naturalWidth||maskBits)return;
  try{let m=document.createElement('canvas');m.width=lake.naturalWidth;m.height=lake.naturalHeight;
   let g=m.getContext('2d',{willReadFrequently:true});g.drawImage(lake,0,0);
   maskBits={d:g.getImageData(0,0,m.width,m.height).data,w:m.width,h:m.height};
   m.width=1;m.height=1;
  }catch(e){console.warn('Eastern Grove water footprint unavailable',e)}
 }
 /* V241 blank mode: previous lake mask and terrain cache no longer generated. */
 function onWater(x,y){
  if(!maskBits)return false;
  const px=Math.floor(x/WW*maskBits.w),py=Math.floor(y/HH*maskBits.h);
  if(px<0||py<0||px>=maskBits.w||py>=maskBits.h)return false;
  return maskBits.d[(py*maskBits.w+px)*4+3]>80;
 }
 function isBridge(x,y){
  return BRIDGES.some(b=>{
   const xx=b.x*SCALE, yy=b.y*SCALE;
   const w=(b.orientation?b.h:b.w)*SCALE,h=(b.orientation?b.w:b.h)*SCALE;
   return Math.abs(x-xx)<w*.48&&Math.abs(y-yy)<h*.48;
  });
 }
 function addPointPath(g,points){
  if(!points.length)return;g.beginPath();g.moveTo(points[0][0]*SCALE,points[0][1]*SCALE);
  for(let i=1;i<points.length;i++)g.lineTo(points[i][0]*SCALE,points[i][1]*SCALE);
 }
 function bridge(g,b){
  const x=b.x*SCALE,y=b.y*SCALE,w=b.w*SCALE,h=b.h*SCALE;
  g.save();g.translate(x,y);g.rotate(b.orientation||0);
  g.fillStyle='#443927';g.fillRect(-w*.56,-h*.54,w*1.12,h*1.08);
  g.fillStyle='#895d32';g.fillRect(-w*.52,-h*.47,w*1.04,h*.94);
  for(let xx=-w*.50;xx<w*.5;xx+=13){g.fillStyle=(Math.round(xx)%3?'#b98c53':'#9e7544');g.fillRect(xx,-h*.45,10,h*.9);
    g.fillStyle='#e1bc7d';g.fillRect(xx,-h*.45,2,h*.9);}
  g.fillStyle='#493522';g.fillRect(-w*.54,-h*.59,w*1.08,8);g.fillRect(-w*.54,h*.51,w*1.08,8);
  for(const xx of [-w*.44,-w*.13,w*.13,w*.44]){
   g.fillStyle='#b88d59';g.fillRect(xx-5,-h*.62,10,13);g.fillRect(xx-5,h*.51,10,13);
   g.fillStyle='#5d432d';g.fillRect(xx-6,-h*.66,12,4);g.fillRect(xx-6,h*.6,12,4);
  }g.restore();
 }
 function maskPaint(g,mask,fn){
  const tmp=document.createElement('canvas');tmp.width=WW;tmp.height=HH;
  const p=tmp.getContext('2d');fn(p);p.globalCompositeOperation='destination-in';p.drawImage(mask,0,0,WW,HH);
  p.globalCompositeOperation='source-over';g.drawImage(tmp,0,0);tmp.width=1;tmp.height=1;
 }
 function buildPaintedLand(){
  if(painted || !lake.complete||!lake.naturalWidth||!shore.complete||!shore.naturalWidth)return;
  imageDataLoad();
  const cv=document.createElement('canvas');cv.width=WW;cv.height=HH;
  const g=cv.getContext('2d',{alpha:false});
  // Leaf Town's original 32 px patchwork grass, meadow and tiny colour speckles.
  g.fillStyle='#79b96b';g.fillRect(0,0,WW,HH);
  for(let y=0;y<HH;y+=32)for(let x=0;x<WW;x+=32){
   const choice=(Math.floor(x/32)*37+Math.floor(y/32)*91)%7;
   g.fillStyle=['#79b96b','#83c473','#78b667','#8ac779','#75b467','#7cba6c','#80bd70'][choice];g.fillRect(x,y,32,32);
  }
  // Grass around water / exposed beach rim are independent procedural layers.
  maskPaint(g,shore,p=>{p.fillStyle='#9fbd7f';p.fillRect(0,0,WW,HH);
   for(let i=0;i<4200;i++){let x=noise()*WW,y=noise()*HH;p.fillStyle=i%2?'#cbbe87':'#6d9d68';p.fillRect(x,y,4,3)}});
  // A single contiguous dirt/cobble system, not pixels sampled from the photo.
  // Brown compacted shoulders and a lighter cobbled walking surface.
  for(const [stroke,width] of [['#8e855c',86],['#c9b894',77],['#e1d0ab',69]]){
   g.strokeStyle=stroke;g.lineWidth=width;g.lineJoin='round';g.lineCap='round';
   for(const route of ROUTES){addPointPath(g,route);g.stroke();}
  }
  // Small staggered cobbles laid along the path geometry.
  g.save();g.beginPath();g.lineJoin='round';g.lineCap='round';g.lineWidth=66;
  for(const route of ROUTES)addPointPath(g,route);
  g.clip();
  for(let row=0;row<HH/16+1;row++)for(let col=0;col<WW/26+1;col++){
   const x=col*26+(row%2)*13,y=row*16;
   const k=((row*137+col*79+row*col*11)>>>0)%7;
   g.fillStyle=['#d7c3a0','#c6b18d','#e2d1b1','#cfb68e','#d9c6a4','#c3ac89','#ead7b7'][k];
   g.beginPath();g.roundRect(x+1,y+1,23,13,2.5);g.fill();
  }g.restore();
  // Colour-noise meadow scattered across the ground, as used in Leaf Town.
  for(let i=0;i<16500;i++){
   let x=Math.floor(noise()*WW),y=Math.floor(noise()*HH);
   g.fillStyle=['#6cb16b','#4ca55a','#add587','#9dcb70','#eddb88','#528e57'][i%6];
   g.fillRect(x,y,1+(i%3),1+(i%4));
  }
  // Water is generated by canvas paint CLIPPED to a separately authored lake footprint.
  // No pixels, trees, buildings, paths or texture from the original illustration are displayed.
  maskPaint(g,lake,p=>{
   p.fillStyle='#227b93';p.fillRect(0,0,WW,HH);
   for(let yy=0;yy<HH;yy+=23){p.fillStyle=yy%3?'#2c849b':'#26778f';p.fillRect(0,yy,WW,13)}
   for(let i=0;i<11500;i++){
    const x=noise()*WW,y=noise()*HH;
    p.fillStyle=['#347f96','#328aa2','#5cacc0','#205d78','#75bbc1'][i%5];
    p.globalAlpha=.16+(i%4)*.045;p.fillRect(x,y,5+(i%7)*2,1+(i%3)*2);
   }p.globalAlpha=1;
  });
  // Bridge planks are solid geometry with railing; they remain over water.
  for(const b of BRIDGES)bridge(g,b);
  painted=cv;
 }
 /* V241 blank mode: previous lake mask and terrain cache no longer generated. */
 // Connection to the exact area from which the player can return to Leaf Town.
 returnGate.x=210*SCALE;returnGate.y=770*SCALE;
 const ORIGINAL_W=world.w,ORIGINAL_H=world.h;
 const oldTravel=travelToDistrict;
 travelToDistrict=function(which){
   world.w=which==='grove'?WW:ORIGINAL_W;world.h=which==='grove'?HH:ORIGINAL_H;
   oldTravel(which);
   if(which==='grove'){
    // The native town path begins to the right of its western gateway.
    player.x=returnGate.x+128;player.y=returnGate.y;
   }
 };
 // Original nine identities retained: John John's quest still targets eight homes.
 const oldHouses=groveHouses;
 function doorFor(name){
   const meta=houseMap.get(name);if(!meta)return null;
   const editorHouse=window.SAWorldEditor?.placements?.grove?.find(o=>o.uid==='eg240_house_'+name.toLowerCase().replaceAll(' ','_'));
   if(editorHouse){const deltaX=editorHouse.x-meta.doorX,deltaY=editorHouse.y-(meta.doorY-(editorHouse.h/2-36));
     return {x:meta.doorX+deltaX,y:meta.doorY+deltaY};}
   return {x:meta.doorX,y:meta.doorY};
 }
 for(const h of oldHouses){const d=doorFor(h.n);if(d){h.x=d.x-120;h.y=d.y-181}}
 jjDoor=function(h){return doorFor(h.n)||{x:h.x+120,y:h.y+180}};
 const hallDoor=doorFor('EASTERN GROVE HALL');
 costumeDoor.x=hallDoor.x;costumeDoor.y=hallDoor.y;
 spoonieGym.doorX=hallDoor.x;spoonieGym.doorY=hallDoor.y;
 // Low-cost outline-based collision. Trees, buildings and shore stay in world-space,
 // not relative to player/camera. Water crossing allowed ONLY on the bridge footprint.
 groveBlocked=function(x,y){
  if(x<20||y<20||x>WW-20||y>HH-20)return true;
  if(onWater(x,y)&&!isBridge(x,y))return true;
  const placements=window.SAWorldEditor?.placements?.grove||[];
  for(const o of placements){
   if(o.uid?.startsWith('eg240_house_')){
    const dx=x-o.x,dy=y-o.y;
    if(Math.abs(dx)<o.w*.34+7&&dy> -o.h*.21-8&&dy<o.h*.26+6)return true;
   }else if((o.uid?.startsWith('eg240_tree_')||o.uid?.startsWith('eg240_extra_tree_'))){
    const tx=o.x,ty=o.y+o.h*.23;
    if(Math.abs(x-tx)<Math.max(12,o.w*.18)&&Math.abs(y-ty)<Math.max(10,o.h*.11))return true;
   }
  }
  const walls=window.SAWorldEditor?.boundaries?.grove||[];
  for(const w of walls){
   const ax=w.x1??w.ax??w.x,ay=w.y1??w.ay??w.y,bx=w.x2??w.bx??w.x,by=w.y2??w.by??w.y;
   if(![ax,ay,bx,by].every(Number.isFinite))continue;
   const vx=bx-ax,vy=by-ay,t=clamp(((x-ax)*vx+(y-ay)*vy)/(vx*vx+vy*vy||1),0,1);
   if(Math.hypot(x-ax-vx*t,y-ay-vy*t)<(w.thickness||12)+7)return true;
  }
  return false;
 };
 // Roaming NPC helpers now consult the actual rebuilt area rather than the old rectangular roads.
 groveOnPath=function(x,y){
  if(onWater(x,y)&&!isBridge(x,y))return false;
  return ROUTES.some(route=>route.some((p,i)=>{
    if(i+1>=route.length)return false;const q=route[i+1];
    const ax=p[0]*SCALE,ay=p[1]*SCALE,bx=q[0]*SCALE,by=q[1]*SCALE,vx=bx-ax,vy=by-ay;
    const t=clamp(((x-ax)*vx+(y-ay)*vy)/(vx*vx+vy*vy||1),0,1);
    return Math.hypot(x-ax-vx*t,y-ay-vy*t)<41;
  }));
 };
 groveOnHouseSpur=function(x,y){return groveOnPath(x,y)};
 let ripples=0;
 const sceneDraw=function(){
  if(world.w!==WW||world.h!==HH){world.w=WW;world.h=HH;}
  buildPaintedLand();
  if(painted)ctx.drawImage(painted,0,0);else{ctx.fillStyle='#79b96b';ctx.fillRect(0,0,WW,HH);}
  // Animated wavelets generated every frame, but clipped to the real water surface.
  const t=performance.now()*.001;
  ctx.save();ctx.strokeStyle='#c4eff0';ctx.lineWidth=2;
  for(let i=0;i<28;i++){
   const x=((i*251+59)%1390)*SCALE,y=((i*163+71)%1040)*SCALE;
   if(!onWater(x,y))continue;
   ctx.globalAlpha=.13+.06*Math.sin(t*1.5+i);
   const r=9+(t*6+i*7)%18;
   ctx.beginPath();ctx.ellipse(x,y,r*2,r*.3,0,.14*Math.PI,.86*Math.PI);ctx.stroke();
  }ctx.restore();
  window.SAWorldEditor?.drawLayer('ground');
  window.SAWorldEditor?.drawLayer('decor');
  // Replace the legacy PapaHerb HQ title on the re-used LEAF TOWN building art
  // with the correct Eastern Grove Hall identity. This is a game-world sign,
  // not a patch of the original reference illustration.
  const hall=window.SAWorldEditor?.placements?.grove?.find(o=>o.uid==='eg240_house_eastern_grove_hall');
  if(hall){
    ctx.save();ctx.lineWidth=3;ctx.fillStyle='#7b4136';ctx.strokeStyle='#3b2929';
    const sx=hall.x-112,sy=hall.y-37;
    ctx.beginPath();ctx.roundRect(sx,sy,224,37,5);ctx.fill();ctx.stroke();
    ctx.font='900 18px Georgia,serif';ctx.textAlign='center';ctx.strokeStyle='#352522';ctx.lineWidth=3;
    ctx.strokeText('EASTERN GROVE HALL',hall.x,sy+25);
    ctx.fillStyle='#fff1bc';ctx.fillText('EASTERN GROVE HALL',hall.x,sy+25);
    ctx.restore();
  }
  // Lightweight ferry docks, fences and rustic signs are editor-placed assets;
  // individual houses and foliage render via those same native World Studio objects.
  const nearHall=doorFor('EASTERN GROVE HALL');
  for(const h of groveHouses){
   const d=jjDoor(h);
   if(Math.hypot(d.x-player.x,d.y-player.y)<135){
    const tip=h===jjHouse?'A: ENTER GROVE HOUSE':h===furryLodge?'A: ENTER FOREST LODGE':(jjStarted&&!jjCompleted?'A: POST LEAFLET':'A: INSPECT HOME');
    text(tip,d.x,d.y+35,13,'#fff4c1');
   }
  }
  if(nearHall&&Math.hypot(player.x-nearHall.x,player.y-nearHall.y)<145)
   text('A: ENTER EASTERN GROVE HALL',nearHall.x,nearHall.y+35,13,'#fff4c1');
  if(Math.hypot(player.x-returnGate.x,player.y-returnGate.y)<145)
   drawTravelGate(returnGate.x,returnGate.y,'LEAF TOWN',true,true);
  drawHero(player.x,player.y,player.dir,player.step);
  // Foreground canopy depth: tree crown occludes hero only if their trunks
  // are BELOW the player, as in a top-down GBA map.
  const obj=window.SAWorldEditor?.placements?.grove||[];

  for(const o of obj){
   if(!(o.uid?.startsWith('eg240_tree_')||o.uid?.startsWith('eg240_extra_tree_'))||player.y>=o.y+o.h*.25)continue;
   if(Math.abs(player.x-o.x)>o.w*.53||Math.abs(player.y-o.y)>o.h*.58)continue;
   // The regular tree asset is already rendered; this is only the canopy overlap.
   const tree=treeSprites.get(o.assetId);
   if(tree?.complete&&tree.naturalWidth){
    ctx.save();ctx.beginPath();ctx.rect(o.x-o.w*.51,o.y-o.h*.52,o.w*1.02,o.h*.70);ctx.clip();
    ctx.drawImage(tree,o.x-o.w/2,o.y-o.h/2,o.w,o.h);ctx.restore();
   }
  }
  window.SAWorldEditor?.drawLayer('foreground');
 };
 drawEasternDistrict=sceneDraw;
 // The Hall retains both previously accessible interiors, without spawning a new building.
 const oldInteract=interact;
 let hallPanel=null;
 const closeHall=()=>{if(hallPanel){hallPanel.remove();hallPanel=null}keys.clear()};
 const openHall=()=>{
  if(hallPanel)return;keys.clear();
  const wrap=document.createElement('div');wrap.id='eg240HallChoices';
  wrap.style.cssText='position:fixed;inset:0;z-index:99995;background:#071a11d9;display:flex;justify-content:center;align-items:center;padding:15px;touch-action:auto';
  const p=document.createElement('section');p.style.cssText='background:#153a2b;color:#fff6da;border:3px solid #b0da8d;border-radius:15px;width:min(440px,96vw);padding:20px;text-align:center';
  p.innerHTML='<h2>EASTERN GROVE HALL</h2><p>Choose where to go.</p>';
  for(const [title,fn] of [['SPOONIE GYM',()=>enterRoom('spoonie')],['COSTUME SHOP',()=>costumeOpenRoom('costumeshop')],['CANCEL',()=>{}]]){
   const b=document.createElement('button');b.textContent=title;b.style.cssText='display:block;margin:9px auto;width:100%;padding:14px';
   b.onclick=()=>{closeHall();fn()};p.appendChild(b);
  }wrap.appendChild(p);document.body.appendChild(wrap);hallPanel=wrap;
 };
 interact=function(){
  if(hallPanel){closeHall();return}
  if(currentDistrict==='grove'&&!interior&&!dialogOpen){
   const d=doorFor('EASTERN GROVE HALL');
   if(d&&Math.hypot(player.x-d.x,player.y-d.y)<110){openHall();return}
  }
  oldInteract();
 };
 // Expose native layout for tooling, collisions and automated verification.
 window.EasternGroveV240={version:'240-native',name:'Eastern Grove',sourceReferenceUsedAsBackdrop:false,
  world:{w:WW,h:HH},routes:ROUTES,houses:HOUSES,bridges:BRIDGES,waterAt:onWater,blocked:groveBlocked,
  get loaded(){return !!painted&&!!window.SAWorldEditor?.placements?.grove?.some(o=>o.uid==='eg240_house_grove_house')},
  get status(){return {terrain:!!painted,water:!!maskBits,buildings:(window.SAWorldEditor?.placements?.grove||[]).filter(o=>o.uid?.startsWith('eg240_house_')).length,
  trees:(window.SAWorldEditor?.placements?.grove||[]).filter(o=>(o.uid?.startsWith('eg240_tree_')||o.uid?.startsWith('eg240_extra_tree_'))).length}}};
})();
