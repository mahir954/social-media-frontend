import { useState }  from "react";
import { useNavigate } from "react-router-dom";

function Settings() {
    const [showChangePassword, setShowChangePassword] = useState(false);
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "30px auto",
        padding: "20px",
          color: "#222",
      }}
    >
      <h1>Settings</h1>

      <button
        onClick={() => navigate("/profile")}
        style={{
          display: "block",
          width: "100%",
          padding: "15px",
          margin: "10px 0",
          border: "1px solid #ddd",
          borderRadius: "8px",
          background: "white",
            color: "#222",
          cursor: "pointer",
          textAlign: "left",
          fontSize: "16px",
        }}
      >
        ✏️ Edit Profile
      </button>

      <button
        onClick={() => navigate("/blocked-users")}
        style={{
          display: "block",
          width: "100%",
          padding: "15px",
          margin: "10px 0",
          border: "1px solid #ddd",
          borderRadius: "8px",
          background: "white",
            color: "#222",
          cursor: "pointer",
          textAlign: "left",
          fontSize: "16px",
        }}
      >
        🚫 Blocked Users
      </button>

      <button
        onClick={() => navigate("/switch-account")}
        style={{
          display: "block",
          width: "100%",
          padding: "15px",
          margin: "10px 0",
          border: "1px solid #ddd",
          borderRadius: "8px",
          background: "white",
            color: "#222",
          cursor: "pointer",
          textAlign: "left",
          fontSize: "16px",
        }}
      >
        🔄 Switch Account
      </button>
      <button
  onClick={() =>
    setShowChangePassword(!showChangePassword)
  }
  style={{
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "white",
    color: "#111",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    textAlign: "left",
  }}
>
  🔐 Change Password
</button>
{showChangePassword && (
  <div
    style={{
      marginTop: "15px",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "10px",
     background: "#fff",
        color: "#222",
    }}
  >
    <input
      type="password"
      placeholder="Current Password"
      value={currentPassword}
      onChange={(e) =>
        setCurrentPassword(e.target.value)
      }
      style={{
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
        boxSizing: "border-box",
           background: "#fff",
        color: "#222",
      }}
    />

    <input
      type="password"
      placeholder="New Password"
      value={newPassword}
      onChange={(e) =>
        setNewPassword(e.target.value)
      }
      style={{
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
        boxSizing: "border-box",
           background: "#fff",
        color: "#222",
      }}
    />

    <input
      type="password"
      placeholder="Confirm New Password"
      value={confirmPassword}
      onChange={(e) =>
        setConfirmPassword(e.target.value)
      }
      style={{
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
        boxSizing: "border-box",
           background: "#fff",
        color: "#222",
      }}
    />

    <button
      onClick={async () => {
        if (
          !currentPassword ||
          !newPassword ||
          !confirmPassword
        ) {
          alert("Please fill all fields");
          return;
        }

        if (newPassword !== confirmPassword) {
          alert("New passwords do not match");
          return;
        }

        try {
          const token = localStorage.getItem("token");

          const response = await fetch(
            "https://social-media-backend-9fag.onrender.com/api/auth/change-password",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                currentPassword,
                newPassword,
              }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            alert(data.message || "Failed to change password");
            return;
          }

          alert("Password changed successfully");

          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setShowChangePassword(false);
        } catch (error) {
          console.error("Change Password Error:", error);
          alert("Server error");
        }
      }}
      style={{
        width: "100%",
        padding: "10px",
        border: "none",
        borderRadius: "8px",
        background: "#1877f2",
        color: "white",
        fontWeight: "600",
        cursor: "pointer",
      }}
    >
      Change Password
    </button>
  </div>
)}

      <button
        onClick={() => navigate("/")}
        style={{
          display: "block",
          width: "100%",
          padding: "15px",
          margin: "10px 0",
          border: "1px solid #ddd",
          borderRadius: "8px",
          background: "white",
            color: "#222",
          cursor: "pointer",
          textAlign: "left",
          fontSize: "16px",
        }}
      >
        🏠 Back to Home
      </button>
    </div>
  );
}

export default Settings;
