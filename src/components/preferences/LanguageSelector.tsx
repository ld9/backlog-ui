import React, { useState, useEffect } from "react";
import { createGlobalState } from "react-hooks-global-state";
import { useGlobalState } from "../../state";

import themeCollection from "../../styles/ThemeCollection";
import ThemeButton from "./ThemeButton";

export default function LanguageSelector() {
  const [languageCode, setLanguageCode] = useGlobalState("language");
  const [strings, setStrings] = useGlobalState("strings");

  const [showMoreThemes, setShowMoreThemes] = useState(false);

  useEffect(() => {
    localStorage.setItem("languageCode", languageCode);
  }, [languageCode]);

  return (
    <div className="preference-section">
      <div className="preference-heading">
        <h2>{strings.settings_language_title}</h2>
        <p>{strings.settings_language_desc}</p>
      </div>

      <div className="preference-contents">
        <div className="language-current">
          {strings.settings_language_current}:{" "}
          <span className="language-highlight">{languageCode}</span>
        </div>

        <div className="language-selector">
          {[
            { code: "en", title: "English" },
            { code: "es", title: "Spanish" },
          ].map((language) => {
            return <div className="language-button" tabIndex={0} onClick={
              () => {
                strings.setLanguage(language.code);
                setStrings(strings);
                setLanguageCode(language.code);
              }
            }>{language.title}</div>;
          })}
        </div>
      </div>
    </div>
  );
}
