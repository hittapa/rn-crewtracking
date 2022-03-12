import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, ImageBackground, ScrollView, View } from 'react-native';
import * as GlobalStyles from '../styles/styles';
import { Buttons } from '../styles/index';
import * as Location from 'expo-location';
import CarouselComponent, { width } from '../components/Carousel/Carousel';
import CustomButton from '../components/CustomButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';

function WelcomeScreen({ navigation }) {
    // const [location, setLocation] = useState(null);
    // const [errorMsg, setErrorMsg] = useState(null);
    // const [mounted, setMounted] = useState(false);

    // useEffect(() => {
    //     if (!mounted) {
    //         (async () => {
    //             let { status } = await Location.requestPermissionsAsync();
    //             if (status !== 'granted') {
    //                 setErrorMsg('Permission to access location was denied');
    //             }

    //             let location = await Location.getCurrentPositionAsync({});
    //             setLocation(location);
    //         })();
    //         setMounted(true)
    //     }
    // }, [mounted]);

    // let text = 'Waiting..';
    // if (errorMsg) {
    //     text = errorMsg;
    // } else if (location) {
    //     text = JSON.stringify(location);
    // }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require('../assets/images/crewlog-welcome-screen.png')}
                style={styles.image}
                accessibilityRole={'image'}
                imageStyle={styles.imgStyle}
                resizeMode="cover"
            >
                <CarouselComponent />

                <View style={{ width: '100%', backgroundColor: 'white', justifyContent: 'flex-start', alignItems: 'center', height: 250 }}>
                    <CustomButton
                        title={'Sign up FREE'}
                        onPress={() => navigation.navigate('RegisterScreen')}
                        containerStyle={{
                            width: '70%',
                            height: 50,
                            shadowOffset: { width: 0, height: 14 },
                            shadowColor: '#00000055',
                            shadowOpacity: .3,
                            elevation: 2,
                            shadowRadius: 16.00
                        }}
                        textStyle={{ color: 'white' }}
                    />
                    {/* <CustomButton
                        title={'Continue with Facebook'}
                        onPress={() => { }}
                        containerStyle={{
                            width: '70%',
                            height: 50,
                            backgroundColor: '#ffffff',
                            borderColor: '#ffffff',
                            marginVertical: 14,
                            shadowOffset: { width: 0, height: 14 },
                            shadowColor: '#00000055',
                            shadowOpacity: .2,
                            elevation: 2,
                            shadowRadius: 16.00
                        }}
                        textStyle={{ color: '#000000' }}
                    />
                    <CustomButton
                        title={'Continue with Apple'}
                        onPress={() => { }}
                        containerStyle={{
                            width: '70%',
                            height: 50,
                            backgroundColor: '#ffffff',
                            borderColor: '#ffffff',
                            shadowOffset: { width: 0, height: 14 },
                            shadowColor: '#00000055',
                            shadowOpacity: .2,
                            elevation: 2,
                            shadowRadius: 16.00
                        }}
                        textStyle={{ color: '#000000' }}
                    /> */}

                    <CustomButton
                        title={'Log in'}
                        onPress={() => navigation.navigate('LoginScreen')}
                        containerStyle={{
                            width: '70%',
                            height: 50,
                            backgroundColor: '#ffffff',
                            borderColor: '#ffffff',
                            shadowOffset: { width: 0, height: 14 },
                            shadowColor: '#00000055',
                            shadowOpacity: .4,
                            elevation: 2,
                            shadowRadius: 16.00,
                            marginTop: 16
                        }}
                        textStyle={{ color: '#00000085' }}
                    />
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        ...GlobalStyles.FlexContainer,
        backgroundColor: '#ffffff',
    },
    headLine: {
        fontFamily: 'Roboto-Thin',
        fontSize: width / 17,
        color: '#FFF',
        marginTop: 15,
        marginBottom: 40,
        textAlign: 'center',
    },
    signInBtn: {
        width: 238,
        ...Buttons.greenBtn,
    },
    registerBtn: {
        width: 238,
        ...Buttons.defaultBtn,
    },
    loginBtn: {
        width: 238,
        ...Buttons.noBgBtn,
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        alignItems: 'center',
        flexGrow: 1,
        flexShrink: 1,
        height: '100%',
        paddingBottom: 100,
    },
    imgStyle: {
        overflow: 'visible',
    },
});

export default WelcomeScreen;
