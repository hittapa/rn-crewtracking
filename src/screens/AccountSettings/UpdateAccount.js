import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Modal from 'react-native-modalbox';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SecurityActions from '../../actions/SecurityActions';
import { HeaderLeft } from '../../components/Header/HeaderLeft';
import { HeaderRight } from '../../components/Header/HeaderRight';
import { HeaderTitle } from '../../components/Header/HeaderTitle';
import * as GlobalStyles from '../../styles/styles';
import countries from '../../assets/jsons/countries.json';
import { Colors } from '../../styles';
import DropDownPicker from 'react-native-dropdown-picker';
import { width } from '../../components/Carousel/Carousel';

function UpdateAccount(props) {
    const [user, setUser] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setUser(props.user)
    }, [props])

    const onBack = () => {
        props.navigation.goBack()
    }

    if (!user) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} color={'#c5c5c7'} />
            </View>
        )
    }

    const updateUser = (value, key) => {
        let _u = { ...user };
        _u[key] = value;
        setUser(_u);
    }

    const onSave = async () => {
        console.log(user)
        const data = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            birthDate: user.birthDate,
            nationality: user.nationality
        }
        await props.actions.updateUser(data);
        onBack()
    }

    const getUTCDate = () => {
        let arr = user?.birthDate.split('/');
        return new Date(Date.UTC(arr[2], parseInt(arr[0]) - 1, arr[1]));
    }

    return (
        <View style={{ ...GlobalStyles.safeView }}>
            <View style={[GlobalStyles.header]}>
                <HeaderLeft onPress={() => onBack()}>
                    <Text style={{
                        color: '#ababab',
                        marginLeft: 20,
                        fontSize: width / 23,
                        lineHeight: 21.09,
                        letterSpacing: -0.3,
                        fontWeight: '400',
                        width: 55
                    }}>{"Cancel"}</Text>
                </HeaderLeft>
                <HeaderTitle>
                    <Text style={{
                        ...GlobalStyles.headerTitle
                    }}>Edit account details</Text>
                </HeaderTitle>
                <HeaderRight onPress={() => onSave()}>
                    <Text style={{
                        color: '#007aff',
                        fontFamily: 'Roboto-Regular',
                        fontSize: width/24.5,
                        lineHeight: 19.92,
                        letterSpacing: -0.3,
                        fontWeight: '400',
                        marginRight: 20,
                        width: 55,
                        textAlign: 'right'
                    }}>Save</Text>
                </HeaderRight>
            </View>
            <ScrollView style={[{ backgroundColor: '#f9f9f9' }]} bounces={false}>
                <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                    <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: .5, borderBottomColor: '#c6c6c8' }}>
                        <Text style={GlobalStyles.labelText}>First name</Text>
                        <TextInput
                            placeholder='Enter first name'
                            value={user.firstName}
                            style={GlobalStyles.inputBox}
                            onChangeText={async (value) => {
                                await updateUser(value, 'firstName');
                            }}
                        />
                    </View>
                </View>
                <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                    <View style={{ ...GlobalStyles.inputForm, paddingVertical: 4, paddingLeft: 0, borderBottomWidth: .5, borderBottomColor: '#c6c6c8' }}>
                        <Text style={GlobalStyles.labelText}>Last name</Text>
                        <TextInput
                            placeholder='Enter last name'
                            value={user.lastName}
                            style={GlobalStyles.inputBox}
                            onChangeText={async (value) => {
                                await updateUser(value, 'lastName');
                            }}
                        />
                    </View>
                </View>
                <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                    <View style={{ ...GlobalStyles.inputForm, paddingVertical: 4, paddingLeft: 0, paddingRight: 10, borderBottomWidth: .5, borderBottomColor: '#c6c6c8' }}>
                        <Text style={GlobalStyles.labelText}>Birthday</Text>
                        {
                            Platform.OS == 'ios' ?
                                <RNDateTimePicker
                                    mode={'date'}
                                    value={user.birthDate ? new Date(user.birthDate) : new Date()}
                                    // display={'inline'}
                                    onChange={(event, date) => {
                                        if (date) {
                                            let _bt = moment(date).utc().format('MM/DD/YYYY');
                                            updateUser(_bt, 'birthDate')
                                        }
                                    }}
                                    style={{
                                        width: 130
                                    }}
                                />
                                :
                                <Text onPress={() => setShowDatePicker(true)} style={[GlobalStyles.inputBox, { paddingRight: 10, justifyContent: 'center', height: 30, color: '#000000cc' }]}>{user?.birthDate ? user.birthDate : moment(new Date()).format('MM/DD/YYYY')}</Text>
                        }
                    </View>
                </View>
                <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16, height: 300 }}>
                    <View style={{ ...GlobalStyles.inputForm, paddingVertical: 4, paddingLeft: 0, paddingRight: 5, borderBottomWidth: 0, alignItems: 'flex-start' }}>
                        <Text style={GlobalStyles.labelText}>Nationality</Text>
                        <View style={{ width: '50%' }}>
                            <DropDownPicker
                                open={open}
                                value={user.nationality}
                                items={countries.records}
                                setOpen={setOpen}
                                multiple={false}
                                placeholder={'Nationality'}
                                style={{ borderColor: 'transparent', height: 30 }}
                                textStyle={{ color: Colors.colorGrey2, fontSize: width / 28, textAlign: 'right' }}
                                searchable={true}
                                searchContainerStyle={{ borderColor: 'transparent', borderBottomColor: '#d7d7d7' }}
                                searchTextInputStyle={{ borderColor: '#d7d7d7' }}
                                searchPlaceholder={'Other'}
                                dropDownContainerStyle={{ borderColor: '#d7d7d7' }}
                                setValue={(callback) => updateUser(callback(user.nationality), 'nationality')}
                                name="nationality"
                            />
                        </View>
                    </View>
                </View>
                {
                    showDatePicker && (
                        <RNDateTimePicker
                            mode={'date'}
                            value={user.birthDate ? getUTCDate() : new Date()}
                            // display={'inline'}
                            onChange={(event, date) => {
                                setShowDatePicker(false);
                                if (date) {
                                    let _bt = moment(date).utc().format('MM/DD/YYYY');
                                    updateUser(_bt, 'birthDate');
                                }
                            }}
                            style={{
                                width: 130
                            }}
                        />
                    )
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: "flex-start",
        backgroundColor: '#f6f6f9'
    },
    header: {
        paddingHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20,
        width: '100%',
    },
    map: {
        width: '100%',
        height: Dimensions.get('window').height - 50,
        marginTop: 10
    },
    text1: {
        fontFamily: 'Roboto-Regular',
        fontSize: width/24.5,
        lineHeight: 19.92,
        letterSpacing: -0.3,
        color: '#767676'
    },
    text2: {
        fontFamily: 'SourceSansPro-Bold',
        fontWeight: '600',
        fontSize: width/24.5,
        lineHeight: 22,
        letterSpacing: -0.41,
        color: '#000'
    },
    text3: {
        fontFamily: 'Roboto-Regular',
        fontWeight: '600',
        fontSize: width / 19,
        lineHeight: 22,
        letterSpacing: -0.41,
        color: '#f3f3f3'
    },
    modal: {
        justifyContent: "flex-start",
        borderRadius: 11,
        backgroundColor: '#000000cc'
    },
    modal0: {
        width: 352,
        height: 305,
    },
    centeredView: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center'
    },
    modalHeader: {
        paddingTop: 30,
        paddingBottom: 10,
        alignItems: 'center'
    },
    modalBody: {
        // height: '85%',
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 16
    },
    modalFooter: {
        width: '100%',
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20
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
    },
    listItem: {
        width: 270,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        borderTopColor: '#909090',
        borderTopWidth: .5,
        height: 44
    },
    listItemText: {
        textAlign: 'center',
        fontSize: width/24.5,
        lineHeight: 19.92,
        color: '#0a84ff',
        fontFamily: 'Roboto-Regular',
        letterSpacing: -0.3,
    },
})

const mapStateToProps = state => {
    return { user: state.APP.USER };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(SecurityActions(), dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateAccount);