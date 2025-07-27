const router = require("express").Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { rolesMiddleware } = require("../../middlewares/rolesMiddleware");
const { permissionsMap } = require("../../utils/constants");
const {
  login,
  logout,
  activate,
  getUsers,
  updateUser,
  checkEmail,
  registration,
  getUsersLight,
  toggleUserActive,
  changePassword,
} = require("./controller");
const { ADMIN, HR } = permissionsMap;

// const {
//   loginUserSchema,
//   activateUserSchema,
//   registerUserSchema,
// } = require("./validations");
// const { validateSchema } = require("../../helpers/common");

router.get(
  "/active/:link",
  // validateSchema(activateUserSchema),
  activate
);
router.get("/", rolesMiddleware([ADMIN.uid, HR.uid]), getUsers);
router.get("/light", authMiddleware, getUsersLight);

router.post(
  "/check/email",
  // authMiddleware,
  rolesMiddleware([ADMIN.uid, HR.uid]),
  checkEmail
);

router.post(
  "/registration",
  rolesMiddleware([ADMIN.uid, HR.uid]),
  // validateSchema(registerUserSchema),
  registration
);
router.post(
  "/login",
  // validateSchema(loginUserSchema),
  login
);

router.put(
  "/:id",
  // validateSchema(loginUserSchema),
  rolesMiddleware([ADMIN.uid, HR.uid]),
  updateUser
);

router.put(
  "/password/:id",
  // validateSchema(loginUserSchema),
  authMiddleware,
  changePassword
);

router.put(
  "/active/:id",
  rolesMiddleware([ADMIN.uid, HR.uid]),
  // validateSchema(loginUserSchema),
  toggleUserActive
);

router.post("/logout", logout);

module.exports = router;
