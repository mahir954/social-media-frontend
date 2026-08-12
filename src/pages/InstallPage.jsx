import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function InstallPage() {
  const navigate = useNavigate();

  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstalled(true);
      }
    };

    checkInstalled();

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      alert(
        "Install option abhi available nahi hai. Chrome ke ⋮ menu se 'Install app' select karein."
      );
      return;
    }

    installPrompt.prompt();

    const result = await installPrompt.userChoice;

    if (result.outcome === "accepted") {
      setIsInstalled(true);
    }

    setInstallPrompt(null);
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
          <button
            onClick={handleInstall}
            style={styles.installButton}
          >
            📲 Install Fello Social
          </button>
        )}

        <button
          onClick={() => navigate("/login")}
          style={styles.loginButton}
        >
          Continue to Website
        </button>

        <p style={styles.smallText}>
          Install Fello Social for a better app experience.
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
    fontSize: "16px",
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
