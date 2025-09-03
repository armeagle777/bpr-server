const taxRoute = require("express").Router();

const { authMiddleware } = require("../../middlewares/authMiddleware");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");
const { permissionsMap } = require("../../utils/constants");
const {
  searchTaxPayerInfo,
  searchPersonIncomeInfo,
  searchPersonEmployers,
  getCompanyObligations,
} = require("./controller");

const {
  TAX_TAXPAYER_INFO,
  ADMIN,
  TAX_PERSON_ALL_INCOMES,
  TAX,
  TAX_PERSON_ALL_EMPLOYERS,
  TAX_COMPANY_OBLIGATIONS,
} = permissionsMap;

taxRoute.get(
  "/company/:taxId/taxpayer-info",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, TAX_TAXPAYER_INFO.uid, TAX.uid]),
  searchTaxPayerInfo
);

taxRoute.get(
  "/person/:ssn/income-info",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, TAX_PERSON_ALL_INCOMES.uid, TAX.uid]),
  searchPersonIncomeInfo
);

taxRoute.get(
  "/person/:ssn/employers",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, TAX_PERSON_ALL_EMPLOYERS.uid, TAX.uid]),
  searchPersonEmployers
);

taxRoute.get(
  "/company/:tin/obligations",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, TAX_COMPANY_OBLIGATIONS.uid]),
  getCompanyObligations
);

module.exports = taxRoute;
