import React from 'react';
import { Platform } from 'react-native';
import { Switch } from 'react-native-switch';

export function CustomSwitch({ value = false, toggleSwitch }) {
    return (
        <Switch
            value={value}
            onValueChange={toggleSwitch}
            disabled={false}
            circleSize={30}
            circleBorderWidth={0}
            backgroundActive={'#34c759'}
            backgroundInactive={'#78788028'}
            circleActiveColor={'#fff'}
            circleInActiveColor={'#fff'}
            changeValueImmediately={true}
            innerCircleStyle={
                Platform.select({
                    ios: {
                        width: 27,
                        height: 27
                    },
                    android: {
                        alignItems: "center",
                        justifyContent: "center",
                        shadowOffset: { width: 0, height: 1 },
                        shadowColor: '#888',
                        shadowOpacity: .7,
                        elevation: 1,
                        width: 27,
                        height: 27
                    }
                })
            } // style for inner animated circle for what you (may) be rendering inside the circle
            containerStyle={{
                paddingVertical: 2
            }}
            renderActiveText={false}
            renderInActiveText={false}
            switchLeftPx={4} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
            switchRightPx={4} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
            switchWidthMultiplier={1.5} // multipled by the `circleSize` prop to calculate total width of the Switch
            switchBorderRadius={30}
        />
    )
}