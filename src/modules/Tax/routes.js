const taxRoute = require("express").Router();

const { authMiddleware } = require("../../middlewares/authMiddleware");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");
const { permissionsMap } = require("../../utils/constants");
const { searchTaxPayerInfo } = require("./controller");

const { TAX_TAXPAYER_INFO, ADMIN } = permissionsMap;

taxRoute.get(
  "/taxpayer-info/:taxId",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, TAX_TAXPAYER_INFO.uid]),
  searchTaxPayerInfo
);

module.exports = taxRoute;
