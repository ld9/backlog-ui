import React, { useState, useEffect } from 'react';
import { createGlobalState } from 'react-hooks-global-state';
import { initialState } from '../../App';

const { useGlobalState } = createGlobalState(initialState);


export default function ThemeInfo() {
	
	const [fontSize, setFontSize] = useGlobalState('fontSize');

	useEffect(() => {
		localStorage.setItem('fontSize', fontSize);
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
                        setFontSize(event.target.value)
                    }} />
			</div>
		</div>
	);
}