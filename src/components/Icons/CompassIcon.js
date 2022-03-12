import React from 'react';
import * as Svg from 'react-native-svg';
const svgMarkup = `<svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0)">
<path d="M8.63351 9.16021C8.15468 9.62408 8.15468 10.3759 8.63351 10.8394C9.11196 11.3033 9.88843 11.3033 10.3669 10.8394C10.8457 10.3755 10.8457 9.62371 10.3669 9.16021C9.88804 8.69672 9.11196 8.69672 8.63351 9.16021ZM9.5 0.796875C4.25317 0.796875 0 4.91713 0 10C0 15.0829 4.25317 19.2031 9.5 19.2031C14.7468 19.2031 19 15.0829 19 10C19 4.91713 14.7468 0.796875 9.5 0.796875ZM14.332 6.29092L11.8049 11.6477C11.6827 11.9067 11.4682 12.1145 11.2008 12.2329L5.67165 14.681C5.03385 14.9634 4.37651 14.3266 4.66802 13.7087L7.19548 8.35197C7.31772 8.09292 7.53216 7.88517 7.79958 7.76676L13.3287 5.31865C13.9665 5.03662 14.6235 5.67305 14.332 6.29092Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0">
<rect width="19" height="19" fill="white" transform="translate(0 0.5)"/>
</clipPath>
</defs>
</svg>`
const { SvgXml } = Svg;

export const CompassIcon = (props) => {
    return (
        <SvgXml width={props?.width ? props.width : 19} height={props?.height ? props.height : 20} xml={svgMarkup} />       
    )
}