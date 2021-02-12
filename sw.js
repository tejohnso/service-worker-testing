addEventListener("install", ()=>console.log("installing main sw"));

addEventListener("activate", ()=>console.log("activated sw"));

onmessage = event=>{
  console.log("Service worker received message", event);
  event.source.postMessage("Hello from root path sw");
};

addEventListener("fetch", event=>{
  const pathname = new URL(event.request.url).pathname;

  event.respondWith(
    pathname.startsWith("/test-bucket-tyler") ? 
      caches.match(pathname) :
      fetch(event.request)
  );
})
