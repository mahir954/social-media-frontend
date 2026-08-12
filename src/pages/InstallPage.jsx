import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function InstallPage() {
  const navigate = useNavigate();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // =========================================
    // Chrome PWA INSTALL PROMPT
    // =========================================

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();

      console.log("Fello Social install prompt available");

      setDeferredPrompt(event);
    };

    // =========================================
    // APP ACTUALLY INSTALLED
    // =========================================

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

    // =========================================
    // CHECK IF ALREADY INSTALLED
    // =========================================

    const isStandalone =
      window.matchMedia(
        "(display-mode: standalone)"
      ).matches ||
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

  // =========================================
  // INSTALL APP
  // =========================================

  const installApp = async () => {
    if (!deferredPrompt) {
      alert(
        "Install option abhi available nahi hai. Chrome ke menu (⋮) se Install app select karein."
      );
      return;
    }

    try {
      // Chrome ka native Install / Cancel dialog
      deferredPrompt.prompt();

      // User ke actual choice ka wait
      const result = await deferredPrompt.userChoice;

      console.log(
        "User install choice:",
        result.outcome
      );

      if (result.outcome === "accepted") {
        // User ne Install dabaya.
        // Abhi installed nahi maanenge.
        setInstalling(true);
        setInstalled(false);
      } else {
        // User ne Cancel dabaya.
        setInstalling(false);
        setInstalled(false);
      }
    } catch (error) {
      console.error(
        "Fello installation error:",
        error
      );

      setInstalling(false);
      setInstalled(false);
    }

    setDeferredPrompt(null);
  };

  // =========================================
  // OPEN APP
  // =========================================

  const openApp = () => {
    /*
      Fello PWA ka start_url "/"
      hai.

      Browser/OS agar installed PWA ko
      launch kar sakta hai to "/" usi
      PWA context me open hoga.
    */

    window.location.href = "/";
  };

  // =========================================
  // CANCEL
  // =========================================

  const cancelInstall = () => {
    setInstalled(false);
    setInstalling(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* =====================================
            APP ICON
        ====================================== */}

        <img
          src="/fello-icon.png.jpeg"
          alt="Fello Social"
          style={styles.icon}
        />

        {/* =====================================
            APP NAME
        ====================================== */}

        <h1 style={styles.title}>
          Fello Social
        </h1>

        <p style={styles.tagline}>
          Connect, Share & Chat with your friends
        </p>

        {/* =====================================
            INSTALLING
        ====================================== */}

        {installing && !installed && (
          <div style={styles.installingBox}>

            <div style={styles.spinner}></div>

            <h3 style={styles.installingTitle}>
              Installing Fello Social...
            </h3>

            <p style={styles.installingText}>
              Please wait while the app is being installed.
            </p>

            {/* Loading animation */}
            <div style={styles.progressBackground}>
              <div style={styles.progressMoving}></div>
            </div>

            <p style={styles.waitText}>
              Installation in progress...
            </p>

          </div>
        )}

        {/* =====================================
            INSTALLATION SUCCESSFUL
        ====================================== */}

        {installed && (
          <div style={styles.successBox}>

            {/* SUCCESS ICON */}

            <div style={styles.successCircle}>
              ✓
            </div>

            <h2 style={styles.successTitle}>
              Installation Successful
            </h2>

            <p style={styles.successText}>
              Fello Social has been installed successfully.
            </p>

            {/* =================================
                OPEN + CANCEL
            ================================== */}

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
                onClick={cancelInstall}
                style={styles.cancelButton}
              >
                Cancel
              </button>

            </div>

          </div>
        )}

        {/* =====================================
            INSTALL BUTTON
        ====================================== */}

        {!installing && !installed && (
          <button
            type="button"
            onClick={installApp}
            style={styles.installButton}
          >
            📲 Install Fello Social
          </button>
        )}

        {/* =====================================
            CONTINUE WEBSITE
        ====================================== */}

        {!installing && !installed && (
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={styles.loginButton}
          >
            Continue to Website
          </button>
        )}

        {/* =====================================
            FOOTER
        ====================================== */}

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

  /* =====================================
     INSTALL BUTTON
  ====================================== */

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

  /* =====================================
     CONTINUE WEBSITE
  ====================================== */

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

  /* =====================================
     INSTALLING
  ====================================== */

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

  /* =====================================
     SUCCESS
  ====================================== */

  successBox: {
    width: "100%",
    marginBottom: "20px",
  },

  successCircle: {
    width: "62px",
    height: "62px",
    margin: "0 auto 15px",
    borderRadius: "50%",
    background: "#111111",
    color: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "32px",
    fontWeight: "700",
  },

  successTitle: {
    margin: "0 0 8px",
    fontSize: "21px",
    fontWeight: "700",
    color: "#111111",
  },

  successText: {
    margin: "0 0 20px",
    fontSize: "14px",
    color: "#777777",
    lineHeight: "1.5",
  },

  /* =====================================
     OPEN + CANCEL
  ====================================== */

  actionButtons: {
    display: "flex",
    gap: "10px",
    width: "100%",
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

  /* =====================================
     FOOTER
  ====================================== */

  smallText: {
    marginTop: "18px",
    fontSize: "12px",
    color: "#888888",
    lineHeight: "1.5",
  },
};

export default InstallPage;
