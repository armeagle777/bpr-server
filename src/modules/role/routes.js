const router = require("express").Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");
const { permissionsMap } = require("../../utils/constants");
const { createRole, getRoles, updateRole } = require("./controller");

const { BPR, ADMIN, TAX, ZAQS, POLICE, PETREGISTER } = permissionsMap;

// const {
//   loginUserSchema,
//   activateUserSchema,
//   registerUserSchema,
// } = require("./validations");
// const { validateSchema } = require("../../helpers/common");

router.post(
  "/",
  rolesMiddleware([ADMIN.uid]),
  // validateSchema(registerUserSchema),
  createRole
);

router.put(
  "/:id",
  rolesMiddleware([ADMIN.uid]),
  // validateSchema(loginUserSchema),
  updateRole
);

router.get("/", rolesMiddleware([ADMIN.uid]), getRoles);

module.exports = router;
