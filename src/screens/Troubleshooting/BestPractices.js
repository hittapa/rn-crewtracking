import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    SafeAreaView,
    Text,
} from 'react-native';
import * as GlobalStyles from '../../styles/styles';
import { HeaderLeft } from '../../components/Header/HeaderLeft';
import { HeaderRight } from '../../components/Header/HeaderRight';
import { HeaderTitle } from '../../components/Header/HeaderTitle';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SecurityActions from '../../actions/SecurityActions';
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { width } from '../../components/Carousel/Carousel';


function BestPractices(props) {

    useEffect(() => {
    }, [])

    return (
        <SafeAreaView style={[GlobalStyles.safeView]}>
            <View style={[GlobalStyles.header]}>
                <HeaderLeft onPress={() => props.navigation.goBack()}>
                    <View
                        style={{
                            borderRadius: 50,
                            alignItems: 'center',
                            marginLeft: 20
                        }}
                    >
                        <MaterialIcons
                            name="arrow-back-ios"
                            size={28}
                            color='#007aff'
                        />
                    </View>
                </HeaderLeft>
                <HeaderTitle>
                    <Text style={{
                        color: 'black',
                        fontSize: width / 19,
                        fontFamily: 'Roboto-Regular',
                        lineHeight: 22,
                        letterSpacing: -0.41
                    }}>Trip Detection Best Practices</Text>
                </HeaderTitle>
                <HeaderRight>
                    <View style={{ width: 40 }}></View>
                </HeaderRight>
            </View>
            <ScrollView>
                <View style={{ paddingHorizontal: 17.5, paddingVertical: 28.5 }}>
                    <Text style={{ ...styles.text, paddingTop: 0 }}>To ensure the best possible experience with Crewlog, please read the following guide for detecting trips:</Text>
                    <Text style={{ ...styles.title, paddingTop: 35 }}>Are Location Services turned “On” for Crewlog?</Text>
                    <Text style={{ ...styles.text }}>You can verify your location settings:</Text>
                    <Text style={{ ...styles.text }}><Text style={{color: '#000'}}>On iOS</Text> by going to: Settings {'>'} Privacy {'>'} Location Services (On) {'>'} Crewlog {'>'} <Text style={{fontFamily: 'SourceSansPro-SemiBold'}}>Always</Text></Text>
                    <Text style={{ ...styles.text }}><Text style={{fontFamily: 'SourceSansPro-SemiBold'}}>*Important- iOS 11</Text> and higher, now allow the option to only use location services when an app is in use which will prevent Crewlog from detecting trips consistently. Please ensure your location services for Crewlog are set to <Text style={{fontFamily: 'SourceSansPro-SemiBold'}}>Always</Text> as selecting <Text style={{fontFamily: 'SourceSansPro-SemiBold'}}>While in Use</Text> will prevent automatic trip detection.</Text>
                    <Text style={{ ...styles.text }}><Text style={{fontFamily: 'SourceSansPro-SemiBold'}}>On Android</Text> by going to: Settings {">"} Security &amp; Location {">"} Location {">"} On</Text>
                    <Text style={{ ...styles.text }}><Text style={{fontFamily: 'SourceSansPro-SemiBold'}}>*Important-</Text> “High Accuracy” mode is required on Android. You can check if it’s on by going to Settings {'>'} Security &amp; Location {'>'} Location {'>'} Mode {'>'} High Accuracy</Text>
                    <Text style={{ ...styles.title, paddingTop: 35 }}>Have you force-quit Crewlog?</Text>
                    <Text style={{ ...styles.text }}>Force-Quitting is done by double-clicking the center iPhone button (iphone 8 or earlier), swiping up from the bottom edge of the screen (iPhone X), or square Android butotn and swiping the Crewlog app/icon off the screen. On many versions of iOS and Android, all trip detection will stop if you do so. Please keep Crewlog running in the background of your device so that it can capture and record your trips.</Text>

                    <Text style={{ ...styles.title, paddingTop: 35 }}>Was Crewlog paused?</Text>
                    <Text style={{ ...styles.text }}>If you pause the app periodically, please wait a bit before taking a trip after unpausing. Depending on our location when you un-pause, it can take between 5-15mins for Crewlog to get accurate location information. If we don’t get accurate location information before the trip starts, unfortunately the trip may not be detected in full or may be disregarded.</Text>

                    <Text style={{ ...styles.title, paddingTop: 35 }}>To ensure that Crewlog is not suspended from running in the background, please regularly open the app.</Text>
                    <Text style={{ ...styles.text }}><Text style={{fontFamily: 'SourceSansPro-SemiBold'}}>Important-</Text> On iOS, your phone will occasionaly ask “Crewlog Has Been Using Your Location in the Background. Do you want to Continue Allowing this?” In order for Crewlog to detect trips, you must choose “Continue” to this prompt. Selecting “Dont Allow” will disable location services and Crewlog will not detect drives.</Text>
                    <Text style={{ ...styles.text }}><Text style={{fontFamily: 'SourceSansPro-SemiBold'}}>On iOS</Text> 11 and higher, if you cannot locate the Crewlog app on your phone any longer, check your setting for “Offload Unused Apps” under Settings {">"} General {">"} iPhone Storage. If enabled and Crewlog has not launched or detected any movement over a period of time, depending on your phone storage situation, Crewlog may have been deleted by iOs. You will need to reinstall Crewlog from the App Store.</Text>

                    <Text style={{ ...styles.title, paddingTop: 35 }}>Are you running the latest version of your device’s OS?</Text>
                    <Text style={{ ...styles.text }}>Having the most up-to-date operating system on your phone will provide the latest features to support and protect background apps like Crewlog.</Text>
                    <Text style={{ ...styles.text }}>You can update your device’s OS:</Text>
                    <Text style={{ ...styles.text }}><Text style={{fontFamily: 'SourceSansPro-SemiBold'}}>On iOS</Text> by going to Settings {">"} General {">"} Software Update {">"} Download and Install</Text>
                    <Text style={{ ...styles.text }}><Text style={{fontFamily: 'SourceSansPro-SemiBold'}}>On Android</Text> by going to Settings {">"} System {">"} About phone {">"} System updates</Text>

                    <Text style={{ ...styles.title, paddingTop: 35 }}>Are you running the latest version of Crewlog?</Text>
                    <Text style={{ ...styles.text }}>We are constantly improving Crewlog and having the latest version will ensure optimal performance.</Text>
                    <Text style={{ ...styles.text }}>You can update your version of Crewlog, if needed-</Text>
                    <Text style={{ ...styles.text }}><Text style={{fontFamily: 'SourceSansPro-SemiBold'}}>On iOS</Text> by going to App Store {">"} Updates {">"} Crewlog {">"} Update</Text>
                    <Text style={{ ...styles.text }}><Text style={{fontFamily: 'SourceSansPro-SemiBold'}}>On Android</Text> by going to Play Store {">"} Settings (at the top left) {">"} My apps {">"} Crewlog Update</Text>

                    <Text style={{ ...styles.title, paddingTop: 35 }}>Are you currently logged into your account (and is it the correct account)?</Text>
                    <Text style={{ ...styles.text }}>Make sure you’re signed in to the Crewlog app and using the correct email address.</Text>
                    <Text style={{ ...styles.text }}>You can verify by navigating to Account Settings in the main menu of the app. Double check email for any misspellings as a second account may have accidentally been created.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: width / 18,
        color: '#000',
        lineHeight: 25.5,
        fontFamily: 'Roboto-Regular',
        letterSpacing: -0.3,
        fontWeight: '400',
    },
    subTitle: {
        fontSize: width/27,
        fontFamily: 'Roboto-Light',
        color: '#ababab',
        lineHeight: 22,
        letterSpacing: -0.41,
        fontWeight: '400'
    },
    label: {
        fontSize: width / 32,
        color: '#3c3c43',
        textTransform: 'uppercase',
        lineHeight: 18,
        paddingTop: 34,
        paddingLeft: 12,
        fontFamily: 'Roboto-Light',
        fontWeight: '400',
        letterSpacing: -0.08
    },
    text: {
        fontSize: width / 23,
        color: '#3c3c43',
        lineHeight: 25.5,
        fontFamily: 'Roboto-Light',
        fontWeight: '400',
        letterSpacing: -0.3,
        paddingTop: 16
    }
});

const mapStateToProps = state => {
    return {
        user: state.APP.USER,
        vessels: state.APP.VESSELS
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(SecurityActions(), dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BestPractices);
