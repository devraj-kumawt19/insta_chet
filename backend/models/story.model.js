import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
	{
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		mediaType: {
			type: String,
			enum: ["image", "video"],
			default: "image",
		},
		kind: {
			type: String,
			enum: ["story", "reel"],
			default: "story",
		},
		caption: {
			type: String,
			default: "",
		},
		expiresAt: {
			type: Date,
			default: function () {
				return this.kind === "reel" ? null : new Date(Date.now() + 24 * 60 * 60 * 1000);
			},
		},
		views: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
				viewedAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
	},
	{ timestamps: true }
);

// Auto delete expired stories
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Story = mongoose.model("Story", storySchema);
export default Story;
