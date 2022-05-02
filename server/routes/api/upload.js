const express = require("express");
const configs = require("../../configs");
const router = express.Router();
const dbh = require("../../data/dbhandler");
const parser = require("../../autoparser");
const fs = require("fs");
const fsp = require("fs").promises;
const convert = require("../../tools/tga2png").convert;
const s3 = require("../../aws/storage");
const validateRequestAuth = require("../../authUtil").validateRequestAuth;
const pk3Magic = `504b0304`; //magic bytes of pk3 files

router.post("/", async (req, res, next) => {
  if (
    !(await validateMapFile(req, res)) ||
    !(await validateRequestAuth(req, res))
  ) {
    req.files && req.files.map && wipeFile(req.files.map.tempFilePath);
    return;
  }

  try {
    /**
     * Parse map from pk3.
     */
    const mapInfo = await parser.parseMapInfo(req.files.map.tempFilePath);
    mapInfo.pkName = req.files.map.name;
    mapInfo.size = req.files.map.size;
    console.log(mapInfo);
    const savedMap = await dbh.saveMap(mapInfo);
    if (!savedMap) {
      let err;
      if (savedMap.error && savedMap.error.constraint === "unique_mapname") {
        err = new Error("Map already exists.");
      } else {
        err = new Error("Map saving to database failed.");
      }
      err.status = 422;
      throw err;
    }
    console.log(savedMap);
    /**
     * Upload map to S3 and add db entry for the map file.
     */
    await uploadMapPk3(req.files.map.tempFilePath, mapInfo, savedMap);

    /**
     * Delete pk3, no longer needed
     */
    wipeFile(req.files.map.tempFilePath);

    /**
     * Handle levelshots.
     * Convert to png, then save them to db.
     */
    if (mapInfo.levelshots.default) {
      await convert(
        configs.savePath + mapInfo.levelshots.default,
        configs.savePath + mapInfo.levelshots.default + ".png"
      );

      /**
       * WARN: this stores whole file in memory twice
       * Hopefully it's not abused.
       */
      const levelshotData = await fsp.readFile(
        configs.savePath + mapInfo.levelshots.default + ".png"
      );

      await dbh.insertLevelshot(
        mapInfo.levelshots.default,
        mapInfo.levelshots.default + ".png",
        "\\x" + Buffer.from(levelshotData.buffer).toString("hex"),
        "default",
        savedMap.id
      );
      wipeFile(configs.savePath + mapInfo.levelshots.default);
    }

    if (mapInfo.levelshots.cc) {
      await convert(
        configs.savePath + mapInfo.levelshots.cc,
        configs.savePath + mapInfo.levelshots.cc + ".png"
      );

      /**
       * WARN: this stores whole file in memory twice
       * Hopefully it's not abused.
       */
      const levelshotData = await fsp.readFile(
        configs.savePath + mapInfo.levelshots.cc + ".png"
      );

      await dbh.insertLevelshot(
        mapInfo.levelshots.cc,
        mapInfo.levelshots.cc + ".png",
        "\\x" + Buffer.from(levelshotData.buffer).toString("hex"),
        "cc",
        savedMap.id
      );
      wipeFile(configs.savePath + mapInfo.levelshots.cc);
    }

    mapInfo.uploadedInfo = {
      levelshotcc: mapInfo.levelshots.cc,
      levelshot: mapInfo.levelshots.default,
      id: savedMap.id,
    };

    res.status(200).json(mapInfo);
    return;
  } catch (err) {
    next(err);
    wipeFile(req.files.map.tempFilePath);
    return;
  }
});

/**
 * Validates the pk3 file for correct magic byte, will also finalize the request if not satisfied.
 * @param {*} req express request
 * @param {*} res express response
 * @returns true of valid, false if invalid
 */
const validateMapFile = async (req, res) => {
  if (!req.files || !req.files.map) {
    res.status(403).send("No file selected for upload.");
    return false;
  }

  let fileStream = fs.createReadStream(req.files.map.tempFilePath, {
    start: 0,
    end: 4,
  });
  let fileMagic = "";

  for await (const chunk of fileStream) {
    fileMagic = chunk.toString("hex");
  }

  if (!fileMagic.startsWith(pk3Magic)) {
    res.status(403).send("Invalid pk3 file. Pick a different file.");
    return false;
  }

  return true;
};

const uploadMapPk3 = async (path, mapInfo, savedMap) => {
  console.log(mapInfo);
  try {
    const uploadResult = await s3.uploadMap(path, mapInfo.pkName);
    uploadResult.mapId = savedMap.id;
    uploadResult.key = uploadResult.key || "";
    uploadResult.tmpName = path;
    await dbh.saveMapCloudFile(uploadResult);
    console.log(JSON.stringify(uploadResult));
  } catch (err) {
    console.warn("PK3 Upload to s3 failed: ", err);
  }
};

/**
 * Deletes a file with the provided path.
 * @param {*} filePath to delete
 */
function wipeFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

module.exports = router;
