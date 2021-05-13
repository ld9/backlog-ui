import React, { useState, useEffect } from 'react';
import { createGlobalState } from 'react-hooks-global-state';
import { initialState } from '../../App';
import FontButton from './FontButton';

const { useGlobalState } = createGlobalState(initialState);

export default function ThemeInfo() {
	
	const [font, setFont] = useGlobalState("font");

	useEffect(() => {
		localStorage.setItem('font', font);
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