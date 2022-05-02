const express = require("express");
const dbh = require("../../data/dbhandler");
const router = express.Router();

router.get("/:imgname", async (req, res) => {
  let imgs = await dbh.loadImage(req.params.imgname);
  if (!imgs[0] || !imgs[0].data) {
    res.status(404).send("No image found.");
    return;
  }

  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Disposition": "inline",
    "Content-Length": imgs[0].data.length,
  });
  res.end(Buffer.from(imgs[0].data.buffer), "binary");
});

module.exports = router;
