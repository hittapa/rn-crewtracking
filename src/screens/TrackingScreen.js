import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    KeyboardAvoidingView,
    ScrollView,
    SafeAreaView,
    Dimensions,
    Text,
    Platform,
} from 'react-native';
import * as GlobalStyles from '../styles/styles';
import { HeaderLeft } from '../components/Header/HeaderLeft';
import { HeaderRight } from '../components/Header/HeaderRight';
import { HeaderTitle } from '../components/Header/HeaderTitle';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { CustomSwitch } from '../components/CustomSwitch';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SecurityActions from '../actions/SecurityActions';
import Modal from "react-native-modalbox";
import moment from 'moment';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RadixIcon } from '../components/Icons/RadixIcon';
import { LengthUnit } from '../components/LengthUnit';
import { DetectionIcon } from '../components/Icons/DetectionIcon';
import DateTimePicker from '../components/DateTimePicker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { TrackingIcon } from '../components/Icons/TrackingIcon';
import { width } from '../components/Carousel/Carousel';

const vTypes = [
    "Cargo",
    "Dive Vessel",
    "Dredger",
    "Fishing",
    "Military Ops",
    "Medical Trans",
    "Passenger",
    "Pleasure Craft",
    "Port Tender",
    "Sailing Vessel",
    "Search and Rescue",
    "Special Craft",
    "Tanker",
    "Tug",
]

function TrackingScreen(props) {
    const [user, setUser] = useState(null);
    const [pro, setPro] = useState(null);
    const [mounted, setMounted] = useState(false);

    const [detection, setDetection] = useState(true);
    const [signedOn, setSignedOn] = useState(null);
    const [defaultVessel, setDefaultVessel] = useState(null);
    const [autoResume, setAutoResume] = useState(true);
    const [resumeDate, setResumeDate] = useState(new Date());
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);

    useEffect(() => {
        if (!mounted) {
            console.log(props.user);
            setUser(props.user);
            setDetection(props.user?.trip_detection);
            setAutoResume(props.user?.auto_resume);
            if (props.user.resume_date) setResumeDate(props.user.resume_date);
            if (props.user.plan.includes('pro')) setPro(true);
            let vessels = props.vessels;
            vessels?.map((item) => {
                if (item.isDefault && !defaultVessel) {
                    setDefaultVessel(item);
                }
                if (item.is_signedon && !signedOn) {
                    setSignedOn(item);
                }
            })
            // props.actions.getVesselType()
            //     .then(result => {
            //         console.log(result)
            //         setTypes(result)
            //     })
            //     .catch(err => {
            //         console.log(err)
            //     })
            setMounted(true);
        }
    }, [props, mounted])

    const onBack = () => {
        props.navigation.goBack()
    }

    const updateSetting = (_det, _aut, _res=null) => {
        const data = {
            trip_detection: _det,
            auto_resume: _aut,
            resume_date: _res
        }
        props.actions.updateUser({ id: user.id, ...data })
    }

    return (
        <View style={GlobalStyles.FlexContainer}>
            <KeyboardAvoidingView
                behavior={'padding'}
                style={{ width: '100%', height: '100%' }}
            >
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
                            <Text style={{
                                ...GlobalStyles.headerTitle
                            }}>Tracking</Text>
                        </HeaderTitle>
                        <HeaderRight >
                            <View style={{ width: 50 }}></View>
                        </HeaderRight>
                    </View>
                    <ScrollView style={[{ backgroundColor: '#ffffff' }]}>
                        <View style={{ width: '100%', flexDirection: 'row', height: 45, justifyContent: 'space-between', paddingRight: 12, backgroundColor: '#ffffff' }}>
                            <Text style={{
                                ...styles.label,
                                paddingTop: 14
                            }}>{pro ? signedOn ? 'Current vessel' : 'No current vessel' : signedOn ? 'Default vessel' : 'No default vessel'}</Text>
                            {
                                signedOn && (
                                    <TouchableOpacity onPress={() => {
                                        props.navigation.navigate('Dashboard', { vessel: signedOn })
                                    }}>
                                        <Text style={{
                                            alignItems: 'center',
                                            color: '#007aff',
                                            fontSize: width/21,
                                            lineHeight: 22,
                                            letterSpacing: -0.41,
                                            fontFamily: 'Roboto-Regular',
                                            paddingTop: 14
                                        }}>{signedOn.name}</Text>
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                        <View style={{ flexDirection: 'column', justifyContent: 'center', backgroundColor: '#f9f9f9', alignItems: 'center', paddingVertical: 30, }} >
                            <View style={{ backgroundColor: '#fff', width: 70, height: 70, borderRadius: 70, alignItems: 'center', justifyContent: 'center' }}>
                                <FontAwesome5
                                    name="satellite-dish"
                                    size={25}
                                    color={'#878787'}
                                />
                            </View>
                            <View style={{ paddingHorizontal: 50, paddingTop: 20 }}>
                                <Text style={{ textAlign: 'center', fontSize: width / 23, lineHeight: 25.5, color: '#646464', fontWeight: '300', fontFamily: 'Roboto-Light', letterSpacing: -0.3 }}>
                                    {
                                        pro ? "Trip detection will remain ON while signed onto a vessel. It will automatically turn off when.. \n1. You sign off\n2. During a leave of absence or yard period\n3. You set a time to resume"
                                            :
                                            "You can pause trip detection if you aren't travelling for a bit, but don't forget to turn it on before getting back on the water so you don't miss any trips"
                                    }
                                </Text>
                            </View>
                        </View>
                        {/* <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                            {
                                pro ?
                                    signedOn ?
                                        <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: 0 }}>
                                            <Text style={GlobalStyles.labelText}>{signedOn.name}</Text>
                                            <Text style={{
                                                alignItems: 'center',
                                                color: '#b0b0b799',
                                                textTransform: 'uppercase',
                                                fontSize: width/27,
                                                lineHeight: 22,
                                                letterSpacing: -0.41,
                                                fontFamily: 'Roboto-Regular'
                                            }}>Signed On</Text>
                                        </View>
                                        :
                                        <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: 0 }}>
                                            <Text style={{
                                                alignItems: 'center',
                                                color: '#b0b0b799',
                                                textTransform: 'uppercase',
                                                fontSize: width/27,
                                                lineHeight: 22,
                                                letterSpacing: -0.41,
                                                fontFamily: 'Roboto-Regular',
                                                textAlign: 'center',
                                                width: '100%'
                                            }}>No Current vessel</Text>
                                        </View>
                                    :
                                    defaultVessel ?
                                        <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: 0 }}>
                                            <Text style={GlobalStyles.labelText}>{defaultVessel.name}</Text>
                                            <Text style={{
                                                alignItems: 'center',
                                                color: '#b0b0b799',
                                                textTransform: 'uppercase',
                                                fontSize: width/27,
                                                lineHeight: 22,
                                                letterSpacing: -0.41,
                                                fontFamily: 'Roboto-Regular'
                                            }}>Signed On</Text>
                                        </View>
                                        :
                                        <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: 0 }}>
                                            <Text style={{
                                                alignItems: 'center',
                                                color: '#b0b0b799',
                                                textTransform: 'uppercase',
                                                fontSize: width/27,
                                                lineHeight: 22,
                                                letterSpacing: -0.41,
                                                fontFamily: 'Roboto-Regular',
                                                textAlign: 'center',
                                                width: '100%'
                                            }}>No default vessel selected</Text>
                                        </View>
                            }
                        </View> */}
                        <View style={{ width: '100%' }}>
                            <Text style={{
                                ...styles.label
                            }}>Settings</Text>
                        </View>
                        <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                            <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: .5, borderBottomColor: '#c6c6c8' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {/* <DetectionIcon size={12} /> */}
                                    <Text style={GlobalStyles.labelText}>Trip detection</Text>
                                </View>
                                <CustomSwitch value={detection} toggleSwitch={() => {
                                    if (pro) {
                                        if (signedOn) {
                                            setDetection(!detection);
                                            updateSetting(!detection, autoResume, resumeDate);
                                        } else {
                                            !detection && alert('You are signed off all vessels. You must first sign on to a vessel in order to resume trip detection');
                                            setDetection(!detection);
                                        }
                                    }
                                    else {
                                        if (defaultVessel) {
                                            setDetection(!detection);
                                            updateSetting(!detection, autoResume, resumeDate);
                                        } else {
                                            detection && alert('No default vessel selected. Add or select an existing vessel as your default vessel in order to resume trip detection.');
                                            setDetection(!detection);
                                        }
                                    }
                                }} />
                            </View>
                        </View>
                        {
                            detection && (
                                <View style={{ width: '100%' }}>
                                    <Text style={{
                                        ...styles.label1
                                    }}>Uses smartphone GPS to map routes during transit. May increase battery usage.</Text>
                                </View>
                            )
                        }
                        {
                            pro ?
                                signedOn && !detection && (
                                    <>
                                        <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                                            <View style={[{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: .5, borderBottomColor: '#c6c6c8' }]}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={GlobalStyles.labelText}>Automatically Resume</Text>
                                                </View>
                                                <CustomSwitch value={autoResume} toggleSwitch={() => {
                                                    setAutoResume(!autoResume);
                                                    updateSetting(detection, !autoResume, resumeDate);
                                                }} />
                                            </View>
                                        </View>
                                        {
                                            autoResume && (
                                                <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                                                    <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: .5, borderBottomColor: '#c6c6c8' }}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Text style={GlobalStyles.labelText}>Resume</Text>
                                                        </View>
                                                        <Text
                                                            style={{
                                                                alignItems: 'center',
                                                                color: '#b0b0b799',
                                                                fontSize: width/27,
                                                                lineHeight: 22,
                                                                letterSpacing: -0.41,
                                                                fontFamily: 'Roboto-Regular'
                                                            }}
                                                            onPress={() => setShowDateTimePicker(true)}
                                                        >{moment(resumeDate).utc().format('MMMM Do YYYY, h:mm A')}</Text>
                                                    </View>
                                                </View>
                                            )
                                        }
                                    </>
                                ) :
                                defaultVessel && !detection && (
                                    <>
                                        <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16, marginTop: 34 }}>
                                            <View style={[{ ...GlobalStyles.inputForm, paddingLeft: 0 }]}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={GlobalStyles.labelText}>Automatically Resume</Text>
                                                </View>
                                                <CustomSwitch value={autoResume} toggleSwitch={() => {
                                                    setAutoResume(!autoResume);
                                                    updateSetting(detection, !autoResume, resumeDate);
                                                }} />
                                            </View>
                                        </View>
                                        {
                                            autoResume && (
                                                <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                                                    <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, }}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Text style={GlobalStyles.labelText}>Resume</Text>
                                                        </View>
                                                        <Text
                                                            style={{
                                                                alignItems: 'center',
                                                                color: '#b0b0b799',
                                                                fontSize: width/27,
                                                                lineHeight: 22,
                                                                letterSpacing: -0.41,
                                                                fontFamily: 'Roboto-Regular'
                                                            }}
                                                            onPress={() => setShowDateTimePicker(true)}
                                                        >{moment(resumeDate).utc().format('MMMM Do YYYY, h:mm A')}</Text>
                                                    </View>
                                                </View>
                                            )
                                        }
                                    </>
                                )
                        }
                        <View style={{ width: '100%' }}>
                            <Text style={{
                                ...styles.label
                            }}>Troubleshooting</Text>
                        </View>
                        <View style={{ flexDirection: 'column', backgroundColor: '#fff' }}>
                            <TouchableOpacity onPress={() => props.navigation.navigate('BestPractices')} style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 16, alignItems: 'center', paddingVertical: 11, borderBottomWidth: .5, borderBottomColor: '#c6c6c8' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Text style={[{ ...styles.title }]}>Travel detection best practices</Text>
                                </View>
                                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingRight: 16 }}>
                                    <MaterialCommunityIcons
                                        name={'chevron-right'}
                                        size={24}
                                        color={'#ababab'}
                                        style={{ marginRight: -6 }}
                                    />
                                </TouchableOpacity>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => props.navigation.navigate('TripDetermine')} style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 16, alignItems: 'center', paddingVertical: 11, borderBottomWidth: .5, borderBottomColor: '#c6c6c8' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Text style={[{ ...styles.title }]}>What determines a trip ?</Text>
                                </View>
                                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingRight: 16 }}>
                                    <MaterialCommunityIcons
                                        name={'chevron-right'}
                                        size={24}
                                        color={'#ababab'}
                                        style={{ marginRight: -6 }}
                                    />
                                </TouchableOpacity>
                            </TouchableOpacity>
                            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 16, alignItems: 'center', paddingVertical: 11 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Text style={[{ ...styles.title }]}>Do I need to have Bluetooth / Wifi on ?</Text>
                                </View>
                                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingRight: 16 }}>
                                    <MaterialCommunityIcons
                                        name={'chevron-right'}
                                        size={24}
                                        color={'#ababab'}
                                        style={{ marginRight: -6 }}
                                    />
                                </TouchableOpacity>
                            </View> */}
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
            {
                showDateTimePicker && (
                    Platform.OS == 'ios' ?
                        <DateTimePicker
                            onClose={() => setShowDateTimePicker(false)}
                            setResumeDate={(date) => {
                                setResumeDate(date);
                                updateSetting(detection, autoResume, date);
                            }}
                            value={resumeDate}
                        />
                        :
                        <RNDateTimePicker
                            mode={'datetime'}
                            value={new Date()}
                            display={'inline'}
                            textColor={'white'}
                            is24Hour={true}
                        />
                )
            }
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
        height: '85%',
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 16
    },
    modalFooter: {
        height: 50,
        width: '100%',
        bottom: 0,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: .5,
        borderTopColor: '#8e8e8e'
    },
    modalHeaderText: {
        fontSize: width / 19,
        lineHeight: 22,
        color: '#fff',
        fontWeight: '500',
        fontFamily: 'Roboto-Regular',
        letterSpacing: -0.41
    },
    footerActionText: {
        color: '#09e',
        fontSize: width / 26,
        lineHeight: 24,
        fontWeight: 'bold'
    },
    modalBodyText: {
        fontSize: width / 23,
        lineHeight: 25.5,
        color: '#fff',
        textAlign: 'center',
        letterSpacing: -0.3,
        fontWeight: '300',
        fontFamily: 'Roboto-Light',
        paddingVertical: 10
    },
    sectionTitle: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 31,
        paddingBottom: 8
    },
    infoMark: {
        width: 16,
        height: 16,
        backgroundColor: '#3a0',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginLeft: 10,
        marginTop: -8
    },
    label1: {
        paddingLeft: 12,
        paddingTop: 8,
        textAlign: 'left',
        color: '#8e8e93',
        fontFamily: 'Roboto-Regular',
        fontWeight: '400',
        fontSize: width / 32,
        lineHeight: 18,
        letterSpacing: -0.08
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
    },
    vesselDetailIcon: {
        width: 46,
        height: 46,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: .5,
        shadowRadius: 5,
        elevation: 20
    },
    navigationText: {
        fontFamily: 'Roboto-Regular',
        fontSize: width/24.5,
        lineHeight: 19.92,
        letterSpacing: -0.3,
        fontWeight: '400',
        marginRight: 20,
        width: 55,
        textAlign: 'right'
    },
    title: {
        fontSize: width/21,
        color: '#000',
        lineHeight: 22,
        fontFamily: 'Roboto-Regular',
        letterSpacing: -0.41,
        fontWeight: '400',
    },
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

export default connect(mapStateToProps, mapDispatchToProps)(TrackingScreen);
