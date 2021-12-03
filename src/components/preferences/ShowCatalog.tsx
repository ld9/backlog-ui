import React, { useState, useEffect } from "react";
import { useGlobalState } from "../../state";
import { strings } from "../../strings";

export default function ShowCatalog() {
  const [showCatalog, setShowCatalog] = useGlobalState("showCatalog");
  const [languageCode, setLanguageCode] = useGlobalState("language");

  useEffect(() => {
    strings.setLanguage(languageCode);
  }, [languageCode])

  useEffect(() => {
    localStorage.setItem("showCatalog", showCatalog.toString());
    document.documentElement.style.setProperty("font-size", showCatalog + "em");
  }, [showCatalog]);

  return (
    <div className="preference-section">
      <div className="preference-heading">
        <h2>{strings.settings_catalog_title}</h2>
        <p>{strings.settings_catalog_desc}</p>
      </div>

      <div className="preference-contents">
        <label>
          <input
            type="checkbox"
            checked={showCatalog}
            onChange={(event) => {
              setShowCatalog(event.target.checked);
            }}
          />
          {strings.settings_catalog_checkbox}
        </label>
      </div>
    </div>
  );
}
