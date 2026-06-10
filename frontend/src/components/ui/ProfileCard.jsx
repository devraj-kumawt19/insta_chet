import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	MdVerified,
	MdEdit,
	MdGridOn,
	MdBookmark,
	MdFavorite,
} from "react-icons/md";
import { ProfileImage } from "./UIComponents";
import useGetUserPosts from "../../hooks/useGetUserPosts";

const formatCount = (num = 0) => {
	if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
	if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
	return num.toLocaleString();
};

const ProfileCard = ({
	profile = {},
	onEdit = () => { },
}) => {
	const [activeTab, setActiveTab] = useState("posts");
	const profileId = profile._id || profile.id;
	const { posts: fetchedPosts, loading: postsLoading } = useGetUserPosts(profileId);

	const tabs = [
		{ id: "posts", icon: <MdGridOn size={18} />, label: "Posts" },
		{ id: "saved", icon: <MdBookmark size={18} />, label: "Saved" },
		{ id: "liked", icon: <MdFavorite size={18} />, label: "Liked" },
	];

	const profilePosts = Array.isArray(profile.posts)
		? profile.posts.filter((post) => post && typeof post === "object")
		: [];
	const posts = fetchedPosts.length > 0 ? fetchedPosts : profilePosts;

	return (
		<div className="w-full min-h-screen bg-white dark:bg-neutral-950 overflow-y-auto">
			{/* PROFILE HEADER SECTION */}
			<div className="border-b border-gray-200 dark:border-neutral-800">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
					{/* Top Row: Profile Pic + Info */}
					<div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
						{/* Profile Picture */}
						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							className="flex-shrink-0"
						>
							<div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-gray-200 dark:border-neutral-700 shadow-md">
								<ProfileImage
									src={profile.profilePic}
									alt={profile.fullName}
									size="w-full h-full"
									initials={profile.fullName?.charAt(0).toUpperCase() || "?"}
									className="w-full h-full object-cover"
									showDefault={true}
								/>
							</div>
						</motion.div>

						{/* User Info & Actions */}
						<div className="flex-1 flex flex-col justify-between">
							{/* Username & Buttons */}
							<div>
								<div className="flex items-center gap-3 mb-4 flex-wrap">
									<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
										{profile.username}
									</h1>
									{profile.verified && (
										<MdVerified className="text-blue-500 text-xl" />
									)}

									{/* Action Buttons */}
									{profile.isOwnProfile && (
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											onClick={onEdit}
											className="px-5 py-2 bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
										>
											<MdEdit size={18} />
											Edit Profile
										</motion.button>
									)}
								</div>

								{/* Full Name & Bio */}
								<div className="mb-3">
									<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
										<span className="font-semibold text-gray-900 dark:text-white">{profile.fullName}</span>
									</p>
									{profile.bio && (
										<p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
											{profile.bio}
										</p>
									)}
								</div>
							</div>

							{/* Stats Row */}
							<div className="flex gap-4 sm:gap-8">
								<motion.div whileHover={{ y: -2 }} className="text-center sm:text-left cursor-pointer">
									<p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
										{posts?.length || 0}
									</p>
									<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
										Post{(posts?.length || 0) !== 1 ? "s" : ""}
									</p>
								</motion.div>

								<motion.div whileHover={{ y: -2 }} className="text-center sm:text-left cursor-pointer">
									<p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
										{formatCount(profile.followers?.length || 0)}
									</p>
									<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
										Followers
									</p>
								</motion.div>

								<motion.div whileHover={{ y: -2 }} className="text-center sm:text-left cursor-pointer">
									<p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
										{formatCount(profile.following?.length || 0)}
									</p>
									<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
										Following
									</p>
								</motion.div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* TABS SECTION */}
			<div className="border-b border-gray-200 dark:border-neutral-800">
				<div className="max-w-4xl mx-auto px-4 sm:px-6">
					<div className="flex gap-6 sm:gap-8">
						{tabs.map((tab) => (
							<motion.button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`py-4 px-1 font-semibold text-sm sm:text-base flex items-center gap-2 border-b-2 transition-colors ${
									activeTab === tab.id
										? "border-gray-900 dark:border-white text-gray-900 dark:text-white"
										: "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
								}`}
							>
								{tab.icon}
								<span className="hidden sm:inline">{tab.label}</span>
							</motion.button>
						))}
					</div>
				</div>
			</div>

			{/* POSTS GRID */}
			<div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
				{activeTab === "posts" && (
					<AnimatePresence mode="wait">
						{postsLoading ? (
							<motion.div
								key="posts-loading"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="flex justify-center py-16"
							>
								<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white" />
							</motion.div>
						) : posts && posts.length > 0 ? (
							<motion.div
								key="posts-grid"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="grid grid-cols-3 gap-1 sm:gap-2"
							>
								{posts.map((post, idx) => (
									<motion.div
										key={post._id || idx}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: idx * 0.05 }}
										className="relative group aspect-square bg-gray-200 dark:bg-neutral-800 overflow-hidden rounded cursor-pointer"
									>
										<img
											src={post.image || post.photo}
											alt={post.caption}
											className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
										/>
										{/* Overlay on Hover */}
										<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
											<div className="text-white flex items-center gap-1">
												<MdFavorite size={18} />
												<span className="text-sm font-semibold">{post.likes?.length || 0}</span>
											</div>
										</div>
									</motion.div>
								))}
							</motion.div>
						) : (
							<motion.div
								key="no-posts"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="text-center py-16"
							>
								<p className="text-gray-500 dark:text-gray-400">No posts yet</p>
							</motion.div>
						)}
					</AnimatePresence>
				)}

				{activeTab === "saved" && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-16"
					>
						<p className="text-gray-500 dark:text-gray-400">No saved posts</p>
					</motion.div>
				)}

				{activeTab === "liked" && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-16"
					>
						<p className="text-gray-500 dark:text-gray-400">No liked posts</p>
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default ProfileCard;
