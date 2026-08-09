import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateStory() {
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState("");
  const [musicList, setMusicList] = useState([]);
  const [selectedMusic, setSelectedMusic] = useState("");
  const [mentions, setMentions] = useState([]);
  const [users, setUsers] = useState([]);
const [searchUser, setSearchUser] = useState("");
const [isCloseFriends, setIsCloseFriends] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
  const fetchMusic = async () => {
    try {
      const response = await fetch(
        "https://social-media-backend-9fag.onrender.com/api/music"
      );

      const data = await response.json();

      if (response.ok) {
        setMusicList(data.music || []);
      }
    } catch (error) {
      console.error("Fetch Music Error:", error);
    }
  };

  fetchMusic();
}, []);
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://social-media-backend-9fag.onrender.com/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setMedia(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!media) {
      alert("Please select an image or video");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("media", media);
      if (selectedMusic) {
  formData.append("musicId", selectedMusic);
}
      formData.append("mentions", JSON.stringify(mentions));
      formData.append("isCloseFriends", isCloseFriends);

      const response = await fetch(
        "https://social-media-backend-9fag.onrender.com/api/stories",
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
        alert(data.message || "Failed to upload story");
        return;
      }

      alert("Story uploaded successfully");

      navigate("/");
    } catch (error) {
      console.error("Upload Story Error:", error);
      alert("Server error");
    }
  };

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h1>Create Story</h1>

      <input
        type="file"
        accept="image/,video/"
        onChange={handleFileChange}
      />
      <div style={{ marginTop: "20px" }}>
  <label
    style={{
      display: "block",
      marginBottom: "8px",
      fontWeight: "600",
    }}
  >
    👤 Mention Users
  </label>

  <input
    type="text"
    placeholder="@username search"
    value={searchUser}
    onChange={(e) => setSearchUser(e.target.value)}
    style={{
      width: "300px",
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #ccc",
    }}
  />

  {searchUser && (
    <div>
      {users
        .filter((user) =>
          user.name
            .toLowerCase()
            .includes(searchUser.toLowerCase())
        )
        .slice(0, 5)
        .map((user) => (
          <div
  key={user._id}
  onClick={() => {
    setMentions([
      ...mentions,
      user._id,
    ]);
    setSearchUser("");
  }}
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px",
    cursor: "pointer",
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
      width: "35px",
      height: "35px",
      borderRadius: "50%",
      objectFit: "cover",
    }}
  />

  <span>
    @{user.name}
  </span>
</div>
        ))}
    </div>
  )}

  {mentions.length > 0 && (
    <p>
      {mentions.length} user mentioned
    </p>
  )}
</div>
<div style={{ marginTop: "20px" }}>
  <label>
    <input
      type="checkbox"
      checked={isCloseFriends}
      onChange={(e) =>
        setIsCloseFriends(e.target.checked)
      }
    />{" "}
    🌟 Close Friends Story
  </label>
</div>
      <div style={{ marginTop: "20px" }}>
  <label
    style={{
      display: "block",
      marginBottom: "8px",
      fontWeight: "600",
    }}
  >
    🎵 Add Music to Story
  </label>

  <select
    value={selectedMusic}
    onChange={(e) => setSelectedMusic(e.target.value)}
    style={{
      width: "300px",
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #ccc",
    }}
  >
    <option value="">No Music</option>

    {musicList.map((music) => (
      <option key={music._id} value={music._id}>
        {music.title} - {music.artist || "Unknown Artist"}
      </option>
    ))}
  </select>
</div>

      {preview && (
        <div style={{ marginTop: "20px" }}>
          {media?.type.startsWith("video") ? (
            <video
              src={preview}
              controls
              style={{
                width: "300px",
                maxHeight: "500px",
                objectFit: "contain",
              }}
            />
          ) : (
            <img
              src={preview}
              alt="Story Preview"
              style={{
                width: "300px",
                maxHeight: "500px",
                objectFit: "contain",
              }}
            />
          )}
        </div>
      )}

      <br />

      <button onClick={handleUpload}>
        Upload Story
      </button>

      <button
        onClick={() => navigate("/")}
        style={{ marginLeft: "10px" }}
      >
        Cancel
      </button>
    </div>
  );
}

export default CreateStory;