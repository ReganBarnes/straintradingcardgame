
// V158 — Ball Dee replaces the Local Trainer, uses exact tight transparent sprites,
// and patrols the Leaf Town grey paths only.
(function(){
  const ballDeeFrameData={
    down:['assets/v204_83b4315e5359a48bca32c91c.png','assets/v204_34045a0dd728ab0350438287.png','assets/v204_a71e2a04db7b2c5e5c93e432.png','assets/v204_0c82c72e274f428f90ac8bbe.png'],
    left:['assets/v204_a94deb0d44457873a3bffda3.png','assets/v204_4eea67cc76bc74dff41d5e17.png','assets/v204_9f4b3e23ca9f4087f974a66b.png','assets/v204_a4ef4d2d515eaa5a40e17512.png'],
    right:['assets/v204_6bbc4f1726b7d0c03e0ad45d.png','assets/v204_dbe4cb921c9f05c57b494e86.png','assets/v204_701829957fcb9d6c97921dae.png','assets/v204_8c3de84c544144d8e7b60ca8.png'],
    up:['assets/v204_43ff3beab599dce9efc95425.png','assets/v204_9acd3889329c6e65f7d4c531.png','assets/v204_02df2e8a780f62fd88094a80.png','assets/v204_39e45c6fc73a5f276d04142d.png']
  };
  const ballDeeFrames=Object.fromEntries(Object.entries(ballDeeFrameData).map(([dir,arr])=>[dir,arr.map(src=>{const img=new Image();img.src=src;return img;})]));
  const allBallDeeFrames=Object.values(ballDeeFrames).flat();
  const ballDeeState={
    route:[
      {x:680,y:621},
      {x:420,y:621},
      {x:420,y:531},
      {x:420,y:621},
      {x:760,y:621},
      {x:1090,y:621},
      {x:1090,y:531},
      {x:1090,y:621},
      {x:760,y:621},
      {x:760,y:845},
      {x:760,y:621}
    ],
    targetIndex:1,
    direction:'left',
    stepClock:0,
    moving:true,
    wait:0,
    speed:66,
    targetMaxH:98,
    scale:0.36,
    ready:false
  };
  // Lock the NPC onto the route origin.
  npc.x=ballDeeState.route[0].x;
  npc.y=ballDeeState.route[0].y;

  function refreshBallDeeScale(){
    let maxH=0;
    for(const img of allBallDeeFrames){ if(img.complete&&img.naturalHeight) maxH=Math.max(maxH,img.naturalHeight); }
    if(maxH>0){ ballDeeState.scale=ballDeeState.targetMaxH/maxH; ballDeeState.ready=true; }
  }
  allBallDeeFrames.forEach(img=>{ img.addEventListener('load',refreshBallDeeScale); });
  refreshBallDeeScale();

  function updateBallDee(dt){
    if(interior || dialogOpen || shopOpen || missionOpen || cottagePuzzleOpen || oldLadyPinOpen || battle) return;
    dt=Math.max(0,Math.min(Number(dt)||0,0.05));
    if(!dt) return;
    if(window.SAActorRoutes?.drive('ball-dee',npc,dt,ballDeeState))return;
    if(ballDeeState.wait>0){
      ballDeeState.wait=Math.max(0,ballDeeState.wait-dt);
      ballDeeState.moving=false;
      return;
    }
    const target=ballDeeState.route[ballDeeState.targetIndex];
    const dx=target.x-npc.x, dy=target.y-npc.y;
    const distLeft=Math.hypot(dx,dy);
    if(distLeft<=1.2){
      npc.x=target.x; npc.y=target.y;
      ballDeeState.moving=false;
      ballDeeState.stepClock=0;
      ballDeeState.wait=0.22;
      ballDeeState.targetIndex=(ballDeeState.targetIndex+1)%ballDeeState.route.length;
      return;
    }
    let mx=0,my=0;
    if(Math.abs(dx)>0.8){
      mx=Math.sign(dx)*Math.min(Math.abs(dx),ballDeeState.speed*dt);
      ballDeeState.direction=mx>0?'right':'left';
    }else if(Math.abs(dy)>0.8){
      my=Math.sign(dy)*Math.min(Math.abs(dy),ballDeeState.speed*dt);
      ballDeeState.direction=my>0?'down':'up';
    }
    npc.x+=mx; npc.y+=my;
    ballDeeState.moving=!!(mx||my);
    if(ballDeeState.moving) ballDeeState.stepClock+=dt;
  }

  const moveBeforeBallDee=move;
  move=function(dt){
    moveBeforeBallDee(dt);
    updateBallDee(dt);
  };

  window.drawBallDee=function(){
    const dir=ballDeeFrames[ballDeeState.direction] ? ballDeeState.direction : 'down';
    const frames=ballDeeFrames[dir];
    const frameIndex=ballDeeState.moving ? (Math.floor(ballDeeState.stepClock*7)%4) : 0;
    const img=frames[frameIndex]||frames[0];
    const scale=ballDeeState.scale;
    let dw=49,dh=88;
    if(img && img.complete && img.naturalWidth){
      dh=88;
      dw=Math.max(1,Math.round(img.naturalWidth*(dh/img.naturalHeight)));
    }
    const x=Math.round(npc.x), y=Math.round(npc.y);
    ctx.save();
    ctx.imageSmoothingEnabled=false;
    // Shadow kept close to the feet so Ball Dee looks grounded on the cobbles.
    ctx.fillStyle='rgba(22,30,28,0.42)';
    ctx.beginPath();
    ctx.ellipse(x, y+4, Math.max(13,Math.round(dw*0.23)), Math.max(4,Math.round(dw*0.07)), 0, 0, Math.PI*2);
    ctx.fill();
    if(img && img.complete && img.naturalWidth){
      ctx.drawImage(img, Math.round(x-dw/2), Math.round(y-dh), dw, dh);
    }
    ctx.restore();
    ctx.save();
    ctx.fillStyle='#fff6c8';
    ctx.strokeStyle='#243325';
    ctx.lineWidth=4;
    ctx.font='900 17px system-ui';
    ctx.textAlign='center';
    ctx.strokeText('BALL DEE',x,y-dh-14);
    ctx.fillText('BALL DEE',x,y-dh-14);
    ctx.fillStyle='#ffe879';
    ctx.strokeStyle='#382d1a';
    ctx.lineWidth=3;
    ctx.font='900 28px system-ui';
    ctx.strokeText('!',x,y-dh-34);
    ctx.fillText('!',x,y-dh-34);
    ctx.restore();
  };
})();


// V159 — Reth Sogan cinematic dialogue portraits using the provided expression sprites.
(function(){
  const rethStyle=document.createElement('style');
  rethStyle.textContent=`
#rethScene{position:fixed;inset:0;z-index:100001;background:rgba(7,13,28,.94);display:none;align-items:center;justify-content:center;padding:12px;box-sizing:border-box;font-family:system-ui,Arial,sans-serif}
#rethScene.active{display:flex}
#rethStage{width:min(940px,98vw);height:min(670px,95dvh);min-height:420px;position:relative;overflow:hidden;border:6px solid #57412b;border-radius:15px;background:linear-gradient(170deg,#e7d8be 0%,#fbf3e2 56%,#a5c08e 57%,#75925f 100%);box-shadow:0 18px 80px #000b}
#rethStage:before{content:'';position:absolute;left:6%;right:6%;bottom:25%;height:18%;border:7px solid #7d6546;border-radius:50%;background:#d8c7a8;opacity:.92}
#rethStage .rethPortrait{position:absolute;left:50%;top:4%;transform:translateX(-50%);width:clamp(260px,48vw,460px);height:62%;overflow:visible;display:flex;align-items:center;justify-content:center;animation:rethPop .24s ease-out}
#rethStage .rethPortrait img{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;image-rendering:pixelated;filter:drop-shadow(6px 12px 0 #3f302244)}
#rethStage .rethBox{position:absolute;bottom:3%;left:3%;right:3%;min-height:26%;border:6px solid #6c5439;border-radius:14px;background:#fff9ef;color:#3b2d1f;padding:16px 20px 12px;box-sizing:border-box;box-shadow:0 5px 0 #302417}
#rethStage .rethName{font-size:clamp(13px,2.1vw,20px);font-weight:900;color:#785f43;letter-spacing:1px;margin-bottom:9px}
#rethStage .rethLine{font-size:clamp(17px,3vw,29px);font-weight:900;line-height:1.28;min-height:2.3em}
#rethStage .rethNext{display:flex;align-items:center;justify-content:flex-end;gap:12px;margin-top:8px;font-weight:800;font-size:13px;color:#6d573c}
#rethStage .rethNext button{border:2px solid #50361e;background:#7e5a2f;color:white;border-radius:8px;font-weight:900;padding:7px 19px;cursor:pointer}
@keyframes rethPop{from{transform:translateX(-50%) scale(.87);opacity:.1}to{transform:translateX(-50%) scale(1);opacity:1}}
@media(max-height:520px){#rethStage .rethPortrait{height:50%}#rethStage .rethBox{min-height:38%}}
  `;
  document.head.appendChild(rethStyle);

  const rethScene=document.createElement('div');
  rethScene.id='rethScene';
  rethScene.innerHTML=`<div id="rethStage"><div class="rethPortrait"><img id="rethSceneImage" alt="Reth Sogan expression"></div><div class="rethBox"><div class="rethName" id="rethSceneName">RETH SOGAN</div><div class="rethLine" id="rethSceneLine"></div><div class="rethNext"><span id="rethSceneProgress">Press A or NEXT</span><button type="button" id="rethSceneNext">NEXT ▶</button></div></div></div>`;
  document.body.appendChild(rethScene);

  const rethSceneImage=document.getElementById('rethSceneImage');
  const rethSceneLine=document.getElementById('rethSceneLine');
  const rethSceneName=document.getElementById('rethSceneName');
  const rethSceneProgress=document.getElementById('rethSceneProgress');
  const rethSceneNext=document.getElementById('rethSceneNext');
  let rethSceneActive=false;

  const rethPortraits={
    happy:'assets/v204_695556c77b2e695577c5b7a4.png',
    surprised:'assets/v204_6afd8f46f2fa51ba92d80e1b.png',
    cheery:'assets/v204_00260438f59c8133658b9b4e.png',
    laugh:'assets/v204_2b1ce752427b72f230db7dac.png',
    smoke:'assets/v204_6eb37181abae8a6436535959.png',
    worried:'assets/v204_f30e58d1e5c8da50c04cd258.png',
    angry:'assets/v204_c98bb040cef28e49798de5e5.png',
    confused:'assets/v204_5d996e2ae6c53d246b258bf3.png',
    pleading:'assets/v204_90a215642ad27dee8c6d8aab.png',
    sleepy:'assets/v204_15ecebdbaff71a407c3f11c6.png'
  };

  function pickRethPortrait(title,message){
    if(typeof lighterCutsceneAt==='number'&&lighterCutsceneAt>=0){
      if(lighterCutsceneAt===0) return rethPortraits.angry;
      if(lighterCutsceneAt===1) return rethPortraits.confused;
      if(lighterCutsceneAt===2) return rethPortraits.pleading;
    }
    const line=(message||'').toLowerCase();
    if(line.includes("that's my lighter")||line.includes('thank you')) return rethPortraits.laugh;
    if(line.includes('thanks again')) return rethPortraits.happy;
    if(line.includes('no luck yet')) return rethPortraits.worried;
    return rethPortraits.cheery;
  }

  function openRethScene(title,message){
    clearTimeout(welcomeTimeout);
    dialogOpen=true;
    rethSceneActive=true;
    document.getElementById('dialog').style.display='none';
    rethScene.classList.add('active');
    rethSceneName.textContent=title==='🔥 MISSION COMPLETE'?'RETH SOGAN · MISSION COMPLETE':'RETH SOGAN';
    rethSceneLine.textContent=message||'';
    rethSceneImage.src=pickRethPortrait(title,message);
    if(typeof lighterCutsceneAt==='number'&&lighterCutsceneAt>=0){
      rethSceneProgress.textContent=(lighterCutsceneAt+1)+' / '+lighterDialogue.length+' · Press A or NEXT';
      rethSceneNext.textContent=lighterCutsceneAt>=lighterDialogue.length-1?'FINISH ▶':'NEXT ▶';
    }else{
      rethSceneProgress.textContent='Press A or CLOSE';
      rethSceneNext.textContent='CLOSE ▶';
    }
  }

  function hideRethScene(){
    if(!rethSceneActive) return;
    rethSceneActive=false;
    rethScene.classList.remove('active');
  }

  const baseShow=show;
  show=function(title,message){
    if(title==='👨 RETH SOGAN' || (title==='🔥 MISSION COMPLETE' && /lighter/i.test(message||''))){
      openRethScene(title,message);
      return;
    }
    hideRethScene();
    return baseShow(title,message);
  };

  const baseCloseDialog=closeDialog;
  closeDialog=function(){
    hideRethScene();
    return baseCloseDialog();
  };


  // Dedicated action navigation while this dialogue is active. Other scenes remain unchanged.
  function advanceRethScene(){
    if(!rethSceneActive) return;
    if(typeof lighterCutsceneAt==='number'&&lighterCutsceneAt>=0){ lighterAdvanceConversation(); return; }
    closeDialog();
  }
  window.addEventListener('keydown',e=>{
    if(!rethSceneActive) return;
    if(['a','A','Enter',' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Escape'].includes(e.key)){
      e.preventDefault();e.stopImmediatePropagation();
      if(!e.repeat && ['a','A','Enter',' '].includes(e.key)) advanceRethScene();
    }
  },true);
  document.getElementById('action').addEventListener('pointerdown',e=>{
    if(!rethSceneActive) return;
    e.preventDefault();e.stopImmediatePropagation();advanceRethScene();
  },true);

  rethSceneNext.addEventListener('click',advanceRethScene);
})();

