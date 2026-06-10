import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdAdd, MdAddAPhoto, MdClose, MdSend } from "react-icons/md";
import { useAuthContext } from "../../context/AuthContext";
import { getAvatarUrl } from "../../utils/avatarUtils";
import { apiPost } from "../../utils/api";
import toast from "react-hot-toast";

const CreateStory = ({ onStoryCreated, variant = "circle" }) => {
	const { authUser } = useAuthContext();
	const [preview, setPreview] = useState(null);
	const [mediaType, setMediaType] = useState("image");
	const [loading, setLoading] = useState(false);
	const fileInputRef = useRef(null);

	const profilePic = getAvatarUrl(
		authUser.profilePic,
		authUser.fullName,
		authUser.username
	);

	const handleMediaSelect = (event) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const nextMediaType = file.type.startsWith("video/") ? "video" : "image";
		const reader = new FileReader();
		reader.onloadend = () => {
			setMediaType(nextMediaType);
			setPreview(reader.result);
		};
		reader.readAsDataURL(file);
		event.target.value = "";
	};

	const handleShare = async () => {
		if (!preview) return;

		try {
			setLoading(true);
			const response = await apiPost("/api/stories/create", {
				image: preview,
				mediaType,
				kind: "story",
			});
			onStoryCreated && onStoryCreated(response);
			window.dispatchEvent(new Event("storyCreated"));
			toast.success("Story posted!");
			setPreview(null);
		} catch (error) {
			toast.error(error.message || "Failed to create story");
		} finally {
			setLoading(false);
		}
	};

	const pickerInput = (
		<input
			ref={fileInputRef}
			type="file"
			accept="image/*,video/*"
			onChange={handleMediaSelect}
			disabled={loading}
			className="hidden"
		/>
	);

	const previewModal = (
		<AnimatePresence>
			{preview && (
				<div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm">
					<motion.div
						initial={{ opacity: 0, scale: 0.96 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.96 }}
						className="relative flex h-full max-h-[760px] w-full max-w-sm flex-col overflow-hidden rounded-3xl bg-neutral-950 shadow-2xl"
					>
						<button
							type="button"
							onClick={() => setPreview(null)}
							className="absolute right-3 top-3 z-10 rounded-full bg-black/45 p-2 text-white"
							aria-label="Close story preview"
						>
							<MdClose className="text-2xl" />
						</button>

						<div className="flex-1 bg-black">
							{mediaType === "video" ? (
								<video src={preview} controls className="h-full w-full object-cover" />
							) : (
								<img src={preview} alt="Story preview" className="h-full w-full object-cover" />
							)}
						</div>

						<div className="flex items-center justify-between gap-3 border-t border-white/10 bg-neutral-950 p-4">
							<div className="flex items-center gap-3 text-white">
								<img src={profilePic} alt="Your story" className="h-10 w-10 rounded-full object-cover" />
								<div>
									<p className="text-sm font-bold">Your story</p>
									<p className="text-xs text-white/60">Visible for 24 hours</p>
								</div>
							</div>
							<button
								type="button"
								onClick={handleShare}
								disabled={loading}
								className="flex items-center gap-2 rounded-full bg-pink-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-pink-700 disabled:opacity-60"
							>
								<MdSend className="text-lg" />
								{loading ? "Posting" : "Share"}
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);

	if (variant === "panel") {
		return (
			<div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
				<button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					className="flex aspect-[9/16] w-full flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-pink-300 bg-gradient-to-br from-pink-50 to-purple-50 text-neutral-900 transition hover:border-pink-500 dark:border-pink-900/60 dark:from-neutral-900 dark:to-neutral-800 dark:text-neutral-50"
				>
					<div className="rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-4 text-white shadow-xl">
						<MdAddAPhoto className="text-4xl" />
					</div>
					<p className="mt-4 text-lg font-black">Create story</p>
					<p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Photo or video, Instagram style</p>
				</button>
				{pickerInput}
				{previewModal}
			</div>
		);
	}

	return (
		<>
			<button
				type="button"
				onClick={() => fileInputRef.current?.click()}
				className="flex w-16 flex-shrink-0 flex-col items-center gap-1.5 sm:w-20"
			>
				<div className="relative rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 p-[2px] dark:from-neutral-700 dark:to-neutral-600">
					<img
						src={profilePic}
						alt="Your story"
						className="h-14 w-14 rounded-full border-2 border-white object-cover dark:border-neutral-900 sm:h-16 sm:w-16"
					/>
					<span className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-blue-500 p-0.5 text-white dark:border-neutral-900">
						<MdAdd className="text-sm" />
					</span>
				</div>
				<span className="w-full truncate text-center text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
					Your story
				</span>
			</button>
			{pickerInput}
			{previewModal}
		</>
	);
};

export default CreateStory;
