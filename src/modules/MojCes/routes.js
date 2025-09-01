const mojCesRoute = require("express").Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");
const { permissionsMap } = require("../../utils/constants");
const { getDebtorData } = require("./controller");

const { MOJ_CES, ADMIN } = permissionsMap;

mojCesRoute.post(
  "/debtor-info",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, MOJ_CES.uid]),
  getDebtorData
);

module.exports = mojCesRoute;
