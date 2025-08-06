const { Permission } = require("../../config/database");

const GetRolesIncludeModel = [
  {
    model: Permission,
    through: { attributes: [] },
    attributes: ["id", "name"],
  },
];

module.exports = { GetRolesIncludeModel };
