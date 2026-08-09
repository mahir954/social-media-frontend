import { useEffect, useState } from "react";
import "../styles/note.css";

function Note() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [myNote, setMyNote] = useState(null);
  const [replyText, setReplyText] = useState("");
const [replyNoteId, setReplyNoteId] = useState(null);
  const getTimeAgo = (date) => {
  const seconds = Math.floor(
    (new Date() - new Date(date)) / 1000
  );

  const minutes = Math.floor(seconds / 60);

  if (minutes < 1) {
    return "now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days}d ago`;
};

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://social-media-backend-9fag.onrender.com/api/notes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        const currentUserId = localStorage.getItem("userId");

const my = data.notes.find(
  (item) =>
    item.user?._id === currentUserId
);

setMyNote(my || null);

setNotes(
  data.notes.filter(
    (item) =>
      item.user?._id !== currentUserId
  )
);
      }

    } catch (error) {
      console.error("Fetch Notes Error:", error);
    }
  };


  useEffect(() => {
    fetchNotes();
  }, []);
  useEffect(() => {
  if (myNote) {
    setNote(myNote.text);
  }
}, [myNote]);


  const createNote = async () => {
    if (!note.trim()) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://social-media-backend-9fag.onrender.com/api/notes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: note,
          }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setNote("");
        fetchNotes();
      }

    } catch (error) {
      console.error("Create Note Error:", error);
    }
  };
  const deleteNote = async (noteId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/notes/${noteId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      setMyNote(null);
      fetchNotes();
    }
  } catch (error) {
    console.error("Delete Note Error:", error);
  }
};
const updateNote = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/notes/${myNote._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: note,
        }),
      }
    );
    const data = await response.json();
    console.log(data);

    if (response.ok) {
      setNote("");
      fetchNotes();
    }
  } catch (error) {
    console.error("Update Note Error:", error);
  }
};
const handleReply = async (noteId) => {
  if (!replyText.trim()) return;

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/notes/${noteId}/reply`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: replyText,
        }),
      }
    );

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      setReplyText("");
      setReplyNoteId(null);
      fetchNotes();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Reply Note Error:", error);
  }
};
const handleLike = async (noteId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/notes/${noteId}/like`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      fetchNotes();
    }
  } catch (error) {
    console.error("Like Note Error:", error);
  }
};


  return (
    <div className="note-container">

      <h2>Your Note</h2>

      <input
        type="text"
        maxLength="60"
        placeholder="Write your note..."
        value={note || myNote?.text || ""}
        onChange={(e)=>setNote(e.target.value)}
      />

      <button
  onClick={
    myNote
      ? updateNote
      : createNote
  }
>
  {myNote ? "Save Note" : "Add Note"}
</button>
      {myNote && (
  <div className="note-card">
      <img
      src={
        myNote.user?.profilePic
          ? `https://social-media-backend-9fag.onrender.com${myNote.user.profilePic}`
          : "https://randomuser.me/api/portraits/men/1.jpg"
      }
      alt="profile"
    />
    <p>{myNote.text}</p>
    <small>
  Your Note · {getTimeAgo(myNote.createdAt)}
</small>
<button
  onClick={() => setNote(myNote.text)}
  style={{
    marginTop: "8px",
    background: "#1877f2",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "8px",
    cursor: "pointer",
  }}
>
  Edit Note
</button>
<button
  onClick={() => deleteNote(myNote._id)}
  style={{
    marginTop: "8px",
    background: "#ff3b30",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "8px",
    cursor: "pointer",
  }}
>
  Delete Note
</button>
  </div>
)}


      <div className="notes-list">

        {notes.map((item)=>(
          <div 
            className="note-card"
            key={item._id}
          >

            <img
              src={
                item.user?.profilePic
                ? `https://social-media-backend-9fag.onrender.com${item.user.profilePic}`
                : "https://randomuser.me/api/portraits/men/1.jpg"
              }
              alt="user"
            />

            <p>
              {item.text}
            </p>

           <small>
  {item.user?.name} · {getTimeAgo(item.createdAt)}
</small>
<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "8px",
  }}
>
  <button
    onClick={() => handleLike(item._id)}
  >
    ❤️ {item.likes?.length || 0}
  </button>
</div>
<button
  onClick={() =>
    setReplyNoteId(
      replyNoteId === item._id ? null : item._id
    )
  }
  style={{
    marginTop: "8px",
    border: "none",
    background: "#1877f2",
    color: "white",
    padding: "6px 10px",
    borderRadius: "8px",
    cursor: "pointer",
  }}
>
  Reply
</button>

{replyNoteId === item._id && (
  <>
    <input
      type="text"
      placeholder="Reply..."
      value={replyText}
      onChange={(e) =>
        setReplyText(e.target.value)
      }
    />

    <button
      onClick={() =>
        handleReply(item._id)
      }
    >
      Send
    </button>
  </>
)}

          </div>
        ))}

      </div>

    </div>
  );
}

export default Note;