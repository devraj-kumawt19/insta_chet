import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdChevronLeft, MdChevronRight, MdClose } from "react-icons/md";
import { apiGet, apiPost } from "../../utils/api";
import toast from "react-hot-toast";
import CreateStory from "../stories/CreateStory";
import { ProfileImage } from "./UIComponents";

const Stories = () => {
	const scrollRef = useRef(null);
	const [stories, setStories] = useState([]);
	const [selectedStory, setSelectedStory] = useState(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);

	const fetchStories = async () => {
		try {
			const response = await apiGet("/api/stories/feed?kind=story");
			setStories(Array.isArray(response) ? response : []);
		} catch (error) {
			toast.error(error.message || "Failed to load stories");
		}
	};

	useEffect(() => {
		fetchStories();
		window.addEventListener("storyCreated", fetchStories);
		return () => window.removeEventListener("storyCreated", fetchStories);
	}, []);

	useEffect(() => {
		const current = scrollRef.current;
		if (!current) return;
		setCanScrollRight(current.scrollWidth > current.clientWidth + 10);
	}, [stories.length]);

	const handleScroll = () => {
		const current = scrollRef.current;
		if (!current) return;
		setCanScrollLeft(current.scrollLeft > 0);
		setCanScrollRight(current.scrollLeft < current.scrollWidth - current.clientWidth - 10);
	};

	const scroll = (direction) => {
		scrollRef.current?.scrollBy({
			left: direction === "left" ? -280 : 280,
			behavior: "smooth",
		});
	};

	const openStory = async (story) => {
		setSelectedStory(story);
		try {
			await apiPost(`/api/stories/${story._id}/view`, {});
		} catch (error) {
			console.error("Failed to mark story viewed:", error);
		}
	};

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: -8 }}
				animate={{ opacity: 1, y: 0 }}
				className="mb-3 border-b border-neutral-100 bg-white px-3 py-3 dark:border-neutral-800 dark:bg-neutral-950"
			>
				<div className="relative group">
				{canScrollLeft && (
					<button
						type="button"
						onClick={() => scroll("left")}
						className="absolute left-0 top-6 z-10 hidden rounded-full bg-white/90 p-1.5 text-neutral-800 shadow-lg transition hover:bg-white dark:bg-neutral-900/90 dark:text-neutral-100 md:block"
					>
						<MdChevronLeft className="text-2xl" />
					</button>
				)}

				<div
					ref={scrollRef}
					onScroll={handleScroll}
					className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide"
					style={{ scrollbarWidth: "none" }}
				>
					<CreateStory variant="circle" onStoryCreated={fetchStories} />

					{stories.map((story) => {
						const author = story.author || {};
						const username = author.username || author.fullName || "user";
						return (
							<button
								type="button"
								key={story._id}
								onClick={() => openStory(story)}
								className="flex w-16 flex-shrink-0 flex-col items-center gap-1.5 sm:w-20"
							>
								<div className="rounded-full bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 p-[2px] shadow-sm">
									<ProfileImage
										src={author.profilePic}
										alt={username}
										size="h-14 w-14 sm:h-16 sm:w-16"
										initials={username.charAt(0).toUpperCase()}
										className="border-2 border-white dark:border-neutral-950"
									/>
								</div>
								<span className="w-full truncate text-center text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
									{username}
								</span>
							</button>
						);
					})}
				</div>

				{canScrollRight && (
					<button
						type="button"
						onClick={() => scroll("right")}
						className="absolute right-0 top-6 z-10 hidden rounded-full bg-white/90 p-1.5 text-neutral-800 shadow-lg transition hover:bg-white dark:bg-neutral-900/90 dark:text-neutral-100 md:block"
					>
						<MdChevronRight className="text-2xl" />
					</button>
				)}
				</div>
			</motion.div>

			<AnimatePresence>
				{selectedStory && (
					<div className="fixed inset-0 z-[130] flex items-center justify-center bg-black">
						<motion.div
							initial={{ opacity: 0, scale: 0.98 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.98 }}
							className="relative h-full w-full max-w-md bg-black"
						>
							<div className="absolute left-3 right-3 top-3 z-20 h-1 overflow-hidden rounded-full bg-white/30">
								<motion.div
									initial={{ width: "0%" }}
									animate={{ width: "100%" }}
									transition={{ duration: 5, ease: "linear" }}
									className="h-full bg-white"
								/>
							</div>

							<div className="absolute left-4 right-4 top-7 z-20 flex items-center justify-between text-white">
								<div className="flex items-center gap-2">
									<ProfileImage
										src={selectedStory.author?.profilePic}
										alt={selectedStory.author?.username || "story"}
										size="h-9 w-9"
										initials={(selectedStory.author?.username || "U").charAt(0).toUpperCase()}
										className="border border-white/70"
									/>
									<span className="text-sm font-bold">
										{selectedStory.author?.username || "user"}
									</span>
								</div>
								<button
									type="button"
									onClick={() => setSelectedStory(null)}
									className="rounded-full bg-black/40 p-2"
									aria-label="Close story"
								>
									<MdClose className="text-2xl" />
								</button>
							</div>

							{selectedStory.mediaType === "video" ? (
								<video
									src={selectedStory.image}
									controls
									autoPlay
									playsInline
									className="h-full w-full object-cover"
								/>
							) : (
								<img
									src={selectedStory.image}
									alt="Story"
									className="h-full w-full object-cover"
								/>
							)}
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</>
	);
};

export default Stories;
