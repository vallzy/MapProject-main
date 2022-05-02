var AWS = require("aws-sdk");
var fs = require("fs");
const fsp = require("fs").promises;
const configs = require("../configs");
// Set the Region
AWS.config.update({ region: "eu-west-2" });
// Create S3 service object
let s3 = new AWS.S3({ apiVersion: "2006-03-01" });
const BUCKET = "etdb-tjmaps";

/**
 * Uploads map file to AWS storage
 * @param {*} srcPath of file on local disk
 * @param {*} originalName of file
 * @returns promise resolving with the upload metadata
 */
const uploadMap = (srcPath, originalName) => {
  return new Promise((resolve, reject) => {
    if (!srcPath) {
      reject("no_file");
    }

    let fStream = fs.createReadStream(srcPath);
    fStream.on("error", function (err) {
      console.log("File Error", err);
      reject("stream_err");
    });

    var uploadParams = { Bucket: BUCKET, Key: originalName, Body: fStream };
    s3.upload(uploadParams, (err, uploadResult) => {
      if (err) {
        console.log(err);
        reject(err);
      }

      if (uploadResult) {
        resolve(uploadResult);
      } else {
        reject("no_upload_data");
      }
    });
  });
};

/**
 * Fetches a file from s3 and saves it to local tmp storage.
 * @param {*} key s3 key of object
 * @returns promise resolving with s3 object info and localPath
 */
const downloadMap = (key) => {
  return new Promise((resolve, reject) => {
    s3.getObject(
      {
        Bucket: BUCKET,
        Key: key,
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          fsp
            .writeFile(configs.savePath + key)
            .then(() => {
              data.localPath = configs.savePath + key;
              resolve(data);
            })
            .catch((fsErr) => {
              reject(fsErr);
            });
        }
      }
    );
  });
};

const listFiles = () => {
  return new Promise((resolve, reject) => {
    s3.listObjects({ Bucket: BUCKET }, (err, data) => {
      if (err) {
        reject(err);
      }

      resolve(data);
    });
  });
};

module.exports = {
  uploadMap,
  downloadMap,
  listFiles,
};
