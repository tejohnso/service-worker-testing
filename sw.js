addEventListener("install", ()=>console.log("installing main sw"));

addEventListener("activate", ()=>console.log("activated sw"));

onmessage = event=>{
  console.log("Service worker received message", event);
  event.source.postMessage("Hello from root path sw");
};

addEventListener("fetch", event=>{
  console.log(`main sw handling fetch of ${event.request.url} for ${event.clientId}`);

  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/test-bucket-tyler")) {
    event.respondWith(caches.match(url.pathname));
  }
})
