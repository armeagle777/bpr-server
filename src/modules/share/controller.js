const { shareInfoDb, getSharesDB, removeShareDB } = require("./services");

const shareInfo = async (req, res, next) => {
  try {
    const share = await shareInfoDb(req);
    res.status(200).json(share);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

const getShares = async (req, res, next) => {
  try {
    const shares = await getSharesDB(req);
    res.status(200).json(shares);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

const removeShare = async (req, res, next) => {
  try {
    const share = await removeShareDB(req);
    res.status(200).json(share);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

module.exports = {
  shareInfo,
  getShares,
  removeShare,
};
