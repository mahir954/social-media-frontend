import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function InstallPage() {
  const navigate = useNavigate();

  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleInstallPrompt = (event) => {
      event.preventDefault();
      console.log("PWA install prompt available");
      setDeferredPrompt(event);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleInstallPrompt
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleInstallPrompt
      );
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
      alert(
        "Install prompt browser ne provide nahi kiya. Chrome menu se Install app select karein."
      );
      return;
    }

    deferredPrompt.prompt();

    const result = await deferredPrompt.userChoice;

    console.log("Install result:", result.outcome);

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

        <button
          onClick={installApp}
          style={styles.installButton}
        >
          📲 Install Fello Social
        </button>

        <button
          onClick={() => navigate("/login")}
          style={styles.loginButton}
        >
          Continue to Website
        </button>

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
};

export default InstallPage;
