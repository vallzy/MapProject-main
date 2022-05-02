const s3 = require("./storage");

s3.listFiles()
  .then((obj) => {
    console.log(obj);
  })
  .catch((err) => {
    console.log(err);
  });
