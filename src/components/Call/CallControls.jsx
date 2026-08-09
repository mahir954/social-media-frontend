import React from "react";
import "./Call.css";

function CallControls({
  muted,
  cameraOn,
  onToggleMute,
  onToggleCamera,
  onEndCall,
}) {
  return (
    <div className="call-controls">

      <button onClick={onToggleMute}>
        {muted ? "🎤 Unmute" : "🔇 Mute"}
      </button>

      <button onClick={onToggleCamera}>
        {cameraOn ? "📷 Camera Off" : "📹 Camera On"}
      </button>

      <button className="end-call-btn" onClick={onEndCall}>
        ❌ End Call
      </button>

    </div>
  );
}

export default CallControls;