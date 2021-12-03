import ThemeSelector from "../../components/preferences/ThemeSelector";
import FontSizeSelector from "../../components/preferences/FontSizeSelector";
import FontFamilySelector from "../../components/preferences/FontFamilySelector";

import '../../styles/home.css'

import "../../styles/preferences.css";
import { strings } from "../../strings";
import ShowCatalog from "../../components/preferences/ShowCatalog";
import LanguageSelector from "../../components/preferences/LanguageSelector";
import { useGlobalState } from "../../state";
import { useEffect } from "react";

export default function Preferences() {
  const [languageCode, setLanguageCode] = useGlobalState("language");

  useEffect(() => {
    strings.setLanguage(languageCode);
  }, [languageCode])

  return (
    <div>
      <div className="preference-section">
        <h1>{strings.settings_title}</h1>
      </div>
      <FontSizeSelector></FontSizeSelector>
      <FontFamilySelector></FontFamilySelector>
      <ThemeSelector></ThemeSelector>
      <ShowCatalog></ShowCatalog>
      <LanguageSelector></LanguageSelector>
    </div>
  );
}
