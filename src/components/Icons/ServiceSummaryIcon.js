import React from 'react';
import * as Svg from 'react-native-svg';
const svgMarkup = `<svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.8125 8.625C5.95159 8.625 6.875 7.65961 6.875 6.46875C6.875 5.27789 5.95159 4.3125 4.8125 4.3125C3.67341 4.3125 2.75 5.27789 2.75 6.46875C2.75 7.65961 3.67341 8.625 4.8125 8.625Z" fill="#616667"/>
<path d="M4.8125 18.6875C5.95159 18.6875 6.875 17.7221 6.875 16.5312C6.875 15.3404 5.95159 14.375 4.8125 14.375C3.67341 14.375 2.75 15.3404 2.75 16.5312C2.75 17.7221 3.67341 18.6875 4.8125 18.6875Z" fill="#616667"/>
<path d="M11 15.8125H20.625V17.25H11V15.8125Z" fill="#616667"/>
<path d="M11 5.75H20.625V7.1875H11V5.75Z" fill="#616667"/>
</svg>`
const { SvgXml } = Svg;

export const ServiceSummaryIcon = () => {
    return (
        <SvgXml xml={svgMarkup} />       
    )
}