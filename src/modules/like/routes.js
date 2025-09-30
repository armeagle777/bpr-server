const router = require("express").Router();
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { createLike, getLikes, deleteLike } = require("./controller");

router.post("/", authMiddleware, createLike);

router.get("/", authMiddleware, getLikes);

router.delete("/:id", authMiddleware, deleteLike);

module.exports = router;
