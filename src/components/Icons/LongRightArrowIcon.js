import React from 'react';
import * as Svg from 'react-native-svg';
const svgMarkup = `<svg width="58" height="8" viewBox="0 0 58 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M56.8599 4.35355C57.0552 4.15829 57.0552 3.84171 56.8599 3.64645L53.6779 0.464466C53.4827 0.269204 53.1661 0.269204 52.9708 0.464466C52.7755 0.659728 52.7755 0.976311 52.9708 1.17157L55.7992 4L52.9708 6.82843C52.7755 7.02369 52.7755 7.34027 52.9708 7.53553C53.1661 7.7308 53.4827 7.7308 53.6779 7.53553L56.8599 4.35355ZM0 4.5H56.5063V3.5H0V4.5Z" fill="white" fill-opacity="0.33"/>
</svg>`
const { SvgXml } = Svg;

export const LongRightArrowIcon = (props) => {
    return (
        <SvgXml xml={svgMarkup} />       
    )
}