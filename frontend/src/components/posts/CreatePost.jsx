import { useState, useRef } from "react";
import { MdAddAPhoto } from "react-icons/md";
import { useAuthContext } from "../../context/AuthContext";
import { getAvatarUrl } from "../../utils/avatarUtils";
import { apiPost } from "../../utils/api";
import toast from "react-hot-toast";
import { ProfileImage } from "../ui/UIComponents";

const CreatePost = ({ onPostCreated }) => {
	const { authUser } = useAuthContext();
	const [caption, setCaption] = useState("");
	const [image, setImage] = useState(null);
	const [preview, setPreview] = useState(null);
	const [loading, setLoading] = useState(false);
	const fileInputRef = useRef(null);

	const handleImageSelect = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImage(reader.result);
				setPreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handlePost = async () => {
		if (!caption.trim()) {
			toast.error("Please add a caption");
			return;
		}

		try {
			setLoading(true);
			const response = await apiPost("/api/posts/create", {
				caption,
				image: preview,
			});
			onPostCreated && onPostCreated(response);
			
			// Emit event to refresh user posts in profile
			window.dispatchEvent(new Event("postCreated"));
			
			setCaption("");
			setImage(null);
			setPreview(null);
			toast.success("Post created!");
		} catch (error) {
			toast.error(error.message || "Failed to create post");
		} finally {
			setLoading(false);
		}
	};

	const profilePic = getAvatarUrl(
		authUser.profilePic,
		authUser.fullName,
		authUser.username
	);

	return (
		<div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4 mb-6">
			<div className="flex gap-4">
				<ProfileImage
					src={profilePic}
					alt={authUser.username}
					size="w-12 h-12"
					initials={authUser.fullName?.charAt(0).toUpperCase() || "?"}
				/>

				<div className="flex-1">
					<input
						type="text"
						placeholder="What's on your mind?"
						value={caption}
						onChange={(e) => setCaption(e.target.value)}
						className="w-full px-4 py-3 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 outline-none text-sm focus:ring-2 focus:ring-primary-600"
					/>

					{preview && (
						<div className="relative mt-3 rounded-lg overflow-hidden">
							<img src={preview} alt="Preview" className="w-full max-h-96 object-cover" />
							<button
								onClick={() => {
									setPreview(null);
									setImage(null);
								}}
								className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
							>
								✕
							</button>
						</div>
					)}

					<div className="flex gap-2 mt-3">
						<button
							onClick={() => fileInputRef.current?.click()}
							className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition text-sm font-medium"
						>
							<MdAddAPhoto className="text-lg" />
							Photo
						</button>

						<button
							onClick={handlePost}
							disabled={loading || !caption.trim()}
							className="flex-1 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
						>
							{loading ? "Posting..." : "Post"}
						</button>
					</div>

					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						onChange={handleImageSelect}
						className="hidden"
					/>
				</div>
			</div>
		</div>
	);
};

export default CreatePost;
