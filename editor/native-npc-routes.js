/* V248: routes for every original scripted NPC, in addition to World Studio NPCs.
 * Routes are opt-in; no character's original animation, dialogue or quest sequence
 * is modified until the user supplies two or more valid waypoints.
 */
(()=>{
 'use strict';
 const actors=[
  {id:'ball-dee',name:'Ball Dee',region:'leaf',x:680,y:621,speed:66},
  {id:'olaf',name:'Olaf',region:'leaf',x:766,y:847,speed:72},
  {id:'ian',name:'Ian',region:'leaf',x:1890,y:990,speed:68},
  {id:'miss-muffet',name:'Miss Muffet',region:'leaf',x:420,y:530,speed:68},
  {id:'josh',name:'Josh',region:'leaf',x:2220,y:1250,speed:73},
  {id:'sue',name:'Sue',region:'leaf',room:'cure',x:450,y:495,speed:60},
  {id:'norm',name:'White Boy Norm',region:'leaf',room:'gym',x:450,y:420,speed:37},
  {id:'nitty',name:'Nitty',region:'leaf',room:'cottage',x:470,y:350,speed:60},
  {id:'lucy',name:'Lucy',region:'leaf',room:'flower',x:450,y:334,speed:58},
  {id:'old-lady',name:'Old Lady',region:'leaf',room:'oldladyhome',x:450,y:330,speed:44},
  {id:'reth',name:'Reth Sogan',region:'leaf',room:'lighterhouse',x:465,y:305,speed:58},
  {id:'woodland-hobo',name:'Woodland Hobo',region:'leaf',room:'cabin',x:452,y:375,speed:40},
  {id:'langy',name:'Langy',region:'leaf',room:'sewer',x:455,y:286,speed:48},
  {id:'spoonie',name:'Spoonie',region:'grove',room:'spoonie',x:450,y:450,speed:42},
  {id:'john-john',name:'John John',region:'grove',room:'jjhome',x:450,y:366,speed:40},
  {id:'furry',name:'Furry',region:'grove',room:'furrylodge',x:450,y:378,speed:48}
 ];
 const byId=new Map(actors.map(a=>[a.id,a]));
 let routes={},memory=new Map();
 function sanitize(input){
  const result={};if(!input||typeof input!=='object')return result;
  for(const actor of actors){const r=input[actor.id];if(!r||!Array.isArray(r.points))continue;
   const width=actor.room?900:2896,height=actor.room?680:2172;
   const points=r.points.filter(p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y)&&p.x>=0&&p.x<=width&&p.y>=0&&p.y<=height)
    .slice(0,64).map(p=>({x:Math.round(p.x),y:Math.round(p.y)}));
   result[actor.id]={points,style:r.style==='pingpong'?'pingpong':'loop',speed:Math.min(140,Math.max(20,Number(r.speed)||actor.speed))};
  }
  return result;
 }
 // Waypoint 1 is the spawn point, not a target the NPC must walk toward.
 // Align live outdoor sprites when routes are loaded, including before the first
 // movement tick; indoor/point-based actors align when their scene first uses them.
 function setRoutes(value){
  routes=value||{};memory.clear();still.clear();
  const live={
   'ball-dee':typeof npc!=='undefined'?npc:null,
   'olaf':window.olafNPC,'ian':window.ianNPC,
   'miss-muffet':window.missMuffetNPC,'josh':window.joshNPC
  };
  for(const [id,state] of Object.entries(live)){
   const r=active(id);if(!r||!state)continue;
   const start=r.points[0],next=r.points[1];
   state.x=start.x;state.y=start.y;state.moving=false;
   const dx=next.x-start.x,dy=next.y-start.y;
   const dir=Math.abs(dx)>=1?(dx>=0?'right':'left'):(dy>=0?'down':'up');
   turn(state,dir);
   if('stepClock' in state)state.stepClock=0;
   if('stepTime' in state)state.stepTime=0;
  }
 }
 function active(id){const r=routes[id];return r&&Array.isArray(r.points)&&r.points.length>=2?r:null;}
 function stageMatches(actor){
  // Interior NPCs run only in their original scene; overworld NPCs run only
  // in their original district. Never wander out during battles or dialogues.
  if(typeof currentDistrict==='undefined')return false;
  if(actor.room==='sewer')return typeof langySewer!=='undefined'&&langySewer.inside;
  if(actor.room)return typeof interior!=='undefined'&&interior===actor.room;
  return currentDistrict===actor.region && !interior;
 }
 function pause(){return typeof running!=='undefined'&&!running||typeof dialogOpen!=='undefined'&&dialogOpen||typeof shopOpen!=='undefined'&&shopOpen||typeof missionOpen!=='undefined'&&missionOpen||typeof battle!=='undefined'&&!!battle;}
 function turn(state,dir){state.direction=dir;state.dir=dir;}
 function advance(id,state,elapsed,anim){
  const actor=byId.get(id),r=active(id);
  if(!actor||!r||!stageMatches(actor))return false;
  if(!state)return false;
  const t=memory.get(id)||{idx:1,heading:1,wait:0,started:false};
  if(!t.started){
    // Every page load and initial scene entry begins AT point 1, with the
    // next movement targeting point 2 (the next visit loops as configured).
    const start=r.points[0];
    state.x=start.x;state.y=start.y;
    t.started=true;t.idx=1;t.heading=1;t.wait=0;
    state.moving=false;if(anim)anim.moving=false;
    if('stepClock' in state)state.stepClock=0;
    if('stepTime' in state)state.stepTime=0;
    if(anim){if('stepClock' in anim)anim.stepClock=0;if('stepTime' in anim)anim.stepTime=0;}
    memory.set(id,t);
    return true;
  }
  const setMovement=(moving,dir)=>{
    state.moving=moving;if(anim)anim.moving=moving;
    if(dir){turn(state,dir);if(anim)turn(anim,dir);}
    if(moving){const delta=Math.max(0,Number(elapsed)||0);
      state.stepClock=(state.stepClock||0)+delta;
      state.stepTime=(state.stepTime||0)+delta;
      state.step=(state.step||0)+delta*8;
      state.anim=(state.anim||0)+delta;
      if(anim){anim.stepClock=(anim.stepClock||0)+delta;anim.stepTime=(anim.stepTime||0)+delta;}
    }
  };
  if(pause()){setMovement(false);memory.set(id,t);return true;}
  const dt=Math.max(0,Math.min(.06,Number(elapsed)||0));
  if(t.wait>0){t.wait-=dt;setMovement(false);memory.set(id,t);return true;}
  const pt=r.points[t.idx]||r.points[0];
  const dx=pt.x-state.x,dy=pt.y-state.y;
  if(Math.abs(dx)<1.2&&Math.abs(dy)<1.2){
    state.x=pt.x;state.y=pt.y;
    if(r.style==='pingpong'){
      if(t.idx===r.points.length-1)t.heading=-1;
      else if(t.idx===0)t.heading=1;
      t.idx=Math.max(0,Math.min(r.points.length-1,t.idx+t.heading));
    }else t.idx=(t.idx+1)%r.points.length;
    t.wait=.16;setMovement(false);memory.set(id,t);return true;
  }
  const xFirst=Math.abs(dx)>=1.2;
  const displacement=Math.min(xFirst?Math.abs(dx):Math.abs(dy),dt*(Number(r.speed)||actor.speed));
  if(xFirst){state.x+=Math.sign(dx)*displacement;setMovement(displacement>0,dx>0?'right':'left');}
  else{state.y+=Math.sign(dy)*displacement;setMovement(displacement>0,dy>0?'down':'up');}
  // Existing sprite state calculations use these in some interiors.
  if('targetX' in state)state.targetX=pt.x;
  if('targetY' in state)state.targetY=pt.y;
  if('wait' in state)state.wait=0;
  memory.set(id,t);return true;
 }
 const still=new Map();
 function point(id,x,y){
  const r=active(id);if(!r)return {x,y,custom:false,direction:'down',moving:false};
  const actor=byId.get(id);if(!actor||!stageMatches(actor))return {x,y,custom:false,direction:'down',moving:false};
  let state=still.get(id);
  const now=performance.now();
  if(!state){const start=r.points[0];state={x:start.x,y:start.y,dir:'down',direction:'down',moving:false,last:now};still.set(id,state);}
  const dt=Math.min(.045,(now-state.last)/1000);state.last=now;
  advance(id,state,dt);
  return {x:state.x,y:state.y,direction:state.direction||'down',moving:!!state.moving,custom:true};
 }
 window.SAActorRoutes={list:()=>actors.map(x=>({...x})),sanitize,setRoutes,drive:advance,point,
   get routes(){return routes},get actors(){return actors}};
})();
