import { useState, useRef } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { apiPut, apiPost } from "../../utils/api";
import toast from "react-hot-toast";
import { MdClose, MdCameraAlt, MdDelete } from "react-icons/md";

const ProfileEditor = ({ onClose, onUpdate }) => {
	const { authUser, setAuthUser } = useAuthContext();
	const fileInputRef = useRef();
	const videoInputRef = useRef();

	const [formData, setFormData] = useState({
		fullName: authUser?.fullName || "",
		bio: authUser?.bio || "",
	});

	const [profilePic, setProfilePic] = useState(authUser?.profilePic);
	const [profileVideo, setProfileVideo] = useState(authUser?.profileVideo);
	const [previewPic, setPreviewPic] = useState(null);
	const [previewVideo, setPreviewVideo] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handlePhotoSelect = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file size (5MB)
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Photo must be less than 5MB");
			return;
		}

		// Validate file type
		if (!file.type.startsWith("image/")) {
			toast.error("Please select a valid image file");
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			setPreviewPic(e.target.result);
		};
		reader.readAsDataURL(file);
	};

	const handleVideoSelect = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file size (50MB)
		if (file.size > 50 * 1024 * 1024) {
			toast.error("Video must be less than 50MB");
			return;
		}

		// Validate file type
		if (!file.type.startsWith("video/")) {
			toast.error("Please select a valid video file");
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			setPreviewVideo(e.target.result);
		};
		reader.readAsDataURL(file);
	};

	const uploadPhoto = async () => {
		if (!fileInputRef.current?.files?.[0]) {
			toast.error("Please select a photo");
			return;
		}

		try {
			setLoading(true);
			const formDataToSend = new FormData();
			formDataToSend.append("profilePic", fileInputRef.current.files[0]);

			const response = await apiPost("/api/users/upload-profile-pic", formDataToSend);
			setProfilePic(response.profilePic);
			setPreviewPic(null);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
			toast.success("Photo uploaded successfully!");
		} catch (error) {
			toast.error(error.message || "Failed to upload photo");
		} finally {
			setLoading(false);
		}
	};

	const uploadVideo = async () => {
		if (!videoInputRef.current?.files?.[0]) {
			toast.error("Please select a video");
			return;
		}

		try {
			setLoading(true);
			const formDataToSend = new FormData();
			formDataToSend.append("profileVideo", videoInputRef.current.files[0]);

			const response = await apiPost("/api/users/upload-profile-video", formDataToSend);
			setProfileVideo(response.profileVideo);
			setPreviewVideo(null);
			if (videoInputRef.current) {
				videoInputRef.current.value = "";
			}
			toast.success("Video uploaded successfully!");
		} catch (error) {
			toast.error(error.message || "Failed to upload video");
		} finally {
			setLoading(false);
		}
	};

	const handleSave = async () => {
		if (!formData.fullName.trim()) {
			toast.error("Full name is required");
			return;
		}

		try {
			setLoading(true);
			const updatedData = {
				...formData,
				profilePic,
				profileVideo,
			};

			const response = await apiPut("/api/users/profile/update", updatedData);
			setAuthUser(response);
			toast.success("Profile updated successfully!");
			onUpdate?.();
		} catch (error) {
			toast.error(error.message || "Failed to update profile");
		} finally {
			setLoading(false);
		}
	};

	const removePhoto = () => {
		setProfilePic("");
		setPreviewPic(null);
	};

	const removeVideo = () => {
		setProfileVideo("");
		setPreviewVideo(null);
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
			<div className="bg-white dark:bg-dark-surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 bg-white dark:bg-dark-surface">
					<h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
						Edit Profile
					</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
					>
						<MdClose className="text-2xl" />
					</button>
				</div>

				{/* Content */}
				<div className="p-6 space-y-6">
					{/* Profile Photo Section */}
					<div>
						<h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
							Profile Photo
						</h3>
						<div className="flex items-center gap-6">
							{/* Photo Preview */}
							<div className="relative">
								<img
									src={previewPic || profilePic}
									alt="Profile"
									className="w-32 h-32 rounded-full object-cover border-4 border-primary-300 dark:border-primary-700 shadow-lg"
								/>
								{!previewPic && (
									<button
										type="button"
										onClick={() => fileInputRef.current?.click()}
										className="absolute bottom-2 right-2 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition-all"
									>
										<MdCameraAlt className="text-xl" />
									</button>
								)}
							</div>

							{/* Photo Upload Controls */}
							<div className="flex-1 space-y-3">
								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									onChange={handlePhotoSelect}
									className="hidden"
								/>

								{!previewPic && !profilePic && (
									<button
										type="button"
										onClick={() => fileInputRef.current?.click()}
										className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-900 dark:text-neutral-50 font-medium rounded-lg transition-colors"
									>
										Choose Photo
									</button>
								)}

								{previewPic && (
									<>
										<p className="text-sm text-neutral-600 dark:text-neutral-400">
											Photo selected - Click upload to save
										</p>
										<button
											type="button"
											onClick={uploadPhoto}
											disabled={loading}
											className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{loading ? "Uploading..." : "Upload Photo"}
										</button>
										<button
											type="button"
											onClick={() => setPreviewPic(null)}
											className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 font-medium rounded-lg transition-colors"
										>
											Cancel
										</button>
									</>
								)}

								{profilePic && !previewPic && (
									<button
										type="button"
										onClick={removePhoto}
										className="w-full px-4 py-3 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
									>
										<MdDelete /> Remove Photo
									</button>
								)}
							</div>
						</div>
					</div>

					{/* Profile Video Section */}
					<div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
						<h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
							Profile Video
						</h3>
						<div className="space-y-3">
							{/* Video Preview */}
							{(previewVideo || profileVideo) && (
								<div className="relative bg-black rounded-lg overflow-hidden">
									<video
										src={previewVideo || profileVideo}
										controls
										className="w-full max-h-64"
									/>
								</div>
							)}

							<input
								ref={videoInputRef}
								type="file"
								accept="video/*"
								onChange={handleVideoSelect}
								className="hidden"
							/>

							{!previewVideo && !profileVideo && (
								<button
									type="button"
									onClick={() => videoInputRef.current?.click()}
									className="w-full px-4 py-3 border-2 border-dashed border-neutral-300 dark:border-neutral-600 hover:border-primary-500 dark:hover:border-primary-500 text-neutral-900 dark:text-neutral-50 font-medium rounded-lg transition-colors"
								>
									Choose Video
								</button>
							)}

							{previewVideo && (
								<>
									<p className="text-sm text-neutral-600 dark:text-neutral-400">
										Video selected - Click upload to save
									</p>
									<button
										type="button"
										onClick={uploadVideo}
										disabled={loading}
										className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{loading ? "Uploading..." : "Upload Video"}
									</button>
									<button
										type="button"
										onClick={() => setPreviewVideo(null)}
										className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 font-medium rounded-lg transition-colors"
									>
										Cancel
									</button>
								</>
							)}

							{profileVideo && !previewVideo && (
								<button
									type="button"
									onClick={removeVideo}
									className="w-full px-4 py-3 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
								>
									<MdDelete /> Remove Video
								</button>
							)}
						</div>
					</div>

					{/* Profile Info Section */}
					<div className="border-t border-neutral-200 dark:border-neutral-700 pt-6 space-y-4">
						<h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
							Profile Information
						</h3>

						{/* Full Name */}
						<div>
							<label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
								Full Name
							</label>
							<input
								type="text"
								name="fullName"
								value={formData.fullName}
								onChange={handleInputChange}
								className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
								placeholder="Enter your full name"
							/>
						</div>

						{/* Bio */}
						<div>
							<label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
								Bio
							</label>
							<textarea
								name="bio"
								value={formData.bio}
								onChange={handleInputChange}
								rows="4"
								className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
								placeholder="Tell us about yourself"
							/>
							<p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
								{formData.bio.length}/150
							</p>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="border-t border-neutral-200 dark:border-neutral-700 pt-6 flex gap-3">
						<button
							onClick={onClose}
							className="flex-1 px-4 py-3 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-900 dark:text-neutral-50 font-medium rounded-lg transition-colors"
						>
							Cancel
						</button>
						<button
							onClick={handleSave}
							disabled={loading}
							className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Saving..." : "Save Changes"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileEditor;
