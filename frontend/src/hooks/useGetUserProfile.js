import { useState, useEffect } from "react";
import { apiGet } from "../utils/api";

const useGetUserProfile = (userId) => {
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState(null);

	useEffect(() => {
		const getUser = async () => {
			setLoading(true);
			try {
				const data = await apiGet(`/api/users/profile/${userId}`);
				if (data) {
					setUser(data);
				}
			} catch (error) {
				console.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		getUser();
	}, [userId]);

	return { user, loading };
};

export default useGetUserProfile;
