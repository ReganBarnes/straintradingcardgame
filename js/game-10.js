
/* Strain Adventures World Studio · V186-compatible non-destructive editor */
(()=>{
 'use strict';
 const STORAGE_KEY='strain_adventures_world_studio_v2';
 const DEFAULT_MAPS={leaf:[],grove:[]};
 const categoryNames=['Paths','Ground & Floors','Water & Shore','Bridges','Hedges','Bushes','Flowers & Grass','Trees','Rocks','Fences','Props & Lights','Streetlights','Eastern Grove Houses','Houses & Cabins','Waterfalls','Waterfalls & Fountains','Outdoor Details','NPCs','Imported'];
 const LAYER_ORDER=['ground','decor','foreground'];
 const LIMIT=100000; // per-region authoring cap; visible-object culling and IndexedDB persistence below
 const WALL_LIMIT=800,POINT_LIMIT=900;
 const byId=id=>document.getElementById(id);
 const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
 const clone=o=>JSON.parse(JSON.stringify(o));
 const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

 let library=[], manifestMap=new Map(), images=new Map(), maps=clone(DEFAULT_MAPS), customAssets=[], customNPCs=[];
 let collisionMaps={leaf:[],grove:[]};
 let nativeNPCRoutes={},nativeRouteSelected='';
 let wallThickness=14,showWalls=true,chosenWall=null,testing=false,testBar=null;
 let packagedWorldBaseline=null;
 let appliedWorldImports=[];
 let collisionCache=new Map();
 let ready=false,active=false,paletteOpen=true;
 let mode='paint',chosen='',category='Paths',selected=null;
 let hover=null,drag=null,pointerId=null,originalPlayer=null, originalMap='leaf';
 let snap=true,cellSize=16,brushScale=1,rotation=0,flipX=false,flipY=false;
 let collisionOverride=null,animatedOverride=null,layerOverride=null;
 let undo=[],redo=[],saveTimer=null,lastToast=0,lastStamp=null;
 let editorCanvas, ui, openBtn, togglePaletteBtn,toastBox;
 let editorZoom=1; // relative to normal game scale; editor-only, never saved to gameplay data.
 let ghostTint='#fff6cc';
 const regionKey=()=>currentDistrict==='grove'?'grove':'leaf';
 const getWalls=()=>collisionMaps[regionKey()];

 const projectTemplate=()=>({version:2,project:'Strain Adventures World Studio',maps:clone(DEFAULT_MAPS),collisionMaps:{leaf:[],grove:[]},customAssets:[],customNPCs:[],appliedWorldImports:[],nativeNPCRoutes:{}});
 function importedAssetMeta(asset){return {id:asset.id,name:asset.name,category:'Imported',src:asset.src,w:asset.w||96,h:asset.h||96,collision:false,animate:false,layer:'decor'};}
 function getMap(){return maps[currentDistrict==='grove'?'grove':'leaf'];}
 function getAsset(id){return manifestMap.get(id);}
 function getSelected(){return selected ? getMap().find(o=>o.uid===selected):null;}
 function makeUid(){return 'obj_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8);}
 function makeImage(meta){
   const im=new Image();
   im.decoding='async';
   im.onload=()=>{collisionCache.delete(meta.id);if(active) repaintPreview();};
   im.src=meta.src;
   images.set(meta.id,im);
 }
 function renderCatalog(){
   if(!ui)return;
   const cats=byId('saCategoryRow'); cats.replaceChildren();
   for(const c of categoryNames){
     const b=document.createElement('button');b.type='button';b.textContent=c;
     if(category===c) b.classList.add('selected');
     b.addEventListener('click',()=>{category=c;renderCatalog();});cats.append(b);
   }
   const search=(byId('saAssetSearch').value||'').trim().toLowerCase();
   const grid=byId('saAssetGrid');grid.replaceChildren();
   const results=library.filter(a=>(category===a.category||search)&&(!search||a.name.toLowerCase().includes(search)||a.category.toLowerCase().includes(search)));
   for(const a of results){
     const b=document.createElement('button');b.type='button';b.className='saAsset';
     if(chosen===a.id)b.classList.add('selected');
     b.title=a.name;
     const im=document.createElement('img'); im.src=a.src; im.alt=''; im.loading='lazy';
     const span=document.createElement('span');span.textContent=a.name;
     b.append(im,span);
     b.addEventListener('click',()=>{
       chosen=a.id;selected=null;
       collisionOverride=null; animatedOverride=null; layerOverride=null;
       setMode('paint');
       renderCatalog();syncProperties();
       tell(a.npc ? `Selected ${a.name} — tap near a path to place one roaming NPC.` : `Selected ${a.name} — tap or drag on the world to place.`);
     });
     grid.append(b);
   }
   byId('saAssetCount').textContent=`${results.length} pieces · ${library.length} total`;
 }
 function setMode(value){
   mode=value;
   for(const b of ui.querySelectorAll('[data-sa-tool]')) b.classList.toggle('saActiveTool',b.dataset.saTool===mode);
   if(mode!=='select'&&mode!=='npc-route') selected=null;
   if(mode==='native-route') selected=null;
   if(mode!=='wall-select') chosenWall=null;
   syncProperties();
 }
 function syncProperties(){
   const s=getSelected();const a=getAsset(chosen);
   const scale=s?Math.round(100*s.w/Math.max(1,(getAsset(s.assetId)?.w||s.w))):Math.round(brushScale*100);
   byId('saScale').value=clamp(scale,40,300);
   byId('saScaleLabel').textContent=clamp(scale,40,300)+'%';
   const col=s?s.collision:collisionOverride===null?a?.collision:collisionOverride;
   const ani=s?s.animate:animatedOverride===null?a?.animate:animatedOverride;
   byId('saCollision').checked=!!col;
   byId('saAnimate').checked=!!ani;
   const isNpcSelected=!!(s ? getAsset(s.assetId)?.npc : a?.npc);
   byId('saAnimateLabel').textContent=isNpcSelected?'Roam paths':'Sway / Glow';
   byId('saNPCCustomProperties').hidden=!isNpcSelected;
   byId('saRemoveNPC').disabled=!(s?getAsset(s.assetId)?.importedNPC:a?.importedNPC);
   const speed=Number(s?.speed??55),radius=Number(s?.radius??330);
   byId('saNPCSpeed').value=speed;byId('saNPCSpeedLabel').textContent=speed;
   byId('saNPCRadius').value=radius;byId('saNPCRadiusLabel').textContent=radius;
   byId('saNPCDialogue').value=s?.dialogue||'';
   if(byId('saNPCRouteStyle'))byId('saNPCRouteStyle').value=s?.npcRouteStyle==='pingpong'?'pingpong':'loop';
   if(byId('saNPCRouteCount'))byId('saNPCRouteCount').textContent=isNpcSelected?((s?.npcRoute?.length||0)+' route points · '+(s?.npcRoute?.length>1?'walking exact route':'normal path roaming')):'Select a placed NPC to edit roaming paths.';
   for(const id of ['saRouteStart','saRouteUndo','saRouteClear','saNPCRouteStyle'])if(byId(id))byId(id).disabled=!s||!isNPC(s);
   const quickSelect=byId('saNPCQuickSelect');
   if(quickSelect){const allNPCs=(maps[regionKey()]||[]).filter(o=>getAsset(o.assetId)?.npc);
     if(quickSelect.options.length!==allNPCs.length+1||allNPCs.some((o,i)=>quickSelect.options[i+1]?.value!==o.uid)){
       quickSelect.replaceChildren(new Option('Choose a roaming character…',''));
       allNPCs.forEach((o,i)=>quickSelect.add(new Option((getAsset(o.assetId)?.name||'NPC')+' #'+(i+1),o.uid)));
     }
     quickSelect.value=s&&isNPC(s)?s.uid:'';
   }
   const npcPicker=byId('saNPCPicker');
   if(npcPicker){const opts=(maps[regionKey()]||[]).filter(o=>getAsset(o.assetId)?.npc);
     if(npcPicker.options.length!==opts.length+1||opts.some((o,i)=>npcPicker.options[i+1]?.value!==o.uid)){
       npcPicker.replaceChildren(new Option('Choose a roaming NPC…',''));
       opts.forEach((o,i)=>npcPicker.add(new Option((getAsset(o.assetId)?.name||'NPC')+' #'+(i+1),o.uid)));
     }
     npcPicker.value=s&&isNPC(s)?s.uid:'';
   }
   byId('saCollision').disabled=isNpcSelected;
   byId('saLayer').disabled=isNpcSelected;
   byId('saLayer').value=s?s.layer:(layerOverride||a?.layer||'decor');
   byId('saSnap').checked=snap;
   byId('saGridSize').value=String(cellSize);
   byId('saSelectionInfo').textContent=s ? `Selected: ${getAsset(s.assetId)?.name||'Custom asset'} · x ${Math.round(s.x)}, y ${Math.round(s.y)}. Drag on the map to move it.` : 'Select an object to move, resize, mirror or remove it. NPCs roam nearby paths.';
   byId('saDuplicate').disabled=!s;
   byId('saDelete').disabled=!s;
   byId('saUndo').disabled=!undo.length;
   byId('saRedo').disabled=!redo.length;
   const currentWall=getWalls().find(w=>w.id===chosenWall);
   if(byId('saWallWidth')){byId('saWallWidth').value=String(currentWall?.width||wallThickness);byId('saWallWidthLabel').textContent=String(currentWall?.width||wallThickness)+'px';}
   if(byId('saWallInfo'))byId('saWallInfo').textContent=currentWall?'Selected boundary: drag it to reposition, change thickness or delete it.':'Draw lines on the world. Select one to move or delete it.';
   updateCounts();
 }
 function updateCounts(){
   const n=getMap().length;
   if(byId('saPlacementCount')) byId('saPlacementCount').textContent=`${n.toLocaleString()} / ${LIMIT.toLocaleString()} objects · ${getWalls().length} boundaries · ${currentDistrict==='grove'?'Eastern Grove':'Leaf Town'}`;
 }
 function recordUndo(){
   const count=(maps.leaf?.length||0)+(maps.grove?.length||0);
   const historyCap=count>30000?3:count>12000?6:count>5000?12:35;
   undo.push(clone({maps,collisionMaps,customAssets,customNPCs,nativeNPCRoutes}));
   while(undo.length>historyCap)undo.shift();
   redo.length=0;syncProperties();
 }
 function restoreSnapshot(s){maps=s.maps;invalidateSpatial();collisionMaps=sanitizeCollisionMaps(s.collisionMaps);customAssets=s.customAssets||[];customNPCs=s.customNPCs||[];nativeNPCRoutes=s.nativeNPCRoutes||{};window.SAActorRoutes?.setRoutes(nativeNPCRoutes);syncNativeUI();chosenWall=null; selected=null;loadImportedAssets();loadImportedNPCs();renderCatalog();syncProperties();repaintPreview();persistSoon();}
 function doUndo(){if(!undo.length)return;redo.push(clone({maps,collisionMaps,customAssets,customNPCs,nativeNPCRoutes}));restoreSnapshot(undo.pop());tell('Last world edit undone.');}
 function doRedo(){if(!redo.length)return;undo.push(clone({maps,collisionMaps,customAssets,customNPCs,nativeNPCRoutes}));restoreSnapshot(redo.pop());tell('World edit restored.');}
 // Large layout storage: IndexedDB is asynchronous and supports much bigger world projects
 // than localStorage. An existing project stored by V206 is imported on first launch.
 let studioDBPromise=null, writeSequence=Promise.resolve();
 function openStudioDB(){
   if(!studioDBPromise)studioDBPromise=new Promise(resolve=>{
     if(!window.indexedDB){resolve(null);return;}
     try{
       const req=indexedDB.open('strain_adventures_world_studio_v207',1);
       req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains('projects'))db.createObjectStore('projects');};
       req.onsuccess=()=>resolve(req.result);
       req.onerror=()=>resolve(null);
       req.onblocked=()=>resolve(null);
     }catch(e){resolve(null);}
   });
   return studioDBPromise;
 }
 async function readStoredProject(){
   const db=await openStudioDB();
   if(db){
     try{
       const entry=await new Promise((resolve,reject)=>{
         const tx=db.transaction('projects','readonly');
         const req=tx.objectStore('projects').get('current');
         req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error);
       });
       if(entry&&entry.maps)return entry;
     }catch(e){console.warn('World Studio: IndexedDB read failed',e);}
   }
   try{const stored=localStorage.getItem(STORAGE_KEY);return stored?JSON.parse(stored):null;}
   catch(e){console.warn('World Studio legacy storage read failed',e);return null;}
 }
 async function writeStoredProject(project){
   const db=await openStudioDB();
   if(db){
     await new Promise((resolve,reject)=>{
       const tx=db.transaction('projects','readwrite');
       tx.objectStore('projects').put(project,'current');
       tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
     });
   }else{
     localStorage.setItem(STORAGE_KEY,JSON.stringify(project));
   }
 }
 function persistSoon(){invalidateSpatial();clearTimeout(saveTimer);saveTimer=setTimeout(()=>saveNow(false),650);}
 function saveNow(message=true){
   clearTimeout(saveTimer);
   const snapshot=projectData();
   writeSequence=writeSequence.catch(()=>{}).then(()=>writeStoredProject(snapshot)).catch(e=>{
     console.warn('World Studio: save failed',e);
     tell('World Editor storage failed. Export All Changes now to protect your work.');
   });
   if(message)tell('Saving World Studio project. Export All Changes for a portable backup.');
   return true;
 }
 function projectData(){return {version:2,project:'Strain Adventures World Studio',maps,collisionMaps,customAssets,customNPCs,nativeNPCRoutes,appliedWorldImports,exportedAt:new Date().toISOString()};}
 function tell(message){
   if(!toastBox) return;
   toastBox.textContent=message; toastBox.style.display='block';
   const stamp=lastToast=Date.now();
   setTimeout(()=>{if(lastToast===stamp)toastBox.style.display='none';},2900);
 }
 function downloadBlob(blob,filename){
   const url=URL.createObjectURL(blob),a=document.createElement('a');
   a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();
   setTimeout(()=>URL.revokeObjectURL(url),45000);
 }
 // Portable *delta*, not a game build. Only World Studio objects/assets/NPCs can be changed.
 // The source V192 world-layout.json is used as the immutable reference for all deltas,
 // never a previously cached browser map. Unrelated game script/saves/content are excluded.
 function changedEntries(before,after){
   const oldById=new Map((before||[]).map(item=>[item.id||item.uid,item]));
   const nowById=new Map((after||[]).map(item=>[item.id||item.uid,item]));
   const added=[],modified=[],removed=[];
   for(const [id,item] of nowById){
     if(!oldById.has(id)) added.push(clone(item));
     else if(JSON.stringify(oldById.get(id))!==JSON.stringify(item)) modified.push(clone(item));
   }
   for(const id of oldById.keys()) if(!nowById.has(id)) removed.push(id);
   return {added,modified,removed};
 }
 function createChangeset(){
   const base=packagedWorldBaseline||projectTemplate();
   const edits={
     leaf:changedEntries(base.maps?.leaf||[],maps.leaf||[]),
     grove:changedEntries(base.maps?.grove||[],maps.grove||[])
   };
   const boundaries={leaf:changedEntries(base.collisionMaps?.leaf||[],collisionMaps.leaf||[]),grove:changedEntries(base.collisionMaps?.grove||[],collisionMaps.grove||[])};
   const art=changedEntries(base.customAssets||[],customAssets);
   const npcs=changedEntries(base.customNPCs||[],customNPCs);
   const counts={
     boundariesAdded:boundaries.leaf.added.length+boundaries.grove.added.length,
     boundariesChanged:boundaries.leaf.modified.length+boundaries.grove.modified.length,
     boundariesRemoved:boundaries.leaf.removed.length+boundaries.grove.removed.length,
     placed:edits.leaf.added.length+edits.grove.added.length,
     changed:edits.leaf.modified.length+edits.grove.modified.length,
     removed:edits.leaf.removed.length+edits.grove.removed.length,
     artAdded:art.added.length,artChanged:art.modified.length,artRemoved:art.removed.length,
     npcAdded:npcs.added.length,npcChanged:npcs.modified.length,npcRemoved:npcs.removed.length
   };
   return {
     format:'strain-adventures-world-studio-changes',
     schemaVersion:1,
     game:'Strain Adventures',
     createdFrom:'V205 World Studio on V204 Drifting Clouds',
     exportedAt:new Date().toISOString(),
     scope:['World Studio placement data','imported environment art','imported NPC sprite atlases and animations','placed NPC settings/dialogue','placed-object collisions','manual world-space collision boundaries'],
     preservationRules:{
       onlyApplyWorldStudioData:true,
       preserveGameplayCode:true,preserveGameSaves:true,
       preserveExistingBuildings:true,preserveHouseInteriors:true,
       preserveQuestsAndDialogue:true,
       respectPlacementUid:true,
       note:'Merge these specific editor changes into the latest working game ZIP. Add, update or remove listed editor objects by uid; leave every unlisted object and all other game files unchanged. Verify version/baseline before applying.'
     },
     changes:{
       maps:edits,
       collisionMaps:boundaries,
       customAssets:art,
       customNPCs:npcs,
       nativeNPCRoutes:clone(nativeNPCRoutes)
     },
     counts
   };
 }
 function exportAllChanges(){
   saveNow(false);
   const payload=createChangeset();
   const count=Object.values(payload.counts).reduce((a,b)=>a+b,0);
   const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
   downloadBlob(blob,'Strain_Adventures_World_Studio_All_Changes.json');
   tell(`Exported ${count} editor changes in one file. Upload it with your latest game ZIP to ChatGPT.`);
 }
 async function importProject(file){
   try{
     const raw=JSON.parse(await file.text());
     if(!raw || !raw.maps || !Array.isArray(raw.maps.leaf) || !Array.isArray(raw.maps.grove))throw new Error('Not a World Studio project.');
     if(!confirm('Replace the current editor map layouts with this project? Your gameplay saves are not affected.'))return;
     recordUndo();
     if(raw.maps.leaf.length>LIMIT||raw.maps.grove.length>LIMIT)throw new Error('Import exceeds '+LIMIT.toLocaleString()+' objects per region.');
     maps={leaf:raw.maps.leaf.map(sanitizeObject).filter(Boolean),grove:raw.maps.grove.map(sanitizeObject).filter(Boolean)};
     invalidateSpatial();
     customAssets=(Array.isArray(raw.customAssets)?raw.customAssets:[]).filter(x=>x&&typeof x.src==='string'&&x.src.startsWith('data:image/')&&x.src.length<3_000_000).slice(0,80);
     customNPCs=(Array.isArray(raw.customNPCs)?raw.customNPCs:[]).filter(validCustomNPC).slice(0,24);
     collisionMaps=sanitizeCollisionMaps(raw.collisionMaps);
     nativeNPCRoutes=window.SAActorRoutes?.sanitize(raw.nativeNPCRoutes)||{};window.SAActorRoutes?.setRoutes(nativeNPCRoutes);
     loadImportedAssets();loadImportedNPCs();selected=null;renderCatalog();syncProperties();saveNow(false);
     tell('World layout imported successfully.');
   }catch(err){tell('Import failed: '+err.message);}
 }
 function sanitizeObject(o){
   if(!o||typeof o.assetId!=='string'||!Number.isFinite(o.x)||!Number.isFinite(o.y))return null;
   return {uid:String(o.uid||makeUid()),assetId:o.assetId,x:clamp(o.x,0,Math.max(world.w,2896)),y:clamp(o.y,0,Math.max(world.h,2172)),
     w:clamp(Number(o.w)||80,8,400),h:clamp(Number(o.h)||80,8,400),rotation:Number(o.rotation)||0,
     flipX:!!o.flipX,flipY:!!o.flipY,collision:!!o.collision,animate:!!o.animate,
     layer:LAYER_ORDER.includes(o.layer)?o.layer:'decor',seed:Number(o.seed)||Math.random()*20,
     speed:clamp(Number(o.speed)||55,20,140),radius:clamp(Number(o.radius)||330,50,600),dialogue:String(o.dialogue||'').slice(0,180),npcRoute:Array.isArray(o.npcRoute)?o.npcRoute.filter(p=>Number.isFinite(p?.x)&&Number.isFinite(p?.y)).slice(0,64).map(p=>({x:clamp(p.x,0,2896),y:clamp(p.y,0,2172)})):[],npcRouteStyle:o.npcRouteStyle==='pingpong'?'pingpong':'loop'};
 }
 async function importArt(file){
   if(!file.type.startsWith('image/')||(!/png|webp/.test(file.type))){tell('Use a PNG or WebP image for custom artwork.');return;}
   if(file.size>1_200_000){tell('Custom art must be under 1.2 MB per image.');return;}
   if(customAssets.length>=80){tell('Custom art limit reached (80).');return;}
   const reader=new FileReader();
   reader.onload=()=>{
     const src=String(reader.result||'');
     const image=new Image();
     image.onload=()=>{
       const id='custom_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,6);
       const size=Math.max(image.naturalWidth,image.naturalHeight);
       const w=clamp(Math.round(image.naturalWidth/Math.max(size,1)*96),24,180);
       const h=clamp(Math.round(image.naturalHeight/Math.max(size,1)*96),24,180);
       recordUndo();
       const obj={id,name:file.name.replace(/\.(png|webp)$/i,'').slice(0,34),src,w,h};
       customAssets.push(obj);loadImportedAssets();category='Imported';chosen=id;renderCatalog();syncProperties();persistSoon();
       tell('Custom artwork added. It will travel inside exported map JSON.');
     };
     image.onerror=()=>tell('Could not read this artwork.');
     image.src=src;
   };
   reader.readAsDataURL(file);
 }
 function loadImportedAssets(){
   library=library.filter(a=>a.category!=='Imported');
   for(const a of customAssets){const meta=importedAssetMeta(a);library.push(meta);manifestMap.set(meta.id,meta);if(!images.has(meta.id))makeImage(meta);}
 }


 function validCustomNPC(a){
   return a && typeof a.id==='string' && a.id.startsWith('npc_custom_') &&
     typeof a.src==='string'&&a.src.startsWith('data:image/png;base64,') && a.src.length<250000 &&
     typeof a.atlas==='string'&&a.atlas.startsWith('data:image/png;base64,')&&a.atlas.length<850000 &&
     a.meta && a.meta.cellW===128 && a.meta.cellH===160 && Array.isArray(a.meta.frames) && a.meta.frames.length===4;
 }
 function loadImportedNPCs(){
   // Clear stale imported references after undo, redo or loading a saved layout.
   for(const [id,a] of manifestMap)if(a.importedNPC){manifestMap.delete(id);npcMeta.delete(id);npcSheets.delete(id);images.delete(id);}
   library=library.filter(a=>!a.importedNPC);
   for(const a of customNPCs){
     if(!validCustomNPC(a))continue;
     const meta={id:a.id,name:a.name,category:'NPCs',src:a.src,sheet:a.atlas,npc:true,
       importedNPC:true,w:70,h:88,collision:false,animate:true,layer:'foreground'};
     library.push(meta);manifestMap.set(meta.id,meta);makeImage(meta);
     const im=new Image();im.src=a.atlas;npcSheets.set(meta.id,im);npcMeta.set(meta.id,a.meta);
   }
 }
 function addImportedNPC(data){
   if(customNPCs.length>=24){tell('NPC import limit reached (24). Export your project first.');return;}
   const id='npc_custom_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8);
   const meta={id,name:String(data.name).slice(0,40),src:data.src,atlas:data.atlas,meta:data.meta};
   if(!validCustomNPC(meta)){tell('This NPC cannot be stored. Check the sprite sheet and retry.');return;}
   recordUndo();customNPCs.push(meta);loadImportedNPCs();category='NPCs';chosen=id;selected=null;
   renderCatalog();syncProperties();
   if(!saveNow(false))tell('Browser storage is full — use Export All Changes now to keep this NPC.');
   else tell(meta.name+' added. Place it onto a path to make it roam.');
 }
 function removeImportedNPC(){
   const picked=getSelected()?.assetId||chosen;
   const meta=getAsset(picked);
   if(!meta?.importedNPC){tell('Select an NPC you imported to remove it.');return;}
   if(!confirm('Remove this imported NPC and every instance placed in both worlds?'))return;
   recordUndo();customNPCs=customNPCs.filter(a=>a.id!==picked);
   for(const key of ['leaf','grove'])maps[key]=maps[key].filter(o=>o.assetId!==picked);
   selected=null;chosen=library.find(a=>a.npc&&!a.importedNPC)?.id||library[0]?.id||'';
   loadImportedNPCs();renderCatalog();syncProperties();persistSoon();
   tell('Imported NPC removed.');
 }
 // Custom collision boundaries are polylines with round endcaps; these are additive
 // to the existing game physics and Smart Collision silhouettes.
 function sanitizeCollisionMaps(raw){
   const result={leaf:[],grove:[]};
   for(const region of ['leaf','grove']){
     const walls=Array.isArray(raw?.[region])?raw[region]:[];
     const ids=new Set();
     for(const wall of walls.slice(0,WALL_LIMIT)){
       if(!wall||!Array.isArray(wall.points))continue;
       const points=wall.points.slice(0,POINT_LIMIT).filter(pt=>pt&&Number.isFinite(pt.x)&&Number.isFinite(pt.y))
         .map(pt=>({x:clamp(pt.x,0,world.w),y:clamp(pt.y,0,world.h)}));
       if(!points.length)continue;
       const id=String(wall.id||makeUid()).slice(0,100);
       if(ids.has(id))continue;ids.add(id);
       result[region].push({id,points,width:clamp(Number(wall.width)||14,4,80)});
     }
   }
   return result;
 }
 function segmentDistance(px,py,ax,ay,bx,by){
   const dx=bx-ax,dy=by-ay,len=dx*dx+dy*dy;
   if(len<.001)return Math.hypot(px-ax,py-ay);
   const t=clamp(((px-ax)*dx+(py-ay)*dy)/len,0,1);
   return Math.hypot(px-(ax+dx*t),py-(ay+dy*t));
 }
 function wallAtPoint(w,x,y,padding=0){
   const pts=w.points;if(!pts.length)return false;
   const reach=w.width/2+padding;
   if(pts.length===1)return Math.hypot(x-pts[0].x,y-pts[0].y)<=reach;
   for(let i=1;i<pts.length;i++)if(segmentDistance(x,y,pts[i-1].x,pts[i-1].y,pts[i].x,pts[i].y)<=reach)return true;
   return false;
 }
 function collisionPoint(x,y,region=regionKey(),radius=0){
   for(const wall of (collisionMaps[region]||[]))if(wallAtPoint(wall,x,y,radius))return true;
   return false;
 }
 function collisionSweep(x1,y1,x2,y2,region=regionKey(),radius=10){
   // A sweep stops fast movement from tunnelling through narrow lines.
   const distance=Math.hypot(x2-x1,y2-y1),steps=Math.max(1,Math.ceil(distance/3));
   for(let i=1;i<=steps;i++)if(collisionPoint(x1+(x2-x1)*i/steps,y1+(y2-y1)*i/steps,region,radius))return true;
   return false;
 }
 function nearbyWall(point){
   const walls=getWalls();
   for(let i=walls.length-1;i>=0;i--)if(wallAtPoint(walls[i],point.x,point.y,Math.max(12,8/cameraInfo().sc)))return walls[i];
   return null;
 }
 function makeWall(point){
   if(getWalls().length>=WALL_LIMIT){tell('Maximum collision boundaries reached.');return;}
   const wall={id:makeUid(),width:wallThickness,points:[snapPoint(point)]};
   getWalls().push(wall);chosenWall=wall.id;persistSoon();updateCounts();
 }
 function extendWall(point){
   const wall=getWalls().find(w=>w.id===chosenWall);
   if(!wall||wall.points.length>=POINT_LIMIT)return;
   const end=snapPoint(point),last=wall.points[wall.points.length-1];
   const length=Math.hypot(end.x-last.x,end.y-last.y);
   if(length<(snap?Math.max(4,cellSize*.45):3))return;
   const pieces=Math.min(75,Math.max(1,Math.ceil(length/Math.max(6,cellSize*.75))));
   for(let i=1;i<=pieces && wall.points.length<POINT_LIMIT;i++){
     const pt={x:last.x+(end.x-last.x)*i/pieces,y:last.y+(end.y-last.y)*i/pieces};
     const p=snap?snapPoint(pt):pt;
     if(Math.hypot(p.x-wall.points[wall.points.length-1].x,p.y-wall.points[wall.points.length-1].y)>=1)wall.points.push(p);
   }
   persistSoon();
 }
 function selectWall(point){
   const wall=nearbyWall(point);chosenWall=wall?.id||null;
   if(wall){
     drag.wallStart=wall.points.map(p=>({...p}));
     wallThickness=wall.width;
   }
   syncProperties();
 }
 function moveSelectedWall(point){
   const wall=getWalls().find(w=>w.id===chosenWall);
   if(!wall||!drag?.wallStart)return;
   const dx=point.x-drag.start.x,dy=point.y-drag.start.y;
   wall.points=drag.wallStart.map(p=>({x:clamp(p.x+dx,0,world.w),y:clamp(p.y+dy,0,world.h)}));
   persistSoon();
 }
 function eraseWall(point){
   const wall=nearbyWall(point);if(!wall)return;
   getWalls().splice(getWalls().indexOf(wall),1);
   if(chosenWall===wall.id)chosenWall=null;
   persistSoon();updateCounts();
 }
 function deleteWall(){
   const walls=getWalls(),i=walls.findIndex(w=>w.id===chosenWall);
   if(i<0){tell('Select a boundary first.');return;}
   recordUndo();walls.splice(i,1);chosenWall=null;persistSoon();syncProperties();
 }
 function renderWall(g,wall,project,scale,color){
   if(!wall.points.length)return;
   g.beginPath();const first=project(wall.points[0]);g.moveTo(first.x,first.y);
   for(const pt of wall.points.slice(1)){const p=project(pt);g.lineTo(p.x,p.y);}
   if(wall.points.length===1)g.lineTo(first.x+.01,first.y+.01);
   g.lineJoin='round';g.lineCap='round';
   g.strokeStyle='rgba(232,53,38,.26)';g.lineWidth=Math.max(3,wall.width*scale);g.stroke();
   g.strokeStyle=color;g.lineWidth=Math.max(1.5,Math.min(4,wall.width*.18*scale));g.stroke();
 }
 function renderCollisionGuides(g,project,scale){
   for(const w of getWalls())renderWall(g,w,project,scale,w.id===chosenWall?'#ffe98d':'#ff986a');
 }
 function installTestBar(){
   testBar=document.createElement('div');testBar.id='saCollisionTestBar';
   testBar.innerHTML='<strong>▶ LIVE COLLISION TEST</strong><span>Walk with your normal controls. The orange walls are solid.</span><button id="saWallReturn" type="button">↩ Back to Editor</button><button id="saWallFinish" type="button">✓ Finish Test</button>';
   document.body.append(testBar);
   byId('saWallReturn').addEventListener('click',endLiveTest);
   byId('saWallFinish').addEventListener('click',exitEditor);
 }
 function startLiveTest(){
   if(!active)return;
   saveNow(false);testing=true;active=false;
   ui.classList.remove('active');editorCanvas.style.display='none';
   window.SADayNight?.setPreview('auto');
   if(byId('saLightingPreview'))byId('saLightingPreview').value='auto';
   document.body.classList.remove('sa-editing');document.body.classList.add('sa-collision-testing');
   testBar.style.display='flex';keys.clear();updateOpenButton();
   tell('Live test started. Walk up to your boundaries to test their collision.');
 }
 function endLiveTest(){
   if(!testing)return;
   testing=false;active=true;
   document.body.classList.remove('sa-collision-testing');document.body.classList.add('sa-editing');
   testBar.style.display='none';ui.classList.add('active');editorCanvas.style.display='block';
   keys.clear();setMode('wall-draw');repaintPreview();
 }

 function buildUI(){
   openBtn=document.createElement('button');openBtn.id='saEditorOpen';openBtn.type='button';openBtn.textContent='✎ WORLD EDITOR';
   openBtn.addEventListener('click',()=>{if(active)exitEditor();else enterEditor();});
   document.body.append(openBtn);
   editorCanvas=document.createElement('canvas');editorCanvas.id='saEditorCanvas';editorCanvas.setAttribute('aria-hidden','true');document.body.append(editorCanvas);
   toastBox=document.createElement('div');toastBox.id='saEditorToast';toastBox.setAttribute('role','status');document.body.append(toastBox);
   togglePaletteBtn=document.createElement('button');togglePaletteBtn.id='saEditorCompact';togglePaletteBtn.textContent='🗂 Show Asset Palette';
   togglePaletteBtn.addEventListener('click',()=>togglePalette(true));document.body.append(togglePaletteBtn);
   ui=document.createElement('aside');ui.id='saEditor';ui.setAttribute('aria-label','Strain Adventures world editor');
   ui.innerHTML=`
    <div class="saHeader"><div><b>🌿 WORLD STUDIO</b><small>Strain Adventures · V242 · Lake Village + NPC Route Editor</small></div>
      <div class="saRow"><button id="saHidePalette" type="button">Hide</button><button id="saEditorExit" type="button">✕ Exit</button></div></div>
    <div class="saContent">
      <div class="saField"><span>Lighting preview</span><select id="saLightingPreview"><option value="auto">Automatic cycle</option><option value="day">Day</option><option value="sunset">Sunset</option><option value="night">Night (lamp glow)</option><option value="dawn">Sunrise</option></select></div>
      <div class="saInfo">Nine approved lamps appear in Streetlights. Place, move, erase, or resize them individually; they automatically light at night. Day/night repeats every 12 real minutes.</div>
      <div class="saField"><span>Region</span><select id="saRegion"><option value="leaf">Leaf Town</option><option value="grove">Eastern Grove</option></select></div>
      <div class="saField"><span>🔎 Map Zoom</span><input id="saZoom" type="range" min="10" max="200" step="5" value="100" aria-label="World editor map zoom"><b id="saZoomLabel" class="saSmall">100%</b></div>
      <div class="saRow"><button id="saZoomOut" type="button">－ Zoom out</button><button id="saZoomIn" type="button">＋ Zoom in</button><button id="saZoomFit" type="button" class="saAccent">Fit entire map</button></div>
      <div class="saInfo">Zoom out to paint large lakes and terrain. Pan to move around; zoom affects the editor view only, not gameplay. Drag a ground texture to cover large areas.</div>
      <div class="saRow" id="saToolRow">
        <button data-sa-tool="paint" type="button">🖌 Paint</button>
        <button data-sa-tool="select" type="button">◈ Select</button>
        <button data-sa-tool="erase" type="button">⌫ Erase</button>
        <button data-sa-tool="pan" type="button">✋ Pan</button>
        <button data-sa-tool="npc-route" type="button">🧭 NPC Route</button>
      </div>
      <div class="saField"><span>Position</span><span class="saSmall" id="saCoordinates">Tap on the world</span></div>
      <h3>Environment Art & NPC Library</h3>
      <div id="saCategoryRow" class="saCatRow"></div>
      <input id="saAssetSearch" type="search" placeholder="Search assets…" autocomplete="off" aria-label="Search environment assets">
      <div class="saGrid" id="saAssetGrid"></div>
      <div class="saInfo" id="saAssetCount"></div>
      <div class="saRow"><button type="button" id="saImportArt">＋ Import Custom PNG / WebP</button></div>
      <div class="saRow"><button type="button" id="saImportNPC" class="saAccent">🎞 Import Animated NPC (4×4)</button><button type="button" id="saRemoveNPC">Remove Imported NPC</button></div>
      <h3>Brush & Object Properties</h3>
      <div class="saField"><span>Size</span><input type="range" min="40" max="300" step="5" value="100" id="saScale"><span id="saScaleLabel">100%</span></div>
      <div class="saRow"><button id="saRotateLeft" type="button">↺ Rotate 90°</button><button id="saRotateRight" type="button">↻ Rotate 90°</button><button id="saFlip" type="button">⇄ Mirror</button></div>
      <div class="saField"><span>Layer</span><select id="saLayer"><option value="ground">Ground / Paths</option><option value="decor">Objects / Plants</option><option value="foreground">Foreground</option></select></div>
      <div class="saField"><span>Grid snap</span><input id="saSnap" type="checkbox" checked><select id="saGridSize"><option value="8">8 px</option><option value="16" selected>16 px</option><option value="24">24 px</option><option value="32">32 px</option><option value="48">48 px</option><option value="96">96 px</option></select></div>
      <div class="saRow"><label class="saField" style="flex:1"><input id="saCollision" type="checkbox"> Collision</label><label class="saField" style="flex:1"><input id="saAnimate" type="checkbox"> <span id="saAnimateLabel">Sway / Glow</span></label></div>
      <h3>🧭 Existing Game Characters — Roaming Routes</h3>
      <div class="saInfo">All original NPCs are listed, including Leaf Town patrols and indoor quest characters. Their existing movement and story scripts are untouched unless you give them a route. For outdoor NPCs, select Draw on Map and tap waypoints; for interior NPCs enter room coordinates (0–900 x 0–680) below. Routes follow four directions only.</div>
      <div class="saField"><span>Original NPC</span><select id="saNativeNPCSelect" aria-label="Existing game NPC"></select></div>
      <div class="saField"><span>Route style</span><select id="saNativeRouteStyle"><option value="loop">Loop</option><option value="pingpong">Back and forth</option></select></div>
      <div class="saField"><span>Speed</span><input id="saNativeRouteSpeed" type="range" min="20" max="140" step="5" value="60"><span id="saNativeSpeedLabel">60</span></div>
      <div class="saRow"><button type="button" id="saNativeStart" class="saAccent">＋ Draw on Map</button><button type="button" id="saNativeUndo">↶ Last</button><button type="button" id="saNativeClear">Clear route</button></div>
      <div class="saField"><span>Waypoint coordinates</span><input id="saNativeX" type="number" min="0" max="2896" value="450" style="min-width:0;width:70px"><input id="saNativeY" type="number" min="0" max="2172" value="330" style="min-width:0;width:70px"><button type="button" id="saNativeAdd">＋ Add</button></div>
      <div class="saPreview" id="saNativeStatus">Existing AI retained until a custom route is assigned.</div>
      <h3>🧭 NPC Roaming Routes</h3>
      <div class="saInfo">Choose any placed NPC in this region (including imported characters), or tap an NPC on the map. Start Route enables waypoint placement in World Studio.</div>
      <div class="saField"><span>Choose NPC</span><select id="saNPCQuickSelect"><option value="">Select character...</option></select></div>
      <div class="saNPCCustomProperties" id="saNPCCustomProperties" hidden>
        <div class="saField"><span>Walking speed</span><input type="range" id="saNPCSpeed" min="20" max="140" step="5" value="55"><span id="saNPCSpeedLabel">55</span></div>
        <div class="saField"><span>Roam radius</span><input type="range" id="saNPCRadius" min="50" max="600" step="10" value="330"><span id="saNPCRadiusLabel">330</span></div>
        <h3>🧭 NPC Roaming Waypoints</h3>
        <div class="saInfo">Select any placed NPC, tap Start Route, then tap safe map positions in walking order. All newly imported and existing World Studio NPCs use the same route feature. Draw around lakes, obstacles and doors.</div>
        <div class="saField"><span>NPC</span><select id="saNPCPicker"><option value="">Select NPC on map</option></select></div>
        <div class="saField"><span>Route style</span><select id="saNPCRouteStyle"><option value="loop">Loop forever</option><option value="pingpong">Back and forth</option></select></div>
        <div class="saRow"><button id="saRouteStart" class="saAccent" type="button">＋ Draw route</button><button id="saRouteUndo" type="button">↶ Last point</button><button id="saRouteClear" class="saWarning" type="button">Clear route</button></div>
        <div id="saNPCRouteCount" class="saPreview">No custom route — normal roaming active.</div>
        <label class="saField"><input id="saShowRoutes" type="checkbox" checked> Show route lines in World Studio</label>
        <label class="saField">Dialogue <input id="saNPCDialogue" type="text" maxlength="180" placeholder="Optional conversation (A to talk)"></label>
      </div>
      <div class="saPreview" id="saSelectionInfo">Select an object to move, resize, mirror or remove it.</div>
      <div class="saRow"><button id="saUndo" type="button">↶ Undo</button><button id="saRedo" type="button">↷ Redo</button><button id="saDuplicate" type="button">⧉ Duplicate</button><button id="saDelete" type="button" class="saWarning">⌫ Delete</button></div>
      <h3>✏️ Collision Boundary Studio</h3>
      <div class="saInfo">Draw invisible barriers, reposition or erase them, then walk against them in Live Test. Existing Smart Collision and all indoor walls remain unchanged.</div>
      <div class="saRow saWallTools">
        <button data-sa-tool="wall-draw" type="button">✏️ Draw</button>
        <button data-sa-tool="wall-select" type="button">◈ Move</button>
        <button data-sa-tool="wall-erase" type="button">⌫ Erase</button>
      </div>
      <div class="saField"><span>Thickness</span><input id="saWallWidth" type="range" min="4" max="80" step="2" value="14"><span id="saWallWidthLabel">14px</span></div>
      <div class="saField"><span>Show lines</span><input id="saShowWalls" type="checkbox" checked><span class="saSmall">Editor / live test only</span></div>
      <div class="saPreview" id="saWallInfo">Draw lines on the world. Select one to move or delete it.</div>
      <div class="saRow"><button id="saWallDelete" type="button">Delete Selected Line</button><button id="saWallClear" type="button" class="saWarning">Clear Boundaries</button></div>
      <div class="saRow"><button id="saWallTest" type="button" class="saAccent">▶ Live Test Collisions</button></div>
      <h3>Save & Export Changes</h3>
      <div class="saInfo">Your edits automatically save in this browser. Use <b>Export All Changes</b> to download ONE small changes-only JSON file containing new placements, changes, removals, imported artwork, and NPC animations. Upload this file together with your latest game ZIP to ChatGPT to apply only the editor changes. No game saves, house interiors, quests, or other gameplay files are exported or replaced.</div>
      <div class="saRow"><button id="saExportAllChanges" type="button" class="saAccent" style="width:100%">📦 Export All Changes</button></div>
      <div class="saRow"><button id="saClearMap" type="button" class="saWarning">Clear This Region</button></div>
      <input class="saFile" id="saFileArt" type="file" accept="image/png,image/webp,.png,.webp">
    </div>
    <div class="saFooter"><strong id="saPlacementCount">0 objects</strong><span>Changes auto-save locally</span></div>`;
   document.body.append(ui);
   installTestBar();
   byId('saEditorExit').addEventListener('click',exitEditor);
   byId('saHidePalette').addEventListener('click',()=>togglePalette(false));
   byId('saRegion').addEventListener('change',e=>switchRegion(e.target.value));
   byId('saZoom').addEventListener('input',e=>updateZoom(Number(e.target.value)/100));
   byId('saZoomIn').addEventListener('click',()=>updateZoom(editorZoom*1.23));
   byId('saZoomOut').addEventListener('click',()=>updateZoom(editorZoom/1.23));
   byId('saZoomFit').addEventListener('click',zoomToFit);
   byId('saLightingPreview').addEventListener('change',e=>window.SADayNight?.setPreview(e.target.value));
   for(const b of ui.querySelectorAll('[data-sa-tool]'))b.addEventListener('click',()=>setMode(b.dataset.saTool));
   byId('saAssetSearch').addEventListener('input',renderCatalog);
   byId('saScale').addEventListener('input',e=>{
     const amount=Number(e.target.value)/100,s=getSelected();
     if(s){const def=getAsset(s.assetId);if(def){s.w=def.w*amount;s.h=def.h*amount;persistSoon();}} else brushScale=amount;
     byId('saScaleLabel').textContent=e.target.value+'%';
   });
   byId('saRotateLeft').addEventListener('click',()=>rotateBy(-Math.PI/2));
   byId('saRotateRight').addEventListener('click',()=>rotateBy(Math.PI/2));
   byId('saFlip').addEventListener('click',()=>{const s=getSelected();if(s){recordUndo();s.flipX=!s.flipX;persistSoon();}else flipX=!flipX;});
   byId('saCollision').addEventListener('change',e=>{const s=getSelected();if(s){recordUndo();s.collision=e.target.checked;persistSoon();}else collisionOverride=e.target.checked;});
   byId('saAnimate').addEventListener('change',e=>{const s=getSelected();if(s){recordUndo();s.animate=e.target.checked;persistSoon();}else animatedOverride=e.target.checked;});
   byId('saNPCSpeed').addEventListener('change',e=>{const s=getSelected();if(s&&isNPC(s)){recordUndo();s.speed=Number(e.target.value);persistSoon();syncProperties();}});
   byId('saNPCRadius').addEventListener('change',e=>{const s=getSelected();if(s&&isNPC(s)){recordUndo();s.radius=Number(e.target.value);npcStates.delete(s.uid);persistSoon();syncProperties();}});
   byId('saNPCDialogue').addEventListener('change',e=>{const s=getSelected();if(s&&isNPC(s)){recordUndo();s.dialogue=String(e.target.value).slice(0,180);persistSoon();}});
   byId('saNPCPicker').addEventListener('change',e=>{selected=e.target.value||null;setMode('select');syncProperties();});
   byId('saNPCQuickSelect').addEventListener('change',e=>{selected=e.target.value||null;setMode('select');syncProperties();});
   byId('saNPCRouteStyle').addEventListener('change',e=>{const o=getSelected();if(o&&isNPC(o)){recordUndo();o.npcRouteStyle=e.target.value==='pingpong'?'pingpong':'loop';npcStates.delete(o.uid);persistSoon();syncProperties();}});
   byId('saRouteStart').addEventListener('click',()=>{const o=getSelected();if(!o||!isNPC(o))return;recordUndo();if(!Array.isArray(o.npcRoute)||!o.npcRoute.length)o.npcRoute=[{x:o.x,y:o.y}];setMode('npc-route');syncProperties();persistSoon();tell('Tap up to 64 safe waypoints. NPC walks in the numbered order.');});
   byId('saRouteUndo').addEventListener('click',()=>{const o=getSelected();if(!o?.npcRoute?.length)return;recordUndo();o.npcRoute.pop();npcStates.delete(o.uid);persistSoon();syncProperties();});
   byId('saRouteClear').addEventListener('click',()=>{const o=getSelected();if(!o||!isNPC(o))return;recordUndo();o.npcRoute=[];npcStates.delete(o.uid);persistSoon();syncProperties();tell('Custom route cleared. NPC is back to normal roaming.');});


   byId('saLayer').addEventListener('change',e=>{const s=getSelected();if(s){recordUndo();s.layer=e.target.value;persistSoon();}else layerOverride=e.target.value;});
   byId('saSnap').addEventListener('change',e=>{snap=e.target.checked;});
   byId('saGridSize').addEventListener('change',e=>{cellSize=Number(e.target.value)||16;});
   byId('saWallWidth').addEventListener('input',e=>{
     const value=clamp(Number(e.target.value)||14,4,80);
     const w=getWalls().find(w=>w.id===chosenWall);
     if(w){w.width=value;persistSoon();}
     wallThickness=value;byId('saWallWidthLabel').textContent=value+'px';
   });
   byId('saWallWidth').addEventListener('pointerdown',()=>{if(chosenWall)recordUndo();});
   byId('saShowWalls').addEventListener('change',e=>{showWalls=e.target.checked;});
   byId('saWallDelete').addEventListener('click',deleteWall);
   byId('saWallClear').addEventListener('click',()=>{if(confirm('Delete every manual collision boundary in this region? You can undo.')){recordUndo();getWalls().length=0;chosenWall=null;syncProperties();persistSoon();}});
   byId('saWallTest').addEventListener('click',startLiveTest);
   byId('saUndo').addEventListener('click',doUndo);byId('saRedo').addEventListener('click',doRedo);
   byId('saDuplicate').addEventListener('click',duplicateSelected);
   byId('saDelete').addEventListener('click',deleteSelected);
   byId('saExportAllChanges').addEventListener('click',exportAllChanges);
   byId('saImportArt').addEventListener('click',()=>byId('saFileArt').click());
   byId('saImportNPC').addEventListener('click',()=>window.SANPCImporter?.open(addImportedNPC));
   byId('saRemoveNPC').addEventListener('click',removeImportedNPC);
   byId('saFileArt').addEventListener('change',async e=>{if(e.target.files[0])await importArt(e.target.files[0]);e.target.value='';});
   byId('saClearMap').addEventListener('click',()=>{if(confirm('Clear all placed objects in this region? You can undo immediately afterward.')){recordUndo();maps[currentDistrict]=[];selected=null;syncProperties();persistSoon();}});
   renderCatalog();setMode('paint');
 }
 function rotateBy(amount){const s=getSelected();if(s){recordUndo();s.rotation=(s.rotation+amount)%(Math.PI*2);persistSoon();}else rotation=(rotation+amount)%(Math.PI*2);}
 function duplicateSelected(){const s=getSelected();if(!s)return;if(getMap().length>=LIMIT){tell('Too many objects in this region.');return;}recordUndo();const copy=clone(s);copy.uid=makeUid();copy.x=clamp(copy.x+32,0,world.w);copy.y=clamp(copy.y+32,0,world.h);getMap().push(copy);selected=copy.uid;syncProperties();persistSoon();tell('Object duplicated.');}
 function deleteSelected(){const s=getSelected();if(!s)return;recordUndo();const arr=getMap();arr.splice(arr.indexOf(s),1);selected=null;syncProperties();persistSoon();}

 function enterEditor(){
   if(!ready){tell('World Studio assets are still loading. Try again.');return;}
   if(!running){tell('Start the game first to edit the world.');return;}
   if(interior||battle||dialogOpen||shopOpen||missionOpen||typeof creatureMode!=='undefined'&&creatureMode==='battle'){
     tell('Exit your current room, battle or menu before opening World Studio.');return;
   }
   originalPlayer={x:player.x,y:player.y,dir:player.dir,step:player.step};
   originalMap=currentDistrict;
   active=true;paletteOpen=true;
   selected=null;chosenWall=null;drag=null;lastStamp=null;
   keys.clear();
   document.body.classList.add('sa-editing');
   ui.classList.add('active');
   byId('saRegion').value=currentDistrict;
   updateZoom(1);
   editorCanvas.style.display='block';
   openBtn.style.display='none';
   renderCatalog();setMode('paint');
   toastBox.style.display='none';
   tell('World Studio active. Choose a piece, then paint on the map.');
 }
 function exitEditor(){
   if(testing){endLiveTest();}
   if(!active)return;
   saveNow(false);
   active=false;selected=null;chosenWall=null;drag=null;pointerId=null;hover=null;
   testing=false;if(testBar)testBar.style.display='none';document.body.classList.remove('sa-collision-testing');
   ui.classList.remove('active');editorCanvas.style.display='none';
   document.body.classList.remove('sa-editing');
   if(originalPlayer){currentDistrict=originalMap;Object.assign(player,originalPlayer);originalPlayer=null;}
   keys.clear();
   updateOpenButton();
   tell('Back in the game. Editor overlays remain saved.');
 }
 function togglePalette(show){paletteOpen=show;ui.classList.toggle('active',show);}
 function switchRegion(region){
   if(region!=='leaf'&&region!=='grove')return;
   currentDistrict=region;
   interior=null;selected=null;hover=null;
   player.x=region==='leaf'?760:1150;
   player.y=region==='leaf'?840:1040;
   updateZoom(1);syncProperties();tell(region==='leaf'?'Editing Leaf Town.':'Editing Eastern Grove.');
 }
 function updateOpenButton(){
   if(!openBtn)return;
   const okay=running&&!active&&!testing&&!interior&&!battle&&!dialogOpen&&!shopOpen&&!missionOpen&&!document.hidden;
   openBtn.style.display=okay?'block':'none';
 }
 function cameraInfo(){
   const base=Math.max(.53,Math.min(1.08,W/950));
   const sc=base*(active?editorZoom:1);
   const spanX=W/sc,spanY=H/sc;
   return {sc,
     x:spanX>=world.w?(world.w-spanX)/2:Math.max(0,Math.min(world.w-spanX,player.x-spanX/2)),
     y:spanY>=world.h?(world.h-spanY)/2:Math.max(0,Math.min(world.h-spanY,player.y-spanY/2))};
 }
 // The underlying game renderer, overlay coordinates and asset culling share EXACTLY this camera.
 window.SAEditorViewport=()=>active?cameraInfo():null;
 function updateZoom(v){
   editorZoom=clamp(Number(v)||1,.10,2);
   const label=byId('saZoomLabel'),slider=byId('saZoom');
   if(label)label.textContent=Math.round(editorZoom*100)+'%';
   if(slider)slider.value=Math.round(editorZoom*100);
   if(active)repaintPreview();
 }
 function zoomToFit(){
   const base=Math.max(.53,Math.min(1.08,W/950));
   updateZoom(Math.min((W*.94)/(world.w*base),(H*.94)/(world.h*base),2));
   player.x=world.w/2;player.y=world.h/2;
 }
 function atWorld(e){
   const r=canvas.getBoundingClientRect(),pos=cameraInfo();
   return {x:clamp((e.clientX-r.left)*(W/r.width)/pos.sc+pos.x,0,world.w),
     y:clamp((e.clientY-r.top)*(H/r.height)/pos.sc+pos.y,0,world.h)};
 }
 function snapPoint(point){return !snap?point:{x:Math.round(point.x/cellSize)*cellSize,y:Math.round(point.y/cellSize)*cellSize};}
 function newInstance(assetId,point){
   const a=getAsset(assetId);if(!a)return null;
   const p=snapPoint(point);
   const spawn=a.npc ? (nearestPathPoint(p.x,p.y,currentDistrict==='grove'?'grove':'leaf',224)||p) : p;
   return {uid:makeUid(),assetId,x:spawn.x,y:spawn.y,w:a.w*brushScale,h:a.h*brushScale,
     rotation:a.npc?0:rotation,flipX:a.npc?false:flipX,flipY:a.npc?false:flipY,
     collision:a.npc?false:(collisionOverride===null?!!a.collision:collisionOverride),
     animate:a.npc?true:(animatedOverride===null?!!a.animate:animatedOverride),
     layer:a.npc?'foreground':(layerOverride||a.layer||'decor'),seed:Math.random()*40,
     speed:55,radius:330,dialogue:'',npcRoute:[],npcRouteStyle:'loop'};
 }
 function place(point){
   const a=getAsset(chosen);if(!a)return;
   if(getMap().length>=LIMIT){tell('Region object limit reached.');return;}
   const p=snapPoint(point),distance=lastStamp?Math.hypot(lastStamp.x-p.x,lastStamp.y-p.y):Infinity;
   const minDistance=mode==='paint'?Math.max(12,Math.min(a.w,a.h)*brushScale*.56):16;
   if(distance<minDistance)return;
   getMap().push(newInstance(chosen,p));lastStamp=p;persistSoon();updateCounts();
 }
 function findAt(point){
   const arr=getMap();
   for(let i=arr.length-1;i>=0;i--){
     const o=arr[i];
     if(isNPC(o)){
       if(Math.abs(point.x-o.x)<=o.w*.58&&point.y>=o.y-o.h*.98&&point.y<=o.y+8)return o;
     }else if(Math.abs(point.x-o.x)<=o.w*.56&&Math.abs(point.y-o.y)<=o.h*.56)return o;
   }
   return null;
 }
 function eraseAt(point){
   const s=findAt(point);if(!s)return;
   const arr=getMap();arr.splice(arr.indexOf(s),1);selected=null;persistSoon();updateCounts();
 }
 function onPointerDown(e){
   if(!active||e.target!==canvas)return;
   e.preventDefault();e.stopImmediatePropagation();
   if(pointerId!==null)return;
   pointerId=e.pointerId;
   try{canvas.setPointerCapture(e.pointerId);}catch(_){}
   const p=atWorld(e);hover=p;lastStamp=null;
   drag={start:p,last:p,startClient:{x:e.clientX,y:e.clientY},original:{x:player.x,y:player.y}};
   if(mode==='wall-draw'){recordUndo();makeWall(p);}
   if(mode==='wall-erase'){recordUndo();eraseWall(p);}
   if(mode==='wall-select'){const w=nearbyWall(p);if(w)recordUndo();selectWall(p);}
   if(mode==='native-route'){
     const item=window.SAActorRoutes?.list().find(a=>a.id===nativeRouteSelected);
     if(!item){tell('Choose an original NPC first.');}
     else if(item.region!==regionKey()||item.room){tell('For indoor NPCs, enter room coordinates in the route panel. For outdoor NPCs, select the matching region.');}
     else if((nativeNPCRoutes[item.id]?.points?.length||0)>=64)tell('Maximum 64 route points.');
     else if((currentDistrict==='grove'&&groveBlocked(p.x,p.y))||worldCollisionAt(p.x,p.y))tell('Waypoint is blocked by water or a solid object.');
     else{recordUndo();const rec=nativeNPCRoutes[item.id]||(nativeNPCRoutes[item.id]={points:[],style:'loop',speed:60});rec.points.push({x:Math.round(p.x),y:Math.round(p.y)});window.SAActorRoutes?.setRoutes(nativeNPCRoutes);persistSoon();syncNativeUI();}
   }
   if(mode==='npc-route'){
     const target=findAt(p);
     if(target&&isNPC(target)&&target.uid!==selected){selected=target.uid;syncProperties();tell('Selected NPC. Tap Draw route to create waypoints.');}
     else {
       const o=getSelected();
       if(!o||!isNPC(o)){tell('First select a placed NPC.');}
       else if((o.npcRoute?.length||0)>=64)tell('Maximum 64 route waypoints.');
       else if((currentDistrict==='grove'&&groveBlocked(p.x,p.y))||worldCollisionAt(p.x,p.y))tell('That waypoint is inside water or an obstacle. Choose open ground.');
       else {recordUndo();if(!o.npcRoute?.length)o.npcRoute=[{x:o.x,y:o.y}];o.npcRoute.push({x:Math.round(p.x),y:Math.round(p.y)});npcStates.delete(o.uid);persistSoon();syncProperties();}
     }
   }
   if(mode==='paint'){recordUndo();place(p);}
   if(mode==='erase'){recordUndo();eraseAt(p);}
   if(mode==='select'){
     const s=findAt(p);selected=s?s.uid:null;
     if(s)drag.selectedStart={x:s.x,y:s.y};
     if(s)recordUndo();
     syncProperties();
   }
   byId('saCoordinates').textContent=`x ${Math.round(p.x)} · y ${Math.round(p.y)}`;
 }
 function onPointerMove(e){
   if(!active||e.target!==canvas&&pointerId!==e.pointerId)return;
   e.preventDefault();e.stopImmediatePropagation();
   const p=atWorld(e);hover=p;
   byId('saCoordinates').textContent=`x ${Math.round(p.x)} · y ${Math.round(p.y)}`;
   if(pointerId!==e.pointerId||!drag)return;
   if(mode==='wall-draw')extendWall(p);
   if(mode==='wall-erase')eraseWall(p);
   if(mode==='wall-select')moveSelectedWall(p);
   if(mode==='paint'&&!getAsset(chosen)?.npc)place(p);
   if(mode==='erase')eraseAt(p);
   if(mode==='select'&&drag.selectedStart){
     const s=getSelected();if(s){
       const dx=p.x-drag.start.x,dy=p.y-drag.start.y;
       const target=snapPoint({x:drag.selectedStart.x+dx,y:drag.selectedStart.y+dy});
       s.x=clamp(target.x,0,world.w);s.y=clamp(target.y,0,world.h);
       persistSoon();
     }
   }
   if(mode==='pan'){
     const c=cameraInfo();
     player.x=clamp(drag.original.x+(drag.startClient.x-e.clientX)/c.sc,50,world.w-50);
     player.y=clamp(drag.original.y+(drag.startClient.y-e.clientY)/c.sc,50,world.h-50);
   }
   drag.last=p;
 }
 function onPointerUp(e){
   if(!active||pointerId!==e.pointerId)return;
   e.preventDefault();e.stopImmediatePropagation();
   try{canvas.releasePointerCapture(pointerId);}catch(_){}
   pointerId=null;drag=null;lastStamp=null;syncProperties();
 }
 function onKey(e){
   if(!active)return;
   const target=e.target;
   const textInput=target&&(['INPUT','TEXTAREA','SELECT'].includes(target.tagName)||target.isContentEditable);
   if(textInput)return;
   if(e.key==='Escape') {e.preventDefault();e.stopImmediatePropagation();exitEditor();return;}
   const mod=e.ctrlKey||e.metaKey;
   if(mod&&e.key.toLowerCase()==='z'){e.preventDefault();e.stopImmediatePropagation();e.shiftKey?doRedo():doUndo();return;}
   if(mod&&e.key.toLowerCase()==='y'){e.preventDefault();e.stopImmediatePropagation();doRedo();return;}
   if(mod&&e.key.toLowerCase()==='s'){e.preventDefault();e.stopImmediatePropagation();saveNow(true);return;}
   if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();e.stopImmediatePropagation();mode==='wall-select'?deleteWall():deleteSelected();return;}
   if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','w','a','s','d',' '].includes(e.key)){
     e.preventDefault();e.stopImmediatePropagation();
   }
 }

 // World Studio NPC walkers: placement anchors are persistent, movement is runtime-only.
 const npcSheets=new Map();
 const npcMeta=new Map();
 const npcStates=new Map();
 const NAV_STEP=32;
 let npcLastTick=0;
 const npcDirections=['down','left','right','up'];
 const leafPaving=[
  [710,0,112,1780],[0,562,2580,118],[388,489,64,85],[1058,489,64,85],
  [1024,620,118,420],[1450,560,930,118],[1830,560,120,760],[1810,1190,690,118]
 ];
 const grovePaving=[[225,800,2110,140],[1020,350,145,1260],[1740,770,145,840]];
 function isNPC(o){return !!(o&&getAsset(o.assetId)?.npc);}
 function isOnRect(x,y,r){return x>=r[0]&&x<=r[0]+r[2]&&y>=r[1]&&y<=r[1]+r[3];}
 function nearLine(px,py,ax,ay,bx,by,radius){
   const dx=bx-ax,dy=by-ay;
   const t=clamp(((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy||1),0,1);
   return Math.hypot(px-(ax+t*dx),py-(ay+t*dy))<=radius;
 }
 function walkingPathAt(x,y,region){
   if(x<32||y<32||x>world.w-32||y>world.h-32) return false;
   // Use the actual V204 roads; this keeps NPC routing in sync with its map
   // without altering the game's own movement/path/collision functions.
   if(region==='grove'){
     if(typeof groveOnPath==='function' && groveOnPath(x,y,0)) return true;
     if(typeof groveOnHouseSpur==='function' && groveOnHouseSpur(x,y,0)) return true;
   }else{
     if((x>710&&x<822) || (y>562&&y<680) ||
        (x>388&&x<452&&y>489&&y<574) ||
        (x>1058&&x<1122&&y>489&&y<574) ||
        (x>1024&&x<1142&&y>620&&y<1040) ||
        (x>1450&&x<2380&&y>560&&y<678) ||
        (x>1830&&x<1950&&y>560&&y<1320) ||
        (x>1810&&x<2500&&y>1190&&y<1308))return true;
   }
   if(region==='grove' && typeof groveHouseRoutes!=='undefined'){
     for(const route of groveHouseRoutes)for(const s of route){
       if(nearLine(x,y,s.x1,s.y1,s.x2,s.y2,26))return true;
     }
   }
   const arr=maps[region]||[];
   for(const o of arr){
     const meta=getAsset(o.assetId);
     if(!meta||meta.category!=='Paths')continue;
     // A placed terrain-path piece is traversable without acquiring collision.
     const ang=-(o.rotation||0),dx=x-o.x,dy=y-o.y;
     const localX=dx*Math.cos(ang)-dy*Math.sin(ang);
     const localY=dx*Math.sin(ang)+dy*Math.cos(ang);
     if(Math.abs(localX)<o.w*.47&&Math.abs(localY)<o.h*.47)return true;
   }
   return false;
 }
 function nearestPathPoint(x,y,region,maxDist=200){
   // Use a stable grid so walkers can make valid cardinal turns across intersections.
   const tx=Math.round(x/NAV_STEP),ty=Math.round(y/NAV_STEP);
   const steps=Math.ceil(maxDist/NAV_STEP);
   let best=null,bestD=Infinity;
   for(let dy=-steps;dy<=steps;dy++)for(let dx=-steps;dx<=steps;dx++){
     if(dx*dx+dy*dy>steps*steps)continue;
     const px=(tx+dx)*NAV_STEP, py=(ty+dy)*NAV_STEP;
     const dd=(px-x)**2+(py-y)**2;
     if(dd>=bestD||!walkingPathAt(px,py,region))continue;
     best={x:px,y:py};bestD=dd;
   }
   return best;
 }
 function newNPCState(o,region){
   const pos=(Array.isArray(o.npcRoute)&&o.npcRoute.length>1?o.npcRoute[0]:nearestPathPoint(o.x,o.y,region,260))||{x:o.x,y:o.y};
   const s={region,anchorX:o.x,anchorY:o.y,x:pos.x,y:pos.y,
     startX:pos.x,startY:pos.y,targetX:pos.x,targetY:pos.y,
     direction:'down',moving:false,clock:0,wait:0.3+(Math.abs(o.seed||0)%1),
     prevDx:0,prevDy:0,routeIndex:1,routeDirection:1,speed:clamp(Number(o.speed)||55,20,140),radius:clamp(Number(o.radius)||330,50,600)};
   npcStates.set(o.uid,s);return s;
 }
 function getNPCState(o,region){
   let s=npcStates.get(o.uid);
   if(!s||s.region!==region||s.anchorX!==o.x||s.anchorY!==o.y)s=newNPCState(o,region);
   s.speed=clamp(Number(o.speed)||55,20,140);s.radius=clamp(Number(o.radius)||330,50,600);
   return s;
 }
 function chooseNPCStep(s,region){
   const step=NAV_STEP;
   const dirs=[{dx:0,dy:1,dir:'down'},{dx:0,dy:-1,dir:'up'},
     {dx:-1,dy:0,dir:'left'},{dx:1,dy:0,dir:'right'}];
   const choices=[];
   for(const d of dirs){
     const nx=s.x+d.dx*step,ny=s.y+d.dy*step;
     if(!walkingPathAt(nx,ny,region))continue;
     let weight=1;
     const distance=Math.hypot(nx-s.startX,ny-s.startY);
     if(distance>s.radius*.84)weight*=.06;
     if(distance>s.radius)continue;
     // Solid placed world objects should never be crossed by roaming NPCs.
     if(worldCollisionAt(nx,ny,region))continue;
     if(s.prevDx===d.dx&&s.prevDy===d.dy)weight*=4;
     if(s.prevDx===-d.dx&&s.prevDy===-d.dy)weight*=.20;
     if(distance>s.radius*.65 && Math.hypot(nx-s.startX,ny-s.startY)<Math.hypot(s.x-s.startX,s.y-s.startY))weight*=6;
     choices.push({...d,nx,ny,weight});
   }
   if(!choices.length){s.wait=.8;s.moving=false;return;}
   let total=choices.reduce((n,c)=>n+c.weight,0),random=Math.random()*total;
   let pick=choices[choices.length-1];
   for(const c of choices){random-=c.weight;if(random<=0){pick=c;break;}}
   s.targetX=pick.nx;s.targetY=pick.ny;s.direction=pick.dir;
   s.prevDx=pick.dx;s.prevDy=pick.dy;s.moving=true;
 }
 function updateNPCs(region,dt){
   if(active||interior||!running)return;
   const arr=maps[region]||[];
   for(const o of arr){
     if(!isNPC(o))continue;
     const s=getNPCState(o,region);
     if(!o.animate){s.moving=false;continue;}
     if(s.wait>0){s.wait=Math.max(0,s.wait-dt);s.moving=false;continue;}
     // V242: exact routes override random wandering. One axis at a time,
     // no diagonals, retaining feet animation and collision checks.
     if(Array.isArray(o.npcRoute)&&o.npcRoute.length>=2){
       const route=o.npcRoute;
       const idx=Math.max(0,Math.min(route.length-1,s.routeIndex||1));
       const dest=route[idx];
       const dx=dest.x-s.x,dy=dest.y-s.y;
       if(Math.abs(dx)<1&&Math.abs(dy)<1){
         s.x=dest.x;s.y=dest.y;s.moving=false;s.wait=.23;
         if(o.npcRouteStyle==='pingpong'){
           if(idx===route.length-1)s.routeDirection=-1;
           else if(idx===0)s.routeDirection=1;
           s.routeIndex=clamp(idx+s.routeDirection,0,route.length-1);
         }else s.routeIndex=(idx+1)%route.length;
         continue;
       }
       const axis=Math.abs(dx)>=1?'x':'y',amount=clamp((axis==='x'?dx:dy),-s.speed*dt,s.speed*dt);
       const nx=s.x+(axis==='x'?amount:0),ny=s.y+(axis==='y'?amount:0);
       if((region==='grove'&&groveBlocked(nx,ny))||worldCollisionAt(nx,ny,region)){
         s.moving=false;s.wait=.6;continue;
       }
       s.direction=axis==='x'?(amount>=0?'right':'left'):(amount>=0?'down':'up');
       s.x=nx;s.y=ny;s.clock+=dt;s.moving=Math.abs(amount)>0;continue;
     }
     if(Math.abs(s.targetX-s.x)<.5&&Math.abs(s.targetY-s.y)<.5){
       s.x=s.targetX;s.y=s.targetY;
       if(Math.random()<.18){s.wait=.25+Math.random()*.8;s.moving=false;continue;}
       chooseNPCStep(s,region);
     }
     const dx=s.targetX-s.x,dy=s.targetY-s.y,dist=Math.hypot(dx,dy);
     if(dist>.001){
       const travel=Math.min(dist,s.speed*dt);
       s.x+=dx/dist*travel;s.y+=dy/dist*travel;
       s.moving=true;s.clock+=dt;
     }else s.moving=false;
   }
 }
 function drawNPC(ctx,o,region){
   const sheet=npcSheets.get(o.assetId);
   const meta=npcMeta.get(o.assetId);
   const state=active?null:getNPCState(o,region);
   const x=state?state.x:o.x,y=state?state.y:o.y;
   const dir=state&&o.animate?state.direction:'down';
   const row=Math.max(0,npcDirections.indexOf(dir));
   // Exact requested cycle: left foot forward, feet together, right foot forward, feet together.
   const walkCycle=o.assetId==='npc_missmuffet' ? [0,1,2,3] : (o.assetId==='npc_ian'||o.assetId==='npc_josh'||String(o.assetId||'').startsWith('npc_custom_') ? [0,1,2,3] : [1,0,3,0]);
   const frameIndex=state&&state.moving&&o.animate ? walkCycle[Math.floor(state.clock*8)%walkCycle.length] : 0;
   const art=sheet?.complete&&sheet.naturalWidth?sheet:images.get(o.assetId);
   if(!art||!art.complete||!art.naturalWidth)return;
   ctx.save();ctx.imageSmoothingEnabled=false;
   ctx.fillStyle='rgba(13,26,17,0.20)';ctx.beginPath();ctx.ellipse(x,y+1,15,3.3,0,0,Math.PI*2);ctx.fill();
   if(sheet?.complete&&sheet.naturalWidth&&meta&&meta.frames&&meta.frames[row]&&meta.frames[row][frameIndex]){
     const f=meta.frames[row][frameIndex];
     const sx=f.sx, sy=f.sy, sw=f.sw, sh=f.sh;
     // Make every visible NPC silhouette 88 px tall, regardless of atlas padding or placement size.
     const npcScale=88/Math.max(1,sh);
     const bob=state&&state.moving?Math.sin(state.clock*16)*0.6:0;
     const dx=Math.round(x-f.ax*npcScale),dy=Math.round(y-f.ay*npcScale+bob);
     ctx.drawImage(sheet,sx,sy,sw,sh,dx,dy,Math.max(1,Math.round(sw*npcScale)),88);
   }else if(sheet?.complete&&sheet.naturalWidth){
     const npcW=Math.round(128*88/160);
     ctx.drawImage(sheet,0,row*160,128,160,Math.round(x-npcW/2),Math.round(y-88),npcW,88);
   }else {const aw=art.naturalWidth,ah=art.naturalHeight;const npcW=Math.max(1,Math.round(aw*88/ah));ctx.drawImage(art,x-npcW/2,y-88,npcW,88);}
   ctx.restore();
 }

 function drawSprite(ctx,o,now,opacity=1){
   const im=images.get(o.assetId);if(!im||!im.complete||!im.naturalWidth)return;
   const animate=o.animate;
   let swing=0,bob=0,glow=1;
   if(animate && !getAsset(o.assetId)?.streetlight){
     const t=now*.001,phase=o.seed||0;
     swing=Math.sin(t*1.9+phase+o.x*.004)*.035 + Math.sin(t*.8+phase)*.016;
     bob=Math.sin(t*2+phase)*1.5;
     glow=.87+Math.sin(t*2.4+phase)*.13;
   }
   ctx.save();
   ctx.translate(o.x,o.y+(o.layer==='ground'?0:bob));
   ctx.rotate((o.rotation||0)+swing);
   ctx.scale(o.flipX?-1:1,o.flipY?-1:1);
   ctx.globalAlpha=opacity;
   if(getAsset(o.assetId)?.streetlight){
     const bright=window.SADayNight?.getNightStrength?.()||0;
     ctx.filter=`brightness(${(0.52+bright*.77).toFixed(2)}) saturate(${(.38+bright*.8).toFixed(2)})`;
   }else if(animate && o.assetId.includes('lamp'))ctx.filter=`brightness(${glow*1.3})`;
   ctx.imageSmoothingEnabled=false;
   ctx.drawImage(im,-o.w*.5,-o.h*.5,o.w,o.h);
   ctx.restore();
 }
 // Reusable spatial buckets keep rendering and collision efficient in large maps.
 const SPATIAL_CELL=256;
 const spatialCache={leaf:null,grove:null};
 function invalidateSpatial(){spatialCache.leaf=null;spatialCache.grove=null;}
 function spatialKey(ix,iy){return ix+','+iy;}
 function spatialIndex(region){
   const objects=maps[region]||[],cached=spatialCache[region];
   if(cached&&cached.items===objects&&cached.size===objects.length)return cached;
   const out={items:objects,size:objects.length,byLayer:{ground:new Map(),decor:new Map(),foreground:new Map()},solids:new Map(),npcs:[],rank:new Map()};
   function insert(buckets,thing,radius){
     const xMin=Math.floor((thing.x-radius)/SPATIAL_CELL),xMax=Math.floor((thing.x+radius)/SPATIAL_CELL);
     const yMin=Math.floor((thing.y-radius)/SPATIAL_CELL),yMax=Math.floor((thing.y+radius)/SPATIAL_CELL);
     for(let i=xMin;i<=xMax;i++)for(let j=yMin;j<=yMax;j++){
       const key=spatialKey(i,j);
       if(!buckets.has(key))buckets.set(key,[]);
       buckets.get(key).push(thing);
     }
   }
   for(let oi=0;oi<objects.length;oi++){
     const o=objects[oi];out.rank.set(o.uid,oi);
     if(isNPC(o)){out.npcs.push(o);continue;}
     // Half diagonal encloses the entire object at any rotation; no sprite edges clipped.
     const radius=Math.hypot(o.w||1,o.h||1)*.5+6;
     insert(out.byLayer[o.layer]||out.byLayer.decor,o,radius);
     if(o.collision)insert(out.solids,o,radius+12);
   }
   spatialCache[region]=out;return out;
 }
 function bucketQuery(buckets,l,t,r,b){
   const minX=Math.floor(l/SPATIAL_CELL),maxX=Math.floor(r/SPATIAL_CELL);
   const minY=Math.floor(t/SPATIAL_CELL),maxY=Math.floor(b/SPATIAL_CELL);
   const seen=new Set(),found=[];
   for(let i=minX;i<=maxX;i++)for(let j=minY;j<=maxY;j++){
     const items=buckets.get(spatialKey(i,j));if(!items)continue;
     for(const obj of items)if(!seen.has(obj.uid)){seen.add(obj.uid);found.push(obj);}
   }
   return found;
 }
 function drawLayer(layer){
   if(interior)return;
   if(layer==='foreground'&&testing&&showWalls)renderCollisionGuides(ctx,p=>p,1);
   const arr=getMap();if(!arr.length)return;
   const cam=cameraInfo(),margin=220;
   const l=cam.x-margin,r=cam.x+W/cam.sc+margin,top=cam.y-margin,bottom=cam.y+H/cam.sc+margin;
   const now=performance.now();
   const region=currentDistrict==='grove'?'grove':'leaf';
   if(layer==='foreground'){
     // Advance walkers once per rendered frame, never while editing/indoors.
     const dt=npcLastTick?clamp((now-npcLastTick)/1000,0,.05):0;
     npcLastTick=now;
     updateNPCs(region,dt);
   }
   ctx.save();
   const index=spatialIndex(region);
   const objects=bucketQuery(index.byLayer[layer],l,top,r,bottom);
   // Retain the original layer ordering so placements stack identically to V206.
   objects.sort((a,b)=>(index.rank.get(a.uid)||0)-(index.rank.get(b.uid)||0));
   for(const obj of objects){drawSprite(ctx,obj,now);}
   // NPCs are intentionally not rendered here: later native house passes used
   // to cover their heads and shoulders. Draw all placed NPCs in a final pass.
   ctx.restore();
 }
 function drawNPCOverlay(){
   if(interior)return;
   const region=currentDistrict==='grove'?'grove':'leaf';
   const index=spatialIndex(region);
   if(!index.npcs.length)return;
   const cam=cameraInfo(),margin=220;
   const l=cam.x-margin,r=cam.x+W/cam.sc+margin;
   const top=cam.y-margin,bottom=cam.y+H/cam.sc+margin;
   ctx.save();
   for(const obj of index.npcs){
     const state=active?null:getNPCState(obj,region);
     const x=state?.x??obj.x,y=state?.y??obj.y;
     if(x<l||x>r||y<top||y>bottom)continue;
     drawNPC(ctx,obj,region);
   }
   ctx.restore();
 }
 function repaintPreview(){
   if(!active||!editorCanvas)return;
   const d=window.devicePixelRatio||1;
   const w=window.innerWidth,h=window.innerHeight;
   if(editorCanvas.width!==Math.round(w*d)||editorCanvas.height!==Math.round(h*d)){
     editorCanvas.width=Math.round(w*d);editorCanvas.height=Math.round(h*d);
   }
   const g=editorCanvas.getContext('2d');g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,w,h);
   const cam=cameraInfo(),pointToScreen=(p)=>({x:(p.x-cam.x)*cam.sc,y:(p.y-cam.y)*cam.sc});
   if(snap){
     g.lineWidth=.6;g.strokeStyle='rgba(225,250,206,0.12)';
     const step=cellSize*cam.sc;
     if(step>6){
       for(let x=-((cam.x*cam.sc)%step);x<w;x+=step){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();}
       for(let y=-((cam.y*cam.sc)%step);y<h;y+=step){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}
     }
   }
   if(showWalls)renderCollisionGuides(g,pointToScreen,cam.sc);
   const s=getSelected();
   if(s&&isNPC(s)&&Array.isArray(s.npcRoute)&&s.npcRoute.length&&byId('saShowRoutes')?.checked){
     const pts=s.npcRoute.map(pointToScreen);
     g.save();g.strokeStyle='#ffed9d';g.lineWidth=3;g.setLineDash([8,5]);g.beginPath();
     pts.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));
     if(s.npcRouteStyle==='loop'&&pts.length>2)g.lineTo(pts[0].x,pts[0].y);
     g.stroke();g.setLineDash([]);
     pts.forEach((p,i)=>{g.beginPath();g.arc(p.x,p.y,Math.max(5,8-i*.02),0,Math.PI*2);g.fillStyle=i?'#e5ffc7':'#f5bd66';g.fill();g.fillStyle='#1b3826';g.font='bold 10px system-ui';g.textAlign='center';g.textBaseline='middle';g.fillText(String(i+1),p.x,p.y);});
     g.restore();
   }
   const nativeRecord=nativeNPCRoutes[nativeRouteSelected];
   if(nativeRecord?.points?.length&&window.SAActorRoutes?.list().find(a=>a.id===nativeRouteSelected)?.region===regionKey()&&!window.SAActorRoutes?.list().find(a=>a.id===nativeRouteSelected)?.room){
     g.save();g.lineWidth=3;g.strokeStyle='#ffe19a';g.setLineDash([6,4]);g.beginPath();
     nativeRecord.points.forEach((pt,i)=>{const v=pointToScreen(pt);if(i)g.lineTo(v.x,v.y);else g.moveTo(v.x,v.y);});
     g.stroke();g.setLineDash([]);nativeRecord.points.forEach((pt,i)=>{const v=pointToScreen(pt);g.fillStyle=i?'#fff5b9':'#4dffae';g.beginPath();g.arc(v.x,v.y,Math.max(5,7),0,Math.PI*2);g.fill();g.fillStyle='#163022';g.font='bold 11px sans-serif';g.fillText(String(i+1),v.x-3,v.y+4);});g.restore();
   }
   if(s){
     const sc=pointToScreen(s);
     const sm=isNPC(s)?npcMeta.get(s.assetId)?.frames?.[0]?.[0]:null;
     const shownH=isNPC(s)?88:s.h;
     const shownW=sm?shownH*sm.sw/Math.max(1,sm.sh):(isNPC(s)?shownH*s.w/Math.max(1,s.h):s.w);
     const sw=shownW*cam.sc,sh=shownH*cam.sc;
     g.lineWidth=2;g.strokeStyle='#f9ef89';g.setLineDash([6,4]);
     g.strokeRect(sc.x-sw*.5-3,isNPC(s)?sc.y-sh-3:sc.y-sh*.5-3,sw+6,sh+6);g.setLineDash([]);
     g.fillStyle='#ffee9b';g.fillRect(sc.x-4,sc.y-4,8,8);
   }
   if(hover&&mode==='paint'&&chosen){
     const a=getAsset(chosen),p=snapPoint(hover),sc=pointToScreen(p);
     if(a){
       const im=images.get(chosen),npcPreview=!!a.npc;
       const hm=npcPreview?88:a.h*brushScale;
       const sm=npcPreview?npcMeta.get(chosen)?.frames?.[0]?.[0]:null;
       const wm=npcPreview?(sm?hm*sm.sw/Math.max(1,sm.sh):hm*a.w/Math.max(1,a.h)):a.w*brushScale;
       const sw=wm*cam.sc,sh=hm*cam.sc;
       if(im&&im.complete&&im.naturalWidth){
         g.save();g.translate(sc.x,sc.y);g.rotate(rotation);g.scale(flipX?-1:1,flipY?-1:1);g.globalAlpha=.66;g.imageSmoothingEnabled=false;g.drawImage(im,-sw*.5,getAsset(chosen)?.npc?-sh:-sh*.5,sw,sh);g.restore();
       }
       g.strokeStyle='#f7e7ab';g.lineWidth=1.5;g.strokeRect(sc.x-sw*.5,a.npc?sc.y-sh:sc.y-sh*.5,sw,sh);
     }
   }
   if(hover&&(mode==='erase'||mode==='select'||mode==='wall-draw'||mode==='wall-erase'||mode==='wall-select'||mode==='npc-route'||mode==='native-route')){
     const sc=pointToScreen(hover);
     g.strokeStyle=mode.includes('erase')?'#ffb2a4':mode.startsWith('wall')?'#ffb879':'#ddedbd';g.lineWidth=2;
     g.beginPath();g.arc(sc.x,sc.y,12,0,Math.PI*2);g.stroke();
   }
 }
 function previewLoop(){requestAnimationFrame(previewLoop);if(active)repaintPreview();}

 function getCollisionProfile(assetId){
   if(collisionCache.has(assetId)) return collisionCache.get(assetId);
   const im=images.get(assetId), meta=getAsset(assetId);
   if(!im||!meta||!im.complete||!im.naturalWidth){collisionCache.set(assetId,null);return null;}
   try{
     const cv=document.createElement('canvas');cv.width=im.naturalWidth;cv.height=im.naturalHeight;
     const g=cv.getContext('2d',{willReadFrequently:true});
     g.clearRect(0,0,cv.width,cv.height);g.drawImage(im,0,0);
     const raw=g.getImageData(0,0,cv.width,cv.height);const src=raw.data;const w=cv.width,h=cv.height;
     const cat=(meta.category||'').toLowerCase();
     const solid=new Uint8Array(w*h);
     let minX=w,minY=h,maxX=-1,maxY=-1;
     for(let y=0;y<h;y++)for(let x=0;x<w;x++){
       const idx=(y*w+x)*4,alpha=src[idx+3];
       if(alpha<72) continue;
       let ok=true;
       if(cat.includes('trees')){
         const nx=x/w, ny=y/h;
         ok = ny>.42 && nx>.28 && nx<.72;
       }else if(cat.includes('fences')){
         ok = true;
       }else if(cat.includes('props')){
         if(meta.id.includes('lamp')) ok = y/h > .42;
         else if(meta.id.includes('sign')) ok = y/h > .32;
       }
       if(!ok) continue;
       solid[y*w+x]=1;
       if(x<minX) minX=x; if(y<minY) minY=y; if(x>maxX) maxX=x; if(y>maxY) maxY=y;
     }
     if(maxX<0){
       const fallback={w,h,minX:0,minY:0,maxX:w-1,maxY:h-1,solid:null,cat};
       collisionCache.set(assetId,fallback);return fallback;
     }
     const shrink = cat.includes('hedges')||cat.includes('bushes') ? 2 : (cat.includes('rocks') ? 1 : 1);
     if(shrink>0){
       const eroded=new Uint8Array(w*h);
       for(let y=0;y<h;y++)for(let x=0;x<w;x++){
         const i=y*w+x;if(!solid[i]) continue;
         let keep=1;
         for(let dy=-shrink;dy<=shrink && keep;dy++)for(let dx=-shrink;dx<=shrink;dx++){
           const xx=x+dx,yy=y+dy;
           if(xx<0||yy<0||xx>=w||yy>=h||!solid[yy*w+xx]){keep=0;break;}
         }
         eroded[i]=keep;
       }
       if(eroded.some(v=>v)){
         solid.set(eroded);
         minX=w;minY=h;maxX=-1;maxY=-1;
         for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(solid[y*w+x]){if(x<minX)minX=x;if(y<minY)minY=y;if(x>maxX)maxX=x;if(y>maxY)maxY=y;}
       }
     }
     const out={w,h,minX,minY,maxX,maxY,solid,cat};
     collisionCache.set(assetId,out);return out;
   }catch(err){console.warn('Collision profile failed for',assetId,err);collisionCache.set(assetId,null);return null;}
 }
 function objectCollisionHit(o,x,y){
   const lamp=getAsset(o.assetId);
   if(lamp?.streetlight){
     // Only the foot of a lamppost is solid. Its lantern and overhead arm are not walls.
     const footX=o.x+((lamp.baseX??.5)-.5)*o.w;
     const footY=o.y+o.h*.44;
     return Math.abs(x-footX)<Math.max(8,o.w*.12) && Math.abs(y-footY)<Math.max(6,o.h*.055);
   }
   const profile=getCollisionProfile(o.assetId);
   const dx=x-o.x, dy=y-o.y;
   const ang=-(o.rotation||0), cos=Math.cos(ang), sin=Math.sin(ang);
   let rx=dx*cos-dy*sin, ry=dx*sin+dy*cos;
   if(o.flipX) rx=-rx;
   if(o.flipY) ry=-ry;
   const nx=(rx/o.w)+.5, ny=(ry/o.h)+.5;
   if(nx<0||nx>1||ny<0||ny>1) return false;
   if(!profile||!profile.solid){
     const gap=6;
     return Math.abs(rx)<Math.max(5,o.w*.38)+gap && Math.abs(ry)<Math.max(5,o.h*.26)+gap;
   }
   const px=Math.max(0,Math.min(profile.w-1,Math.round(nx*(profile.w-1))));
   const py=Math.max(0,Math.min(profile.h-1,Math.round(ny*(profile.h-1))));
   if(px<profile.minX||px>profile.maxX||py<profile.minY||py>profile.maxY) return false;
   return !!profile.solid[py*profile.w+px];
 }
 function worldCollisionAt(x,y,region=currentDistrict==='grove'?'grove':'leaf'){
   const index=spatialIndex(region);
   for(const o of bucketQuery(index.solids,x-8,y-8,x+8,y+8)){
     if(objectCollisionHit(o,x,y))return true;
   }
   if(collisionPoint(x,y,region,8))return true;
   return false;
 }
 // Install an additive collision rule without modifying any existing obstacles.
 const beforeMove=move;
 move=function(dt){
   if(active)return;
   if(interior)return beforeMove(dt);
   const x=player.x,y=player.y;
   const result=beforeMove(dt);
   if(worldCollisionAt(player.x,player.y)){player.x=x;player.y=y;return result;}
   if(collisionSweep(x,y,player.x,player.y,regionKey(),10)){
     const nx=player.x,ny=player.y;
     // Keep side-sliding available along walls while blocking crossing.
     player.x=x;player.y=y;
     if(!collisionSweep(x,y,nx,y,regionKey(),10))player.x=nx;
     if(!collisionSweep(player.x,y,player.x,ny,regionKey(),10))player.y=ny;
   }
   return result;
 };


 // Optional dialogue for user-placed NPCs; original story NPCs and quests are untouched.
 const previousInteractNPC=interact;
 interact=function(){
   if(!active && !interior && !battle && !dialogOpen && !shopOpen && !missionOpen){
     const region=currentDistrict==='grove'?'grove':'leaf';
     for(const npc of maps[region]||[]){
       if(!isNPC(npc)||!npc.dialogue)continue;
       const state=getNPCState(npc,region);
       if(Math.hypot(player.x-state.x,player.y-state.y)<78){
         show(String(getAsset(npc.assetId)?.name||'NPC').replace(/[<>]/g,''),String(npc.dialogue).replace(/[<>]/g,''));
         return;
       }
     }
   }
   return previousInteractNPC();
 };
 function syncNativeUI(){
   const item=window.SAActorRoutes?.list().find(x=>x.id===nativeRouteSelected);
   const r=nativeNPCRoutes[nativeRouteSelected];
   const el=byId('saNativeStatus');if(!el)return;
   el.textContent=item?(item.name+' — '+(item.room?item.room+' interior':'outdoors / '+item.region)+' · '+(r?.points?.length||0)+' waypoints · '+((r?.points?.length||0)>=2?'custom walking route':'original game roaming')+'. Map routes use WASD directions.'): 'Choose an existing character to configure its route.';
   if(byId('saNativeRouteStyle'))byId('saNativeRouteStyle').value=r?.style==='pingpong'?'pingpong':'loop';
   if(byId('saNativeRouteSpeed'))byId('saNativeRouteSpeed').value=r?.speed||item?.speed||60;
   if(byId('saNativeSpeedLabel'))byId('saNativeSpeedLabel').textContent=String(r?.speed||item?.speed||60);
 }
 function initNativeRoutesUI(){
   const registry=window.SAActorRoutes?.list()||[];
   const select=byId('saNativeNPCSelect');if(!select)return;
   select.replaceChildren(new Option('Select an existing NPC…',''));
   for(const actor of registry)select.add(new Option(actor.name+' — '+(actor.room||actor.region==='leaf'?'':actor.region),actor.id));
   for(const opt of [...select.options].slice(1)){
      const actor=registry.find(a=>a.id===opt.value);
      opt.textContent=actor.name+' ('+(actor.room?actor.room+' interior':actor.region==='leaf'?'Leaf Town':'Eastern Grove')+')';
   }
   select.addEventListener('change',e=>{nativeRouteSelected=e.target.value;syncNativeUI();});
   function rec(){if(!nativeRouteSelected)return null;return nativeNPCRoutes[nativeRouteSelected]||(nativeNPCRoutes[nativeRouteSelected]={points:[],style:'loop',speed:60});}
   byId('saNativeStart').addEventListener('click',()=>{
     const actor=registry.find(x=>x.id===nativeRouteSelected);if(!actor){tell('Select a character first.');return;}
     if(actor.room){tell('Indoor character: add its room x/y coordinates using the inputs.');return;}
     if(regionKey()!==actor.region){tell('Switch World Studio region to '+(actor.region==='leaf'?'Leaf Town':'Eastern Grove')+' first.');return;}
     setMode('native-route');tell('Tap safe positions along a path. Route will follow horizontal and vertical steps.');
   });
   byId('saNativeAdd').addEventListener('click',()=>{
     const actor=registry.find(x=>x.id===nativeRouteSelected);if(!actor)return;
     const r=rec(),x=Number(byId('saNativeX').value),y=Number(byId('saNativeY').value);
     const maxX=actor.room?900:2896,maxY=actor.room?680:2172;
     if(!Number.isFinite(x)||!Number.isFinite(y)||x<0||y<0||x>maxX||y>maxY){tell('Waypoint outside this room or map.');return;}
     if(r.points.length>=64){tell('Waypoint limit is 64.');return;}
     recordUndo();r.points.push({x:Math.round(x),y:Math.round(y)});window.SAActorRoutes?.setRoutes(nativeNPCRoutes);persistSoon();syncNativeUI();
   });
   byId('saNativeUndo').addEventListener('click',()=>{const r=rec();if(!r?.points.length)return;recordUndo();r.points.pop();window.SAActorRoutes?.setRoutes(nativeNPCRoutes);persistSoon();syncNativeUI();});
   byId('saNativeClear').addEventListener('click',()=>{if(!nativeRouteSelected)return;recordUndo();delete nativeNPCRoutes[nativeRouteSelected];window.SAActorRoutes?.setRoutes(nativeNPCRoutes);persistSoon();syncNativeUI();});
   byId('saNativeRouteStyle').addEventListener('change',e=>{const r=rec();if(!r)return;recordUndo();r.style=e.target.value==='pingpong'?'pingpong':'loop';window.SAActorRoutes?.setRoutes(nativeNPCRoutes);persistSoon();syncNativeUI();});
   byId('saNativeRouteSpeed').addEventListener('input',e=>{const r=rec();if(!r)return;r.speed=Number(e.target.value);window.SAActorRoutes?.setRoutes(nativeNPCRoutes);persistSoon();syncNativeUI();});
   syncNativeUI();
 }
 function installEvents(){
   initNativeRoutesUI();
   canvas.addEventListener('pointerdown',onPointerDown,true);
   canvas.addEventListener('pointermove',onPointerMove,true);
   canvas.addEventListener('pointerup',onPointerUp,true);
   canvas.addEventListener('pointercancel',onPointerUp,true);
   window.addEventListener('keydown',onKey,true);
   canvas.addEventListener('wheel',e=>{if(!active)return;e.preventDefault();updateZoom(editorZoom*(e.deltaY<0?1.13:1/1.13));},{passive:false});
   window.addEventListener('resize',()=>{if(active)repaintPreview();},{passive:true});
   setInterval(updateOpenButton,850);
   requestAnimationFrame(previewLoop);
 }
 async function init(){
   try{
     const r=await fetch('editor/asset-manifest.json',{cache:'no-store'});
     if(!r.ok)throw new Error('Environment manifest unavailable');
     const manifest=await r.json();
     library=manifest.assets;
     let npcMetaManifest={};
     try{
       const mr=await fetch('editor/npcs/npc-metadata.json',{cache:'no-store'});
       if(mr.ok)npcMetaManifest=await mr.json();
     }catch(e){console.warn('NPC metadata unavailable',e);}
     for(const a of library){
       manifestMap.set(a.id,a);makeImage(a);
       if(a.npc){
         const sprite=new Image();sprite.src=a.sheet;npcSheets.set(a.id,sprite);
         if(npcMetaManifest[a.id])npcMeta.set(a.id,npcMetaManifest[a.id]);
       }
     }
     // Always load the ZIP-packaged reference separately from local edits,
     // so Export All Changes represents a reproducible scoped patch.
     try{
       const rr=await fetch('editor/world-layout.json',{cache:'no-store'});
       if(rr.ok){
         const bundled=await rr.json();
         if(bundled&&bundled.maps)packagedWorldBaseline=bundled;
       }
     }catch(e){console.warn('World Studio baseline unavailable',e);}
     let project=await readStoredProject();
     const returning=!!project;
     if(!project)project=packagedWorldBaseline;
     // One-time delta import for V206 saves, preserving edits made locally after V206.
     // Older V205 saves also receive any missing V206 placements from the packaged layout.
     let needsMigration=false;
     if(returning&&project?.maps&&packagedWorldBaseline?.worldImportId){
       const imports=Array.isArray(project.appliedWorldImports)?project.appliedWorldImports:[];
       project.appliedWorldImports=imports;
       if(!imports.includes('v206-first-extraction-20261015')){
         for(const region of ['leaf','grove']){
           const saved=Array.isArray(project.maps[region])?project.maps[region]:[];
           const present=new Set(saved.map(o=>o?.uid));
           for(const obj of (packagedWorldBaseline.maps[region]||[])){
             if(!present.has(obj.uid)){saved.push(obj);present.add(obj.uid);}
           }
           project.maps[region]=saved;
         }
         imports.push('v206-first-extraction-20261015');needsMigration=true;
       }else if(!imports.includes('v207-second-extraction-20261015')){
         // Apply V207 diff with UID matching, never replacing an independently edited object.
         try{
           const pr=await fetch('editor/world-update-v207.json',{cache:'no-store'});
           if(!pr.ok)throw new Error('Missing V207 editor patch');
           const patch=await pr.json();
           for(const region of ['leaf','grove']){
             const list=Array.isArray(project.maps[region])?project.maps[region]:[];
             const byUid=new Map(list.map(o=>[o.uid,o]));
             const ch=patch.changes.maps[region];
             for(const obj of ch.added){if(!byUid.has(obj.uid))byUid.set(obj.uid,obj);}
             let pre={};
             try{
               const rr=await fetch('editor/v207-prepatch-'+region+'.json');
               if(rr.ok)pre=await rr.json();
             }catch(e){}
             for(const obj of ch.modified){
               const existing=byUid.get(obj.uid);
               if(existing&&pre[obj.uid]&&JSON.stringify(existing)===JSON.stringify(pre[obj.uid]))byUid.set(obj.uid,obj);
             }
             for(const uid of ch.removed){
               const existing=byUid.get(uid);
               if(existing&&pre[uid]&&JSON.stringify(existing)===JSON.stringify(pre[uid]))byUid.delete(uid);
             }
             project.maps[region]=[...byUid.values()];
           }
           needsMigration=true;
         }catch(e){console.warn('World Studio V207 migration delayed',e);}
       }
       if(needsMigration&&!imports.includes('v207-second-extraction-20261015'))imports.push('v207-second-extraction-20261015');
       // V208: apply the user's third World Studio extraction to existing V207 saves.
       // Do not replace any locally changed objects: modified/removal entries are
       // applied only when the current value still equals the V207 packaged object.
       if(!imports.includes('v208-third-extraction-20261015')){
         try{
           const pr=await fetch('editor/world-update-v208.json',{cache:'no-store'});
           if(!pr.ok)throw new Error('Missing V208 editor patch');
           const patch=await pr.json();
           if(patch.id!=='v208-third-extraction-20261015')throw new Error('Unexpected V208 editor patch');
           for(const region of ['leaf','grove']){
             const saved=Array.isArray(project.maps[region])?project.maps[region]:[];
             const byUid=new Map(saved.map(o=>[o.uid,o]));
             const ch=patch.changes.maps[region];
             let pre={};
             const before=await fetch('editor/v208-prepatch-'+region+'.json',{cache:'no-store'});
             if(!before.ok)throw new Error('Missing V208 prepatch reference');
             pre=await before.json();
             for(const obj of ch.added){if(!byUid.has(obj.uid))byUid.set(obj.uid,obj);}
             for(const obj of ch.modified){
               const existing=byUid.get(obj.uid);
               if(existing&&pre[obj.uid]&&JSON.stringify(existing)===JSON.stringify(pre[obj.uid]))byUid.set(obj.uid,obj);
             }
             for(const uid of ch.removed){
               const existing=byUid.get(uid);
               if(existing&&pre[uid]&&JSON.stringify(existing)===JSON.stringify(pre[uid]))byUid.delete(uid);
             }
             project.maps[region]=[...byUid.values()];
           }
           imports.push('v208-third-extraction-20261015');
           needsMigration=true;
         }catch(e){console.warn('World Studio V208 migration delayed',e);}
       }
       // V209 applies this upload's one hedge modification and one removal.
       // Independently edited items in an existing browser save are untouched.
       if(!imports.includes('v209-fourth-extraction-20261016')){
         try{
           const response=await fetch('editor/world-update-v209.json',{cache:'no-store'});
           if(!response.ok)throw new Error('Missing V209 editor delta');
           const patch=await response.json();
           if(patch.id!=='v209-fourth-extraction-20261016')throw new Error('Invalid V209 delta');
           for(const region of ['leaf','grove']){
             const saved=Array.isArray(project.maps[region])?project.maps[region]:[];
             const byUid=new Map(saved.map(o=>[o.uid,o]));
             const ch=patch.changes.maps[region];
             const refResponse=await fetch('editor/v209-prepatch-'+region+'.json',{cache:'no-store'});
             if(!refResponse.ok)throw new Error('Missing V209 reference');
             const pre=await refResponse.json();
             for(const obj of ch.added)if(!byUid.has(obj.uid))byUid.set(obj.uid,obj);
             for(const obj of ch.modified){
               const existing=byUid.get(obj.uid);
               if(existing&&pre[obj.uid]&&JSON.stringify(existing)===JSON.stringify(pre[obj.uid]))byUid.set(obj.uid,obj);
             }
             for(const uid of ch.removed){
               const existing=byUid.get(uid);
               if(existing&&pre[uid]&&JSON.stringify(existing)===JSON.stringify(pre[uid]))byUid.delete(uid);
             }
             project.maps[region]=[...byUid.values()];
           }
           imports.push('v209-fourth-extraction-20261016');needsMigration=true;
         }catch(e){console.warn('World Studio V209 migration delayed',e);}
       }
     }
     // V222 fifth world extraction: add by UID to existing projects without overwriting their other edits.
     if(returning&&project?.maps){
       const applied=Array.isArray(project.appliedWorldImports)?project.appliedWorldImports:(project.appliedWorldImports=[]);
       if(!applied.includes('v222-fifth-extraction-20261016')){
         try{
           const response=await fetch('editor/world-update-v222.json',{cache:'no-store'});
           if(!response.ok)throw new Error('World Studio fifth extraction unavailable');
           const patch=await response.json();
           if(patch.id!=='v222-fifth-extraction-20261016')throw new Error('Unexpected patch');
           for(const region of ['leaf','grove']){
             const list=Array.isArray(project.maps[region])?project.maps[region]:[];
             const byUid=new Map(list.map(o=>[o.uid,o]));
             for(const obj of patch.changes.maps[region].added||[])if(!byUid.has(obj.uid))byUid.set(obj.uid,obj);
             for(const obj of patch.changes.maps[region].modified||[])if(byUid.has(obj.uid))byUid.set(obj.uid,obj);
             for(const id of patch.changes.maps[region].removed||[])byUid.delete(id);
             project.maps[region]=[...byUid.values()];
           }
           applied.push('v222-fifth-extraction-20261016');needsMigration=true;
         }catch(e){console.warn('World Studio fifth extraction could not migrate',e);}
       }
     }
     // V223: merge the latest exported authoring changes by stable UID exactly once.
     // This applies additions, replacements and removals ONLY to UIDs in the export,
     // keeping unmentioned placements, quests, NPCs, interiors and save data untouched.
     if(returning&&project?.maps){
       const applied=Array.isArray(project.appliedWorldImports)?project.appliedWorldImports:(project.appliedWorldImports=[]);
       if(!applied.includes('v223-sixth-extraction-20261016')){
         try{
           const response=await fetch('editor/world-update-v223.json',{cache:'no-store'});
           if(!response.ok)throw new Error('V223 World Studio update unavailable');
           const patch=await response.json();
           if(patch.id!=='v223-sixth-extraction-20261016')throw new Error('Invalid V223 update ID');
           for(const region of ['leaf','grove']){
             const byUid=new Map((project.maps[region]||[]).map(o=>[o.uid,o]));
             const change=patch.changes.maps[region]||{};
             for(const obj of change.added||[])if(!byUid.has(obj.uid))byUid.set(obj.uid,obj);
             for(const obj of change.modified||[])if(byUid.has(obj.uid))byUid.set(obj.uid,obj);
             for(const uid of change.removed||[])byUid.delete(uid);
             project.maps[region]=[...byUid.values()];
           }
           applied.push(patch.id);needsMigration=true;
         }catch(e){console.warn('V223 World Studio update was not applied',e);}
       }
     }
     if(project&&project.maps){
       invalidateSpatial();
       appliedWorldImports=Array.isArray(project.appliedWorldImports)?project.appliedWorldImports:[];
       maps={leaf:(project.maps.leaf||[]).map(sanitizeObject).filter(Boolean),grove:(project.maps.grove||[]).map(sanitizeObject).filter(Boolean)};
       nativeNPCRoutes=window.SAActorRoutes?.sanitize(project.nativeNPCRoutes||packagedWorldBaseline?.nativeNPCRoutes)||{};
       window.SAActorRoutes?.setRoutes(nativeNPCRoutes);
       collisionMaps=sanitizeCollisionMaps(project.collisionMaps);
       customAssets=Array.isArray(project.customAssets)?project.customAssets:[];
       customNPCs=(Array.isArray(project.customNPCs)?project.customNPCs:[]).filter(validCustomNPC).slice(0,24);
     }
     // V240 native Eastern Grove: merge genuine Leaf-style editable objects into
     // PREVIOUS BROWSER SAVES once, never overwriting existing user placements.
     const eg240Marker='v240-native-leaf-style-eastern-grove';
     if(!appliedWorldImports.includes(eg240Marker)){
       try{
         const seedRequest=await fetch('eastern_grove/editor_placements.json',{cache:'no-store'});
         if(seedRequest.ok){
           const additions=await seedRequest.json();
           const ids=new Set((maps.grove||[]).map(o=>o.uid));
           for(const obj of additions){if(!ids.has(obj.uid))maps.grove.push(sanitizeObject(obj));}
           appliedWorldImports.push(eg240Marker);needsMigration=true;invalidateSpatial();
         }
       }catch(e){console.warn('Eastern Grove editor migration delayed',e)}
     }
     // V241 deliberate ONE-TIME Eastern Grove authoring reset. Keeps every Leaf Town
     // placement, game save, quest, inventory and interior. Clears historic area
     // decorations and editor-drawn boundaries even for returning browsers.
     const blankMarker='v241-eastern-grove-blank-canvas';
     if(!appliedWorldImports.includes(blankMarker)){
       maps.grove=[]; collisionMaps.grove=[];
       appliedWorldImports.push(blankMarker);
       invalidateSpatial();needsMigration=true;
     }
     // V242: seed ONLY Eastern Grove with nine homes, connected woodland ring,
     // native bridge segments and decor. Migration uses stable UIDs and runs once.
     const sceneMarker='v242-eastern-grove-lake-ring-nine-houses';
     if(!appliedWorldImports.includes(sceneMarker)){
       try{
         const request=await fetch('eastern_grove/editor_placements_v242.json',{cache:'no-store'});
         if(!request.ok)throw new Error('V242 seeded editor objects missing');
         const seed=await request.json();
         const byUid=new Map((maps.grove||[]).map(o=>[o.uid,o]));
         for(const data of seed){if(!byUid.has(data.uid)){const item=sanitizeObject(data);if(item)byUid.set(data.uid,item);}}
         maps.grove=[...byUid.values()];appliedWorldImports.push(sceneMarker);
         needsMigration=true;invalidateSpatial();
       }catch(e){console.warn('V242 Eastern Grove migration failed',e);}
     }
      // V243: replace Eastern Grove's drawn winding roads with native World Studio
      // Fine Cream Sand placements. Only the grove world map is adjusted.
      const v243Marker='v243-eastern-grove-square-paths-fine-cream-sand';
      if(!appliedWorldImports.includes(v243Marker)){
        try{
          const response=await fetch('eastern_grove/editor_placements_v243.json',{cache:'no-store'});
          if(!response.ok)throw Error('V243 native sand road placements missing');
          const update=await response.json();
          const erase=new Set(update.removedUids||[]);
          const byUid=new Map((maps.grove||[]).filter(o=>!erase.has(o.uid)).map(o=>[o.uid,o]));
          for(const data of update.added||[]){
            if(!byUid.has(data.uid)){const item=sanitizeObject(data);if(item)byUid.set(item.uid,item);}
          }
          maps.grove=[...byUid.values()];invalidateSpatial();
          appliedWorldImports.push(v243Marker);needsMigration=true;
        }catch(error){console.warn('V243 native path migration failed',error);}
      }
     // V244: honor the supplied cross-shaped route sketch. Replace only Eastern Grove
     // editor road placements + obstructing props; preserve player progress and Leaf Town.
     const v244Marker='v244-eastern-grove-cross-sand-paths-no-fountains';
     if(!appliedWorldImports.includes(v244Marker)){
       try{
         const response=await fetch('eastern_grove/editor_placements_v244.json',{cache:'no-store'});
         if(!response.ok)throw Error('V244 editable Eastern Grove cross routes missing');
         const update=await response.json();
         const erase=new Set(update.removedUids||[]);
         const byUid=new Map((maps.grove||[]).filter(o=>!erase.has(o.uid) &&
           !String(o.assetId).includes('waterfall') && !String(o.assetId).includes('fountain')).map(o=>[o.uid,o]));
         for(const data of update.added||[]){
           const item=sanitizeObject(data);if(item)byUid.set(item.uid,item);
         }
         maps.grove=[...byUid.values()];invalidateSpatial();
         appliedWorldImports.push(v244Marker);needsMigration=true;
       }catch(error){console.warn('V244 cross road migration delayed',error);}
     }
     // V246: replace only Eastern Grove V244 sand roads + blocking props with
     // the user's symmetric 128px-wide cross layout. All NPC routes and save data survive.
     const v246Marker='v246-uniform-symmetric-sand-cross-all-scripted-npc-routes';
     if(!appliedWorldImports.includes(v246Marker)){
       try{
         const reply=await fetch('eastern_grove/editor_placements_v246.json',{cache:'no-store'});
         if(!reply.ok)throw Error('V246 uniform sand route data unavailable');
         const patch=await reply.json();
         const erase=new Set(patch.removedUids||[]);
         const byUid=new Map((maps.grove||[]).filter(item=>!erase.has(item.uid)).map(item=>[item.uid,item]));
         for(const data of patch.added||[]){
           const obj=sanitizeObject(data);if(obj)byUid.set(obj.uid,obj);
         }
         maps.grove=[...byUid.values()];invalidateSpatial();
         appliedWorldImports.push(v246Marker);needsMigration=true;
       }catch(e){console.warn('V246 uniform road migration postponed',e);}
     }
     // V247: import the uploaded World Studio changes without replacing V246
     // scenery/roads, gameplay code, save data, houses, interiors or quests.
     // The older V205 export's placement deltas are only updated Grove seeds;
     // the five native scripted-character paths are stored separately.
     const v247Marker='v247-world-studio-json-import-20261017';
     if(!appliedWorldImports.includes(v247Marker)){
       try{
         const response=await fetch('editor/world-import-v247.json',{cache:'no-store'});
         if(!response.ok)throw Error('World Studio JSON import data unavailable');
         const patch=await response.json();
         if(patch.id!==v247Marker)throw Error('Unexpected World Studio import ID');
         for(const region of ['leaf','grove']){
           const regionSeeds=patch.seeds?.[region]||{};
           for(const obj of maps[region]||[]){
             if(Object.prototype.hasOwnProperty.call(regionSeeds,obj.uid))obj.seed=regionSeeds[obj.uid];
           }
         }
         const savedRoutes=nativeNPCRoutes||{};
         for(const [actor,route] of Object.entries(patch.nativeNPCRoutes||{}))savedRoutes[actor]=route;
         nativeNPCRoutes=window.SAActorRoutes?.sanitize(savedRoutes)||savedRoutes;
         window.SAActorRoutes?.setRoutes(nativeNPCRoutes);
         appliedWorldImports.push(v247Marker);invalidateSpatial();needsMigration=true;
       }catch(error){console.warn('World Studio V247 import postponed',error);}
     }
     // V249: apply the user's newest World Studio export by native NPC ID.
     // The 5,528 placement objects already exactly match the new JSON; no
     // scenery, collisions, artwork, gameplay, quests or interiors are touched.
     // This one-time migration also updates previously saved World Studio projects.
     const v249Marker='v249-world-studio-json-import-20261017-0130';
     if(!appliedWorldImports.includes(v249Marker)){
       try{
         const response=await fetch('editor/world-import-v249.json',{cache:'no-store'});
         if(!response.ok)throw Error('V249 World Studio route import unavailable');
         const patch=await response.json();
         if(patch.id!==v249Marker)throw Error('Unexpected World Studio V249 import ID');
         const merged={...nativeNPCRoutes};
         for(const [actor,route] of Object.entries(patch.nativeNPCRoutes||{}))merged[actor]=route;
         nativeNPCRoutes=window.SAActorRoutes?.sanitize(merged)||merged;
         window.SAActorRoutes?.setRoutes(nativeNPCRoutes);
         appliedWorldImports.push(v249Marker);needsMigration=true;
       }catch(error){console.warn('World Studio V249 import postponed',error);}
     }
     loadImportedAssets();loadImportedNPCs();
     if(needsMigration)saveNow(false);
     chosen=library[0]?.id||'';
     buildUI();
     installEvents();
     ready=true;updateOpenButton();
   }catch(err){console.error('[World Studio]',err);}
 }
 window.SAWorldEditor={drawLayer,drawNPCOverlay,get lights(){return maps;},get active(){return active;},get testing(){return testing;},get boundaries(){return collisionMaps;},get placements(){return maps;},get npcPositions(){return [...npcStates.values()].map(s=>({region:s.region,x:s.x,y:s.y,moving:s.moving}));},enter:enterEditor,exit:exitEditor};
 init();
})();

