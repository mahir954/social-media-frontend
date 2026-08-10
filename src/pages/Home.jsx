import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Stories from "../components/story/Stories";
import CreatePost from "../components/feed/CreatePost";
import HomeFeed from "../components/feed/HomeFeed";
import "../styles/home.css";

function Home() {
  return (
    <>
      <Navbar />

      <div className="home-layout">
  <Sidebar />

  <main className="home-content">
    <h1>Home Feed</h1>
    <p>Welcome to Social Media App</p>

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
