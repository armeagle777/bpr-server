const { getDisplacementDataDB } = require("./services");

const getDisplacementData = async (req, res, next) => {
  try {
    const roles = await getDisplacementDataDB(req);
    res.status(200).json(roles);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

module.exports = {
  getDisplacementData,
};
