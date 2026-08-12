import Admin from "../admin/Admin";
import AdminLogin from "../admin/AdminLogin";

import { Routes, Route, Navigate } from "react-router-dom";
import InstallPage from " ./pages/InstallPage";

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

function App() {
  const token = localStorage.getItem("token");
  return (
    <Routes>

      {/* Admin */}
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Authentication */}
      <Route path="/" element={<InstallPage />} />
      <Route path="/login" element={
      token ? <Navigate to="/home" replace /> :
      <Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Profile */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/:userId" element={<Profile />} />

      {/* Stories */}
      <Route path="/create-story" element={<CreateStory />} />
      <Route path="/story/:storyId" element={<StoryViewer />} />

      {/* Explore */}
      <Route path="/explore" element={<Explore />} />

      {/* Chat */}
      <Route path="/chat" element={<Chat />} />

      {/* Notifications */}
      <Route path="/notifications" element={<Notifications />} />

      {/* Settings */}
      <Route path="/settings" element={<Settings />} />
      <Route path="/blocked-users" element={<BlockedUsers />} />
      <Route path="/switch-account" element={<SwitchAccount />} />

      {/* Reels */}
      <Route path="/reels" element={<Reels />} />
      <Route path="/reels/:reelId" element={<Reels />} />

      {/* Music */}
      <Route path="/music-upload" element={<MusicUpload />} />
      <Route path="/music-library" element={<MusicLibrary />} />

      {/* Notes */}
      <Route path="/notes" element={<Note />} />

      {/* Home */}
      <Route path="/home" element={<Home />} />

      {/* 404 - Always keep this last */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default App;
