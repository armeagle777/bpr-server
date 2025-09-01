const mlsaRoute = require("express").Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");
const { permissionsMap } = require("../../utils/constants");
const { getSocialPaymentsData } = require("./controller");

const { MLSA, ADMIN } = permissionsMap;

mlsaRoute.get(
  "/mlsa-info",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, MLSA.uid]),
  getSocialPaymentsData
);

module.exports = mlsaRoute;
