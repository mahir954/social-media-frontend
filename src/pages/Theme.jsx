import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/themePage.css";

const themes = [
  {
    id: "pink",
    name: "Pink",
    icon: "💗",
    color: "#e91e63",
  },
  {
    id: "blue",
    name: "Blue",
    icon: "💙",
    color: "#2196f3",
  },
  {
    id: "purple",
    name: "Purple",
    icon: "💜",
    color: "#9c27b0",
  },
  {
    id: "green",
    name: "Green",
    icon: "💚",
    color: "#4caf50",
  },
  {
    id: "orange",
    name: "Orange",
    icon: "🧡",
    color: "#ff9800",
  },
  {
    id: "red",
    name: "Red",
    icon: "❤️",
    color: "#f44336",
  },
  {
    id: "cyan",
    name: "Cyan",
    icon: "🩵",
    color: "#00bcd4",
  },
  {
    id: "dark",
    name: "Dark",
    icon: "🖤",
    color: "#bb86fc",
  },
  {
    id: "light",
    name: "Light",
    icon: "🤍",
    color: "#333333",
  },
];

function Theme() {
  const navigate = useNavigate();

  const [selectedTheme, setSelectedTheme] =
    useState(
      localStorage.getItem("appTheme") || "pink"
    );

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      selectedTheme
    );

    localStorage.setItem(
      "appTheme",
      selectedTheme
    );
  }, [selectedTheme]);

  const changeTheme = (themeId) => {
    setSelectedTheme(themeId);
  };

  return (
    <div className="theme-page">

      <div className="theme-header">

        <button
          className="theme-back-button"
          onClick={() => navigate(-1)}
        >
          ←
        </button>

        <h1>Choose Theme</h1>

      </div>

      <div className="theme-content">

        <p className="theme-description">
          Choose your favorite theme for
          the entire app.
        </p>

        <div className="theme-grid">

          {themes.map((theme) => (
            <button
              key={theme.id}
              className={`theme-card ${
                selectedTheme === theme.id
                  ? "theme-card-selected"
                  : ""
              }`}
              onClick={() =>
                changeTheme(theme.id)
              }
            >

              <div
                className="theme-color"
                style={{
                  backgroundColor:
                    theme.color,
                }}
              >
                {theme.icon}
              </div>

              <span>
                {theme.name}
              </span>

              {selectedTheme ===
                theme.id && (
                <div className="theme-check">
                  ✓
                </div>
              )}

            </button>
          ))}

        </div>

      </div>

    </div>
  );
}

export default Theme;
