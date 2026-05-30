import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

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
		const { fullName, bio, profilePic } = req.body;

		const user = await User.findByIdAndUpdate(
			userId,
			{ fullName, bio, profilePic },
			{ new: true }
		).select("-password");

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
