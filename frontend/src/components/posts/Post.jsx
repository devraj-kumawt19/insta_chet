import { useState } from "react";
import { MdFavoriteBorder, MdFavorite, MdDeleteOutline } from "react-icons/md";
import { BiCommentDots } from "react-icons/bi";
import { getAvatarUrl } from "../../utils/avatarUtils";
import { extractTime } from "../../utils/extractTime";
import { useAuthContext } from "../../context/AuthContext";
import { apiPost, apiDelete } from "../../utils/api";
import toast from "react-hot-toast";
import { ProfileImage } from "../ui/UIComponents";

const Post = ({ post, onDelete, onLikeChange }) => {
	const { authUser } = useAuthContext();
	const [isLiked, setIsLiked] = useState(post.likes.includes(authUser._id));
	const [likesCount, setLikesCount] = useState(post.likes.length);
	const [showComments, setShowComments] = useState(false);
	const [comments, setComments] = useState(post.comments || []);
	const [newComment, setNewComment] = useState("");

	const handleLike = async () => {
		try {
			const response = await apiPost(`/api/posts/${post._id}/like`);
			setIsLiked(!isLiked);
			setLikesCount(response.likes.length);
			onLikeChange && onLikeChange();
		} catch (error) {
			toast.error(error.message || "Failed to like post");
		}
	};

	const handleAddComment = async () => {
		if (!newComment.trim()) return;

		try {
			const response = await apiPost(`/api/posts/${post._id}/comment`, {
				text: newComment,
			});
			setComments(response.comments);
			setNewComment("");
		} catch (error) {
			toast.error(error.message || "Failed to add comment");
		}
	};

	const handleDelete = async () => {
		if (!window.confirm("Delete this post?")) return;

		try {
			await apiDelete(`/api/posts/${post._id}`);
			onDelete && onDelete(post._id);
			toast.success("Post deleted");
		} catch (error) {
			toast.error(error.message || "Failed to delete post");
		}
	};

	const profilePic = getAvatarUrl(
		post.author.profilePic,
		post.author.fullName,
		post.author.username
	);

	return (
		<div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden mb-4">
			{/* Post Header */}
			<div className="px-4 py-3 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<ProfileImage
						src={profilePic}
						alt={post.author.username}
						size="w-10 h-10"
						initials={post.author.fullName?.charAt(0).toUpperCase() || "?"}
					/>
					<div>
						<p className="font-semibold text-sm text-neutral-900 dark:text-white">
							{post.author.fullName}
						</p>
						<p className="text-xs text-neutral-500 dark:text-neutral-400">
							@{post.author.username} • {extractTime(post.createdAt)}
						</p>
					</div>
				</div>
				{authUser._id === post.author._id && (
					<button
						onClick={handleDelete}
						className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition"
					>
						<MdDeleteOutline className="text-red-500 text-lg" />
					</button>
				)}
			</div>

			{/* Post Image */}
			{post.image && (
				<img
					src={post.image}
					alt="Post"
					className="w-full max-h-96 object-cover"
				/>
			)}

			{/* Post Caption */}
			<div className="px-4 py-3">
				<p className="text-sm text-neutral-800 dark:text-neutral-100">
					{post.caption}
				</p>
			</div>

			{/* Likes and Comments Count */}
			<div className="px-4 py-2 border-t border-neutral-200 dark:border-neutral-700 flex gap-4 text-sm">
				<span className="text-neutral-600 dark:text-neutral-400">
					{likesCount} {likesCount === 1 ? "like" : "likes"}
				</span>
				<span className="text-neutral-600 dark:text-neutral-400">
					{comments.length} {comments.length === 1 ? "comment" : "comments"}
				</span>
			</div>

			{/* Action Buttons */}
			<div className="px-4 py-2 border-t border-neutral-200 dark:border-neutral-700 flex items-center gap-4">
				<button
					onClick={handleLike}
					className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition"
				>
					{isLiked ? (
						<MdFavorite className="text-red-500 text-xl" />
					) : (
						<MdFavoriteBorder className="text-neutral-600 dark:text-neutral-400 text-xl" />
					)}
					<span className="text-sm font-medium">Like</span>
				</button>

				<button
					onClick={() => setShowComments(!showComments)}
					className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition"
				>
					<BiCommentDots className="text-neutral-600 dark:text-neutral-400 text-xl" />
					<span className="text-sm font-medium">Comment</span>
				</button>
			</div>

			{/* Comments Section */}
			{showComments && (
				<div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-700">
					{/* Comments List */}
					<div className="mb-3 max-h-48 overflow-y-auto space-y-2">
						{comments.map((comment) => (
							<div key={comment._id} className="text-sm">
								<p className="font-semibold text-neutral-800 dark:text-neutral-100">
									@{comment.user.username}
								</p>
								<p className="text-neutral-700 dark:text-neutral-300">
									{comment.text}
								</p>
								<p className="text-xs text-neutral-500 dark:text-neutral-400">
									{extractTime(comment.createdAt)}
								</p>
							</div>
						))}
					</div>

					{/* Comment Input */}
					<div className="flex gap-2">
						<input
							type="text"
							placeholder="Add a comment..."
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
							className="flex-1 px-3 py-2 rounded-full bg-neutral-100 dark:bg-neutral-700 text-sm outline-none"
						/>
						<button
							onClick={handleAddComment}
							className="px-4 py-2 bg-primary-600 text-white rounded-full text-sm font-medium hover:bg-primary-700 transition"
						>
							Post
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Post;
