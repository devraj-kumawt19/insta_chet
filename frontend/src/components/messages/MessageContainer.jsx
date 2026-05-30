import { useState, useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { useAuthContext } from "../../context/AuthContext";
import VideoCall from "../video/VideoCall";
import { Avatar, Button } from "../ui/UIComponents";
import { getAvatarUrl } from "../../utils/avatarUtils";
import { MdCall, MdMoreVert, MdKeyboardArrowLeft } from "react-icons/md";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const [showVideoCall, setShowVideoCall] = useState(false);

	useEffect(() => {
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	return (
		<div className="flex flex-col h-full">
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Chat Header */}
					<div className="flex items-center justify-between p-4 bg-white dark:bg-dark-surface border-b border-neutral-200 dark:border-neutral-800 shadow-sm">
						<div className="flex items-center gap-3">
							{/* Back Button (Mobile) */}
							<button
								onClick={() => setSelectedConversation(null)}
								className="md:hidden p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
							>
								<MdKeyboardArrowLeft className="text-2xl text-neutral-900 dark:text-neutral-50" />
							</button>

							{/* Avatar & Name */}
							<div className="flex items-center gap-3">
								<div className="relative">
									<img
										src={selectedConversation.profilePic}
										alt={selectedConversation.fullName}
										className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-300 dark:ring-primary-700"
									/>
									<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-dark-surface" />
								</div>
								<div className="min-w-0">
									<h2 className="font-bold text-neutral-900 dark:text-neutral-50 text-sm truncate">
										{selectedConversation.fullName}
									</h2>
									<p className="text-xs text-neutral-600 dark:text-neutral-400">
										Active now
									</p>
								</div>
							</div>
						</div>

						{/* Actions */}
						<div className="flex items-center gap-2">
							<Button
								onClick={() => setShowVideoCall(true)}
								variant="ghost"
								size="sm"
								className="flex items-center gap-2"
							>
								<MdCall className="text-lg" />
								<span className="hidden sm:inline">Call</span>
							</Button>
							<button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors">
								<MdMoreVert className="text-lg text-neutral-900 dark:text-neutral-50" />
							</button>
						</div>
					</div>

					{/* Messages Area */}
					<div className="flex-1 overflow-hidden">
						<Messages />
					</div>

					{/* Message Input */}
					<div className="bg-white dark:bg-dark-surface border-t border-neutral-200 dark:border-neutral-800 p-4">
						<MessageInput />
					</div>

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
		<div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-dark-surface dark:to-dark-bg">
			<div className="text-center space-y-4">
				<div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-accent-200 to-primary-200 dark:from-accent-900/30 dark:to-primary-900/30 mb-2">
					<span className="text-5xl">💬</span>
				</div>
				<div>
					<h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
						Welcome, {authUser?.fullName}!
					</h2>
					<p className="text-neutral-600 dark:text-neutral-400 text-sm max-w-xs">
						Select a conversation from the sidebar to start messaging
					</p>
				</div>
				<div className="text-6xl animate-bounce-slow">👋</div>
			</div>
		</div>
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
