require("dotenv").config();
const jsonwebtoken = require("jsonwebtoken");

const issueJWT = (uid) => {
  const payload = {
    uid: uid,
  };
  const expiresIn = "7d";

  const signedToken = jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });

  return {
    token: "Bearer " + signedToken,
    expiresIn,
  };
};

module.exports = { issueJWT };
