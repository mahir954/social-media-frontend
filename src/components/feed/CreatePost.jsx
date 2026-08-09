import { useEffect, useState } from "react";
import "../../styles/createPost.css";
import PostCard from "./PostCard";

function CreatePost() {
  const [post, setPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [image, setImage] = useState(null);
  const [musicList, setMusicList] = useState([]);
const [selectedMusic, setSelectedMusic] = useState(null);
 useEffect(() => {
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("Token not found");
        return;
      }

      const response = await fetch(
        "https://social-media-backend-9fag.onrender.com/api/posts",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Posts API Response:", data);

      if (!response.ok) {
        console.error(
          "Failed to fetch posts:",
          data.message
        );
        return;
      }

      if (Array.isArray(data.posts)) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error(
        "Error fetching posts:",
        error
      );
    }
  };

  fetchPosts();
}, []);
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

  const handlePost = async () => {
    if (post.trim() === "") {
      alert("Button Clicked");
      alert("please write something!");
      return;
    }
    try{
        const token =
        localStorage.getItem("token");
      if(!token){
        alert("please login first");
        return;
      }
      const formData = new FormData();
      formData.append("content", post);
      if (image) {
        formData.append("image", image);
        if (selectedMusic) {
          formData.append("musicId", selectedMusic._id);
        }
      }
        const response = await fetch("https://social-media-backend-9fag.onrender.com/api/posts", {
            method: "POST",
            headers: {
                
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
      
  

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to create post");
      return;
    }

    alert("Post created successfully!");

    setPost("");

    const newPost = {
      _id: data.post._id,
      text: data.post.content,
      content: data.post.content,
      createdAt: data.post.createdAt,
      image: data.post.image,
      likes: [],
      liked: false,
      comments: [],
    };

    setPosts((prevPosts) => [
      newPost,
      ...prevPosts,
    ]);
    setImage(null);
    setSelectedMusic(null);

  } catch (error) {
    console.error("Create Post Error:", error);
    alert("Server error");
  }
};
   const handleDelete = async (index) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const selectedPost = posts[index];

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) {
      return;
    }

    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/posts/${selectedPost._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to delete post");
      return;
    }

    const updatedPosts = posts.filter(
      (_, i) => i !== index
    );

    setPosts(updatedPosts);

    alert("Post deleted successfully");

  } catch (error) {
    console.error("Delete Post Error:", error);
    alert("Server error");
  }
}; 
  
    const handleLike = async (index) => {
      try{
        const token = 
        localStorage.getItem("token");
        if(!token){
          alert("please login first");
          return;

        }
        const selectedPost = posts[index];
        const isLiked = selectedPost.likes && selectedPost.likes.some((userId) => userId === localStorage.getItem("userId"));
        const url = isLiked ? `https://social-media-backend-9fag.onrender.com/api/posts/${selectedPost._id}/unlike`
            :
        `https://social-media-backend-9fag.onrender.com/api/posts/${selectedPost._id}/like`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if(!response.ok){
          alert(data.message || "Like failed");
          return;
        }
        const updatedPosts = [...posts];
        updatedPosts[index] = {
          ...updatedPosts[index],
          likes: data.likes,
        }
        setPosts(updatedPosts);
      } catch (error){
        console.error("Like Error:", error);
        alert("Server error");
      }
    };

  const handleEdit = async (index) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const selectedPost = posts[index];

    const updatedText = prompt(
      "Edit your post:",
      selectedPost.content || selectedPost.text
    );

    if (!updatedText || updatedText.trim() === "") {
      return;
    }

    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/posts/${selectedPost._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: updatedText,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to edit post");
      return;
    }

    const updatedPosts = [...posts];

    updatedPosts[index] = {
      ...updatedPosts[index],
      content: data.post.content,
      text: data.post.content,
    };

    setPosts(updatedPosts);

    alert("Post updated successfully");

  } catch (error) {
    console.error("Edit Post Error:", error);
    alert("Server error");
  }
};
    

    

 const handleComment = async (index) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const commentText = prompt("Write your comment");

    if (!commentText || commentText.trim() === "") {
      return;
    }

    const selectedPost = posts[index];

    const response = await fetch(`https://social-media-backend-9fag.onrender.com/api/posts/${selectedPost._id}/comment`,
      {
        method: "POST",
        headers: {
          "Content-Type":
          "application/json",
          Authorization: `Bearer ${token}`,

        },
        body: JSON.stringify({
          text: commentText,
        }),
      }
    );
    const data = await response.json();
    if(!response.ok){
      alert(data.message || "Failed to add comment");
      return;
    }
    const updatedPosts = [...posts];
    updatedPosts[index] = {
      ...updatedPosts[index],
      comments: data.comments,

    };
    setPosts(updatedPosts);
  } catch (error){
    console.error("Comment Error:", error);
    alert("Server error");
  }
};
const handleDeleteComment = async (postIndex, commentId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const post = posts[postIndex];

    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/posts/${post._id}/comment/${commentId}`,
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

    const updatedPosts = [...posts];

    updatedPosts[postIndex] = {
      ...updatedPosts[postIndex],
      comments: data.comments,
    };

    setPosts(updatedPosts);

    alert("Comment deleted successfully");

  } catch (error) {
    console.error("Delete Comment Error:", error);
    alert("Server error");
  }
};
      const handleEditComment = async (postIndex, commentId, oldText) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const updatedText = prompt(
      "Edit your comment:",
      oldText
    );

    if (!updatedText || updatedText.trim() === "") {
      return;
    }

    const post = posts[postIndex];

    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/posts/${post._id}/comment/${commentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: updatedText,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to edit comment");
      return;
    }

    const updatedPosts = [...posts];

    updatedPosts[postIndex] = {
      ...updatedPosts[postIndex],
      comments: data.comments,
    };

    setPosts(updatedPosts);

    alert("Comment updated successfully");

  } catch (error) {
    console.error("Edit Comment Error:", error);
    alert("Server error");
  }
};
   
  return (
    <div
      className="create-post"
      style={{
        backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
        color: darkMode ? "#ffffff" : "#000000",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h3>Create Post</h3>

      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          marginBottom: "15px 0",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          backgroundColor: darkMode ? "#f5f5f5" : "#333",
          color: darkMode ? "#000" : "#fff",
        }}
      >
        {darkMode ? "☀️ light Mode" : "🌙 Dark Mode"}
      </button>

      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <textarea
        placeholder="What's on your mind?"
        rows="4"
        value={post}
        onChange={(e) =>
          setPost(e.target.value)
        }
      ></textarea>

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setImage(e.target.files[0])
        }
      />

      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="Preview"
          style={{
            width: "200px",
            marginTop: "10px",
            borderRadius: "10px",
          }}
        />
      )}
      {/* Music Selection */}
<div
  style={{
    marginTop: "15px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "10px",
  }}
>
  <h4 style={{ marginTop: 0 }}>🎵 Add Music</h4>

  <select
    value={selectedMusic?._id || ""}
    onChange={(e) => {
      const music = musicList.find(
        (item) => item._id === e.target.value
      );

      setSelectedMusic(music || null);
    }}
    style={{
      width: "100%",
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #ccc",
    }}
  >
    <option value="">
      Select Music
    </option>

    {musicList.map((music) => (
      <option
        key={music._id}
        value={music._id}
      >
        {music.title} - {music.artist || "Unknown Artist"}
      </option>
    ))}
  </select>

  {selectedMusic && (
    <div
      style={{
        marginTop: "10px",
        padding: "10px",
        background: darkMode
          ? "#333"
          : "#f5f5f5",
        borderRadius: "8px",
      }}
    >
      <strong>
        🎵 {selectedMusic.title}
      </strong>

      <div
        style={{
          fontSize: "13px",
          marginTop: "3px",
          opacity: 0.7,
        }}
      >
        {selectedMusic.artist || "Unknown Artist"}
      </div>

      <button
        type="button"
        onClick={() =>
          setSelectedMusic(null)
        }
        style={{
          marginTop: "8px",
          background: "red",
          color: "white",
          border: "none",
          padding: "5px 10px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Remove Music
      </button>
    </div>
  )}
</div>

      <button onClick={handlePost}>
        Post
      </button>

      {posts
        .filter((item) =>
          (item.text || item.content || "")
            .toLowerCase()
            .includes(search.toLowerCase())
        )
        .map((item, index) => (
          <PostCard
            key={index}
            item={item}
            index={index}
            handleLike={handleLike}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            handleComment={handleComment}
            handleDeleteComment={handleDeleteComment}
            handleEditComment={handleEditComment}
          />
        ))}
    </div>
  );
}

export default CreatePost;