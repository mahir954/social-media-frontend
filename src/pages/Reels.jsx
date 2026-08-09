import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/reels.css";
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

function Reels() {
const navigate = useNavigate();

  const [video, setVideo] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedMusic, setSelectedMusic] = useState(null);
const [musicList, setMusicList] = useState([]);
const [showMusicLibrary, setShowMusicLibrary] = useState(false);
const [musicSearch, setMusicSearch] = useState("");
const [playingMusicId, setPlayingMusicId] = useState(null);
  const [reels, setReels] = useState([]);
  const [selectedReelLikes, setSelectedReelLikes] = useState([]);
const [showLikes, setShowLikes] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [followingStatus, setFollowingStatus] = useState({});
  const [editingReelId, setEditingReelId] = useState(null);
const [editingCaption, setEditingCaption] = useState("");

const [editingCommentId, setEditingCommentId] = useState(null);
const [editingCommentText, setEditingCommentText] = useState("");
const [activeReelId, setActiveReelId] = useState(null);
  const fetchReels = async () => {
  try {
    const response = await fetch(
      "https://social-media-backend-9fag.onrender.com/api/reels",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      setReels(data.reels);
      const currentUserId = localStorage.getItem("userId");
const token = localStorage.getItem("token");

const profileResponse = await fetch(
  "https://social-media-backend-9fag.onrender.com/api/auth/profile",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

const profileData = await profileResponse.json();

if (profileResponse.ok) {
  const followingIds =
    profileData.user.following?.map((user) =>
      (user._id || user).toString()
    ) || [];

  const status = {};

  data.reels.forEach((reel) => {
    if (
      reel.user?._id &&
      reel.user._id !== currentUserId
    ) {
      status[reel.user._id] =
        followingIds.includes(
          reel.user._id.toString()
        );
    }
  });

  setFollowingStatus(status);
}


    }
  } catch (error) {
    console.error("Fetch Reels Error:", error);
  }
};
const fetchMusic = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "https://social-media-backend-9fag.onrender.com/api/music",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      setMusicList(data.music || []);
    } else {
      console.error(data.message || "Failed to fetch music");
    }
  } catch (error) {
    console.error("Fetch Music Error:", error);
  }
};
useEffect(() => {
    fetchReels();
    fetchMusic();
}, []);
useEffect(() => {
  const interval = setInterval(() => {
    setReels((prev) => [...prev]);
  }, 60000);

  return () => clearInterval(interval);
}, []);
const handleFollowToggle = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const currentUserId = localStorage.getItem("userId");

    if (!token || !currentUserId) {
      alert("Please login first");
      return;
    }

    if (userId === currentUserId) {
      return;
    }

    const isFollowing = followingStatus[userId];

    const endpoint = isFollowing
      ? `https://social-media-backend-9fag.onrender.com/api/users/${userId}/unfollow`
      : `https://social-media-backend-9fag.onrender.com/api/users/${userId}/follow`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Something went wrong");
      return;
    }

    setFollowingStatus((prev) => ({
      ...prev,
      [userId]: !isFollowing,
    }));
  } catch (error) {
    console.error("Follow/Unfollow Error:", error);
  }
};
const handleLikeReel = async (reelId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/reels/${reelId}/like`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to like reel");
      return;
    }

    setReels((prev) =>
      prev.map((reel) =>
        reel._id === reelId
          ? { ...reel, likes: data.likes }
          : reel
      )
    );
  } catch (error) {
    console.error("Like Reel Error:", error);
  }
};
const handleSaveReel = async (reelId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/reels/${reelId}/save`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to save reel");
      return;
    }

    setReels((prev) =>
      prev.map((reel) =>
        reel._id === reelId
          ? {
              ...reel,
              savedBy: data.savedBy,
            }
          : reel
      )
    );
  } catch (error) {
    console.error("Save Reel Error:", error);
  }
};
const fetchReelLikes = async (reelId) => {
  try {
    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/reels/${reelId}/likes`
    );

    const data = await response.json();

    if (response.ok) {
      setSelectedReelLikes(data.likes);
      setShowLikes(true);
    }
  } catch (error) {
    console.error("Fetch Reel Likes Error:", error);
  }
};

const handleViewReel = async (reelId) => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    return;
  }

  const viewedReels =
    JSON.parse(
      localStorage.getItem(`viewedReels_${userId}`)
    ) || [];

  if (viewedReels.includes(reelId)) {
    return;
  }

  try {
    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/reels/${reelId}/view`,
      {
        method: "PUT",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return;
    }

    localStorage.setItem(
      `viewedReels_${userId}`,
      JSON.stringify([
        ...viewedReels,
        reelId,
      ])
    );

    setReels((prev) =>
      prev.map((reel) =>
        reel._id === reelId
          ? {
              ...reel,
              views: data.views,
            }
          : reel
      )
    );
  } catch (error) {
    console.error("View Reel Error:", error);
  }
};

const handleAddComment = async (reelId) => {
  try {
const token = localStorage.getItem("token");

    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/reels/${reelId}/comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: commentText[reelId] || "",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to add comment");
      return;
    }

    setReels((prev) =>
      prev.map((reel) =>
        reel._id === reelId
          ? data.reel
          : reel
      )
    );

    setCommentText((prev) => ({
      ...prev,
      [reelId]: "",
    }));
  } catch (error) {
    console.error("Add Reel Comment Error:", error);
  }
};
const handleDeleteComment = async (reelId, commentId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/reels/${reelId}/comment/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to delete comment");
      return;
    }

    setReels((prev) =>
      prev.map((reel) =>
        reel._id === reelId
          ? {
              ...reel,
              comments: reel.comments.filter(
                (comment) => comment._id !== commentId
              ),
            }
          : reel
      )
    );
  } catch (error) {
    console.error("Delete Reel Comment Error:", error);
  }
};
const handleDeleteReel = async (reelId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/reels/${reelId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to delete reel");
      return;
    }

    alert("Reel deleted successfully");

    setReels((prev) =>
      prev.filter((reel) => reel._id !== reelId)
    );
  } catch (error) {
    console.error("Delete Reel Error:", error);
    alert("Server error");
  }
};
const handleEditReel = async (reelId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/reels/${reelId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          caption: editingCaption,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to edit reel");
      return;
    }

    setReels((prev) =>
      prev.map((reel) =>
        reel._id === reelId ? data.reel : reel
      )
    );

    setEditingReelId(null);
    setEditingCaption("");

    alert("Reel updated successfully");
  } catch (error) {
    console.error("Edit Reel Error:", error);
    alert("Server error");
  }
};

const handleEditComment = async (reelId, commentId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/reels/${reelId}/comment/${commentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: editingCommentText,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to edit comment");
      return;
    }

    setReels((prev) =>
      prev.map((reel) =>
        reel._id === reelId ? data.reel : reel
      )
    );

    setEditingCommentId(null);
    setEditingCommentText("");

    alert("Comment updated successfully");
  } catch (error) {
    console.error("Edit Reel Comment Error:", error);
    alert("Server error");
  }
};

  const handleCreateReel = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("video", video);
      formData.append("caption", caption);
      if (selectedMusic) {
  formData.append("musicId", selectedMusic._id);
}

      const response = await fetch(
        "https://social-media-backend-9fag.onrender.com/api/reels",
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
        alert(data.message || "Failed to create reel");
        return;
      }

      alert("Reel created successfully");

      setVideo(null);
      setCaption("");
      setSelectedMusic(null);
      fetchReels();
    } catch (error) {
      console.error("Create Reel Error:", error);
      alert("Server error");
    }
  };

  return (
    <div 
    className="reels-container">
      <h1>Create Reel</h1>

      <form className="reel-form"
      onSubmit={handleCreateReel}>
        <input
          type="file"
          accept="video/*"
          
          onChange={(e) => setVideo(e.target.files[0])}
        />
        {video && (
            <video
            src={URL.createObjectURL(video)}
            controls
            width="100%"
            style={{
                maxHeight: "400px",
                borderRadius: "10px",
                marginTop: "10px",
            }}
            />
        )}

        <br />
        <br />

        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button
  type="button"
  onClick={() => setShowMusicLibrary(!showMusicLibrary)}
  style={{
    marginTop: "15px",
    padding: "10px 18px",
    background: "#1877f2",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  }}
>
  🎵 {selectedMusic ? "Change Music" : "Add Music"}
</button>

 {selectedMusic && (
  <div
    style={{
      marginTop: "10px",
      padding: "8px 10px",
      background: "#f5f5f5",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      maxWidth: "350px",
    }}
  >
    <div>
      🎵 <strong>{selectedMusic.title}</strong>

      {selectedMusic.artist && (
        <span
          style={{
            marginLeft: "5px",
            color: "#666",
            fontSize: "13px",
          }}
        >
          • {selectedMusic.artist}
        </span>
      )}
    </div>

    <button
      type="button"
      onClick={() => setSelectedMusic(null)}
      style={{
        marginLeft: "10px",
        padding: "4px 8px",
        background: "#ff416c",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      ✕
    </button>
  </div>
)}

{showMusicLibrary && (
  <div
    style={{
      marginTop: "15px",
      padding: "15px",
      border: "1px solid #ddd",
      borderRadius: "10px",
      background: "white",
      maxHeight: "300px",
      overflowY: "auto",
    }}
  >
    <h3>Select Music</h3>
    <div
  style={{
    position: "relative",
    width: "90%",
    margin: "0 auto 10px auto",
  }}
>
  <input
    type="text"
    placeholder="Search music..."
    value={musicSearch}
    onChange={(e) => setMusicSearch(e.target.value)}
    style={{
      width: "100%",
      padding: "8px 40px 8px 10px",
      border: "1px solid #ddd",
      borderRadius: "6px",
      boxSizing: "border-box",
      outline: "none",
    }}
  />

  <span
    style={{
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: "16px",
    }}
  >
    🔍
  </span>
</div>

    {musicList.length === 0 ? (
      <p>No music available.</p>
    ) : (
      musicList
      .filter((music) => music.title ?.toLowerCase()
    .includes(musicSearch.toLowerCase())
    )
      .map((music) => (
        <div
          key={music._id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px",
            borderBottom: "1px solid #eee",
          }}
        >
          {music.coverImage && (
  <img
    src={`https://social-media-backend-9fag.onrender.com${music.coverImage}`}
    alt={music.title}
    style={{
      width: "50px",
      height: "50px",
      borderRadius: "8px",
      objectFit: "cover",
      marginRight: "10px",
    }}
  />
)}
         <div style={{ flex: 1 }}>
  <strong>{music.title}</strong>

  {music.artist && (
    <div style={{ fontSize: "12px", color: "#666" }}>
      {music.artist}
    </div>
  )}

  {music.audioUrl && (
    <audio
      controls
      src={`https://social-media-backend-9fag.onrender.com${music.audioUrl}`}
      onPlay={(e) => {
    document.querySelectorAll("audio").forEach((audio) => {
      if (audio !== e.target) {
        audio.pause();
      }
    });
  }}
      style={{
        width: "200px",
        height: "30px",
        marginTop: "5px",
      }}
    />
  )}
</div>

          <button
            type="button"
            onClick={() => {
              setSelectedMusic(music);
              setShowMusicLibrary(false);
            }}
            style={{
              padding: "6px 12px",
              background: "#1877f2",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Select
          </button>
        </div>
      ))
    )}
  </div>
)}

        <br />
        <br />

        <button type="submit">
          Create Reel
        </button>
      </form>
      <div className="reels-feed">
        <div style={{ marginBottom: "20px" }}>
  <button
    onClick={() => {
        setShowSaved(false);
        fetchReels();
    }}
    style={{
      marginRight: "10px",
      padding: "8px 15px",
      background: "#1877f2",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    }}
  >
    All Reels
  </button>

  <button
    onClick={() => {
        setShowSaved(true);
        fetchSavedReels();
    }}
    style={{
      padding: "8px 15px",
      background: "white",
      color: "#1877f2",
      border: "1px solid #1877f2",
      borderRadius: "6px",
      cursor: "pointer",
    }}
  >
    🔖 Saved Reels
  </button>
</div>
  <h2>{showSaved ? "Saved Reels" : "All Reels"}</h2>

  {reels.length === 0 ? (
   <p>
    {showSaved ? "No saved reels yet." : "No reels available."}
   </p>
  ) : (
    reels.map((reel) => (
      <div className="reel-card" key={reel._id}>
       <div
  onClick={() => {
    if (reel.user?._id) {
      navigate(`/profile/${reel.user._id}`);
    }
  }}
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    width: "fit-content",
  }}
>
  <img
    src={
      reel.user?.profilePic
        ? `https://social-media-backend-9fag.onrender.com${reel.user.profilePic}`
        : "https://randomuser.me/api/portraits/men/1.jpg"
    }
    alt={reel.user?.name || "User"}
    style={{
      width: "45px",
      height: "45px",
      borderRadius: "50%",
      objectFit: "cover",
    }}
  />

  <strong>{reel.user?.name}</strong>
  {reel.user?._id &&
  reel.user._id !== localStorage.getItem("userId") && (
    <button
      onClick={() =>
        handleFollowToggle(reel.user._id)
      }
      style={{
        marginLeft: "10px",
        padding: "5px 12px",
        borderRadius: "6px",
        border: followingStatus[reel.user._id]
          ? "1px solid #dbdbdb"
          : "none",
        backgroundColor: followingStatus[reel.user._id]
          ? "white"
          : "#0095f6",
        color: followingStatus[reel.user._id]
          ? "#262626"
          : "white",
        fontSize: "12px",
        fontWeight: "600",
        cursor: "pointer",
      }}
    >
      {followingStatus[reel.user._id]
        ? "Following"
        : "Follow"}
    </button>
  )}
</div> 
  
  <small
  style={{
    marginLeft: "10px",
    marginRight: "15px",
    color: "green",
    fontSize: "12px",
  }}
>
  {getTimeAgo(reel.createdAt)}
</small>

{reel.user?._id === localStorage.getItem("userId") && (
  <button
    onClick={() => handleDeleteReel(reel._id)}
    style={{
      marginTop: "10px",
      background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
      color: "white",
      border: "none",
      padding: "8px 15px",
      borderRadius: "6px",
      cursor: "pointer",
    }}
  >
    Delete
  </button>
)}

<video
  src={`https://social-media-backend-9fag.onrender.com/uploads/${reel.video}`}
  controls
  muted
  width="100%"
  onPlay={(e) => {
  handleViewReel(reel._id);

  document.querySelectorAll("video").forEach((video) => {
    if (video !== e.target) {
      video.pause();
    }
  });

  document.querySelectorAll("audio").forEach((audio) => {
    if (audio.id !== `music-${reel._id}`) {
      audio.pause();
    }
  });

  setActiveReelId(reel._id);

  const musicAudio = document.getElementById(
    `music-${reel._id}`
  );

  if (musicAudio) {
    musicAudio.currentTime = e.target.currentTime;
    musicAudio.play();
  }
}}
onPause={() => {
  const musicAudio = document.getElementById(
    `music-${reel._id}`
  );

  if (musicAudio) {
    musicAudio.pause();
  }
}}
onSeeked={(e) => {
  const musicAudio = document.getElementById(
    `music-${reel._id}`
  );

  if (musicAudio) {
    musicAudio.currentTime = e.target.currentTime;
  }
}}
onEnded={() => {
  const musicAudio = document.getElementById(
    `music-${reel._id}`
  );

  if (musicAudio) {
    musicAudio.pause();
    musicAudio.currentTime = 0;
  }

  setActiveReelId(null);
}}
  style={{
    maxHeight: "500px",
    borderRadius: "10px",
    marginTop: "10px",
  }}
/>
{reel.music && (
  <div
    style={{
      marginTop: "8px",
      padding: "6px 8px",
      borderRadius: "6px",
      background: "#f5f5f5",
      maxWidth: "300px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    }}
  >
    {reel.music.coverImage && (
      <img
        src={`https://social-media-backend-9fag.onrender.com${reel.music.coverImage}`}
        alt={reel.music.title}
        style={{
          width: "35px",
          height: "35px",
          borderRadius: "5px",
          objectFit: "cover",
        }}
      />
    )}

    <div>
      <strong style={{ fontSize: "13px" }}>
        🎵 {reel.music.title}
      </strong>

      {reel.music.artist && (
        <div
          style={{
            fontSize: "11px",
            color: "#666",
          }}
        >
          {reel.music.artist}
        </div>
      )}
    </div>
    <audio
  id={`music-${reel._id}`}
  src={`https://social-media-backend-9fag.onrender.com${reel.music.audioUrl}`}
  style={{
    display: "none",
  }}
/>
  </div>
)}

<button
  onClick={() => handleLikeReel(reel._id)}
  style={{
    marginTop: "10px",
    marginRight: "15px",
    background: reel.likes?.includes(
      localStorage.getItem("userId")
    )
      ? "#ff416c"
      : "white",
    color: reel.likes?.includes(
      localStorage.getItem("userId")
    )
      ? "white"
      : "#ff416c",
    border: "1px solid #ff416c",
    padding: "8px 15px",
    borderRadius: "6px",
    cursor: "pointer",
  }}
>
  ❤️ {reel.likes?.length || 0}
</button>

<button
  onClick={() => fetchReelLikes(reel._id)}
  style={{
    marginTop: "10px",
    marginRight: "15px",
    padding: "8px 15px",
    background: "white",
    color: "black",
    border: "1px solid black",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    display: "inline-block",
  }}
>
  {reel.likes?.length || 0} Likes
</button>

<span
  style={{
    marginTop: "10px",
    marginLeft: "12px",
    marginRight: "12px",
    display: "inline-block",
    background: "white",
    color: "#555",
    border: "1px solid #777",
    padding: "8px 15px",
    fontSize: "14px",
  }}
>
  👀 {reel.views || 0}
</span>

<button
  onClick={() => {
    navigator.clipboard.writeText(
      `${window.location.origin}/reels/${reel._id}`
    );

    alert("Reel link copied!");
  }}
  style={{
    marginTop: "10px",
    marginRight: "15px",
    background: "white",
    color: "#1877f2",
    border: "1px solid #1877f2",
    padding: "8px 15px",
    borderRadius: "6px",
    cursor: "pointer",
  }}
>
  🔗 Share
</button>

<button
  onClick={() => handleSaveReel(reel._id)}
  style={{
    marginTop: "10px",
    marginRight: "15px",
    background: reel.savedBy?.some(
      (id) =>
        id.toString() ===
        localStorage.getItem("userId")
    )
      ? "#1877f2"
      : "white",
    color: reel.savedBy?.some(
      (id) =>
        id.toString() ===
        localStorage.getItem("userId")
    )
      ? "white"
      : "#1877f2",
    border: "1px solid #1877f2",
    padding: "8px 15px",
    borderRadius: "6px",
    cursor: "pointer",
  }}
>
  🔖{" "}
  {reel.savedBy?.some(
    (id) =>
      id.toString() ===
      localStorage.getItem("userId")
  )
    ? "Saved"
    : "Save"}
</button>

<div style={{ marginTop: "15px" }}>
  <input
    type="text"
    placeholder="Write a comment..."
    value={commentText[reel._id] || ""}
    onChange={(e) =>
      setCommentText((prev) => ({
        ...prev,
        [reel._id]: e.target.value,
      }))
    }
    style={{
      padding: "8px",
      width: "70%",
      borderRadius: "6px",
      border: "1px solid #ddd",
    }}
  />

  <button
    onClick={() => handleAddComment(reel._id)}
    style={{
      marginLeft: "8px",
      padding: "8px 12px",
      background: "#1877f2",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    }}
  >
    Comment
  </button>
</div>

<div style={{ marginTop: "15px" }}>
  {reel.comments?.map((comment) => (
    <div
      key={comment._id}
      style={{
        padding: "8px 0",
        borderBottom: "1px solid #eee",
      }}
    >
      {/* COMMENT USER PROFILE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src={
            comment.user?.profilePic
              ? `https://social-media-backend-9fag.onrender.com${comment.user.profilePic}`
              : "https://randomuser.me/api/portraits/men/1.jpg"
          }
          alt={comment.user?.name || "User"}
          onClick={() => {
            if (comment.user?._id) {
              navigate(`/profile/${comment.user._id}`);
            }
          }}
          style={{
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            objectFit: "cover",
            marginRight: "10px",
            cursor: "pointer",
          }}
        />

        <strong
          onClick={() => {
            if (comment.user?._id) {
              navigate(`/profile/${comment.user._id}`);
            }
          }}
          style={{
            cursor: "pointer",
          }}
        >
          {comment.user?.name || "User"}
        </strong>
      </div>

      {/* EDIT COMMENT */}
      {editingCommentId === comment._id ? (
        <div style={{ marginTop: "8px" }}>
          <input
            type="text"
            value={editingCommentText}
            onChange={(e) =>
              setEditingCommentText(e.target.value)
            }
            style={{
              padding: "6px",
              width: "60%",
              borderRadius: "6px",
              border: "1px solid #ddd",
            }}
          />

          <button
            onClick={() =>
              handleEditComment(
                reel._id,
                comment._id
              )
            }
            style={{
              marginLeft: "8px",
              padding: "6px 10px",
              background: "#1877f2",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Save
          </button>

          <button
            onClick={() => {
              setEditingCommentId(null);
              setEditingCommentText("");
            }}
            style={{
              marginLeft: "5px",
              padding: "6px 10px",
              background: "#ddd",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          {/* COMMENT TEXT */}
          <p>{comment.text}</p>

          {/* EDIT + DELETE */}
          {comment.user?._id ===
            localStorage.getItem("userId") && (
            <div>
              <button
                onClick={() => {
                  setEditingCommentId(comment._id);
                  setEditingCommentText(comment.text);
                }}
                style={{
                  background: "transparent",
                  color: "#1877f2",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Edit
              </button>

              <button
                onClick={() =>
                  handleDeleteComment(
                    reel._id,
                    comment._id
                  )
                }
                style={{
                  marginLeft: "10px",
                  background: "transparent",
                  color: "#ff416c",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Delete
              </button>
            </div>
          )}
        </>
      )}

      {/* COMMENT TIME */}
      <small
        style={{
          marginLeft: "8px",
          color: "#888",
          fontSize: "12px",
        }}
      >
        {getTimeAgo(comment.createdAt)}
      </small>
    </div>
  ))}
</div>

{/* REEL CAPTION */}
{reel.caption && (
  <div style={{ marginTop: "10px" }}>
    {editingReelId === reel._id ? (
      <div>
        <textarea
          value={editingCaption}
          onChange={(e) =>
            setEditingCaption(e.target.value)
          }
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ddd",
          }}
        />

        <button
          onClick={() =>
            handleEditReel(reel._id)
          }
          style={{
            marginTop: "8px",
            marginRight: "8px",
            padding: "6px 12px",
            background: "#1877f2",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Save
        </button>

        <button
          onClick={() => {
            setEditingReelId(null);
            setEditingCaption("");
          }}
          style={{
            padding: "6px 12px",
            background: "#ddd",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    ) : (
      <div>
        <p>{reel.caption}</p>

        {/* EDIT REEL CAPTION */}
        {reel.user?._id ===
          localStorage.getItem("userId") && (
          <button
            onClick={() => {
              setEditingReelId(reel._id);
              setEditingCaption(reel.caption);
            }}
            style={{
              background: "transparent",
              color: "#1877f2",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Edit
          </button>
        )}
      </div>
    )}
  </div>
)}
</div>
))
)}
</div>

{/* LIKES MODAL */}
{showLikes && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <div
      style={{
        background: "white",
        width: "350px",
        maxHeight: "500px",
        overflowY: "auto",
        borderRadius: "12px",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Liked By</h2>

        <button
          onClick={() => setShowLikes(false)}
          style={{
            border: "none",
            background: "none",
            fontSize: "22px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      {selectedReelLikes.length === 0 ? (
        <p>No likes yet.</p>
      ) : (
        selectedReelLikes.map((user) => (
          <div
            key={user._id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <img
              src={
                user.profilePic
                  ? `https://social-media-backend-9fag.onrender.com${user.profilePic}`
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

            <strong>{user.name}</strong>
          </div>
        ))
      )}
    </div>
  
  </div>
)}
</div>
  );
}
export default Reels;