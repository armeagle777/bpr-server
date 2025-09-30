const { Like, LikeType } = require("../../config/database");

const getLikesDB = async (req) => {
  const { user } = req;
  const { id: userId } = user;
  const likeTypeName = req.query?.likeTypeName;

  const pageSize = req?.query?.pageSize ? Number(req.query?.pageSize) : 3;
  const page = req?.query?.page ? Number(req.query?.page) : 1;

  // const likes = await Like.findAll({
  //   where: { userId },
  //   attributes: { exclude: ["userId"] },
  //   include: [
  //     {
  //       model: LikeType,
  //       where: likeTypeName ? { name: likeTypeName } : undefined,
  //       attributes: ["name"],
  //     },
  //   ],
  //   order: [["createdAt", "DESC"]],
  //   limit: pageSize,
  // });

  // return {
  //   likes,
  // };

  const { count, rows } = await Like.findAndCountAll({
    where: { userId },
    attributes: { exclude: ["userId"] },
    include: [
      {
        model: LikeType,
        where: likeTypeName ? { name: likeTypeName } : undefined,
        attributes: ["name"],
      },
    ],
    order: [["createdAt", "DESC"]],
    offset: (page - 1) * pageSize,
    limit: +pageSize,
  });

  return {
    data: rows,
    pagination: {
      total: count,
      page: +page,
      pageSize: +pageSize,
      totalPages: Math.ceil(count / pageSize),
    },
  };
};

const deleteLikeDB = async (req) => {
  const id = req.params.id;

  const like = await Like.findByPk(id, {
    include: [
      {
        model: LikeType,
        attributes: ["name"],
      },
    ],
  });

  if (!like) {
    return { success: false, message: "Like not found" };
  }
  await like.destroy();
  return like;
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
  deleteLikeDB,
};
