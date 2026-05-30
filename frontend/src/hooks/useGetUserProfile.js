import { useState, useEffect } from "react";

const useGetUserProfile = (userId) => {
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState(null);

	useEffect(() => {
		const getUser = async () => {
			setLoading(true);
			try {
				const res = await fetch(`/api/users/profile/${userId}`);
				const data = await res.json();

				if (data.error) return;

				setUser(data);
			} catch (error) {
				console.log(error.message);
			} finally {
				setLoading(false);
			}
		};

		getUser();
	}, [userId]);

	return { user, loading };
};

export default useGetUserProfile;
