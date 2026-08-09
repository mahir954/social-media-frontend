import { Navigate } from "react-router-dom";

import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Stories from "../components/story/Stories";
import CreatePost from "../components/feed/CreatePost";
import HomeFeed from "../components/feed/HomeFeed";

function Home() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/register" replace />;
  }

  return (
    <>
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar />

        <div style={{ marginLeft: "20px" }}>
          <h1>Home Feed</h1>
          <p>Welcome to Social Media App</p>

          <Stories />
          <CreatePost />
          <HomeFeed />
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Home;
