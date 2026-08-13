import { useEffect, useRef, useState } from "react";
import { MdCameraswitch } from "react-icons/md";

function LiveVideo({
  stream,
  isLive = false,
  cameraOn = true,
  username = "User",
  profilePic = "",
  viewerCount = 0,
  onToggleCamera,
  onToggleMic,
  onSwitchCamera,
  micOn = true,
  onLike,
  likeCount = 0,
  liked = false,
  onShare,
  onFullscreen,
  isViewer = false,
}) {
  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!videoRef.current || !stream) return;

    videoRef.current.srcObject = stream;

    videoRef.current.play().catch(() => {});
  }, [stream]);

  useEffect(() => {
    const handleFullscreen = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreen
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreen
      );
    };
  }, []);

  const handleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await videoRef.current?.parentElement?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }

      if (onFullscreen) {
        onFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  return (
    <div className="live-video-section">

      <div className="live-video-wrapper">

        {stream ? (
          <video
            ref={videoRef}
            className="live-video"
            autoPlay
            playsInline
            muted={!isViewer}
          />
        ) : (
          <div className="live-video-placeholder">

            {profilePic ? (
              <img
                src={profilePic}
                alt={username}
                className="live-placeholder-image"
              />
            ) : (
              <div className="live-placeholder-avatar">
                {username
                  ?.charAt(0)
                  ?.toUpperCase()}
              </div>
            )}

            <p>
              {isViewer
                ? "Waiting for live stream..."
                : "Camera preview"}
            </p>

          </div>
        )}

        {!cameraOn && !isViewer && (
          <div className="camera-off-overlay">

            {profilePic ? (
              <img
                src={profilePic}
                alt={username}
              />
            ) : (
              <div className="camera-off-avatar">
                {username
                  ?.charAt(0)
                  ?.toUpperCase()}
              </div>
            )}

            <p>Camera is off</p>

          </div>
        )}

        {isLive && (
          <div className="video-live-badge">
            🔴 LIVE
          </div>
        )}

        <div className="video-viewer-badge">
          👁️ {viewerCount}
        </div>

        <button
          className="fullscreen-button"
          onClick={handleFullscreen}
          type="button"
        >
          {isFullscreen ? "⛶" : "⛶"}
        </button>

      </div>

      <div className="live-controls">

        {!isViewer && (
          <>
            <button
              type="button"
              className={`live-control ${
                !micOn ? "control-off" : ""
              }`}
              onClick={onToggleMic}
              title={
                micOn
                  ? "Mute microphone"
                  : "Unmute microphone"
              }
            >
              {micOn ? "🎤" : "🔇"}
            </button>

            <button
              type="button"
              className={`live-control ${
                !cameraOn ? "control-off" : ""
              }`}
              onClick={onToggleCamera}
              title={
                cameraOn
                  ? "Turn camera off"
                  : "Turn camera on"
              }
            >
              {cameraOn ? "📹" : "🚫"}
            </button>
          </>
        )}
        <button
  type="button"
  className="live-control switch-camera-button"
  onClick={onSwitchCamera}
  title="Switch Camera"
>
  <MdCameraswitch />
</button>

        <button
          type="button"
          className={`live-control like-button ${
            liked ? "liked" : ""
          }`}
          onClick={onLike}
          title="Like"
        >
          ❤️

          <span>
            {likeCount}
          </span>
        </button>

        <button
          type="button"
          className="live-control"
          onClick={onShare}
          title="Share"
        >
          🔗
        </button>

      </div>

    </div>
  );
}

export default LiveVideo;
