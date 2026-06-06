import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
	createPost,
	getFeed,
	getUserPosts,
	likePost,
	addComment,
	deletePost,
} from "../controllers/post.controller.js";

const router = express.Router();

// Public routes
router.post("/create", protectRoute, createPost);
router.get("/feed", protectRoute, getFeed);
router.get("/user/:userId", protectRoute, getUserPosts);
router.post("/:postId/like", protectRoute, likePost);
router.post("/:postId/comment", protectRoute, addComment);
router.delete("/:postId", protectRoute, deletePost);

export default router;
