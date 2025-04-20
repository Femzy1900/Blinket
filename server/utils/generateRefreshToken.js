const jwt = require("jsonwebtoken");
import UserModel from "../models/user.model";

const generateRefreshToken = async (userId) => {
  const token = jwt.sign({ id: userId }, process.env.SECRET_KEY_ACCESS_TOKEN, {
    expiresIn: "30d",
  });

  const updateRefreshToken = await UserModel.updateOne(
    { _id: userId },
    {
        refreshToken: token,
    }
  )

  return token;
};

export default generateRefreshToken;