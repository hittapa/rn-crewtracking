import React from 'react';
import * as Svg from 'react-native-svg';
const svgMarkup = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.0058 3.12455L13.8746 4.99249L12.0058 3.12455ZM13.2075 1.47896L8.15431 6.53219C7.89321 6.79293 7.71514 7.12512 7.64255 7.4869L7.17578 9.82336L9.51225 9.35572C9.87401 9.28337 10.2058 9.10601 10.467 8.84484L15.5202 3.79161C15.672 3.63976 15.7925 3.45949 15.8747 3.26108C15.9568 3.06268 15.9991 2.85003 15.9991 2.63529C15.9991 2.42054 15.9568 2.20789 15.8747 2.00949C15.7925 1.81109 15.672 1.63081 15.5202 1.47896C15.3683 1.32711 15.1881 1.20666 14.9897 1.12448C14.7913 1.0423 14.5786 1 14.3639 1C14.1491 1 13.9365 1.0423 13.7381 1.12448C13.5397 1.20666 13.3594 1.32711 13.2075 1.47896V1.47896Z" stroke="#ABABAB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.2353 11.5882V14.2352C14.2353 14.7032 14.0494 15.1521 13.7184 15.4831C13.3875 15.814 12.9386 15.9999 12.4706 15.9999H2.7647C2.29668 15.9999 1.84782 15.814 1.51687 15.4831C1.18592 15.1521 1 14.7032 1 14.2352V4.52935C1 4.06132 1.18592 3.61246 1.51687 3.28152C1.84782 2.95057 2.29668 2.76465 2.7647 2.76465H5.41176" stroke="#ABABAB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
const { SvgXml } = Svg;

export default EditIcon = (props) => {
    return (
        <SvgXml width={props?.width ? props.width : 17} height={props?.height ? props.height : 17} xml={svgMarkup} />
    )
}