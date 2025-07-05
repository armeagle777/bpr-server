const router = require("express").Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");
const { permissionsMap } = require("../../utils/constants");
const {
  createTexekanq,
  getTexekanqs,
  getFileBase64,
  getTexekanqTypes,
} = require("./controller");

// const {
//   loginUserSchema,
//   activateUserSchema,
//   registerUserSchema,
// } = require("./validations");
// const { validateSchema } = require("../../helpers/common");
const { ADMIN, CITIZENSHIP_REPORT, PASSPORTS_REPORT, PNUM_REPORT } =
  permissionsMap;

router.post(
  "/",
  authMiddleware,
  rolesMiddleware([
    ADMIN.uid,
    CITIZENSHIP_REPORT.uid,
    PASSPORTS_REPORT.uid,
    PNUM_REPORT.uid,
  ]),
  // validateSchema(registerUserSchema),
  createTexekanq
);

router.get(
  "/",
  authMiddleware,
  rolesMiddleware([
    ADMIN.uid,
    CITIZENSHIP_REPORT.uid,
    PASSPORTS_REPORT.uid,
    PNUM_REPORT.uid,
  ]),
  // validateSchema(registerUserSchema),
  getTexekanqs
);

router.get(
  "/types",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, CITIZENSHIP_REPORT.uid]),
  // validateSchema(registerUserSchema),
  getTexekanqTypes
);

router.get(
  "/pdf/:fileName",
  // authMiddleware,
  // validateSchema(registerUserSchema),
  getFileBase64
);

module.exports = router;
