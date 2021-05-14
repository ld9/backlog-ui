import React, { useState, useEffect } from "react";
import { createGlobalState } from "react-hooks-global-state";
import { useGlobalState } from "../../state";
import { strings } from "../../strings";

import themeCollection from "../../styles/ThemeCollection";
import ThemeButton from "./ThemeButton";

export default function ThemeInfo() {
  const [themeName, setThemeName] = useGlobalState("theme");

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
        <div className="theme-selection">
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
      </div>
    </div>
  );
}
