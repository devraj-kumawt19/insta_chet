import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		gender: {
			type: String,
			required: true,
			enum: ["male", "female"],
		},
		profilePic: {
			type: String,
			default: "https://via.placeholder.com/150",
		},
		bio: {
			type: String,
			default: "",
		},
		profileVideo: {
			type: String,
			default: "",
		},
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		following: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		posts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Post",
			},
		],
		savedPosts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Post",
			},
		],
		likedPosts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Post",
			},
		],
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
