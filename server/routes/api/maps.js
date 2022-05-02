const express = require("express");
const dbh = require("../../data/dbhandler");
const validateRequestAuth = require("../../authUtil").validateRequestAuth;
const router = express.Router();

router.post("/", async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  let worldSettings;
  if (req.body) {
    worldSettings = req.body.worldSettings;
  }

  const result = await dbh.getMaps(limit, page * limit, worldSettings);
  res.send(result);
});

router.get("/:mapid", async (req, res) => {
  const mapId = req.params.mapid;
  const result = await dbh.getMapById(mapId);
  res.send(result);
});

router.post("/:mapid", async (req, res) => {
  const mapId = req.params.mapid;
  if (!(await validateRequestAuth(req, res))) {
    return;
  }
  dbh.updateMapClassification(req.body);
  res.send(mapId);
});

module.exports = router;
