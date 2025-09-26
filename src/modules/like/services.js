const { Like, LikeType } = require("../../config/database");

const getLikesDB = async (req) => {
  const { user } = req;
  const { id: userId } = user;
  const likeTypeName = req.query?.likeTypeName;

  const likes = await Like.findAll({
    where: { userId },
    attributes: { exclude: ["userId"] },
    include: [
      {
        model: LikeType,
        where: likeTypeName ? { name: likeTypeName } : undefined,
        attributes: [],
      },
    ],
    order: [["createdAt", "DESC"]],
    limit: 5,
  });

  return {
    likes,
  };
};

const createLikeDb = async (req) => {
  const { user, body } = req;
  const { id: userId } = user;

  const { fields, likeTypeName } = body;
  const sanitizedFields = Object.fromEntries(
    Object.entries(fields)?.filter(([_, v]) => Boolean(v))
  );

  // find the LikeType row
  const likeType = await LikeType.findOne({ where: { name: likeTypeName } });
  if (!likeType) {
    throw new Error(`LikeType '${likeTypeName}' not found`);
  }

  const newLikeRow = await Like.create({
    fields: sanitizedFields,
    userId,
    likeTypeId: likeType.id,
  });

  return {
    data: newLikeRow,
  };
};

module.exports = {
  createLikeDb,
  getLikesDB,
};
