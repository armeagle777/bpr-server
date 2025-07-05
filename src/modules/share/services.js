const { Op, Sequelize } = require("sequelize");

const ApiError = require("../../exceptions/api-error");
const { Share, User } = require("../../config/sphereDatabase");

const getSharesDB = async (req) => {
  const { user } = req;
  const { id: userId } = user;
  const shares = await Share.findAll({
    where: { toUserId: userId, isRead: false },
    attributes: { exclude: ["toUserId", "fromUserId", "isDeleted"] },
    include: [
      {
        model: User,
        as: "Sender",
        attributes: ["firstName", "lastName"],
      },
    ],
  });
  return {
    shares,
  };
};

const shareInfoDb = async (req) => {
  const { user, params, body } = req;
  const { id: userId } = user;

  const { uid, text, comment, receivers } = body;
  if (!uid || !text || !receivers.length) {
    throw ApiError.BadRequest("Missing fields");
  }
  const insertions = receivers?.map((receiverId) => ({
    uid,
    text,
    comment,
    fromUserId: userId,
    toUserId: receiverId,
  }));

  const newLikeRows = await Share.bulkCreate(insertions);

  return {
    data: newLikeRows,
  };
};

const removeShareDB = async (req) => {
  const { params, body, user } = req;
  const { id } = params;
  if (id != body.id) {
    throw ApiError.BadRequest("Incorrect data");
  }

  const share = await Share.findByPk(+id);

  if (!share) {
    throw ApiError.BadRequest("Share doesn't exists");
  }

  if (share.toUserId !== user.id) {
    throw ApiError.BadRequest("You are not allowed to delete");
  }

  const updatedShare = await share.update({ isRead: true });

  return updatedShare;
};

module.exports = {
  shareInfoDb,
  getSharesDB,
  removeShareDB,
};
