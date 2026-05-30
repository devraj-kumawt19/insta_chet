import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (authUser) {
			// Use environment variable for Socket.IO connection URL
			const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
			
			const socket = io(socketUrl, {
				query: {
					userId: authUser._id,
				},
				reconnection: true,
				reconnectionDelay: 1000,
				reconnectionDelayMax: 5000,
				reconnectionAttempts: 5,
			});

			setSocket(socket);

			// socket.on() is used to listen to the events. can be used both on client and server side
			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			// Log connection status for debugging
			socket.on("connect", () => {
				console.log("Socket connected:", socket.id);
			});

			socket.on("disconnect", () => {
				console.log("Socket disconnected");
			});

			socket.on("connect_error", (error) => {
				console.error("Socket connection error:", error);
			});

			return () => socket.close();
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser]);

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
