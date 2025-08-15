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

router.get("/active/:link", activate);
router.get("/", rolesMiddleware([ADMIN.uid, HR.uid]), getUsers);
router.get("/light", authMiddleware, getUsersLight);

router.post("/check/email", rolesMiddleware([ADMIN.uid, HR.uid]), checkEmail);

router.post(
  "/registration",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, HR.uid]),
  registration
);
router.post("/login", login);

router.put(
  "/:id",
  authMiddleware,
  rolesMiddleware([ADMIN.uid, HR.uid]),
  updateUser
);

router.put("/password/:id", authMiddleware, changePassword);

router.put(
  "/active/:id",
  rolesMiddleware([ADMIN.uid, HR.uid]),
  toggleUserActive
);

router.post("/logout", logout);

module.exports = router;
