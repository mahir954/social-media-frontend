import { useEffect, useState } from "react";
import "../styles/explore.css";


function Explore() {
  const [posts, setPosts] = useState([]);
  const [likedposts, setLikedPosts] = useState([]);
  const [comments, setComments] = useState({});
  const currentUserId = localStorage.getItem("userId");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "https://social-media-backend-9fag.onrender.com/api/posts",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setPosts(data.posts);
          const myLikedPosts = data.posts
            .filter((post) => 
            post.likes?.some((userId) =>
            userId.toString() === currentUserId)
            )
            .map((post) => post._id);
            setLikedPosts(myLikedPosts);
            data.posts.forEach((post) => {
              fetchComments(post._id);
            
          
          });
        }
      } catch (error) {
        console.error("Explore Error:", error);
      }
    };

    fetchPosts();
  }, []);
  const handleLike = async (postId) => {
    const token = localStorage.getItem("token");
    try{
      const isLiked = likedposts.includes(postId);
      const response = await fetch(`https://social-media-backend-9fag.onrender.com/api/posts/${postId}/${isLiked ? "unlike" : "like"}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,

        }
      });
      const data = await response.json();
      if (response.ok){
        setLikedPosts((prev) => isLiked ? prev.filter((id) => id !== postId) : [...prev, postId]);
        setPosts((prevPosts) =>
          prevPosts.map((post) => post._id === postId ? { ...post, likes: data.likes } : post)
        );
      }
    }
   catch (error){
    console.error("Like Error:", error);
  }
};
const handleFollow = async (userId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    return;
  }

  try {
    const targetPost = posts.find(
      (post) => post.user?._id === userId
    );

    const isFollowing = targetPost?.user?.followers?.some(
      (id) => id.toString() === currentUserId
    );

    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/users/${userId}/${
        isFollowing ? "unfollow" : "follow"
      }`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Action failed");
      return;
    }

    // Update all posts of this user
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.user?._id === userId) {
          return {
            ...post,
            user: {
              ...post.user,
              followers: data.followers,
            },
          };
        }

        return post;
      })
    );

  } catch (error) {
    console.error("Follow/Unfollow Error:", error);
    alert("Server error");
  }
};
const addComment = async (postId, text) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/posts/${postId}/comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      setComments((prev) => ({
        ...prev,
        [postId]: data.comments,
      }));
    }
  } catch (error) {
    console.error("Comment Error:", error);
  }
};
const fetchComments = async (postId) => {
  try {
    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/posts/${postId}/comments`
    );

    const data = await response.json();

    if (response.ok) {
      setComments((prev) => ({
        ...prev,
        [postId]: data.comments,
      }));
    }
  } catch (error) {
    console.error("Fetch Comments Error:", error);
  }
};
const deleteComment = async (postId, commentId) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/posts/${postId}/comment/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      setComments((prev) => ({
        ...prev,
        [postId]: data.comments,
      }));
    }
  } catch (error) {
    console.error("Delete Comment Error:", error);
  }
};
const editComment = async (postId, commentId, oldText) => {
  const newText = prompt("Edit your comment:", oldText);

  if (!newText || !newText.trim()) return;

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/posts/${postId}/comment/${commentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: newText.trim(),
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      setComments((prev) => ({
        ...prev,
        [postId]: data.comments,
      }));
    }
  } catch (error) {
    console.error("Edit Comment Error:", error);
  }
};
  return (
    <div
    className="explore-container">
      <h1>Explore</h1>

      <h2>Explore Posts</h2>
      <input
      type="text"
      placeholder="Search posts..."
      value={searchText}
      onChange={(e) => 
        setSearchText(e.target.value)
      }
      />

      {posts.filter((post) => 
      post.content.toLowerCase().includes(searchText.toLowerCase())
      ).length === 0 ? (
        <p className="No posts">No posts available.</p>
      ) : (
        posts
        .filter((post) =>
        post.content.toLowerCase().includes(searchText.toLowerCase())
        )
        .map((post) => (
          <div className="explore-post"key={post._id}>
            <div className="post-user">
  {post.user?.profilePic && (
    <img
      src={
        post.user?.profilePic
      ? `https://social-media-backend-9fag.onrender.com${post.user.profilePic}`
      : "https://randomuser.me/api/portraits/men/1.jpg"
  }
  alt={post.user?.name}
      
      className="post-user-image"
    />
  )}

  <strong>{post.user?.name}</strong>

  {post.user?._id !== currentUserId && (
  <button
    onClick={() => handleFollow(post.user._id)}
    style={{
      marginLeft: "15px",
      padding: "6px 15px",
      border: "none",
      borderRadius: "20px",
      cursor: "pointer",
      backgroundColor: post.user?.followers?.some(
        (id) => id.toString() === currentUserId
      )
        ? "#666"
        : "#1877f2",
      color: "white",
      fontWeight: "bold",
    }}
  >
    {post.user?.followers?.some(
      (id) => id.toString() === currentUserId
    )
      ? "Following"
      : "Follow"}
  </button>
)}
</div>
            <p>{post.content}</p>
            {post.image && (
              <img
              src={`https://social-media-backend-9fag.onrender.com${post.image}`}
              alt="Post"
              className="explore-post-image"
              />
            )}
            <input
  type="text"
  placeholder="Write a comment..."
  onKeyDown={(e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      addComment(post._id, e.target.value);
      e.target.value = "";
    }
  }}
/>
{comments[post._id]?.map((comment) => (
  <div
    key={comment._id}
    className="comment-item"
  >
    <img
      src={
        comment.user?.profilePic
          ? `https://social-media-backend-9fag.onrender.com${comment.user.profilePic}`
          : "https://randomuser.me/api/portraits/men/1.jpg"
      }
      alt={comment.user?.name}
      className="comment-user-image"
    />

    <div className="comment-content">
      <p>
        <strong>{comment.user?.name}</strong>{" "}
        {comment.text}
      </p>

      {comment.user?._id === currentUserId && (
        <div className="comment-actions">
          <button
            onClick={() =>
              editComment(
                post._id,
                comment._id,
                comment.text
              )
            }
          >
            Edit
          </button>

          <button
            onClick={() =>
              deleteComment(
                post._id,
                comment._id
              )
            }
          >
            Delete
          </button>
        </div>
      )}
    </div>
  </div>
))}
<p>
  💬 {comments[post._id]?.length || 0} Comments
</p>
            <button onClick={() =>
            handleLike(post._id)}>
              {likedposts.includes(post._id) ? "❤️ Unlike" : "🤍 Like"}
              {" "}
              {post.likes?.length || 0}
            </button>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Explore;