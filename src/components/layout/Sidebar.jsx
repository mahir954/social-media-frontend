import "../../styles/sidebar.css";
import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    navigate("/login");
  };
  return (
    <aside>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>

        <li>
          <Link to="/explore">Explore</Link>
        </li>

        <li>
          <Link to="/chat">Chat</Link>
        </li>

        <li>
          <Link to="/notifications">Notifications</Link>
        </li>

        
        <li>
        <Link to="/reels">
  🎬 Reels
</Link>
        </li>
        <li>
          <Link to="/settings">⚙️Settings</Link>
        </li>
        <li>
          <button onClick={handleLogout}>
  🚪 Logout
</button>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;