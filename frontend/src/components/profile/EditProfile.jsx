import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { apiPost, apiPut } from "../../utils/api";

const EditProfile = ({ onClose, onProfileUpdate }) => {
	const { authUser, setAuthUser } = useAuthContext();
	const [fullName, setFullName] = useState(authUser?.fullName || "");
	const [bio, setBio] = useState(authUser?.bio || "");
	const [profilePic, setProfilePic] = useState(authUser?.profilePic || "");
	const [imageFile, setImageFile] = useState(null);
	const [preview, setPreview] = useState(authUser?.profilePic);
	const [loading, setLoading] = useState(false);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImageFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleUploadProfilePic = async () => {
		if (!imageFile) return;

		try {
			setLoading(true);
			const formData = new FormData();
			formData.append("profilePic", imageFile);

			const data = await apiPost("/api/users/upload-profile-pic", formData);

			setAuthUser(data.user);
			setImageFile(null);
		} catch (error) {
			console.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateProfile = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const data = await apiPut("/api/users/profile/update", {
				fullName,
				bio,
			});

			setAuthUser(data);
			onProfileUpdate?.();
		} catch (error) {
			console.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl w-full max-w-sm max-h-screen overflow-y-auto p-4 sm:p-6">
				{/* Close button */}
				<button
					onClick={onClose}
					className="float-right text-gray-500 hover:text-gray-700 text-lg sm:text-2xl"
				>
					✕
				</button>

				<h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Edit Profile</h2>

				{/* Profile Picture Section */}
				<div className="text-center mb-4 sm:mb-6">
					<img
						src={preview}
						alt="Profile"
						className="w-20 sm:w-32 h-20 sm:h-32 rounded-full mx-auto mb-3 sm:mb-4 object-cover border-4 border-gray-300"
					/>
					<input
						type="file"
						accept="image/*"
						onChange={handleImageChange}
						className="file-input file-input-bordered w-full text-xs sm:text-base mb-2"
					/>
					{imageFile && (
						<button
							onClick={handleUploadProfilePic}
							disabled={loading}
							className="btn btn-primary w-full btn-sm sm:btn-md"
						>
							{loading ? "Uploading..." : "Upload Photo"}
						</button>
					)}
				</div>

				{/* Profile Form */}
				<form onSubmit={handleUpdateProfile} className="space-y-3 sm:space-y-4">
					<div>
						<label className="block text-xs sm:text-sm font-medium mb-1">Full Name</label>
						<input
							type="text"
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							className="input input-bordered w-full input-sm sm:input-md"
						/>
					</div>

					<div>
						<label className="block text-xs sm:text-sm font-medium mb-1">Bio</label>
						<textarea
							value={bio}
							onChange={(e) => setBio(e.target.value)}
							maxLength={150}
							placeholder="Tell something about yourself"
							className="textarea textarea-bordered w-full text-xs sm:text-base"
							rows="4"
						/>
						<p className="text-xs text-gray-500 mt-1">{bio.length}/150</p>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="btn btn-success w-full btn-sm sm:btn-md"
					>
						{loading ? "Saving..." : "Save Changes"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default EditProfile;
