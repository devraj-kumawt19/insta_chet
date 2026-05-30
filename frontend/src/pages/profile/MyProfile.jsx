import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import EditProfile from "../../components/profile/EditProfile";

const MyProfile = () => {
	const { authUser } = useAuthContext();
	const { onlineUsers } = useSocketContext();
	const [showEditModal, setShowEditModal] = useState(false);

	if (!authUser) {
		return <div>Loading...</div>;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6">
			<div className="max-w-2xl mx-auto">
				{/* Profile Card */}
				<div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
					{/* Header Background */}
					<div className="h-32 bg-gradient-to-r from-blue-400 to-purple-400"></div>

					{/* Profile Content */}
					<div className="px-6 pb-6">
						{/* Profile Picture */}
						<div className="flex justify-between items-start -mt-16 mb-6">
							<img
								src={authUser.profilePic}
								alt={authUser.fullName}
								className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
							/>
							<button
								onClick={() => setShowEditModal(true)}
								className="btn btn-primary"
							>
								Edit Profile
							</button>
						</div>

						{/* User Info */}
						<div className="mb-6">
							<h1 className="text-3xl font-bold text-gray-900">{authUser.fullName}</h1>
							<p className="text-gray-600">@{authUser.username}</p>
							<p className="text-gray-700 mt-3">{authUser.bio || "No bio added yet"}</p>
						</div>

						{/* Stats */}
						<div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-gray-200">
							<div className="text-center">
								<p className="text-3xl font-bold text-blue-600">{authUser.followers?.length || 0}</p>
								<p className="text-gray-600 text-sm">Followers</p>
							</div>
							<div className="text-center">
								<p className="text-3xl font-bold text-purple-600">{authUser.following?.length || 0}</p>
								<p className="text-gray-600 text-sm">Following</p>
							</div>
							<div className="text-center">
								<p className="text-3xl font-bold text-green-600">{authUser.gender === "male" ? "👨" : "👩"}</p>
								<p className="text-gray-600 text-sm capitalize">{authUser.gender}</p>
							</div>
						</div>

						{/* Member Since */}
						<div className="mt-6">
							<p className="text-gray-700">
								Member since {new Date(authUser.createdAt).toLocaleDateString()}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Edit Profile Modal */}
			{showEditModal && (
				<EditProfile
					onClose={() => setShowEditModal(false)}
					onProfileUpdate={() => setShowEditModal(false)}
				/>
			)}
		</div>
	);
};

export default MyProfile;
