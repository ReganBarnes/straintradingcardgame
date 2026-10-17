/* Strain Adventures V246 — native Eastern Grove geometry, *not* an illustrated map sprite.
   Grass, sand routes, irregular lake, empty central island, shoreline and waves are
   painted as individual procedural terrain layers. Every house, bridge, tree and prop
   is a separate World Studio placement, preserving editor move/delete and collisions. */
(()=>{
 'use strict';
 const WW=2896,HH=2172;
 const RING=[[768,320],[2176,320],[2176,672],[2496,672],[2496,1472],[2176,1472],[2176,1824],[768,1824],[768,1472],[448,1472],[448,672],[768,672],[768,320]];
 const BRANCHES=[[[400,295],[400,672],[448,672]],[[1130,216.5],[1130,320]],[[2115,246],[2115,320]],[[2660,671.5],[2496,671.5]],[[2670,1415.5],[2496,1415.5]],[[2250,2001.5],[2250,2096],[1984,2096],[1984,1824]],[[1430,2040.5],[1430,2096],[1632,2096],[1632,1824]],[[660,1997],[660,2096],[896,2096],[896,1824]],[[220,1115.5],[220,1184],[448,1184]],[[448,1072],[704,1072]]];
 const LC={x:1460,y:1070,rx:675,ry:530},IS={x:1460,y:1070,rx:213,ry:158};
 const BR={x1:760,x2:1270,y:1070,halfWidth:48};
 const pathList=[RING,...BRANCHES];
 const rng=(seed)=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 let baseCanvas=null;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const radAt=(a)=>1+.042*Math.sin(3*a+.5)+.029*Math.sin(5*a+1.3)+.021*Math.sin(8*a-.9);
 const radial=(x,y)=>{const dx=(x-LC.x)/LC.rx,dy=(y-LC.y)/LC.ry;return Math.hypot(dx,dy)-radAt(Math.atan2(dy,dx));};
 const onIsland=(x,y,pad=0)=>((x-IS.x)/(IS.rx+pad))**2+((y-IS.y)/(IS.ry+pad))**2<=1;
 const waterAt=(x,y)=>radial(x,y)<0&&!onIsland(x,y);
 function bridgeAt(x,y){
   // Bridge collision is tied to editor pieces so removal/movement takes effect immediately.
   const list=window.SAWorldEditor?.placements?.grove||[];
   return list.some(o=>String(o.assetId).startsWith('v241_bridge_') &&
      Math.abs(x-o.x)<o.w*.485 && Math.abs(y-o.y)<o.h*.38);
 }
 function distanceSegment(x,y,a,b){
   const dx=b[0]-a[0],dy=b[1]-a[1],t=clamp(((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy||1),0,1);
   return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);
 }
 function onRoad(x,y,pad=0){
   return pathList.some(path=>path.some((p,i)=>i+1<path.length && distanceSegment(x,y,p,path[i+1])<(64)+pad));
 }
 function lakeShape(g,inflate=0){
   g.beginPath();
   for(let i=0;i<=256;i++){
     const a=i/256*Math.PI*2,r=radAt(a);
     const x=LC.x+Math.cos(a)*(LC.rx*r+inflate),y=LC.y+Math.sin(a)*(LC.ry*r+inflate);
     if(i===0)g.moveTo(x,y);else g.lineTo(x,y);
   }
   g.closePath();
 }
 function paintRoad(g,pts,width){
   g.save();g.lineJoin='round';g.lineCap='round';g.lineWidth=width;
   g.beginPath();pts.forEach((p,i)=>i?g.lineTo(...p):g.moveTo(...p));
   g.strokeStyle='#536c42';g.lineWidth=width+15;g.globalAlpha=.66;g.stroke();
   g.globalAlpha=1;g.strokeStyle='#b49a6b';g.lineWidth=width+7;g.stroke();
   g.strokeStyle='#dac69a';g.lineWidth=width;g.stroke();
   g.strokeStyle='#ebd8ab';g.globalAlpha=.28;g.lineWidth=width*.36;g.stroke();g.restore();
 }
 function makeNativeTerrain(){
   if(baseCanvas)return;
   const c=document.createElement('canvas');c.width=WW;c.height=HH;
   const g=c.getContext('2d',{alpha:false});g.fillStyle='#245c3b';g.fillRect(0,0,WW,HH);
   const rand=rng(1024242);
   // Localized ground tufts, retaining the dark-green Leaf Town palette.
   for(let i=0;i<18000;i++){
     const x=rand()*WW,y=rand()*HH;
     g.fillStyle=['#2c7044','#306e46','#1d5338','#497b4d','#44754e','#285d41'][Math.floor(rand()*6)];
     g.fillRect(x,y,1+rand()*6,1+rand()*3);
   }
   // Sandy continuous ring + every doorway spur, before clipping with real water.
   // V243: routes are actual editable Fine Cream Sand tile placements in World Studio.
   // Never paint a custom path texture into the terrain base. The editor draws the roads.
   g.save();lakeShape(g,19);g.fillStyle='#658b62';g.fill();g.restore();
   g.save();lakeShape(g,9);g.fillStyle='#6c986b';g.fill();g.restore();
   // Static lake pigments are paint, not any source illustration/one image object.
   g.save();lakeShape(g);g.clip();
   const water=g.createLinearGradient(LC.x-LC.rx,LC.y-LC.ry,LC.x+LC.rx,LC.y+LC.ry);
   water.addColorStop(0,'#388ca3');water.addColorStop(.47,'#236d8f');water.addColorStop(1,'#17617f');
   g.fillStyle=water;g.fillRect(LC.x-LC.rx-50,LC.y-LC.ry-50,LC.rx*2+100,LC.ry*2+100);
   for(let i=0;i<2200;i++){
     const x=LC.x+(rand()-.5)*1500,y=LC.y+(rand()-.5)*1280;
     const v=rand();g.fillStyle=v>.6?'rgba(143,208,202,.13)':'rgba(10,79,104,.19)';
     g.fillRect(x,y,4+rand()*28,1+rand()*4);
   }
   g.restore();
   // Continuous irregular island. Island shore has walkable grass inside and
   // no house/gym/decor placed there, reserved for Spoonie's Gym.
   g.save();g.translate(IS.x,IS.y);
   g.fillStyle='#4b8c67';g.beginPath();g.ellipse(0,0,IS.rx+16,IS.ry+15,0,0,Math.PI*2);g.fill();
   g.fillStyle='#9dc49d';g.beginPath();g.ellipse(0,0,IS.rx+8,IS.ry+8,0,0,Math.PI*2);g.fill();
   g.fillStyle='#245c3b';g.beginPath();g.ellipse(0,0,IS.rx,IS.ry,0,0,Math.PI*2);g.fill();
   for(let i=0;i<200;i++){
     const x=(rand()-.5)*IS.rx*2,y=(rand()-.5)*IS.ry*2;
     if((x/IS.rx)**2+(y/IS.ry)**2>.87)continue;
     g.fillStyle=i%4?'#326c43':'#427649';g.fillRect(x,y,3+rand()*4,1+rand()*3);
   }
   g.restore();
   // Shores: delicate foam / stone flecks, not hard tile boundaries.
   g.save();lakeShape(g);g.strokeStyle='#90c7bb';g.lineWidth=5;g.globalAlpha=.6;g.stroke();
   g.translate(IS.x,IS.y);g.beginPath();g.ellipse(0,0,IS.rx+7,IS.ry+7,0,0,Math.PI*2);
   g.strokeStyle='#b2d5bd';g.lineWidth=2.5;g.stroke();g.restore();
   baseCanvas=c;
 }
 function drawWaterMovement(){
   const t=performance.now()*.001;
   ctx.save();
   for(let i=0;i<30;i++){
     const x=LC.x+Math.sin(i*43.17)*LC.rx*.91,y=LC.y+Math.cos(i*16.7)*LC.ry*.88;
     if(!waterAt(x,y))continue;
     const pulse=.08+.08*Math.sin(t*1.3+i*.7);
     ctx.globalAlpha=Math.max(0,pulse);ctx.strokeStyle='#b6ecdb';ctx.lineWidth=2;
     ctx.beginPath();ctx.ellipse(x,y,12+(t*7+i*8)%24,3.5,0,.25,Math.PI-.15);ctx.stroke();
   }
   ctx.restore();
 }
 const oldDraw=drawEasternDistrict;
 const treeCache=new Map();
 drawEasternDistrict=function(){
   if(world.w!==WW||world.h!==HH){world.w=WW;world.h=HH;}
   makeNativeTerrain();
   if(baseCanvas)ctx.drawImage(baseCanvas,0,0);
   drawWaterMovement();
   window.SAWorldEditor?.drawLayer('ground');
   window.SAWorldEditor?.drawLayer('decor');
   // Keep the entrance to Leaf Town and original game interactions.
   if(Math.hypot(player.x-returnGate.x,player.y-returnGate.y)<245)
     drawTravelGate(returnGate.x,returnGate.y,'LEAF TOWN',true,true);
   drawHero(player.x,player.y,player.dir,player.step);
   // Partial canopies above a hero walking behind trees; trunks stay beneath.
   const objs=window.SAWorldEditor?.placements?.grove||[];
   for(const o of objs){
     if(!String(o.assetId).startsWith('tree_')||player.y>=o.y+o.h*.23)continue;
     if(Math.abs(player.x-o.x)>o.w*.48||Math.abs(player.y-o.y)>o.h*.56)continue;
     let im=treeCache.get(o.assetId);
     if(!im){im=new Image();im.src='editor/art/'+o.assetId+'.png';treeCache.set(o.assetId,im);}
     if(!im.complete||!im.naturalWidth)continue;
     ctx.save();ctx.beginPath();ctx.rect(o.x-o.w/2,o.y-o.h/2,o.w,o.h*.61);ctx.clip();
     ctx.drawImage(im,o.x-o.w/2,o.y-o.h/2,o.w,o.h);ctx.restore();
   }
   window.SAWorldEditor?.drawLayer('foreground');
 };
 const v241Blocked=groveBlocked;
 groveBlocked=function(x,y){
   if(x<30||y<30||x>WW-30||y>HH-30)return true;
   if(waterAt(x,y)&&!bridgeAt(x,y))return true;
   // keep old externally placed water tiles behaving as solid except for bridges
   const objs=window.SAWorldEditor?.placements?.grove||[];
   let tileWater=false;
   for(const o of objs){if(!String(o.assetId).startsWith('v241_water_'))continue;
     if(Math.abs(x-o.x)<o.w*.5&&Math.abs(y-o.y)<o.h*.5){tileWater=true;break;}
   }
   return tileWater&&!bridgeAt(x,y);
 };
 groveOnPath=function(x,y,pad=0){return !groveBlocked(x,y)&&(onRoad(x,y,pad)||bridgeAt(x,y)||onIsland(x,y,0));};
 groveOnHouseSpur=function(x,y,pad=0){return !groveBlocked(x,y)&&BRANCHES.some(path=>path.some((p,i)=>i+1<path.length&&distanceSegment(x,y,p,path[i+1])<(64)+pad));};
 window.EasternGroveV242={version:246,name:'Eastern Grove',mapType:'native-layered',nineHouses:true,islandReservedForSpoonie:true,pathAssetId:"v241_floor_10",squareRoads:true,crossOutline:true,
  lakeAt:waterAt,bridgeAt,onRoad,get paths(){return pathList;},get placements(){return window.SAWorldEditor?.placements?.grove||[];}};
})();
