import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function InstallPage() {
  const navigate = useNavigate();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installing, setInstalling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handleInstallPrompt = (event) => {
      event.preventDefault();
      console.log("PWA install prompt available");
      setDeferredPrompt(event);
    };

    const handleAppInstalled = () => {
      console.log("Fello Social installed successfully");

      setInstalled(true);
      setInstalling(false);
      setProgress(100);
      setDeferredPrompt(null);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleInstallPrompt
    );

    window.addEventListener(
      "appinstalled",
      handleAppInstalled
    );

    // Check if already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches
    ) {
      setInstalled(true);
      setProgress(100);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleInstallPrompt
      );

      window.removeEventListener(
        "appinstalled",
        handleAppInstalled
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

    setInstalling(true);
    setProgress(10);

    deferredPrompt.prompt();

    const result = await deferredPrompt.userChoice;

    console.log("Install result:", result.outcome);

    if (result.outcome === "accepted") {
      setProgress(30);

      // Visual progress only.
      // Actual installation percentage Chrome provide nahi karta.
      let currentProgress = 30;

      const timer = setInterval(() => {
        currentProgress += 5;

        if (currentProgress >= 95) {
          currentProgress = 95;
          clearInterval(timer);
        }

        setProgress(currentProgress);
      }, 250);
    } else {
      // User pressed Cancel
      setInstalling(false);
      setProgress(0);
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
        {installing && !installed && (
          <div style={styles.installingBox}>
            <h3 style={styles.installingTitle}>
              Installing Fello Social...
            </h3>

            <p style={styles.installingText}>
              Please wait while the app is being installed.
            </p>

            <div style={styles.progressBackground}>
              <div
                style={{
                  ...styles.progressBar,
                  width: `${progress}%`,
                }}
              />
            </div>

            <p style={styles.progressText}>
              {progress}%
            </p>
          </div>
        )}

        {/* Installed */}
        {installed && (
          <div style={styles.installedBox}>
            <div style={styles.checkCircle}>
              ✓
            </div>

            <h3 style={styles.installedTitle}>
              Fello Social Installed
            </h3>

            <p style={styles.installedText}>
              Installation completed successfully.
            </p>

            <div style={styles.progressBackground}>
              <div
                style={{
                  ...styles.progressBar,
                  width: "100%",
                }}
              />
            </div>

            <p style={styles.progressText}>
              100%
            </p>
          </div>
        )}

        {/* Install Button */}
        {!installing && !installed && (
          <button
            onClick={installApp}
            style={styles.installButton}
          >
            📲 Install Fello Social
          </button>
        )}

        {/* Continue to Website */}
        <button
          onClick={() => navigate("/login")}
          style={styles.loginButton}
        >
          Continue to Website
        </button>

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
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)",
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
  },

  tagline: {
    color: "#666",
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
    marginBottom: "18px",
  },

  installingTitle: {
    margin: "0 0 8px",
    fontSize: "18px",
    fontWeight: "600",
  },

  installingText: {
    margin: "0 0 15px",
    fontSize: "13px",
    color: "#777777",
  },

  progressBackground: {
    width: "100%",
    height: "9px",
    background: "#e5e5e5",
    borderRadius: "10px",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    background: "#111111",
    borderRadius: "10px",
    transition: "width 0.25s ease",
  },

  progressText: {
    margin: "8px 0 0",
    fontSize: "13px",
    color: "#666666",
  },

  installedBox: {
    width: "100%",
    marginBottom: "18px",
  },

  checkCircle: {
    width: "55px",
    height: "55px",
    margin: "0 auto 12px",
    borderRadius: "50%",
    background: "#111111",
    color: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "28px",
    fontWeight: "700",
  },

  installedTitle: {
    margin: "0 0 6px",
    fontSize: "18px",
  },

  installedText: {
    margin: "0 0 15px",
    fontSize: "13px",
    color: "#777777",
  },

  smallText: {
    marginTop: "18px",
    fontSize: "12px",
    color: "#888888",
    lineHeight: "1.5",
  },
};

export default InstallPage;
