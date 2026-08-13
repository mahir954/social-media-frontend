import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://social-media-backend-9fag.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("user", JSON.stringify(data.user));

      const savedAccounts =
        JSON.parse(localStorage.getItem("savedAccounts")) || [];

      const accountExists = savedAccounts.some(
        (account) => account.userId === data.user._id
      );

      if (!accountExists) {
        savedAccounts.push({
          userId: data.user._id,
          name: data.user.name,
          email: data.user.email,
          token: data.token,
        });

        localStorage.setItem(
          "savedAccounts",
          JSON.stringify(savedAccounts)
        );
      }

      alert("Login successful!");

      console.log("User:", data.user);
      console.log("Token saved successfully");

      navigate("/home");

    } catch (error) {
      console.error("Login Error:", error);
      alert("Server error");
    }
  };

  const handleForgotPassword = async () => {
    const email = prompt("Enter your registered email:");

    if (!email) return;

    try {
      const response = await fetch(
        "https://social-media-backend-9fag.onrender.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      console.log("Response Status:", response.status);
      console.log("Response Data:", data);

      if (!response.ok) {
        alert(data.message || "Failed to process request");
        return;
      }

      alert(
        `Password reset token generated:\n\n${data.resetToken}`
      );

    } catch (error) {
      console.error("Forgot Password Error:", error);
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>Login Page</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">
          Login
        </button>

        <button
          type="button"
          onClick={handleForgotPassword}
          style={{
            display: "block",
            width: "100%",
            marginTop: "15px",
            padding: "10px",
            background: "transparent",
            border: "none",
            color: "#1877f2",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          Forgot Password?
        </button>

        <button
          type="button"
          onClick={() => navigate("/register")}
          style={{
            display: "block",
            width: "100%",
            marginTop: "10px",
            padding: "10px",
            background: "#1877f2",
            border: "none",
            borderRadius: "5px",
            color: "white",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          Create New Account
        </button>
      </form>
    </div>
  );
}

export default Login;
