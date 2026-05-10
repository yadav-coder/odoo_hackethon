const express = require("express");
const communityController = require("../controllers/communityController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/")
  .get(communityController.getPosts)
  .post(communityController.createPost);

router.route("/:id")
  .put(communityController.updatePost)
  .delete(communityController.deletePost);

module.exports = router;
