import { useState } from "react";
import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";

const Home = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className='flex h-screen sm:h-[85vh] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 w-full'>
			{/* Mobile Overlay */}
			{sidebarOpen && (
				<div
					className='fixed inset-0 bg-black bg-opacity-50 md:hidden z-40'
					onClick={() => setSidebarOpen(false)}
				></div>
			)}

			{/* Sidebar */}
			<div
				className={`${
					sidebarOpen ? "translate-x-0" : "-translate-x-full"
				} md:translate-x-0 absolute md:relative w-56 sm:w-64 md:w-auto h-full transition-transform duration-300 z-50 md:z-0`}
			>
				<Sidebar onCloseSidebar={() => setSidebarOpen(false)} />
			</div>

			{/* Message Container */}
			<div className='flex-1 flex flex-col relative'>
				{/* Mobile Menu Button */}
				<button
					onClick={() => setSidebarOpen(!sidebarOpen)}
					className='md:hidden p-2 text-white bg-slate-600 hover:bg-slate-700 text-xl'
				>
					☰
				</button>
				<MessageContainer />
			</div>
		</div>
	);
};
export default Home;
