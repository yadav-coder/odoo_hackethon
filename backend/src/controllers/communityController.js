const CommunityPost = require("../models/communityModel");

const createPost = async (req, res, next) => {
  try {
    const post = await CommunityPost.create(req.user._id, req.body);
    res.status(201).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const posts = await CommunityPost.findAll(req.query);
    res.status(200).json({ success: true, count: posts.length, posts });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await CommunityPost.updateForUser(req.params.id, req.user._id, req.body);

    if (!post) {
      res.status(404).json({ success: false, message: "Community post not found" });
      return;
    }

    res.status(200).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await CommunityPost.deleteForUser(req.params.id, req.user._id);

    if (!post) {
      res.status(404).json({ success: false, message: "Community post not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Community post deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getPosts,
  updatePost,
  deletePost
};
