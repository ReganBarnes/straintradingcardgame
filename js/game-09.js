
/* Strain Adventures — browser-side 4 × 4 character import and transparent crop studio. */
(()=>{
 'use strict';
 const C=128,R=160;
 const order=['Down','Left','Right','Up'];
 const cycle=[0,1,2,3]; // 1, 2, 3, 4: preserve all four supplied poses in order
 const el=(tag,props={})=>Object.assign(document.createElement(tag),props);
 const cut=(n,a,b)=>Math.max(a,Math.min(b,n));
 const get=id=>document.getElementById(id);
 let dialog,source=null,currentFile=null,saveCallback=null,processed=null,frameIndex=0,previewLast=0,detectInfo='',segments=null;
 let raf=0;
 function warning(message){get('saNPCStatus').textContent=message;}
 function imageFromURL(url){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('Could not read the sprite sheet.'));im.src=url;});}
 function close(){if(dialog)dialog.hidden=true;cancelAnimationFrame(raf);raf=0;}
 function decodeSplits(text,size){
   const numbers=(text||'').split(/[ ,;]+/).map(Number).filter(Number.isFinite);
   if(numbers.length!==3||numbers.some(n=>n<=0||n>=size)||numbers[0]>=numbers[1]||numbers[1]>=numbers[2])throw new Error('Enter three increasing split values within the image.');
   return [0,...numbers,size];
 }
 // Automatic 4-way separation based on ink projections instead of an equal-height grid.
 function axisSplits(pixels,w,h,axis,cutoff,transparent){
   const n=axis==='x'?w:h,counts=new Uint32Array(n);
   for(let y=0;y<h;y+=2)for(let x=0;x<w;x+=2){
     const i=(y*w+x)*4,r=pixels[i],g=pixels[i+1],b=pixels[i+2],a=pixels[i+3];
     const ink=a>70&&(transparent||(r<cutoff||g<cutoff||b<cutoff||Math.max(r,g,b)-Math.min(r,g,b)>42));
     if(ink)counts[axis==='x'?x:y]++;
   }
   const top=Math.max(...counts),threshold=Math.max(2,Math.round(top*.033));
   let runs=[],start=-1;
   for(let i=0;i<n;i++){
     const positive=counts[i]>=threshold;
     if(positive&&start<0)start=i;
     if(!positive&&start>=0){runs.push([start,i-1]);start=-1;}
   }
   if(start>=0)runs.push([start,n-1]);
   // Bridge small gaps within a sprite; remove stray single-pixel marks.
   const gap=Math.max(4,Math.round(n*.009)),merged=[];
   for(const r of runs){
     if(merged.length&&r[0]-merged[merged.length-1][1]<gap)merged[merged.length-1][1]=r[1];
     else merged.push(r.slice());
   }
   runs=merged.filter(r=>r[1]-r[0]>Math.max(8,n*.026));
   if(runs.length!==4)return {split:[0,Math.round(n/4),Math.round(n/2),Math.round(n*3/4),n],exact:false,segments:runs};
   const splits=[0];
   for(let i=0;i<3;i++)splits.push(Math.round((runs[i][1]+runs[i+1][0])/2));
   splits.push(n);
   return {split:splits,exact:true,segments:runs};
 }
 async function loadSource(file){
   if(!file || !/image\/(png|webp)/.test(file.type))throw new Error('Please choose a PNG or WebP sprite sheet.');
   if(file.size>7_000_000)throw new Error('Sprite sheet is over 7 MB. Resize it before importing.');
   const url=URL.createObjectURL(file);
   try{
     const im=await imageFromURL(url);
     if(im.naturalWidth<120||im.naturalHeight<120)throw new Error('Please use a complete 4×4 sprite sheet.');
     const scale=Math.min(1,1700/Math.max(im.naturalWidth,im.naturalHeight));
     const w=Math.round(im.naturalWidth*scale),h=Math.round(im.naturalHeight*scale);
     const cv=el('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d',{willReadFrequently:true});
     g.imageSmoothingEnabled=false;g.drawImage(im,0,0,w,h);
     source=cv;currentFile=file;
     get('saNPCName').value=file.name.replace(/\.(png|webp)$/i,'').replace(/[_-]+/g,' ').slice(0,36);
     let corners=[];const p=g.getImageData(0,0,w,h).data;
     for(const [x,y] of [[0,0],[w-1,0],[0,h-1],[w-1,h-1]])corners.push(p[(y*w+x)*4+3]);
     get('saNPCRemoveWhite').checked=corners.filter(a=>a>150).length>=2;
     autoDetect();
   }finally{URL.revokeObjectURL(url);}
 }
 function autoDetect(){
   if(!source)return;
   const g=source.getContext('2d',{willReadFrequently:true}), data=g.getImageData(0,0,source.width,source.height).data;
   const opaqueWhite=get('saNPCRemoveWhite').checked,threshold=Number(get('saNPCWhite').value)||235;
   const xx=axisSplits(data,source.width,source.height,'x',threshold,!opaqueWhite);
   const yy=axisSplits(data,source.width,source.height,'y',threshold,!opaqueWhite);
   get('saNPCColumns').value=xx.split.slice(1,4).join(', ');
   get('saNPCRows').value=yy.split.slice(1,4).join(', ');
   detectInfo=(xx.exact&&yy.exact)?'Detected all four rows and columns.':'Automatic layout may need adjusting. Check the crop preview.';
   rebuildPreview();
 }
 // Only remove near-white pixels that are connected to a frame border. This preserves
 // white eyes, hair highlights and other internal sprite details.
 function removeBackground(image,threshold,removeWhite){
   const w=image.width,h=image.height,data=image.data,mask=new Uint8Array(w*h);
   if(!removeWhite)return image;
   const q=new Int32Array(w*h);let head=0,tail=0;
   const isBg=i=>{
     const p=i*4;const r=data[p],g=data[p+1],b=data[p+2],a=data[p+3];
     return a<40||(r>=threshold&&g>=threshold&&b>=threshold);
   };
   const offer=(x,y)=>{const i=y*w+x;if(mask[i]||!isBg(i))return;mask[i]=1;q[tail++]=i;};
   for(let x=0;x<w;x++){offer(x,0);offer(x,h-1);}
   for(let y=0;y<h;y++){offer(0,y);offer(w-1,y);}
   while(head<tail){const i=q[head++],x=i%w,y=Math.floor(i/w);
     if(x>0)offer(x-1,y);if(x+1<w)offer(x+1,y);if(y>0)offer(x,y-1);if(y+1<h)offer(x,y+1);
   }
   for(let i=0;i<mask.length;i++){
     const p=i*4;
     if(mask[i]){data[p]=0;data[p+1]=0;data[p+2]=0;data[p+3]=0;}
   }
   return image;
 }
 function makeImage(sourceCv,opts){
   const gx=decodeSplits(opts.columns,sourceCv.width),gy=decodeSplits(opts.rows,sourceCv.height);
   const offscreen=el('canvas');offscreen.width=sourceCv.width;offscreen.height=sourceCv.height;
   const g=offscreen.getContext('2d',{willReadFrequently:true});g.drawImage(sourceCv,0,0);
   const sprites=[];let biggestWidth=1,biggestHeight=1;
   const pad=cut(Number(opts.padding)||0,0,20);
   for(let row=0;row<4;row++){
     const fr=[];
     for(let col=0;col<4;col++){
       const left=gx[col],top=gy[row],w=gx[col+1]-left,h=gy[row+1]-top;
       const raw=g.getImageData(left,top,w,h);
       removeBackground(raw,opts.threshold,opts.removeWhite);
       // Reinsert each cleaned frame into a separate transparent source canvas.
       let x0=w,y0=h,x1=-1,y1=-1,ink=0;
       for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(raw.data[(y*w+x)*4+3]>20){
         x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);ink++;
       }
       if(ink<50)throw new Error(`No character detected in row ${row+1}, column ${col+1}. Adjust grid lines or white threshold.`);
       x0=cut(x0-pad,0,w-1);y0=cut(y0-pad,0,h-1);
       x1=cut(x1+pad+1,x0+1,w);y1=cut(y1+pad+1,y0+1,h);
       const cellCanvas=el('canvas');cellCanvas.width=w;cellCanvas.height=h;
       cellCanvas.getContext('2d').putImageData(raw,0,0);
       const sprite={canvas:cellCanvas,box:[x0,y0,x1-x0,y1-y0]};fr.push(sprite);
       biggestWidth=Math.max(biggestWidth,x1-x0);biggestHeight=Math.max(biggestHeight,y1-y0);
     }
     sprites.push(fr);
   }
   const factor=Math.min(116/biggestWidth,145/biggestHeight);
   const atlas=el('canvas');atlas.width=C*4;atlas.height=R*4;
   const ag=atlas.getContext('2d',{willReadFrequently:true});ag.imageSmoothingEnabled=false;
   const meta={cellW:C,cellH:R,frames:[]};
   for(let row=0;row<4;row++){
     const f=[];
     for(let col=0;col<4;col++){
       const sprite=sprites[row][col];const [x,y,w,h]=sprite.box;
       const dw=Math.max(1,Math.round(w*factor)),dh=Math.max(1,Math.round(h*factor));
       const dx=col*C+Math.floor((C-dw)/2),dy=row*R+(153-dh);
       ag.drawImage(sprite.canvas,x,y,w,h,dx,dy,dw,dh);
       // Sprite-tight metadata; feet anchor at pixel 153 and centre at 64.
       f.push({sx:dx,sy:dy,sw:dw,sh:dh,ax:C/2-(dx-col*C),ay:153-(dy-row*R)});
     }
     meta.frames.push(f);
   }
   const icon=el('canvas');icon.width=64;icon.height=80;
   const ig=icon.getContext('2d');ig.imageSmoothingEnabled=false;
   ig.drawImage(atlas,0,0,C,R,0,0,64,80);
   return {atlas:atlas.toDataURL('image/png'),src:icon.toDataURL('image/png'),meta,atlasCanvas:atlas};
 }
 function options(){return {columns:get('saNPCColumns').value,rows:get('saNPCRows').value,threshold:Number(get('saNPCWhite').value),removeWhite:get('saNPCRemoveWhite').checked,padding:Number(get('saNPCPadding').value)};}
 function rebuildPreview(){
   if(!source)return;
   try{
     processed=makeImage(source,options());
     warning(detectInfo+' 16 transparent frames ready. Preview: frame 1 → 2 → 3 → 4.');
     drawPreview();
   }catch(e){processed=null;warning('Crop needs adjustment: '+e.message);}
 }
 function drawPreview(){
   if(!processed)return;
   for(let row=0;row<4;row++){
     const cv=get('saNPCView'+row),g=cv.getContext('2d');
     g.clearRect(0,0,cv.width,cv.height);g.imageSmoothingEnabled=false;
     const frame=cycle[frameIndex%4];
     g.drawImage(processed.atlasCanvas,frame*C,row*R,C,R,0,0,cv.width,cv.height);
   }
 }
 function loop(t){
   if(!dialog||dialog.hidden)return;
   if(t-previewLast>155){frameIndex++;previewLast=t;drawPreview();}
   raf=requestAnimationFrame(loop);
 }
 function build(){
   const back=el('div',{id:'saNPCImportModal'});back.hidden=true;
   back.innerHTML=`<div id="saNPCImportCard" role="dialog" aria-modal="true" aria-label="Import animated NPC">
    <header><strong>🎞 NPC Sprite Importer</strong><button type="button" id="saNPCClose">✕ Close</button></header>
    <div class="saNPCImportScroll">
     <p>Upload one 4×4 PNG or WebP. Rows: down, left, right, up. All 16 poses are cut to their individual silhouettes with transparent backgrounds.</p>
     <label>Sprite sheet <input type="file" id="saNPCFile" accept="image/png,image/webp,.png,.webp"></label>
     <label>Character name <input type="text" id="saNPCName" maxlength="40" placeholder="New NPC"></label>
     <div class="saNPCControlRow"><label><input type="checkbox" id="saNPCRemoveWhite" checked> Remove white background</label><label>White cutoff <input type="range" id="saNPCWhite" min="205" max="252" value="235"></label></div>
     <div class="saNPCControlRow"><label>Top/side padding <input id="saNPCPadding" type="range" min="0" max="16" value="5"></label><button type="button" id="saNPCAuto">⟳ Auto-detect grid</button></div>
     <p>Adjust split positions only if the automatic detection missed a row or column. Values are pixels in your resized image.</p>
     <div class="saNPCControlRow"><label>Column splits <input type="text" id="saNPCColumns" aria-label="Three column splits"></label><label>Row splits <input type="text" id="saNPCRows" aria-label="Three row splits"></label></div>
     <div class="saNPCPreviewGrid">${order.map((name,i)=>`<div><canvas width="128" height="160" id="saNPCView${i}"></canvas><span>${name}</span></div>`).join('')}</div>
     <div id="saNPCStatus" role="status">Choose a sprite sheet to begin.</div>
     <div class="saNPCControlRow"><button id="saNPCAdd" type="button">＋ Save NPC to World Studio</button><button id="saNPCCancel" type="button">Cancel</button></div>
    </div>
   </div>`;
   document.body.append(back);dialog=back;
   get('saNPCClose').addEventListener('click',close);get('saNPCCancel').addEventListener('click',close);
   get('saNPCFile').addEventListener('change',async e=>{try{if(e.target.files[0])await loadSource(e.target.files[0]);}catch(err){warning(err.message);}});
   get('saNPCAuto').addEventListener('click',autoDetect);
   for(const id of ['saNPCColumns','saNPCRows'])get(id).addEventListener('change',rebuildPreview);
   for(const id of ['saNPCRemoveWhite','saNPCWhite','saNPCPadding'])get(id).addEventListener('change',rebuildPreview);
   get('saNPCAdd').addEventListener('click',()=>{
     if(!processed){warning('Preview a complete 16-pose sprite sheet before importing.');return;}
     const name=get('saNPCName').value.trim();if(!name){warning('Please enter a character name.');return;}
     if(processed.atlas.length>800_000){warning('NPC is too large for browser storage. Resize the image and retry.');return;}
     saveCallback?.({name,src:processed.src,atlas:processed.atlas,meta:processed.meta,w:64,h:80});
     close();
   });
 }
 window.SANPCImporter={open(callback){if(!dialog)build();saveCallback=callback;source=null;currentFile=null;processed=null;frameIndex=0;get('saNPCFile').value='';get('saNPCName').value='';warning('Choose a 4×4 sprite sheet to begin.');dialog.hidden=false;previewLast=0;cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);},close};
})();

