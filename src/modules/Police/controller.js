const { getWeaponsDataDB } = require("./services");

const getWeaponsData = async (req, res, next) => {
  try {
    const weaponse = await getWeaponsDataDB(req);

    res.status(200).json(weaponse);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getWeaponsData,
};
