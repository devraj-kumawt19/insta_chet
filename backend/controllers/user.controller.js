import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		const [users, conversations] = await Promise.all([
			User.find({ _id: { $ne: loggedInUserId } }).select("-password").lean(),
			Conversation.find({ participants: loggedInUserId })
				.select("participants messages updatedAt")
				.populate({
					path: "messages",
					options: { sort: { createdAt: -1 } },
					perDocumentLimit: 1,
				})
				.lean(),
		]);

		const conversationByUserId = new Map();

		conversations.forEach((conversation) => {
			const otherUserId = conversation.participants.find(
				(participantId) => participantId.toString() !== loggedInUserId.toString()
			);

			if (!otherUserId) return;

			const lastMessage = conversation.messages?.[0] || null;
			conversationByUserId.set(otherUserId.toString(), {
				lastMessage,
				lastMessageAt: lastMessage?.createdAt || conversation.updatedAt,
			});
		});

		const filteredUsers = users
			.map((user) => {
				const conversationMeta = conversationByUserId.get(user._id.toString());
				return conversationMeta ? { ...user, ...conversationMeta } : user;
			})
			.sort((firstUser, secondUser) => {
				const firstTime = firstUser.lastMessageAt ? new Date(firstUser.lastMessageAt).getTime() : 0;
				const secondTime = secondUser.lastMessageAt ? new Date(secondUser.lastMessageAt).getTime() : 0;
				return secondTime - firstTime;
			});

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getUserProfile = async (req, res) => {
	try {
		const { userId } = req.params;
		const user = await User.findById(userId)
			.select("-password")
			.populate("followers", "-password")
			.populate("following", "-password");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.status(200).json(user);
	} catch (error) {
		console.error("Error in getUserProfile: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const updateProfile = async (req, res) => {
	try {
		const userId = req.user._id;
		const { fullName, username, bio, profilePic, profileVideo } = req.body;

		// Validate inputs
		if (!fullName?.trim()) {
			return res.status(400).json({ error: "Full name is required" });
		}

		// Check if username is being updated and if it's unique
		if (username && username !== req.user.username) {
			const existingUser = await User.findOne({ username, _id: { $ne: userId } });
			if (existingUser) {
				return res.status(400).json({ error: "Username already taken" });
			}
		}

		const updateData = { fullName, bio };
		if (username) updateData.username = username;
		if (profilePic) updateData.profilePic = profilePic;
		if (profileVideo) updateData.profileVideo = profileVideo;

		const user = await User.findByIdAndUpdate(
			userId,
			updateData,
			{ new: true }
		).select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.status(200).json(user);
	} catch (error) {
		console.error("Error in updateProfile: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const followUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const loggedInUserId = req.user._id;

		if (userId === loggedInUserId.toString()) {
			return res.status(400).json({ error: "You cannot follow yourself" });
		}

		const userToFollow = await User.findById(userId);
		const loggedInUser = await User.findById(loggedInUserId);

		if (!userToFollow || !loggedInUser) {
			return res.status(404).json({ error: "User not found" });
		}

		// Check if already following
		if (loggedInUser.following.includes(userId)) {
			return res.status(400).json({ error: "Already following this user" });
		}

		loggedInUser.following.push(userId);
		userToFollow.followers.push(loggedInUserId);

		await loggedInUser.save();
		await userToFollow.save();

		res.status(200).json({ message: "Followed successfully" });
	} catch (error) {
		console.error("Error in followUser: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const unfollowUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const loggedInUserId = req.user._id;

		const userToUnfollow = await User.findById(userId);
		const loggedInUser = await User.findById(loggedInUserId);

		if (!userToUnfollow || !loggedInUser) {
			return res.status(404).json({ error: "User not found" });
		}

		loggedInUser.following = loggedInUser.following.filter(id => id.toString() !== userId);
		userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== loggedInUserId.toString());

		await loggedInUser.save();
		await userToUnfollow.save();

		res.status(200).json({ message: "Unfollowed successfully" });
	} catch (error) {
		console.error("Error in unfollowUser: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const uploadProfilePic = async (req, res) => {
	try {
		const userId = req.user._id;

		if (!req.file) {
			return res.status(400).json({ error: "No file uploaded" });
		}

		const profilePicUrl = `/uploads/${req.file.filename}`;

		const user = await User.findByIdAndUpdate(
			userId,
			{ profilePic: profilePicUrl },
			{ new: true }
		).select("-password");

		res.status(200).json({
			message: "Profile picture uploaded successfully",
			profilePic: profilePicUrl,
			user: user,
		});
	} catch (error) {
		console.error("Error in uploadProfilePic: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const uploadProfileVideo = async (req, res) => {
	try {
		const userId = req.user._id;

		if (!req.file) {
			return res.status(400).json({ error: "No video uploaded" });
		}

		const profileVideoUrl = `/uploads/${req.file.filename}`;

		const user = await User.findByIdAndUpdate(
			userId,
			{ profileVideo: profileVideoUrl },
			{ new: true }
		).select("-password");

		res.status(200).json({
			message: "Profile video uploaded successfully",
			profileVideo: profileVideoUrl,
			user: user,
		});
	} catch (error) {
		console.error("Error in uploadProfileVideo: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const searchUsers = async (req, res) => {
	try {
		const { q } = req.query;

		if (!q || q.trim().length === 0) {
			return res.status(400).json({ error: "Search query is required" });
		}

		const searchQuery = {
			$or: [
				{ fullName: { $regex: q, $options: "i" } },
				{ username: { $regex: q, $options: "i" } },
			],
		};

		const users = await User.find(searchQuery).select("-password").limit(20);

		res.status(200).json(users);
	} catch (error) {
		console.error("Error in searchUsers: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
