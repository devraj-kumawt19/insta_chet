import { useState, useRef, useEffect } from "react";
import { useSocketContext } from "../../context/SocketContext";
import { useAuthContext } from "../../context/AuthContext";

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
		<div className="fixed inset-0 bg-black z-50 flex flex-col">
			{/* Video Container */}
			<div className="flex-1 flex gap-4 p-4">
				{/* Remote Video */}
				<div className="flex-1 bg-gray-900 rounded-lg overflow-hidden">
					{inCall ? (
						<video
							ref={remoteVideoRef}
							autoPlay
							playsInline
							className="w-full h-full object-cover"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center flex-col">
							<div className="w-20 h-20 bg-gray-700 rounded-full mb-4"></div>
							<h2 className="text-white text-2xl">{recipientName}</h2>
							<p className="text-gray-400">Calling...</p>
						</div>
					)}
				</div>

				{/* Local Video */}
				<div className="w-40 h-40 bg-gray-800 rounded-lg overflow-hidden">
					<video
						ref={localVideoRef}
						autoPlay
						playsInline
						muted
						className="w-full h-full object-cover"
					/>
				</div>
			</div>

			{/* Controls */}
			<div className="bg-gray-900 px-4 py-6 flex justify-center gap-4">
				{!inCall ? (
					<button
						onClick={startVideoCall}
						disabled={isCalling}
						className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full"
					>
						{isCalling ? "Connecting..." : "Start Call"}
					</button>
				) : (
					<>
						<button
							onClick={toggleMute}
							className={`${
								isMuted ? "bg-red-500" : "bg-blue-500"
							} hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full`}
						>
							{isMuted ? "🔇 Muted" : "🔊 Mute"}
						</button>
						<button
							onClick={toggleVideo}
							className={`${
								isVideoOn ? "bg-blue-500" : "bg-red-500"
							} hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full`}
						>
							{isVideoOn ? "📹 On" : "📹 Off"}
						</button>
					</>
				)}
				<button
					onClick={endCall}
					className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full"
				>
					End Call
				</button>
			</div>
		</div>
	);
};

export default VideoCall;
