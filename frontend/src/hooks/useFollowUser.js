import { useState } from "react";

const useFollowUser = () => {
	const [loading, setLoading] = useState(false);

	const followUser = async (userId) => {
		setLoading(true);
		try {
			const res = await fetch(`/api/users/follow/${userId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const data = await res.json();
			if (data.error) {
				console.log(data.error);
				return false;
			}
			return true;
		} catch (error) {
			console.log(error.message);
			return false;
		} finally {
			setLoading(false);
		}
	};

	const unfollowUser = async (userId) => {
		setLoading(true);
		try {
			const res = await fetch(`/api/users/unfollow/${userId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const data = await res.json();
			if (data.error) {
				console.log(data.error);
				return false;
			}
			return true;
		} catch (error) {
			console.log(error.message);
			return false;
		} finally {
			setLoading(false);
		}
	};

	return { followUser, unfollowUser, loading };
};

export default useFollowUser;
