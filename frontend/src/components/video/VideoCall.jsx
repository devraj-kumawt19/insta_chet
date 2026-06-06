import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocketContext } from "../../context/SocketContext";
import { useAuthContext } from "../../context/AuthContext";
import { MdCall, MdCallEnd, MdMic, MdMicOff, MdVideocam, MdVideocamOff } from "react-icons/md";

const VideoCall = ({ recipientId, recipientName, onEndCall }) => {
	const { socket } = useSocketContext();
	const { authUser } = useAuthContext();
	const [isCalling, setIsCalling] = useState(false);
	const [inCall, setInCall] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const [isVideoOn, setIsVideoOn] = useState(true);
	const localVideoRef = useRef(null);
	const remoteVideoRef = useRef(null);
	const peerConnectionRef = useRef(null);

	// Socket listeners for receiving call answers and ICE candidates
	useEffect(() => {
		if (!socket) return;

		// Handle call answer
		const handleCallAnswer = async (data) => {
			if (peerConnectionRef.current) {
				try {
					const answer = new RTCSessionDescription(data.answer);
					await peerConnectionRef.current.setRemoteDescription(answer);
					setInCall(true);
				} catch (error) {
					console.error("Error handling call answer:", error);
				}
			}
		};

		// Handle ICE candidates
		const handleICECandidate = async (data) => {
			if (peerConnectionRef.current && data.candidate) {
				try {
					await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
				} catch (error) {
					console.error("Error adding ICE candidate:", error);
				}
			}
		};

		// Handle call rejection or end
		const handleCallEnded = () => {
			endCall();
		};

		socket.on("call_answer", handleCallAnswer);
		socket.on("ice_candidate", handleICECandidate);
		socket.on("end_call", handleCallEnded);

		return () => {
			socket.off("call_answer", handleCallAnswer);
			socket.off("ice_candidate", handleICECandidate);
			socket.off("end_call", handleCallEnded);
		};
	}, [socket]);

	const startVideoCall = async () => {
		try {
			setIsCalling(true);
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});

			if (localVideoRef.current) {
				localVideoRef.current.srcObject = stream;
			}

			// Create peer connection
			const peerConnection = new RTCPeerConnection({
				iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
			});

			peerConnectionRef.current = peerConnection;

			// Add local stream tracks
			stream.getTracks().forEach((track) => {
				peerConnection.addTrack(track, stream);
			});

			// Handle remote stream
			peerConnection.ontrack = (event) => {
				if (remoteVideoRef.current) {
					remoteVideoRef.current.srcObject = event.streams[0];
				}
			};

			// Handle ICE candidates
			peerConnection.onicecandidate = (event) => {
				if (event.candidate && socket) {
					socket.emit("ice_candidate", {
						to: recipientId,
						candidate: event.candidate,
					});
				}
			};

			// Create and send offer
			const offer = await peerConnection.createOffer();
			await peerConnection.setLocalDescription(offer);

			socket?.emit("call", {
				to: recipientId,
				from: authUser._id,
				fromName: authUser.fullName,
				fromPic: authUser.profilePic,
				offer: offer,
			});

			setInCall(true);
		} catch (error) {
			console.error("Error starting video call:", error);
			alert("Could not access camera/microphone");
		}
	};

	const toggleMute = () => {
		if (peerConnectionRef.current) {
			const audioTracks = localVideoRef.current?.srcObject?.getAudioTracks();
			if (audioTracks) {
				audioTracks.forEach((track) => {
					track.enabled = !track.enabled;
				});
				setIsMuted(!isMuted);
			}
		}
	};

	const toggleVideo = () => {
		if (peerConnectionRef.current) {
			const videoTracks = localVideoRef.current?.srcObject?.getVideoTracks();
			if (videoTracks) {
				videoTracks.forEach((track) => {
					track.enabled = !track.enabled;
				});
				setIsVideoOn(!isVideoOn);
			}
		}
	};

	const endCall = () => {
		if (peerConnectionRef.current) {
			peerConnectionRef.current.close();
		}

		if (localVideoRef.current?.srcObject) {
			localVideoRef.current.srcObject.getTracks().forEach((track) => {
				track.stop();
			});
		}

		socket?.emit("end_call", { to: recipientId });
		onEndCall();
	};

	return (
		<motion.div 
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 bg-gradient-to-br from-black via-neutral-900 to-black z-50 flex flex-col"
		>
			{/* Video Container */}
			<motion.div 
				initial={{ scale: 0.95, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ delay: 0.1 }}
				className="flex-1 flex gap-3 sm:gap-4 p-2 sm:p-4 relative"
			>
				{/* Remote Video */}
				<motion.div 
					layoutId="remote-video"
					className="flex-1 bg-gradient-to-br from-neutral-800 to-black rounded-3xl overflow-hidden shadow-2xl border border-neutral-700/50 relative group"
				>
					<AnimatePresence mode="wait">
						{inCall ? (
							<motion.video
								key="remote-video-playing"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								ref={remoteVideoRef}
								autoPlay
								playsInline
								className="w-full h-full object-cover"
							/>
						) : (
							<motion.div
								key="remote-video-placeholder"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.9 }}
								className="w-full h-full flex items-center justify-center flex-col bg-gradient-to-br from-neutral-900/90 to-black/90 backdrop-blur-lg"
							>
								<motion.div 
									animate={{ scale: [1, 1.05, 1] }}
									transition={{ repeat: Infinity, duration: 2 }}
									className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-4 sm:mb-6 flex items-center justify-center text-4xl sm:text-6xl shadow-2xl ring-4 ring-pink-400/30"
								>
									👤
								</motion.div>
								<motion.div className="text-center space-y-2 sm:space-y-3">
									<h2 className="text-xl sm:text-3xl font-black text-white text-shadow">
										{recipientName}
									</h2>
									<motion.p 
										animate={{ opacity: [0.5, 1, 0.5] }}
										transition={{ repeat: Infinity, duration: 1.5 }}
										className="text-sm sm:text-base text-neutral-300 font-semibold flex items-center justify-center gap-2"
									>
										<span className="inline-block">Calling</span>
										<motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }}>
											📞
										</motion.span>
									</motion.p>
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>

				{/* Local Video */}
				<motion.div 
					layoutId="local-video"
					initial={{ scale: 0.8, opacity: 0, y: 20 }}
					animate={{ scale: 1, opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					whileHover={{ scale: 1.05 }}
					className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-20 h-24 sm:w-28 sm:h-36 bg-gradient-to-br from-neutral-800 to-black rounded-2xl overflow-hidden shadow-2xl border-2 border-pink-400/50 cursor-move hover:border-pink-500"
				>
					<motion.video
						ref={localVideoRef}
						autoPlay
						playsInline
						muted
						className="w-full h-full object-cover"
						whileHover={{ scale: 1.05 }}
					/>
					{/* Self Name Badge */}
					<motion.div 
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full"
					>
						<p className="text-xs font-bold text-white">You</p>
					</motion.div>
				</motion.div>
			</motion.div>

			{/* Controls Bar */}
			<motion.div 
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.2 }}
				className="bg-gradient-to-t from-black via-black/90 to-transparent px-4 sm:px-6 py-4 sm:py-8 flex justify-center gap-3 sm:gap-4 backdrop-blur-lg border-t border-neutral-700/30"
			>
				{!inCall ? (
					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						onClick={startVideoCall}
						disabled={isCalling}
						className={`flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all shadow-lg hover:shadow-xl ${
							isCalling
								? "bg-neutral-600 text-neutral-300 cursor-not-allowed opacity-60"
								: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-green-500/50 hover:shadow-green-500/70"
						}`}
					>
						<MdCall className="text-2xl sm:text-3xl" />
						<span>{isCalling ? "Connecting..." : "Accept Call"}</span>
					</motion.button>
				) : (
					<>
						{/* Mute Button */}
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							onClick={toggleMute}
							className={`p-3 sm:p-4 rounded-full transition-all shadow-lg hover:shadow-xl ${
								isMuted
									? "bg-red-600 hover:bg-red-700 text-white shadow-red-600/50"
									: "bg-neutral-700 hover:bg-neutral-600 text-white shadow-neutral-700/50"
							}`}
							title={isMuted ? "Unmute" : "Mute"}
						>
							{isMuted ? (
								<MdMicOff className="text-2xl sm:text-3xl" />
							) : (
								<MdMic className="text-2xl sm:text-3xl" />
							)}
						</motion.button>

						{/* Video Button */}
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							onClick={toggleVideo}
							className={`p-3 sm:p-4 rounded-full transition-all shadow-lg hover:shadow-xl ${
								isVideoOn
									? "bg-neutral-700 hover:bg-neutral-600 text-white shadow-neutral-700/50"
									: "bg-red-600 hover:bg-red-700 text-white shadow-red-600/50"
							}`}
							title={isVideoOn ? "Turn off camera" : "Turn on camera"}
						>
							{isVideoOn ? (
								<MdVideocam className="text-2xl sm:text-3xl" />
							) : (
								<MdVideocamOff className="text-2xl sm:text-3xl" />
							)}
						</motion.button>
					</>
				)}

				{/* End Call Button */}
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
					onClick={endCall}
					className="flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white transition-all shadow-lg hover:shadow-xl shadow-red-600/50 hover:shadow-red-600/70"
				>
					<MdCallEnd className="text-2xl sm:text-3xl" />
					<span>End Call</span>
				</motion.button>
			</motion.div>

			{/* Call Duration Display */}
			{inCall && (
				<motion.div 
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-black/60 backdrop-blur-md px-4 py-2 sm:py-3 rounded-full"
				>
					<p className="text-sm sm:text-base font-bold text-green-400">
						🟢 Connected
					</p>
				</motion.div>
			)}
		</motion.div>
	);
};

export default VideoCall;
