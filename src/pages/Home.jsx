import { useNavigate } from "react-router-dom";

import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Stories from "../components/story/Stories";
import CreatePost from "../components/feed/CreatePost";
import HomeFeed from "../components/feed/HomeFeed";
import "../styles/home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="home-layout">
        <Sidebar />

        <main className="home-content">
          <div className="home-heading-row">
            <div>
              <h1>Home Feed</h1>
              <p>Welcome to Social Media App</p>
            </div>

            <button
              className="go-live-home-button"
              onClick={() => navigate("/live")}
            >
              🔴 Go Live
            </button>
          </div>

          <Stories />

          <CreatePost />

          <HomeFeed />
        </main>
      </div>

      <Footer />
    </>
  );
}

export default Home;
