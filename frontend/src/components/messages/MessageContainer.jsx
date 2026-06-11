import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
	MdArrowBack,
	MdClose,
	MdInfoOutline,
	MdOutlineChatBubble,
	MdVideocam,
} from "react-icons/md";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import VideoCall from "../video/VideoCall";
import UserProfile from "../profile/UserProfile";
import { ProfileImage } from "../ui/UIComponents";

const MessageContainer = ({ onBack }) => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const { onlineUsers } = useSocketContext();
	const [showVideoCall, setShowVideoCall] = useState(false);
	const [showProfile, setShowProfile] = useState(false);

	const isOnline = selectedConversation
		? onlineUsers.some((userId) => String(userId) === String(selectedConversation._id))
		: false;

	useEffect(() => {
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	const handleBack = () => {
		if (onBack) {
			onBack();
		} else {
			setSelectedConversation(null);
		}
	};

	if (!selectedConversation) {
		return <NoChatSelected />;
	}

	return (
		<div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-white dark:bg-neutral-950">
			<motion.header
				initial={{ y: -12, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				className="flex h-16 flex-shrink-0 items-center justify-between border-b border-neutral-100 bg-white px-2 dark:border-neutral-800 dark:bg-neutral-950 sm:px-4"
			>
				<div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-3">
					<button
						type="button"
						onClick={handleBack}
						className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full text-neutral-950 transition hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800 md:hidden"
						aria-label="Back to messages"
					>
						<MdArrowBack size={24} />
					</button>

					<button
						type="button"
						onClick={() => setShowProfile(true)}
						className="flex min-w-0 flex-1 items-center gap-2 rounded-md py-1 text-left sm:gap-3"
					>
						<div className="relative flex-shrink-0">
							<ProfileImage
								src={selectedConversation.profilePic}
								alt={selectedConversation.fullName}
								size="h-10 w-10"
								initials={
									selectedConversation.fullName?.charAt(0).toUpperCase() ||
									selectedConversation.username?.charAt(0).toUpperCase() ||
									"?"
								}
								className="ring-1 ring-neutral-200 dark:ring-neutral-700"
							/>
							{isOnline && (
								<span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-neutral-950" />
							)}
						</div>
						<div className="min-w-0">
							<h2 className="truncate text-sm font-bold text-neutral-950 dark:text-white">
								{selectedConversation.fullName}
							</h2>
							<p className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">
								{isOnline ? "Active now" : `@${selectedConversation.username}`}
							</p>
						</div>
					</button>
				</div>

				<div className="flex flex-shrink-0 items-center gap-0.5">
					<button
						type="button"
						onClick={() => setShowVideoCall(true)}
						className="grid h-10 w-10 place-items-center rounded-full text-neutral-950 transition hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"
						title="Start video call"
						aria-label="Start video call"
					>
						<MdVideocam size={23} />
					</button>
					<button
						type="button"
						onClick={() => setShowProfile(true)}
						className="grid h-10 w-10 place-items-center rounded-full text-neutral-950 transition hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"
						title="Conversation details"
						aria-label="Conversation details"
					>
						<MdInfoOutline size={23} />
					</button>
				</div>
			</motion.header>

			<div className="min-h-0 flex-1 overflow-hidden bg-white dark:bg-neutral-950">
				<Messages />
			</div>

			<div className="flex-shrink-0 border-t border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-950">
				<MessageInput />
			</div>

			{showVideoCall && (
				<VideoCall
					recipientId={selectedConversation._id}
					recipientName={selectedConversation.fullName}
					onEndCall={() => setShowVideoCall(false)}
				/>
			)}

			{showProfile && (
				<div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm">
					<motion.div
						initial={{ opacity: 0, scale: 0.98 }}
						animate={{ opacity: 1, scale: 1 }}
						className="relative h-full w-full overflow-y-auto bg-white dark:bg-neutral-950"
					>
						<button
							type="button"
							onClick={() => setShowProfile(false)}
							className="fixed right-4 top-4 z-[110] grid h-11 w-11 place-items-center rounded-full bg-white/90 text-neutral-900 shadow-lg transition hover:bg-neutral-100 dark:bg-neutral-900/90 dark:text-white dark:hover:bg-neutral-800"
							aria-label="Close profile"
						>
							<MdClose className="text-2xl" />
						</button>
						<UserProfile userId={selectedConversation._id} />
					</motion.div>
				</div>
			)}
		</div>
	);
};

const NoChatSelected = () => {
	const { authUser } = useAuthContext();

	return (
		<div className="flex h-full w-full flex-col items-center justify-center bg-neutral-50 px-6 text-center dark:bg-neutral-950">
			<div className="grid h-20 w-20 place-items-center rounded-full border-2 border-neutral-900 text-neutral-950 dark:border-white dark:text-white">
				<MdOutlineChatBubble size={36} />
			</div>
			<h2 className="mt-5 text-lg font-bold text-neutral-950 dark:text-white">
				Your messages
			</h2>
			<p className="mt-1 max-w-xs text-sm text-neutral-500 dark:text-neutral-400">
				Hi {authUser?.fullName || "there"}, select a person to start chatting.
			</p>
		</div>
	);
};

export default MessageContainer;
