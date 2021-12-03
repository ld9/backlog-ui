import React, { useState, useEffect } from "react";
import { createGlobalState } from "react-hooks-global-state";
import { useGlobalState } from "../../state";
import { strings } from "../../strings";

import themeCollection from "../../styles/ThemeCollection";
import ThemeButton from "./ThemeButton";

export default function ThemeInfo() {
  const [themeName, setThemeName] = useGlobalState("theme");
  const [languageCode, setLanguageCode] = useGlobalState("language");

  useEffect(() => {
    strings.setLanguage(languageCode);
  }, [languageCode]);

  const [showMoreThemes, setShowMoreThemes] = useState(false);

  useEffect(() => {
    let theme = themeCollection[themeName];
    localStorage.setItem("themeName", themeName);

    Object.entries(theme).forEach((entry) => {
      let [property, value] = entry;
      document.documentElement.style.setProperty(property, value);
    });
  }, [themeName]);

  return (
    <div className="preference-section">
      <div className="preference-heading">
        <h2>{strings.settings_theme_title}</h2>
        <p>{strings.settings_theme_desc}</p>
      </div>

      <div className="preference-contents">
        <div className="theme-current">
          {strings.settings_theme_current}:{" "}
          <span className="theme-highlight">{themeName}</span>
        </div>

        {!showMoreThemes ? (
          <div>
            <div className="theme-selection">
              <ThemeButton
                themeName="calm_blue"
                setTheme={setThemeName}
              ></ThemeButton>
              <ThemeButton
                themeName="white"
                setTheme={setThemeName}
              ></ThemeButton>
              <ThemeButton
                themeName="high_contrast"
                setTheme={setThemeName}
              ></ThemeButton>
            </div>
            <button
              onClick={() => {
                setShowMoreThemes(true);
              }}
            >
              +
            </button>
          </div>
        ) : (
          <div className="theme-selection extra">
            {Object.keys(themeCollection).map((themeName, index) => {
              return (
                <ThemeButton
                  key={index}
                  themeName={themeName}
                  setTheme={setThemeName}
                ></ThemeButton>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
