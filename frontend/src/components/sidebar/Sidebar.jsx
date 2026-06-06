import { useState } from "react";
import { motion } from "framer-motion";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import { useAuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import UserProfile from "../profile/UserProfile";
import { MdDarkMode, MdLightMode, MdMoreVert, MdClose } from "react-icons/md";

const Sidebar = ({ onCloseSidebar }) => {
	const { authUser } = useAuthContext();
	const { isDark, toggleTheme } = useTheme();
	const [showProfileModal, setShowProfileModal] = useState(false);
	const [showMenu, setShowMenu] = useState(false);

	return (
		<div className="flex flex-col h-full bg-white dark:bg-neutral-900 border-r border-neutral-100 dark:border-neutral-800 overflow-hidden">
			{/* Header Section */}
			<motion.div 
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				className="p-4 sm:p-5 border-b border-neutral-100 dark:border-neutral-800 space-y-4 bg-gradient-to-b from-white/50 to-transparent dark:from-neutral-800/30 dark:to-transparent backdrop-blur-sm"
			>
				{/* Profile Button */}
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => setShowProfileModal(true)}
					className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-200 group"
				>
					<div className="relative flex-shrink-0">
						<img
							src={authUser?.profilePic}
							alt="Profile"
							className="w-12 h-12 rounded-full object-cover border-2 border-pink-400 dark:border-pink-500 shadow-md group-hover:shadow-lg group-hover:border-pink-500 transition-all"
						/>
						<div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
					</div>
					<div className="flex-1 text-left min-w-0">
						<p className="font-bold text-neutral-900 dark:text-neutral-50 text-sm truncate group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
							{authUser?.fullName}
						</p>
						<p className="text-xs text-neutral-500 dark:text-neutral-400">@{authUser?.username}</p>
					</div>
				</motion.button>

				{/* Search Input */}
				<SearchInput />

				{/* Header Controls */}
				<div className="flex items-center gap-2">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={toggleTheme}
						className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-800/50 text-neutral-900 dark:text-neutral-50 hover:from-pink-100 hover:to-pink-50 dark:hover:from-pink-900/30 dark:hover:to-pink-900/20 transition-all text-sm font-semibold shadow-sm hover:shadow-md"
					>
						{isDark ? (
							<>
								<MdLightMode className="text-lg" />
								<span className="hidden sm:inline text-xs">Light</span>
							</>
						) : (
							<>
								<MdDarkMode className="text-lg" />
								<span className="hidden sm:inline text-xs">Dark</span>
							</>
						)}
					</motion.button>
					<div className="relative">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setShowMenu(!showMenu)}
							className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all group"
						>
							{showMenu ? (
								<MdClose className="text-lg text-neutral-900 dark:text-neutral-50 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors" />
							) : (
								<MdMoreVert className="text-lg text-neutral-900 dark:text-neutral-50 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors" />
							)}
						</motion.button>
						{showMenu && (
							<motion.div 
								initial={{ opacity: 0, scale: 0.95, y: -10 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: -10 }}
								transition={{ duration: 0.15 }}
								className="absolute right-0 top-full mt-2 backdrop-blur-xl bg-white/95 dark:bg-neutral-800/95 border border-neutral-200 dark:border-neutral-700 p-1 min-w-56 z-50 rounded-2xl shadow-xl"
							>
								<motion.button 
									whileHover={{ backgroundColor: "rgba(236, 72, 153, 0.1)" }}
									className="w-full text-left px-4 py-3 rounded-xl hover:bg-pink-100/50 dark:hover:bg-pink-900/20 text-sm font-medium text-neutral-900 dark:text-neutral-50 transition-colors"
								>
									⚙️ Settings
								</motion.button>
								<motion.button 
									whileHover={{ backgroundColor: "rgba(236, 72, 153, 0.1)" }}
									className="w-full text-left px-4 py-3 rounded-xl hover:bg-pink-100/50 dark:hover:bg-pink-900/20 text-sm font-medium text-neutral-900 dark:text-neutral-50 transition-colors"
								>
									❓ Help & Support
								</motion.button>
								<div className="h-px bg-neutral-200 dark:bg-neutral-700 my-1"></div>
								<LogoutButton />
							</motion.div>
						)}
					</div>
				</div>
			</motion.div>

			{/* Conversations List */}
			<motion.div 
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.1 }}
				className="flex-1 overflow-y-auto"
			>
				<Conversations onCloseSidebar={onCloseSidebar} />
			</motion.div>

			{/* Profile Modal */}
			{showProfileModal && (
				<UserProfile
					userId={authUser?._id}
					onClose={() => setShowProfileModal(false)}
				/>
			)}
		</div>
	);
};

export default Sidebar;
