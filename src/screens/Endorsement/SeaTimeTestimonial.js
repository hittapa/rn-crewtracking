import React, { useEffect, useState } from "react";
import { bindActionCreators } from "redux";
import SecurityActions from "../../actions/SecurityActions";
import { connect } from "react-redux";
import { SafeAreaView, View, KeyboardAvoidingView, ScrollView, StyleSheet, Text, Image, TouchableOpacity, FlatList, TextInput, Platform, Linking } from 'react-native';
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
import { getTotalDays } from "../../utils/dateTimeHelper";
import appConstants from "../../constants/app";

function SeaTimeTestimonial(props) {

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
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [watchkeeping, setWatchkeeping] = useState(0);
    const [guestsDays, setGuestsDays] = useState(null);
    const [duties, setDuties] = useState(null);
    const [startLoc, setStartLoc] = useState('');
    const [endLoc, setEndLoc] = useState('');
    const [readOnly, setReadOnly] = useState(false);
    const [testimonial, setTestimonial] = useState(null);
    const [capacity, setCapacity] = useState(null);
    const [serviceTotals, setServiceTotals] = useState(null);

    useEffect(() => {
        if (!mounted) {
            if (props.user) setUser(props.user);
            if (props.route.params.vessel) {
                let _ves = props.route.params.vessel;
                setVessel(_ves);
                let wk = 0;
                for (let i = 0; i < _ves?.onboardServices.length; i++) {
                    const ele = _ves.onboardServices[i];
                    if (ele.started_at > period?.start && ele.ended_at < period?.end && ele.type == 'trip') {
                        wk += ele.trip?.watchkeeping;
                    }
                }
                setWatchkeeping(wk);
            };
            if (props.route.params.period) setPeriod(props.route.params.period);
            if (props.route.params.departments) typeof props.route.params.departments == 'string' ? setDepartments(JSON.parse(props.route.params.departments)) : setDepartments(props.route.params.departments);
            if (props.route.params.forms) setForms(props.route.params.forms);
            if (props.route.params.roles) typeof props.route.params.roles == 'string' ? setRoles(JSON.parse(props.route.params.roles)) : setRoles(props.route.params.roles);
            if (props.route.params.type) setType(props.route.params.type);
            if (props.route.params.dischargeBook) setDischargeBook(props.route.params.dischargeBook);
            if (props.route.params.additionalInfo) setAdditionalInfo(props.route.params.additionalInfo);
            if (props.route.params.watchkeeping) setWatchkeeping(props.route.params.watchkeeping);
            if (props.route.params.guestsDays) setGuestsDays(props.route.params.guestsDays);
            if (props.route.params.duties) setDuties(props.route.params.duties);
            if (props.route.params.startLoc) setStartLoc(props.route.params.startLoc);
            if (props.route.params.endLoc) setEndLoc(props.route.params.endLoc);
            if (props.route.params.testimonial) setTestimonial(props.route.params.testimonial);
            if (props.route.params.capacity) setCapacity(props.route.params.capacity);
            if (props.route.params.readOnly) setReadOnly(true); else setReadOnly(false);
            if (props.route.params.serviceTotals) typeof props.route.params.serviceTotals == 'string' ? setServiceTotals(JSON.parse(props.route.params.serviceTotals)) : setServiceTotals(props.route.params.serviceTotals);
            setMounted(true);
        }
    }, [props]);

    const leavePeriods = () => {
        let res = '';
        for (let i = 0; i < vessel?.onboardServices.length; i++) {
            const ele = vessel?.onboardServices[i];
            if (ele.started_at > period.start && ele.ended_at < period.end && ele.type == 'onleave') {
                res += moment(parseInt(ele.started_at)).format('DD MMM YYYY') + ' - ' + moment(parseInt(ele.ended_at)).format('DD MMM YYYY') + "\n";
            }
        }

        if (res == '') return 'None';
        return res.trim();
    }

    const totalLeaveDays = () => {
        let days = 0;
        for (let i = 0; i < vessel?.onboardServices.length; i++) {
            const ele = vessel?.onboardServices[i];
            if (ele.started_at > period.start && ele.ended_at < period.end && ele.type == 'onleave') {
                days += getTotalDays(ele.started_at, ele.ended_at);
            }
        }
        return days;
    }

    const title = () => {
        if (type == 'yachting') {
            if (departments?.length == 1) {
                if (departments[0] == 'Deck department') return "Master and deck officers";
                if (departments[0] == 'Engineering department') return "Engineering officers";
                if (departments[0] == 'Interior department') return "Interior yacht crew";
            }
            if (departments?.length == 2) {
                if (departments.includes('Deck department') && departments.includes('Engineering department')) return "Dual deck and engineering";
                if (departments.includes('Deck department') && departments.includes('Interior department')) return "Dual deck and interior";
            }
        }
        if (type == 'merchant') {
            if (departments?.length == 1 && roles?.length == 1) {
                if (departments[0] == 'Deck department' && roles[0] == 'Officer') return 'Merchant deck officers';
                if (departments[0] == 'Deck department' && roles[0] == 'Cadet/rating/junior') return 'Merchant deck cadet';
                if (departments[0] == 'Engineering department' && roles[0] == 'Officer') return 'Merchant engineering officers';
                if (departments[0] == 'Engineering department' && roles[0] == 'Cadet/rating/junior') return 'Merchant engineering cadet';
            }
        }
        return '';
    }

    let formType = '';

    if (type == 'yachting') {
        if (departments?.length == 1) {
            if (departments[0] == 'Deck department') formType = 'YACHT_DECK';
            if (departments[0] == 'Engineering department') formType = 'YACHT_ENG';
            if (departments[0] == 'Interior department') formType = 'YACHT_INT';
        }
        if (departments?.length == 2) {
            if (departments.includes('Deck department') && departments.includes('Engineering department')) formType = 'YACHT_DECK_ENG';
            if (departments.includes('Deck department') && departments.includes('Interior department')) formType = 'YACHT_DECK_INT';
        }
    }
    if (type == 'merchant') {
        if (departments?.length == 1 && roles?.length == 1) {
            if (departments[0] == 'Deck department' && roles[0] == 'Officer') formType = 'MERCHANT_DECK_OFFICER';
            if (departments[0] == 'Deck department' && roles[0] == 'Cadet/rating/junior') formType = 'MERCHANT_DECK_CADET';
            if (departments[0] == 'Engineering department' && roles[0] == 'Officer') formType = 'MERCHANT_ENG_OFFICER';
            if (departments[0] == 'Engineering department' && roles[0] == 'Cadet/rating/junior') formType = 'MERCHANT_ENG_CADET';
        }
    }

    const enableNext = () => {
        let enable = true;
        if (vessel?.imoNumber == null) return false;
        switch (formType) {
            case 'YACHT_DECK':
                break;
            case 'YACHT_ENG':
                if (vessel && (!vessel.mainEngine)) {
                    enable = false;
                }
                break;
            case 'YACHT_INT':
                if (vessel && (!vessel.crewNumber || !vessel.guestsNumber || !vessel.cabinsNumber)) {
                    enable = false;
                }
                if (!guestsDays) enable = false;
                break;
            case 'YACHT_DECK_ENG':
                if (vessel && (!vessel.mainEngine)) {
                    enable = false;
                }
                if (!duties) enable = false;
                break;
            case 'YACHT_DECK_INT':
                if (!duties) enable = false;
                break;
            case 'MERCHANT_DECK_OFFICER':
                break;
            case 'MERCHANT_DECK_CADET':
                break;
            case 'MERCHANT_ENG_OFFICER':
                if (vessel && (!vessel.propellingMachinary || !vessel.boiler || !vessel.power || !vessel.shaftPower)) {
                    enable = false;
                }
                break;
            case 'MERCHANT_ENG_CADET':
                if (vessel && (!vessel.propellingMachinary || !vessel.boiler || !vessel.power || !vessel.shaftPower)) {
                    enable = false;
                }
                break;

            default:
                break;
        }
        return enable;
    }

    const handleNext = () => {
        if (enableNext()) {
            const data = {
                ...props.route.params,
                vessel: vessel,
                user: user,
                testimonial: true,
                dischargeBook,
                additionalInfo,
                watchkeeping,
                guestsDays,
                duties
            }
            props.navigation.navigate('EndorseStep3', data)
        }
    }

    const handleClose = () => {
        if (readOnly) props.navigation.goBack();
        else {
            const data = {
                ...props.route.params,
                vessel: vessel,
                user: user,
                dischargeBook,
                additionalInfo,
                watchkeeping,
                guestsDays,
                duties
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
                <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'height' : 'position'}>
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
                            if (readOnly && testimonial?.printform) openURL(testimonial?.printform);
                            // if(readOnly && testimonial?.printform) props.navigation.navigate("ViewPrintform", {uri: testimonial.printform})
                        }}>
                            {
                                readOnly && testimonial?.printform ? (
                                    <TouchableOpacity style={{ width: 100, marginRight: 20, alignItems: 'flex-end' }}>
                                        <Text style={{ textAlign: 'right', fontSize: width / 27, color: '#007aff' }}>Print form</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <View style={{ width: 55, marginRight: 20 }}>
                                    </View>
                                )
                            }
                        </HeaderRight>
                    </View>
                    <View style={{ backgroundColor: 'transparent', width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <View style={{ width: '100%', backgroundColor: '#5dafd1', justifyContent: 'center', alignItems: 'center', paddingVertical: 15 }}>
                            <Text style={styles.stickyHeaderText}>{`Sea service testimonial for`}</Text>
                            <Text style={styles.stickyHeaderText}>{title()}</Text>
                        </View>
                    </View>
                    <ScrollView style={[{ backgroundColor: '#e5e5e5', marginBottom: readOnly ? 100 : openKeyboard ? 100 : 190 }]} nestedScrollEnabled>
                        {
                            !readOnly && (
                                <View style={{ width: '100%', backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', paddingTop: 10 }}>
                                    <Text style={{ fontFamily: 'Roboto-Regular', fontSize: width / 28, lineHeight: 16.41, letterSpacing: -0.3, color: '#c21717' }}>
                                        Complete any missing information
                                    </Text>
                                </View>
                            )
                        }
                        <View style={{ width: '100%', backgroundColor: '#fff', padding: 16, }}>
                            <View style={{ width: '100%', marginVertical: 10 }}>
                                <TableHeader containerStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                                    This is to certify that:
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
                                    {
                                        type == 'yachting' && (
                                            <TableRow>
                                                <TableCol>Email</TableCol>
                                                <TableCol value={true} textStyle={{ fontSize: width / 26 }}>{user?.username}</TableCol>
                                            </TableRow>
                                        )
                                    }
                                    <TableRow>
                                        <TableCol>Date of Birth</TableCol>
                                        <TableCol value={true}>{user?.birthDate && moment(user.birthDate).utc().format('DD-MMM YYYY')}</TableCol>
                                    </TableRow>
                                    {
                                        (formType != 'YACHT_INT') && (
                                            <TableRow>
                                                <TableCol>Discharge Book #</TableCol>
                                                <TableCol value={true} edit={true}>
                                                    <TextInput
                                                        editable={!readOnly}
                                                        placeholder={!readOnly ? "Enter if applicable" : '--'}
                                                        placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                        style={styles.tableColTextValue}
                                                        onFocus={() => setOpenKeyboard(true)}
                                                        onBlur={() => setOpenKeyboard(false)}
                                                        keyboardType={'numeric'}
                                                        value={dischargeBook}
                                                        onChangeText={(text) => {
                                                            setDischargeBook(text);
                                                        }}
                                                    />
                                                </TableCol>
                                            </TableRow>
                                        )
                                    }
                                    <TableRow>
                                        <TableCol>Capacity served</TableCol>
                                        <TableCol value={true}>{roles?.join('/')}</TableCol>
                                    </TableRow>
                                </TableBody>
                            </View>
                            <View style={{ width: '100%', marginVertical: 10 }}>
                                <TableHeader>Has served onboard:</TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCol>Name of vessel</TableCol>
                                        <TableCol value={true}>{vessel?.name}</TableCol>
                                    </TableRow>
                                    {
                                        type == 'yachting' && (
                                            <TableRow>
                                                <TableCol>Flag</TableCol>
                                                <TableCol value={true}>{vessel?.flag}</TableCol>
                                            </TableRow>
                                        )
                                    }
                                    <TableRow>
                                        <TableCol>IMO number</TableCol>
                                        <TableCol value={true} edit={true}>
                                            <TextInput
                                                editable={!readOnly}
                                                placeholder={!readOnly ? "Enter number" : '--'}
                                                keyboardType={'numeric'}
                                                maxLength={7}
                                                value={vessel?.imoNumber.toString()}
                                                onChangeText={(text) => {
                                                    let _ves = { ...vessel };
                                                    _ves.imoNumber = text;
                                                    setVessel(_ves);
                                                }}
                                                style={vessel?.imoNumber ? styles.tableColTextValue : styles.placeholderStyle}
                                                placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                onFocus={() => setOpenKeyboard(true)}
                                                onBlur={() => setOpenKeyboard(false)}
                                            />
                                        </TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol>Type of vessel</TableCol>
                                        <TableCol value={true}>{vessel?.detailedType}</TableCol>
                                    </TableRow>
                                    {
                                        type == 'yachting' && (
                                            <TableRow>
                                                <TableCol>Length in {vessel?.ol_unit == 'm' ? 'metres' : 'Ft'}</TableCol>
                                                <TableCol value={true}>{vessel?.length}</TableCol>
                                            </TableRow>
                                        )
                                    }
                                    <TableRow>
                                        <TableCol>{type == 'yachting' ? 'Gross tonnage' : 'Vessel GT'}</TableCol>
                                        <TableCol value={true}>{vessel?.grossTonnage}</TableCol>
                                    </TableRow>
                                    {
                                        (formType == 'MERCHANT_ENG_OFFICER' || formType == 'MERCHANT_ENG_CADET') && (
                                            <TableRow>
                                                <TableCol textStyle={{ fontSize: width / 26 }}>Type/make of main propelling machinery</TableCol>
                                                <TableCol value={true} edit={true}>
                                                    <TextInput
                                                        editable={!readOnly}
                                                        keyboardType={'default'}
                                                        placeholder={!readOnly ? "Enter type" : '--'}
                                                        placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                        style={vessel?.propellingMachinary ? styles.tableColTextValue : styles.placeholderStyle}
                                                        onFocus={() => setOpenKeyboard(true)}
                                                        onBlur={() => setOpenKeyboard(false)}
                                                        value={vessel?.propellingMachinary}
                                                        onChangeText={(text) => {
                                                            let _ves = { ...vessel };
                                                            _ves.propellingMachinary = text;
                                                            setVessel(_ves);
                                                        }}
                                                    />
                                                </TableCol>
                                            </TableRow>
                                        )
                                    }
                                    {
                                        (formType == 'MERCHANT_ENG_OFFICER' || formType == 'MERCHANT_ENG_CADET') && (
                                            <TableRow>
                                                <TableCol textStyle={{ fontSize: width / 26 }}>Type of auxiliary machinery</TableCol>
                                                <TableCol value={true} edit={true}>
                                                    <TextInput
                                                        editable={!readOnly}
                                                        keyboardType={'default'}
                                                        placeholder={!readOnly ? "Enter type (if applies)" : '--'}
                                                        placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                        style={styles.tableColTextValue}
                                                        onFocus={() => setOpenKeyboard(true)}
                                                        onBlur={() => setOpenKeyboard(false)}
                                                        value={vessel?.auxiliaryMachinary}
                                                        onChangeText={(text) => {
                                                            let _ves = { ...vessel };
                                                            _ves.auxiliaryMachinary = text;
                                                            setVessel(_ves);
                                                        }}
                                                    />
                                                </TableCol>
                                            </TableRow>
                                        )
                                    }
                                    {
                                        (formType == 'MERCHANT_ENG_OFFICER' || formType == 'MERCHANT_ENG_CADET') && (
                                            <TableRow>
                                                <TableCol>Type of boilers</TableCol>
                                                <TableCol value={true} edit={true}>
                                                    <TextInput
                                                        editable={!readOnly}
                                                        keyboardType={'default'}
                                                        placeholder={!readOnly ? "Enter type" : '--'}
                                                        value={vessel?.boiler}
                                                        placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                        style={vessel?.boiler ? styles.tableColTextValue : styles.placeholderStyle}
                                                        onFocus={() => setOpenKeyboard(true)}
                                                        onBlur={() => setOpenKeyboard(false)}
                                                        onChangeText={(text) => {
                                                            let _ves = { ...vessel };
                                                            _ves.boiler = text;
                                                            setVessel(_ves);
                                                        }}
                                                    />
                                                </TableCol>
                                            </TableRow>
                                        )
                                    }
                                    {
                                        (formType == 'MERCHANT_ENG_OFFICER' || formType == 'MERCHANT_ENG_CADET') && (
                                            <TableRow>
                                                <TableCol>Power kW</TableCol>
                                                <TableCol value={true} edit={true}>
                                                    <TextInput
                                                        editable={!readOnly}
                                                        keyboardType={'numeric'}
                                                        placeholder={!readOnly ? "Enter power kW" : '--'}
                                                        value={vessel?.power}
                                                        placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                        style={vessel?.power ? styles.tableColTextValue : styles.placeholderStyle}
                                                        onFocus={() => setOpenKeyboard(true)}
                                                        onBlur={() => setOpenKeyboard(false)}
                                                        onChangeText={(text) => {
                                                            let _ves = { ...vessel };
                                                            _ves.power = text;
                                                            setVessel(_ves);
                                                        }}
                                                    />
                                                </TableCol>
                                            </TableRow>
                                        )
                                    }
                                    {
                                        (formType == 'MERCHANT_ENG_OFFICER' || formType == 'MERCHANT_ENG_CADET') && (
                                            <TableRow>
                                                <TableCol>Shaft power kW</TableCol>
                                                <TableCol value={true} edit={true}>
                                                    <TextInput
                                                        editable={!readOnly}
                                                        keyboardType={'numeric'}
                                                        placeholder={!readOnly ? "Enter shaft power kW" : '--'}
                                                        value={vessel?.shaftPower}
                                                        placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                        style={vessel?.shaftPower ? styles.tableColTextValue : styles.placeholderStyle}
                                                        onFocus={() => setOpenKeyboard(true)}
                                                        onBlur={() => setOpenKeyboard(false)}
                                                        onChangeText={(text) => {
                                                            let _ves = { ...vessel };
                                                            _ves.shaftPower = text;
                                                            setVessel(_ves);
                                                        }}
                                                    />
                                                </TableCol>
                                            </TableRow>
                                        )
                                    }
                                    {
                                        (formType == 'YACHT_ENG' || formType == 'YACHT_DECK_ENG') && (
                                            <TableRow>
                                                <TableCol textStyle={{ fontSize: width / 26 }}>Main engine kW</TableCol>
                                                <TableCol value={true} edit={true}>
                                                    <TextInput
                                                        editable={!readOnly}
                                                        keyboardType={'numeric'}
                                                        placeholder={!readOnly ? "Enter power" : '--'}
                                                        value={vessel?.mainEngine || ''}
                                                        placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                        style={vessel?.mainEngine ? styles.tableColTextValue : styles.placeholderStyle}
                                                        onFocus={() => setOpenKeyboard(true)}
                                                        onBlur={() => setOpenKeyboard(false)}
                                                        onChangeText={(text) => {
                                                            let _ves = { ...vessel };
                                                            _ves.mainEngine = text;
                                                            setVessel(_ves);
                                                        }}
                                                    />
                                                </TableCol>
                                            </TableRow>
                                        )
                                    }
                                    {
                                        formType == 'YACHT_INT' && (
                                            <>
                                                <TableRow>
                                                    <TableCol>No. of crew</TableCol>
                                                    <TableCol value={true} edit={true}>
                                                        <TextInput
                                                            editable={!readOnly}
                                                            placeholder={!readOnly ? "Enter number" : '--'}
                                                            keyboardType={'numeric'}
                                                            value={vessel?.crewNumber || ''}
                                                            placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                            style={vessel?.crewNumber ? styles.tableColTextValue : styles.placeholderStyle}
                                                            onFocus={() => setOpenKeyboard(true)}
                                                            onBlur={() => setOpenKeyboard(false)}
                                                            onChangeText={(text) => {
                                                                let _ves = { ...vessel };
                                                                _ves.crewNumber = text;
                                                                setVessel(_ves);
                                                            }}
                                                        />
                                                    </TableCol>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCol>No. of guests</TableCol>
                                                    <TableCol value={true} edit={true}>
                                                        <TextInput
                                                            editable={!readOnly}
                                                            placeholder={!readOnly ? "Enter number" : '--'}
                                                            keyboardType={'numeric'}
                                                            value={vessel?.guestsNumber || ''}
                                                            placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                            style={vessel?.guestsNumber ? styles.tableColTextValue : styles.placeholderStyle}
                                                            onFocus={() => setOpenKeyboard(true)}
                                                            onBlur={() => setOpenKeyboard(false)}
                                                            onChangeText={(text) => {
                                                                let _ves = { ...vessel };
                                                                _ves.guestsNumber = text;
                                                                setVessel(_ves);
                                                            }}
                                                        />
                                                    </TableCol>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCol>No. of cabins</TableCol>
                                                    <TableCol value={true} edit={true}>
                                                        <TextInput
                                                            editable={!readOnly}
                                                            placeholder={!readOnly ? "Enter number" : '--'}
                                                            keyboardType={'numeric'}
                                                            value={vessel?.cabinsNumber || ''}
                                                            placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                            style={vessel?.cabinsNumber ? styles.tableColTextValue : styles.placeholderStyle}
                                                            onFocus={() => setOpenKeyboard(true)}
                                                            onBlur={() => setOpenKeyboard(false)}
                                                            onChangeText={(text) => {
                                                                let _ves = { ...vessel };
                                                                _ves.cabinsNumber = text;
                                                                setVessel(_ves);
                                                            }}
                                                        />
                                                    </TableCol>
                                                </TableRow>
                                            </>
                                        )
                                    }
                                    <TableRow>
                                        <TableCol textStyle={{ color: Colors.colorGrey1, fontWeight: '400' }}>Date of joining</TableCol>
                                        <TableCol value={true}>{period?.start && moment(period?.start).utc().format('DD-MMM YYYY')}</TableCol>
                                    </TableRow>
                                    {
                                        (formType == 'YACHT_ENG' || formType == 'YACHT_DECK_ENG' || formType == 'YACHT_DECK_INT') && (
                                            <TableRow>
                                                <TableCol textStyle={{ color: Colors.colorGrey1, fontWeight: '400' }}>Place of joining</TableCol>
                                                <TableCol value={true}>{startLoc}</TableCol>
                                            </TableRow>
                                        )
                                    }
                                    <TableRow>
                                        <TableCol textStyle={{ color: Colors.colorGrey1, fontWeight: '400' }}>Date of discharge</TableCol>
                                        <TableCol value={true}>{period?.end && moment(period?.end).utc().format('DD-MMM YYYY')}</TableCol>
                                    </TableRow>
                                    {
                                        (formType == 'YACHT_ENG' || formType == 'YACHT_DECK_ENG' || formType == 'YACHT_DECK_INT') && (
                                            <TableRow>
                                                <TableCol textStyle={{ color: Colors.colorGrey1, fontWeight: '400' }}>Place of discharge</TableCol>
                                                <TableCol value={true}>{endLoc}</TableCol>
                                            </TableRow>
                                        )
                                    }
                                    {
                                        type == 'yachting' && (
                                            <TableRow>
                                                <TableCol textStyle={{ color: Colors.colorGrey1, fontWeight: '400', fontSize: width / 26 }}>Total days onboard</TableCol>
                                                <TableCol value={true}>{period ? getTotalDays(period.start, period.end) : ''}</TableCol>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </View>
                            {
                                type == 'merchant' && (
                                    <View style={{ width: '100%', marginTop: 10 }}>
                                        <Text style={{ fontSize: width / 26, lineHeight: 18.75, letterSpacing: -0.3, fontFamily: 'Roboto-Regular', color: '#333333' }}>Please record, below, the actual watchkeeping {(formType == 'MERCHANT_ENG_OFFICER' || formType == 'MERCHANT_ENG_CADET') && 'UMS '}time undertaken:</Text>
                                        <View style={{ paddingHorizontal: 10, paddingVertical: 16 }}>
                                            <Text style={{ fontSize: width / 26, lineHeight: 18.75, letterSpacing: -0.3, fontFamily: 'Roboto-Thin', color: '#333333' }}>
                                                {formType == 'MERCHANT_ENG_OFFICER' && 'During this period the above-named Officer accrued the following engine room watchkeeping (under the supervision of a certificated engineer officer) for not less than 4 hours out of every 24 hours while the vessel was engaged on seagoing voyages:'}
                                                {formType == 'MERCHANT_ENG_CADET' && 'During this period the above-named trainee/rating accrued the following engine room watchkeeping (under the supervision of a certificated engineer officer) for not less than 4 hours out of every 24 hours while the vessel was engaged on seagoing voyages:'}
                                                {formType == 'MERCHANT_DECK_OFFICER' && 'During this period the above-named Officer accrued the following bridge watchkeeping duty (under the supervision of a certificated engineer officer) for not less than 4 hours out of every 24 hours while the vessel was engaged on seagoing voyages:'}
                                                {formType == 'MERCHANT_DECK_CADET' && 'During this period the above-named trainee/rating accrued the following bridge watchkeeping duty (under the supervision of a certificated engineer officer) for not less than 4 hours out of every 24 hours while the vessel was engaged on seagoing voyages:'}
                                            </Text>
                                            <Text style={{ ...styles.formLabel, color: '#000' }}>Total days watchkeeping</Text>
                                            <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', padding: Platform.OS == 'ios' ? 10 : 0, height: 52, borderWidth: .5, borderColor: '#f1f1f1', borderRadius: 7 }}>
                                                <TextInput
                                                    editable={!readOnly}
                                                    placeholder={!readOnly ? "Enter number" : '--'}
                                                    keyboardType={'numeric'}
                                                    placeholderTextColor={'#333333'}
                                                    style={{ ...styles.tableColTextValue, textAlign: 'center', width: '100%' }}
                                                    onFocus={() => setOpenKeyboard(true)}
                                                    onBlur={() => setOpenKeyboard(false)}
                                                    value={watchkeeping.toString()}
                                                    onChangeText={(t) => {
                                                        if (t == '') t = '0';
                                                        setWatchkeeping(parseInt(t));
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                )
                            }
                            {
                                type == 'yachting' && (
                                    <>
                                        <View style={{ width: '100%', marginVertical: 10 }}>
                                            <TableHeader>The above service includes:</TableHeader>
                                            <TableBody>
                                                {
                                                    (formType != 'YACHT_INT') && (
                                                        <TableRow>
                                                            <TableCol textStyle={{ fontSize: width / 26 }}>Actual days at sea</TableCol>
                                                            <TableCol value={true}>{period && getTotalDays(period.start, period.end)}</TableCol>
                                                        </TableRow>
                                                    )
                                                }
                                                {
                                                    (formType == 'YACHT_DECK_INT') && (
                                                        <TableRow>
                                                            <TableCol textStyle={{ fontSize: width / 26 }}>GUESTS ON BOARD Total days</TableCol>
                                                            <TableCol value={true}>{period && getTotalDays(period.start, period.end)}</TableCol>
                                                        </TableRow>
                                                    )
                                                }
                                                {
                                                    (formType == 'YACHT_DECK' || formType == 'YACHT_DECK_ENG' || formType == 'YACHT_DECK_INT') && (
                                                        <TableRow>
                                                            <TableCol textStyle={{ fontSize: width / 26 }}>Stand-by service</TableCol>
                                                            <TableCol value={true}>{serviceTotals?.standby}</TableCol>
                                                        </TableRow>
                                                    )
                                                }
                                                {
                                                    (formType !== 'YACHT_INT') && (
                                                        <TableRow>
                                                            <TableCol textStyle={{ fontSize: width / 26 }}>Shipyard service</TableCol>
                                                            <TableCol value={true}>{serviceTotals?.yard}</TableCol>
                                                        </TableRow>
                                                    )
                                                }
                                                {
                                                    (formType == 'YACHT_DECK' || formType == 'YACHT_ENG' || formType == 'YACHT_DECK_ENG') && (
                                                        <TableRow>
                                                            <TableCol textStyle={{ fontSize: width / 26 }}>
                                                                Watchkeeping service
                                                                {
                                                                    (formType == 'YACHT_ENG' || formType == 'YACHT_DECK_ENG') && <Text style={{ fontSize: width / 28, textTransform: 'uppercase', fontFamily: 'Roboto-Thin' }}>{'\nMaster application only'}</Text>
                                                                }
                                                            </TableCol>
                                                            <TableCol value={true}>{serviceTotals?.watchkeeping}</TableCol>
                                                        </TableRow>
                                                    )
                                                }
                                                {
                                                    (formType == 'YACHT_INT') && (
                                                        <TableRow>
                                                            <TableCol textStyle={{ fontSize: width / 26 }}>Total # days w/guests</TableCol>
                                                            <TableCol value={true} edit={true}>
                                                                <TextInput
                                                                    editable={!readOnly}
                                                                    placeholder={!readOnly ? "Enter number" : '--'}
                                                                    keyboardType={'numeric'}
                                                                    placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                                    style={guestsDays ? styles.tableColTextValue : styles.placeholderStyle}
                                                                    onFocus={() => setOpenKeyboard(true)}
                                                                    onBlur={() => setOpenKeyboard(false)}
                                                                    value={guestsDays}
                                                                    onChangeText={(t) => {
                                                                        setGuestsDays(t);
                                                                    }}
                                                                />
                                                            </TableCol>
                                                        </TableRow>
                                                    )
                                                }

                                                <TableRow>
                                                    <TableCol textStyle={{ fontSize: width / 26 }}>Leaves of absence</TableCol>
                                                    <TableCol value={true}>{leavePeriods()}</TableCol>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCol textStyle={{ fontSize: width / 26 }}>Total # days on leave</TableCol>
                                                    <TableCol value={true}>{serviceTotals?.leave}</TableCol>
                                                </TableRow>
                                                {
                                                    (formType == 'YACHT_DECK_ENG' || formType == 'YACHT_DECK_INT') && (
                                                        <TableRow>
                                                            <TableCol textStyle={{ fontSize: width / 26 }}>Duties and tasks</TableCol>
                                                            <TableCol value={true} edit={true}>
                                                                <TextInput
                                                                    editable={!readOnly}
                                                                    multiline
                                                                    placeholder={!readOnly ? "List tasks" : '--'}
                                                                    placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                                    style={duties ? styles.tableColTextValue : styles.placeholderStyle}
                                                                    onFocus={() => setOpenKeyboard(true)}
                                                                    onBlur={() => setOpenKeyboard(false)}
                                                                    value={duties}
                                                                    onChangeText={(t) => setDuties(t)}
                                                                />
                                                            </TableCol>
                                                        </TableRow>
                                                    )
                                                }
                                                {
                                                    formType != 'YACHT_INT' && (
                                                        <TableRow>
                                                            <TableCol>Areas cruised</TableCol>
                                                            <TableCol value={true}>East Coast USA Mediteranean West coast USA Australasia</TableCol>
                                                        </TableRow>
                                                    )
                                                }
                                            </TableBody>
                                        </View>
                                        <View style={{ width: '100%', marginVertical: 10 }}>
                                            <TableHeader>Additional information:</TableHeader>
                                            <TableBody>
                                                <TableRow containerStyle={{ padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.colorGrey4, borderRightWidth: 1, borderRightColor: Colors.colorGrey4 }}>
                                                    <TextInput
                                                        editable={!readOnly}
                                                        placeholder={!readOnly ? "Were you on rotation or need to verify nautical miles traveled? Enter that info here if necessary.." : '--'}
                                                        keyboardType={'default'}
                                                        placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                        style={styles.tableColTextValue}
                                                        multiline
                                                        value={additionalInfo}
                                                        onFocus={() => setOpenKeyboard(true)}
                                                        onBlur={() => setOpenKeyboard(false)}
                                                        onChangeText={(t) => {
                                                            setAdditionalInfo(t)
                                                        }}
                                                    />
                                                </TableRow>
                                            </TableBody>
                                        </View>
                                    </>
                                )
                            }
                        </View>
                        <View style={[styles.reviewForm2,]}>
                            {
                                !testimonial && (
                                    <>
                                        {
                                            (formType == 'YACHT_INT' || type == 'merchant') && (
                                                <>
                                                    <View style={styles.formHeader}>
                                                        <Text style={styles.formTitle}>Report and Endorsment</Text>
                                                        <Text style={styles.formSutTitle}>(To be filled out by Captain or Responsible Person)</Text>
                                                    </View>
                                                    {
                                                        type == 'merchant' && (
                                                            <>
                                                                <View style={{ ...styles.formField }}>
                                                                    <Text style={{ ...styles.formDescription, justifyContent: 'center' }}>In addition the above-named officer:</Text>
                                                                </View>
                                                                <View style={{ ...styles.formField, paddingVertical: 10 }}>
                                                                    <Text style={{ ...styles.formDescription, justifyContent: 'center' }}>
                                                                        <MaterialCommunityIcons name={'checkbox-blank-circle-outline'} size={16} color={Colors.colorGrey2} style={{ marginRight: 10 }} />
                                                                        {'  Regularly carried out other duties in connection with the routine and maintenance of the ship'}
                                                                    </Text>
                                                                </View>
                                                                <View style={{ ...styles.formField, paddingBottom: 10 }}>
                                                                    <Text style={{ ...styles.formDescription, justifyContent: 'center' }}>
                                                                        <MaterialCommunityIcons name={'checkbox-blank-circle-outline'} size={16} color={Colors.colorGrey2} style={{ marginRight: 10 }} />
                                                                        {'  Was granted leave of absence as follows:\n'}
                                                                        {period && (
                                                                            <Text style={{ color: Colors.colorGrey3 }}>
                                                                                {moment(period.start).utc().format('DD-MMM YYYY') + " to " + moment(period.end).utc().format('DD-MMM YYYY')}
                                                                            </Text>
                                                                        )}
                                                                    </Text>
                                                                </View>
                                                                <Text style={styles.formDescription}>My report on the service of the above named {type == 'merchant' ? 'trainee/rating' : 'crew member'}, during the period stated, is as follows:</Text>
                                                            </>
                                                        )
                                                    }
                                                    <View style={styles.formField}>
                                                        <Text style={styles.formLabel}>Conduct</Text>
                                                        <TextInput editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                                    </View>
                                                    <View style={styles.formField}>
                                                        <Text style={styles.formLabel}>Ability</Text>
                                                        <TextInput editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                                    </View>
                                                    {
                                                        type == 'merchant' && (
                                                            <>
                                                                <View style={styles.formField}>
                                                                    <Text style={styles.formLabel}>General comments</Text>
                                                                    <TextInput editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                                                </View>
                                                                <View style={styles.formField}>
                                                                    <Text style={styles.formLabel}>Type tanker</Text>
                                                                    <TextInput editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                                                </View>
                                                                <View style={styles.formField}>
                                                                    <Text style={styles.formLabel}>During this period the ship carried the following cargo(es) (the different types and grades of oil, gas and chemicals should be specified)</Text>
                                                                    <TextInput editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                                                </View>
                                                                <View style={{ ...styles.formField }}>
                                                                    <View style={{ width: '100%', paddingVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
                                                                        <MaterialCommunityIcons name={'checkbox-blank-circle-outline'} size={16} color={Colors.colorGrey2} style={{ marginRight: 10 }} />
                                                                        <Text style={{ ...styles.formDescription, justifyContent: 'center', width: '87%' }}>
                                                                            I confirm the above named trainee/rating has gained experience in carrying out regular cargo handling duties during the period stated
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                            </>
                                                        )
                                                    }
                                                </>
                                            )
                                        }

                                        <View style={styles.formHeader}>
                                            <Text style={styles.formTitle}>Official Endorsement</Text>
                                            <Text style={styles.formSutTitle}>(To be filled out by Captain or Responsible Person)</Text>
                                        </View>
                                        <View style={styles.formField}>
                                            <Text style={styles.formLabel}>Name</Text>
                                            <TextInput editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                        </View>
                                        <View style={styles.formField}>
                                            <Text style={styles.formLabel}>Email</Text>
                                            <TextInput editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                        </View>
                                        <View style={styles.formField}>
                                            <Text style={styles.formLabel}>Phone No.</Text>
                                            <TextInput editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                        </View>
                                        <View style={styles.formField}>
                                            <Text style={styles.formLabel}>Capacity</Text>
                                            <TextInput editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                        </View>
                                        <View style={styles.formField}>
                                            <Text style={styles.formLabel}>Signature</Text>
                                            <View style={{ backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7, height: 100 }}></View>
                                        </View>
                                        <View style={{ ...styles.formField, alignItems: 'center' }}>
                                            <Text style={styles.formLabel}>Yacht/company stamp</Text>
                                            <View style={{ backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7, height: 100, width: 157 }}></View>
                                        </View>
                                    </>
                                )
                            }
                            {
                                testimonial && (
                                    <>
                                        <View style={styles.formHeader}>
                                            <Text style={styles.formTitle}>Official Endorsement</Text>
                                        </View>
                                        <View style={styles.formField}>
                                            <Text style={styles.formLabel}>Conduct</Text>
                                            <TextInput value={testimonial.conduct} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                        </View>
                                        <View style={styles.formField}>
                                            <Text style={styles.formLabel}>Ability</Text>
                                            <TextInput value={testimonial.ability} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                        </View>
                                        {
                                            type == 'merchant' && (
                                                <>
                                                    <View style={styles.formField}>
                                                        <Text style={styles.formLabel}>General comments</Text>
                                                        <TextInput value={testimonial.generalComments} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                                    </View>
                                                    <View style={styles.formField}>
                                                        <Text style={styles.formLabel}>Type tanker</Text>
                                                        <TextInput value={testimonial.typeTanker} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                                    </View>
                                                    <View style={styles.formField}>
                                                        <Text style={styles.formLabel}>During this period the ship carried the following cargo(es) (the different types and grades of oil, gas and chemicals should be specified)</Text>
                                                        <TextInput value={testimonial.cargo} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                                    </View>
                                                    <View style={{ ...styles.formField }}>
                                                        <View style={{ width: '100%', paddingVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
                                                            <MaterialCommunityIcons name={'check'} size={16} color={Colors.colorGrey2} style={{ marginRight: 10 }} />
                                                            <Text style={{ ...styles.formDescription, justifyContent: 'center', width: '87%' }}>
                                                                I confirm the above named trainee/rating has gained experience in carrying out regular cargo handling duties during the period stated
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </>
                                            )
                                        }
                                        <View style={styles.formField}>
                                            <Text style={styles.formLabel}>First Name</Text>
                                            <TextInput value={testimonial.firstName} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                        </View>
                                        <View style={styles.formField}>
                                            <Text style={styles.formLabel}>Last Name</Text>
                                            <TextInput value={testimonial.lastName} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                        </View>
                                        <View style={styles.formField}>
                                            <Text style={styles.formLabel}>Email</Text>
                                            <TextInput value={testimonial.email} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                        </View>
                                        {
                                            capacity == 'Captain/Master' && (
                                                <View style={styles.formField}>
                                                    <Text style={styles.formLabel}>MASTER/CAPTAIN CoC No.</Text>
                                                    <TextInput value={testimonial.cocNumber} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                                </View>
                                            )
                                        }
                                        {
                                            capacity == 'Captain/Master' && (
                                                <View style={styles.formField}>
                                                    <Text style={styles.formLabel}>MASTER/CAPTAIN CoC Issuing Authority</Text>
                                                    <TextInput value={testimonial.cocIssuingAuth} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                                </View>
                                            )
                                        }
                                        {
                                            capacity == 'Responsible person' && (
                                                <View style={styles.formField}>
                                                    <Text style={styles.formLabel}>RESPONSIBLE PERSON Position</Text>
                                                    <TextInput value={testimonial.position} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                                </View>
                                            )
                                        }
                                        {
                                            capacity == 'Responsible person' && (
                                                <View style={styles.formField}>
                                                    <Text style={styles.formLabel}>Company Name</Text>
                                                    <TextInput value={testimonial.companyName} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                                </View>
                                            )
                                        }
                                        {
                                            capacity == 'Responsible person' && (
                                                <View style={styles.formField}>
                                                    <Text style={styles.formLabel}>Street Address</Text>
                                                    <TextInput value={testimonial.address} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                                </View>
                                            )
                                        }
                                        {
                                            capacity == 'Responsible person' && (
                                                <View style={styles.formField}>
                                                    <Text style={styles.formLabel}>City</Text>
                                                    <TextInput value={testimonial.city} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                                </View>
                                            )
                                        }
                                        {
                                            capacity == 'Responsible person' && (
                                                <View style={styles.formField}>
                                                    <Text style={styles.formLabel}>State/Region</Text>
                                                    <TextInput value={testimonial.region} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                                </View>
                                            )
                                        }
                                        {
                                            capacity == 'Responsible person' && (
                                                <View style={styles.formField}>
                                                    <Text style={styles.formLabel}>Zip code</Text>
                                                    <TextInput value={testimonial.zip} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                                </View>
                                            )
                                        }
                                        {
                                            capacity == 'Responsible person' && (
                                                <View style={styles.formField}>
                                                    <Text style={styles.formLabel}>Country</Text>
                                                    <TextInput value={testimonial.country} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                                </View>
                                            )
                                        }
                                        <View style={styles.formField}>
                                            <Text style={styles.formLabel}>Capacity</Text>
                                            <TextInput value={capacity} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                        </View>
                                        <View style={styles.formField}>
                                            <Text style={styles.formLabel}>Signature</Text>
                                            <View style={{ backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7, height: 100 }}>
                                                {
                                                    testimonial.signature && (
                                                        <Image source={{ uri: appConstants.MAINURL + testimonial.signature }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                                                    )
                                                }
                                            </View>
                                        </View>
                                        {
                                            capacity != 'Owner' && (
                                                <View style={{ ...styles.formField, alignItems: 'center' }}>
                                                    <Text style={styles.formLabel}>Yacht/company stamp</Text>
                                                    <View style={{ backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7, height: 100, width: 157 }}>
                                                        {
                                                            testimonial.stamp && (
                                                                <Image source={{ uri: appConstants.MAINURL + testimonial.stamp }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                                                            )
                                                        }
                                                    </View>
                                                </View>
                                            )
                                        }
                                    </>
                                )
                            }
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
        fontSize: width / 21,
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
        // lineHeight: 20,
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
        fontSize: width / 27,
        lineHeight: 23.44,
        letterSpacing: -0.41
    },
    formDescription: {
        color: '#767676',
        fontFamily: 'SourceSansPro-Regular',
        fontWeight: '700',
        fontSize: width / 26,
        lineHeight: 23.44,
        letterSpacing: -0.41
    },
    formField: {
        paddingVertical: 3,
        justifyContent: 'center'
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

export default connect(mapStateToProps, mapDispatchToProps)(SeaTimeTestimonial);