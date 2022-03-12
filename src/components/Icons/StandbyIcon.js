import React from 'react';
import * as Svg from 'react-native-svg';
const svgMarkup = `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.6259 23.5871C15.4115 23.6406 15.1929 23.688 14.9759 23.728C14.4088 23.8334 14.0338 24.3789 14.1387 24.9466C14.1905 25.2259 14.3491 25.4585 14.5645 25.6104C14.7864 25.7666 15.0689 25.8371 15.3567 25.7836C15.6151 25.7356 15.8755 25.6792 16.131 25.6154C16.6911 25.4761 17.0323 24.9087 16.8926 24.3489C16.7532 23.7886 16.1863 23.4476 15.6259 23.5871Z" fill="white"/>
<path d="M23.3561 9.57737C23.4293 9.79803 23.5691 9.97816 23.7456 10.1026C24.0074 10.287 24.35 10.349 24.6769 10.241C25.2249 10.059 25.5219 9.468 25.3406 8.92022C25.258 8.6705 25.1663 8.42 25.0687 8.1761C24.8543 7.64011 24.2463 7.37916 23.71 7.59356C23.1743 7.80784 22.9133 8.41598 23.1278 8.95213C23.2099 9.15714 23.2867 9.36756 23.3561 9.57737Z" fill="white"/>
<path d="M19.0231 22.0947C18.8387 22.2165 18.6484 22.3343 18.4567 22.4447C17.9565 22.7332 17.7852 23.3725 18.0736 23.8724C18.1519 24.0084 18.2562 24.1196 18.3763 24.2045C18.6988 24.4314 19.1367 24.4654 19.5012 24.2553C19.7291 24.1239 19.9558 23.984 20.1754 23.8388C20.6568 23.5208 20.7893 22.8723 20.4711 22.3906C20.1529 21.9088 19.5047 21.7764 19.0231 22.0947Z" fill="white"/>
<path d="M25.99 12.4966C25.9672 11.9197 25.4813 11.4707 24.9043 11.4932C24.3279 11.516 23.8786 12.0021 23.9012 12.5787C23.9099 12.7992 23.9121 13.023 23.907 13.2433C23.8989 13.605 24.0759 13.9275 24.3508 14.1214C24.5147 14.2367 24.7135 14.3065 24.929 14.3114C25.5059 14.3242 25.984 13.8667 25.9968 13.2895C26.0026 13.0263 26.0004 12.7597 25.99 12.4966Z" fill="white"/>
<path d="M23.1849 19.3452C22.7223 18.9981 22.0678 19.0923 21.7213 19.5541C21.5887 19.7309 21.4489 19.9056 21.3059 20.0738C20.9319 20.5131 20.9848 21.1729 21.4241 21.5471C21.4491 21.5683 21.4744 21.5878 21.5007 21.6062C21.9374 21.9141 22.5444 21.8433 22.8975 21.4289C23.0683 21.2283 23.2349 21.0197 23.3935 20.8084C23.74 20.3467 23.6462 19.6918 23.1849 19.3452Z" fill="white"/>
<path d="M24.722 15.5667C24.1712 15.394 23.5846 15.7006 23.412 16.2514C23.346 16.4618 23.2727 16.6733 23.1937 16.8803C23.0202 17.3362 23.1864 17.8377 23.5676 18.1065C23.6375 18.1556 23.7145 18.1973 23.7982 18.2289C24.3375 18.4347 24.9414 18.1641 25.147 17.6246C25.2408 17.3784 25.3279 17.1269 25.4066 16.8767C25.579 16.3258 25.2727 15.7394 24.722 15.5667Z" fill="white"/>
<path d="M11.0661 23.7373C10.1317 23.5695 9.23524 23.2838 8.38521 22.8853C8.37515 22.88 8.36615 22.8741 8.35559 22.8693C8.15528 22.775 7.95531 22.674 7.76148 22.5685C7.76081 22.5677 7.75958 22.5672 7.75852 22.5667C7.40289 22.3709 7.05581 22.1542 6.71863 21.9168C1.80187 18.4533 0.619687 11.6354 4.08341 6.71872C4.83659 5.65 5.74804 4.75838 6.76418 4.05171C6.7767 4.04299 6.78922 4.03433 6.80162 4.02555C10.3823 1.55834 15.2444 1.39207 19.0465 3.92735L18.2299 5.10725C18.0029 5.43566 18.1425 5.67498 18.54 5.63921L22.0872 5.32164C22.4851 5.28587 22.7231 4.94165 22.616 4.55735L21.6635 1.12536C21.5569 0.740618 21.2838 0.694564 21.0566 1.02292L20.2381 2.20561C17.4478 0.332565 14.1012 -0.381654 10.7795 0.194349C10.4449 0.252251 10.1151 0.323119 9.78973 0.405613C9.78721 0.40606 9.7852 0.406339 9.78319 0.406786C9.77061 0.40986 9.75787 0.41394 9.74563 0.41735C6.88127 1.15292 4.38215 2.82353 2.59886 5.20712C2.58383 5.22495 2.56835 5.24239 2.55415 5.26178C2.49485 5.34165 2.436 5.42336 2.37838 5.50507C2.28415 5.63899 2.19126 5.77625 2.10239 5.91352C2.09127 5.93006 2.08278 5.94688 2.07305 5.96359C0.601467 8.24396 -0.108336 10.8803 0.0133924 13.5642C0.0136719 13.5731 0.0131688 13.582 0.0133924 13.591C0.0251852 13.8532 0.0459763 14.119 0.0742007 14.3807C0.0757098 14.3976 0.0794544 14.4136 0.0823048 14.4304C0.111479 14.6936 0.148087 14.9573 0.193973 15.221C0.660319 17.9114 1.92947 20.3324 3.83124 22.2162C3.83565 22.2206 3.84024 22.2254 3.84471 22.23C3.84627 22.2317 3.84801 22.2326 3.84951 22.2342C4.36046 22.7382 4.91623 23.2043 5.51465 23.6258C7.08068 24.7293 8.82451 25.4587 10.6973 25.7948C11.2655 25.8969 11.8083 25.5186 11.9103 24.9507C12.0121 24.3823 11.6342 23.8391 11.0661 23.7373Z" fill="white"/>
<path d="M12.3587 4.55566C11.8913 4.55566 11.5127 4.9346 11.5127 5.40134V13.8266L19.2183 17.8099C19.3423 17.8741 19.4751 17.9044 19.6057 17.9044C19.9118 17.9044 20.2074 17.7377 20.3577 17.4469C20.572 17.0319 20.4098 16.522 19.9948 16.3077L13.2038 12.7968V5.40134C13.2037 4.9346 12.8256 4.55566 12.3587 4.55566Z" fill="white"/>
</svg>`
const { SvgXml } = Svg;

export const StandbyIcon = () => {
    return (
        <SvgXml xml={svgMarkup} />       
    )
}