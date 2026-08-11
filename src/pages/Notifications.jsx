import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const getTimeAgo = (date) => {
    const seconds = Math.floor(
      (new Date() - new Date(date)) / 1000
    );

    if (seconds < 60) {
      return `${seconds} seconds ago`;
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes} minutes ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hours ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 30) {
      return `${days} days ago`;
    }

    const months = Math.floor(days / 30);

    if (months < 12) {
      return `${months} months ago`;
    }

    const years = Math.floor(months / 12);

    return `${years} years ago`;
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://social-media-backend-9fag.onrender.com/api/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error(
        "Notifications Error:",
        error
      );
    }
  };

  useEffect(() => {
  const loadNotifications = async () => {
    await fetchNotifications();

    // Notifications page open hote hi unread notifications read kar do
    try {
      const token = localStorage.getItem("token");

      await fetch(
        "https://social-media-backend-9fag.onrender.com/api/notifications/read-all",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error("Auto Mark Read Error:", error);
    }
  };

  loadNotifications();

  const interval = setInterval(() => {
    fetchNotifications();
  }, 60000);

  return () => clearInterval(interval);
}, []);

  const handleNotificationClick = async (
    notification
  ) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(
        `https://social-media-backend-9fag.onrender.com/api/notifications/${notification._id}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id
            ? {
                ...item,
                isRead: true,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Mark Read Error:",
        error
      );
    }

    // Story Like / Comment
    if (
      notification.type === "story_like" ||
      notification.type === "story_comment"
    ) {
      if (notification.story?._id) {
        navigate(
          `/story/${notification.story._id}`
        );
      }

      return;
    }
    if (notification.type === "note_reply") {
  if (notification.sender?._id) {
    navigate(`/chat?userId=${notification.sender._id}`);
  } else {
    navigate("/chat");
  }

  return;
}
    //follow request notification
    if (notification.type === "follow" && notification.message.includes("follow request")) {
      navigate("/profile");
      return;
    }
    // Reel Notification
    if (notification.reel) {
      navigate("/reels");
      return;
    }

    // Post Notification
    if (notification.post) {
      navigate("/explore");
      return;
    }

    // Default
    navigate("/explore");
  };
  const handleAddMentionedStory = async (storyId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "https://social-media-backend-9fag.onrender.com/api/stories/add-mentioned",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          storyId,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to add story");
      return;
    }

    alert("Story added to your story successfully");
  } catch (error) {
    console.error("Add Mentioned Story Error:", error);
    alert("Server error");
  }
};

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://social-media-backend-9fag.onrender.com/api/notifications/read-all",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) => ({
            ...notification,
            isRead: true,
          }))
        );
      }
    } catch (error) {
      console.error(
        "Mark All Read Error:",
        error
      );
    }
  };

  return (
    <div className="notifications-container">
      <button
  onClick={() => navigate(-1)}
  style={{
    width: "45px",
    height: "45px",
    border: "none",
    borderRadius: "50%",
    background: "#1877f2",
    color: "white",
    fontSize: "28px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "10px",
  }}
>
  ←
</button>
      <h1>Notifications</h1>

      <button
        onClick={handleMarkAllRead}
      >
        Mark All as Read
      </button>

      {notifications.length === 0 ? (
        <div className="notification-card">
          <p>No new notifications.</p>
        </div>
      ) : (
       notifications.map(
          (notification) => (
             console.log(notification.type, notification),
             console.log("STORY:", notification.story),
            <div
              className="notification-card"
              key={notification._id}
              onClick={() =>
                handleNotificationClick(
                  notification
                )
              }
              style={{
                cursor: "pointer",
                opacity:
                  notification.isRead
                    ? 0.6
                    : 1,
              }}
            >
              <img
                src={
                  notification.sender
                    ?.profilePic
                    ? `https://social-media-backend-9fag.onrender.com${notification.sender.profilePic}`
                    : "https://randomuser.me/api/portraits/men/1.jpg"
                }
                alt={
                  notification.sender
                    ?.name || "User"
                 }
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              <p>
                <strong>
                  {
                    notification.sender
                      ?.name
                  }
                </strong>{" "}
                {notification.message}

                {!notification.isRead && (
                  <span
                    style={{
                      marginLeft: "10px",
                    }}
                  >
                    🔵
                  </span>
                )}
              </p>
              {notification.type?.toLowerCase() === "story_mention" && (
  <button
    onClick={(e) => {
      e.stopPropagation();
      handleAddMentionedStory(notification.story?._id);
    }}
    style={{
      background: "#1877f2",
      color: "white",
      border: "none",
      padding: "8px 12px",
      borderRadius: "8px",
      cursor: "pointer",
      marginTop: "8px",
    }}
  >
    ➕Add to your story
  </button>
)}

              <small>
                {getTimeAgo(
                  notification.createdAt
                )}
              </small>
            </div>
          )
        )
      )}
    </div>
  );
}

export default Notifications;
