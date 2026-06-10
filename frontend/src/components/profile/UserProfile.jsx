import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	MdEdit,
	MdVerified,
	MdGridOn,
	MdBookmark,
	MdFavorite,
	MdPersonAdd,
	MdPersonRemove,
	MdSend,
	MdCheck,
} from "react-icons/md";

import { useAuthContext } from "../../context/AuthContext";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import useFollowUser from "../../hooks/useFollowUser";
import useGetUserPosts from "../../hooks/useGetUserPosts";
import useGetSavedPosts from "../../hooks/useGetSavedPosts";
import useGetLikedPosts from "../../hooks/useGetLikedPosts";
import EditProfile from "./EditProfile";
import { ProfileImage } from "../ui/UIComponents";


const formatCount = (num = 0) => {
	if (num >= 1000000)
		return (num / 1000000).toFixed(1) + "M";

	if (num >= 1000)
		return (num / 1000).toFixed(1) + "K";

	return num;
};


const UserProfile = ({ userId }) => {

	const { authUser } = useAuthContext();

	const {
		user,
		loading,
		refetch: refetchUser
	} = useGetUserProfile(userId);


	const profileId = userId || authUser?._id;

	const {
		posts: userPosts,
		loading: postsLoading,
		refetch: refetchPosts
	} = useGetUserPosts(profileId);

	const {
		posts: savedPosts,
		loading: savedLoading
	} = useGetSavedPosts();

	const {
		posts: likedPosts,
		loading: likedLoading
	} = useGetLikedPosts(profileId);

	const {
		followUser,
		unfollowUser,
		loading: followLoading
	} = useFollowUser();



	const [showEditModal, setShowEditModal] = useState(false);
	const [activeTab, setActiveTab] = useState("posts");
	const [isFollowing, setIsFollowing] = useState(false);
	const [messageSent, setMessageSent] = useState(false);

	const isOwn =
		String(authUser?._id) === String(user?._id);

	useEffect(() => {
		if (user && authUser) {
			setIsFollowing(
				user.followers?.some(
					f => f._id === authUser._id
				)
			);
		}
	}, [user, authUser]);

	// Listen for post creation to refresh posts
	useEffect(() => {
		const handlePostCreated = () => {
			console.log("Post created, refreshing user posts");
			refetchPosts && refetchPosts();
		};

		window.addEventListener("postCreated", handlePostCreated);
		return () => window.removeEventListener("postCreated", handlePostCreated);
	}, [refetchPosts]);

	// Listen for profile updates (follow/unfollow)
	useEffect(() => {
		const handleProfileUpdated = () => {
			console.log("Profile updated, refreshing user data");
			refetchUser && refetchUser();
		};

		window.addEventListener("profileUpdated", handleProfileUpdated);
		return () => window.removeEventListener("profileUpdated", handleProfileUpdated);
	}, [refetchUser]);

	const handleFollow = async () => {
		const res = await followUser(userId);
		if (res) {
			setIsFollowing(true);
			refetchUser && refetchUser();
		}
	};

	const handleUnfollow = async () => {
		const res = await unfollowUser(userId);
		if (res) {
			setIsFollowing(false);
			refetchUser && refetchUser();
		}
	};

	const handleMessage = () => {
		setMessageSent(true);
		setTimeout(() => setMessageSent(false), 2000);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="text-center mt-20 text-gray-500">
				User not found
			</div>
		);
	}

	return (
		<div className="w-full min-h-screen bg-white dark:bg-neutral-950">
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
									src={user.profilePic}
									alt={user.fullName}
									size="w-full h-full"
									initials={user.fullName?.charAt(0)}
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
										{user.username}
									</h1>
									{user.verified && (
										<MdVerified className="text-blue-500 text-xl" />
									)}

									{/* Action Buttons */}
									{isOwn ? (
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											onClick={() => setShowEditModal(true)}
											className="px-5 py-2 bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
										>
											<MdEdit size={18} />
											Edit Profile
										</motion.button>
									) : (
										<div className="flex gap-2 flex-wrap">
											<motion.button
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
												disabled={followLoading}
												onClick={isFollowing ? handleUnfollow : handleFollow}
												className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${isFollowing
													? "bg-gray-200 dark:bg-neutral-800 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-neutral-700"
													: "bg-blue-500 hover:bg-blue-600 text-white"
													}`}
											>
												{isFollowing ? (
													<>
														<MdPersonRemove size={18} />
														Following
													</>
												) : (
													<>
														<MdPersonAdd size={18} />
														Follow
													</>
												)}
											</motion.button>

											<motion.button
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
												onClick={handleMessage}
												className="px-6 py-2 bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
											>
												{messageSent ? (
													<>
														<MdCheck size={18} />
														Sent!
													</>
												) : (
													<>
														<MdSend size={18} />
														Message
													</>
												)}
											</motion.button>
										</div>
									)}
								</div>

								{/* Full Name & Bio */}
								<div className="mb-3">
									<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
										<span className="font-semibold text-gray-900 dark:text-white">{user.fullName}</span>
									</p>
									{user.bio && (
										<p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
											{user.bio}
										</p>
									)}
								</div>
							</div>

							{/* Stats Row */}
							<div className="flex gap-4 sm:gap-8">
								<motion.div whileHover={{ y: -2 }} className="text-center sm:text-left cursor-pointer">
									<p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
										{userPosts?.length || 0}
									</p>
									<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
										Post{(userPosts?.length || 0) !== 1 ? "s" : ""}
									</p>
								</motion.div>

								<motion.div whileHover={{ y: -2 }} className="text-center sm:text-left cursor-pointer">
									<p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
										{formatCount(user.followers?.length || 0)}
									</p>
									<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
										Followers
									</p>
								</motion.div>

								<motion.div whileHover={{ y: -2 }} className="text-center sm:text-left cursor-pointer">
									<p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
										{formatCount(user.following?.length || 0)}
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
						{[
							{ id: "posts", label: "Posts", icon: <MdGridOn size={18} /> },
							{ id: "saved", label: "Saved", icon: <MdBookmark size={18} /> },
							{ id: "liked", label: "Liked", icon: <MdFavorite size={18} /> },
						].map((tab) => (
							<motion.button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`py-4 px-1 font-semibold text-sm sm:text-base flex items-center gap-2 border-b-2 transition-colors ${activeTab === tab.id
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
						{userPosts && userPosts.length > 0 ? (
							<motion.div
								key="posts-grid"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="grid grid-cols-3 gap-1 sm:gap-2"
							>
								{userPosts.map((post, idx) => (
									<motion.div
										key={post._id}
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
											<div className="text-white flex items-center gap-1">
												<MdCheck size={18} />
												<span className="text-sm font-semibold">{post.comments?.length || 0}</span>
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

			{/* EDIT MODAL */}
			{showEditModal && (
				<EditProfile
					onClose={() => setShowEditModal(false)}
					onProfileUpdate={() => setShowEditModal(false)}
				/>
			)}
		</div>
	);
};


export default UserProfile;