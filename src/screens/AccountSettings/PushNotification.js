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
import { TextInput } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SecurityActions from '../../actions/SecurityActions';
import { FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { MailIcon } from '../../components/Icons/MailIcon';
import { NotificationIcon } from '../../components/Icons/NotificationIcon';
import { HeartIcon } from '../../components/Icons/HeartIcon';
import { LockIcon } from '../../components/Icons/LockIcon';
import { UnitIcon } from '../../components/Icons/UnitIcon';
import { CustomSwitch } from '../../components/CustomSwitch';
import { CheckIcon } from '../../components/Icons/CheckIcon';
import { width } from '../../components/Carousel/Carousel';

function PushNotification(props) {
    const [user, setUser] = useState(null);
    const [pro, setPro] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [vesselName, setVesselName] = useState('');
    const [vesselLength, setVesselLength] = useState(null);
    const [startTripAlert, setStartTripAlert] = useState(false);
    const [endTripAlert, setEndTripAlert] = useState(false);

    useEffect(() => {
        if (!mounted) {
            console.log(props.user)
            setUser(props.user);
            if (props.user.start_trip_alert === null || props.user.start_trip_alert == undefined) {
                setStartTripAlert(false);
            } else {
                setStartTripAlert(props.user.start_trip_alert);
            }
            if (props.user.end_trip_alert === null || props.user.end_trip_alert == undefined) {
                setEndTripAlert(false);
            } else {
                setEndTripAlert(props.user.end_trip_alert);
            }
            if (props.user.plan.includes('pro')) setPro(true);
            setMounted(true);
        }
    }, [props, mounted])

    return (
        <View style={GlobalStyles.FlexContainer}>
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
                                color='#18f'
                            />
                        </View>
                    </HeaderLeft>
                    <HeaderTitle>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={{
                                ...GlobalStyles.headerTitle
                            }}>Push Notifications</Text>
                        </View>
                    </HeaderTitle>
                    <HeaderRight onPress={() => { }}>
                        <View style={{ width: 40 }}></View>
                    </HeaderRight>
                </View>
                <ScrollView style={[{ backgroundColor: '#f9f9f9' }]}>
                    <View style={{ width: '100%' }}>
                        <Text style={{
                            ...styles.label
                        }}>Trip Alerts</Text>
                    </View>
                    <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                        <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, height: 50 }}>
                            <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                <Text style={{ ...GlobalStyles.labelText, paddingVertical: 0 }}>New trip alert</Text>
                                <Text style={{ ...GlobalStyles.labelText, fontSize: width / 30, paddingVertical: 0, fontFamily: 'Roboto-Thin' }}>(Location settings must be set to 'Always')</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CustomSwitch value={startTripAlert} toggleSwitch={async () => {
                                    setStartTripAlert(!startTripAlert)
                                    const data = {
                                        id: user.id,
                                        start_trip_alert: !startTripAlert,
                                    };
                                    await props.actions.updateUser(data).then(res => setUser(res));
                                }} />
                            </View>
                        </View>
                        <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ ...GlobalStyles.labelText, }}>Trip end alert</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CustomSwitch value={endTripAlert} toggleSwitch={async () => {
                                    setEndTripAlert(!endTripAlert)
                                    const data = {
                                        id: user.id,
                                        end_trip_alert: !endTripAlert,
                                    };
                                    await props.actions.updateUser(data).then(res => setUser(res));
                                }} />
                            </View>
                        </View>
                    </View>

                    <View style={GlobalStyles.spaceH}></View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...GlobalStyles.FlexContainer,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        justifyContent: "flex-start",
        borderRadius: 16,
        backgroundColor: '#3e3e3e'
    },
    modal0: {
        width: 250,
        height: 550,
    },
    centeredView: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center'
    },
    listItemText: {
        textAlign: 'center',
        fontSize: width / 26,
        color: '#09e',
    },
    listItem: {
        width: 250,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        borderTopColor: '#909090',
        borderTopWidth: .5
    },
    modalHeader: {
        paddingVertical: 15,
        alignItems: 'center'
    },
    modalBody: {
        height: 150,
        width: 250,
        alignItems: 'center',
    },
    modalFooter: {
        height: 50,
        width: 250,
        bottom: 0,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: .5,
        borderTopColor: '#8e8e8e'
    },
    modalHeaderText: {
        fontSize: width / 26,
        color: '#f3f3f3',
        fontWeight: '700'
    },
    footerActionText: {
        color: '#09e',
        fontSize: width / 26,
        fontWeight: 'bold'
    },
    modalBodyText: {
        fontSize: width / 28,
        color: '#fefefe',
        textAlign: 'center',
    },
    sectionTitle: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center'
    },
    infoMark: {
        width: 16,
        height: 16,
        backgroundColor: '#3a0',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    label: {
        paddingLeft: 12,
        paddingTop: 34,
        paddingBottom: 8,
        textAlign: 'left',
        color: '#8e8e93',
        textTransform: 'uppercase',
        fontFamily: 'Roboto-Regular',
        fontWeight: '400',
        fontSize: width / 32,
        letterSpacing: -0.08
    }
});

const mapStateToProps = state => {
    return { user: state.APP.USER };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(SecurityActions(), dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PushNotification);
