import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchText.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(
          `http://192.168.43.245:5000/api/users/search?query=${encodeURIComponent(
            searchText
          )}`
        );

        const data = await response.json();

        if (response.ok) {
          setSearchResults(data.users || []);
        }
      } catch (error) {
        console.error("Search Users Error:", error);
      }
    };

    const timer = setTimeout(() => {
      searchUsers();
    }, 400);

    return () => clearTimeout(timer);
  }, [searchText]);

  const handleUserClick = (userId) => {
    setSearchText("");
    setSearchResults([]);
    navigate(`/profile/${userId}`);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await fetch(
          "http://192.168.43.245:5000/api/users/logout",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <nav className="navbar">
      <h2>Social Media App</h2>

     {/* Global User Search */}
<div className="user-search">
  <div className="search-input-wrapper">
    <button
    type="button"
      className="search-icon"
      onClick={() => {
        document.querySelector(".search-input-wrapper input").focus();
      }}
    >
      🔍
    </button>

    <input
      type="text"
      placeholder="Search users..."
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
    />

    {searchText && (
      <button
        className="clear-search"
        onClick={() => {
          setSearchText("");
          setSearchResults([]);
        }}
      >
        ✕
      </button>
    )}
  </div>

  {searchText.trim() && (
    <div className="search-results">
      {searchResults.length === 0 ? (
        <div className="no-search-results">
          <span>🔍</span>
          <p>No users found</p>
        </div>
      ) : (
        <>
          <div className="search-title">
            Search Results
          </div>

          {searchResults.map((user) => (
            <div
              key={user._id}
              className="search-user"
              onClick={() => handleUserClick(user._id)}
            >
              <img
                src={
                  user.profilePic
                    ? `http://192.168.43.245:5000${user.profilePic}`
                    : "https://randomuser.me/api/portraits/men/1.jpg"
                }
                alt={user.name}
              />

              <div className="search-user-info">
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>

              <span className="profile-arrow">
                →
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  )}
</div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
         <Link to="/profile">Profile</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/reels">Reels</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/notifications">Notifications</Link> 
        <Link to="/settings">⚙️Settings</Link>
        

        <button
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
        
      </div>
    </nav>
  );
}

export default Navbar;