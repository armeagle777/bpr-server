const territorialMinistryRoute = require("express").Router();

const { getPropertyTaxesData } = require("./controller");
const { permissionsMap } = require("../../utils/constants");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");

const { MTA_PROPERTY_TAXES, ADMIN } = permissionsMap;

territorialMinistryRoute.get(
  "/property-taxes/:identificator",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, MTA_PROPERTY_TAXES.uid]),
  getPropertyTaxesData
);

module.exports = territorialMinistryRoute;
