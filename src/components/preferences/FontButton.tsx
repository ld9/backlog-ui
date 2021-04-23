export default function ThemeButton({ font, setFont }: any) {
    return (
        <div
            className="font-select-button"
            style={
                {
                    fontFamily: font
                }
            }
            onClick={() => {
                (window as any).font = font;
                setFont(font)
            }}
        >
            {font}
        </div>
    );
}