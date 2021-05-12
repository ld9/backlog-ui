import React, { useState, useEffect } from 'react';


export default function ThemeInfo() {
	
	const [fontSize, setFontSize] = useState("1.25");

	useEffect(() => {
		// preserve theme name
		if ((window as any).fontSize) {
			setFontSize((window as any).fontSize);
		} 

		document.documentElement.style.setProperty('font-size', fontSize + 'em');

	}, [fontSize]);

	return (
		<div className='preference-section'>
			<div className='preference-heading'>
				<h2>Adjust Font Size</h2>
				<p>Change the size of text on the site</p>
			</div>
			
			<div className='preference-contents'>
				<input type='range' min='1' max='1.5' step='0.025' value={fontSize}
					onChange={(event) => {
                        (window as any).fontSize = event.target.value;
                        setFontSize(event.target.value)
                    }} />
			</div>
		</div>
	);
}