const {
  createUserData,
  generateTokens,
  validateRefreshToken,
} = require("../../utils/common");
const ApiError = require("../../exceptions/api-error");
const { Token } = require("../../config/sphereDatabase");

const saveTokenDB = async (userId, refreshToken) => {
  try {
    const [tokenData, created] = await Token.upsert(
      {
        userId: userId,
        refreshToken: refreshToken,
      },
      {
        returning: true,
      }
    );
    return tokenData;
  } catch (err) {
    throw ApiError.BadRequest(err.message);
  }
};

const deleteTokenDB = async (userId) => {
  try {
    const tokenData = await Token.destroy({
      where: {
        userId,
      },
    });
    return tokenData;
  } catch (err) {
    throw ApiError.BadRequest(err.message);
  }
};

const refreshTokenDB = async (refreshToken) => {
  try {
    if (!refreshToken) {
      throw ApiError.BadRequest("Refresh token is required");
    }

    const userData = await validateRefreshToken(refreshToken);

    const tokenFromDb = await token.findUnique({
      where: {
        userId: userData.id,
      },
    });

    if (!tokenFromDb || !userData) {
      throw ApiError.UnauthorizedError("User not Authorized");
    }

    const userNewData = await user.findUnique({
      where: {
        id: userData.id,
      },
    });
    const userInfo = createUserData(userNewData);

    const tokens = await generateTokens(userInfo);

    await saveTokenDB(userData.id, tokens.refreshToken);

    return { ...tokens, userData: userInfo };
  } catch (err) {
    throw ApiError.BadRequest(err.message);
  }
};

module.exports = { saveTokenDB, deleteTokenDB, refreshTokenDB };
