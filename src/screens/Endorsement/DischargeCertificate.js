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
import { getTotalDays } from "../../utils/dateTimeHelper";
import SignatureView from 'react-native-signature-canvas';
import appConstants from "../../constants/app";

function DischargeCertificate(props) {

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
    const [startLoc, setStartLoc] = useState('');
    const [endLoc, setEndLoc] = useState('');
    const ref = useRef();
    const [readOnly, setReadOnly] = useState(false);
    const [certificate, setCertificate] = useState(null);
    const [capacity, setCapacity] = useState(null);
    const [routes, setRoutes] = useState(null);

    useEffect(() => {
        if (!mounted) {
            if (props.user) setUser(props.user);
            if (props.route.params.vessel) {
                let _ves = props.route.params.vessel;
                setVessel(_ves);
            };
            if (props.route.params.period) setPeriod(props.route.params.period);
            if (props.route.params.departments) typeof props.route.params.departments == 'string' ? setDepartments(JSON.parse(props.route.params.departments)) : setDepartments(props.route.params.departments);
            if (props.route.params.forms) setForms(props.route.params.forms);
            if (props.route.params.roles) typeof props.route.params.roles == 'string' ? setRoles(JSON.parse(props.route.params.roles)) : setRoles(props.route.params.roles);
            if (props.route.params.type) setType(props.route.params.type);
            if (props.route.params.dischargeBook) setDischargeBook(props.route.params.dischargeBook);
            if (props.route.params.signature) setSignature(props.route.params.signature);
            if (props.route.params.startLoc) setStartLoc(props.route.params.startLoc);
            if (props.route.params.endLoc) setEndLoc(props.route.params.endLoc);
            if (props.route.params.routes) setRoutes(props.route.params.routes);
            if (props.route.params.certificate) setCertificate(props.route.params.certificate);
            if (props.route.params.capacity) setCapacity(props.route.params.capacity);
            if (props.route.params.certSignature) setSignature(appConstants.MAINURL + props.route.params.certSignature);
            if (props.route.params.readOnly) setReadOnly(true); else setReadOnly(false);
            setMounted(true);
        }
    }, [props]);

    const enableNext = () => {
        let enable = true;
        if (vessel?.imoNumber == null) return false;
        if (!signature) return false;
        switch (type) {
            case 'yachting':
                break;
            case 'merchant':
                if (vessel && (!vessel.mainEngine || !vessel.horsePower)) {
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
                certificate: true,
                dischargeBook,
                signature
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

    const handleClose = () => {
        if (readOnly) props.navigation.goBack();
        else {
            const data = {
                ...props.route.params,
                vessel: vessel,
                user: user,
                dischargeBook,
                signature
            }
            props.navigation.navigate('EndorseStep3', data)
        }
    }

    const includeEng = () => {
        if (departments?.includes('Engineering department')) return true;
        else return false;
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
                            if(readOnly && certificate?.printform) openURL(certificate?.printform);
                            // if(readOnly && certificate?.printform) props.navigation.navigate("ViewPrintform", {uri: certificate.printform})
                        }}>
                            {
                                readOnly && certificate?.printform ? (
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
                        <View style={{ width: '100%', backgroundColor: 'rgba(231,166,0,0.8)', justifyContent: 'center', alignItems: 'center', paddingVertical: 15 }}>
                            <Text style={styles.stickyHeaderText}>{`Certificate of discharge`}</Text>
                            {
                                vessel && vessel.type == 'Fishing' && <Text style={styles.stickyHeaderText}>{'(Fishing)'}</Text>
                            }
                        </View>
                    </View>
                    <ScrollView style={[{ backgroundColor: '#e5e5e5', marginBottom: readOnly ? 100 : openKeyboard ? 100 : 190 }]} nestedScrollEnabled scrollEnabled={scrollEnabled}>
                        <View style={{ width: '100%', backgroundColor: '#fff', padding: 16, }}>
                            <View style={{ width: '100%', marginVertical: 10 }}>
                                {
                                    !readOnly && (
                                        <TableHeader containerStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                                            Complete any missing information:
                                        </TableHeader>
                                    )
                                }
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
                                        <TableCol textStyle={{ fontSize: width / 26 }}>Discharge Book (if any)</TableCol>
                                        <TableCol value={true} edit={true}>
                                            <TextInput
                                                editable={!readOnly}
                                                placeholder={!readOnly ? "Enter if applicable" : "--"}
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
                                    <TableRow>
                                        <TableCol>Date of Birth</TableCol>
                                        <TableCol value={true}>{user?.birthDate && moment(user.birthDate).utc().format('DD-MMM YYYY')}</TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol>Nationality</TableCol>
                                        <TableCol value={true}>{user?.nationality}</TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol>Vessel Name</TableCol>
                                        <TableCol value={true}>{vessel?.name}</TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol>Port of choice/Flag</TableCol>
                                        <TableCol value={true}>{vessel?.flag}</TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol>Official number/IMO</TableCol>
                                        <TableCol value={true} edit={true}>
                                            <TextInput
                                                editable={!readOnly}
                                                placeholder={!readOnly ? "Enter number" : "--"}
                                                keyboardType={'numeric'}
                                                maxLength={7}
                                                value={vessel?.imoNumber.toString()}
                                                onChangeText={(text) => {
                                                    let _ves = { ...vessel };
                                                    _ves.imoNumber = text;
                                                    setVessel(_ves);
                                                }}
                                                style={!vessel?.imoNumber ? styles.placeholderStyle : styles.tableColTextValue}
                                                placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                onFocus={() => setOpenKeyboard(true)}
                                                onBlur={() => setOpenKeyboard(false)}
                                            />
                                        </TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol>Length {vessel?.ol_unit == 'm' ? '(metres)' : '(feets)'}</TableCol>
                                        <TableCol value={true}>{vessel?.length}</TableCol>
                                    </TableRow>
                                    {
                                        !includeEng() && (
                                            <TableRow>
                                                <TableCol>{'Vessel Gross Tons'}</TableCol>
                                                <TableCol value={true}>{vessel?.grossTonnage}</TableCol>
                                            </TableRow>
                                        )
                                    }
                                    {
                                        includeEng() && (
                                            <TableRow>
                                                <TableCol textStyle={{ fontSize: width / 26 }}>Type of main engine</TableCol>
                                                <TableCol value={true} edit={true}>
                                                    <TextInput
                                                        editable={!readOnly}
                                                        placeholder={!readOnly ? "Enter engine type" : "--"}
                                                        keyboardType={'default'}
                                                        value={vessel?.mainEngine}
                                                        onChangeText={(text) => {
                                                            let _ves = { ...vessel };
                                                            _ves.mainEngine = text;
                                                            setVessel(_ves);
                                                        }}
                                                        placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                        style={vessel?.mainEngine ? styles.tableColTextValue : styles.placeholderStyle}
                                                        onFocus={() => setOpenKeyboard(true)}
                                                        onBlur={() => setOpenKeyboard(false)}
                                                    />
                                                </TableCol>
                                            </TableRow>
                                        )
                                    }
                                    {
                                        includeEng() && (
                                            <TableRow>
                                                <TableCol textStyle={{ fontSize: width / 26 }}>Horsepower of engine</TableCol>
                                                <TableCol value={true} edit={true}>
                                                    <TextInput
                                                        editable={!readOnly}
                                                        placeholder={!readOnly ? "Enter engine HP" : "--"}
                                                        keyboardType={'numeric'}
                                                        value={vessel?.horsePower}
                                                        onChangeText={(text) => {
                                                            let _ves = { ...vessel };
                                                            _ves.horsePower = text;
                                                            setVessel(_ves);
                                                        }}
                                                        placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                        style={vessel?.horsePower ? styles.tableColTextValue : styles.placeholderStyle}
                                                        onFocus={() => setOpenKeyboard(true)}
                                                        onBlur={() => setOpenKeyboard(false)}
                                                    />
                                                </TableCol>
                                            </TableRow>
                                        )
                                    }
                                    {
                                        !includeEng() && (
                                            <TableRow>
                                                <TableCol textStyle={{ fontSize: width / 26 }}>Name of Body or Bodies of Water Upon Which Vessel was underway (Geographic Locations)</TableCol>
                                                <TableCol value={true}>{typeof routes == 'string' ? routes : routes?.join('\n')}</TableCol>
                                            </TableRow>
                                        )
                                    }
                                    <TableRow>
                                        <TableCol>Capacity employed</TableCol>
                                        <TableCol value={true}>{roles?.join('/')}</TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol textStyle={{ fontSize: width / 26 }}>Grade / No. of any CoC</TableCol>
                                        <TableCol value={true} edit={true}>
                                            <TextInput
                                                editable={!readOnly}
                                                placeholder={!readOnly ? "Enter CoC if any" : "--"}
                                                keyboardType={'default'}
                                                value={vessel?.grade_coc}
                                                onChangeText={(text) => {
                                                    let _ves = { ...vessel };
                                                    _ves.grade_coc = text;
                                                    setVessel(_ves);
                                                }}
                                                placeholderTextColor={!readOnly ? '#c21717' : '#333333'}
                                                style={styles.tableColTextValue}
                                                onFocus={() => setOpenKeyboard(true)}
                                                onBlur={() => setOpenKeyboard(false)}
                                            />
                                        </TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol textStyle={{ color: Colors.colorGrey1, fontWeight: '400' }}>Place of joining</TableCol>
                                        <TableCol value={true}>{startLoc}</TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol textStyle={{ color: Colors.colorGrey1, fontWeight: '400' }}>Date of joining</TableCol>
                                        <TableCol value={true}>{period?.start && moment(period?.start).utc().format('DD-MMM YYYY')}</TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol textStyle={{ color: Colors.colorGrey1, fontWeight: '400' }}>Place of discharge</TableCol>
                                        <TableCol value={true}>{endLoc}</TableCol>
                                    </TableRow>
                                    <TableRow>
                                        <TableCol textStyle={{ color: Colors.colorGrey1, fontWeight: '400' }}>Date of discharge</TableCol>
                                        <TableCol value={true}>{period?.end && moment(period?.end).utc().format('DD-MMM YYYY')}</TableCol>
                                    </TableRow>
                                </TableBody>
                            </View>
                            <View style={styles.formHeader}>
                                <Text style={styles.formTitle}>Official Endorsement</Text>
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
                                <View style={styles.formField}>
                                    <Text style={{ ...styles.formDescription, textAlign: 'center' }}>The Master, Owner Or Responsible Person must complete the remainder of this form..</Text>
                                </View>
                                <View style={styles.formField}>
                                    <Text style={styles.formLabel}>Signature of Master or other authorised person</Text>
                                    <View style={{ backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7, height: 100, width: '100%' }}>
                                        {
                                            certificate?.signature && (
                                                <Image source={{ uri: appConstants.MAINURL + certificate.signature }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                                            )
                                        }
                                    </View>
                                </View>
                                <View style={styles.formField}>
                                    <Text style={styles.formLabel}>Date of issue</Text>
                                    <TextInput value={certificate?.reviewDate} editable={false} placeholder="" numberOfLines={1} style={{ ...styles.tableColTextValue, backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7 }} ></TextInput>
                                </View>
                                <View style={{ ...styles.formField, alignItems: 'center' }}>
                                    <Text style={styles.formLabel}>Yacht/company stamp</Text>
                                    <View style={{ backgroundColor: '#f3f3f3', padding: 16, borderWidth: .5, borderColor: Colors.colorGrey3, borderRadius: 7, height: 100, width: 157 }}>
                                        {
                                            certificate?.stamp && (
                                                <Image source={{ uri: appConstants.MAINURL + certificate.stamp }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                                            )
                                        }
                                    </View>
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
        fontSize: width/20,
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
        fontSize: width/21,
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
        fontWeight: '600',
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

export default connect(mapStateToProps, mapDispatchToProps)(DischargeCertificate);