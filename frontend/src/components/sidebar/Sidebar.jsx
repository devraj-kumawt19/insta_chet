import { useState } from "react";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import { useAuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import UserProfile from "../profile/UserProfile";
import { MdDarkMode, MdLightMode, MdMoreVert } from "react-icons/md";

const Sidebar = ({ onCloseSidebar }) => {
	const { authUser } = useAuthContext();
	const { isDark, toggleTheme } = useTheme();
	const [showProfileModal, setShowProfileModal] = useState(false);
	const [showMenu, setShowMenu] = useState(false);

	return (
		<div className="flex flex-col h-full bg-white dark:bg-dark-surface border-r border-neutral-200 dark:border-neutral-800 overflow-hidden">
			{/* Header Section */}
			<div className="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 space-y-4">
				{/* Profile Button */}
				<button
					onClick={() => setShowProfileModal(true)}
					className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors duration-200"
				>
					<img
						src={authUser?.profilePic}
						alt="Profile"
						className="w-12 h-12 rounded-full object-cover border-2 border-primary-300 dark:border-primary-700"
					/>
					<div className="flex-1 text-left min-w-0">
						<p className="font-bold text-neutral-900 dark:text-neutral-50 text-sm truncate">
							{authUser?.fullName}
						</p>
						<p className="text-xs text-neutral-600 dark:text-neutral-400">@{authUser?.username}</p>
					</div>
				</button>

				{/* Search Input */}
				<SearchInput />

				{/* Header Controls */}
				<div className="flex items-center gap-2">
					<button
						onClick={toggleTheme}
						className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors text-sm font-semibold"
					>
						{isDark ? (
							<>
								<MdLightMode className="text-lg" />
								<span className="hidden sm:inline">Light</span>
							</>
						) : (
							<>
								<MdDarkMode className="text-lg" />
								<span className="hidden sm:inline">Dark</span>
							</>
						)}
					</button>
					<div className="relative">
						<button
							onClick={() => setShowMenu(!showMenu)}
							className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
						>
							<MdMoreVert className="text-lg text-neutral-900 dark:text-neutral-50" />
						</button>
						{showMenu && (
							<div className="absolute right-0 top-full mt-2 glass-card p-2 min-w-48 z-50 animate-slide-in-top">
								<button className="w-full text-left px-4 py-2 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30 text-sm font-medium text-neutral-900 dark:text-neutral-50">
									Settings
								</button>
								<button className="w-full text-left px-4 py-2 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30 text-sm font-medium text-neutral-900 dark:text-neutral-50">
									Help & Support
								</button>
								<LogoutButton />
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Conversations List */}
			<div className="flex-1 overflow-y-auto">
				<Conversations onCloseSidebar={onCloseSidebar} />
			</div>

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
