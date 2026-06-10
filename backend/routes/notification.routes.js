import express from "express";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// Get user notifications
router.get("/", protectRoute, async (req, res) => {
	try {
		const userId = req.user._id;
		// For now, return empty array - can be extended later to track actual notifications
		// TODO: Create Notification model and track follows, likes, comments
		res.status(200).json([]);
	} catch (error) {
		console.log("Error in getNotifications controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Mark notification as read
router.post("/:notificationId/read", protectRoute, async (req, res) => {
	try {
		// TODO: Implement when notification model is created
		res.status(200).json({ message: "Notification marked as read" });
	} catch (error) {
		console.log("Error in markNotificationAsRead controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
});

export default router;
