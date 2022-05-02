// Load the SDK for JavaScript
var AWS = require("aws-sdk");
// Set the Region
AWS.config.update({ region: "eu-west-2" });

console.log(AWS.config.credentials);
// Create S3 service object
let s3 = new AWS.S3({ apiVersion: "2006-03-01" });

var uploadParams = { Bucket: "etdb-tjmaps", Key: "", Body: "" };
var file = "C:/temp/nodown.png";

// Configure the file stream and obtain the upload parameters
var fs = require("fs");
var fileStream = fs.createReadStream(file);
fileStream.on("error", function (err) {
  console.log("File Error", err);
});
uploadParams.Body = fileStream;
var path = require("path");
uploadParams.Key = path.basename(file);

// // call S3 to retrieve upload file to specified bucket
// s3.upload(uploadParams, function (err, data) {
//     if (err) {
//         console.log("Error", err);
//     } if (data) {
//         console.log("Upload Success", data.Location);
//     }
// });

// // Call S3 to obtain a list of the objects in the bucket
// s3.listObjects(bucketParams, function(err, data) {
//     if (err) {
//       console.log("Error", err);
//     } else {
//       console.log("Success", data);
//     }
//   });

s3.getObject(
  { Bucket: "etdb-tjmaps", Key: "nodown.png" },
  function (error, data) {
    if (error != null) {
      console.log("Failed to retrieve an object: " + error);
    } else {
      console.log("Loaded " + data.ContentLength + " bytes");
      fs.writeFileSync("C:/temp/nodown_cloud.png", data.Body);
      // do something with data.Body
    }
  }
);

// s3.listObjects(bucketParams, function (err, data) {
//     if (err) {
//         console.log("Error", err);
//     } else {
//         console.log("Success", data);
//     }
// });
