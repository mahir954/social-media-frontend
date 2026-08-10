import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/chat.css";
import Note from "../components/Note";
import { io } from "socket.io-client";
import IncomingCall from "../components/Call/IncomingCall";
import AudioCall from "../components/Call/AudioCall";
import VideoCall from "../components/Call/VideoCall";
import CallControls from "../components/Call/CallControls";

function Chat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedUserId = searchParams.get("userId");
  
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showDelete, setShowDelete] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [forwardMessage, setForwardMessage] = useState(null);
  const [pinnedMessage, setPinnedMessage] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState("");
  const [incomingCall, setIncomingCall] = useState(false);
const [audioCall, setAudioCall] = useState(false);
const [videoCall, setVideoCall] = useState(false);

const [callerName, setCallerName] = useState("");
const [callType, setCallType] = useState("");

const [muted, setMuted] = useState(false);
const [cameraOn, setCameraOn] = useState(true);
  const socket = io("https://social-media-backend-9fag.onrender.com");
  useEffect(() => {
  let interval;

  if (recording) {
    interval = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  } else {
    setRecordingTime(0);
  }

  return () => clearInterval(interval);
}, [recording]);
  

  // Listen for typing indicator
  useEffect(() => {
    const socket = io("https://social-media-backend-9fag.onrender.com");
    const userId = localStorage.getItem("userId");
    if (userId){
      socket.emit("userOnline", userId);
    }
   
    
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("userTyping", () => {
      setOtherUserTyping(true);
    });

    socket.on("userStopTyping", () => {
      setOtherUserTyping(false);
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("userTyping");
      socket.off("userStopTyping");
      socket.disconnect();
    };
  }, []);

  

  // Fetch Users
  useEffect(() => {
    
    
  
    const fetchUsers = async () => {
      try {
       const token = localStorage.getItem("token");

const response = await fetch(
  "https://social-media-backend-9fag.onrender.com/api/messages/conversations/list",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

        const data = await response.json();

        if (!response.ok) {
          console.error(data.message);
          return;
        }
          setUsers(data.users);
          if (selectedUserId) {
  const user = data.users.find(
    (user) => user._id === selectedUserId
  );

  if (user) {
    setSelectedUser(user);
  }
}
         
      } catch (error) {
        console.error("Users Error:", error);
      }
    };

    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);
  return () => {
    clearInterval(interval);
    
  };
  }, [selectedUserId]);

  // Fetch Messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) {
        setMessages([]);
        return;
      }

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Please login first");
          return;
        }

        const response = await fetch(
          `https://social-media-backend-9fag.onrender.com/api/messages/${selectedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Failed to fetch messages");
          return;
        }

        setMessages(data.messages || []);
        await fetch(
          `https://social-media-backend-9fag.onrender.com/api/messages/read/${selectedUser._id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Fetch Messages Error:", error);
      }
    };

    fetchMessages();
  }, [selectedUser]);
  useEffect(() => {
  // Online users
}, []);

useEffect(() => {
  // Messages
}, []);

// 👇 Yahan add karo
useEffect(() => {
  socket.on("incoming-call", (data) => {
    setCallerName(data.callerName);
    setCallType(data.type);
    setIncomingCall(true);
    setVideoCall(data.type === "video");
    setAudioCall(data.type === "audio");
    setCallerData(data);
  });

  return () => {
    socket.off("incoming-call");
  };
}, []);
  //voice recording
const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    recorder.onstop = () => {
      const audioBlob = new Blob(chunks, {
        type: "audio/webm",
      });

      setAudioChunks([audioBlob]);
      setAudioUrl(URL.createObjectURL(audioBlob));
      stream.getTracks().forEach((track) => track.stop());
    };

    recorder.start();

    setMediaRecorder(recorder);
    setRecording(true);
  } catch (error) {
    console.log("Microphone permission error:", error);
    alert("Microphone permission nahi mili");
  }
};
const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state !== "inactive"){
    mediaRecorder.stop();
    setRecording(false);
    setMediaRecorder(null);
  }
};
const sendVoiceMessage = async () => {
  if (!audioChunks.length) return;

  if (!selectedUser) {
    alert("Please select a user");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const audioBlob = audioChunks[0];

    const voiceFile = new File(
      [audioBlob],
      "voice-message.webm",
      {
        type: "audio/webm",
      }
    );

    await sendFile(voiceFile);

    setAudioChunks([]);
    setAudioUrl("");
  } catch (error) {
    console.error("Voice Message Error:", error);
    alert("Failed to send voice message");
  }
};
  // Send Message
  const sendMessage = async () => {
    if (!message.trim()) {
      alert("Please type a message");
      return;
    }

    if (!selectedUser) {
      alert("Please select a user");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const response = await fetch(
        "https://social-media-backend-9fag.onrender.com/api/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            receiver: selectedUser._id,
            text: message.trim(),
            replyTo: replyTo ? replyTo._id : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to send message");
        return;
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        data.data,
      ]);

      setMessage("");
      setIsTyping(false);
      setReplyTo(null);
    } catch (error) {
      console.error("Send Message Error:", error);
      alert("Server error");
    }
  };
  //upload file
  const sendFile = async (file) => {
  if (!file) return;
  if (file.size > 10 * 1024 * 1024){
    alert("File size must be less than 10 MB");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("receiver", selectedUser._id);

    const response = await fetch(
      "https://social-media-backend-9fag.onrender.com/api/messages/upload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to upload file");
      return;
    }

    console.log("Uploaded File:", data.file);
    if (data.data) {
      setMessages((prevMessages) => [
        ...prevMessages,
        data.data,
      ]);
    }
    


  } catch (error) {
    console.error("File Upload Error:", error);
    alert("Server error");
  }
};
  // Add Reaction
const addReaction = async (messageId, reaction) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/messages/${messageId}/react`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reaction: reaction,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to add reaction");
      return;
    }

    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg._id === messageId
          ? { ...msg, reactions: data.data.reactions }
          : msg
      )
    );
  } catch (error) {
    console.error("Reaction Error:", error);
    alert("Server error");
  }
};
  const deleteMessage = async(messageId) => {
    try {
      const token = localStorage.getItem("token");
      if(!token){
        alert("Please login first");
        return;
      }
      const response = await
      fetch(
        `https://social-media-backend-9fag.onrender.com/api/messages/${messageId}`,
        {
          method: "Delete",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await
      response.json();
      if(!response.ok){
        alert(data.message || "Failed to delete message");
        return;
      }
      setMessages((prevMessages) => 
      prevMessages.filter(
        (msg) => msg._id !== messageId
      )
      );
    } catch (error){
      console.error("Delete Message Error:", error);
      alert("Server error");
    }
  };
  const unsendMessage = async (messageId) => {
  const confirmUnsend = window.confirm(
    "Are you sure you want to unsend this message?"
  );

  if (!confirmUnsend) return;

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/messages/${messageId}/unsend`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to unsend message");
      return;
    }

    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg._id === messageId
          ? { ...msg, text: "This message was unsent" }
          : msg
      )
    );
  } catch (error) {
    console.error("Unsend Message Error:", error);
    alert("Server error");
  }
};
  //edit message
  const editMessage = async(messageId, newText) => {
    try {
      const token = localStorage.getItem("token");
      if(!token) {
        alert("Please login first");
        return;
      }
      const response = await
      fetch(
        `https://social-media-backend-9fag.onrender.com/api/messages/${messageId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,

          },
          body: JSON.stringify({
            text: newText,
          }),
        }
      );
      const data = await
      response.json();
      if(!response.ok) {
        alert(data.message || "Failed to edit message");
        return;
      }
      setMessages((prevMessages) => 
      prevMessages.map((msg) => 
        msg._id === messageId ? { ...msg, text: newText }
      : msg
        
      )
      );
      setEditingMessage(null);

    } catch (error) {
      console.error("Edit Message Error:", error);
      alert("Server error");
    }
  };
  const handleEndCall = () => {
  setAudioCall(false);
  setVideoCall(false);
  setIncomingCall(false);
};

const handleToggleMute = () => {
  setMuted(!muted);
};

const handleToggleCamera = () => {
  setCameraOn(!cameraOn);
};
const startCall = (type) => {
  socket.emit("call-user", {
    from: localStorage.getItem("userId"),
    to: selectedUser._id,
    callerName: localStorage.getItem("name") || "User",
    type, // "audio" ya "video"
  });

  if (type === "audio") {
    setAudioCall(true);
  } else {
    setVideoCall(true);
  }
};

  

  return (
    <div className="chat-container">
      <Note />
      <IncomingCall
  visible={incomingCall}
  callerName={callerName}
  callType={callType}
  onAccept={() => {
    socket.emit("accept-call", {
      to: selectedUser._id,
    });

    setIncomingCall(false);

    if (callType === "audio") {
      setAudioCall(true);
    } else {
      setVideoCall(true);
    }
  }}
  onReject={() => {
    socket.emit("reject-call", {
      to: selectedUser._id,
    });

    setIncomingCall(false);
  }}
/>
<VideoCall
  userName={selectedUser?.name}
  userId={selectedUser?._id}
  profilePic={selectedUser?.profilePic}
  incoming={incomingCall}
  visible={videoCall}
  onEnd={() => setVideoCall(false)}
/>

<AudioCall
  userName={selectedUser?.name}
  userId={selectedUser?._id}
  profilePic={selectedUser?.profilePic}
  visible={audioCall}
  onEnd={() => setAudioCall(false)}
/>
      <h1>Chat</h1>

      <div className="chat-box">
        <h2>Users</h2>

        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          users.map((user) => (
            <div
              className="chat-user"
              key={user._id}
            >
              <h3>{user.name}</h3>
              {user.activeStory && (
  <span
   onClick={() => navigate(`/story/${user.activeStory._id}`)}
    style={{
      color: "#00ff00",
      fontSize: "18px",
      marginLeft: "8px",
    }}
  >
    ★
  </span>
)}
              <span className={onlineUsers.includes(user._id) ? "online-status" : "offline-status"}>
  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
</span>
              <p>{user.email}</p>
              
              
              <button
                onClick={() => { setSelectedUser(user);
                  setSearchParams({ userId: user._id });
                }}
              >
                Message
              </button>
            </div>
          ))
        )}
      </div>

      {selectedUser && (
        
        <div className="selected-chat">
          {forwardMessage && (
  <div className="forward-box">
    <h3>Forward Message</h3>

    {users.map((user) => (
      <button
        key={user._id}
        onClick={async () => {
          try {
            const token = localStorage.getItem("token");

            const response = await fetch(
              "https://social-media-backend-9fag.onrender.com/api/messages",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  receiver: user._id,
                  text: forwardMessage.text,
                }),
              }
            );

            if (response.ok) {
              setForwardMessage(null);
              alert("Message forwarded successfully");
            }
          } catch (error) {
            console.error("Forward Message Error:", error);
          }
        }}
      >
        {user.name}
      </button>
    ))}

    <button onClick={() => setForwardMessage(null)}>
      Cancel
    </button>
  </div>
)}
          <h2>
            Chat with {selectedUser.name}
          </h2>
          <div className="call-buttons">
  <button
    className="audio-call-btn"
    onClick={() => startCall("audio")}
  >
    📞 Audio Call
  </button>

  <button
    className="video-call-btn"
    onClick={() => startCall("video")}
  >
    🎥 Video Call
  </button>
</div>
          <span
          className={onlineUsers.includes(selectedUser._id) ? "online-status" : "offline-status"}>
            {onlineUsers.includes( selectedUser._id) ? "Online" : "Offline"}
          </span>

          <p>{selectedUser.email}</p>
          {!onlineUsers.includes(selectedUser._id) && selectedUser.lastSeen && (
  <p className="last-seen">
    Last seen: {new Date(selectedUser.lastSeen).toLocaleString()}
  </p>
)}
          <div className="message-search">
            <input
            type="text"
            placeholder="Search messages..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            />
            </div>

          <div className="messages-list">
            {messages.length === 0 ? (
              <p>No messages yet.</p>
            ) : (
              messages
              .filter((msg) => 
              msg.text
              .toLowerCase()
              .includes(searchText.toLowerCase())
              )
              .map((msg, index) => {
                const myUserId =
                  localStorage.getItem("userId");

                const senderId =
                  typeof msg.sender === "object"
                    ? msg.sender._id
                    : msg.sender;

                const isMyMessage =
                  senderId === myUserId;

                const currentDate =
                  new Date(
                    msg.createdAt
                  ).toLocaleDateString();

                const previousDate =
                  index > 0
                    ? new Date(
                      messages[index - 1].createdAt
                    ).toLocaleDateString()
                    : null;

                const showDate =
                  currentDate !== previousDate;

                return (
                  <div
                    key={msg._id}
                    className={
                      isMyMessage
                        ? "message-row my-message-row"
                        : "message-row other-message-row"
                    }
                  >
                    {/* Date - Center */}
                    {showDate && (
                      <div className="message-date">
                        {new Date(
                          msg.createdAt
                        ).toLocaleDateString([], {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </div>
                    )}

                    {/* Message */}
                    <div
                      className={
                        isMyMessage
                          ? "message-item my-message"
                          : "message-item other-message"
                      }
                      onClick={() => {
                        if (isMyMessage) {
                          setShowDelete(
                            showDelete === msg._id ? null : msg._id
                          );
                        }
                      }}
                    >
                      {msg.storyReply && (
  <div
    style={{
      background: "rgba(0, 0, 0, 0.08)",
      borderLeft: "3px solid #1877f2",
      padding: "8px 10px",
      borderRadius: "8px",
      marginBottom: "6px",
      fontSize: "13px",
    }}
  >
    <strong>↩️ Replied to Story</strong>

    {msg.storyMedia && (
      <img
        src={`https://social-media-backend-9fag.onrender.com${msg.storyMedia}`}
        alt="Story"
        style={{
          width: "50px",
          height: "50px",
          objectFit: "cover",
          borderRadius: "6px",
          display: "block",
          marginTop: "5px",
        }}
      />
    )}
  </div>
)}
{msg.messageType === "note_reply" && (
  <div
    style={{
      background: "rgba(24,119,242,0.08)",
      borderLeft: "3px solid #1877f2",
      padding: "8px 10px",
      borderRadius: "8px",
      marginBottom: "6px",
      fontSize: "13px",
      fontWeight: "600",
    }}
  >
    💬 Replied to your note
  </div>
)}
                      {msg.replyTo && (
                        <div
                        className="replied-message">
                          <span>Replying to:</span>
                          <p>{msg.replyTo.text}</p>
                          </div>
                      )}
                       {msg.messageType === "story" ? (
  <div className="story-message-card">
    <p>📸 Mentioned you in a story</p>

    <img
      src={`https://social-media-backend-9fag.onrender.com${msg.storyMedia}`}
      alt="Story"
      style={{
        width: "180px",
        borderRadius: "10px",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/story/${msg.story}`)}
    />
  </div>
) : msg.fileUrl ? (
  msg.fileType?.startsWith("image/") ? (
    <img
      src={`https://social-media-backend-9fag.onrender.com${msg.fileUrl}`}
      alt={msg.fileName}
      className="chat-image"
    />
  ) : (
    <a
      href={`https://social-media-backend-9fag.onrender.com${msg.fileUrl}`}
      target="_blank"
      rel="noopener noreferrer"
      className="chat-file"
    >
      📎 {msg.fileName}
    </a>
  )
) : (
  <span className="message-text">
    {msg.text}
  </span>
)}
                      {msg.edited === true && (
                        <span className="edited-label">Edited</span>
                      )}

                      {/* Time */}
                      <span className="message-time">
                        {new Date(
                          msg.createdAt
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {isMyMessage && (
                        <span className={msg.isRead ? "message-seen" : "message-sent"}>✓✓</span>
                      )}
                      <button
                      className="reply-btn"
                      onClick={() => setReplyTo(msg)}>Reply</button>
                      <button
                      className="forward-btn"
                      onClick={() => 
                        setForwardMessage(msg)
                      }>Forward</button>
                      <button
                      className="copy-btn"
                      onClick={()  => {
                        navigator.clipboard.writeText(msg.text);
                        alert("Message copied");
                      }}
                      > 📋 Copy</button>
                      <button
                      className="pin-btn"
                      onClick={() =>
                        setPinnedMessage(msg)
                      }>📌 Pin</button>

                    
  

<div className="reaction-buttons">
  <button onClick={() => addReaction(msg._id, "❤️")}>❤️</button>
  <button onClick={() => addReaction(msg._id, "👍")}>👍</button>
  <button onClick={() => addReaction(msg._id, "😂")}>😂</button>
  <button onClick={() => addReaction(msg._id, "😮")}>😮</button>
  <button onClick={() => addReaction(msg._id, "😢")}>😢</button>
</div>
{msg.reactions && msg.reactions.length > 0 && (
  <div className="message-reactions">
    {msg.reactions.map((reaction, index) => (
      <span key={index} className="reaction">
        {reaction}
      </span>
    ))}
  </div>
)}

                      {isMyMessage && showDelete === msg._id && (
                        <>
                        <button
                        type="button"
                        className="edit-msg-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newText = window.prompt(
                            "Edit your message:",
                            msg.text
                          );
                          if(newText && newText.trim()) {
                            editMessage(
                              msg._id,
                              newText.trim()
                            );
                          }
                        }}
                        >Edit</button>
                      <button
                      type="button"
                      className="delete-msg-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        const confirmDelete = window.confirm(
                          "Are you sure you want to delete this message?"
                        );
                        if (confirmDelete){
                        deleteMessage(msg._id);
                        setShowDelete(null);
                        }
                      }}
                      >Delete</button>
                      
                        <button
                        type="button"
                        className="unsend-msg-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          unsendMessage(msg._id);
                          setShowDelete(null);
                        }}
                      >Unsend</button>
                      
</>
                      
                    )}
                    
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {pinnedMessage && (
  <div className="pinned-message">
    <span>📌 Pinned Message:</span>
    <p>{pinnedMessage.text}</p>

    <button onClick={() => setPinnedMessage(null)}>
      Unpin
    </button>
  </div>
)}
          <div
            className="message-input-area">
              {replyTo && (
                <div
                className="reply-preview">
                  <span>Replying to:</span>
                  <p>{replyTo.text}</p>
                  <button onClick={() => setReplyTo(null)}>❌</button>
                  </div>
              )}
             {otherUserTyping && (
  <p className="typing-indicator">
    {selectedUser.name} is typing...
  </p>
)}
              <label htmlFor="file-upload" className="file-upload-btn">📎</label>
              <input
              id="file-upload"
              type="file"
              accept="image/*,.pdf,.docx,.txt"
              style={{ display: "none"}}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  sendFile(file);
                  e.target.value = "";
                }
              }}
              />

           <textarea
  className="message-textarea"
  value={message}
  rows={1}
  onChange={(e) => {
    const value = e.target.value;

    setMessage(value);
    setIsTyping(value.length > 0);

    e.target.style.height = "auto";
    e.target.style.height =
      Math.min(e.target.scrollHeight, 110) + "px";

    if (value.length > 0) {
      socket.emit("typing");
    } else {
      socket.emit("stopTyping");
    }
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }}
  placeholder="Message..."
/>
            {recording ? (
  <>
    <span>
      ⏺️ {Math.floor(recordingTime / 60)
        .toString()
        .padStart(2, "0")}
      :
      {(recordingTime % 60)
        .toString()
        .padStart(2, "0")}
    </span>

    <button
      type="button"
      onClick={stopRecording}
    >
      ⏹️ Stop
    </button>
    
    <button
    type="button"
    onClick={() => {
      if (mediaRecorder && mediaRecorder.state !== "inactive"){
        mediaRecorder.onstop = null;
        mediaRecorder.stop();
      }
      setRecording(false);
      setAudioChunks([]);
      setAudioUrl("");
      setMediaRecorder(null);
    }}

    >❌ cancel
    </button>

  </>
) : (
  <button
    type="button"
    onClick={startRecording}
  >
    🎙️
  </button>
)}
{audioUrl && (
  <>
  <audio
  controls
  src={audioUrl}
  />
  <button
  type="button"
  onClick={sendVoiceMessage}
  >🎙️ Send Voice</button>
  </>
)}

            <button
              type="button"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
  

      )}
      </div>
  );
}



      export default Chat;
