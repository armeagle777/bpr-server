const { Permission } = require("../../config/database");

const getPermissionsDB = async (req) => {
  const permissions = await Permission.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  return {
    permissions,
  };
};

module.exports = {
  getPermissionsDB,
};
