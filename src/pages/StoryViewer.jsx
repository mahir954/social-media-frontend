import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function StoryViewer() {
  const { storyId } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [commentText, setCommentText] = useState("");
  const [storyComments, setStoryComments] = useState([]);
  const [showViewers, setShowViewers] = useState(false);
  const [showShareUsers, setShowShareUsers] = useState(false);
  const [users, setUsers] = useState([]);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://192.168.43.245:5000/api/stories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) return;

        const selectedStory = data.stories.find(
          (item) => item._id === storyId
        );

        if (!selectedStory) return;

        setStory(selectedStory);
        setStoryComments(selectedStory.comments || []);

        const currentUserId =
          localStorage.getItem("userId");

        const myReaction =
          selectedStory.reactions?.find(
            (item) =>
              item.user?._id === currentUserId ||
              item.user === currentUserId
          );

        setSelectedReaction(
          myReaction ? myReaction.reaction : null
        );

        const isLiked = selectedStory.likes?.some(
          (like) =>
            (like._id || like).toString() ===
            currentUserId
        );

        setLiked(!!isLiked);

        await fetch(
          `http://192.168.43.245:5000/api/stories/${storyId}/view`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Story Viewer Error:", error);
      }
    };

    fetchStory();
  }, [storyId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://192.168.43.245:5000/api/users"
        );

        const data = await response.json();

        if (response.ok) {
          setUsers(data.users || []);
        }
      } catch (error) {
        console.error("Fetch Users Error:", error);
      }
    };

    fetchUsers();
  }, []);
const handleReaction = async (reaction) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    if (!story?._id) {
      alert("Story not found");
      return;
    }

    const response = await fetch(
      `http://192.168.43.245:5000/api/stories/${story._id}/reaction`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reaction,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(
        data.message ||
          "Failed to update reaction"
      );
      return;
    }

    setStory(data.story);

    const currentUserId =
      localStorage.getItem("userId");

    const myReaction =
      data.story.reactions?.find(
        (item) =>
          item.user?._id === currentUserId ||
          item.user === currentUserId
      );

    if (myReaction) {
      setSelectedReaction(
        myReaction.reaction
      );
    } else {
      setSelectedReaction(null);
    }

    // Reaction ko story owner ke chat me bhi bhejna
    if (
      data.story.user?._id &&
      data.story.user._id !== currentUserId
    ) {
      await fetch(
        "http://192.168.43.245:5000/api/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            receiver: data.story.user._id,
            text: `${reaction} Reacted to your story`,
            storyReply: true,
            storyMedia: data.story.media,
          }),
        }
      );
    }
    alert(`${reaction} reaction sent successfully`);
  } catch (error) {
    console.error(
      "Story Reaction Error:",
      error
    );
    alert("Server error");
  }
};
 
      
      
       

  const handleStoryReply = async () => {
    if (!replyText.trim()) {
      alert("Please type a reply");
      return;
    }

    if (!story?.user?._id) {
      alert("Story owner not found");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const response = await fetch(
        "http://192.168.43.245:5000/api/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            receiver: story.user._id,
            text: replyText.trim(),
            storyReply: true,
            storyMedia: story.media,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to send story reply"
        );
        return;
      }

      setReplyText("");
      alert("Story reply sent successfully");
    } catch (error) {
      console.error(
        "Story Reply Error:",
        error
      );
      alert("Server error");
    }
  };

  const handleShareStory = async (receiverId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const response = await fetch(
        "http://192.168.43.245:5000/api/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            receiver: receiverId,
            text: "📤 Shared a story with you",
            storyReply: true,
            storyMedia: story.media,
            story: story._id,
            messageType: "story",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to share story"
        );
        return;
      }

      alert("Story shared successfully");
      setShowShareUsers(false);
    } catch (error) {
      console.error(
        "Share Story Error:",
        error
      );
      alert("Server error");
    }
  };
  const handleAddToStory = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const response = await fetch(
      "http://192.168.43.245:5000/api/stories/add-mentioned",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          storyId: story._id,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to add story");
      return;
    }

    alert("Story added successfully");
  } catch (error) {
    console.error("Add Mentioned Story Error:", error);
    alert("Server error");
  }
};

  const handleStoryLike = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const response = await fetch(
        `http://192.168.43.245:5000/api/stories/${story._id}/like`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to like story"
        );
        return;
      }

      setStory(data.story);

      const currentUserId =
        localStorage.getItem("userId");

      const isLiked =
        data.story.likes?.some(
          (like) =>
            (like._id || like).toString() ===
            currentUserId
        );

      setLiked(!!isLiked);
    } catch (error) {
      console.error(
        "Story Like Error:",
        error
      );
    }
  };

  const handleStoryComment = async () => {
    if (!commentText.trim()) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const response = await fetch(
        `http://192.168.43.245:5000/api/stories/${story._id}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: commentText.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to add comment"
        );
        return;
      }

      setStory(data.story);
      setStoryComments(
        data.story.comments || []
      );
      setCommentText("");
    } catch (error) {
      console.error(
        "Story Comment Error:",
        error
      );
    }
  };

  if (!story) {
    return <h2>Loading Story...</h2>;
  }

  const isMyStory =
    story.user?._id ===
    localStorage.getItem("userId");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "black",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
       {/* Progress Bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "4px",
          background: "#555",
          zIndex: 20,
        }}
      >
        <div
          style={{
            height: "100%",
            background: "white",
            width: "100%",
            animation: "storyProgress 5s linear",
          }}
        />
      </div>

      {/* User Profile */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          color: "white",
          display: "flex",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <img
          src={
            story.user?.profilePic
              ? `http://192.168.43.245:5000${story.user.profilePic}`
              : "https://randomuser.me/api/portraits/men/1.jpg"
          }
          alt={story.user?.name || "User"}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
            marginRight: "10px",
          }}
        />

        <strong>
          {story.user?.name || "User"}
        </strong>
      </div>

      {/* My Story Buttons */}
      

      {isMyStory && (
        <>
        {story.mentions?.some(
  (user) =>
    user._id === localStorage.getItem("userId")
) && (
  <button
    onClick={handleAddToStory}
    style={{
      position: "absolute",
      bottom: "120px",
      color: "white",
      background: "#1877f2",
      padding: "10px 15px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      zIndex: 10,
    }}
  >
    ➕ Add to your story
  </button>
)}
        
          {/* Views + Delete */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "70px",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <button
              onClick={() => setShowViewers(true)}
              style={{
                color: "white",
                fontSize: "16px",
                fontWeight: "600",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "8px",
              }}
            >
              👁️ {story.viewers?.length || 0} Views
            </button>

            <button
              onClick={async () => {
                const confirmDelete =
                  window.confirm(
                    "Are you sure you want to delete this story?"
                  );

                if (!confirmDelete) return;

                try {
                  const token =
                    localStorage.getItem("token");

                  const response =
                    await fetch(
                      `http://192.168.43.245:5000/api/stories/${story._id}`,
                      {
                        method: "DELETE",
                        headers: {
                          Authorization:
                            `Bearer ${token}`,
                        },
                      }
                    );

                  const data =
                    await response.json();

                  if (!response.ok) {
                    alert(
                      data.message ||
                        "Failed to delete story"
                    );
                    return;
                  }

                  alert(
                    "Story deleted successfully"
                  );

                  navigate("/");
                } catch (error) {
                  console.error(
                    "Delete Story Error:",
                    error
                  );

                  alert("Server error");
                }
              }}
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Delete
            </button>
          </div>

          {/* Highlight Button */}
          <button
            onClick={async () => {
              const highlightTitle =
                window.prompt(
                  "Enter Highlight Name",
                  "My Highlights"
                );

              if (!highlightTitle) return;

              try {
                const token =
                  localStorage.getItem("token");

                const response =
                  await fetch(
                    `http://192.168.43.245:5000/api/stories/${story._id}/highlight`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type":
                          "application/json",
                        Authorization:
                          `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        highlightTitle,
                      }),
                    }
                  );

                const data =
                  await response.json();

                if (!response.ok) {
                  alert(
                    data.message ||
                      "Failed to add highlight"
                  );
                  return;
                }

                alert(
                  "Story added to highlights successfully ⭐"
                );
              } catch (error) {
                console.error(
                  "Highlight Error:",
                  error
                );

                alert("Server error");
              }
            }}
            style={{
              position: "absolute",
              top: "70px",
              right: "70px",
              zIndex: 10,
              background: "#1877f2",
              color: "white",
              border: "none",
              padding: "8px 14px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            ⭐ Highlight
          </button>
        </>
      )}

      {/* Close Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 10,
          background: "white",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          fontSize: "20px",
          cursor: "pointer",
        }}
      >
        ✕
      </button>

      {/* Share Button */}
      <button
        onClick={() =>
          setShowShareUsers(true)
        }
        style={{
          position: "absolute",
          top: "70px",
          right: "20px",
          zIndex: 10,
          background: "white",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          fontSize: "20px",
          cursor: "pointer",
        }}
      >
        🔗
      </button>

      {/* Share Story Users */}
      {showShareUsers && (
        <div
          style={{
            position: "absolute",
            top: "120px",
            right: "20px",
            width: "280px",
            maxHeight: "400px",
            overflowY: "auto",
            background: "white",
            borderRadius: "15px",
            padding: "15px",
            zIndex: 60,
            boxShadow:
              "0 5px 25px rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h3 style={{ margin: 0 }}>
              🔗 Share Story
            </h3>

            <button
              onClick={() =>
                setShowShareUsers(false)
              }
              style={{
                border: "none",
                background: "transparent",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          {users
            .filter(
              (user) =>
                user._id !==
                localStorage.getItem("userId")
            )
            .map((user) => (
              <div
                key={user._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 5px",
                  borderBottom:
                    "1px solid #eee",
                }}
              >
                <img
                  src={
                    user.profilePic
                      ? `http://192.168.43.245:5000${user.profilePic}`
                      : "https://randomuser.me/api/portraits/men/1.jpg"
                  }
                  alt={user.name}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />

                <strong
                  style={{
                    flex: 1,
                  }}
                >
                  {user.name}
                </strong>

                <button
                  onClick={() =>
                    handleShareStory(
                      user._id
                    )
                  }
                  style={{
                    background: "#1877f2",
                    color: "white",
                    border: "none",
                    borderRadius: "20px",
                    padding: "7px 12px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Send
                </button>
              </div>
            ))}
        </div>
      )}

      {/* Story Media */}
      {story.mediaType === "video" ? (
        <video
          src={`http://192.168.43.245:5000${story.media}`}
          controls
          autoPlay
          style={{
            maxWidth: "90%",
            maxHeight: "70vh",
            objectFit: "contain",
          }}
        />
      ) : (
        <img
          src={`http://192.168.43.245:5000${story.media}`}
          alt="Story"
          style={{
            maxWidth: "90%",
            maxHeight: "70vh",
            objectFit: "contain",
          }}
        />
      )}
     {/* Story Music */}
{story.music && story.music.audioUrl && (
  <div
    style={{
      position: "absolute",
      bottom: "165px",
      right: "20px",
      width: "180px",
      background: "white",
      borderRadius: "12px",
      padding: "8px 10px",
      color: "black",
      zIndex: 30,
      boxSizing: "border-box",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "7px",
        marginBottom: "5px",
      }}
    >
      <span style={{ fontSize: "18px" }}>🎵</span>

      <div
        style={{
          fontSize: "12px",
          fontWeight: "600",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {story.music.title}
      </div>
       <div
    style={{
      fontSize: "10px",
      color: "blue",
      marginTop: "2px",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    }}
  >
    {story.music.artist || "Unknown Artist"}
  </div>
    </div>

    <audio
      controls
      preload="metadata"
      src={`http://192.168.43.245:5000${story.music.audioUrl}`}
      style={{
        width: "100%",
        height: "32px",
      }}
    />
  </div>
)}
      

      {/* Viewers List */}
      {showViewers && isMyStory && (
        <div
          style={{
            position: "absolute",
            top: "80px",
            right: "20px",
            width: "280px",
            maxHeight: "400px",
            overflowY: "auto",
            background: "white",
            borderRadius: "15px",
            padding: "15px",
            zIndex: 50,
            boxShadow:
              "0 5px 25px rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h3 style={{ margin: 0 }}>
              👁️ Story Viewers
            </h3>

            <button
              onClick={() =>
                setShowViewers(false)
              }
              style={{
                border: "none",
                background: "transparent",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          {story.viewers?.length > 0 ? (
            story.viewers.map((viewer) => (
              <div
                key={
                  viewer._id || viewer
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 5px",
                  borderBottom:
                    "1px solid #eee",
                }}
              >
                <img
                  src={
                    viewer.profilePic
                      ? `http://192.168.43.245:5000${viewer.profilePic}`
                      : "https://randomuser.me/api/portraits/men/1.jpg"
                  }
                  alt={
                    viewer.name || "User"
                  }
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />

                <strong>
                  {viewer.name || "User"}
                </strong>
              </div>
            ))
          ) : (
            <p
              style={{
                textAlign: "center",
                color: "#777",
              }}
            >
              No viewers yet
            </p>
          )}
        </div>
      )}
      {/* Story Likes and Comments */}
{isMyStory && (
  <div
    style={{
      position: "absolute",
      top: "130px",
      left: "20px",
      width: "240px",
      maxHeight: "280px",
      overflowY: "auto",
      background: "white",
      color: "#222",
      borderRadius: "15px",
      padding: "12px",
      zIndex: 40,
      boxShadow:
        "0 5px 25px rgba(0,0,0,0.4)",
    }}
  >
    {/* Likes */}
    <h3 style={{ marginTop: 0 }}>
      ❤️ Likes ({story.likes?.length || 0})
    </h3>

    {story.likes?.length > 0 ? (
      story.likes.map((like) => (
        <div
          key={like._id || like}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 0",
            borderBottom: "1px solid #eee",
          }}
        >
          <img
            src={
              like.profilePic
                ? `http://192.168.43.245:5000${like.profilePic}`
                : "https://randomuser.me/api/portraits/men/1.jpg"
            }
            alt={like.name || "User"}
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />

          <strong>
            {like.name || "User"}
          </strong>
        </div>
      ))
    ) : (
      <p style={{ color: "#777" }}>
        No likes yet
      </p>
    )}

    {/* Comments */}
    <h3 style={{ marginTop: "20px" }}>
      💬 Comments ({story.comments?.length || 0})
    </h3>

    {story.comments?.length > 0 ? (
      story.comments.map((comment) => (
        <div
  key={comment._id}
  style={{
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  }}
>
  <img
    src={
      comment.user?.profilePic
        ? `http://192.168.43.245:5000${comment.user.profilePic}`
        : "https://randomuser.me/api/portraits/men/1.jpg"
    }
    alt={comment.user?.name || "User"}
    style={{
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      objectFit: "cover",
      flexShrink: 0,
    }}
  />

  <div>
    <strong>
      {comment.user?.name || "User"}
    </strong>

    <p
      style={{
        margin: "3px 0 0",
        color: "#555",
      }}
    >
      {comment.text}
    </p>
  </div>
</div>
            
      ))
    ) : (
      <p style={{ color: "#777" }}>
        No comments yet
      </p>
    )}
  </div>
)}

      {/* Story Media End */}
      {story.mediaType === "video" ? (
        <video
          src={`http://192.168.43.245:5000${story.media}`}
          controls
          autoPlay
          style={{
            maxWidth: "90%",
            maxHeight: "70vh",
            objectFit: "contain",
          }}
        />
      ) : (
        <img
          src={`http://192.168.43.245:5000${story.media}`}
          alt="Story"
          style={{
            maxWidth: "90%",
            maxHeight: "70vh",
            objectFit: "contain",
          }}
        />
      )}
      {/* Mentioned Users */}
{story.mentions?.length > 0 && (
  <div
    style={{
      position: "absolute",
      top: "80px",
      left: "20px",
      background: "rgba(255,255,255,0.9)",
      padding: "10px",
      borderRadius: "10px",
      zIndex: 30,
    }}
  >
    {story.mentions.map((user) => (
      <div
        key={user._id}
        style={{
          color: "blue",
          fontWeight: "600",
          cursor: "pointer",
        }}
        onClick={() =>
          navigate(`/profile/${user._id}`)
        }
      >
        @{user.name}
      </div>
    ))}
  </div>
)}

      {/* Viewers List */}
      {showViewers && isMyStory && (
        <div
          style={{
            position: "absolute",
            top: "80px",
            right: "20px",
            width: "280px",
            maxHeight: "400px",
            overflowY: "auto",
            background: "white",
            color: "black",
            borderRadius: "15px",
            padding: "15px",
            zIndex: 50,
            boxShadow: "0 5px 25px rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h3 style={{ margin: 0 }}>
              👁️ Story Viewers
            </h3>

            <button
              onClick={() => setShowViewers(false)}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          {story.viewers?.length > 0 ? (
            story.viewers.map((viewer) => (
              <div
                key={viewer._id || viewer}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 5px",
                  borderBottom: "1px solid #eee",
                }}
              >
                <img
                  src={
                    viewer.profilePic
                      ? `http://192.168.43.245:5000${viewer.profilePic}`
                      : "https://randomuser.me/api/portraits/men/1.jpg"
                  }
                  alt={viewer.name || "User"}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />

                <strong>
                  {viewer.name || "User"}
                </strong>
              </div>
            ))
          ) : (
            <p
              style={{
                textAlign: "center",
                color: "#777",
              }}
            >
              No viewers yet
            </p>
          )}
        </div>
      )}

      {/* Reactions */}
      {!isMyStory && (
        <div
          style={{
            position: "absolute",
            bottom: "180px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(0,0,0,0.7)",
            padding: "8px 12px",
            borderRadius: "30px",
            zIndex: 20,
          }}
        >
          {["❤️", "😂", "😮", "😢", "🔥"].map(
            (reaction) => (
              <button
                key={reaction}
                onClick={() => handleReaction(reaction)}
                style={{
                  border:
                    selectedReaction === reaction
                      ? "2px solid white"
                      : "none",
                  background:
                    selectedReaction === reaction
                      ? "rgba(255,255,255,0.3)"
                      : "transparent",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  fontSize: "22px",
                  cursor: "pointer",
                }}
              >
                {reaction}
              </button>
            )
          )}
        </div>
      )}

     {/* Comments List */}
{!isMyStory && (
  <div
    style={{
      position: "absolute",
      bottom: "220px",
      left: "5%",
      width: "90%",
      maxHeight: "80px",
      overflowY: "auto",
      background: "rgba(0,0,0,0.65)",
      color: "white",
      padding: "6px 10px",
      borderRadius: "10px",
      zIndex: 8,
    }}
  >
    {storyComments.length > 0 ? (
      storyComments.map((comment) => (
        <div
          key={comment._id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "5px",
            borderBottom:
              "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <img
            src={
              comment.user?.profilePic
                ? `http://192.168.43.245:5000${comment.user.profilePic}`
                : "https://randomuser.me/api/portraits/men/1.jpg"
            }
            alt={comment.user?.name || "User"}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />

          <div>
            <strong>
              {comment.user?.name || "User"}
            </strong>

            <div
              style={{
                fontSize: "14px",
                marginTop: "2px",
              }}
            >
              {comment.text}
            </div>
          </div>
        </div>
      ))
    ) : (
      <p
        style={{
          margin: 0,
          textAlign: "center",
          color: "#ccc",
        }}
      >
        No comments yet
      </p>
    )}
  </div>
)}

      {/* Bottom Actions */}
      
        <div
  style={{
    position: "absolute",
    bottom: "70px",
    width: "92%",
    maxWidth: "600px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    zIndex: 15,
  }}
>
  {/* Comment Row */}
  <div
    style={{
      display: "flex",
      width: "100%",
      gap: "8px",
    }}
  >
    <input
      type="text"
      value={commentText}
      onChange={(e) =>
        setCommentText(e.target.value)
      }
      placeholder="Comment..."
      style={{
        flex: 1,
        minWidth: 0,
        padding: "10px 12px",
        borderRadius: "25px",
        border: "none",
        outline: "none",
      }}
    />

    <button
      onClick={handleStoryComment}
      style={{
        background: "#1877f2",
        color: "white",
        border: "none",
        borderRadius: "20px",
        padding: "10px 15px",
        cursor: "pointer",
        fontWeight: "600",
        flexShrink: 0,
      }}
    >
      Comment
    </button>
  </div>

  {/* Reply + Like Row - Only Other User Story */}
  {!isMyStory && (
    <div
      style={{
        display: "flex",
        width: "100%",
        gap: "8px",
      }}
    >
      <input
        type="text"
        value={replyText}
        onChange={(e) =>
          setReplyText(e.target.value)
        }
        placeholder="Reply..."
        style={{
          flex: 1,
          minWidth: 0,
          padding: "10px 12px",
          borderRadius: "25px",
          border: "none",
          outline: "none",
        }}
      />

      <button
        onClick={handleStoryReply}
        style={{
          background: "#1877f2",
          color: "white",
          border: "none",
          borderRadius: "20px",
          padding: "10px 15px",
          cursor: "pointer",
          fontWeight: "600",
          flexShrink: 0,
        }}
      >
        Send
      </button>

      <button
        onClick={handleStoryLike}
        style={{
          background: liked
            ? "red"
            : "white",
          color: liked
            ? "white"
            : "black",
          border: "none",
          borderRadius: "50%",
          width: "45px",
          height: "45px",
          fontSize: "22px",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        ❤️
      </button>
    </div>
  )}
</div>

      {/* My Story Reaction & Comment Summary */}
      {isMyStory && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            right: "20px",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "10px",
            borderRadius: "12px",
            zIndex: 15,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              fontSize: "14px",
            }}
          >
            <span>
              ❤️ Likes: {story.likes?.length || 0}
            </span>

            <span>
              💬 Comments: {story.comments?.length || 0}
            </span>

            <span>
              ⭐ Reactions: {story.reactions?.length || 0}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default StoryViewer;