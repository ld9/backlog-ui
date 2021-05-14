import React from "react";
import ThemeSelector from "../../components/preferences/ThemeSelector";
import FontSizeSelector from "../../components/preferences/FontSizeSelector";
import FontFamilySelector from "../../components/preferences/FontFamilySelector";

import "../../styles/preferences.css";
import { strings } from "../../strings";

export default function Preferences() {
  return (
    <div>
      <div className="preference-section">
        <h1>{strings.settings_title}</h1>
      </div>
      <FontSizeSelector></FontSizeSelector>
      <FontFamilySelector></FontFamilySelector>
      <ThemeSelector></ThemeSelector>
    </div>
  );
}
