import Admin from "../admin/Admin";
import AdminLogin from "../admin/AdminLogin";
import { Routes, Route } from "react-router-dom";
import Notification from "./pages/Notifications";

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
import Settings from "./pages/Settings";import BlockedUsers from "./pages/BlockedUsers";
import SwitchAccount from "./pages/SwitchAccount";
import MusicUpload from "./pages/MusicUpload";
import MusicLibrary from "./pages/MusicLibrary";



import NotFound from "./pages/NotFound";

import Reels from "./pages/Reels";
import Note from "./components/Note";

function App() {
  return (
    <Routes>
      <Route path="/admin"
      element={<Admin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/:userId" element={<Profile />} />
      <Route path="/create-story" element={<CreateStory />} />
      <Route path="/story/:storyId" element={<StoryViewer />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route
  path="/reset-password/:token"
  element={<ResetPassword />}
/>
      <Route path="/settings" element={<Settings />} />
      <Route path="/blocked-users"
      element={<BlockedUsers />} />

      <Route path="*" element={<NotFound />} /><Route
  path="/switch-account"
  element={<SwitchAccount />}
/>
      <Route path="/reels"
      element={<Reels />} />
      <Route path="/reels/:reelId" element={<Reels />} />
      <Route
  path="/music-upload"
  element={<MusicUpload />}
/>
<Route
  path="/music-library"
  element={<MusicLibrary />}
/>
<Route path="/notes" element={<Note />} />
    </Routes>
  );
}

export default App;