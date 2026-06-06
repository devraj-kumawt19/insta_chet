import { useState, useEffect } from "react";
import { MdDeleteOutline, MdClose } from "react-icons/md";
import { useAuthContext } from "../../context/AuthContext";
import { getAvatarUrl } from "../../utils/avatarUtils";
import { extractTime } from "../../utils/extractTime";
import { ProfileImage } from "../ui/UIComponents";
import { apiPost, apiDelete } from "../../utils/api";
import toast from "react-hot-toast";

const Story = ({ story, onDelete, onView }) => {
	const { authUser } = useAuthContext();
	const [showFull, setShowFull] = useState(false);
	const [isViewing, setIsViewing] = useState(false);

	const handleView = async () => {
		try {
			await apiPost(`/api/stories/${story._id}/view`);
			onView && onView();
			setShowFull(true);
		} catch (error) {
			console.error("Failed to mark story as viewed", error);
		}
	};

	const handleDelete = async () => {
		if (!window.confirm("Delete this story?")) return;

		try {
			await apiDelete(`/api/stories/${story._id}`);
			onDelete && onDelete(story._id);
			toast.success("Story deleted");
		} catch (error) {
			toast.error(error.message || "Failed to delete story");
		}
	};

	const profilePic = getAvatarUrl(
		story.author.profilePic,
		story.author.fullName,
		story.author.username
	);

	if (showFull) {
		return (
			<div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
				<div className="relative w-full max-w-md">
					<img src={story.image} alt="Story" className="w-full h-screen object-contain" />

					<button
						onClick={() => setShowFull(false)}
						className="absolute top-4 right-4 bg-white/20 text-white p-2 rounded-full hover:bg-white/30"
					>
						<MdClose className="text-2xl" />
					</button>

					{/* Story Info */}
					<div className="absolute top-4 left-4 flex items-center gap-2">
					<ProfileImage
						src={profilePic}
						alt={story.author.username}
						size="w-10 h-10"
						initials={story.author.fullName?.charAt(0).toUpperCase() || "?"}
						className="border-2 border-white"
						/>
						<div className="text-white">
							<p className="font-semibold text-sm">{story.author.fullName}</p>
							<p className="text-xs opacity-80">{extractTime(story.createdAt)}</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			onClick={handleView}
			className="relative cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
		>
			{/* Story Thumbnail */}
			<img
				src={story.image}
				alt="Story"
				className="w-24 h-36 object-cover"
		/>

		{/* Gradient Overlay */}
		<div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

		{/* Story Author Info */}
		<div className="absolute bottom-0 left-0 right-0 p-2 text-white">
			<ProfileImage
				src={profilePic}
				alt={story.author.username}
				size="w-6 h-6"
				initials={story.author.fullName?.charAt(0).toUpperCase() || "?"}
				className="mb-1 border border-white"
			/>
			<p className="text-xs font-semibold truncate">{story.author.username}</p>
		</div>

		{/* Delete Button */}
		{authUser._id === story.author._id && (
			<button
				onClick={(e) => {
					e.stopPropagation();
					handleDelete();
				}}
				className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded hover:bg-red-600"
			>
				<MdDeleteOutline className="text-sm" />
			</button>
		)}

		{/* View Count Badge */}
		<div className="absolute top-1 left-1 bg-white/20 text-white text-xs px-2 py-1 rounded-full">
			{story.views.length} views
			</div>
		</div>
	);
};

export default Story;
