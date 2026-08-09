import "../../styles/postCard.css";
import {
FaHeart,
FaTrash,
FaEdit,
FaUser,
FaComment,
FaFlag,
} from "react-icons/fa";

function PostCard({
item,
index,
handleLike,
handleDelete,
handleEdit,
handleComment,
handleDeleteComment,
handleEditComment,
}) {
const loggedInUserId = localStorage.getItem("userId");

// REPORT POST
const handleReportPost = async () => {
const reason = window.prompt("Report reason likho:");

if (!reason) {
  return;
}

try {
  const response = await fetch(
    "http://localhost:5000/api/reports",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reporter: loggedInUserId,
        type: "post",
        reportedItem: item._id,
        reportedModel: "Post",
        reason: reason,
      }),
    }
  );

  const data = await response.json();

  if (response.ok) {
    alert("Report submitted successfully");
  } else {
    alert(data.message || "Report submit nahi ho payi");
  }
} catch (error) {
  console.error("Report Error:", error);
  alert("Report submit nahi ho payi");
}

};

return (
<div className="post-card">
{/* USER PROFILE */}
<div
style={{
display: "flex",
alignItems: "center",
marginBottom: "10px",
}}
>
<img
src={
item.user?.profilePic
? `http://192.168.43.245:5000${item.user.profilePic}`
: "https://randomuser.me/api/portraits/men/1.jpg"
}
alt="Profile"
style={{
width: "50px",
height: "50px",
borderRadius: "50%",
marginBottom: "10px",
}}
/>

    <h4>
      <FaUser /> {item.user?.name || "User"}
    </h4>
  </div>

  {/* POST IMAGE */}
  {item.image && (
    <img
      src={`http://192.168.43.245:5000${item.image}`}
      alt="Post"
      style={{
        width: "100%",
        height: "300px",
        objectFit: "contain",
        
        borderRadius: "10px",
        display: "block",
      }}
    />
  )}

  {/* POST CONTENT */}
  <p>{item.text || item.content}</p>

  <small>{item.time}</small>

  <br />
  <br />

  {/* LIKE BUTTON */}
  <button
    onClick={() => handleLike(index)}
    style={{
      marginRight: "10px",
      backgroundColor: item.liked ? "#ff4d4f" : "#1877f2",
      color: "white",
    }}
  >
    <FaHeart style={{ color: "red" }} /> Like(
    {item.likes?.length || 0})
  </button>

  {/* DELETE & EDIT - ONLY POST OWNER */}
  {item.user?._id === loggedInUserId && (
    <>
      <button
        onClick={() => handleDelete(index)}
        style={{ marginRight: "10px" }}
      >
        <FaTrash /> Delete
      </button>

      <button onClick={() => handleEdit(index)}>
        <FaEdit /> Edit
      </button>
    </>
  )}

  {/* COMMENT BUTTON */}
  <button
    onClick={() => handleComment(index)}
    style={{ marginLeft: "10px" }}
  >
    <FaComment /> Comment(
    {item.comments?.length || 0})
  </button>
{/* POST MUSIC */}
{item.music && (
  <div
    style={{
      marginTop: "8px",
      padding: "8px 10px",
      background: "#f5f5f5",
      borderRadius: "8px",
      maxWidth: "350px",
    }}
  >
    <strong style={{ fontSize: "14px" }}>
      🎵 {item.music.title}
    </strong>

    <p
      style={{
        margin: "3px 0 6px",
        fontSize: "12px",
      }}
    >
      {item.music.artist || "Unknown Artist"}
    </p>

    <audio
      controls
      style={{
        width: "100%",
        height: "35px",
      }}
    >
      <source
        src={`http://192.168.43.245:5000${item.music.audioUrl}`}
        type="audio/mpeg"
      />
    </audio>
  </div>
)}
  {/* COMMENTS */}
  {item.comments?.map((comment, commentIndex) => (
    <div key={comment._id || commentIndex}>
      <p>
        <FaComment style={{ marginRight: "5px" }} />
        {comment.text ||
          comment.comment ||
          comment.content ||
          comment}
      </p>

      {/* COMMENT EDIT & DELETE */}
      {comment._id && (
        <>
          <button
            onClick={() =>
              handleEditComment(
                index,
                comment._id,
                comment.text
              )
            }
          >
            <FaEdit /> Edit Comment
          </button>

          <button
            onClick={() =>
              handleDeleteComment(
                index,
                comment._id
              )
            }
          >
            <FaTrash /> Delete Comment
          </button>
        </>
      )}
    </div>
  ))}

  {/* REPORT POST BUTTON */}
  <button
    onClick={handleReportPost}
    style={{ marginLeft: "10px" }}
  >
    <FaFlag /> Report
  </button>

  {/* TOTAL COMMENTS */}
  <p>
    Total Comments: {item.comments?.length || 0}
  </p>

  <hr />
</div>

);
}

export default PostCard;