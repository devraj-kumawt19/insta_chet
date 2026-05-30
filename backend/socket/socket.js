import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:8080", "http://localhost:5173"],
		methods: ["GET", "POST"],
	},
});

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	const userId = socket.handshake.query.userId;
	if (userId && userId !== "undefined") userSocketMap[userId] = socket.id;

	// io.emit() is used to send events to all the connected clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// socket.on() is used to listen to the events. can be used both on client and server side
	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});

	// Video call events
	socket.on("call", (data) => {
		const receiverSocketId = getReceiverSocketId(data.to);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("incoming_call", {
				from: data.from,
				fromName: data.fromName,
				fromPic: data.fromPic,
				offer: data.offer,
			});
		}
	});

	socket.on("answer", (data) => {
		const receiverSocketId = getReceiverSocketId(data.to);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("call_answered", {
				answer: data.answer,
			});
		}
	});

	socket.on("ice_candidate", (data) => {
		const receiverSocketId = getReceiverSocketId(data.to);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("ice_candidate", {
				candidate: data.candidate,
			});
		}
	});

	socket.on("end_call", (data) => {
		const receiverSocketId = getReceiverSocketId(data.to);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("call_ended");
		}
	});

	// Message seen event
	socket.on("messageSeen", (data) => {
		const receiverSocketId = getReceiverSocketId(data.senderId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("messageSeen", {
				conversationId: data.conversationId,
			});
		}
	});
});

export { app, io, server };
