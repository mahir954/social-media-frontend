import { useEffect, useState } from "react";
import PostCard from "./PostCard";

function HomeFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://social-media-backend-9fag.onrender.com/api/posts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPosts(data.posts || []);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Home Feed Error:", error);
    }
  };

  const handleLike = async (index) => {
    const post = posts[index];
    const token = localStorage.getItem("token");
    const currentUserId = localStorage.getItem("userId");

    const isLiked = post.likes?.some(
      (id) => id.toString() === currentUserId
    );

    try {
      const response = await fetch(
        `https://social-media-backend-9fag.onrender.com/api/posts/${post._id}/${
          isLiked ? "unlike" : "like"
        }`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPosts((prevPosts) =>
          prevPosts.map((item, i) =>
            i === index
              ? {
                  ...item,
                  likes: data.likes,
                }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Like Error:", error);
    }
  };

  const handleDelete = async (index) => {
    const post = posts[index];
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://social-media-backend-9fag.onrender.com/api/posts/${post._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setPosts((prevPosts) =>
          prevPosts.filter((_, i) => i !== index)
        );
      }
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const handleEdit = async (index) => {
    const post = posts[index];

    const newContent = prompt(
      "Edit your post:",
      post.content
    );

    if (!newContent || !newContent.trim()) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://social-media-backend-9fag.onrender.com/api/posts/${post._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: newContent.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPosts((prevPosts) =>
          prevPosts.map((item, i) =>
            i === index
              ? {
                  ...item,
                  content: data.post.content,
                }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Edit Error:", error);
    }
  };

  const handleComment = async (index) => {
    const post = posts[index];

    const text = prompt("Write your comment:");

    if (!text || !text.trim()) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://social-media-backend-9fag.onrender.com/api/posts/${post._id}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: text.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPosts((prevPosts) =>
          prevPosts.map((item, i) =>
            i === index
              ? {
                  ...item,
                  comments: data.comments,
                }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Comment Error:", error);
    }
  };

  return (
    <div>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post, index) => (
          <PostCard
            key={post._id}
            item={post}
            index={index}
            handleLike={handleLike}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            handleComment={handleComment}
          />
        ))
      )}
    </div>
  );
}

export default HomeFeed;