addEventListener("install", ()=>console.log("installed sw"));
addEventListener("activate", ()=>console.log("activated sw"));

addEventListener("fetch", event=>{
  console.log(`handling fetch of ${event.request.url} for ${event.clientId}`);
});
