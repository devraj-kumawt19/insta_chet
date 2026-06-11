import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import {
	MdBookmark,
	MdBookmarkBorder,
	MdClose,
	MdFavorite,
	MdFavoriteBorder,
	MdModeComment,
	MdPlayArrow,
	MdSend,
	MdShare,
	MdVolumeOff,
	MdVolumeUp,
} from "react-icons/md";
import { useAuthContext } from "../../context/AuthContext";
import useFollowUser from "../../hooks/useFollowUser";
import { apiGet, apiPost } from "../../utils/api";
import { ProfileImage } from "./UIComponents";
import UserProfile from "../profile/UserProfile";

const formatCount = (value = 0) => {
	if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(".0", "")}M`;
	if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(".0", "")}K`;
	return String(value);
};

const Reels = () => {
	const { authUser } = useAuthContext();
	const [reels, setReels] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeIndex, setActiveIndex] = useState(0);
	const [muted, setMuted] = useState(true);
	const [commentsReelId, setCommentsReelId] = useState(null);
	const [profileUserId, setProfileUserId] = useState(null);
	const viewedReels = useRef(new Set());
	const feedRef = useRef(null);

	const fetchReels = useCallback(async () => {
		try {
			setLoading(true);
			const response = await apiGet("/api/stories/feed?kind=reel");
			setReels(Array.isArray(response) ? response : []);
		} catch (error) {
			toast.error(error.message || "Failed to load reels");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchReels();
		window.addEventListener("reelCreated", fetchReels);
		return () => window.removeEventListener("reelCreated", fetchReels);
	}, [fetchReels]);

	useEffect(() => {
		const root = feedRef.current;
		if (!root) return undefined;

		const observer = new IntersectionObserver(
			(entries) => {
				const visibleEntry = entries
					.filter((entry) => entry.isIntersecting)
					.sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

				if (visibleEntry) {
					setActiveIndex(Number(visibleEntry.target.dataset.reelIndex));
				}
			},
			{ root, threshold: [0.55, 0.75] }
		);

		root.querySelectorAll("[data-reel-index]").forEach((element) => observer.observe(element));
		return () => observer.disconnect();
	}, [reels]);

	useEffect(() => {
		const activeReel = reels[activeIndex];
		if (!activeReel?._id || viewedReels.current.has(activeReel._id)) return;

		viewedReels.current.add(activeReel._id);
		apiPost(`/api/stories/${activeReel._id}/view`, {})
			.then((updatedReel) => {
				setReels((current) =>
					current.map((reel) =>
						reel._id === updatedReel._id ? { ...reel, views: updatedReel.views } : reel
					)
				);
			})
			.catch(() => {
				viewedReels.current.delete(activeReel._id);
			});
	}, [activeIndex, reels]);

	const updateReel = useCallback((updatedReel) => {
		setReels((current) =>
			current.map((reel) => (reel._id === updatedReel._id ? updatedReel : reel))
		);
	}, []);

	const updateSavedState = useCallback((reelId, isSaved) => {
		setReels((current) =>
			current.map((reel) => (reel._id === reelId ? { ...reel, isSaved } : reel))
		);
	}, []);

	const commentsReel = useMemo(
		() => reels.find((reel) => reel._id === commentsReelId),
		[commentsReelId, reels]
	);

	if (loading) {
		return (
			<div className="flex h-full w-full items-center justify-center bg-black">
				<div className="h-9 w-9 animate-spin rounded-full border-2 border-white/30 border-t-white" />
			</div>
		);
	}

	if (reels.length === 0) {
		return (
			<div className="flex h-full w-full items-center justify-center bg-black px-5 text-white">
				<div className="max-w-sm text-center">
					<div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-white/30">
						<MdPlayArrow size={42} />
					</div>
					<h2 className="mt-5 text-xl font-bold">No reels yet</h2>
					<p className="mt-1 text-sm text-white/60">Create a reel to start the feed.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="relative h-full w-full overflow-hidden bg-black">
			<div
				ref={feedRef}
				className="no-scrollbar h-full snap-y snap-mandatory overflow-y-auto overscroll-contain bg-black"
			>
				{reels.map((reel, index) => (
					<ReelItem
						key={reel._id}
						reel={reel}
						index={index}
						total={reels.length}
						isActive={index === activeIndex && !commentsReelId && !profileUserId}
						muted={muted}
						authUser={authUser}
						onToggleMute={() => setMuted((current) => !current)}
						onUpdate={updateReel}
						onSavedChange={updateSavedState}
						onOpenComments={() => setCommentsReelId(reel._id)}
						onOpenProfile={() => setProfileUserId(reel.author?._id)}
					/>
				))}
			</div>

			<AnimatePresence>
				{commentsReel && (
					<CommentsPanel
						reel={commentsReel}
						onClose={() => setCommentsReelId(null)}
						onUpdate={updateReel}
					/>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{profileUserId && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="absolute inset-0 z-50 overflow-y-auto bg-white dark:bg-neutral-950"
					>
						<button
							type="button"
							onClick={() => setProfileUserId(null)}
							className="fixed right-4 top-4 z-[60] grid h-11 w-11 place-items-center rounded-full bg-black/70 text-white backdrop-blur-md"
							aria-label="Close profile"
						>
							<MdClose size={24} />
						</button>
						<UserProfile userId={profileUserId} />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

const ReelItem = ({
	reel,
	index,
	total,
	isActive,
	muted,
	authUser,
	onToggleMute,
	onUpdate,
	onSavedChange,
	onOpenComments,
	onOpenProfile,
}) => {
	const videoRef = useRef(null);
	const [paused, setPaused] = useState(false);
	const [progress, setProgress] = useState(0);
	const [isLiking, setIsLiking] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [following, setFollowing] = useState(
		authUser?.following?.some((id) => String(id?._id || id) === String(reel.author?._id))
	);
	const { followUser, unfollowUser, loading: followLoading } = useFollowUser();
	const liked = reel.likes?.some((id) => String(id?._id || id) === String(authUser?._id));
	const isOwnReel = String(authUser?._id) === String(reel.author?._id);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		if (isActive && !paused) {
			video.play().catch(() => {});
		} else {
			video.pause();
		}
	}, [isActive, paused]);

	useEffect(() => {
		if (!isActive) {
			setPaused(false);
			setProgress(0);
		}
	}, [isActive]);

	const togglePlayback = () => {
		const video = videoRef.current;
		if (!video) return;

		if (video.paused) {
			video.play().catch(() => {});
			setPaused(false);
		} else {
			video.pause();
			setPaused(true);
		}
	};

	const handleLike = async () => {
		if (isLiking) return;
		setIsLiking(true);
		try {
			const updatedReel = await apiPost(`/api/stories/${reel._id}/like`, {});
			onUpdate(updatedReel);
		} catch (error) {
			toast.error(error.message || "Could not update like");
		} finally {
			setIsLiking(false);
		}
	};

	const handleSave = async () => {
		if (isSaving) return;
		setIsSaving(true);
		try {
			const response = await apiPost(`/api/stories/${reel._id}/save`, {});
			onSavedChange(reel._id, response.isSaved);
		} catch (error) {
			toast.error(error.message || "Could not save reel");
		} finally {
			setIsSaving(false);
		}
	};

	const handleShare = async () => {
		const shareData = {
			title: `${reel.author?.fullName || "Creator"} on ChetGram`,
			text: reel.caption || "Watch this reel on ChetGram",
			url: window.location.href,
		};

		try {
			if (navigator.share) {
				await navigator.share(shareData);
			} else {
				await navigator.clipboard.writeText(window.location.href);
				toast.success("Link copied");
			}
		} catch (error) {
			if (error.name !== "AbortError") toast.error("Could not share reel");
		}
	};

	const handleFollow = async () => {
		const result = following
			? await unfollowUser(reel.author?._id)
			: await followUser(reel.author?._id);
		if (result) setFollowing((current) => !current);
	};

	return (
		<section
			data-reel-index={index}
			className="relative flex h-full min-h-full snap-start items-center justify-center overflow-hidden bg-black"
		>
			<div className="relative h-full w-full overflow-hidden bg-black md:h-[calc(100%-24px)] md:max-h-[860px] md:w-auto md:aspect-[9/16] md:rounded-md">
				<video
					ref={videoRef}
					src={reel.image}
					muted={muted}
					loop
					playsInline
					preload={index <= 1 ? "auto" : "metadata"}
					onClick={togglePlayback}
					onDoubleClick={handleLike}
					onTimeUpdate={(event) => {
						const video = event.currentTarget;
						setProgress(video.duration ? (video.currentTime / video.duration) * 100 : 0);
					}}
					className="h-full w-full cursor-pointer object-contain"
				/>

				<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

				<div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-4 pb-4 pt-4 text-white">
					<div>
						<h1 className="text-lg font-bold">Reels</h1>
						<p className="text-[11px] text-white/65">
							{index + 1} of {total}
						</p>
					</div>
					<button
						type="button"
						onClick={onToggleMute}
						className="grid h-10 w-10 place-items-center rounded-full bg-black/35 backdrop-blur-md"
						aria-label={muted ? "Unmute reel" : "Mute reel"}
					>
						{muted ? <MdVolumeOff size={22} /> : <MdVolumeUp size={22} />}
					</button>
				</div>

				<AnimatePresence>
					{paused && (
						<motion.button
							type="button"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							onClick={togglePlayback}
							className="absolute left-1/2 top-1/2 z-20 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white backdrop-blur-md"
							aria-label="Play reel"
						>
							<MdPlayArrow size={36} />
						</motion.button>
					)}
				</AnimatePresence>

				<div className="absolute bottom-36 right-2 z-20 flex flex-col items-center gap-3 text-white sm:right-4 md:bottom-20">
					<ReelAction
						icon={liked ? <MdFavorite className="text-red-500" /> : <MdFavoriteBorder />}
						label={formatCount(reel.likes?.length)}
						onClick={handleLike}
						disabled={isLiking}
					/>
					<ReelAction
						icon={<MdModeComment />}
						label={formatCount(reel.comments?.length)}
						onClick={onOpenComments}
					/>
					<ReelAction icon={<MdShare />} label="Share" onClick={handleShare} />
					<ReelAction
						icon={reel.isSaved ? <MdBookmark /> : <MdBookmarkBorder />}
						label={reel.isSaved ? "Saved" : "Save"}
						onClick={handleSave}
						disabled={isSaving}
					/>
				</div>

				<div className="absolute bottom-20 left-0 right-14 z-20 px-4 text-white sm:right-20 md:bottom-5">
					<div className="flex items-center gap-2">
						<button type="button" onClick={onOpenProfile} className="flex min-w-0 items-center gap-2 text-left">
							<ProfileImage
								src={reel.author?.profilePic}
								alt={reel.author?.fullName}
								size="h-10 w-10"
								initials={reel.author?.fullName?.charAt(0).toUpperCase() || "?"}
								className="border border-white/70"
							/>
							<span className="truncate text-sm font-bold">
								@{reel.author?.username || "creator"}
							</span>
						</button>
						{!isOwnReel && (
							<button
								type="button"
								onClick={handleFollow}
								disabled={followLoading}
								className="flex-shrink-0 rounded-md border border-white/80 px-2.5 py-1 text-xs font-bold transition hover:bg-white hover:text-black disabled:opacity-60"
							>
								{following ? "Following" : "Follow"}
							</button>
						)}
					</div>
					{reel.caption && (
						<p className="mt-2 line-clamp-2 max-w-lg text-sm leading-relaxed text-white/95">
							{reel.caption}
						</p>
					)}
					<p className="mt-2 text-[11px] text-white/65">
						{formatCount(reel.views?.length)} views
					</p>
				</div>

				<div className="absolute bottom-0 left-0 right-0 z-30 h-0.5 bg-white/20">
					<div className="h-full bg-white transition-[width] duration-100" style={{ width: `${progress}%` }} />
				</div>
			</div>
		</section>
	);
};

const ReelAction = ({ icon, label, onClick, disabled = false }) => (
	<button
		type="button"
		onClick={onClick}
		disabled={disabled}
		className="flex w-12 flex-col items-center gap-0.5 rounded-md py-1 text-white transition active:scale-95 disabled:opacity-50"
	>
		<span className="text-[28px] drop-shadow-lg">{icon}</span>
		<span className="max-w-14 truncate text-[10px] font-semibold drop-shadow-lg">{label}</span>
	</button>
);

const CommentsPanel = ({ reel, onClose, onUpdate }) => {
	const [comment, setComment] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const submitComment = async (event) => {
		event.preventDefault();
		const text = comment.trim();
		if (!text || submitting) return;

		setSubmitting(true);
		try {
			const updatedReel = await apiPost(`/api/stories/${reel._id}/comment`, { text });
			onUpdate(updatedReel);
			setComment("");
		} catch (error) {
			toast.error(error.message || "Could not add comment");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="absolute inset-0 z-40 flex items-end bg-black/55 md:items-stretch md:justify-end"
			onClick={onClose}
		>
			<motion.div
				initial={{ y: "100%" }}
				animate={{ y: 0 }}
				exit={{ y: "100%" }}
				transition={{ type: "spring", stiffness: 320, damping: 32 }}
				onClick={(event) => event.stopPropagation()}
				className="flex h-[68%] w-full flex-col rounded-t-lg bg-white dark:bg-neutral-950 md:h-full md:max-w-md md:rounded-none md:border-l md:border-neutral-800"
			>
				<div className="flex h-14 flex-shrink-0 items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-800">
					<h2 className="text-sm font-bold text-neutral-950 dark:text-white">
						Comments ({reel.comments?.length || 0})
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="grid h-9 w-9 place-items-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
						aria-label="Close comments"
					>
						<MdClose size={22} />
					</button>
				</div>

				<div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
					{reel.comments?.length ? (
						reel.comments.map((item, index) => (
							<div key={item._id || `${item.user?._id}-${index}`} className="flex gap-3">
								<ProfileImage
									src={item.user?.profilePic}
									alt={item.user?.fullName}
									size="h-9 w-9"
									initials={item.user?.fullName?.charAt(0).toUpperCase() || "?"}
								/>
								<div className="min-w-0 flex-1">
									<p className="text-xs font-bold text-neutral-950 dark:text-white">
										@{item.user?.username || "user"}
									</p>
									<p className="mt-0.5 break-words text-sm text-neutral-700 dark:text-neutral-300">
										{item.text}
									</p>
								</div>
							</div>
						))
					) : (
						<div className="flex h-full items-center justify-center text-center">
							<div>
								<p className="text-sm font-bold text-neutral-950 dark:text-white">No comments yet</p>
								<p className="mt-1 text-xs text-neutral-500">Start the conversation.</p>
							</div>
						</div>
					)}
				</div>

				<form onSubmit={submitComment} className="flex flex-shrink-0 items-center gap-2 border-t border-neutral-200 p-3 dark:border-neutral-800">
					<input
						type="text"
						value={comment}
						onChange={(event) => setComment(event.target.value)}
						maxLength={300}
						placeholder="Add a comment..."
						className="h-11 min-w-0 flex-1 rounded-full bg-neutral-100 px-4 text-sm text-neutral-950 outline-none focus:ring-1 focus:ring-blue-500 dark:bg-neutral-900 dark:text-white"
					/>
					<button
						type="submit"
						disabled={!comment.trim() || submitting}
						className="grid h-10 w-10 place-items-center rounded-full bg-blue-600 text-white disabled:bg-neutral-200 disabled:text-neutral-400 dark:disabled:bg-neutral-800"
						aria-label="Post comment"
					>
						<MdSend size={19} />
					</button>
				</form>
			</motion.div>
		</motion.div>
	);
};

export default Reels;
