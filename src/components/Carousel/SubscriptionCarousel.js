import React from 'react';
import {
    Text,
    Dimensions,
    Image,
    StyleSheet,
    View,
    SafeAreaView,
} from 'react-native';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Constants from 'expo-constants';
import { ImageBackground } from 'react-native';

export const { width, height } = Dimensions.get('window');

const SubscriptionCarousel = () => {
    const [scrollX] = React.useState(new Animated.Value(0));
    const [dotPosition] = React.useState(new Animated.divide(scrollX, width));

    const contentH = height * .44;
    const levH = (contentH - 100) / 3;
    function renderContent() {
        return (
            // <Animated.ScrollView
            //     horizontal
            //     pagingEnabled
            //     scrollEnabled
            //     decelerationRate={0}
            //     scrollEventThrottle={16}
            //     snapToAlignment="center"
            //     showsHorizontalScrollIndicator={false}
            //     onScroll={Animated.event(
            //         [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            //         { useNativeDriver: false },
            //     )}
            // >
            <View
                style={{
                    alignItems: 'center',
                    width: width,
                    justifyContent: 'flex-start',
                    height: contentH
                }}
            >
                <LinearGradient
                    colors={['#0074f485', '#0074f484']}
                    style={{ width: width, backgroundColor: '#96c3f4', }}
                >
                    <ImageBackground
                        source={require('../../assets/images/1.png')}
                        imageStyle={{ height: '80%', resizeMode: 'contain', marginTop: 5 }}
                        style={{ width: '100%', height: levH, paddingVertical: 0 }}
                    >
                        <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                            <Text style={{ fontFamily: 'Roboto-Regular', fontSize: width / 28, lineHeight: 22, letterSpacing: -0.08, color: '#ffffff', width: width * 0.70, textAlign: 'center',  }}>
                                Live onboard as professional crew?
                            </Text>
                        </View>
                    </ImageBackground>
                </LinearGradient>
                <LinearGradient
                    colors={['#73ace6', '#72abe5', '#76abe5', '#86b6e7', '#8ebae7', '#97bfe8']}
                    style={{ width: width }}
                >
                    <ImageBackground
                        source={require('../../assets/images/2.png')}
                        imageStyle={{ height: '80%', resizeMode: 'contain', marginTop: 5 }}
                        style={{ width: '100%', height: levH, paddingVertical: 0 }}
                    >
                        <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                            <Text style={{ fontFamily: 'Roboto-Regular', fontSize: width / 28, lineHeight: 22, letterSpacing: -0.08, color: '#ffffff', width: width * 0.70, textAlign: 'center',  }}>
                                Required to track your time at sea?
                            </Text>
                        </View>
                    </ImageBackground>
                </LinearGradient>
                <LinearGradient
                    colors={['#739bcc', '#789dcd', '#799ece', '#90acd1', '#93afd2', '#97afd2']}
                    style={{ width: width, backgroundColor: '#0074f435', }}
                >
                    <ImageBackground
                        source={require('../../assets/images/3.png')}
                        imageStyle={{ height: '80%', resizeMode: 'contain', marginTop: 5 }}
                        style={{ width: '100%', height: levH, paddingVertical: 0 }}
                    >
                        <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                            <Text style={{ fontFamily: 'Roboto-Regular', fontSize: width / 28, lineHeight: 22, letterSpacing: -0.08, color: '#ffffff', width: width * 0.70, textAlign: 'center',  }}>
                                Thinking about applying for a license and need proof of sea time?
                            </Text>
                        </View>
                    </ImageBackground>
                </LinearGradient>
                <View
                    style={{
                        // height: 180,
                        justifyContent: 'flex-start',
                        paddingHorizontal: 35,
                        paddingVertical: 20
                    }}
                >
                    <Text style={{
                        fontFamily: 'Roboto-Thin',
                        fontSize: width / 23,
                        lineHeight: 25.5,
                        letterSpacing: -0.3,
                        color: '#000',
                        textAlign: 'center'
                    }}>
                        Upgrade to Crewlog PRO and get the help you need with logging your time at sea for your next credential
                    </Text>
                </View>
            </View>
            //     <View
            //         style={{
            //             width: width,
            //             height: '100%'
            //         }}
            //     >
            //         <LinearGradient
            //             colors={['#1F4400f9']}
            //             style={{ width: width, backgroundColor: '#a2b294', }}
            //         >
            //             <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            //                 <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 100, lineHeight: 100, letterSpacing: -0.41, color: '#ffffff76' }}>
            //                     1
            //                 </Text>
            //                 <Text style={{ fontFamily: 'Roboto-Regular', fontSize: width / 28, lineHeight: 22, letterSpacing: -0.08, color: '#ffffff', width: width * 0.80, textAlign: 'center', position: 'absolute' }}>
            //                     We will detect, track and record your trips traveled at sea in the background and automatically calculate things such as..
            //                 </Text>
            //             </View>
            //         </LinearGradient><LinearGradient
            //             colors={['#7a9167', '#7a9167', '#7a9167', '#7a9167', '#7a9167', '#7a9169']}
            //             style={{ width: width, backgroundColor: '#7a9167',  }}
            //         >
            //             <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            //                 <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 100, lineHeight: 100, letterSpacing: -0.41, color: '#ffffff76' }}>
            //                     2
            //                 </Text>
            //                 <Text style={{ fontFamily: 'Roboto-Regular', fontSize: width / 28, lineHeight: 22, letterSpacing: -0.08, color: '#ffffff', width: width * 0.80, textAlign: 'center', position: 'absolute' }}>
            //                     Days underway Watchkeeping service Yard periods Days seaward and shoreward of USCG 46 CFR part 7 boundary line Average distance offshore Average hours underway per day
            //                 </Text>
            //             </View>
            //         </LinearGradient>
            //         <LinearGradient
            //             colors={['#688343', '#688359', '#688353', '#688353', '#688353', '#688353']}
            //             style={{ width: width }}
            //         >
            //             <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            //                 <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 100, lineHeight: 100, letterSpacing: -0.41, color: '#ffffff76' }}>
            //                     3
            //                 </Text>
            //                 <Text style={{ fontFamily: 'Roboto-Regular', fontSize: width / 28, lineHeight: 22, letterSpacing: -0.08, color: '#ffffff', width: width * 0.80, textAlign: 'center', position: 'absolute' }}>
            //                     ..AND submit your sea time records directly to your captain (or responsible person) for an official endorsement
            //                 </Text>
            //             </View>
            //         </LinearGradient>
            //         <View
            //             style={{
            //                 // height: 180,
            //                 justifyContent: 'flex-start',
            //                 paddingHorizontal: 35,
            //                 paddingVertical: 20
            //             }}
            //         >
            //             <Text style={{
            //                 fontFamily: 'Roboto-Thin',
            //                 fontSize: width / 23,
            //                 lineHeight: 25.5,
            //                 letterSpacing: -0.3,
            //                 color: '#000',
            //                 textAlign: 'center'
            //             }}>
            //                 Upgrade to Crewlog PRO and get the help you need with logging your time at sea for your next credential
            //             </Text>
            //         </View>
            //     </View>
            // </Animated.ScrollView>
        );
    }

    function renderDots() {
        return (
            <View style={styles.dotContainer}>
                {[1, 2].map((item, index) => {
                    const opacity = Animated.interpolate(dotPosition, {
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp',
                    });

                    const dotSize = Animated.interpolate(dotPosition, {
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [10, 14, 10],
                        extrapolate: 'clamp',
                    });

                    return (
                        <Animated.View
                            key={`dot-${index}`}
                            opacity={opacity}
                            style={[
                                styles.dot,
                                {
                                    width: dotSize,
                                    height: dotSize,
                                },
                            ]}
                        ></Animated.View>
                    );
                })}
            </View>
        );
    }

    return (
        <SafeAreaView style={{ width: '100%' }}>
            <View>{renderContent()}</View>
            {/* <View style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white'
            }}>{renderDots()}</View> */}
        </SafeAreaView>
    );
};

export default SubscriptionCarousel;

const styles = StyleSheet.create({
    dotContainer: {
        flexDirection: 'row',
        height: 30,
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 10,
    },
    dot: {
        borderRadius: 40,
        backgroundColor: '#888888',
        marginHorizontal: 20 / 2,
    },
    headLine: {
        fontFamily: 'Roboto-Thin',
        fontSize: width / 16,
        lineHeight: 36.5,
        color: '#000000',
        marginTop: 15,
        marginBottom: 10,
        textAlign: 'center',
        letterSpacing: -0.08
    },
    text: {
        fontFamily: 'Roboto-Thin',
        fontSize: width / 23,
        color: '#000000',
        marginTop: 15,
        textAlign: 'center',
        lineHeight: 25.5,
        letterSpacing: -0.3
    },
});
