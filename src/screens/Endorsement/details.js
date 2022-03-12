import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    SafeAreaView,
    Text,
    TouchableOpacity,
    Image,
    Linking,
    Alert,
} from 'react-native';
import * as GlobalStyles from '../../styles/styles';
import { HeaderLeft } from '../../components/Header/HeaderLeft';
import { HeaderRight } from '../../components/Header/HeaderRight';
import { HeaderTitle } from '../../components/Header/HeaderTitle';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SecurityActions from '../../actions/SecurityActions';
import { FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import appConstants from '../../constants/app';
import { height, width } from '../../components/Carousel/Carousel';
import CustomButton from '../../components/CustomButton';

function EndorsementDetails(props) {
    const [user, setUser] = useState(null);
    const [pro, setPro] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [endorsement, setEndorsement] = useState(null);
    const [vessel, setVessel] = useState(null);
    const [period, setPeriod] = useState(null);
    const [stamp, setStamp] = useState(null);
    const [forms, setForms] = useState(null);

    useEffect(() => {
        if (props.user) {
            setUser(props.user);
            setPro(props.user.plan.includes('pro'));
        }
        if (!mounted) {
            setMounted(true);
        }
        if (props.route.params?.endorsement) {
            let _endo = props.route.params.endorsement;
            setEndorsement(_endo);
            setVessel(JSON.parse(_endo.vessel));
            setPeriod(JSON.parse(_endo.period));
            setForms(JSON.parse(_endo.forms));
            let testimonial = _endo?.testimonial ? (_endo?.testimonial) : null;
            let certificate = _endo?.certificate ? (_endo?.certificate) : null;
            let uscg = _endo?.uscg ? (_endo?.uscg) : null;
            let image = testimonial?.stamp ? appConstants.MAINURL + testimonial.stamp : certificate?.stamp ? appConstants.MAINURL + certificate.stamp : null;
            setStamp(image);
        }
    }, [props, mounted]);

    const viewForms = (item) => {
        const data = {
            ...endorsement, forms, vessel, period, readOnly: true
        };
        if (item == 'Sea time testimonial') {
            props.navigation.navigate('SeaTimeTestimonial', data)
        }
        if (item == 'Certificate of discharge') {
            props.navigation.navigate('DischargeCertificate', data)
        }
        if (item == 'USCG Small vessel form') {
            props.navigation.navigate('SmallVesselFormUSCG', data)
        }
    }

    const onCancelRequest = () => {
        Alert.alert(
            'Are you sure?',
            "You are about to delete endorsement request.\n",
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => { }
                },
                {
                    text: 'Delete',
                    style: 'default',
                    onPress: () => handleDelete()
                }
            ]
        )
    }

    const handleDelete = () => {
        const data = {
            user: user?.id,
            endorsement: endorsement?.id
        };
        props.actions.deleteEndorsement(data).then(res => {
            if(res.message == 'success') {
                props.navigation.navigate('Dashboard');
            }
        });
    }
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
                                ...GlobalStyles.headerTitle, textAlign: 'center'
                            }}>Sea Time Endorsements Details</Text>
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
                                <Text
                                    style={{ color: '#007aff', fontSize: width / 21, lineHeight: 22, letterSpacing: -0.41, fontWeight: '400', fontFamily: 'Roboto-Regular' }}
                                    onPress={() => props.navigation.navigate('Dashboard', { vessel: vessel })}
                                >{vessel?.name}</Text>
                            </View>
                            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => props.navigation.navigate('SignedIn')}>
                                <Text style={{ ...GlobalStyles.labelText, fontSize: width / 26, lineHeight: 22, color: '#ababab', textAlign: 'right' }}>{endorsement?.entryNumber}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'column', justifyContent: 'center', backgroundColor: '#f9f9f9', alignItems: 'center', paddingVertical: 30 }} >
                            <View style={{ backgroundColor: '#fff', width: 80, height: 80, borderRadius: 80, alignItems: 'center', justifyContent: 'center' }}>
                                {
                                    !endorsement?.approved && !endorsement?.denied && (
                                        <MaterialCommunityIcons
                                            name="clock-time-five-outline"
                                            size={45}
                                            color={'#e7a600'}
                                        />
                                    )
                                }
                                {
                                    endorsement?.denied && (
                                        <MaterialIcons
                                            name="do-not-disturb"
                                            size={45}
                                            color={'#c21717'}
                                        />
                                    )
                                }
                                {
                                    endorsement?.approved && stamp && (
                                        <Image source={require('../../assets/images/crewlog_stamp.png')} style={{ width: 50, height: 50 }} />
                                    )
                                }
                            </View>
                            <View style={{ paddingHorizontal: 50, paddingTop: 20, alignItems: 'center' }}>
                                <Text style={[{ textAlign: 'center', fontSize: width / 23, lineHeight: 25.5, fontWeight: '300', fontFamily: 'Roboto-Light', letterSpacing: -0.3, textTransform: 'uppercase' }, endorsement?.approved ? { color: '#3a0' } : endorsement?.denied ? { color: '#c21717' } : { color: '#e7a600' }]}>
                                    {
                                        endorsement?.approved ? "Endorsement Approved" : endorsement?.denied ? "Endorsement Declined"
                                            : "Endorsement Pending"
                                    }
                                </Text>
                                <Text style={{ fontSize: width / 28, lineHeight: 15, color: '#ababab', marginTop: 6 }}>{period ? (moment(period.start).utc().format('DD MMM YYYY') + " to " + moment(period.end).utc().format('DD MMM YYYY')) : ""}</Text>
                            </View>
                        </View>
                        <View style={{ width: '100%', backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{
                                ...styles.label
                            }}>Forms Submitted</Text>
                            {
                                endorsement?.approved && endorsement?.printform && (
                                    <CustomButton
                                        title={
                                            <Ionicons
                                                name="print-outline"
                                                style={{ marginRight: -2 }}
                                                size={24}
                                                color={'#fff'}
                                            />
                                        }
                                        onPress={() => endorsement?.printform && Linking.openURL((appConstants.MAINURL + endorsement.printform).trim())}
                                        containerStyle={{ width: 40, height: 40, marginRight: 16, borderWidth: 0 }}
                                        textStyle={{}}
                                    />
                                )
                            }
                        </View>
                        <View style={{ width: '100%', backgroundColor: '#fff' }}>
                            {
                                forms && forms.map((item, key) => {
                                    if (item == 'Discharge certificate') item = 'Certificate of discharge';
                                    if (item == 'Small vessel sea service form USCG') item = 'USCG Small vessel form';
                                    return (
                                        <View key={item} style={{ ...GlobalStyles.inputForm, paddingLeft: 0, marginLeft: 16, borderBottomColor: '#c6c6c8', borderBottomWidth: .5 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ ...GlobalStyles.labelText }}>{item}</Text>
                                            </View>
                                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => viewForms(item)}>
                                                <MaterialCommunityIcons
                                                    name="chevron-right"
                                                    style={{ marginRight: -8 }}
                                                    size={28}
                                                    color={'#b0b0b799'}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })
                            }
                        </View>
                        <View style={{ width: '100%', backgroundColor: '#fff' }}>
                            <Text style={{
                                ...styles.label
                            }}>Endorsement details</Text>
                        </View>
                        <View style={{ width: '100%', backgroundColor: '#fff' }}>
                            {
                                endorsement?.denied && (
                                    <View>
                                        <View style={{ ...GlobalStyles.inputForm, marginLeft: 16, paddingLeft: 0, borderBottomColor: '#c6c6c8', borderBottomWidth: 0 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{ ...GlobalStyles.labelText }}>Reason declined</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <MaterialIcons
                                                    name="error"
                                                    style={{ marginRight: -8 }}
                                                    size={28}
                                                    color={'#c23717'}
                                                />
                                            </View>
                                        </View>
                                        <View style={{ ...GlobalStyles.inputForm, marginLeft: 16, paddingLeft: 0, borderBottomColor: '#c6c6c8', borderBottomWidth: 0, height: 'auto' }}>
                                            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', backgroundColor: '#c2171715', borderRadius: 16, padding: 8 }}>
                                                <Text style={{ textAlign: 'left', fontSize: width / 23, lineHeight: 25.5, color: '#c21717', fontWeight: '300', fontFamily: 'Roboto-Light', letterSpacing: -0.3, width: '100%', flexWrap: 'wrap' }} >{endorsement?.denial_reason}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                            }
                            <View style={{ ...GlobalStyles.inputForm, marginLeft: 16, paddingLeft: 0, borderBottomColor: '#c6c6c8', borderBottomWidth: .5 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ ...GlobalStyles.labelText }}>Date submitted</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ ...GlobalStyles.labelText, fontSize: width / 26, lineHeight: 22, color: '#ababab' }}>{moment(endorsement?.created_at).utc().format('DD-MMM YYYY')}</Text>
                                </View>
                            </View>
                            <View style={{ ...GlobalStyles.inputForm, marginLeft: 16, paddingLeft: 0, borderBottomColor: '#c6c6c8', borderBottomWidth: .5 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ ...GlobalStyles.labelText }}>Email</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ ...GlobalStyles.labelText, fontSize: width / 26, lineHeight: 22, color: '#ababab' }}>{endorsement?.email}</Text>
                                </View>
                            </View>
                            <View style={{ ...GlobalStyles.inputForm, marginLeft: 16, paddingLeft: 0, borderBottomColor: '#c6c6c8', borderBottomWidth: .5 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ ...GlobalStyles.labelText }}>First name</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ ...GlobalStyles.labelText, fontSize: width / 26, lineHeight: 22, color: '#ababab' }}>{endorsement?.firstName}</Text>
                                </View>
                            </View>
                            <View style={{ ...GlobalStyles.inputForm, marginLeft: 16, paddingLeft: 0, borderBottomColor: '#c6c6c8', borderBottomWidth: .5 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ ...GlobalStyles.labelText }}>Last name</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ ...GlobalStyles.labelText, fontSize: width / 26, lineHeight: 22, color: '#ababab' }}>{endorsement?.lastName}</Text>
                                </View>
                            </View>
                            <View style={{ ...GlobalStyles.inputForm, marginLeft: 16, paddingLeft: 0, borderBottomColor: '#c6c6c8', borderBottomWidth: .5 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ ...GlobalStyles.labelText }}>Capacity</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ ...GlobalStyles.labelText, fontSize: width / 26, lineHeight: 22, color: '#ababab' }}>{endorsement?.capacity}</Text>
                                </View>
                            </View>
                            {
                                (endorsement?.approved || endorsement?.denied) && (
                                    <View style={{ ...GlobalStyles.inputForm, marginLeft: 16, paddingLeft: 0, borderBottomColor: '#c6c6c8', borderBottomWidth: .5 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ ...GlobalStyles.labelText }}>Date endorsed</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ ...GlobalStyles.labelText, fontSize: width / 26, lineHeight: 22, color: '#ababab' }}>{moment(endorsement?.updated_at).utc().format('DD-MMM YYYY')}</Text>
                                        </View>
                                    </View>
                                )
                            }
                            {
                                !endorsement?.approved && !endorsement?.denied && (
                                    <View style={{ flex: 1, alignItems: 'center', padding: 15 }}>
                                        <CustomButton
                                            title="Cancel request"
                                            containerStyle={{ borderColor: '#fff', backgroundColor: '#fff' }}
                                            textStyle={{ color: '#c21717' }}
                                            onPress={() => onCancelRequest()}
                                        />
                                    </View>
                                )
                            }
                            {
                                endorsement?.denied && (
                                    <View style={{ width: '100%', paddingHorizontal: '10%', paddingVertical: 20 }}>
                                        <CustomButton
                                            title='Go to logbook'
                                            onPress={() => props.navigation.navigate('Dashboard', { vessel: vessel })}
                                            containerStyle={{}}
                                            textStyle={{ color: 'white', paddingVertical: 18, fontSize: width / 28, lineHeight: 16.41, letterSpacing: -0.3, fontWeight: '700' }}
                                        />
                                    </View>
                                )
                            }
                        </View>
                    </View>

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
        fontSize: width / 21,
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
        endorsements: state.APP.endorsements
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(SecurityActions(), dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EndorsementDetails);
