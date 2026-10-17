/* V241 — Native empty Eastern Grove. Green grass is real ground color, not a backdrop.
 * The V240 geometry and reference artwork are superseded without altering Leaf Town.
 * Every new building, floor, lake, bridge, cascade or decoration is now a World Studio object.
 */
(()=>{
  'use strict';
  const WW=2896, HH=2172, GRASS='#245c3b';
  // Keep the existing travel gateway and the original exterior-to-interior
  // identifiers. Locations are now based exclusively on user-placed buildings.
  const wrapPoint=name=>{
    const uid='eg240_house_'+String(name).toLowerCase().replaceAll(' ','_');
    return window.SAWorldEditor?.placements?.grove?.find(o=>o.uid===uid)||null;
  };
  // Until the user restores or positions a named house, its doorstep has NO trigger.
  // This keeps the underlying quests available without invisible houses on empty grass.
  const originalNearDoor=jjNearDoor;
  jjNearDoor=function(h){
    if(!wrapPoint(h.n))return false;
    return originalNearDoor(h);
  };
  const originalGroveDoor=jjDoor;
  jjDoor=function(h){
    if(!wrapPoint(h.n))return {x:-999999,y:-999999};
    return originalGroveDoor(h);
  };
  // Both gym and costume shop remain functional when the dedicated Hall asset is
  // placed; otherwise neither opens when the player walks through empty grass.
  const previousGroveInteract=interact;
  interact=function(){
    if(currentDistrict==='grove'&&!interior){
      const hall=wrapPoint('EASTERN GROVE HALL');
      if(!hall){spoonieGym.doorX=-999999;spoonieGym.doorY=-999999;costumeDoor.x=-999999;costumeDoor.y=-999999;}
    }
    return previousGroveInteract();
  };
  // Leave original game-time water and shore geometry completely unused.
  const baseBlocked=groveBlocked;
  groveBlocked=function(x,y){
    if(x<25||y<25||x>WW-25||y>HH-25)return true;
    const placed=window.SAWorldEditor?.placements?.grove||[];
    let overWater=false;
    for(let i=placed.length-1;i>=0;i--){
      const a=placed[i];
      if(!a.assetId?.startsWith('v241_water_'))continue;
      const xx=x-a.x,yy=y-a.y,theta=-(a.rotation||0);
      const rx=xx*Math.cos(theta)-yy*Math.sin(theta),ry=xx*Math.sin(theta)+yy*Math.cos(theta);
      if(Math.abs(rx)<a.w/2&&Math.abs(ry)<a.h/2){overWater=true;break;}
    }
    if(overWater){
      for(let i=placed.length-1;i>=0;i--){
        const a=placed[i];
        if(!a.assetId?.startsWith('v241_bridge_'))continue;
        const xx=x-a.x,yy=y-a.y,theta=-(a.rotation||0);
        const rx=xx*Math.cos(theta)-yy*Math.sin(theta),ry=xx*Math.sin(theta)+yy*Math.cos(theta);
        if(Math.abs(rx)<a.w*.47&&Math.abs(ry)<a.h*.42)return false;
      }
      return true;
    }
    // The World Studio's existing collision engine handles placed house footprints,
    // fences, props and custom collision boundary lines.
    return false;
  };
  groveOnPath=function(x,y){return !groveBlocked(x,y);};
  groveOnHouseSpur=groveOnPath;
  const clearGrove=function(){
    if(world.w!==WW||world.h!==HH){world.w=WW;world.h=HH;}
    ctx.fillStyle=GRASS;
    ctx.fillRect(0,0,WW,HH);
    window.SAWorldEditor?.drawLayer('ground');
    window.SAWorldEditor?.drawLayer('decor');
    if(Math.hypot(player.x-returnGate.x,player.y-returnGate.y)<155)
      drawTravelGate(returnGate.x,returnGate.y,'LEAF TOWN',true,true);
    drawHero(player.x,player.y,player.dir,player.step);
    window.SAWorldEditor?.drawLayer('foreground');
  };
  drawEasternDistrict=clearGrove;
  window.EasternGroveV241={version:241,name:'Eastern Grove',blank:true,terrainColor:GRASS,world:{w:WW,h:HH},
    get placements(){return window.SAWorldEditor?.placements?.grove||[];},
    get assetCount(){return document.querySelectorAll('#saAssetGrid .saAsset').length;},
    waterAt(x,y){return groveBlocked(x,y)}};
})();
