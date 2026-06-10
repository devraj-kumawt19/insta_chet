import React, { useState } from "react";
import { motion } from "framer-motion";
import { MdSearch, MdFavoriteBorder, MdNotifications } from "react-icons/md";
import ThemeToggle from "./ThemeToggle";
import useNotifications from "../../hooks/useNotifications";

const Navbar = () => {
	const [searchFocused, setSearchFocused] = useState(false);
	const { notificationCount } = useNotifications();

	return (
		<motion.nav
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ type: "spring", stiffness: 100, damping: 20 }}
			className="sticky top-0 z-40 backdrop-blur-2xl bg-white/95 dark:bg-neutral-900/95 border-b border-neutral-100 dark:border-neutral-800 shadow-sm"
		>
			<div className="max-w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16 md:h-14">
					{/* Logo - Instagram Style */}
					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.98 }}
						className="flex items-center gap-2.5 cursor-pointer flex-shrink-0"
					>
						<div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600 flex items-center justify-center shadow-lg relative">
							<span className="text-white font-black text-lg md:text-xl">C</span>
							<div className="absolute inset-0 rounded-lg bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
						</div>
						<div className="hidden sm:flex flex-col">
							<span className="text-lg md:text-xl font-black bg-gradient-to-r from-pink-600 via-red-500 to-purple-600 bg-clip-text text-transparent">
								ChetGram
							</span>
							<span className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold tracking-widest">SOCIAL</span>
						</div>
					</motion.div>

					{/* Search Bar - Instagram Style */}
					<motion.div
						animate={{ width: searchFocused ? 360 : 280 }}
						className="hidden md:flex items-center flex-1 mx-6 lg:mx-8"
					>
						<div className="relative w-full">
							<MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-500 text-lg" />
							<input
								type="text"
								placeholder="Search..."
								onFocus={() => setSearchFocused(true)}
								onBlur={() => setSearchFocused(false)}
								className="w-full pl-11 pr-5 py-2 rounded-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:border-pink-400 dark:focus:border-pink-500 focus:ring-1 focus:ring-pink-400 dark:focus:ring-pink-500 focus:outline-none focus:bg-white dark:focus:bg-neutral-800/80 transition-all text-sm font-medium placeholder-neutral-500 dark:placeholder-neutral-400"
							/>
						</div>
					</motion.div>

					{/* Right Actions */}
					<div className="flex items-center gap-2 md:gap-3">
						{/* Mobile Search Icon */}
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							className="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300"
						>
							<MdSearch className="text-xl" />
						</motion.button>

						{/* Notifications */}
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							className="relative p-2 md:p-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
						>
							<MdNotifications className="text-xl md:text-2xl text-neutral-700 dark:text-neutral-300 group-hover:text-pink-500 transition-colors" />
							{notificationCount > 0 && (
								<motion.span
									initial={{ scale: 0, rotate: -180 }}
									animate={{ scale: 1, rotate: 0 }}
									transition={{ type: "spring", stiffness: 400, damping: 10 }}
									className="absolute top-0 right-0 w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-pink-500 to-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold shadow-lg"
								>
									{notificationCount > 9 ? "9+" : notificationCount}
								</motion.span>
							)}
						</motion.button>

						{/* Theme Toggle */}
						<ThemeToggle />
					</div>
				</div>
			</div>
		</motion.nav>
	);
};

export default Navbar;
