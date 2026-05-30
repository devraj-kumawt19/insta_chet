import { useState } from "react";
import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import UserProfile from "../profile/UserProfile";
import { Avatar, StatusBadge } from "../ui/UIComponents";
import { getAvatarUrl } from "../../utils/avatarUtils";
import { MdMoreVert } from "react-icons/md";

const Conversation = ({ conversation, lastIdx, emoji }) => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const [showProfile, setShowProfile] = useState(false);
	const [showMenu, setShowMenu] = useState(false);

	const isSelected = selectedConversation?._id === conversation._id;
	const { onlineUsers } = useSocketContext();
	const isOnline = onlineUsers.includes(conversation._id);

	return (
		<>
			<div
				className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
					isSelected
						? "bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/40 dark:to-secondary-900/40 shadow-md"
						: "hover:bg-neutral-100 dark:hover:bg-neutral-700/50"
				}`}
				onClick={() => setSelectedConversation(conversation)}
			>
				{/* Avatar with Status */}
				<div
					className="relative flex-shrink-0 cursor-pointer hover:scale-110 transition-transform duration-200"
					onClick={(e) => {
						e.stopPropagation();
						setShowProfile(true);
					}}
				>
					<img
						src={conversation.profilePic}
						alt={conversation.fullName}
						className="w-12 h-12 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-700"
					/>
					{isOnline && (
						<div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-dark-surface" />
					)}
				</div>

				{/* Conversation Info */}
				<div className="flex-1 min-w-0">
					<div className="flex items-center justify-between gap-2 mb-1">
						<p className="font-bold text-neutral-900 dark:text-neutral-50 text-sm truncate">
							{conversation.fullName}
						</p>
						<span className="text-lg flex-shrink-0">{emoji}</span>
					</div>
					<p className="text-xs text-neutral-600 dark:text-neutral-400">
						@{conversation.username}
					</p>
				</div>

				{/* More Options Menu */}
				<div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
					<button
						onClick={(e) => {
							e.stopPropagation();
							setShowMenu(!showMenu);
						}}
						className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
					>
						<MdMoreVert className="text-neutral-600 dark:text-neutral-400" />
					</button>
					{showMenu && (
						<div className="absolute right-0 top-full mt-1 glass-card p-1 min-w-40 z-50 text-sm">
							<button className="w-full text-left px-3 py-2 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30 text-neutral-900 dark:text-neutral-50">
								Pin
							</button>
							<button className="w-full text-left px-3 py-2 rounded hover:bg-primary-100 dark:hover:bg-primary-900/30 text-neutral-900 dark:text-neutral-50">
								Mute
							</button>
							<div className="border-t border-neutral-200 dark:border-neutral-700 my-1" />
							<button className="w-full text-left px-3 py-2 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400">
								Delete
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Profile Modal */}
			{showProfile && (
				<UserProfile
					userId={conversation._id}
					onClose={() => setShowProfile(false)}
				/>
			)}
		</>
	);
};

export default Conversation;

// STARTER CODE SNIPPET
// const Conversation = () => {
// 	return (
// 		<>
// 			<div className='flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer'>
// 				<div className='avatar online'>
// 					<div className='w-12 rounded-full'>
// 						<img
// 							src='https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png'
// 							alt='user avatar'
// 						/>
// 					</div>
// 				</div>

// 				<div className='flex flex-col flex-1'>
// 					<div className='flex gap-3 justify-between'>
// 						<p className='font-bold text-gray-200'>John Doe</p>
// 						<span className='text-xl'>🎃</span>
// 					</div>
// 				</div>
// 			</div>

// 			<div className='divider my-0 py-0 h-1' />
// 		</>
// 	);
// };
// export default Conversation;
