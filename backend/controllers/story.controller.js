import Story from "../models/story.model.js";
import User from "../models/user.model.js";

const populateStory = (query) =>
	query
		.populate("author", "fullName username profilePic _id followers")
		.populate("comments.user", "fullName username profilePic _id");

const withViewerState = (stories, user) => {
	const savedReelIds = new Set((user?.savedReels || []).map((id) => id.toString()));

	return stories.map((story) => ({
		...story,
		isSaved: savedReelIds.has(story._id.toString()),
	}));
};

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

		if (caption.length > 500) {
			return res.status(400).json({ error: "Caption cannot exceed 500 characters" });
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
		await newStory.populate("author", "fullName username profilePic _id followers");

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
		const user = await User.findById(userId).select("following savedReels");

		const followedUserIds = user.following || [];
		followedUserIds.push(userId);
		const kindFilter =
			kind === "story"
				? { $or: [{ kind: "story" }, { kind: { $exists: false } }] }
				: { kind: "reel" };

		let stories = await populateStory(Story.find({
			author: { $in: followedUserIds },
			...kindFilter,
		}))
			.sort({ createdAt: -1 })
			.lean();

		if (kind === "reel" && stories.length === 0) {
			stories = await populateStory(Story.find({ kind: "reel" }))
				.sort({ createdAt: -1 })
				.limit(50)
				.lean();
		}

		res.status(200).json(withViewerState(stories, user));
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

		const viewer = await User.findById(req.user._id).select("savedReels");
		const stories = await populateStory(Story.find({ author: userId, ...kindFilter }))
			.sort({ createdAt: -1 })
			.lean();

		res.status(200).json(withViewerState(stories, viewer));
	} catch (error) {
		console.log("Error in getUserStories controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const likeStory = async (req, res) => {
	try {
		const story = await Story.findById(req.params.storyId);
		if (!story) {
			return res.status(404).json({ error: "Reel not found" });
		}

		const userId = req.user._id;
		const isLiked = story.likes.some((id) => id.toString() === userId.toString());

		if (isLiked) {
			story.likes.pull(userId);
		} else {
			story.likes.push(userId);
		}

		await story.save();
		const populatedStory = await populateStory(Story.findById(story._id)).lean();
		const viewer = await User.findById(userId).select("savedReels");

		res.status(200).json(withViewerState([populatedStory], viewer)[0]);
	} catch (error) {
		console.log("Error in likeStory controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const addStoryComment = async (req, res) => {
	try {
		const text = req.body.text?.trim();
		if (!text) {
			return res.status(400).json({ error: "Comment is required" });
		}

		if (text.length > 300) {
			return res.status(400).json({ error: "Comment cannot exceed 300 characters" });
		}

		const story = await Story.findById(req.params.storyId);
		if (!story) {
			return res.status(404).json({ error: "Reel not found" });
		}

		story.comments.push({ user: req.user._id, text });
		await story.save();

		const populatedStory = await populateStory(Story.findById(story._id)).lean();
		const viewer = await User.findById(req.user._id).select("savedReels");
		res.status(201).json(withViewerState([populatedStory], viewer)[0]);
	} catch (error) {
		console.log("Error in addStoryComment controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const toggleSaveStory = async (req, res) => {
	try {
		const story = await Story.findById(req.params.storyId).select("_id kind");
		if (!story || story.kind !== "reel") {
			return res.status(404).json({ error: "Reel not found" });
		}

		const user = await User.findById(req.user._id);
		const isSaved = user.savedReels.some((id) => id.toString() === story._id.toString());

		if (isSaved) {
			user.savedReels.pull(story._id);
		} else {
			user.savedReels.push(story._id);
		}

		await user.save();
		res.status(200).json({ isSaved: !isSaved });
	} catch (error) {
		console.log("Error in toggleSaveStory controller: ", error.message);
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
