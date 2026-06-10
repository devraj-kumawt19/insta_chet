import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { MdClose, MdSend, MdVideoLibrary } from "react-icons/md";
import { apiPost } from "../../utils/api";
import toast from "react-hot-toast";

const CreateReel = ({ onReelCreated }) => {
	const [video, setVideo] = useState(null);
	const [caption, setCaption] = useState("");
	const [loading, setLoading] = useState(false);
	const fileInputRef = useRef(null);

	const handleVideoSelect = (event) => {
		const file = event.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith("video/")) {
			toast.error("Please select a video for reels");
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => setVideo(reader.result);
		reader.readAsDataURL(file);
		event.target.value = "";
	};

	const handleUpload = async () => {
		if (!video) {
			toast.error("Please select a reel video");
			return;
		}

		try {
			setLoading(true);
			const response = await apiPost("/api/stories/create", {
				image: video,
				mediaType: "video",
				kind: "reel",
				caption,
			});
			onReelCreated && onReelCreated(response);
			window.dispatchEvent(new Event("reelCreated"));
			toast.success("Reel uploaded!");
			setVideo(null);
			setCaption("");
		} catch (error) {
			toast.error(error.message || "Failed to upload reel");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
			<div className="relative overflow-hidden rounded-3xl bg-black">
				{video ? (
					<>
						<video src={video} controls className="aspect-[9/16] w-full object-cover" />
						<button
							type="button"
							onClick={() => setVideo(null)}
							className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white"
							aria-label="Remove reel video"
						>
							<MdClose className="text-2xl" />
						</button>
					</>
				) : (
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="flex aspect-[9/16] w-full flex-col items-center justify-center bg-gradient-to-br from-neutral-950 via-neutral-900 to-pink-950 text-white"
					>
						<motion.div
							whileHover={{ scale: 1.08 }}
							className="rounded-full bg-gradient-to-br from-pink-500 to-purple-600 p-4 shadow-xl"
						>
							<MdVideoLibrary className="text-5xl" />
						</motion.div>
						<p className="mt-4 text-xl font-black">Upload reel</p>
						<p className="mt-1 text-sm text-white/60">Choose a vertical video</p>
					</button>
				)}
			</div>

			<textarea
				value={caption}
				onChange={(event) => setCaption(event.target.value)}
				placeholder="Write a caption..."
				rows={3}
				className="mt-4 w-full resize-none rounded-2xl bg-neutral-100 px-4 py-3 text-sm text-neutral-900 outline-none transition focus:ring-2 focus:ring-pink-400 dark:bg-neutral-900 dark:text-neutral-50"
			/>

			<div className="mt-4 flex gap-3">
				<button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					className="flex-1 rounded-full bg-neutral-100 px-4 py-3 text-sm font-bold text-neutral-800 transition hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
				>
					Choose video
				</button>
				<button
					type="button"
					onClick={handleUpload}
					disabled={loading || !video}
					className="flex flex-1 items-center justify-center gap-2 rounded-full bg-pink-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
				>
					<MdSend className="text-lg" />
					{loading ? "Uploading" : "Share reel"}
				</button>
			</div>

			<input
				ref={fileInputRef}
				type="file"
				accept="video/*"
				onChange={handleVideoSelect}
				disabled={loading}
				className="hidden"
			/>
		</div>
	);
};

export default CreateReel;
