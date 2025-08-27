const roadPoliceRoute = require("express").Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");
const { permissionsMap } = require("../../utils/constants");
const { getTransactionsData } = require("./controller");

const { ROADPOLICE_TRANSACTIONS, ADMIN } = permissionsMap;

roadPoliceRoute.get(
  "/persons/:psn/transactions",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, ROADPOLICE_TRANSACTIONS.uid]),
  getTransactionsData
);

module.exports = roadPoliceRoute;
