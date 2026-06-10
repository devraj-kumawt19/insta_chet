import Story from "../models/story.model.js";
import User from "../models/user.model.js";

// Create a new story
export const createStory = async (req, res) => {
	try {
		const { image, media, mediaType = "image", kind = "story", caption = "" } = req.body;
		const authorId = req.user._id;
		const mediaSource = image || media;

		if (!mediaSource) {
			return res.status(400).json({ error: "Media is required" });
		}

		if (!["story", "reel"].includes(kind)) {
			return res.status(400).json({ error: "Invalid media type" });
		}

		if (!["image", "video"].includes(mediaType)) {
			return res.status(400).json({ error: "Invalid upload format" });
		}

		if (kind === "reel" && mediaType !== "video") {
			return res.status(400).json({ error: "Reels must be videos" });
		}

		const newStory = new Story({
			author: authorId,
			image: mediaSource,
			mediaType,
			kind,
			caption,
			expiresAt: kind === "reel" ? null : undefined,
		});

		await newStory.save();
		await newStory.populate("author", "fullName username profilePic");

		res.status(201).json(newStory);
	} catch (error) {
		console.log("Error in createStory controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Get stories from followed users
export const getStories = async (req, res) => {
	try {
		const userId = req.user._id;
		const kind = req.query.kind === "reel" ? "reel" : "story";
		const user = await User.findById(userId).select("following");

		const followedUserIds = user.following || [];
		followedUserIds.push(userId);
		const kindFilter =
			kind === "story"
				? { $or: [{ kind: "story" }, { kind: { $exists: false } }] }
				: { kind: "reel" };

		const stories = await Story.find({
			author: { $in: followedUserIds },
			...kindFilter,
		})
			.populate("author", "fullName username profilePic _id")
			.sort({ createdAt: -1 });

		res.status(200).json(stories);
	} catch (error) {
		console.log("Error in getStories controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Get stories by specific user
export const getUserStories = async (req, res) => {
	try {
		const { userId } = req.params;
		const kind = req.query.kind === "reel" ? "reel" : "story";
		const kindFilter =
			kind === "story"
				? { $or: [{ kind: "story" }, { kind: { $exists: false } }] }
				: { kind: "reel" };

		const stories = await Story.find({ author: userId, ...kindFilter })
			.populate("author", "fullName username profilePic _id")
			.sort({ createdAt: -1 });

		res.status(200).json(stories);
	} catch (error) {
		console.log("Error in getUserStories controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// View a story
export const viewStory = async (req, res) => {
	try {
		const { storyId } = req.params;
		const userId = req.user._id;

		const story = await Story.findById(storyId);
		if (!story) {
			return res.status(404).json({ error: "Story not found" });
		}

		// Check if user already viewed
		const alreadyViewed = story.views.some(v => v.user.toString() === userId.toString());

		if (!alreadyViewed) {
			story.views.push({ user: userId });
			await story.save();
		}

		await story.populate("author", "fullName username profilePic");
		res.status(200).json(story);
	} catch (error) {
		console.log("Error in viewStory controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Delete story
export const deleteStory = async (req, res) => {
	try {
		const { storyId } = req.params;
		const userId = req.user._id;

		const story = await Story.findById(storyId);
		if (!story) {
			return res.status(404).json({ error: "Story not found" });
		}

		if (story.author.toString() !== userId.toString()) {
			return res.status(403).json({ error: "Not authorized to delete this story" });
		}

		await Story.findByIdAndDelete(storyId);
		res.status(200).json({ message: "Story deleted successfully" });
	} catch (error) {
		console.log("Error in deleteStory controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
