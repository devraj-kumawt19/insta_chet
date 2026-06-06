import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdSearch, MdVerified } from "react-icons/md";
import { apiGet } from "../../utils/api";
import { getAvatarUrl } from "../../utils/avatarUtils";
import { useNavigate } from "react-router-dom";

const UserSearch = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [isSearching, setIsSearching] = useState(false);
	const navigate = useNavigate();

	const handleSearch = async (e) => {
		const query = e.target.value;
		setSearchQuery(query);

		if (query.length < 1) {
			setSearchResults([]);
			return;
		}

		try {
			setIsSearching(true);
			const results = await apiGet(`/api/users/search?q=${encodeURIComponent(query)}`);
			setSearchResults(results || []);
		} catch (error) {
			console.error("Search error:", error);
			setSearchResults([]);
		} finally {
			setIsSearching(false);
		}
	};

	const handleViewProfile = (userId, username) => {
		navigate(`/profile/${username}`);
	};

	return (
		<div className="w-full h-full flex flex-col overflow-y-auto">
			{/* Search Input Section */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 z-20 p-3 sm:p-4 md:p-5"
			>
				<div className="max-w-2xl mx-auto">
					<div className="relative">
						<MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 text-xl sm:text-2xl" />
						<input
							type="text"
							placeholder="Search users, accounts..."
							value={searchQuery}
							onChange={handleSearch}
							className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50 placeholder-neutral-600 dark:placeholder-neutral-400 focus:outline-none focus:border-pink-500 dark:focus:border-pink-500 transition-colors text-sm sm:text-base"
						/>
					</div>
				</div>
			</motion.div>

			{/* Results Section */}
			<div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5">
				<div className="max-w-2xl mx-auto">
					{searchQuery === "" ? (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 text-center"
						>
							<motion.div
								animate={{ y: [0, -10, 0] }}
								transition={{ repeat: Infinity, duration: 2 }}
								className="text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6"
							>
								🔍
							</motion.div>
							<h3 className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
								Find Users
							</h3>
							<p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xs">
								Search for users by name or username to discover their profiles
							</p>
						</motion.div>
					) : isSearching ? (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="flex flex-col items-center justify-center py-12"
						>
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ repeat: Infinity, duration: 1 }}
								className="text-4xl mb-4"
							>
								⏳
							</motion.div>
							<p className="text-neutral-600 dark:text-neutral-400">
								Searching...
							</p>
						</motion.div>
					) : searchResults.length === 0 ? (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="flex flex-col items-center justify-center py-12 text-center"
						>
							<motion.div className="text-5xl sm:text-6xl mb-4">❌</motion.div>
							<h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-1">
								No Results
							</h3>
							<p className="text-sm text-neutral-600 dark:text-neutral-400">
								Couldn't find any users matching "{searchQuery}"
							</p>
						</motion.div>
					) : (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="space-y-2 sm:space-y-3"
						>
							<p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 px-2 py-2 font-semibold uppercase tracking-wide">
								Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
							</p>
							<AnimatePresence>
								{searchResults.map((user, idx) => (
									<motion.div
										key={user._id}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ delay: idx * 0.05 }}
										className="group"
									>
										<button
											onClick={() => handleViewProfile(user._id, user.username)}
											className="w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-pink-500 dark:hover:border-pink-500 hover:shadow-lg dark:hover:shadow-pink-500/20 transition-all duration-200 flex items-center gap-3 sm:gap-4"
										>
											{/* Avatar */}
											<div className="relative flex-shrink-0">
												<img
													src={getAvatarUrl(
														user.profilePic,
														user.fullName,
														user.username
													)}
													alt={user.fullName}
													className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover shadow-md group-hover:shadow-lg transition-shadow"
												/>
												{user.verified && (
													<motion.div
														initial={{ scale: 0 }}
														animate={{ scale: 1 }}
														className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 ring-2 ring-white dark:ring-neutral-900"
													>
														<MdVerified className="text-white text-xs sm:text-sm" />
													</motion.div>
												)}
											</div>

											{/* User Info */}
											<div className="flex-1 min-w-0 text-left">
												<div className="flex items-center gap-2">
													<h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-neutral-50 truncate group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
														{user.fullName}
													</h3>
													{user.verified && (
														<MdVerified className="text-blue-500 flex-shrink-0 text-sm" />
													)}
												</div>
												<p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 truncate">
													@{user.username}
												</p>
												{user.bio && (
													<p className="text-xs text-neutral-500 dark:text-neutral-500 line-clamp-1 mt-0.5">
														{user.bio}
													</p>
												)}
											</div>

											{/* Stats */}
											<div className="flex-shrink-0 flex gap-2 sm:gap-3 text-center opacity-0 group-hover:opacity-100 transition-opacity">
												<div className="flex flex-col items-center">
													<span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-50">
														{user.followers?.length || 0}
													</span>
													<span className="text-xs text-neutral-600 dark:text-neutral-400">
														Followers
													</span>
												</div>
											</div>
										</button>
									</motion.div>
								))}
							</AnimatePresence>
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
};

export default UserSearch;
