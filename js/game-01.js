
const hqMissionDeskImage=new Image();hqMissionDeskImage.src='assets/v204_a2c324bd981bfbaae71cfd93.png';
const hqSofaImage=new Image();hqSofaImage.src='assets/v204_3ccbd8c871472ee31a626573.png';
const SOURCES=['assets/v204_646f0c67ed3cea529c2b27b7.png','assets/v204_e77643195826cf1a54124921.png'];const pictures=SOURCES.map(src=>{const i=new Image();i.src=src;return i});
const normsGymImage=new Image();normsGymImage.src="assets/v204_c221a752192e95511d38601c.png";
const herbTableImage=new Image();herbTableImage.src='assets/v204_42cdf94ac773b6be304c507e.png';
const shelfImage=new Image();shelfImage.src='assets/v204_3a60f1729fc1921fcee8f7df.png';
const canvas=document.getElementById('game'),ctx=canvas.getContext('2d');let W=0,H=0,dpr=1;function resize(){dpr=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.imageSmoothingEnabled=true}addEventListener('resize',resize);resize();
const world={w:2580,h:1780},player={x:760,y:850,hp:100,badges:0,dir:'down',step:0},keys=new Set();let interior=null,returnSpot=null;let shopOpen=false,coins=50;const inventory={jar:0,bong:0,spray:0};let running=false,dialogOpen=false,dialogText='',quest=0,musicOn=true,audio=null,tuneTimer=0,beat=0,last=0;
const quietHouses=[{x:1350,y:800,w:240,h:190,roof:'#985f55',wall:'#d8c09a',name:'COTTAGE'},
 {x:1570,y:250,w:235,h:190,roof:'#57778b',wall:'#d3bd93',name:'HOME'},
 {x:2110,y:810,w:255,h:195,roof:'#a17743',wall:'#d6c19e',name:'FLOWER HOUSE'},
 {x:1820,y:1190,w:245,h:185,roof:'#86688e',wall:'#d7c7a5',name:'CABIN'},
 {x:380,y:1150,w:235,h:185,roof:'#9b7750',wall:'#c9b69a',name:'HOUSE'}];
const flowerHouse=quietHouses.find(h=>h.name==='FLOWER HOUSE');
let flowerConversationDone=false,flowerCutsceneIndex=-1;
const flowerLines=["Its my grans funeral today and i forgot the flowers","Im panicking, can you help?","Thank you so much!"];
function advanceFlowerCutscene(){flowerCutsceneIndex++;if(flowerCutsceneIndex>=flowerLines.length){flowerCutsceneIndex=-1;flowerConversationDone=true;closeDialog();missionList();return;}show('🌷 FLOWER HOUSE LADY',flowerLines[flowerCutsceneIndex]);document.querySelector('#dialog small').textContent='Press A / Enter to continue';}
const buildings=[{name:'CURE SHOP',x:180,y:190,w:480,h:300,img:0,doorX:420,doorY:494,kind:'cure'},{name:'PAPAHERB HQ',x:850,y:190,w:480,h:300,img:1,doorX:1090,doorY:494,kind:'hq'}];
const gym={x:905,y:735,w:350,h:210,doorX:1080,doorY:950};const npc={x:680,y:680};
const flowers=[];let seed=1287;function rnd(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}for(let i=0;i<390;i++){let x=rnd()*world.w,y=rnd()*world.h;if(Math.abs(x-760)<90||Math.abs(y-610)<75)continue;flowers.push({x,y,type:rnd(),size:2+rnd()*5})}
function roundRect(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=3;ctx.stroke()}}
function text(t,x,y,size=20,color='#fff',align='center'){ctx.font=`900 ${size}px system-ui`;ctx.textAlign=align;ctx.lineWidth=4;ctx.strokeStyle='#143426';ctx.strokeText(t,x,y);ctx.fillStyle=color;ctx.fillText(t,x,y)}
// Hand-placed and seeded scenery, kept clear of paths and entrances.
const scenery=[];let decorSeed=92731;function decorRand(){decorSeed=(Math.imul(decorSeed,1664525)+1013904223)>>>0;return decorSeed/4294967296}
function blockedDecor(x,y,r){if(x>685-r&&x<845+r)return true;if(y>530-r&&y<705+r)return true;if(x>995-r&&x<1170+r&&y>605-r)return true;if(x>145-r&&x<700+r&&y>140-r&&y<550+r)return true;if(x>825-r&&x<1370+r&&y>155-r&&y<540+r)return true;if(x>875-r&&x<1300+r&&y>710-r&&y<985+r)return true;if(Math.hypot(x-680,y-680)<85+r)return true;return false}
for(let i=0;i<900&&scenery.length<135;i++){let x=55+decorRand()*(world.w-110),y=55+decorRand()*(world.h-110);let v=decorRand(),kind=v<.22?'tree':v<.59?'bush':v<.80?'leaves':v<.92?'mushroom':'log',r=kind==='tree'?52:kind==='bush'?30:12;if(blockedDecor(x,y,r))continue;if(kind==='tree'&&([...quietHouses,...buildings,gym].some(b=>x>b.x-95&&x<b.x+b.w+95&&y>b.y-115&&y<b.y+b.h+75)||x>650&&x<860||y>520&&y<715||x>1760&&x<1980&&y>1030))continue;if((kind==='tree'||kind==='bush')&&scenery.some(o=>Math.hypot(o.x-x,o.y-y)<(o.kind==='tree'?85:49)))continue;scenery.push({x,y,kind,variant:Math.floor(decorRand()*5),size:kind==='tree'?.72+decorRand()*.33:.8+decorRand()*.5})}
// V206: Remove ONLY seeded town-interior trees/ordinary bushes. Keep perimeter forest and wild-strain encounter bushes.
for(let i=scenery.length-1;i>=0;i--) if(scenery[i].kind==='tree'||scenery[i].kind==='bush')scenery.splice(i,1);

const newTreeArt=[(()=>{const im=new Image();im.src="assets/v204_1d8adb5c44014eca2ac88a91.png";return im})(),(()=>{const im=new Image();im.src="assets/v204_4fdfd785956e461e47aa7d25.png";return im})()];
function drawNewTree(x,y,size,variant,flip){const im=newTreeArt[variant%2];if(!im.complete||!im.naturalWidth)return;const h=size,w=size*im.naturalWidth/im.naturalHeight;ctx.save();ctx.translate(x,y);ctx.scale(flip?-1:1,1);ctx.drawImage(im,-w/2,-h,w,h);ctx.restore();}
function sceneryItem(o,time){const x=o.x,y=o.y,v=o.variant,k=o.size;ctx.save();ctx.translate(x,y);ctx.scale(k,k);
if(o.kind==='tree'){drawNewTree(0,12,135,v,v%2===1)}
else if(o.kind==='bush'){ctx.fillStyle='#24472e55';ctx.beginPath();ctx.ellipse(2,7,30,10,0,0,7);ctx.fill();for(let j=0;j<7;j++){let a=j*6.28/7;ctx.fillStyle=['#286b3a','#39864b','#4c9b50','#276c45'][((j+v)%4)];ctx.beginPath();ctx.arc(Math.cos(a)*15,Math.sin(a)*9-12,15,0,7);ctx.fill()}ctx.fillStyle='#81c26b';ctx.beginPath();ctx.arc(-8,-22,7,0,7);ctx.fill();if(v===3){for(let j=0;j<4;j++){ctx.fillStyle='#f6c3dd';ctx.fillRect(j*10-16,-24+(j%2)*9,4,4)}}}
else if(o.kind==='leaves'){for(let j=0;j<6;j++){let a=j*2.4+v;ctx.save();ctx.translate(Math.cos(a)*13,Math.sin(a)*8);ctx.rotate(a);ctx.fillStyle=['#d99b39','#c6772c','#e8b952','#b85e27','#a6a43f'][(j+v)%5];ctx.beginPath();ctx.ellipse(0,0,7,3,0,0,7);ctx.fill();ctx.restore()}}
else if(o.kind==='mushroom'){for(let j=0;j<3;j++){let xx=j*10-10;ctx.fillStyle='#f2e3bb';ctx.fillRect(xx,-6,4,10);ctx.fillStyle=v%2?'#ce7045':'#d7b05b';ctx.beginPath();ctx.arc(xx+2,-7,7,Math.PI,0);ctx.fill();ctx.fillStyle='#fff4d5';ctx.fillRect(xx,-11,3,2)}}
else{ctx.rotate(.2);ctx.fillStyle='#60482c';ctx.fillRect(-18,-6,36,13);ctx.fillStyle='#997044';ctx.fillRect(-16,-4,32,4);ctx.fillStyle='#c3a175';ctx.beginPath();ctx.ellipse(17,0,5,7,0,0,7);ctx.fill();}
ctx.restore()}
// V225 PERFORMANCE: cache only the unchanged ground artwork. Dynamic clouds,
// map-editor layers, buildings, collisions, NPCs, and all interactions render normally.
let saStaticGroundCanvas=null;
function saGetStaticGround(){
 if(saStaticGroundCanvas)return saStaticGroundCanvas;
 const surface=document.createElement('canvas');
 surface.width=world.w;surface.height=world.h;
 const ctx=surface.getContext('2d',{alpha:false});
 ctx.imageSmoothingEnabled=true;

ctx.fillStyle='#79b96b';ctx.fillRect(0,0,world.w,world.h);
// deterministic layered meadow tiles, soil speckles and flower tufts
for(let yy=0;yy<world.h;yy+=32)for(let xx=0;xx<world.w;xx+=32){let n=((xx*37+yy*91+((xx*yy)%113))%19);ctx.fillStyle=['#7fbd6c','#83c473','#78b667','#8ac779','#75b467'][n%5];ctx.fillRect(xx,yy,32,32);}
// One continuous cobblestone surface: intersecting paths are drawn as a single shape.
ctx.save();ctx.beginPath();ctx.rect(710,0,112,world.h);ctx.rect(0,562,world.w,118);ctx.rect(388,489,64,85);ctx.rect(1058,489,64,85);ctx.rect(1024,620,118,420);ctx.rect(1450,560,930,118);ctx.rect(1830,560,120,760);ctx.rect(1810,1190,690,118);ctx.clip();
ctx.fillStyle='#b7a58c';ctx.fillRect(0,0,world.w,world.h);
// Staggered small stones, subtly varied in colour with dark mortar between them.
const cobbleW=27,cobbleH=17;
for(let row=-1;row<Math.ceil(world.h/cobbleH)+1;row++){
 const yy=row*cobbleH,offset=(row&1)*Math.floor(cobbleW/2);
 for(let col=-1;col<Math.ceil(world.w/cobbleW)+1;col++){
  const xx=col*cobbleW+offset;
  const variation=((row*137+col*79+row*col*11)>>>0)%7;
  ctx.fillStyle=['#d4c3a7','#c9b69a','#e0cfb3','#bfae96','#d7c7ae','#c7b79f','#e5d2b4'][variation];
  ctx.beginPath();ctx.roundRect(xx+1.5,yy+1.5,cobbleW-3,cobbleH-3,3);ctx.fill();
  ctx.fillStyle='#f3e2c633';ctx.fillRect(xx+5,yy+3,cobbleW-11,2);
 }
}
ctx.restore();
for(let i=0;i<2600;i++){let xx=(i*197+((i*i)%631))%world.w,yy=(i*113+((i*i)%557))%world.h;let onPath=(xx>710&&xx<822)||(xx>388&&xx<452&&yy>489&&yy<574)||(xx>1058&&xx<1122&&yy>489&&yy<574)||(yy>562&&yy<680)||(xx>1024&&xx<1142&&yy>620)||(xx>1450&&xx<2380&&yy>560&&yy<678)||(xx>1830&&xx<1950&&yy>560&&yy<1320)||(xx>1810&&xx<2500&&yy>1190&&yy<1308);let r=1+(i%4);ctx.fillStyle=onPath?(['#bb985f','#e9d2a0','#cba66b','#f1d9a9'][i%4]):(['#5aa65b','#a0d17b','#478f4c','#95cc73'][i%4]);ctx.fillRect(xx,yy,r+1,1+(i%3));}
for(let i=0;i<2600;i++){let xx=(i*197+((i*i)%631))%world.w,yy=(i*113+((i*i)%557))%world.h;let onPath=(xx>710&&xx<822)||(yy>562&&yy<680)||(xx>1024&&xx<1142&&yy>620)||(xx>1450&&xx<2380&&yy>560&&yy<678)||(xx>1830&&xx<1950&&yy>560&&yy<1320)||(xx>1810&&xx<2500&&yy>1190&&yy<1308);let r=1+(i%4);ctx.fillStyle=onPath?(['#bb985f','#e9d2a0','#cba66b','#f1d9a9'][i%4]):(['#5aa65b','#a0d17b','#478f4c','#95cc73'][i%4]);ctx.fillRect(xx,yy,r+1,1+(i%3));}
for(const f of flowers){let onPath=(f.x>705&&f.x<830)||(f.x>384&&f.x<456&&f.y>485&&f.y<577)||(f.x>1054&&f.x<1126&&f.y>485&&f.y<577)||(f.y>558&&f.y<683)||(f.x>1020&&f.x<1150&&f.y>620);if(onPath)continue;ctx.fillStyle=f.type>.75?'#f4db66':f.type>.45?'#3e9b47':'#4b9c50';ctx.beginPath();ctx.arc(f.x,f.y,f.size,0,7);ctx.fill();ctx.strokeStyle='#3d8f3e';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(f.x,f.y+2);ctx.lineTo(f.x+3,f.y+7);ctx.stroke();}

 saStaticGroundCanvas=surface;
 return surface;
}
// Build while on the title screen when possible, avoiding an in-play first-use pause.
if(typeof requestIdleCallback==='function')requestIdleCallback(()=>{
 try{saGetStaticGround()}catch(e){console.warn('Ground cache unavailable',e)}
},{timeout:2500});
const saStaticSceneryOrder=scenery.slice().sort((a,b)=>a.y-b.y);
let saViewLeft=-1e9,saViewTop=-1e9,saViewRight=1e9,saViewBottom=1e9,saSceneryFrameTime=0;
function drawWorld(){
ctx.drawImage(saGetStaticGround(),0,0);
// V204: moving cloud shadows are projected ON THE GROUND, before buildings,
// scenery NPCs and the player are composited into the Leaf Town world.
if(typeof window.saDrawTownCloudShadows==='function' &&
   typeof currentDistrict!=='undefined' && currentDistrict==='leaf'){
  window.saDrawTownCloudShadows(ctx);
}
window.SAWorldEditor?.drawLayer('ground');
window.SAWorldEditor?.drawLayer('decor');
for(const b of buildings){if(b.x+b.w<saViewLeft-100||b.x>saViewRight+100||b.y+b.h<saViewTop-100||b.y>saViewBottom+100)continue;if(pictures[b.img].complete&&pictures[b.img].naturalWidth){ctx.drawImage(pictures[b.img],b.x+b.w*0.06,b.y+b.h*0.12,b.w*0.88,b.h*0.88)}else{roundRect(b.x,b.y,b.w,b.h,12,'#307d56');text(b.name,b.x+b.w/2,b.y+100)}}
// gym
if(normsGymImage.complete&&normsGymImage.naturalWidth){ctx.drawImage(normsGymImage,gym.x-42+(gym.w+84)*0.06,gym.y-82+(gym.h+112)*0.12,(gym.w+84)*0.88,(gym.h+112)*0.88)}else{roundRect(gym.x,gym.y,gym.w,gym.h,12,'#226d37');text('NORMS GYM',gym.x+gym.w/2,gym.y+60,26,'#fff0a1')}
// scenery behind characters; sorted by their ground positions
for(const item of saStaticSceneryOrder){
 if(item.x<saViewLeft-350||item.x>saViewRight+350||item.y<saViewTop-350||item.y>saViewBottom+350)continue;
 sceneryItem(item,saSceneryFrameTime);
}
// Expanded Leaf Town: irregular forest and mountain enclosure, a few quiet houses,
// and a cobbled eastern road leading to a new explorable neighbourhood.
function tinyHouse(x,y,w,h,roof,wall,sign){
 ctx.fillStyle='#203d3355';ctx.fillRect(x+12,y+h-4,w-16,12);
 ctx.fillStyle='#273b38';ctx.fillRect(x+7,y+37,w-14,h-37);
 ctx.fillStyle=wall;ctx.fillRect(x+13,y+42,w-26,h-50);
 ctx.fillStyle='#342f35';ctx.beginPath();ctx.moveTo(x-10,y+48);ctx.lineTo(x+w/2,y-14);ctx.lineTo(x+w+10,y+48);ctx.closePath();ctx.fill();
 ctx.fillStyle=roof;ctx.beginPath();ctx.moveTo(x,y+41);ctx.lineTo(x+w/2,y-7);ctx.lineTo(x+w,y+41);ctx.closePath();ctx.fill();
 for(let k=0;k<2;k++){ctx.fillStyle='#3a514d';ctx.fillRect(x+28+k*(w-83),y+76,32,34);ctx.fillStyle='#b4e5d3';ctx.fillRect(x+33+k*(w-83),y+81,22,24);ctx.fillStyle='#3e716b';ctx.fillRect(x+43+k*(w-83),y+81,3,24)}
 ctx.fillStyle='#57412d';ctx.fillRect(x+w/2-17,y+h-64,34,57);ctx.fillStyle='#d8c17b';ctx.fillRect(x+w/2+10,y+h-34,4,4);
 ctx.fillStyle='#1d3f34';ctx.fillRect(x+22,y+43,w-44,20);text(sign,x+w/2,y+58,12,'#f2e8bb');
}

// Legacy tinyHouse painting disabled; the final exterior pass owns every quiet house.
// Natural perimeter: keep forest and mountains against the actual map edges,
// not on an oval cutting across the playable roads and neighbourhoods.
for(let i=0;i<480;i++){
 const t=i/480*4;
 let x,y;
 if(t<1){x=24+t*(world.w-48);y=28+Math.sin(i*.27)*17;}
 else if(t<2){x=world.w-28+Math.sin(i*.27)*17;y=24+(t-1)*(world.h-48);}
 else if(t<3){x=world.w-24-(t-2)*(world.w-48);y=world.h-28+Math.sin(i*.27)*17;}
 else{x=28+Math.sin(i*.27)*17;y=world.h-24-(t-3)*(world.h-48);}
 // Leave a deliberate clear eastern passage for the connecting cobblestone road.
 if(x>world.w-130 && y>1000 && y<1240)continue;
 const size=42+(i%5)*7;
 if(x+size*2<saViewLeft||x-size*2>saViewRight||y+size*2<saViewTop||y-size*2>saViewBottom)continue;
 ctx.fillStyle='#45575b';ctx.beginPath();ctx.moveTo(x-size,y+size*.6);ctx.lineTo(x,y-size*1.3);ctx.lineTo(x+size,y+size*.6);ctx.closePath();ctx.fill();
 ctx.fillStyle='#879795';ctx.beginPath();ctx.moveTo(x-size*.36,y-size*.1);ctx.lineTo(x,y-size*1.3);ctx.lineTo(x+size*.2,y-size*.4);ctx.closePath();ctx.fill();
 ctx.fillStyle='#e0e7db';ctx.beginPath();ctx.moveTo(x-size*.2,y-size*.7);ctx.lineTo(x,y-size*1.3);ctx.lineTo(x+size*.18,y-size*.7);ctx.closePath();ctx.fill();
}
for(let i=0;i<800;i++){
 const t=i/800*4;
 let x,y;
 if(t<1){x=30+t*(world.w-60);y=90+Math.sin(i*.39)*18;}
 else if(t<2){x=world.w-90+Math.sin(i*.39)*18;y=30+(t-1)*(world.h-60);}
 else if(t<3){x=world.w-30-(t-2)*(world.w-60);y=world.h-90+Math.sin(i*.39)*18;}
 else{x=90+Math.sin(i*.39)*18;y=world.h-30-(t-3)*(world.h-60);}
 if(x>world.w-180 && y>990 && y<1250)continue;
 const treeHeight=76+(i%7)*8;
 if(x+treeHeight<saViewLeft||x-treeHeight>saViewRight||y+treeHeight<saViewTop||y-treeHeight>saViewBottom)continue;
 drawNewTree(x,y+12,treeHeight,i%2,(i%3)===0);
}
// The next district is explorable, but its story locations will be added later.
// Large Eastern Grove sign removed; the gateway itself keeps its label. 
// End of new scenery.
// Ball Dee roaming trainer
 // Scripted NPCs draw in the final outdoor actor pass, after every house overlay.
// World Studio's foreground scenery is still rendered here; NPCs draw last.
window.SAWorldEditor?.drawLayer('foreground');
// character sprite: original hoodie, ginger messy hair, glasses and brown shoes
const x=player.x,y=player.y;ctx.fillStyle='#183b3055';ctx.beginPath();ctx.ellipse(x,y+21,18,6,0,0,7);ctx.fill();drawHero(x,y,player.dir,player.step);
}
const heroCanvas=document.createElement('canvas');heroCanvas.width=24;heroCanvas.height=40;const hc=heroCanvas.getContext('2d');
const heroFrontImage=new Image();heroFrontImage.src="assets/v204_f18d6f769b9a0a4ed95867f1.png";
const heroBackImage=new Image();heroBackImage.src="assets/v204_e7c905a233ecf09e13f485a3.png";
const heroWalkFrames = [
"assets/v204_8a680e3fa2ce17db612b82dd.png",
"assets/v204_b03eeb9ac32907e56f2ec169.png",
"assets/v204_080849acca94743918516559.png",
"assets/v204_d41e34d5e1f44367cee19d59.png",
"assets/v204_538c97e48b61bf116f9ba404.png",
"assets/v204_12ae13110112da7c80a0338d.png",
"assets/v204_2421a7c595ea4ff1f6ba3772.png",
"assets/v204_8ce97354d6748a51c67d85f5.png",
"assets/v204_3008ae81f5e8289bc7711ced.png",
"assets/v204_2f322ba8a4fc1ec38054532b.png",
"assets/v204_75430b560aa3dc8f7ed61b9f.png",
"assets/v204_334be6ba94fa66214d4616b7.png",
"assets/v204_7d062039ab2f10c871dc7ccf.png",
"assets/v204_9b8384b7382653313d1ea92b.png",
"assets/v204_a03514f4500a6f644e0e10e0.png",
"assets/v204_6c8fbc87d5d71a04aa37f18e.png",
"assets/v204_6089f800f719cd57488fd729.png",
"assets/v204_e1626d478684ef3fbdf50fd7.png",
"assets/v204_3c8a0e853d901e79dacf98bc.png",
"assets/v204_f33ca7bf7303c75e04d85de6.png",
"assets/v204_515f42816560fa45b01f6d4a.png",
"assets/v204_36b7fc0058cb02b5421359e9.png",
"assets/v204_4e5f8c973f458091aba54e9a.png",
"assets/v204_6c827c773fd1c77daca1065b.png",
"assets/v204_cc82e7ebf4c543aafe3015e4.png",
"assets/v204_3a055adef83b81045c4edc0a.png",
"assets/v204_d580223ca9af44b8f212a0c2.png",
"assets/v204_027add4ac07bb364e78f5157.png",
"assets/v204_53932996cd6a2d0d68ba5eec.png",
"assets/v204_243643a05ddb2546d627e378.png",
"assets/v204_1af49bc2a35bce85c5490909.png",
"assets/v204_764ad4e0ef9fc902ebff3d0a.png"
].map(src=>{const im=new Image();im.src=src;return im});
function drawHero(x,y,dir,step){
 const moving=keys.has('left')||keys.has('right')||keys.has('up')||keys.has('down')||keys.has('ArrowLeft')||keys.has('ArrowRight')||keys.has('ArrowUp')||keys.has('ArrowDown')||keys.has('w')||keys.has('a')||keys.has('s')||keys.has('d');
 const row=dir==='up'?1:dir==='left'?2:dir==='right'?3:0;
 // The supplied third row contains five left-facing poses followed by three right-facing poses.
 // Loop only the genuine left-facing poses to prevent an accidental direction flip.
 const frame=moving?(Math.floor(step*8)%(row===2?5:8)):0;
 const sprite=heroWalkFrames[row*8+frame];
 const dw=56,dh=88;
 ctx.save();ctx.imageSmoothingEnabled=false;
 if(sprite.complete&&sprite.naturalWidth){ctx.drawImage(sprite,x-dw/2,y-66,dw,dh)}
 else if(heroFrontImage.complete&&heroFrontImage.naturalWidth){ctx.drawImage(heroFrontImage,x-dw/2,y-66,dw,dh)}
 ctx.restore();text('YOU',x,y-74,12,'#e9ff9b');
}
const healingCounterImage=new Image();healingCounterImage.src='assets/v204_9a185a681bcc6c2e5591d215.png';
const staff={x:450,y:495,targetX:450,targetY:495,wait:0,step:0,dir:'down'};let cureVisited=false;
function cureSolid(x,y,pad=0){
 const boxes=[[125,180,260,120],[540,160,255,175],[125,365,205,155],[575,365,205,155]];
 return boxes.some(([bx,by,bw,bh])=>x>bx-pad&&x<bx+bw+pad&&y>by-pad&&y<by+bh+pad);
}
function updateStaff(dt){
 if(interior!=='cure'||shopOpen)return;
 staff.step+=dt;
 if(staff.wait>0){staff.wait-=dt;return}
 let dx=staff.targetX-staff.x,dy=staff.targetY-staff.y,d=Math.hypot(dx,dy);
 if(d<7){staff.wait=.5+Math.random()*1.3;for(let i=0;i<35;i++){
  let tx=360+Math.random()*175,ty=365+Math.random()*170;
  if(!cureSolid(tx,ty,19)&&Math.hypot(tx-player.x,ty-player.y)>30){staff.targetX=tx;staff.targetY=ty;break}
 }return}
 const step=Math.min(d,65*dt),nx=staff.x+dx/d*step,ny=staff.y+dy/d*step;
 if(!cureSolid(nx,ny,17)&&Math.hypot(nx-player.x,ny-player.y)>30){staff.x=nx;staff.y=ny;staff.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up')}
 else {staff.targetX=staff.x;staff.targetY=staff.y;staff.wait=.35}
}
function drawStaff(){
 const x=staff.x,y=staff.y,bob=Math.floor(staff.step*8)%2;
 ctx.save();ctx.translate(x,y);ctx.scale(1.45,1.45);ctx.imageSmoothingEnabled=false;
 ctx.fillStyle='#263e32';ctx.fillRect(-12,-31,24,22);
 ctx.fillStyle='#e4b480';ctx.fillRect(-8,-44,16,15);
 ctx.fillStyle='#40291b';ctx.fillRect(-10,-48,20,8);
 ctx.fillStyle='#e6efe5';ctx.fillRect(-10,-28,20,18);
 ctx.fillStyle='#419b69';ctx.fillRect(-3,-26,6,17);
 ctx.fillStyle='#263e32';ctx.fillRect(-9,-10,8,11+bob);ctx.fillRect(2,-10,8,11+(1-bob));
 ctx.fillStyle='#43362a';ctx.fillRect(-10,1+bob,10,5);ctx.fillRect(2,2-bob,10,5);
 ctx.restore();text('SUE',x,y-78,12,'#e9ffbe');
}
const hqFloorArt=new Image();hqFloorArt.src='assets/v204_558477faee8caf1738fafbcb.png';
function drawInterior(){
 const room=interior; const rw=900,rh=680;
 ctx.fillStyle='#183e33';ctx.fillRect(0,0,rw,rh);
 // The HQ uses the supplied tiled green floor and brick-wall artwork.
 if(room==='hq' && hqFloorArt.complete && hqFloorArt.naturalWidth){
   ctx.imageSmoothingEnabled=false;ctx.drawImage(hqFloorArt,55,60,790,550);ctx.imageSmoothingEnabled=true;
 }
 // Keep the existing solid perimeter walls and their collision boundaries.
 if(room!=='hq')for(let y=60;y<610;y+=38){ctx.fillStyle=(Math.floor(y/38)%2)?'#a97c4e':'#bd8d57';ctx.fillRect(55,y,790,37);ctx.fillStyle='#805b38';ctx.fillRect(55,y+35,790,3);for(let x=55+((y*3)%90);x<840;x+=125){ctx.fillRect(x,y,3,35)}}
 ctx.fillStyle='#345947';ctx.fillRect(38,38,824,28);ctx.fillRect(38,607,824,22);ctx.fillRect(38,38,24,592);ctx.fillRect(838,38,24,592);
 for(let x=72;x<835;x+=80){ctx.fillStyle='#547d57';ctx.fillRect(x,40,54,12)}
 if(['cure','hq','flower','gym'].includes(room))text(room==='cure'?'CURE SHOP':room==='hq'?'PAPAHERB HQ':room==='flower'?'FLOWER HOUSE':'NORMS GYM',450,105,36,'#f6e3a4');
 function furniture(x,y,w,h,c,label){roundRect(x+5,y+8,w,h,8,'#342b25');roundRect(x,y,w,h,8,c,'#47382b');text(label,x+w/2,y+h/2+7,18,'#fff1bc')}
 if(room==='cure'){
  // Interaction feedback: green = press A, red = scenery only.
  function proximityOutline(x,y,w,h,interactive,range=225){
    const nx=Math.max(x,Math.min(player.x,x+w)),ny=Math.max(y,Math.min(player.y,y+h));
    const d=Math.hypot(player.x-nx,player.y-ny),a=Math.max(0,1-d/range);
    if(a<=0)return;
    const color=interactive?'#52ff76':'#ff4759';
    ctx.save();ctx.globalAlpha=.35+.65*a;ctx.shadowColor=color;ctx.shadowBlur=12+32*a;
    ctx.strokeStyle=color;ctx.lineWidth=1.5+3*a;
    ctx.beginPath();ctx.roundRect(x-3,y-3,w+6,h+6,9);ctx.stroke();ctx.restore();
  }
  proximityOutline(110,155,290,155,true);
  if(healingCounterImage.complete&&healingCounterImage.naturalWidth){ctx.drawImage(healingCounterImage,110,155,290,155)}else furniture(125,180,260,120,'#47765d','HEALING COUNTER');
  text('HEAL HERE',252,327,17,'#ddffb1');
  proximityOutline(540,160,255,175,true);
  if(shelfImage.complete&&shelfImage.naturalWidth){ctx.drawImage(shelfImage,540,160,255,175)}else furniture(510,170,260,135,'#47765d','SUPPLIES');
  text('PRESS A TO SHOP',667,365,16,'#e9f6a4');
  // Herb shelves are decorative, so they glow red, never green.
 function herbTable(x,y,w,h){
   const distance=Math.hypot(player.x-(x+w/2),player.y-(y+h/2));
   const glow=Math.max(0,1-distance/210);
      proximityOutline(x,y,w,h,false,210);
    if(herbTableImage.complete&&herbTableImage.naturalWidth){
      ctx.drawImage(herbTableImage,x,y,w,h);
    }else furniture(x,y,w,h,'#668b62','HERBS');
 }
 herbTable(125,365,205,155);herbTable(575,365,205,155);drawStaff();
 
 }else if(room==='hq'){
 if(hqMissionDeskImage.complete&&hqMissionDeskImage.naturalWidth){ctx.imageSmoothingEnabled=false;ctx.drawImage(hqMissionDeskImage,125,215,205,128);ctx.imageSmoothingEnabled=true;}else furniture(130,215,200,88,'#39785d','MISSION DESK');if(hqStorageChestImage.complete&&hqStorageChestImage.naturalWidth){ctx.imageSmoothingEnabled=false;ctx.drawImage(hqStorageChestImage,604,207,118,95);ctx.imageSmoothingEnabled=true;}else furniture(604,207,118,95,'#376d61','STORAGE');if(hqSofaImage.complete&&hqSofaImage.naturalWidth){ctx.imageSmoothingEnabled=false;ctx.drawImage(hqSofaImage,100,386,215,127);ctx.imageSmoothingEnabled=true;}else furniture(115,405,185,100,'#5e885c','SOFA');furniture(555,400,200,110,'#5e885c','MAP TABLE');
 }else if(room==='flower'){
  // Flower house: counter, bouquets and an NPC with a proximity-triggered cutscene.
  ctx.fillStyle='#edd5b0';ctx.fillRect(65,115,770,460);
  for(let y=130;y<570;y+=48)for(let x=72;x<832;x+=48){ctx.fillStyle=((x+y)%3===0)?'#e9cba7':'#f3dcb9';ctx.fillRect(x,y,46,46);}
  furniture(105,175,240,112,'#946449','FLOWER DISPLAY');
  furniture(570,180,215,100,'#966c49','BOUQUETS');
  for(let i=0;i<14;i++){const x=i<7?128+i*28:586+(i-7)*27,y=i<7?210:210;ctx.fillStyle=['#f59ab4','#eec758','#c9a0eb','#f5f2e6'][i%4];ctx.beginPath();ctx.arc(x,y,11,0,7);ctx.fill();ctx.fillStyle='#488b4b';ctx.fillRect(x-2,y+9,4,12);}
  ctx.fillStyle='#7b4d38';ctx.fillRect(385,205,130,48);ctx.fillStyle='#e6b78a';ctx.fillRect(397,191,105,26);
  // Lady stands at the far end, and remains approachable.
  ctx.fillStyle='#604536';ctx.beginPath();ctx.ellipse(450,342,23,8,0,0,7);ctx.fill();
  ctx.fillStyle='#733d55';ctx.fillRect(432,285,36,55);ctx.fillStyle='#e8b18a';ctx.fillRect(433,260,34,33);
  ctx.fillStyle='#553628';ctx.beginPath();ctx.arc(450,261,23,Math.PI,Math.PI*2);ctx.fill();
  ctx.fillStyle='#222';ctx.fillRect(441,275,4,4);ctx.fillRect(456,275,4,4);
  text('FLOWER LADY',450,239,15,'#fff0a8');
  if(!flowerConversationDone)text('!',450,216,27,'#ffdd65');
 }else if(room==='gym'){
 furniture(140,175,190,100,'#83704a','TRAINER');furniture(560,175,190,100,'#83704a','TROPHIES');roundRect(335,305,230,155,12,'#477b52','#e6d283');text('★ BATTLE ★',450,390,30,'#fff2a4');
 }
 // bright exit carpet and doorway
 roundRect(369,586,162,72,7,'#203f35','#d9c584');text('EXIT ↓',450,620,21,'#f7f0c5');
 if(room!=='gym')drawHero(player.x,player.y,player.dir,player.step);
 ctx.fillStyle='#ffffffd9';ctx.font='bold 16px system-ui';ctx.textAlign='center';ctx.fillText('Walk to the EXIT and press A to leave',450,660);
}
function enterRoom(kind){
 interior=kind;
 if(kind==='cure'){staff.x=450;staff.y=495;staff.targetX=450;staff.targetY=495;staff.wait=0;}
 returnSpot={x:player.x,y:player.y};player.x=450;player.y=550;player.dir='up';
 const roomNames={cure:'🌿 CURE SHOP',hq:'🏠 PAPAHERB HQ',flower:'🌷 FLOWER HOUSE',gym:'🏆 NORMS GYM',cottage:'🏡 COTTAGE',lighterhouse:'🏠 HOUSE',cabin:'🌲 WOODLAND CABIN',spoonie:'💜 SPOONIE GYM'};
 document.querySelector('#hud strong').textContent=roomNames[kind]||'🏠 HOUSE';
 // Newer houses have their own NPC scenes; don't display the gym welcome message.
 if(kind==='cure')show('🧑‍⚕️ SUE','Head over to the desk at the top left to heal your strains. Sue runs the Cure Shop counter.');
 else if(kind==='hq')show('WELCOME INSIDE','Explore PapaHerb HQ and check the mission desk.');
 else if(kind==='flower')show('WELCOME INSIDE','Walk up to the lady inside.');
 else if(kind==='gym')show('🏆 NORMS GYM','Approach the battle arena and press A to challenge Norm.');
 else closeDialog();
}
function leaveRoom(){interior=null;player.x=returnSpot.x;player.y=returnSpot.y+35;player.dir='down';document.querySelector('#hud strong').textContent='🌿 LEAF TOWN';show('LEAF TOWN','You stepped back outside.');}
function render(){ctx.clearRect(0,0,W,H);ctx.save();const vc=window.SAEditorViewport?.();const scale=vc?.sc??Math.max(.53,Math.min(1.08,W/950));const cameraX=vc?.x??Math.max(0,Math.min(world.w-W/scale,player.x-W/(2*scale)));const cameraY=vc?.y??Math.max(0,Math.min(world.h-H/scale,player.y-H/(2*scale)));saViewLeft=cameraX;saViewTop=cameraY;saViewRight=cameraX+W/scale;saViewBottom=cameraY+H/scale;saSceneryFrameTime=performance.now()/1000;ctx.scale(scale,scale);if(interior){ctx.translate((W/scale-900)/2,(H/scale-680)/2);drawInterior()}else{ctx.translate(-cameraX,-cameraY);drawWorld()}ctx.restore()}
function dist(x,y){return Math.hypot(player.x-x,player.y-y)}
function interact(){
 if(missionOpen){closeMissionDesk();return}
 if(shopOpen){closeShop();return}
 if(dialogOpen){if(flowerCutsceneIndex>=0)advanceFlowerCutscene();else closeDialog();return}
 if(interior){
 if(interior==='flower'&&dist(450,315)<145){if(!flowerConversationDone){flowerCutsceneIndex=-1;advanceFlowerCutscene()}else show('🌷 FLOWER HOUSE LADY','Thank you so much!');return}
 if(player.y>555&&player.x>335&&player.x<565){leaveRoom();return}
 if(interior==='cure'&&player.x>495&&player.x<825&&player.y>290&&player.y<405){openShop();return}
 if(interior==='cure'&&player.y<355&&player.x<440){player.hp=100;updateHUD();show('🌿 CURE SHOP','Your whole team has been cured! HP restored to 100.');return}
 if(interior==='hq'&&player.y<390&&player.x>=95&&player.x<390){openMissionDesk();return}
 if(interior==='gym'&&player.y<500){if(!player.badges){player.badges=1;player.hp=Math.max(20,player.hp-25);updateHUD();show('🏆 GYM VICTORY','You beat the Common Gym keeper! COMMON BADGE earned!')}else show('🏆 NORMS GYM','You already have the Common Badge!');return}
 show('LOOK AROUND','Approach the counter, mission desk or arena and press A. Walk to EXIT at the bottom to leave.');return
 }
 if(Math.hypot(player.x-(flowerHouse.x+flowerHouse.w/2),player.y-(flowerHouse.y+flowerHouse.h+12))<125){enterRoom('flower');return}
 if(dist(420,535)<115){enterRoom('cure');return}
 if(dist(1090,518)<115){enterRoom('hq');return}
 if(dist(npc.x,npc.y)<90){quest=1;startBallDeeDialogue();return}
 if(dist(gym.doorX,gym.doorY)<120){enterRoom('gym');return}
 show('🌿 EXPLORING','Walk closer to a building door or character and press A.')
}
function openShop(){shopOpen=true;keys.clear();document.getElementById('shop').style.display='flex';document.getElementById('coins').textContent='£'+coins;document.getElementById('shopMsg').textContent=''}
function closeShop(){shopOpen=false;document.getElementById('shop').style.display='none';keys.clear()}
document.getElementById('shopClose').addEventListener('click',closeShop);
const shopItems={jar:{name:'Small Cure Jar',price:25},bong:{name:'Bong',price:45},spray:{name:'Terp Spray',price:15}};
for(const button of document.querySelectorAll('[data-buy]'))button.addEventListener('click',()=>{const id=button.dataset.buy,item=shopItems[id];const msg=document.getElementById('shopMsg');if(coins<item.price){msg.textContent='Not enough money!';return}coins-=item.price;inventory[id]++;document.getElementById('coins').textContent='£'+coins;msg.textContent='Purchased '+item.name+'! In bag: '+inventory[id];});
let welcomeTimeout=null;
let missionOpen=false;
 let missionTab='active';
 let langyWon=false,langyDeclined=false,langyChoiceOpen=false;
 let oldLadyMissionComplete=false, oldLadySpoken=false, oldLadyDialogueStep=-1, oldLadyPinOpen=false;
 function missionList(){
   const completed=player.badges>0;
   const missions=[
    {id:'furrycostume',name:'Dress to Impress — Furry',done:!!window.furryQuestCompleted,hidden:!window.furryQuestStarted&&!window.furryQuestCompleted,status:window.furryQuestCompleted?'FINISHED':'ACTIVE',description:window.furryQuestCompleted?'You bought a hat at Eastern Grove Costume Shop, wore it and showed Furry at Forest Lodge.':'Visit the new Costume Shop, buy a hat, equip it from Bag Pack and return to Furry at Forest Lodge.'},
    {id:'johnleaflets',name:'John John — Tarmacking Leaflet Run',
     done:!!window.jjCompleted,hidden:!window.jjStarted&&!window.jjCompleted,
     status:window.jjCompleted?'FINISHED':'ACTIVE',
     description:window.jjCompleted?'You delivered leaflets to every other Eastern Grove home. John John paid £50, awarded 30 XP to each collected strain, and gave you a Terp Spray and 2 Baggies.':`Deliver a leaflet to each of the other 8 Eastern Grove houses (${window.jjDeliveredCount||0}/8), then return to John John in GROVE HOUSE for your reward.`},

    {id:'langy',name:'Sewer Secret — Langy',done:langyWon||langyDeclined,hidden:!sewerUnlocked()&&!langyWon&&!langyDeclined,status:(langyWon||langyDeclined)?'FINISHED':'ACTIVE',description:langyWon?'You defeated Langy’s level 10 Star Dawg! Reward: £75, 2 Baggies and 1 Terp Spray.':langyDeclined?'You walked away from Langy. The challenge is permanently closed for this play session.':'Find the hidden manhole in Leaf Town after finishing all local missions. Enter the sewers and meet Langy.'},
    {id:'forgetful',name:'Forgetful Moments',done:oldLadyMissionComplete,status:oldLadyMissionComplete?'FINISHED':'ACTIVE',unlocked:true,description:oldLadyMissionComplete?'You recovered Old Lady’s forgotten four-digit PIN. Reward: £25 and XP for your collected strains.':oldLadySpoken?'Return to HOME and solve Old Lady’s four-digit PIN clues. Wrong answers can be retried.':'Enter the building marked HOME in Leaf Town, speak with Old Lady, and help her remember her PIN.'},
    {id:'hobo',name:'Woodland Hobo — Cabin Riddle',done:cabinMissionFinished,
     description:cabinMissionFinished?(cabinMissionResult==='riddle'?'You solved Woodland Hobo’s riddle and earned £50 and 25 XP for your collected strains.':'You defeated Woodland Hobo’s level 8 Sour Diesel and earned £100 and 45 XP for your collected strains.'):(cabinRiddleFailed?'Defeat Woodland Hobo and his level 8 Sour Diesel. His strain cannot be captured.':cabinCutsceneSeen?'Answer the Woodland Hobo’s riddle, or face his level 8 Sour Diesel.':'Enter the CABIN in Leaf Town and meet Woodland Hobo.'),
     status:cabinMissionFinished?'FINISHED':'ACTIVE',unlocked:true},
    {id:'lighter',name:'Find the Missing Lighter',done:lighterDelivered,
     description:lighterDelivered?'You returned the lighter to Reth Sogan and earned £30 and 15 XP for every collected strain.':lighterFound?'You found the lighter! Return to Reth Sogan in the HOUSE in Leaf Town.':lighterConversationDone?'Search the Cure Shop, Flower House and Cottage for the missing lighter.':'Visit the HOUSE in the first Leaf Town area and speak to Reth Sogan about his missing lighter.',
     status:lighterDelivered?'FINISHED':'ACTIVE',unlocked:true},
    {id:'norm',name:'Defeat Norm Gym',done:completed,description:completed?'You defeated Norm and earned your first gym badge.':'Travel to Norm’s Gym and defeat Norm to earn the gym badge.',status:completed?'FINISHED':'ACTIVE'},
    {id:'cottage',name:'Fix the Cottage Pipes',done:cottagePipesFixed,description:cottagePipesFixed?'You fixed every pipe in the cottage and earned £50 and 20 XP for each collected strain.':cottageManSpoken?'Return to the cottage and rotate the four pipe pieces until the two fixed pipe ends connect.':'Visit the cottage in Leaf Town and speak to the man inside.',status:cottagePipesFixed?'FINISHED':'ACTIVE'},
    {id:'flowers',name:'Find Her Flowers',done:flowerDeliveryDone,description:flowerDeliveryDone?'You returned the flowers. Reward: £30 and XP for your strains.':flowerBouquetCollected?'Flowers collected! Return to the Flower House lady to deliver them.':'Find the hidden bouquet in Leaf Town. Approach it and press A, or click it to collect.',status:flowerDeliveryDone?'FINISHED':'ACTIVE',unlocked:flowerConversationDone},
    {id:'lady',name:'Speak to the lady at the flower house',done:flowerConversationDone,description:flowerConversationDone?'You spoke to the lady at the flower house.':'Enter the flower house in Leaf Town and speak to the lady.',status:flowerConversationDone?'FINISHED':'ACTIVE',hidden:flowerConversationDone}
   ];
   document.querySelectorAll('[data-mission-tab]').forEach(b=>{b.classList.toggle('selected',b.dataset.missionTab===missionTab);b.setAttribute('aria-selected',String(b.dataset.missionTab===missionTab))});
   const visible=missions.filter(m=>!m.hidden && m.unlocked!==false && (missionTab==='finished'?m.done:!m.done));
   document.getElementById('missionEntries').innerHTML=visible.length?visible.map(m=>`<button type="button" class="missionEntry" data-mission="${m.id}"><strong>${m.name}</strong><small>${m.status}</small></button>`).join(''):'<p class="missionEmpty">No finished missions yet. Complete a mission to see it here.</p>';
   document.getElementById('missionDetail').textContent='Select a mission to view its details.';
   document.getElementById('missionEntries').onclick=e=>{const b=e.target.closest('[data-mission]');if(!b)return;document.querySelectorAll('.missionEntry').forEach(el=>el.classList.toggle('selected',el===b));document.getElementById('missionDetail').textContent=missions.find(m=>m.id===b.dataset.mission).description};
 }
 function openMissionDesk(){closeDialog();missionOpen=true;keys.clear();missionTab='active';document.querySelector('#missionPanel h2').textContent='ACTIVE MISSIONS';missionList();document.getElementById('missionOverlay').classList.add('open')}
 function closeMissionDesk(){missionOpen=false;document.getElementById('missionOverlay').classList.remove('open');keys.clear()}
 document.getElementById('missionClose').addEventListener('click',closeMissionDesk);
 document.querySelectorAll('[data-mission-tab]').forEach(b=>b.addEventListener('click',()=>{missionTab=b.dataset.missionTab;document.querySelector('#missionPanel h2').textContent=missionTab==='active'?'ACTIVE MISSIONS':'FINISHED MISSIONS';missionList()}));
 document.getElementById('missionOverlay').addEventListener('click',e=>{if(e.target.id==='missionOverlay')closeMissionDesk()});
 addEventListener('keydown',e=>{if(missionOpen){if(e.key==='Escape')closeMissionDesk();e.stopImmediatePropagation();e.preventDefault()}},true);
 document.getElementById('action').addEventListener('pointerdown',e=>{if(missionOpen){e.preventDefault();e.stopImmediatePropagation()}},true);
function show(title,message){clearTimeout(welcomeTimeout);dialogOpen=true;const d=document.getElementById('dialog');d.innerHTML='<b>'+title+'</b><div>'+message+'</div><small>Tap A to close</small>';d.style.display='block';if(title==='🧑‍⚕️ SUE')welcomeTimeout=setTimeout(()=>{if(dialogOpen)closeDialog()},6500)}function closeDialog(){clearTimeout(welcomeTimeout);dialogOpen=false;document.getElementById('dialog').style.display='none'}function updateHUD(){document.getElementById('stats').textContent=`${player.badges} badge${player.badges===1?'':'s'}`}
function move(dt){if(dialogOpen||shopOpen||missionOpen)return;let dx=0,dy=0;if(keys.has('left')||keys.has('ArrowLeft')||keys.has('a'))dx--;if(keys.has('right')||keys.has('ArrowRight')||keys.has('d'))dx++;if(keys.has('up')||keys.has('ArrowUp')||keys.has('w'))dy--;if(keys.has('down')||keys.has('ArrowDown')||keys.has('s'))dy++;if(!dx&&!dy)return;if(dx&&dy){if(player.dir==='left'||player.dir==='right')dy=0;else dx=0}const speed=152*dt;const nx=player.x+dx*speed,ny=player.y+dy*speed;player.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');const blocked=interior?(interior==='cure'&&cureSolid(nx,ny,11)):buildings.some(b=>nx>b.x+35&&nx<b.x+b.w-35&&ny>b.y+50&&ny<b.y+b.h-3)||(nx>gym.x+20&&nx<gym.x+gym.w-20&&ny>gym.y+20&&ny<gym.y+gym.h-3);if(!blocked){player.step+=dt;player.x=Math.max(interior?85:25,Math.min(interior?815:world.w-25,nx));player.y=Math.max(interior?145:35,Math.min(interior?580:world.h-25,ny));}}
function frame(t){if(!running)return;const dt=Math.min((t-last)/1000,.04)||0;last=t;move(dt);updateStaff(dt);if(typeof langySewer!=='undefined' && langySewer.inside){
  try{langyRenderSewer()}catch(sewerRenderError){
    console.error('Sewer renderer failure; returning safely to town:',sewerRenderError);
    langySewer.inside=false;interior=null;
    player.x=1950;player.y=1700;
    render();
  }
 } else render();requestAnimationFrame(frame)}
for(const b of document.querySelectorAll('[data-dir]')){const dir=b.dataset.dir;b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(dir)});const end=e=>{e.preventDefault();keys.delete(dir)};b.addEventListener('pointerup',end);b.addEventListener('pointercancel',end);b.addEventListener('lostpointercapture',()=>keys.delete(dir))}
document.getElementById('action').addEventListener('pointerdown',e=>{e.preventDefault();interact()});addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys.add(e.key);if((e.key===' '||e.key==='Enter')&&!e.repeat)interact();if(e.key==='Escape'&&shopOpen)closeShop()});addEventListener('keyup',e=>keys.delete(e.key));addEventListener('blur',()=>keys.clear());
// original synthesized chiptune, generated locally (no external assets or network)
const melody=[64,67,71,76,74,71,67,69,64,67,72,76,74,72,71,67,62,65,69,74,72,69,65,67,64,67,71,74,76,74,71,67];const bass=[40,40,45,45,43,43,38,38];function note(midi,dur,vol=.04,type='triangle'){if(!audio||!musicOn)return;const o=audio.createOscillator(),g=audio.createGain(),now=audio.currentTime;o.type=type;o.frequency.value=440*Math.pow(2,(midi-69)/12);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(vol,now+.015);g.gain.exponentialRampToValueAtTime(.0001,now+dur);o.connect(g);g.connect(audio.destination);o.start(now);o.stop(now+dur+.03)}let lastMusicBattleMode=false;
// Battle music is a separate, faster 8-bit composition, not a variation of the town tune.
const battleLead=[76,76,79,83,81,79,76,74,72,74,76,79,83,81,79,76, 76,79,84,83,79,76,74,72,71,74,79,78,76,74,71,69];
const battleLow=[40,40,43,38,41,41,43,38];
function musicTick(){
 if(!musicOn||!audio)return;
 const fighting=!!battle||creatureMode==='battle';
 if(fighting!==lastMusicBattleMode){
  lastMusicBattleMode=fighting;beat=0;
  if(tuneTimer)clearInterval(tuneTimer);
  tuneTimer=setInterval(musicTick,fighting?105:220);
 }
 if(fighting){
  // Distorted arcade lead, chugging bass, percussion and a fast counter-melody.
  note(battleLead[beat%battleLead.length],.09,.065,'square');
  if(beat%2===0){note(battleLow[Math.floor(beat/4)%battleLow.length],.18,.075,'sawtooth');note(battleLead[(beat+11)%battleLead.length]-12,.09,.022,'triangle');}
  if(beat%4===0)note(33,.08,.065,'sine');
  if(beat%4===2)note(58,.045,.035,'square');
 }else{
  note(melody[beat%melody.length],.19,.033,'triangle');
  if(beat%2===0)note(bass[Math.floor(beat/4)%bass.length],.32,.025,'sine');
  if(beat%4===2)note(melody[(beat+8)%melody.length]-12,.12,.013,'square');
 }
 beat++;
}
function startMusic(){
 try{
  audio=audio||new(window.AudioContext||window.webkitAudioContext)();
  audio.resume();
  if(tuneTimer)return;
  lastMusicBattleMode=!(!!battle||creatureMode==='battle');
  musicTick();
 }catch(e){document.getElementById('mute').textContent='Audio unavailable'}
}
document.getElementById('mute').addEventListener('click',()=>{musicOn=!musicOn;document.getElementById('mute').textContent=musicOn?'♫ Music ON':'♫ Music OFF';if(musicOn&&running)startMusic()});document.getElementById('play').addEventListener('click',()=>{document.getElementById('overlay').style.display='none';document.body.classList.remove('menuPending');running=true;last=performance.now();startMusic();requestAnimationFrame(frame)});

// Strain Adventures creature collection and three-member battle squad.
const CREATURES={
 northern:{name:'Northern Lights',type:'Lightning',hp:85,attack:18,skill:'Thunder Flash',skillDamage:28,desc:'A bright spark that can paralyse its foes.',color:'#e5c650'},
 star:{name:'Star Dawg',type:'Cosmic',hp:95,attack:17,skill:'Cosmic Bark',skillDamage:26,desc:'A space-powered howl that weakens enemies.',color:'#b5c8ff'},
 cheese:{name:'UK Cheese',type:'Stink',hp:90,attack:19,skill:'Foul Cloud',skillDamage:29,desc:'Strong against Strength, weak against Lightning, neutral against Cosmic.',color:'#e9bd3e'},
 trainwreck:{name:'Train Wreck',type:'Stink',hp:105,attack:21,skill:'Boiler Blast',skillDamage:31,desc:'A furious steam locomotive. Stink type: strong against Strength, weak against Lightning, neutral against Cosmic.',color:'#c86d31'},
 sourdiesel:{name:'Sour Diesel',type:'Stink',hp:98,attack:20,skill:'Fuel Burst',skillDamage:30,desc:'A furious fuel-pump fighter. Stink type: strong against Strength, weak against Lightning, neutral against Cosmic.',color:'#ed4b2d'},
 rs11:{name:'RS-11',type:'Robot',rarity:'Rare',hp:132,attack:27,skill:'Overclock Core',skillDamage:44,desc:'RARE Robot type. Strong against Cosmic and Stink; weak against Lightning and Fire. Enhanced battle stats.',color:'#27b5d6'},
 jealousy:{name:'Jealousy',type:'Dark',rarity:'Ultra Rare',hp:143,attack:29,skill:'Shadow Mirror',skillDamage:47,desc:'ULTRA RARE Dark type. A jealous shadow mage with 30% boosted base stats, 30% rarer encounters and 30% lower capture odds.',color:'#8534c8'},
 lunarrock:{name:'Lunar Rock',type:'Strength',rarity:'Epic',hp:161,attack:32,skill:'Lunar Gravity',skillDamage:55,desc:'EPIC Strength type. A floating-stone golem with 40% stronger stats, 40% rarer encounters and a 40% tougher capture chance.',color:'#70c544'},
 angolaroja:{name:'Angola Roja',type:'Fire',rarity:'Legendary',hp:175,attack:35,skill:'Royal Inferno',skillDamage:70,desc:'LEGENDARY Fire type. A crimson lion warrior with 75% boosted stats, exceptionally rare wild encounters and 75% tougher capture odds.',color:'#ffb72a'},
 gorilla:{name:'Gorilla Glue',type:'Strength',hp:115,attack:23,skill:'Sticky Slam',skillDamage:32,desc:'A crushing blow that slows opponents.',color:'#b99b7d'}
};
const ATTACKS={
 northern:[['Spark Zap',12],['Volt Bolt',19],['Thunder Flash',28],['Aurora Storm',36]],
 star:[['Meteor Paw',13],['Orbit Rush',20],['Cosmic Bark',26],['Supernova Howl',35]],
 cheese:[['Cheesy Jab',13],['Funky Fumes',20],['Foul Cloud',29],['Stink Bomb',37]],
 trainwreck:[['Steam Punch',14],['Smog Rush',22],['Boiler Blast',31],['Runaway Express',39]],
 sourdiesel:[['Fuel Jab',14],['Smog Rush',21],['Fuel Burst',30],['Octane Overload',38]],
 rs11:[['Servo Strike',19],['Circuit Breaker',28],['Plasma Punch',36],['Overclock Core',44]],
 jealousy:[['Shadow Claw',20],['Envy Hex',28],['Nightfall',38],['Shadow Mirror',47]],
 lunarrock:[['Rock Throw',24],['Ground Slam',38],['Lunar Gravity',46],['Meteor Crush',55]],
 angolaroja:[['Ember Spear',27],['Crimson Roar',39],['Lionheart Charge',53],['Royal Inferno',70]],
 gorilla:[['Heavy Punch',15],['Club Smash',23],['Sticky Slam',32],['Titan Crush',39]]
};
const CREATURE_IMAGES={"angolaroja":"assets/v204_8c166899d9056b51f23831eb.png","lunarrock":"assets/v204_82a05089af75b09ff60a739c.png","jealousy":"assets/v204_a26d98be67f202a18be0e172.png","rs11":"assets/v204_ce983c72327e1ff3c359d947.png","sourdiesel":'assets/v204_efaaeaab5cbefc05863f2253.png',"trainwreck":'assets/v204_8cb2215a07ac1c52002cfd79.png',"cheese":'assets/v204_0361225e76b839887042642e.png',"northern": "assets/v204_699e2bab341ad6566743e1c6.png", "star": "assets/v204_2efd29e8222c232765924d8f.png", "gorilla": "assets/v204_f70b5bdbfa8de166f47cc3a7.png"};
let collection=[],team=[],creatureMode='',battle=null,firstChoiceMade=false,selectedCreature=null;
const cUI=document.getElementById('creatureUI'),cTitle=document.getElementById('creatureTitle'),cHelp=document.getElementById('creatureHelp'),cContent=document.getElementById('creatureContent');
function monsterCard(id,extra=''){const c=CREATURES[id];return `<div class="monCard ${team.includes(id)?'selected':''}"><img src="${CREATURE_IMAGES[id]}" alt="${c.name} pixel sprite"><b>${c.name}</b><small>${c.type} · ${c.hp} HP<br>${c.skill}</small>${extra}</div>`}
function openCreatures(mode){creatureMode=mode;keys.clear();cUI.style.display='flex';refreshCreatures()}
function closeCreatures(){if(creatureMode==='starter'&&!firstChoiceMade)return;cUI.style.display='none';creatureMode='';keys.clear()}
function refreshCreatures(){
 document.getElementById('creatureClose').style.display=creatureMode==='starter'?'none':'block';
 if(creatureMode==='starter'){
 cTitle.textContent='🌱 Choose your first creature';cHelp.textContent='Choose one starter! You can collect the others later. Each creature has a unique battle ability.';
 cContent.innerHTML='<div class="monGrid">'+['northern','star','gorilla'].map(id=>monsterCard(id,`<button data-starter="${id}">CHOOSE</button>`)).join('')+'</div>';
 }else if(creatureMode==='battle'){
 cTitle.textContent='⚔️ NORMS GYM BATTLE';cHelp.textContent='Select attacks and defeat the gym trainer. Your squad can hold up to three creatures.';
 const id=team[battle.active]||team[0],c=CREATURES[id],enemy=battle.enemy;
 cContent.innerHTML=`<div class="monGrid"><div class="monCard"><img src="${CREATURE_IMAGES[id]}"><b>${c.name}</b><small>HP ${battle.hp[id]}/${c.hp}</small></div><div class="monCard"><img src="${CREATURE_IMAGES[enemy.id]}"><b>Rival ${CREATURES[enemy.id].name}</b><small>HP ${enemy.hp}/${CREATURES[enemy.id].hp}</small></div></div><div id="battleLog">${battle.log}</div><div id="battleActions">${ATTACKS[id].map((a,i)=>`<button data-attack="${i}">${a[0]} · ${a[1]} DMG</button>`).join('')}<button data-attack="switch">Switch Creature</button></div>`;
 }else{
 cTitle.textContent='🎒 Creature Collection';cHelp.textContent=`Owned: ${collection.length} · Battle team ${team.length}/3. Select a creature to view its HP and four attacks. Other starters are found later in the adventure.`;
 if(selectedCreature&&collection.includes(selectedCreature)){
  const id=selectedCreature,c=CREATURES[id];
  cContent.innerHTML=`<button data-backlist="1">← ALL CREATURES</button><div class="monGrid" style="margin-top:12px"><div class="monCard selected"><img src="${CREATURE_IMAGES[id]}" alt="${c.name}"><b>${c.name}</b><small>${c.type} type · ${c.hp} max HP</small></div><div class="monCard" style="text-align:left"><b>⚔️ ATTACKS</b>${ATTACKS[id].map(a=>`<p style="font-size:13px;margin:10px 0">${a[0]} — <strong>${a[1]} damage</strong></p>`).join('')}</div></div><p>${c.desc}</p><button data-toggle="${id}">${team.includes(id)?'REMOVE FROM TEAM':team.length<3?'ADD TO TEAM':'TEAM FULL'}</button>`;
 }else{
  selectedCreature=null;
  cContent.innerHTML='<div class="monGrid">'+collection.map(id=>monsterCard(id,`<button data-detail="${id}">VIEW STATS & ATTACKS</button><button data-toggle="${id}">${team.includes(id)?'REMOVE FROM TEAM':team.length<3?'ADD TO TEAM':'TEAM FULL'}</button>`)).join('')+'</div><p>The other starters are not available at the HQ mission desk. Find them in future areas!</p>';
 }
 }
}
function updateTeamButton(){document.getElementById('teamBtn').textContent=`🎒 Creatures (${team.length}/3)`}
function chooseStarter(id){if(firstChoiceMade)return;firstChoiceMade=true;collection=[id];team=[id];updateTeamButton();closeCreatures();closeDialog();keys.clear();const notice=document.createElement('div');notice.id='v237StarterNotice';notice.textContent='🌱 '+CREATURES[id].name+' joined your team! Use WASD or arrow keys to move.';notice.style.cssText='position:fixed;top:72px;left:50%;transform:translateX(-50%);z-index:10000;background:#173524;color:#fff;padding:12px 20px;border:3px solid #8ed17a;border-radius:12px;font:bold 16px sans-serif;max-width:90vw;text-align:center;pointer-events:none';document.body.appendChild(notice);setTimeout(()=>notice.remove(),3500)}
function recruitOthers(){show('📜 MISSION DESK','Your next mission is to earn the Common Gym badge! The other starter creatures will appear in later areas of the adventure.')}
function startCreatureBattle(){if(!team.length){show('NO CREATURES','Choose a starter first.');return}const opponent=team[0]==='gorilla'?'star':'gorilla';battle={active:0,hp:Object.fromEntries(team.map(id=>[id,CREATURES[id].hp])),enemy:{id:opponent,hp:CREATURES[opponent].hp},log:'The gym trainer challenges you! Choose your first attack.'};openCreatures('battle')}
function battleAction(action){if(!battle)return;let id=team[battle.active],c=CREATURES[id];if(action==='switch'){const next=team.findIndex((v,i)=>i!==battle.active&&battle.hp[v]>0);if(next<0){battle.log='No other healthy creatures in your team!';refreshCreatures();return}battle.active=next;id=team[next];c=CREATURES[id];battle.log=`Go, ${c.name}!`}
 else{const move=ATTACKS[id][Number(action)]||ATTACKS[id][0];const dmg=move[1];battle.enemy.hp=Math.max(0,battle.enemy.hp-dmg);battle.log=`${c.name} used ${move[0]}! ${dmg} damage.`}
 if(battle.enemy.hp<=0){player.badges=Math.max(1,player.badges);updateHUD();battle=null;closeCreatures();show('🏆 COMMON GYM VICTORY','Your squad won! You earned the Common Badge!');return}
 const retaliation=9+Math.floor(Math.random()*9);battle.hp[id]=Math.max(0,battle.hp[id]-retaliation);battle.log+=` Rival strikes back for ${retaliation} damage.`;
 if(battle.hp[id]<=0){const next=team.findIndex(v=>battle.hp[v]>0);if(next===-1){battle=null;closeCreatures();show('💫 TEAM FAINTED','Your creatures need healing! Visit the Cure Shop and try again.');return}battle.active=next;battle.log+=` ${CREATURES[team[next]].name} takes over!`}
 refreshCreatures()}
function healCreatures(){if(battle)battle=null;show('🌿 FULL HEAL','Your entire creature collection has been healed and is ready for battle!')}
document.getElementById('teamBtn').addEventListener('click',()=>{if(firstChoiceMade&&!battle)(selectedCreature=null,openCreatures('collection'))});
document.getElementById('creatureClose').addEventListener('click',closeCreatures);
cContent.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.starter)chooseStarter(b.dataset.starter);else if(b.dataset.detail){selectedCreature=b.dataset.detail;refreshCreatures()}else if(b.dataset.backlist){selectedCreature=null;refreshCreatures()}else if(b.dataset.toggle){const id=b.dataset.toggle;if(team.includes(id))team=team.filter(x=>x!==id);else if(team.length<3)team.push(id);updateTeamButton();refreshCreatures()}else if(b.dataset.attack)battleAction(b.dataset.attack)});
// Capture interactions before legacy handler using a capturing event listener.
document.addEventListener('keydown',e=>{if(cUI.style.display==='flex'&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','Enter'].includes(e.key)){e.preventDefault();e.stopImmediatePropagation()}},true);
const originalInteract=interact;
interact=function(){if(interior==='gym'&&dialogOpen&&!battle&&!normSceneMode){closeDialog();keys.clear();return;}if(cUI.style.display==='flex')return;if(interior==='hq'&&player.y<390&&player.x>=95&&player.x<415){openMissionDesk();return}if(interior==='gym'&&player.y<500){if(player.badges){show('🏆 NORMS GYM','You already earned the Common Badge!');return}startCreatureBattle();return}if(interior==='cure'&&player.y<355&&player.x<440){player.hp=100;updateHUD();healCreatures();return}originalInteract()};
const originalMove=move;move=function(dt){if(cUI.style.display==='flex')return;originalMove(dt)};
const beforeExpandedMove=move;
move=function(dt){
 const px=player.x,py=player.y;
 beforeExpandedMove(dt);
 if(interior)return;
 const x=player.x,y=player.y;
 const margin=225+Math.sin(y*.012)*28+Math.cos(x*.014)*22;
 const outside=x<margin||y<margin||x>world.w-margin||y>world.h-margin;
 const houseHit=quietHouses.some(h=>x>h.x+9&&x<h.x+h.w-9&&y>h.y+38&&y<h.y+h.h-8);
 if(outside||houseHit){player.x=px;player.y=py;}
};
const originalUpdateStaff=updateStaff;updateStaff=function(dt){if(cUI.style.display==='flex')return;originalUpdateStaff(dt)};
// First-time starter selection is shown immediately after Play is tapped.
document.getElementById('play').addEventListener('click',()=>{if(!firstChoiceMade)openCreatures('starter')});

const normPortrait=new Image();normPortrait.src="assets/v204_b2308f1d9f4616e2c219324c.png";
const normFullSprite=new Image();normFullSprite.src="assets/v204_4f7fdebd73afb8a6f11bfeb3.png";

const normAnimSets={
 down:[0,1,2,3].map(i=>{const img=new Image();img.src=["assets/v204_3b39f8b563c3d7dc9a9512ef.png","assets/v204_49b4ab2ee04adb7fbe435ed9.png","assets/v204_691fc9bd22ecc10c429766e5.png","assets/v204_b0d0a1895cbf08d367b3b8de.png"][i];return img;}),
 up:[0,1,2,3].map(i=>{const img=new Image();img.src=["assets/v204_4acf85382ffa6ef3a4985d30.png","assets/v204_a7f38851a0be9a8c6eb31dfc.png","assets/v204_eeb8adc633b8c977acefbe8f.png","assets/v204_219ac918d1075374b1fa7ab4.png"][i];return img;}),
 left:[0,1,2,3].map(i=>{const img=new Image();img.src=["assets/v204_0a375eae9f18a777cb2982e0.png","assets/v204_6d0d154506b2605411e89ef2.png","assets/v204_505b29a607bf9f5949ff3572.png","assets/v204_42cb9850939ee329579b0b91.png"][i];return img;}),
 right:[0,1,2,3].map(i=>{const img=new Image();img.src=["assets/v204_27e9f97812907b569472b118.png","assets/v204_bd14b0ddff2a9e982de0830f.png","assets/v204_e2672e5b133c70c6eaf83534.png","assets/v204_b2a171ce4867a1da840d0976.png"][i];return img;})
};
const normExpressionImages=[(()=>{const i=new Image();i.src="assets/v204_61a29749345392202bbbc1fc.png";return i})(),(()=>{const i=new Image();i.src="assets/v204_c69b56e544b9dbc8f38c4b0c.png";return i})(),(()=>{const i=new Image();i.src="assets/v204_4f553cd7e2f7b83095b63ef4.png";return i})()];
const normWander={x:450,y:420,tx:450,ty:420,dir:"down",step:0,wait:1,last:0,moving:false};
function normWalkUpdate(){
 const now=performance.now()/1000,dt=Math.min(.05,Math.max(0,now-(normWander.last||now)));
 normWander.last=now;normWander.moving=false;
 if(interior!=="gym"||dialogOpen||battle)return;
  if(window.SAActorRoutes?.drive('norm',normWander,dt))return;
 if(normWander.wait>0){normWander.wait=Math.max(0,normWander.wait-dt);return;}
 const dx=normWander.tx-normWander.x,dy=normWander.ty-normWander.y;
 if(Math.abs(dx)<1&&Math.abs(dy)<1){
  normWander.wait=.7+Math.random()*1.4;
  normWander.tx=275+Math.random()*350;normWander.ty=345+Math.random()*125;return;
 }
 const horizontal=Math.abs(dx)>=1;
 const remain=horizontal?dx:dy;
 const travel=Math.sign(remain)*Math.min(Math.abs(remain),37*dt);
 if(horizontal){normWander.x+=travel;normWander.dir=travel<0?'left':'right';}
 else{normWander.y+=travel;normWander.dir=travel<0?'up':'down';}
 normWander.step+=dt*8;normWander.moving=travel!==0;
}
function drawAnimatedNorm(){
 normWalkUpdate();
 const frames=normAnimSets[normWander.dir]||normAnimSets.down;
 const phase=normWander.moving?(Math.floor(normWander.step)%4):0;
 const img=frames[phase]||frames[0];
 ctx.save();ctx.imageSmoothingEnabled=false;
 if(img&&img.complete&&img.naturalWidth){
  // Every frame has a complete isolated silhouette and consistent bottom/feet anchor.
  // Scale uniformly, preserving aspect ratio; never crop any portion of the source PNG.
  const h=88,w=Math.round(h*img.naturalWidth/img.naturalHeight);
  const x=Math.round(normWander.x-w/2);
  const y=Math.round(normWander.y-h+6);
  ctx.drawImage(img,0,0,img.naturalWidth,img.naturalHeight,x,y,w,h);
 }
 ctx.restore();
}

function gymArena(){
 ctx.save();
 // Stadium lighting and battle floor
 const glow=ctx.createRadialGradient(450,365,30,450,365,440);glow.addColorStop(0,'#62715a');glow.addColorStop(1,'#14282b');ctx.fillStyle=glow;ctx.fillRect(65,135,770,435);
 for(let i=0;i<10;i++){ctx.strokeStyle=i%2?'#52766b':'#354f49';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(75,160+i*40);ctx.lineTo(825,160+i*40);ctx.stroke()}
 ctx.fillStyle='#223a37';ctx.fillRect(75,155,750,55);
 for(let i=0;i<15;i++){ctx.fillStyle=i%3===0?'#f3d270':'#63cc93';ctx.fillRect(96+i*48,170,24,9)}
 ctx.fillStyle='#7b5a38';ctx.fillRect(135,330,630,190);ctx.fillStyle='#315d4b';ctx.fillRect(150,343,600,160);
 ctx.strokeStyle='#e3c16a';ctx.lineWidth=6;ctx.strokeRect(155,348,590,150);
 ctx.beginPath();ctx.ellipse(450,424,110,65,0,0,Math.PI*2);ctx.stroke();
 ctx.beginPath();ctx.moveTo(450,350);ctx.lineTo(450,498);ctx.stroke();
 for(let i=0;i<4;i++){ctx.fillStyle='#f6c95d';ctx.fillRect(130+i*175,242,36,8)}
 // Norm walks around the gym using the supplied directional sprite frames.
 drawAnimatedNorm();
 text('WHITE BOY NORM',450,187,22,'#fff0ad');text('GYM LEADER',450,208,14,'#9be8b2');text('PRESS A TO CHALLENGE',450,548,18,'#fff0ae');
 ctx.restore();
}

const originalNormShow=show;
show=function(title,message){originalNormShow(title,message);if(interior==='gym'&&(/NORM|GYM|BADGE|VICTORY|CHALLENGE/i.test(title))){const d=document.getElementById('dialog');const m=/VICTORY|BADGE|BEAT/i.test(title)?4:/ALREADY/i.test(message)?7:/CHALLENGE/i.test(message)?12:6;const portrait=normExpressionImages[Math.min(2,m>=12?2:m>=7?1:0)];if(portrait){const img=document.createElement('img');img.src=portrait.src;img.alt='Norm expression';img.style.cssText='height:110px;max-width:115px;object-fit:contain;image-rendering:pixelated;float:left;margin:0 12px 8px 0';d.insertBefore(img,d.firstChild)}}};
const baseDrawInterior=drawInterior;
drawInterior=function(){baseDrawInterior();if(interior==='gym'){
 // Draw arena over placeholder furniture, then redraw player and exit on top
 gymArena();roundRect(369,586,162,72,7,'#203f35','#d9c584');text('EXIT ↓',450,620,21,'#f7f0c5');drawHero(player.x,player.y,player.dir,player.step);
 }};
// Gym music replaces town melody immediately on entering, and returns when leaving.
const gymMelody=[52,55,59,64,67,64,62,59,57,60,64,69,71,69,67,64,59,62,66,71,74,71,69,66];
const gymBass=[33,33,36,36,38,38,31,31];
const townMusicStart=startMusic;
startMusic=function(){try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();audio.resume();if(tuneTimer){clearInterval(tuneTimer);tuneTimer=null}beat=0;tuneTimer=setInterval(()=>{if(!musicOn)return;if(interior==='gym'){
 note(gymMelody[beat%gymMelody.length],.15,.047,'sawtooth');if(beat%2===0)note(gymBass[Math.floor(beat/4)%gymBass.length],.27,.045,'square');if(beat%4===0)note(43,.065,.018,'triangle');
 }else{note(melody[beat%melody.length],.21,.033,'triangle');if(beat%2===0)note(bass[Math.floor(beat/4)%bass.length],.37,.025,'sine');if(beat%4===2)note(melody[(beat+8)%melody.length]-12,.13,.013,'square')}
 beat++},interior==='gym'?170:250)}catch(e){}};
const originalEnterRoom=enterRoom;enterRoom=function(kind){originalEnterRoom(kind);if(kind==='gym'){normWander.last=0;normWander.wait=.5;if(running)startMusic()}};
const originalLeaveRoom=leaveRoom;leaveRoom=function(){originalLeaveRoom();if(running)startMusic()};

// V13: prevent repeated post-victory dialogues and keep the gym freely explorable.
const gymInteractOriginal=interact;
interact=function(){
 if(interior==='gym' && !dialogOpen && !shopOpen && player.badges>=1 && player.y<500){
   // Badge already earned: no new modal is spawned when A is pressed.
   return;
 }
 gymInteractOriginal();
};
// Keep Norm solid so the hero cannot stand inside his sprite.
const gymMoveOriginal=move;
move=function(dt){
 if(interior!=='gym'){gymMoveOriginal(dt);return}
 const oldX=player.x,oldY=player.y;
 gymMoveOriginal(dt);
 if(Math.abs(player.x-normWander.x)<20 && Math.abs(player.y-normWander.y)<11){player.x=oldX;player.y=oldY}
};
// Dismiss victory with A, Enter, or Escape; no automatic re-trigger.
addEventListener('keydown',e=>{if(e.key==='Escape'&&dialogOpen)closeDialog()});

// V14: side-view turn-based creature battles with attack-specific synthesised sounds.
let battleToken=0;
const enemyMoves={
 northern:[['Static Pop',10],['Lightning Strike',17],['Aurora Pulse',23],['Thunder Burst',27]],
 star:[['Star Scratch',10],['Orbit Pounce',16],['Cosmic Bark',23],['Meteor Rush',29]],
 gorilla:[['Knuckle Tap',12],['Heavy Swing',18],['Sticky Slam',24],['Ground Pound',30]],
 cheese:ATTACKS.cheese,
 trainwreck:ATTACKS.trainwreck,
 sourdiesel:ATTACKS.sourdiesel,
 rs11:ATTACKS.rs11,
 jealousy:ATTACKS.jealousy,
 lunarrock:ATTACKS.lunarrock,
 angolaroja:ATTACKS.angolaroja
};
function battleTone(freq,duration=.15,wave='square',volume=.065,delay=0){
 try{
  const AC=window.AudioContext||window.webkitAudioContext;
  if(!audio)audio=new AC();if(audio.state==='suspended')audio.resume();
  const t=audio.currentTime+delay,o=audio.createOscillator(),g=audio.createGain();
  o.type=wave;o.frequency.setValueAtTime(freq,t);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+.015);
  g.gain.exponentialRampToValueAtTime(.0001,t+duration);
  o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+duration+.02);
 }catch(e){}
}
function moveSound(id,index){
 const base={northern:660,star:410,gorilla:175}[id]||300;
 if(id==='northern')for(let i=0;i<3+index;i++)battleTone(base+i*105,.065,'sawtooth',.035,i*.055);
 if(id==='star')for(let i=0;i<3+index;i++)battleTone(base+(i%2?190:-80)+index*45,.12,'sine',.045,i*.075);
 if(id==='gorilla'){battleTone(base-index*19,.24,'triangle',.11);battleTone(85,.15,'square',.035,.12);}
}
function hitSound(){battleTone(135,.09,'square',.042);battleTone(90,.14,'triangle',.035,.07)}
function hpMarkup(id,hp,who){
 const c=CREATURES[id],percent=Math.max(0,Math.min(100,100*hp/c.hp));
 return `<div class="battle-hud ${who}"><div class="row"><span>${c.name}</span><span>Lv. 5</span></div><div class="type">${c.type} type</div><div class="bar"><div class="fill ${percent<=20?'critical':percent<=45?'low':''}" style="width:${percent}%"></div></div><div class="hp">HP ${hp} / ${c.hp}</div></div>`;
}
function renderSideBattle(){
 if(!battle)return;
 const id=team[battle.active],e=battle.enemy;
 cTitle.textContent='⚔️ NORMS GYM — WHITE BOY NORM';
 cHelp.textContent='Choose a move. Your opponent takes a turn after you attack.';
 document.getElementById('creatureClose').style.display='none';
 const moves=ATTACKS[id];
 cContent.innerHTML=`<div class="battle-v14">
 <div class="battle-field" aria-label="Side view creature battle">
 <div class="battle-platform enemy"></div><div class="battle-platform player"></div>
 <img class="battle-sprite enemy" id="battleEnemySprite" src="${CREATURE_IMAGES[e.id]}" alt="Enemy ${CREATURES[e.id].name}">
 <img class="battle-sprite player" id="battlePlayerSprite" src="${CREATURE_IMAGES[id]}" alt="Your ${CREATURES[id].name}">
 ${hpMarkup(e.id,e.hp,'enemy')}${hpMarkup(id,battle.hp[id],'player')}
 </div><div class="battle-panel"><div class="battle-message" id="battleMessage" aria-live="polite">${battle.log}</div>
 <div class="battle-moves">${moves.map((m,i)=>`<button data-attack="${i}" ${battle.busy?'disabled':''}>${m[0]}<small>${m[1]} damage</small></button>`).join('')}</div></div>
 <div class="battle-footer"><span>YOUR ACTIVE STRAIN: ${CREATURES[id].name}</span><span>TEAM ${team.length}/3</span></div></div>`;
}
const refreshBeforeSideBattle=refreshCreatures;
refreshCreatures=function(){if(creatureMode==='battle'&&battle){renderSideBattle();return}refreshBeforeSideBattle()};
const startBeforeSideBattle=startCreatureBattle;
startCreatureBattle=function(){battleToken++;startBeforeSideBattle();if(battle){battle.busy=false;refreshCreatures()}};
const closeBeforeSideBattle=closeCreatures;
closeCreatures=function(){if(battle&&creatureMode==='battle')return;closeBeforeSideBattle()};
function battleMessage(message){if(!battle)return;battle.log=message;const el=document.getElementById('battleMessage');if(el)el.textContent=message}
function animateBattleSprite(who,cls){ /* Combat animation disabled; retain static battle sprite. */ }
function finishBattleVictory(){
 if(!battle)return;battleToken++;player.badges=Math.max(1,player.badges);updateHUD();battle=null;
 // Close the battle overlay before opening the victory dialogue.
 closeBeforeSideBattle();show('🏆 COMMON GYM VICTORY','You defeated White Boy Norm and earned the Common Badge! Press A to continue exploring.');
}
function finishBattleDefeat(){
 if(!battle)return;battleToken++;battle=null;closeBeforeSideBattle();show('💫 TEAM FAINTED','Your creatures fainted! Visit the Cure Shop to heal before trying again.');
}
// One action = one player move, then one enemy move. All delays are cancelled on battle end.
battleAction=function(action){
 if(!battle||battle.busy)return;
 const id=team[battle.active],moveIndex=Number(action);
 if(action==='switch')return;
 if(!Number.isInteger(moveIndex)||moveIndex<0||moveIndex>3)return;
 battle.busy=true;const token=++battleToken,move=ATTACKS[id][moveIndex];
 battleMessage(`${CREATURES[id].name} used ${move[0]}!`);
 moveSound(id,moveIndex);animateBattleSprite('player','strike');
 renderSideBattle();animateBattleSprite('player','strike');
 setTimeout(()=>{
  if(!battle||token!==battleToken)return;
  battle.enemy.hp=Math.max(0,battle.enemy.hp-move[1]);hitSound();renderSideBattle();animateBattleSprite('enemy','hit');
  battleMessage(`${move[0]} dealt ${move[1]} damage!`);
  if(battle.enemy.hp<=0){setTimeout(()=>{if(battle&&token===battleToken)finishBattleVictory()},950);return}
  setTimeout(()=>{
   if(!battle||token!==battleToken)return;
   const enemyId=battle.enemy.id,options=enemyMoves[enemyId];const n=staminaChooseEnemyIndex(options),enemyMove=n<0?['Recover',0]:options[n];
   battleMessage(`Norm's ${CREATURES[enemyId].name} used ${enemyMove[0]}!`);
   moveSound(enemyId,n);animateBattleSprite('enemy','strike');
   setTimeout(()=>{
    if(!battle||token!==battleToken)return;
    battle.hp[id]=Math.max(0,battle.hp[id]-enemyMove[1]);hitSound();renderSideBattle();animateBattleSprite('player','hit');
    battleMessage(`${CREATURES[id].name} took ${enemyMove[1]} damage!`);
    setTimeout(()=>{
     if(!battle||token!==battleToken)return;
     if(battle.hp[id]<=0){const next=team.findIndex(v=>battle.hp[v]>0);
      if(next===-1){finishBattleDefeat();return}
      battle.active=next;battleMessage(`${CREATURES[team[next]].name}, you're up!`);
     }else battleMessage(`What will ${CREATURES[team[battle.active]].name} do?`);
     battle.busy=false;renderSideBattle();
    },800);
   },540);
  },920);
 },420);
};

// V22: Only creatures have HP. Fainted creatures stay fainted until healed.
const creatureHealth={};
function syncCreatureHealth(){for(const id of collection){if(creatureHealth[id]===undefined)creatureHealth[id]=CREATURES[id].hp}}
const v22ChooseStarter=chooseStarter;
chooseStarter=function(id){v22ChooseStarter(id);syncCreatureHealth()};
const v22StartBattle=startCreatureBattle;
startCreatureBattle=function(){
 syncCreatureHealth();
 if(!team.length){show('NO CREATURES','Select a creature for your team first.');return}
 if(!team.some(id=>(creatureHealth[id]||0)>0)){
  show('🌿 HEAL YOUR STRAINS','Your strains have fainted. Head to the Cure Shop healing counter before battling again.');return;
 }
 v22StartBattle();
 if(battle){
  battle.hp=Object.fromEntries(team.map(id=>[id,creatureHealth[id]||0]));
  battle.active=team.findIndex(id=>battle.hp[id]>0);
  battle.log='Norm challenges you! Choose your attack.';
  refreshCreatures();
 }
};
function saveBattleHealth(){if(!battle)return;for(const id of team){if(battle.hp[id]!==undefined)creatureHealth[id]=Math.max(0,battle.hp[id])}}
const v22Win=finishBattleVictory;
finishBattleVictory=function(){saveBattleHealth();v22Win()};
const v22Lose=finishBattleDefeat;
finishBattleDefeat=function(){saveBattleHealth();v22Lose()};
const v22Interact=interact;
interact=function(){
 if(interior==='cure'&&!dialogOpen&&!shopOpen&&cUI.style.display!=='flex'&&player.y<355&&player.x<440){
  syncCreatureHealth();for(const id of collection)creatureHealth[id]=CREATURES[id].hp;
  show('🌿 STRAINS HEALED','All your collected strains have been restored to full HP. You can battle again!');return;
 }
 v22Interact();
};
// Show persistent health when inspecting a creature, not a trainer HP meter.
const v22MonsterCard=monsterCard;
monsterCard=function(id,extra=''){
 syncCreatureHealth();
 const card=v22MonsterCard(id,extra);
 return card.replace(`${CREATURES[id].hp} HP`,`${creatureHealth[id] ?? CREATURES[id].hp}/${CREATURES[id].hp} HP`);
};
updateHUD();

// V23 — persistent in-session levels, XP and scaling moves.
const creatureProgress={};
function xpNeeded(level){return Math.round(20+12*(level-1)+3*(level-1)*(level-1));}
function progressFor(id){return creatureProgress[id]||(creatureProgress[id]={level:1,xp:0,bonuses:[0,0,0,0]});}
function currentMove(id,index){const base=ATTACKS[id][index];return [base[0],base[1]+progressFor(id).bonuses[index]];}
function awardBattleXP(){
 const results=[];
 for(const id of team){if(!collection.includes(id))continue;
  const p=progressFor(id),before=p.level;
  const gained=30+Math.floor(Math.random()*11);p.xp+=gained;
  while(p.level<100&&p.xp>=xpNeeded(p.level)){
   p.xp-=xpNeeded(p.level);p.level++;
   p.bonuses=p.bonuses.map(v=>v+2+Math.floor(Math.random()*4));
  }
  results.push(`${CREATURES[id].name} gained ${gained} XP${p.level>before?` and reached Lv. ${p.level}! Each attack grew stronger.`:''}`);
 }
 return results.join(' ');
}
const v23Starter=chooseStarter;
chooseStarter=function(id){v23Starter(id);progressFor(id)};
const v23Start=startCreatureBattle;
startCreatureBattle=function(){v23Start();if(battle){battle.enemy.level=10;refreshCreatures()}};
// Replace battle HUD with actual levels; gym opponent is always level 10.
hpMarkup=function(id,hp,who){
 const c=CREATURES[id],max=c.hp,level=who==='enemy'?10:progressFor(id).level;
 const percent=Math.max(0,Math.min(100,100*hp/max));
 return `<div class="battle-hud ${who}"><div class="row"><span>${c.name}</span><span>Lv. ${level}</span></div><div class="type">${c.type} type</div><div class="bar"><div class="fill ${percent<=20?'critical':percent<=45?'low':''}" style="width:${percent}%"></div></div><div class="hp">HP ${hp} / ${max}</div></div>`;
};
// Rebuild battle buttons using upgraded damage values while preserving original art and layout.
const v23Render=renderSideBattle;
renderSideBattle=function(){v23Render();if(!battle)return;
 const id=team[battle.active];
 document.querySelectorAll('.battle-moves button[data-attack]').forEach(btn=>{
  const i=Number(btn.dataset.attack),m=currentMove(id,i);
  btn.innerHTML=`${m[0]}<small>${m[1]} damage</small>`;
 });
};
// Existing combat function resolves attacks asynchronously; apply the upgraded
// attack value only during that move and restore base data on completion.
// A separate override prevents changes to global base attacks or enemy moves.
battleAction=function(action){
 if(!battle||battle.busy)return;
 const id=team[battle.active],moveIndex=Number(action);
 if(action==='switch')return;
 if(!Number.isInteger(moveIndex)||moveIndex<0||moveIndex>3)return;
 battle.busy=true;const token=++battleToken,move=currentMove(id,moveIndex);
 battleMessage(`${CREATURES[id].name} used ${move[0]}!`);
 moveSound(id,moveIndex);renderSideBattle();animateBattleSprite('player','strike');
 setTimeout(()=>{
  if(!battle||token!==battleToken)return;
  const dealt=scaledDamage(move[1],progressFor(id).level,battle.enemy.level);battle.enemy.hp=Math.max(0,battle.enemy.hp-dealt);hitSound();renderSideBattle();animateBattleSprite('enemy','hit');
  battleMessage(`${move[0]} dealt ${dealt} damage!`);
  if(battle.enemy.hp<=0){setTimeout(()=>{if(battle&&token===battleToken)finishBattleVictory()},950);return}
  setTimeout(()=>{
   if(!battle||token!==battleToken)return;
   const enemyId=battle.enemy.id,options=enemyMoves[enemyId],n=staminaChooseEnemyIndex(options),enemyMove=n<0?['Recover',0]:options[n];
   battleMessage(`Norm's Lv. 10 ${CREATURES[enemyId].name} used ${enemyMove[0]}!`);
   moveSound(enemyId,n);animateBattleSprite('enemy','strike');
   setTimeout(()=>{
    if(!battle||token!==battleToken)return;
    const received=scaledDamage(enemyMove[1],battle.enemy.level,progressFor(id).level);battle.hp[id]=Math.max(0,battle.hp[id]-received);hitSound();renderSideBattle();animateBattleSprite('player','hit');
    battleMessage(`${CREATURES[id].name} took ${received} damage!`);
    setTimeout(()=>{
     if(!battle||token!==battleToken)return;
     if(battle.hp[id]<=0){const next=team.findIndex(v=>battle.hp[v]>0);
      if(next===-1){finishBattleDefeat();return}
      battle.active=next;battleMessage(`${CREATURES[team[next]].name}, you're up!`);
     }else battleMessage(`What will ${CREATURES[team[battle.active]].name} do?`);
     battle.busy=false;renderSideBattle();
    },800);
   },540);
  },920);
 },420);
};
const v23Victory=finishBattleVictory;
finishBattleVictory=function(){
 if(!battle)return;
 const xpReport=awardBattleXP();v23Victory();
 if(dialogOpen){const d=document.getElementById('dialog');
  d.innerHTML='<b>🏆 COMMON GYM VICTORY</b><div>You defeated White Boy Norm and earned the Common Badge! '+xpReport+'</div><small>Tap A to close</small>';
 }
};
// Add progress and boosted moves to the existing collection screen.
const v23Refresh=refreshCreatures;
refreshCreatures=function(){v23Refresh();if(creatureMode!=='collection')return;
 if(selectedCreature&&collection.includes(selectedCreature)){
  const id=selectedCreature,p=progressFor(id),box=document.querySelector('#creatureContent');
  const remaining=xpNeeded(p.level);
  const card=box.querySelector('.monCard.selected small');
  if(card)card.innerHTML+=`<br>Level ${p.level} · HP ${creatureHealth[id]??CREATURES[id].hp}/${CREATURES[id].hp}<br>XP ${p.xp}/${remaining}`;
  const cards=box.querySelectorAll('.monCard');
  if(cards[1])cards[1].innerHTML='<b>⚔️ ATTACKS</b>'+ATTACKS[id].map((m,i)=>`<p style="font-size:13px;margin:10px 0">${m[0]} — <strong>${currentMove(id,i)[1]} damage</strong></p>`).join('');
 }else{
  document.querySelectorAll('#creatureContent .monCard').forEach(card=>{
   const button=card.querySelector('[data-detail]');if(!button)return;
   const p=progressFor(button.dataset.detail),small=card.querySelector('small');
   if(small)small.innerHTML+=`<br>Level ${p.level} · XP ${p.xp}/${xpNeeded(p.level)}`;
  });
 }
};


// V24: meaningful level differences, health scaling and repeatable practice battles.
function maxHealth(id,level=progressFor(id).level){return CREATURES[id].hp+Math.max(0,level-1)*9;}
function scaledDamage(base,attackerLevel,defenderLevel){
 // A nine-level disadvantage dramatically reduces damage, while the higher
 // level creature hits harder. Same-level encounters stay near base values.
 const gap=Math.max(-5,Math.min(5,attackerLevel-defenderLevel));
 return Math.max(1,Math.round(base*(1+.05*gap)));
}
// Level 10 opponents have substantially more HP, not just a level label.
const v24Start=startCreatureBattle;
startCreatureBattle=function(){
 v24Start();if(!battle)return;
 battle.mode='gym';battle.enemy.level=10;
 battle.enemy.maxHp=maxHealth(battle.enemy.id,10);
 battle.enemy.hp=battle.enemy.maxHp;
 for(const id of team){const full=maxHealth(id);if(creatureHealth[id]===undefined)creatureHealth[id]=full;battle.hp[id]=Math.min(creatureHealth[id],full)}
 battle.active=team.findIndex(id=>battle.hp[id]>0);
 refreshCreatures();
};
// Display the correct HP maximum and level for each combatant.
hpMarkup=function(id,hp,who){
 const c=CREATURES[id],level=who==='enemy'?(battle?.enemy.level||10):progressFor(id).level;
 const max=who==='enemy'?(battle?.enemy.maxHp||maxHealth(id,level)):maxHealth(id,level);
 const percent=Math.max(0,Math.min(100,100*hp/max));
 return `<div class="battle-hud ${who}"><div class="row"><span>${c.name}</span><span>Lv. ${level}</span></div><div class="type">${c.type} type</div><div class="bar"><div class="fill ${percent<=20?'critical':percent<=45?'low':''}" style="width:${percent}%"></div></div><div class="hp">HP ${hp} / ${max}</div></div>`;
};
// Enemy attacks are tougher at level 10, but manageable in practice.
const v24Win=finishBattleVictory;
finishBattleVictory=function(){
 if(!battle)return;
 if(battle.mode==='training'){
  saveBattleHealth();const xpReport=awardBattleXP();battleToken++;battle=null;
  closeBeforeSideBattle();
  show('⭐ PRACTICE VICTORY',`Training complete! ${xpReport} Heal at the Cure Shop if needed, then train again or challenge Norm.`);
  return;
 }
 v24Win();
};
const v24Heal=interact;
// Cure Shop healing uses the level-scaled maximum rather than level-1 HP.
interact=function(){
 if(interior==='cure'&&!dialogOpen&&!shopOpen&&cUI.style.display!=='flex'&&player.y<355&&player.x<440){
  syncCreatureHealth();for(const id of collection)creatureHealth[id]=maxHealth(id);
  show('🌿 STRAINS HEALED','Your strains have been fully healed.');return;
 }
 v24Heal();
};
// HP gains on level-up restore the newly gained maximum-health difference.
const v24Award=awardBattleXP;
awardBattleXP=function(){
 const before=Object.fromEntries(collection.map(id=>[id,maxHealth(id)]));
 const result=v24Award();
 for(const id of collection){
  const extra=maxHealth(id)-before[id];
  if(extra>0)creatureHealth[id]=Math.min(maxHealth(id),(creatureHealth[id]??before[id])+extra);
 }
 return result;
};
const v24Refresh=refreshCreatures;
refreshCreatures=function(){
 v24Refresh();
 if(creatureMode==='battle'&&battle){
  cTitle.textContent=battle.mode==='training'?'⭐ HQ PRACTICE BATTLE':'⚔️ NORMS GYM — WHITE BOY NORM';
  cHelp.textContent=battle.mode==='training'?'Practice against a Level 2 strain to earn XP.':'Norm’s Level 10 strain is a serious challenge. Train at HQ first!';
 }
 if(creatureMode==='collection'&&selectedCreature){
  const id=selectedCreature,p=progressFor(id),card=cContent.querySelector('.monCard.selected small');
  if(card)card.innerHTML=`${CREATURES[id].type} type · Lv. ${p.level}<br>HP ${creatureHealth[id]??maxHealth(id)}/${maxHealth(id)}<br>XP ${p.xp}/${xpNeeded(p.level)}`;
 }
};
// Fresh starters and pre-existing creatures have a level-appropriate HP cap.
const v24Choose=chooseStarter;
chooseStarter=function(id){v24Choose(id);creatureHealth[id]=maxHealth(id)};


// V26 — type advantage, occasional weak hits, and level-gap evasion.
// Type triangle: Lightning > Strength > Cosmic > Lightning.
const V26_ADVANTAGE={Lightning:'Strength',Strength:'Cosmic',Cosmic:'Lightning'};
function v26DodgeChance(defenderLevel,attackerLevel){
 // Avoid level difference creating a second overwhelming penalty on top of damage/HP.
 const gap=defenderLevel-attackerLevel;
 return Math.max(0,Math.min(.10,gap*.01));
}
function v26ResolveAttack(attackerId,defenderId,attackerLevel,defenderLevel,base){
 // V235 forced evasions resolve before all on-hit status handlers.
 if(base>0&&battle?._v235ForceMiss)return {dodged:true,damage:0,note:'Evaded!',rested:false};
 if(base<=0)return {dodged:true,damage:0,note:'Recovering stamina',rested:true};
 const style=typeof v238AttackStyle==='function'?v238AttackStyle(attackerId,defenderId):'standard';
 const dodge=Math.max(0,v26DodgeChance(defenderLevel,attackerLevel)-(style==='precision'?.10:0));
 if(Math.random()<dodge)return {dodged:true,damage:0,note:'DODGED!'};
 const a=CREATURES[attackerId].type,d=CREATURES[defenderId].type;
 const effect=typeof v238TypeMultiplier==='function'?v238TypeMultiplier(a,d):1;
 const styleMult=style==='power'?1.15:style==='precision'?.90:1;
 const damage=Math.max(1,Math.round(scaledDamage(base,attackerLevel,defenderLevel)*effect*styleMult));
 return {dodged:false,damage,note:effect>1?'⚡ SUPER EFFECTIVE!':effect<1?'🛡️ NOT VERY EFFECTIVE':'',typeEffect:effect,style};
}
// Keep the original animation timings, sound effects, and battle cleanup.
battleAction=function(action){
 if(!battle||battle.busy)return;
 const id=team[battle.active],index=Number(action);
 if(action==='switch')return;
 if(!Number.isInteger(index)||index<0||index>3)return;
 battle.busy=true;
 const token=++battleToken,move=currentMove(id,index);
 battleMessage(`${CREATURES[id].name} used ${move[0]}!`);
 moveSound(id,index);renderSideBattle();animateBattleSprite('player','strike');
 setTimeout(()=>{
  if(!battle||token!==battleToken)return;
  const result=v152ResolvePlayerAttack(id,battle.enemy.id,progressFor(id).level,battle.enemy.level,move[1]);
  if(!result.dodged){battle.enemy.hp=Math.max(0,battle.enemy.hp-result.damage);hitSound();}
  renderSideBattle();if(!result.dodged)animateBattleSprite('enemy','hit');
  battleMessage(result.dodged?`Norm's ${CREATURES[battle.enemy.id].name} dodged the attack!`:`${move[0]} dealt ${result.damage} damage! ${result.note}`);
  if(battle.enemy.hp<=0){setTimeout(()=>{if(battle&&token===battleToken)finishBattleVictory()},950);return;}
  setTimeout(()=>{
   if(!battle||token!==battleToken)return;
   const enemyId=battle.enemy.id,options=enemyMoves[enemyId],n=staminaChooseEnemyIndex(options),enemyMove=n<0?['Recover',0]:options[n];
   battleMessage(`Norm's Lv. ${battle.enemy.level} ${CREATURES[enemyId].name} used ${enemyMove[0]}!`);
   moveSound(enemyId,n);animateBattleSprite('enemy','strike');
   setTimeout(()=>{
    if(!battle||token!==battleToken)return;
    const target=team[battle.active];
    const counter=v26ResolveAttack(enemyId,target,battle.enemy.level,progressFor(target).level,enemyMove[1]);
    if(!counter.dodged){battle.hp[target]=Math.max(0,battle.hp[target]-counter.damage);hitSound();}
    renderSideBattle();if(!counter.dodged)animateBattleSprite('player','hit');
    battleMessage(counter.dodged?`${CREATURES[target].name} dodged Norm's attack!`:`${CREATURES[target].name} took ${counter.damage} damage! ${counter.note}`);
    setTimeout(()=>{
     if(!battle||token!==battleToken)return;
     if(battle.hp[target]<=0){
      const next=team.findIndex(v=>battle.hp[v]>0);
      if(next===-1){finishBattleDefeat();return;}
      battle.active=next;battleMessage(`${CREATURES[team[next]].name}, you're up!`);
     }else battleMessage(`What will ${CREATURES[team[battle.active]].name} do?`);
     battle.busy=false;renderSideBattle();
    },900);
   },540);
  },1050);
 },420);
};
const v26Refresh=refreshCreatures;
refreshCreatures=function(){
 v26Refresh();
 if(creatureMode==='battle'&&battle){
  cHelp.textContent='⚡ Lightning beats Strength · 💪 Strength beats Cosmic · 🌌 Cosmic beats Lightning. Higher-level strains may dodge!';
 }
};


// V133: Close the gym defeat/message dialog before a new challenge can be attempted.
// The A key normally moves left; only treat it as confirm while a gym dialog is open.
window.addEventListener('keydown',e=>{
 if(interior==='gym'&&dialogOpen&&!battle&&!normSceneMode&&['a','A'].includes(e.key)){
  e.preventDefault();e.stopImmediatePropagation();closeDialog();keys.clear();
 }
},true);
// V27 — White Boy Norm cinematic encounters and one-time gym victory.
const normSceneStyle=document.createElement('style');
normSceneStyle.textContent=`
#normScene{position:fixed;inset:0;z-index:99999;background:rgba(7,13,28,.96);display:none;align-items:center;justify-content:center;padding:12px;box-sizing:border-box;font-family:system-ui,Arial,sans-serif}
#normScene.active{display:flex}
#normStage{width:min(940px,98vw);height:min(670px,95dvh);min-height:420px;position:relative;overflow:hidden;border:6px solid #223a58;border-radius:15px;background:linear-gradient(170deg,#92d4ec 0%,#d1eff1 56%,#8cc6a4 57%,#579476 100%);box-shadow:0 18px 80px #000b}
#normStage:before{content:'';position:absolute;left:5%;right:5%;bottom:24%;height:19%;border:7px solid #467e76;border-radius:50%;background:#91cfb2;opacity:.85}
#normStage .normPortrait{position:absolute;left:50%;top:4%;transform:translateX(-50%);width:clamp(260px,48vw,460px);height:62%;overflow:visible;display:flex;align-items:center;justify-content:center;animation:normPop .24s ease-out}
#normStage .normPortrait img{height:100%;width:100%;max-width:100%;object-fit:contain;object-position:center center;image-rendering:pixelated;filter:drop-shadow(5px 10px 0 #223a5840)}
#normStage .normFace{display:none;position:absolute;left:50%;top:14%;transform:translateX(-50%);font-size:clamp(30px,5vw,55px);text-shadow:2px 3px #171e2d;pointer-events:none;opacity:.95}
#normStage .normBox{position:absolute;bottom:3%;left:3%;right:3%;min-height:25%;border:6px solid #344e71;border-radius:14px;background:#f6fbff;color:#20314b;padding:16px 20px 12px;box-sizing:border-box;box-shadow:0 5px 0 #19263d}
#normStage .normName{font-size:clamp(13px,2.1vw,20px);font-weight:900;color:#50627c;letter-spacing:1px;margin-bottom:9px}
#normStage .normLine{font-size:clamp(17px,3vw,29px);font-weight:900;line-height:1.28;min-height:2.3em}
#normStage .normNext{display:flex;align-items:center;justify-content:flex-end;gap:12px;margin-top:8px;font-weight:800;font-size:13px;color:#405675}
#normStage .normNext button{border:2px solid #203d5b;background:#315e9c;color:white;border-radius:8px;font-weight:900;padding:7px 19px;cursor:pointer}
#normStage.sad{background:linear-gradient(170deg,#a2bac9 0%,#d5e1e9 56%,#98baa8 57%,#6c927e 100%)}
@keyframes normPop{from{transform:translateX(-50%) scale(.87);opacity:.1}to{transform:translateX(-50%) scale(1);opacity:1}}
@media(max-height:520px){#normStage .normPortrait{height:51%}#normStage .normBox{min-height:37%}}
`;
document.head.appendChild(normSceneStyle);
const normScene=document.createElement('div');normScene.id='normScene';normScene.innerHTML=`<div id="normStage"><div class="normPortrait"><img id="normSceneImage" alt="White Boy Norm"></div><div class="normFace" id="normSceneFace"></div><div class="normBox"><div class="normName">WHITE BOY NORM</div><div class="normLine" id="normSceneLine"></div><div class="normNext"><span>Press A or Enter</span><button type="button" id="normNextButton">A ▶</button></div></div></div>`;
document.body.appendChild(normScene);
let normSceneMode='',normSceneIndex=0;
const normIntroLines=['WHO DO YOU THINK YOURE!','IM GOING TO SMOKE YOU AND YOUR STRAIN','YOU WONT MAKE IT PAST THE FIRST LEVEL'];
const normFaces=['💢','😡','🤬'];
function normDrawScene(){
 const outro=normSceneMode==='outro';
 document.getElementById('normStage').classList.toggle('sad',outro);
 document.getElementById('normSceneLine').textContent=outro?'You’ve defeated me, here take this badge to progress to the next area':normIntroLines[normSceneIndex];
 document.getElementById('normSceneFace').textContent='';
 const img=document.getElementById('normSceneImage');
 const expressionIndex=outro?0:[0,1,2][normSceneIndex]??0;
 const expression=normExpressionImages[expressionIndex]||normExpressionImages[0];
 if(expression&&expression.src&&img.src!==expression.src)img.src=expression.src;
 img.style.transform='none';
 img.style.filter='drop-shadow(5px 10px 0 #223a5840)';
}
function normBeginScene(mode){normSceneMode=mode;normSceneIndex=0;keys.clear();normScene.classList.add('active');normDrawScene()}
function normAdvanceScene(){
 if(!normSceneMode)return;
 if(normSceneMode==='intro'){
  if(normSceneIndex<normIntroLines.length-1){normSceneIndex++;normDrawScene();return}
  normSceneMode='';normScene.classList.remove('active');v27StartActualBattle();return;
 }
 normSceneMode='';normScene.classList.remove('active');
 // Move the player back outside after the badge cutscene.
 if(interior==='gym'){
  interior=null;player.x=(returnSpot?.x??gym.doorX);player.y=(returnSpot?.y??gym.doorY)+45;
  player.dir='down';document.querySelector('#hud strong').textContent='🌿 LEAF TOWN';
 }
 keys.clear();
}
document.getElementById('normNextButton').addEventListener('click',normAdvanceScene);
normScene.addEventListener('click',e=>{if(e.target===normScene)normAdvanceScene()});
addEventListener('keydown',e=>{if(normSceneMode&&(e.key===' '||e.key==='Enter'||e.key.toLowerCase()==='a')){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)normAdvanceScene()}},true);
document.getElementById('action').addEventListener('pointerdown',e=>{if(normSceneMode){e.preventDefault();e.stopImmediatePropagation();normAdvanceScene()}},true);
const v27StartActualBattle=startCreatureBattle;
startCreatureBattle=function(){
 if(player.badges){show('🏆 NORMS GYM','You already defeated White Boy Norm and earned the Common Badge.');return}
 if(normSceneMode)return;
 if(!team.length){show('NO STRAINS','Choose your starter strain first.');return}
 syncCreatureHealth();
 if(!team.some(id=>(creatureHealth[id]||0)>0)){show('🌿 HEAL YOUR STRAINS','Your team has fainted. Visit the Cure Shop before challenging Norm.');return}
 normBeginScene('intro');
};
// Winning awards the badge, shows the defeat cinematic, then exits the gym.
const v27OriginalVictory=finishBattleVictory;
finishBattleVictory=function(){
 if(!battle)return;
 v27OriginalVictory();
 // Earlier victory handling awards XP, saves strain HP and closes the battle.
 if(dialogOpen)closeDialog();
 normBeginScene('outro');
};
// Hide the old type-advantage hint above the battle field.
const v27Refresh=refreshCreatures;
refreshCreatures=function(){v27Refresh();if(creatureMode==='battle'&&battle)cHelp.textContent=''};
// Also guard the gym entrance against replays after earning the badge.
const v27EnterRoom=enterRoom;
enterRoom=function(kind){if(kind==='gym'&&player.badges){show('🏆 NORMS GYM','You have already beaten White Boy Norm. Your Common Badge unlocks the next area.');return}v27EnterRoom(kind)};


// V34: badge-locked Eastern Grove gateway and separate explorable district.
let currentDistrict='leaf';
const easternGate={x:2375,y:1249};
const returnGate={x:305,y:905};
function drawTravelGate(x,y,label,unlocked,reverse=false){
 ctx.save();ctx.translate(x,y);
 ctx.fillStyle='#332b29aa';ctx.beginPath();ctx.ellipse(0,18,90,21,0,0,Math.PI*2);ctx.fill();
 for(const side of [-1,1]){
  ctx.fillStyle='#504137';ctx.fillRect(side*78-12,-92,24,113);
  ctx.fillStyle='#a88d66';ctx.fillRect(side*78-9,-89,8,100);
  ctx.fillStyle='#d8bd82';ctx.fillRect(side*78-16,-99,32,15);
 }
 ctx.fillStyle='#544437';ctx.fillRect(-91,-102,182,17);
 ctx.fillStyle='#dec492';ctx.fillRect(-88,-99,176,6);
 ctx.fillStyle='#244b38';ctx.fillRect(-66,-90,132,32);
 ctx.strokeStyle='#dfc884';ctx.lineWidth=3;ctx.strokeRect(-66,-90,132,32);
 ctx.font='bold 16px system-ui';ctx.textAlign='center';ctx.fillStyle='#fff0b7';ctx.fillText(label,0,-68);
 ctx.fillStyle=unlocked?'#82dba0':'#e4b9a1';ctx.font='bold 12px system-ui';ctx.fillText(unlocked?'A TO TRAVEL':'COMMON BADGE REQUIRED',0,-43);
 if(!unlocked){ctx.fillStyle='#6b5846';ctx.fillRect(-61,-30,122,45);ctx.strokeStyle='#e2c69a';ctx.lineWidth=3;for(let k=-60;k<=60;k+=20){ctx.beginPath();ctx.moveTo(k,-29);ctx.lineTo(k,15);ctx.stroke()}ctx.fillStyle='#f3d27d';ctx.fillRect(-9,-13,18,20)}
 else {ctx.fillStyle='#8ee7b544';ctx.fillRect(-60,-30,120,45);ctx.strokeStyle='#a9f5ce';ctx.lineWidth=2;ctx.strokeRect(-60,-30,120,45)}
 ctx.restore();
}
const v34World=drawWorld;
drawWorld=function(){v34World();drawTravelGate(easternGate.x,easternGate.y,'EASTERN GROVE',player.badges>=1)};
// V173 Eastern Grove: stable deterministic objects, collision and a wind/cloud cycle.
const groveLakes=[
 {x:510,y:315,rx:165,ry:100},{x:1580,y:250,rx:170,ry:103},
 {x:2190,y:380,rx:120,ry:105},{x:700,y:1460,rx:160,ry:110},
 {x:1510,y:1640,rx:160,ry:90},{x:2220,y:1510,rx:130,ry:105},
 {x:365,y:1660,rx:115,ry:87}
];
const groveHouses=[
 // Each front door faces a principal woodland footpath, with space to walk past.
 {x:320,y:570,n:'GROVE HOUSE',c:'#e3c8a1'},
 {x:675,y:565,n:'FOREST LODGE',c:'#d3e2c4'},
 {x:1380,y:555,n:'RANGER HUT',c:'#dec5aa'},
 {x:1990,y:565,n:'PINE COTTAGE',c:'#e9cea7'},
 {x:360,y:1060,n:'MOSSY HOME',c:'#c5d2b6'},
 {x:680,y:1050,n:'WILLOW CABIN',c:'#dbbeaa'},
 {x:1290,y:1070,n:'FERN HOUSE',c:'#e5c5b2'},
 {x:1970,y:1060,n:'WOODSMAN HOME',c:'#d2c1a5'},
 {x:1205,y:1330,n:'OAK LODGE',c:'#d0d7b0'}
];
// Path network is deliberately broad enough for the player to navigate from the gate.
function groveOnPath(x,y,pad=0){
 return (x>225-pad&&x<2335+pad&&y>800-pad&&y<940+pad)||
        (x>1020-pad&&x<1165+pad&&y>350-pad&&y<1610+pad)||
        (x>1740-pad&&x<1885+pad&&y>770-pad&&y<1610+pad);
}
// Doorstep-to-main-route connections, matching the orientation of each house.
// Each line starts at the visible centre of a house's door.
const groveHouseRoutes=groveHouses.map(h=>{
 const x=h.x+120;
 if(h.n==='OAK LODGE')return [{x1:h.x,y1:h.y+92,x2:1090,y2:h.y+92}];
 if(h.y<800)return [{x1:x,y1:h.y+180,x2:x,y2:870}];
 // South-side houses have north-facing doors and a clear northern approach.
 return [{x1:x,y1:h.y-16,x2:x,y2:870}];
});
function groveOnHouseSpur(x,y,pad=0){
 return groveHouseRoutes.some(parts=>parts.some(p=>{
  const width=31+pad;
  const dx=p.x2-p.x1,dy=p.y2-p.y1;
  const t=Math.max(0,Math.min(1,((x-p.x1)*dx+(y-p.y1)*dy)/(dx*dx+dy*dy||1)));
  return Math.hypot(x-(p.x1+t*dx),y-(p.y1+t*dy))<width;
 }));
}
function groveInLake(x,y,pad=0){
 return groveLakes.some(l=>{const dx=(x-l.x)/(l.rx+pad),dy=(y-l.y)/(l.ry+pad);return dx*dx+dy*dy<1});
}
function groveNearHouse(x,y,pad=0){return groveHouses.some(h=>x>h.x-25-pad&&x<h.x+265+pad&&y>h.y-75-pad&&y<h.y+184+pad)}
function groveRng(seed){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}}
const groveRandom=groveRng(173083);
const groveForestTrees=[];
for(let i=0;i<1350;i++){
 const x=75+groveRandom()*(world.w-150),y=75+groveRandom()*(world.h-150),r=19+groveRandom()*20;
 if(groveOnPath(x,y,r+31)||groveOnHouseSpur(x,y,r+26)||groveInLake(x,y,r+12)||groveNearHouse(x,y,r+24)|| (x>845-r&&x<1410+r&&y>65-r&&y<680+r))continue;
 // Keep the Leaf Town return gate and arrival tile entirely free.
 if(Math.hypot(x-returnGate.x,y-returnGate.y)<240||Math.hypot(x-(returnGate.x+160),y-returnGate.y)<155)continue;
 if(groveForestTrees.some(t=>Math.hypot(t.x-x,t.y-y)<(t.r+r)*.70))continue;
 groveForestTrees.push({x,y,r,variant:Math.floor(groveRandom()*3)});
}
const groveBoulders=[];
for(let i=0;i<115;i++){
 const x=50+groveRandom()*(world.w-100),y=70+groveRandom()*(world.h-130);
 if(groveOnPath(x,y,40)||groveOnHouseSpur(x,y,35)||groveInLake(x,y,26)||groveNearHouse(x,y,30)|| (x>840&&x<1420&&y<690)||Math.hypot(x-returnGate.x,y-returnGate.y)<220)continue;
 groveBoulders.push({x,y,r:9+groveRandom()*11});
}
function groveBlocked(x,y){
 const radius=18;
 if(x<55||y<65||x>world.w-55||y>world.h-55)return true;
 if(groveInLake(x,y,radius))return true;
 if(groveNearHouse(x,y,radius))return true;
 for(const t of groveForestTrees){const dx=t.x-x,dy=t.y-y;if(dx*dx+dy*dy<(t.r*.53+radius)**2)return true}
 for(const b of groveBoulders){if(Math.hypot(b.x-x,b.y-y)<b.r+radius)return true}
 return false;
}
// Deterministic procedural cloud flock: varied heights, widths and speeds,
// with continuous wrap-around so the grove is never empty of clouds.
const groveCloudRandom=groveRng(176104);
const groveClouds=Array.from({length:15},(_,i)=>({
 baseX:groveCloudRandom()*(world.w+1500)-750,
 baseY:120+groveCloudRandom()*(world.h-260),
 wide:230+groveCloudRandom()*330,
 high:68+groveCloudRandom()*93,
 speed:12+groveCloudRandom()*19,
 phase:groveCloudRandom()*2400,
 bob:groveCloudRandom()*6.283,
 alpha:.31+groveCloudRandom()*.14
}));
function groveCloudPosition(cl,t){
 const span=world.w+cl.wide*2+300;
 return {x:((cl.baseX+cl.phase+t*cl.speed+cl.wide+150)%span+span)%span-cl.wide-150,
         y:cl.baseY+Math.sin(t*.19+cl.bob)*28};
}
function groveCloudShape(cl,x,y,col,alpha){
 ctx.save();ctx.translate(x,y);ctx.rotate(-.08);ctx.globalAlpha=alpha;
 ctx.fillStyle=col;
 for(let p=0;p<6;p++){
  const cx=(p-2.5)*cl.wide*.162;
  const cy=Math.sin(p*1.48+cl.bob)*cl.high*.10;
  ctx.beginPath();ctx.ellipse(cx,cy,cl.wide*.18,cl.high*(.40+.07*(p%3)),0,0,Math.PI*2);ctx.fill();
 }
 ctx.restore();
}
// Call this before trees, houses, the player and NPCs: shadows on the floor.
function groveDrawCloudShadows(){
 const t=performance.now()/1000;
 for(const cl of groveClouds){const p=groveCloudPosition(cl,t);
  groveCloudShape(cl,p.x+85,p.y+105,'#142d3b',.16);
 }
}
// Call as the final draw operation, after everything in the district.
function groveDrawSkyClouds(){
 const t=performance.now()/1000;
 for(const cl of groveClouds){const p=groveCloudPosition(cl,t);
  groveCloudShape(cl,p.x,p.y,'#f6fbf5',cl.alpha);
 }
}
function drawGroveLake(l){
 ctx.save();ctx.translate(l.x,l.y);
 ctx.fillStyle='#9cb78c';ctx.beginPath();ctx.ellipse(0,0,l.rx+25,l.ry+22,-.08,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#537e60';ctx.beginPath();ctx.ellipse(0,0,l.rx+13,l.ry+11,-.08,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#1a5362';ctx.beginPath();ctx.ellipse(0,0,l.rx,l.ry,-.08,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#25788b';ctx.beginPath();ctx.ellipse(-10,-8,l.rx*.83,l.ry*.76,-.08,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle='#a7d7c6';ctx.lineWidth=3;
 for(let i=0;i<4;i++){let rx=l.rx*(.17+i*.15);ctx.beginPath();ctx.ellipse(-l.rx*.14,-l.ry*.16,rx,l.ry*(.09+i*.115),-.08,Math.PI*.2,Math.PI*.8);ctx.stroke()}
 ctx.fillStyle='#5b925b';for(let i=0;i<9;i++){let a=i*2.4;let x=Math.cos(a)*l.rx*.76,y=Math.sin(a)*l.ry*.76;ctx.beginPath();ctx.ellipse(x,y,10,6,a,0,Math.PI*2);ctx.fill()}
 ctx.restore();
}
function drawGroveTree(t){
 const {x,y,r}=t;ctx.save();ctx.translate(x,y);
 ctx.fillStyle='#142d26bb';ctx.beginPath();ctx.ellipse(7,r*.4,r*.82,r*.38,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#685039';ctx.fillRect(-6,-8,12,33);
 const dark=['#194c34','#21573a','#174532'][t.variant];
 ctx.fillStyle=dark;ctx.beginPath();ctx.arc(0,-12,r,0,Math.PI*2);ctx.fill();
 ctx.fillStyle=['#327c4a','#378a4f','#2c7045'][t.variant];
 for(let j=0;j<5;j++){const a=j*2.4;ctx.beginPath();ctx.arc(Math.cos(a)*r*.42,-15+Math.sin(a)*r*.36,r*.61,0,Math.PI*2);ctx.fill()}
 ctx.fillStyle='#6ab46b';ctx.beginPath();ctx.ellipse(-r*.35,-r*.53,r*.39,r*.20,-.45,0,Math.PI*2);ctx.fill();ctx.restore();
}
function drawGroveHouse(h){
 ctx.save();ctx.fillStyle='#172f29aa';ctx.fillRect(h.x+12,h.y+16,244,178);
 ctx.fillStyle=h.c;ctx.fillRect(h.x,h.y,240,180);
 ctx.fillStyle='#4e6859';ctx.beginPath();ctx.moveTo(h.x-15,h.y+8);ctx.lineTo(h.x+120,h.y-65);ctx.lineTo(h.x+255,h.y+8);ctx.closePath();ctx.fill();
 ctx.fillStyle='#43685c';if(h.n==='OAK LODGE'){ctx.fillRect(h.x-7,h.y+67,33,50)}else if(h.y>800){ctx.fillRect(h.x+95,h.y-20,50,46)}else{ctx.fillRect(h.x+95,h.y+111,50,69)}ctx.fillStyle='#83c6d5';ctx.fillRect(h.x+30,h.y+54,42,38);ctx.fillRect(h.x+169,h.y+54,42,38);
 ctx.fillStyle='#2d493a';ctx.fillRect(h.x+40,h.y+22,160,26);text(h.n,h.x+120,h.y+41,14,'#fff1bc');ctx.restore();
}
let saGroveStaticGround=null;
function saGetGroveStaticGround(){
 if(saGroveStaticGround)return saGroveStaticGround;
 const canvas=document.createElement('canvas');canvas.width=world.w;canvas.height=world.h;
 const groundCtx=canvas.getContext('2d',{alpha:false});

 groundCtx.fillStyle='#2d7146';groundCtx.fillRect(0,0,world.w,world.h);
 // Patchwork of green ground cover, moss and weeds.
 for(let y=0;y<world.h;y+=42)for(let x=0;x<world.w;x+=42){
  const n=(x*17+y*31)%11;groundCtx.fillStyle=['#438d4f','#377e47','#4c9558','#327541'][n%4];groundCtx.fillRect(x,y,42,42);
 }
 // Ancient stone paths to the woodland dwellings.
 groundCtx.save();groundCtx.beginPath();groundCtx.rect(225,800,2110,140);groundCtx.rect(1020,350,145,1260);groundCtx.rect(1740,770,145,840);groundCtx.clip();
 groundCtx.fillStyle='#8e8171';groundCtx.fillRect(0,0,world.w,world.h);
 for(let y=0;y<world.h;y+=21)for(let x=0;x<world.w;x+=34){
  const off=((y/21)%2)*17;groundCtx.fillStyle=['#e3d7bd','#cfc1a8','#c3b7a1','#d8cbb3'][(x+y)%4];groundCtx.beginPath();groundCtx.roundRect(x+off+2,y+2,30,17,3);groundCtx.fill();
 }groundCtx.restore();
 // Small flowers and foliage around the undergrowth.
 for(let i=0;i<320;i++){let x=(i*239+73)%world.w,y=(i*113+41)%world.h;
  if(groveOnPath(x,y)||groveInLake(x,y,10)||groveNearHouse(x,y,12))continue;
  groundCtx.fillStyle=i%3?'#9bc86d':'#ffe28a';groundCtx.fillRect(x,y,4,5);groundCtx.fillStyle='#477b46';groundCtx.fillRect(x-4,y+3,3,5);
 }
 // Cobblestone spurs run directly from each south-facing front door to a main path.
 for(const segments of groveHouseRoutes)for(const seg of segments){
  groundCtx.save();groundCtx.strokeStyle='#776f61';groundCtx.lineWidth=58;groundCtx.lineCap='square';
  groundCtx.beginPath();groundCtx.moveTo(seg.x1,seg.y1);groundCtx.lineTo(seg.x2,seg.y2);groundCtx.stroke();
  groundCtx.strokeStyle='#ccbea5';groundCtx.lineWidth=49;groundCtx.stroke();
  groundCtx.strokeStyle='#e8ddc6';groundCtx.lineWidth=1.8;groundCtx.setLineDash([8,12]);groundCtx.stroke();
  groundCtx.restore();
 }

 saGroveStaticGround=canvas;
 return canvas;
}
function drawEasternDistrict(){
 ctx.drawImage(saGetGroveStaticGround(),0,0);
 // Moving shadows belong to the ground layer, beneath every world object.
 groveDrawCloudShadows();
 window.SAWorldEditor?.drawLayer('ground');
 window.SAWorldEditor?.drawLayer('decor');
 for(const l of groveLakes)drawGroveLake(l);
 for(const b of groveBoulders){ctx.fillStyle='#263e3c';ctx.beginPath();ctx.ellipse(b.x,b.y,b.r,b.r*.65,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#788d80';ctx.beginPath();ctx.ellipse(b.x-3,b.y-5,b.r*.67,b.r*.4,-.2,0,Math.PI*2);ctx.fill()}
 for(const t of groveForestTrees)drawGroveTree(t);
 for(const h of groveHouses)drawGroveHouse(h);
 ctx.fillStyle='#204c3b';ctx.fillRect(1220,720,360,54);text('EASTERN GROVE',1400,757,26,'#fff1c5');
 drawTravelGate(returnGate.x,returnGate.y,'LEAF TOWN',true,true);
 // Placed NPCs and foreground art appear in this actual district, not a preview.
 window.SAWorldEditor?.drawLayer('foreground');
 // Player is drawn above the terrain and its shadows.
 drawHero(player.x,player.y,player.dir,player.step);
}
const v34Render=render;
render=function(){if(currentDistrict!=='grove'){v34Render();return}
 ctx.clearRect(0,0,W,H);ctx.save();const vc=window.SAEditorViewport?.();const scale=vc?.sc??Math.max(.53,Math.min(1.08,W/950));const cameraX=vc?.x??Math.max(0,Math.min(world.w-W/scale,player.x-W/(2*scale)));const cameraY=vc?.y??Math.max(0,Math.min(world.h-H/scale,player.y-H/(2*scale)));ctx.scale(scale,scale);ctx.translate(-cameraX,-cameraY);drawEasternDistrict();ctx.restore()};
function travelToDistrict(which){currentDistrict=which;interior=null;keys.clear();if(which==='grove'){player.x=returnGate.x+160;player.y=returnGate.y;document.querySelector('#hud strong').textContent='🌲 EASTERN GROVE';show('🌲 EASTERN GROVE','You used the Common Badge to unlock the Eastern Grove! Explore this new area. Return through the gate to Leaf Town.')}
 else {player.x=easternGate.x-165;player.y=easternGate.y;document.querySelector('#hud strong').textContent='🌿 LEAF TOWN';show('🌿 LEAF TOWN','You travelled back to Leaf Town. The Eastern Grove gate remains unlocked.')} }
const v34Interact=interact;
interact=function(){if(currentDistrict==='grove'){if(dialogOpen){closeDialog();return}if(Math.hypot(player.x-returnGate.x,player.y-returnGate.y)<215){travelToDistrict('leaf');return}show('🌲 EASTERN GROVE','A new district to explore. More buildings, quests and gym challenges can be added here later.');return}
 if(!interior&&!dialogOpen&&Math.hypot(player.x-easternGate.x,player.y-easternGate.y)<230){if(player.badges>=1)travelToDistrict('grove');else show('🔒 LOCKED GATE','Defeat White Boy Norm at the Common Gym to earn the badge and unlock Eastern Grove.');return}
 v34Interact()};
const v34Move=move;
move=function(dt){if(currentDistrict!=='grove'){v34Move(dt);return}
 if(dialogOpen||shopOpen||missionOpen)return;let dx=0,dy=0;if(keys.has('left')||keys.has('ArrowLeft')||keys.has('a'))dx--;if(keys.has('right')||keys.has('ArrowRight')||keys.has('d'))dx++;if(keys.has('up')||keys.has('ArrowUp')||keys.has('w'))dy--;if(keys.has('down')||keys.has('ArrowDown')||keys.has('s'))dy++;if(!dx&&!dy)return;if(dx&&dy){if(player.dir==='left'||player.dir==='right')dy=0;else dx=0}const speed=152*dt;player.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');const nextX=Math.max(95,Math.min(world.w-95,player.x+dx*speed));const nextY=Math.max(95,Math.min(world.h-95,player.y+dy*speed));if(!groveBlocked(nextX,player.y))player.x=nextX;if(!groveBlocked(player.x,nextY))player.y=nextY;player.step+=dt;
};


// V35: three rustling wild-strain bushes in the starting district.
const wildBushImage=new Image();wildBushImage.src='assets/v204_fad57d62809eb0919cbf5bd9.png';
const wildBushes=[{x:515,y:880,ready:true},{x:1630,y:1060,ready:true},{x:2040,y:1460,ready:true}];
let wildLeafBurst=[],wildBushCooldown=0;
function wildBushParticles(x,y){for(let i=0;i<23;i++){const angle=Math.random()*Math.PI*2,speed=80+Math.random()*165;wildLeafBurst.push({x:x+(Math.random()-.5)*65,y:y-40-Math.random()*90,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-70,life:.8+Math.random()*.55,rot:Math.random()*6.28,color:['#d9e65a','#4d9d42','#93c946','#f3ba48'][i%4]})}}
const v35DrawWorld=drawWorld;
drawWorld=function(){v35DrawWorld();if(currentDistrict!=='leaf')return;
 for(const b of wildBushes){const w=70,h=90;ctx.drawImage(wildBushImage,b.x-w/2,b.y-h+25,w,h);ctx.save();ctx.fillStyle='#d3f58a';ctx.font='bold 14px system-ui';ctx.textAlign='center';ctx.fillText('🌿',b.x,b.y-h+16);ctx.restore()}
 for(const leaf of wildLeafBurst){ctx.save();ctx.translate(leaf.x,leaf.y);ctx.rotate(leaf.rot);ctx.fillStyle=leaf.color;ctx.fillRect(-6,-3,12,6);ctx.restore()}
};
function beginWildBattle(){
 if(battle||creatureMode==='battle'||normSceneMode||dialogOpen||interior||currentDistrict!=='leaf')return;
 syncCreatureHealth();
 if(!team.length)return;
 if(!team.some(id=>(creatureHealth[id]??maxHealth(id))>0)){show('🌿 YOUR TEAM HAS FAINTED','Visit the Cure Shop to heal your strains before exploring the bushes.');return}
 const ids=Object.keys(CREATURES),weights=ids.map(k=>k==='angolaroja'?.015:k==='lunarrock'?.6:k==='jealousy'?.7:k==='rs11'?.8:1),totalWeight=weights.reduce((a,b)=>a+b,0);
 let roll=Math.random()*totalWeight,id=ids[ids.length-1];for(let j=0;j<ids.length;j++){roll-=weights[j];if(roll<0){id=ids[j];break}}
 const level=2+Math.floor(Math.random()*4);
 
 battleToken++;battle={mode:'wild',active:team.findIndex(id=>(creatureHealth[id]??maxHealth(id))>0),hp:Object.fromEntries(team.map(id=>[id,Math.max(0,creatureHealth[id]??maxHealth(id))])),enemy:{id,level,maxHp:maxHealth(id,level),hp:maxHealth(id,level)},busy:false,log:`A wild Lv. ${level} ${CREATURES[id].name} appeared from the rustling leaves!`};
 openCreatures('battle');
 // Ensure the audio context is running and the battle theme starts immediately.
 if(musicOn){startMusic();if(audio&&audio.state==='suspended')audio.resume().catch(()=>{});beat=0;lastMusicBattleMode=false;musicTick();}
}
const v35Move=move;
move=function(dt){
 v35Move(dt);
 if(currentDistrict!=='leaf'||interior||dialogOpen||shopOpen||battle||normSceneMode||cUI.style.display==='flex')return;
 wildBushCooldown=Math.max(0,wildBushCooldown-dt);
 for(const b of wildBushes){const close=Math.hypot(player.x-b.x,player.y-(b.y-55))<85;
  if(!close){b.ready=true;continue}
  if(b.ready&&wildBushCooldown<=0){b.ready=false;wildBushCooldown=8;wildBushParticles(b.x,b.y);beginWildBattle();break}
 }
};
const v35Frame=frame;
frame=function(t){const dt=Math.min((t-last)/1000,.04)||0;for(const l of wildLeafBurst){l.x+=l.vx*dt;l.y+=l.vy*dt;l.vy+=360*dt;l.rot+=dt*4;l.life-=dt}wildLeafBurst=wildLeafBurst.filter(l=>l.life>0);v35Frame(t)};
const v35Refresh=refreshCreatures;
refreshCreatures=function(){v35Refresh();if(battle?.mode==='wild'&&creatureMode==='battle'){cTitle.textContent='🌿 WILD STRAIN ENCOUNTER';cHelp.textContent=`A wild Level ${battle.enemy.level} ${CREATURES[battle.enemy.id].name} appeared!`;}};
const v35Win=finishBattleVictory;
finishBattleVictory=function(){
 if(battle?.mode!=='wild'){v35Win();return}
 saveBattleHealth();const xp=awardBattleXP();battleToken++;battle=null;closeBeforeSideBattle();show('🌿 WILD STRAIN DEFEATED',`You won the wild encounter! ${xp}`);
};
const v35Lose=finishBattleDefeat;
finishBattleDefeat=function(){
 if(battle?.mode!=='wild'){v35Lose();return}
 saveBattleHealth();battleToken++;battle=null;closeBeforeSideBattle();show('💫 TEAM FAINTED','The wild strain defeated your team. Visit the Cure Shop to recover.');
};
const v35BattleAction=battleAction;
battleAction=function(action){
 if(battle?.mode!=='wild'){v35BattleAction(action);return}
 if(!battle||battle.busy)return;
 const id=team[battle.active],index=Number(action);
 if(action==='switch')return;
 if(!Number.isInteger(index)||index<0||index>3)return;
 battle.busy=true;const token=++battleToken,attack=currentMove(id,index);
 battleMessage(`${CREATURES[id].name} used ${attack[0]}!`);moveSound(id,index);renderSideBattle();animateBattleSprite('player','strike');
 setTimeout(()=>{
  if(!battle||token!==battleToken)return;
  const hit=v152ResolvePlayerAttack(id,battle.enemy.id,progressFor(id).level,battle.enemy.level,attack[1]);
  if(!hit.dodged){battle.enemy.hp=Math.max(0,battle.enemy.hp-hit.damage);hitSound()}
  renderSideBattle();if(!hit.dodged)animateBattleSprite('enemy','hit');
  battleMessage(hit.dodged?`The wild ${CREATURES[battle.enemy.id].name} dodged!`:`${attack[0]} dealt ${hit.damage} damage! ${hit.note}`);
  if(battle.enemy.hp<=0){setTimeout(()=>{if(battle&&token===battleToken)finishBattleVictory()},750);return}
  setTimeout(()=>{
   if(!battle||token!==battleToken)return;
   const enemyId=battle.enemy.id,options=enemyMoves[enemyId]||ATTACKS[enemyId]||[["Wild Strike",12]],n=staminaChooseEnemyIndex(options),move=n<0?['Recover',0]:options[n];
   battleMessage(`Wild Lv. ${battle.enemy.level} ${CREATURES[enemyId].name} used ${move[0]}!`);moveSound(enemyId,n);animateBattleSprite('enemy','strike');
   setTimeout(()=>{
    if(!battle||token!==battleToken)return;
    const target=team[battle.active],counter=v26ResolveAttack(enemyId,target,battle.enemy.level,progressFor(target).level,move[1]);
    if(!counter.dodged){battle.hp[target]=Math.max(0,battle.hp[target]-counter.damage);hitSound()}
    renderSideBattle();if(!counter.dodged)animateBattleSprite('player','hit');
    battleMessage(counter.dodged?`${CREATURES[target].name} dodged the wild attack!`:`${CREATURES[target].name} took ${counter.damage} damage! ${counter.note}`);
    setTimeout(()=>{
     if(!battle||token!==battleToken)return;
     if(battle.hp[target]<=0){const next=team.findIndex(v=>battle.hp[v]>0);if(next<0){finishBattleDefeat();return}battle.active=next;battleMessage(`${CREATURES[team[next]].name}, you're up!`)}
     else battleMessage(`What will ${CREATURES[team[battle.active]].name} do?`);
     battle.busy=false;renderSideBattle();
    },650)
   },450)
  },650)
 },380)
};


// V44: Pound currency, visible Bag Pack and battle rewards.
const v44Style=document.createElement('style');
v44Style.textContent=`#bagPackBtn{position:fixed;top:105px;right:12px;z-index:7;background:#694b30;color:#fff0c8;border:2px solid #e9c47b;border-radius:13px;padding:8px 12px;font-weight:800;cursor:pointer;box-shadow:0 3px 0 #2a2019}#walletBadge{display:inline-flex;align-items:center;margin-left:11px;padding:3px 9px;background:#2c5939;border:1px solid #d9b96b;color:#fff1b9;border-radius:9px;font-weight:900;font-size:15px;vertical-align:middle}#hud{min-width:170px}#hud #stats{margin-top:4px}#bagPackOverlay{position:fixed;inset:0;z-index:12000;background:#071914d9;display:none;align-items:center;justify-content:center;padding:16px;font-family:system-ui,sans-serif}#bagPackOverlay.open{display:flex}#bagPackWindow{width:min(94vw,430px);background:#244534;color:#fff3cc;border:4px solid #d3ad65;border-radius:18px;padding:20px;box-shadow:0 18px 50px #0009}#bagPackWindow h2{margin:0 0 10px}#bagPackWindow .bagItem{background:#335942;padding:12px;border-radius:10px;margin:8px 0;display:flex;justify-content:space-between}#bagPackWindow button{padding:10px 18px;background:#6a5335;color:white;border:2px solid #e5c784;border-radius:10px;cursor:pointer;width:100%;margin-top:12px}`;
document.head.appendChild(v44Style);
const walletBadge=document.createElement('div');walletBadge.id='walletBadge';document.querySelector('#hud strong').insertAdjacentElement('afterend',walletBadge);
const bagPackBtn=document.createElement('button');bagPackBtn.id='bagPackBtn';bagPackBtn.textContent='🎒 Bag Pack';bagPackBtn.title='Open your Bag Pack';document.body.appendChild(bagPackBtn);
const bagPackOverlay=document.createElement('div');bagPackOverlay.id='bagPackOverlay';bagPackOverlay.innerHTML='<div id="bagPackWindow"><h2>🎒 BAG PACK</h2><div id="bagPackMoney"></div><div id="bagPackContents"></div><button id="bagPackClose">← BACK TO GAME</button></div>';document.body.appendChild(bagPackOverlay);
function v44RefreshWallet(){walletBadge.textContent='💷 £'+coins;const el=document.getElementById('coins');if(el)el.textContent='Money: £'+coins;}
function v44RefreshBag(){
 document.getElementById('bagPackMoney').textContent='💷 Money: £'+coins;
 const el=document.getElementById('bagPackContents');
 const purchased=Object.keys(shopItems).filter(id=>(inventory[id]||0)>0);
 el.innerHTML=purchased.length?purchased.map(id=>'<div class="bagItem"><span>'+shopItems[id].name+'</span><strong>× '+inventory[id]+'</strong></div>').join(''):'<p style="opacity:.8">Your bag is empty. Buy supplies at the Cure Shop.</p>';
}
function v44CloseBag(){bagPackOverlay.classList.remove('open');keys.clear()}
bagPackBtn.addEventListener('click',()=>{if(battle||shopOpen||dialogOpen||document.getElementById('creatureUI').style.display==='flex')return;v44RefreshBag();bagPackOverlay.classList.add('open');keys.clear()});
document.getElementById('bagPackClose').addEventListener('click',v44CloseBag);
bagPackOverlay.addEventListener('click',e=>{if(e.target===bagPackOverlay)v44CloseBag()});
addEventListener('keydown',e=>{if(e.key==='Escape'&&bagPackOverlay.classList.contains('open'))v44CloseBag()});
const v44Move=move;move=function(dt){if(bagPackOverlay.classList.contains('open'))return;return v44Move(dt)};
const v44Interact=interact;interact=function(){if(bagPackOverlay.classList.contains('open')){v44CloseBag();return}return v44Interact()};
for(const b of document.querySelectorAll('[data-buy]'))b.addEventListener('click',()=>{v44RefreshWallet();v44RefreshBag()});
const v44OpenShop=openShop;openShop=function(){v44OpenShop();v44RefreshWallet()};
// Same-level victory £10, plus £5 for each level above yours, capped at £50.
// Lower-level victories earn £5; no payout for defeat.
const v44FinishVictory=finishBattleVictory;
finishBattleVictory=function(){
  if(!battle)return;
  const enemyLevel=Number(battle.enemy?.level)||10;
  const fightingId=team[battle.active]||team[0];
  const ownLevel=fightingId?progressFor(fightingId).level:1;
  const gap=enemyLevel-ownLevel;
  const reward=gap<0?5:Math.min(50,10+gap*5);
  coins+=reward;
  v44RefreshWallet();
  const wasWild=battle.mode==='wild';
  v44FinishVictory();
  // Add the payout to the victory dialogue without interrupting Norm's cutscene.
  if(wasWild&&dialogOpen){const d=document.getElementById('dialog');if(d){const note=document.createElement('div');note.style.color='#f6d785';note.textContent='💷 Battle reward: +£'+reward+' (Balance: £'+coins+')';d.appendChild(note)}}
};
v44RefreshWallet();

// V46: purchasable Baggy and wild strain capture.
const baggyArt='assets/v204_200dfd5eee23c726a8131343.png';
shopItems.baggy={name:'Baggy',price:30};
inventory.baggy=inventory.baggy||0;
const baggyRow=document.createElement('div');
baggyRow.className='item';
baggyRow.innerHTML=`<div style="display:flex;align-items:center;gap:10px"><img src="${baggyArt}" alt="Baggy" style="width:47px;height:50px;object-fit:contain;border-radius:5px"><div><b>Baggy</b><small>£30 · Used to capture strains</small></div></div><button data-buy="baggy">BUY</button>`;
document.getElementById('shopMsg').before(baggyRow);
baggyRow.querySelector('button').addEventListener('click',()=>{
 const msg=document.getElementById('shopMsg');
 if(coins<30){msg.textContent='Not enough money! A Baggy costs £30.';return}
 coins-=30;inventory.baggy++;msg.textContent='Purchased Baggy! Used to capture strains. In Bag Pack: '+inventory.baggy;
 v44RefreshWallet();v44RefreshBag();
});
// Show the supplied sprite in the inventory, with a description when clicked.
const v46RefreshBag=v44RefreshBag;
v44RefreshBag=function(){v46RefreshBag();const el=document.getElementById('bagPackContents');const row=[...el.querySelectorAll('.bagItem')].find(x=>x.textContent.includes('Baggy'));if(row){row.style.cursor='pointer';row.title='Used to capture strains';row.insertAdjacentHTML('afterbegin',`<img src="${baggyArt}" alt="Baggy" style="width:36px;height:39px;object-fit:contain;margin-right:9px;border-radius:4px">`);row.addEventListener('click',()=>{let d=document.getElementById('baggyDescription');if(!d){d=document.createElement('p');d.id='baggyDescription';el.appendChild(d)}d.textContent='Baggy — used to capture strains. Quantity: '+inventory.baggy;});}};
// Capturing is only possible against wild strains, not gym leaders.
const v46RenderBattle=renderSideBattle;
renderSideBattle=function(){v46RenderBattle();if(!battle||battle.mode!=='wild')return;
 const area=cContent.querySelector('.battle-moves');if(!area)return;
 const btn=document.createElement('button');btn.type='button';btn.id='captureWildButton';btn.disabled=!!battle.busy||inventory.baggy<1;
 btn.innerHTML=`🎒 CAPTURE <small>Baggy × ${inventory.baggy}</small>`;btn.style.background='#d2edb7';btn.style.color='#263b22';
 area.appendChild(btn);
};
function attemptWildCapture(){
 if(!battle||battle.mode!=='wild'||battle.busy)return;
 if(inventory.baggy<1){battleMessage('You need to buy a Baggy from the Cure Shop!');return}
 inventory.baggy--;v44RefreshBag();
 const enemy=battle.enemy;
 const hpRatio=Math.max(0,Math.min(1,enemy.hp/(enemy.maxHp||maxHealth(enemy.id,enemy.level))));
 const ownLevel=progressFor(team[battle.active]).level;
 const levelGap=Math.max(0,enemy.level-ownLevel);
 // Near-fainted, lower-level strains are easier. Healthy, higher-level ones are harder.
 const baseChance=Math.max(.04,Math.min(.88,.88-.65*hpRatio-.045*levelGap));
 const chance=enemy.id==='angolaroja'?baseChance*.25:enemy.id==='lunarrock'?baseChance*.6:enemy.id==='jealousy'?baseChance*.7:enemy.id==='rs11'?baseChance*.8:baseChance;
 battle.busy=true;const token=++battleToken;
 battleMessage(`You threw a Baggy at wild ${CREATURES[enemy.id].name}!`);renderSideBattle();
 setTimeout(()=>{
  if(!battle||token!==battleToken)return;
  if(Math.random()<chance){
   const id=enemy.id,name=CREATURES[id].name;
   // Each strain species occupies one collection slot; team remains limited to three.
   const newStrain=!collection.includes(id);
   v78RecordStrain(id);
   if(newStrain){collection.push(id);creatureHealth[id]=maxHealth(id,enemy.level);creatureProgress[id]={level:enemy.level,xp:0,bonuses:[0,0,0,0]};}
   if(newStrain&&team.length<3)team.push(id);
   battleToken++;battle=null;closeBeforeSideBattle();
   if(newStrain&&team.length>=3&&!team.includes(id)){
     chooseCaptureReplacement(id,enemy.level);
   }else{
     show('🎉 STRAIN CAPTURED!',newStrain?`${name} was caught at Level ${enemy.level} and added to your strain collection!`:`You caught ${name}, but this species is already in your collection.`);
   }
  }else{
   battleMessage(`The Baggy broke! ${CREATURES[enemy.id].name} escaped. The wild strain attacks!`);
   setTimeout(()=>{
    if(!battle||token!==battleToken)return;
    const target=team[battle.active];
    const options=enemyMoves[enemy.id]||ATTACKS[enemy.id]||[['Wild Strike',12]];
    const index=staminaChooseEnemyIndex(options),move=index<0?['Recover',0]:options[index];
    battleMessage(`Wild ${CREATURES[enemy.id].name} used ${move[0]}!`);
    moveSound(enemy.id,index);animateBattleSprite('enemy','strike');
    setTimeout(()=>{
     if(!battle||token!==battleToken)return;
     const result=v26ResolveAttack(enemy.id,target,enemy.level,progressFor(target).level,move[1]);
     if(!result.dodged){battle.hp[target]=Math.max(0,battle.hp[target]-result.damage);hitSound()}
     saveBattleHealth();
     if(battle.hp[target]<=0){const next=team.findIndex(id=>battle.hp[id]>0);if(next<0){finishBattleDefeat();return}battle.active=next;}
     battle.busy=false;renderSideBattle();
     battleMessage(result.dodged?'Your strain dodged the counterattack!':`The wild strain hit for ${result.damage} damage!`);
    },450);
   },600);
  }
 },900);
}
cContent.addEventListener('click',e=>{if(e.target.closest('#captureWildButton'))attemptWildCapture()});

// V47 — strain collection count, terminology, and in-battle strain selection.
const v47OriginalTeamButton=updateTeamButton;
updateTeamButton=function(){
 const el=document.getElementById('teamBtn');
 if(el)el.textContent=`🌿 Strains (${collection.length} owned · ${team.length}/3 team)`;
};
const v47OriginalRenderBattle=renderSideBattle;
let v47SwitchOpen=false;
renderSideBattle=function(){
 v47OriginalRenderBattle();
 if(!battle)return;
 const moves=cContent.querySelector('.battle-moves');
 if(!moves)return;
 const switchButton=document.createElement('button');
 switchButton.type='button';switchButton.id='v47SwitchButton';
 switchButton.disabled=!!battle.busy;
 switchButton.innerHTML='🔄 SWITCH <small>Choose a healthy strain</small>';
 moves.appendChild(switchButton);
 if(v47SwitchOpen){
  const panel=document.createElement('div');panel.id='v47SwitchPanel';
  panel.style.cssText='grid-column:1/-1;background:#e9f1e2;border:3px solid #647967;border-radius:10px;padding:10px;color:#203a30;max-height:190px;overflow:auto';
  const activeId=team[battle.active];
  const available=team.filter(id=>id!==activeId && (battle.hp[id]??creatureHealth[id]??maxHealth(id,progressFor(id).level))>0);
  panel.innerHTML='<b>CHOOSE A STRAIN</b><div style="display:flex;flex-wrap:wrap;gap:7px;margin-top:8px">'+(available.length?available.map(id=>`<button type="button" data-v47-switch="${id}" style="flex:1 1 125px"><img src="${CREATURE_IMAGES[id]}" style="height:43px;max-width:55px;object-fit:contain;vertical-align:middle"> ${CREATURES[id].name}<small>Lv. ${progressFor(id).level} · HP ${battle.hp[id]??creatureHealth[id]??maxHealth(id,progressFor(id).level)}</small></button>`).join(''):'<span>No other healthy strains available.</span>')+'</div>';
  moves.appendChild(panel);
 }
};
const v47OriginalRefresh=refreshCreatures;
refreshCreatures=function(){
 v47OriginalRefresh();
 if(creatureMode==='collection'){
  cTitle.textContent='🌿 Your Strains';
  cHelp.textContent=`Owned: ${collection.length} · Battle team ${team.length}/3. Select a strain to view its stats or manage your team.`;
 }
 if(creatureMode==='starter')cTitle.textContent='🌱 Choose your first strain';
};
// Capture success must update the HUD even if the team was previously full.
const v47CaptureRender=renderSideBattle;
renderSideBattle=function(){updateTeamButton();v47CaptureRender()};
cContent.addEventListener('click',function(e){
 const toggle=e.target.closest('#v47SwitchButton');
 if(toggle){e.preventDefault();e.stopImmediatePropagation();if(!battle||battle.busy)return;v47SwitchOpen=!v47SwitchOpen;renderSideBattle();return;}
 const choice=e.target.closest('[data-v47-switch]');
 if(!choice)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(!battle||battle.busy)return;
 const id=choice.dataset.v47Switch;
 if(!team.includes(id)||id===team[battle.active])return;
 const v238PreviousActive=team[battle.active];
 const hp=battle.hp[id]??creatureHealth[id]??maxHealth(id,progressFor(id).level);
 if(hp<=0){battleMessage('That strain has fainted. Heal it at the Cure Shop.');return;}
 if(!team.includes(id)){
  if(team.length<3){team.push(id);battle.active=team.length-1;}
  else {team[battle.active]=id;}
 }else battle.active=team.indexOf(id);
 battle.hp[id]=hp;
 v47SwitchOpen=false;
 updateTeamButton();renderSideBattle();
 if(typeof v238AfterSwitch==='function')v238AfterSwitch(id,v238PreviousActive);
 else battleMessage(`Go, ${CREATURES[id].name}! Choose your attack.`);
},true);
const v47OldBattleAction=battleAction;
battleAction=function(action){v47SwitchOpen=false;return v47OldBattleAction(action)};
// Refresh the owned count after successful capture (which completes asynchronously).
const v47OldShow=show;
show=function(...args){updateTeamButton();return v47OldShow(...args)};
updateTeamButton();


// V48: Require an active-team replacement when a new strain is caught with 3 slots filled.
function chooseCaptureReplacement(caughtId,caughtLevel){
 updateTeamButton();
 const overlay=document.createElement('div');overlay.id='v48CaptureChoice';
 overlay.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(9,20,18,.87);display:flex;align-items:center;justify-content:center;padding:18px;box-sizing:border-box';
 const panel=document.createElement('div');
 panel.style.cssText='background:#f1f4df;color:#233b30;border:5px solid #385c44;border-radius:16px;padding:20px;max-width:560px;width:100%;max-height:90vh;overflow:auto;text-align:center;box-shadow:0 15px 50px #0008';
 const cards=team.map((id,i)=>`<button type="button" data-v48-replace="${i}" style="background:#fff;border:3px solid #739078;border-radius:12px;padding:10px;cursor:pointer;flex:1 1 130px;color:#243b30;font-weight:bold"><img src="${CREATURE_IMAGES[id]}" style="display:block;object-fit:contain;height:80px;max-width:100%;margin:auto">${CREATURES[id].name}<small style="display:block">Lv. ${progressFor(id).level} · HP ${creatureHealth[id]??maxHealth(id,progressFor(id).level)}</small><small style="display:block;color:#b43c32">REPLACE</small></button>`).join('');
 panel.innerHTML=`<h2 style="margin:0 0 8px">🎉 ${CREATURES[caughtId].name} CAPTURED!</h2><p>Your team is full (3/3). Choose one strain to remove from your active team and replace with <b>${CREATURES[caughtId].name} (Lv. ${caughtLevel})</b>.</p><div style="display:flex;flex-wrap:wrap;gap:9px;margin:16px 0">${cards}</div><small>The removed strain stays in your collection. You can use it again later.</small><div style="margin-top:18px"><button type="button" data-v49-discard style="padding:12px 28px;border:3px solid #a13d3d;border-radius:12px;background:#ffe5df;color:#8d2222;font-weight:900;font-size:16px;cursor:pointer">✖ DISCARD NEW STRAIN</button><p style="font-size:12px;margin:8px 0 0">Keep your current team. The newly caught strain will be released, but the Baggy is still used.</p></div>`;
 overlay.appendChild(panel);document.body.appendChild(overlay);
 panel.addEventListener('click',e=>{
  if(e.target.closest('[data-v49-discard]')){
    const caughtIndex=collection.indexOf(caughtId);
    if(caughtIndex!==-1)collection.splice(caughtIndex,1);
    delete creatureHealth[caughtId];delete creatureProgress[caughtId];
    updateTeamButton();overlay.remove();
    show('🌿 STRAIN RELEASED',`${CREATURES[caughtId].name} was discarded. Your current three strains are unchanged. The Baggy was used.`);
    return;
  }
  const btn=e.target.closest('[data-v48-replace]');if(!btn)return;
   const index=Number(btn.dataset.v48Replace);if(!Number.isInteger(index)||index<0||index>=team.length)return;
   const removed=team[index];team[index]=caughtId;v50StoreReplaced(removed);
   updateTeamButton();overlay.remove();
   show('🌿 TEAM UPDATED',`${CREATURES[caughtId].name} joined your active team! ${CREATURES[removed].name} is safe in your strain collection.`);
 });
}


// V50 — PapaHerb HQ strain storage. Only active/carried strains belong to collection.
const v50StoredStrains=[];
function v50StoreReplaced(id){
  const i=collection.indexOf(id);
  if(i!==-1)collection.splice(i,1);
  if(!v50StoredStrains.includes(id))v50StoredStrains.push(id);
  selectedCreature=null;
  updateTeamButton();
}
function v50StorageOpen(){
  if(document.getElementById('v50Storage'))return;
  keys.clear();
  const overlay=document.createElement('div');overlay.id='v50Storage';
  overlay.style.cssText='position:fixed;inset:0;z-index:99998;background:rgba(8,23,18,.88);display:flex;align-items:center;justify-content:center;padding:14px;box-sizing:border-box';
  const panel=document.createElement('div');
  panel.style.cssText='background:#f2f1d9;color:#23402f;border:5px solid #537c55;border-radius:17px;padding:20px;width:min(740px,96vw);max-height:90vh;overflow:auto;box-shadow:0 20px 65px #0009';
  overlay.appendChild(panel);document.body.appendChild(overlay);
  function renderStorage(){
    const card=(id,action,caption)=>`<div style="display:flex;align-items:center;gap:9px;background:#fff;border:2px solid #92a58d;border-radius:10px;padding:8px;margin:7px 0"><img src="${CREATURE_IMAGES[id]}" style="width:66px;height:65px;object-fit:contain"><div style="flex:1"><b>${CREATURES[id].name}</b><div style="font-size:12px">Lv. ${progressFor(id).level} · HP ${creatureHealth[id]??maxHealth(id,progressFor(id).level)}</div></div><button type="button" data-v50-action="${action}" data-v50-id="${id}" style="background:#385d46;color:white;border:0;border-radius:8px;padding:11px;cursor:pointer">${caption}</button></div>`;
    panel.innerHTML=`<h2 style="margin:0 0 8px">📦 PAPAHERB HQ — STRAIN STORAGE</h2><p style="margin:0 0 14px">Deposit strains to free up your three team slots. Stored strains are unavailable in battles or your Strains menu until you collect them here.</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px"><section><h3>🌿 Your team (${team.length}/3)</h3>${team.length?team.map(id=>card(id,'deposit','STORE')).join(''):'<p>No strains in your team.</p>'}</section><section><h3>📦 Stored strains (${v50StoredStrains.length})</h3>${v50StoredStrains.length?v50StoredStrains.map(id=>card(id,'withdraw',team.length<3?'WITHDRAW':'TEAM FULL')).join(''):'<p>Storage is empty.</p>'}</section></div><p id="v50StorageMsg" style="min-height:20px;font-weight:700"></p><button id="v50StorageClose" type="button" style="width:100%;padding:12px;border:0;border-radius:9px;background:#7d433b;color:white;font-weight:900;cursor:pointer">CLOSE STORAGE</button>`;
    panel.querySelector('#v50StorageClose').onclick=()=>{overlay.remove();keys.clear();};
  }
  panel.addEventListener('click',e=>{
    const btn=e.target.closest('[data-v50-action]');if(!btn)return;
    const id=btn.dataset.v50Id,action=btn.dataset.v50Action;
    if(action==='deposit'){
      const i=team.indexOf(id);if(i<0)return;
      team.splice(i,1);v50StoreReplaced(id);
    }else if(action==='withdraw'){
      if(team.length>=3){panel.querySelector('#v50StorageMsg').textContent='Your team is full. Store a strain first.';return;}
      const i=v50StoredStrains.indexOf(id);if(i<0)return;
      v50StoredStrains.splice(i,1);
      if(!collection.includes(id))collection.push(id);
      if(!team.includes(id))team.push(id);
    }
    selectedCreature=null;updateTeamButton();renderStorage();
  });
  renderStorage();
}
// Only the HQ storage counter can open the storage inventory.
const v50PreviousInteract=interact;
interact=function(){
  if(interior==='hq'&&!shopOpen&&!dialogOpen&&player.x>=565&&player.x<=775&&player.y>=245&&player.y<=405){v50StorageOpen();return;}
  return v50PreviousInteract();
};
// Make the storage desk visibly interactive while inside HQ.
const hqStorageChestImage=new Image();hqStorageChestImage.src='assets/v204_88e83d99a8f59d0057767300.png';
const v50PreviousDrawInterior=drawInterior;
drawInterior=function(){
  v50PreviousDrawInterior();
  if(interior==='hq'){
    const nearby=player.x>=565&&player.x<=775&&player.y>=245&&player.y<=405;
    ctx.save();ctx.strokeStyle=nearby?'#70ff8d':'#a8eab5';ctx.lineWidth=nearby?4:2;
    ctx.shadowColor='#5cff89';ctx.shadowBlur=nearby?22:6;
    ctx.strokeRect(600,203,126,103);ctx.restore();
    text('A: STORAGE',663,323,14,'#edffbc');
  }
};
// Stored strains are not available to switch to in battle; only the active team is accessible.
const v50RenderSideBattle=renderSideBattle;
renderSideBattle=function(){
  v50RenderSideBattle();
  const panel=document.getElementById('v47SwitchPanel');
  if(panel){
    for(const button of [...panel.querySelectorAll('[data-v47-switch]')]){
      if(!team.includes(button.dataset.v47Switch))button.remove();
    }
  }
};


// V57 — Eastern Grove Spoonie Gym, darker vegetation and enterable interior.
const spoonieGymArt=new Image();spoonieGymArt.src='assets/v204_333f6603784a9db4b5358505.png';
const spoonieGym={x:900,y:135,w:480,h:390,doorX:1140,doorY:520};
const groveTrees=Array.from({length:90},(_,i)=>({x:90+(i*347+47)%(world.w-180),y:90+(i*239+89)%(world.h-180),r:24+(i%5)*8})).filter(t=>!groveOnPath(t.x,t.y,t.r+40)&&!groveOnHouseSpur(t.x,t.y,t.r+35)&&!groveNearHouse(t.x,t.y,t.r+35)&&!groveInLake(t.x,t.y,t.r+16)&&!(t.x>835&&t.x<1440&&t.y<650)&&Math.hypot(t.x-returnGate.x,t.y-returnGate.y)>230);
const oldEasternDraw=drawEasternDistrict;
drawEasternDistrict=function(){
 oldEasternDraw();
 // Additional shrubs and trees, kept clear of paths and the gym entrance.
 for(const t of groveTrees){ctx.fillStyle='#183e2b88';ctx.beginPath();ctx.ellipse(t.x+9,t.y+12,t.r,12,0,0,7);ctx.fill();ctx.fillStyle='#204a30';ctx.fillRect(t.x-5,t.y-8,10,29);for(let j=0;j<3;j++){ctx.fillStyle=['#286b3c','#327e43','#439650'][j];ctx.beginPath();ctx.arc(t.x+(j-1)*t.r*.35,t.y-t.r*.3-(j%2)*9,t.r*.62,0,7);ctx.fill()}}
 for(let i=0;i<70;i++){let x=90+(i*193)% (world.w-180),y=90+(i*277)%(world.h-180);if(groveOnPath(x,y,45)||groveOnHouseSpur(x,y,35)||groveNearHouse(x,y,40)||groveInLake(x,y,30)||(x>840&&x<1430&&y<670))continue;ctx.fillStyle='#1b5b30';ctx.beginPath();ctx.arc(x,y,14+i%9,0,7);ctx.fill();ctx.fillStyle='#3f9a4c';ctx.beginPath();ctx.arc(x-5,y-6,7,0,7);ctx.fill()}
 // Gym at the north end of the vertical path, in front of the player.
 const g=spoonieGym;
 if(spoonieGymArt.complete&&spoonieGymArt.naturalWidth){ctx.drawImage(spoonieGymArt,g.x,g.y,g.w,g.h)}else{ctx.fillStyle='#39274c';ctx.fillRect(g.x,g.y,g.w,g.h);text('SPOONIE GYM',g.x+g.w/2,g.y+170,33,'#e4baff')}
 ctx.fillStyle='#f4e8bb';ctx.beginPath();ctx.ellipse(g.doorX,g.doorY+5,65,13,0,0,7);ctx.fill();
 // Player must be drawn above the scenery, rather than behind the gym sprite.
 drawHero(player.x,player.y,player.dir,player.step);
 if(Math.hypot(player.x-g.doorX,player.y-g.doorY)<105){text('PRESS A: ENTER SPOONIE GYM',g.doorX,g.doorY+82,17,'#fff7cc')}
 // Sky layer is LAST: visible clouds float above houses, foliage, player and gym.
 groveDrawSkyClouds();
};
const v57PreviousRender=render;
render=function(){if(currentDistrict==='grove'&&interior==='spoonie'){v34Render();return}v57PreviousRender()};
const v57PreviousInteract=interact;
interact=function(){
 if(currentDistrict==='grove'&&interior==='spoonie'){
  if(dialogOpen){closeDialog();return}
  if(player.y>555&&player.x>335&&player.x<565){leaveRoom();currentDistrict='grove';document.querySelector('#hud strong').textContent='🌲 EASTERN GROVE';return}
  show('💜 SPOONIE GYM','Welcome to Spoonie Gym! The gym arena is open for exploration. The Gym Leader challenge will be added later.');return;
 }
 if(currentDistrict==='grove'&&!interior&&!dialogOpen&&Math.hypot(player.x-spoonieGym.doorX,player.y-spoonieGym.doorY)<125){enterRoom('spoonie');document.querySelector('#hud strong').textContent='💜 SPOONIE GYM';return}
 v57PreviousInteract();
};
const v57PreviousMove=move;
move=function(dt){if(currentDistrict==='grove'&&interior==='spoonie'){v34Move(dt);return}v57PreviousMove(dt)};
const v57PreviousInterior=drawInterior;
drawInterior=function(){if(interior!=='spoonie'){v57PreviousInterior();return}
 const rw=900,rh=680;ctx.fillStyle='#17162b';ctx.fillRect(0,0,rw,rh);
 for(let y=110;y<590;y+=54)for(let x=72;x<850;x+=54){ctx.fillStyle=(Math.floor(x/54)+Math.floor(y/54))%2?'#35314f':'#40395a';ctx.fillRect(x,y,52,52);ctx.strokeStyle='#5a5275';ctx.strokeRect(x,y,52,52)}
 ctx.fillStyle='#28213b';ctx.fillRect(65,115,770,75);ctx.fillStyle='#30234d';ctx.fillRect(65,115,22,460);ctx.fillRect(813,115,22,460);
 ctx.fillStyle='#7834a2';ctx.fillRect(100,208,700,12);ctx.fillRect(100,440,700,12);
 text('💜 SPOONIE GYM',450,170,36,'#f3e6ff');
 ctx.fillStyle='#252136';ctx.fillRect(330,258,240,120);ctx.strokeStyle='#b368f2';ctx.lineWidth=5;ctx.strokeRect(330,258,240,120);text('GYM ARENA',450,325,24,'#eac8ff');
 for(const x of [160,740]){ctx.fillStyle='#1d4e35';ctx.fillRect(x-22,280,44,55);ctx.fillStyle='#62b948';ctx.beginPath();ctx.arc(x,263,38,0,7);ctx.fill()}
 drawHero(player.x,player.y,player.dir,player.step);
 ctx.fillStyle='#244b46';ctx.fillRect(370,585,160,70);text('EXIT ↓',450,625,25,'#fff4ce');
};
// V58 — Spoonie appears as the second gym leader; her strain/battle remains pending.
const spoonieLeaderSprite=new Image();spoonieLeaderSprite.src='assets/v204_2b377bc2ab527d6a7fd73c2c.png';
const v58PreviousSpoonieInterior=drawInterior;
drawInterior=function(){
 v58PreviousSpoonieInterior();
 if(interior!=='spoonie')return;
 ctx.save();ctx.imageSmoothingEnabled=false;
 const spoonieNPC=window.SAActorRoutes?.point('spoonie',450,450)||{x:450,y:450};
 if(spoonieLeaderSprite.complete&&spoonieLeaderSprite.naturalWidth){
   ctx.drawImage(spoonieLeaderSprite,spoonieNPC.x-21,spoonieNPC.y-88,42,88);
 }else{ctx.fillStyle='#db4b85';ctx.fillRect(spoonieNPC.x-27,spoonieNPC.y-135,52,120)}
 text('SPOONIE',spoonieNPC.x,spoonieNPC.y-190,20,'#fff1fd');
 if(Math.hypot(player.x-spoonieNPC.x,player.y-(spoonieNPC.y-12))<155){text('PRESS A: TALK TO SPOONIE',spoonieNPC.x,spoonieNPC.y+28,16,'#f5ddff')}
 ctx.restore();
};
const v58PreviousInteract=interact;
interact=function(){
 const p=window.SAActorRoutes?.point('spoonie',450,450)||{x:450,y:450};
 if(interior==='spoonie'&&!dialogOpen&&Math.hypot(player.x-p.x,player.y-(p.y-12))<155){
  show('💜 SPOONIE — SECOND GYM LEADER','Hey! I’m Spoonie, the second Gym Leader. Come back when my strain is ready and we’ll battle!');
  return;
 }
 v58PreviousInteract();
};
const v57PreviousLeave=leaveRoom;
leaveRoom=function(){const wasSpoonie=interior==='spoonie';v57PreviousLeave();if(wasSpoonie){currentDistrict='grove';player.x=spoonieGym.doorX;player.y=spoonieGym.doorY+95;document.querySelector('#hud strong').textContent='🌲 EASTERN GROVE'}};


// V76 — Flower House delivery quest, inventory and mission reward.
let flowerBouquetCollected=false;
let flowerDeliveryDone=false;
const questBouquet={x:990,y:1430}; // Hidden farther across Leaf Town, away from the Flower House.
function collectQuestBouquet(){
 if(!flowerConversationDone){show('💐 FLOWERS','These look lovely, but speak to the Flower House lady first.');return;}
 if(flowerBouquetCollected||flowerDeliveryDone)return;
 flowerBouquetCollected=true;inventory.funeralFlowers=1;
 keys.clear();show('💐 BOUQUET FOUND','You found a bundle of flowers! Added to your inventory. Take them back to the Flower House lady.');
 missionList();
}
function deliverQuestBouquet(){
 if(flowerDeliveryDone){show('🌷 FLOWER HOUSE LADY','Thank you again for helping my family.');return;}
 if(!flowerBouquetCollected){show('🌷 FLOWER HOUSE LADY','Have you found any flowers yet? I really need them for Gran’s funeral.');return;}
 flowerBouquetCollected=false;flowerDeliveryDone=true;inventory.funeralFlowers=0;
 coins+=30;v44RefreshWallet();v44RefreshBag(); // Update the visible wallet and bag immediately after quest payout.
 const earned=[];
 for(const id of collection){
  const p=progressFor(id);let gained=15;const oldLevel=p.level;p.xp+=gained;
  while(p.level<100&&p.xp>=xpNeeded(p.level)){
   p.xp-=xpNeeded(p.level);p.level++;p.bonuses=p.bonuses.map(v=>v+2);
  }
  earned.push(CREATURES[id].name+' +15 XP'+(p.level>oldLevel?' (LEVEL UP!)':''));
 }
 missionList();keys.clear();
 show('🌷 FLOWERS DELIVERED','Thank you so much! You earned £30! '+(earned.length?'Your strains gained XP: '+earned.join(', ')+'.':'Your strains will earn XP when you have collected one.')+' Find Her Flowers is now FINISHED.');
}
const previousFlowerQuestDraw=drawWorld;
drawWorld=function(){
 previousFlowerQuestDraw();
 if(flowerDeliveryDone||flowerBouquetCollected)return;
 const {x,y}=questBouquet;
 ctx.save();ctx.translate(x,y);
 ctx.fillStyle='#143c2b66';ctx.beginPath();ctx.ellipse(0,11,28,10,0,0,Math.PI*2);ctx.fill();
 // Bright, recognisable bouquet in the grass.
 ctx.strokeStyle='#24663e';ctx.lineWidth=4;
 for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(0,9);ctx.lineTo(i*9,-19-(i%2)*5);ctx.stroke()}
 const blooms=[[-20,-20,'#ff7fa9'],[-8,-31,'#fff1a4'],[8,-30,'#d9a0ff'],[21,-18,'#ffb1cb'],[0,-17,'#ffdf71']];
 for(const [bx,by,c] of blooms){ctx.fillStyle=c;for(let k=0;k<5;k++){let a=k*Math.PI*2/5;ctx.beginPath();ctx.arc(bx+Math.cos(a)*5,by+Math.sin(a)*5,5,0,Math.PI*2);ctx.fill()}ctx.fillStyle='#ffe76e';ctx.beginPath();ctx.arc(bx,by,3,0,Math.PI*2);ctx.fill()}
 ctx.fillStyle='#f8dfb2';ctx.beginPath();ctx.moveTo(-16,-5);ctx.lineTo(16,-5);ctx.lineTo(8,18);ctx.lineTo(-8,18);ctx.closePath();ctx.fill();
 ctx.strokeStyle='#b7834b';ctx.lineWidth=2;ctx.stroke();
 if(Math.hypot(player.x-x,player.y-y)<110){text('A: PICK UP FLOWERS',0,-51,15,'#fff5d5')}
 ctx.restore();
};
const previousFlowerQuestInteract=interact;
interact=function(){
 if(!interior&&!dialogOpen&&!shopOpen&&!missionOpen&&!flowerBouquetCollected&&!flowerDeliveryDone&&Math.hypot(player.x-questBouquet.x,player.y-questBouquet.y)<90){collectQuestBouquet();return;}
 if(interior==='flower'&&!dialogOpen&&flowerConversationDone&&Math.hypot(player.x-450,player.y-315)<145){deliverQuestBouquet();return;}
 previousFlowerQuestInteract();
};
// Click/tap the flowers in the world as well as using A.
canvas.addEventListener('pointerdown',function(e){
 if(interior||dialogOpen||shopOpen||missionOpen||flowerBouquetCollected||flowerDeliveryDone)return;
 const rect=canvas.getBoundingClientRect();
 const px=(e.clientX-rect.left)*W/rect.width,py=(e.clientY-rect.top)*H/rect.height;
 const scale=Math.max(.53,Math.min(1.08,W/950));
 const cameraX=Math.max(0,Math.min(world.w-W/scale,player.x-W/(2*scale)));
 const cameraY=Math.max(0,Math.min(world.h-H/scale,player.y-H/(2*scale)));
 const wx=px/scale+cameraX,wy=py/scale+cameraY;
 if(Math.hypot(wx-questBouquet.x,wy-(questBouquet.y-12))<45&&Math.hypot(player.x-questBouquet.x,player.y-questBouquet.y)<115){e.preventDefault();collectQuestBouquet()}
});
// V97: Bag Pack is the only inventory menu. The redundant flower-only INVENTORY
// popup has been removed; I now opens the main Bag Pack too.
addEventListener('keydown',e=>{
 if(e.key.toLowerCase()!=='i'||e.repeat||!running)return;
 e.preventDefault();
 if(bagPackOverlay.classList.contains('open')){v44CloseBag();return;}
 if(battle||shopOpen||dialogOpen||missionOpen||cabinRiddleVisible||cabinCutsceneStep>=0||cUI.style.display==='flex')return;
 v44RefreshBag();bagPackOverlay.classList.add('open');keys.clear();
});

// V78 — unique strain species catalogue (includes strains transferred to HQ storage).
const v78CaughtSpecies=new Set();
function v78RecordStrain(id){
 if(!Object.prototype.hasOwnProperty.call(CREATURES,id))return;
 v78CaughtSpecies.add(id);
 v78UpdateCount();
}
function v78UpdateCount(){
 for(const id of collection)v78CaughtSpecies.add(id);
 for(const id of v50StoredStrains)v78CaughtSpecies.add(id);
 const b=document.getElementById('v78StrainDexButton');
 if(b)b.textContent=`🌿 Strains ${v78CaughtSpecies.size}/120`;
}
const v78TeamButton=updateTeamButton;
updateTeamButton=function(){
 v78TeamButton();
 const b=document.getElementById('teamBtn');
 if(b)b.textContent=`⚔️ Team ${team.length}/3`;
 v78UpdateCount();
};
const v78Starter=chooseStarter;
chooseStarter=function(id){v78Starter(id);v78RecordStrain(id);};
const v78Style=document.createElement('style');
v78Style.textContent=`#v78StrainDexButton{position:fixed;top:156px;right:12px;z-index:91;padding:9px 12px;border-radius:12px;border:2px solid #b1d99d;background:#27583a;color:#fff8df;font-weight:900;cursor:pointer;box-shadow:0 3px 0 #10271b}#v78StrainDex{position:fixed;inset:0;z-index:14000;background:rgba(5,18,14,.93);display:none;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;font-family:system-ui,sans-serif}#v78StrainDex.open{display:flex}#v78StrainDexPanel{width:min(820px,97vw);max-height:94vh;overflow:auto;background:#193b2d;color:#fff5d9;border:4px solid #d9b56a;border-radius:18px;padding:18px;box-shadow:0 20px 70px #000a}#v78StrainDexGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:11px;margin:16px 0}#v78StrainDexGrid .entry{background:#2b5540;border:2px solid #77966d;border-radius:12px;text-align:center;padding:10px}#v78StrainDexGrid img{display:block;width:96px;height:100px;object-fit:contain;image-rendering:pixelated;margin:0 auto 6px}#v78StrainDexGrid b{display:block;font-size:14px}#v78StrainDexGrid small{display:block;color:#cce2ce;margin-top:3px}#v78StrainDexGrid .unknown{opacity:1;background:#20382f}#v78StrainDexGrid .entry.unknown.rarity-rare{border:3px solid #39aaff;box-shadow:0 0 0 1px #123c74,0 0 10px #267fe466}#v78StrainDexGrid .entry.unknown.rarity-ultra-rare{border:3px solid #b36aff;box-shadow:0 0 0 1px #51228a,0 0 10px #a85cff66}#v78StrainDexGrid .entry.unknown.rarity-epic{border:3px solid #67de73;box-shadow:0 0 0 1px #255c32,0 0 10px #50ca6166}#v78StrainDexGrid .entry.rarity-legendary{border:3px solid #ffd45c;box-shadow:0 0 0 1px #866323,0 0 12px #e6b53488}#v78StrainDexGrid .unknown .question{height:100px;display:flex;align-items:center;justify-content:center;font-size:52px;color:#acc0b0}#v78StrainDexClose{padding:10px 20px;border:2px solid #e4c57f;background:#735735;color:white;border-radius:9px;font-weight:900;cursor:pointer}`;
document.head.appendChild(v78Style);
const v78Button=document.createElement('button');v78Button.id='v78StrainDexButton';v78Button.type='button';document.body.appendChild(v78Button);
const v78Overlay=document.createElement('div');v78Overlay.id='v78StrainDex';
v78Overlay.innerHTML='<div id="v78StrainDexPanel"><h2 style="margin:0">🌿 STRAIN COLLECTION</h2><p id="v78StrainDexSummary" style="margin:6px 0;color:#d6e4c7"></p><div id="v78StrainDexGrid"></div><p style="color:#d4e0ce;font-size:13px">Only unique strain species count. Stored strains and previously captured species still count towards your discoveries.</p><button id="v78StrainDexClose">BACK TO GAME</button></div>';
document.body.appendChild(v78Overlay);
function v78OpenDex(){
 v78UpdateCount();keys.clear();
 document.getElementById('v78StrainDexSummary').textContent=`${v78CaughtSpecies.size} of 120 strains discovered · ${Object.keys(CREATURES).length} currently available in the game`;
 document.getElementById('v78StrainDexGrid').innerHTML=Object.entries(CREATURES).map(([id,c])=>{
 const found=v78CaughtSpecies.has(id);
 // Rarity is visible as a border for undiscovered species, but their identity stays hidden.
 // Any future Rare, Ultra Rare, Epic or Legendary strain automatically gets its colour.
 const tier=String(c.rarity||'Common').toLowerCase().replace(/[^a-z]+/g,'-').replace(/^-|-$/g,'');
 const tierClass=['rare','ultra-rare','epic','legendary'].includes(tier)?' rarity-'+tier:'';
 return `<div class="entry ${found?'':'unknown'}${tierClass}">${found?`<img src="${CREATURE_IMAGES[id]}" alt="${c.name}">`:'<div class="question">?</div>'}<b>${found?c.name:'??? — Undiscovered'}</b><small>${found?c.type:'Not yet caught'}</small></div>`;
 }).join('');
 v78Overlay.classList.add('open');
}
v78Button.addEventListener('click',v78OpenDex);
document.getElementById('v78StrainDexClose').addEventListener('click',()=>{v78Overlay.classList.remove('open');keys.clear()});
v78Overlay.addEventListener('click',e=>{if(e.target===v78Overlay){v78Overlay.classList.remove('open');keys.clear()}});
v78UpdateCount();


// V80: Lunar Rock's independent battle sprite frames. Every cell is individually cropped.
const LUNAR_FRAMES={"idle":["assets/v204_3536e783ce37b4ec922deb5c.png","assets/v204_f254d3d7cc37e69fbacfa4cd.png","assets/v204_2bcd94f3eba48c1c06ed5abf.png","assets/v204_23c9ce990f71a1915a1f42ec.png"],"walk":["assets/v204_61360e8579fdcdf6e902043e.png","assets/v204_14ccf26f1fe58d7a558cacf3.png","assets/v204_452047ac56633b3ad7b9188f.png","assets/v204_401cbb4052d84ea6f6f3d8de.png","assets/v204_c38a25795fd1e354eb1980cc.png","assets/v204_38f4960fd8138684dde69714.png"],"rock":["assets/v204_a1bb0b60a39115eb650bf75e.png","assets/v204_74fd5909545500cacbbeacef.png","assets/v204_23d8df5210f711e4ff9d42a1.png","assets/v204_8901e6e255a6a931f4e21621.png","assets/v204_53ae0512514cb6b4a3735d5f.png","assets/v204_d795296fd81c12e9e7634c59.png"],"slam":["assets/v204_6a414ce5bc37e8afc25a28ae.png","assets/v204_bfee5c1245402690e9485ec9.png","assets/v204_5a9cc5ede6a49b1b7e04217a.png","assets/v204_b669da412f933bbea4d45784.png","assets/v204_43e52b0f1556c6e760fef1d3.png","assets/v204_705ef11bf59d3d2bf43d72c7.png","assets/v204_4bf59205a50bdc039c199a11.png"],"gravity":["assets/v204_43259cf08b5824c4b8568a32.png","assets/v204_5551561e5bf49bb026565b2d.png","assets/v204_448f2765e62b9be6f932b7cb.png","assets/v204_a83844ad41ea175f99b9cc57.png","assets/v204_547f9d946b23149236b00ffd.png","assets/v204_03bf43575d774c61e23dce32.png","assets/v204_ad3842efcce946033226ad35.png","assets/v204_9d14452c8acb3b528b54c6db.png"],"hurt":["assets/v204_83b39d025b516ba9da27a964.png","assets/v204_7b1efdaba6058c3ef2563dd2.png","assets/v204_1e544ca4913eb6ef50e5078a.png","assets/v204_63a6f2788e05435e9e33b4fd.png"],"faint":["assets/v204_264ff8a5184021948cfcc90d.png","assets/v204_46910cb7b53b45cc0857dfa6.png","assets/v204_1bf1961500b6d333e9dc31d3.png","assets/v204_a1f4c236f471e038a5c474b9.png","assets/v204_a73c03e472373c73ff7bbc98.png"]};
let lunarAnimTimers={player:null,enemy:null};
function lunarAnimate(side,sequence){ /* Combat animation disabled. */ }
const lunarOldRender=renderSideBattle;
renderSideBattle=function(){
 lunarOldRender();if(!battle)return;
 for(const [side,id] of [['player',team[battle.active]],['enemy',battle.enemy.id]]){
  if(id!=='lunarrock')continue;
  const el=document.getElementById(side==='player'?'battlePlayerSprite':'battleEnemySprite');
  if(el){el.dataset.lunar='yes';el.src=CREATURE_IMAGES.lunarrock;el.style.objectFit='contain';el.style.imageRendering='pixelated';}
 }
};
const lunarOldAction=battleAction;
battleAction=function(action){
 const side=battle&&team[battle.active]==='lunarrock'?'player':null;
 const idx=Number(action),play=side&&Number.isInteger(idx)&&idx>=0&&idx<4&&!battle.busy;
 const result=lunarOldAction(action);
 if(play){lunarAnimate('player',idx===0?'rock':idx===1||idx===3?'slam':'gravity');}
 return result;
};
const lunarOldMessage=battleMessage;
battleMessage=function(message){
 const result=lunarOldMessage(message);
 if(battle&&battle.enemy.id==='lunarrock'&&/used /.test(message)&&/Lunar Rock/.test(message))
  lunarAnimate('enemy',/Rock Throw/.test(message)?'rock':/Lunar Gravity/.test(message)?'gravity':'slam');
 return result;
};

// V82: Northern Lights move-specific sprite animations, front/back independently cropped.
const NORTHERN_MOVE_FRAMES={"spark_enemy":["assets/v204_b42d951ba611406c12e025d6.png","assets/v204_77fe619362b24a2e137ffc8f.png","assets/v204_ec69c747358c48c0029ce51b.png","assets/v204_85a030c6d7e48f88ba593b92.png","assets/v204_5c8bc36c776477a457a80175.png","assets/v204_f1a495442779558ed4013cbe.png","assets/v204_7290c336051b06caa8926cf7.png","assets/v204_e4fb796994660c63ee74ede0.png","assets/v204_1811ab9d24acb0db54cf8e01.png","assets/v204_c4a9887a65792b786b8320f5.png","assets/v204_45cbd6e1e728841195ecf7e4.png"],"spark_player":["assets/v204_e8203e13c7983c6be5c8653c.png","assets/v204_ffaaa8c81bef277624ea229e.png","assets/v204_68458cfcef4306795518e0b5.png","assets/v204_8029fbb12077d4fb1b66ecb6.png","assets/v204_085c93c7d2373589d51515c1.png","assets/v204_7147cadfe7d224869d9b104d.png","assets/v204_baa6b3576af05151ae5e06ab.png","assets/v204_5dcd83cea4de621dcee90694.png","assets/v204_4d45c8748a83963f7e061d5a.png","assets/v204_2173d8223a46286f4aeac4db.png","assets/v204_39cd06ce1c9477083649b9d3.png"],"volt_enemy":["assets/v204_5af7a687e491dc0d87000d02.png","assets/v204_338c1f6d531b062e6e3bc80d.png","assets/v204_2095a36f36036f69f37984c8.png","assets/v204_9b815ea262ab360f1f0aa4e1.png","assets/v204_38c97277a0f2d1a1f42cf6da.png","assets/v204_db15906b5014abe0516842a7.png","assets/v204_ab52288ab027a3e47e9c4604.png","assets/v204_a2972e404d12c0079acb8ef7.png","assets/v204_3ea1d0031db4a75ae9057ac8.png","assets/v204_d75e66e9508589a1de081b62.png","assets/v204_bd79c119c2247ef1642c4c97.png","assets/v204_5f0d4adb944fc006ac107a30.png"],"volt_player":["assets/v204_133e00b59278db8c7f8b0fd7.png","assets/v204_c2fbcbf58cc77a12a600b460.png","assets/v204_96bbf8c6f00ce432e3abeda7.png","assets/v204_e8c394aacdc9c433b6ccc5e5.png","assets/v204_0991b2d879ebee8960d71ea9.png","assets/v204_666b9999caab1dd7f52a76ac.png","assets/v204_680486d403481aec23370df4.png","assets/v204_1a6bff94e3d5152e639d058b.png","assets/v204_a15f2674996d466ccb6736b2.png","assets/v204_c93e4887dbaeec3aa37a660b.png","assets/v204_62970bfdf84a0000f44bb3db.png","assets/v204_6ae69aaa87f21a44139bce3f.png"],"thunder_enemy":["assets/v204_04bb24d0aaffad8ee068022a.png","assets/v204_a023e59da451823a28c38e21.png","assets/v204_bcf0a2698db1e66c163834f4.png","assets/v204_4dd0db1ac1cb3e1736a8351f.png","assets/v204_8ce33dd69e2ec53ab9f57387.png","assets/v204_5b529db9ca63f3e0cd7dd2c3.png","assets/v204_bd03546db4fc801ca0eb0067.png","assets/v204_0000c5ab77c913130c18bb27.png","assets/v204_61bd1da49204ff21a0bd2c31.png","assets/v204_ea497ecce65af24690888d81.png","assets/v204_62e0c20991600d00bbc1fd84.png"],"thunder_player":["assets/v204_2d05548e4bdf5cada653b3b5.png","assets/v204_d3da3fbde0cb47f7c4f75283.png","assets/v204_37c258d40c90877c0a602b59.png","assets/v204_b5f5c4c8cd5be9515ad6cd65.png","assets/v204_83508461d8cf6856812dcb08.png","assets/v204_948426d43e2f2326f3437a04.png","assets/v204_13014f13eb2deba99162f28e.png","assets/v204_dba8d12629e5dbb8287aa004.png","assets/v204_580d7481e2bce9f37e2576f3.png","assets/v204_79b42d8afb6f52c08ff9b97f.png","assets/v204_fe80705698efd12f42a7cafb.png"],"aurora_enemy":["assets/v204_9c69682ad70c8ba421960a63.png","assets/v204_f7934605aed89c6c0711c4ee.png","assets/v204_0cac3336629ed8a9884ecfcd.png","assets/v204_1a020ac82e0ef987c30a04d9.png","assets/v204_bbaa37e840f226f96c05844d.png","assets/v204_9cae3ebf588e9bbabe0b571a.png","assets/v204_a0b7d246c31579f01ada7ac1.png","assets/v204_c7ed77d1c264aeae0ac0e441.png","assets/v204_003e8b5c74fd2277cfa27e00.png","assets/v204_c0901bd54b3e7499f9f95af1.png","assets/v204_d66a858458d4dfa1414222e3.png"],"aurora_player":["assets/v204_239d04e1f20daa059a33db57.png","assets/v204_365e1b476362e8d3ad8ac5e1.png","assets/v204_b600bf8516ad3fa4906b989f.png","assets/v204_8850d10d094989a05ec7636a.png","assets/v204_902af5e1c70e1f866ef155a0.png","assets/v204_ba92913547502631800ead17.png","assets/v204_5f271b8bd6d0e7a15d4d366f.png","assets/v204_74cf3fe10f3fd8ac6ba43644.png","assets/v204_9831a976a23f226d216c316e.png","assets/v204_76ccca724db72f3aaddb5a49.png","assets/v204_e95244e0f724855c94d7d29e.png"]};
const northernAnimationTimers={player:null,enemy:null};
function northernAnimate(side,move){ /* Combat animation disabled. */ }
const northernPreviousAction=battleAction;
battleAction=function(action){
  const active=battle&&team[battle.active]==='northern'&&!battle.busy;
  const idx=Number(action);
  const doAnim=active&&Number.isInteger(idx)&&idx>=0&&idx<4;
  const result=northernPreviousAction(action);
  if(doAnim)northernAnimate('player',['spark','volt','thunder','aurora'][idx]);
  return result;
};
const northernPreviousMessage=battleMessage;
battleMessage=function(message){
 const result=northernPreviousMessage(message);
 if(battle&&battle.enemy.id==='northern'&&/Northern Lights used /.test(message)){
  const move=/Aurora Storm/.test(message)?'aurora':/Thunder Flash/.test(message)?'thunder':/Volt Bolt/.test(message)?'volt':'spark';
  northernAnimate('enemy',move);
 }
 return result;
};

// Star Dawg: isolated frames from the supplied front/back animation sheet.
const STAR_DAWG_MOVE_FRAMES={"meteor_player":["assets/v204_254b9f8e4eec338086dbe795.png","assets/v204_73ea218b6910a6889695c789.png","assets/v204_0c9909f78537f02c01e07b41.png","assets/v204_8ab531454f81fbe3dac0d9a6.png","assets/v204_d1dd2795bb5a61ca8d73bf99.png","assets/v204_d557414cede93e0b4ccad15c.png","assets/v204_5da0e7699cf6739e17fd3db1.png","assets/v204_d6c1721ceb8c1c1576165626.png","assets/v204_e33014da148e38afadc5f961.png","assets/v204_b3909b0fc04e043ed1da140a.png","assets/v204_519c27b60b5043f037894666.png","assets/v204_ced1b7d7d556d4c71a6a1a7e.png","assets/v204_962a85ed286c8f2a289e0039.png","assets/v204_2de5c53dfc829ec1df822f2e.png","assets/v204_672fef923a2b43b71bc6b45a.png","assets/v204_29a3a054031358ae36820b6c.png","assets/v204_b9139898af6cdc899f36fa04.png","assets/v204_808c7896ad28b60945d66bd4.png","assets/v204_2ecd1fc51ebd88932f054f18.png"],"orbit_player":["assets/v204_a1d0af7005851384af6e73a6.png","assets/v204_17fa49ed381453b1c91b9cc9.png","assets/v204_2339a34bbc0f256f29b22534.png","assets/v204_3e26f7d204c74296e61653f6.png","assets/v204_bc02a813304bc82aa1c2b1f9.png","assets/v204_2933fd0eb6d320eedf366552.png","assets/v204_c0d94de4dfbd2303fdaedb8c.png","assets/v204_b1eda7c3a05eafbaeda9dfe3.png","assets/v204_ed957e4b98da49a76730d540.png","assets/v204_1767440237b22da171226cb0.png","assets/v204_8c1c2238497835bcfc46d80c.png","assets/v204_2776f255f52fac347099f670.png","assets/v204_66e3c75e19b019877e9a1c4f.png","assets/v204_c03024d39ca8155f94f079c6.png","assets/v204_9b9df6297086712ff10f0788.png","assets/v204_30c5b293c977a108db153a36.png","assets/v204_f405eead0243f2270771e9d0.png"],"cosmic_player":["assets/v204_a5c5e5353e72642e2d9c6348.png","assets/v204_8d9a0b0f6c660695d53b68b2.png","assets/v204_8d9a0b0f6c660695d53b68b2.png","assets/v204_b0a25a0bb555ae76b4bbb16e.png","assets/v204_3ef43ba9b127bd6758817512.png","assets/v204_e98291ce0a65b6ca494fefff.png","assets/v204_1684660a4505c29015234502.png","assets/v204_364af53ca4a9397d27e5c73d.png","assets/v204_ab84dece765a81e92830076f.png","assets/v204_1e442bfa8cc1d57f5a96963d.png","assets/v204_7b914b3d4c61bb1e2c9afc28.png","assets/v204_323eff830fd19139b4d57f45.png","assets/v204_c4db35498d986d3eed0ac855.png","assets/v204_a5de8358eb74131f1f0c4007.png","assets/v204_9e3fcfdf805408d615ec9265.png","assets/v204_29d954bb3b2afc69eea059b3.png","assets/v204_88657cdc910bd135291c1378.png","assets/v204_fa65729aa0edc98ea5532bd3.png"],"supernova_player":["assets/v204_6c4d3126f7c84852953628ea.png","assets/v204_09dde9243000b4c229353e08.png","assets/v204_bbd2707ff2c74ae8e2a33336.png","assets/v204_c6454036542271bd6bc870c1.png","assets/v204_6e181a8cddedd48baad0dd4d.png","assets/v204_9151f299f9a3eea5769fbebe.png","assets/v204_d03d38238b88fc2f88ca1dfb.png","assets/v204_036bdd1aa47207d0a693ba51.png","assets/v204_4fcd9787265a4de1db24a76a.png","assets/v204_0ceb7496383fc49cbd8e5ee6.png","assets/v204_3935ddfe1a5d9f153f99f171.png","assets/v204_786a66a0bc44ac15e6110016.png","assets/v204_35ccc89eeb17d3b125b1eabd.png","assets/v204_5adc4f86c858483ef4e5dd8c.png","assets/v204_5adc4f86c858483ef4e5dd8c.png","assets/v204_d2fb600a079ee319a9609157.png","assets/v204_353eb856cf81c91210df9262.png","assets/v204_ddb9109807fbbaf0d4eba1a3.png","assets/v204_475eb1144d3607705bab509a.png"],"meteor_enemy":["assets/v204_42ae1b2920fff121f7a395fe.png","assets/v204_2f15207781e2de34837b4b70.png","assets/v204_dbe1817ffc4d46226b472f44.png","assets/v204_1fdb9c2b1deeb8e8a8c92dd2.png","assets/v204_3a71fe72a16190293f766b0d.png","assets/v204_a008ec8795aacf5c37ff4f50.png","assets/v204_cadb4817d37bfa6266318668.png","assets/v204_0930f75c26d5f22da481ec94.png","assets/v204_7e14a0e499f771c1e3fd614f.png","assets/v204_7f7a4ebbbbe769ae1a16d6f5.png","assets/v204_0b3f718abf8af1db7df447b2.png","assets/v204_fed28a35b433b8518de11a08.png","assets/v204_9ed1ccd9edb47a64bbaeed87.png","assets/v204_68d226543ce60eae2a75a90a.png","assets/v204_ce3e53acba9be6a01de62e51.png","assets/v204_76fb708981b5fe8bedf143eb.png","assets/v204_ac61365be3aaf17d00474168.png","assets/v204_92584f6d5c6e4a766947404a.png","assets/v204_fe82e7c4e7fbec562ce4c024.png"],"orbit_enemy":["assets/v204_5bc6b27a1f0c855509f1542a.png","assets/v204_c126bc4d6d3e5339214efc4c.png","assets/v204_09213184ac7630fafec14579.png","assets/v204_e60a9d297e338e5b846747bc.png","assets/v204_a8a3fc6181975c1b91cc18fc.png","assets/v204_d4706019c269fc0873f89f3f.png","assets/v204_74595ffd43c1e83cb182ddb6.png","assets/v204_8fb3cc8214c0f4fe0e9a62af.png","assets/v204_87fdce17d8411c7af3a04642.png","assets/v204_36ad77836b94ef9f55c1a5c8.png","assets/v204_a33427f656163329c7a69194.png","assets/v204_18644fad86fc23d4d9ebc60b.png","assets/v204_e4a09043a819183775330f9c.png","assets/v204_02ada89bdd562b90e1c5e072.png","assets/v204_c089d1c37cd827a2a4792f91.png","assets/v204_9c094a71d4d37ad23e0f5f67.png","assets/v204_5c7a9f77b592035e24350851.png"],"cosmic_enemy":["assets/v204_55b1883f7b8990e6e36ac616.png","assets/v204_46e2a2660c5a536e440f339c.png","assets/v204_46e2a2660c5a536e440f339c.png","assets/v204_129634540f6ee70dc4c34c9b.png","assets/v204_892f90dc55b0972b4c1efd06.png","assets/v204_ae33c364b2d1a5b098f6bb8f.png","assets/v204_a5c266da97053c618a8dad4f.png","assets/v204_bb30120d6e5774623f74976e.png","assets/v204_c7fe57c97f1c937cbb13343b.png","assets/v204_ff5c4e61373727500cb917b9.png","assets/v204_6e4eb6bf0ccf7e8a8e2c1d08.png","assets/v204_4af5241405a21afe18388aa7.png","assets/v204_a6c24ddc612f7eb106078f32.png","assets/v204_562ca6ff53f8dabb798da683.png","assets/v204_a565394dfb4a1a3989f76f8a.png","assets/v204_e53152a9d2f9fd35fd55f783.png","assets/v204_ded4130745b84313c129a020.png","assets/v204_4b50abf7f49e9fd503add55f.png"],"supernova_enemy":["assets/v204_d1af765661bb1a04d97080f8.png","assets/v204_8a64d5dc63742a97e89ce6a7.png","assets/v204_112d3e47db2c232b0bad9542.png","assets/v204_6b3873c358c71ee483e7bfde.png","assets/v204_07d444073d3b7c1abe20a324.png","assets/v204_35590a92bdec4c06e8554fcf.png","assets/v204_36af841d5cc5e05e0f223f2d.png","assets/v204_2871015def07c431b47578c0.png","assets/v204_ed56ce3917b4be24710383c8.png","assets/v204_52464f7f48e9242ee9c97bd2.png","assets/v204_430b806909ecf0ba02b62e5c.png","assets/v204_19b81a52393dc1cc328fda18.png","assets/v204_fa226255a587640df5dc72e5.png","assets/v204_a5edaf20d6b8338185c5313b.png","assets/v204_a5edaf20d6b8338185c5313b.png","assets/v204_0c2e88b9dde1213d7d4b8a89.png","assets/v204_2265c5c278d823d688585082.png","assets/v204_7834f01b47409a17d7ddec08.png","assets/v204_febc8ac2af4b02ce953fb823.png"]};
// V84: Dedicated overlays keep every frame visible even when the battle UI rerenders.
const starDawgTimers={player:null,enemy:null};
let starDawgBusy=false;
function starDawgAnimate(side,move,onComplete){ /* Combat animation disabled. */ if(onComplete)onComplete(); }
const starDawgPreviousAction=battleAction;
battleAction=function(action){
 const index=Number(action);
 if(battle&&team[battle.active]==='star'&&!battle.busy&&!starDawgBusy&&Number.isInteger(index)&&index>=0&&index<4){
  starDawgBusy=true;
  starDawgAnimate('player',['meteor','orbit','cosmic','supernova'][index],()=>{
   starDawgBusy=false;
   if(battle)starDawgPreviousAction(action);
  });
  return;
 }
 if(starDawgBusy)return;
 return starDawgPreviousAction(action);
};
const starDawgPreviousMessage=battleMessage;
battleMessage=function(message){
 const result=starDawgPreviousMessage(message);
 if(battle&&battle.enemy.id==='star'&&/Star Dawg used /.test(message)){
  const move=/Supernova Howl/.test(message)?'supernova':/Cosmic Bark/.test(message)?'cosmic':/Orbit Rush/.test(message)?'orbit':'meteor';
  starDawgAnimate('enemy',move);
 }
 return result;
};

// V89 — Cottage pipe-repair quest. State is held for the duration of the current game.
const leafCottage=quietHouses.find(h=>h.name==='COTTAGE');
let cottageManSpoken=false, cottagePipesFixed=false, cottageCutsceneAt=-1, cottagePuzzleOpen=false;
const cottageSpeech=["My pipes have burst.","Can you fix them for me?","I'll pay you."];
const cottageTileKinds=['cap','straight','corner','cap','straight','corner'];
// Read order is top-left, top-middle, top-right, bottom-left, bottom-middle, bottom-right.
// The two pipe endpoints stay fixed. The other four are rotated by the player.
const cottageRotations=[1,1,0,1,0,1];
const cottageSolution=[1,1,2,1,1,3]; // right; left/right; left/down; right; left/right; left/up
const cottageDirs={up:0,right:1,down:2,left:3};
const cottageOpposite=[2,3,0,1];
const cottageVisual={
 outer:'#132f34',border:'#5da58a',ink:'#f5f3d7',muted:'#bad6c9'
};
function cottageGetPorts(i,rot){
 const kind=cottageTileKinds[i];
 if(kind==='cap')return [rot%4];
 if(kind==='straight')return [rot%4,(rot+2)%4];
 return [rot%4,(rot+1)%4];
}
function cottagePuzzleIsConnected(){
 // Fixed start at 0 and fixed exit at 3. Must travel through every tile once.
 const visited=new Set([0]);let at=0,from=null;
 for(let step=0;step<6;step++){
  const ports=cottageGetPorts(at,cottageRotations[at]);
  if(at===3)return visited.size===6 && ports.length===1 && ports[0]===from;
  const options=ports.filter(d=>d!==from);
  if(options.length!==1)return false;
  const dir=options[0],row=Math.floor(at/3),col=at%3;
  const nr=row+(dir===2?1:dir===0?-1:0),nc=col+(dir===1?1:dir===3?-1:0);
  if(nr<0||nr>=2||nc<0||nc>=3)return false;
  const next=nr*3+nc;
  if(visited.has(next))return false;
  if(!cottageGetPorts(next,cottageRotations[next]).includes(cottageOpposite[dir]))return false;
  visited.add(next);from=cottageOpposite[dir];at=next;
  if(at===3)return visited.size===6 && cottageGetPorts(3,cottageRotations[3]).length===1;
 }
 return false;
}
function cottageCreatePuzzle(){
 const modal=document.createElement('div'); modal.id='cottagePipesOverlay';
 modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','Fix the cottage pipes');
 modal.innerHTML=`<section id="cottagePipesCard"><header><h2>🔧 FIX THE COTTAGE PIPES</h2><p>Rotate the four middle pipe sections until water can flow from the BLUE fixed pipe to the GREEN fixed pipe.</p></header><div id="cottagePipeLabels"><span>💧 IN · TOP LEFT</span><span>OUT · BOTTOM LEFT ✅</span></div><div id="cottagePipeTiles"></div><p id="cottagePipeHint">Click a movable pipe to rotate it 90°. Both fixed ends must connect through all four pieces.</p><footer><button type="button" id="cottagePipeLater">← BACK TO COTTAGE</button><span id="cottagePipePrize">REWARD: £50 + 20 XP per strain</span></footer></section>`;
 const style=document.createElement('style');style.textContent=`
 #cottagePipesOverlay{display:none;position:fixed;inset:0;z-index:10050;background:#061c21d9;align-items:center;justify-content:center;padding:14px;box-sizing:border-box;overflow:auto}
 #cottagePipesOverlay.open{display:flex}
 #cottagePipesCard{width:min(670px,100%);box-sizing:border-box;border:5px solid #7ed0aa;border-radius:18px;background:linear-gradient(#203e42,#0f272e);box-shadow:0 10px 0 #07171d,0 30px 80px #000a;color:#fff7db;font-family:system-ui,sans-serif;padding:18px 20px 22px;text-align:center}
 #cottagePipesCard h2{font-size:clamp(19px,4.8vw,29px);margin:2px 0 7px;color:#f6e89c}
 #cottagePipesCard header p{font-size:clamp(12px,2.6vw,15px);line-height:1.4;max-width:520px;margin:0 auto 15px;color:#d1e8dc}
 #cottagePipeLabels{display:flex;justify-content:space-between;color:#92e9ff;font-size:13px;font-weight:900;margin:4px 0 8px;padding:0 5px}
 #cottagePipeTiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(2, minmax(0,1fr));gap:8px;max-width:530px;margin:auto}
 .cottagePipeTile{aspect-ratio:1.12;min-width:0;position:relative;border:3px solid #6d9b92;border-radius:12px;background:#314b52;cursor:pointer;display:grid;place-items:center;padding:0;touch-action:manipulation;transition:background .11s,border-color .11s}
 .cottagePipeTile:focus-visible{outline:4px solid #fee675;outline-offset:2px}
 .cottagePipeTile.fixed{cursor:default;border-color:#dba963;background:#4a4438}
 .cottagePipeTile:hover:not(.fixed){background:#3e646a;border-color:#f3d97d}
 .cottagePipeTile svg{height:92%;width:92%;overflow:visible}
 .cottagePipeTile .fixedLabel{position:absolute;left:4px;bottom:3px;font-size:clamp(8px,1.9vw,11px);font-weight:900;letter-spacing:.3px;color:#ffeeae;pointer-events:none}
 #cottagePipeHint{font-size:13px;color:#d7e2d9;min-height:35px;margin:12px 0 6px}
 #cottagePipesCard footer{display:flex;gap:10px;justify-content:space-between;align-items:center;flex-wrap:wrap}
 #cottagePipeLater{border:2px solid #8fa99a;border-radius:8px;background:#263b40;color:white;font-weight:900;padding:12px 14px;cursor:pointer}
 #cottagePipePrize{font-size:13px;font-weight:900;color:#f2eaa6}
 @media(max-width:530px){#cottagePipesCard{padding:13px 11px 16px}#cottagePipeTiles{gap:5px}.cottagePipeTile{border-width:2px}#cottagePipesCard footer{justify-content:center}}
 `;
 document.head.appendChild(style);document.body.appendChild(modal);
 document.getElementById('cottagePipeLater').onclick=closeCottagePuzzle;
 modal.addEventListener('pointerdown',e=>e.stopPropagation());
}
function cottagePipeSVG(ports,idx){
 const col=idx===0?'#66caff':idx===3?'#a6f0a4':'#eec578';
 const branches=ports.map(dir=>{
  const positions=[[50,5],[95,50],[50,95],[5,50]],end=positions[dir];
  return `<path d="M50 50 L${end[0]} ${end[1]}" stroke="#213940" stroke-width="30" stroke-linecap="round" fill="none"/><path d="M50 50 L${end[0]} ${end[1]}" stroke="${col}" stroke-width="20" stroke-linecap="round" fill="none"/><path d="M50 50 L${end[0]} ${end[1]}" stroke="#fff3d3" stroke-opacity=".42" stroke-width="6" fill="none" stroke-linecap="round"/>`;
 }).join('');
 return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="2" y="2" width="96" height="96" rx="13" fill="none" stroke="#7da5a2" stroke-opacity=".3" stroke-width="2"/>${branches}<circle cx="50" cy="50" r="17" fill="${col}" stroke="#253d45" stroke-width="5"/><circle cx="50" cy="50" r="8" fill="#fffae1" opacity=".45"/></svg>`;
}
function cottageRenderPipes(){
 const holder=document.getElementById('cottagePipeTiles');if(!holder)return;
 holder.innerHTML=cottageRotations.map((rot,i)=>{
 const fixed=i===0||i===3;
 return `<button class="cottagePipeTile${fixed?' fixed':''}" type="button" data-cottage-tile="${i}" ${fixed?'disabled':''} aria-label="${fixed?'Fixed pipe':'Rotate pipe '+i}">${cottagePipeSVG(cottageGetPorts(i,rot),i)}${fixed?'<span class="fixedLabel">FIXED</span>':''}</button>`;
 }).join('');
 holder.querySelectorAll('[data-cottage-tile]').forEach(button=>button.addEventListener('click',()=>{
  if(!cottagePuzzleOpen||cottagePipesFixed)return;
  const i=Number(button.dataset.cottageTile);if(i===0||i===3)return;
  cottageRotations[i]=(cottageRotations[i]+1)%4;
  cottageRenderPipes();
  if(cottagePuzzleIsConnected())cottageCompletePipes();
 }));
}
function openCottagePuzzle(){
 if(cottagePipesFixed)return;
 closeDialog();cottagePuzzleOpen=true;keys.clear();
 document.getElementById('cottagePipesOverlay').classList.add('open');cottageRenderPipes();
}
function closeCottagePuzzle(){cottagePuzzleOpen=false;document.getElementById('cottagePipesOverlay').classList.remove('open');keys.clear()}
function cottageCompletePipes(){
 if(cottagePipesFixed)return;
 cottagePipesFixed=true;
 coins+=50;
 if(typeof v44RefreshWallet==='function')v44RefreshWallet();
 if(typeof v44RefreshBag==='function')v44RefreshBag();
 const earned=[];
 for(const id of [...new Set(collection)]){
  const p=progressFor(id),previous=p.level;p.xp+=20;
  while(p.level<100 && p.xp>=xpNeeded(p.level)){
   p.xp-=xpNeeded(p.level);p.level++;
   if(Array.isArray(p.bonuses))p.bonuses=p.bonuses.map(v=>v+2);
  }
  earned.push(CREATURES[id].name+' +20 XP'+(p.level>previous?' (LEVEL UP!)':''));
 }
 if(typeof missionList==='function')missionList();
 closeCottagePuzzle();
 show('🔧 PIPES FIXED!','The water is running again! The man pays you £50. '+(earned.length?earned.join(' · '):'Your next collected strains can earn XP from future jobs.')+' The mission is now FINISHED.');
}
function cottageNextLine(){
 cottageCutsceneAt++;
 if(cottageCutsceneAt<cottageSpeech.length){
  keys.clear();show('👨 NITTY',cottageSpeech[cottageCutsceneAt]);
  const sm=document.querySelector('#dialog small');if(sm)sm.textContent='Press A / Enter to continue';return;
 }
 cottageCutsceneAt=-1;cottageManSpoken=true;
 openCottagePuzzle();
}
function cottageNearOwner(){return interior==='cottage'&&Math.hypot(player.x-470,player.y-315)<150}
function cottageStartDialogue(){
 if(cottagePipesFixed){show('👨 NITTY','Thanks again for saving my pipes! The water is running perfectly.');return}
 if(cottageManSpoken){openCottagePuzzle();return}
 cottageCutsceneAt=-1;cottageNextLine();
}
cottageCreatePuzzle();

// Nitty: animated cottage NPC, with 4 walking/idle directions extracted from the supplied sheet.
const nittySpriteSheet=new Image();
nittySpriteSheet.src='assets/v204_a6d9c4440e05a28d12d5855b.png';
const nittyFrameWidth=169,nittyFrameHeight=244;
function drawNitty(x,y){
 const row=0, frame=Math.floor(Date.now()/240)%4;
 ctx.save();ctx.imageSmoothingEnabled=false;
 if(nittySpriteSheet.complete&&nittySpriteSheet.naturalWidth){
  const h=88,w=Math.round(70*h/102);
  ctx.drawImage(nittySpriteSheet,frame*nittyFrameWidth,row*nittyFrameHeight,nittyFrameWidth,nittyFrameHeight,x-w/2,y-h+26,w,h);
 }
 ctx.restore();
}
// Draw the existing cottage as a cosy workshop with the owner near a burst pipe.
const cottageOriginalDrawInterior=drawInterior;
drawInterior=function(){
 if(interior!=='cottage'){cottageOriginalDrawInterior();return;}
 cottageOriginalDrawInterior();
 ctx.save();
 ctx.fillStyle='#d8c3a2';ctx.fillRect(64,110,772,466);
 for(let y=112;y<570;y+=48)for(let x=65;x<835;x+=48){ctx.fillStyle=((x+y)%4===0)?'#d6b995':'#ead1ac';ctx.fillRect(x,y,46,46)}
 ctx.fillStyle='#695042';ctx.fillRect(80,142,285,87);ctx.fillStyle='#bb8658';ctx.fillRect(94,160,255,49);
 text('TOOLS & SPARES',221,199,21,'#ffe2a1');
 ctx.fillStyle='#7a4b35';ctx.fillRect(570,165,209,116);ctx.fillStyle='#b7c5b2';ctx.fillRect(590,179,169,18);
 // Exposed pipe and leak near the owner.
 ctx.strokeStyle=cottagePipesFixed?'#6b9b80':'#667d88';ctx.lineWidth=22;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(595,300);ctx.lineTo(740,300);ctx.lineTo(740,375);ctx.stroke();
 if(!cottagePipesFixed){ctx.fillStyle='#5dccff';for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse(685+(i%3)*13,335+(i%2)*15,5,9,0,0,7);ctx.fill()}}
 ctx.fillStyle='#264a3e';ctx.fillRect(95,396,206,100);text('WORK BENCH',200,446,18,'#ffe1a0');
 // Nitty stands by the burst pipe, breathing gently using the four front-facing frames.
 ctx.fillStyle='#3c4238';ctx.beginPath();ctx.ellipse(470,360,27,8,0,0,Math.PI*2);ctx.fill();
 drawNitty(470,350);
 text('NITTY',470,225,19,'#fff0a3');
 if(!cottageManSpoken)text('!',470,201,32,'#ffdc61');
 if(cottagePipesFixed)text('✓',470,201,32,'#8ef0a2');
 // Restore player above the rebuilt cottage floor.
 drawHero(player.x,player.y,player.dir,player.step);
 ctx.restore();
};
const cottagePreviousEnterRoom=enterRoom;
enterRoom=function(kind){
 cottagePreviousEnterRoom(kind);
 if(kind==='cottage'){
  document.querySelector('#hud strong').textContent='🏡 LEAF TOWN COTTAGE';
  show('🏡 COTTAGE','Walk up to Nitty by the leaking pipe. He needs your help!');
 }
};
const cottagePreviousInteract=interact;
interact=function(){
 if(cottagePuzzleOpen)return;
 if(cottageCutsceneAt>=0){cottageNextLine();return}
 if(interior==='cottage'){
  if(dialogOpen){closeDialog();return}
  if(player.y>555&&player.x>335&&player.x<565){leaveRoom();return}
  if(cottageNearOwner()){cottageStartDialogue();return}
  show('🔧 COTTAGE','Talk to Nitty near the broken pipes.');return;
 }
 if(!interior&&currentDistrict==='leaf'&&!dialogOpen&&!shopOpen&&!missionOpen){
  const h=leafCottage;
  if(h&&Math.hypot(player.x-(h.x+h.w/2),player.y-(h.y+h.h+12))<135){enterRoom('cottage');return}
 }
 return cottagePreviousInteract();
};
const cottagePreviousMove=move;
move=function(dt){
 if(cottagePuzzleOpen)return;
 const wasNear=cottageNearOwner();
 cottagePreviousMove(dt);
  // Nitty dialogue only starts from the A-button interaction.
};
// Do not let keyboard movement/interaction leak underneath the pipe menu.
window.addEventListener('keydown',function(e){
 if(!cottagePuzzleOpen)return;
 if(e.key==='Escape'){closeCottagePuzzle()}
 e.preventDefault();e.stopImmediatePropagation();
},true);


// V90 — The HOUSE missing lighter mission. Separate from the COTTAGE pipe mission.
const lighterQuestHouse = quietHouses.find(h => h.name === 'HOUSE');
const lighterDialogue = ["I've lost my lighter!", "I can't remember where I left it.", "I think it might be in one of three places. Could you please check them for me?"];
let lighterConversationDone=false, lighterFound=false, lighterDelivered=false;
let lighterCutsceneAt=-1, lighterLocation='flower'; // One of the three places named in the clue.
let lighterNoticeShown=false;
const lighterOwnerX=465, lighterOwnerY=305;
const lighterSpots = {
 cure:{x:706,y:455,name:'Cure Shop'},
 flower:{x:710,y:480,name:'Flower House'},
 cottage:{x:710,y:484,name:'Cottage'}
};
function lighterQuestActive(){return lighterConversationDone&&!lighterDelivered}
function lighterNearOwner(){return interior==='lighterhouse'&&dist(lighterOwnerX,lighterOwnerY)<147}
function lighterAtClue(){
 if(!lighterQuestActive()||lighterFound) return false;
 const p=lighterSpots[interior];
 return !!p&&interior===lighterLocation&&dist(p.x,p.y)<110;
}
function lighterCollect(){
 if(!lighterAtClue())return false;
 lighterFound=true;
 inventory.missingLighter=1;
 keys.clear();
 if(typeof v44RefreshBag==='function')v44RefreshBag();
 missionList();
 show('🔥 LIGHTER FOUND!',"You found the missing lighter in the "+lighterSpots[lighterLocation].name+"! It's now in your Bag Pack. Take it back to Reth Sogan at the HOUSE.");
 return true;
}
function lighterReward(){
 if(lighterDelivered||!lighterFound)return;
 lighterDelivered=true;
 inventory.missingLighter=0;
 coins+=30;
 const xpNotes=[];
 for(const id of [...new Set(collection)]){
  const p=progressFor(id), before=p.level;
  p.xp+=15;
  while(p.level<100&&p.xp>=xpNeeded(p.level)){
   p.xp-=xpNeeded(p.level);p.level++;
   if(Array.isArray(p.bonuses))p.bonuses=p.bonuses.map(v=>v+2);
  }
  xpNotes.push(CREATURES[id].name+' +15 XP'+(p.level>before?' (LEVEL UP!)':''));
 }
 if(typeof v44RefreshWallet==='function')v44RefreshWallet();
 if(typeof v44RefreshBag==='function')v44RefreshBag();
 missionList();
 keys.clear();
 show('🔥 MISSION COMPLETE',"That's my lighter! Thank you! Here's £30 for your trouble. "+(xpNotes.length?xpNotes.join(' · '):'')+" Find the Missing Lighter is now in FINISHED.");
}
function lighterAdvanceConversation(){
 lighterCutsceneAt++;
 if(lighterCutsceneAt<lighterDialogue.length){
  keys.clear();
  show('👨 RETH SOGAN',lighterDialogue[lighterCutsceneAt]);
  const hint=document.querySelector('#dialog small');
  if(hint)hint.textContent='Press A / Enter to continue';
  return;
 }
 lighterCutsceneAt=-1;
 lighterConversationDone=true;
 lighterNoticeShown=true;
 closeDialog();
 missionList();
 show('🔎 NEW MISSION',"Search the Cure Shop, Flower House and Cottage for the missing lighter. Look for something small and shiny and press A to pick it up.");
}
function lighterTalk(){
 if(lighterDelivered){show('👨 RETH SOGAN',"Thanks again for finding my lighter!");return;}
 if(lighterFound){lighterReward();return;}
 if(!lighterConversationDone){lighterCutsceneAt=-1;lighterAdvanceConversation();return;}
 show('👨 RETH SOGAN',"No luck yet? Please search the Cure Shop, Flower House and Cottage.");
}
function lighterDrawPickup(){
 const p=lighterSpots[interior];
 if(!p||!lighterQuestActive()||lighterFound||interior!==lighterLocation)return;
 ctx.save();
 // In-world collectible rather than an automatic pickup: walk close and press A.
 ctx.fillStyle='#24393366';ctx.beginPath();ctx.ellipse(p.x,p.y+11,31,10,0,0,Math.PI*2);ctx.fill();
 ctx.save();ctx.translate(p.x,p.y);
 ctx.fillStyle='#e34f48';roundRect(-15,-19,30,39,6,'#e14e46','#4a2521');
 ctx.fillStyle='#ffd390';ctx.fillRect(-9,-12,18,6);
 ctx.fillStyle='#f7cf75';ctx.fillRect(-8,-29,16,11);
 ctx.fillStyle='#e1e7ef';ctx.fillRect(-6,-33,12,8);
 ctx.restore();
 text('🔥 LIGHTER',p.x,p.y-48,16,'#ffe899');
 if(dist(p.x,p.y)<140)text('PRESS A TO PICK UP',p.x,p.y-65,14,'#fcffb4');
 ctx.restore();
}

const rethSoganFrames={
 down:[0,1,2,3].map(i=>{const img=new Image();img.src=['assets/v204_2fe1b556cf81342cb2b1b8a8.png','assets/v204_ed948be3d448ec3af9a033aa.png','assets/v204_a1239b13961bb6cadb682e9a.png','assets/v204_659d525bec4e9d67e019b06e.png'][i];return img;}),
 left:[0,1,2,3].map(i=>{const img=new Image();img.src=['assets/v204_6816166da298cc80b58b87bf.png','assets/v204_78dcbce275665d395246f491.png','assets/v204_fa21b3deae3e7a3d78fa8200.png','assets/v204_c65573fe8534bf63b2166329.png'][i];return img;}),
 right:[0,1,2,3].map(i=>{const img=new Image();img.src=['assets/v204_07cee45e5018e6c9368968d7.png','assets/v204_025791fc38d383d717611bc8.png','assets/v204_92beb59a22c860b72311628c.png','assets/v204_64b4d69e5e3f78165485cad8.png'][i];return img;}),
 up:[0,1,2,3].map(i=>{const img=new Image();img.src=['assets/v204_f1fa5d171ce3c4d1a0131324.png','assets/v204_f47b72eaaf98d3049bcf7689.png','assets/v204_a3069c4af6048474ee4ec28f.png','assets/v204_f1e4d69d79fa99b28ff9fe20.png'][i];return img;})
};
window.rethSoganFrames=rethSoganFrames;
const lighterOldDrawInterior=drawInterior;
drawInterior=function(){
 if(interior==='lighterhouse'){
  // Draw all existing shared indoor furnishings, then a distinct little home.
  lighterOldDrawInterior();
  ctx.save();
  ctx.fillStyle='#e0cba5';ctx.fillRect(68,112,765,465);
  for(let y=112;y<575;y+=43)for(let x=70;x<835;x+=43){
   ctx.fillStyle=((Math.floor(x/43)+Math.floor(y/43))%2)?'#ddc9a4':'#eadab7';
   ctx.fillRect(x,y,42,42);
  }
  ctx.fillStyle='#845845';ctx.fillRect(100,145,222,116);
  ctx.fillStyle='#d3ad81';ctx.fillRect(110,154,202,95);
  text('LIVING ROOM',211,196,18,'#ffeab0');
  ctx.fillStyle='#6e765a';ctx.fillRect(568,171,190,105);
  ctx.fillStyle='#d6ba91';ctx.fillRect(578,181,170,85);
  text('BOOKSHELF',662,230,17,'#ffeab0');
  ctx.fillStyle='#765d4e';ctx.fillRect(105,415,175,80);
  ctx.fillStyle='#af8163';ctx.fillRect(112,419,161,66);
  text('COFFEE TABLE',193,460,16,'#ffe8b2');
  // Friendly house owner.
  ctx.fillStyle='#263f40';ctx.beginPath();ctx.ellipse(lighterOwnerX,354,28,8,0,0,7);ctx.fill();
  ctx.fillStyle='#2c4d70';ctx.fillRect(lighterOwnerX-20,320,16,33);ctx.fillRect(lighterOwnerX+4,320,16,33);
  ctx.fillStyle='#8e7856';ctx.fillRect(lighterOwnerX-29,280,58,43);
  ctx.fillStyle='#e5ae81';ctx.fillRect(lighterOwnerX-19,251,38,34);
  ctx.fillStyle='#6a4832';ctx.fillRect(lighterOwnerX-21,248,42,12);
  ctx.fillStyle='#32271f';ctx.fillRect(lighterOwnerX-11,270,4,4);ctx.fillRect(lighterOwnerX+9,270,4,4);
  text('RETH SOGAN',lighterOwnerX,228,19,'#fff3bd');
  if(!lighterConversationDone)text('!',lighterOwnerX,204,31,'#ffdb70');
  else if(lighterDelivered)text('✓',lighterOwnerX,204,31,'#9cffb8');
  else if(lighterFound)text('?',lighterOwnerX,204,31,'#ffdb70');
  ctx.fillStyle='#403526';ctx.fillRect(368,577,164,13);
  text('EXIT',450,606,18,'#fff0bd');
  drawHero(player.x,player.y,player.dir,player.step);
  ctx.restore();
 }else{
  lighterOldDrawInterior();
  lighterDrawPickup();
 }
};
const lighterOldEnterRoom=enterRoom;
enterRoom=function(kind){
 lighterOldEnterRoom(kind);
 if(kind==='lighterhouse'){
  document.querySelector('#hud strong').textContent='🏠 LEAF TOWN HOUSE';
  // No modal dialogue on entering: player can approach freely and press A.
  closeDialog();
 }
};
const lighterOldInteract=interact;
interact=function(){
 if(lighterCutsceneAt>=0){lighterAdvanceConversation();return;}
 if(interior==='lighterhouse'){
  if(dialogOpen){closeDialog();return;}
  if(player.y>555&&player.x>335&&player.x<565){leaveRoom();return;}
  if(lighterNearOwner()){lighterTalk();return;}
  show('🏠 HOUSE',"Walk over to Reth Sogan and press A, or head to the exit.");
  return;
 }
 if(!dialogOpen&&!shopOpen&&!missionOpen&&!cottagePuzzleOpen&&lighterCollect())return;
 if(!interior&&currentDistrict==='leaf'&&!dialogOpen&&!shopOpen&&!missionOpen){
  const h=lighterQuestHouse;
  if(h&&Math.hypot(player.x-(h.x+h.w/2),player.y-(h.y+h.h+12))<132){
   enterRoom('lighterhouse');return;
  }
 }
 return lighterOldInteract();
};
// V218: Entering the NPC proximity must NEVER initiate Reth's dialogue.
// The A-button interaction remains managed by lighterTalk() in interact().
const lighterOldMove=move;
move=function(dt){lighterOldMove(dt);};
// Show the collectible in the Bag Pack alongside purchases.
const lighterOldRefreshBag=v44RefreshBag;
v44RefreshBag=function(){
 lighterOldRefreshBag();
 if(inventory.missingLighter){
  const box=document.getElementById('bagPackContents');
  if(box)box.insertAdjacentHTML('afterbegin','<div class="bagItem"><span>🔥 Missing Lighter (quest item)</span><strong>× 1</strong></div>');
 }
};
// Click directly on the lighter in the game world as an alternative to the A key.
canvas.addEventListener('pointerdown',function(ev){
 if(!lighterQuestActive()||lighterFound||interior!==lighterLocation||dialogOpen||missionOpen||cottagePuzzleOpen)return;
 const rect=canvas.getBoundingClientRect();
 const gx=(ev.clientX-rect.left)*W/rect.width,gy=(ev.clientY-rect.top)*H/rect.height;
 const scale=Math.max(.53,Math.min(1.08,W/950));
 const px=(gx/scale)-(W/scale-900)/2;
 const py=(gy/scale)-(H/scale-680)/2;
 const pos=lighterSpots[interior];
 if(pos&&Math.hypot(px-pos.x,py-pos.y)<54&&dist(pos.x,pos.y)<155){
  if(dist(pos.x,pos.y)>=110){show('🔥 LIGHTER','Step a little closer, then pick it up.');return;}
  lighterCollect();
 }
});


// V91: independent CABIN mission — the Woodland Hobo's riddle or trainer battle.
const cabinHouse=quietHouses.find(h=>h.name==='CABIN');
let cabinCutsceneSeen=false,cabinCutsceneStep=-1,cabinRiddleFailed=false;
let cabinMissionFinished=false,cabinMissionResult='',cabinRiddleVisible=false;
const cabinLines=['OI WHO TOLD YOU TO COME IN','NOW YOU MUST ANSWER THE RIDDLE OR BATTLE ME'];
const cabinRiddle={question:'The more you take, the more you leave behind. What am I?',options:['Footsteps','Coins','Leaves','Memories'],correct:0};
const cabinStyle=document.createElement('style');
cabinStyle.textContent=`
#cabinRiddleOverlay{position:fixed;inset:0;z-index:100005;display:none;align-items:center;justify-content:center;background:#07150edb;padding:16px;box-sizing:border-box;font-family:system-ui,sans-serif}
#cabinRiddlePanel{width:min(570px,96vw);border:5px solid #80552e;border-radius:18px;background:linear-gradient(155deg,#e6ce9e,#c6a66d);box-shadow:0 16px 0 #281b11,0 25px 60px #0008;padding:22px;color:#2b2317;text-align:center}
#cabinRiddlePanel h2{margin:0 0 9px;font-size:clamp(23px,5vw,33px)}
#cabinRiddleQuestion{font-size:clamp(17px,3.6vw,23px);font-weight:850;margin:16px 0 20px;line-height:1.35}
#cabinAnswerGrid{display:grid;grid-template-columns:1fr 1fr;gap:11px}
#cabinAnswerGrid button{border:3px solid #4e3b25;border-radius:10px;padding:16px 6px;background:#fdf1d4;color:#29331c;font-weight:850;font-size:clamp(14px,2.8vw,19px);cursor:pointer;min-height:62px}
#cabinAnswerGrid button:hover{background:#fce4a4;transform:translateY(-2px)}
@media(max-width:390px){#cabinAnswerGrid{grid-template-columns:1fr}}
`;
document.head.appendChild(cabinStyle);
const cabinRiddleOverlay=document.createElement('div');
cabinRiddleOverlay.id='cabinRiddleOverlay';
cabinRiddleOverlay.setAttribute('role','dialog');
cabinRiddleOverlay.setAttribute('aria-modal','true');
cabinRiddleOverlay.setAttribute('aria-label','Woodland Hobo riddle');
cabinRiddleOverlay.innerHTML='<div id="cabinRiddlePanel"><h2>🌲 WOODLAND HOBO’S RIDDLE</h2><p>Choose carefully. Get it wrong and you must battle his Sour Diesel!</p><div id="cabinRiddleQuestion"></div><div id="cabinAnswerGrid"></div><p style="margin-bottom:0;font-size:13px">✅ Correct: £50 + 25 XP &nbsp; ⚔️ Wrong: battle for £100 + 45 XP</p></div>';
document.body.appendChild(cabinRiddleOverlay);
function cabinAwardMoneyXP(money,xp){
 coins+=money;
 const results=[];
 for(const id of [...new Set(collection)]){
  if(!CREATURES[id])continue;
  const p=progressFor(id),old=p.level;
  p.xp+=xp;
  while(p.level<100&&p.xp>=xpNeeded(p.level)){
   p.xp-=xpNeeded(p.level);p.level++;
   p.bonuses=p.bonuses.map(v=>v+2);
  }
  results.push(CREATURES[id].name+' +'+xp+' XP'+(p.level>old?' (LEVEL UP!)':''));
 }
 v44RefreshWallet();v44RefreshBag();
 return results.join(' · ');
}
function cabinComplete(route){
 if(cabinMissionFinished)return;
 cabinMissionFinished=true;cabinMissionResult=route;cabinCutsceneSeen=true;
 cabinRiddleVisible=false;cabinRiddleOverlay.style.display='none';
 const riddle=route==='riddle',amount=riddle?50:100,xp=riddle?25:45;
 const xpMsg=cabinAwardMoneyXP(amount,xp);
 missionList();keys.clear();
 show('🌲 WOODLAND HOBO — MISSION COMPLETE',
  (riddle?'You answered correctly. Woodland Hobo hands over £50!':'You defeated Woodland Hobo’s level 8 Sour Diesel! He pays you £100!')+
  ' Your collected strains gain '+xp+' XP each. '+xpMsg+' The mission is now FINISHED.');
}
function cabinStartRiddle(){
 cabinCutsceneSeen=true;cabinCutsceneStep=-1;
 closeDialog();keys.clear();missionList();
 cabinRiddleVisible=true;cabinRiddleOverlay.style.display='flex';
 document.getElementById('cabinRiddleQuestion').textContent=cabinRiddle.question;
 const grid=document.getElementById('cabinAnswerGrid');
 grid.innerHTML='';
 cabinRiddle.options.forEach((answer,i)=>{
  const btn=document.createElement('button');btn.type='button';btn.textContent=String.fromCharCode(65+i)+'. '+answer;
  btn.addEventListener('click',()=>{
   if(!cabinRiddleVisible)return;
   cabinRiddleVisible=false;cabinRiddleOverlay.style.display='none';
   if(i===cabinRiddle.correct){cabinComplete('riddle')}
   else{
    cabinRiddleFailed=true;missionList();
    show('🌲 WRONG ANSWER!', 'NOPE! YOU CHOSE WRONG! NOW YOU MUST BATTLE ME!');
    // Once the warning dialogue closes, the trainer battle starts immediately.
    cabinBattlePending=true;
   }
  });
  grid.appendChild(btn);
 });
}
function cabinAdvanceScene(){
 cabinCutsceneStep++;
 if(cabinCutsceneStep<cabinLines.length){
  keys.clear();show('🌲 WOODLAND HOBO',cabinLines[cabinCutsceneStep]);
  const hint=document.querySelector('#dialog small');if(hint)hint.textContent='Press A / Enter to continue';
 }else{cabinStartRiddle()}
}
let cabinBattlePending=false;
function cabinStartBattle(){
 cabinBattlePending=false;
 if(cabinMissionFinished)return;
 syncCreatureHealth();
 if(!team.length||!team.some(id=>(creatureHealth[id]??maxHealth(id))>0)){
  show('🌿 HEAL YOUR STRAINS','Woodland Hobo is waiting! Heal your team at the Cure Shop before fighting him.');return;
 }
 battleToken++;
 const enemyId='sourdiesel',level=8;
 battle={mode:'hobo',active:team.findIndex(id=>(creatureHealth[id]??maxHealth(id))>0),
  hp:Object.fromEntries(team.map(id=>[id,Math.max(0,creatureHealth[id]??maxHealth(id))])),
  enemy:{id:enemyId,level,maxHp:maxHealth(enemyId,level),hp:maxHealth(enemyId,level)},
  busy:false,log:'WOODLAND HOBO sends out his Lv. 8 SOUR DIESEL! Trainer-owned strains cannot be captured.'};
 keys.clear();openCreatures('battle');
 if(musicOn){startMusic();if(audio&&audio.state==='suspended')audio.resume().catch(()=>{});beat=0;lastMusicBattleMode=false;musicTick()}
}
// Keep the established battle buttons, switching, sound, and sprite animations.
const cabinPriorBattleAction=battleAction;
battleAction=function(action){
 if(battle?.mode!=='hobo')return cabinPriorBattleAction(action);
 if(battle.busy)return;
 const index=Number(action);if(action==='switch')return;
 if(!Number.isInteger(index)||index<0||index>3)return;
 const attacker=team[battle.active];if(!attacker)return;
 battle.busy=true;const token=++battleToken,move=currentMove(attacker,index);
 battleMessage(`${CREATURES[attacker].name} used ${move[0]}!`);
 moveSound(attacker,index);renderSideBattle();animateBattleSprite('player','strike');
 setTimeout(()=>{
  if(!battle||battle.mode!=='hobo'||token!==battleToken)return;
  const hit=v152ResolvePlayerAttack(attacker,'sourdiesel',progressFor(attacker).level,8,move[1]);
  if(!hit.dodged){battle.enemy.hp=Math.max(0,battle.enemy.hp-hit.damage);hitSound()}
  renderSideBattle();if(!hit.dodged)animateBattleSprite('enemy','hit');
  battleMessage(hit.dodged?'Sour Diesel dodged!':`${move[0]} dealt ${hit.damage} damage! ${hit.note}`);
  if(battle.enemy.hp<=0){setTimeout(()=>{if(battle?.mode==='hobo'&&token===battleToken)finishBattleVictory()},720);return}
  setTimeout(()=>{
   if(!battle||battle.mode!=='hobo'||token!==battleToken)return;
   const moves=ATTACKS.sourdiesel,n=staminaChooseEnemyIndex(moves),enemyMove=n<0?['Recover',0]:moves[n];
   battleMessage(`Woodland Hobo’s Lv. 8 Sour Diesel used ${enemyMove[0]}!`);
   moveSound('sourdiesel',n);animateBattleSprite('enemy','strike');
   setTimeout(()=>{
    if(!battle||battle.mode!=='hobo'||token!==battleToken)return;
    const target=team[battle.active];
    const hit=v26ResolveAttack('sourdiesel',target,8,progressFor(target).level,enemyMove[1]);
    if(!hit.dodged){battle.hp[target]=Math.max(0,battle.hp[target]-hit.damage);hitSound()}
    renderSideBattle();if(!hit.dodged)animateBattleSprite('player','hit');
    battleMessage(hit.dodged?`${CREATURES[target].name} dodged!`:`${CREATURES[target].name} took ${hit.damage} damage! ${hit.note}`);
    setTimeout(()=>{
     if(!battle||battle.mode!=='hobo'||token!==battleToken)return;
     if(battle.hp[target]<=0){
      const next=team.findIndex(v=>battle.hp[v]>0);
      if(next<0){finishBattleDefeat();return}
      battle.active=next;battleMessage(`${CREATURES[team[next]].name}, you're up!`);
     }else battleMessage(`What will ${CREATURES[team[battle.active]].name} do?`);
     battle.busy=false;renderSideBattle();
    },480);
   },440);
  },550);
 },390);
};
const cabinPriorVictory=finishBattleVictory;
finishBattleVictory=function(){
 if(battle?.mode!=='hobo')return cabinPriorVictory();
 saveBattleHealth();battleToken++;battle=null;closeBeforeSideBattle();cabinComplete('battle');
};
const cabinPriorDefeat=finishBattleDefeat;
finishBattleDefeat=function(){
 if(battle?.mode!=='hobo')return cabinPriorDefeat();
 saveBattleHealth();battleToken++;battle=null;closeBeforeSideBattle();
 keys.clear();show('🌲 WOODLAND HOBO WINS','Your team fainted! Heal at the Cure Shop, then return to the CABIN to challenge Woodland Hobo again.');
};
const cabinPriorRenderBattle=renderSideBattle;
renderSideBattle=function(){
 cabinPriorRenderBattle();if(battle?.mode!=='hobo')return;
 cTitle.textContent='⚔️ CABIN — WOODLAND HOBO';
 cHelp.textContent='Trainer battle · Lv. 8 Sour Diesel · No captures allowed';
 const enemyBadge=document.querySelector('.battle-hud.enemy .row span:last-child');
 if(enemyBadge)enemyBadge.textContent='Lv. 8';
 const enemyBar=document.querySelector('.battle-hud.enemy .hp');
 if(enemyBar)enemyBar.textContent='HP '+battle.enemy.hp+' / '+battle.enemy.maxHp;
 const enemyFill=document.querySelector('.battle-hud.enemy .fill');
 if(enemyFill)enemyFill.style.width=Math.max(0,100*battle.enemy.hp/battle.enemy.maxHp)+'%';
 const capture=document.querySelector('#captureWildButton');if(capture)capture.remove();
};
const woodlandHoboCabinFrames=['assets/v204_61ce2188eda3571930d243c4.png','assets/v204_61ce2188eda3571930d243c4.png','assets/v204_bb72f3d45610643adb6a9e71.png','assets/v204_bb72f3d45610643adb6a9e71.png','assets/v204_ceb8d1cf31a94163755d3b59.png','assets/v204_ceb8d1cf31a94163755d3b59.png','assets/v204_081a6376b1932711354ed437.png','assets/v204_081a6376b1932711354ed437.png','assets/v204_f30924cb9ad7d4d2b77be6a2.png','assets/v204_f30924cb9ad7d4d2b77be6a2.png','assets/v204_2e19dec5c019597136ad0bb3.png','assets/v204_2e19dec5c019597136ad0bb3.png','assets/v204_749ac78d82864dd06e4232d0.png','assets/v204_749ac78d82864dd06e4232d0.png','assets/v204_bdc6f36ef107cf68d397b379.png','assets/v204_bdc6f36ef107cf68d397b379.png','assets/v204_ad8da2f9e86400bf1777a3d8.png','assets/v204_ad8da2f9e86400bf1777a3d8.png','assets/v204_73926e0e9ac18a0d40934619.png','assets/v204_73926e0e9ac18a0d40934619.png','assets/v204_516dce8d905db749de3d1225.png','assets/v204_516dce8d905db749de3d1225.png','assets/v204_f87c03afa3e5322e74e1a2f5.png','assets/v204_f87c03afa3e5322e74e1a2f5.png','assets/v204_192b643952d143c24d12e323.png','assets/v204_192b643952d143c24d12e323.png','assets/v204_37ea551192422d01258a7bc8.png','assets/v204_37ea551192422d01258a7bc8.png','assets/v204_7008a8e27e110e9984b796a7.png','assets/v204_7008a8e27e110e9984b796a7.png','assets/v204_2c87853b346187ee60325fd0.png','assets/v204_2c87853b346187ee60325fd0.png'].map(src=>{const img=new Image();img.src=src;return img;});
const woodlandHoboCabinFrameCount=woodlandHoboCabinFrames.length;

// The normal interior renderer supplies walls; custom artwork distinguishes the cabin.
const cabinPriorDrawInterior=drawInterior;
drawInterior=function(){
 if(interior!=='cabin'){cabinPriorDrawInterior();return}
 cabinPriorDrawInterior();
 ctx.save();
 ctx.fillStyle='#392b22';ctx.fillRect(70,115,760,465);
 for(let y=120;y<565;y+=44){ctx.fillStyle=(Math.floor(y/44)%2)?'#69472d':'#79553a';ctx.fillRect(72,y,756,42)}
 for(let x=70;x<835;x+=84){ctx.fillStyle='#4b3324';ctx.fillRect(x,119,4,458)}
 text('WOODLAND CABIN',450,101,31,'#fff0ab');
 ctx.fillStyle='#54402d';ctx.fillRect(120,180,220,120);
 ctx.fillStyle='#2b251f';ctx.fillRect(142,201,176,85);
 ctx.fillStyle='#fa7b33';ctx.beginPath();ctx.ellipse(230,255,35,23,0,0,Math.PI*2);ctx.fill();
 text('FIREPLACE',231,177,16,'#ffdb90');
 ctx.fillStyle='#7e5b40';ctx.fillRect(599,179,140,118);
 ctx.fillStyle='#dfc08b';ctx.fillRect(611,188,116,96);
 text('SUPPLIES',670,246,17,'#f8e2b2');
 // Woodland Hobo is rendered once in the final cabin foreground pass.
 ctx.fillStyle='#39261c';ctx.fillRect(370,575,160,15);
 text('EXIT',450,610,19,'#fff2ba');
 drawHero(player.x,player.y,player.dir,player.step);
 ctx.restore();
};
const cabinPriorEnterRoom=enterRoom;
enterRoom=function(kind){
 cabinPriorEnterRoom(kind);
 if(kind==='cabin'){
  document.querySelector('#hud strong').textContent='🌲 WOODLAND CABIN';
  keys.clear();
  // Hobo awaits A in interaction range; never begin dialogue on entry.
 }
};
// Move the character onto clear ground directly below the cabin when exiting.
// This avoids leaving them inside its collision area or the map perimeter.
const cabinPriorLeaveRoom=leaveRoom;
leaveRoom=function(){
 const leavingCabin=interior==='cabin';
 cabinPriorLeaveRoom();
 if(leavingCabin&&cabinHouse){
  player.x=cabinHouse.x+cabinHouse.w/2;
  player.y=cabinHouse.y+cabinHouse.h+65;
  player.dir='down';
  keys.clear();
 }
};
const cabinPriorInteract=interact;
interact=function(){
 if(cabinRiddleVisible)return;
 if(cabinCutsceneStep>=0){cabinAdvanceScene();return}
 if(cabinBattlePending){cabinBattlePending=false;closeDialog();cabinStartBattle();return}
 if(interior==='cabin'){
  if(dialogOpen){closeDialog();return}
  if(player.y>555&&player.x>335&&player.x<565){leaveRoom();return}
  if(!cabinMissionFinished&&dist(452,300)<180){
   if(cabinRiddleFailed)cabinStartBattle();else cabinStartRiddle();return;
  }
  show('🌲 CABIN','Approach Woodland Hobo to talk, or head to the EXIT below.');return;
 }
 if(!interior&&currentDistrict==='leaf'&&!dialogOpen&&!shopOpen&&!missionOpen&&cUI.style.display!=='flex'){
  if(cabinHouse&&Math.hypot(player.x-(cabinHouse.x+cabinHouse.w/2),player.y-(cabinHouse.y+cabinHouse.h+12))<140){enterRoom('cabin');return}
 }
 return cabinPriorInteract();
};
const cabinPriorMove=move;
move=function(dt){
 if(cabinRiddleVisible||cabinBattlePending)return;
 cabinPriorMove(dt);
};
window.addEventListener('keydown',function(e){
 if(!cabinRiddleVisible)return;
 if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Enter',' '].includes(e.key)){e.preventDefault();e.stopImmediatePropagation()}
},true);


// V97 — unified labels, single Bag Pack, and full-screen Woodland Hobo cutscene.
const v97PreviousBagRefresh=v44RefreshBag;
v44RefreshBag=function(){
 v97PreviousBagRefresh();
 const list=document.getElementById('bagPackContents');
 if(!list)return;
 if(inventory.funeralFlowers){
   const empty=list.querySelector('p');if(empty&&/bag is empty/i.test(empty.textContent))empty.remove();
   list.insertAdjacentHTML('afterbegin','<div class="bagItem"><span>💐 Funeral Flowers · Quest item</span><strong>× '+inventory.funeralFlowers+'</strong></div>');
 }
};
// Every battle render must use the actual opponent/context, not Norm's gym.
const v97PreviousRenderBattle=renderSideBattle;
renderSideBattle=function(){
 v97PreviousRenderBattle();
 if(!battle)return;
 const mode=battle.mode||'gym';
 let heading,help;
 if(mode==='wild'){
   heading='🌿 WILD STRAIN ENCOUNTER';
   help='Wild Level '+battle.enemy.level+' '+CREATURES[battle.enemy.id].name+' · Choose a move, or use a Baggy to capture it.';
 }else if(mode==='hobo'){
   heading='⚔️ WOODLAND CABIN — WOODLAND HOBO';
   help='Trainer battle · Level 8 Sour Diesel · This strain cannot be captured.';
 }else if(mode==='training'){
   heading='⭐ PAPAHERB HQ — PRACTICE BATTLE';
   help='Training battle · Practice your moves and gain XP.';
 }else{
   heading='⚔️ NORMS GYM — WHITE BOY NORM';
   help='Gym leader battle · Defeat Norm for the Common Badge.';
 }
 cTitle.textContent=heading;cHelp.textContent=help;
};
// Initial battle screen and subsequent repaint should use the same correct title.
const v97PreviousRefresh=refreshCreatures;
refreshCreatures=function(){
 v97PreviousRefresh();
 if(creatureMode==='battle'&&battle)renderSideBattle();
};

const hoboSceneStyle=document.createElement('style');
hoboSceneStyle.textContent=`
#hoboCinematic{position:fixed;inset:0;z-index:100100;display:none;align-items:center;justify-content:center;padding:12px;background:#07180ff4;box-sizing:border-box;font-family:system-ui,sans-serif}
#hoboCinematic.active{display:flex}
#hoboCinematicStage{width:min(1100px,98vw);height:min(96dvh,850px);min-height:350px;position:relative;overflow:hidden;border:5px solid #87633d;border-radius:19px;box-shadow:0 0 0 3px #17291d,0 18px 70px #000b;background:linear-gradient(180deg,#1e392d 0%,#536b46 52%,#8a714c 76%,#4d3b2b 100%);color:#fff8da}
#hoboCinematicStage:before{content:'';position:absolute;inset:0;opacity:.25;pointer-events:none;background:repeating-linear-gradient(90deg,transparent 0 116px,#11291caa 118px 124px),linear-gradient(120deg,transparent 35%,#a49c5655 57%,transparent 72%)}
#hoboCinematicTitle{position:absolute;left:0;right:0;top:2.3%;z-index:2;text-align:center;font-weight:1000;letter-spacing:1px;font-size:clamp(21px,4vw,38px);color:#fff0ae;text-shadow:3px 4px 0 #1c2015}
#hoboCinematicArt{position:absolute;top:11%;height:56%;max-height:490px;width:100%;z-index:2;display:flex;align-items:end;justify-content:center}
#hoboCinematicArt img{height:100%;width:100%;max-width:520px;object-fit:contain;object-position:center bottom;image-rendering:pixelated;filter:drop-shadow(10px 13px 0 #18201170);animation:hoboReveal .21s ease-out}
#hoboCinematicBox{position:absolute;bottom:2.6%;left:3%;right:3%;min-height:26%;z-index:4;border:4px solid #a67a42;border-radius:13px;background:#f5e5bd;box-shadow:0 7px 0 #34291e;color:#342719;padding:clamp(12px,2.8vh,23px)}
#hoboCinematicName{font-size:clamp(15px,2.5vw,24px);font-weight:1000;letter-spacing:.4px;color:#7a361f}
#hoboCinematicLine{font-size:clamp(17px,3.4vw,31px);font-weight:900;margin-top:10px;line-height:1.24;min-height:2em}
#hoboCinematicFooter{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:11px;font-weight:800;font-size:clamp(12px,1.5vw,16px);color:#745c45}
#hoboCinematicNext{border:2px solid #533a24;border-radius:9px;background:#476041;color:#fff2c8;padding:8px 19px;font-weight:900;cursor:pointer;min-height:42px}
@keyframes hoboReveal{from{transform:translateY(8px) scale(.97);opacity:.45}to{transform:translateY(0) scale(1);opacity:1}}
@media(max-height:520px){#hoboCinematicArt{height:49%;top:7%}#hoboCinematicBox{min-height:36%}#hoboCinematicTitle{top:1%;font-size:20px}#hoboCinematicLine{font-size:17px}}
`;
document.head.appendChild(hoboSceneStyle);
const hoboCinematic=document.createElement('div');
hoboCinematic.id='hoboCinematic';
hoboCinematic.setAttribute('role','dialog');
hoboCinematic.setAttribute('aria-modal','true');
hoboCinematic.setAttribute('aria-label','Woodland Hobo cutscene');
hoboCinematic.innerHTML=`<div id="hoboCinematicStage"><div id="hoboCinematicTitle">🌲 WOODLAND CABIN</div><div id="hoboCinematicArt"><img id="hoboCinematicSprite" alt="Angry Woodland Hobo"></div><div id="hoboCinematicBox"><div id="hoboCinematicName">WOODLAND HOBO</div><div id="hoboCinematicLine"></div><div id="hoboCinematicFooter"><span id="hoboCinematicProgress">1 / 2 · Press A or Enter</span><button type="button" id="hoboCinematicNext">NEXT ▶</button></div></div></div>`;
document.body.appendChild(hoboCinematic);
const hoboCinematicSprites=['assets/v204_e4300e073e1fc43f1375962e.png','assets/v204_f2088776c5559ca1588075a9.png'];
function v97HideHoboScene(){hoboCinematic.classList.remove('active')}
function v97RenderHoboScene(){
 closeDialog();keys.clear();
 hoboCinematic.classList.add('active');
 document.getElementById('hoboCinematicLine').textContent=cabinLines[cabinCutsceneStep]||'';
 document.getElementById('hoboCinematicProgress').textContent=(cabinCutsceneStep+1)+' / '+cabinLines.length+' · Press A or Enter';
 const img=document.getElementById('hoboCinematicSprite'),src=hoboCinematicSprites[Math.min(cabinCutsceneStep,1)];
 if(img.src!==src)img.src=src;
 img.style.animation='none';void img.offsetWidth;img.style.animation='hoboReveal .21s ease-out';
 document.getElementById('hoboCinematicNext').textContent=(cabinCutsceneStep>=cabinLines.length-1?'ANSWER THE RIDDLE ▶':'NEXT ▶');
}
// Override just the cottage script's old small dialogue sequence, keeping the
// original riddle, level-8 Sour Diesel battle and one-time rewards unchanged.
cabinAdvanceScene=function(){
 if(cabinCutsceneStep<0&&cabinCutsceneSeen){return;}
 cabinCutsceneStep++;
 if(cabinCutsceneStep<cabinLines.length){v97RenderHoboScene();return;}
 v97HideHoboScene();cabinStartRiddle();
};
const v97BeforeCabinRiddle=cabinStartRiddle;
cabinStartRiddle=function(){v97HideHoboScene();v97BeforeCabinRiddle()};
document.getElementById('hoboCinematicNext').addEventListener('click',()=>{if(hoboCinematic.classList.contains('active'))cabinAdvanceScene()});
window.addEventListener('keydown',e=>{
 if(!hoboCinematic.classList.contains('active'))return;
 if([' ','Enter','a','A','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Escape'].includes(e.key)){
   e.preventDefault();e.stopImmediatePropagation();
   if(!e.repeat&&[' ','Enter','a','A'].includes(e.key))cabinAdvanceScene();
 }
},true);
document.getElementById('action').addEventListener('pointerdown',e=>{
 if(!hoboCinematic.classList.contains('active'))return;
 e.preventDefault();e.stopImmediatePropagation();cabinAdvanceScene();
},true);
const v97PriorMove=move;
move=function(dt){if(hoboCinematic.classList.contains('active'))return;v97PriorMove(dt)};

