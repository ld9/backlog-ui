import themeCollection from '../../styles/ThemeCollection';

export default function ThemeButton({ themeName, setTheme }: any) {
    return (
        <div className="theme-select-button-container">
            <div>
                <div
                    className="theme-select-button"
                    style={
                        {
                            backgroundColor: themeCollection[themeName]['--bg-color'],
                            color: themeCollection[themeName]['--text-color'],
                            borderColor: themeCollection[themeName]['--main-color']
                        }
                    }
                    onClick={() => {
                        // (window as any).theme = themeName;
                        setTheme(themeName)
                    }}
                >
                    {themeName}
                </div>
            </div>
        </div>
    );
}