const roadPoliceRoute = require("express").Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");
const { permissionsMap } = require("../../utils/constants");
const {
  getTransactionsData,
  getViolationsData,
  searchDrivingLicenses,
} = require("./controller");

const {
  ROADPOLICE_TRANSACTIONS,
  ADMIN,
  ROADPOLICE_VIOLATIONS,
  ROADPOLICE_FULL_SEARCH,
} = permissionsMap;

roadPoliceRoute.get(
  "/persons/:psn/transactions",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, ROADPOLICE_TRANSACTIONS.uid]),
  getTransactionsData
);

roadPoliceRoute.get(
  "/persons/:psn/violations",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, ROADPOLICE_VIOLATIONS.uid]),
  getViolationsData
);

roadPoliceRoute.post(
  "/persons/driving-licenses",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, ROADPOLICE_FULL_SEARCH.uid]),
  searchDrivingLicenses
);

module.exports = roadPoliceRoute;
