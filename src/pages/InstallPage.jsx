import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function InstallPage() {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      alert(
        "Install option browser ke menu me available ho sakta hai. Chrome ke ⋮ menu me 'Install app' select karein."
      );
      return;
    }

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img
          src="/fello-icon.png.jpeg"
          alt="Fello Social"
          style={styles.icon}
        />

        <h1>Fello Social</h1>

        <p style={styles.tagline}>
          Connect, Share & Chat with your friends
        </p>

        {!isInstalled && (
          <button style={styles.installButton} onClick={handleInstall}>
            📲 Install Fello Social
          </button>
        )}

        <button
          style={styles.loginButton}
          onClick={() => navigate("/login")}
        >
          Continue to Website
        </button>

        <p style={styles.smallText}>
          Install the app for a better experience.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    borderRadius: "20px",
    padding: "35px 25px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
  },

  icon: {
    width: "100px",
    height: "100px",
    borderRadius: "22px",
    objectFit: "cover",
    marginBottom: "15px",
  },

  tagline: {
    color: "#666",
    marginBottom: "30px",
  },

  installButton: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#111",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "12px",
  },

  loginButton: {
    width: "100%",
    padding: "14px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    background: "#fff",
    color: "#111",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  smallText: {
    marginTop: "18px",
    fontSize: "13px",
    color: "#888",
  },
};

export default InstallPage;
