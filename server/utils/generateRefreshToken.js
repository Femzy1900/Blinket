const jwt = require("jsonwebtoken");
import UserModel from "../models/user.model";

const generateRefreshToken = async (userId) => {
  const token = jwt.sign({ id: userId }, process.env.SECRET_KEY_REFRESH_TOKEN, {
    expiresIn: "30d",
  });

  const updateRefreshTokenUser = await UserModel.updateOne(
    { _id: userId },
    {
        refreshToken: token,
    }
  )

  return token;
};

export default generateRefreshToken;