import { useEffect, useState } from "react";

function BlockedUsers() {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://192.168.43.245:5000/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to fetch profile");
        return;
      }

      const blockedIds = data.user.blockedUsers || [];

      const usersResponse = await fetch(
        "http://192.168.43.245:5000/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const usersData = await usersResponse.json();

      if (usersResponse.ok) {
        const blocked = usersData.users.filter((user) =>
          blockedIds.some(
            (id) =>
              id.toString() === user._id.toString()
          )
        );

        setBlockedUsers(blocked);
      }
    } catch (error) {
      console.error("Blocked Users Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://192.168.43.245:5000/api/users/unblock/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || "Failed to unblock user"
        );
        return;
      }

      alert("User unblocked successfully");

      setBlockedUsers((prev) =>
        prev.filter(
          (user) =>
            user._id.toString() !==
            userId.toString()
        )
      );
    } catch (error) {
      console.error("Unblock Error:", error);
      alert("Server error");
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "30px auto",
        padding: "20px",
      }}
    >
      <h1>Blocked Users</h1>

      {blockedUsers.length === 0 ? (
        <p>No blocked users.</p>
      ) : (
        blockedUsers.map((user) => (
          <div
            key={user._id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px",
              marginBottom: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <img
                src={
                  user.profilePic
                    ? `http://192.168.43.245:5000${user.profilePic}`
                    : "https://randomuser.me/api/portraits/men/1.jpg"
                }
                alt={user.name}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              <strong>{user.name}</strong>
            </div>

            <button
              onClick={() =>
                handleUnblock(user._id)
              }
              style={{
                padding: "8px 15px",
                border: "none",
                borderRadius: "6px",
                background: "#1877f2",
                color: "white",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Unblock
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default BlockedUsers;