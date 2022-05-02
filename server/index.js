const express = require("express");
const cors = require("cors");
const db = require("./data/dbinit");
const fileUpload = require("express-fileupload");
const configs = require("./configs");

const app = express();
app.use(express.json());
app.use(cors());
app.use(
  fileUpload({
    limits: { fileSize: 210 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: configs.savePath,
  })
);

const mapRouter = require("./routes/api/maps");
const loginRouter = require("./routes/api/login");
const uploadRouter = require("./routes/api/upload");
const imageRouter = require("./routes/api/images");
app.use("/api/maps", mapRouter);
app.use("/login", loginRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/img", imageRouter);
app.use(express.static('client/dist'))

/**
 * Error route.
 */
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, _next) {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message);
});

const port = process.env.PORT || 3000;

db.initSchema().then(async () => {
  app.listen(port, () => console.log(`Server listening on port: ${port}`));
});
