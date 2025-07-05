const { Op } = require("sequelize");

const ApiError = require("../../exceptions/api-error");
const { Like } = require("../../config/sphereDatabase");

const getLikesDB = async (req) => {
  const { user } = req;
  const { id: userId } = user;
  const likes = await Like.findAll({
    where: { userId },
    attributes: { exclude: ["userId"] },
  });

  return {
    likes,
  };
};

const createLikeDb = async (req) => {
  const { user, params, body } = req;
  const { id: userId } = user;
  const { uid } = params;
  const { text } = body;
  let responseData;

  const likeRow = await Like.findOne({
    where: { uid, userId },
  });

  if (likeRow) {
    responseData = likeRow;
    await likeRow.destroy();
  } else {
    const newLikeRow = await Like.create({
      uid,
      userId,
      text,
    });
    responseData = newLikeRow;
  }
  return {
    data: responseData,
  };
};

module.exports = {
  createLikeDb,
  getLikesDB,
};
