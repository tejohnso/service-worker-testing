onconnect = event=>{
  console.log("worker connection");

  const externalDomainUrl = "https://storage.googleapis.com/storage/v1/b/test-bucket-tyler/o/test-content.json?alt=media";

  fetch(externalDomainUrl).then(resp=>console.log("retrieved external domain file"));

  fetch("test.json").then(resp=>console.log("retrieved local domain file"));
};
