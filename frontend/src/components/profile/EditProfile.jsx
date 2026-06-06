import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { apiPost, apiPut } from "../../utils/api";

const EditProfile = ({ onClose, onProfileUpdate }) => {
	const { authUser, setAuthUser } = useAuthContext();

	const [fullName, setFullName] = useState(authUser?.fullName || "");
	const [username, setUsername] = useState(authUser?.username || "");
	const [bio, setBio] = useState(authUser?.bio || "");
	const [imageFile, setImageFile] = useState(null);
	const [preview, setPreview] = useState(authUser?.profilePic || "");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		setImageFile(file);
		const reader = new FileReader();
		reader.onloadend = () => {
			setPreview(reader.result);
		};
		reader.readAsDataURL(file);
	};

	const handleUploadProfilePic = async () => {
		if (!imageFile) return;

		try {
			setLoading(true);
			setError("");

			const formData = new FormData();
			formData.append("profilePic", imageFile);

			const data = await apiPost("/api/users/upload-profile-pic", formData);

			const updatedUser = data.user || data;
			setAuthUser(updatedUser);
			localStorage.setItem("chat-user", JSON.stringify(updatedUser));
			setImageFile(null);
			onProfileUpdate?.();
		} catch (err) {
			setError(err.message || "Failed to upload image");
			console.error("Image upload error:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateProfile = async (e) => {
		e.preventDefault();
		setError("");

		if (!fullName.trim()) {
			setError("Full name is required");
			return;
		}

		if (!username.trim()) {
			setError("Username is required");
			return;
		}

		try {
			setLoading(true);

			const data = await apiPut("/api/users/profile/update", {
				fullName: fullName.trim(),
				username: username.trim(),
				bio: bio.trim(),
			});

			const updatedUser = data.user || data;
			setAuthUser(updatedUser);
			localStorage.setItem("chat-user", JSON.stringify(updatedUser));
			onProfileUpdate?.();
			onClose();
		} catch (err) {
			setError(err.message || "Failed to update profile");
			console.error("Update error:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
			<div className="bg-white dark:bg-neutral-900 w-full max-w-sm rounded-2xl p-6 shadow-xl">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-bold">Edit Profile</h2>
					<button
						onClick={onClose}
						className="text-2xl font-bold text-neutral-400 hover:text-neutral-600"
					>
						×
					</button>
				</div>

				{error && (
					<div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
						{error}
					</div>
				)}

				{/* Profile Picture Section */}
				<div className="text-center mb-6">
					{preview ? (
						<img
							src={preview}
							alt="Preview"
							className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-blue-500"
						/>
					) : (
						<div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 mx-auto flex items-center justify-center text-4xl font-bold text-white">
							{fullName?.charAt(0)?.toUpperCase() || "?"}
						</div>
					)}

					<input
						type="file"
						accept="image/*"
						onChange={handleImageChange}
						className="mt-4 block w-full text-sm"
					/>

					{imageFile && (
						<button
							onClick={handleUploadProfilePic}
							disabled={loading}
							className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold disabled:opacity-50"
						>
							{loading ? "Uploading..." : "Upload Photo"}
						</button>
					)}
				</div>

				{/* Form Section */}
				<form onSubmit={handleUpdateProfile} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
							Full Name
						</label>
						<input
							type="text"
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							placeholder="Full name"
							className="w-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
							Username
						</label>
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="Username"
							className="w-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
							Bio
						</label>
						<textarea
							value={bio}
							onChange={(e) => setBio(e.target.value)}
							maxLength={150}
							placeholder="Tell us about yourself..."
							className="w-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
							rows={3}
						/>
						<p className="text-xs text-neutral-500 mt-1">{bio.length}/150</p>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 transition-colors"
					>
						{loading ? "Saving..." : "Save Changes"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default EditProfile;
