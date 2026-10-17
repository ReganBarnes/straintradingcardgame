
// V103 — Design overhaul for Leaf Town buildings + Lucy roaming/cutscene update.
(function(){
  const cottageArt = new Image();
  cottageArt.src = 'assets/v204_d478177ccfa596bae9e51d05.png';
  const lucyWalkFrames={down:[],up:[],left:[],right:[]};(function(){const frameData={down:['assets/v204_ac9936d14e603e62790c16fc.png','assets/v204_d224167f105589ed956cabe7.png','assets/v204_ec756889cb1247a7d837fbbc.png','assets/v204_ef56a0a5bc50bd40c79f8765.png'],up:['assets/v204_246ce7ce57bffda60ba04ed1.png','assets/v204_bdff92a3dd0c98a3109e538d.png','assets/v204_fdc0c4550f69161477b76aba.png','assets/v204_e08f7b8f55daeeae28e86629.png'],left:['assets/v204_34d7a41bda06e59fe29456ea.png','assets/v204_f8575fe5407e606af0f7721d.png','assets/v204_30ba1aa61959a18cffd4be37.png','assets/v204_96eed345aac1366469ed2fbb.png'],right:['assets/v204_24c490b8bb5ac25ec9fc09a1.png','assets/v204_629de6954ef4af19efa62958.png','assets/v204_1357d57d4bca3167229ce691.png','assets/v204_312f8903a7d4e09de0ae5fff.png']};for(const dir of Object.keys(frameData)){lucyWalkFrames[dir]=frameData[dir].map(src=>{const img=new Image();img.src=src;return img;});}})();
  const lucyPortraits=['assets/v204_a6c98a36a628ebfae771e23c.png', 'assets/v204_7c62241d8259acfb3e461edf.png', 'assets/v204_b4327656e78e9af53c99a83e.png'];

  function themedBuildingMeta(name){
    const key=(name||'').toUpperCase();
    const map={
      'CURE SHOP':{roof:'#5e7d57',roofDark:'#41553b',wall:'#ebe2cf',stone:'#68707d',fascia:'#21352f',sign:'CURE SHOP',signColor:'#f3efc5',door:'#6d4c34',trim:'#303846',flower:false,crates:true,plus:true},
      'PAPAHERB HQ':{roof:'#6f7f9b',roofDark:'#515d74',wall:'#e8dfcd',stone:'#707787',fascia:'#2a3240',sign:'PAPAHERB HQ',signColor:'#f4efc7',door:'#6b4a34',trim:'#2f3846',banner:true},
      'FLOWER HOUSE':{roof:'#78926b',roofDark:'#52634b',wall:'#efe3d1',stone:'#6d7482',fascia:'#314235',sign:"LUCY'S FLOWERS",signColor:'#fff1c8',door:'#714d36',trim:'#32404a',flower:true,crates:false},
      'HOME':{roof:'#74849b',roofDark:'#52606f',wall:'#e8dcc7',stone:'#707684',fascia:'#2c3340',sign:'HOME',signColor:'#f8efcc',door:'#674937',trim:'#32404a'},
      'HOUSE':{roof:'#b28962',roofDark:'#7d6249',wall:'#e5d7c2',stone:'#6f7482',fascia:'#363739',sign:'HOUSE',signColor:'#f6efc9',door:'#714f38',trim:'#32404a',mailbox:true},
      'CABIN':{roof:'#8b6e5c',roofDark:'#644f43',wall:'#ddc8aa',stone:'#67707e',fascia:'#3a302d',sign:'WOODLAND CABIN',signColor:'#f6eac4',door:'#644632',trim:'#32404a',chimney:true,barrels:true},
      'COTTAGE':{roof:'#c67b79',roofDark:'#8f5b5f',wall:'#eee3d3',stone:'#68707d',fascia:'#2d3441',sign:'COTTAGE',signColor:'#fff5d6',door:'#6f4a35',trim:'#303846'},
      'NORMS GYM':{roof:'#7d6d56',roofDark:'#5c513e',wall:'#ead8ba',stone:'#6d7482',fascia:'#413a2e',sign:"NORM'S GYM",signColor:'#fff2bc',door:'#694833',trim:'#32404a',gym:true}
    };
    return map[key] || {roof:'#9a7b63',roofDark:'#705b4a',wall:'#e8dcc8',stone:'#6d7482',fascia:'#2d3441',sign:key||'BUILDING',signColor:'#fff0cb',door:'#6f4a35',trim:'#303846'};
  }

  function drawWindow(wx,wy,ww,wh,trim,box,flower){
    ctx.fillStyle=trim;ctx.fillRect(wx,wy,ww,wh);
    ctx.fillStyle='#94d6ff';ctx.fillRect(wx+Math.round(ww*0.1),wy+Math.round(wh*0.1),Math.round(ww*0.8),Math.round(wh*0.8));
    ctx.fillStyle='#6ea3c9';ctx.fillRect(wx+Math.round(ww*0.48),wy+Math.round(wh*0.1),Math.max(2,Math.round(ww*0.06)),Math.round(wh*0.8));
    ctx.fillStyle='rgba(255,255,255,.55)';ctx.fillRect(wx+Math.round(ww*0.20),wy+Math.round(wh*0.18),Math.round(ww*0.12),Math.round(wh*0.55));
    ctx.fillStyle=trim;ctx.fillRect(wx-2,wy+wh,ww+4,Math.max(4,Math.round(wh*0.18)));
    if(box){
      ctx.fillStyle='#6f4f36';ctx.fillRect(wx+2,wy+wh+3,ww-4,Math.max(6,Math.round(wh*0.18)));
      ctx.fillStyle='#528b4e';ctx.fillRect(wx+4,wy+wh+3,ww-8,Math.max(4,Math.round(wh*0.10)));
      if(flower){
        const blossoms=['#ff93b7','#fff0a6','#d9b0ff','#ffcf8a'];
        for(let i=0;i<4;i++){
          const bx=wx+8+i*((ww-18)/3);
          const by=wy+wh+2;
          ctx.fillStyle='#4b8c49';ctx.fillRect(Math.round(bx),Math.round(by+2),2,6);
          ctx.fillStyle=blossoms[i%blossoms.length];ctx.beginPath();ctx.arc(Math.round(bx)+1,Math.round(by),4,0,Math.PI*2);ctx.fill();
          ctx.fillStyle='#ffe97f';ctx.beginPath();ctx.arc(Math.round(bx)+1,Math.round(by),1.5,0,Math.PI*2);ctx.fill();
        }
      }
    }
  }

  const newCabinArt=new Image();newCabinArt.src='assets/v204_8a41819528e366ee833e278a.png';
  const newFlowerHouseArt=new Image();newFlowerHouseArt.src='assets/v204_5f4f83df200f34a82d25502c.png';
  function drawThemedHouse(x,y,w,h,name,isGym){
    const meta=themedBuildingMeta(name);
    const roofH=Math.round(h*0.42);
    const bodyY=y+Math.round(h*0.22);
    const bodyH=h-Math.round(h*0.18);
    const stoneH=Math.max(10,Math.round(h*0.10));
    const over=isGym?16:10;
    ctx.save();ctx.imageSmoothingEnabled=false;
    ctx.fillStyle='rgba(21,32,28,.24)';ctx.beginPath();ctx.ellipse(x+w/2,y+h+12,w*0.44,12,0,0,Math.PI*2);ctx.fill();
    if(name==='FLOWER HOUSE'){
      if(newFlowerHouseArt.complete && newFlowerHouseArt.naturalWidth){
        const artW=w+20,artH=artW*(newFlowerHouseArt.naturalHeight/newFlowerHouseArt.naturalWidth);
        ctx.drawImage(newFlowerHouseArt,Math.round(x+w/2-artW/2),Math.round(y+h+8-artH),Math.round(artW),Math.round(artH));
      }
      ctx.restore();return;
    }
    if(name==='CABIN'){
      if(newCabinArt.complete && newCabinArt.naturalWidth){
        // Preserve original collision footprint while displaying the complete cabin art.
        const artW=w+20,artH=artW*(newCabinArt.naturalHeight/newCabinArt.naturalWidth);
        ctx.drawImage(newCabinArt,Math.round(x+w/2-artW/2),Math.round(y+h+8-artH),Math.round(artW),Math.round(artH));
      }
      ctx.restore();return;
    }
    if(name==='COTTAGE' && cottageArt.complete && cottageArt.naturalWidth){
      ctx.drawImage(cottageArt,x-over,y-18,w+over*2,h+28);
      ctx.restore();
      return;
    }
    ctx.fillStyle=meta.roofDark;
    ctx.beginPath();ctx.moveTo(x-over,y+roofH);ctx.lineTo(x+w/2,y-16);ctx.lineTo(x+w+over,y+roofH);ctx.closePath();ctx.fill();
    ctx.fillStyle=meta.roof;
    ctx.beginPath();ctx.moveTo(x,y+roofH-4);ctx.lineTo(x+w/2,y-8);ctx.lineTo(x+w,y+roofH-4);ctx.closePath();ctx.fill();
    for(let i=0;i<4;i++){
      ctx.strokeStyle=meta.roofDark;ctx.lineWidth=3;
      const yy=y+Math.round(roofH*0.18)+i*Math.round(roofH*0.16);
      ctx.beginPath();ctx.moveTo(x+18+i*4,yy);ctx.lineTo(x+w/2,yy-Math.round(i*3));ctx.lineTo(x+w-18-i*4,yy);ctx.stroke();
    }
    ctx.fillStyle=meta.trim;ctx.fillRect(x+6,bodyY-2,w-12,bodyH);
    ctx.fillStyle=meta.wall;ctx.fillRect(x+12,bodyY+6,w-24,bodyH-18);
    ctx.fillStyle=meta.stone;ctx.fillRect(x+10,y+h-stoneH,w-20,stoneH);
    ctx.fillStyle=meta.fascia;ctx.fillRect(x+16,bodyY+2,w-32,Math.round(h*0.16));
    ctx.fillStyle='#7c5a43';ctx.fillRect(x+14,bodyY+8,8,bodyH-26);ctx.fillRect(x+w-22,bodyY+8,8,bodyH-26);
    const ww=Math.round(w*0.18), wh=Math.round(h*0.18);
    drawWindow(Math.round(x+w*0.13),Math.round(bodyY+h*0.17),ww,wh,meta.trim,true,!!meta.flower);
    drawWindow(Math.round(x+w*0.69),Math.round(bodyY+h*0.17),ww,wh,meta.trim,true,!!meta.flower);
    const dw=Math.round(w*0.18), dh=Math.round(h*0.30);
    const dx=Math.round(x+w*0.5-dw/2), dy=Math.round(y+h-dh-stoneH+2);
    ctx.fillStyle=meta.trim;ctx.fillRect(dx-5,dy-8,dw+10,dh+10);
    ctx.fillStyle=meta.door;ctx.fillRect(dx,dy,dw,dh);
    ctx.fillStyle='#8c6446';for(let i=0;i<3;i++)ctx.fillRect(dx+6+i*Math.round(dw*0.22),dy+10,4,dh-18);
    ctx.fillStyle='#efe2bd';ctx.fillRect(dx+dw-10,dy+Math.round(dh*0.55),5,5);
    ctx.fillStyle=meta.stone;ctx.fillRect(dx-8,y+h-stoneH-2,dw+16,8);ctx.fillRect(dx-2,y+h-stoneH+6,dw+4,6);
    if(meta.plus){ctx.fillStyle='#d5f0ce';ctx.fillRect(x+w-66,bodyY+18,24,24);ctx.fillStyle='#4b8f54';ctx.fillRect(x+w-57,bodyY+23,6,14);ctx.fillRect(x+w-62,bodyY+28,16,6);}
    if(meta.banner){ctx.fillStyle='#5ca26c';ctx.fillRect(x+24,bodyY+18,30,74);ctx.fillStyle='#87d98d';ctx.fillRect(x+30,bodyY+24,18,62);ctx.fillStyle='#4d7d58';ctx.fillRect(x+w-54,bodyY+18,30,74);ctx.fillStyle='#87d98d';ctx.fillRect(x+w-48,bodyY+24,18,62);}
    if(meta.crates){ctx.fillStyle='#80573a';ctx.fillRect(x+32,y+h-stoneH-18,18,18);ctx.fillRect(x+w-50,y+h-stoneH-18,18,18);ctx.strokeStyle='#a9825f';ctx.lineWidth=2;ctx.strokeRect(x+32,y+h-stoneH-18,18,18);ctx.strokeRect(x+w-50,y+h-stoneH-18,18,18);}
    if(meta.mailbox){ctx.fillStyle='#6f4d37';ctx.fillRect(x+20,y+h-stoneH-34,4,24);ctx.fillStyle='#c85d4c';ctx.fillRect(x+12,y+h-stoneH-34,18,12);}
    if(meta.barrels){ctx.fillStyle='#6f5037';ctx.fillRect(x+26,y+h-stoneH-22,12,18);ctx.fillRect(x+w-38,y+h-stoneH-22,12,18);ctx.strokeStyle='#a57b54';ctx.strokeRect(x+26,y+h-stoneH-22,12,18);ctx.strokeRect(x+w-38,y+h-stoneH-22,12,18);}
    if(meta.chimney){ctx.fillStyle='#786458';ctx.fillRect(x+w-56,y+18,18,46);ctx.fillStyle='#9e8b80';ctx.fillRect(x+w-60,y+14,26,7);}
    if(meta.gym){ctx.fillStyle='#b18d4f';ctx.beginPath();ctx.arc(x+w-46,bodyY+38,14,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff1a7';ctx.beginPath();ctx.arc(x+w-46,bodyY+38,8,0,Math.PI*2);ctx.fill();ctx.fillStyle='#4a3f2a';ctx.fillText('★',x+w-46,bodyY+44);}
    if(meta.flower){const colors=['#ff98c0','#ffd88d','#d8a7ff','#fff0a0'];for(let i=0;i<6;i++){const bx=x+28+i*22,by=y+h-stoneH-12+(i%2)*2;ctx.fillStyle='#4d8b4d';ctx.fillRect(bx,by,2,10);ctx.fillStyle=colors[i%colors.length];ctx.beginPath();ctx.arc(bx+1,by-1,5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffe97f';ctx.beginPath();ctx.arc(bx+1,by-1,2,0,Math.PI*2);ctx.fill();}}
    text(meta.sign,x+w/2,bodyY+Math.round(h*0.11),Math.max(10,Math.round(h*0.08)),meta.signColor);
    ctx.restore();
  }

  function drawWorldBuildingsOverhaul(){
    // Main landmarks already render their replacement artwork in the base world pass.
    // Never paint the legacy procedural house over the new HQ, Cure Shop or Norm's Gym.
    // Secondary houses use their replacement artwork or their single themed renderer.
    for(const h of quietHouses){ drawThemedHouse(h.x,h.y,h.w,h.h,h.name,false); }
  }

  const worldDrawBeforeV103 = drawWorld;
  drawWorld = function(){
    // V172: Never let an optional sewer decoration prevent the normal hero sprite
    // from drawing. This restores V167's original draw order and isolates the add-on.
    worldDrawBeforeV103();
    drawWorldBuildingsOverhaul();
    try { if(typeof langyDrawManhole==='function') langyDrawManhole(); }
    catch (sewerDrawError) { console.warn('Sewer manhole decoration skipped:',sewerDrawError); }
    drawHero(player.x,player.y,player.dir,player.step);
  };

  const lucyRoam={x:450,y:334,targetX:450,targetY:334,speed:58,wait:0.9,moving:false,direction:'down',stepClock:0,idleClock:0};
  function rand(a,b){ return a + Math.random()*(b-a); }
  function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
  window.saLucyNPC=lucyRoam;
  function resetLucyRoam(){ lucyRoam.x=450; lucyRoam.y=334; lucyRoam.targetX=450; lucyRoam.targetY=334; lucyRoam.speed=58; lucyRoam.wait=0.85; lucyRoam.moving=false; lucyRoam.direction='down'; lucyRoam.stepClock=0; lucyRoam.idleClock=0; }
  function pickLucyTarget(){ lucyRoam.targetX=rand(360,545); lucyRoam.targetY=rand(280,420); }
  function lucyNearOwner(){ return interior==='flower' && Math.hypot(player.x-lucyRoam.x,player.y-(lucyRoam.y-6))<118; }
  const lucyWalkFramesFixedData={"down":["assets/v204_c5c3a19a1913cf3f691ef8cf.png","assets/v204_9287fbfec0072e3abd74502f.png","assets/v204_c5c3a19a1913cf3f691ef8cf.png","assets/v204_9287fbfec0072e3abd74502f.png"],"up":["assets/v204_f71f7b367f432f65baa409a9.png","assets/v204_97c9dcab6abcf4c66c632b99.png","assets/v204_fbf290ef1b72c3aa05902722.png","assets/v204_887ac422a3490bd3834c3a5f.png"],"left":["assets/v204_5ad1bc9e747eae0f96c86fc4.png","assets/v204_f210d7678a4b49464eb26c8c.png","assets/v204_246100bfe9bbfca865324a19.png","assets/v204_5ff790072d53c1015404a752.png"],"right":["assets/v204_2886a46109e9058801265c96.png","assets/v204_d3cf7fdfd94ee564f4915d71.png","assets/v204_60408433e65587d882fe6643.png","assets/v204_99c4a35196591dfa40eaac74.png"]};
  const lucyWalkFramesFixed = Object.fromEntries(Object.entries(lucyWalkFramesFixedData).map(([dir,arr])=>[dir,arr.map(src=>{const img=new Image(); img.src=src; return img;})]));

  /* Lucy: individually segmented eight-frame directional walk cycles. */
  const lucyWalkFramesPreciseData={"down":["assets/v204_5b491967422c94166cc7041c.png","assets/v204_7d0beee46c13fee55e0ab92d.png","assets/v204_f86f9aa3daf0c19fffa14232.png","assets/v204_45c3fc8c352fa1067ab62e04.png","assets/v204_709087f369b414bef1c60535.png","assets/v204_a1e7d8ed9c1a41fe4ea4e4ac.png","assets/v204_634c9051e59498abf553d32c.png","assets/v204_8b46ee98c2134ec960516e0d.png"],"up":["assets/v204_7c50dafa5d95aee4b75446c0.png","assets/v204_15eaceb7cc3cb2e5eeaffe83.png","assets/v204_3928897b5c34e1fadc9ee644.png","assets/v204_ab2841dcf8dda1c283a5e493.png","assets/v204_bd971421251062a1ee227bdf.png","assets/v204_1de7e6cd66e4073870d3b51c.png","assets/v204_4b9268ce05fe04624533ef70.png","assets/v204_be9cafffd5ffaeac130db2d2.png"],"left":["assets/v204_02e3d6a402b40981fd66890f.png","assets/v204_34033fd6f191c2cfe823bc06.png","assets/v204_40ff31d4a58e0e9fff6dca65.png","assets/v204_c0af52c42875111ff6867f33.png","assets/v204_f761f6cfc1cbdba945046be3.png","assets/v204_9775d0cfddf8df4e27a1a5b4.png","assets/v204_e0781e3c7f978ef7391f52b4.png","assets/v204_7e4e32772ea6a728390fc9df.png"],"right":["assets/v204_248731c57f9b1728910bcb71.png","assets/v204_9a4623d86280032449203f1f.png","assets/v204_ad9d4574f67226c3725c6def.png","assets/v204_12be73038383b3461bc603bb.png","assets/v204_c839bb9e1b603ee7e01dbf07.png","assets/v204_2c57afabc16114a98fb842a1.png","assets/v204_1c47c8eea1be13461cf4563b.png","assets/v204_3015b711586957e4a1e764d0.png"]};
  const lucyWalkFramesPrecise=Object.fromEntries(Object.entries(lucyWalkFramesPreciseData).map(([dir,arr])=>[dir,arr.map(src=>{const img=new Image();img.src=src;return img;})]));
  const freshBloomsDisplay=new Image();freshBloomsDisplay.src='assets/v204_acb2bd2ba1ca35e6b313d99a.png';
  const lucyExactFrames={
    down:[0,1,2,3].map(i=>{const img=new Image();img.src=["assets/v204_3a77b7167d106b4f30e613ac.png","assets/v204_468f490d9c056a01fd749000.png","assets/v204_6f0bd821557f6d32a4a8a40b.png","assets/v204_b89564562f46b4b52671ec22.png"][i];return img;}),
    up:[0,1,2,3].map(i=>{const img=new Image();img.src=["assets/v204_0d9cc746cf8d8d17aa05ae27.png","assets/v204_98dfd1919e7a63bf07bdb2dc.png","assets/v204_29be5389fdde5e8126fd873f.png","assets/v204_cb0850545cd2e23c17e71f19.png"][i];return img;}),
    left:[0,1,2,3].map(i=>{const img=new Image();img.src=["assets/v204_55b3701dfe6c4502e74b0bd4.png","assets/v204_6a1a9879113e19fe148334ed.png","assets/v204_c9eb96dbfce391c76e4f5146.png","assets/v204_5e4e89315e6a9148e09c860a.png"][i];return img;}),
    right:[0,1,2,3].map(i=>{const img=new Image();img.src=["assets/v204_88b9d4d2bd3bd6bbf1092946.png","assets/v204_b2c40ebec818b70c57cb2137.png","assets/v204_02071edbf9ddbb47f6d37284.png","assets/v204_5cfaa0c161fa90550ee298dd.png"][i];return img;})
  };
  function drawLucy(x,y){
    const dirFrames=lucyExactFrames[lucyRoam.direction]||lucyExactFrames.down;
    const step=lucyRoam.moving ? (Math.floor(lucyRoam.stepClock*8)%4) : 0;
    const img=dirFrames[step]||dirFrames[0];
    const maxH=88,maxW=Math.round(78*maxH/104); // Match hero height and retain Lucy’s proportions
    ctx.save();ctx.imageSmoothingEnabled=false;
    if(img&&img.complete&&img.naturalWidth){
      const scale=Math.min(maxW/img.naturalWidth,maxH/img.naturalHeight);
      const dw=Math.round(img.naturalWidth*scale),dh=Math.round(img.naturalHeight*scale);
      const bob=lucyRoam.moving?Math.sin(lucyRoam.stepClock*17)*0.65:0;
      ctx.drawImage(img,Math.round(x-dw/2),Math.round(y-dh+10+bob),dw,dh);
    }
    ctx.restore();
  }
  function updateLucyRoam(dt){
    if(interior!=='flower' || shopOpen || missionOpen || dialogOpen) return;
    if(document.getElementById('lucyCinematic')?.classList.contains('active')) return;
    dt=Math.max(0,Math.min(Number(dt)||0,0.04)); if(!dt) return; lucyRoam.idleClock += dt;
    if(window.SAActorRoutes?.drive('lucy',lucyRoam,dt))return;
    if(lucyRoam.wait>0){ lucyRoam.wait=Math.max(0,lucyRoam.wait-dt); lucyRoam.moving=false; return; }
    const dx=lucyRoam.targetX-lucyRoam.x, dy=lucyRoam.targetY-lucyRoam.y, distance=Math.hypot(dx,dy);
    if(distance<=1.2){ lucyRoam.x=lucyRoam.targetX; lucyRoam.y=lucyRoam.targetY; lucyRoam.moving=false; lucyRoam.stepClock=0; lucyRoam.wait=0.65+Math.random()*1.2; pickLucyTarget(); return; }
    // Move along one cardinal axis at a time; keep existing room bounds.
    const horizontal=Math.abs(dx)>1.2,rem=horizontal?dx:dy;
    const travel=Math.sign(rem)*Math.min(Math.abs(rem),lucyRoam.speed*dt);
    lucyRoam.direction=horizontal?(travel>0?'right':'left'):(travel>0?'down':'up'); lucyRoam.moving=travel!==0;
    if(horizontal)lucyRoam.x+=travel;else lucyRoam.y+=travel;
    lucyRoam.x=clamp(lucyRoam.x,360,545); lucyRoam.y=clamp(lucyRoam.y,280,420); if(lucyRoam.moving)lucyRoam.stepClock += dt;
  }

  const flowerBaseDrawV103 = drawInterior;
  const flowerShopDisplayClean=new Image();flowerShopDisplayClean.src='assets/v204_9c9704f326571a210c13fa48.png';
  drawInterior = function(){
    if(interior!=='flower'){flowerBaseDrawV103();return;}
    // Entire flower shop is drawn independently of Lucy's sprites, animation and quests.
    ctx.fillStyle='#1c191a';ctx.fillRect(0,0,900,680);
    ctx.fillStyle='#bca081';ctx.fillRect(49,80,802,500);
    // Warm brickwork, timber framing and flowering wall vines.
    for(let y=86;y<305;y+=30){for(let x=56-(Math.floor(y/30)%2)*29;x<845;x+=58){
      ctx.fillStyle=(Math.floor(x*0.31+y*0.17)%3===0)?'#dec8a7':'#ead8ba';ctx.fillRect(x+2,y+2,55,27);
      ctx.strokeStyle='#a68d73';ctx.lineWidth=1;ctx.strokeRect(x+2,y+2,55,27);
    }}
    ctx.fillStyle='#593b2b';ctx.fillRect(55,72,790,22);ctx.fillRect(55,287,790,18);
    // Planked wooden floor.
    ctx.fillStyle='#95623e';ctx.fillRect(55,305,790,273);
    for(let y=310;y<578;y+=27){ctx.fillStyle=(Math.floor(y/27)%2)?'#ac7851':'#875839';ctx.fillRect(55,y,790,2);
      for(let x=55+((Math.floor(y/27)%3)*55);x<845;x+=164){ctx.fillStyle='#70452f';ctx.fillRect(x,y+2,2,25);}}
    // Shop's carved border and ceiling timber.
    ctx.fillStyle='#3d2d29';ctx.fillRect(31,64,24,530);ctx.fillRect(845,64,24,530);ctx.fillRect(31,64,838,20);
    ctx.fillStyle='#70472e';ctx.fillRect(56,82,788,13);
    text("LUCY'S FLOWERS",450,49,31,'#ffe9b4');
    // Display sign and flower wall: no previous window or old counter underneath.
    ctx.fillStyle='#62402c';roundRect(92,112,307,48,7,'#65402d','#2e261f');
    text('✿ FRESH BLOOMS ✿',246,144,20,'#ffdda5');
    if(flowerShopDisplayClean.complete&&flowerShopDisplayClean.naturalWidth){ctx.save();ctx.imageSmoothingEnabled=true;ctx.drawImage(flowerShopDisplayClean,88,168,329,220);ctx.restore();}
    // Wooden wall shelves with jars, seed packets, and leafy pots.
    function shelf(x,y,width){ctx.fillStyle='#573820';ctx.fillRect(x,y,width,12);ctx.fillStyle='#bc8753';ctx.fillRect(x,y,width,5);
      ctx.fillStyle='#5b3a25';ctx.fillRect(x+13,y+12,10,17);ctx.fillRect(x+width-23,y+12,10,17);}
    shelf(534,145,251);shelf(534,226,251);
    for(let i=0;i<7;i++){let x=545+i*33;for(let j=0;j<2;j++){let y=112+j*81;
      ctx.fillStyle='#455c4a';ctx.fillRect(x,y,21,31);ctx.fillStyle='#a3bf9e';ctx.fillRect(x+3,y+6,15,18);
      ctx.fillStyle='#5a944e';ctx.fillRect(x+6,y+10,9,11);ctx.fillStyle='#c7b89d';ctx.fillRect(x+2,y-4,17,6);}}
    // Side merchandise tables and hanging baskets.
    shelf(648,375,153);shelf(93,407,116);
    const flowerColors=['#e89ac2','#f7d46e','#d7a5eb','#f5efcf','#e7a36d'];
    function potted(x,y,i,scale=1){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
      ctx.fillStyle='#825039';ctx.fillRect(-12,0,24,19);ctx.fillStyle='#b4774b';ctx.fillRect(-15,-3,30,6);
      ctx.fillStyle='#376c39';ctx.beginPath();ctx.ellipse(-10,-15,12,7,-.6,0,Math.PI*2);ctx.ellipse(10,-16,12,7,.6,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=flowerColors[i%flowerColors.length];for(let a=0;a<5;a++){let t=a*Math.PI*2/5;ctx.beginPath();ctx.arc(Math.cos(t)*6,-22+Math.sin(t)*6,6,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='#ffe2a0';ctx.beginPath();ctx.arc(0,-22,4,0,Math.PI*2);ctx.fill();ctx.restore();}
    for(let i=0;i<5;i++)potted(667+i*26,364,i,.75);
    for(let i=0;i<3;i++)potted(115+i*38,396,i+2,.85);
    for(let i=0;i<5;i++)potted(785,455+i*29,i,.73);
    for(let i=0;i<4;i++)potted(87,462+i*28,i+1,.73);
    // Decorative vine along ceiling, avoiding playable space.
    for(let x=72;x<832;x+=32){ctx.fillStyle='#33663a';ctx.beginPath();ctx.ellipse(x,92,19,8,(x%3-.5)*.2,0,Math.PI*2);ctx.fill();
      if(x%4===0){ctx.fillStyle='#fff0d1';ctx.beginPath();ctx.arc(x,96,5,0,Math.PI*2);ctx.fill();}}
    // Wooden sales counter and cash register, replacing old central table.
    ctx.fillStyle='#4b3026';ctx.fillRect(340,407,235,49);ctx.fillStyle='#b7804f';ctx.fillRect(329,400,257,15);
    ctx.fillStyle='#d2a071';ctx.fillRect(340,419,235,6);ctx.fillStyle='#393b3a';ctx.fillRect(526,377,34,24);
    ctx.fillStyle='#707a73';ctx.fillRect(530,382,26,12);ctx.fillStyle='#e9d6ad';ctx.fillRect(481,380,23,23);
    // Entrance rug.
    roundRect(283,488,334,83,6,'#345d45','#d1b781');roundRect(298,501,304,56,3,'#416f50','#b3a17a');
    text('✿',450,543,37,'#b9c78a');
    // Lucy's original rendering and motion remain unchanged.
    ctx.fillStyle='rgba(35,36,30,0.45)';ctx.beginPath();ctx.ellipse(lucyRoam.x,lucyRoam.y+11,26,8,0,0,Math.PI*2);ctx.fill();
    drawLucy(lucyRoam.x,lucyRoam.y);text('LUCY',lucyRoam.x,lucyRoam.y-94,18,'#fff0a3');
    if(!flowerConversationDone)text('!',lucyRoam.x,lucyRoam.y-120,30,'#ffd565');
    if(flowerDeliveryDone)text('✓',lucyRoam.x,lucyRoam.y-120,30,'#89ef9c');
    roundRect(369,586,162,72,7,'#203f35','#d9c584');text('EXIT ↓',450,620,21,'#f7f0c5');
    drawHero(player.x,player.y,player.dir,player.step);
    ctx.fillStyle='#ffffffd9';ctx.font='bold 16px system-ui';ctx.textAlign='center';
    ctx.fillText('Walk up to Lucy and press A to talk. Walk to the EXIT to leave.',450,660);
  };

  const lucyStyle=document.createElement('style');
  lucyStyle.textContent=`#lucyCinematic{position:fixed;inset:0;z-index:100140;display:none;align-items:center;justify-content:center;padding:12px;background:#101814ee;box-sizing:border-box;font-family:system-ui,sans-serif}#lucyCinematic.active{display:flex}#lucyCinematicStage{width:min(1100px,98vw);height:min(96dvh,850px);min-height:360px;position:relative;overflow:hidden;border:5px solid #7a5b39;border-radius:20px;box-shadow:0 0 0 3px #243227,0 18px 70px #000b;background:linear-gradient(180deg,#52704f 0%,#7d9865 34%,#b48866 71%,#624532 100%);color:#fff8da}#lucyCinematicStage:before{content:'';position:absolute;inset:0;pointer-events:none;opacity:.22;background:repeating-linear-gradient(90deg,transparent 0 110px,#27351f33 112px 118px),radial-gradient(circle at 18% 18%,#fff2c533 0 10%,transparent 22%),radial-gradient(circle at 82% 14%,#fff2c522 0 8%,transparent 18%)}#lucyCinematicTitle{position:absolute;left:0;right:0;top:2.3%;z-index:2;text-align:center;font-weight:1000;letter-spacing:1px;font-size:clamp(21px,4vw,38px);color:#fff0ae;text-shadow:3px 4px 0 #314228}#lucyCinematicArt{position:absolute;top:8%;height:60%;max-height:520px;width:100%;z-index:2;display:flex;align-items:center;justify-content:center}#lucyCinematicArt img{height:100%;width:auto;max-width:min(92%,560px);object-fit:contain;object-position:center center;image-rendering:pixelated;filter:drop-shadow(10px 13px 0 #18201170);animation:lucyReveal .20s ease-out}#lucyCinematicBox{position:absolute;bottom:2.6%;left:3%;right:3%;min-height:26%;z-index:4;border:4px solid #7a5a34;border-radius:13px;background:#f5e5bd;box-shadow:0 7px 0 #34291e;color:#342719;padding:clamp(12px,2.8vh,23px)}#lucyCinematicName{font-size:clamp(15px,2.5vw,24px);font-weight:1000;letter-spacing:.4px;color:#7a361f}#lucyCinematicLine{font-size:clamp(17px,3.4vw,31px);font-weight:900;margin-top:10px;line-height:1.24;min-height:2em}#lucyCinematicFooter{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:11px;font-weight:800;font-size:clamp(12px,1.5vw,16px);color:#745c45}#lucyCinematicNext{border:2px solid #533a24;border-radius:9px;background:#5d8b56;color:#fff2c8;padding:8px 19px;font-weight:900;cursor:pointer;min-height:42px}@keyframes lucyReveal{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}`;
  document.head.appendChild(lucyStyle);
  const lucyCinematic=document.createElement('div'); lucyCinematic.id='lucyCinematic'; lucyCinematic.setAttribute('role','dialog'); lucyCinematic.setAttribute('aria-modal','true'); lucyCinematic.setAttribute('aria-label','Lucy flower house cutscene');
  lucyCinematic.innerHTML=`<div id="lucyCinematicStage"><div id="lucyCinematicTitle">🌼 LUCY'S FLOWERS</div><div id="lucyCinematicArt"><img id="lucyCinematicSprite" alt="Lucy portrait"></div><div id="lucyCinematicBox"><div id="lucyCinematicName">LUCY</div><div id="lucyCinematicLine"></div><div id="lucyCinematicFooter"><span id="lucyCinematicProgress">1 / 3 · Press A or Enter</span><button type="button" id="lucyCinematicNext">NEXT ▶</button></div></div></div>`; document.body.appendChild(lucyCinematic);
  const lucyLines=["Hi, I'm Lucy. Gran's funeral is today and I completely forgot the flowers.","I'm panicking a bit… could you help me find a bouquet somewhere in Leaf Town?","Thank you so much. If you find them, bring them straight back to me."]; const lucyPortraitCache=[];
  function lucyHideScene(){ lucyCinematic.classList.remove('active'); }
  function buildLucyPortrait(step){ const idx=Math.max(0,Math.min(Number(step)||0,lucyPortraits.length-1)); return lucyPortraits[idx] || ''; }
  function lucyRenderScene(){ const step=Math.max(0,flowerCutsceneIndex); lucyCinematic.classList.add('active'); document.getElementById('lucyCinematicLine').textContent=lucyLines[step]||''; document.getElementById('lucyCinematicProgress').textContent=(step+1)+' / '+lucyLines.length+' · Press A or Enter'; document.getElementById('lucyCinematicNext').textContent=(step>=lucyLines.length-1?'FINISH ▶':'NEXT ▶'); document.getElementById('lucyCinematicSprite').src=buildLucyPortrait(Math.min(step,2)); }
  advanceFlowerCutscene=function(){ flowerCutsceneIndex++; if(flowerCutsceneIndex>=lucyLines.length){ flowerCutsceneIndex=-1; flowerConversationDone=true; lucyHideScene(); closeDialog(); missionList(); return; } keys.clear(); closeDialog(); lucyRenderScene(); };
  document.getElementById('lucyCinematicNext').addEventListener('click',()=>{ if(lucyCinematic.classList.contains('active')) advanceFlowerCutscene(); });
  addEventListener('keydown',e=>{ if(!lucyCinematic.classList.contains('active')) return; if(['a','A','Enter',' '].includes(e.key)){ e.preventDefault(); e.stopImmediatePropagation(); advanceFlowerCutscene(); }},true);
  document.getElementById('action').addEventListener('pointerdown',e=>{ if(!lucyCinematic.classList.contains('active')) return; e.preventDefault(); e.stopImmediatePropagation(); advanceFlowerCutscene(); },true);

  collectQuestBouquet=function(){ if(!flowerConversationDone){show('💐 FLOWERS','These look lovely, but speak to Lucy at the flower house first.');return;} if(flowerBouquetCollected||flowerDeliveryDone)return; flowerBouquetCollected=true; inventory.funeralFlowers=1; keys.clear(); show('💐 BOUQUET FOUND','You found a bouquet! Added to your inventory. Take it back to Lucy.'); missionList(); };
  deliverQuestBouquet=function(){ if(flowerDeliveryDone){show('🌼 LUCY','Thank you again for helping my family.');return;} if(!flowerBouquetCollected){show('🌼 LUCY','Have you found any flowers yet? I really need them for Gran’s funeral.');return;} flowerBouquetCollected=false; flowerDeliveryDone=true; inventory.funeralFlowers=0; coins+=30; v44RefreshWallet(); v44RefreshBag(); const earned=[]; for(const id of collection){ const p=progressFor(id); const gained=15; const oldLevel=p.level; p.xp+=gained; while(p.level<100 && p.xp>=xpNeeded(p.level)){ p.xp-=xpNeeded(p.level); p.level++; p.bonuses=p.bonuses.map(v=>v+2); } earned.push(CREATURES[id].name+' +15 XP'+(p.level>oldLevel?' (LEVEL UP!)':'')); } missionList(); keys.clear(); show('🌼 FLOWERS DELIVERED','Thank you so much! You earned £30! '+(earned.length?'Your strains gained XP: '+earned.join(', ')+'.':'Your strains will earn XP when you have collected one.')+' Find Her Flowers is now FINISHED.'); };

  const enterRoomBeforeV103 = enterRoom; enterRoom=function(kind){ enterRoomBeforeV103(kind); if(kind==='flower'){ resetLucyRoam(); document.querySelector('#hud strong').textContent="🌼 LUCY'S FLOWERS"; closeDialog(); show("🌼 LUCY'S FLOWERS",'Lucy is walking around inside. Go chat to her!'); } };
  const interactBeforeV103 = interact; interact=function(){ if(lucyCinematic.classList.contains('active')){ advanceFlowerCutscene(); return; } if(interior==='flower' && !dialogOpen && !shopOpen && !missionOpen){ if(player.y>555 && player.x>335 && player.x<565){ leaveRoom(); return; } if(lucyNearOwner()){ if(!flowerConversationDone){ flowerCutsceneIndex=-1; advanceFlowerCutscene(); } else { deliverQuestBouquet(); } return; } show("🌼 LUCY'S FLOWERS",'Walk up to Lucy and press A. Walk to EXIT at the bottom to leave.'); return; } interactBeforeV103(); };

  // V110 cabin regression guard: preserve the new outdoor cabin artwork, but
  // ensure its interior NPC and mission work independently of later house overrides.
  const cabinDrawBeforeV110 = drawInterior;
  drawInterior = function(){
    cabinDrawBeforeV110();
    if(interior !== 'cabin') return;
    // 32 clean walking frames, 8 per direction: down, up, left, right.
    // Gentle cabin patrol returns near the mission interaction point.
    const elapsed=performance.now()/1000;
    const phase=elapsed%13;
    let cx=452,footY=375,dir=0,walking=true;
    if(phase<2.5){cx=452+phase*30;dir=3;}
    else if(phase<3.2){cx=527;dir=0;walking=false;}
    else if(phase<6.7){cx=527-(phase-3.2)*43;dir=2;}
    else if(phase<7.4){cx=376.5;dir=0;walking=false;}
    else if(phase<9.9){cx=376.5+(phase-7.4)*30.2;dir=3;}
    else if(phase<10.6){cx=452;dir=0;walking=false;}
    else if(phase<11.7){footY=375-(phase-10.6)*22;dir=1;}
    else {footY=350.8+(phase-11.7)*18.62;dir=0;}
    const routeSpot=window.SAActorRoutes?.point('woodland-hobo',cx,footY);
    if(routeSpot?.custom){cx=routeSpot.x;footY=routeSpot.y;dir=['down','up','left','right'].indexOf(routeSpot.direction);walking=routeSpot.moving;}
    const lookup=[0,2,4,6];
    const frame=walking?lookup[Math.floor(elapsed*8)%4]:0;
    const img=woodlandHoboCabinFrames[dir*8+frame];
    ctx.save();
    ctx.fillStyle='rgba(35,29,25,.3)';
    ctx.beginPath();ctx.ellipse(cx,footY+2,23,6,0,0,Math.PI*2);ctx.fill();
    if(img&&img.complete&&img.naturalWidth>0){
      const dh=88,dw=Math.round(dh*img.naturalWidth/img.naturalHeight);
      ctx.imageSmoothingEnabled=false;
      ctx.drawImage(img,Math.round(cx-dw/2),Math.round(footY-dh+(walking?Math.sin(elapsed*17)*0.65:0)),dw,dh);
    }else{
      ctx.fillStyle='#52623a';ctx.fillRect(cx-18,footY-57,36,43);
      ctx.fillStyle='#d0a17c';ctx.fillRect(cx-12,footY-78,24,23);
    }
    text('WOODLAND HOBO',cx,footY-114,18,'#fff0b7');
    text(cabinMissionFinished?'✓':'!',cx,footY-137,27,cabinMissionFinished?'#a2ffc0':'#ffe479');
    ctx.restore();
  };
  const cabinEnterBeforeV110=enterRoom;
  enterRoom=function(kind){
    cabinEnterBeforeV110(kind);
    if(kind!=='cabin')return;
    // Earlier wrappers may show a small dialog or skip the cutscene; enforce the
    // full-screen cinematic only when this mission has not yet been started.
    // Do not auto-launch Woodland Hobo's cutscene on entering the cabin.
  };
  const cabinInteractBeforeV110=interact;
  interact=function(){
    if(interior==='cabin' && !cabinRiddleVisible && !hoboCinematic.classList.contains('active') && !battle){
      if(dialogOpen){closeDialog();return;}
      if(player.y>540 && player.x>325 && player.x<575){leaveRoom();return;}
      const hoboPoint=window.SAActorRoutes?.point('woodland-hobo',452,375)||{x:452,y:375};
      if(Math.hypot(player.x-hoboPoint.x,player.y-(hoboPoint.y-20))<145){
        if(cabinMissionFinished){show('🌲 WOODLAND HOBO','You already finished my challenge. Now get out of my cabin!');return;}
        if(cabinRiddleFailed){cabinStartBattle();return;}
        if(!cabinCutsceneSeen){cabinCutsceneStep=-1;cabinAdvanceScene();return;}
        cabinStartRiddle();return;
      }
    }
    cabinInteractBeforeV110();
  };

  const moveBeforeV103 = move; move=function(dt){ const lucySceneActive = lucyCinematic.classList.contains('active'); if(lucySceneActive) return; const suppressFlowerAutotalk = (interior==='flower' && !flowerConversationDone); const savedFlowerDone = flowerConversationDone; if(suppressFlowerAutotalk) flowerConversationDone = true; moveBeforeV103(dt); if(suppressFlowerAutotalk) flowerConversationDone = savedFlowerDone; updateLucyRoam(dt); };
})();
