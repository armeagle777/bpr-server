const express = require("express");

const { getCompaniesBySsn, searchCompanies } = require("./controller");
const { permissionsMap } = require("../../utils/constants");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");

const { ADMIN, PETREGISTER } = permissionsMap;

const companiesRoute = express.Router();

companiesRoute.get(
  "/:ssn/petregistr",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, PETREGISTER.uid]),
  getCompaniesBySsn
);

companiesRoute.get(
  "/search",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, PETREGISTER.uid]),
  searchCompanies
);

module.exports = companiesRoute;
