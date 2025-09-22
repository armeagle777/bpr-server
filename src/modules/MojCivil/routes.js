const mojCivilRoute = require("express").Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");
const { permissionsMap } = require("../../utils/constants");
const { getCivilCasesData, getBeneficiaryData } = require("./controller");

const { ADMIN, MOJ_CIVIL } = permissionsMap;

mojCivilRoute.get(
  "/cases/:psn",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, MOJ_CIVIL.uid]),
  getCivilCasesData
);

mojCivilRoute.get(
  "/beneficiary/:psn",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, MOJ_CIVIL.uid]),
  getBeneficiaryData
);

module.exports = mojCivilRoute;
