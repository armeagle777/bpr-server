const router = require("express").Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { shareInfo, getShares, removeShare } = require("./controller");

// const {
//   loginUserSchema,
//   activateUserSchema,
//   registerUserSchema,
// } = require("./validations");
// const { validateSchema } = require("../../helpers/common");

router.post(
  "/share",
  authMiddleware,
  // validateSchema(registerUserSchema),
  shareInfo
);

router.put(
  "/remove/:id",
  authMiddleware,
  // validateSchema(registerUserSchema),
  removeShare
);

router.get(
  "/",
  authMiddleware,
  // validateSchema(registerUserSchema),
  getShares
);

module.exports = router;
