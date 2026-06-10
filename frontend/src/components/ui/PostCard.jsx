import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	MdFavoriteBorder,
	MdFavorite,
	MdModeComment,
	MdShare,
	MdBookmark,
	MdBookmarkBorder,
	MdMoreVert,
	MdSend,
} from "react-icons/md";
import { useAuthContext } from "../../context/AuthContext";
import usePostInteractions from "../../hooks/usePostInteractions";
import { extractTime } from "../../utils/extractTime";
import { ProfileImage } from "./UIComponents";

const PostCard = ({ post }) => {
	const { authUser } = useAuthContext();
	const [liked, setLiked] = useState(false);
	const [saved, setSaved] = useState(false);
	const [likeCount, setLikeCount] = useState(0);
	const [commentCount, setCommentCount] = useState(0);
	const [comments, setComments] = useState([]);
	const [showComments, setShowComments] = useState(false);
	const [newComment, setNewComment] = useState("");
	const { likePost, addComment, isLiking, isCommentingLoading } = usePostInteractions(post?._id);

	// Transform backend data to match UI expectations
	useEffect(() => {
		if (Array.isArray(post?.likes)) {
			setLikeCount(post.likes.length);
			setLiked(post.likes.includes(authUser?._id));
		} else {
			setLikeCount(0);
			setLiked(false);
		}

		if (Array.isArray(post?.comments)) {
			setComments(post.comments);
			setCommentCount(post.comments.length);
		} else {
			setComments([]);
			setCommentCount(0);
		}
	}, [post, authUser?._id]);

	if (!post || !post.author || !post._id) {
		return null;
	}

	const authorName = post.author.username || post.author.fullName || "Unknown";
	// Safe optional chaining for profilePic - guard against undefined/null
	const authorAvatar =
		post.author?.profilePic &&
		post.author.profilePic.trim() !== "" &&
		!post.author.profilePic.includes("avatar.iran.liara.run") &&
		!post.author.profilePic.includes("undefined")
		? post.author.profilePic
		: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(authorName)}`;
	const postImage = post.image;
	const postCaption = post.caption;
	let postTime = "";

	try {
		postTime = extractTime(post.createdAt);
	} catch (err) {
		console.log("time error", err);
		postTime = "";
	}

	const handleLike = async () => {
		try {
			await likePost(post.likes, authUser?._id);
			if (liked) {
				setLikeCount(likeCount - 1);
			} else {
				setLikeCount(likeCount + 1);
			}
			setLiked(!liked);
		} catch (error) {
			console.error("Failed to like post:", error);
		}
	};

	const handleAddComment = async (event) => {
		event.preventDefault();
		const text = newComment.trim();
		if (!text) return;

		try {
			const updatedPost = await addComment(text);
			const updatedComments = Array.isArray(updatedPost?.comments) ? updatedPost.comments : [];
			setComments(updatedComments);
			setCommentCount(updatedComments.length);
			setNewComment("");
			setShowComments(true);
		} catch (error) {
			console.error("Failed to add comment:", error);
		}
	};

	const commentsSection = (
		<AnimatePresence>
			{showComments && (
				<motion.div
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto" }}
					exit={{ opacity: 0, height: 0 }}
					className="border-t border-neutral-100 dark:border-neutral-800/50 px-3 sm:px-4 py-3"
				>
					<div className="max-h-52 overflow-y-auto space-y-3 pr-1">
						{comments.length > 0 ? (
							comments.map((comment, idx) => {
								const commentUser = comment.user || {};
								const commentName = commentUser.username || commentUser.fullName || "user";
								return (
									<div key={comment._id || `${commentName}-${idx}`} className="flex gap-2 text-sm">
										<ProfileImage
											src={commentUser.profilePic}
											alt={commentName}
											size="w-8 h-8"
											initials={commentName.charAt(0).toUpperCase()}
										/>
										<div className="min-w-0 flex-1 rounded-2xl bg-neutral-50 px-3 py-2 dark:bg-neutral-800/70">
											<p className="font-bold text-neutral-900 dark:text-neutral-50">
												@{commentName}
											</p>
											<p className="break-words text-neutral-700 dark:text-neutral-300">
												{comment.text}
											</p>
											{comment.createdAt && (
												<p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
													{extractTime(comment.createdAt)}
												</p>
											)}
										</div>
									</div>
								);
							})
						) : (
							<p className="py-3 text-center text-xs text-neutral-500 dark:text-neutral-400">
								No comments yet
							</p>
						)}
					</div>

					<form onSubmit={handleAddComment} className="mt-3 flex items-center gap-2">
						<input
							type="text"
							value={newComment}
							onChange={(event) => setNewComment(event.target.value)}
							placeholder="Add a comment..."
							className="min-w-0 flex-1 rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-900 outline-none transition focus:ring-2 focus:ring-pink-400 dark:bg-neutral-800 dark:text-neutral-50"
						/>
						<button
							type="submit"
							disabled={isCommentingLoading || !newComment.trim()}
							className="rounded-full bg-pink-600 p-2.5 text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
							aria-label="Post comment"
						>
							<MdSend className="text-lg" />
						</button>
					</form>
				</motion.div>
			)}
		</AnimatePresence>
	);

	// If no image, don't show carousel
	if (!postImage) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="mb-3 overflow-hidden border-y border-neutral-200 bg-white shadow-none dark:border-neutral-800 dark:bg-neutral-950 sm:rounded-xl sm:border"
			>
				{/* Post Header */}
				<div className="flex items-center justify-between px-3 py-3">
					<motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-1 min-w-0">
						<div className="relative flex-shrink-0">
							<ProfileImage
								src={authorAvatar}
								alt={authorName}
								size="w-10 sm:w-12 h-10 sm:h-12"
								initials={authorName?.charAt(0).toUpperCase() || "?"}
								className="border-2 border-pink-400 dark:border-pink-500 shadow-md"
							/>
						</div>
						<div className="min-w-0">
							<p className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-50 hover:text-pink-600 dark:hover:text-pink-400 transition-colors truncate">
								{authorName}
							</p>
							<p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{postTime}</p>
						</div>
					</motion.div>
					<motion.button
						whileHover={{ scale: 1.1, rotate: 90 }}
						whileTap={{ scale: 0.95 }}
						className="p-2 ml-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors flex-shrink-0 touch-target"
					>
						<MdMoreVert className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400" />
					</motion.button>
				</div>

				{/* Caption Only */}
				<div className="px-3 sm:px-4 py-3 sm:py-4">
					<p className="text-xs sm:text-sm leading-relaxed text-neutral-900 dark:text-neutral-50">
						<span className="font-bold hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer">
							{authorName}
						</span>{" "}
						<span className="text-neutral-700 dark:text-neutral-300">{postCaption}</span>
					</p>
				</div>

				{/* Action Buttons */}
				<div className="flex items-center justify-between px-2 py-2 sm:px-4">
					<div className="flex items-center gap-2 sm:gap-3">
						<motion.button
							whileHover={{ scale: 1.2 }}
							whileTap={{ scale: 0.9 }}
							onClick={handleLike}
							disabled={isLiking}
							className="rounded-full p-2.5 transition-colors hover:bg-neutral-100 disabled:opacity-50 dark:hover:bg-neutral-900 sm:p-3 touch-target"
						>
							<motion.div animate={liked ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.4 }}>
								{liked ? (
									<MdFavorite className="text-xl sm:text-2xl text-red-500 drop-shadow-lg" />
								) : (
									<MdFavoriteBorder className="text-xl sm:text-2xl text-neutral-700 dark:text-neutral-300" />
								)}
							</motion.div>
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setShowComments((current) => !current)}
							className="rounded-full p-2.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900 sm:p-3 touch-target"
						>
							<MdModeComment className="text-xl sm:text-2xl text-neutral-700 dark:text-neutral-300" />
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							className="rounded-full p-2.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900 sm:p-3 touch-target"
						>
							<MdShare className="text-xl sm:text-2xl text-neutral-700 dark:text-neutral-300" />
						</motion.button>
					</div>

					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => setSaved(!saved)}
						className="rounded-full p-2.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900"
					>
						<motion.div
							animate={saved ? { scale: [1, 1.2, 1] } : {}}
							transition={{ duration: 0.4 }}
						>
							{saved ? (
								<MdBookmark className="text-2xl text-amber-500 drop-shadow-lg" />
							) : (
								<MdBookmarkBorder className="text-2xl text-neutral-700 dark:text-neutral-300" />
							)}
						</motion.div>
					</motion.button>
				</div>

				{/* Like Count */}
				<div className="px-4 py-2">
					<motion.p
						key={likeCount}
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						className="font-bold text-sm text-neutral-900 dark:text-neutral-50"
					>
						{likeCount.toLocaleString()} {likeCount === 1 ? "like" : "likes"}
					</motion.p>
				</div>

				{/* Comments Count */}
				<div className="px-4 pb-3 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
					<motion.button
						whileHover={{ color: "#ec4853" }}
						onClick={() => setShowComments((current) => !current)}
						className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
					>
						💬 {commentCount.toLocaleString()} {commentCount === 1 ? "comment" : "comments"}
					</motion.button>
				</div>
				{commentsSection}
			</motion.div>
		);
	}


	// With Image
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="mb-3 overflow-hidden border-y border-neutral-200 bg-white shadow-none dark:border-neutral-800 dark:bg-neutral-950 sm:rounded-xl sm:border"
		>
			{/* Post Header */}
			<div className="flex items-center justify-between px-4 py-3">
				<motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3 cursor-pointer">
					<div className="relative">
						<img
							src={authorAvatar}
							onError={(e) => {
								e.currentTarget.src =
									`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(authorName)}`;
							}}
							alt={authorName}
							className="w-12 h-12 rounded-full object-cover border-2 border-pink-400 dark:border-pink-500 shadow-md"
						/>
					</div>
					<div>
						<p className="font-bold text-sm text-neutral-900 dark:text-neutral-50 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
							{authorName}
						</p>
						<p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{postTime}</p>
					</div>
				</motion.div>
				<motion.button
					whileHover={{ scale: 1.1, rotate: 90 }}
					whileTap={{ scale: 0.95 }}
					className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
				>
					<MdMoreVert className="text-lg text-neutral-600 dark:text-neutral-400" />
				</motion.button>
			</div>

			{/* Image Carousel */}
			<div className="relative overflow-hidden bg-neutral-100 dark:bg-neutral-900 group">
				<AnimatePresence mode="wait">
					<motion.img
						key={post._id}
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.3 }}
						src={postImage || ""}
						onError={(e) => {
							console.error("Failed to load post image");
							e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e5e7eb' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%239ca3af'%3EImage not available%3C/text%3E%3C/svg%3E";
						}}
						alt="Post content"
						className="w-full aspect-square object-cover"
					/>
				</AnimatePresence>

				{/* Overlay for better readability */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
			</div>

			{/* Action Buttons */}
			<div className="flex items-center justify-between px-3 py-2">
				<div className="flex items-center gap-1">
					<motion.button
						whileHover={{ scale: 1.25 }}
						whileTap={{ scale: 0.85 }}
						onClick={handleLike}
						disabled={isLiking}
						className="rounded-full p-2.5 transition-colors hover:bg-neutral-100 disabled:opacity-50 dark:hover:bg-neutral-900"
					>
						<motion.div animate={liked ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.4 }}>
							{liked ? (
								<MdFavorite className="text-2xl text-red-500 drop-shadow-lg" />
							) : (
								<MdFavoriteBorder className="text-2xl text-neutral-700 dark:text-neutral-300" />
							)}
						</motion.div>
					</motion.button>

					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => setShowComments((current) => !current)}
						className="rounded-full p-2.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900"
					>
						<MdModeComment className="text-2xl text-neutral-700 dark:text-neutral-300" />
					</motion.button>

					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						className="rounded-full p-2.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900"
					>
						<MdShare className="text-2xl text-neutral-700 dark:text-neutral-300" />
					</motion.button>
				</div>

				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => setSaved(!saved)}
					className="rounded-full p-2.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900"
				>
					<motion.div
						animate={saved ? { scale: [1, 1.2, 1] } : {}}
						transition={{ duration: 0.4 }}
					>
						{saved ? (
							<MdBookmark className="text-2xl text-amber-500 drop-shadow-lg" />
						) : (
							<MdBookmarkBorder className="text-2xl text-neutral-700 dark:text-neutral-300" />
						)}
					</motion.div>
				</motion.button>
			</div>

			{/* Like Count */}
			<div className="px-4 py-2">
				<motion.p
					key={likeCount}
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					className="font-bold text-sm text-neutral-900 dark:text-neutral-50"
				>
					{likeCount.toLocaleString()} {likeCount === 1 ? "like" : "likes"}
				</motion.p>
			</div>

			{/* Caption */}
			<div className="px-4 pb-2">
				<p className="text-sm leading-relaxed text-neutral-900 dark:text-neutral-50">
					<span className="font-bold hover:text-pink-600 dark:hover:text-pink-400 transition-colors cursor-pointer">
						{authorName}
					</span>{" "}
					<span className="text-neutral-700 dark:text-neutral-300">{postCaption}</span>
				</p>
			</div>

			{/* Comments Count */}
			<div className="px-4 pb-3 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
				<motion.button
					whileHover={{ color: "#ec4853" }}
					onClick={() => setShowComments((current) => !current)}
					className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
				>
					💬 {commentCount.toLocaleString()} {commentCount === 1 ? "comment" : "comments"}
				</motion.button>
			</div>
			{commentsSection}
		</motion.div>
	);
};

export default PostCard;
