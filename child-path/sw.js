addEventListener("install", ()=>console.log("installed sw"));
addEventListener("activate", ()=>console.log("activated sw"));

onmessage = event=>{
  console.log("Child path service worker received message", event);

  if (!event.data) {return;}
  if (event.data.filePath) {return downloadAndCache(event);}
};

addEventListener("fetch", event=>{
  console.log(`child path sw handling fetch of ${event.request.url} for ${event.clientId}`);
});

function downloadAndCache(event) {
  const remoteFilePath = "https://storage.googleapis.com/storage/v1/b/BUCKET/o/OBJECT?alt=media";
  const fileConsumer = event.source || event.srcElement;

  const {filePath} = event.data;
  if (filePath[0] !== "/") {return fileConsumer.postMessage({error: "invalid path"});}

  const [bucket, ...objectPathElements] = filePath.split("/").slice(1);

  const contentUrl = remoteFilePath.replace("BUCKET", bucket)
  .replace("OBJECT", objectPathElements.join("/"));

  fetch(contentUrl).then(resp=>{
    console.log("caching content");
    caches.open("test-cache")
    .then(cache=>cache.put(["", bucket, ...objectPathElements].join("/"), resp))
    .then(()=>fileConsumer.postMessage({filePath}));
  });
}
