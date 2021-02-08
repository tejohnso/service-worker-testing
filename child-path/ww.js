const remoteFilePath = "https://storage.googleapis.com/storage/v1/b/BUCKET/o/OBJECT?alt=media";

onconnect = connectEvent=>{
  console.log("shared worker connection");

  connectEvent.ports[0].onmessage = handleMessage;
  connectEvent.ports[0].postMessage({msg: "ready"});
};

function handleMessage(msgEvent) {
  if (!msgEvent.data) {return;}

  if (msgEvent.data.filePath) {return downloadAndCache(msgEvent);}
}

function downloadAndCache(msgEvent) {
  if (!msgEvent.data) {return;}

  const fileObserver = msgEvent.source || msgEvent.srcElement;

  const {filePath} = msgEvent.data;
  if (!filePath) {return;}
  if (filePath[0] !== "/") {return fileObserver.postMessage({error: "invalid path"});}

  const [bucket, ...objectPathElements] = filePath.split("/").slice(1);

  const contentUrl = remoteFilePath.replace("BUCKET", bucket)
  .replace("OBJECT", objectPathElements.join("/"));

  fetch(contentUrl).then(resp=>{
    console.log("caching content");
    caches.open("test-cache")
    .then(cache=>cache.put(["", bucket, ...objectPathElements].join("/"), resp))
    .then(()=>fileObserver.postMessage({filePath}));
  });
}
