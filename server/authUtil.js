const util = require("util");
const jwt = require("jsonwebtoken");
const configs = require("./configs");

var jwtVerifyAsync = util.promisify(jwt.verify, jwt);

const validateRequestAuth = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    try {
      const tokenParsed = await jwtVerifyAsync(token, configs.secret);
      if (!tokenParsed || tokenParsed.role !== "admin") {
        throw new Error("Invalid auth");
      }
    } catch (err) {
      res.status(401).send("Invalid authentication.");
      return false;
    }
  } else {
    res.status(401).send("Invalid authentication.");
    return false;
  }

  return true;
};

module.exports = {
  validateRequestAuth,
};
