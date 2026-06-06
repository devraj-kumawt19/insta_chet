import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	MdHome,
	MdSearch,
	MdAdd,
	MdNotifications,
	MdAccountCircle,
	MdLogout,
	MdVideoLibrary,
	MdPeople,
	MdBookmark,
	MdChevronLeft,
	MdChevronRight,
} from "react-icons/md";

const Sidebar = ({
	activeTab = "home",
	onTabChange = () => {},
	onLogout = () => {},
	notificationCount = 5,
}) => {
	const [expanded, setExpanded] = useState(true);
	const [hoveredItem, setHoveredItem] = useState(null);

	const mainMenuItems = [
		{ id: "home",     label: "Home",     icon: MdHome },
		{ id: "reels",    label: "Reels",    icon: MdVideoLibrary },
		{ id: "search",   label: "Search",   icon: MdSearch },
		{ id: "messages", label: "Messages", icon: MdPeople },
		{ id: "profile",  label: "Profile",  icon: MdAccountCircle },
	];

	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Mono:ital,wght@0,400;1,400&display=swap');
				.sidebar-root * { font-family: 'Sora', sans-serif; }
				.sidebar-root .mono { font-family: 'DM Mono', monospace; }

				.sidebar-root {
					background: rgba(10, 10, 15, 0.92);
					backdrop-filter: blur(24px);
					border-right: 1px solid rgba(255,255,255,0.07);
					box-shadow: 4px 0 40px rgba(0,0,0,0.5);
				}

				/* Ambient glow top */
				.sidebar-root::before {
					content: '';
					position: absolute;
					top: -60px;
					left: -40px;
					width: 200px;
					height: 200px;
					background: radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%);
					pointer-events: none;
					border-radius: 9999px;
				}

				/* Ambient glow bottom */
				.sidebar-root::after {
					content: '';
					position: absolute;
					bottom: 60px;
					right: -40px;
					width: 180px;
					height: 180px;
					background: radial-gradient(circle, rgba(244,114,182,0.12) 0%, transparent 70%);
					pointer-events: none;
					border-radius: 9999px;
				}

				.nav-item {
					position: relative;
					border-radius: 14px;
					transition: background 0.2s;
					cursor: pointer;
					overflow: hidden;
				}
				.nav-item::before {
					content: '';
					position: absolute;
					inset: 0;
					border-radius: 14px;
					opacity: 0;
					transition: opacity 0.2s;
					background: linear-gradient(135deg, rgba(244,114,182,0.08), rgba(168,85,247,0.08));
				}
				.nav-item:hover::before { opacity: 1; }
				.nav-item.active::before { opacity: 1; background: linear-gradient(135deg, rgba(244,114,182,0.14), rgba(168,85,247,0.14)); }

				.tooltip {
					position: absolute;
					left: calc(100% + 14px);
					top: 50%;
					transform: translateY(-50%);
					background: rgba(30, 20, 50, 0.95);
					border: 1px solid rgba(168,85,247,0.3);
					color: #e2e8f0;
					font-size: 12px;
					font-weight: 600;
					padding: 6px 12px;
					border-radius: 10px;
					white-space: nowrap;
					pointer-events: none;
					box-shadow: 0 4px 20px rgba(0,0,0,0.4);
					z-index: 999;
				}
				.tooltip::before {
					content: '';
					position: absolute;
					right: 100%;
					top: 50%;
					transform: translateY(-50%);
					border: 5px solid transparent;
					border-right-color: rgba(168,85,247,0.3);
				}

				.create-btn {
					background: linear-gradient(135deg, #f472b6, #a855f7, #6366f1);
					background-size: 200% 200%;
					animation: gradientShift 4s ease infinite;
					border-radius: 14px;
					transition: box-shadow 0.3s, transform 0.15s;
				}
				.create-btn:hover {
					box-shadow: 0 0 24px rgba(168,85,247,0.5), 0 0 48px rgba(244,114,182,0.2);
				}
				@keyframes gradientShift {
					0%   { background-position: 0% 50%; }
					50%  { background-position: 100% 50%; }
					100% { background-position: 0% 50%; }
				}

				.divider {
					height: 1px;
					background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
					margin: 8px 0;
				}

				.logo-icon {
					background: conic-gradient(from 180deg, #f472b6, #a855f7, #6366f1, #22d3ee, #f472b6);
					border-radius: 12px;
				}

				.toggle-btn {
					background: rgba(20, 15, 35, 0.95);
					border: 1px solid rgba(255,255,255,0.1);
					box-shadow: 0 2px 16px rgba(0,0,0,0.5);
					transition: border-color 0.2s, box-shadow 0.2s;
				}
				.toggle-btn:hover {
					border-color: rgba(168,85,247,0.5);
					box-shadow: 0 2px 20px rgba(168,85,247,0.3);
				}
			`}</style>

			<motion.aside
				initial={false}
				animate={{ width: expanded ? 260 : 76 }}
				transition={{ type: "spring", stiffness: 320, damping: 32 }}
				className="sidebar-root hidden md:flex flex-col h-screen fixed left-0 top-0 z-30 overflow-visible"
			>
				{/* Toggle button */}
				<motion.button
					whileTap={{ scale: 0.9 }}
					onClick={() => setExpanded(!expanded)}
					className="toggle-btn absolute -right-3.5 top-[72px] w-7 h-7 rounded-full flex items-center justify-center z-50"
				>
					<motion.div
						animate={{ rotate: expanded ? 0 : 180 }}
						transition={{ duration: 0.3 }}
						className="text-slate-400"
					>
						<MdChevronLeft size={16} />
					</motion.div>
				</motion.button>

				{/* Logo */}
				<div className="px-4 pt-6 pb-5">
					<div className="flex items-center gap-3">
						<motion.div
							animate={{ rotate: [0, 360] }}
							transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
							className="logo-icon flex-shrink-0 w-10 h-10 flex items-center justify-center shadow-lg shadow-purple-900/40"
							style={{ padding: 2 }}
						>
							<div className="w-full h-full bg-[#0a0a0f] rounded-[10px] flex items-center justify-center">
								<span className="text-white font-bold text-base mono">CG</span>
							</div>
						</motion.div>

						<AnimatePresence>
							{expanded && (
								<motion.div
									initial={{ opacity: 0, x: -8 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -8 }}
									transition={{ duration: 0.2 }}
									className="overflow-hidden"
								>
									<p className="text-white font-bold text-lg leading-none tracking-tight">ChetGram</p>
									<p className="mono text-[10px] text-purple-400 mt-0.5">v2.0 · social</p>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>

				<div className="divider mx-4" />

				{/* Nav */}
				<nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto overflow-x-visible">
					{mainMenuItems.map((item, index) => {
						const Icon = item.icon;
						const isActive = activeTab === item.id;
						const isHovered = hoveredItem === item.id;

						return (
							<motion.div
								key={item.id}
								initial={{ opacity: 0, x: -16 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.04, duration: 0.35 }}
								className={`nav-item ${isActive ? "active" : ""}`}
								onMouseEnter={() => setHoveredItem(item.id)}
								onMouseLeave={() => setHoveredItem(null)}
							>
								<motion.button
									whileTap={{ scale: 0.96 }}
									onClick={() => onTabChange(item.id)}
									className="w-full flex items-center gap-3.5 px-3 py-3 relative"
								>
									{/* Icon */}
									<div className="relative flex-shrink-0">
										<motion.div
											animate={isActive
												? { color: "#f472b6" }
												: { color: "#64748b" }
											}
											whileHover={{ scale: 1.1 }}
											transition={{ duration: 0.2 }}
										>
											<Icon size={22} />
										</motion.div>

										{/* Badge */}
										{item.badge > 0 && (
											<motion.span
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												transition={{ type: "spring", stiffness: 400 }}
												className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 flex items-center justify-center rounded-full text-[9px] font-bold text-white px-1"
												style={{ background: "linear-gradient(135deg, #f472b6, #a855f7)" }}
											>
												{item.badge > 9 ? "9+" : item.badge}
											</motion.span>
										)}
									</div>

									{/* Label */}
									<AnimatePresence>
										{expanded && (
											<motion.span
												initial={{ opacity: 0, width: 0 }}
												animate={{ opacity: 1, width: "auto" }}
												exit={{ opacity: 0, width: 0 }}
												transition={{ duration: 0.2 }}
												className={`text-sm font-semibold whitespace-nowrap overflow-hidden ${
													isActive ? "text-white" : "text-slate-500"
												}`}
											>
												{item.label}
											</motion.span>
										)}
									</AnimatePresence>

									{/* Active pill */}
									{isActive && (
										<motion.div
											layoutId="activePill"
											className="absolute right-2 w-1.5 h-5 rounded-full"
											style={{ background: "linear-gradient(180deg, #f472b6, #a855f7)" }}
											transition={{ type: "spring", stiffness: 380, damping: 28 }}
										/>
									)}
								</motion.button>

								{/* Collapsed tooltip */}
								<AnimatePresence>
									{!expanded && isHovered && (
										<motion.div
											initial={{ opacity: 0, x: -6 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: -4 }}
											transition={{ duration: 0.15 }}
											className="tooltip"
										>
											{item.label}
										</motion.div>
									)}
								</AnimatePresence>
							</motion.div>
						);
					})}
				</nav>

				<div className="divider mx-4" />

				{/* Bottom */}
				<div className="px-3 py-4 space-y-2">
					{/* Create */}
					<motion.button
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.96 }}
						onClick={() => onTabChange("create")}
						className="create-btn w-full flex items-center justify-center gap-2 py-2.5 text-white text-sm font-semibold"
					>
						<MdAdd size={20} />
						<AnimatePresence>
							{expanded && (
								<motion.span
									initial={{ opacity: 0, width: 0 }}
									animate={{ opacity: 1, width: "auto" }}
									exit={{ opacity: 0, width: 0 }}
									transition={{ duration: 0.2 }}
									className="overflow-hidden whitespace-nowrap"
								>
									Create Post
								</motion.span>
							)}
						</AnimatePresence>
					</motion.button>

					{/* Logout */}
					<motion.button
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.96 }}
						onClick={onLogout}
						className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-[14px] text-slate-600 hover:text-red-400 transition-colors group"
						style={{ background: "rgba(255,255,255,0.025)" }}
					>
						<MdLogout size={20} className="flex-shrink-0 group-hover:rotate-12 transition-transform duration-200" />
						<AnimatePresence>
							{expanded && (
								<motion.span
									initial={{ opacity: 0, width: 0 }}
									animate={{ opacity: 1, width: "auto" }}
									exit={{ opacity: 0, width: 0 }}
									transition={{ duration: 0.2 }}
									className="text-sm font-semibold whitespace-nowrap overflow-hidden"
								>
									Logout
								</motion.span>
							)}
						</AnimatePresence>
					</motion.button>
				</div>
			</motion.aside>
		</>
	);
};

export default Sidebar;