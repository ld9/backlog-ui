import React from "react";
import ThemeSelector from "../../components/preferences/ThemeSelector";
import FontSizeSelector from "../../components/preferences/FontSizeSelector";
import FontFamilySelector from "../../components/preferences/FontFamilySelector";

import '../../styles/preferences.css';

export default function Preferences() {
    return (
        <div>
            <FontSizeSelector></FontSizeSelector>
            <FontFamilySelector></FontFamilySelector>
            <ThemeSelector></ThemeSelector>
        </div>
    );
}