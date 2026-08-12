import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function InstallPage() {
  const navigate = useNavigate();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();

      console.log("Fello install prompt available");

      setDeferredPrompt(event);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
      alert(
        "Install option abhi available nahi hai. Chrome ke menu (⋮) se Install app select karein."
      );
      return;
    }

    try {
      // Chrome ka actual Install / Cancel popup
      deferredPrompt.prompt();

      const result = await deferredPrompt.userChoice;

      console.log("Install choice:", result.outcome);

      if (result.outcome === "accepted") {
        // Sirf installing message dikhayenge.
        // 100% ya Installed nahi dikhayenge.
        setInstalling(true);
      } else {
        // User ne Cancel kiya
        setInstalling(false);
      }
    } catch (error) {
      console.error("Install error:", error);
      setInstalling(false);
    }

    setDeferredPrompt(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* App Icon */}
        <img
          src="/fello-icon.png.jpeg"
          alt="Fello Social"
          style={styles.icon}
        />

        {/* App Name */}
        <h1 style={styles.title}>
          Fello Social
        </h1>

        <p style={styles.tagline}>
          Connect, Share & Chat with your friends
        </p>

        {/* Installing */}
        {installing ? (
          <div style={styles.installingBox}>

            <div style={styles.spinner}></div>

            <h3 style={styles.installingTitle}>
              Installing Fello Social...
            </h3>

            <p style={styles.installingText}>
              Please wait while the app is being installed.
            </p>

            <div style={styles.progressBackground}>
              <div style={styles.progressMoving}></div>
            </div>

            <p style={styles.waitText}>
              Installation in progress...
            </p>

          </div>
        ) : (
          <>
            {/* Install Button */}
            <button
              type="button"
              onClick={installApp}
              style={styles.installButton}
            >
              📲 Install Fello Social
            </button>

            {/* Continue Website */}
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={styles.loginButton}
            >
              Continue to Website
            </button>
          </>
        )}

        <p style={styles.smallText}>
          Install Fello Social for a faster and better experience.
        </p>

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
    padding: "20px",
    boxSizing: "border-box",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    borderRadius: "22px",
    padding: "35px 25px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
    boxSizing: "border-box",
  },

  icon: {
    width: "105px",
    height: "105px",
    borderRadius: "24px",
    objectFit: "cover",
    marginBottom: "15px",
  },

  title: {
    margin: "5px 0 8px",
    fontSize: "28px",
    fontWeight: "700",
    color: "#111111",
  },

  tagline: {
    color: "#666666",
    fontSize: "15px",
    lineHeight: "1.5",
    marginBottom: "30px",
  },

  installButton: {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "11px",
    background: "#111111",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "12px",
  },

  loginButton: {
    width: "100%",
    padding: "15px",
    border: "1px solid #dddddd",
    borderRadius: "11px",
    background: "#ffffff",
    color: "#111111",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  installingBox: {
    width: "100%",
    marginBottom: "20px",
  },

  spinner: {
    width: "48px",
    height: "48px",
    margin: "0 auto 16px",
    borderRadius: "50%",
    border: "4px solid #e5e5e5",
    borderTop: "4px solid #111111",
    animation: "felloSpin 0.9s linear infinite",
  },

  installingTitle: {
    margin: "0 0 8px",
    fontSize: "19px",
    fontWeight: "600",
    color: "#111111",
  },

  installingText: {
    margin: "0 0 16px",
    fontSize: "13px",
    color: "#777777",
  },

  progressBackground: {
    width: "100%",
    height: "9px",
    background: "#e5e5e5",
    borderRadius: "10px",
    overflow: "hidden",
    position: "relative",
  },

  progressMoving: {
    position: "absolute",
    left: "-35%",
    top: "0",
    width: "35%",
    height: "100%",
    background: "#111111",
    borderRadius: "10px",
    animation: "felloProgress 1.4s ease-in-out infinite",
  },

  waitText: {
    marginTop: "9px",
    fontSize: "13px",
    color: "#666666",
  },

  smallText: {
    marginTop: "18px",
    fontSize: "12px",
    color: "#888888",
    lineHeight: "1.5",
  },
};

export default InstallPage;
