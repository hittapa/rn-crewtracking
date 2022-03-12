import React from 'react';
import * as Svg from 'react-native-svg';
const svgMarkup = `<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="11.5" cy="11.5" r="11.5" fill="white"/>
<path d="M18.5 5.375H4.5C4.01675 5.375 3.625 5.76675 3.625 6.25V16.75C3.625 17.2332 4.01675 17.625 4.5 17.625H18.5C18.9832 17.625 19.375 17.2332 19.375 16.75V6.25C19.375 5.76675 18.9832 5.375 18.5 5.375Z" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M3.625 6.6875L11.5 11.5L19.375 6.6875" stroke="black" stroke-width="2" stroke-linecap="round"/>
</svg>`
const { SvgXml } = Svg;

export const MailIcon = () => {
    return (
        <SvgXml xml={svgMarkup} />       
    )
}