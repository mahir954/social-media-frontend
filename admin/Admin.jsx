import { useEffect, useState } from "react";
import "./Admin.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function Admin() {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalReels, setTotalReels] = useState(0);
     const [totalReports, setTotalReports] = useState(0);
     const [activePage, setActivePage] = useState("dashboard");
     const [users, setUsers] = useState([]);
     const [searchText, setSearchText] = useState("");
     const [selectedUser, setSelectedUser] = useState(null);
     const [posts, setPosts] = useState([]);
     const [postSearch, setPostSearch] = useState("");
     const [reels, setReels] = useState([]);
     const [reelSearch, setReelSearch] = useState("");
     const [reports, setReports] = useState([]);
     const [reportSearch, setReportSearch] = useState("");
     const [selectedReport, setSelectedReport] = useState(null);
const [showReportModal, setShowReportModal] = useState(false);
const [comments, setComments] = useState([]);
const [commentSearch, setCommentSearch] = useState("");
const [selectedComment, setSelectedComment] = useState(null);
const [showCommentModal, setShowCommentModal] = useState(false);
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const chartData = [
  { name: "Users", value: totalUsers },
  { name: "Posts", value: totalPosts },
  { name: "Reels", value: totalReels },
  { name: "Reports", value: totalReports },
];
    useEffect(() => {
const adminToken = localStorage.getItem("adminToken");

if (!adminToken) {
window.location.href = "/admin-login";
return;
}
fetch("https://social-media-backend-9fag.onrender.com/api/admin/stats/users")
.then((response) => response.json())
.then((data) =>{
    setTotalUsers(data.totalUsers);
})
fetch("https://social-media-backend-9fag.onrender.com/api/admin/stats/posts")
.then((response) => response.json())
.then((data) => {
setTotalPosts(data.totalPosts);
})
fetch("https://social-media-backend-9fag.onrender.com/api/admin/stats/reels")
.then((response) => response.json())
.then((data) => {
setTotalReels(data.totalReels);
})
fetch("https://social-media-backend-9fag.onrender.com/api/admin/stats/reports")
.then((response) => response.json())
.then((data) => {
setTotalReports(data.totalReports);
})
fetch("https://social-media-backend-9fag.onrender.com/api/admin/users")
  .then((response) => response.json())
  .then((data) => {
    console.log("All Users:", data);
    setUsers(data);
  })
  fetch("https://social-media-backend-9fag.onrender.com/api/admin/posts")
  .then((response) => response.json())
  .then((data) => {
    console.log("All Posts:", data);
    setPosts(data);
  })
  fetch("https://social-media-backend-9fag.onrender.com/api/admin/reels")
  .then((response) => response.json())
  .then((data) => {
    console.log("All Reels:", data);
    setReels(data);
  })
  fetch("https://social-media-backend-9fag.onrender.com/api/admin/reports")
  .then((response) => response.json())
  .then((data) => {
    setReports(data);
  })
  fetch("https://social-media-backend-9fag.onrender.com/api/admin/comments")
  .then((response) => response.json())
  .then((data) => {
    setComments(data);
  })
  .catch((error) => {
    console.error("Comments Fetch Error:", error);
  })
  .catch((error) => {
    console.error("Reports Fetch Error:", error);
  })
  .catch((error) => {
    console.error("Reels Fetch Error:", error);
  })
  .catch((error) => {
    console.error("Posts Fetch Error:", error);
  })
  .catch((error) => {
    console.error("Users Fetch Error:", error);
  })
.catch((error) => {
console.error("Reports Count Error:", error);
})
.catch((error) => {
console.error("Reels Count Error:", error);
})
.catch((error) => {
console.error("Posts Count Error:", error);
})
.catch((error) =>{
    console.error("Users Count Error:",error);
});
}, []);
//logout
const handleLogout = () => {
  const confirmLogout = window.confirm(
    "Are you sure you want to logout?"
  );

  if (confirmLogout) {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin-login";
  }
};
//delete user
const handleDeleteUser = async (userId) => {
const confirmDelete = window.confirm(
"Are you sure you want to delete this user?"
);

if (!confirmDelete) return;

try {
const response = await fetch(
"https://social-media-backend-9fag.onrender.com/api/admin/users/${userId}",
{
method: "DELETE",
}
);

const data = await response.json();

if (response.ok) {
  alert(data.message);

  setUsers((prevUsers) =>
    prevUsers.filter((user) => user._id !== userId)
  );
} else {
  alert(data.message);
}

} catch (error) {
console.error("Delete User Error:", error);
alert("Failed to delete user");
}
};
const handleBlockUser = async (userId) => {
  try {
    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/admin/users/${userId}/block`,
      {
        method: "PUT",
      }
    );

    const data = await response.json();

    if (response.ok) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? { ...user, isBlocked: data.isBlocked }
            : user
        )
      );

      alert(data.message);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Block User Error:", error);
    alert("Failed to update user status");
  }
};
const handleDeletePost = async (postId) => {

const confirmDelete = window.confirm(
  "Are you sure you want to delete this post?"
);

if (!confirmDelete) return;

try {

const response = await fetch(
 `https://social-media-backend-9fag.onrender.com/api/admin/posts/${postId}`,
  {
    method: "DELETE",
  }
);

const data = await response.json();

if(response.ok){

alert(data.message);

setPosts((prevPosts)=>
  prevPosts.filter(
    (post)=>post._id !== postId
  )
);

}else{
alert(data.message);
}

}catch(error){
console.error("Delete Post Error:", error);
}

};
const handleDeleteReel = async (reelId) => {

const confirmDelete = window.confirm(
  "Are you sure you want to delete this reel?"
);

if (!confirmDelete) return;

try {

const response = await fetch(
  `https://social-media-backend-9fag.onrender.com/api/admin/reels/${reelId}`,
  {
    method: "DELETE",
  }
);

const data = await response.json();

if(response.ok){

alert(data.message);

setReels((prevReels)=>
  prevReels.filter(
    (reel)=> reel._id !== reelId
  )
);

}else{

alert(data.message);

}

}catch(error){

console.error("Delete Reel Error:", error);

}

};
const handleViewUser = (id) => {
  const user = users.find((user) =>
  user._id === id);
  console.log("Selected User:", user);
  setSelectedUser(user);
};
const handleDeleteReport = async (reportId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this report?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/admin/reports/${reportId}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert(data.message);

      setReports((prevReports) =>
        prevReports.filter(
          (report) => report._id !== reportId
        )
      );
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Delete Report Error:", error);
    alert("Failed to delete report");
  }
};
const handleViewReport = (report) => {
  setSelectedReport(report);
  setShowReportModal(true);
};
const handleViewComment = (comment) => {
  setSelectedComment(comment);
  setShowCommentModal(true);
};
const handleDeleteComment = async (
  type,
  parentId,
  commentId
) => {
  if (!window.confirm("Delete this comment?")) return;

  try {
    const response = await fetch(
      `https://social-media-backend-9fag.onrender.com/api/admin/comments/${type}/${parentId}/${commentId}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert("Comment deleted successfully");

    setComments(
      comments.filter(
        (comment) => comment._id !== commentId
      )
    );

  } catch (error) {
    console.error("Delete Comment Error:", error);
    alert("Failed to delete comment");
  }
};
const handleChangeAdminPassword = async () => {
  try {
    const response = await fetch(
      "https://social-media-backend-9fag.onrender.com/api/admin/change-password",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    alert(data.message);

    setCurrentPassword("");
    setNewPassword("");

  } catch (error) {
    console.error(error);
    alert("Failed to change password");
  }
};
const handleExportUsers = async () => {
  try {
    const response = await fetch(
      "https://social-media-backend-9fag.onrender.com/api/admin/export/users"
    );

    const users = await response.json();

    const headers = [
      "Name",
      "Email",
      "Blocked",
      "Private",
    ];

    const rows = users.map((user) => [
      user.name,
      user.email,
      user.isBlocked,
      user.isPrivate,
    ]);

    const csv =
      [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "users.csv";

    a.click();

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error(error);
    alert("Export failed");
  }
};
const handleBackupDatabase = async () => {
  try {
    const response = await fetch(
      "https://social-media-backend-9fag.onrender.com/api/admin/backup"
    );

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "database-backup.json";
    a.click();

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.log(error);
    alert("Backup failed");
  }
};
const handleExportReport = async () => {
  try {
    const response = await fetch(
      "https://social-media-backend-9fag.onrender.com/api/admin/export/report"
    );

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "admin-report.csv";

    a.click();

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.log(error);
    alert("Report export failed");
  }
};

return (
<div className="admin-container">

  <aside className="admin-sidebar">
    <h2>Admin Panel</h2>

    <ul>
      <li onClick={() =>
        setActivePage("dashboard")
      }>Dashboard</li>
      <li onClick={() =>
        setActivePage("users")}>Users</li>
      
      <li onClick={() =>
        setActivePage("posts")
      }>Posts</li>
      <li onClick={() =>
        setActivePage("reels")
      }>Reels</li>
      <li onClick={() =>
        setActivePage("reports")
      }>Reports</li>
      <li onClick={() =>
        setActivePage("comments")
      }>Comments</li>
      <li onClick={() =>
        setActivePage("settings")
      }>Settings</li>
    </ul>
  </aside>

  <main className="admin-main">
    <button className="admin-logout-btn"
    onClick={handleLogout}>Logout</button>
    {activePage === "dashboard" && (
<>
<h1>Dashboard</h1>
<p>Welcome to Social Media App Admin Panel</p>

<div className="admin-cards">
  <div className="admin-card">
    <div className="dashboard-card">
    <h3>Total Users</h3>
    <p>{totalUsers}</p>
    </div>
  </div>

  <div className="admin-card">
    <div className="dashboard-card">
    <h3>Total Posts</h3>
    <p>{totalPosts}</p>
    </div>
  </div>

  <div className="admin-card">
    <div className="dashboard-card">
    <h3>Total Reels</h3>
    <p>{totalReels}</p>
    </div>
  </div>

  <div className="admin-card">
    
    <div className="dashboard-card">
    <h3>Total Reports</h3>
    <p>{totalReports}</p>
    </div>
    </div>
  </div>
<div className="charts-container">
  <div className="chart-card">
  <h3>📊 Platform Overview</h3>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={chartData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#2563eb" />
    </BarChart>
  </ResponsiveContainer>
</div>

  <div className="chart-card">
  <h3>🥧 Posts Overview</h3>

  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={chartData}
        dataKey="value"
        nameKey="name"
        outerRadius={100}
        label
      >
        <Cell fill="#3b82f6" />
        <Cell fill="#22c55e" />
        <Cell fill="#f59e0b" />
        <Cell fill="#ef4444" />
      </Pie>

      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div>
</div>


</>
)}

{activePage === "users" && (
<>
<h1>Users</h1>
<input
  type="text"
  placeholder="Search by Name or Email..."
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    margin: "15px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  }}
/>


<table
  style={{
    width: "100%",
    borderCollapse: "collapse",
  }}
  border="1"
  cellPadding="10"
>
  <thead>
    <tr>
      <th>Profile</th>
      <th>Name</th>
      <th>Email</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {users
     .filter(
    (user) =>
      user.name
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(searchText.toLowerCase())
  )
    .map((user) => (
      <tr key={user._id}>
         <td>
    <img
      src={
        user.profilePic
          ? `https://social-media-backend-9fag.onrender.com${user.profilePic}`
          : "https://randomuser.me/api/portraits/men/1.jpg"
      }
      alt="Profile"
      style={{
        width: "45px",
        height: "45px",
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  </td>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>
  <span
    className={`status-badge ${
      user.isBlocked
        ? "status-blocked"
        : "status-active"
    }`}
  >
    {user.isBlocked ? "🔴 Blocked" : "🟢 Active"}
  </span>
</td>
        <td>
  <button
  className={`block-btn ${
    user.isBlocked ? "unblock-user" : "block-user"
  }`}
  onClick={() => handleBlockUser(user._id)}
>
  {user.isBlocked ? "✅ Unblock" : "🚫 Block"}
</button>
</td>
<td>
  <button
  className="view-user-btn"
  onClick={() => handleViewUser(user._id)}
>
  👁️ View
</button>
</td>
        <td>
  <button
  className="delete-user-btn"
  onClick={() => handleDeleteUser(user._id)}
>
  🗑️ Delete
</button>
</td>
      </tr>
    ))}
  </tbody>
</table>
{selectedUser && (
  <div className="user-details-card">

    <button
      className="close-user-btn"
      onClick={() => setSelectedUser(null)}
    >
      ❌ Close
    </button>

    <h2>User Details</h2>

    <img
      src={
        selectedUser.profilePic
          ? `https://social-media-backend-9fag.onrender.com${selectedUser.profilePic}`
          : "https://randomuser.me/api/portraits/men/1.jpg"
      }
      alt="Profile"
      style={{
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />

    <p><b>Name:</b> {selectedUser.name}</p>

    <p><b>Email:</b> {selectedUser.email}</p>
    <p>
  <b>Bio:</b> {selectedUser.bio || "No Bio"}
</p>
    <p><b>User Id:</b> {selectedUser._id}</p>
    <p>
  <b>Total Posts:</b> {selectedUser.postCount || 0}
</p>

<p>
  <b>Total Reels:</b> {selectedUser.reelCount || 0}
</p>

<p>
  <b>Followers:</b> {selectedUser.followers?.length || 0}
</p>

<p>
  <b>Following:</b> {selectedUser.following?.length || 0}
</p>
<p>
  <b>Joined:</b>{" "}
  {selectedUser.createdAt
    ? new Date(selectedUser.createdAt).toLocaleDateString()
    : "N/A"}
</p>

    <p>
      <b>Status:</b>{" "}
      {selectedUser.isBlocked ? "🔴 Blocked" : "🟢 Active"}
    </p>
    <h3>User Posts</h3>

<div className="admin-post-preview">
  {selectedUser.posts && selectedUser.posts.length > 0 ? (
    selectedUser.posts.map((post) => (
      <div key={post._id} className="admin-post-card">
        {console.log("POST DATA:", post)}
        <p>{post.content}</p>

        {post.image && (
          <img
            src={`https://social-media-backend-9fag.onrender.com${post.image}`}
            alt="Post"
            style={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        )}
      </div>
    ))
  ) : (
    <p>No Posts</p>
  )}
</div>
<h3>User Reels</h3>

<div className="admin-reel-preview">
  {selectedUser.reels && selectedUser.reels.length > 0 ? (
    selectedUser.reels.map((reel) => (
      <div key={reel._id} className="admin-reel-card">
        {console.log("REEL VIDEO PATH:", reel.video)}

        {reel.video && (
          <video
            src={`https://social-media-backend-9fag.onrender.com/uploads/${reel.video}`}
            controls
            preload="metadata"
            style={{
              width: "150px",
              height: "220px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        )}

      </div>
    ))
  ) : (
    <p>No Reels</p>
  )}
</div>
  </div>
)}

</>
)}
{activePage === "posts" && (
<>
<h1>Posts</h1>
<input
  type="text"
  placeholder="Search by post content or user name..."
  value={postSearch}
  onChange={(e) => setPostSearch(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    margin: "15px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  }}
/>

<table
  style={{
    width: "100%",
    borderCollapse: "collapse",
  }}
  border="1"
  cellPadding="10"
>
  <thead>
    <tr>
       <th>Profile</th>
      <th>User</th>    
      <th>Content</th>
      <th>Image</th>
      <th>Date</th>
    </tr>
  </thead>

  <tbody>
    {posts
    .filter((post) =>
  post.content
    ?.toLowerCase()
    .includes(postSearch.toLowerCase()) ||
  post.user?.name
    ?.toLowerCase()
    .includes(postSearch.toLowerCase())
)
    .map((post) => (
      <tr key={post._id}>
        <td>
          <img
            src={
              post.user?.profilePic
                ? `https://social-media-backend-9fag.onrender.com${post.user.profilePic}`
                : "https://randomuser.me/api/portraits/men/1.jpg"
            }
            alt="Profile"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </td>

        <td>
          {post.user?.name || "Unknown"}
        </td>

        

        <td>
          {post.content}
        </td>

        <td>
          {post.image && (
            <img
              src={`https://social-media-backend-9fag.onrender.com${post.image}`}
              alt="Post"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          )}
        </td>

        <td>
          {new Date(post.createdAt).toLocaleDateString()}
        </td>
        <td>
  <button
    className="delete-user-btn"
    onClick={() => handleDeletePost(post._id)}
  >
    🗑️ Delete
  </button>
</td>

      </tr>
    ))}
  </tbody>
</table>

</>
)}
{activePage === "reels" && (
<>
<h1>Reels</h1>
<input
type="text"
placeholder="Search by user name or caption..."
value={reelSearch}
onChange={(e)=>setReelSearch(e.target.value)}
style={{
width:"100%",
padding:"10px",
margin:"15px 0",
borderRadius:"8px",
border:"1px solid #ccc",
fontSize:"16px"
}}
/>

<p>Manage all user reels here</p>

<table
style={{
width:"100%",
borderCollapse:"collapse",
}}
border="1"
cellPadding="10"
>

<thead>
<tr>
<th>Profile</th>
<th>User</th>
<th>Video</th>
<th>Caption</th>
<th>Date</th>
</tr>
</thead>

<tbody>

{reels
.filter((reel)=>
reel.caption?.toLowerCase()
.includes(reelSearch.toLowerCase()) ||
reel.user?.name?.toLowerCase()
.includes(reelSearch.toLowerCase())
)
.map((reel)=>(
<tr key={reel._id}>
  <td>
<img
src={
reel.user?.profilePic
?
`https://social-media-backend-9fag.onrender.com${reel.user.profilePic}`
:
"https://randomuser.me/api/portraits/men/1.jpg"
}
alt="Profile"
style={{
width:"40px",
height:"40px",
borderRadius:"50%",
objectFit:"cover"
}}
/>
</td>

<td>
{reel.user?.name || "Unknown"}
</td>



<td>
<video
src={`https://social-media-backend-9fag.onrender.com/uploads/${reel.video}`}
controls
style={{
width:"120px",
height:"180px",
objectFit:"cover"
}}
/>
</td>

<td>
{reel.caption || "No Caption"}
</td>

<td>
{new Date(reel.createdAt).toLocaleDateString()}
</td>
<td>
<button
className="delete-user-btn"
onClick={()=>handleDeleteReel(reel._id)}
>
🗑️ Delete
</button>
</td>

</tr>
))}

</tbody>

</table>

</>
)}
{activePage === "reports" && (
  <>
    <h1>Reports</h1>
    <input
  type="text"
  placeholder="🔍 Search by reporter or reason..."
  value={reportSearch}
  onChange={(e) => setReportSearch(e.target.value)}
  style={{
    width: "300px",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  }}
/>

    <table
      border="1"
      cellPadding="10"
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr>
          <th>Profile</th>
          <th>Reporter</th>
          <th>Email</th>
          <th>Reported On</th>
          <th>Reason</th>
          <th>Type</th>
          <th>Action</th>
          
        </tr>
      </thead>

      <tbody>
        {reports
          .filter((report) => {
    const search = reportSearch.toLowerCase();

    return (
      report.reporter?.name
        ?.toLowerCase()
        .includes(search) ||
      report.reporter?.email
        ?.toLowerCase()
        .includes(search) ||
      report.reason
        ?.toLowerCase()
        .includes(search) ||
      report.type
        ?.toLowerCase()
        .includes(search)
    );
  })
        .map((report) => (
          <tr key={report._id}>
            <td>
  <img
    src={
      report.reporter?.profilePic
        ? `https://social-media-backend-9fag.onrender.com${report.reporter.profilePic}`
        : "https://randomuser.me/api/portraits/men/1.jpg"
    }
    alt="Reporter"
    style={{
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      objectFit: "cover",
    }}
  />
</td>
            <td>{report.reporter?.name}</td>
            <td>{report.reporter?.email}</td>
            <td>
  {new Date(report.createdAt).toLocaleString()}
</td>
            <td>{report.reason}</td>
            <td>{report.type}</td>
            <td>
              <button
  className="view-user-btn"
  onClick={() => handleViewReport(report)}
>
  👁️ View
</button>
            </td>
            <td>
  <button
    className="delete-user-btn"
    onClick={() =>
      handleDeleteReport(report._id)
    }
  >
    🗑️ Delete
  </button>
</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
)}
{showReportModal && selectedReport && (
  <div className="report-modal">
    <div className="report-modal-content">
      <h2>Report Details</h2>
      <img
  src={
    selectedReport.reporter?.profilePic
      ? `https://social-media-backend-9fag.onrender.com${selectedReport.reporter.profilePic}`
      : "https://randomuser.me/api/portraits/men/1.jpg"
  }
  alt="Reporter"
  style={{
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "15px",
  }}
/>

      <p><b>Reporter:</b> {selectedReport.reporter?.name}</p>
      <p><b>Email:</b> {selectedReport.reporter?.email}</p>
      <p><b>Reason:</b> {selectedReport.reason}</p>
      <p><b>Type:</b> {selectedReport.type}</p>
      <p>
        <b>Date:</b>{" "}
        {new Date(selectedReport.createdAt).toLocaleString()}
      </p>
      <p><b>Report ID:</b> {selectedReport._id}</p>

<p>
  <b>Reported Item ID:</b>{" "}
  {selectedReport.reportedItem?._id || "N/A"}
</p>

{selectedReport.reportedItem?._id && (
  <>
    <hr />

    <h3>Reported Content</h3>

    <p>
      <b>Owner:</b>{" "}
      {selectedReport.reportedItem?.user?.name || "Unknown"}
    </p>

    {selectedReport.reportedItem?.user?.profilePic && (
      <img
        src={`https://social-media-backend-9fag.onrender.com${selectedReport.reportedItem.user.profilePic}`}
        alt="Owner"
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          objectFit: "cover",
          marginBottom: "10px",
        }}
      />
    )}

    <p>
      <b>Content:</b>{" "}
      {selectedReport.reportedItem?.content ||
        selectedReport.reportedItem?.caption ||
        "No text"}
    </p>

    {selectedReport.reportedItem?.image && (
      <img
        src={`https://social-media-backend-9fag.onrender.com${selectedReport.reportedItem.image}`}
        alt="Reported"
        style={{
          width: "100%",
          borderRadius: "10px",
          marginTop: "10px",
        }}
      />
    )}
  </>
)}

      <button
        onClick={() => setShowReportModal(false)}
      >
        Close
      </button>
    </div>
  </div>
)}
{activePage === "comments" && (
  <>
    <h1>Comments</h1>

    <input
      type="text"
      placeholder="Search comments..."
      value={commentSearch}
      onChange={(e) => setCommentSearch(e.target.value)}
    />

    <table border="1" cellPadding="10" style={{ width: "100%" }}>
      <thead>
        <tr>
          <th>Profile</th>
          <th>User</th>
          <th>Comment</th>
          <th>Type</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {comments
          .filter((comment) =>
            comment.text
              .toLowerCase()
              .includes(commentSearch.toLowerCase())
          )
          .map((comment) => (
            <tr key={comment._id}>
              <td>
  <img
    src={
      comment.user?.profilePic
        ? `https://social-media-backend-9fag.onrender.com${comment.user.profilePic}`
        : "https://randomuser.me/api/portraits/men/1.jpg"
    }
    alt="Profile"
    style={{
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      objectFit: "cover",
    }}
  />
</td>
              <td>{comment.user?.name}</td>
              <td>{comment.text}</td>
              <td>{comment.type}</td>
              <td>
                {new Date(comment.createdAt).toLocaleString()}
              </td>
              <td>
  <button
    className="view-user-btn"
    onClick={() => handleViewComment(comment)}
  >
    👁️ View
  </button>
</td>
<button
  className="delete-user-btn"
  onClick={() =>
    handleDeleteComment(
      comment.type,
      comment.parentId,
      comment._id
    )
  }
>
  🗑️ Delete
</button>
            </tr>
          ))}
      </tbody>
    </table>
  </>
)}
{showCommentModal && selectedComment && (
  <div className="report-modal">
    <div className="report-modal-content">
      <h2>Comment Details</h2>

      {selectedComment.user?.profilePic && (
        <img
          src={`https://social-media-backend-9fag.onrender.com${selectedComment.user.profilePic}`}
          alt="User"
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "15px",
          }}
        />
      )}

      <p><b>User:</b> {selectedComment.user?.name}</p>
      <p><b>Email:</b> {selectedComment.user?.email}</p>
      <p><b>Type:</b> {selectedComment.type}</p>
      <p><b>Comment:</b> {selectedComment.text}</p>
      <p><b>Post/Reel Owner:</b> {selectedComment.owner}</p>
      <p><b>Content:</b> {selectedComment.parentContent}</p>
      <p>
        <b>Date:</b>{" "}
        {new Date(selectedComment.createdAt).toLocaleString()}
      </p>

      <button
        onClick={() => setShowCommentModal(false)}
      >
        Close
      </button>
    </div>
  </div>
)}
{activePage === "settings" && (
  <>
    <h1>Settings</h1>

    <div className="settings-card">

      <h3>Admin Settings</h3>

     <h3>Change Admin Password</h3>

<input
  type="password"
  placeholder="Current Password"
  value={currentPassword}
  onChange={(e) => setCurrentPassword(e.target.value)}
/>

<br />
<br />

<input
  type="password"
  placeholder="New Password"
  value={newPassword}
  onChange={(e) => setNewPassword(e.target.value)}
/>

<br />
<br />

<button
  className="setting-btn"
  onClick={handleChangeAdminPassword}
>
  Change Password
</button>
<div style={{
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  width: "250px"
}}>

  <button
    onClick={handleExportUsers}
    style={{
      padding: "12px",
      background: "#16a34a",
      color: "white",
      border: "none",
      borderRadius: "10px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer"
    }}
  >
    📄 Export Users
  </button>

  <button
    onClick={handleBackupDatabase}
    style={{
      padding: "12px",
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "10px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer"
    }}
  >
    💾 Backup Database
  </button>
  <button
  onClick={handleExportReport}
  style={{
    padding: "12px",
    background: "#f59e0b",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer"
  }}
>
  📊 Export Report
</button>
<button className="admin-logout-btn"
    onClick={handleLogout}>Logout</button>

</div>
     


    </div>
  </>
)}

  </main>

</div>

);
}

export default Admin;
