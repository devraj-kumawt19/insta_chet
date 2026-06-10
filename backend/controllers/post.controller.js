import Post from "../models/post.model.js";
import User from "../models/user.model.js";


// CREATE POST
export const createPost = async (req, res) => {
	try {

		const { caption, image } = req.body;
		const authorId = req.user._id;


		if (!caption && !image) {
			return res.status(400).json({
				error: "Post cannot be empty"
			});
		}


		const newPost = await Post.create({
			author: authorId,
			caption,
			image: image || null
		});


		// profile post count fix
		await User.findByIdAndUpdate(
			authorId,
			{
				$push: {
					posts: newPost._id
				}
			}
		);


		await newPost.populate(
			"author",
			"fullName username profilePic _id"
		);


		res.status(201).json(newPost);


	} catch (error) {

		console.log(
			"createPost error:",
			error.message
		);

		res.status(500).json({
			error: "Internal server error"
		});
	}
};




// GET FEED
export const getFeed = async (req, res) => {

	try {

		const page =
			Number(req.query.page) || 1;

		const limit = 20;

		const skip =
			(page - 1) * limit;



		const user =
			await User.findById(
				req.user._id
			).select("following");



		const users = [
			req.user._id,
			...user.following
		];



		let posts =
			await Post.find({
				author: {
					$in: users
				}
			})
				.populate(
					"author",
					"fullName username profilePic _id"
				)
				.populate(
					"comments.user",
					"fullName username profilePic _id"
				)
				.sort({
					createdAt: -1
				})
				.skip(skip)
				.limit(limit);



		// explore feed
		if (posts.length === 0) {

			posts =
				await Post.find()
					.populate(
						"author",
						"fullName username profilePic _id"
					)
					.populate(
						"comments.user",
						"fullName username profilePic _id"
					)
					.sort({
						createdAt: -1
					})
					.limit(limit);

		}



		res.status(200).json(posts);



	} catch (error) {

		console.log(
			"Feed error:",
			error.message
		);


		res.status(500).json({
			error: "Internal server error"
		});
	}

};




// USER POSTS
export const getUserPosts = async (req, res) => {


	try {

		const posts =
			await Post.find({
				author: req.params.userId
			})
				.populate(
					"author",
					"fullName username profilePic _id"
				)
				.populate(
					"comments.user",
					"fullName username profilePic _id"
				)
				.sort({
					createdAt: -1
				});


		res.status(200).json(posts);



	} catch (error) {

		res.status(500).json({
			error: error.message
		});

	}

};




// LIKE / UNLIKE
export const likePost = async (req, res) => {

	try {

		const post =
			await Post.findById(
				req.params.postId
			);


		if (!post) {

			return res.status(404)
				.json({
					error: "Post not found"
				});

		}



		const liked =
			post.likes.some(
				id =>
					id.toString()
					===
					req.user._id.toString()
			);



		if (liked) {

			post.likes.pull(
				req.user._id
			);
			
			// Remove from user's liked posts
			await User.findByIdAndUpdate(
				req.user._id,
				{ $pull: { likedPosts: req.params.postId } }
			);

		} else {

			post.likes.push(
				req.user._id
			);
			
			// Add to user's liked posts
			await User.findByIdAndUpdate(
				req.user._id,
				{ $push: { likedPosts: req.params.postId } }
			);

		}



		await post.save();



		await post.populate(
			"author",
			"fullName username profilePic _id"
		);



		res.status(200)
			.json(post);



	} catch (error) {

		res.status(500)
			.json({
				error: error.message
			});

	}

};





// ADD COMMENT
export const addComment = async (req, res) => {


	try {

		const { text } = req.body;


		if (!text?.trim()) {

			return res.status(400)
				.json({
					error: "Comment required"
				});

		}


		const post =
			await Post.findById(
				req.params.postId
			);



		if (!post) {

			return res.status(404)
				.json({
					error: "Post not found"
				});

		}




		post.comments.push({

			user: req.user._id,

			text

		});



		await post.save();



		await post.populate(
			"author",
			"fullName username profilePic _id"
		);


		await post.populate(
			"comments.user",
			"fullName username profilePic _id"
		);



		res.status(201)
			.json(post);



	} catch (error) {

		res.status(500)
			.json({
				error: error.message
			});

	}

};




// DELETE POST
export const deletePost = async (req, res) => {

	try {

		const post =
			await Post.findById(
				req.params.postId
			);



		if (!post) {

			return res.status(404)
				.json({
					error: "Post not found"
				});

		}




		if (
			post.author.toString()
			!==
			req.user._id.toString()
		) {

			return res.status(403)
				.json({
					error: "Not authorized"
				});

		}




		await Post.findByIdAndDelete(
			req.params.postId
		);



		// remove from user posts
		await User.findByIdAndUpdate(
			req.user._id,
			{
				$pull: {
					posts: post._id
				}
			}
		);




		res.status(200)
			.json({
				message:
					"Post deleted successfully"
			});



	} catch (error) {

		res.status(500)
			.json({
				error: error.message
			});

	}

};


// SAVE POST
export const savePost = async (req, res) => {
	try {
		const { postId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const user = await User.findById(userId);
		if (user.savedPosts.includes(postId)) {
			return res.status(400).json({ error: "Post already saved" });
		}

		user.savedPosts.push(postId);
		await user.save();

		res.status(200).json({ message: "Post saved successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// UNSAVE POST
export const unsavePost = async (req, res) => {
	try {
		const { postId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		await User.findByIdAndUpdate(
			userId,
			{ $pull: { savedPosts: postId } }
		);

		res.status(200).json({ message: "Post unsaved successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// GET SAVED POSTS
export const getSavedPosts = async (req, res) => {
	try {
		const userId = req.user._id;

		const user = await User.findById(userId).populate("savedPosts");
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ _id: { $in: user.savedPosts } })
			.populate("author", "fullName username profilePic _id")
			.populate("comments.user", "fullName username profilePic _id")
			.sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// GET LIKED POSTS
export const getLikedPosts = async (req, res) => {
	try {
		const userId = req.params.userId;

		const user = await User.findById(userId).populate("likedPosts");
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ _id: { $in: user.likedPosts } })
			.populate("author", "fullName username profilePic _id")
			.populate("comments.user", "fullName username profilePic _id")
			.sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};