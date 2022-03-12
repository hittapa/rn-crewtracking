import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    SafeAreaView,
    Text,
    TouchableOpacity,
    Alert,
    Linking,
    Platform,
} from 'react-native';
import * as GlobalStyles from '../../styles/styles';
import { HeaderLeft } from '../../components/Header/HeaderLeft';
import { HeaderRight } from '../../components/Header/HeaderRight';
import { HeaderTitle } from '../../components/Header/HeaderTitle';
import { TextInput } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SecurityActions from '../../actions/SecurityActions';
import { FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { MailIcon } from '../../components/Icons/MailIcon';
import { NotificationIcon } from '../../components/Icons/NotificationIcon';
import { HeartIcon } from '../../components/Icons/HeartIcon';
import { LockIcon } from '../../components/Icons/LockIcon';
import { UnitIcon } from '../../components/Icons/UnitIcon';
import { CustomSwitch } from '../../components/CustomSwitch';
import Modal from 'react-native-modalbox';
import AccountIcon2 from '../../components/Icons/AccountIcon2';
import EditIcon from '../../components/Icons/EditIcon';
import { width } from '../../components/Carousel/Carousel';

function AccountSettingsScreen(props) {
    const [user, setUser] = useState(null);
    const [pro, setPro] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [rateAlert, setRateAlert] = useState(false);
    const [vesselName, setVesselName] = useState('');
    const [vesselLength, setVesselLength] = useState(null);
    const [tripRemain, setTripRemain] = useState(0);

    useEffect(() => {
        if (props.user) {
            setUser(props.user);
            setPro(props.user.plan.includes('pro'));
        }
        if (!mounted) {
            setMounted(true);
        }
        if (props.vessels) {
            var vessels = props.vessels;
            let amount = 0;
            for (let i = 0; i < vessels.length; i++) {
                const vessel = vessels[i];
                if (vessel.onboardServices && vessel.onboardServices.length > 0) {
                    for (let i = 0; i < vessel.onboardServices.length; i++) {
                        const item = vessel.onboardServices[i];
                        if (item.type == 'trip' && item.trip != null) {
                            amount += 1;
                        }
                    }
                }
            }
            setTripRemain(Math.max(0, 5 - amount));
        }
    }, [props, mounted])

    const showRateAlert = () => {
        Alert.alert(
            'Ready to rate Crewlog?',
            'Clicking \"Rate the app\" will take you to the App store. Thanks for supporting Crewlog!',
            [
                {
                    text: "Not now",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Rate the app", onPress: () => onRateCrewlog() }
            ]
        )
    }

    const onRateCrewlog = () => {
        if (Platform.OS == 'ios') {
            // Linking.openURL('https://apps.apple.com/us/app/liquid-hospitality-card/id1481014888?app=itunes&ign-mpt=uo%3D4')  /// iOS app link
        } else {
            // Linking.openURL('https://play.google.com/us/app/liquid-hospitality-card/id1481014888?app=itunes&ign-mpt=uo%3D4')  /// Android app link
        }
    }

    const onSwitchPlan = () => {
        const from = pro ? "Pro" : "Basic";
        const to = pro ? "Basic" : "Pro";
        Alert.alert(
            'Are you sure?',
            `You are about to switch your account from ${from} to ${to}`,
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel"),
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => handleSwitchPlan(),
                    style: 'default'
                }
            ]
        )
    }

    const handleSwitchPlan = () => {
        const data = {
            id: user?.id,
            plan: pro ? "basic" : "pro"
        }
        props.actions.updateUser(data).then(res => {
            if (res) {
                
            }
        });
    }

    return (
        <View style={GlobalStyles.FlexContainer}>
            <SafeAreaView style={[GlobalStyles.safeView]}>
                <View style={[GlobalStyles.header]}>
                    <HeaderLeft onPress={() => props.navigation.openDrawer()}>
                        <View
                            style={{
                                borderRadius: 50,
                                alignItems: 'center',
                            }}
                        >
                            <FontAwesome5
                                name="bars"
                                style={{ marginLeft: 20 }}
                                size={28}
                                color={'#000'}
                            />
                        </View>
                    </HeaderLeft>
                    <HeaderTitle>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={{
                                ...GlobalStyles.headerTitle
                            }}>Account Settings</Text>
                        </View>
                    </HeaderTitle>
                    <HeaderRight onPress={() => { }}>
                        <View style={{ width: 40 }}></View>
                    </HeaderRight>
                </View>
                <ScrollView style={[{ backgroundColor: '#f9f9f9' }]}>
                    <View style={{ width: '100%', backgroundColor: '#fff' }}>
                        <View style={[GlobalStyles.inputForm, { borderBottomWidth: 0 }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ ...GlobalStyles.labelText, marginLeft: -4, color: '#8e8e93', textTransform: 'uppercase', fontSize: width / 32 }}>Signed in</Text>
                            </View>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => props.navigation.navigate('SignedIn')}>
                                <Text style={{ ...GlobalStyles.labelText, fontSize: width / 26, lineHeight: 22, color: '#ababab' }}>{user?.username}</Text>
                                <MaterialCommunityIcons
                                    name="chevron-right"
                                    style={{ marginRight: -8 }}
                                    size={28}
                                    color={'#ababab'}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        (
                            <>
                                <View style={{ flexDirection: 'column', justifyContent: 'center', backgroundColor: '#f9f9f9', alignItems: 'center', paddingVertical: 30 }} >
                                    <View style={{ backgroundColor: '#fff', width: 80, height: 80, borderRadius: 80, alignItems: 'center', justifyContent: 'center' }}>
                                        {/* <AccountIcon2 /> */}
                                        <MaterialCommunityIcons
                                            name="account-circle-outline"
                                            size={40}
                                            color={'#878787'}
                                        />
                                    </View>
                                    <View style={{ paddingHorizontal: 50, paddingTop: 20 }}>
                                        <Text style={{ textAlign: 'center', fontSize: width / 23, lineHeight: 25.5, color: '#646464', fontWeight: '300', fontFamily: 'Roboto-Light', letterSpacing: -0.3 }}>
                                            The signed in email address is the one we use for communication and subscription
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ width: '100%', backgroundColor: '#fff', flexDirection: 'row' }}>
                                    <Text style={{
                                        ...styles.label
                                    }}>Account details</Text>
                                    <TouchableOpacity style={{ ...styles.label }} onPress={() => props.navigation.navigate('UpdateAccount')}>
                                        <EditIcon width={17} height={17} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: '100%', backgroundColor: '#fff' }}>
                                    <View style={[GlobalStyles.inputForm, { borderBottomWidth: 0.5, marginLeft: 16, paddingLeft: 0 }]}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ ...GlobalStyles.labelText }}>First Name</Text>
                                        </View>
                                        <Text style={{ ...GlobalStyles.labelText, fontSize: width / 26, lineHeight: 22, color: '#ababab' }}>{user?.firstName}</Text>
                                    </View>
                                </View>
                                <View style={{ width: '100%', backgroundColor: '#fff' }}>
                                    <View style={[GlobalStyles.inputForm, { borderBottomWidth: 0.5, marginLeft: 16, paddingLeft: 0 }]}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ ...GlobalStyles.labelText }}>Last Name</Text>
                                        </View>
                                        <Text style={{ ...GlobalStyles.labelText, fontSize: width / 26, lineHeight: 22, color: '#ababab' }}>{user?.lastName}</Text>
                                    </View>
                                </View>
                                <View style={{ width: '100%', backgroundColor: '#fff' }}>
                                    <View style={[GlobalStyles.inputForm, { borderBottomWidth: 0.5, marginLeft: 16, paddingLeft: 0 }]}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ ...GlobalStyles.labelText }}>Birthday</Text>
                                        </View>
                                        <Text style={{ ...GlobalStyles.labelText, fontSize: width / 26, lineHeight: 22, color: '#ababab' }}>{user?.birthDate ? user.birthDate : ''}</Text>
                                    </View>
                                </View>
                                <View style={{ width: '100%', backgroundColor: '#fff' }}>
                                    <View style={[GlobalStyles.inputForm, { borderBottomWidth: 0.5, paddingLeft: 16 }]}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ ...GlobalStyles.labelText }}>Nationality</Text>
                                        </View>
                                        <Text style={{ ...GlobalStyles.labelText, fontSize: width / 26, lineHeight: 22, color: '#ababab' }}>{user?.nationality ? user.nationality : ''}</Text>
                                    </View>
                                </View>
                            </>
                        )
                    }
                    <View style={{ width: '100%', backgroundColor: '#fff' }}>
                        <Text style={{
                            ...styles.label
                        }}>Subscription</Text>
                    </View>
                    <View style={{ width: '100%', backgroundColor: '#fff' }}>
                        <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, marginLeft: 16, borderBottomColor: '#c6c6c8', borderBottomWidth: .5 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ ...GlobalStyles.labelText, }}>{pro ? 'Crewlog PRO' : 'Crewlog BASIC'}</Text>
                            </View>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => onSwitchPlan()}>
                                <Text style={{ ...GlobalStyles.labelText, fontSize: width / 26, lineHeight: 22, color: '#ababab' }}>{pro ? 'Switch to BASIC' : 'Switch to PRO'}</Text>
                            </TouchableOpacity>
                        </View>
                        {
                            pro && user?.transactionId == null && (
                                <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, marginLeft: 16, borderBottomColor: '#c6c6c8', borderBottomWidth: .5 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ ...GlobalStyles.labelText, }}>Free</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ ...GlobalStyles.labelText, fontSize: width / 26, lineHeight: 22, color: '#ababab' }}>{tripRemain} trips remaining</Text>
                                    </View>
                                </View>
                            )
                        }
                        {
                            user?.transactionId == null && (
                                <TouchableOpacity onPress={() => props.navigation.navigate('Subscription')} style={{ ...GlobalStyles.inputForm, paddingLeft: 16, borderBottomColor: '#c6c6c8', borderBottomWidth: .5 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <LockIcon />
                                        <Text style={{ ...GlobalStyles.labelText, paddingLeft: 10, color: '#7fc542e3' }}>Get unlimited trips with PRO</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <MaterialCommunityIcons
                                            name="chevron-right"
                                            style={{ marginRight: -8 }}
                                            size={28}
                                            color={'#b0b0b799'}
                                        />
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                    <View style={{ width: '100%', backgroundColor: '#fff' }}>
                        <Text style={{
                            ...styles.label
                        }}>Personalization</Text>
                    </View>
                    <View style={{ width: '100%', backgroundColor: '#fff' }}>
                        <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, marginLeft: 16, borderBottomColor: '#c6c6c8', borderBottomWidth: .5 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ ...GlobalStyles.labelText }}>Email Communications</Text>
                            </View>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => props.navigation.navigate('Email Communications')}>
                                <Text style={{ ...GlobalStyles.labelText, fontSize: width / 26, lineHeight: 22, color: '#ababab' }}>Monthly</Text>
                                <MaterialCommunityIcons
                                    name="chevron-right"
                                    style={{ marginRight: -8 }}
                                    size={28}
                                    color={'#b0b0b799'}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, marginLeft: 16, borderBottomColor: '#c6c6c8', borderBottomWidth: .5 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ ...GlobalStyles.labelText }}>Push Notifications</Text>
                            </View>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => props.navigation.navigate('Push Notifications')}>
                                <Text style={{ ...GlobalStyles.labelText, fontSize: width / 26, lineHeight: 22, color: '#ababab' }}>All</Text>
                                <MaterialCommunityIcons
                                    name="chevron-right"
                                    style={{ marginRight: -8 }}
                                    size={28}
                                    color={'#b0b0b799'}
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ ...GlobalStyles.inputForm, paddingLeft: 0, marginLeft: 16, borderBottomColor: '#c6c6c8', borderBottomWidth: .5 }} onPress={() => setRateAlert(true)}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ ...GlobalStyles.labelText }}>Rate Crewlog</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons
                                    name="chevron-right"
                                    style={{ marginRight: -8 }}
                                    size={28}
                                    color={'#b0b0b799'}
                                />
                            </View>
                        </TouchableOpacity>
                        <View style={{ ...GlobalStyles.inputForm, paddingLeft: 16, borderBottomColor: '#c6c6c8', borderBottomWidth: .5 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ ...GlobalStyles.labelText }}>Version</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ ...GlobalStyles.labelText, fontSize: width / 26, lineHeight: 22, color: '#ababab' }}>4.4.1</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ width: '100%', backgroundColor: '#fff' }}>
                        <Text style={{
                            ...styles.label
                        }}>Legal</Text>
                    </View>
                    <View style={{ width: '100%', backgroundColor: '#fff' }}>
                        <TouchableOpacity onPress={() => props.navigation.navigate('Privacy')} style={{ ...GlobalStyles.inputForm, paddingLeft: 0, marginLeft: 16, borderBottomColor: '#c6c6c8', borderBottomWidth: .5 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ ...GlobalStyles.labelText, }}>Privacy Policy</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons
                                    name="chevron-right"
                                    style={{ marginRight: -8 }}
                                    size={28}
                                    color={'#b0b0b799'}
                                />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => props.navigation.navigate('Terms')} style={{ ...GlobalStyles.inputForm, paddingLeft: 16, marginLeft: 0, borderBottomColor: '#c6c6c8', borderBottomWidth: .5 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ ...GlobalStyles.labelText, }}>Terms of Service</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons
                                    name="chevron-right"
                                    style={{ marginRight: -8 }}
                                    size={28}
                                    color={'#b0b0b799'}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={GlobalStyles.spaceH}></View>
                </ScrollView>
            </SafeAreaView>
            <Modal
                isOpen={rateAlert}
                onClosed={() => setRateAlert(false)}
                style={{ ...styles.modal, width: 300, height: 200 }}
                position={'center'}
            >
                <View style={{ ...styles.centeredView }}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalHeaderText}>Ready to rate Crewlog?</Text>
                    </View>
                    <View style={{ ...styles.modalBody, }}>
                        <Text style={{ ...styles.modalBodyText }}>Clicking "Rate the app" will take you to the App store. Thanks for supporting Crewlog!</Text>
                    </View>
                    <View style={{ ...styles.modalFooter, flexDirection: 'row' }}>
                        <TouchableOpacity style={{ width: '50%', height: '100%', borderRightColor: '#8e8e8e', borderRightWidth: .5, justifyContent: 'center', alignItems: 'center' }} onPress={() => setRateAlert(false)}>
                            <Text style={{ ...styles.footerActionText }}>Not now</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ width: '50%', height: '100%', justifyContent: 'center', alignItems: 'center' }} onPress={() => onRateCrewlog()}>
                            <Text style={{ ...styles.footerActionText }}>Rate the app</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        lineHeight: 24,
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
        width: 280,
        alignItems: 'center',
    },
    modalFooter: {
        height: 50,
        width: 300,
        bottom: 0,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: .5,
        borderTopColor: '#8e8e8e'
    },
    modalHeaderText: {
        fontSize: width/21,
        lineHeight: 24,
        color: '#f3f3f3',
        fontWeight: '700'
    },
    footerActionText: {
        color: '#09e',
        fontSize: width / 26,
        lineHeight: 24,
        fontWeight: 'bold'
    },
    modalBodyText: {
        fontSize: width / 23,
        lineHeight: 26,
        color: '#fefefe',
        textAlign: 'center',
        fontWeight: '300'
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
        lineHeight: 18,
        letterSpacing: -0.08
    }
});

const mapStateToProps = state => {
    return {
        user: state.APP.USER,
        vessels: state.APP.VESSELS,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(SecurityActions(), dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettingsScreen);
