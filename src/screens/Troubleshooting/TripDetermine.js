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

function TripDetermine(props) {

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
                    }}>What Determines a Trip</Text>
                </HeaderTitle>
                <HeaderRight>
                    <View style={{ width: 40 }}></View>
                </HeaderRight>
            </View>
            <ScrollView>
                <View style={{ paddingHorizontal: 17.5, paddingVertical: 28.5 }}>
                    <Text style={{ ...styles.title }}>How does Crewlog determine a trip?</Text>
                    <Text style={{ ...styles.text }}>
                        Crewlog uses the last known end point for one trip as the starting point for the next trip.
                </Text>
                    <Text style={{ ...styles.text }}>
                        Crewlog needs at least 1000(m) difference in reported location to recognize a trip. Depending on where the last known location data came from (Cell tower, Wifi, GPS, etc) and where the next data point comes from, there can be up to a mile variance for Crewlog to know that a trip has started.
                </Text>
                    <Text style={{ ...styles.text }}>
                        Crewlog uses complex formulas for measuring miles traveled, hours underway and distances offshore.
                </Text>
                    <Text style={{ ...styles.text }}>
                        Once a trip has been detected, Crewlog takes approximately 15 minutes after the trip to decide if that is the end point. Once it is decided, Crewlog records the trip and creates a Trip Card on the app. Brief stops may automatically be joined together due to this processing time.
                </Text>
                    <Text style={{ ...styles.text }}>
                        If Crewlog ends a trip before it is actually over, you can select “join trips” as long as the end point of one trip is within 24hrs of the starting point of the following trip.
                </Text>
                    <Text style={{ ...styles.text }}>
                        Please know that we are constantly adjusting our formulas to get better at detecting trips and plotting them as accurately as possible. Thank you for your patience as we continue to develop this new and emerging technology!
                </Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(TripDetermine);
