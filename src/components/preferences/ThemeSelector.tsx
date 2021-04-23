import React, { useState, useEffect } from 'react';
import { createGlobalState } from 'react-hooks-global-state';

import themeCollection from '../../styles/ThemeCollection';
import ThemeButton from './ThemeButton';

const initialState = {
	theme: 'bushido',
}

const { useGlobalState } = createGlobalState(initialState);

export default function ThemeInfo() {
	
	const [themeName, setThemeName] = useGlobalState('theme');

	useEffect(() => {
		let theme = themeCollection[themeName];

		Object.entries(theme).forEach(entry => {
			let [property, value] = entry;
			document.documentElement.style.setProperty(property, value);
		});
	}, [themeName]);

	useEffect(() => {
		// preserve theme name
		if ((window as any).theme) {
			setThemeName((window as any).theme);
			console.log('window theme set');
		} 
	}, [])

	return (
		<div className='preference-section'>
			<div className='preference-heading'>
				<h2>Theme Selection</h2>
				<p>Preview and select a visual color theme to be used throughout the interface</p>
			</div>
			
			<div className='preference-contents'>
				<div className='theme-current'>
					Current Theme Name: <span className='theme-highlight'>{themeName}</span>
				</div>
				<div className='theme-selection'>
					{
						Object.keys(themeCollection).map((themeName, index) => {
							return <ThemeButton key={index} themeName={themeName} setTheme={setThemeName}></ThemeButton>
						})
					}
				</div>
			</div>
		</div>
	);
}