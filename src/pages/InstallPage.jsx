import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function InstallPage() {
  const navigate = useNavigate();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Chrome/Android install prompt available
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();

      console.log("PWA install prompt available");

      setDeferredPrompt(event);
    };

    // This event means browser reports that installation completed
    const handleAppInstalled = () => {
      console.log("Fello Social installation completed");

      setInstalling(false);
      setInstalled(true);
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

    // Check whether this page is already running
    // as an installed PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      setInstalled(true);
      setInstalling(false);
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

  // -----------------------------------------
  // INSTALL BUTTON
  // -----------------------------------------

  const installApp = async () => {
    if (!deferredPrompt) {
      alert(
        "Install option abhi available nahi hai. Chrome ke menu (⋮) se Install app select karein."
      );
      return;
    }

    try {
      // Open Chrome's native Install / Cancel dialog
      deferredPrompt.prompt();

      // IMPORTANT:
      // accepted means only that user clicked Install.
      // It does NOT mean installation has completed.
      const result = await deferredPrompt.userChoice;

      console.log("Chrome install choice:", result.outcome);

      if (result.outcome === "accepted") {
        // Only show Installing.
        // Do NOT show 100% here.
        setInstalling(true);
        setInstalled(false);
      } else {
        // User clicked Cancel
        setInstalling(false);
        setInstalled(false);
      }
    } catch (error) {
      console.error("Installation error:", error);

      setInstalling(false);
      setInstalled(false);
    }

    setDeferredPrompt(null);
  };

  // -----------------------------------------
  // OPEN APP
  // -----------------------------------------

  const openApp = () => {
    /*
      The PWA's start_url is "/".
      When launched from the installed PWA,
      this opens the app's starting page.
    */
    window.location.href = "/";
  };

  // -----------------------------------------
  // CANCEL AFTER INSTALL
  // -----------------------------------------

  const cancelInstalled = () => {
    setInstalled(false);
    setInstalling(false);
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

        {/* ==================================
            INSTALLING
        ================================== */}
        {installing && !installed && (
          <div style={styles.installingBox}>

            <div style={styles.spinner}></div>

            <h3 style={styles.installingTitle}>
              Installing Fello Social...
            </h3>

            <p style={styles.installingText}>
              Please wait while the app is being installed.
            </p>

            {/* Indeterminate progress bar */}
            <div style={styles.progressBackground}>
              <div style={styles.progressMoving}></div>
            </div>

            <p style={styles.waitText}>
              Installing...
            </p>

          </div>
        )}

        {/* ==================================
            INSTALLATION COMPLETE
        ================================== */}
        {installed && (
          <div style={styles.installedBox}>

            {/* CHECK */}
            <div style={styles.checkCircle}>
              ✓
            </div>

            <h3 style={styles.installedTitle}>
              Fello Social Installed
            </h3>

            <p style={styles.installedText}>
              Installation completed successfully.
            </p>

            {/* REAL COMPLETION */}
            <div style={styles.progressBackground}>
              <div style={styles.progressComplete}></div>
            </div>

            <p style={styles.progressText}>
              100%
            </p>

            {/* OPEN + CANCEL */}
            <div style={styles.actionButtons}>

              <button
                type="button"
                onClick={openApp}
                style={styles.openButton}
              >
                📱 Open
              </button>

              <button
                type="button"
                onClick={cancelInstalled}
                style={styles.cancelButton}
              >
                Cancel
              </button>

            </div>

          </div>
        )}

        {/* ==================================
            INSTALL BUTTON
        ================================== */}
        {!installing && !installed && (
          <button
            type="button"
            onClick={installApp}
            style={styles.installButton}
          >
            📲 Install Fello Social
          </button>
        )}

        {/* ==================================
            CONTINUE TO WEBSITE
        ================================== */}
        {!installing && !installed && (
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={styles.loginButton}
          >
            Continue to Website
          </button>
        )}

        {/* FOOTER */}
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

  /* WEBSITE BUTTON */

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

  progressComplete: {
    width: "100%",
    height: "100%",
    background: "#111111",
    borderRadius: "10px",
  },

  waitText: {
    marginTop: "9px",
    fontSize: "13px",
    color: "#666666",
  },

  /* INSTALLED */

  installedBox: {
    width: "100%",
    marginBottom: "20px",
  },

  checkCircle: {
    width: "58px",
    height: "58px",
    margin: "0 auto 13px",
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
    margin: "0 0 7px",
    fontSize: "19px",
    fontWeight: "700",
    color: "#111111",
  },

  installedText: {
    margin: "0 0 16px",
    fontSize: "13px",
    color: "#777777",
  },

  progressText: {
    margin: "8px 0 0",
    fontSize: "13px",
    color: "#666666",
    fontWeight: "600",
  },

  /* OPEN / CANCEL */

  actionButtons: {
    display: "flex",
    gap: "10px",
    marginTop: "17px",
  },

  openButton: {
    flex: "1",
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
    flex: "1",
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
