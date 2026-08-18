import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

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
            email,
            password,
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
    <div className="login-page">
      <div className="login-background-shape shape-one"></div>
      <div className="login-background-shape shape-two"></div>

      <div className="login-container">

        {/* LEFT SIDE */}
        <div className="login-welcome">
          <div className="welcome-content">

            <div className="welcome-logo">
              <span>F</span>
            </div>

            <h1>Welcome Back!</h1>

            <p>
              Connect with your friends, share your moments
              and discover something new every day.
            </p>

            <div className="welcome-features">
              <div className="welcome-feature">
                <div className="feature-icon">👥</div>
                <div>
                  <strong>Connect</strong>
                  <span>Stay connected with people</span>
                </div>
              </div>

              <div className="welcome-feature">
                <div className="feature-icon">📸</div>
                <div>
                  <strong>Share</strong>
                  <span>Share your favorite moments</span>
                </div>
              </div>

              <div className="welcome-feature">
                <div className="feature-icon">✨</div>
                <div>
                  <strong>Explore</strong>
                  <span>Discover new content</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-card-wrapper">

          <div className="login-card">

            <div className="login-card-header">
              <div className="mobile-logo">
                <span>F</span>
              </div>

              <h2>Login</h2>

              <p>
                Welcome back! Please enter your details.
              </p>
            </div>

            <form onSubmit={handleLogin}>

              {/* EMAIL */}
              <div className="login-input-group">
                <label htmlFor="email">Email Address</label>

                <div className="login-input-wrapper">
                  <span className="input-icon">✉</span>

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="login-input-group">
                <label htmlFor="password">Password</label>

                <div className="login-input-wrapper">
                  <span className="input-icon">🔒</span>

                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* FORGOT PASSWORD */}
              <div className="login-options">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="forgot-password"
                >
                  Forgot Password?
                </button>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className="login-button"
              >
                <span>Login</span>
                <span className="login-arrow">→</span>
              </button>

            </form>

            {/* DIVIDER */}
            <div className="login-divider">
              <span>OR</span>
            </div>

            {/* REGISTER */}
            <div className="register-section">
              <p>Don't have an account?</p>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="create-account-button"
              >
                Create New Account
              </button>
            </div>

            <div className="login-footer">
              <span>© 2026 Fello</span>
              <span>•</span>
              <span>Connect. Share. Explore.</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;
