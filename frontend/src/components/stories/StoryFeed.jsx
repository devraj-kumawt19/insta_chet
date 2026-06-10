import { useState, useEffect } from "react";
import { apiGet } from "../../utils/api";
import toast from "react-hot-toast";
import Story from "./Story";
import CreateStory from "./CreateStory";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const StoryFeed = () => {
	const [stories, setStories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [scrollPos, setScrollPos] = useState(0);

	const fetchStories = async () => {
		try {
			setLoading(true);
			const response = await apiGet("/api/stories/feed?kind=story");
			setStories(response);
		} catch (error) {
			toast.error(error.message || "Failed to load stories");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchStories();
		// Refresh stories every 30 seconds
		const interval = setInterval(fetchStories, 30000);
		return () => clearInterval(interval);
	}, []);

	const handleStoryCreated = (newStory) => {
		setStories([newStory, ...stories]);
	};

	const handleStoryDeleted = (storyId) => {
		setStories(stories.filter(story => story._id !== storyId));
	};

	if (loading && stories.length === 0) {
		return (
			<div className="flex justify-center items-center h-40">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	if (stories.length === 0) return null;

	return (
		<div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4 mb-6">
			<div className="flex items-center gap-2 mb-4">
				<h2 className="font-semibold text-neutral-900 dark:text-white">Stories</h2>
			</div>

			<div className="relative">
				{/* Stories Carousel */}
				<div
					className="flex gap-3 overflow-x-auto pb-2 scroll-smooth"
					style={{ scrollBehavior: "smooth" }}
				>
					<CreateStory onStoryCreated={handleStoryCreated} />

					{stories.map(story => (
						<div key={story._id} className="flex-shrink-0">
							<Story
								story={story}
								onDelete={handleStoryDeleted}
								onView={fetchStories}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default StoryFeed;
