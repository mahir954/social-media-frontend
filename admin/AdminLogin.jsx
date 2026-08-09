import { useState } from "react";
import "./AdminLogin.css";

function AdminLogin() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleLogin = async (e) => {
e.preventDefault();

try {
const response = await fetch("http://localhost:5000/api/admin/login", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
email,
password,
}),
});

const data = await response.json();

if (response.ok) {
  localStorage.setItem("adminToken", data.token);

  alert("Admin Login Successful");

  window.location.href = "/admin";
} else {
  alert(data.message);
}

} catch (error) {
console.error("Admin Login Error:", error);
alert("Server se connect nahi ho pa raha");
}
};
return (
<div className="admin-login-container">
<div className="admin-login-box">

    <h1>Admin Login</h1>

    <form onSubmit={handleLogin}>

     <input
type="email"
placeholder="Admin Email"
value={email}
onChange={(e) => setEmail(e.target.value)}
style={{ display: "block", marginBottom: "15px" }}
/>

<input
type="password"
placeholder="Admin Password"
value={password}
onChange={(e) => setPassword(e.target.value)}
style={{ display: "block", marginBottom: "15px" }}
/>

      <button type="submit">
        Login
      </button>

    </form>

  </div>
</div>

);
}

export default AdminLogin;