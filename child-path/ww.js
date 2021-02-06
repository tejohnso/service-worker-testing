const remoteFilePath = "https://storage.googleapis.com/storage/v1/b/BUCKET/o/OBJECT?alt=media";

onconnect = connectEvent=>{
  console.log("worker connection");

  const externalDomainUrl = "https://storage.googleapis.com/storage/v1/b/test-bucket-tyler/o/test-content.json?alt=media";
  fetch(externalDomainUrl).then(resp=>console.log("retrieved external domain file"));

  fetch("test.json").then(resp=>console.log("retrieved local domain file"));

  connectEvent.ports[0].onmessage = downloadAndCache(msgEvent);
};

function downloadAndCache(msgEvent) {
  if (!msgEvent.data) {return};

  const {filePath} = msgEvent.data;
  if (!filePath) {return;}

  const [bucket, ...object] = filePath.split("/")

  const contentUrl = remoteFilePath.replace("BUCKET", bucket)
  .replace("OBJECT", object.join("/"));

  fetch(contentUrl).then(resp=>{
    console.log("caching content");
    caches.open("test-cache")
    .then(cache=>cache.put([bucket, ...object].join("/"), resp))
    .then(()=>msgEvent.source.postMessage({filePath}));
  });
}
