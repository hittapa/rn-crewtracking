import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    SafeAreaView,
    Text,
    Dimensions,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import * as GlobalStyles from '../../styles/styles';
import { Colors } from '../../styles/index';
import { HeaderLeft } from '../../components/Header/HeaderLeft';
import { HeaderRight } from '../../components/Header/HeaderRight';
import { HeaderTitle } from '../../components/Header/HeaderTitle';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SecurityActions from '../../actions/SecurityActions';
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { FlatList, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { CustomSwitch } from '../../components/CustomSwitch';
import CustomButton from '../../components/CustomButton';
import Modal from "react-native-modalbox";

import { SignedOnIcon } from '../../components/Icons/SignedOnIcon';
import HistoryItem from './HistoryItem';
import service from './api.json';
import { dateStringToYear } from '../../utils/dateTimeHelper';
import { width } from '../../components/Carousel/Carousel';

function ServiceSummary(props) {
    let _years = [];
    let ty = dateStringToYear(new Date());
    const [user, setUser] = useState(null);
    const [pro, setPro] = useState(false);
    const [serviceSummary, setServiceSummary] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [showTotalSummary, setShowTotalSummary] = useState(true);
    const [history, setHistory] = useState(null);
    const [showSummary, setShowSummary] = useState(null)

    useEffect(() => {
        const sortByMonth = (arr) => {
            var months = ["January", "February", "March", "April", "May", "June",
  	        "July", "August", "September", "October", "November", "December"];
            var arrMonths = arr.sort((a, b) => {
                return months.indexOf(b.month) - months.indexOf(a.month);
            });
            arrMonths = arrMonths.sort((a, b) => {
                return b.year - a.year
            })
            return arrMonths;
        }
        setHistory(sortByMonth(service.history))
    }, [])

    useEffect(() => {
        if (!mounted) {
            console.log(props.user);
            setUser(props.user);
            setPro(props.user.plan.includes('pro'));
            setServiceSummary(service);
            setMounted(true);
        }
    }, [props, mounted])

    const ListItem = ({ title, value, border = false }) => {
        return (
            <View style={[{
                ...styles.listItem,
            }, border && { borderBottomWidth: 0 }]}>
                <Text style={{
                    ...styles.subTitle
                }}>
                    {title}
                </Text>
                <Text style={{
                    ...styles.label
                }}>{value}</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={[GlobalStyles.safeView]}>
            <View style={[GlobalStyles.header]}>
                <HeaderLeft onPress={() => props.navigation.openDrawer()}>
                    <View
                        style={{
                            borderRadius: 50,
                            alignItems: 'center',
                            marginLeft: 20
                        }}
                    >
                        <FontAwesome5
                            name="bars"
                            size={28}
                            color={'#000'}
                        />
                    </View>
                </HeaderLeft>
                <HeaderTitle>
                    <Text style={{
                        color: 'black',
                        fontSize: width / 18,
                        fontWeight: 'bold',
                    }}>Service Summary</Text>
                </HeaderTitle>
                <HeaderRight onPress={() => onSaveUpdate()}>
                    <View style={{ width: 40 }}></View>
                </HeaderRight>
            </View>
            <ScrollView
                style={{
                    backgroundColor: '#e5e5e5',
                }}
            >
                <View
                    style={{
                        backgroundColor: '#fff',
                        padding: 8,
                        borderBottomColor: '#f1f1f1',
                        borderBottomWidth: .5
                    }}
                >
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-between',
                            padding: 14
                        }}
                        onPress={() => {
                            if (showSummary !== null) {
                                setShowSummary(null)
                                setShowTotalSummary(true)
                            } else {
                                setShowTotalSummary(!showTotalSummary)
                            }
                        }}
                    >
                        <View style={{
                            flexDirection: 'column',
                            justifyContent: 'space-evenly',
                        }}>
                            <Text style={{ ...styles.title }}>
                                All Service totals
                                </Text>
                            <View style={{
                                flexDirection: 'row',
                                height: 22,
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Text style={{ ...styles.label }} >
                                    {serviceSummary ? serviceSummary.trip_total + " Trips" : '--'}
                                </Text>
                                <View style={{ width: 5, height: 5, backgroundColor: '#c4c4c4' }} />
                                <Text style={{ ...styles.label }} >
                                    {serviceSummary ? serviceSummary.distance_total + ' nm' : '--'}
                                </Text>
                            </View>
                        </View>
                        <View style={{
                            flexDirection: 'column',
                            justifyContent: 'space-evenly',
                        }}>
                            <Text style={{
                                ...styles.title,
                                textAlign: 'right'
                            }} >
                                {serviceSummary ? serviceSummary.service_total : '--'}
                            </Text>
                            <Text style={{
                                ...styles.label,
                                textAlign: 'right'
                            }} >
                                Days underway
                                </Text>
                        </View>
                    </TouchableOpacity>
                    {
                        showSummary === null && showTotalSummary && serviceSummary && (
                            <View style={{
                                flexDirection: 'row',
                                width: '100%',
                                borderRadius: 11,
                                backgroundColor: '#f0f0f0',
                                justifyContent: 'space-between',
                                paddingLeft: 13,
                                overflow: 'hidden',
                            }}>
                                <View style={{
                                    flexDirection: 'column'
                                }}>
                                    {
                                        serviceSummary.watchkeeping_total != undefined && ListItem({ title: 'Watchkeeping', value: serviceSummary.watchkeeping_total.toString() + ' days' })
                                    }
                                    {
                                        serviceSummary.standby_total != undefined && ListItem({ title: 'Standby', value: serviceSummary.standby_total.toString() + ' days' })
                                    }
                                    {
                                        serviceSummary.av_hours_total != undefined && ListItem({ title: 'Average hours underway per day', value: serviceSummary.av_hours_total.toString() + ' hrs' })
                                    }
                                    {
                                        serviceSummary.av_distance_total != undefined && ListItem({ title: 'Average distance offshore', value: serviceSummary.av_distance_total.toString() + ' nm' })
                                    }
                                    {
                                        serviceSummary.seaward_total != undefined && ListItem({ title: 'Seaward of boundary line', value: serviceSummary.seaward_total.toString() + ' days' })
                                    }
                                    {
                                        serviceSummary.shoreward_total != undefined && ListItem({ title: 'Shoreward of boundary line', value: serviceSummary.shoreward_total.toString() + ' days' })
                                    }
                                    {
                                        serviceSummary.lakes_total != undefined && ListItem({ title: 'On great lakes', value: serviceSummary.lakes_total.toString() + ' days', border: true })
                                    }
                                    {
                                        serviceSummary.onboard_total != undefined && (
                                            <View style={{
                                                ...styles.listItem,
                                                borderBottomWidth: 0,
                                            }}>
                                                <Text style={{
                                                    ...styles.title
                                                }}>
                                                    Days onboard
                                                    </Text>
                                                <Text style={{
                                                    ...styles.title
                                                }}>{serviceSummary.onboard_total}</Text>
                                            </View>
                                        )
                                    }
                                    {
                                        serviceSummary.onleave_total != undefined && ListItem({ title: 'On leave', value: serviceSummary.onleave_total.toString() + ' days' })
                                    }
                                    {
                                        serviceSummary.yard_service_total != undefined && ListItem({ title: 'Yard service', value: serviceSummary.yard_service_total.toString() + ' days', border: true })
                                    }
                                </View>
                            </View>
                        )
                    }
                </View>
                <View style={{
                    borderBottomColor: '#f1f1f1',
                    borderBottomWidth: .5
                }}>
                    {
                        history?.map((item, idx) => {
                            if (idx === 0) {console.log(item)}
                            if (_years.includes(item.year) == true || ty == item.year) {
                                return (
                                    <HistoryItem
                                        key={idx}
                                        itemID={idx}
                                        title={
                                            <Text style={{ ...styles.title }} >{item.month}</Text>
                                        }
                                        subtitle={
                                            <Text style={{ ...styles.label }}>{item.distance} nm</Text>
                                        }
                                        day={item.service_total}
                                        data={item}
                                        pro={pro}
                                        showSummary={showSummary}
                                        setShowSummary={(id) => setShowSummary(id)}
                                    />
                                )
                            }
                            else {
                                _years.push(item.year);
                                return (
                                    <View key={idx} style={{ flexDirection: 'column' }}>
                                        <Text style={{
                                            color: '#ffffff',
                                            fontSize: width / 32,
                                            lineHeight: 19,
                                            letterSpacing: -0.08,
                                            fontFamily: 'Roboto-Regular',
                                            paddingLeft: 12,
                                            height: 19
                                        }}>{item.year}</Text>
                                        <HistoryItem
                                            itemID={idx}
                                            title={
                                                <Text style={{ ...styles.title }} >{item.month}</Text>
                                            }
                                            subtitle={
                                                <Text style={{ ...styles.label }}>{item.distance} nm</Text>
                                            }
                                            day={item.service_total}
                                            data={item}
                                            pro={pro}
                                            showSummary={showSummary}
                                            setShowSummary={(id) => setShowSummary(id)}
                                        />
                                    </View>
                                )
                            }
                        })
                    }
                </View>
            </ScrollView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
    title: {
        fontSize: width / 19,
        color: '#000',
        lineHeight: 22,
        fontFamily: 'Roboto-Regular',
        letterSpacing: -0.41,
        fontWeight: '500',
    },
    subTitle: {
        fontSize: width/24.5,
        lineHeight: 19.92,
        letterSpacing: -0.3,
        fontWeight: '400',
        fontFamily: 'Roboto-Regular',
        color: '#000'
    },
    label: {
        fontSize: width/27,
        color: '#3c3c43',
        lineHeight: 22,
        fontFamily: 'Roboto-Light',
        fontWeight: '300',
        letterSpacing: -0.41
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
    infoMark: {
        width: 16,
        height: 16,
        backgroundColor: '#3a0',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginLeft: 10,
        marginTop: 0
    },

    modalHeader: {
        paddingVertical: 15,
        alignItems: 'center'
    },
    modalBody: {
        height: '75%',
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
    navigationText: {
        fontFamily: 'Roboto-Regular',
        fontSize: width/24.5,
        lineHeight: 19.92,
        letterSpacing: -0.3,
        fontWeight: '400',
        marginRight: 20,
        width: 55
    },
    listItemText: {
        textAlign: 'center',
        fontSize: width / 26,
        lineHeight: 24,
        color: '#09e',
    },
    listItem: {
        height: 44,
        width: Dimensions.get('screen').width - 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 13,
        paddingTop: 11.5,
        paddingBottom: 10.5,
        alignItems: 'center',
        borderBottomWidth: .5,
        borderBottomColor: '#999'
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

export default connect(mapStateToProps, mapDispatchToProps)(ServiceSummary);
