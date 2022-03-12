import React from 'react';
import * as Svg from 'react-native-svg';
const svgMarkup = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2 20C2.22717 20.3165 2.52797 20.573 2.87642 20.7472C3.22488 20.9214 3.6105 21.0082 4 21C4.3895 21.0082 4.77512 20.9214 5.12358 20.7472C5.47203 20.573 5.77283 20.3165 6 20C6.22717 19.6835 6.52797 19.4271 6.87643 19.2529C7.22488 19.0787 7.61051 18.9919 8 19C8.3895 18.9919 8.77513 19.0787 9.12358 19.2529C9.47203 19.4271 9.77283 19.6835 10 20C10.2272 20.3165 10.528 20.573 10.8764 20.7472C11.2249 20.9214 11.6105 21.0082 12 21C12.3895 21.0082 12.7751 20.9214 13.1236 20.7472C13.472 20.573 13.7728 20.3165 14 20C14.2272 19.6835 14.528 19.4271 14.8764 19.2529C15.2249 19.0787 15.6105 18.9919 16 19C16.3895 18.9919 16.7751 19.0787 17.1236 19.2529C17.472 19.4271 17.7728 19.6835 18 20C18.2272 20.3165 18.528 20.573 18.8764 20.7472C19.2249 20.9214 19.6105 21.0082 20 21C20.3895 21.0082 20.7751 20.9214 21.1236 20.7472C21.472 20.573 21.7728 20.3165 22 20" stroke="#616667" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
<path d="M4 18L3 13H21L19 17" stroke="#616667" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
<path d="M5 13V7H13L17 13" stroke="#616667" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
<path d="M7 7V3H6" stroke="#616667" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
</svg>`
const { SvgXml } = Svg;

export const VesselIcon = () => {
    return (
        <SvgXml xml={svgMarkup} />       
    )
}