const icRoute = require("express").Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");
const { permissionsMap } = require("../../utils/constants");
const { getWeaponsData } = require("./controller");

const { WEAPON, ADMIN } = permissionsMap;

icRoute.post(
  "/weapons",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, WEAPON.uid]),
  getWeaponsData
);

module.exports = icRoute;
