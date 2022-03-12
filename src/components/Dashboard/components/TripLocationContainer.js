import { Feather, FontAwesome5 } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions } from 'react-native';
import { Tooltip } from 'react-native-elements';
import { Colors } from '../../../styles/index';
import * as GlobalStyles from '../../../styles/styles';
import { width } from '../../Carousel/Carousel';
// import Animated from 'react-native-reanimated';

export const TripLocationContainer = ({
    trip,
    placeOf,
    countryCode,
    portName,
    fullName,
    portCode,
    time,
    componentName
}) => {

    const [dotLeft] = useState(new Animated.Value(0));
    const [dotTop] = useState(new Animated.Value(0));
    const [locLeft] = useState(new Animated.Value(0));
    const [locTop] = useState(new Animated.Value(0));
    const [arrowLeft] = useState(new Animated.Value(0));
    const [arrowTop] = useState(new Animated.Value(0));
    const [opacity] = useState(new Animated.Value(0));
    const [arrowOpacity] = useState(new Animated.Value(0));
    const [height] = useState(new Animated.Value(50));
    const [locodeWidth] = useState(new Animated.Value(150));

    useEffect(() => {
        if (componentName == 'tripMap') {
            Animated.timing(dotLeft, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false
            }).start();
            Animated.timing(dotTop, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false
            }).start();
            Animated.timing(locLeft, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false
            }).start();
            Animated.timing(locTop, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false
            }).start();
            Animated.timing(arrowLeft, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false
            }).start();
            Animated.timing(arrowTop, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false
            }).start();
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false
            }).start();
            Animated.timing(arrowOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false
            }).start();
            Animated.timing(height, {
                toValue: 50,
                duration: 500,
                useNativeDriver: false
            }).start();
            Animated.timing(locodeWidth, {
                toValue: 150,
                duration: 55,
                useNativeDriver: false
            }).start();
        }
        if (componentName == 'tripStats' || componentName == 'tripNotes') {
            Animated.timing(dotLeft, {
                toValue: placeOf == 'joining' ? 30 : Dimensions.get('screen').width / 2,
                duration: 300,
                useNativeDriver: false
            }).start();
            Animated.timing(dotTop, {
                toValue: placeOf == 'joining' ? 25 : 0,
                duration: 300,
                useNativeDriver: false
            }).start();
            Animated.timing(locLeft, {
                toValue: placeOf == 'joining' ? 20 : Dimensions.get('screen').width / 2 - 10,
                duration: 300,
                useNativeDriver: false
            }).start();
            Animated.timing(locTop, {
                toValue: placeOf == 'joining' ? 25 : 0,
                duration: 300,
                useNativeDriver: false
            }).start();
            Animated.timing(arrowLeft, {
                toValue: Dimensions.get('screen').width / 2 - 170,
                duration: 300,
                useNativeDriver: false
            }).start();
            Animated.timing(arrowTop, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false
            }).start();
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false
            }).start();
            Animated.timing(arrowOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false
            }).start();
            Animated.timing(height, {
                toValue: 25,
                duration: 500,
                useNativeDriver: false
            }).start();
            Animated.timing(locodeWidth, {
                toValue: 55,
                duration: 150,
                useNativeDriver: false
            }).start();
        }
    }, [
        placeOf,
        countryCode,
        portName,
        portCode,
        time,
        componentName
    ])

    return (
        <>
            <Animated.View style={[
                {
                    ...styles.container,
                    backgroundColor: 'transparent',
                    height: height
                },
                componentName != 'tripMap' && { borderWidth: 0 },
            ]}>
                <Animated.View style={[
                    styles.dotContainer,
                    componentName == 'tripMap' ?
                        placeOf == 'joining' ?
                            { backgroundColor: '#f3ffe9' } :
                            { backgroundColor: '#ffefef' }
                        :
                        { backgroundColor: 'transparent', borderWidth: 0 },
                ]}
                >
                    <Tooltip
                        popover={
                            <Text style={styles.tooltipText}>{placeOf == 'joining' ? trip.customStartLocode == null ? `${fullName}[${countryCode}]` : trip.customStartLocode : trip.customEndLocode == null ? `${fullName}[${countryCode}]` : trip.customEndLocode}</Text>
                        }
                        backgroundColor={"#000"}
                        overlayColor={"#ffffff00"}
                        containerStyle={{
                            width: 'auto',
                            height: 'auto',
                            maxWidth: width * 0.8
                        }}
                    >
                        {placeOf === 'joining' ? (
                            <Animated.View style={{ ...styles.greenDot, left: dotLeft, top: dotTop }}></Animated.View>
                        ) : (
                            <Animated.View style={{ ...styles.redDot, left: dotLeft, top: dotTop }}></Animated.View>
                        )}
                    </Tooltip>
                </Animated.View>
                <Animated.View
                    style={{
                        width: '50%',
                        flexGrow: 1,
                        paddingLeft: 15,
                        flexDirection: 'row',
                        left: locLeft,
                        top: locTop
                    }}
                >
                    {
                        placeOf == 'joining' ?
                            trip.customStartLocode == null && (
                                <Text
                                    style={{
                                        fontFamily: 'Roboto-Regular',
                                        fontSize: width / 26,
                                        lineHeight: 18.75,
                                        letterSpacing: -0.3,
                                        color: '#767676',

                                    }}
                                >
                                    {countryCode + "  "}
                                </Text>
                            ) :
                            trip.customEndLocode == null && (
                                <Text
                                    style={{
                                        fontFamily: 'Roboto-Regular',
                                        fontSize: width / 26,
                                        lineHeight: 18.75,
                                        letterSpacing: -0.3,
                                        color: '#767676',

                                    }}
                                >
                                    {countryCode + "  "}
                                </Text>
                            )
                    }
                    {
                        placeOf == 'joining' ?
                            trip.customStartLocode == null && (
                                <Text
                                    style={{
                                        fontFamily: 'Roboto-Regular',
                                        fontSize: width / 26,
                                        lineHeight: 18.75,
                                        letterSpacing: -0.3,
                                        color: '#000000',
                                    }}
                                >
                                    {portName}
                                </Text>
                            ) :
                            trip.customEndLocode == null && (
                                <Text
                                    style={{
                                        fontFamily: 'Roboto-Regular',
                                        fontSize: width / 26,
                                        lineHeight: 18.75,
                                        letterSpacing: -0.3,
                                        color: '#000000',
                                    }}
                                >
                                    {portName}
                                </Text>
                            )
                    }
                    {
                        placeOf == 'joining' ?
                            trip.customStartLocode && (
                                <Animated.Text
                                    style={{
                                        fontFamily: 'Roboto-Regular',
                                        fontSize: width / 26,
                                        lineHeight: 18.75,
                                        letterSpacing: -0.3,
                                        color: '#000000',
                                        width: locodeWidth
                                    }}
                                    numberOfLines={1}
                                >
                                    {trip.customStartLocode}
                                </Animated.Text>
                            ) :
                            trip.customEndLocode && (
                                <Animated.Text
                                    style={{
                                        fontFamily: 'Roboto-Regular',
                                        fontSize: width / 26,
                                        lineHeight: 18.75,
                                        letterSpacing: -0.3,
                                        color: '#000000',
                                        width: locodeWidth
                                    }}
                                    numberOfLines={1}
                                >
                                    {trip.customEndLocode}
                                </Animated.Text>
                            )
                    }
                    {
                        placeOf == 'joining' && componentName != 'tripMap' && (
                            <Animated.View
                                style={{
                                    width: 'auto',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    left: arrowLeft,
                                    top: arrowTop,
                                    opacity: arrowOpacity,
                                    bottom: 0,
                                }}
                            >
                                <Feather name={'arrow-right'} size={16} color={'#d7d7d7'} />
                            </Animated.View>
                        )
                    }
                </Animated.View>
                <Animated.View
                    style={{
                        width: '5%',
                        flexGrow: 1,
                        paddingLeft: 5,
                        opacity: opacity
                    }}
                >
                    <Tooltip
                        popover={
                            <Text style={styles.tooltipText}>{placeOf == 'joining' ? "Actual time of departure" : "Actual time of arrival"}</Text>
                        }
                        backgroundColor={"#000"}
                        overlayColor={"#ffffff00"}
                        containerStyle={{
                            width: 'auto',
                            height: 'auto',
                            maxWidth: width * 0.8
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'Roboto-Bold',
                                fontSize: width / 33,
                                lineHeight: 15.08,
                                letterSpacing: -0.3,
                                color: '#c6c6c8',
                            }}
                        >
                            {portCode}
                        </Text></Tooltip>
                </Animated.View>
                <Animated.View
                    style={{
                        width: 75,
                        height: '100%',
                        borderWidth: .5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor: '#b6b6b632',
                        opacity: opacity
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'SourceSansPro-Regular',
                            fontSize: width / 30,
                            lineHeight: 17.6,
                            letterSpacing: -0.3,
                            color: '#333333',
                        }}
                    >
                        {time}
                    </Text>
                </Animated.View>
            </Animated.View>
            {placeOf === 'joining' && componentName == 'tripMap' ? (
                <View
                    style={{
                        width: 1,
                        height: 10,
                        backgroundColor: Colors.colorGrey5,
                        marginLeft: 20,
                    }}
                />
            ) : null}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        // ...GlobalStyles.FlexContainer,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        // flexGrow: 1,
        backgroundColor: Colors.colorWhite,
        borderWidth: .5,
        borderColor: '#d7d7d7',
        borderRadius: 7,
        height: 50
    },
    tripContainer: {
        width: 350,
        height: 'auto',
        borderRadius: 10,
        padding: 20,
        marginTop: 30,
        alignItems: 'center',
        backgroundColor: Colors.colorWhite,
    },
    redDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.colorRed,
        marginLeft: 12.93,
        marginRight: 11.14,
        marginVertical: 18
    },
    greenDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.colorGreen,
        marginLeft: 12.93,
        marginRight: 11.14,
        marginVertical: 18
    },
    dotContainer: {
        borderTopLeftRadius: 7,
        borderBottomLeftRadius: 7,
        borderWidth: .5,
        borderColor: '#b6b6b632'
    },
    tooltipText: {
        color: '#ffffff',
        fontFamily: 'Roboto-Regular',
        fontSize: width/27,
        lineHeight: 22,
        letterSpacing: -0.41,
        textAlign: 'center'
    }
});

export default TripLocationContainer;
