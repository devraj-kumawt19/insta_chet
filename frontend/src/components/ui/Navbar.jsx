import { motion } from "framer-motion";
import { MdFavoriteBorder, MdMailOutline } from "react-icons/md";
import useNotifications from "../../hooks/useNotifications";

const Navbar = ({ onTabChange = () => {} }) => {
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
					<motion.button
						type="button"
						whileTap={{ scale: 0.98 }}
						onClick={() => onTabChange("home")}
						className="flex-shrink-0 text-left"
					>
						<span className="text-2xl font-black italic tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-3xl">
							ChetGram
						</span>
					</motion.button>

					{/* Right Actions */}
					<div className="flex items-center gap-2 md:gap-3">
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							className="relative rounded-full p-2 text-neutral-950 transition hover:bg-neutral-100 dark:text-neutral-50 dark:hover:bg-neutral-800"
							aria-label="Notifications"
						>
							<MdFavoriteBorder className="text-2xl" />
							{notificationCount > 0 && (
								<motion.span
									initial={{ scale: 0, rotate: -180 }}
									animate={{ scale: 1, rotate: 0 }}
									transition={{ type: "spring", stiffness: 400, damping: 10 }}
									className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
								>
									{notificationCount > 9 ? "9+" : notificationCount}
								</motion.span>
							)}
						</motion.button>
						<motion.button
							type="button"
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => onTabChange("messages")}
							className="rounded-full p-2 text-neutral-950 transition hover:bg-neutral-100 dark:text-neutral-50 dark:hover:bg-neutral-800"
							aria-label="Messages"
						>
							<MdMailOutline className="text-2xl" />
						</motion.button>
					</div>
				</div>
			</div>
		</motion.nav>
	);
};

export default Navbar;
