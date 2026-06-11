import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
	MdClose,
	MdCloudUpload,
	MdSend,
	MdVideoLibrary,
} from "react-icons/md";
import { apiPost } from "../../utils/api";
import toast from "react-hot-toast";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const formatFileSize = (bytes = 0) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const formatDuration = (seconds = 0) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

const CreateReel = ({ onReelCreated }) => {
	const [video, setVideo] = useState(null);
	const [fileInfo, setFileInfo] = useState(null);
	const [caption, setCaption] = useState("");
	const [loading, setLoading] = useState(false);
	const fileInputRef = useRef(null);

	const clearVideo = () => {
		setVideo(null);
		setFileInfo(null);
	};

	const handleVideoSelect = (event) => {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (!file) return;

		if (!file.type.startsWith("video/")) {
			toast.error("Please select a video file");
			return;
		}

		if (file.size > MAX_FILE_SIZE) {
			toast.error("Video must be smaller than 50 MB");
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			setVideo(reader.result);
			setFileInfo({ name: file.name, size: file.size, duration: 0 });
		};
		reader.readAsDataURL(file);
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
				caption: caption.trim(),
			});
			window.dispatchEvent(new Event("reelCreated"));
			toast.success("Reel shared");
			clearVideo();
			setCaption("");
			onReelCreated?.(response);
		} catch (error) {
			toast.error(error.message || "Failed to upload reel");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
			<div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
				<div>
					<h2 className="text-base font-bold text-neutral-950 dark:text-white">New reel</h2>
					<p className="text-xs text-neutral-500 dark:text-neutral-400">Vertical video works best</p>
				</div>
				<MdVideoLibrary className="text-2xl text-neutral-700 dark:text-neutral-200" />
			</div>

			<div className="grid gap-0 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
				<div className="relative overflow-hidden bg-black">
					{video ? (
						<>
							<video
								src={video}
								controls
								playsInline
								onLoadedMetadata={(event) =>
									setFileInfo((current) => ({
										...current,
										duration: event.currentTarget.duration,
									}))
								}
								className="aspect-[9/16] w-full object-contain"
							/>
							<button
								type="button"
								onClick={clearVideo}
								className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-black/65 text-white backdrop-blur-md"
								aria-label="Remove reel video"
							>
								<MdClose className="text-2xl" />
							</button>
						</>
					) : (
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="flex aspect-[9/16] w-full flex-col items-center justify-center bg-neutral-950 px-6 text-center text-white"
						>
							<motion.div
								whileHover={{ scale: 1.06 }}
								className="grid h-16 w-16 place-items-center rounded-full border border-white/25 bg-white/10"
							>
								<MdCloudUpload className="text-3xl" />
							</motion.div>
							<p className="mt-4 text-base font-bold">Choose a video</p>
							<p className="mt-1 text-xs leading-relaxed text-white/55">
								MP4, WebM or MOV up to 50 MB
							</p>
						</button>
					)}
				</div>

				<div className="flex flex-col p-4">
					<label className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400">
						Caption
					</label>
					<textarea
						value={caption}
						onChange={(event) => setCaption(event.target.value)}
						maxLength={500}
						placeholder="Tell people about your reel..."
						rows={6}
						className="mt-2 w-full flex-1 resize-none rounded-md border border-neutral-200 bg-neutral-50 px-3 py-3 text-sm text-neutral-950 outline-none focus:border-blue-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
					/>
					<div className="mt-1 flex items-center justify-between text-[11px] text-neutral-500">
						<span>{fileInfo?.name || "No video selected"}</span>
						<span>{caption.length}/500</span>
					</div>

					{fileInfo && (
						<div className="mt-4 grid grid-cols-2 gap-2 text-xs">
							<div className="rounded-md bg-neutral-100 p-3 dark:bg-neutral-900">
								<p className="text-neutral-500">Size</p>
								<p className="mt-0.5 font-bold text-neutral-950 dark:text-white">
									{formatFileSize(fileInfo.size)}
								</p>
							</div>
							<div className="rounded-md bg-neutral-100 p-3 dark:bg-neutral-900">
								<p className="text-neutral-500">Duration</p>
								<p className="mt-0.5 font-bold text-neutral-950 dark:text-white">
									{formatDuration(fileInfo.duration)}
								</p>
							</div>
						</div>
					)}

					<div className="mt-4 flex gap-2">
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							disabled={loading}
							className="flex-1 rounded-md border border-neutral-300 px-4 py-2.5 text-sm font-bold text-neutral-800 transition hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-900"
						>
							{video ? "Replace" : "Choose video"}
						</button>
						<button
							type="button"
							onClick={handleUpload}
							disabled={loading || !video}
							className="flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-neutral-300 dark:disabled:bg-neutral-800"
						>
							<MdSend className="text-lg" />
							{loading ? "Sharing..." : "Share reel"}
						</button>
					</div>
				</div>
			</div>

			<input
				ref={fileInputRef}
				type="file"
				accept="video/mp4,video/webm,video/quicktime,video/*"
				onChange={handleVideoSelect}
				disabled={loading}
				className="hidden"
			/>
		</div>
	);
};

export default CreateReel;
