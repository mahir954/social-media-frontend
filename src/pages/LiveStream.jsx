import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";

import "../styles/liveStream.css";
import LiveVideo from "../components/LiveVideo";
import LiveChat from "../components/LiveChat";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function LiveStream() {
  const navigate = useNavigate();
  const location = useLocation();

  const localStreamRef = useRef(null);
  const socketRef = useRef(null);
  const timerRef = useRef(null);

  const [isLive, setIsLive] = useState(false);
  const [localStream, setLocalStream] = useState(null);

  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  const [streamId, setStreamId] = useState(null);

  const [title, setTitle] = useState("");
  const [tempTitle, setTempTitle] = useState("");

  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  const [viewerCount, setViewerCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const [duration, setDuration] = useState(0);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const pathParts = location.pathname
    .split("/")
    .filter(Boolean);

  const isViewer =
    pathParts[0] === "live" &&
    Boolean(pathParts[1]) &&
    pathParts[1] !== "create";

  const viewerStreamId = isViewer
    ? pathParts[1]
    : null;

  const getUser = () => {
    try {
      return (
        JSON.parse(localStorage.getItem("user")) ||
        JSON.parse(
          localStorage.getItem("loggedInUser")
        )
      );
    } catch {
      return null;
    }
  };

  const currentUser = getUser();

  const userId =
    currentUser?._id ||
    currentUser?.id ||
    localStorage.getItem("userId") ||
    null;

  const username =
    currentUser?.username ||
    currentUser?.name ||
    currentUser?.fullName ||
    "User";

  const profilePic =
    currentUser?.profilePic ||
    currentUser?.profileImage ||
    currentUser?.avatar ||
    "";

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor(
      (seconds % 3600) / 60
    );
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${String(hrs).padStart(
        2,
        "0"
      )}:${String(mins).padStart(
        2,
        "0"
      )}:${String(secs).padStart(
        2,
        "0"
      )}`;
    }

    return `${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const getCamera = async () => {
    setError("");

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: {
              ideal: 1280,
            },
            height: {
              ideal: 720,
            },
          },
          audio: true,
        });

      localStreamRef.current = stream;
      setLocalStream(stream);

      setCameraOn(true);
      setMicOn(true);

      return stream;
    } catch (err) {
      console.error(
        "Camera error:",
        err
      );

      if (
        err?.name ===
        "NotAllowedError"
      ) {
        setError(
          "Camera aur microphone permission allow karein."
        );
      } else if (
        err?.name ===
        "NotFoundError"
      ) {
        setError(
          "Camera ya microphone device nahi mila."
        );
      } else {
        setError(
          "Camera start nahi ho paya."
        );
      }

      return null;
    }
  };

  const connectSocket = () => {
    if (socketRef.current) {
      return socketRef.current;
    }

    const token =
      localStorage.getItem("token");

    const socket = io(SOCKET_URL, {
      transports: [
        "websocket",
        "polling",
      ],
      auth: {
        token,
        userId,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log(
        "Live socket connected:",
        socket.id
      );
    });

    socket.on(
      "connect_error",
      (err) => {
        console.error(
          "Live socket error:",
          err
        );
      }
    );

    socket.on(
      "live-viewers",
      (data) => {
        if (
          typeof data?.count ===
          "number"
        ) {
          setViewerCount(
            data.count
          );
        }
      }
    );

    socket.on(
      "viewer-count",
      (data) => {
        if (
          typeof data?.count ===
          "number"
        ) {
          setViewerCount(
            data.count
          );
        }
      }
    );

    socket.on(
      "live-comment",
      const startLive = async () => {
    if (isStarting) return;

    setError("");
    setMessage("");

    const cleanTitle =
      tempTitle.trim();

    if (!cleanTitle) {
      setError(
        "Live stream ka title enter karein."
      );
      return;
    }

    setIsStarting(true);

    try {
      const stream =
        await getCamera();

      if (!stream) {
        setIsStarting(false);
        return;
      }

      const socket =
        connectSocket();

      const newStreamId =
        live_${userId || "user"}_${Date.now()};

      setStreamId(newStreamId);
      setTitle(cleanTitle);
      setIsLive(true);
      setDuration(0);
      setViewerCount(1);
      setLikeCount(0);
      setLiked(false);
      setComments([]);

      socket.emit(
        "start-live",
        {
          streamId: newStreamId,
          userId,
          username,
          profilePic,
          title: cleanTitle,
          startedAt:
            new Date().toISOString(),
        }
      );

      socket.emit(
        "host-started-live",
        {
          streamId: newStreamId,
          userId,
          username,
          title: cleanTitle,
        }
      );

      startTimer();

      setMessage(
        "You are now live."
      );
    } catch (err) {
      console.error(
        "Start live error:",
        err
      );

      stopLocalStream();

      setError(
        "Live stream start nahi ho paya."
      );
    } finally {
      setIsStarting(false);
    }
  };

  const joinLive = () => {
    if (!viewerStreamId) {
      return;
    }

    const socket =
      connectSocket();

    setStreamId(
      viewerStreamId
    );

    setIsLive(true);

    socket.emit(
      "join-live",
      {
        streamId:
          viewerStreamId,
        userId,
        username,
        profilePic,
      }
    );

    socket.emit(
      "join-live-stream",
      {
        streamId:
          viewerStreamId,
        userId,
        username,
      }
    );
  };

  const toggleCamera = () => {
    const stream =
      localStreamRef.current;

    if (!stream) return;

    const videoTracks =
      stream.getVideoTracks();

    if (!videoTracks.length) {
      return;
    }

    const nextState =
      !cameraOn;

    videoTracks.forEach(
      (track) => {
        track.enabled =
          nextState;
      }
    );

    setCameraOn(nextState);

    socketRef.current?.emit(
      "live-camera-toggle",
      {
        streamId,
        userId,
        cameraOn: nextState,
      }
    );
  };

  const toggleMic = () => {
    const stream =
      localStreamRef.current;

    if (!stream)
      useEffect(() => {
    connectSocket();

    return () => {
      stopTimer();
      stopLocalStream();

      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isViewer || !viewerStreamId) {
      return;
    }

    fetchLiveInfo();
    joinLive();

    return () => {
      socketRef.current?.emit(
        "leave-live",
        {
          streamId: viewerStreamId,
          userId,
        }
      );
    };
  }, [viewerStreamId]);

  if (!isLive && !isViewer) {
    return (
      <div className="live-page">

        <div className="live-header">

          <button
            className="live-back-btn"
            onClick={() => navigate(-1)}
          >
            ←
          </button>

          <h2>Go Live</h2>

        </div>

        <div className="live-start-card">

          <div className="live-camera-icon">
            📹
          </div>

          <h1>
            Start Live Stream
          </h1>

          <p>
            Go live and connect with
            your followers in real time.
          </p>

          <div className="live-input-group">

            <label>
              Live Title
            </label>

            <input
              type="text"
              placeholder="Enter live stream title..."
              value={tempTitle}
              maxLength={100}
              onChange={(e) =>
                setTempTitle(
                  e.target.value
                )
              }
            />

            <div className="live-character-count">
              {tempTitle.length}/100
            </div>

          </div>

          {error && (
            <div className="live-error">
              {error}
            </div>
          )}

          <button
            className="go-live-button"
            onClick={startLive}
            disabled={isStarting}
          >
            {isStarting
              ? "Starting..."
              : "🔴 Go Live"}
          </button>

          <button
            className="live-cancel-button"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="live-page live-active-page">

      <div className="live-top-bar">

        <div className="live-host-info">

          {profilePic ? (
            <img
              src={profilePic}
              alt={username}
              className="live-profile-image"
            />
          ) : (
            <div className="live-profile-placeholder">
              {username
                ?.charAt(0)
                ?.toUpperCase()}
            </div>
          )}

          <div>

            <div className="live-username">
              {username}
            </div>

            <div className="live-title-small">
              {title || "Live Stream"}
            </div>

          </div>

        </div>

        <div className="live-status-area">

          <span className="live-badge">
            🔴 LIVE
          </span>

          <span className="live-duration">
            {formatDuration(duration)}
          </span>

          <span className="live-viewers">
            👁️ {viewerCount}
          </span>

        </div>

      </div>

      <div className="live-main-content">

        <LiveVideo
          stream={localStream}
          isLive={isLive}
          cameraOn={cameraOn}
          micOn={micOn}
          username={username}
          profilePic={profilePic}
          viewerCount={viewerCount}
          likeCount={likeCount}
          liked={liked}
          isViewer={isViewer}
          onToggleCamera={toggleCamera}
          onToggleMic={toggleMic}
          onLike={likeLive}
          onShare={shareLive}
        />

        <LiveChat
          comments={comments}
          commentText={commentText}
          setCommentText={setCommentText}
          onSendComment={sendComment}
          currentUser={currentUser}
        />

      </div>

      {error && (
        <div className="live-error">
          {error}
        </div>
      )}

      {message && (
        <div className="live-success">
          {message}
        </div>
      )}

      {!isViewer ? (
        <button
          className="end-live-button"
          onClick={endLive}
          disabled={isEnding}
        >
          {isEnding
            ? "Ending..."
            : "🛑 End Live"}
        </button>
      ) : (
        <button
          className="leave-live-button"
          onClick={leaveLive}
        >
          Leave Live
        </button>
      )}

    </div>
  );
}

export default LiveStream;
