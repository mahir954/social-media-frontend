import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./Call.css";
import { MdCameraswitch } from "react-icons/md";
const socket = io("http://192.168.43.245:5000");

function VideoCall({ userName, userId, profilePic, incoming, visible, onEnd }) {
     console.log("Profile Pic:", profilePic);
    const localVideoRef = useRef(null);
    const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [callTime, setCallTime] = useState(0);
  const [callConnected, setCallConnected] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [frontCamera, setFrontCamera] = useState(true);
  const [networkStatus, setNetworkStatus] = useState("Excellent");



  const createPeerConnection = () => {
  const peer = new RTCPeerConnection();
  peer.ontrack = (event) => {
  console.log("Remote Stream Received", event.streams);

  if (remoteVideoRef.current && event.streams[0]) {
    remoteVideoRef.current.srcObject = event.streams[0];
    remoteVideoRef.current.play().catch(() => {});
  }
};
peer.onconnectionstatechange = () => {
  console.log(
    "Connection State:",
    peer.connectionState
  );
};

peer.oniceconnectionstatechange = () => {
  console.log(
    "ICE State:",
    peer.iceConnectionState
  );
};
peer.onicecandidate = (event) => {
  if (event.candidate) {
    socket.emit("ice-candidate", {
      candidate: event.candidate,
      to: userId,
    });
  }
};
  console.log("Peer Connection Created", peer);

  peerConnectionRef.current = peer;

  if (localStreamRef.current) {
    localStreamRef.current.getTracks().forEach((track) => {
      peer.addTrack(
        track,
        localStreamRef.current
      );
    });
  }

  return peer;
};
const createOffer = async () => {
  const peer = peerConnectionRef.current;

  if (!peer) return;

  const offer = await peer.createOffer();

  await peer.setLocalDescription(offer);

  console.log("Offer Created", offer);
  socket.emit("call-offer", {
    offer,
    to: userId,
  });
};
const toggleMic = () => {
  if (!localStreamRef.current) return;

  localStreamRef.current.getAudioTracks().forEach((track) => {
    track.enabled = !track.enabled;
  });

  setMicOn((prev) => !prev);
};
const toggleCamera = () => {
  if (!localStreamRef.current) return;

  localStreamRef.current.getVideoTracks().forEach((track) => {
    track.enabled = !track.enabled;
  });

  setCameraOn((prev) => !prev);
};
const toggleSpeaker = () => {
  if (!remoteVideoRef.current) return;

  remoteVideoRef.current.muted =
    !remoteVideoRef.current.muted;

  setSpeakerOn((prev) => !prev);
};
const switchCamera = async () => {
  try {
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: frontCamera ? "environment" : "user",
      },
      audio: true,
    });

    const videoTrack = newStream.getVideoTracks()[0];

    const sender = peerConnectionRef.current
      ?.getSenders()
      .find((sender) => sender.track?.kind === "video");

    if (sender) {
      sender.replaceTrack(videoTrack);
    }

    localStreamRef.current
      .getTracks()
      .forEach((track) => track.stop());

    localStreamRef.current = newStream;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = newStream;
    }

    setFrontCamera((prev) => !prev);
  } catch (err) {
    console.error("Camera Switch Error:", err);
  }
};
    useEffect(() => {
  if (!visible) return;

  let stream;

  socket.on("offer-received", async (data) => {
    console.log("Offer Received", data.offer);

    const peer = peerConnectionRef.current;

    if (!peer) return;

    await peer.setRemoteDescription(
      new RTCSessionDescription(data.offer)
    );

    const answer = await peer.createAnswer();

    await peer.setLocalDescription(answer);

    console.log("Answer Created", answer);

    socket.emit("call-answer", {
      answer,
      to: data.from,
    });
    setCallConnected(true);
  });


  socket.on("answer-received", async (data) => {
    console.log("Answer Received", data.answer);

    const peer = peerConnectionRef.current;

    if (!peer) return;

    await peer.setRemoteDescription(
      new RTCSessionDescription(data.answer)
    );
    setCallConnected(true);
  });


  socket.on("ice-candidate-received", async (data) => {
    console.log("ICE Candidate Received");

    const peer = peerConnectionRef.current;

    if (peer) {
      await peer.addIceCandidate(
        new RTCIceCandidate(data.candidate)
      );
    }
  });
  socket.on("call-accepted", () => {
  console.log("Call Accepted");
  setCallConnected(true);
});
socket.on("call-rejected", () => {
  console.log("Call Rejected");
  onEnd();
});
socket.on("call-ended", () => {
  console.log("Call Ended");

  onEnd();
});


  const startCamera = async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      console.log("Camera Stream:", stream);

      localStreamRef.current = stream;

      createPeerConnection();

      createOffer();

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

    } catch (err) {
      console.error("Camera/Mic Error:", err);
    }
  };


  startCamera();


  return () => {

    socket.off("offer-received");
    socket.off("answer-received");
    socket.off("ice-candidate-received");
    socket.off("call-accepted");
    socket.off("call-rejected");
    socket.off("call-ended");

    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
  };

}, [visible]);
useEffect(() => {
  if (!visible || !callConnected) return;

  const interval = setInterval(() => {
    setCallTime((prev) => prev + 1);
  }, 1000);

  return () => clearInterval(interval);
}, [visible, callConnected]);
useEffect(() => {
  if (!callConnected) return;

  const interval = setInterval(async () => {
    const peer = peerConnectionRef.current;

    if (!peer) return;

    const stats = await peer.getStats();

    stats.forEach((report) => {
      if (report.type === "candidate-pair" && report.state === "succeeded") {

        if (report.currentRoundTripTime < 0.1) {
          setNetworkStatus("🟢 Excellent");
        } else if (report.currentRoundTripTime < 0.2) {
          setNetworkStatus("🟡 Good");
        } else if (report.currentRoundTripTime < 0.4) {
          setNetworkStatus("🟠 Weak");
        } else {
          setNetworkStatus("🔴 Poor");
        }

      }
    });
  }, 3000);

  return () => clearInterval(interval);
}, [callConnected]);


if (!visible) return null;

  return (
    <div className="incoming-call-overlay">
      <div className="incoming-call-box">
        <h2>🎥 Video Call</h2>
        <p className="network-status">
  {networkStatus}
</p>

        <h3>{userName}</h3>
        <p
  style={{
    color: "#000",
    fontSize: "18px",
    fontWeight: "600",
    margin: "10px 0",
  }}
>
  {String(Math.floor(callTime / 60)).padStart(2, "0")}:
  {String(callTime % 60).padStart(2, "0")}
</p>
<div className="video-container">
        <video
  ref={localVideoRef}
  autoPlay
  playsInline
  muted
  style={{
    width: "100%",
    height: "220px",
    borderRadius: "12px",
    background: "#000",
    objectFit: "cover",
    margin: "20px 0",
  }}
/>
<div className="remote-video-box">

  <video
    ref={remoteVideoRef}
    autoPlay
    playsInline
  />

  {!remoteVideoRef.current?.srcObject && (
   
    <img
      src={
        profilePic
          ? `http://192.168.43.245:5000${profilePic}`
          : "/default-profile.png"
      }
      alt="profile"
      className="call-profile-pic"
    />
  )}

</div>
</div>
{incoming && (
<div className="call-action-buttons">

  <button className="accept-btn"
  onClick={() => {
    socket.emit("accept-call", {
        to: userId,
    })
  }}
  >

    📞 Accept
  </button>

  <button
  className="reject-btn"
  onClick={() => {
    socket.emit("reject-call", {
      to: userId,
    });

    onEnd();
  }}
>
  ❌ Reject
</button>

</div>
)}
<div className="call-controls">
<button
  onClick={toggleMic}
  className={`mic-btn ${micOn ? "on" : "off"}`}
>
  {micOn ? "🎤" : "🔇"}
</button>
<button
  onClick={toggleCamera}
  className={`camera-btn ${cameraOn ? "on" : "off"}`}
>
  {cameraOn ? "📹" : "🚫"}
</button>
<button
  onClick={switchCamera}
  className="switch-camera-btn"
>
 <MdCameraswitch size={28} />
</button>
<button
  onClick={toggleSpeaker}
  className={`speaker-btn ${speakerOn ? "on" : "off"}`}
>
  {speakerOn ? "🔊" : "🔇"}
</button>
       <button
  onClick={() => {
    socket.emit("end-call", {
      to: userId,
    });

    onEnd();
  }}
>
  ❌ End Call
</button>
</div>
      </div>
    </div>
  );
}

export default VideoCall;