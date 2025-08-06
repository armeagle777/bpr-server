const express = require("express");

const { getCompaniesBySsn } = require("./controller");
const { permissionsMap } = require("../../utils/constants");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");

const { BPR, ADMIN, TAX, ZAQS, POLICE, PETREGISTER } = permissionsMap;

const companiesRoute = express.Router();

companiesRoute.get(
  "/:ssn/petregistr",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, PETREGISTER.uid]),
  getCompaniesBySsn
);

module.exports = companiesRoute;
