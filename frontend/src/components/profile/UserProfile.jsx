import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import useFollowUser from "../../hooks/useFollowUser";
import EditProfile from "./EditProfile";

const UserProfile = ({ userId, onClose }) => {
	const { authUser } = useAuthContext();
	const { user, loading } = useGetUserProfile(userId);
	const { followUser, unfollowUser, loading: followLoading } = useFollowUser();
	const [isFollowing, setIsFollowing] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<span className="loading loading-spinner loading-lg"></span>
			</div>
		);
	}

	if (!user) {
		return <div className="text-center text-gray-500 text-sm">User not found</div>;
	}

	const handleFollow = async () => {
		const result = await followUser(userId);
		if (result) {
			setIsFollowing(true);
		}
	};

	const handleUnfollow = async () => {
		const result = await unfollowUser(userId);
		if (result) {
			setIsFollowing(false);
		}
	};

	return (
		<>
			<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
				<div className="bg-white rounded-2xl w-96 max-h-96 overflow-y-auto">
					{/* Close button */}
					<button
						onClick={onClose}
						className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
					>
						✕
					</button>

					{/* Profile Header */}
					<div className="bg-gradient-to-r from-blue-500 to-purple-500 h-24"></div>

					{/* Profile Picture */}
					<div className="flex justify-center -mt-12 mb-4">
						<img
							src={user.profilePic}
							alt={user.fullName}
							className="w-24 h-24 rounded-full border-4 border-white object-cover"
						/>
					</div>

					{/* User Info */}
					<div className="text-center px-4">
						<h2 className="text-2xl font-bold">{user.fullName}</h2>
						<p className="text-gray-600">@{user.username}</p>
						<p className="text-gray-700 mt-2">{user.bio || "No bio"}</p>
					</div>

					{/* Stats */}
					<div className="flex justify-around mt-6 px-4 py-4 border-t">
						<div className="text-center">
							<p className="text-2xl font-bold">{user.followers?.length || 0}</p>
							<p className="text-gray-600 text-sm">Followers</p>
						</div>
						<div className="text-center">
							<p className="text-2xl font-bold">{user.following?.length || 0}</p>
							<p className="text-gray-600 text-sm">Following</p>
						</div>
					</div>

					{/* Action Buttons */}
					{authUser._id === userId ? (
						// Own Profile - Show Edit Button
						<div className="flex gap-2 px-4 py-4">
							<button
								onClick={() => setShowEditModal(true)}
								className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
							>
								Edit Profile
							</button>
						</div>
					) : (
						// Other User - Show Follow/Message Buttons
						<div className="flex gap-2 px-4 py-4">
							{isFollowing ? (
								<button
									onClick={handleUnfollow}
									disabled={followLoading}
										className="flex-1 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-3 rounded-lg text-sm sm:text-base"
									>
										{followLoading ? "Loading..." : "Following"}
									</button>
								) : (
									<button
										onClick={handleFollow}
										disabled={followLoading}
										className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg text-sm sm:text-base"
									>
										{followLoading ? "Loading..." : "Follow"}
									</button>
								)}
								<button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg text-sm sm:text-base">
								Message
							</button>
						</div>
					)}
				</div>
			</div>

			{showEditModal && (
				<EditProfile
					onClose={() => setShowEditModal(false)}
					onProfileUpdate={() => {
						setShowEditModal(false);
						onClose();
					}}
				/>
			)}
		</>
	);
};

export default UserProfile;
