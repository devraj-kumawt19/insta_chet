import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { useAuthContext } from "../../context/AuthContext";
import VideoCall from "../video/VideoCall";
import { Avatar, Button, ProfileImage } from "../ui/UIComponents";
import { getAvatarUrl } from "../../utils/avatarUtils";
import { MdCall, MdMoreVert, MdKeyboardArrowLeft } from "react-icons/md";

const MessageContainer = ({ onBack }) => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const [showVideoCall, setShowVideoCall] = useState(false);

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

	return (
		<div className="flex flex-col h-full w-full overflow-hidden">
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Chat Header */}
					<motion.div 
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-white dark:bg-neutral-900/95 border-b border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow backdrop-blur-sm flex-shrink-0 z-10"
					>
						<div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
							{/* Back Button (Mobile) */}
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleBack}
								className="md:hidden p-1.5 sm:p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
							>
								<MdKeyboardArrowLeft className="text-2xl text-neutral-900 dark:text-neutral-50" />
							</motion.button>

							{/* Avatar & Name */}
							<motion.div 
								whileHover={{ scale: 1.02 }}
								className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 cursor-pointer group"
							>
								<div className="relative flex-shrink-0">
									<ProfileImage
										src={selectedConversation.profilePic}
										alt={selectedConversation.fullName}
										size="w-10 h-10 sm:w-12 sm:h-12"
										initials={selectedConversation.fullName?.charAt(0).toUpperCase() || selectedConversation.username?.charAt(0).toUpperCase() || "?"}
										className="ring-2 ring-pink-400 dark:ring-pink-500 shadow-md group-hover:ring-pink-500 transition-all"
									/>
									<motion.div 
										animate={{ scale: [1, 1.2, 1] }}
										transition={{ repeat: Infinity, duration: 2 }}
										className="absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-neutral-900 shadow-lg" 
									/>
								</div>
								<div className="min-w-0 flex-1">
									<h2 className="font-bold text-neutral-900 dark:text-neutral-50 text-sm sm:text-base truncate group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
										{selectedConversation.fullName}
									</h2>
									<p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-semibold">
										🟢 Active now
									</p>
								</div>
							</motion.div>
						</div>

						{/* Actions */}
						<motion.div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
							<motion.button
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setShowVideoCall(true)}
								className="p-1.5 sm:p-2.5 rounded-full hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 dark:hover:from-pink-900/30 dark:hover:to-purple-900/30 transition-all text-neutral-700 dark:text-neutral-300 hover:text-pink-600 dark:hover:text-pink-400"
								title="Start video call"
							>
								<MdCall className="text-lg sm:text-xl" />
							</motion.button>
							<motion.button 
								whileHover={{ scale: 1.1, rotate: 90 }}
								whileTap={{ scale: 0.95 }}
								className="p-1.5 sm:p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-50"
								title="More options"
							>
								<MdMoreVert className="text-lg sm:text-xl" />
							</motion.button>
						</motion.div>
					</motion.div>

					{/* Messages Area */}
					<motion.div 
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="flex-1 overflow-y-auto bg-gradient-to-b from-white/50 via-transparent to-white/50 dark:from-neutral-900/50 dark:via-transparent dark:to-neutral-900/50 min-h-0"
					>
						<Messages />
					</motion.div>

					{/* Message Input */}
					<motion.div 
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						className="bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 flex-shrink-0 z-10"
					>
						<MessageInput />
					</motion.div>

					{/* Video Call Modal */}
					{showVideoCall && (
						<VideoCall
							recipientId={selectedConversation._id}
							recipientName={selectedConversation.fullName}
							onEndCall={() => setShowVideoCall(false)}
						/>
					)}
				</>
			)}
		</div>
	);
};

export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	return (
		<motion.div 
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-white via-pink-50/30 to-purple-50/20 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800"
		>
			{/* Decorative elements */}
			<div className="absolute top-0 right-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5"></div>
			<div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5"></div>

			<motion.div 
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ delay: 0.1 }}
				className="text-center space-y-4 sm:space-y-6 relative z-10"
			>
				<motion.div 
					animate={{ y: [0, -10, 0] }}
					transition={{ repeat: Infinity, duration: 2 }}
					className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-pink-400 to-purple-600 shadow-2xl"
				>
					<span className="text-5xl sm:text-7xl">💬</span>
				</motion.div>
				<div>
					<h2 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
						Welcome, {authUser?.fullName}!
					</h2>
					<p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base max-w-xs mx-auto leading-relaxed">
						💭 Select a conversation from the sidebar to start messaging
					</p>
				</div>
				<motion.div 
					animate={{ rotate: [0, 10, -10, 0] }}
					transition={{ repeat: Infinity, duration: 1.5 }}
					className="text-5xl sm:text-6xl"
				>
					👋
				</motion.div>
			</motion.div>
		</motion.div>
	);
};

// STARTER CODE SNIPPET
// import MessageInput from "./MessageInput";
// import Messages from "./Messages";

// const MessageContainer = () => {
// 	return (
// 		<div className='md:min-w-[450px] flex flex-col'>
// 			<>
// 				{/* Header */}
// 				<div className='bg-slate-500 px-4 py-2 mb-2'>
// 					<span className='label-text'>To:</span> <span className='text-gray-900 font-bold'>John doe</span>
// 				</div>

// 				<Messages />
// 				<MessageInput />
// 			</>
// 		</div>
// 	);
// };
// export default MessageContainer;
