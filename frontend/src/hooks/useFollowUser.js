import { useState } from "react";
import { apiPost } from "../utils/api";

const useFollowUser = () => {
	const [loading, setLoading] = useState(false);

	const followUser = async (userId) => {
		setLoading(true);
		try {
			await apiPost(`/api/users/follow/${userId}`, {});
			return true;
		} catch (error) {
			console.error(error.message);
			return false;
		} finally {
			setLoading(false);
		}
	};

	const unfollowUser = async (userId) => {
		setLoading(true);
		try {
			await apiPost(`/api/users/unfollow/${userId}`, {});
			return true;
		} catch (error) {
			console.error(error.message);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return { followUser, unfollowUser, loading };
};

export default useFollowUser;
