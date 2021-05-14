import React, { useState, useEffect } from "react";
import { createGlobalState } from "react-hooks-global-state";
import { useGlobalState } from "../../state";
import { strings } from "../../strings";
import FontButton from "./FontButton";

export default function ThemeInfo() {
  const [font, setFont] = useGlobalState("font");

  useEffect(() => {
    localStorage.setItem("font", font);
    document.documentElement.style.setProperty("font-family", font);
  }, [font]);

  // Just works as long as the font is available on the system
  const fonts = [
    "Arial",
    "Verdana",
	"Windows, Segoe UI, sans-serif",
	"MacOS, San Francisco, sans-serif",
    "Roboto Mono",
    "Courier",
    "Times New Roman",
    "Georgia",
    "Comic Sans MS",
  ];

  return (
    <div className="preference-section">
      <div className="preference-heading">
        <h2>{strings.settings_font_title}</h2>
        <p>{strings.settings_font_desc}</p>
      </div>

      <div className="preference-contents">
        <div className="font-select-contain">
          {fonts.map((font, i) => (
            <FontButton key={i} font={font} setFont={setFont}></FontButton>
          ))}
        </div>
      </div>
    </div>
  );
}
