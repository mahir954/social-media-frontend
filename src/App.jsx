import Admin from "../admin/Admin";
import AdminLogin from "../admin/AdminLogin";

import { Routes, Route, Navigate } from "react-router-dom";

import InstallPage from "./pages/InstallPage";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CreateStory from "./pages/CreateStory";
import StoryViewer from "./pages/StoryViewer";
import Explore from "./pages/Explore";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import ResetPassword from "./pages/ResetPassword";
import Settings from "./pages/Settings";
import BlockedUsers from "./pages/BlockedUsers";
import SwitchAccount from "./pages/SwitchAccount";
import MusicUpload from "./pages/MusicUpload";
import MusicLibrary from "./pages/MusicLibrary";
import NotFound from "./pages/NotFound";
import Reels from "./pages/Reels";

import Note from "./components/Note";
import LiveStream from "./pages/LiveStream";
import LiveVideo from "../components/LiveVideo";
import LiveChat from "../components/LiveChat";

function App() {
  const token = localStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken");

  return (
    <Routes>

      {/* ================= ADMIN ================= */}

      <Route path="/admin" element={<Admin />} />

      <Route
        path="/admin-login"
        element={<AdminLogin />}
      />


      {/* ================= INSTALL PAGE ================= */}
      {/* Install page sirf /install link par open hoga */}

      <Route
        path="/install"
        element={<InstallPage />}
      />


      {/* ================= AUTHENTICATION ================= */}

      {/* App open hone par:
          Login nahi hai → Login
          Login hai → Home
      */}

      <Route
        path="/"
        element={
          token ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/login"
        element={
          token ? (
            <Navigate to="/home" replace />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />


      {/* ================= PROFILE ================= */}

      <Route
        path="/profile"
        element={<Profile />}
      />

      <Route
        path="/profile/:userId"
        element={<Profile />}
      />


      {/* ================= STORIES ================= */}

      <Route
        path="/create-story"
        element={<CreateStory />}
      />

      <Route
        path="/story/:storyId"
        element={<StoryViewer />}
      />


      {/* ================= EXPLORE ================= */}

      <Route
        path="/explore"
        element={<Explore />}
      />


      {/* ================= CHAT ================= */}

      <Route
        path="/chat"
        element={<Chat />}
      />


      {/* ================= NOTIFICATIONS ================= */}

      <Route
        path="/notifications"
        element={<Notifications />}
      />


      {/* ================= SETTINGS ================= */}

      <Route
        path="/settings"
        element={<Settings />}
      />

      <Route
        path="/blocked-users"
        element={<BlockedUsers />}
      />

      <Route
        path="/switch-account"
        element={<SwitchAccount />}
      />


      {/* ================= REELS ================= */}

      <Route
        path="/reels"
        element={<Reels />}
      />

      <Route
        path="/reels/:reelId"
        element={<Reels />}
      />
      <Route path="/live" element={<LiveStream />} />
<Route path="/live/:streamId" element={<LiveStream />} />


      {/* ================= MUSIC ================= */}

      <Route
  path="/music-upload"
  element={
    adminToken ? (
      <MusicUpload />
    ) : (
      <Navigate to="/admin-login" replace />
    )
  }
/>

      <Route
        path="/music-library"
        element={<MusicLibrary />}
      />


      {/* ================= NOTES ================= */}

      <Route
        path="/notes"
        element={<Note />}
      />


      {/* ================= HOME ================= */}

      <Route
        path="/home"
        element={<Home />}
      />


      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}

export default App;
