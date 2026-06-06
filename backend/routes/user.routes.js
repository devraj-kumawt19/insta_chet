import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
	getUsersForSidebar,
	getUserProfile,
	updateProfile,
	followUser,
	unfollowUser,
	uploadProfilePic,
	uploadProfileVideo,
	searchUsers
} from "../controllers/user.controller.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.get("/search", protectRoute, searchUsers);
router.get("/profile/:userId", protectRoute, getUserProfile);
router.put("/profile/update", protectRoute, updateProfile);
router.post("/follow/:userId", protectRoute, followUser);
router.post("/unfollow/:userId", protectRoute, unfollowUser);
router.post("/upload-profile-pic", protectRoute, upload.single("profilePic"), uploadProfilePic);
router.post("/upload-profile-video", protectRoute, upload.single("profileVideo"), uploadProfileVideo);

export default router;
