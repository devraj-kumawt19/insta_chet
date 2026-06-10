import React, { useState } from "react";
import { motion } from "framer-motion";
import {
	MdHome,
	MdSearch,
	MdAdd,
	MdMail,
	MdAccountCircle,
} from "react-icons/md";
import useNotifications from "../../hooks/useNotifications";

const BottomNav = ({ activeTab = "home", onTabChange = () => {} }) => {
	const { notificationCount } = useNotifications();
	const tabs = [
		{ id: "home", label: "Home", icon: MdHome },
		{ id: "search", label: "Search", icon: MdSearch },
		{ id: "create", label: "Create", icon: MdAdd },
		{ id: "messages", label: "Messages", icon: MdMail },
		{ id: "profile", label: "Profile", icon: MdAccountCircle },
	];

	return (
		<motion.div
			initial={{ y: 100 }}
			animate={{ y: 0 }}
			transition={{ type: "spring", stiffness: 100, damping: 20 }}
			className="fixed bottom-0 left-0 right-0 md:hidden z-50 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 backdrop-blur-xl bg-opacity-80 dark:bg-opacity-80"
		>
			<div className="flex items-center justify-around h-20 px-4">
				{tabs.map((tab) => {
					const Icon = tab.icon;
					return (
						<motion.button
							key={tab.id}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => onTabChange(tab.id)}
							className="relative flex flex-col items-center justify-center gap-1 p-3 rounded-lg transition-colors group"
						>
							<div className="relative">
								<Icon
									className={`text-2xl transition-colors ${
										activeTab === tab.id
											? "text-pink-600 dark:text-pink-500"
											: "text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-300"
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
								className={`text-xs font-semibold transition-colors ${
									activeTab === tab.id
										? "text-pink-600 dark:text-pink-500"
										: "text-neutral-600 dark:text-neutral-400"
								}`}
							>
								{tab.label}
							</span>

							{/* Active Indicator */}
							{activeTab === tab.id && (
								<motion.div
									layoutId="activeIndicator"
									className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
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
