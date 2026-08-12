import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function InstallPage() {
  const navigate = useNavigate();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Chrome gives this event when PWA can be installed
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();

      console.log("PWA install prompt available");

      setDeferredPrompt(event);
    };

    // This fires only after the PWA is actually installed
    const handleAppInstalled = () => {
      console.log("Fello Social installed successfully");

      setInstalling(false);
      setInstalled(true);
      setProgress(100);
      setDeferredPrompt(null);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    window.addEventListener(
      "appinstalled",
      handleAppInstalled
    );

    // Check if already running as installed PWA
    if (
      window.matchMedia("(display-mode: standalone)").matches
    ) {
      setInstalled(true);
      setProgress(100);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        "appinstalled",
        handleAppInstalled
      );
    };
  }, []);

  // INSTALL APP
  const installApp = async () => {
    if (!deferredPrompt) {
      alert(
        "Install prompt available nahi hai. Chrome ke ⋮ menu se Install app select karein."
      );
      return;
    }

    // Open Chrome's native Install / Cancel dialog
    deferredPrompt.prompt();

    // Wait for user's choice
    const result = await deferredPrompt.userChoice;

    console.log("Install result:", result.outcome);

    if (result.outcome === "accepted") {
      // User clicked Install
      setInstalling(true);

      // Real installation percentage browser provide nahi karta.
      // Isliye actual percentage claim nahi kar rahe.
      setProgress(0);
    } else {
      // User clicked Cancel
      setInstalling(false);
      setProgress(0);
    }

    setDeferredPrompt(null);
  };

  // OPEN INSTALLED APP
  const openApp = () => {
    /*
      If already running as standalone PWA,
      simply go to home.
    */
    window.location.href = "/";
  };

  // CANCEL AFTER INSTALL
  const cancelInstalled = () => {
    setInstalled(false);
    setInstalling(false);
    setProgress(0);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* APP ICON */}
        <img
          src="/fello-icon.png.jpeg"
          alt="Fello Social"
          style={styles.icon}
        />

        {/* APP NAME */}
        <h1 style={styles.title}>
          Fello Social
        </h1>

        <p style={styles.tagline}>
          Connect, Share & Chat with your friends
        </p>

        {/* =========================
            INSTALLING
        ========================== */}
        {installing && !installed && (
          <div style={styles.installingBox}>

            <div style={styles.loadingCircle}>
              <div style={styles.loadingDot} />
            </div>

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
                  width: "60%",
                }}
              />
            </div>

            <p style={styles.waitText}>
              Installing...
            </p>

          </div>
        )}

        {/* =========================
            INSTALLED SUCCESSFULLY
        ========================== */}
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

            {/* 100% */}
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

            {/* OPEN + CANCEL */}
            <div style={styles.actionButtons}>

              <button
                onClick={openApp}
                style={styles.openButton}
              >
                📱 Open
              </button>

              <button
                onClick={cancelInstalled}
                style={styles.cancelButton}
              >
                Cancel
              </button>

            </div>

          </div>
        )}

        {/* =========================
            INSTALL BUTTON
        ========================== */}
        {!installing && !installed && (
          <button
            onClick={installApp}
            style={styles.installButton}
          >
            📲 Install Fello Social
          </button>
        )}

        {/* =========================
            CONTINUE TO WEBSITE
        ========================== */}
        {!installing && !installed && (
          <button
            onClick={() => navigate("/login")}
            style={styles.loginButton}
          >
            Continue to Website
          </button>
        )}

        {/* FOOTER TEXT */}
        <p style={styles.smallText}>
          Install Fello Social for a faster and better experience.
        </p>

      </div>
    </div>
  );
}

/* =====================================
   STYLES
===================================== */

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
    color: "#111111",
  },

  tagline: {
    color: "#666666",
    fontSize: "15px",
    lineHeight: "1.5",
    marginBottom: "30px",
  },

  /* INSTALL BUTTON */
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

  /* LOGIN / WEBSITE */
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

  /* INSTALLING */
  installingBox: {
    width: "100%",
    marginBottom: "18px",
  },

  loadingCircle: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    border: "4px solid #e5e5e5",
    borderTop: "4px solid #111111",
    margin: "0 auto 15px",
    animation: "spin 1s linear infinite",
  },

  loadingDot: {
    width: "100%",
    height: "100%",
  },

  installingTitle: {
    margin: "0 0 8px",
    fontSize: "18px",
    fontWeight: "600",
    color: "#111111",
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
    transition: "width 0.3s ease",
  },

  waitText: {
    marginTop: "10px",
    fontSize: "13px",
    color: "#666666",
  },

  /* INSTALLED */
  installedBox: {
    width: "100%",
    marginBottom: "18px",
  },

  checkCircle: {
    width: "58px",
    height: "58px",
    margin: "0 auto 12px",
    borderRadius: "50%",
    background: "#111111",
    color: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "30px",
    fontWeight: "700",
  },

  installedTitle: {
    margin: "0 0 6px",
    fontSize: "19px",
    fontWeight: "700",
    color: "#111111",
  },

  installedText: {
    margin: "0 0 15px",
    fontSize: "13px",
    color: "#777777",
  },

  progressText: {
    margin: "8px 0 0",
    fontSize: "13px",
    color: "#666666",
  },

  /* OPEN + CANCEL */
  actionButtons: {
    display: "flex",
    gap: "10px",
    marginTop: "16px",
  },

  openButton: {
    flex: 1,
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#111111",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  cancelButton: {
    flex: 1,
    padding: "14px",
    border: "1px solid #dddddd",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#111111",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  smallText: {
    marginTop: "18px",
    fontSize: "12px",
    color: "#888888",
    lineHeight: "1.5",
  },
};

export default InstallPage;
