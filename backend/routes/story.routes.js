import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
	createStory,
	getStories,
	getUserStories,
	viewStory,
	deleteStory,
	likeStory,
	addStoryComment,
	toggleSaveStory,
} from "../controllers/story.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createStory);
router.get("/feed", protectRoute, getStories);
router.get("/user/:userId", protectRoute, getUserStories);
router.post("/:storyId/view", protectRoute, viewStory);
router.post("/:storyId/like", protectRoute, likeStory);
router.post("/:storyId/comment", protectRoute, addStoryComment);
router.post("/:storyId/save", protectRoute, toggleSaveStory);
router.delete("/:storyId", protectRoute, deleteStory);

export default router;
