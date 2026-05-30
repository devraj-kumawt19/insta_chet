# MERN Chat App - Complete Updated Code Reference

## All Files Modified for Production Deployment

### NEW FILES

---

## 1. frontend/.env.production
```env
VITE_API_URL=https://insta-chet.onrender.com
```

---

## 2. frontend/.env.development
```env
VITE_API_URL=http://localhost:8080
```

---

## 3. frontend/src/utils/api.js
```javascript
// Centralized API configuration for production and development

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Make a fetch request with proper error handling and JSON parsing
 * @param {string} endpoint - API endpoint (e.g., '/api/auth/login')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise} Response data or throws error
 */
export const apiCall = async (endpoint, options = {}) => {
	const url = `${API_BASE_URL}${endpoint}`;
	
	try {
		// Check if body is FormData (for file uploads)
		const isFormData = options.body instanceof FormData;

		const fetchOptions = {
			credentials: "include", // Include cookies for auth
			...options,
		};

		// Only set Content-Type header if not FormData (FormData sets it automatically with boundary)
		if (!isFormData && !options.headers?.["Content-Type"]) {
			if (!fetchOptions.headers) fetchOptions.headers = {};
			fetchOptions.headers["Content-Type"] = "application/json";
		}

		const response = await fetch(url, fetchOptions);

		// Handle non-OK responses
		if (!response.ok) {
			let errorData;
			try {
				errorData = await response.json();
			} catch {
				errorData = { error: `HTTP Error: ${response.status}` };
			}
			throw new Error(errorData.error || `Request failed with status ${response.status}`);
		}

		// Handle empty responses
		const contentLength = response.headers.get("content-length");
		if (contentLength === "0" || !contentLength) {
			return null;
		}

		// Parse JSON response safely
		const contentType = response.headers.get("content-type");
		if (!contentType || !contentType.includes("application/json")) {
			throw new Error("Invalid response format from server");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error(`API Error [${endpoint}]:`, error);
		throw error;
	}
};

/**
 * GET request
 */
export const apiGet = (endpoint, options = {}) => {
	return apiCall(endpoint, { ...options, method: "GET" });
};

/**
 * POST request
 */
export const apiPost = (endpoint, body, options = {}) => {
	// If body is FormData, don't stringify it
	const isFormData = body instanceof FormData;
	return apiCall(endpoint, {
		...options,
		method: "POST",
		body: isFormData ? body : JSON.stringify(body),
	});
};

/**
 * PUT request
 */
export const apiPut = (endpoint, body, options = {}) => {
	const isFormData = body instanceof FormData;
	return apiCall(endpoint, {
		...options,
		method: "PUT",
		body: isFormData ? body : JSON.stringify(body),
	});
};

/**
 * DELETE request
 */
export const apiDelete = (endpoint, options = {}) => {
	return apiCall(endpoint, { ...options, method: "DELETE" });
};

/**
 * Get API URL for constructing URLs
 */
export const getAPIUrl = () => API_BASE_URL;

export default { apiCall, apiGet, apiPost, apiPut, apiDelete, getAPIUrl };
```

---

### UPDATED FILES

---

## 4. frontend/src/context/SocketContext.jsx
```javascript
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
```

---

## 5. frontend/src/hooks/useLogin.js
```javascript
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { apiPost } from "../utils/api";

const useLogin = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const login = async (username, password) => {
		const success = handleInputErrors(username, password);
		if (!success) return;
		setLoading(true);
		try {
			const data = await apiPost("/api/auth/login", { username, password });

			localStorage.setItem("chat-user", JSON.stringify(data));
			setAuthUser(data);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, login };
};
export default useLogin;

function handleInputErrors(username, password) {
	if (!username || !password) {
		toast.error("Please fill in all fields");
```

---

## 6. frontend/src/hooks/useSignup.js
```javascript
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import { apiPost } from "../utils/api";

const useSignup = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const signup = async ({ fullName, username, password, confirmPassword, gender }) => {
		const success = handleInputErrors({ fullName, username, password, confirmPassword, gender });
		if (!success) return;

		setLoading(true);
		try {
			const data = await apiPost("/api/auth/signup", {
				fullName,
				username,
				password,
				confirmPassword,
				gender,
			});

			localStorage.setItem("chat-user", JSON.stringify(data));
			setAuthUser(data);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, signup };
};
export default useSignup;

function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {
	if (!fullName || !username || !password || !confirmPassword || !gender) {
		toast.error("Please fill in all fields");
		return false;
	}

	if (password !== confirmPassword) {
		toast.error("Passwords do not match");
		return false;
	}

	if (password.length < 6) {
		toast.error("Password must be at least 6 characters");
		return false;
	}

	return true;
}
```

---

## 7. frontend/src/hooks/useLogout.js
```javascript
import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { apiPost } from "../utils/api";

const useLogout = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const logout = async () => {
		setLoading(true);
		try {
			await apiPost("/api/auth/logout", {});

			localStorage.removeItem("chat-user");
			setAuthUser(null);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, logout };
};
export default useLogout;
```

---

## 8. frontend/src/hooks/useGetMessages.js
```javascript
import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { apiGet } from "../utils/api";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				const data = await apiGet(`/api/messages/${selectedConversation._id}`);
				setMessages(data || []);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversation?._id) getMessages();
	}, [selectedConversation?._id, setMessages]);

	return { messages, loading };
};
export default useGetMessages;
```

---

## 9. frontend/src/hooks/useSendMessage.js
```javascript
import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { apiPost } from "../utils/api";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	const sendMessage = async (message) => {
		setLoading(true);
		try {
			const data = await apiPost(`/api/messages/send/${selectedConversation._id}`, { message });
			setMessages([...messages, data]);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;
```

---

## 10. frontend/src/hooks/useGetConversations.js
```javascript
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiGet } from "../utils/api";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);

	useEffect(() => {
		const getConversations = async () => {
			setLoading(true);
			try {
				const data = await apiGet("/api/users");
				setConversations(data || []);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		getConversations();
	}, []);

	return { loading, conversations };
};
export default useGetConversations;
```

---

## 11. frontend/src/hooks/useGetUserProfile.js
```javascript
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
```

---

## 12. frontend/src/hooks/useFollowUser.js
```javascript
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
```

---

## 13. frontend/src/components/profile/EditProfile.jsx
```javascript
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

	// ... rest of component remains the same
};
```

---

## 14. frontend/vite.config.js
```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 5173,
		proxy: {
			"/api": {
				target: "http://localhost:8080",
				changeOrigin: true,
			},
			"/uploads": {
				target: "http://localhost:8080",
				changeOrigin: true,
			},
		},
	},
});
```

---

## 15. backend/socket/socket.js (Top section updated)
```javascript
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

// Determine allowed origins based on environment
const getAllowedOrigins = () => {
	const allowedOrigins = [
		"http://localhost:5173", // Vite dev server
		"http://localhost:8080", // Backend dev
		"http://localhost:3000", // Alternative frontend port
		"https://insta-chet.onrender.com", // Production URL
	];

	// Add any additional origins from environment variable
	if (process.env.ALLOWED_ORIGINS) {
		const envOrigins = process.env.ALLOWED_ORIGINS.split(",");
		allowedOrigins.push(...envOrigins);
	}

	return allowedOrigins;
};

const io = new Server(server, {
	cors: {
		origin: getAllowedOrigins(),
		methods: ["GET", "POST"],
		credentials: true,
		allowedHeaders: ["Content-Type"],
	},
	transports: ["websocket", "polling"], // Support both websocket and polling
});

// ... rest of file remains the same
```

---

## 16. backend/server.js
```javascript
import path from "path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// PORT should be assigned after calling dotenv.config() because we need to access the env variables. Didn't realize while recording the video. Sorry for the confusion.
const PORT = process.env.PORT || 8080;

// CORS configuration for both development and production
const corsOptions = {
	origin: process.env.ALLOWED_ORIGINS 
		? process.env.ALLOWED_ORIGINS.split(",")
		: ["http://localhost:5173", "http://localhost:8080", "http://localhost:3000", "https://insta-chet.onrender.com"],
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions)); // Apply CORS middleware
app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../frontend/public/uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server Running on port ${PORT}`);
});
```

---

## 17. package.json (Updated with CORS dependency)
```json
{
	"name": "chat-app-yt",
	"version": "1.0.0",
	"description": "",
	"main": "server.js",
	"scripts": {
		"server": "nodemon backend/server.js",
		"start": "node backend/server.js",
		"build": "npm install && npm install --prefix frontend && npm run build --prefix frontend"
	},
	"type": "module",
	"keywords": [],
	"author": "",
	"license": "ISC",
	"dependencies": {
		"bcryptjs": "^2.4.3",
		"cookie-parser": "^1.4.6",
		"cors": "^2.8.5",
		"dotenv": "^16.4.1",
		"express": "^4.18.2",
		"jsonwebtoken": "^9.0.2",
		"mongoose": "^8.1.1",
		"multer": "^2.1.1",
		"socket.io": "^4.7.4"
	},
	"devDependencies": {
		"nodemon": "^3.0.3"
	}
}
```

---

## Summary of Changes

✅ **Frontend:**
- 3 new files created (.env.production, .env.development, api.js utility)
- 9 hooks updated to use centralized API utility
- Socket.IO context updated for environment-based URL
- Vite config improved with proper proxy settings
- EditProfile component updated for FormData handling

✅ **Backend:**
- CORS middleware added
- Socket.IO CORS dynamic configuration added
- Package.json updated with cors dependency

✅ **Documentation:**
- PRODUCTION_DEPLOYMENT.md created
- Environment variable examples created

All changes support both development and production deployments!
