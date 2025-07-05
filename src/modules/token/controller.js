const { generateToken } = require("../../utils/common");
const { saveTokenDB, refreshTokenDB } = require("./services");

const saveToken = async (req, res, next) => {
  try {
    const token = await saveTokenDB();
    res.status(200).json(token);
  } catch (err) {
    next(err);
  }
  const { accessToken, refreshToken } = await generateToken();
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    const userData = await refreshTokenDB(refreshToken);
    if (!userData) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }
    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.status(200).json(userData);
  } catch (err) {
    next(err);
  }
};

module.exports = { refreshToken, saveToken };
