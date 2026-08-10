import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/profile.css";
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
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  const months = Math.floor(days / 30);

  if (months < 12) {
    return `${months} months ago`;
  }

  const years = Math.floor(months / 12);

  return `${years} years ago`;
};

function Profile() {
  const { userId: profileUserId } = useParams();
  const currentUserId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [likedReels, setLikedReels] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
const [editingCommentText, setEditingCommentText] = useState("");
  const [activeTab, setActiveTab] = useState("posts");
  const [editingReelId, setEditingReelId] = useState(null);
const [editingCaption, setEditingCaption] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [bio, setBio] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [followRequests, setFollowRequests] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const handleShareProfile = async () => {
  try {
    const profileUrl = `${window.location.origin}/profile/${user._id}`;

    if (navigator.share) {
      await navigator.share({
        title: `${user.name}'s Profile`,
        text: `Check out \`${user.name}'s profile`,
        url: profileUrl,
      });
    } else {
      await navigator.clipboard.writeText(profileUrl);
      alert("Profile link copied successfully");
    }
  } catch (error) {
    console.error("Share Profile Error:", error);
  }
};
  const handleUpdateProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("bio", bio);
    if (profilePic instanceof File) {
      formData.append("profilePic", profilePic);
    }

    const response = await fetch(
      "https://social-media-backend-9fag.onrender.com/api/auth/profile",
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to update profile");
      return;
    }

    setUser(data.user);

    setIsPrivate(Boolean(data.user.isPrivate));
    setRequestSent(
  data.user.followRequests?.some(
    (id) =>
      id.toString() ===
      localStorage.getItem("userId")
  )
);
    setName(data.user.name);
    setEmail(data.user.email);
    setProfilePic(data.user.profilePic || "");
    setBio(data.user.bio || "");
    setIsEditing(false);

    alert("Profile updated successfully");
  } catch (error) {
    console.error("Update Profile Error:", error);
    alert("Server error");
  }
};
  const handleDeleteAccount = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to permanently delete your account? All your posts, reels, stories, notes, messages and other data will be deleted."
  );

  if (!confirmDelete) return;

  const finalConfirm = window.confirm(
    "This action cannot be undone. Do you really want to delete your account?"
  );

  if (!finalConfirm) return;

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const response = await fetch(
      "https://social-media-backend-9fag.onrender.com/api/users/account",
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to delete account");
      return;
    }

    // Remove login data
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    alert("Your account has been deleted successfully.");

    // Go to login page
    navigate("/login");
  } catch (error) {
    console.error("Delete Account Error:", error);
    alert("Server error. Please try again.");
  }
};
  const handleFollowToggle = async () => {
    try {
      const token = localStorage.getItem("token");

      const endpoint = isFollowing
        ? `https://social-media-backend-9fag.onrender.com/api/users/${profileUserId}/unfollow`
        : `https://social-media-backend-9fag.onrender.com/api/users/${profileUserId}/follow`;

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

      setIsFollowing(!isFollowing);

      setUser((prev) => ({
        ...prev,
        followers: isFollowing
          ? prev.followers.filter(
              (follower) => follower._id !== currentUserId
            )
          : [...prev.followers, { _id: currentUserId }],
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

    // Backend se jo likes aaye hain unko update karo
    setReels((prev) =>
      prev.map((reel) =>
        reel._id === reelId
          ? {
              ...reel,
              likes: data.likes || [],
            }
          : reel
      )
    );

    const userId = localStorage.getItem("userId");

    // Liked state update
    const isLiked = (data.likes || []).some(
      (like) =>
        like === userId ||
        like?._id === userId
    );

    if (isLiked) {
      setLikedReels((prev) =>
        prev.includes(reelId)
          ? prev
          : [...prev, reelId]
      );
    } else {
      setLikedReels((prev) =>
        prev.filter((id) => id !== reelId)
      );
    }
  } catch (error) {
    console.error("Like Reel Error:", error);
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
const handleEditReelComment = async (reelId, commentId) => {
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
  } catch (error) {
    console.error("Edit Reel Comment Error:", error);
    alert("Server error");
  }
};
const handleDeleteReelComment = async (reelId, commentId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this comment?"
  );

  if (!confirmDelete) return;

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
        reel._id === reelId ? data.reel : reel
      )
    );
  } catch (error) {
    console.error("Delete Reel Comment Error:", error);
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
      alert(data.message || "Failed to update reel");
      return;
    }

    setReels((prev) =>
      prev.map((reel) =>
        reel._id === reelId
          ? {
              ...reel,
              caption: data.reel.caption,
            }
          : reel
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Please login first");
          return;
        }

        const profileUrl = profileUserId
          ? `https://social-media-backend-9fag.onrender.com/api/users/${profileUserId}`
          : "https://social-media-backend-9fag.onrender.com/api/auth/profile";

        const profileResponse = await fetch(profileUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profileData = await profileResponse.json();

        if (!profileResponse.ok) {
          alert(profileData.message || "Failed to fetch profile");
          return;
        }

        setUser(profileData.user);
        setName(profileData.user.name);
        setEmail(profileData.user.email);
        setProfilePic(profileData.user.profilePic || "");
        setBio(profileData.user.bio || "");
        setIsPrivate(Boolean(profileData.user.isPrivate));

        if (profileUserId && currentUserId) {
        const isUserFollowing =
            profileData.user.followers?.some(
              (follower) => follower._id === currentUserId
            );

          setIsFollowing(isUserFollowing);
        }

        const postsResponse = await fetch(
          "https://social-media-backend-9fag.onrender.com/api/posts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        );

        const postsData = await postsResponse.json();

        if (!postsResponse.ok) {
          alert(postsData.message || "Failed to fetch posts");
          return;
        }

        const myPosts = postsData.posts.filter(
          (post) => post.user?._id === profileData.user._id
        );

        setPosts(myPosts);
        const reelsResponse = await fetch(
  "https://social-media-backend-9fag.onrender.com/api/reels",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

const reelsData = await reelsResponse.json();

if (reelsResponse.ok) {
  const myReels = reelsData.reels.filter(
    (reel) =>
      reel.user?._id === profileData.user._id
  );

  setReels(myReels);
  
}
const highlightsResponse = await fetch(
  `https://social-media-backend-9fag.onrender.com/api/stories/highlights/${profileData.user._id}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

const highlightsData = await highlightsResponse.json();

if (highlightsResponse.ok) {
  setHighlights(highlightsData.highlights || []);
}
      } catch (error) {
        console.error("Profile Error:", error);
      }
    };

    fetchProfile();
  }, [profileUserId]);
  useEffect(() => {
  const fetchFollowRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://social-media-backend-9fag.onrender.com/api/users/follow-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setFollowRequests(data.requests || []);
      }
    } catch (error) {
      console.error(
        "Follow Requests Error:",
        error
      );
    }
  };

  fetchFollowRequests();
}, []);

  if (!user) {
    return <h2>Loading Profile...</h2>;
  }

  return (
    <div className="profile-container">
      <h1>
        {profileUserId
          ? `${user.name}'s profile`
          : "My Profile"}
      </h1>

      {profileUserId && profileUserId !== currentUserId && (
        <button
  onClick={async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://social-media-backend-9fag.onrender.com/api/users/${user._id}/follow`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      if (data.requestSent) {
        setRequestSent(true);
        alert("Follow request sent successfully");
      } else {
        setIsFollowing(true);
        alert("Following successfully");
      }
    } catch (error) {
      console.error("Follow Error:", error);
      alert("Server error");
    }
  }}
>
  Follow
</button>
      )}
      {profileUserId && profileUserId !== currentUserId && (
  <button
    onClick={() => navigate(`/chat?userId=${user._id}`)}
    style={{
      marginTop: "10px",
      marginLeft: "10px",
      padding: "10px 30px",
      borderRadius: "8px",
      border: "1px solid #dbdbdb",
      backgroundColor: "white",
      color: "#262626",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      minWidth: "120px",
    }}
  >
    Message
  </button>
)}

      <div className="profile-stats">
        <div>
          <h3>{posts.length}</h3>
          <p>Posts</p>
        </div>
        <div>
          <h3>{reels.length}</h3>
          <p>Reels</p>
        </div>

        <div
          onClick={() => {
            setShowFollowers(!showFollowers);
            setShowFollowing(false);
          }}
          style={{ cursor: "pointer" }}
        >
          <h3>{user.followers?.length || 0}</h3>
          <p>Followers</p>
        </div>

        <div
          onClick={() => {
            setShowFollowing(!showFollowing);
            setShowFollowers(false);
          }}
          style={{ cursor: "pointer" }}
        >
          <h3>{user.following?.length || 0}</h3>
          <p>Following</p>
        </div>
      </div>
{followRequests.length > 0 && (
  <div
    style={{
      marginTop: "20px",
      padding: "15px",
      background: "#f5f5f5",
      borderRadius: "12px",
    }}
  >
    <h3>Follow Requests</h3>

    {followRequests.map((request) => (
      <div
        key={request._id}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        <img
          src={
            request.profilePic
              ? `https://social-media-backend-9fag.onrender.com${request.profilePic}`
              : "https://randomuser.me/api/portraits/men/1.jpg"
          }
          alt={request.name}
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />

        <strong style={{ flex: 1 }}>
          {request.name}
        </strong>

        <button
          onClick={async () => {
            try {
              const token =
                localStorage.getItem("token");

              const response = await fetch(
                `https://social-media-backend-9fag.onrender.com/api/users/follow-requests/${request._id}/accept`,
                {
                  method: "PUT",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              const data =
                await response.json();

              if (!response.ok) {
                alert(data.message);
                return;
              }

              setFollowRequests((prev) =>
                prev.filter(
                  (item) =>
                    item._id !== request._id
                )
              );
              setUser((prev) => ({
                ...prev,
                followers: [
                  ...(prev.followers || []),
                  request._id,
                ],
              }));

              alert(
                "Follow request accepted"
              );
            } catch (error) {
              console.error(error);
              alert("Server error");
            }
          }}
          style={{
            background: "#1877f2",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Accept
        </button>

        <button
          onClick={async () => {
            try {
              const token =
                localStorage.getItem("token");

              const response = await fetch(
                `https://social-media-backend-9fag.onrender.com/api/users/follow-requests/${request._id}/reject`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              const data =
                await response.json();

              if (!response.ok) {
                alert(data.message);
                return;
              }

              setFollowRequests((prev) =>
                prev.filter(
                  (item) =>
                    item._id !== request._id
                )
              );

              alert(
                "Follow request rejected"
              );
            } catch (error) {
              console.error(error);
              alert("Server error");
            }
          }}
          style={{
            background: "#ddd",
            color: "black",
            border: "none",
            padding: "8px 12px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Reject
        </button>
      </div>
    ))}
  </div>
)}
      {showFollowers && (
        <div className="follow-list">
          <h2>Followers</h2>

          {user.followers?.length === 0 ? (
            <p>No followers yet.</p>
          ) : (
            user.followers.map((follower) => (
              <div
                key={follower._id}
                className="follow-user"
                onClick={() => navigate(`/profile/${follower._id}`)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={
                    follower.profilePic ? `https://social-media-backend-9fag.onrender.com${follower.profilePic}`
                    :
                    "https://randomuser.me/api/portraits/men/1.jpg"
                  }
                  alt={follower.name}
                />

                <strong>{follower.name}</strong>
              </div>
            ))
          )}
        </div>
      )}

      {showFollowing && (
        <div className="follow-list">
          <h2>Following</h2>

          {user.following?.length === 0 ? (
            <p>You are not following anyone.</p>
          ) : (
            user.following.map((followingUser) => (
              <div
                key={followingUser._id}
                className="follow-user"
                onClick={() => navigate(`/profile/${followingUser._id}`)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={
                    followingUser.profilePic ? `https://social-media-backend-9fag.onrender.com${followingUser.profilePic}`
                    :
                    "https://randomuser.me/api/portraits/men/1.jpg"
                  }
                  alt={followingUser.name}
                />

                <strong>{followingUser.name}</strong>
              </div>
            ))
          )}
        </div>
      )}

      <div className="profile-info">
        <h2>Profile Information</h2>

        {user.profilePic && (
          <img
            src={user.profilePic ? 
              `https://social-media-backend-9fag.onrender.com${user.profilePic}`
      : "https://randomuser.me/api/portraits/men/1.jpg"
  }
            alt="Profile"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "15px",
            }}
          />
        )}

        <p>Name: {user.name}</p>
        {user.bio && <p>Bio: {user.bio}</p>}
        <p>Email: {user.email}</p>

        {isEditing ? (
          <div>
            <h3>Edit Profile</h3>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your name"
            />

            <br />
            <br />

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
            />
            <br />
            <br />
            <textarea
  value={bio}
  onChange={(e) => setBio(e.target.value)}
  placeholder="Write your bio..."
  maxLength={200}
  rows={3}
  style={{
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    resize: "none",
  }}
/>

            <br />
            <br />


            <input
              type="file"
              accept="image/*"
              onChange={(e) =>{
                setProfilePic(e.target.files[0]);
              }}
              placeholder="Enter profile picture URL"
            />

            <br />
            <br />

            <button onClick={handleUpdateProfile}>
              Save Changes
            </button>

            <button
              onClick={() =>
                setIsEditing(false)
              }
            >
              Cancel
            </button>
          </div>
        ) : (
          (profileUserId === currentUserId ||
            !profileUserId) && (
            <button
              onClick={() =>
                setIsEditing(true)
              }
              style={{
                 flex: 1,
                 marginRight: "10px",
      padding: "10px 20px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      background: "#fff",
      color: "#111",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
    }}
            >
              Edit Profile
            </button>   
          )
        )}
        {!profileUserId && (
  <button
    onClick={handleDeleteAccount}
    style={{
      marginTop: "20px",
      padding: "10px 20px",
      borderRadius: "8px",
      border: "none",
      background: "#dc3545",
      color: "white",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
    }}
  >
    Delete Account
  </button>
)}
        <button onClick={handleShareProfile}
         style={{
      flex: 1,
      padding: "10px 20px",
      border: "none",
      borderRadius: "8px",
      background: "black",
      color: "#fff",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
    }}
        >
          Share Profile
        </button>
        {profileUserId && profileUserId !== currentUserId && (
  <button
    onClick={async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `https://social-media-backend-9fag.onrender.com/api/users/${
            isBlocked ? "unblock" : "block"
          }/${user._id}`,
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
              "Something went wrong"
          );
          return;
        }

        setIsBlocked(!isBlocked);

        alert(
          isBlocked
            ? "User unblocked successfully"
            : "User blocked successfully"
        );
      } catch (error) {
        console.error(
          "Block/Unblock Error:",
          error
        );

        alert("Server error");
      }
    }}
    style={{
      marginTop: "10px",
      marginLeft: "10px",
      padding: "10px 30px",
      borderRadius: "8px",
      border: "none",
      background: isBlocked
        ? "#1877f2"
        : "#ff416c",
      color: "white",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      minWidth: "120px",
    }}
  >
    {isBlocked ? "Unblock" : "Block"}
  </button>
)}
        <button
  onClick={async () => {
    try {
      const token = localStorage.getItem("token");

      const newPrivacy = !isPrivate;

      const response = await fetch(
        "https://social-media-backend-9fag.onrender.com/api/users/privacy",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isPrivate: newPrivacy,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to update account privacy"
        );
        return;
      }

      setIsPrivate(Boolean(data.user.isPrivate));
      if (profileUserId && currentUserId) {
  const currentUserResponse = await fetch(
    "https://social-media-backend-9fag.onrender.com/api/auth/profile",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const currentUserData =
    await currentUserResponse.json();

  if (currentUserResponse.ok) {
    const isUserBlocked =
      currentUserData.user.blockedUsers?.some(
        (id) =>
          id.toString() ===
          profileData.user._id.toString()
      );

    setIsBlocked(Boolean(isUserBlocked));
  }
}

      alert(
        newPrivacy
          ? "Account is now Private 🔒"
          : "Account is now Public 🌍"
      );
    } catch (error) {
      console.error(
        "Privacy Update Error:",
        error
      );

      alert("Server error");
    }
  }}
  style={{
    background: isPrivate
      ? "#333"
      : "#1877f2",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    marginLeft: "10px",
  }}
>
  {isPrivate
    ? "🔒 Private Account"
    : "🌍 Public Account"}
</button>
      </div>
      <div
  style={{
    margin: "20px 0",
    padding: "15px",
    borderTop: "1px solid #ddd",
    borderBottom: "1px solid #ddd",
  }}
>
  <h2>Story Highlights</h2>

  {highlights.length === 0 ? (
    <p>No story highlights yet.</p>
  ) : (
    <div
      style={{
        display: "flex",
        gap: "15px",
        overflowX: "auto",
      }}
    >
      {highlights.map((highlight) => (
        <div
          key={highlight._id}
          onClick={() => navigate(`/story/${highlight.stories[0]._id}`)}
          style={{
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              padding: "3px",
              border: "3px solid #1877f2",
            }}
          >
            <img
  src={
    highlight.user?.profilePic
      ? `https://social-media-backend-9fag.onrender.com${highlight.user.profilePic}`
      : highlight.cover
      ? `https://social-media-backend-9fag.onrender.com${highlight.cover}`
      : "https://randomuser.me/api/portraits/men/1.jpg"
  }
  alt={highlight.title}
  style={{
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
  }}
/>
          </div>

          <p style={{ marginTop: "5px" }}>
            {highlight.title}
          </p>
        </div>
      ))}
    </div>
  )}
</div>
      <div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    margin: "20px 0",
  }}
>
  <button
    onClick={() => setActiveTab("posts")}
    style={{
      padding: "10px 25px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      background:
        activeTab === "posts"
          ? "#1877f2"
          : "#eee",
      color:
        activeTab === "posts"
          ? "white"
          : "#333",
      fontWeight: "600",
    }}
  >
    Posts
  </button>

  <button
    onClick={() => setActiveTab("reels")}
    style={{
      
      padding: "10px 25px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      background:
        activeTab === "reels"
          ? "#1877f2"
          : "#eee",
      color:
        activeTab === "reels"
          ? "white"
          : "#333",
      fontWeight: "600",
    }}
  >
    Reels
  </button>
</div>

      <hr />
      {activeTab === "posts" && (

      <div className="my-posts">
        <h2>
          {profileUserId
            ? `${user.name}'s Posts`
            : "My Posts"}
        </h2>

        {posts.length === 0 ? (
          <p>
            You have not created any posts yet.
          </p>
        ) : (
          posts.map((post) => (
            <div
              className="my-post"
              key={post._id}
            >
              <p>{post.content}</p>

              {post.image && (
                <img
                  src={`https://social-media-backend-9fag.onrender.com${post.image}`}
                  alt="Post"
                  style={{
                    width: "100%",
                    maxWidth: "500px",
                    height: "300px",
                    objectFit: "contain",
                    borderRadius: "10px",
                    display: "block",
                    marginTop: "10px",
                  }}
                />
              )}
            </div>
            
          ))
          
        )}
        </div>
      )}
      {activeTab === "reels" && (

      <div className="my-reels">
        <h2>
          {profileUserId
            ? `${user.name}'s Reels`
            : "My Reels"}
        </h2>
        <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "10px",
        marginTop: "20px",
        justifyItems: "center",
      }}
      
      >
        

        {reels.length === 0 ? (
          <p>No reels created yet.</p>
        ) : (
          reels.map((reel) => (
            <div
              className="my-reel"
              key={reel._id}
              style={{
                marginBottom: "20px",
              }}
            >
              <div
  style={{
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
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
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      objectFit: "cover",
      marginRight: "10px",
    }}
  />

  <strong>
    {reel.user?.name || "User"}
  </strong>
</div>
          
              <video
                src={`https://social-media-backend-9fag.onrender.com/uploads/${reel.video}`}
                controls
                
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  maxHeight: "500px",
                  borderRadius: "10px",
                  display: "block",
                }}
              />
              <button
  onClick={() => navigate(`/reels/${reel._id}`)}
  style={{
    marginTop: "8px",
    marginRight: "15px",
    marginBottom: "15px",
    padding: "8px 15px",
    background: "#1877f2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  }}
>
  Open Reel
</button>


{/* Like + Likes Count */}
<div
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px",
  }}
>
  <button
    onClick={() => handleLikeReel(reel._id)}
    style={{
      padding: "8px 15px",
      background: likedReels.includes(reel._id)
        ? "#ff416c"
        : "#eee",
      color: likedReels.includes(reel._id)
        ? "white"
        : "#333",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    }}
  >
    ❤️ {likedReels.includes(reel._id) ? "Liked" : "Like"}
  </button>

  <span
    style={{
      padding: "8px 15px",
      background: "#f0f0f0",
      color: "#333",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "600",
      border: "1px solid #ddd",
    }}
  >
    {reel.likes?.length || 0} Likes
  </span>
</div>
<div
  style={{
    marginTop: "15px",
    width: "100%",
    maxWidth: "500px",
  }}
>
  {/* Write Comment */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
    }}
  >
    <input
      type="text"
      placeholder="Write a comment..."
      value={commentText[reel._id] || ""}
      onChange={(e) =>
        setCommentText({
          ...commentText,
          [reel._id]: e.target.value,
        })
      }
      style={{
        flex: 1,
        padding: "8px 10px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        outline: "none",
      }}
    />

    <button
      onClick={() => handleAddComment(reel._id)}
      style={{
        padding: "8px 15px",
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

  {/* Existing Comments */}
  <div
    style={{
      marginTop: "15px",
    }}
  >
    {reel.comments?.length === 0 ? (
      <p style={{ color: "#888" }}>
        No comments yet.
      </p>
    ) : (
      reel.comments?.map((comment) => (
  <div
    key={comment._id}
    style={{
      display: "flex",
      alignItems: "center",
      padding: "8px 0",
      borderBottom: "1px solid #eee",
    }}
  >
    <img
      src={
        comment.user?.profilePic
          ? `https://social-media-backend-9fag.onrender.com${comment.user.profilePic}`
          : "https://randomuser.me/api/portraits/men/1.jpg"
      }
      alt={comment.user?.name || "User"}
      style={{
        width: "35px",
        height: "35px",
        borderRadius: "50%",
        objectFit: "cover",
        marginRight: "10px",
      }}
    />

    <div style={{ flex: 1 }}>
      <strong>
        {comment.user?.name || "User"}
      </strong>

      {editingCommentId === comment._id ? (
        <div style={{ marginTop: "5px" }}>
          <input
            type="text"
            value={editingCommentText}
            onChange={(e) =>
              setEditingCommentText(e.target.value)
            }
            style={{
              padding: "6px 8px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              width: "70%",
            }}
          />

          <button
            onClick={() =>
              handleEditReelComment(
                reel._id,
                comment._id
              )
            }
            style={{
              marginLeft: "5px",
              padding: "6px 10px",
              background: "#1877f2",
              color: "white",
              border: "none",
              borderRadius: "5px",
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
              background: "#eee",
              color: "#333",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <p
            style={{
              margin: "3px 0 5px",
            }}
          >
            {comment.text}
          </p>

          {comment.user?._id === currentUserId && (
            <div>
              <button
                onClick={() => {
                  setEditingCommentId(comment._id);
                  setEditingCommentText(comment.text);
                }}
                style={{
                  padding: "4px 8px",
                  marginRight: "5px",
                  background: "#eee",
                  color: "#333",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Edit
              </button>

              <button
                onClick={() =>
                  handleDeleteReelComment(
                    reel._id,
                    comment._id
                  )
                }
                style={{
                  padding: "4px 8px",
                  background: "#ff4d4d",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
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
    </div>
  </div>
))
    )}
  </div>
</div>
              
{/* Creator Info */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    marginTop: "10px",
    marginBottom: "10px",
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
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      objectFit: "cover",
      marginRight: "10px",
    }}
  />

  <strong>
    {reel.user?.name || "User"}
  </strong>
</div>

{/* Reel Time */}
<small
  style={{
    display: "block",
    marginTop: "5px",
    marginBottom: "10px",
    color: "green",
    fontSize: "12px",
  }}
>
  {getTimeAgo(reel.createdAt)}
</small>

  
      
 {reel.user?._id === currentUserId && (
  <button
    onClick={async () => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this reel?"
      );

      if (!confirmDelete) return;

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `https://social-media-backend-9fag.onrender.com/api/reels/${reel._id}`,
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

        setReels((prev) =>
          prev.filter(
            (item) => item._id !== reel._id
          )
        );

        alert("Reel deleted successfully");
      } catch (error) {
        console.error("Delete Reel Error:", error);
        alert("Server error");
      }
    }}
    style={{
      marginTop: "8px",
      marginLeft: "10px",
      padding: "8px 15px",
      background: "#ff416c",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    }}
  >
    Delete Reel
  </button>
)}

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
            maxWidth: "500px",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ddd",
          }}
        />

        <br />

        <button
          onClick={() =>
            handleEditReel(reel._id)
          }
          style={{
            marginTop: "8px",
            marginRight: "8px",
            padding: "8px 15px",
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
            padding: "8px 15px",
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

        {reel.user?._id === currentUserId && (
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
            Edit Caption
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
      </div>
      )}
    </div>
  );
}

export default Profile;
