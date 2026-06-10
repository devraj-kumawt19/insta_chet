import Post from "../models/post.model.js";
import User from "../models/user.model.js";

// Create a new post
export const createPost = async (req, res) => {
	try {
		const { caption, image } = req.body;
		const authorId = req.user._id;

		if (!caption) {
			return res.status(400).json({ error: "Caption is required" });
		}

		const newPost = new Post({
			author: authorId,
			caption,
			image: image || null,
		});

		await newPost.save();
		await newPost.populate("author", "fullName username profilePic");

		res.status(201).json(newPost);
	} catch (error) {
		console.log("Error in createPost controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Get all posts (feed)
export const getFeed = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId).select("following");

		// Get posts from followed users and own posts
		const followedUserIds = user.following || [];
		followedUserIds.push(userId);

		let posts = await Post.find({ author: { $in: followedUserIds } })
			.populate("author", "fullName username profilePic _id")
			.populate("comments.user", "fullName username profilePic")
			.sort({ createdAt: -1 })
			.limit(50);

		// If no posts from follows, show recent public posts
		if (posts.length === 0) {
			posts = await Post.find()
				.populate("author", "fullName username profilePic _id")
				.populate("comments.user", "fullName username profilePic")
				.sort({ createdAt: -1 })
				.limit(50);
		}

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getFeed controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Get posts by specific user
export const getUserPosts = async (req, res) => {
	try {
		const { userId } = req.params;

		const posts = await Post.find({ author: userId })
			.populate("author", "fullName username profilePic _id")
			.populate("comments.user", "fullName username profilePic")
			.sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getUserPosts controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Like a post
export const likePost = async (req, res) => {
	try {
		const { postId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const alreadyLiked = post.likes.includes(userId);

		if (alreadyLiked) {
			post.likes = post.likes.filter(id => id.toString() !== userId.toString());
		} else {
			post.likes.push(userId);
		}

		await post.save();
		res.status(200).json(post);
	} catch (error) {
		console.log("Error in likePost controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Add comment to post
export const addComment = async (req, res) => {
	try {
		const { postId } = req.params;
		const { text } = req.body;
		const userId = req.user._id;

		if (!text) {
			return res.status(400).json({ error: "Comment text is required" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		post.comments.push({
			user: userId,
			text,
		});

		await post.save();
		await post.populate("comments.user", "fullName username profilePic");

		res.status(201).json(post);
	} catch (error) {
		console.log("Error in addComment controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Delete post
export const deletePost = async (req, res) => {
	try {
		const { postId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.author.toString() !== userId.toString()) {
			return res.status(403).json({ error: "Not authorized to delete this post" });
		}

		await Post.findByIdAndDelete(postId);
		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		console.log("Error in deletePost controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
