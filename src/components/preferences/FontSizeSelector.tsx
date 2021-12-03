import React, { useState, useEffect } from "react";
import { createGlobalState } from "react-hooks-global-state";
import { useGlobalState } from "../../state";
import { strings } from "../../strings";

export default function ThemeInfo() {
  const [fontSize, setFontSize] = useGlobalState("fontSize");
  const [languageCode, setLanguageCode] = useGlobalState("language");

  useEffect(() => {
    strings.setLanguage(languageCode);
  }, [languageCode]);

  useEffect(() => {
    localStorage.setItem("fontSize", fontSize);
    document.documentElement.style.setProperty("font-size", fontSize + "em");
  }, [fontSize]);

  return (
    <div className="preference-section">
      <div className="preference-heading">
        <h2>{strings.settings_size_title}</h2>
        <p>{strings.settings_size_desc}</p>
      </div>

      <div className="preference-contents">
        <input
          type="range"
          min=".75"
          max="1.5"
          step="0.025"
          value={fontSize}
          onChange={(event) => {
            setFontSize(event.target.value);
          }}
        />
      </div>
    </div>
  );
}
