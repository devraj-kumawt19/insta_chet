import { useState } from "react";
import { apiPost } from "../utils/api";
import toast from "react-hot-toast";

const useFollowUser = () => {
	const [loading, setLoading] = useState(false);

	const followUser = async (userId) => {
		setLoading(true);
		try {
			await apiPost(`/api/users/follow/${userId}`, {});
			toast.success("User followed!");
			// Emit event to refresh user profile data
			window.dispatchEvent(new Event("profileUpdated"));
			return true;
		} catch (error) {
			toast.error(error.message || "Failed to follow user");
			return false;
		} finally {
			setLoading(false);
		}
	};

	const unfollowUser = async (userId) => {
		setLoading(true);
		try {
			await apiPost(`/api/users/unfollow/${userId}`, {});
			toast.success("User unfollowed!");
			// Emit event to refresh user profile data
			window.dispatchEvent(new Event("profileUpdated"));
			return true;
		} catch (error) {
			toast.error(error.message || "Failed to unfollow user");
			return false;
		} finally {
			setLoading(false);
		}
	};

	return { followUser, unfollowUser, loading };
};

export default useFollowUser;
