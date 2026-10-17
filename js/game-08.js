
/* Isolated replacement; main game script remains byte-identical. */
try {
if (typeof STAR_DAWG_MOVE_FRAMES !== 'undefined') {
STAR_DAWG_MOVE_FRAMES.orbit_player = ["assets/v204_fb3d25c82b95930b58d114da.png", "assets/v204_dad85234a396f8305943aa8e.png", "assets/v204_60c66ef1d45a7d3463763e0a.png", "assets/v204_17c31089b3c1706a6c3f770b.png", "assets/v204_59ed0f79ae78e1c283eada31.png", "assets/v204_e6e51956ebda4aab200ec00b.png", "assets/v204_04c2fadc8ac35607baf6bc6d.png", "assets/v204_5a5e283e4aef0137628aa40d.png", "assets/v204_d6725460c2643b0d49a2933f.png", "assets/v204_eb4c05adb5c8ebbe584bc7c0.png"];
STAR_DAWG_MOVE_FRAMES.orbit_enemy = ["assets/v204_758bba56245d79d50a62e391.png", "assets/v204_3c82c226addecb0b68cadbcc.png", "assets/v204_32a61dd3b640171209c1d90e.png", "assets/v204_021eb75e4e1c371810edc773.png", "assets/v204_38b8c56fe1ddceee63b0be6f.png", "assets/v204_b6525e0b6e20b7a841b0fdff.png", "assets/v204_64d8cf3bd521beb51339af8e.png", "assets/v204_6a9ddf636cab470cee3b2b12.png", "assets/v204_22511244ebd831833fb5b877.png", "assets/v204_02cdc3bcd465c3b2293e8ae6.png"];
}
} catch(e){console.warn('Orbit Rush art unavailable:',e);}


// V183: Pokemon-style battle effects + sound for the three starter strains only.
(function(){
 const STARTER_IDS=new Set(['northern','star','gorilla','sourdiesel']);
 const prevRender=renderSideBattle;
 const prevMoveSound=typeof moveSound==='function'?moveSound:()=>{};
 const prevHitSound=typeof hitSound==='function'?hitSound:()=>{};
 const prevAnimate=typeof animateBattleSprite==='function'?animateBattleSprite:()=>{};
 let pendingMoveEffect=null;

 const style=document.createElement('style');
 style.textContent=`
 .battle-field{position:relative;overflow:hidden;isolation:isolate}
 .sa-fx-screen,.sa-fx-player,.sa-fx-enemy{position:absolute;inset:0;pointer-events:none;overflow:hidden}
 .sa-fx-player,.sa-fx-enemy{z-index:6}
 .sa-fx-screen{z-index:7}
 .sa-fx-flash{position:absolute;inset:0;opacity:0;animation:saFxFlash var(--d,380ms) ease-out forwards;background:var(--c,rgba(255,255,255,.4));mix-blend-mode:screen}
 .sa-fx-particle,.sa-fx-ring,.sa-fx-beam,.sa-fx-comet,.sa-fx-wave,.sa-fx-impact,.sa-fx-aurora,.sa-fx-bolt{position:absolute;pointer-events:none}
 .sa-fx-particle{width:var(--s,10px);height:var(--s,10px);left:var(--x,50%);top:var(--y,50%);border-radius:999px;background:radial-gradient(circle,var(--c1,#fff) 0%, var(--c2,rgba(255,255,255,0)) 70%);transform:translate(-50%,-50%) scale(.4);filter:drop-shadow(0 0 8px var(--glow,#fff));animation:saFxParticle var(--d,680ms) ease-out forwards}
 .sa-fx-ring{left:var(--x,50%);top:var(--y,50%);width:var(--size,80px);height:var(--size,80px);transform:translate(-50%,-50%) scale(.2);border-radius:999px;border:3px solid var(--c,#fff);box-shadow:0 0 18px var(--c,#fff), inset 0 0 18px var(--c,#fff);opacity:.95;animation:saFxRing var(--d,520ms) ease-out forwards}
 .sa-fx-beam{left:var(--x,50%);top:-8%;width:var(--w,16px);height:118%;transform:translateX(-50%);background:linear-gradient(180deg,rgba(255,255,255,0),var(--c,#c8f2ff) 16%,#fff 50%,var(--c,#c8f2ff) 82%,rgba(255,255,255,0));filter:drop-shadow(0 0 18px var(--c,#c8f2ff));clip-path:polygon(40% 0,65% 9%,47% 24%,70% 37%,42% 59%,63% 72%,36% 100%,0 76%,24% 58%,5% 40%,29% 23%,12% 8%);opacity:0;animation:saFxBeam var(--d,360ms) linear forwards}
 .sa-fx-bolt{left:var(--x,50%);top:var(--y,52%);width:var(--w,20px);height:var(--h,56px);transform:translate(-50%,-50%) rotate(var(--rot,0deg));background:linear-gradient(180deg,#fff,var(--c,#ffd65a));filter:drop-shadow(0 0 14px var(--c,#ffd65a));clip-path:polygon(52% 0,78% 25%,60% 25%,88% 55%,62% 55%,44% 100%,26% 68%,42% 68%,18% 36%,40% 36%);opacity:0;animation:saFxBeam var(--d,320ms) linear forwards}
 .sa-fx-impact{left:var(--x,50%);top:var(--y,50%);width:var(--size,90px);height:var(--size,90px);transform:translate(-50%,-50%) scale(.2);border-radius:50%;background:radial-gradient(circle,#fff 0%,var(--c,#ffe082) 25%,rgba(255,255,255,0) 75%);filter:drop-shadow(0 0 20px var(--c,#ffe082));opacity:0;animation:saFxImpact var(--d,400ms) ease-out forwards}
 .sa-fx-wave{left:var(--x,50%);top:var(--y,50%);width:var(--w,160px);height:var(--h,40px);transform:translate(-50%,-50%) scaleX(.25);border-radius:999px;background:linear-gradient(90deg,rgba(255,255,255,0),var(--c,#8de1ff),rgba(255,255,255,0));filter:blur(1px) drop-shadow(0 0 18px var(--c,#8de1ff));opacity:0;animation:saFxWave var(--d,520ms) ease-out forwards}
 .sa-fx-comet{left:var(--x1,20%);top:var(--y1,55%);width:var(--s,28px);height:var(--s,28px);border-radius:50%;background:radial-gradient(circle,#fff 0%,var(--c,#ffd372) 28%,rgba(255,255,255,0) 70%);filter:drop-shadow(0 0 12px var(--c,#ffd372));box-shadow:-26px 0 24px var(--trail,rgba(255,211,114,.55));transform:translate(-50%,-50%);animation:saFxComet var(--d,450ms) ease-out forwards}
 .sa-fx-aurora{inset:0;opacity:0;background:linear-gradient(180deg,rgba(0,0,0,.2),transparent 22%),linear-gradient(110deg,rgba(124,255,252,.2),rgba(157,143,255,.34),rgba(255,255,255,0) 68%),linear-gradient(70deg,rgba(255,212,80,.22),rgba(255,255,255,0) 60%);mix-blend-mode:screen;animation:saFxAurora var(--d,900ms) ease-out forwards}
 .sa-fx-shake{animation:saFxShake var(--d,430ms) cubic-bezier(.2,.7,.15,1)}
 @keyframes saFxFlash{0%{opacity:0}18%{opacity:.95}100%{opacity:0}}
 @keyframes saFxParticle{0%{opacity:0;transform:translate(-50%,-50%) scale(.3)}15%{opacity:1}100%{opacity:0;transform:translate(calc(-50% + var(--dx,0px)),calc(-50% + var(--dy,0px))) scale(1)}}
 @keyframes saFxRing{0%{opacity:0;transform:translate(-50%,-50%) scale(.2)}20%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(1.45)}}
 @keyframes saFxBeam{0%{opacity:0}10%{opacity:1}100%{opacity:0}}
 @keyframes saFxImpact{0%{opacity:0;transform:translate(-50%,-50%) scale(.2)}20%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(1.16)}}
 @keyframes saFxWave{0%{opacity:0;transform:translate(-50%,-50%) scaleX(.2)}18%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scaleX(1)}}
 @keyframes saFxComet{0%{left:var(--x1,20%);top:var(--y1,55%);opacity:0}10%{opacity:1}100%{left:var(--x2,80%);top:var(--y2,45%);opacity:0}}
 @keyframes saFxAurora{0%{opacity:0}15%{opacity:.9}100%{opacity:0}}
 @keyframes saFxShake{0%,100%{transform:translate(0,0)}15%{transform:translate(-7px,2px)}30%{transform:translate(8px,-3px)}45%{transform:translate(-6px,4px)}60%{transform:translate(7px,0)}75%{transform:translate(-4px,-3px)}}
 `;
 document.head.appendChild(style);

 function battleField(){return document.querySelector('.battle-field');}
 function ensureFx(){
  const field=battleField();
  if(!field)return null;
  field.style.position='relative';field.style.overflow='hidden';
  let screen=field.querySelector('.sa-fx-screen');
  let player=field.querySelector('.sa-fx-player');
  let enemy=field.querySelector('.sa-fx-enemy');
  if(!player){player=document.createElement('div');player.className='sa-fx-player';field.appendChild(player);}
  if(!enemy){enemy=document.createElement('div');enemy.className='sa-fx-enemy';field.appendChild(enemy);}
  if(!screen){screen=document.createElement('div');screen.className='sa-fx-screen';field.appendChild(screen);}
  return {field,screen,player,enemy};
 }
 function sideLayer(side){const fx=ensureFx(); if(!fx) return null; return side==='player'?fx.player:fx.enemy;}
 function clearSoon(node,ms=1200){if(!node)return;setTimeout(()=>{try{node.remove()}catch(e){}},ms);}
 function screenFlash(color='rgba(255,255,255,.35)',duration=350){const fx=ensureFx(); if(!fx) return; const n=document.createElement('div'); n.className='sa-fx-flash'; n.style.setProperty('--c',color); n.style.setProperty('--d',duration+'ms'); fx.screen.appendChild(n); clearSoon(n,duration+120);}
 function shake(duration=430){const fx=ensureFx(); if(!fx) return; fx.field.classList.remove('sa-fx-shake'); void fx.field.offsetWidth; fx.field.style.setProperty('--d',duration+'ms'); fx.field.classList.add('sa-fx-shake'); setTimeout(()=>fx.field&&fx.field.classList.remove('sa-fx-shake'),duration+30);}
 function particle(layer,x,y,color1,color2,dx,dy,size=10,duration=700,glow=color1){if(!layer) return; const n=document.createElement('div'); n.className='sa-fx-particle'; n.style.setProperty('--x',x+'%'); n.style.setProperty('--y',y+'%'); n.style.setProperty('--c1',color1); n.style.setProperty('--c2',color2); n.style.setProperty('--dx',dx+'px'); n.style.setProperty('--dy',dy+'px'); n.style.setProperty('--s',size+'px'); n.style.setProperty('--d',duration+'ms'); n.style.setProperty('--glow',glow); layer.appendChild(n); clearSoon(n,duration+120);}
 function burst(layer,x,y,colors,count=10,spread=44,size=10,duration=700){for(let i=0;i<count;i++){const a=(Math.PI*2*i)/count + Math.random()*0.35; const d=spread*(0.55+Math.random()*0.7); particle(layer,x,y,colors[0],colors[1],Math.cos(a)*d,Math.sin(a)*d,size*(0.7+Math.random()*0.55),duration*(0.85+Math.random()*0.35),colors[0]);}}
 function ring(layer,x,y,color,size=100,duration=500){if(!layer) return; const n=document.createElement('div'); n.className='sa-fx-ring'; n.style.setProperty('--x',x+'%'); n.style.setProperty('--y',y+'%'); n.style.setProperty('--c',color); n.style.setProperty('--size',size+'px'); n.style.setProperty('--d',duration+'ms'); layer.appendChild(n); clearSoon(n,duration+120);}
 function impact(layer,x,y,color,size=100,duration=380){if(!layer) return; const n=document.createElement('div'); n.className='sa-fx-impact'; n.style.setProperty('--x',x+'%'); n.style.setProperty('--y',y+'%'); n.style.setProperty('--c',color); n.style.setProperty('--size',size+'px'); n.style.setProperty('--d',duration+'ms'); layer.appendChild(n); clearSoon(n,duration+100);}
 function wave(layer,x,y,color,w=160,h=40,duration=480){if(!layer) return; const n=document.createElement('div'); n.className='sa-fx-wave'; n.style.setProperty('--x',x+'%'); n.style.setProperty('--y',y+'%'); n.style.setProperty('--c',color); n.style.setProperty('--w',w+'px'); n.style.setProperty('--h',h+'px'); n.style.setProperty('--d',duration+'ms'); layer.appendChild(n); clearSoon(n,duration+120);}
 function beam(layer,x,color,width=16,duration=340){if(!layer) return; const n=document.createElement('div'); n.className='sa-fx-beam'; n.style.setProperty('--x',x+'%'); n.style.setProperty('--c',color); n.style.setProperty('--w',width+'px'); n.style.setProperty('--d',duration+'ms'); layer.appendChild(n); clearSoon(n,duration+80);}
 function bolt(layer,x,y,color,w=18,h=60,rot=0,duration=300){if(!layer)return; const n=document.createElement('div'); n.className='sa-fx-bolt'; n.style.setProperty('--x',x+'%'); n.style.setProperty('--y',y+'%'); n.style.setProperty('--c',color); n.style.setProperty('--w',w+'px'); n.style.setProperty('--h',h+'px'); n.style.setProperty('--rot',rot+'deg'); n.style.setProperty('--d',duration+'ms'); layer.appendChild(n); clearSoon(n,duration+80);}
 function comet(layer,x1,y1,x2,y2,color,trail,size=26,duration=420){if(!layer)return; const n=document.createElement('div'); n.className='sa-fx-comet'; n.style.setProperty('--x1',x1+'%'); n.style.setProperty('--y1',y1+'%'); n.style.setProperty('--x2',x2+'%'); n.style.setProperty('--y2',y2+'%'); n.style.setProperty('--c',color); n.style.setProperty('--trail',trail); n.style.setProperty('--s',size+'px'); n.style.setProperty('--d',duration+'ms'); layer.appendChild(n); clearSoon(n,duration+80);}
 function aurora(duration=900){const fx=ensureFx(); if(!fx) return; const n=document.createElement('div'); n.className='sa-fx-aurora'; n.style.setProperty('--d',duration+'ms'); fx.screen.appendChild(n); clearSoon(n,duration+120);}
 function coordsFor(side){ return side==='player' ? {selfX:28,selfY:66,targetX:74,targetY:38,targetSide:'enemy'} : {selfX:74,selfY:38,targetX:28,targetY:66,targetSide:'player'}; }
 function starterStrikeFx(id,index,side){
  const c=coordsFor(side), layer=sideLayer(side), target=sideLayer(c.targetSide);
  if(!layer||!target)return;
  if(id==='northern'){
   if(index===0){screenFlash('rgba(180,235,255,.18)',240); burst(layer,c.selfX+2,c.selfY-4,['#fff6ae','rgba(128,234,255,0)'],9,30,9,460); bolt(target,c.targetX,c.targetY,'#ffe76a',16,52,-8,220); burst(target,c.targetX,c.targetY,['#dfffff','rgba(255,255,255,0)'],8,34,8,380); shake(280);}
   else if(index===1){screenFlash('rgba(168,220,255,.22)',300); comet(layer,c.selfX+4,c.selfY-5,c.targetX,c.targetY,'#e7f9ff','rgba(111,227,255,.7)',22,320); burst(target,c.targetX,c.targetY,['#fff9bf','rgba(140,235,255,0)'],10,38,10,500); shake(320);}
   else if(index===2){screenFlash('rgba(215,245,255,.34)',420); beam(target,c.targetX,'#b9f5ff',18,330); beam(target,c.targetX-4,'#fff1a6',11,260); burst(target,c.targetX,c.targetY,['#ffffff','rgba(160,236,255,0)'],13,46,11,560); shake(430);}
   else {screenFlash('rgba(186,255,247,.26)',620); aurora(880); ring(layer,c.selfX,c.selfY-6,'#a0fff0',84,520); for(let i=0;i<3;i++){setTimeout(()=>beam(target,c.targetX-7+i*7,i===1?'#ffffff':'#97edff',16-(i*2),300),i*110);} setTimeout(()=>burst(target,c.targetX,c.targetY,['#fff7c8','rgba(145,241,255,0)'],16,58,12,780),120); shake(620);}
  } else if(id==='star'){
   if(index===0){screenFlash('rgba(255,225,150,.16)',260); comet(layer,c.selfX+2,c.selfY-4,c.targetX,c.targetY,'#ffeaa8','rgba(255,184,64,.55)',20,300); burst(target,c.targetX,c.targetY,['#fff2c7','rgba(255,196,90,0)'],10,36,10,500); shake(280);}
   else if(index===1){screenFlash('rgba(255,220,120,.18)',340); ring(layer,c.selfX,c.selfY-7,'#ffd66d',78,430); comet(layer,c.selfX+5,c.selfY-8,c.targetX,c.targetY,'#fff7cf','rgba(255,214,109,.7)',28,420); burst(target,c.targetX,c.targetY,['#fff1bc','rgba(255,210,108,0)'],13,46,11,620); shake(360);}
   else if(index===2){screenFlash('rgba(173,200,255,.2)',360); wave(layer,c.selfX+10,c.selfY-10,'#8fd2ff',170,34,380); wave(layer,c.selfX+20,c.selfY-10,'#c3a8ff',210,42,460); burst(target,c.targetX,c.targetY,['#ffffff','rgba(189,160,255,0)'],12,42,10,560); shake(320);}
   else {screenFlash('rgba(255,240,200,.42)',620); impact(target,c.targetX,c.targetY,'#ffd787',126,480); ring(target,c.targetX,c.targetY,'#fff5cc',148,520); for(let i=0;i<18;i++)particle(target,c.targetX,c.targetY,'#fffce6','rgba(255,224,136,0)',(Math.random()-.5)*110,(Math.random()-.5)*110,8+Math.random()*6,700,'#ffd070'); shake(680);}
  } else if(id==='gorilla'){
   if(index===0){screenFlash('rgba(255,235,205,.18)',220); impact(target,c.targetX,c.targetY,'#ffd6a1',86,260); burst(target,c.targetX,c.targetY,['#fff0d8','rgba(175,122,67,0)'],8,28,10,420); shake(300);}
   else if(index===1){screenFlash('rgba(255,228,180,.2)',300); wave(target,c.targetX,c.targetY+10,'#d8a36f',150,24,320); impact(target,c.targetX,c.targetY,'#f0b56d',108,320); burst(target,c.targetX,c.targetY,['#f6d9a9','rgba(120,75,40,0)'],10,38,10,520); shake(360);}
   else if(index===2){screenFlash('rgba(255,206,120,.18)',320); comet(layer,c.selfX+6,c.selfY-6,c.targetX,c.targetY,'#ffd894','rgba(255,171,79,.58)',24,340); ring(target,c.targetX,c.targetY,'#f6b35f',96,420); burst(target,c.targetX,c.targetY,['#ffecc1','rgba(255,165,54,0)'],12,44,11,560); shake(360);}
   else {screenFlash('rgba(255,233,190,.3)',500); impact(target,c.targetX,c.targetY,'#ffd08a',132,420); ring(target,c.targetX,c.targetY,'#ffe2ad',156,520); for(let i=0;i<10;i++)particle(target,c.targetX,c.targetY,'#ffe7c4','rgba(118,73,38,0)',(Math.random()-.5)*95,-Math.random()*80,10+Math.random()*5,680,'#f0b56d'); shake(620);}
  }
 }
 function genericHit(side){const c=coordsFor(side); const target=sideLayer(side); if(!target)return; screenFlash('rgba(255,255,255,.18)',180); impact(target,c.selfX,c.selfY,'#ffffff',72,220); shake(220);}

 let audioCtx=null;
 function ctx(){const AC=window.AudioContext||window.webkitAudioContext;if(!AC) return null; if(!audioCtx) audioCtx=new AC(); if(audioCtx.state==='suspended') audioCtx.resume().catch(()=>{}); return audioCtx;}
 function tone(freq,duration=.1,type='sine',vol=.03,delay=0,slideTo=null){const a=ctx(); if(!a) return; const t=a.currentTime+delay; const o=a.createOscillator(), g=a.createGain(); o.type=type; o.frequency.setValueAtTime(freq,t); if(slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20,slideTo),t+duration); g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+.01); g.gain.exponentialRampToValueAtTime(.0001,t+duration); o.connect(g); g.connect(a.destination); o.start(t); o.stop(t+duration+.03); }
 function noise(duration=.12,vol=.025,delay=0,lowpass=1800){const a=ctx(); if(!a) return; const length=Math.max(1,Math.floor(a.sampleRate*(duration+.05))); const buffer=a.createBuffer(1,length,a.sampleRate); const data=buffer.getChannelData(0); for(let i=0;i<length;i++) data[i]=(Math.random()*2-1)*Math.exp(-i/(a.sampleRate*duration*0.9)); const src=a.createBufferSource(); src.buffer=buffer; const biq=a.createBiquadFilter(); biq.type='lowpass'; biq.frequency.value=lowpass; const g=a.createGain(); const t=a.currentTime+delay; g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+.01); g.gain.exponentialRampToValueAtTime(0.0001,t+duration); src.connect(biq); biq.connect(g); g.connect(a.destination); src.start(t); src.stop(t+duration+.04); }
 function starterMoveSound(id,index){
  if(id==='northern'){
   tone(860,.06,'sawtooth',.03,0,1180); tone(680,.08,'square',.03,.05,320); if(index>=1) tone(240,.22,'triangle',.035,.08,90); if(index>=2) noise(.18,.02,.06,1200); if(index===3){tone(520,.28,'sine',.025,.12,260); noise(.28,.025,.12,900);} return true;
  }
  if(id==='star'){
   tone(420,.13,'sine',.03,0,620); tone(610,.12,'triangle',.023,.08,780); if(index>=1) tone(240,.2,'sine',.028,.14,170); if(index>=2) noise(.12,.012,.09,2600); if(index===3){tone(120,.32,'triangle',.05,.1,72); tone(900,.18,'sine',.018,.18,400);} return true;
  }
  if(id==='gorilla'){
   tone(160,.12,'square',.045,0,100); noise(.08,.016,.03,700); if(index>=1) tone(96,.18,'triangle',.04,.05,68); if(index>=2) noise(.12,.017,.08,1000); if(index===3){tone(72,.24,'triangle',.055,.06,40); noise(.18,.025,.08,820);} return true;
  }
  return false;
 }
 moveSound=function(id,index){ pendingMoveEffect={id,index}; if(STARTER_IDS.has(id)){starterMoveSound(id,index); return;} prevMoveSound(id,index); };
 hitSound=function(){ tone(140,.06,'square',.03,0,105); tone(84,.12,'triangle',.028,.05,60); noise(.06,.012,.02,1400); prevHitSound(); };
 animateBattleSprite=function(who,cls){
  if(cls==='strike' && pendingMoveEffect){ const effect=pendingMoveEffect; pendingMoveEffect=null; if(STARTER_IDS.has(effect.id)) starterStrikeFx(effect.id,effect.index,who); }
  else if(cls==='hit'){ genericHit(who); }
  try{prevAnimate(who,cls);}catch(e){}
 };
 renderSideBattle=function(){ prevRender(); ensureFx(); };
})();


// V184: Replace starter move effects with persistent full-screen battle overlays.
(function(){
 const STARTER_IDS=new Set(['northern','star','gorilla','sourdiesel','cheese','trainwreck','rs11','jealousy','lunarrock','angolaroja']);
 const prevMoveSound=moveSound;
 const prevAnimateBattleSprite=animateBattleSprite;
 const prevRenderSideBattle=renderSideBattle;
 let pendingStarterFx=null;
 let starterFxConsumeAt=0;

 const style=document.createElement('style');
 style.textContent=`
 .battle-field{position:relative;overflow:hidden;isolation:isolate}
 .sa-movefx-overlay{position:absolute;inset:0;pointer-events:none;z-index:25;overflow:hidden}
 .sa-movefx-layer{position:absolute;inset:0;pointer-events:none}
 .sa-movefx-fullflash,.sa-movefx-tint,.sa-movefx-bolt,.sa-movefx-beam,.sa-movefx-shard,.sa-movefx-pulse,.sa-movefx-comet,.sa-movefx-swirl,.sa-movefx-impact,.sa-movefx-wave,.sa-movefx-crack,.sa-movefx-starburst,.sa-movefx-fist,.sa-movefx-club,.sa-movefx-glue,.sa-movefx-mountain,.sa-movefx-dust,.sa-movefx-orb,.sa-movefx-cloud,.sa-movefx-pump,.sa-movefx-smoke,.sa-movefx-cheesefist,.sa-movefx-leaf,.sa-movefx-stinkcloud,.sa-movefx-bomb,.sa-movefx-smokefist,.sa-movefx-train,.sa-movefx-wire,.sa-movefx-circuit,.sa-movefx-energyfist{position:absolute;pointer-events:none}
 .sa-movefx-fullflash{inset:0;background:var(--bg,rgba(255,255,255,.25));mix-blend-mode:screen;opacity:0;animation:saFullFlash var(--d,500ms) ease-out forwards}
 .sa-movefx-tint{inset:0;background:var(--bg,rgba(100,150,255,.18));mix-blend-mode:screen;opacity:0;animation:saTintPulse var(--d,800ms) ease-out forwards}
 .sa-movefx-bolt{left:var(--x,50%);top:-10%;width:var(--w,26px);height:128%;transform:translateX(-50%) rotate(var(--r,0deg));background:linear-gradient(180deg,rgba(255,255,255,0),#fff 16%,var(--c,#ffe870) 48%,#fff 78%,rgba(255,255,255,0));clip-path:polygon(52% 0,78% 14%,60% 14%,88% 36%,62% 36%,82% 58%,55% 58%,68% 79%,46% 79%,35% 100%,24% 72%,34% 72%,14% 48%,40% 48%,28% 26%,46% 26%);filter:drop-shadow(0 0 20px var(--c,#ffe870)) drop-shadow(0 0 32px rgba(255,255,255,.9));opacity:0;animation:saBoltStrike var(--d,340ms) linear forwards}
 .sa-movefx-beam{left:var(--x,50%);top:var(--y,50%);width:var(--w,240px);height:var(--h,34px);transform:translate(-50%,-50%) rotate(var(--r,0deg)) scaleX(.2);transform-origin:left center;background:linear-gradient(90deg,rgba(255,255,255,0),#fff 12%,var(--c,#8de7ff) 42%,#fff 70%,rgba(255,255,255,0));border-radius:999px;filter:blur(1px) drop-shadow(0 0 18px var(--c,#8de7ff));opacity:0;animation:saBeamSweep var(--d,420ms) ease-out forwards}
 .sa-movefx-shard{left:var(--x,50%);top:var(--y,50%);width:var(--s,18px);height:var(--s,18px);transform:translate(-50%,-50%) rotate(var(--r,0deg));background:linear-gradient(180deg,#fff,var(--c,#98edff));clip-path:polygon(50% 0,72% 32%,100% 40%,80% 66%,84% 100%,50% 82%,16% 100%,20% 66%,0 40%,28% 32%);filter:drop-shadow(0 0 12px var(--c,#98edff));opacity:0;animation:saShardFly var(--d,720ms) ease-out forwards}
 .sa-movefx-pulse{left:var(--x,50%);top:var(--y,50%);width:var(--s,100px);height:var(--s,100px);transform:translate(-50%,-50%) scale(.2);border-radius:50%;background:radial-gradient(circle,#fff 0%,var(--c,#ffe36a) 28%,rgba(255,255,255,0) 74%);box-shadow:0 0 32px var(--c,#ffe36a);opacity:0;animation:saPulseBlast var(--d,420ms) ease-out forwards}
 .sa-movefx-comet{left:var(--x1,20%);top:var(--y1,50%);width:var(--s,34px);height:var(--s,34px);border-radius:50%;background:radial-gradient(circle,#fff 0%,var(--c,#ffd688) 30%,rgba(255,255,255,0) 72%);box-shadow:-34px 0 30px var(--trail,rgba(255,214,136,.55));filter:drop-shadow(0 0 16px var(--c,#ffd688));transform:translate(-50%,-50%);opacity:0;animation:saCometFly var(--d,460ms) ease-out forwards}
 .sa-movefx-swirl{left:var(--x,50%);top:var(--y,50%);width:var(--s,160px);height:var(--s,160px);transform:translate(-50%,-50%) rotate(0deg) scale(.35);border-radius:50%;border:4px solid transparent;border-top-color:var(--c1,#8de7ff);border-right-color:var(--c2,#cc9bff);filter:drop-shadow(0 0 18px var(--c1,#8de7ff));opacity:0;animation:saSwirl var(--d,780ms) ease-out forwards}
 .sa-movefx-impact{left:var(--x,50%);top:var(--y,50%);width:var(--s,140px);height:var(--s,140px);transform:translate(-50%,-50%) scale(.15);border-radius:50%;background:radial-gradient(circle,#fff 0%,var(--c,#ffd28a) 26%,rgba(255,255,255,0) 76%);box-shadow:0 0 38px var(--c,#ffd28a);opacity:0;animation:saImpactBurst var(--d,420ms) ease-out forwards}
 .sa-movefx-wave{left:var(--x,50%);top:var(--y,50%);width:var(--w,220px);height:var(--h,36px);transform:translate(-50%,-50%) rotate(var(--r,0deg)) scaleX(.1);border-radius:999px;background:linear-gradient(90deg,rgba(255,255,255,0),var(--c,#b58b5b),rgba(255,255,255,0));filter:blur(1px) drop-shadow(0 0 14px var(--c,#b58b5b));opacity:0;animation:saBeamSweep var(--d,420ms) ease-out forwards}
 .sa-movefx-crack{left:var(--x,50%);top:var(--y,78%);width:var(--w,200px);height:var(--h,70px);transform:translate(-50%,-50%) scale(.5);background:linear-gradient(180deg,rgba(255,255,255,0),rgba(130,80,35,.22));clip-path:polygon(0 53%,16% 45%,22% 58%,34% 35%,45% 55%,56% 28%,68% 49%,77% 36%,86% 54%,100% 44%,100% 100%,0 100%);opacity:0;animation:saCrack var(--d,520ms) ease-out forwards}
 .sa-movefx-starburst{left:var(--x,50%);top:var(--y,50%);width:var(--s,190px);height:var(--s,190px);transform:translate(-50%,-50%) scale(.2) rotate(0deg);background:conic-gradient(from 0deg,#fff, var(--c,#ffe29f), #fff, transparent 70%);clip-path:polygon(50% 0,58% 34%,80% 8%,66% 40%,100% 50%,66% 60%,80% 92%,58% 66%,50% 100%,42% 66%,20% 92%,34% 60%,0 50%,34% 40%,20% 8%,42% 34%);filter:drop-shadow(0 0 18px var(--c,#ffe29f));opacity:0;animation:saStarburst var(--d,520ms) ease-out forwards}
 .sa-movefx-fist{left:var(--x1,20%);top:var(--y1,50%);width:var(--s,110px);height:var(--s,110px);transform:translate(-50%,-50%) rotate(var(--r,0deg)) scale(.55);border-radius:44% 42% 36% 38%;background:radial-gradient(circle at 38% 35%,#fff8ef 0 10%,var(--c1,#efd0b1) 14%,var(--c2,#bf835a) 72%,#6e4328 100%);box-shadow:inset 10px 8px 0 rgba(255,255,255,.22), inset -14px -12px 0 rgba(85,40,14,.32), 0 0 20px rgba(255,217,181,.45);clip-path:polygon(18% 16%,33% 8%,47% 8%,58% 10%,70% 15%,82% 28%,92% 44%,92% 60%,82% 75%,64% 87%,42% 92%,22% 86%,10% 69%,6% 47%,9% 28%);opacity:0;animation:saFistRush var(--d,380ms) cubic-bezier(.15,.75,.28,1) forwards}
 .sa-movefx-club{left:var(--x,50%);top:var(--y,50%);width:var(--w,246px);height:var(--h,62px);transform:translate(-50%,-50%) rotate(var(--r,-28deg)) scale(.45);transform-origin:14% 50%;border-radius:36px;background:repeating-linear-gradient(90deg,#6d4324 0 16px,#7a4c29 16px 32px,#875632 32px 48px,#95613b 48px 64px,#9f6a42 64px 80px), linear-gradient(180deg,rgba(255,246,221,.22),rgba(70,37,15,.18));box-shadow:inset 0 0 0 3px rgba(255,232,188,.12), inset 0 9px 0 rgba(255,255,255,.10), inset 0 -11px 0 rgba(67,35,14,.24), 0 0 20px rgba(255,202,133,.28);clip-path:polygon(0 43%,10% 34%,28% 31%,46% 30%,58% 27%,70% 20%,84% 10%,94% 15%,100% 28%,100% 50%,100% 72%,94% 85%,84% 90%,70% 80%,58% 73%,46% 70%,28% 69%,10% 66%,0 57%);opacity:0;animation:saClubSlam var(--d,480ms) ease-out forwards}
 .sa-movefx-club::before,.sa-movefx-club::after,.sa-movefx-mountain::before,.sa-movefx-mountain::after{content:'';position:absolute;pointer-events:none}
 .sa-movefx-club::before{left:18%;top:16%;width:16%;height:68%;border-radius:12px;background:repeating-linear-gradient(180deg,rgba(235,214,171,.55) 0 4px,rgba(121,76,39,.0) 4px 10px);opacity:.92;mix-blend-mode:screen}
 .sa-movefx-club::after{right:6%;top:18%;width:22%;height:64%;border-radius:50%;background:radial-gradient(circle at 38% 35%,rgba(255,249,230,.42) 0 10%,rgba(255,255,255,0) 38%), radial-gradient(circle at 64% 58%,rgba(76,43,20,.42) 0 14%,rgba(76,43,20,0) 38%), radial-gradient(circle at 24% 70%,rgba(76,43,20,.30) 0 10%,rgba(76,43,20,0) 28%);opacity:.9}
 .sa-movefx-glue{left:var(--x1,20%);top:var(--y1,50%);width:var(--s,34px);height:calc(var(--s,34px)*.9);transform:translate(-50%,-50%) rotate(var(--r,0deg)) scale(.55);border-radius:58% 42% 50% 50%/46% 58% 42% 54%;background:radial-gradient(circle at 35% 30%,#fffbe8 0 12%,var(--c1,#ffe27a) 16%,var(--c2,#d09b1f) 72%,#8a6111 100%);filter:drop-shadow(0 0 12px rgba(255,220,108,.7));opacity:0;animation:saGlueShot var(--d,420ms) ease-out forwards}
 .sa-movefx-mountain{left:var(--x,50%);top:var(--y,72%);width:var(--w,320px);height:var(--h,210px);transform:translate(-50%,-50%) translateX(0) rotate(0deg) scale(.35);background:linear-gradient(180deg,#f3ead6 0 8%,#baa180 12%,var(--c1,#8f7657) 28%,var(--c2,#66503a) 74%,#2c2018 100%);box-shadow:0 0 22px rgba(255,226,180,.22), inset 0 12px 0 rgba(255,255,255,.10), inset 0 -18px 0 rgba(40,23,12,.22);opacity:0;animation:saMountainSplit var(--d,900ms) cubic-bezier(.17,.82,.2,1) forwards}
 .sa-movefx-mountain.left{clip-path:polygon(0 100%,0 76%,6% 68%,12% 63%,17% 56%,21% 48%,26% 43%,30% 34%,34% 27%,39% 18%,45% 8%,50% 0,50% 100%)}
 .sa-movefx-mountain.right{clip-path:polygon(50% 100%,50% 0,55% 8%,61% 18%,66% 28%,70% 35%,74% 43%,79% 48%,83% 56%,88% 63%,94% 68%,100% 76%,100% 100%)}
 .sa-movefx-mountain::before{top:0;height:32%;background:linear-gradient(180deg,rgba(255,255,255,.95),rgba(255,255,255,.58));opacity:.92}
 .sa-movefx-mountain.left::before{left:16%;width:38%;clip-path:polygon(0 100%,10% 72%,22% 55%,42% 30%,62% 8%,84% 38%,100% 100%)}
 .sa-movefx-mountain.right::before{right:16%;width:38%;clip-path:polygon(0 100%,16% 38%,38% 8%,58% 30%,78% 55%,90% 72%,100% 100%)}
 .sa-movefx-mountain::after{top:8%;height:84%;opacity:.88}
 .sa-movefx-mountain.left::after{right:0;width:28%;background:linear-gradient(90deg,rgba(81,56,40,.08) 0,rgba(198,154,108,.62) 48%,rgba(255,226,184,.72) 100%);clip-path:polygon(24% 0,100% 8%,100% 100%,0 100%,0 12%)}
 .sa-movefx-mountain.right::after{left:0;width:28%;background:linear-gradient(90deg,rgba(255,226,184,.72) 0,rgba(198,154,108,.62) 52%,rgba(81,56,40,.08) 100%);clip-path:polygon(0 8%,76% 0,100% 12%,100% 100%,0 100%)}
 .sa-movefx-dust{left:var(--x,50%);top:var(--y,70%);width:var(--w,170px);height:var(--h,80px);transform:translate(-50%,-50%) scale(.4);border-radius:50%;background:radial-gradient(circle at 50% 50%,rgba(255,255,255,.75) 0, var(--c,rgba(214,176,124,.72)) 26%, rgba(170,118,66,.22) 64%, rgba(170,118,66,0) 76%);filter:blur(1.5px);opacity:0;animation:saDustPoof var(--d,520ms) ease-out forwards}
 .sa-movefx-orb{left:var(--x1,20%);top:var(--y1,50%);width:var(--s,52px);height:var(--s,52px);transform:translate(-50%,-50%) scale(.45);border-radius:50%;background:radial-gradient(circle at 34% 34%,#fff 0 10%, var(--c1,#d5fbff) 16%, var(--c2,#5cd8ff) 38%, var(--c3,#5f78ff) 66%, rgba(120,130,255,.08) 78%, rgba(120,130,255,0) 82%);box-shadow:0 0 16px var(--c2,#5cd8ff),0 0 34px var(--c3,#5f78ff);opacity:0;animation:saOrbShot var(--d,420ms) ease-out forwards}
 .sa-movefx-orb::before{content:'';position:absolute;inset:-12%;border-radius:50%;border:3px solid rgba(210,246,255,.72);opacity:.85;filter:blur(.4px);transform:rotate(26deg)}
 .sa-movefx-orb::after{content:'';position:absolute;inset:12%;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.85) 0 8%,rgba(255,255,255,0) 56%)}
 .sa-movefx-cloud{left:var(--x,50%);top:var(--y,28%);width:var(--w,150px);height:var(--h,70px);transform:translate(-50%,-50%) scale(.42);opacity:0;animation:saCloudDrop var(--d,520ms) ease-out forwards}
 .sa-movefx-cloud::before{content:'';position:absolute;left:0;right:0;top:18%;bottom:0;border-radius:999px;background:linear-gradient(180deg,rgba(241,248,255,.96),rgba(183,203,224,.94) 54%,rgba(110,128,154,.95) 100%);box-shadow:0 0 18px rgba(214,236,255,.35), inset 0 8px 0 rgba(255,255,255,.2), inset 0 -8px 0 rgba(67,82,102,.16)}
 .sa-movefx-cloud::after{content:'';position:absolute;left:10%;top:0;width:28%;height:54%;border-radius:50%;background:radial-gradient(circle at 50% 50%,rgba(243,249,255,.98),rgba(186,208,231,.96) 62%,rgba(113,131,156,.95) 100%);box-shadow:34px 6px 0 6px rgba(232,243,255,.96), 74px 1px 0 10px rgba(225,239,255,.98), 112px 12px 0 2px rgba(183,205,230,.94), 58px 18px 0 10px rgba(203,223,246,.96)}
 .sa-movefx-pump{left:var(--x1,20%);top:var(--y1,50%);width:var(--w,118px);height:var(--h,138px);transform:translate(-50%,-50%) rotate(var(--r,0deg)) scale(.42);opacity:0;animation:saPumpRush var(--d,440ms) cubic-bezier(.14,.76,.22,1) forwards}
 .sa-movefx-pump::before{content:'';position:absolute;left:18%;top:10%;width:56%;height:74%;border-radius:18px;background:linear-gradient(180deg,#f5dd72 0 12%,#ea3333 12% 100%);box-shadow:inset 0 0 0 4px rgba(84,30,20,.24), inset 0 10px 0 rgba(255,255,255,.14), inset 0 -12px 0 rgba(108,22,18,.24), 0 0 18px rgba(255,188,73,.26)}
 .sa-movefx-pump::after{content:'';position:absolute;left:58%;top:22%;width:38%;height:48%;border:9px solid #1e2f33;border-left:0;border-bottom:0;border-radius:0 40px 0 0;transform:rotate(10deg);box-shadow:0 0 0 3px rgba(255,224,127,.1)}
 .sa-movefx-pump .screen{position:absolute;left:28%;top:20%;width:28%;height:18%;border-radius:8px;background:linear-gradient(180deg,#e3f8ff,#88d7f0);box-shadow:inset 0 0 0 3px rgba(15,75,98,.3)}
 .sa-movefx-pump .nozzle{position:absolute;right:5%;top:53%;width:26%;height:12%;border-radius:12px;background:linear-gradient(180deg,#313d41,#14181b);transform:rotate(8deg)}
 .sa-movefx-smoke{left:var(--x,50%);top:var(--y,50%);width:var(--s,74px);height:var(--s,74px);transform:translate(-50%,-50%) scale(.34);border-radius:50%;background:radial-gradient(circle at 38% 34%,rgba(250,250,250,.78) 0 10%, rgba(188,198,202,.74) 24%, rgba(112,122,128,.72) 52%, rgba(70,76,81,.24) 72%, rgba(70,76,81,0) 84%);filter:blur(.6px);opacity:0;animation:saSmokeBillow var(--d,720ms) ease-out forwards}
 .sa-movefx-smoke::before,.sa-movefx-smoke::after{content:'';position:absolute;border-radius:50%;background:radial-gradient(circle at 40% 34%,rgba(245,245,245,.74),rgba(168,176,181,.68) 42%,rgba(80,88,95,.28) 72%,rgba(80,88,95,0) 82%)}
 .sa-movefx-smoke::before{left:-18%;top:18%;width:62%;height:62%}
 .sa-movefx-smoke::after{right:-14%;top:6%;width:56%;height:56%}
 .sa-movefx-cheesefist{left:var(--x1,20%);top:var(--y1,50%);width:var(--s,114px);height:var(--s,114px);transform:translate(-50%,-50%) rotate(var(--r,0deg)) scale(.55);border-radius:44% 42% 36% 38%;background:radial-gradient(circle at 36% 34%,#fffce7 0 9%,#f8e986 13%,#efca49 48%,#cf9425 82%,#87571b 100%);box-shadow:inset 10px 8px 0 rgba(255,255,255,.22), inset -14px -12px 0 rgba(128,79,16,.26), 0 0 20px rgba(255,223,109,.38);clip-path:polygon(18% 16%,33% 8%,47% 8%,58% 10%,70% 15%,82% 28%,92% 44%,92% 60%,82% 75%,64% 87%,42% 92%,22% 86%,10% 69%,6% 47%,9% 28%);opacity:0;animation:saFistRush var(--d,380ms) cubic-bezier(.15,.75,.28,1) forwards}
 .sa-movefx-cheesefist::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 28% 26%,rgba(184,116,22,.42) 0 6%,rgba(184,116,22,0) 7%),radial-gradient(circle at 62% 24%,rgba(184,116,22,.34) 0 5%,rgba(184,116,22,0) 6%),radial-gradient(circle at 72% 52%,rgba(184,116,22,.36) 0 7%,rgba(184,116,22,0) 8%),radial-gradient(circle at 38% 62%,rgba(184,116,22,.32) 0 8%,rgba(184,116,22,0) 9%),radial-gradient(circle at 58% 76%,rgba(184,116,22,.34) 0 5%,rgba(184,116,22,0) 6%)}
 .sa-movefx-leaf{left:var(--x,50%);top:var(--y,50%);width:var(--s,42px);height:var(--s,42px);transform:translate(-50%,-50%) rotate(var(--r,0deg)) scale(.35);background:linear-gradient(180deg,#efffdb,var(--c1,#9ff18a) 28%,var(--c2,#45a442) 72%,#225a24 100%);clip-path:polygon(50% 0,58% 18%,68% 8%,64% 26%,82% 16%,72% 38%,92% 34%,76% 52%,94% 58%,72% 64%,80% 84%,60% 72%,58% 100%,50% 80%,42% 100%,40% 72%,20% 84%,28% 64%,6% 58%,24% 52%,8% 34%,28% 38%,18% 16%,36% 26%,32% 8%,42% 18%);filter:drop-shadow(0 0 10px rgba(140,255,138,.45));opacity:0;animation:saLeafDrift var(--d,720ms) ease-out forwards}
 .sa-movefx-leaf::after{content:'';position:absolute;left:48%;top:8%;width:6%;height:84%;transform:translateX(-50%);border-radius:8px;background:rgba(241,255,228,.72)}
 .sa-movefx-stinkcloud{left:var(--x1,35%);top:var(--y1,50%);width:var(--w,150px);height:var(--h,96px);transform:translate(-50%,-50%) scale(.35);opacity:0;animation:saStinkPass var(--d,720ms) ease-out forwards}
 .sa-movefx-stinkcloud::before{content:'';position:absolute;left:6%;right:6%;top:18%;bottom:8%;border-radius:999px;background:radial-gradient(circle at 28% 40%,rgba(253,255,214,.95) 0 8%,rgba(241,248,118,.92) 20%,rgba(177,198,60,.88) 50%,rgba(96,121,32,.22) 74%,rgba(96,121,32,0) 82%);box-shadow:0 0 18px rgba(204,235,102,.35)}
 .sa-movefx-stinkcloud::after{content:'';position:absolute;left:12%;top:0;width:22%;height:42%;border-radius:50%;background:radial-gradient(circle at 50% 50%,rgba(247,255,194,.92),rgba(216,238,102,.86) 58%,rgba(114,138,35,.12) 80%);box-shadow:30px 8px 0 8px rgba(226,244,125,.86),72px 6px 0 6px rgba(205,225,95,.85),104px 16px 0 0 rgba(168,191,69,.82),54px 24px 0 12px rgba(187,214,82,.84)}
 .sa-movefx-bomb{left:var(--x1,20%);top:var(--y1,50%);width:var(--s,52px);height:var(--s,52px);transform:translate(-50%,-50%) scale(.45);opacity:0;animation:saBombArc var(--d,620ms) cubic-bezier(.18,.78,.26,1) forwards}
 .sa-movefx-bomb::before{content:'';position:absolute;inset:14% 14% 8% 14%;border-radius:50%;background:radial-gradient(circle at 34% 30%,#fff8d8 0 7%,#7f8f22 10%,#556416 58%,#263103 100%);box-shadow:inset 0 8px 0 rgba(255,255,255,.12), inset 0 -10px 0 rgba(16,22,0,.26), 0 0 14px rgba(161,191,55,.28)}
 .sa-movefx-bomb::after{content:'';position:absolute;left:54%;top:0;width:28%;height:24%;border:4px solid #43300d;border-bottom:0;border-left:0;border-radius:0 30px 0 0;transform:rotate(8deg)}
 .sa-movefx-smokefist{left:var(--x1,20%);top:var(--y1,50%);width:var(--s,114px);height:var(--s,114px);transform:translate(-50%,-50%) rotate(var(--r,0deg)) scale(.55);border-radius:44% 42% 36% 38%;background:radial-gradient(circle at 35% 28%,rgba(255,255,255,.82) 0 8%,rgba(224,232,236,.82) 16%,rgba(150,158,164,.86) 42%,rgba(92,99,105,.88) 72%,rgba(48,53,58,.94) 100%);box-shadow:inset 10px 8px 0 rgba(255,255,255,.16), inset -14px -12px 0 rgba(44,48,54,.24), 0 0 20px rgba(220,226,230,.24);clip-path:polygon(18% 16%,33% 8%,47% 8%,58% 10%,70% 15%,82% 28%,92% 44%,92% 60%,82% 75%,64% 87%,42% 92%,22% 86%,10% 69%,6% 47%,9% 28%);opacity:0;animation:saFistRush var(--d,380ms) cubic-bezier(.15,.75,.28,1) forwards}
 .sa-movefx-smokefist::before{content:'';position:absolute;inset:-6%;border-radius:50%;background:radial-gradient(circle at 26% 34%,rgba(255,255,255,.22) 0 7%,rgba(255,255,255,0) 8%),radial-gradient(circle at 62% 22%,rgba(255,255,255,.14) 0 6%,rgba(255,255,255,0) 7%),radial-gradient(circle at 72% 56%,rgba(255,255,255,.12) 0 9%,rgba(255,255,255,0) 10%),radial-gradient(circle at 40% 70%,rgba(255,255,255,.12) 0 10%,rgba(255,255,255,0) 11%);filter:blur(1px)}
 .sa-movefx-train{left:var(--x1,-12%);top:var(--y1,60%);width:var(--w,280px);height:var(--h,150px);transform:translate(-50%,-50%) scale(.45);opacity:0;animation:saTrainCharge var(--d,760ms) linear forwards}
 .sa-movefx-train .engine,.sa-movefx-train .cab,.sa-movefx-train .cowcatcher,.sa-movefx-train .wheel,.sa-movefx-train .smoke,.sa-movefx-train .window,.sa-movefx-train .chimney{position:absolute;pointer-events:none}
 .sa-movefx-train .engine{left:34%;top:34%;width:42%;height:28%;background:#2e3942;box-shadow:inset 0 0 0 4px rgba(100,115,126,.75)}
 .sa-movefx-train .cab{left:58%;top:16%;width:20%;height:24%;background:#44515c;box-shadow:inset 0 0 0 4px rgba(122,138,149,.65)}
 .sa-movefx-train .window{left:62%;top:20%;width:10%;height:10%;background:#d9f6ff;box-shadow:12px 0 0 0 #d9f6ff}
 .sa-movefx-train .cowcatcher{left:22%;top:40%;width:16%;height:18%;background:linear-gradient(90deg,#7f4b1d,#b96b2a);clip-path:polygon(0 50%,100% 0,100% 100%)}
 .sa-movefx-train .chimney{left:46%;top:10%;width:8%;height:18%;background:#252b31;box-shadow:inset 0 0 0 3px rgba(95,105,112,.55)}
 .sa-movefx-train .wheel{bottom:12%;width:18%;height:32%;border-radius:50%;background:radial-gradient(circle at 50% 50%,#748089 0 18%,#2a3035 19% 54%,#8c98a1 55% 70%,#1a1f24 71% 100%)}
 .sa-movefx-train .wheel.w1{left:30%}.sa-movefx-train .wheel.w2{left:48%}.sa-movefx-train .wheel.w3{left:66%}
 .sa-movefx-train .smoke{left:44%;top:0;width:20%;height:20%;border-radius:50%;background:radial-gradient(circle at 38% 34%,rgba(255,255,255,.82),rgba(214,224,230,.75) 42%,rgba(129,139,146,.52) 70%,rgba(129,139,146,0) 82%);box-shadow:-18px 18px 0 4px rgba(204,216,224,.72), 16px 14px 0 0 rgba(182,194,201,.68), 6px 34px 0 8px rgba(160,170,178,.52)}
 .sa-movefx-wire{left:var(--x,20%);top:var(--y,50%);width:var(--w,180px);height:var(--h,16px);transform:translate(-50%,-50%) rotate(var(--r,0deg)) scaleX(0);transform-origin:0 50%;opacity:0;background:repeating-linear-gradient(90deg,#dde7ef 0 10px,#6ea9d5 10px 20px,#cbd5de 20px 30px,#55d7ff 30px 40px);border-radius:999px;box-shadow:0 0 16px rgba(98,219,255,.42), inset 0 0 0 3px rgba(40,65,86,.22);animation:saWireLash var(--d,300ms) ease-out forwards}
 .sa-movefx-wire::before{content:'';position:absolute;left:-8%;top:20%;width:18%;height:60%;border-radius:10px;background:linear-gradient(180deg,#95a7b7,#4a5660);box-shadow:inset 0 0 0 2px rgba(230,240,248,.2)}
 .sa-movefx-wire::after{content:'';position:absolute;right:-4%;top:8%;width:10%;height:84%;border-radius:10px;background:linear-gradient(180deg,#f5f8fa,#91def7 40%,#24a2d6 80%,#0d5373);box-shadow:0 0 14px rgba(104,219,255,.55)}
 .sa-movefx-circuit{left:var(--x,50%);top:var(--y,50%);width:var(--w,132px);height:var(--h,96px);transform:translate(-50%,-50%) scale(.45);border-radius:14px;background:linear-gradient(180deg,#42df89,#149f53);box-shadow:inset 0 0 0 4px rgba(12,88,45,.4),0 0 18px rgba(98,255,185,.28);opacity:0}
 .sa-movefx-circuit.left{clip-path:polygon(0 0,88% 0,74% 100%,0 100%);animation:saCircuitSplitL var(--d,420ms) ease-out forwards}
 .sa-movefx-circuit.right{clip-path:polygon(26% 0,100% 0,100% 100%,12% 100%);animation:saCircuitSplitR var(--d,420ms) ease-out forwards}
 .sa-movefx-circuit::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent 0 14%,rgba(197,255,222,.88) 14% 17%,transparent 17% 32%,rgba(197,255,222,.82) 32% 35%,transparent 35% 54%,rgba(197,255,222,.84) 54% 57%,transparent 57% 74%,rgba(197,255,222,.82) 74% 77%,transparent 77% 100%),linear-gradient(180deg,transparent 0 24%,rgba(197,255,222,.82) 24% 27%,transparent 27% 52%,rgba(197,255,222,.86) 52% 55%,transparent 55% 78%,rgba(197,255,222,.82) 78% 81%,transparent 81% 100%)}
 .sa-movefx-circuit::after{content:'';position:absolute;left:18%;top:18%;width:14%;height:18%;background:#d8ffe4;box-shadow:32px 4px 0 0 #d8ffe4, 68px 12px 0 0 #d8ffe4, 10px 44px 0 0 #d8ffe4, 52px 50px 0 0 #d8ffe4;opacity:.9}
 .sa-movefx-energyfist{left:var(--x1,20%);top:var(--y1,50%);width:var(--s,108px);height:var(--s,108px);transform:translate(-50%,-50%) rotate(var(--r,0deg)) scale(.5);border-radius:44% 42% 36% 38%;background:radial-gradient(circle at 34% 30%,#fff 0 8%,var(--c1,#d6f8ff) 15%,var(--c2,#56c7ff) 42%,var(--c3,#2568ff) 72%,rgba(32,88,255,.95) 100%);box-shadow:0 0 22px var(--glow,rgba(91,220,255,.55)), inset 10px 8px 0 rgba(255,255,255,.18), inset -14px -12px 0 rgba(15,43,103,.24);clip-path:polygon(18% 16%,33% 8%,47% 8%,58% 10%,70% 15%,82% 28%,92% 44%,92% 60%,82% 75%,64% 87%,42% 92%,22% 86%,10% 69%,6% 47%,9% 28%);opacity:0;animation:saFistRush var(--d,300ms) cubic-bezier(.15,.75,.28,1) forwards}
 .sa-movefx-energyfist::before{content:'';position:absolute;inset:-6%;border-radius:50%;background:radial-gradient(circle at 26% 34%,rgba(255,255,255,.24) 0 7%,rgba(255,255,255,0) 8%),radial-gradient(circle at 62% 22%,rgba(255,255,255,.14) 0 6%,rgba(255,255,255,0) 7%),radial-gradient(circle at 72% 56%,rgba(255,255,255,.12) 0 9%,rgba(255,255,255,0) 10%),radial-gradient(circle at 40% 70%,rgba(255,255,255,.12) 0 10%,rgba(255,255,255,0) 11%);filter:blur(1px)}
 @keyframes saFullFlash{0%{opacity:0}14%{opacity:.95}100%{opacity:0}}
 @keyframes saTintPulse{0%{opacity:0}18%{opacity:.8}100%{opacity:0}}
 @keyframes saBoltStrike{0%{opacity:0}10%{opacity:1}40%{opacity:.95}100%{opacity:0}}
 @keyframes saBeamSweep{0%{opacity:0;transform:translate(-50%,-50%) rotate(var(--r,0deg)) scaleX(.15)}14%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) rotate(var(--r,0deg)) scaleX(1)}}
 @keyframes saShardFly{0%{opacity:0;transform:translate(-50%,-50%) translate(0,0) rotate(var(--r,0deg)) scale(.5)}12%{opacity:1}100%{opacity:0;transform:translate(calc(-50% + var(--dx,0px)),calc(-50% + var(--dy,0px))) rotate(calc(var(--r,0deg) + 120deg)) scale(1)}}
 @keyframes saPulseBlast{0%{opacity:0;transform:translate(-50%,-50%) scale(.2)}18%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(1.2)}}
 @keyframes saCometFly{0%{left:var(--x1,20%);top:var(--y1,50%);opacity:0}10%{opacity:1}100%{left:var(--x2,80%);top:var(--y2,50%);opacity:0}}
 @keyframes saSwirl{0%{opacity:0;transform:translate(-50%,-50%) rotate(0deg) scale(.35)}14%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) rotate(340deg) scale(1.05)}}
 @keyframes saImpactBurst{0%{opacity:0;transform:translate(-50%,-50%) scale(.15)}18%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(1.15)}}
 @keyframes saCrack{0%{opacity:0;transform:translate(-50%,-50%) scale(.5)}12%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(1)}}
 @keyframes saStarburst{0%{opacity:0;transform:translate(-50%,-50%) scale(.2) rotate(0deg)}18%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(1) rotate(40deg)}}
 @keyframes saFistRush{0%{left:var(--x1,20%);top:var(--y1,50%);opacity:0;transform:translate(-50%,-50%) rotate(var(--r,0deg)) scale(.5)}14%{opacity:1}70%{opacity:1}100%{left:var(--x2,80%);top:var(--y2,50%);opacity:0;transform:translate(-50%,-50%) rotate(calc(var(--r,0deg) + 18deg)) scale(1.08)}}
 @keyframes saClubSlam{0%{opacity:0;transform:translate(-50%,-50%) translate(var(--sx,-120px),var(--sy,-130px)) rotate(calc(var(--r,-28deg) - 22deg)) scale(.3)}16%{opacity:1}62%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) translate(0,0) rotate(var(--r,-28deg)) scale(1)}}
 @keyframes saGlueShot{0%{left:var(--x1,20%);top:var(--y1,50%);opacity:0;transform:translate(-50%,-50%) rotate(var(--r,0deg)) scale(.55)}12%{opacity:1}72%{opacity:1}100%{left:var(--x2,80%);top:var(--y2,50%);opacity:0;transform:translate(-50%,-50%) rotate(calc(var(--r,0deg) + 32deg)) scale(1.18)}}
 @keyframes saMountainSplit{0%{opacity:0;transform:translate(-50%,-50%) translateX(0) rotate(0deg) scale(.35)}14%{opacity:1}56%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) translateX(var(--tx,0px)) rotate(var(--rot,0deg)) scale(1.02)}}
 @keyframes saDustPoof{0%{opacity:0;transform:translate(-50%,-50%) scale(.35)}16%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(1.18)}}
 @keyframes saOrbShot{0%{left:var(--x1,20%);top:var(--y1,50%);opacity:0;transform:translate(-50%,-50%) scale(.4)}12%{opacity:1}72%{opacity:1}100%{left:var(--x2,80%);top:var(--y2,50%);opacity:0;transform:translate(-50%,-50%) scale(1.06)}}
 @keyframes saCloudDrop{0%{opacity:0;transform:translate(-50%,-50%) scale(.3)}14%{opacity:1}70%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(1)}}
 @keyframes saPumpRush{0%{left:var(--x1,20%);top:var(--y1,50%);opacity:0;transform:translate(-50%,-50%) rotate(var(--r,0deg)) scale(.34)}12%{opacity:1}72%{opacity:1}100%{left:var(--x2,80%);top:var(--y2,50%);opacity:0;transform:translate(-50%,-50%) rotate(calc(var(--r,0deg) + 10deg)) scale(1)}}
 @keyframes saSmokeBillow{0%{opacity:0;transform:translate(-50%,-50%) scale(.26)}16%{opacity:.95}100%{opacity:0;transform:translate(calc(-50% + var(--dx,0px)),calc(-50% + var(--dy,-40px))) scale(1.15)}}
 @keyframes saLeafDrift{0%{opacity:0;transform:translate(-50%,-50%) rotate(var(--r,0deg)) scale(.24)}14%{opacity:.95}100%{opacity:0;transform:translate(calc(-50% + var(--dx,0px)),calc(-50% + var(--dy,-22px))) rotate(calc(var(--r,0deg) + 24deg)) scale(1.06)}}
 @keyframes saStinkPass{0%{left:var(--x1,35%);top:var(--y1,50%);opacity:0;transform:translate(-50%,-50%) scale(.24)}12%{opacity:1}70%{opacity:1}100%{left:var(--x2,65%);top:var(--y2,50%);opacity:0;transform:translate(-50%,-50%) scale(1)}}
 @keyframes saBombArc{0%{left:var(--x1,20%);top:var(--y1,50%);opacity:0;transform:translate(-50%,-50%) rotate(0deg) scale(.35)}12%{opacity:1}100%{left:var(--x2,80%);top:var(--y2,50%);opacity:0;transform:translate(-50%,-50%) translateY(var(--arc,-50px)) rotate(320deg) scale(1)}}
 @keyframes saTrainCharge{0%{left:var(--x1,-12%);top:var(--y1,60%);opacity:0;transform:translate(-50%,-50%) scale(.35)}8%{opacity:1}75%{opacity:1}100%{left:var(--x2,112%);top:var(--y2,60%);opacity:0;transform:translate(-50%,-50%) scale(1.02)}}
 @keyframes saWireLash{0%{opacity:0;transform:translate(-50%,-50%) rotate(var(--r,0deg)) scaleX(0)}15%{opacity:1}78%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) rotate(var(--r,0deg)) scaleX(1)}}
 @keyframes saCircuitSplitL{0%{opacity:0;transform:translate(-50%,-50%) scale(.35) rotate(0deg)}10%{opacity:1}45%{opacity:1}100%{opacity:0;transform:translate(calc(-50% - 28px),calc(-50% - 8px)) scale(1) rotate(-18deg)}}
 @keyframes saCircuitSplitR{0%{opacity:0;transform:translate(-50%,-50%) scale(.35) rotate(0deg)}10%{opacity:1}45%{opacity:1}100%{opacity:0;transform:translate(calc(-50% + 28px),calc(-50% + 8px)) scale(1) rotate(18deg)}}
 `;
 document.head.appendChild(style);
 const jealousyStyle=document.createElement('style');
 jealousyStyle.textContent=`
 .sa-movefx-night,.sa-movefx-scratch,.sa-movefx-voodoo,.sa-movefx-needle,.sa-movefx-wolf,.sa-movefx-copy{position:absolute;pointer-events:none}
 .sa-movefx-night{inset:0;background:radial-gradient(circle at 50% 42%,rgba(116,77,176,.18) 0 18%,rgba(42,20,70,.58) 54%,rgba(10,4,18,.72) 100%);opacity:0;animation:saNightFall var(--d,900ms) ease-out forwards}
 .sa-movefx-scratch{left:var(--x,50%);top:var(--y,50%);width:var(--w,116px);height:var(--h,16px);transform:translate(-50%,-50%) rotate(var(--r,-22deg)) scaleX(.25);border-radius:999px;background:linear-gradient(90deg,rgba(255,255,255,0),#fff 16%,var(--c,#bf80ff) 38%,#fff 66%,rgba(255,255,255,0));box-shadow:0 0 14px var(--c,#bf80ff);opacity:0;animation:saScratch var(--d,320ms) ease-out forwards}
 .sa-movefx-scratch::before,.sa-movefx-scratch::after{content:'';position:absolute;left:0;right:0;height:100%;border-radius:999px;background:inherit;box-shadow:inherit}
 .sa-movefx-scratch::before{top:-16px;transform:translateX(8px)}
 .sa-movefx-scratch::after{top:16px;transform:translateX(-8px)}
 .sa-movefx-voodoo{left:var(--x,50%);top:var(--y,50%);width:var(--s,84px);height:calc(var(--s,84px)*1.2);transform:translate(-50%,-50%) scale(.45);opacity:0;animation:saDollAppear var(--d,520ms) ease-out forwards}
 .sa-movefx-voodoo::before{content:'';position:absolute;left:18%;top:18%;width:64%;height:64%;border-radius:50% 50% 42% 42%;background:linear-gradient(180deg,#9b6dd6,#5f358f);box-shadow:inset 0 0 0 4px rgba(235,211,255,.18), 0 0 18px rgba(169,108,255,.35)}
 .sa-movefx-voodoo::after{content:'';position:absolute;left:30%;top:64%;width:40%;height:26%;border-radius:14px;background:linear-gradient(180deg,#8d5fcb,#4f286f);box-shadow:-18px 2px 0 -4px #6a3aa0, 18px 2px 0 -4px #6a3aa0, -10px 24px 0 -6px #6a3aa0, 10px 24px 0 -6px #6a3aa0}
 .sa-movefx-needle{left:var(--x1,30%);top:var(--y1,50%);width:var(--w,72px);height:var(--h,10px);transform:translate(-50%,-50%) rotate(var(--r,-25deg)) scaleX(.2);transform-origin:left center;border-radius:999px;background:linear-gradient(90deg,#d9eef6 0 70%,#ff6a82 70% 100%);box-shadow:0 0 10px rgba(255,112,141,.45);opacity:0;animation:saNeedleStab var(--d,260ms) ease-out forwards}
 .sa-movefx-needle::after{content:'';position:absolute;right:-10px;top:0;width:0;height:0;border-left:12px solid #f8fbff;border-top:5px solid transparent;border-bottom:5px solid transparent}
 .sa-movefx-wolf{left:var(--x1,-12%);top:var(--y1,56%);width:var(--w,190px);height:var(--h,92px);transform:translate(-50%,-50%) scale(.45);opacity:0;animation:saWolfRun var(--d,700ms) linear forwards}
 .sa-movefx-wolf::before{content:'';position:absolute;left:0;top:10%;width:100%;height:80%;background:linear-gradient(180deg,#c9a6ff 0 6%,#7d4bc0 18%,#30124e 72%,#11091d 100%);clip-path:polygon(0 70%,8% 54%,15% 48%,18% 34%,26% 24%,34% 8%,46% 18%,50% 4%,58% 18%,64% 26%,76% 18%,86% 24%,92% 42%,100% 52%,94% 62%,84% 60%,74% 74%,66% 96%,58% 78%,50% 96%,42% 78%,36% 94%,28% 74%,20% 78%,16% 96%,10% 76%);box-shadow:0 0 18px rgba(170,121,255,.42)}
 .sa-movefx-wolf::after{content:'';position:absolute;right:-8%;top:32%;width:24%;height:18%;background:linear-gradient(90deg,rgba(178,126,255,.9),rgba(178,126,255,0));clip-path:polygon(0 50%,100% 0,100% 100%);filter:blur(1px)}
 .sa-movefx-copy{left:var(--x1,20%);top:var(--y1,50%);width:var(--w,88px);height:var(--h,88px);transform:translate(-50%,-50%) rotate(var(--r,0deg)) scale(var(--sc,.7));background-position:center;background-size:contain;background-repeat:no-repeat;image-rendering:pixelated;filter:brightness(.15) saturate(220%) sepia(45%) hue-rotate(220deg) drop-shadow(0 0 14px rgba(185,118,255,.72));opacity:0;animation:saCopyDive var(--d,340ms) ease-out forwards}
 @keyframes saNightFall{0%{opacity:0}12%{opacity:1}72%{opacity:1}100%{opacity:0}}
 @keyframes saScratch{0%{opacity:0;transform:translate(-50%,-50%) rotate(var(--r,-22deg)) scaleX(.25)}18%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) rotate(var(--r,-22deg)) scaleX(1)}}
 @keyframes saDollAppear{0%{opacity:0;transform:translate(-50%,-50%) scale(.25)}18%{opacity:1}70%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(1)}}
 @keyframes saNeedleStab{0%{left:var(--x1,30%);top:var(--y1,50%);opacity:0;transform:translate(-50%,-50%) rotate(var(--r,-25deg)) scaleX(.2)}18%{opacity:1}100%{left:var(--x2,50%);top:var(--y2,50%);opacity:0;transform:translate(-50%,-50%) rotate(var(--r,-25deg)) scaleX(1)}}
 @keyframes saWolfRun{0%{left:var(--x1,-12%);top:var(--y1,56%);opacity:0;transform:translate(-50%,-50%) scale(.35)}8%{opacity:1}82%{opacity:1}100%{left:var(--x2,112%);top:var(--y2,56%);opacity:0;transform:translate(-50%,-50%) scale(1)}}
 @keyframes saCopyDive{0%{left:var(--x1,20%);top:var(--y1,50%);opacity:0;transform:translate(-50%,-50%) rotate(var(--r,0deg)) scale(calc(var(--sc,.7)*.45))}18%{opacity:1}100%{left:var(--x2,50%);top:var(--y2,50%);opacity:0;transform:translate(-50%,-50%) rotate(calc(var(--r,0deg) + 8deg)) scale(var(--sc,.7))}}
 `;
 document.head.appendChild(jealousyStyle);
 const lunarStyle=document.createElement('style');
 lunarStyle.textContent=`
 .sa-movefx-boulder{left:var(--x1,20%);top:var(--y1,50%);width:var(--s,110px);height:var(--s,110px);transform:translate(-50%,-50%) rotate(var(--r,0deg)) scale(.4);border-radius:50%;background:radial-gradient(circle at 34% 30%,#eee6d7 0 8%,#c0b39d 16%,#8a7a62 52%,#5a4c3d 78%,#2c241d 100%);box-shadow:inset 10px 8px 0 rgba(255,255,255,.16), inset -14px -12px 0 rgba(42,32,24,.28), 0 0 16px rgba(194,170,134,.22);opacity:0;animation:saBoulderThrow var(--d,460ms) cubic-bezier(.18,.72,.24,1) forwards}
 .sa-movefx-boulder::before{content:'';position:absolute;inset:8%;border-radius:50%;background:radial-gradient(circle at 28% 24%,rgba(255,255,255,.14) 0 6%,rgba(255,255,255,0) 7%),radial-gradient(circle at 66% 22%,rgba(255,255,255,.10) 0 5%,rgba(255,255,255,0) 6%),radial-gradient(circle at 76% 54%,rgba(66,51,38,.28) 0 8%,rgba(66,51,38,0) 9%),radial-gradient(circle at 34% 64%,rgba(66,51,38,.24) 0 10%,rgba(66,51,38,0) 11%),radial-gradient(circle at 54% 78%,rgba(66,51,38,.22) 0 6%,rgba(66,51,38,0) 7%)}
 .sa-movefx-boulder::after{content:'';position:absolute;inset:-14%;border-radius:50%;background:radial-gradient(circle,rgba(173,146,112,.20),rgba(173,146,112,0) 70%)}
 @keyframes saBoulderThrow{0%{left:var(--x1,20%);top:var(--y1,50%);opacity:0;transform:translate(-50%,-50%) rotate(0deg) scale(.28)}10%{opacity:1}100%{left:var(--x2,80%);top:var(--y2,50%);opacity:0;transform:translate(-50%,-50%) translateY(var(--arc,-26px)) rotate(var(--spin,420deg)) scale(1)}}
 `;
 document.head.appendChild(lunarStyle);
 const angolaStyle=document.createElement('style');
 angolaStyle.textContent=`
 .sa-movefx-spear,.sa-movefx-roar,.sa-movefx-lion,.sa-movefx-crown{position:absolute;pointer-events:none}
 .sa-movefx-spear{left:var(--x1,20%);top:var(--y1,50%);width:var(--w,180px);height:var(--h,44px);transform:translate(-50%,-50%) rotate(var(--r,0deg)) scaleX(.28);transform-origin:left center;opacity:0;animation:saSpearRush var(--d,360ms) cubic-bezier(.14,.76,.22,1) forwards}
 .sa-movefx-spear::before{content:'';position:absolute;left:0;top:37%;width:78%;height:26%;border-radius:999px;background:linear-gradient(90deg,#fff0b6 0 8%,#ffdc70 8% 18%,#ff953a 18% 60%,#d63822 60% 88%,#6d120d 88% 100%);box-shadow:0 0 18px rgba(255,157,68,.42), inset 0 0 0 3px rgba(255,236,190,.14)}
 .sa-movefx-spear::after{content:'';position:absolute;right:0;top:14%;width:30%;height:72%;background:linear-gradient(90deg,#fff4c0,#ffd45e 24%,#ff8c31 64%,#c52414 100%);clip-path:polygon(0 50%,100% 0,100% 100%);box-shadow:0 0 18px rgba(255,193,92,.4)}
 .sa-movefx-roar{left:var(--x,50%);top:var(--y,50%);width:var(--w,168px);height:var(--h,120px);transform:translate(-50%,-50%) scale(.38);opacity:0;animation:saRoarShow var(--d,560ms) ease-out forwards}
 .sa-movefx-roar::before{content:'';position:absolute;inset:8% 10% 14% 10%;background:radial-gradient(circle at 50% 40%,#fff3c4 0 8%,#ffcf61 14%,#ff7d2b 44%,#d9331f 72%,#5c0b09 100%);clip-path:polygon(14% 74%,10% 46%,18% 26%,30% 12%,40% 18%,50% 6%,60% 18%,72% 12%,84% 26%,90% 46%,86% 74%,72% 66%,62% 84%,50% 94%,38% 84%,28% 66%);box-shadow:0 0 24px rgba(255,160,60,.4)}
 .sa-movefx-roar::after{content:'';position:absolute;left:24%;right:24%;top:36%;bottom:28%;background:radial-gradient(circle at 50% 64%,#1b0605 0 18%,#4a0e0a 20%,#0f0202 72%);border-radius:46% 46% 58% 58%;box-shadow:inset 0 8px 0 rgba(255,214,150,.18)}
 .sa-movefx-roar .tooth{position:absolute;width:0;height:0;border-left:9px solid transparent;border-right:9px solid transparent;border-top:18px solid #fff7de;top:39%;filter:drop-shadow(0 0 4px rgba(255,244,220,.45))}
 .sa-movefx-roar .wave{position:absolute;left:50%;top:50%;width:28%;height:28%;border-radius:50%;border:6px solid rgba(255,175,78,.82);transform:translate(-50%,-50%) scale(.25);opacity:0;animation:saRoarWave var(--wd,420ms) ease-out forwards}
 .sa-movefx-lion{left:var(--x1,-12%);top:var(--y1,56%);width:var(--w,190px);height:var(--h,108px);transform:translate(-50%,-50%) scale(.4);opacity:0;animation:saLionCharge var(--d,700ms) linear forwards;image-rendering:pixelated}
 .sa-movefx-lion::before{content:'';position:absolute;left:0;top:6%;width:100%;height:88%;background:linear-gradient(180deg,#fff0b6 0 6%,#ffd45e 14%,#ff8d2f 42%,#db3c1d 72%,#4d0d08 100%);clip-path:polygon(0 68%,8% 56%,10% 42%,18% 28%,28% 20%,34% 4%,46% 14%,56% 12%,64% 6%,74% 20%,86% 22%,94% 40%,100% 46%,96% 56%,88% 58%,82% 74%,74% 96%,66% 74%,58% 94%,50% 76%,42% 96%,34% 76%,24% 88%,20% 72%,16% 92%,10% 74%);box-shadow:0 0 20px rgba(255,132,36,.42)}
 .sa-movefx-lion::after{content:'';position:absolute;right:-10%;top:32%;width:28%;height:18%;background:linear-gradient(90deg,rgba(255,180,83,.95),rgba(255,180,83,0));clip-path:polygon(0 50%,100% 0,100% 100%);filter:blur(1px)}
 .sa-movefx-crown{left:var(--x1,20%);top:var(--y1,50%);width:var(--w,76px);height:var(--h,66px);transform:translate(-50%,-50%) rotate(var(--r,0deg)) scale(.42);opacity:0;animation:saCrownArc var(--d,480ms) cubic-bezier(.18,.78,.26,1) forwards}
 .sa-movefx-crown::before{content:'';position:absolute;left:6%;right:6%;top:10%;bottom:14%;background:linear-gradient(180deg,#fff7cf 0 8%,#ffd96e 24%,#ff9a2f 60%,#d52f1f 100%);clip-path:polygon(0 100%,0 58%,16% 54%,26% 10%,42% 56%,50% 0,58% 56%,74% 10%,84% 54%,100% 58%,100% 100%);box-shadow:0 0 20px rgba(255,162,69,.42), inset 0 0 0 3px rgba(255,244,213,.16)}
 .sa-movefx-crown::after{content:'';position:absolute;left:18%;right:18%;bottom:8%;height:16%;border-radius:999px;background:linear-gradient(180deg,#ffd86f,#d85b23);box-shadow:0 0 12px rgba(255,171,74,.3)}
 @keyframes saSpearRush{0%{left:var(--x1,20%);top:var(--y1,50%);opacity:0;transform:translate(-50%,-50%) rotate(var(--r,0deg)) scaleX(.28)}12%{opacity:1}100%{left:var(--x2,80%);top:var(--y2,50%);opacity:0;transform:translate(-50%,-50%) rotate(var(--r,0deg)) scaleX(1)}}
 @keyframes saRoarShow{0%{opacity:0;transform:translate(-50%,-50%) scale(.24)}12%{opacity:1}70%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(1)}}
 @keyframes saRoarWave{0%{opacity:0;transform:translate(-50%,-50%) scale(.25)}16%{opacity:.9}100%{opacity:0;transform:translate(-50%,-50%) scale(2.6)}}
 @keyframes saLionCharge{0%{left:var(--x1,-12%);top:var(--y1,56%);opacity:0;transform:translate(-50%,-50%) scale(.35)}8%{opacity:1}82%{opacity:1}100%{left:var(--x2,112%);top:var(--y2,56%);opacity:0;transform:translate(-50%,-50%) scale(1)}}
 @keyframes saCrownArc{0%{left:var(--x1,20%);top:var(--y1,50%);opacity:0;transform:translate(-50%,-50%) rotate(var(--r,0deg)) scale(.32)}12%{opacity:1}100%{left:var(--x2,80%);top:var(--y2,50%);opacity:0;transform:translate(-50%,-50%) translateY(var(--arc,-34px)) rotate(calc(var(--r,0deg) + 160deg)) scale(1)}}
 `;
 document.head.appendChild(angolaStyle);

 let currentFxProfileId='star';
 function fxScaleFor(id){
  const map={northern:1.18,gorilla:1.18,sourdiesel:1.22,cheese:1.24,trainwreck:1.23,rs11:1.24,jealousy:1.25,lunarrock:1.24,angolaroja:1.22,star:1};
  return map[id]||1;
 }
 function setFxProfile(id){ currentFxProfileId=id||'star'; }
 function applyOverlayProfile(overlay){
  if(!overlay||overlay.children.length<2) return;
  const scale=fxScaleFor(currentFxProfileId);
  const boosted=currentFxProfileId && currentFxProfileId!=='star';
  const back=overlay.children[0], front=overlay.children[1];
  [back,front].forEach(layer=>{
   layer.style.transformOrigin='50% 50%';
   layer.style.transform='scale('+scale+')';
  });
  back.style.filter=boosted?'brightness(1.06) saturate(1.08)':'';
  front.style.filter=boosted?'brightness(1.08) saturate(1.1) drop-shadow(0 0 3px rgba(255,255,255,.12))':'';
 }
 function ensureOverlay(){
  const field=document.querySelector('.battle-field');
  if(!field) return null;
  let overlay=field.querySelector('.sa-movefx-overlay');
  if(!overlay){
   overlay=document.createElement('div');
   overlay.className='sa-movefx-overlay';
   overlay.innerHTML='<div class="sa-movefx-layer sa-movefx-back"></div><div class="sa-movefx-layer sa-movefx-front"></div>';
   field.appendChild(overlay);
  }
  applyOverlayProfile(overlay);
  return overlay;
 }
 function clearOverlay(){ const o=ensureOverlay(); if(o){ o.innerHTML='<div class="sa-movefx-layer sa-movefx-back"></div><div class="sa-movefx-layer sa-movefx-front"></div>'; applyOverlayProfile(o);} }
 function layers(){ const o=ensureOverlay(); return o?{back:o.children[0],front:o.children[1]}:null; }
 function add(layer,cls,vars={},life=900){ if(!layer) return null; const el=document.createElement('div'); el.className=cls; for(const [k,v] of Object.entries(vars)) el.style.setProperty(k,v); layer.appendChild(el); setTimeout(()=>{try{el.remove();}catch(e){}},life); return el; }
 function rand(min,max){ return min+Math.random()*(max-min); }
 function flash(bg,d=420){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-fullflash',{'--bg':bg,'--d':d+'ms'},d+120); }
 function tint(bg,d=700){ const l=layers(); if(!l) return; add(l.back,'sa-movefx-tint',{'--bg':bg,'--d':d+'ms'},d+140); }
 function bolt(x,c,d=320,w=26,r=0){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-bolt',{'--x':x+'%','--c':c,'--d':d+'ms','--w':w+'px','--r':r+'deg'},d+120); }
 function beam(x,y,c,d=400,w=240,h=34,r=0){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-beam',{'--x':x+'%','--y':y+'%','--c':c,'--d':d+'ms','--w':w+'px','--h':h+'px','--r':r+'deg'},d+120); }
 function wave(x,y,c,d=380,w=220,h=34,r=0){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-wave',{'--x':x+'%','--y':y+'%','--c':c,'--d':d+'ms','--w':w+'px','--h':h+'px','--r':r+'deg'},d+120); }
 function pulse(x,y,c,d=420,s=110){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-pulse',{'--x':x+'%','--y':y+'%','--c':c,'--d':d+'ms','--s':s+'px'},d+120); }
 function impact(x,y,c,d=420,s=140){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-impact',{'--x':x+'%','--y':y+'%','--c':c,'--d':d+'ms','--s':s+'px'},d+120); }
 function comet(x1,y1,x2,y2,c,trail,d=450,s=34){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-comet',{'--x1':x1+'%','--y1':y1+'%','--x2':x2+'%','--y2':y2+'%','--c':c,'--trail':trail,'--d':d+'ms','--s':s+'px'},d+120); }
 function swirl(x,y,c1,c2,d=760,s=160){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-swirl',{'--x':x+'%','--y':y+'%','--c1':c1,'--c2':c2,'--d':d+'ms','--s':s+'px'},d+120); }
 function crack(x,d=500,w=200,h=70){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-crack',{'--x':x+'%','--d':d+'ms','--w':w+'px','--h':h+'px'},d+120); }
 function starburst(x,y,c,d=520,s=190){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-starburst',{'--x':x+'%','--y':y+'%','--c':c,'--d':d+'ms','--s':s+'px'},d+120); }
 function shardBurst(x,y,color,count=12,spread=180,life=720){ const l=layers(); if(!l) return; for(let i=0;i<count;i++){ const a=(Math.PI*2*i)/count+Math.random()*0.35; const dist=rand(spread*.45,spread); add(l.front,'sa-movefx-shard',{'--x':x+'%','--y':y+'%','--c':color,'--dx':Math.cos(a)*dist+'px','--dy':Math.sin(a)*dist+'px','--s':rand(10,22)+'px','--r':rand(0,360)+'deg','--d':rand(life*.8,life*1.1)+'ms'},life+180);} }
 function fist(x1,y1,x2,y2,d=390,s=110,r=0){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-fist',{'--x1':x1+'%','--y1':y1+'%','--x2':x2+'%','--y2':y2+'%','--d':d+'ms','--s':s+'px','--r':r+'deg'},d+120); }
 function club(x,y,d=440,w=220,h=46,r=-28,sx=-120,sy=-125){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-club',{'--x':x+'%','--y':y+'%','--d':d+'ms','--w':w+'px','--h':h+'px','--r':r+'deg','--sx':sx+'px','--sy':sy+'px'},d+120); }
 function glue(x1,y1,x2,y2,d=420,s=34,r=0,c1='#ffe27a',c2='#d09b1f'){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-glue',{'--x1':x1+'%','--y1':y1+'%','--x2':x2+'%','--y2':y2+'%','--d':d+'ms','--s':s+'px','--r':r+'deg','--c1':c1,'--c2':c2},d+120); }
 function mountain(x,y,d=760,w=280,h=180,split=52){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-mountain left',{'--x':x+'%','--y':y+'%','--d':d+'ms','--w':w+'px','--h':h+'px','--tx':(-split)+'px','--rot':'-7deg'},d+180); add(l.front,'sa-movefx-mountain right',{'--x':x+'%','--y':y+'%','--d':d+'ms','--w':w+'px','--h':h+'px','--tx':split+'px','--rot':'7deg'},d+180); }
 function dust(x,y,c='rgba(214,176,124,.72)',d=520,w=170,h=80){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-dust',{'--x':x+'%','--y':y+'%','--c':c,'--d':d+'ms','--w':w+'px','--h':h+'px'},d+120); }
 function orb(x1,y1,x2,y2,d=420,s=52,c1='#d5fbff',c2='#5cd8ff',c3='#5f78ff'){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-orb',{'--x1':x1+'%','--y1':y1+'%','--x2':x2+'%','--y2':y2+'%','--d':d+'ms','--s':s+'px','--c1':c1,'--c2':c2,'--c3':c3},d+120); }
 function cloud(x,y,d=520,w=150,h=70){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-cloud',{'--x':x+'%','--y':y+'%','--d':d+'ms','--w':w+'px','--h':h+'px'},d+120); }
 function pump(x1,y1,x2,y2,d=440,w=118,h=138,r=0){ const l=layers(); if(!l) return; const el=add(l.front,'sa-movefx-pump',{'--x1':x1+'%','--y1':y1+'%','--x2':x2+'%','--y2':y2+'%','--d':d+'ms','--w':w+'px','--h':h+'px','--r':r+'deg'},d+140); if(el){ const screen=document.createElement('div'); screen.className='screen'; el.appendChild(screen); const nozzle=document.createElement('div'); nozzle.className='nozzle'; el.appendChild(nozzle);} return el; }
 function smoke(x,y,d=720,s=74,dx=0,dy=-40){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-smoke',{'--x':x+'%','--y':y+'%','--d':d+'ms','--s':s+'px','--dx':dx+'px','--dy':dy+'px'},d+180); }
 function smokeBurst(x,y,count=8,s=74,spread=64,life=760){ for(let i=0;i<count;i++){ const ang=(Math.PI*2*i)/count+Math.random()*.5; const dist=rand(spread*.25,spread); smoke(x+rand(-2,2),y+rand(-2,2),rand(life*.82,life*1.08),rand(s*.82,s*1.24),Math.cos(ang)*dist,Math.sin(ang)*dist-24); } }
 function cheeseFist(x1,y1,x2,y2,d=390,s=114,r=0){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-cheesefist',{'--x1':x1+'%','--y1':y1+'%','--x2':x2+'%','--y2':y2+'%','--d':d+'ms','--s':s+'px','--r':r+'deg'},d+120); }
 function leaf(x,y,d=720,s=42,r=0,dx=0,dy=-22,c1='#9ff18a',c2='#45a442'){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-leaf',{'--x':x+'%','--y':y+'%','--d':d+'ms','--s':s+'px','--r':r+'deg','--dx':dx+'px','--dy':dy+'px','--c1':c1,'--c2':c2},d+140); }
 function leafBurst(x,y,count=9,s=42,spread=70,life=760){ for(let i=0;i<count;i++){ const ang=(Math.PI*2*i)/count + Math.random()*.45; const dist=rand(spread*.25,spread); leaf(x+rand(-2,2),y+rand(-2,2),rand(life*.8,life*1.06),rand(s*.78,s*1.16),rand(-40,40),Math.cos(ang)*dist,Math.sin(ang)*dist-14, i%2 ? '#baf6a8' : '#d8ffbb', i%2 ? '#4da84a' : '#6bbf4a'); } }
 function stinkCloud(x1,y1,x2,y2,d=720,w=150,h=96){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-stinkcloud',{'--x1':x1+'%','--y1':y1+'%','--x2':x2+'%','--y2':y2+'%','--d':d+'ms','--w':w+'px','--h':h+'px'},d+160); }
 function stinkBomb(x1,y1,x2,y2,d=620,s=52,arc=-52){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-bomb',{'--x1':x1+'%','--y1':y1+'%','--x2':x2+'%','--y2':y2+'%','--d':d+'ms','--s':s+'px','--arc':arc+'px'},d+140); }
 function smokeFist(x1,y1,x2,y2,d=390,s=114,r=0){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-smokefist',{'--x1':x1+'%','--y1':y1+'%','--x2':x2+'%','--y2':y2+'%','--d':d+'ms','--s':s+'px','--r':r+'deg'},d+120); }
 function steamTrain(x1,y1,x2,y2,d=760,w=280,h=150){ const l=layers(); if(!l) return; const el=add(l.front,'sa-movefx-train',{'--x1':x1+'%','--y1':y1+'%','--x2':x2+'%','--y2':y2+'%','--d':d+'ms','--w':w+'px','--h':h+'px'},d+180); if(el){ for(const c of ['engine','cab','window','cowcatcher','chimney','smoke','wheel w1','wheel w2','wheel w3']){ const div=document.createElement('div'); div.className=c; el.appendChild(div);} } return el; }
 function wireLash(x,y,w=180,r=0,d=300){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-wire',{'--x':x+'%','--y':y+'%','--w':w+'px','--r':r+'deg','--d':d+'ms'},d+120); }
 function circuitBreak(x,y,d=420,w=132,h=96){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-circuit left',{'--x':x+'%','--y':y+'%','--d':d+'ms','--w':w+'px','--h':h+'px'},d+160); add(l.front,'sa-movefx-circuit right',{'--x':x+'%','--y':y+'%','--d':d+'ms','--w':w+'px','--h':h+'px'},d+160); }
 function energyFist(x1,y1,x2,y2,d=300,s=108,r=0,c1='#d6f8ff',c2='#56c7ff',c3='#2568ff',glow='rgba(91,220,255,.55)'){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-energyfist',{'--x1':x1+'%','--y1':y1+'%','--x2':x2+'%','--y2':y2+'%','--d':d+'ms','--s':s+'px','--r':r+'deg','--c1':c1,'--c2':c2,'--c3':c3,'--glow':glow},d+120); }
 function nightOverlay(d=900){ const l=layers(); if(!l) return; add(l.back,'sa-movefx-night',{'--d':d+'ms'},d+140); }
 function scratchMark(x,y,d=320,w=116,h=16,r=-22,c='#bf80ff'){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-scratch',{'--x':x+'%','--y':y+'%','--d':d+'ms','--w':w+'px','--h':h+'px','--r':r+'deg','--c':c},d+120); }
 function voodooDoll(x,y,d=520,s=84){ const l=layers(); if(!l) return; const el=add(l.front,'sa-movefx-voodoo',{'--x':x+'%','--y':y+'%','--d':d+'ms','--s':s+'px'},d+140); if(el){ const eye1=document.createElement('div'); eye1.style.cssText='position:absolute;left:33%;top:31%;width:10%;height:10%;border-radius:50%;background:#f7f5ff;box-shadow:0 0 8px rgba(255,255,255,.5)'; const eye2=document.createElement('div'); eye2.style.cssText='position:absolute;left:57%;top:31%;width:10%;height:10%;border-radius:50%;background:#f7f5ff;box-shadow:0 0 8px rgba(255,255,255,.5)'; const mouth=document.createElement('div'); mouth.style.cssText='position:absolute;left:36%;top:49%;width:28%;height:6%;border-radius:6px;background:repeating-linear-gradient(90deg,#f5d8ff 0 4px,transparent 4px 8px)'; el.appendChild(eye1); el.appendChild(eye2); el.appendChild(mouth);} return el; }
 function needleStab(x1,y1,x2,y2,d=260,r=-22,w=72,h=10){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-needle',{'--x1':x1+'%','--y1':y1+'%','--x2':x2+'%','--y2':y2+'%','--d':d+'ms','--r':r+'deg','--w':w+'px','--h':h+'px'},d+120); }
 function werewolfRun(x1,y1,x2,y2,d=700,w=190,h=92){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-wolf',{'--x1':x1+'%','--y1':y1+'%','--x2':x2+'%','--y2':y2+'%','--d':d+'ms','--w':w+'px','--h':h+'px'},d+160); }
 function shadowCopy(x1,y1,x2,y2,d=340,w=88,h=88,r=0,sc=.72){ const l=layers(); if(!l) return; const el=add(l.front,'sa-movefx-copy',{'--x1':x1+'%','--y1':y1+'%','--x2':x2+'%','--y2':y2+'%','--d':d+'ms','--w':w+'px','--h':h+'px','--r':r+'deg','--sc':String(sc)},d+140); if(el){ el.style.backgroundImage='url('+CREATURE_IMAGES.jealousy+')'; } return el; }
 function boulder(x1,y1,x2,y2,d=460,s=110,r=0,arc=-28,spin=420){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-boulder',{'--x1':x1+'%','--y1':y1+'%','--x2':x2+'%','--y2':y2+'%','--d':d+'ms','--s':s+'px','--r':r+'deg','--arc':arc+'px','--spin':spin+'deg'},d+140); }
 function flipTarget(side,d=520){ const target=side==='player'?document.getElementById('battleEnemySprite'):document.getElementById('battlePlayerSprite'); if(!target||!target.animate) return; const base=target.classList.contains('player')?'scaleX(-1)':'none'; const upside=target.classList.contains('player')?'scaleX(-1) rotate(180deg)':'rotate(180deg)'; target.animate([{transform:base},{transform:upside, offset:.35},{transform:upside, offset:.68},{transform:base}],{duration:d,easing:'ease-in-out'}); }
 function attackJolt(who,dist=18,d=220){ const el=document.getElementById(who==='player'?'battlePlayerSprite':'battleEnemySprite'); if(!el||!el.animate) return; const isPlayer=el.classList.contains('player'); const base=isPlayer?'scaleX(-1)':'none'; const dir=who==='player'?1:-1; const moved=isPlayer?('translateX('+(dist*dir)+'px) scaleX(-1)'):('translateX('+(dist*dir)+'px)'); el.animate([{transform:base},{transform:moved,offset:.38},{transform:base}],{duration:d,easing:'ease-out'}); }
 function emberSpear(x1,y1,x2,y2,d=360,w=180,h=44,r=0){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-spear',{'--x1':x1+'%','--y1':y1+'%','--x2':x2+'%','--y2':y2+'%','--d':d+'ms','--w':w+'px','--h':h+'px','--r':r+'deg'},d+120); }
 function lionRoar(x,y,d=560,w=168,h=120){ const l=layers(); if(!l) return; const el=add(l.front,'sa-movefx-roar',{'--x':x+'%','--y':y+'%','--d':d+'ms','--w':w+'px','--h':h+'px','--wd':Math.max(340,d-80)+'ms'},d+160); if(el){ const pos=['28%','40%','50%','60%','72%']; pos.forEach((left,i)=>{ const t=document.createElement('div'); t.className='tooth'; t.style.left=left; t.style.transform='translateX(-50%)'; el.appendChild(t); }); [0,90,180].forEach((off,i)=>{ const wv=document.createElement('div'); wv.className='wave'; wv.style.animationDelay=(off/1000)+'s'; el.appendChild(wv); }); } return el; }
 function fireLionRun(x1,y1,x2,y2,d=700,w=190,h=108){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-lion',{'--x1':x1+'%','--y1':y1+'%','--x2':x2+'%','--y2':y2+'%','--d':d+'ms','--w':w+'px','--h':h+'px'},d+180); }
 function fireCrown(x1,y1,x2,y2,d=480,w=76,h=66,r=0,arc=-34){ const l=layers(); if(!l) return; add(l.front,'sa-movefx-crown',{'--x1':x1+'%','--y1':y1+'%','--x2':x2+'%','--y2':y2+'%','--d':d+'ms','--w':w+'px','--h':h+'px','--r':r+'deg','--arc':arc+'px'},d+140); }
 let starterAudioCtx=null, starterNoiseBuffer=null;
 function starterCtx(){ try{ const A=window.AudioContext||window.webkitAudioContext; if(!A) return null; if(!starterAudioCtx) starterAudioCtx=new A(); if(starterAudioCtx.state==='suspended') starterAudioCtx.resume().catch(()=>{}); return starterAudioCtx; }catch(e){ return null; } }
 function sTone(freq,end,len,type='triangle',vol=.03,offset=0){ const a=starterCtx(); if(!a) return; try{ const t=a.currentTime+offset, o=a.createOscillator(), g=a.createGain(); o.type=type; o.frequency.setValueAtTime(Math.max(24,freq),t); o.frequency.exponentialRampToValueAtTime(Math.max(24,end),t+len); g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(Math.max(.0002,vol),t+Math.min(.03,len*.24)); g.gain.exponentialRampToValueAtTime(.0001,t+len); o.connect(g); g.connect(a.destination); o.start(t); o.stop(t+len+.03); }catch(e){} }
 function sNoise(len=.1,vol=.02,offset=0,cutoff=900,high=false){ const a=starterCtx(); if(!a) return; try{ if(!starterNoiseBuffer){ starterNoiseBuffer=a.createBuffer(1,Math.round(a.sampleRate*1.4),a.sampleRate); const data=starterNoiseBuffer.getChannelData(0); for(let i=0;i<data.length;i++) data[i]=Math.random()*2-1; } const t=a.currentTime+offset, src=a.createBufferSource(), f=a.createBiquadFilter(), g=a.createGain(); src.buffer=starterNoiseBuffer; f.type=high?'highpass':'lowpass'; f.frequency.setValueAtTime(cutoff,t); f.frequency.exponentialRampToValueAtTime(Math.max(120,cutoff*.52),t+len); g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(Math.max(.0002,vol),t+Math.min(.02,len*.2)); g.gain.exponentialRampToValueAtTime(.0001,t+len); src.connect(f); f.connect(g); g.connect(a.destination); src.start(t,Math.random()*.25); src.stop(t+len+.02); }catch(e){} }
 function northernExtraSound(index){ if(index===0){ sTone(540,180,.12,'triangle',.03); sTone(760,240,.08,'sine',.02,.01); sNoise(.05,.012,.01,2200,true); } else if(index===1){ sTone(280,620,.14,'sine',.028); sTone(410,180,.22,'triangle',.026,.05); sNoise(.08,.01,.03,1800,true); } else if(index===2){ sNoise(.16,.02,.0,1000); sTone(130,70,.24,'triangle',.038,.02); sTone(860,240,.12,'sine',.018,.06); sNoise(.09,.012,.11,2500,true); } else { sTone(220,120,.18,'sine',.026); sTone(520,200,.24,'triangle',.024,.02); sTone(780,260,.2,'sine',.02,.06); sNoise(.08,.012,.03,2000,true); sNoise(.1,.01,.16,1800,true); } }
 function cheeseExtraSound(index){ if(index===0){ sTone(300,170,.14,'square',.03); sTone(210,120,.12,'triangle',.028,.03); sNoise(.06,.012,.02,1200); } else if(index===1){ sNoise(.16,.016,.0,900); sTone(120,90,.18,'triangle',.02,.03); sTone(460,220,.12,'sine',.014,.08); } else if(index===2){ sNoise(.12,.014,.01,760); sTone(180,110,.16,'sawtooth',.022); sTone(92,70,.14,'triangle',.02,.08); } else { sTone(220,110,.16,'square',.028); sNoise(.08,.012,.03,1200,true); sTone(120,84,.16,'triangle',.026,.09); sNoise(.18,.022,.28,760); } }
 function trainwreckExtraSound(index){ if(index===0){ sNoise(.08,.016,.01,900); sTone(170,90,.13,'triangle',.028,.02); } else if(index===1){ sNoise(.12,.018,.01,850); sNoise(.1,.016,.08,1100,true); sTone(180,100,.12,'triangle',.02,.04); } else if(index===2){ sTone(220,90,.18,'sawtooth',.03); sTone(320,140,.12,'triangle',.022,.04); sNoise(.12,.016,.02,1400); } else { sTone(90,50,.22,'triangle',.05); sTone(130,70,.18,'square',.04,.05); sNoise(.2,.024,.03,700); sNoise(.12,.014,.15,1500,true); } }
 function rs11ExtraSound(index){ if(index===0){ sTone(260,90,.14,'square',.028); sTone(520,120,.08,'sine',.018,.03); sNoise(.05,.01,.01,1800,true); } else if(index===1){ sTone(180,110,.12,'square',.024); sNoise(.08,.012,.02,1600,true); sNoise(.14,.018,.06,900); } else if(index===2){ sTone(420,160,.14,'sine',.02); sTone(300,120,.16,'triangle',.022,.03); sNoise(.08,.012,.04,2200,true); } else { sTone(300,120,.16,'sine',.02); sTone(520,160,.12,'triangle',.018,.02); sTone(170,100,.16,'square',.022,.06); sNoise(.1,.012,.03,2000,true); sNoise(.12,.016,.08,1200); } }
 function jealousyExtraSound(index){ if(index===0){ sTone(190,90,.16,'sawtooth',.03); sNoise(.08,.012,.01,1700,true); } else if(index===1){ sTone(120,110,.16,'triangle',.024); sNoise(.05,.01,.02,2200,true); sNoise(.11,.015,.08,900); } else if(index===2){ sTone(88,60,.20,'triangle',.042); sTone(260,180,.10,'sine',.02,.06); sNoise(.08,.012,.09,1400,true); } else { sTone(220,90,.14,'sine',.02); sTone(320,120,.14,'triangle',.018,.03); sNoise(.06,.01,.02,2000,true); sNoise(.12,.016,.07,1100); } }
 function lunarrockExtraSound(index){ if(index===0){ sTone(120,90,.18,'triangle',.034); sNoise(.10,.016,.01,800); } else if(index===1){ sTone(90,70,.22,'triangle',.05); sNoise(.16,.02,.02,700); } else if(index===2){ sTone(260,160,.16,'sine',.024); sTone(140,120,.14,'triangle',.022,.06); sNoise(.06,.01,.05,1600,true); } else { sTone(180,110,.16,'triangle',.028); sNoise(.08,.012,.02,1300,true); sNoise(.20,.022,.10,760); } }
 function angolarojaExtraSound(index){ if(index===0){ sTone(240,130,.16,'sawtooth',.03); sTone(390,180,.12,'triangle',.022,.02); sNoise(.08,.012,.02,1600,true); } else if(index===1){ sTone(120,84,.26,'sawtooth',.05); sTone(280,150,.14,'triangle',.026,.04); sNoise(.14,.02,.02,1200); } else if(index===2){ sTone(170,110,.18,'triangle',.028); sTone(320,150,.16,'sawtooth',.022,.03); sNoise(.10,.014,.03,1500,true); } else { sTone(260,120,.18,'triangle',.026); sTone(420,180,.14,'sawtooth',.022,.04); sNoise(.12,.014,.02,1700,true); sNoise(.18,.022,.18,900); } }
 function sourDieselExtraSound(index){ if(index===0){ sTone(150,88,.14,'square',.04); sNoise(.09,.018,.01,900); sTone(96,60,.1,'triangle',.03,.05); } else if(index===1){ sNoise(.22,.024,.0,640); sNoise(.16,.018,.08,1200,true); sTone(82,58,.18,'sawtooth',.025,.04); } else if(index===2){ sTone(240,110,.18,'sawtooth',.03); sNoise(.14,.016,.02,1100); sTone(120,72,.14,'triangle',.026,.09); } else { sTone(220,110,.18,'sawtooth',.032); sNoise(.16,.018,.0,1100); sNoise(.1,.012,.16,1600,true); sTone(84,40,.28,'triangle',.055,.22); sNoise(.22,.03,.24,820); } }
 function gorillaExtraSound(index){ if(index===0){ sTone(118,70,.16,'square',.05); sTone(210,92,.12,'triangle',.032,.03); sNoise(.08,.016,.02,1200); } else if(index===1){ sTone(92,58,.22,'sawtooth',.055); sNoise(.14,.022,.02,760); sTone(170,88,.18,'triangle',.03,.08); } else if(index===2){ sTone(260,140,.18,'triangle',.032); sTone(320,120,.24,'sawtooth',.028,.04); sNoise(.12,.016,.05,1500,true); sNoise(.1,.014,.18,980); } else { sTone(70,38,.34,'triangle',.065); sTone(132,54,.28,'sawtooth',.042,.04); sNoise(.22,.03,.03,680); sNoise(.18,.018,.16,1700,true); } }
 function battleShake(duration=430,mag=1){ const f=document.querySelector('.battle-field'); if(!f) return; const x1=8*mag,x2=9*mag,x3=7*mag,x4=4*mag,y1=3*mag,y2=2*mag,y3=4*mag; f.animate([{transform:'translate(0,0)'},{transform:`translate(${-x1}px,${y1}px)`},{transform:`translate(${x2}px,${-y2}px)`},{transform:`translate(${-x3}px,${y3}px)`},{transform:`translate(${x3}px,0)`},{transform:`translate(${-x4}px,${-y1}px)`},{transform:'translate(0,0)'}],{duration,easing:'ease-out'}); }
 function coords(side){ return side==='player'?{sx:28,sy:66,tx:75,ty:38}:{sx:75,sy:38,tx:28,ty:66}; }

 function northernFx(index,side){ const c=coords(side); clearOverlay();
  if(index===0){ // Spark Zap
   tint('rgba(175,225,255,.16)',420); flash('rgba(255,250,205,.22)',190);
   bolt(c.tx,'#ffe86f',250,16,side==='player'?-6:6);
   setTimeout(()=>pulse(c.tx,c.ty,'#fff199',280,82),95);
   setTimeout(()=>impact(c.tx,c.ty,'#c7f2ff',300,90),105);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#d6fbff',8,84,420),110);
   setTimeout(()=>battleShake(240,.72),95);
  } else if(index===1){ // Volt Bolt
   tint('rgba(145,215,255,.18)',620); flash('rgba(220,245,255,.18)',180);
   orb(c.sx+3,c.sy-3,c.tx,c.ty,420,54,'#eefcff','#86efff','#6d8bff');
   setTimeout(()=>beam((c.sx+c.tx)/2,(c.sy+c.ty)/2,'#79ddff',270,240,18,side==='player'?-10:170),110);
   setTimeout(()=>pulse(c.tx,c.ty,'#9decff',360,108),300);
   setTimeout(()=>impact(c.tx,c.ty,'#c5f8ff',360,112),315);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#dffcff',12,104,560),315);
   setTimeout(()=>battleShake(320,.95),300);
  } else if(index===2){ // Thunder Flash
   tint('rgba(192,226,255,.26)',780); flash('rgba(255,255,255,.42)',260);
   cloud(c.tx,c.ty-23,560,154,72);
   setTimeout(()=>bolt(c.tx-3,'#c8f1ff',300,16,-7),120);
   setTimeout(()=>bolt(c.tx+2,'#fff5a3',320,22,0),190);
   setTimeout(()=>bolt(c.tx+6,'#8ee3ff',280,14,9),255);
   setTimeout(()=>pulse(c.tx,c.ty,'#fff6b0',430,124),250);
   setTimeout(()=>impact(c.tx,c.ty,'#d5f8ff',380,122),260);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#e2fdff',16,132,650),265);
   setTimeout(()=>battleShake(520,1.22),150);
  } else { // Aurora Storm
   tint('linear-gradient(120deg, rgba(108,255,240,.18), rgba(122,197,255,.22), rgba(191,150,255,.18), rgba(255,240,140,.16))',960);
   flash('rgba(232,255,251,.24)',240);
   swirl(c.tx,c.ty,'#82ffef','#a98fff',880,220);
   beam((c.sx+c.tx)/2,(c.sy+c.ty)/2,'#83fff0',420,330,24,side==='player'?-20:160);
   setTimeout(()=>beam(c.tx-8,c.ty-10,'#9fd4ff',430,280,18,side==='player'?32:148),80);
   setTimeout(()=>beam(c.tx+10,c.ty+8,'#c19bff',450,290,18,side==='player'?-42:222),150);
   setTimeout(()=>beam(c.tx,c.ty,'#ffe88a',400,245,14,90),210);
   setTimeout(()=>pulse(c.tx,c.ty,'#ffffff',520,150),250);
   setTimeout(()=>starburst(c.tx,c.ty,'#dffcff',500,180),240);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#d9ffff',18,168,820),260);
   setTimeout(()=>battleShake(650,1.18),220);
  }
 }
 function starFx(index,side){ const c=coords(side); clearOverlay();
  if(index===0){ // Meteor Paw
   tint('rgba(255,220,160,.14)',420); comet(c.sx+3,c.sy-8,c.tx,c.ty,'#ffd48e','rgba(255,170,84,.55)',320,30); impact(c.tx,c.ty,'#ffd48e',340,100); shardBurst(c.tx,c.ty,'#fff0c4',10,90,520); battleShake(280);
  } else if(index===1){ // Orbit Rush
   tint('rgba(185,170,255,.18)',680); swirl(c.sx+8,c.sy-8,'#7de2ff','#c698ff',620,140); setTimeout(()=>comet(c.sx+8,c.sy-8,c.tx,c.ty,'#fff3be','rgba(255,215,132,.70)',420,34),200); setTimeout(()=>starburst(c.tx,c.ty,'#ffd889',440,150),470); setTimeout(()=>impact(c.tx,c.ty,'#ffd889',420,120),470); shardBurst(c.tx,c.ty,'#fff6d0',14,120,700); battleShake(420);
  } else if(index===2){ // Cosmic Bark
   tint('rgba(130,175,255,.16)',520); wave(c.tx,c.ty,'#92d7ff',360,220,30,0); setTimeout(()=>wave(c.tx,c.ty-7,'#c89cff',420,260,34,0),70); pulse(c.tx,c.ty,'#d3b2ff',420,115); shardBurst(c.tx,c.ty,'#e8dcff',12,110,580); battleShake(340);
  } else { // Supernova Howl
   tint('rgba(255,238,195,.22)',850); flash('rgba(255,249,220,.45)',320); starburst(c.tx,c.ty,'#ffe3a1',520,210); pulse(c.tx,c.ty,'#ffffff',580,170); setTimeout(()=>pulse(c.tx,c.ty,'#ffd28f',520,220),60); swirl(c.tx,c.ty,'#ffe8a6','#ffc777',780,230); shardBurst(c.tx,c.ty,'#fff7d8',20,185,860); battleShake(650);
  }
 }
 function gorillaFx(index,side){ const c=coords(side); clearOverlay();
  if(index===0){ // Heavy Punch
   tint('rgba(255,224,196,.18)',520); flash('rgba(255,247,232,.16)',180);
   fist(c.sx+5,c.sy-6,c.tx,c.ty,380,116,side==='player'?-8:188);
   setTimeout(()=>pulse(c.tx,c.ty,'#ffe1ba',300,95),250);
   setTimeout(()=>impact(c.tx,c.ty,'#efb37a',340,110),250);
   setTimeout(()=>dust(c.tx,c.ty+7,'rgba(211,165,117,.68)',440,150,70),245);
   setTimeout(()=>crack(c.tx,380,160,54),255);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#ffe5bf',10,96,500),250);
   setTimeout(()=>battleShake(320,1.05),240);
  } else if(index===1){ // Club Smash
   tint('rgba(198,148,96,.18)',620); flash('rgba(255,236,207,.20)',210);
   club(c.tx,c.ty-2,450,228,50,side==='player'?-30:210,side==='player'?-160:160,-145);
   setTimeout(()=>impact(c.tx,c.ty,'#d49353',390,132),230);
   setTimeout(()=>dust(c.tx,c.ty+10,'rgba(188,133,74,.74)',520,190,92),235);
   setTimeout(()=>wave(c.tx,c.ty+9,'#c9864b',380,245,36,0),230);
   setTimeout(()=>crack(c.tx,520,225,66),245);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#f2d6ae',14,125,620),235);
   setTimeout(()=>battleShake(470,1.22),230);
  } else if(index===2){ // Sticky Slam
   tint('rgba(255,220,110,.17)',740); flash('rgba(255,248,200,.14)',170);
   const midx=(c.sx+c.tx)/2, midy=(c.sy+c.ty)/2;
   glue(c.sx+3,c.sy-2,c.tx-2,c.ty-3,390,30,side==='player'?0:180);
   setTimeout(()=>glue(c.sx+1,c.sy+3,c.tx+4,c.ty+3,420,24,side==='player'?12:192,'#ffe889','#c7971b'),55);
   setTimeout(()=>glue(c.sx+5,c.sy-6,c.tx+1,c.ty-8,430,28,side==='player'?-12:168,'#fff1aa','#c78e12'),90);
   setTimeout(()=>beam(midx,midy,'#f8d05f',260,250,18,side==='player'?-6:174),120);
   setTimeout(()=>pulse(c.tx,c.ty,'#ffe877',360,118),330);
   setTimeout(()=>impact(c.tx,c.ty,'#f5d26a',420,132),340);
   setTimeout(()=>dust(c.tx,c.ty+7,'rgba(226,186,92,.65)',500,165,82),335);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#ffefae',16,132,680),340);
   setTimeout(()=>battleShake(450,1.12),330);
  } else { // Titan Crush
   tint('linear-gradient(180deg, rgba(255,233,204,.24), rgba(124,86,49,.20))',1080); flash('rgba(255,244,223,.30)',240);
   mountain(c.tx,c.ty+26,980,340,220,82);
   setTimeout(()=>mountain(c.tx,c.ty+34,860,270,172,54),95);
   setTimeout(()=>pulse(c.tx,c.ty+8,'#ffe2ba',440,158),230);
   setTimeout(()=>impact(c.tx,c.ty+7,'#d89a58',560,198),225);
   setTimeout(()=>impact(c.tx,c.ty+7,'#fff1d0',430,145),285);
   setTimeout(()=>dust(c.tx,c.ty+34,'rgba(173,121,71,.84)',820,280,132),240);
   setTimeout(()=>dust(c.tx,c.ty+24,'rgba(228,193,145,.66)',760,224,108),315);
   setTimeout(()=>crack(c.tx,760,286,90),250);
   setTimeout(()=>starburst(c.tx,c.ty+2,'#ffe3b7',560,205),275);
   setTimeout(()=>shardBurst(c.tx,c.ty+4,'#f8dec0',22,180,900),270);
   setTimeout(()=>battleShake(840,1.68),225);
  }
 }
 function sourDieselFx(index,side){ const c=coords(side); clearOverlay();
  if(index===0){ // Fuel Jab
   tint('rgba(255,214,122,.16)',520); flash('rgba(255,242,205,.16)',170);
   pump(c.sx+4,c.sy-4,c.tx,c.ty,420,118,138,side==='player'?-4:184);
   setTimeout(()=>impact(c.tx,c.ty,'#ffbb5d',340,108),250);
   setTimeout(()=>dust(c.tx,c.ty+8,'rgba(196,149,86,.64)',460,150,76),250);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#ffd89f',10,98,520),255);
   setTimeout(()=>battleShake(330,1.0),245);
  } else if(index===1){ // Diesel Fumes
   tint('rgba(120,124,128,.18)',860); flash('rgba(228,231,233,.10)',120);
   smokeBurst(c.tx,c.ty-2,11,72,76,820);
   setTimeout(()=>smokeBurst(c.tx-2,c.ty+4,9,84,60,760),80);
   setTimeout(()=>pulse(c.tx,c.ty,'rgba(210,220,224,.9)',360,116),170);
   setTimeout(()=>battleShake(300,.72),210);
  } else if(index===2){ // Fuel Burst
   tint('rgba(255,194,91,.18)',760); flash('rgba(255,240,191,.16)',170);
   const midx=(c.sx+c.tx)/2, midy=(c.sy+c.ty)/2;
   beam(midx,midy,'#ffb54a',340,270,22,side==='player'?-10:170);
   setTimeout(()=>beam(midx,midy,'#ffd37a',300,220,14,side==='player'?-10:170),40);
   setTimeout(()=>glue(c.sx+4,c.sy,c.tx-2,c.ty-2,340,24,side==='player'?0:180,'#ffd57a','#b56b18'),60);
   setTimeout(()=>glue(c.sx+2,c.sy+5,c.tx+5,c.ty+4,360,20,side==='player'?10:190,'#ffe1a0','#bc741e'),100);
   setTimeout(()=>impact(c.tx,c.ty,'#ffc669',390,124),275);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#ffe0ab',12,110,580),280);
   setTimeout(()=>battleShake(400,1.02),270);
  } else { // Octane Overload
   tint('linear-gradient(110deg, rgba(255,201,90,.18), rgba(255,124,66,.20), rgba(90,72,62,.12))',980); flash('rgba(255,236,186,.18)',180);
   const midx=(c.sx+c.tx)/2, midy=(c.sy+c.ty)/2;
   beam(midx,midy,'#ffb448',420,320,24,side==='player'?-10:170);
   setTimeout(()=>beam(midx,midy,'#ffe08a',360,290,14,side==='player'?-10:170),55);
   setTimeout(()=>glue(c.sx+4,c.sy-2,c.tx,c.ty-4,380,28,side==='player'?-4:176,'#ffd46f','#b56b18'),40);
   setTimeout(()=>glue(c.sx+2,c.sy+3,c.tx+4,c.ty+2,410,24,side==='player'?8:188,'#ffe09a','#c17a1f'),85);
   setTimeout(()=>glue(c.sx+6,c.sy-6,c.tx-4,c.ty+5,430,22,side==='player'?-12:168,'#ffcf5b','#aa5f16'),130);
   setTimeout(()=>flash('rgba(255,248,224,.36)',180),330);
   setTimeout(()=>starburst(c.tx,c.ty,'#ffcc71',480,190),350);
   setTimeout(()=>pulse(c.tx,c.ty,'#fff0c8',520,158),350);
   setTimeout(()=>impact(c.tx,c.ty,'#ff9450',520,180),360);
   setTimeout(()=>dust(c.tx,c.ty+18,'rgba(148,98,66,.76)',740,240,112),360);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#ffd9a0',18,165,840),360);
   setTimeout(()=>battleShake(680,1.42),345);
  }
 }

 function cheeseFx(index,side){ const c=coords(side); clearOverlay();
  if(index===0){ // Cheesy Jab
   tint('rgba(255,231,126,.18)',520); flash('rgba(255,248,205,.16)',170);
   cheeseFist(c.sx+5,c.sy-5,c.tx,c.ty,390,116,side==='player'?-8:188);
   setTimeout(()=>impact(c.tx,c.ty,'#ffd55f',350,112),250);
   setTimeout(()=>pulse(c.tx,c.ty,'#fff1a8',320,96),250);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#ffe89f',10,96,500),255);
   setTimeout(()=>battleShake(320,1.02),245);
  } else if(index===1){ // Funky Fumes
   tint('rgba(196,255,162,.16)',820);
   leafBurst(c.tx,c.ty-2,10,38,74,820);
   setTimeout(()=>leafBurst(c.tx-2,c.ty+2,8,46,58,760),90);
   setTimeout(()=>pulse(c.tx,c.ty,'#dfffb1',360,118),170);
   setTimeout(()=>battleShake(280,.72),190);
  } else if(index===2){ // Foul Cloud
   tint('rgba(214,239,120,.16)',760);
   stinkCloud(c.tx-18,c.ty,c.tx+20,c.ty,700,162,102);
   setTimeout(()=>stinkCloud(c.tx-12,c.ty-4,c.tx+24,c.ty-2,620,138,86),70);
   setTimeout(()=>impact(c.tx,c.ty,'#d8f183',300,92),260);
   setTimeout(()=>battleShake(320,.86),230);
  } else { // Stink Bomb
   tint('rgba(220,245,130,.18)',980);
   stinkBomb(c.sx+3,c.sy-8,c.tx,c.ty-4,620,54,side==='player'?-56:-56);
   setTimeout(()=>flash('rgba(244,255,206,.22)',170),380);
   setTimeout(()=>stinkCloud(c.tx,c.ty,c.tx,c.ty,620,162,104),400);
   setTimeout(()=>stinkCloud(c.tx+3,c.ty+2,c.tx+3,c.ty+2,580,130,88),455);
   setTimeout(()=>leafBurst(c.tx,c.ty,10,34,82,760),440);
   setTimeout(()=>impact(c.tx,c.ty,'#d9f26d',420,130),420);
   setTimeout(()=>pulse(c.tx,c.ty,'#f3ffc6',450,140),430);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#ebffb0',14,126,680),440);
   setTimeout(()=>battleShake(520,1.14),420);
  }
 }

 function trainwreckFx(index,side){ const c=coords(side); clearOverlay();
  if(index===0){ // Steam Punch
   tint('rgba(212,222,230,.18)',520); flash('rgba(245,248,250,.14)',170);
   smokeFist(c.sx+5,c.sy-5,c.tx,c.ty,390,116,side==='player'?-8:188);
   setTimeout(()=>impact(c.tx,c.ty,'#d9e6ed',340,108),250);
   setTimeout(()=>dust(c.tx,c.ty+6,'rgba(170,180,188,.56)',440,150,72),245);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#edf7ff',10,94,500),250);
   setTimeout(()=>battleShake(320,1.02),245);
  } else if(index===1){ // Smog Rush
   tint('rgba(176,188,196,.20)',760); flash('rgba(240,244,247,.12)',160);
   smokeFist(c.sx+4,c.sy-4,c.tx,c.ty,360,106,side==='player'?-8:188);
   setTimeout(()=>smokeFist(c.tx-18,c.ty-16,c.tx,c.ty,320,96,36),90);
   setTimeout(()=>smokeFist(c.tx+18,c.ty+16,c.tx,c.ty,320,96,-36),170);
   setTimeout(()=>impact(c.tx,c.ty,'#d8e1e7',380,122),260);
   setTimeout(()=>smokeBurst(c.tx,c.ty,8,66,58,620),250);
   setTimeout(()=>battleShake(420,1.16),250);
  } else if(index===2){ // Boiler Blast
   tint('rgba(255,170,86,.20)',760); flash('rgba(255,236,204,.18)',170);
   const midx=(c.sx+c.tx)/2, midy=(c.sy+c.ty)/2;
   beam(midx,midy,'#ff8d38',340,280,22,side==='player'?-10:170);
   setTimeout(()=>beam(midx,midy,'#ffd277',300,225,14,side==='player'?-10:170),40);
   setTimeout(()=>impact(c.tx,c.ty,'#ffb35f',390,124),275);
   setTimeout(()=>starburst(c.tx,c.ty,'#ffcf83',430,160),280);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#ffe3b6',12,110,560),280);
   setTimeout(()=>battleShake(400,1.04),270);
  } else { // Runaway Express
   tint('linear-gradient(90deg, rgba(235,243,248,.14), rgba(173,184,194,.14), rgba(255,173,83,.16))',980);
   flash('rgba(247,250,252,.16)',140);
   steamTrain(-12,c.ty+22,112,c.ty+22,760,300,160);
   setTimeout(()=>smokeBurst(c.tx-4,c.ty-8,8,70,72,620),180);
   setTimeout(()=>impact(c.tx,c.ty+8,'#dfe9ee',480,150),360);
   setTimeout(()=>dust(c.tx,c.ty+22,'rgba(156,166,173,.64)',700,230,102),360);
   setTimeout(()=>flash('rgba(255,230,195,.26)',150),370);
   setTimeout(()=>starburst(c.tx,c.ty+8,'#ffcb7e',460,175),380);
   setTimeout(()=>shardBurst(c.tx,c.ty+8,'#edf7ff',16,145,700),390);
   setTimeout(()=>battleShake(700,1.4),350);
  }
 }

 function rs11Fx(index,side){ const c=coords(side); clearOverlay();
  if(index===0){ // Servo Strike
   tint('rgba(132,220,255,.16)',520); flash('rgba(225,248,255,.16)',140);
   wireLash((c.sx+c.tx)/2,c.sy-2,220,side==='player'?0:180,280);
   setTimeout(()=>impact(c.tx,c.ty,'#8de8ff',320,100),175);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#dffcff',10,94,420),180);
   setTimeout(()=>battleShake(280,.88),170);
  } else if(index===1){ // Circuit Breaker
   tint('rgba(108,255,170,.18)',760); flash('rgba(229,255,238,.18)',150);
   circuitBreak(c.tx,c.ty-2,420,138,98);
   setTimeout(()=>crack(c.tx,420,150,52),120);
   setTimeout(()=>impact(c.tx,c.ty,'#87ffb8',420,128),220);
   setTimeout(()=>starburst(c.tx,c.ty,'#a8ffd0',440,160),230);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#d6ffe7',16,124,620),235);
   setTimeout(()=>battleShake(430,1.12),220);
  } else if(index===2){ // Plasma Punch
   tint('rgba(88,190,255,.18)',760); flash('rgba(216,244,255,.14)',140);
   energyFist(c.sx+6,c.sy-6,c.tx,c.ty,260,100,side==='player'?-8:188);
   setTimeout(()=>energyFist(c.sx+2,c.sy+4,c.tx,c.ty,260,100,side==='player'?8:172),90);
   setTimeout(()=>energyFist(c.sx+6,c.sy-4,c.tx,c.ty,260,100,side==='player'?-12:192),180);
   setTimeout(()=>energyFist(c.sx+1,c.sy+6,c.tx,c.ty,260,100,side==='player'?12:168),270);
   setTimeout(()=>impact(c.tx,c.ty,'#88ddff',420,128),300);
   setTimeout(()=>pulse(c.tx,c.ty,'#dffbff',400,118),305);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#d9f8ff',16,128,620),310);
   setTimeout(()=>battleShake(500,1.14),290);
  } else { // Overclock Core
   tint('linear-gradient(110deg, rgba(88,197,255,.18), rgba(255,90,110,.16), rgba(115,210,255,.18))',1040);
   flash('rgba(232,246,255,.18)',150);
   const punches=[
    [c.tx-28,c.ty-18,'#d6f8ff','#5ed0ff','#2d6dff','rgba(92,220,255,.55)',28],
    [c.tx+30,c.ty-14,'#ffe0ea','#ff6a8b','#ff314f','rgba(255,94,132,.55)',-26],
    [c.tx-26,c.ty+20,'#d6f8ff','#5ed0ff','#2d6dff','rgba(92,220,255,.55)',40],
    [c.tx+26,c.ty+22,'#ffe0ea','#ff6a8b','#ff314f','rgba(255,94,132,.55)',-40],
    [c.tx,c.ty-28,'#d6f8ff','#5ed0ff','#2d6dff','rgba(92,220,255,.55)',90],
    [c.tx,c.ty+30,'#ffe0ea','#ff6a8b','#ff314f','rgba(255,94,132,.55)',-90]
   ];
   punches.forEach((p,i)=>setTimeout(()=>energyFist(p[0],p[1],c.tx,c.ty,240,94,p[6],p[2],p[3],p[4],p[5]),i*55));
   setTimeout(()=>impact(c.tx,c.ty,'#ff8fa7',520,160),300);
   setTimeout(()=>pulse(c.tx,c.ty,'#e7fbff',520,150),305);
   setTimeout(()=>starburst(c.tx,c.ty,'#b5e8ff',500,180),320);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#f7dbe3',22,168,820),330);
   setTimeout(()=>battleShake(680,1.36),300);
  }
 }

 function jealousyFx(index,side){ const c=coords(side); clearOverlay();
  if(index===0){ // Shadow Claw
   tint('rgba(115,74,170,.16)',620);
   scratchMark(c.tx+2,c.ty-8,320,108,14,-24,'#ba7dff');
   setTimeout(()=>scratchMark(c.tx-4,c.ty+2,300,114,14,-16,'#e1c0ff'),55);
   setTimeout(()=>scratchMark(c.tx+6,c.ty+12,300,110,14,-28,'#9f59ff'),110);
   setTimeout(()=>impact(c.tx,c.ty,'#c68cff',360,112),170);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#e5cfff',12,102,520),180);
   setTimeout(()=>battleShake(340,1.0),165);
  } else if(index===1){ // Envy Hex
   tint('rgba(112,46,72,.16)',920);
   voodooDoll(c.tx-18,c.ty-2,620,86);
   setTimeout(()=>needleStab(c.tx-28,c.ty-18,c.tx-16,c.ty-8,240,-18,74,10),120);
   setTimeout(()=>pulse(c.tx,c.ty,'#ff5968',520,138),180);
   setTimeout(()=>impact(c.tx,c.ty,'#ff6a78',440,118),185);
   setTimeout(()=>flash('rgba(255,120,130,.16)',180),190);
   setTimeout(()=>battleShake(360,.92),185);
  } else if(index===2){ // Nightfall
   nightOverlay(960);
   tint('rgba(78,54,116,.08)',780);
   setTimeout(()=>werewolfRun(-12,c.ty+10,112,c.ty+10,700,194,96),120);
   setTimeout(()=>impact(c.tx,c.ty+2,'#b47cff',460,132),430);
   setTimeout(()=>dust(c.tx,c.ty+20,'rgba(82,58,112,.56)',560,180,82),430);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#d9bcff',14,120,620),435);
   setTimeout(()=>battleShake(520,1.16),425);
  } else { // Shadow Mirror
   tint('linear-gradient(110deg, rgba(85,50,126,.14), rgba(194,119,255,.18), rgba(40,18,61,.14))',1040);
   flash('rgba(228,210,255,.12)',150);
   const copies=[
    [c.sx+2,c.sy-6,-12,.72],[c.sx-4,c.sy+6,10,.68],[c.sx+8,c.sy-12,-24,.76],[c.sx-8,c.sy+12,22,.7],[c.sx+4,c.sy,0,.74]
   ];
   copies.forEach((p,i)=>setTimeout(()=>shadowCopy(p[0],p[1],c.tx,c.ty,320,90,90,p[2],p[3]),i*70));
   setTimeout(()=>impact(c.tx,c.ty,'#c98dff',520,156),330);
   setTimeout(()=>pulse(c.tx,c.ty,'#efe2ff',520,146),335);
   setTimeout(()=>starburst(c.tx,c.ty,'#d8b0ff',500,176),340);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#eddcff',20,160,820),350);
   setTimeout(()=>battleShake(640,1.3),330);
  }
 }

 function lunarrockFx(index,side){ const c=coords(side); clearOverlay();
  if(index===0){ // Rock Throw
   tint('rgba(162,138,100,.16)',760);
   boulder(c.sx+4,c.sy-8,c.tx,c.ty-2,500,126,side==='player'?-8:188,-34,520);
   setTimeout(()=>impact(c.tx,c.ty,'#c8a97b',460,148),305);
   setTimeout(()=>dust(c.tx,c.ty+16,'rgba(159,132,96,.68)',620,210,96),310);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#e0d2b5',16,130,700),320);
   setTimeout(()=>battleShake(520,1.22),300);
  } else if(index===1){ // Ground Slam
   tint('rgba(163,124,84,.14)',820);
   fist(c.tx-14,c.ty+32,c.tx-8,c.ty+28,320,96,118);
   setTimeout(()=>fist(c.tx+14,c.ty+32,c.tx+8,c.ty+28,320,96,62),70);
   setTimeout(()=>crack(c.tx,460,210,70),190);
   setTimeout(()=>dust(c.tx,c.ty+28,'rgba(165,132,98,.70)',760,250,112),210);
   setTimeout(()=>impact(c.tx,c.ty+22,'#caa272',420,132),220);
   setTimeout(()=>battleShake(700,1.55),210);
  } else if(index===2){ // Lunar Gravity
   tint('rgba(92,132,255,.16)',980);
   orb(c.sx+2,c.sy-6,c.tx,c.ty-10,420,72,'#f3ffff','#76d5ff','#4d67ff');
   setTimeout(()=>pulse(c.tx,c.ty-10,'#96dfff',420,132),180);
   setTimeout(()=>flipTarget(side,560),210);
   setTimeout(()=>impact(c.tx,c.ty,'#86b9ff',360,120),260);
   setTimeout(()=>battleShake(420,.94),230);
  } else { // Meteor Crush
   tint('linear-gradient(180deg, rgba(132,182,255,.10), rgba(255,180,104,.16), rgba(91,61,38,.12))',1080);
   flash('rgba(255,236,208,.12)',120);
   const meteors=[[c.tx-18,-10,c.tx-6,c.ty-8],[c.tx+8,-12,c.tx+4,c.ty-2],[c.tx+22,-8,c.tx+10,c.ty+6],[c.tx-2,-14,c.tx-1,c.ty+2],[c.tx+28,-16,c.tx+14,c.ty+10]];
   meteors.forEach((m,i)=>setTimeout(()=>comet(m[0],m[1],m[2],m[3],'#ffb14c','rgba(255,177,88,.62)',420,40),i*85));
   setTimeout(()=>flash('rgba(255,248,226,.26)',160),360);
   setTimeout(()=>impact(c.tx,c.ty,'#ffb869',560,176),390);
   setTimeout(()=>starburst(c.tx,c.ty,'#ffd18c',520,190),395);
   setTimeout(()=>dust(c.tx,c.ty+18,'rgba(152,107,68,.74)',760,250,116),400);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#ffe0b2',22,170,860),405);
   setTimeout(()=>battleShake(760,1.42),390);
  }
 }

 function angolarojaFx(index,side){ const c=coords(side); clearOverlay();
  if(index===0){ // Ember Spear
   tint('rgba(255,132,58,.16)',720);
   emberSpear(c.sx+4,c.sy-6,c.tx,c.ty,360,186,46,side==='player'?-4:176);
   setTimeout(()=>impact(c.tx,c.ty,'#ffb25a',420,132),220);
   setTimeout(()=>starburst(c.tx,c.ty,'#ffd08a',420,152),225);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#ffe4ba',12,110,560),230);
   setTimeout(()=>battleShake(380,1.02),215);
  } else if(index===1){ // Crimson Roar
   tint('rgba(206,44,28,.16)',840);
   lionRoar(c.tx-4,c.ty-2,620,174,124);
   setTimeout(()=>pulse(c.tx,c.ty,'#ff7f48',440,132),170);
   setTimeout(()=>impact(c.tx,c.ty,'#ff9a4b',420,126),180);
   setTimeout(()=>starburst(c.tx,c.ty,'#ffd499',450,158),210);
   setTimeout(()=>battleShake(520,1.2),185);
  } else if(index===2){ // Lionheart Charge
   tint('linear-gradient(90deg, rgba(255,173,89,.12), rgba(221,58,28,.14), rgba(255,160,72,.12))',960);
   fireLionRun(-12,c.ty+12,112,c.ty+12,700,198,112);
   setTimeout(()=>impact(c.tx,c.ty+2,'#ffae63',480,150),360);
   setTimeout(()=>dust(c.tx,c.ty+18,'rgba(190,86,34,.64)',620,220,96),365);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#ffe1b3',16,138,700),370);
   setTimeout(()=>battleShake(640,1.34),355);
  } else { // Royal Inferno
   tint('linear-gradient(110deg, rgba(255,201,108,.10), rgba(215,54,31,.18), rgba(255,160,82,.14))',1080);
   flash('rgba(255,231,195,.12)',130);
   const crowns=[[c.sx+2,c.sy-8,c.tx-12,c.ty-10,-18,-42],[c.sx+2,c.sy-8,c.tx+10,c.ty-4,8,-28],[c.sx+2,c.sy-8,c.tx-4,c.ty+8,-8,-18],[c.sx+2,c.sy-8,c.tx+14,c.ty+10,14,-10]];
   crowns.forEach((p,i)=>setTimeout(()=>fireCrown(p[0],p[1],p[2],p[3],500,78,68,p[4],p[5]),i*85));
   setTimeout(()=>impact(c.tx,c.ty,'#ffb65f',560,176),340);
   setTimeout(()=>starburst(c.tx,c.ty,'#ffd89a',520,188),345);
   setTimeout(()=>pulse(c.tx,c.ty,'#ff8851',520,160),350);
   setTimeout(()=>shardBurst(c.tx,c.ty,'#ffe6c1',22,168,860),355);
   setTimeout(()=>battleShake(760,1.44),340);
  }
 }


 function starterMoveGraphic(id,index,side){
  setFxProfile(id);
  if(id==='northern') return northernFx(index,side);
  if(id==='star') return starFx(index,side);
  if(id==='gorilla') return gorillaFx(index,side);
  if(id==='sourdiesel') return sourDieselFx(index,side);
  if(id==='cheese') return cheeseFx(index,side);
  if(id==='trainwreck') return trainwreckFx(index,side);
  if(id==='rs11') return rs11Fx(index,side);
  if(id==='jealousy') return jealousyFx(index,side);
  if(id==='lunarrock') return lunarrockFx(index,side);
  if(id==='angolaroja') return angolarojaFx(index,side);
 }

 moveSound=function(id,index){
  if(STARTER_IDS.has(id)){
   pendingStarterFx={id,index};
   starterFxConsumeAt=performance.now()+500;
   if(id==='northern') northernExtraSound(index);
   if(id==='gorilla') gorillaExtraSound(index);
   if(id==='sourdiesel') sourDieselExtraSound(index);
   if(id==='cheese') cheeseExtraSound(index);
   if(id==='trainwreck') trainwreckExtraSound(index);
   if(id==='rs11') rs11ExtraSound(index);
   if(id==='jealousy') jealousyExtraSound(index);
   if(id==='lunarrock') lunarrockExtraSound(index);
   if(id==='angolaroja') angolarojaExtraSound(index);
  }
  return prevMoveSound(id,index);
 };

 animateBattleSprite=function(who,cls){
  // Wait for the post-render strike call so effects are not wiped by battle UI rerenders.
  if(cls==='strike' && pendingStarterFx && performance.now()<=starterFxConsumeAt){
   const fx=pendingStarterFx;
   attackJolt(who, fx.id==='star'?16:22, fx.id==='star'?200:230);
   // draw effect but keep pending briefly so the second immediate strike call after render can still show it if needed
   starterMoveGraphic(fx.id,fx.index,who);
   pendingStarterFx=null;
  }
  return prevAnimateBattleSprite(who,cls);
 };

 renderSideBattle=function(){ prevRenderSideBattle(); ensureOverlay(); };
})();
// V185: Star Dawg only — custom full-battle cinematic effects and sound.
// Rendering is attached to document.body (not battle-field) so the game can
// rebuild the battle HUD mid-attack without erasing the animation.
(function () {
  const previousMoveSound = moveSound;
  const previousAnimate = animateBattleSprite;
  let queuedStarAttack = null;
  let currentMovie = null;
  let soundContext = null;
  let noiseBuffer = null;
  const TAU = Math.PI * 2;
  const W = 1000, H = 600;
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const ease = x => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const easeOut = x => 1 - Math.pow(1 - clamp(x, 0, 1), 3);
  const lerp = (a, b, t) => a + (b - a) * t;
  const seedFloat = (x) => {
    const s = Math.sin(x * 41.713 + 91.217) * 43758.5453;
    return s - Math.floor(s);
  };
  function seeded(min, max, n) { return lerp(min, max, seedFloat(n)); }
  const hex = (v) => typeof v === 'string' ? v : '#ffffff';

  function context() {
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return null;
      if (!soundContext) soundContext = new Audio();
      if (soundContext.state === 'suspended') soundContext.resume().catch(() => {});
      return soundContext;
    } catch (e) { return null; }
  }
  function tone(freq, endFreq, len, kind, volume, offset = 0) {
    const a = context(); if (!a) return;
    try {
      const start = a.currentTime + offset;
      const o = a.createOscillator(), g = a.createGain();
      o.type = kind; o.frequency.setValueAtTime(freq, start);
      o.frequency.exponentialRampToValueAtTime(Math.max(24, endFreq), start + len);
      g.gain.setValueAtTime(.0001, start);
      g.gain.exponentialRampToValueAtTime(Math.max(.0002, volume), start + Math.min(.028, len * .2));
      g.gain.exponentialRampToValueAtTime(.0001, start + len);
      o.connect(g); g.connect(a.destination); o.start(start); o.stop(start + len + .02);
    } catch (e) { /* silent on browsers that restrict audio */ }
  }
  function noisy(len, volume, offset = 0, cutoff = 750, high = false) {
    const a = context(); if (!a) return;
    try {
      if (!noiseBuffer) {
        noiseBuffer = a.createBuffer(1, Math.round(a.sampleRate * 1.8), a.sampleRate);
        const samples = noiseBuffer.getChannelData(0);
        for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
      }
      const src = a.createBufferSource(), filter = a.createBiquadFilter(), gain = a.createGain();
      const t = a.currentTime + offset;
      src.buffer = noiseBuffer;
      filter.type = high ? 'highpass' : 'lowpass'; filter.frequency.setValueAtTime(cutoff, t);
      filter.frequency.exponentialRampToValueAtTime(Math.max(140, cutoff * .48), t + len);
      gain.gain.setValueAtTime(.0001, t);
      gain.gain.exponentialRampToValueAtTime(Math.max(.0002, volume), t + Math.min(.017, len * .16));
      gain.gain.exponentialRampToValueAtTime(.0001, t + len);
      src.connect(filter); filter.connect(gain); gain.connect(a.destination);
      src.start(t, Math.random() * .45); src.stop(t + len + .01);
    } catch (e) {}
  }
  function barkSound(offset) {
    // A pair of throaty percussive 'woof' syllables, with rasp and descending formants.
    [0, .22].forEach((o, i) => {
      const t = offset + o;
      tone(202 - i * 19, 91 - i * 9, .19, 'sawtooth', .067, t);
      tone(355 - i * 12, 135 - i * 8, .14, 'triangle', .049, t + .012);
      tone(110, 77, .16, 'square', .017, t + .027);
      noisy(.115, .057, t, 1150);
      noisy(.07, .015, t + .012, 1700, true);
    });
  }
  function starSound(index) {
    if (index === 0) { // meteor flight, impact
      tone(650, 140, .4, 'sawtooth', .023);
      noisy(.32, .035, 0, 1600);
      tone(125, 48, .32, 'triangle', .07, .46);
      noisy(.22, .085, .46, 420);
    } else if (index === 1) { // many stone whistles and thuds
      tone(430, 100, .42, 'sawtooth', .017);
      for (let i = 0; i < 5; i++) {
        tone(240 + i * 37, 72, .28, 'triangle', .029, .11 + i * .13);
        noisy(.12, .038, .26 + i * .12, 440);
      }
    } else if (index === 2) { // distinct double bark + energy release
      barkSound(0);
      tone(360, 930, .27, 'sine', .019, .25);
      tone(640, 190, .43, 'sawtooth', .041, .38);
      noisy(.43, .047, .36, 2400);
    } else { // supernova charge and huge detonation
      tone(90, 320, .45, 'sine', .044);
      tone(260, 870, .45, 'triangle', .029);
      tone(132, 40, .69, 'triangle', .105, .5);
      noisy(.65, .095, .5, 610);
      noisy(.3, .059, .53, 2200, true);
    }
  }

  function shakeBattle(amount = 8, duration = 380) {
    // Shake the visible combat window. Never touch the world/canvas walking loop.
    try {
      const box = document.getElementById('creatureUI') || document.querySelector('.battle-field');
      if (!box || !box.isConnected || !box.animate) return;
      box.animate([
        {transform:'translate(0,0)'},
        {transform:`translate(${-amount}px,${amount*.35}px)`},
        {transform:`translate(${amount*.8}px,${-amount*.45}px)`},
        {transform:`translate(${-amount*.7}px,${amount*.55}px)`},
        {transform:`translate(${amount*.55}px,${-amount*.2}px)`},
        {transform:'translate(0,0)'}
      ], {duration, easing:'ease-out'});
    } catch (e) {}
  }
  function createMovie(index, side) {
    try {
      if (currentMovie) currentMovie.stop();
      const field = document.querySelector('.battle-field');
      if (!field) return;
      const canvas = document.createElement('canvas');
      canvas.id = 'starDawgCinematicFx';
      canvas.setAttribute('aria-hidden', 'true');
      Object.assign(canvas.style, {
        position: 'fixed', zIndex: '2147483000', pointerEvents: 'none',
        display: 'block', margin: '0', padding: '0', border: '0',
        background: 'transparent', transform: 'none'
      });
      document.body.appendChild(canvas);
      const c = canvas.getContext('2d', {alpha: true});
      if (!c) {canvas.remove();return;}
      const dur = [980, 1130, 1010, 1350][index];
      const started = performance.now();
      // Light wind-up shake followed by a stronger shake at each visual impact.
      shakeBattle([5, 6, 5, 8][index], 220);
      const impactAt = [560, 330, 660, 540][index];
      setTimeout(() => {
        if(!stopped && document.querySelector('.battle-field'))
          shakeBattle([11, 9, 10, 16][index], [390, 560, 440, 670][index]);
      }, impactAt);
      const sideX = side === 'player' ? 0 : 1;
      const origin = sideX ? {x: 795,y: 215} : {x: 213,y: 424};
      const dest = sideX ? {x: 225,y: 408} : {x: 779,y: 224};
      let raf = 0;
      let stopped = false;
      let particles = [];
      let lastTime = started;
      let w = 0,h = 0;
      const maxParticles = 300;
      const movie = {stop() { stopped = true; cancelAnimationFrame(raf); canvas.remove(); if (currentMovie === movie) currentMovie = null; }};
      currentMovie = movie;
      function emit(x,y,n,opts={}) {
        for(let i=0;i<n;i++) {
          if (particles.length >= maxParticles) particles.shift();
          const a = opts.angle !== undefined ? opts.angle + (Math.random() - .5) * (opts.spread || 1) : Math.random() * TAU;
          const sp = lerp(opts.v0 || 20, opts.v1 || 150, Math.random());
          particles.push({
            x:x + (Math.random()-.5)*(opts.radius || 12),y:y + (Math.random()-.5)*(opts.radius || 12),
            vx:Math.cos(a)*sp, vy:Math.sin(a)*sp, life:0,
            max:lerp(opts.lifeMin || .27, opts.lifeMax || .8, Math.random()),
            r:lerp(opts.rMin || 2, opts.rMax || 8, Math.random()),
            c:opts.colors ? opts.colors[Math.floor(Math.random()*opts.colors.length)] : '#d9efff',
            kind:opts.kind || 'spark', grav:opts.gravity !== undefined ? opts.gravity : 70
          });
        }
      }
      function drawParticles(dt) {
        for(let i=particles.length-1;i>=0;i--) {
          const p=particles[i]; p.life+=dt;
          if (p.life>p.max) {particles.splice(i,1);continue;}
          p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=p.grav*dt;
          const alpha=Math.pow(1-p.life/p.max, 1.3);
          c.save();c.globalAlpha=alpha;
          if(p.kind==='rock') {
            c.translate(p.x,p.y);c.rotate(p.life*5);
            c.fillStyle=p.c;c.strokeStyle='#291d36';c.lineWidth=1.8;
            polygon([[p.r,-p.r], [p.r*1.1,p.r*.4], [0,p.r], [-p.r,p.r*.4],[-p.r,-p.r*.8]]);
            c.fill();c.stroke();
          } else {
            const grad=c.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*3);
            grad.addColorStop(0,p.c);grad.addColorStop(.27,p.c);grad.addColorStop(1,'rgba(0,0,0,0)');
            c.fillStyle=grad;c.beginPath();c.arc(p.x,p.y,p.r*3,0,TAU);c.fill();
            c.fillStyle=p.c;c.beginPath();c.arc(p.x,p.y,p.r*.42,0,TAU);c.fill();
          }
          c.restore();
        }
      }
      function polygon(points){c.beginPath();c.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++) c.lineTo(points[i][0],points[i][1]);c.closePath();}
      function glow(x,y,r,color,strength=1) {
        if(r<=0)return;
        const g=c.createRadialGradient(x,y,0,x,y,r);
        g.addColorStop(0,color);
        g.addColorStop(.3,color.replace(/,\s*([\d.]+)\)$/, ',0.18)'));
        g.addColorStop(1,'rgba(0,0,0,0)');
        c.globalAlpha=strength;c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);c.globalAlpha=1;
      }
      function rockShape(x,y,r,angle=0,id=0) {
        c.save();c.translate(x,y);c.rotate(angle);
        const verts=[];
        for(let k=0;k<9;k++){const a=k*TAU/9;const rr=r*(.82+seeded(0,.32,id*13+k));verts.push([Math.cos(a)*rr, Math.sin(a)*rr]);}
        c.shadowColor='rgba(231,177,253,.65)';c.shadowBlur=r*.35;
        polygon(verts);c.fillStyle='#79718d';c.fill();c.shadowBlur=0;
        c.strokeStyle='#e4d8ee';c.lineWidth=Math.max(2,r*.08);c.stroke();
        polygon(verts.slice(0,5).concat([[0,0]]));c.fillStyle='rgba(188,177,199,.44)';c.fill();
        polygon(verts.slice(4,8).concat([[0,0]]));c.fillStyle='rgba(36,29,65,.35)';c.fill();
        for(let q=0;q<3;q++){
          let cx=(seeded(-.4,.4,id*22+q*3))*r,cy=seeded(-.4,.4,id*18+q*5)*r;
          c.beginPath();c.ellipse(cx,cy,r*.12,r*.08,0,0,TAU);
          c.fillStyle='rgba(39,34,61,.6)';c.fill();
          c.strokeStyle='rgba(216,200,233,.55)';c.lineWidth=1.5;c.stroke();
        }
        c.restore();
      }
      function pawMoonRock(x,y,scale,rotation) {
        c.save();c.translate(x,y);c.rotate(rotation);c.scale(scale,scale);
        // Lunar rock paw silhouette: large rough palm + four separate moonstone toes.
        c.shadowColor='rgba(245,170,255,.75)';c.shadowBlur=24;
        c.fillStyle='#625a78';c.strokeStyle='#eadff4';c.lineWidth=3.5;
        polygon([[-38,14],[-29,-15],[-15,-28],[5,-18],[17,-26],[35,-10],[42,16],[25,43],[-5,51],[-32,40]]);
        c.fill();c.stroke();c.shadowBlur=0;
        polygon([[-36,15],[-21,-20],[5,-17],[11,4],[-5,24]]);c.fillStyle='#9e95b0';c.fill();
        polygon([[10,2],[35,-12],[42,14],[25,42],[-5,51]]);c.fillStyle='#403955';c.fill();
        for(const [px,py,s,r] of [[-38,-50,15,-.32],[-12,-67,18,-.17],[18,-65,18,.17],[45,-46,16,.3]]){
          c.save();c.translate(px,py);c.rotate(r);
          c.shadowColor='rgba(240,184,255,.5)';c.shadowBlur=8;
          polygon([[-s*.8,-s*.3],[-s*.3,-s],[s*.5,-s*.85],[s,s*.05],[s*.45,s],[-s*.65,s*.75]]);
          c.fillStyle='#8d829d';c.fill();c.shadowBlur=0;
          c.strokeStyle='#ebddec';c.lineWidth=2.6;c.stroke();
          c.fillStyle='#b5a8bb';polygon([[-s*.6,-s*.25],[-s*.2,-s*.8],[s*.5,-s*.7],[s*.15,-s*.1]]);c.fill();
          c.restore();
        }
        for(const [px,py,rx,ry] of [[-17,3,6,4],[21,20,8,5],[0,30,5,3]]) {
          c.fillStyle='rgba(24,18,40,.5)';c.beginPath();c.ellipse(px,py,rx,ry,-.3,0,TAU);c.fill();
          c.strokeStyle='rgba(236,224,242,.5)';c.lineWidth=1.4;c.stroke();
        }
        c.restore();
      }
      function ring(x,y,r,color,opacity=1,width=8) {
        c.save();c.globalAlpha=opacity;c.shadowColor=color;c.shadowBlur=21;
        c.beginPath();c.arc(x,y,r,0,TAU);c.strokeStyle=color;c.lineWidth=width;c.stroke();c.restore();
      }
      function flash(alpha,color='255,255,255') {
        if(alpha<=0)return;
        c.fillStyle=`rgba(${color},${clamp(alpha,0,1)})`;c.fillRect(0,0,W,H);
      }
      function cosmicBack(alpha,color='15,13,49') { c.fillStyle=`rgba(${color},${clamp(alpha,0,1)})`;c.fillRect(0,0,W,H); }
      function screenShake(magnitude,t) {
        // Shake the visuals, not the actual controls/walking world.
        if(magnitude<=0)return;
        c.translate(Math.sin(t*119)*magnitude,Math.cos(t*137)*magnitude*.62);
      }
      function starfield(t,count=32,alpha=.65){
        c.save();c.globalAlpha=alpha;
        for(let i=0;i<count;i++){
          const sx=seeded(20,980,i+14), sy=seeded(15,585,i+821), a=.28+.72*(.5+.5*Math.sin(t*8+i*3));
          c.fillStyle=i%3?'#c5e8ff':'#ffe8aa';c.globalAlpha=alpha*a;
          c.fillRect(sx,sy,i%4===0?3:2,i%4===0?3:2);
        }c.restore();
      }
      function paintMeteor(t,dt) {
        cosmicBack(.12* Math.sin(Math.PI*t));
        const progress=ease(clamp((t-.10)/.59,0,1)),
          x=lerp(origin.x,dest.x,progress),y=lerp(origin.y,dest.y,progress)-90*Math.sin(progress*Math.PI);
        if (t<.12) {ring(origin.x,origin.y,20+110*ease(t/.12),'#a5a5ff',1-t/.12,4);}
        if(t>.08 && t<.74){
          glow(x,y,130,'rgba(190,154,255,0.6)',.9);
          for(let k=0;k<4;k++){const q=Math.max(0,progress-.015*k);const px=lerp(origin.x,dest.x,q),py=lerp(origin.y,dest.y,q)-90*Math.sin(q*Math.PI);
            glow(px,py,26+k*8,'rgba(242,171,254,0.32)',.75/(k+1));}
          if(dt>0) emit(x,y,Math.min(9,Math.ceil(dt*260)),{v0:25,v1:130,rMin:2,rMax:7,lifeMin:.18,lifeMax:.52,colors:['#fff1d0','#e5b1fb','#9ae4ff'],gravity:20,angle:sideX?0:Math.PI,spread:1.8});
          pawMoonRock(x,y,.82+Math.sin(progress*Math.PI)*.36,t*2.7*(sideX?-1:1));
        }
        if(t>.61){const e=ease(clamp((t-.61)/.35,0,1));
          glow(dest.x,dest.y,210*(1-e*.4),'rgba(255,198,150,0.6)',1-e*.35);
          ring(dest.x,dest.y,20+235*e,'#ead2ff',Math.pow(1-e,2),8);
          ring(dest.x,dest.y,40+130*e,'#ffd5a2',1-e,7);
          flash(Math.max(0,(1-Math.abs(t-.64)/.10))*.42);
          if(dt>0&&t<.66)emit(dest.x,dest.y,20,{v0:80,v1:320,rMin:4,rMax:10,colors:['#f6e0ff','#ffe1a0','#9a9cac'],kind:'rock',gravity:280});
          screenShake((1-e)*8,t);
        }
      }
      const falling=[];
      for(let i=0;i<16;i++){
        const f=i/16;
        falling.push({x:seeded(100,930,i+31),bias:seeded(-1,1,i+50),size:seeded(23,72,i+73),delay:.06+f*.65,spd:seeded(.23,.46,i+93),spin:seeded(-4,5,i+114),id:i+8});
      }
      function paintOrbit(t,dt){
        cosmicBack(.17);
        glow(dest.x,dest.y,170,'rgba(178,170,250,0.28)',.5);
        let impactCount=0;
        for(const f of falling){
          const x=lerp(f.x,dest.x+f.bias*140,.38), groundY=lerp(440,dest.y+80,.65);
          const p=(t-f.delay)/f.spd;
          if(p>=0&&p<1){
            const y=-90+(groundY+90)*easeOut(p);
            c.save();c.strokeStyle='rgba(218,214,255,.5)';c.lineWidth=f.size*.2;c.lineCap='round';
            c.beginPath();c.moveTo(x-11,y-92);c.lineTo(x,y-f.size*.8);c.stroke();c.restore();
            glow(x,y,f.size*1.5,'rgba(207,187,248,0.3)',.5);
            rockShape(x,y,f.size, t*f.spin,f.id);
            if(dt>0&&Math.random()<.55)emit(x,y-f.size*.5,1,{v0:3,v1:65,colors:['#e4d8fb','#ded7ea'],rMin:2,rMax:5,lifeMin:.18,lifeMax:.4});
          } else if(p>=1 && p<1.30) {
            impactCount++;
            const q=(p-1)/.30;
            glow(x,groundY,f.size*2.2,'rgba(255,214,172,0.4)',.35*(1-q));
            ring(x,groundY,6+f.size*1.5*q,'#edd8bd',(1-q)*.75,4);
            if(dt>0&&p<1.08)emit(x,groundY,3,{v0:60,v1:190,gravity:250,colors:['#c5b7d1','#f9e6cf'],kind:'rock',rMin:3,rMax:7});
          }
        }
        if(t>.36&&t<1.04){screenShake(3+Math.sin(t*81)*4,t);}
        if(impactCount>0)flash(.03*Math.sin(t*130),'255,236,200');
      }
      function paintBark(t,dt){
        const prog=clamp((t-.31)/.43,0,1);
        cosmicBack(.18+Math.sin(Math.PI*clamp(t,0,1))*.10,'8,24,78');
        starfield(t,26,.5);
        if(t<.43){for(let i=0;i<2;i++) {const e=clamp((t-i*.22)/.23,0,1);
          if(e>0&&e<1){ring(origin.x,origin.y,35+180*ease(e),'#78d6ff',(1-e)*.75,9);}
        }}
        if(t>=.28&&t<=.87){
          const tx=lerp(origin.x,dest.x,ease(prog)),ty=lerp(origin.y,dest.y,ease(prog));
          // A brilliant cyan laser grows across the entire battle field.
          c.save();c.lineCap='round';
          const main=c.createLinearGradient(origin.x,origin.y,tx,ty);
          main.addColorStop(0,'rgba(65,159,255,.5)');main.addColorStop(.65,'rgba(78,199,255,.95)');main.addColorStop(1,'#e6faff');
          c.shadowColor='#0ab3ff';c.shadowBlur=65;
          c.strokeStyle=main;c.lineWidth=115+35*Math.sin(prog*Math.PI);
          c.beginPath();c.moveTo(origin.x,origin.y);c.lineTo(tx,ty);c.stroke();
          c.shadowBlur=24;c.strokeStyle='#46d3ff';c.lineWidth=48;
          c.beginPath();c.moveTo(origin.x,origin.y);c.lineTo(tx,ty);c.stroke();
          c.shadowBlur=12;c.strokeStyle='white';c.lineWidth=16;
          c.beginPath();c.moveTo(origin.x,origin.y);c.lineTo(tx,ty);c.stroke();c.restore();
          for(let j=0;j<4;j++){
            const p=seeded(.20,.95,j+51),x=lerp(origin.x,tx,p),y=lerp(origin.y,ty,p);
            const off=(j%2===0?1:-1)*seeded(30,66,j+8)*Math.sin(t*27+j);
            c.strokeStyle='rgba(140,234,255,.85)';c.shadowColor='#6adaff';c.shadowBlur=16;c.lineWidth=3;
            c.beginPath();c.moveTo(x,y);c.lineTo(x+off*.5,y-off);c.lineTo(x+off*.7,y-off*.3);c.stroke();c.shadowBlur=0;
          }
          if(dt>0)emit(tx,ty,5,{v0:45,v1:210,colors:['#e5faff','#70d7ff','#387cff'],rMin:2,rMax:6,lifeMin:.25,lifeMax:.58,gravity:0});
        }
        if(t>.62){const v=ease(clamp((t-.62)/.34,0,1));
          glow(dest.x,dest.y,270,'rgba(92,204,255,0.65)',1-v);
          ring(dest.x,dest.y,25+240*v,'#72dfff',1-v,11);
          flash((1-v)*.23,'153,224,255');screenShake(7*(1-v),t);
        }
      }
      function paintSupernova(t,dt){
        const charge=clamp(t/.37,0,1), blast=clamp((t-.36)/.64,0,1);
        cosmicBack(.14+.34*Math.sin(clamp(t,0,1)*Math.PI),'18,12,48');
        starfield(t,50,.9);
        if(t<.43){
          for(let i=0;i<3;i++)ring(dest.x,dest.y,155-(i*31)-charge*85,
            ['#ffeeca','#ce8bff','#8beaff'][i],.30+charge*.5,5);
          glow(dest.x,dest.y,18+80*charge,'rgba(255,255,218,0.85)',.6+charge*.4);
        }
        if(t>=.36){
          const v=easeOut(blast),r=35+550*v;
          glow(dest.x,dest.y,Math.max(45,r),'rgba(255,172,91,0.7)',Math.pow(1-blast,.55));
          c.save();c.translate(dest.x,dest.y);c.rotate(t*.6);
          // Expanding jagged fireball silhouette.
          c.beginPath();const N=44;
          for(let i=0;i<N;i++){
            const a=i*TAU/N;const len=r*(.84+.2*Math.sin(i*4.8+t*29)+.17*Math.sin(i*2.2+t*13));
            const px=Math.cos(a)*len,py=Math.sin(a)*len;
            if(i===0)c.moveTo(px,py); else c.lineTo(px,py);
          }c.closePath();
          c.fillStyle=`rgba(255,115,46,${Math.pow(1-blast,1.4)*.72})`;c.shadowColor='#ff9a3e';c.shadowBlur=80;c.fill();
          c.beginPath();c.arc(0,0,r*.6,0,TAU);c.fillStyle=`rgba(255,218,127,${Math.pow(1-blast,1.3)*.82})`;c.fill();
          c.beginPath();c.arc(0,0,r*.36,0,TAU);c.fillStyle=`rgba(255,253,219,${Math.pow(1-blast,1.15)})`;c.fill();
          c.restore();
          ring(dest.x,dest.y,40+540*v,'#ffd7a2',1-blast,Math.max(3,22*(1-blast)));
          ring(dest.x,dest.y,20+420*v,'#caa0ff',(1-blast)*.7,10);
          if(t<.73&&dt>0)emit(dest.x,dest.y,7,{v0:150,v1:570,rMin:3,rMax:10,lifeMin:.38,lifeMax:.92,colors:['#fff5bc','#ffcc67','#ff794a','#8f87ff'],gravity:20});
          flash(Math.max(0,1-Math.abs(t-.42)/.15)*.58);
          screenShake(Math.max(0,(1-blast)*13),t);
        }
      }
      function run(now) {
        if(stopped)return;
        const liveField=document.querySelector('.battle-field');
        if(!liveField || !liveField.isConnected){movie.stop();return;}
        const rect=liveField.getBoundingClientRect();
        if(rect.width<10||rect.height<10){movie.stop();return;}
        canvas.style.left=rect.left+'px';canvas.style.top=rect.top+'px';
        canvas.style.width=rect.width+'px';canvas.style.height=rect.height+'px';
        const dpr=Math.min(window.devicePixelRatio||1,1.8);
        const newW=Math.round(rect.width*dpr),newH=Math.round(rect.height*dpr);
        if(newW!==w||newH!==h){w=newW;h=newH;canvas.width=w;canvas.height=h;}
        c.setTransform(w/W,0,0,h/H,0,0);c.clearRect(0,0,W,H);
        const t=(now-started)/dur,dt=clamp((now-lastTime)/1000,0,.06);lastTime=now;
        if(t>=1.03){movie.stop();return;}
        c.save();
        const seconds=(now-started)/1000;
        if(index===0)paintMeteor(t,dt);
        else if(index===1)paintOrbit(t,dt);
        else if(index===2)paintBark(t,dt);
        else paintSupernova(t,dt);
        c.restore();
        drawParticles(dt);
        raf=requestAnimationFrame(run);
      }
      raf=requestAnimationFrame(run);
    } catch (e) { /* never interrupt battle controls */ }
  }
  moveSound = function (id, index) {
    if (id === 'star') {
      queuedStarAttack = {index:Number(index)||0, at:performance.now()};
      starSound(queuedStarAttack.index);
      return;
    }
    return previousMoveSound(id, index);
  };
  animateBattleSprite = function (side, cls) {
    if (cls === 'strike' && queuedStarAttack && performance.now() - queuedStarAttack.at < 1200) {
      const which=queuedStarAttack.index;
      queuedStarAttack = null;
      createMovie(which, side);
      return;
    }
    return previousAnimate(side, cls);
  };
})();

