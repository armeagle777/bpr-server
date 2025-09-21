const roadPoliceRoute = require("express").Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");
const { permissionsMap } = require("../../utils/constants");
const { getTransactionsData, getViolationsData } = require("./controller");

const { ROADPOLICE_TRANSACTIONS, ADMIN, ROADPOLICE_VIOLATIONS } =
  permissionsMap;

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

module.exports = roadPoliceRoute;
