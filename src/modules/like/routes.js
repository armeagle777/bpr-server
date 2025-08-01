const router = require("express").Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { createLike, getLikes } = require("./controller");

router.post("/like/:uid", authMiddleware, createLike);

router.get("/", authMiddleware, getLikes);

module.exports = router;
