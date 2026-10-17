
// V131 Fluid Walking Upgrade for all non-Norm character walkers.
(function(){
  const movingKeys=()=>keys.has('left')||keys.has('right')||keys.has('up')||keys.has('down')||keys.has('ArrowLeft')||keys.has('ArrowRight')||keys.has('ArrowUp')||keys.has('ArrowDown')||keys.has('w')||keys.has('a')||keys.has('s')||keys.has('d');

  const heroFluidFrames={
    down:[0,1,2,3].map(i=>{const img=new Image();img.src=["assets/v204_f18d6f769b9a0a4ed95867f1.png","assets/v204_5d76519679cc54a68759f32b.png","assets/v204_ea1edd25ba553d718a4890aa.png","assets/v204_3557f95ab26492a8ba14d341.png"][i];return img;}),
    up:[0,1,2,3].map(i=>{const img=new Image();img.src=["assets/v204_f8705fb3235cf82fa5cdfb42.png","assets/v204_1771e569a7e3922a874a8169.png","assets/v204_0de06d8bebcac3881cbedfa8.png","assets/v204_fb03cb75940db300995ca647.png"][i];return img;}),
    left:[0,1,2,3].map(i=>{const img=new Image();img.src=["assets/v204_75d6be9e4c98de57e59abd97.png","assets/v204_02b338d9a681857eee52028c.png","assets/v204_9960ae6faa6d174c8ac50329.png","assets/v204_aef354ed5ffefed85b3681bf.png"][i];return img;}),
    right:[0,1,2,3].map(i=>{const img=new Image();img.src=["assets/v204_673b462926dbeaaac3c997a7.png","assets/v204_a86d6e35a5571bbf6577d529.png","assets/v204_24b32d2391bf95061c6da8bd.png","assets/v204_2eeb7299ee0b5a176a989f62.png"][i];return img;})
  };
  drawHero=function(x,y,dir,step){
    const moving=movingKeys();
    const frames=heroFluidFrames[dir]||heroFluidFrames.down;
    const frame=moving?Math.floor(step*8)%4:0;
    const img=frames[frame]||frames[0]||heroFrontImage;
    const displayW=56,displayH=88; // Original hero drawing size
    ctx.save();ctx.imageSmoothingEnabled=false;
    if(img&&img.complete&&img.naturalWidth){
      ctx.drawImage(img,Math.round(x-displayW/2),Math.round(y-66+(moving?Math.sin(step*17)*0.65:0)),displayW,displayH);
    }else if(heroFrontImage.complete&&heroFrontImage.naturalWidth){
      ctx.drawImage(heroFrontImage,Math.round(x-displayW/2),Math.round(y-66),displayW,displayH);
    }
    ctx.restore();
    text('YOU',x,y-74,12,'#e9ff9b');
  };

  const staffFluidFrames={
    down:[0,1,2,3].map(i=>{const img=new Image();img.src=['assets/v204_e4db2705a3663d5a16d9af75.png','assets/v204_39592a79464f65181944ff58.png','assets/v204_b82b57a39cb48cfcdd553005.png','assets/v204_274e810d2b19f21979889a77.png'][i];return img;}),
    up:[0,1,2,3].map(i=>{const img=new Image();img.src=['assets/v204_00a3329657edf08a3b19b358.png','assets/v204_5e97087479a4761fba131d1a.png','assets/v204_ec1581c8f71d214ef91b757e.png','assets/v204_6dfa3f36f8b6056bb3d26c2f.png'][i];return img;}),
    left:[0,1,2,3].map(i=>{const img=new Image();img.src=['assets/v204_8970926c8775ba0e2362afa8.png','assets/v204_210e4a0b9ea3a7cb73775fdb.png','assets/v204_4601396562d865628f5a2558.png','assets/v204_3167838dfa9afa0519310700.png'][i];return img;}),
    right:[0,1,2,3].map(i=>{const img=new Image();img.src=['assets/v204_de6357d5b5157b0d6af0a789.png','assets/v204_301423cf9977f1c65537dbf8.png','assets/v204_939093300fccc92590036e9d.png','assets/v204_6ccddbab1d4adfe611fc5a65.png'][i];return img;})
  };
  staff.anim=staff.anim||0;
  updateStaff=function(dt){
    if(interior!=='cure'||shopOpen||cUI.style.display==='flex')return;
    dt=Math.max(0,Math.min(Number(dt)||0,0.04)); if(!dt)return;
    if(window.SAActorRoutes?.drive('sue',staff,dt))return;
    if(staff.wait>0){staff.wait=Math.max(0,staff.wait-dt);return;}
    const dx=staff.targetX-staff.x,dy=staff.targetY-staff.y,d=Math.hypot(dx,dy);
    if(d<7){staff.wait=.5+Math.random()*1.1;for(let i=0;i<35;i++){
      const tx=360+Math.random()*175,ty=365+Math.random()*170;
      if(!cureSolid(tx,ty,19)&&Math.hypot(tx-player.x,ty-player.y)>30){staff.targetX=tx;staff.targetY=ty;break;}
    }return;}
    // Straight corridor segments: horizontal first, then vertical.
    const horizontal=Math.abs(dx)>1;
    const remaining=horizontal?dx:dy;
    const travel=Math.sign(remaining)*Math.min(Math.abs(remaining),74*dt);
    const nx=staff.x+(horizontal?travel:0),ny=staff.y+(horizontal?0:travel);
    if(!cureSolid(nx,ny,17)&&Math.hypot(nx-player.x,ny-player.y)>30){
      staff.x=nx;staff.y=ny;staff.dir=horizontal?(travel>0?'right':'left'):(travel>0?'down':'up');
      staff.anim+=dt;
    }else{staff.targetX=staff.x;staff.targetY=staff.y;staff.wait=.35;}
  };
  drawStaff=function(){
    const x=staff.x,y=staff.y;
    const moving=Math.hypot(staff.targetX-staff.x,staff.targetY-staff.y)>7&&staff.wait<=0;
    const frames=staffFluidFrames[staff.dir]||staffFluidFrames.down;
    const img=frames[moving?(Math.floor(staff.anim*8)%4):0]||frames[0];
    const displayH=88,displayW=Math.round(96/128*displayH);
    ctx.save();ctx.imageSmoothingEnabled=false;
    ctx.fillStyle='rgba(3,17,14,.34)';ctx.beginPath();ctx.ellipse(x,y+8,15,5,0,0,Math.PI*2);ctx.fill();
    if(img&&img.complete&&img.naturalWidth){ctx.drawImage(img,Math.round(x-displayW/2),Math.round(y-displayH+10+(moving?Math.sin(staff.anim*17)*.65:0)),displayW,displayH);}
    ctx.restore();text('SUE',x,y-78,12,'#e9ffbe');
  };



})();

// V141 - Cure Shop artwork and interaction mapping ONLY.
// The underlying 900 x 680 room, save state, characters, shop inventory,
// healing mechanics, missions, dialogue and all other scene functions stay intact.
(()=>{
  const cureBackgroundV141 = new Image();
  cureBackgroundV141.src = 'assets/v204_938e09df7528bca0ca71b6c9.png';
  const cureCounterFootprintsV141 = {
    heal: [72,185,363,137],          // top-left large counter
    shop: [515,219,325,110],         // top-right large counter
    displayLeft: [67,390,286,137],  // bottom-left decorative display
    displayRight: [555,390,285,137]  // bottom-right decorative display
  };
  const cureOldSolidV141 = cureSolid;
  cureSolid = function(x,y,pad=0){
    if(interior!=='cure') return cureOldSolidV141(x,y,pad);
    return Object.values(cureCounterFootprintsV141).some(([bx,by,bw,bh]) =>
      x>bx-pad && x<bx+bw+pad && y>by-pad && y<by+bh+pad
    );
  };
  // The lighter must stay collectable; the new lower-right island visually
  // occupies its previous coordinates. Shift it slightly into the center aisle.
  lighterSpots.cure.x=530;
  lighterSpots.cure.y=459;
  function counterDistanceV141(box){
    const [x,y,w,h]=box;
    return Math.hypot(player.x-Math.max(x,Math.min(player.x,x+w)),
                      player.y-Math.max(y,Math.min(player.y,y+h)));
  }
  function nearCounterV141(key){
    const b=cureCounterFootprintsV141[key];
    // Approach a counter from its customer-facing side, not through a wall.
    return player.y>=b[1]+b[3]-24 &&
           player.y<=b[1]+b[3]+104 &&
           counterDistanceV141(b)<=107;
  }
  function cureCounterLabelV141(message,centerX,baseline,selected){
    ctx.save();
    ctx.font='900 17px system-ui';
    ctx.textAlign='center';
    const width=Math.ceil(ctx.measureText(message).width)+30;
    const left=centerX-width/2;
    ctx.fillStyle=selected?'rgba(5,54,38,.94)':'rgba(5,24,24,.85)';
    ctx.strokeStyle=selected?'#78ffb0':'rgba(182,253,209,.8)';
    ctx.lineWidth=selected?2.8:1.3;
    ctx.shadowColor=selected?'#62ffaa':'#0e6e5e';ctx.shadowBlur=selected?12:5;
    ctx.beginPath();ctx.roundRect(left,baseline-23,width,31,9);
    ctx.fill();ctx.stroke();ctx.shadowBlur=0;
    ctx.fillStyle=selected?'#d6ffe1':'#e9f5d6';ctx.fillText(message,centerX,baseline-2);
    ctx.restore();
  }
  const cureOldDrawV141=drawInterior;
  drawInterior=function(){
    if(interior!=='cure'){cureOldDrawV141();return;}
    ctx.save();
    ctx.fillStyle='#071b1c';ctx.fillRect(0,0,900,680);
    if(cureBackgroundV141.complete && cureBackgroundV141.naturalWidth){
      ctx.imageSmoothingEnabled=true;
      // Fit the supplied complete scene to the CURRENT logical Cure Shop room.
      // No changes to the room dimensions, entrance or world camera.
      ctx.drawImage(cureBackgroundV141,0,0,900,680);
    }else{
      // In the unlikely event of an asset load failure, retain the playable room.
      ctx.fillStyle='#214439';ctx.fillRect(38,38,824,592);
    }
    cureCounterLabelV141('HEAL HERE  ·  A',250,349,nearCounterV141('heal'));
    cureCounterLabelV141('PRESS A TO SHOP',666,366,nearCounterV141('shop'));
    drawStaff();
    // Preserve the original missing-lighter quest pickup and player sprite.
    lighterDrawPickup();
    drawHero(player.x,player.y,player.dir,player.step);
    ctx.save();ctx.fillStyle='rgba(5,25,22,.80)';
    ctx.fillRect(393,647,114,23);ctx.restore();
    text('EXIT ↓',450,665,16,'#e3f8d6');
    ctx.restore();
  };
  const cureOldInteractV141=interact;
  interact=function(){
    if(interior!=='cure')return cureOldInteractV141();
    // Cure Shop dialogues must be dismissed BEFORE older counter handlers run.
    // Earlier wrappers can otherwise reopen the heal popup on the same A press.
    if(dialogOpen){closeDialog();keys.clear();return;}
    // Preserve the game's existing handling of non-dialogue overlays.
    if(shopOpen||missionOpen||cUI.style.display==='flex'||
       (typeof battle!=='undefined'&&battle)||
       (typeof bagPackOverlay!=='undefined'&&bagPackOverlay.classList.contains('open'))){
      return cureOldInteractV141();
    }
    // Reuse the existing mission pickup before checking shop hotspots.
    if(lighterCollect())return;
    if(player.y>555 && player.x>335 && player.x<565){leaveRoom();return;}
    if(nearCounterV141('heal')){
      player.hp=100;updateHUD();
      syncCreatureHealth();
      for(const id of collection)creatureHealth[id]=maxHealth(id);
      show('🌿 STRAINS HEALED','Your strains have been fully healed.');
      return;
    }
    if(nearCounterV141('shop')){openShop();return;}
    show('🌿 CURE SHOP','Approach the upper-left counter to heal or the upper-right counter to shop. Press A to interact.');
  };
})();


// V143 — restore the missing lighter after newer flower/cottage room redraws.
// Their custom room renderers replaced the original pickup drawing hook.
(function(){
  const drawBeforeLighterV143=drawInterior;
  drawInterior=function(){
    drawBeforeLighterV143();
    if((interior==='flower'||interior==='cottage') &&
       typeof lighterDrawPickup==='function' && lighterQuestActive() && !lighterFound){
      lighterDrawPickup();
      // Keep the hero in front when passing the collectible.
      drawHero(player.x,player.y,player.dir,player.step);
    }
  };
  const interactBeforeLighterV143=interact;
  interact=function(){
    if((interior==='flower'||interior==='cottage') &&
       !dialogOpen && !shopOpen && !missionOpen &&
       typeof lighterCollect==='function' && lighterCollect())return;
    return interactBeforeLighterV143();
  };
})();
