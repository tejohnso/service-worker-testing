addEventListener("install", ()=>console.log("installed sw"));
addEventListener("activate", ()=>console.log("activated sw"));

addEventListener("fetch", event=>{
  console.log(`main sw handling fetch of ${event.request.url} for ${event.clientId}`);

  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/test-bucket-tyler")) {
    event.respondWith(
      caches.open("test-cache")
      .then(cache=>cache.match(url.pathname))
    );
  }
})
