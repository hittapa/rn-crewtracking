import React from 'react';
import * as Svg from 'react-native-svg';
const svgMarkup = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 12L10 18L20 6" stroke="#4BAB00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
const { SvgXml } = Svg;

export default DoneIcon = (props) => {
    return (
        <SvgXml width={props?.width ? props.width : 17} height={props?.height ? props.height : 17} xml={svgMarkup} />
    )
}