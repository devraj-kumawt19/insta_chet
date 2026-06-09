import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	MdFavoriteBorder,
	MdFavorite,
	MdModeComment,
	MdShare,
	MdBookmark,
	MdBookmarkBorder,
	MdMoreVert,
	MdChevronLeft,
	MdChevronRight,
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
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const { likePost, isLiking } = usePostInteractions(post._id);

	// Transform backend data to match UI expectations
	useEffect(() => {
		if (post && post.likes) {
			setLikeCount(post.likes.length);
			setLiked(post.likes.includes(authUser?._id));
		}
		if (post && post.comments) {
			setCommentCount(post.comments.length);
		}
	}, [post, authUser?._id]);

	if (!post || !post.author) {
		return null;
	}

	const authorName = post.author.username || post.author.fullName || "Unknown";
	const authorAvatar =
		post.author.profilePic &&
			!post.author.profilePic.includes("avatar.iran.liara.run")
			? post.author.profilePic
			: `https://api.dicebear.com/9.x/initials/svg?seed=${authorName}`;
	const postImage = post.image;
	const postCaption = post.caption;
	const postTime = extractTime(post.createdAt);
	const images = postImage ? [postImage] : [];

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

	const nextImage = () => {
		setCurrentImageIndex((prev) => (prev + 1) % images.length);
	};

	const prevImage = () => {
		setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
	};

	// If no image, don't show carousel
	if (!postImage) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="bg-white dark:bg-neutral-900/95 rounded-lg sm:rounded-2xl shadow-sm hover:shadow-lg dark:hover:shadow-2xl dark:shadow-black/30 border border-neutral-100 dark:border-neutral-800 overflow-hidden mb-4 sm:mb-6 transition-all duration-300 backdrop-blur-sm"
			>
				{/* Post Header */}
				<div className="px-3 sm:px-4 py-3 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/50">
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
				<div className="px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800/50 bg-gradient-to-r from-white/50 to-transparent dark:from-neutral-800/30 dark:to-transparent">
					<div className="flex items-center gap-2 sm:gap-3">
						<motion.button
							whileHover={{ scale: 1.2 }}
							whileTap={{ scale: 0.9 }}
							onClick={handleLike}
							disabled={isLiking}
							className="p-2.5 sm:p-3 rounded-full hover:bg-pink-100/50 dark:hover:bg-pink-900/30 transition-colors disabled:opacity-50 touch-target"
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
							className="p-2.5 sm:p-3 rounded-full hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-colors touch-target"
						>
							<MdModeComment className="text-xl sm:text-2xl text-neutral-700 dark:text-neutral-300" />
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							className="p-2.5 sm:p-3 rounded-full hover:bg-green-100/50 dark:hover:bg-green-900/30 transition-colors touch-target"
						>
							<MdShare className="text-xl sm:text-2xl text-neutral-700 dark:text-neutral-300" />
						</motion.button>
					</div>

					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => setSaved(!saved)}
						className="p-2.5 rounded-full hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition-colors"
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
					<motion.button whileHover={{ color: "#ec4853" }} className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
						💬 {commentCount.toLocaleString()} {commentCount === 1 ? "comment" : "comments"}
					</motion.button>
				</div>
			</motion.div>
		);
	}


	// With Image
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="bg-white dark:bg-neutral-900/95 rounded-2xl shadow-sm hover:shadow-xl dark:hover:shadow-2xl dark:shadow-black/30 border border-neutral-100 dark:border-neutral-800 overflow-hidden mb-6 transition-all duration-300 backdrop-blur-sm"
		>
			{/* Post Header */}
			<div className="px-4 py-3 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/50">
				<motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3 cursor-pointer">
					<div className="relative">
						<img
							src={
								authorAvatar.includes("avatar.iran.liara.run")
									? `https://api.dicebear.com/9.x/initials/svg?seed=${authorName}`
									: authorAvatar
							}
							onError={(e) => {
								e.currentTarget.src =
									`https://api.dicebear.com/9.x/initials/svg?seed=${authorName}`;
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
			<div className="relative bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 overflow-hidden group">
				<AnimatePresence mode="wait">
					<motion.img
						key={currentImageIndex}
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.3 }}
						src={postImage}
						alt="Post content"
						className="w-full aspect-square object-cover"
					/>
				</AnimatePresence>

				{/* Overlay for better readability */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
			</div>

			{/* Action Buttons */}
			<div className="px-4 py-3.5 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/50 bg-gradient-to-r from-white/50 to-transparent dark:from-neutral-800/30 dark:to-transparent">
				<div className="flex items-center gap-1">
					<motion.button
						whileHover={{ scale: 1.25 }}
						whileTap={{ scale: 0.85 }}
						onClick={handleLike}
						disabled={isLiking}
						className="p-2.5 rounded-full hover:bg-pink-100/50 dark:hover:bg-pink-900/30 transition-colors disabled:opacity-50"
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
						className="p-2.5 rounded-full hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-colors"
					>
						<MdModeComment className="text-2xl text-neutral-700 dark:text-neutral-300" />
					</motion.button>

					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						className="p-2.5 rounded-full hover:bg-green-100/50 dark:hover:bg-green-900/30 transition-colors"
					>
						<MdShare className="text-2xl text-neutral-700 dark:text-neutral-300" />
					</motion.button>
				</div>

				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => setSaved(!saved)}
					className="p-2.5 rounded-full hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition-colors"
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
					className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
				>
					💬 {commentCount.toLocaleString()} {commentCount === 1 ? "comment" : "comments"}
				</motion.button>
			</div>
		</motion.div>
	);
};

export default PostCard;
