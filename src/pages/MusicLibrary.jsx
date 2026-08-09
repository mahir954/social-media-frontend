import { useEffect, useState } from "react";

function MusicLibrary() {
  const [musicList, setMusicList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    fetchMusic();
  }, []);

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

  const filteredMusic = musicList.filter((music) =>
    `${music.title} ${music.artist}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "30px auto",
        padding: "20px",
      }}
    >
      <h1>🎵 Music Library</h1>

      <input
        type="text"
        placeholder="Search music..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          boxSizing: "border-box",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      {filteredMusic.length === 0 ? (
        <p>No music available.</p>
      ) : (
        filteredMusic.map((music) => (
          <div
            key={music._id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              padding: "15px",
              marginBottom: "10px",
              border: "1px solid #ddd",
              borderRadius: "10px",
            }}
          >
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0 }}>
                🎵 {music.title}
              </h3>

              <p style={{ margin: "5px 0" }}>
                🎤 {music.artist || "Unknown Artist"}
              </p>
            </div>

          <audio
  controls
  preload="metadata"
  src={`https://social-media-backend-9fag.onrender.com${music.audioUrl}`}
  onLoadedMetadata={(e) => {
    console.log("Audio Duration:", e.target.duration);
  }}
  onError={(e) => {
  console.error(
    "Audio Load Error Code:",
    e.currentTarget.error?.code
  );

  console.error(
    "Audio Load Error Message:",
    e.currentTarget.error?.message
  );

  console.error(
    "Audio URL:",
    e.currentTarget.src
  );
}}
  onPlay={() => setPlayingId(music._id)}
  onPause={() => setPlayingId(null)}
/>
<button
  onClick={async () => {
    const confirmDelete = window.confirm(
      `Delete "${music.title}"?`
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `https://social-media-backend-9fag.onrender.com/api/music/${music._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete music");
        return;
      }

      alert("Music deleted successfully");

      setMusicList((prev) =>
        prev.filter((item) => item._id !== music._id)
      );
    } catch (error) {
      console.error("Delete Music Error:", error);
      alert("Server error");
    }
  }}
  style={{
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    background: "#e74c3c",
    color: "white",
    cursor: "pointer",
  }}
>
  Delete
</button>

            {playingId === music._id && (
              <span>▶️ Playing</span>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MusicLibrary;