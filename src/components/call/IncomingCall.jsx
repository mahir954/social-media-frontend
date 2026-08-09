import React from "react";

function IncomingCall({
  callerName,
  callType,
  onAccept,
  onReject,
  visible,
}) {
  if (!visible) return null;

  return (
    <div className="incoming-call-overlay">
      <div className="incoming-call-box">
        <h2>Incoming {callType} Call</h2>

        <h3>{callerName}</h3>

        <div className="call-buttons">
          <button onClick={onAccept}>
            ✅ Accept
          </button>

          <button onClick={onReject}>
            ❌ Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncomingCall;