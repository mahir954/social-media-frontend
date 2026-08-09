import { useState } from "react";

function MusicUpload() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audio, setAudio] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title) {
      alert("Please enter music title");
      return;
    }

    if (!audio && !audioUrl) {
      alert("Please upload an audio file or paste an audio URL");
      return;
    }

    if (audio && audioUrl) {
      alert("Please use either Audio File or Audio URL, not both");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("artist", artist);

      if (audio) {
        formData.append("audio", audio);
      }

      if (audioUrl) {
        formData.append("audioUrl", audioUrl);
      }

      const response = await fetch(
        "https://social-media-backend-9fag.onrender.com/api/music/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Music upload failed");
        return;
      }

      alert("Music added successfully");

      setTitle("");
      setArtist("");
      setAudio(null);
      setAudioUrl("");

      document.getElementById("audioFile").value = "";
    } catch (error) {
      console.error("Music Upload Error:", error);
      alert("Server error");
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "50px auto",
        padding: "25px",
        border: "1px solid #ddd",
        borderRadius: "12px",
      }}
    >
      <h2>🎵 Add Music</h2>

      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Music Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            boxSizing: "border-box",
          }}
        />

        <input
          type="text"
          placeholder="Artist Name"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            boxSizing: "border-box",
          }}
        />

        <label>
          <strong>Upload Audio File</strong>
        </label>

        <input
          id="audioFile"
          type="file"
          accept="audio/*"
          onChange={(e) => {
            setAudio(e.target.files[0]);
            setAudioUrl("");
          }}
          style={{
            width: "100%",
            marginTop: "8px",
            marginBottom: "15px",
          }}
        />

        <div
          style={{
            textAlign: "center",
            margin: "10px 0",
            fontWeight: "600",
          }}
        >
          OR
        </div>

        <label>
          <strong>Audio URL</strong>
        </label>

        <input
          type="url"
          placeholder="Paste direct audio URL (.mp3, .wav...)"
          value={audioUrl}
          onChange={(e) => {
            setAudioUrl(e.target.value);
            setAudio(null);

            const fileInput =
              document.getElementById("audioFile");

            if (fileInput) {
              fileInput.value = "";
            }
          }}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "8px",
            marginBottom: "15px",
            boxSizing: "border-box",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "8px",
            background: "#1877f2",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Add Music
        </button>
      </form>
    </div>
  );
}

export default MusicUpload;