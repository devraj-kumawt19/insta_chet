import { useState, useEffect } from "react";
import { apiGet } from "../utils/api";
import { useSocketContext } from "../context/SocketContext";

const useNotifications = () => {
	const [notifications, setNotifications] = useState([]);
	const [notificationCount, setNotificationCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const { socket } = useSocketContext();

	const fetchNotifications = async () => {
		try {
			setLoading(true);
			const data = await apiGet("/api/notifications");
			if (Array.isArray(data)) {
				setNotifications(data);
				setNotificationCount(data.length);
			} else {
				setNotifications([]);
				setNotificationCount(0);
			}
		} catch (error) {
			console.error("Error fetching notifications:", error);
			setNotifications([]);
			setNotificationCount(0);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchNotifications();
	}, []);

	// Listen for real-time notifications via Socket.IO
	useEffect(() => {
		if (!socket) return;

		socket.on("newNotification", (notification) => {
			console.log("New notification received:", notification);
			setNotifications((prev) => [notification, ...prev]);
			setNotificationCount((prev) => prev + 1);
		});

		socket.on("notificationRead", (notificationId) => {
			setNotifications((prev) =>
				prev.map((notif) =>
					notif._id === notificationId ? { ...notif, read: true } : notif
				)
			);
		});

		return () => {
			socket.off("newNotification");
			socket.off("notificationRead");
		};
	}, [socket]);

	const markAsRead = async (notificationId) => {
		try {
			setNotifications((prev) =>
				prev.map((notif) =>
					notif._id === notificationId ? { ...notif, read: true } : notif
				)
			);
			// Optional: Send to backend to persist
		} catch (error) {
			console.error("Error marking notification as read:", error);
		}
	};

	const clearNotifications = async () => {
		try {
			setNotifications([]);
			setNotificationCount(0);
		} catch (error) {
			console.error("Error clearing notifications:", error);
		}
	};

	return {
		notifications,
		notificationCount,
		loading,
		fetchNotifications,
		markAsRead,
		clearNotifications,
	};
};

export default useNotifications;
