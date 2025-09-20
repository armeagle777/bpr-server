const { authMiddleware } = require("../../middlewares/authMiddleware");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");
const { permissionsMap } = require("../../utils/constants");
const { createLogHandler, getLogTypes, filterLogs } = require("./controller");

const { ADMIN } = permissionsMap;

const logsRoute = require("express").Router();

logsRoute.post("/", authMiddleware, createLogHandler);
logsRoute.post(
  "/filter",
  authMiddleware,
  rolesMiddleware([ADMIN.uid]),
  filterLogs
);
logsRoute.get("/log-types", authMiddleware, getLogTypes);

module.exports = logsRoute;
