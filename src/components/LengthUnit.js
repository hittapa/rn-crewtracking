import React from 'react';
import { Platform } from 'react-native';
import { Switch } from 'react-native-switch';
import { height, width } from './Carousel/Carousel';

export function LengthUnit({ value = false, toggleSwitch }) {
    console.log(width, height);
    return (
        <Switch
            value={value}
            onValueChange={toggleSwitch}
            disabled={false}
            circleSize={30}
            circleBorderWidth={0}
            backgroundActive={'#7676801e'}
            backgroundInactive={'#7676801e'} //7676801e
            circleActiveColor={'#fff'}
            circleInActiveColor={'#fff'}
            changeValueImmediately={true}
            innerCircleStyle={
                Platform.select({
                    ios: {
                        width: width < 400 ? 30 : 50,
                        height: 27
                    },
                    android: {
                        alignItems: "center",
                        justifyContent: "center",
                        shadowOffset: { width: 0, height: 1 },
                        shadowColor: '#888',
                        shadowOpacity: .7,
                        elevation: 1,
                        width: 50,
                        height: 27,
                        borderRadius: 7
                    }
                })
            } // style for inner animated circle for what you (may) be rendering inside the circle
            containerStyle={{
                paddingVertical: 2,
                height: 36,
                width: width < 400 ? 105 : 137
            }}
            renderActiveText={true}
            renderInActiveText={true}
            activeText="Ft        "
            activeTextStyle={{
                fontSize: width/27, fontFamily: 'SourceSansPro-Regular', fontWeight: '600', lineHeight: 20, letterSpacing: -0.24, color: '#000'
            }}
            inActiveText="    Meters"
            inactiveTextStyle={{
                fontSize: width/27, fontFamily: 'SourceSansPro-Regular', fontWeight: '600', lineHeight: 20, letterSpacing: -0.24, color: '#000', textAlign: 'left'
            }}
            switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
            switchRightPx={5.5} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
            switchWidthMultiplier={4} // multipled by the `circleSize` prop to calculate total width of the Switch
            switchBorderRadius={Platform.select({
                ios: 16,
                android: 9
            })}
        />
    )
}