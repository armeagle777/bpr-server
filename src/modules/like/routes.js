const router = require("express").Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { createLike, getLikes } = require("./controller");

// const {
//   loginUserSchema,
//   activateUserSchema,
//   registerUserSchema,
// } = require("./validations");
// const { validateSchema } = require("../../helpers/common");

router.post(
  "/like/:uid",
  authMiddleware,
  // validateSchema(registerUserSchema),
  createLike
);

router.get(
  "/",
  authMiddleware,
  // validateSchema(registerUserSchema),
  getLikes
);

module.exports = router;
