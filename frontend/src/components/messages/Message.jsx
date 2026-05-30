import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import { getAvatarUrl } from "../../utils/avatarUtils";
import useConversation from "../../zustand/useConversation";
import { MdCheckCircle, MdDone } from "react-icons/md";

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();
	const fromMe = message.senderId === authUser._id;
	const formattedTime = extractTime(message.createdAt);
	const profilePicUrl = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
	const profilePic = fromMe 
		? getAvatarUrl(profilePicUrl, authUser.fullName, authUser.username)
		: getAvatarUrl(profilePicUrl, selectedConversation?.fullName, selectedConversation?.username);
	const shakeClass = message.shouldShake ? "animate-shake" : "";

	return (
		<div className={`flex gap-3 ${fromMe ? "flex-row-reverse" : "flex-row"} animate-fade-in`}>
			{/* Avatar */}
			<div className="flex-shrink-0">
				<img
					src={profilePic}
					alt="User avatar"
					className="w-8 h-8 rounded-full object-cover ring-1 ring-neutral-200 dark:ring-neutral-700"
				/>
			</div>

			{/* Message Content */}
			<div className={`flex flex-col ${fromMe ? "items-end" : "items-start"} max-w-xs sm:max-w-sm`}>
				{/* Message Bubble */}
				<div
					className={`group relative px-4 py-2 rounded-2xl transition-all duration-200 ${
						fromMe
							? "bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-br-none shadow-lg hover:shadow-xl"
							: "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 rounded-bl-none shadow-sm hover:shadow-md"
					} ${shakeClass}`}
				>
					<p className="text-sm break-words">{message.message}</p>
				</div>

				{/* Timestamp & Status */}
				<div
					className={`flex items-center gap-2 mt-1 text-xs text-neutral-600 dark:text-neutral-400 ${
						fromMe ? "flex-row-reverse" : "flex-row"
					}`}
				>
					<span>{formattedTime}</span>
					{fromMe && (
						<div className="flex items-center">
							{message.seen ? (
								<MdCheckCircle className="text-primary-600 dark:text-primary-400" title="Seen" />
							) : (
								<MdDone className="text-neutral-500 dark:text-neutral-600" title="Sent" />
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Message;
