import { useState, useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";
import VideoCall from "../video/VideoCall";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const [showVideoCall, setShowVideoCall] = useState(false);

	useEffect(() => {
		// cleanup function (unmounts)
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	const handleVideoCallClick = () => {
		setShowVideoCall(true);
	};

	const handleEndCall = () => {
		setShowVideoCall(false);
	};

	return (
		<div className='flex flex-col flex-1 sm:flex-1 md:min-w-[450px]'>
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Header */}
				<div className='bg-slate-500 px-2 sm:px-4 py-2 mb-2 flex justify-between items-center flex-wrap gap-2'>
						<div>
						<span className='label-text text-xs sm:text-sm'>To:</span>{" "}
						<span className='text-gray-900 font-bold text-xs sm:text-sm truncate'>{selectedConversation.fullName}</span>
					</div>
					<div className='flex gap-1 sm:gap-2'>
						<button
							onClick={handleVideoCallClick}
							className='bg-green-600 hover:bg-green-700 text-white py-1 px-2 sm:px-3 rounded-lg text-xs sm:text-sm'
							>
								📹 Call
							</button>
						</div>
					</div>
					<Messages />
					<MessageInput onVideoCallClick={handleVideoCallClick} />
					{showVideoCall && (
						<VideoCall
							recipientId={selectedConversation._id}
							recipientName={selectedConversation.fullName}
							onEndCall={handleEndCall}
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
		<div className='flex items-center justify-center w-full h-full'>
			<div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
				<p>Welcome 👋 {authUser.fullName} ❄</p>
				<p>Select a chat to start messaging</p>
				<TiMessages className='text-3xl md:text-6xl text-center' />
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
