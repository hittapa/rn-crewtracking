import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as GlobalStyles from '../styles/styles';
import React from 'react';
import SecurityActions from '../actions/SecurityActions';
import appConstants from '../constants/app';
import { Colors } from '../styles/index';
import { get } from 'lodash';
import { VesselIcon } from './Icons/VesselIcon';
import { LogbookIcon } from './Icons/LogbookIcon';
import { TrackingIcon } from './Icons/TrackingIcon';
import { AccountIcon } from './Icons/AccountIcon';
import { ServiceSummaryIcon } from './Icons/ServiceSummaryIcon';
import { EndorsementIcon } from './Icons/EndorsementIcon';
import { Dimensions } from 'react-native';
import { width } from './Carousel/Carousel';

const DrawerContent = props => {

    return (
        <DrawerContentScrollView {...props} bounces={false}>
            <View
                style={{
                    height: 189,
                    flex: 1,
                    flexDirection: 'column',
                    // backgroundColor: 'rgb(24, 116, 163)',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    left: 0,
                    paddingVertical: 40,
                    paddingTop: 100,
                    borderBottomColor: Colors.colorGrey5,
                    borderBottomWidth: 1
                }}
            >
                <Image
                    source={require('../assets/images/crewlog-logo.png')}
                    resizeMode="contain"
                    style={{...styles.drawerLogo, tintColor: 'rgb(24, 116, 163)'}}
                />                
            </View>
            <ScrollView
                style={{
                    marginTop: 189,
                    // paddingLeft: 23,
                    height: Dimensions.get('screen').height - 330
                }}
            >
                <DrawerItem
                    label="Logbook"
                    onPress={() => props.navigation.navigate('Dashboard')}
                    icon={() => (
                        <View
                            style={{
                                width: 30,
                            }}
                        >
                            <LogbookIcon />
                        </View>
                    )}
                    labelStyle={[styles.drawerLabel, { marginLeft: -25 }]}
                    activeBackgroundColor='#90e'
                    pressColor='#D3D3D3'
                />
                <DrawerItem
                    label="Vessels"
                    onPress={() => props.navigation.navigate('Vessels')}
                    icon={() => (
                        <View
                            style={{
                                width: 30,
                                justifyContent: 'center'
                            }}
                        >
                            <VesselIcon />
                        </View>
                    )}
                    labelStyle={[styles.drawerLabel, { marginLeft: -25 }]}
                    pressColor='#D3D3D3'
                />
                {/* <DrawerItem
                    label="Tracking"
                    onPress={() => props.navigation.navigate('Tracking')}
                    icon={() => (
                        <View
                            style={{
                                width: 30,
                                justifyContent: 'center'
                            }}
                        >
                            <TrackingIcon />
                        </View>
                    )}
                    labelStyle={[styles.drawerLabel, { marginLeft: -25 }]}
                    pressColor='#D3D3D3'
                /> */}
                <DrawerItem
                    label="Account settings"
                    onPress={() => props.navigation.navigate('Settings')}
                    icon={() => (
                        <View
                            style={{
                                width: 30,
                                justifyContent: 'center'
                            }}
                        >
                            <AccountIcon />
                        </View>
                    )}
                    labelStyle={[styles.drawerLabel, { marginLeft: -25 }]}
                    pressColor='#D3D3D3'
                />
                {/* <DrawerItem
                    label="Service summary"
                    onPress={() => props.navigation.navigate('ServiceSummary')}
                    icon={() => (
                        <View
                            style={{
                                width: 30,
                                justifyContent: 'center'
                            }}
                        >
                            <ServiceSummaryIcon />
                        </View>
                    )}
                    labelStyle={[styles.drawerLabel, { marginLeft: -25 }]}
                    pressColor='#D3D3D3'
                /> */}
                <DrawerItem
                    label="Endorsements"
                    onPress={() => props.navigation.navigate('Endorsement')}
                    icon={() => (
                        <View
                            style={{
                                width: 30,
                                justifyContent: 'center'
                            }}
                        >
                            <EndorsementIcon />
                        </View>
                    )}
                    labelStyle={{ ...styles.drawerLabel, marginLeft: -25 }}
                    pressColor='#D3D3D3'
                />
            </ScrollView>
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    drawerLabel: {
        fontFamily: 'Roboto-Regular',
        fontSize: width / 23,
        color: Colors.colorGrey2,
    },
    drawerLogo: {
        width: 173,
        height: 64,
        alignSelf: 'center',
    },
});

const mapStateToProps = state => {
    const user = get(
        state,
        `${appConstants.STATE_KEY}.${appConstants.REDUCER_USER_KEY}`
    );
    return { user };
};

const mapDispatchToProps = dispatch => {
    return {
        securityActions: bindActionCreators(SecurityActions(), dispatch),
    };
};

const DrawerContentContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(props => <DrawerContent {...props} />);

export default DrawerContentContainer;
