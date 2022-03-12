import React from 'react';
import * as Svg from 'react-native-svg';
const svgMarkup = `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.03174 1.03101L20.9701 20.9694" stroke="white" stroke-width="0.5"/>
<path d="M21 1.06177L1 20.9383" stroke="white" stroke-width="0.5"/>
</svg>`
const { SvgXml } = Svg;

export const CloseIcon = () => {
    return (
        <SvgXml xml={svgMarkup} />       
    )
}