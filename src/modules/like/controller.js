const { createLikeDb, getLikesDB, deleteLikeDB } = require("./services");

const createLike = async (req, res, next) => {
  try {
    const like = await createLikeDb(req);
    res.status(200).json(like);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

const getLikes = async (req, res, next) => {
  try {
    const likes = await getLikesDB(req);
    res.status(200).json(likes);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

const deleteLike = async (req, res, next) => {
  try {
    const deletedLike = await deleteLikeDB(req);
    res.status(200).json(deletedLike);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

module.exports = {
  createLike,
  getLikes,
  deleteLike,
};
