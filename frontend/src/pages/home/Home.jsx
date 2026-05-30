import { useState } from "react";
import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import { MdMenu, MdClose } from "react-icons/md";

const Home = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="flex h-screen bg-neutral-50 dark:bg-dark-bg overflow-hidden">
			{/* Mobile Overlay */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-40 animate-fade-in"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<div
				className={`${
					sidebarOpen ? "translate-x-0" : "-translate-x-full"
				} md:translate-x-0 absolute md:relative w-72 h-screen transition-transform duration-300 z-50 md:z-0 border-r border-neutral-200 dark:border-neutral-800`}
			>
				<Sidebar onCloseSidebar={() => setSidebarOpen(false)} />
			</div>

			{/* Main Chat Area */}
			<div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-white to-neutral-50 dark:from-dark-surface dark:to-dark-bg">
				{/* Mobile Header */}
				<div className="md:hidden flex items-center gap-3 p-4 bg-white dark:bg-dark-surface border-b border-neutral-200 dark:border-neutral-800">
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
						aria-label="Toggle sidebar"
					>
						{sidebarOpen ? (
							<MdClose className="text-2xl text-neutral-900 dark:text-neutral-50" />
						) : (
							<MdMenu className="text-2xl text-neutral-900 dark:text-neutral-50" />
						)}
					</button>
					<h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">Messages</h1>
				</div>

				{/* Chat Container */}
				<div className="flex-1 overflow-hidden">
					<MessageContainer />
				</div>
			</div>
		</div>
	);
};

export default Home;
