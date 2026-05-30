import { useState } from "react";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import { useAuthContext } from "../../context/AuthContext";
import UserProfile from "../profile/UserProfile";

const Sidebar = ({ onCloseSidebar }) => {
	const { authUser } = useAuthContext();
	const [showProfileModal, setShowProfileModal] = useState(false);

	return (
		<div className='border-r border-slate-500 p-2 sm:p-3 md:p-4 flex flex-col bg-slate-800 w-full h-full overflow-y-auto'>
			{/* Profile Button */}
			<button
				onClick={() => setShowProfileModal(true)}
				className='flex items-center gap-2 hover:bg-sky-500 rounded p-2 mb-2 w-full text-left'
			>
				<img
					src={authUser?.profilePic}
					alt="Profile"
					className="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover flex-shrink-0"
				/>
				<span className='font-bold text-gray-200 text-xs sm:text-sm truncate'>{authUser?.fullName}</span>
			</button>

			<SearchInput />
			<div className='divider px-3 my-1'></div>
			<Conversations onCloseSidebar={onCloseSidebar} />
			<LogoutButton />

			{showProfileModal && (
				<UserProfile
					userId={authUser?._id}
					onClose={() => setShowProfileModal(false)}
				/>
			)}
		</div>
	);
};
export default Sidebar;

// STARTER CODE FOR THIS FILE
// import Conversations from "./Conversations";
// import LogoutButton from "./LogoutButton";
// import SearchInput from "./SearchInput";

// const Sidebar = () => {
// 	return (
// 		<div className='border-r border-slate-500 p-4 flex flex-col'>
// 			<SearchInput />
// 			<div className='divider px-3'></div>
// 			<Conversations />
// 			<LogoutButton />
// 		</div>
// 	);
// };
// export default Sidebar;
