import { useRef, useState } from "react";
import { MdAddAPhoto } from "react-icons/md";
import { useAuthContext } from "../../context/AuthContext";
import { getAvatarUrl } from "../../utils/avatarUtils";
import { apiPost } from "../../utils/api";
import toast from "react-hot-toast";

const CreateStory = ({ onStoryCreated }) => {
	const { authUser } = useAuthContext();
	const [preview, setPreview] = useState(null);
	const [loading, setLoading] = useState(false);
	const fileInputRef = useRef(null);

	const handleImageSelect = async (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = async () => {
				try {
					setLoading(true);
					const response = await apiPost("/api/stories/create", {
						image: reader.result,
					});
					onStoryCreated && onStoryCreated(response);
					toast.success("Story posted!");
				} catch (error) {
					toast.error(error.message || "Failed to create story");
				} finally {
					setLoading(false);
					setPreview(null);
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const profilePic = getAvatarUrl(
		authUser.profilePic,
		authUser.fullName,
		authUser.username
	);

	return (
		<>
			<div
				onClick={() => fileInputRef.current?.click()}
				className="relative cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition flex-shrink-0"
			>
				<img
					src={profilePic}
					alt="Your story"
					className="w-24 h-36 object-cover"
				/>

				{/* Gradient Overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end" />

				{/* Add Story Button */}
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
					<div className="bg-primary-600 text-white rounded-full p-2">
						<MdAddAPhoto className="text-2xl" />
					</div>
					<span className="text-white text-xs font-semibold">Your Story</span>
				</div>
			</div>

			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleImageSelect}
				disabled={loading}
				className="hidden"
			/>
		</>
	);
};

export default CreateStory;
