const { getPermissionsDB } = require("./services");

const getPermissions = async (req, res, next) => {
  try {
    const permissions = await getPermissionsDB(req);
    res.status(200).json(permissions);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

module.exports = {
  getPermissions,
};
