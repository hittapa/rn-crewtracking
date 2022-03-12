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

export const { width, height } = Dimensions.get('window');

const carouselItems = [
    {
        title: 'Spending time at sea?\nLog your time onboard now!',
        text: '',
        image: require('../../assets/images/crewlog-logo.png'),
        imageWidth: 200,
        imageHeight: 75,
    },
    {
        title: 'Keep a professional log',
        text:
        'Record and calculate your sea time and service in your online logbook',
        image: require('../../assets/images/professional_log.png'),
        imageWidth: 200,
        imageHeight: 339,
    },
    {
        title: 'Track your trips',
        text:
        'Simply add your vessel, start a trip and track your progress as your travel',
        image: require('../../assets/images/trip_thumbnail.png'),
        imageWidth: 300,
        imageHeight: 339,
    },
    {
        title: 'Create proof of sea time',
        text:
            'Use our Sea Time Endorsement system & create, email and endorse all forms online',
        image: require('../../assets/images/welcome-slide-4.png'),
        imageWidth: 300,
        imageHeight: 350,
    },
];

const CarouselComponent = () => {
    const [scrollX] = React.useState(new Animated.Value(0));
    const [dotPosition] = React.useState(new Animated.divide(scrollX, width));

    function renderContent() {
        return (
            <LinearGradient
                colors={['#ffffff', '#ffffff00', '#ffffff00', '#ffffff00', '#ffffff44', '#ffffff88', '#ffffff', '#ffffff', '#ffffff']}
                style={{
                    height: height - 250 + Constants.statusBarHeight,
                }}
            >
                <Animated.ScrollView
                    horizontal
                    pagingEnabled
                    scrollEnabled
                    decelerationRate={0}
                    scrollEventThrottle={16}
                    snapToAlignment="center"
                    showsHorizontalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false },
                    )}
                >
                    {carouselItems.map((item, index) => {
                        return (
                            <View
                                key={index}
                                style={{
                                    alignItems: 'center',
                                    width: width,
                                    height: height - 250,
                                    flex: 1,
                                    paddingTop: 50 + Constants.statusBarHeight,
                                    justifyContent: 'center',
                                }}
                            >
                                <View
                                    style={{
                                        flex: 1,
                                        // width: 300,
                                        height: height - 350,
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Image
                                        source={item.image}
                                        style={{
                                            width: item.imageWidth,
                                            height: '100%',
                                            alignSelf: 'center',
                                            top: 0,
                                            resizeMode: 'contain'
                                        }}
                                    />
                                </View>
                                <View
                                    style={{
                                        // height: 180,
                                        justifyContent: 'flex-start',
                                        paddingHorizontal: 30
                                    }}
                                >
                                    <Text style={styles.headLine}>
                                        {item.title}
                                    </Text>
                                    {
                                        item.text != '' && (
                                            <Text style={styles.text}>{item.text}</Text>
                                        )
                                    }
                                </View>
                            </View>
                        );
                    })}
                </Animated.ScrollView>
            </LinearGradient>
        );
    }

    function renderDots() {
        return (
            <View style={styles.dotContainer}>
                {carouselItems.map((item, index) => {
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
        <SafeAreaView style={{ width: '100%', marginTop: -Constants.statusBarHeight }}>
            <View>{renderContent()}</View>
            <View style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white'
            }}>{renderDots()}</View>
        </SafeAreaView>
    );
};

export default CarouselComponent;

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
