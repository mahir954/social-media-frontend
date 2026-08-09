import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/stories.css";

function Stories() {
  const [stories, setStories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStories();
    fetchCurrentUser();
  }, []);

  const fetchStories = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://192.168.43.245:5000/api/stories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStories(data.stories);
      }
    } catch (error) {
      console.error("Fetch Stories Error:", error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://192.168.43.245:5000/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error(
        "Fetch Current User Error:",
        error
      );
    }
  };

  return (
    <div className="stories-container">

      {/* Add Story */}
      <div
        className="story-card add-story"
        onClick={() =>
          navigate("/create-story")
        }
        style={{
          position: "relative",
          cursor: "pointer",
        }}
      >
        <img
          src={
            currentUser?.profilePic
              ? `http://192.168.43.245:5000${currentUser.profilePic}`
              : "https://randomuser.me/api/portraits/men/1.jpg"
          }
          alt="Add Story"
        />

        <div
          style={{
            position: "absolute",
            bottom: "25px",
            right: "8px",
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            background: "#1877f2",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            fontWeight: "bold",
            border: "3px solid white",
            zIndex: 5,
          }}
        >
          +
        </div>

        <p>Add Story</p>
      </div>

      {/* Other Stories */}
      {stories.map((story) => (
        <div
          className="story-card"
          key={story._id}
          onClick={() =>
            navigate(`/story/${story._id}`)
          }
        >
          <img
            src={
              story.user?.profilePic
                ? `http://192.168.43.245:5000${story.user.profilePic}`
                : "https://randomuser.me/api/portraits/men/1.jpg"
            }
            alt={story.user?.name}
          />

          <p>{story.user?.name}</p>
        </div>
      ))}
    </div>
  );
}

export default Stories;