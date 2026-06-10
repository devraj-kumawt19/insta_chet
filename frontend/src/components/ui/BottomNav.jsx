import { motion } from "framer-motion";
import {
	MdHome,
	MdSearch,
	MdAdd,
	MdVideoLibrary,
	MdAccountCircle,
} from "react-icons/md";

const BottomNav = ({ activeTab = "home", onTabChange = () => {} }) => {
	const tabs = [
		{ id: "home", label: "Home", icon: MdHome },
		{ id: "search", label: "Search", icon: MdSearch },
		{ id: "create", label: "Create", icon: MdAdd },
		{ id: "reels", label: "Reels", icon: MdVideoLibrary },
		{ id: "profile", label: "Profile", icon: MdAccountCircle },
	];

	return (
		<motion.div
			initial={{ y: 100 }}
			animate={{ y: 0 }}
			transition={{ type: "spring", stiffness: 100, damping: 20 }}
			className="fixed bottom-0 left-0 right-0 md:hidden z-50 border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
		>
			<div className="flex h-16 items-center justify-around px-3">
				{tabs.map((tab) => {
					const Icon = tab.icon;
					return (
						<motion.button
							key={tab.id}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => onTabChange(tab.id)}
							className="relative flex flex-col items-center justify-center gap-0.5 rounded-lg p-2 transition-colors group"
						>
							<div className="relative">
								<Icon
									className={`text-2xl transition-colors ${
										activeTab === tab.id
											? "text-neutral-950 dark:text-neutral-50"
											: "text-neutral-700 dark:text-neutral-400 group-hover:text-neutral-950 dark:group-hover:text-neutral-200"
									}`}
								/>
								{tab.badge && tab.badge > 0 && (
									<motion.span
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
									>
										{tab.badge > 9 ? "9+" : tab.badge}
									</motion.span>
								)}
							</div>
							<span
								className={`text-[11px] font-semibold transition-colors ${
									activeTab === tab.id
										? "text-neutral-950 dark:text-neutral-50"
										: "text-neutral-600 dark:text-neutral-400"
								}`}
							>
								{tab.label}
							</span>

							{/* Active Indicator */}
							{activeTab === tab.id && (
								<motion.div
									layoutId="activeIndicator"
									className="absolute -top-1 left-1/2 h-0.5 w-7 -translate-x-1/2 rounded-full bg-neutral-950 dark:bg-neutral-50"
									transition={{ type: "spring", stiffness: 380, damping: 30 }}
								/>
							)}
						</motion.button>
					);
				})}
			</div>
		</motion.div>
	);
};

export default BottomNav;
