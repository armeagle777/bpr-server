const mojCivilRoute = require("express").Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");
const { permissionsMap } = require("../../utils/constants");
const { getCivilCasesData } = require("./controller");

const { ADMIN, MOJ_CIVIL } = permissionsMap;

mojCivilRoute.get(
  "/cases/:psn",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, MOJ_CIVIL.uid]),
  getCivilCasesData
);

module.exports = mojCivilRoute;
