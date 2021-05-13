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
                setFont(font)
            }}
        >
            {font}
        </div>
    );
}