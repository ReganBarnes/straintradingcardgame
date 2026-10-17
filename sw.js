/* Strain Adventures optimised beta - read-only static asset caching. */
const VERSION='sa-v255-beta-c8e18ddce4bc759c';
const PREFIX='strain-beta-';
self.addEventListener('install',event=>{event.waitUntil(self.skipWaiting());});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{
 const keys=await caches.keys();
 await Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==PREFIX+VERSION).map(key=>caches.delete(key)));
 await self.clients.claim();
})());});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;
 const url=new URL(req.url);
 // Never cache HTML, JS, CSS or mutable editor JSON: they should update normally.
 if(!/\.(png|jpg|jpeg|webp|gif)$/i.test(url.pathname))return;
 event.respondWith((async()=>{
   const cache=await caches.open(PREFIX+VERSION);
   const hit=await cache.match(req);
   if(hit)return hit;
   const resp=await fetch(req);
   if(resp.ok)event.waitUntil(cache.put(req,resp.clone()).catch(()=>{}));
   return resp;
 })());
});
