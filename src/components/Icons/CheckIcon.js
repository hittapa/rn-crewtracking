import React from 'react';
import * as Svg from 'react-native-svg';
const svgMarkup = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 12L10 18L20 6" stroke="#0166C8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
const { SvgXml } = Svg;

export const CheckIcon = () => {
    return (
        <SvgXml xml={svgMarkup} />       
    )
}