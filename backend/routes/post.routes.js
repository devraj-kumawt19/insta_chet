import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
	createPost,
	getFeed,
	getUserPosts,
	likePost,
	addComment,
	deletePost,
	savePost,
	unsavePost,
	getSavedPosts,
	getLikedPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

// Post CRUD operations
router.post("/create", protectRoute, createPost);
router.get("/feed", protectRoute, getFeed);
router.get("/user/:userId", protectRoute, getUserPosts);
router.delete("/:postId", protectRoute, deletePost);

// Like operations
router.post("/:postId/like", protectRoute, likePost);

// Save operations
router.post("/:postId/save", protectRoute, savePost);
router.post("/:postId/unsave", protectRoute, unsavePost);
router.get("/saved/all", protectRoute, getSavedPosts);

// Liked posts
router.get("/liked/:userId", protectRoute, getLikedPosts);

// Comments
router.post("/:postId/comment", protectRoute, addComment);

export default router;
