import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { MdChevronLeft, MdChevronRight, MdAdd } from "react-icons/md";

const Stories = ({ stories = [] }) => {
	const scrollRef = useRef(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(stories.length > 0);

	const displayStories = stories || [];

	const scroll = (direction) => {
		if (scrollRef.current) {
			const { current } = scrollRef;
			const scrollAmount = 300;
			if (direction === "left") {
				current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
			} else {
				current.scrollBy({ left: scrollAmount, behavior: "smooth" });
			}
		}
	};

	const handleScroll = () => {
		if (scrollRef.current) {
			const { current } = scrollRef;
			setCanScrollLeft(current.scrollLeft > 0);
			setCanScrollRight(
				current.scrollLeft < current.scrollWidth - current.clientWidth - 10
			);
		}
	};

	const storyVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: (i) => ({
			opacity: 1,
			y: 0,
			transition: {
				delay: i * 0.05,
				duration: 0.3,
			},
		}),
		hover: { scale: 1.1 },
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="bg-white dark:bg-neutral-900/95 rounded-lg sm:rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-2xl dark:shadow-black/30 border border-neutral-100 dark:border-neutral-800 p-3 sm:p-5 mb-4 sm:mb-6 overflow-hidden backdrop-blur-sm transition-all duration-300"
		>
			<div className="relative group">
				{displayStories.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-8 sm:py-12">
						<div className="text-3xl sm:text-4xl mb-2 sm:mb-3">📸</div>
						<p className="text-neutral-600 dark:text-neutral-400 font-medium text-sm sm:text-base">No stories yet</p>
						<p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">Follow users to see their stories</p>
					</div>
				) : (
				<>
				{/* Scroll Left Button */}
				{canScrollLeft && (
					<motion.button
						whileHover={{ scale: 1.15, x: -4 }}
						whileTap={{ scale: 0.9 }}
						onClick={() => scroll("left")}
						className="absolute left-1 sm:left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full p-2 sm:p-2.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
					>
						<MdChevronLeft className="text-lg sm:text-2xl text-white" />
					</motion.button>
				)}

				{/* Stories Carousel */}
				<div
					ref={scrollRef}
					onScroll={handleScroll}
					className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 scroll-smooth scrollbar-hide"
					style={{ scrollBehavior: "smooth", scrollbarWidth: "none" }}
				>
					{displayStories.map((story, index) => (
						<motion.div
							key={story.id}
							custom={index}
							variants={storyVariants}
							initial="hidden"
							animate="visible"
							whileHover="hover"
							className="flex flex-col items-center gap-1.5 sm:gap-2 flex-shrink-0 cursor-pointer"
						>
							{/* Story Ring */}
							<div className="relative group/story">
								<motion.div
									whileHover={{ scale: 1.08 }}
									className={`w-16 h-16 sm:w-24 sm:h-24 rounded-full p-0.5 sm:p-1 transition-all shadow-lg ${
										story.isOwn
											? "bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600"
											: story.viewed
											? "bg-gradient-to-br from-gray-400 to-gray-500 dark:from-neutral-700 dark:to-neutral-600"
											: "bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 shadow-xl hover:shadow-2xl"
									}`}
								>
									<img
										src={story.avatar}
										alt={story.username}
										className="w-full h-full rounded-full object-cover border-2 sm:border-4 border-white dark:border-neutral-900 shadow-inner"
									/>
								</motion.div>

								{/* Add Story Button */}
								{story.isOwn && (
									<motion.button
										whileHover={{ scale: 1.15, rotate: 90 }}
										whileTap={{ scale: 0.9 }}
										className="absolute bottom-0 right-0 bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full p-1 sm:p-2 shadow-xl border-3 sm:border-4 border-white dark:border-neutral-900 cursor-pointer transition-all"
									>
										<MdAdd className="text-white text-sm sm:text-lg" />
									</motion.button>
								)}

								{/* Hover Effect Overlay */}
								<div className="absolute inset-0 rounded-full bg-gradient-to-br from-black/0 to-black/10 opacity-0 group-hover/story:opacity-100 transition-opacity duration-300"></div>
							</div>

							{/* Username */}
							<motion.p 
								whileHover={{ color: "#ec4853" }}
								className="text-[10px] sm:text-xs font-bold text-neutral-900 dark:text-neutral-50 text-center truncate w-16 sm:w-24 transition-colors duration-200"
							>
								{story.username === "Your Story" ? "👤 You" : story.username}
							</motion.p>

							{/* Status Indicator */}
							{!story.isOwn && story.viewed && (
								<div className="text-[9px] sm:text-[10px] text-neutral-400 dark:text-neutral-500 font-semibold">
									Viewed
								</div>
							)}
						</motion.div>
					))}
				</div>

				{/* Scroll Right Button */}
				{canScrollRight && (
					<motion.button
						whileHover={{ scale: 1.15, x: 4 }}
						whileTap={{ scale: 0.9 }}
						onClick={() => scroll("right")}
						className="absolute right-1 sm:right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 rounded-full p-2 sm:p-2.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
					>
						<MdChevronRight className="text-2xl text-white" />
					</motion.button>
				)}
				</>
				)}
			</div>
		</motion.div>
	);
};

export default Stories;
