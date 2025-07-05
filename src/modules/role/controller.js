const { createRoleDb, getRolesDB, updateRoleDB } = require("./services");

const createRole = async (req, res, next) => {
  try {
    const role = await createRoleDb(req);
    res.status(200).json(role);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

const getRoles = async (req, res, next) => {
  try {
    const roles = await getRolesDB(req);
    res.status(200).json(roles);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const role = await updateRoleDB(req);
    res.status(200).json(role);
  } catch (err) {
    console.log("Error crating User:", err);
    next(err);
  }
};

module.exports = {
  createRole,
  getRoles,
  updateRole,
};
