import { useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import useConversation from "../../zustand/useConversation";

const MessageInput = ({ onVideoCallClick }) => {
	const [message, setMessage] = useState("");
	const { loading, sendMessage } = useSendMessage();
	const { selectedConversation } = useConversation();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message) return;
		await sendMessage(message);
		setMessage("");
	};

	return (
		<form className='px-2 sm:px-4 py-2 sm:py-3' onSubmit={handleSubmit}>
			<div className='w-full relative flex gap-1 sm:gap-2 items-center'>
				<input
					type='text'
					className='border text-xs sm:text-sm rounded-lg block w-full p-2 sm:p-2.5 bg-gray-700 border-gray-600 text-white'
					placeholder='Send a message'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<button 
					type='button'
					onClick={onVideoCallClick}
					className='text-white bg-green-600 hover:bg-green-700 p-2 sm:p-2.5 rounded-lg flex-shrink-0'
					title="Start Video Call"
				>
					📹
				</button>
				<button type='submit' className='flex items-center text-white bg-blue-600 hover:bg-blue-700 p-2 sm:p-2.5 rounded-lg flex-shrink-0'>
					{loading ? <div className='loading loading-spinner'></div> : <BsSend />}
				</button>
			</div>
		</form>
	);
};
export default MessageInput;

// STARTER CODE SNIPPET
// import { BsSend } from "react-icons/bs";

// const MessageInput = () => {
// 	return (
// 		<form className='px-4 my-3'>
// 			<div className='w-full'>
// 				<input
// 					type='text'
// 					className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
// 					placeholder='Send a message'
// 				/>
// 				<button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
// 					<BsSend />
// 				</button>
// 			</div>
// 		</form>
// 	);
// };
// export default MessageInput;
