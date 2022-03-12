import React, { useEffect, useRef, useState } from "react";
import { bindActionCreators } from "redux";
import SecurityActions from "../../actions/SecurityActions";
import { connect } from "react-redux";
import { SafeAreaView, View, KeyboardAvoidingView, ScrollView, StyleSheet, Text, Image, TouchableOpacity, FlatList, TextInput, Platform, ImageBackground, Linking } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { Switch } from '../../components/Endorsement/Switch';
import { HeaderLeft } from '../../components/Header/HeaderLeft';
import { HeaderRight } from '../../components/Header/HeaderRight';
import { HeaderTitle } from '../../components/Header/HeaderTitle';
import { Colors } from '../../styles';
import * as GlobalStyles from '../../styles/styles';
import { FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { height, width } from '../../components/Carousel/Carousel';
import moment from 'moment';
import TableHeader from "../../components/Endorsement/TableHeader";
import TableBody from "../../components/Endorsement/TableBody";
import TableRow from "../../components/Endorsement/TableRow";
import TableCol from "../../components/Endorsement/TableCol";
import { dateStringToMilli, dateStringToMonth, dateStringToYear, getTotalDays } from "../../utils/dateTimeHelper";
import SignatureView from 'react-native-signature-canvas';
import appConstants from "../../constants/app";

const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

function SmallVesselFormUSCG(props) {

    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState(null);
    const [vessel, setVessel] = useState(null);
    const [period, setPeriod] = useState(null);
    const [departments, setDepartments] = useState(null);
    const [forms, setForms] = useState(null);
    const [roles, setRoles] = useState(null);
    const [type, setType] = useState('merchant');
    const [openKeyboard, setOpenKeyboard] = useState(false);
    const [dischargeBook, setDischargeBook] = useState('');
    const [signature, setSignature] = useState(null);
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const [propulsion, setPropulsion] = useState(null);
    const [statsInfo, setStatsInfo] = useState(null);
    const [date, setDate] = useState(null);
    const [serviceTotals, setServiceTotals] = useState(null);
    const [readOnly, setReadOnly] = useState(false);
    const [uscg, setUscg] = useState(null);
    const [capacity, setCapacity] = useState(null);
    const [routes, setRoutes] = useState(null);

    const ref = useRef();

    useEffect(() => {
        if (!mounted) {
            if (props.user) setUser(props.user);
            if (props.route.params.vessel) {
                let _ves = props.route.params.vessel;
                setVessel(_ves);
                let onboardServices = _ves?.onboardServices;
                let stats = {};
                months.map((month) => {
                    stats[month] = {};
                });
                let pid = props.route.params.period
                for (let index = 0; index < onboardServices.length; index++) {
                    const ele = onboardServices[index];
                    if (ele.type == 'trip') {
                        if (ele.started_at > pid.start && ele.ended_at < pid.end) {
                            let start = parseInt(ele.started_at);
                            let end = parseInt(ele.ended_at);
                            let syear = parseInt(moment(start).utc().format('YYYY'));
                            let smonth = parseInt(moment(start).utc().format('MM'));
                            let sdate = parseInt(moment(start).utc().format('DD'));
                            let eyear = parseInt(moment(end).utc().format('YYYY'));
                            let emonth = parseInt(moment(end).utc().format('MM'));
                            let edate = parseInt(moment(end).utc().format('DD'));
                            let totalDays = getTotalDays(start, end);
                            let diffInMonths = moment(start).diff(end, 'months');
                            if (diffInMonths == 0) stats[months[smonth - 1]][syear] = totalDays;
                            else
                                for (let i = 0; i < diffInMonths + 1; i++) {
                                    if (i == 0) {
                                        stats[months[smonth - 1]][syear] = parseInt(moment(`${smonth + 1}/01/${syear}`).diff(start, 'days', true));
                                    } else if (i == diffInMonths) {
                                        stats[months[emonth - 1]][eyear] = edate;
                                    } else {
                                        let rmon = smonth + i;
                                        let month = rmon % 12;
                                        let year = syear + parseInt(rmon / 12);
                                        stats[months[month - 1]][year] = parseInt(moment(`${month + 1}/01/${year}`).diff(`${month}/01/${year}`, 'days', true));
                                    }
                                }
                        }
                    }
                }
                setStatsInfo(stats);
                calculateServiceTotals();
            };
            if (props.route.params.period) setPeriod(props.route.params.period);
            if (props.route.params.departments) typeof props.route.params.departments == 'string' ? setDepartments(JSON.parse(props.route.params.departments)) : setDepartments(props.route.params.departments);
            if (props.route.params.forms) setForms(props.route.params.forms);
            if (props.route.params.roles) typeof props.route.params.roles == 'string' ? setRoles(JSON.parse(props.route.params.roles)) : setRoles(props.route.params.roles);
            if (props.route.params.type) setType(props.route.params.type);
            if (props.route.params.dischargeBook) setDischargeBook(props.route.params.dischargeBook);
            if (props.route.params.uscgSignature) setSignature(props.route.params.uscgSignature);
            if (props.route.params.propulsion) setPropulsion(props.route.params.propulsion);
            if (props.route.params.date) setDate(props.route.params.date);
            if (props.route.params.user) setUser(props.route.params.user);
            if (props.route.params.routes) typeof props.route.params.routes == 'string' ? setRoutes(JSON.parse(props.route.params.routes)) : setRoutes(props.route.params.routes);
            if (props.route.params.uscg) setUscg(props.route.params.uscg);
            if (props.route.params.capacity) setCapacity(props.route.params.capacity);
            if (props.route.params.uscgSignature) setSignature(appConstants.MAINURL + props.route.params.uscgSignature);
            if (props.route.params.readOnly) setReadOnly(true); else setReadOnly(false);
            if (props.route.params.user_info) setUser(JSON.parse(props.route.params.user_info));
            if (props.route.params.serviceTotals) typeof props.route.params.serviceTotals == 'string' ?  setServiceTotals(JSON.parse(props.route.params.serviceTotals)) : setServiceTotals(props.route.params.serviceTotals);
            setMounted(true);
        }
        // if (vessel && period) calculateServiceTotals();
    }, [props, vessel, period]);

    const calculateServiceTotals = () => {
        let st = {};
        st.onboard_service = 0;
        st.leave = 0;
        st.yard = 0;
        st.underway = 0;
        st.watchkeeping = 0;
        st.standby = 0;
        st.av_hours_underway_per_day = 0;
        st.av_distance_offshore = 0;
        st.seaward = 0;
        st.shoreward = 0;
        st.lakes = 0;
        let start = period?.start;
        let end = period?.end;
        st.onboard_service = getTotalDays(start, end);

        if (vessel?.onboardServices && vessel?.onboardServices.length > 0) {
            for (let i = 0; i < vessel?.onboardServices.length; i++) {
                const item = vessel?.onboardServices[i];
                if (start) {
                    if (end) {
                        if (item?.ended_at < start || item?.started_at > end) {
                            continue;
                        } else {
                            if (item?.type == 'onleave') {
                                st.leave += item.ended_at ? getTotalDays(item.started_at, item.ended_at) : 0;
                            }
                            if (item?.type == 'inyard') {
                                st.yard += item.ended_at ? getTotalDays(item.started_at, item.ended_at) : 0;
                            }
                            if (item?.type == 'trip' && item?.trip != null) {
                                st.underway += item.trip.underway;
                                st.watchkeeping += item.trip.watchkeeping;
                                st.standby += item.trip.standby;
                                st.av_hours_underway_per_day += item.trip.av_hours_underway_per_day;
                                st.av_distance_offshore += item.trip.av_distance_offshore;
                                st.seaward += item.trip.seaward;
                                st.shoreward += item.trip.shoreward;
                                st.lakes += item.trip.lakes;
                            }
                        }
                    } else {
                        if (item?.ended_at < start) {
                            continue;
                        } else {
                            if (item?.type == 'onleave') {
                                st.leave += item.ended_at ? getTotalDays(item.started_at, item.ended_at) : 0;
                            }
                            if (item?.type == 'inyard') {
                                st.yard += item.ended_at ? getTotalDays(item.started_at, item.ended_at) : 0;
                            }
                            if (item?.type == 'trip' && item?.trip != null) {
                                st.underway += item.trip.underway;
                                st.watchkeeping += item.trip.watchkeeping;
                                st.standby += item.trip.standby;
                                st.av_hours_underway_per_day += item.trip.av_hours_underway_per_day;
                                st.av_distance_offshore += item.trip.av_distance_offshore;
                                st.seaward += item.trip.seaward;
                                st.shoreward += item.trip.shoreward;
                                st.lakes += item.trip.lakes;
                            }
                        }
                    }
                }
            }
        }
        setServiceTotals(st);
    }

    const enableNext = () => {
        let enable = true;
        if (vessel?.imoNumber == null) return false;
        if (!signature) return false;
        if (!date) return false;
        if (!propulsion) return false;
        if (!user?.socialSecurityNumber) return false;
        return enable;
    }

    const handleNext = () => {
        if (enableNext()) {
            const data = {
                ...props.route.params,
                vessel: vessel,
                user: user,
                uscg: true,
                dischargeBook,
                uscgSignature: signature,
                propulsion,
                date,
                statsInfo,
                serviceTotals
            }
            props.navigation.navigate('EndorseStep3', data)
        }
    }

    const handleSignEnd = (sign) => {
        ref.current.readSignature();
    }

    const handleSignEmpty = () => {
        ref?.current?.clearSignature();
        setSignature(null);
    }

    const handleOK = (data) => {
        setSignature(data);
    }

    const getLengthInFeet = () => {
        if (vessel) {
            if (vessel.ol_unit == 'm') {
                let len = vessel?.length * 3.28084;
                return len
            }
            if (vessel.ol_unit == 'ft') return vessel?.length;
        }
        return ''
    }

    const handleClose = () => {
        if (readOnly) props.navigation.goBack();
        else {
            const data = {
                ...props.route.params,
                vessel: vessel,
                user: user,
                dischargeBook,
                uscgSignature: signature,
                propulsion,
                date,
                statsInfo,
                serviceTotals
            }
            props.navigation.navigate('EndorseStep3', data)
        }
    }

    const openURL = (url) => {
        url = (appConstants.MAINURL + url).trim();
        Linking.openURL(url)
    }

    return (
        <View style={GlobalStyles.FlexContainer}>
            <SafeAreaView style={{ ...GlobalStyles.safeView, marginTop: 0 }}>
                <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'height' : 'height'}>
                    <View style={[GlobalStyles.header]}>
                        <HeaderLeft onPress={() => handleClose()}>
                            <MaterialCommunityIcons name="close" color={'#ababab'} size={24} style={{ marginLeft: 20 }} />
                        </HeaderLeft>
                        <HeaderTitle>
                            {
                                !readOnly && (
                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                        <Text style={{
                                            ...GlobalStyles.headerTitle
                                        }}>Review Form</Text>
                                    </View>
                                )
                            }
                        </HeaderTitle>
                        <HeaderRight onPress={() => {
                            if(readOnly && uscg?.printform) openURL(uscg?.printform);
                            // if(readOnly && uscg?.printform) props.navigation.navigate("ViewPrintform", {uri: uscg.printform})
                        }}>
                            {
                                readOnly && uscg?.printform ? (
                                    <View style={{ width: 100, marginRight: 20, alignItems: 'flex-end' }}>
                                        <Text style={{ textAlign: 'right', fontSize: width/27, color: '#007aff' }}>Print form</Text>
                                    </View>
                                ) : (
                                    <View style={{ width: 55, marginRight: 20 }}>
                                    </View>
                                )
                            }
                        </HeaderRight>
                    </View>
                    <View style={{ backgroundColor: 'transparent', width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <View style={{ width: '100%', backgroundColor: '#f58e6d', justifyContent: 'center', alignItems: 'center', paddingVertical: 15 }}>
                            <Text style={{ ...styles.stickyHeaderText, textAlign: 'center', maxWidth: 310 }}>{`USCG: Small vessel sea service form (under 200GT)`}</Text>
                        </View>
                    </View>
                    <ScrollView style={[{ backgroundColor: '#e5e5e5', marginBottom: readOnly ? 100 : openKeyboard ? 100 : 190 }]} nestedScrollEnabled scrollEnabled={scrollEnabled}>
                        <View style={{ width: '100%', backgroundColor: '#fff', padding: 16, }}>
                            <View style={{ width: '100%', marginVertical: 10 }}>
                                <TableHeader containerStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                                    Section I: Applicant Information
                                    {
                                        !readOnly && (
                                            <Text style={{ fontSize: width / 26 }}>{'\n(Complete any missing information)'}</Text>
                                        )
                                    }
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCol>First Name</TableCol>
                                        <TableCol value={true}>{user?.firstName}</TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol>Last Name</TableCol>
                                        <TableCol value={true}>{user?.lastName}</TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol>Middle</TableCol>
                                        <TableCol value={true} edit={true}>
                                            <TextInput
                                                placeholder={!readOnly ? "Enter optional info" : "--"}
                                                placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                editable={!readOnly}
                                                style={styles.tableColTextValue}
                                                onFocus={() => setOpenKeyboard(true)}
                                                onBlur={() => setOpenKeyboard(false)}
                                                keyboardType={'default'}
                                                value={user?.middleName}
                                                onChangeText={(text) => {
                                                    let _user = { ...user };
                                                    _user.middleName = text;
                                                    setUser(_user);
                                                }}
                                            />
                                        </TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol>Reference number</TableCol>
                                        <TableCol value={true} edit={true}>
                                            <TextInput
                                                placeholder={!readOnly ? "Enter if applicable" : "--"}
                                                placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                editable={!readOnly}
                                                style={styles.tableColTextValue}
                                                onFocus={() => setOpenKeyboard(true)}
                                                onBlur={() => setOpenKeyboard(false)}
                                                keyboardType={'numeric'}
                                                value={user?.referenceNumber}
                                                onChangeText={(text) => {
                                                    let _user = { ...user };
                                                    _user.referenceNumber = text;
                                                    setUser(_user);
                                                }}
                                            />
                                        </TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol textStyle={{ fontSize: width / 26 }}>Social Security Number</TableCol>
                                        <TableCol value={true} edit={true}>
                                            <TextInput
                                                placeholder={!readOnly ? "Enter last 4 digits" : "--"}
                                                placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                editable={!readOnly}
                                                style={user?.socialSecurityNumber ? styles.tableColTextValue : styles.placeholderStyle}
                                                onFocus={() => setOpenKeyboard(true)}
                                                onBlur={() => setOpenKeyboard(false)}
                                                keyboardType={'numeric'}
                                                value={user?.socialSecurityNumber}
                                                onChangeText={(text) => {
                                                    let _user = { ...user };
                                                    _user.socialSecurityNumber = text;
                                                    setUser(_user);
                                                }}
                                                maxLength={4}
                                            />
                                        </TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol containerStyle={{ width: '100%', height: 30 }}></TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol>Name of vessel</TableCol>
                                        <TableCol value={true}>{vessel?.name}</TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol textStyle={{ fontSize: width / 26 }}>Official number or State Registration number</TableCol>
                                        <TableCol value={true} edit={true}>
                                            <TextInput
                                                placeholder={!readOnly ? "Enter number" : "--"}
                                                keyboardType={'numeric'}
                                                maxLength={7}
                                                value={vessel?.imoNumber.toString()}
                                                onChangeText={(text) => {
                                                    let _ves = { ...vessel };
                                                    _ves.imoNumber = text;
                                                    setVessel(_ves);
                                                }}
                                                placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                editable={!readOnly}
                                                style={vessel?.imoNumber ? styles.tableColTextValue : styles.placeholderStyle}
                                                onFocus={() => setOpenKeyboard(true)}
                                                onBlur={() => setOpenKeyboard(false)}
                                            />
                                        </TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol>{'Vessel Gross Tons'}</TableCol>
                                        <TableCol value={true}>{vessel?.grossTonnage}</TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol>Length Feet</TableCol>
                                        <TableCol value={true}>{getLengthInFeet()}</TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol>Length Inches <Text style={{ fontSize: width / 33, fontFamily: 'Roboto-Thin' }}>(optional)</Text></TableCol>
                                        <TableCol value={true} edit={true}>
                                            <TextInput
                                                placeholder={!readOnly ? "Enter optional info" : "--"}
                                                keyboardType={'numeric'}
                                                value={vessel?.lengthInches}
                                                onChangeText={(text) => {
                                                    let _ves = { ...vessel };
                                                    _ves.lengthInches = text;
                                                    setVessel(_ves);
                                                }}
                                                placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                editable={!readOnly} style={styles.tableColTextValue}
                                                onFocus={() => setOpenKeyboard(true)}
                                                onBlur={() => setOpenKeyboard(false)}
                                            />
                                        </TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol>Width Feet <Text style={{ fontSize: width / 33, fontFamily: 'Roboto-Thin' }}>(optional)</Text></TableCol>
                                        <TableCol value={true} edit={true}>
                                            <TextInput
                                                placeholder={!readOnly ? "Enter optional info" : "--"}
                                                keyboardType={'numeric'}
                                                value={vessel?.widthFeet}
                                                onChangeText={(text) => {
                                                    let _ves = { ...vessel };
                                                    _ves.widthFeet = text;
                                                    setVessel(_ves);
                                                }}
                                                placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                editable={!readOnly} style={styles.tableColTextValue}
                                                onFocus={() => setOpenKeyboard(true)}
                                                onBlur={() => setOpenKeyboard(false)}
                                            />
                                        </TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol>Width Inches <Text style={{ fontSize: width / 33, fontFamily: 'Roboto-Thin' }}>(optional)</Text></TableCol>
                                        <TableCol value={true} edit={true}>
                                            <TextInput
                                                placeholder={!readOnly ? "Enter optional info" : "--"}
                                                keyboardType={'numeric'}
                                                value={vessel?.widthInches}
                                                onChangeText={(text) => {
                                                    let _ves = { ...vessel };
                                                    _ves.widthInches = text;
                                                    setVessel(_ves);
                                                }}
                                                placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                editable={!readOnly} style={styles.tableColTextValue}
                                                onFocus={() => setOpenKeyboard(true)}
                                                onBlur={() => setOpenKeyboard(false)}
                                            />
                                        </TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol>Depth Feet <Text style={{ fontSize: width / 33, fontFamily: 'Roboto-Thin' }}>(optional)</Text></TableCol>
                                        <TableCol value={true} edit={true}>
                                            <TextInput
                                                placeholder={!readOnly ? "Enter optional info" : "--"}
                                                keyboardType={'numeric'}
                                                value={vessel?.depthFeet}
                                                onChangeText={(text) => {
                                                    let _ves = { ...vessel };
                                                    _ves.depthFeet = text;
                                                    setVessel(_ves);
                                                }}
                                                placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                editable={!readOnly} style={styles.tableColTextValue}
                                                onFocus={() => setOpenKeyboard(true)}
                                                onBlur={() => setOpenKeyboard(false)}
                                            />
                                        </TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol>Depth Inches <Text style={{ fontSize: width / 33, fontFamily: 'Roboto-Thin' }}>(optional)</Text></TableCol>
                                        <TableCol value={true} edit={true}>
                                            <TextInput
                                                placeholder={!readOnly ? "Enter optional info" : "--"}
                                                keyboardType={'numeric'}
                                                value={vessel?.depthInches}
                                                onChangeText={(text) => {
                                                    let _ves = { ...vessel };
                                                    _ves.depthInches = text;
                                                    setVessel(_ves);
                                                }}
                                                placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                editable={!readOnly} style={styles.tableColTextValue}
                                                onFocus={() => setOpenKeyboard(true)}
                                                onBlur={() => setOpenKeyboard(false)}
                                            />
                                        </TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol containerStyle={{ width: '100%', height: 30 }}></TableCol>
                                    </TableRow>

                                    <TableRow>
                                        <TableCol textStyle={{ fontSize: width / 26 }}>Propulsion (Motor, steam, turbine, sail, aux. sail)</TableCol>
                                        <TableCol value={true} edit={true}>
                                            <TextInput
                                                placeholder={!readOnly ? "Enter propulsion" : "--"}
                                                keyboardType={'default'}
                                                value={propulsion}
                                                onChangeText={(text) => setPropulsion(text)}
                                                placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                editable={!readOnly}
                                                style={propulsion ? styles.tableColTextValue : styles.placeholderStyle}
                                                onFocus={() => setOpenKeyboard(true)}
                                                onBlur={() => setOpenKeyboard(false)}
                                            />
                                        </TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol textStyle={{ fontSize: width / 26 }}>Served As (Master/Mate Operator/Deckhand/Engine, etc)</TableCol>
                                        <TableCol value={true}>{roles?.join('/')}</TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol textStyle={{ fontSize: width / 26 }}>Name of Body or Bodies of Water Upon Which Vessel was underway (Geographic Locations)</TableCol>
                                        <TableCol value={true}>{typeof routes == 'string' ? routes : routes?.join('\n')}</TableCol>
                                    </TableRow>
                                </TableBody>

                                <TableHeader containerStyle={{ borderWidth: 0, paddingLeft: 0 }}>
                                    Section II: Record of Underway Service
                                </TableHeader>

                                <ScrollView style={{ marginBottom: 20 }} horizontal>
                                    {
                                        statsInfo && months.map((month, index) => {
                                            return (
                                                <View key={"stats_" + month} style={{ marginHorizontal: index == 0 ? 0 : 10, width: 300, }}>
                                                    <TableHeader containerStyle={{ borderTopLeftRadius: index == 0 ? 10 : 0, borderTopRightRadius: index == 11 ? 10 : 0 }}>{month}</TableHeader>
                                                    <TableBody containerStyle={{}}>
                                                        <TableRow containerStyle={{ height: 50 }}>
                                                            <TableCol textStyle={{ fontFamily: 'Roboto-Bold', color: '#333333' }}>Year</TableCol>
                                                            <TableCol textStyle={{ fontFamily: 'Roboto-Bold', color: '#333333' }}>Days</TableCol>
                                                        </TableRow>
                                                        {
                                                            Object.keys(statsInfo[month]).map((year) => {
                                                                return (
                                                                    <TableRow containerStyle={{ height: 50 }} key={month + '_' + year}>
                                                                        <TableCol>{year}</TableCol>
                                                                        <TableCol value={true}>{statsInfo[month][year]}</TableCol>
                                                                    </TableRow>
                                                                )
                                                            })
                                                        }
                                                        {
                                                            [1, 2, 3, 4, 5].map((item) => {
                                                                if (item < (6 - Object.keys(statsInfo[month]).length)) {
                                                                    return (
                                                                        <TableRow key={item} containerStyle={{ height: 50 }}>
                                                                            <TableCol></TableCol>
                                                                            <TableCol value={true}></TableCol>
                                                                        </TableRow>
                                                                    )
                                                                }
                                                            })
                                                        }
                                                    </TableBody>
                                                </View>
                                            )
                                        })
                                    }
                                </ScrollView>

                                <TableBody>
                                    <TableRow>
                                        <TableCol>Total number of days served on this vessel:</TableCol>
                                        <TableCol value={true}>{period && getTotalDays(period.start, period.end)} days</TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol>Average hours underway (per day):</TableCol>
                                        <TableCol value={true}>{serviceTotals?.av_hours_underway_per_day + " hrs"}</TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol>Average distance offshore:</TableCol>
                                        <TableCol value={true}>{serviceTotals?.av_distance_offshore}</TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol>Number of days served on Great Lakes:</TableCol>
                                        <TableCol value={true}>{serviceTotals?.lakes}</TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol>Number of days served on waters shoreward of the boundary line as defined in 46 CFR Part 7:</TableCol>
                                        <TableCol value={true}>{serviceTotals?.shoreward}</TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol>Number of days served on waters seaward of the boundary line as defined in 46 CFR Part 7:</TableCol>
                                        <TableCol value={true}>{serviceTotals?.seaward}</TableCol>
                                    </TableRow>
                                </TableBody>
                            </View>

                            <TableHeader containerStyle={{ borderWidth: 0, paddingLeft: 0, marginTop: 20 }}>
                                Section III: Signature and Verification
                            </TableHeader>
                            <Text style={{ ...styles.formDescription }}>
                                I certify that I have served on the above vessel as stated. I am making this statement in order that I, the applicant, may obtain a
                                credential to operate a vessel under the provisions of Title 46 CFR, as applicable. I understand that if I make any false or fraudulent
                                statements in this certification of service, I may be subject to a fine or imprisonment of up to five (5) years or both (18 U.S.C. 1001).
                            </Text>
                            <View style={styles.formField}>
                                <Text style={styles.formLabel}>Date (MM/DD/YYYY)</Text>
                                <TextInput
                                    placeholder=""
                                    numberOfLines={1}
                                    keyboardType='numbers-and-punctuation'
                                    style={{
                                        ...styles.tableColTextValue,
                                        backgroundColor: '#fff',
                                        padding: 16,
                                        borderWidth: .5,
                                        borderColor: date ? Colors.colorGrey3 : 'rgba(194,17,17,0.68)',
                                        borderRadius: 7
                                    }}
                                    value={readOnly ? moment(parseInt(date)).utc().format('MM/DD/YYYY') : date}
                                    editable={!readOnly}
                                    onChangeText={(text) => setDate(text)}
                                    onFocus={() => setOpenKeyboard(true)}
                                    onBlur={() => setOpenKeyboard(false)}
                                />
                            </View>
                            <View style={styles.formField}>
                                <Text style={styles.formLabel}>Signature of applicant</Text>
                                <View style={{ backgroundColor: '#ffffff', borderWidth: 1, borderColor: signature ? Colors.colorGrey3 : 'rgba(194,17,17,0.68)', borderStyle: 'dashed', borderRadius: 7, height: 140, width: '100%' }}>
                                    {
                                        signature ? (
                                            <Image source={{ uri: signature }} style={{ width: '100%', height: 140, resizeMode: 'contain' }} />
                                        ) : (
                                            <SignatureView
                                                ref={ref}
                                                onOK={(signature) => handleOK(signature)}
                                                onEmpty={() => handleSignEmpty()}
                                                onBegin={() => setScrollEnabled(false)}
                                                onEnd={() => setScrollEnabled(true)}
                                                style={{ width: '100%', height: 50 }}
                                                penColor={'blue'}
                                                webStyle={
                                                    `.m-signature-pad--footer {display: none; margin: 0px;} body,html{height: 140px;}
                                            .m-signature-pad {box-shadow: none;border: none;}
                                            .m-signature-pad--body {border:none;}`
                                                }
                                            />
                                        )
                                    }
                                </View>
                                {
                                    !readOnly && (
                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                            <CustomButton
                                                title={'Clear'}
                                                containerStyle={{ backgroundColor: '#ffffff', height: 50, width: '50%', borderWidth: 0 }}
                                                textStyle={{ color: Colors.colorGrey2 }}
                                                onPress={() => handleSignEmpty()}
                                            />
                                            <CustomButton
                                                title={'Save'}
                                                containerStyle={{ backgroundColor: '#ffffff', height: 50, width: '50%', borderWidth: 0 }}
                                                textStyle={{ color: signature ? '#7FC54233' : '#7FC542ee' }}
                                                onPress={() => {
                                                    setScrollEnabled(true);
                                                    handleSignEnd();
                                                }}
                                                disable={signature}
                                            />
                                        </View>
                                    )
                                }
                            </View>
                        </View>
                        <View style={[styles.reviewForm2,]}>
                            <>
                                <View style={styles.formHeader}>
                                    <Text style={styles.formTitle}>NOTE:</Text>
                                </View>
                                <View style={styles.formField}>
                                    <Text style={{ ...styles.formDescription }}>The Owner, Operator or Master must complete the remainder of this form..</Text>
                                </View>
                                <View style={styles.formField}>
                                    <Text style={{ ...styles.formDescription }}>If you are the owner of the vessel, proof of ownership must be provided</Text>
                                </View>
                                <View style={styles.formField}>
                                    <Text style={{ ...styles.formDescription }}>Owner, Operator or Master Read Before Signing!</Text>
                                    <Text style={{ ...styles.formLabel, paddingTop: 0, fontFamily: 'Roboto-Regular' }}>
                                        I certify that the above individual has served on above vessel as stated. I am making this statement in order that the applicant may obtain a
                                        credential to operate a vessel under the provisions of Title 46 CFR, as applicable. I understand that if I make any false or fraudulent
                                        statements in this certification of service, I may be subject to a fine or imprisonment of up to five (5) years or both (18 U.S.C. 1001).
                                    </Text>
                                </View>
                                <View style={styles.formField}>
                                    <Text style={styles.formLabel}>Signature and Title of Person Attesting to Experience</Text>
                                    <View style={{ backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7, height: 100, width: '100%' }}>
                                        {
                                            uscg?.signature && (
                                                <Image source={{ uri: appConstants.MAINURL + uscg.signature }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                                            )
                                        }
                                    </View>
                                </View>
                                <View style={styles.formField}>
                                    <Text style={styles.formLabel}>Date (MM/DD/YYYY)</Text>
                                    <TextInput value={uscg?.reviewDate} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                </View>
                                <View style={styles.formField}>
                                    <Text style={{ ...styles.formDescription }}>Owner's, Operator's, or Master's Contact details</Text>
                                </View>
                                <View style={styles.formField}>
                                    <Text style={styles.formLabel}>First Name</Text>
                                    <TextInput value={uscg?.firstName} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                </View>
                                <View style={styles.formField}>
                                    <Text style={styles.formLabel}>Last Name</Text>
                                    <TextInput value={uscg?.lastName} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                </View>
                                <View style={styles.formField}>
                                    <Text style={styles.formLabel}>Email address</Text>
                                    <TextInput value={uscg?.email} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                </View>
                                <View style={styles.formField}>
                                    <Text style={styles.formLabel}>Street address</Text>
                                    <TextInput value={uscg?.address} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                </View>
                                <View style={styles.formField}>
                                    <Text style={styles.formLabel}>City</Text>
                                    <TextInput value={uscg?.city} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                </View>
                                <View style={styles.formField}>
                                    <Text style={styles.formLabel}>State</Text>
                                    <TextInput value={uscg?.state} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                </View>
                                <View style={styles.formField}>
                                    <Text style={styles.formLabel}>Zip code)</Text>
                                    <TextInput value={uscg?.zip} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                </View>
                                <View style={styles.formField}>
                                    <Text style={styles.formLabel}>Phone number</Text>
                                    <TextInput value={uscg?.phoneNumber} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                </View>

                                <View style={styles.formHeader}>
                                    <Text style={styles.formTitle}>Privacy Act Statement</Text>
                                </View>
                                <View style={styles.formField}>
                                    <Text style={styles.formDescription}>
                                        <Text style={{ fontFamily: 'SourceSansPro-Bold' }}>Authority:</Text> 5 U.S.C. 301; 14 U.S.C. 632; 46 U.S.C. 2103, 7101, 7302, 7305, 7313, 7314, 7316, 7317, 7319, 7502, 7701, 8701, 8703, 9102; 46 C.F.R.12.02; 49 C.F.R. 1.45, 1.46
                                    </Text>
                                </View>
                                <View style={styles.formField}>
                                    <Text style={styles.formDescription}>
                                        <Text style={{ fontFamily: 'SourceSansPro-Bold' }}>Purpose:</Text> The principal purpose for which this information will be used is to determine domestic and international qualifications
                                        for the issuance of merchant mariner credentials. This includs establishing eligibility of a merchant mariner’s credential,
                                        dupllicate credentials, or additional endorsements issued by the Coast Guard and establishing and maintaining continuous records
                                        of the person’s documentation transactions.
                                    </Text>
                                </View>
                                <View style={styles.formField}>
                                    <Text style={styles.formDescription}>
                                        <Text style={{ fontFamily: 'SourceSansPro-Bold' }}>Routine Uses:</Text>  The information will be used by authorized Coast Guard personnel with a need to know the information to determine
                                        whether an applicant is a safe and suitable person who is capable of performing the duties of the Merchant Mariner.
                                        The information will not be shared outside of DHS except in accordance with the provisions of DHS/USCG-030 Merchant Seamens’s
                                        Records System of Records, 74 FR 30308 (June 25, 2009)
                                    </Text>
                                </View>
                                <View style={styles.formField}>
                                    <Text style={styles.formDescription}>
                                        <Text style={{ fontFamily: 'SourceSansPro-Bold' }}>Disclosures:</Text> Furnishing this information (including your SSN) is voluntary; however, failure to furnish the requested information may result in non-issuance of the requested credential
                                    </Text>
                                </View>
                            </>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                {
                    !readOnly && (
                        <View style={{ position: 'absolute', backgroundColor: '#ffffff', bottom: 0, width: '100%', height: 100, padding: 20, flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                            <CustomButton
                                title={'Review completed'}
                                containerStyle={{ backgroundColor: '#ffffff', height: 50, width: '80%', borderColor: enableNext() ? '#7FC542' : Colors.colorGrey5 }}
                                textStyle={{ color: enableNext() ? '#7FC542ee' : Colors.colorGrey5 }}
                                onPress={() => handleNext()}
                            />
                        </View>
                    )
                }
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
    stickyHeaderText: {
        color: '#ffffff',
        textTransform: 'uppercase',
        fontFamily: 'SourceSansPro-Bold',
        fontWeight: '400',
        fontSize: width / 19,
        lineHeight: 23,
        letterSpacing: -0.408
    },
    tableHeaderContainer: {
        justifyContent: 'flex-start',
        padding: 16,
        borderWidth: 1,
        borderColor: '#c4c4c4',
        borderBottomWidth: 0
    },
    tableHeaderText: {
        color: '#333333',
        fontFamily: 'Roboto-Bold',
        fontWeight: '700',
        fontSize: width /21,
        lineHeight: 23.44,
        letterSpacing: -0.3
    },
    tableBody: {
        borderTopWidth: 1,
        borderTopColor: '#c4c4c4',
        borderLeftWidth: 1,
        borderLeftColor: '#c4c4c4'
    },
    tableRow: {
        flex: 1,
        flexDirection: 'row',
        width: '100%'
    },
    tableCol: {
        padding: 10,
        justifyContent: 'flex-start',
        borderRightWidth: 1,
        borderRightColor: '#c4c4c4',
        borderBottomWidth: 1,
        borderBottomColor: '#c4c4c4',
        width: '50%'
    },
    tableColTextKey: {
        color: '#a0a0a0',
        fontFamily: 'Roboto-Thin',
        fontWeight: '300',
        fontSize: width / 23,
        lineHeight: 23.44,
        letterSpacing: -0.3
    },
    tableColTextValue: {
        color: '#333333',
        fontFamily: 'Roboto-Thin',
        fontWeight: '400',
        fontSize: width / 23,
        lineHeight: 23.44,
        letterSpacing: -0.3
    },
    placeholderStyle: {
        color: '#c21717',
        fontFamily: 'Roboto-Bold',
        fontWeight: '700',
        fontSize: width / 23,
        lineHeight: 23.44,
        letterSpacing: -0.3
    },
    reviewForm2: {
        backgroundColor: '#ebebeb',
        padding: 20
    },
    formHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    formTitle: {
        color: '#767676',
        fontFamily: 'SourceSansPro-SemiBold',
        fontWeight: '700',
        fontSize: width / 17,
        lineHeight: 28,
        letterSpacing: -0.41,
        marginTop: 20
    },
    formSutTitle: {
        color: '#767676',
        fontFamily: 'SourceSansPro-SemiBold',
        fontWeight: '700',
        fontSize: width/27,
        lineHeight: 23.44,
        letterSpacing: -0.41
    },
    formDescription: {
        color: '#767676',
        fontFamily: 'SourceSansPro-SemiBold',
        fontWeight: '700',
        fontSize: width / 26,
        lineHeight: 23.44,
        letterSpacing: -0.41
    },
    formField: {
        paddingVertical: 3,
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    formLabel: {
        color: '#767676',
        fontFamily: 'Roboto-Regular',
        fontWeight: '700',
        fontSize: width / 26,
        lineHeight: 18.75,
        letterSpacing: -0.3,
        paddingBottom: 4,
        paddingTop: 16
    },
    formInput: {

    }
});

const mapStateToProps = (state) => {
    return {
        user: state.APP.USER,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(SecurityActions(), dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SmallVesselFormUSCG);