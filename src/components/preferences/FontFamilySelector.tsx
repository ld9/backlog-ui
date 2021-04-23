import React, { useState, useEffect } from 'react';
import FontButton from './FontButton';

export default function ThemeInfo() {
	
	const [font, setFont] = useState("Roboto Mono");

	useEffect(() => {
		// preserve theme name
		if ((window as any).font) {
			setFont((window as any).font);
		} 

		document.documentElement.style.setProperty('font-family', font);

	}, [font]);

	// Just works as long as the font is available on the system
	const fonts = [
		'Arial',
		'Verdana',
		'Roboto Mono',
		'Courier',
		'Times New Roman',
		'Georgia',
		'Comic Sans MS'
	]

	return (
		<div className='preference-section'>
			<div className='preference-heading'>
				<h2>Adjust Font Family</h2>
				<p>Change the font in which content on the site is displayed</p>
			</div>
			
			<div className='preference-contents'>
				<div className='font-select-contain'>
					{ fonts.map((font, i) => <FontButton key={i} font={font} setFont={setFont}></FontButton>) }
				</div>
			</div>
		</div>
	);
}