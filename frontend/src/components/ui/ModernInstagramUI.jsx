import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Stories from "./Stories";
import PostCard from "./PostCard";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";
import ProfileCard from "./ProfileCard";
import MessageContainer from "../messages/MessageContainer";
import Conversations from "../sidebar/Conversations";
import EditProfile from "../profile/EditProfile";
import CreatePost from "../posts/CreatePost";
import CreateStory from "../stories/CreateStory";
import UserSearch from "./UserSearch";
import Reels from "./Reels";
import { StoriesSkeletonLoader, PostSkeleton } from "./LoadingSkeletons";
import useGetPosts from "../../hooks/useGetPosts";
import useListenMessages from "../../hooks/useListenMessages";
import useLogout from "../../hooks/useLogout";
import { useAuthContext } from "../../context/AuthContext";

const ModernInstagramUI = () => {
	const { authUser, setAuthUser } = useAuthContext();
	const [activeTab, setActiveTab] = useState("home");
	const [showMessagesDetail, setShowMessagesDetail] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [createMode, setCreateMode] = useState(null); // null, "post", "story"
	const { posts: realPosts, loading: postsLoading, error: postsError } = useGetPosts();
	const { logout } = useLogout();
	useListenMessages();

	const handleTabChange = (tab) => {
		setActiveTab(tab);
		if (tab === "messages") {
			setShowMessagesDetail(false);
		}
	};

	return (
		<div className="fixed inset-0 flex flex-col bg-gradient-to-b from-white via-gray-50 to-white dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
			{/* Navbar */}
			<Navbar notificationCount={3} />

			{/* Main Container */}
			<div className="flex flex-1 overflow-hidden">
				{/* Sidebar (Desktop) - Hidden on Mobile */}
				<Sidebar
					activeTab={activeTab}
					onTabChange={handleTabChange}
					onLogout={logout}
				/>

				{/* Main Content - Add padding to prevent BottomNav overlap on mobile */}
				<main className="flex-1 md:ml-80 overflow-y-auto pb-20 md:pb-0">
				<motion.div
					key={activeTab}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className="w-full h-full px-0 sm:px-2 md:px-3 lg:px-4 py-3 sm:py-4 md:py-5"
				>
						{/* Home Tab */}
						{activeTab === "home" && (
						<div className="w-full h-full flex flex-col">
							{postsLoading ? (
								<div className="flex-1 overflow-y-auto space-y-4 sm:space-y-5 md:space-y-6">
									<StoriesSkeletonLoader />
									<div className="max-w-2xl mx-auto space-y-4 sm:space-y-5 md:space-y-6">
										{[...Array(3)].map((_, idx) => (
											<PostSkeleton key={idx} />
										))}
									</div>
								</div>
							) : postsError ? (
								<div className="flex-1 flex items-center justify-center py-12 px-4">
									<p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 text-center">
										Error: {postsError}
									</p>
								</div>
							) : realPosts && Array.isArray(realPosts) && realPosts.length > 0 ? (
								<div className="flex-1 overflow-y-auto">
									<div className="max-w-2xl mx-auto">
										<Stories />
										<div className="space-y-4 sm:space-y-5 md:space-y-6 mt-4 sm:mt-5 md:mt-6">
											{realPosts.map((post) => {
												if (!post || !post._id) return null;
												return <PostCard key={post._id} post={post} />;
											})}
										</div>
									</div>
								</div>
							) : (
								<div className="flex-1 flex items-center justify-center py-12 px-4">
									<p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 text-center">
										No posts yet. Follow users to see their posts!
									</p>
								</div>
							)}
						</div>
					)}

					{/* Reels Tab */}
					{activeTab === "reels" && (
						<div className="w-full h-full overflow-hidden">
							<Reels />
						</div>
					)}

					{/* Profile Tab */}
					{activeTab === "profile" && authUser && (
						<div className="w-full h-full flex items-start justify-center overflow-y-auto pt-2 sm:pt-3 md:pt-4">
							<ProfileCard
								profile={{...authUser, isOwnProfile: true}}
								onEdit={() => setShowEditModal(true)}
							/>
							{showEditModal && (
								<EditProfile
									onClose={() => setShowEditModal(false)}
									onProfileUpdate={() => {
										setShowEditModal(false);
										setAuthUser({...authUser});
									}}
								/>
							)}
						</div>
					)}

					{/* Create Post Tab */}
					{activeTab === "create" && (
						<div className="w-full h-full flex flex-col overflow-y-auto">
							{!createMode ? (
								// Show selection menu
								<div className="w-full h-full flex items-center justify-center p-4 sm:p-6">
									<motion.div
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
									>
										<div className="p-8 sm:p-10">
											<h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50 text-center mb-2">
												Create
											</h2>
											<p className="text-center text-neutral-600 dark:text-neutral-400 text-sm mb-8">
												Choose what you want to share
											</p>

											<div className="space-y-4">
												{/* Create Story Button */}
												<motion.button
													onClick={() => setCreateMode("story")}
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
													className="w-full p-4 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 hover:border-pink-500 dark:hover:border-pink-500 transition bg-neutral-50 dark:bg-neutral-800/50 group"
												>
													<div className="flex items-center gap-4">
														<div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-xl group-hover:shadow-lg transition">
															📖
														</div>
														<div className="text-left">
															<h3 className="font-semibold text-neutral-900 dark:text-neutral-50">
																Create Story
															</h3>
															<p className="text-xs text-neutral-500 dark:text-neutral-400">
																Share a temporary update
															</p>
														</div>
													</div>
												</motion.button>

												{/* Create Post Button */}
												<motion.button
													onClick={() => setCreateMode("post")}
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
													className="w-full p-4 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-500 transition bg-neutral-50 dark:bg-neutral-800/50 group"
												>
													<div className="flex items-center gap-4">
														<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-xl group-hover:shadow-lg transition">
															📸
														</div>
														<div className="text-left">
															<h3 className="font-semibold text-neutral-900 dark:text-neutral-50">
																Create Post
															</h3>
															<p className="text-xs text-neutral-500 dark:text-neutral-400">
																Share a permanent post
															</p>
														</div>
													</div>
												</motion.button>
											</div>
										</div>
									</motion.div>
								</div>
							) : createMode === "story" ? (
								// Story creation
								<div className="w-full h-full flex items-center justify-center p-4 sm:p-6">
									<div className="max-w-md w-full">
										<button
											onClick={() => setCreateMode(null)}
											className="mb-4 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 text-sm font-medium flex items-center gap-2"
										>
											← Back
										</button>
										<CreateStory 
											onStoryCreated={() => {
												setCreateMode(null);
												setActiveTab("home");
											}}
										/>
									</div>
								</div>
							) : (
								// Post creation
								<div className="max-w-2xl mx-auto w-full px-2 sm:px-3 md:px-4 py-4">
									<button
										onClick={() => setCreateMode(null)}
										className="mb-4 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 text-sm font-medium flex items-center gap-2"
									>
										← Back
									</button>
									<CreatePost 
										onPostCreated={() => {
											setCreateMode(null);
											setActiveTab("home");
										}}
									/>
								</div>
							)}
						</div>
					)}

					{/* Search Tab */}
					{activeTab === "search" && (
						<UserSearch />
					)}

					{/* Messages Tab */}
					{activeTab === "messages" && (
						<div className="w-full h-full flex flex-col md:flex-row bg-white dark:bg-neutral-900 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg md:shadow-xl overflow-hidden">
							{/* Conversations Sidebar - Show on desktop, hide when detail view on mobile */}
							<div className={`${showMessagesDetail ? "hidden" : "w-full"} md:flex md:w-80 lg:w-96 border-r border-neutral-200 dark:border-neutral-800 flex-col overflow-hidden`}>
								<div className="p-3 sm:p-4 md:p-5 lg:p-6 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex-shrink-0">
									<h2 className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-50">Messages</h2>
								</div>
								<div className="flex-1 overflow-y-auto">
									<Conversations onCloseSidebar={() => setShowMessagesDetail(true)} />
								</div>
							</div>
							{/* Message Container - Full width on mobile when detail view, hidden when list view */}
							<div className={`${showMessagesDetail ? "w-full flex" : "hidden"} md:flex md:w-auto md:flex-1 flex-col overflow-hidden`}>
								<MessageContainer onBack={() => setShowMessagesDetail(false)} />
							</div>
						</div>
					)}
				</motion.div>
			</main>
		</div>

		{/* Bottom Navigation (Mobile) */}
		<BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
	</div>
);
};

export default ModernInstagramUI;
