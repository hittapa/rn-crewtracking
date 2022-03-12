import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    SafeAreaView,
    Text,
    TouchableOpacity,
    Image,
    ActivityIndicator,
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
import { onUpgradePlan } from '../AccountSettings/Subscription';

function Endorsement(props) {
    const [user, setUser] = useState(null);
    const [pro, setPro] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [endorsements, setEndorsements] = useState(null);

    useEffect(() => {
        if (props.user) {
            setUser(props.user);
            setPro(props.user.plan.includes('pro'));
        }
        props.user && props.actions.getEndorsements({ user: props.user.id }).then(res => {
            if (res.endorsements) {
                setEndorsements(res.endorsements);
                props.actions.storeEndorsements(res.endorsements);
            }
        })
        if (!mounted && user) {
            setMounted(true);
        }
        if (props.endorsements) {
            setEndorsements(props.endorsements)
        } else {
            setEndorsements([]);
        }
    }, [mounted])

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
                            }}>Sea Time Endorsements</Text>
                        </View>
                    </HeaderTitle>
                    <HeaderRight onPress={() => { }}>
                        <View style={{ width: 40 }}></View>
                    </HeaderRight>
                </View>
                <ScrollView style={[{ backgroundColor: '#f9f9f9' }]}>
                    <View style={{ width: '100%', backgroundColor: '#fff' }}>
                        {
                            pro && endorsements && endorsements.length > 0 && (
                                <View style={{ width: '100%', backgroundColor: '#fff' }}>
                                    {
                                        endorsements.map((endo, index) => {
                                            let vessel = JSON.parse(endo.vessel);
                                            let period = JSON.parse(endo.period);
                                            let testimonial = endo.testimonial ? (endo.testimonial) : null;
                                            let certificate = endo.certificate ? (endo.certificate) : null;
                                            let uscg = endo.uscg ? (endo.uscg) : null;
                                            return (
                                                <View key={"endorsement_" + index} style={{ justifyContent: 'space-between', flex: 1, flexDirection: 'row', padding: 16, borderBottomColor: '#c6c6c8', borderBottomWidth: .5 }}>
                                                    <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', }}>
                                                        <Text
                                                            style={{ color: '#007aff', fontSize: width / 21, lineHeight: 22, letterSpacing: -0.41, fontWeight: '400', fontFamily: 'Roboto-Regular' }}
                                                            onPress={() => props.navigation.navigate('Dashboard', { vessel: vessel })}
                                                        >{vessel?.name}</Text>
                                                        <Text
                                                            style={{ color: '#333333', fontSize: width / 27, lineHeight: 22, letterSpacing: -0.41, fontWeight: '400', fontFamily: 'Roboto-Regular', marginTop: 8 }}
                                                        >{endo.entryNumber}</Text>
                                                    </View>
                                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                                                        onPress={() => {
                                                            if (!endo.approved && !endo.denied) {
                                                                props.navigation.navigate('EndorsementDetails', { endorsement: endo })
                                                            }
                                                            if (endo.denied) {
                                                                props.navigation.navigate('EndorsementDetails', { endorsement: endo })
                                                            }
                                                            if (endo.approved) {
                                                                props.navigation.navigate('EndorsementDetails', { endorsement: endo })
                                                            }
                                                        }}
                                                    >
                                                        <View style={{ flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', }}>
                                                            {
                                                                !endo.approved && !endo.denied && (
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                                                        <Text style={{ fontSize: width / 21, lineHeight: 22, color: '#e7a600' }}>Endorsement</Text>
                                                                        <MaterialCommunityIcons
                                                                            name="clock-time-five-outline"
                                                                            style={{ marginRight: -4, marginLeft: 8 }}
                                                                            size={28}
                                                                            color={'#e7a600'}
                                                                        />
                                                                    </View>
                                                                )
                                                            }
                                                            {
                                                                endo.denied && (
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                                                        <Text style={{ fontSize: width / 21, lineHeight: 22, color: '#c21717' }}>Endorsement</Text>
                                                                        <MaterialIcons
                                                                            name="do-not-disturb"
                                                                            style={{ marginRight: -4, marginLeft: 8 }}
                                                                            size={28}
                                                                            color={'#c21717'}
                                                                        />
                                                                    </View>
                                                                )
                                                            }
                                                            {
                                                                endo.approved && (
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                        <Image source={require('../../assets/images/crewlog_stamp.png')} style={{ width: 50, height: 50 }} />
                                                                    </View>
                                                                )
                                                            }
                                                            <Text style={{ fontSize: width / 36, lineHeight: 15, color: '#ababab' }}>{moment(period.start).utc().format('DD MMM YYYY') + " to " + moment(period.end).utc().format('DD MMM YYYY')}</Text>
                                                        </View>
                                                        <MaterialCommunityIcons
                                                            name="chevron-right"
                                                            style={{ marginRight: -8 }}
                                                            size={28}
                                                            color={'#ababab'}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            )
                        }

                        {
                            pro && !endorsements && (
                                (
                                    <View style={{ flex: 1, justifyContent: 'center', width: '100%', height: height - 100, textAlign: 'center' }}>
                                        <ActivityIndicator />
                                    </View>
                                )
                            )
                        }
                    </View>
                    {
                        pro && endorsements?.length == 0 && (
                            (
                                <View style={{ width: '100%', flex: 1, alignItems: 'flex-start', paddingTop: 10 }}>
                                    <Image source={require('../../assets/images/no_endorsement.png')} style={{ width: width, height: width * 1128 / 828, alignContent: 'flex-start', resizeMode: 'contain' }} />
                                </View>
                            )
                        )
                    }
                    {
                        !pro && (
                            (
                                <View style={{ width: '100%', flex: 1, alignItems: 'flex-start', paddingTop: 10, padding: 40 }}>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 }}>
                                        <Image source={require('../../assets/images/tick_blue.png')} style={{ width: 79.5, height: 79.5, alignContent: 'flex-start', resizeMode: 'contain' }} />
                                        <Text style={styles.description}>Is your sea time paperwork ready for your next ticket?</Text>
                                    </View>
                                    <Text style={styles.header}>Create proof of sea time</Text>
                                    <Text style={{ ...styles.description, width: '100%' }}>Use the Crewlog Sea Time Endorsement system to automatically create, email and endorse all sea time forms online, based on your logbook records..</Text>

                                    <CustomButton
                                        title={'Upgrade to Crewlog PRO'}
                                        containerStyle={{ height: 50, marginTop: 50 }}
                                        textStyle={{ color: '#ffffff' }}
                                        onPress={() => {
                                            if (user?.receipt) {
                                                props.navigation.navigate('Settings');
                                            } else {
                                                onUpgradePlan();
                                            }
                                        }}
                                    />
                                </View>
                            )
                        )
                    }


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
    },
    description: {
        fontSize: width / 25, lineHeight: width / 18, fontWeight: '300', width: '70%', paddingHorizontal: 20, letterSpacing: -0.3, textAlign: 'center'
    },
    header: {
        fontSize: width / 16, fontWeight: '300', width: '100%', paddingVertical: 20, letterSpacing: -0.078, textAlign: 'center'
    },
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

export default connect(mapStateToProps, mapDispatchToProps)(Endorsement);
