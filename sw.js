let cacheStorage;

addEventListener("install", event=>{
  console.log("installing main sw");
  event.waitUntil(caches.open("test-cache").then(cache=>cacheStorage = cache));
});

addEventListener("activate", ()=>console.log("activated sw"));

onmessage = event=>{
  console.log("Service worker received message", event);
  event.source.postMessage("Hello from root path sw");
};

addEventListener("fetch", event=>{
  console.log(`main sw handling fetch of ${event.request.url} for ${event.clientId}`);

  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/test-bucket-tyler")) {
    event.respondWith(cacheStorage.match(url.pathname));
  }
})
