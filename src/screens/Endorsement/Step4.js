import { FontAwesome, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, KeyboardAvoidingView, ScrollView, StyleSheet, Text, Image, TouchableOpacity, FlatList, TextInput, Platform } from 'react-native';
import { CheckBox } from 'react-native-elements/dist/checkbox/CheckBox';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SecurityActions from '../../actions/SecurityActions';
import { width } from '../../components/Carousel/Carousel';
import CustomButton from '../../components/CustomButton';
import { HeaderLeft } from '../../components/Header/HeaderLeft';
import { HeaderRight } from '../../components/Header/HeaderRight';
import { HeaderTitle } from '../../components/Header/HeaderTitle';
import { Colors } from '../../styles';
import * as GlobalStyles from '../../styles/styles';
import { emailValidation } from '../../utils/validate';

const capacityList = [
    'Captain/Master', 'Owner', 'Responsible person'
];

function EndorseStep4(props) {

    const [vessel, setVessel] = useState(null);
    const [period, setPeriod] = useState(null);
    const [departments, setDepartments] = useState(null);
    const [forms, setForms] = useState(null);
    const [roles, setRoles] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [capacity, setCapacity] = useState('');
    const [agree1, setAgree1] = useState(false);
    const [agree2, setAgree2] = useState(false);
    const [openCapacity, setOpenCapacity] = useState(false);
    const [openKeyboard, setOpenKeyboard] = useState(false);
    const [startLoc, setStartLoc] = useState('');
    const [endLoc, setEndLoc] = useState('');

    useEffect(() => {
        if (props.route.params.vessel) setVessel(props.route.params.vessel);
        if (props.route.params.period) setPeriod(props.route.params.period);
        if (props.route.params.departments) setDepartments(props.route.params.departments);
        if (props.route.params.forms) setForms(props.route.params.forms);
        if (props.route.params.roles) setRoles(props.route.params.roles);
        if (props.route.params.startLoc) setStartLoc(props.route.params.startLoc);
        if (props.route.params.endLoc) setEndLoc(props.route.params.endLoc);
    }, [props]);

    const enableNext = () => {
        if (firstName == '' || lastName == '' || email == '' || phoneNumber == '' || capacity == '' || !agree1 || !agree2) return false;
        if (!emailValidation(email)) return false;
        return true;
    }

    const ListItem = (item) => {
        return (
            <TouchableOpacity onPress={() => setCapacity(item)} style={{ ...GlobalStyles.inputForm, paddingLeft: 24, borderBottomWidth: .5, borderBottomColor: '#ffffff', backgroundColor: '#f0f0f0' }}>
                <Text style={[GlobalStyles.labelText, item == capacity && { color: Colors.colorGrey3 }]} numberOfLines={1}>{item}</Text>
            </TouchableOpacity>
        )
    }

    const handleEndorse = () => {
        const data = {
            ...props.route.params,
            recipientInfo: {
                firstName, lastName, email, phoneNumber, capacity
            }
        };
        // props.navigation.navigate('Dashboard');
        props.actions.submitEndorsementData(data).then(res => {
            let en = res?.endorsements || null;
            en && props.navigation.navigate('Dashboard', {serviceIndex: props.route.params.serviceIndex});
        }).catch(err => {
            console.log(err);
            alert('Something went wrong!');
        })
    }

    return (
        <View style={GlobalStyles.FlexContainer}>
            <SafeAreaView style={[GlobalStyles.safeView]}>
                <View style={[GlobalStyles.header]}>
                    <HeaderLeft onPress={() => props.navigation.goBack()}>
                        <Text style={{
                            color: '#ababab',
                            marginLeft: 20,
                            fontSize: width / 23,
                            lineHeight: 21.09,
                            letterSpacing: -0.3,
                            fontWeight: '400',
                            width: 55,
                        }} numberOfLines={1}>{"Back"}</Text>
                    </HeaderLeft>
                    <HeaderTitle>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={{
                                ...GlobalStyles.headerTitle
                            }}>Endorse sea service</Text>
                            <Text style={{
                                color: '#888',
                                fontSize: width / 28,
                                lineHeight: 18,
                                textTransform: 'uppercase'
                            }}>{`Step 4 of 4`}</Text>
                        </View>
                    </HeaderTitle>
                    <HeaderRight>
                        <View style={{ width: 55, marginRight: 20 }}></View>
                    </HeaderRight>
                </View>
                <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'height' : 'height'}>
                    <ScrollView style={[{ backgroundColor: '#f9f9f9', marginBottom: openKeyboard? 100 : 120 }]} nestedScrollEnabled bounces={false}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', paddingHorizontal: 16, backgroundColor: '#ffffff' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', maxWidth: '50%' }}>
                                <Text style={{ fontSize: width/24.5, lineHeight: 20, letterSpacing: -0.3 }}>Place of joining</Text>
                                <Text style={{ fontSize: width/21, lineHeight: 22, letterSpacing: -0.408, color: '#6aabff', textTransform: 'uppercase', paddingTop: 7 }}>{period && moment(period.start).utc().format('DD MMM YYYY')}</Text>
                                <Text style={{ ...GlobalStyles.labelText, color: Colors.colorGrey4 }}>{startLoc}</Text>
                            </View>
                            <Image source={require('../../../assets/large_arrow.png')} style={{ height: 157, width: 28, resizeMode: 'contain' }} />
                            <View style={{ justifyContent: 'center', alignItems: 'center', maxWidth: '50%' }}>
                                <Text style={{ fontSize: width/24.5, lineHeight: 20, letterSpacing: -0.3 }}>Place of discharge</Text>
                                <Text style={{ fontSize: width/21, lineHeight: 22, letterSpacing: -0.408, color: '#6aabff', textTransform: 'uppercase', paddingTop: 7 }}>{period && moment(period.end).utc().format('DD MMM YYYY')}</Text>
                                <Text style={{ ...GlobalStyles.labelText, color: Colors.colorGrey4 }}>{endLoc}</Text>
                            </View>
                        </View>

                        <View style={{ width: '100%' }}>
                            <Text style={{
                                ...styles.label
                            }}>Recipient info</Text>
                        </View>
                        <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                            <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: .5, borderBottomColor: '#c6c6c8' }}>
                                <Text style={{ ...GlobalStyles.labelText }} numberOfLines={1}>{'First Name'}</Text>
                                <TextInput
                                    placeholder='Enter first name'
                                    value={firstName}
                                    style={GlobalStyles.inputBox}
                                    onChangeText={async (value) => {
                                        setFirstName(value)
                                    }}
                                    onFocus={() => setOpenKeyboard(true)}
                                    onBlur={() => setOpenKeyboard(false)}
                                />
                            </View>
                        </View>
                        <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                            <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: .5, borderBottomColor: '#c6c6c8' }}>
                                <Text style={{ ...GlobalStyles.labelText }} numberOfLines={1}>{'Last name'}</Text>
                                <TextInput
                                    placeholder='Enter last name'
                                    value={lastName}
                                    style={GlobalStyles.inputBox}
                                    onChangeText={async (value) => {
                                        setLastName(value)
                                    }}
                                    onFocus={() => setOpenKeyboard(true)}
                                    onBlur={() => setOpenKeyboard(false)}
                                />
                            </View>
                        </View>
                        <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                            <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: .5, borderBottomColor: '#c6c6c8' }}>
                                <Text style={{ ...GlobalStyles.labelText }} numberOfLines={1}>{'Email'}</Text>
                                <TextInput
                                    placeholder='Enter email'
                                    value={email}
                                    style={GlobalStyles.inputBox}
                                    onChangeText={async (value) => {
                                        setEmail(value)
                                    }}
                                    keyboardType={'email-address'}
                                    onFocus={() => setOpenKeyboard(true)}
                                    onBlur={() => setOpenKeyboard(false)}
                                />
                            </View>
                        </View>
                        <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                            <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: .5, borderBottomColor: '#c6c6c8' }}>
                                <Text style={{ ...GlobalStyles.labelText }} numberOfLines={1}>{'Phone number'}</Text>
                                <TextInput
                                    placeholder='Enter phone no.'
                                    value={phoneNumber}
                                    style={GlobalStyles.inputBox}
                                    onChangeText={async (value) => {
                                        setPhoneNumber(value)
                                    }}
                                    keyboardType={'phone-pad'}
                                    onFocus={() => setOpenKeyboard(true)}
                                    onBlur={() => setOpenKeyboard(false)}
                                />
                            </View>
                        </View>
                        <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                            <TouchableOpacity onPress={() => setOpenCapacity(!openCapacity)} style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: 0, borderBottomColor: '#c6c6c8' }}>
                                <Text style={{ ...GlobalStyles.labelText }} numberOfLines={1}>{'Capacity'}</Text>
                                {
                                    capacity == '' ?
                                        <SimpleLineIcons name={openCapacity ? 'arrow-up' : 'arrow-down'} size={14} color={Colors.colorGrey3} />
                                        :
                                        <Text style={{ ...GlobalStyles.labelText }} numberOfLines={1}>{capacity}</Text>
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 0 }}>
                            {
                                openCapacity && (
                                    <View style={{ width: '100%', paddingLeft: 0 }}>
                                        <FlatList
                                            data={capacityList}
                                            renderItem={({ item }) => ListItem(item)}
                                            keyExtractor={(item) => item}
                                            bounces={false}
                                        />
                                    </View>
                                )
                            }
                        </View>
                        <TouchableOpacity onPress={() => setAgree1(!agree1)} style={{ width: '100%', padding: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons name={agree1 ? 'check-circle-outline' : 'checkbox-blank-circle-outline'} size={24} color={!agree1 ? Colors.colorGrey2 : Colors.colorGreen} style={{ marginRight: 10 }} />
                            <Text style={styles.text}>
                                I understand that once submitted for endorsement this log entry can NOT be changed or resubmitted unless the endorsement is denied by the recipient
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setAgree2(!agree2)} style={{ width: '100%', padding: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons name={agree2 ? 'check-circle-outline' : 'checkbox-blank-circle-outline'} size={24} color={!agree2 ? Colors.colorGrey2 : Colors.colorGreen} style={{ marginRight: 10 }} />
                            <Text style={styles.text}>
                                I understand that knowingly submitting false information could lead to the withdrawal of my logbook, applicable fines and/or imprisonment and the revocation of the signing officers CoC.
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
                <View style={{ position: 'absolute', backgroundColor: '#ffffff', bottom: 0, width: '100%', height: 100, padding: 20, flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <CustomButton
                        title={'Email Endorsement Request'}
                        containerStyle={{ backgroundColor: '#ffffff', height: 50, width: '80%', borderColor: enableNext() ? '#7FC542' : Colors.colorGrey5 }}
                        textStyle={{ color: enableNext() ? '#7FC542ee' : Colors.colorGrey5 }}
                        onPress={() => enableNext() && handleEndorse()}
                    />
                </View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
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
    tagItem: {
        height: 32,
        // width: 150,
        borderRadius: 7,
        paddingHorizontal: 8,
        paddingVertical: 6,
        backgroundColor: '#636363',
        borderWidth: .5,
        borderColor: "rgba(0,0,0,0.04)",
        alignItems: 'center',
        flexDirection: 'row',
        margin: 3,
        justifyContent: 'space-between'
    },
    review: {
        fontFamily: 'Roboto-Regular',
        fontSize: width / 23,
        lineHeight: 22,
        letterSpacing: -0.408,
    },
    text: {
        fontFamily: 'Roboto-Regular',
        fontSize: width / 26,
        lineHeight: 19,
        letterSpacing: -0.3,
        color: '#767676',
        width: '87%'
    }
});

const mapStateToProps = state => {

}

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(SecurityActions(), dispatch)
    }
}

export default connect(null, mapDispatchToProps)(EndorseStep4);