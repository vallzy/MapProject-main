var AWS = require('aws-sdk');
var fs = require('fs');
// Set the Region 
AWS.config.update({ region: 'eu-west-2' });
console.log(AWS.config.credentials);
// Create S3 service object
let s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const bucketName = 'etdb-tjmaps';

let uploadFile = new Promise((resolve, reject) => {

    var fileStream = fs.createReadStream(file);

    fileStream.on('error', function (err) {
        reject(new Error("File stream threw an error."));
    });
    uploadParams.Body = fileStream;
    var path = require('path');
    uploadParams.Key = path.basename(file);

    s3.upload(uploadParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        }
        if (data) {
            console.log("Upload Success", data.Location);
        }
    });
})