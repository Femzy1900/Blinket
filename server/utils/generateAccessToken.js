const jwt = require("jsonwebtoken");

const generateAccessToken = async (userId) => {
  const token = jwt.sign({ id: userId }, 
    process.env.SECRET_ACCESS_TOKEN, {
    expiresIn: "5H",
  });

  return token;
};

module.exports = generateAccessToken;
