import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    ScrollView,
    SafeAreaView,
    Dimensions,
    Text,
    FlatList,
    Alert
} from 'react-native';
import * as GlobalStyles from '../styles/styles';
import { Colors } from '../styles/index';
import { LinearGradient } from 'expo-linear-gradient';
import AddVesselWizard from '../components/AddVesselForm/AddVesselWizard';
import { HeaderLeft } from '../components/Header/HeaderLeft';
import { HeaderRight } from '../components/Header/HeaderRight';
import { HeaderTitle } from '../components/Header/HeaderTitle';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { CustomSwitch } from '../components/CustomSwitch';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SecurityActions from '../actions/SecurityActions';
import Modal from "react-native-modalbox";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { RadixIcon } from '../components/Icons/RadixIcon';
import DatePicker from '../components/DatePicker';
import { LengthUnit } from '../components/LengthUnit';
import LocalStorageService from '../core/services/auth/LocalStorageService';
import { validateServicePeriod } from '../utils/validate';
import { width } from '../components/Carousel/Carousel';

export const DateFormat = 'DD MMM YYYY';

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

function AddVesselScreen(props) {
    const [user, setUser] = useState(null);
    const [pro, setPro] = useState(false);
    const [step, setStep] = useState(1);
    const [types, setTypes] = useState(vTypes);
    const [detailedTypes, setDetailedTypes] = useState(vTypes);
    const [changed, setChanged] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [visibleTypeModal, setVisibleTypeModal] = useState(false);
    const [visibleDetailedTypeModal, setVisibleDetailedTypeModal] = useState(false);
    const [visibleDatePicker, setVisibleDatePicker] = useState(false);
    const [visibleNotice, setVisibleNotice] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [dateType, setDateType] = useState('sdate');
    const [isValidated, setIsValidated] = useState(false);
    const [vessels, setIsVessels] = useState([]);
    const [route, setRoute] = useState(null);
    const [alertTitle, setAlertTitle] = useState('');

    const [isDefault, setIsDefault] = useState(true);
    const [vesselName, setVesselName] = useState('');
    const [vesselLength, setVesselLength] = useState(null);
    const [lengthUnit, setLengthUnit] = useState('m');
    const [vesselMake, setVesselMake] = useState('');
    const [vesselType, setVesselType] = useState(null);
    const [detailedType, setDetailedType] = useState(null);
    const [grossTonnage, setGrossTonnage] = useState(null);
    const [flag, setFlag] = useState(null);
    const [mmsi, setMMSI] = useState(null);
    const [imo, setIMO] = useState(null);
    const [sdate, setSdate] = useState(null);
    const [edate, setEdate] = useState(null);
    const [showWatchkeeping, setShowWatchkeeping] = useState(false)
    const [autologWatchkeeping, setAutologWatchkeeping] = useState(false)
    const [showStandbyService, setShowStandbyService] = useState(false)
    const [showUscgStatistics, setShowUscgStatistics] = useState(false)

    const [modalHeight, setModalHeight] = useState(500);

    const toggleSwitch = () => setIsDefault(previousState => !previousState);

    useEffect(() => {
        if (!mounted) {
            setUser(props.user);
            if (props.user.plan.includes('pro')) {
                setPro(true);
                setIsDefault(false)
            };
            // props.actions.getVesselType()
            //     .then(result => {
            //         console.log(result)
            //         setTypes(result)
            //     })
            //     .catch(err => {
            //         console.log(err)
            //     })
            if (props.route.params?.type) {
                setRoute(props.route.params.type);
            }
            setMounted(true);
        }
    }, [props, mounted])

    const checkSaveable = () => {
        if (step == 1) {
            if (!pro) {
                if (vesselName != '' && parseInt(vesselLength) != 0 && vesselMake != '') {
                    setChanged(true);
                } else {
                    setChanged(false);
                }
            } else {
                if (validate(0)) {
                    setChanged(true);
                } else {
                    setChanged(false);
                }
            }
        }
    }

    const handleNext = async () => {
        if (isValidated) {
            setStep(step + 1)
        } else {
            const validated = await props.actions.validateNewVessel({ name: vesselName, user: user.id });
            if (validated) {
                setStep(step + 1)
                setIsValidated(true)
            } else {
                Alert.alert(
                    "Sorry..",
                    `Vessel name \"${vesselName}\" has already been entered. Please enter a different name.`,
                    [
                        {
                            text: 'OK',
                            onPress: () => console.log('ok')
                        }
                    ]
                )
            }
        }
    }

    const onSetVesselType = async (item) => {
        setVesselType(item);
        setDetailedType(null);
        const detailedType = await props.actions.getDetailedType({ type: item });
        setDetailedTypes(detailedType)
        setVisibleTypeModal(false);
        checkSaveable();
    }
    const onSetDetailedType = (item) => {
        setDetailedType(item);
        setVisibleDetailedTypeModal(false);
        checkSaveable();
    }
    const onChagneDate = (event, selectedDate) => {
        setVisibleDatePicker(false);
        if (!selectedDate) return;
        if (dateType == 'sdate') {
            const fromnow = moment(selectedDate).utc().fromNow();
            if (fromnow.includes('ago')) return false;
            const diff = moment(selectedDate).utc().diff(edate);
            if (edate && diff > 0) return false;
            setSdate(selectedDate);
        }
        else {
            const fromnow = moment(selectedDate).utc().fromNow();
            if (fromnow.includes('ago')) return false;
            const diff = moment(selectedDate).utc().diff(sdate);
            if (sdate && diff <= 0) return false;
            setEdate(selectedDate)
        }
    }

    const validate = (type) => {
        if (type == 0) {
            if (vesselName != '' && parseInt(vesselLength) != 0 && typeof parseInt(vesselLength) == 'number' && vesselType && detailedType && grossTonnage && parseInt(grossTonnage) != 0 && flag) {
                return true;
            } else {
                return false;
            }
        }
        if (type == 1) {
            if (vesselName == '' || vesselLength == 0 || typeof parseInt(vesselLength) != 'number' || !vesselType || !detailedType || !grossTonnage || grossTonnage == 0 || !flag) {
                return false;
            } else {
                return true;
            }
        }
    }

    const onSave = () => {
        if (pro) {
            if (!validate(1)) {
                alert('Please complete fields.')
                return;
            }
        } else {
            if (vesselName == '' || !vesselLength || vesselMake == '') {
                alert('Please complete fields.')
                return;
            }
        }
        const service_periods = sdate ? JSON.stringify([{ "start": sdate, "end": edate }]) : null;
        const data = {
            'user': user.id,
            'name': vesselName,
            'length': parseFloat(vesselLength),
            'ol_unit': lengthUnit,
            'type': pro ? vesselType : vesselMake,
            'detailedType': detailedType,
            'isDefault': isDefault,
            'mmsiNumber': mmsi && parseInt(mmsi),
            'imoNumber': imo && parseInt(imo),
            'grossTonnage': grossTonnage && parseInt(grossTonnage),
            'flag': flag,
            'onBoardStartDate': sdate,
            'onBoardEndDate': edate,
            'showWatchkeeping': showWatchkeeping,
            'autologWatchkeeping': autologWatchkeeping,
            'showStandbyService': showStandbyService,
            'showUscgStatistics': showUscgStatistics,
            'is_signedon': sdate != null || moment(sdate).utc().diff(new Date()) < 0 ? true : false,
            'service_periods': service_periods
        }
        props.actions.saveNewVessel(data)
            .then(async res => {
                // alert(res.message)
                // console.log(res)
                setIsVessels(res.vessels);
                setIsValidated(false);
                await LocalStorageService.storeCurrentVessel(data);
                onBack(res.vessels[res.vessels.length - 1]);
            })
            .catch(err => {
                alert(err)
            })
    }

    const onBack = (vessel=null) => {
        if (route) {
            props.navigation.navigate('Vessels', { reload: true });
        }else {
            props.navigation.navigate('Dashboard', { vessel: vessel });
        }
    }

    const onLayoutModal = (e) => {
        const { height } = e.nativeEvent.layout;
        setModalHeight(height);
    };

    const handleSelectDates = (s, e) => {
        const vessels = props.vessels;
        if (validateServicePeriod(s, e, vessels)) {
            setSdate(s?.timestamp);
            setEdate(e?.timestamp);
            setChanged(true);
            setVisibleDatePicker(false);
        } else {
            let currentServicePeriods = 'Onboard service periods cannot be overlapped. Please re-select dates.\n\nExisting Service Periods\n';
            vessels.reverse().map((vessel) => {
                if (vessel.onBoardStartDate) {
                    if (vessel.onBoardEndDate) {
                        currentServicePeriods += moment(vessel.onBoardStartDate).utc().format(DateFormat) + " ~ " + moment(vessel.onBoardEndDate).utc().format(DateFormat) + "\n";
                    } else {
                        currentServicePeriods += moment(vessel.onBoardStartDate).utc().format(DateFormat) + " ~ \n";
                    }
                }
            })
            Alert.alert(
                "Invalid Service Period",
                currentServicePeriods.trim(),
            )
        }
    }
    return (
        <View style={GlobalStyles.FlexContainer}>
            <KeyboardAvoidingView
                behavior={'padding'}
                style={{ width: '100%', height: '100%' }}
            >
                <SafeAreaView style={[GlobalStyles.safeView]}>
                    <View style={[GlobalStyles.header]}>
                        <HeaderLeft onPress={() => step == 1 ? onBack() : setStep(step - 1)}>
                            <Text style={{
                                color: '#ababab',
                                marginLeft: 20,
                                fontSize: width / 23,
                                // lineHeight: 21.09,
                                letterSpacing: -0.3,
                                fontWeight: '400',
                                // width: 55
                            }}>{step == 1 ? "Cancel" : "Back"}</Text>
                        </HeaderLeft>
                        <HeaderTitle>
                            {
                                !pro ?
                                    <Text style={{
                                        ...GlobalStyles.headerTitle
                                    }}>Add Vessel</Text>
                                    :
                                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                        <Text style={{
                                            ...GlobalStyles.headerTitle
                                        }}>Add Vessel</Text>
                                        <Text style={{
                                            color: '#888',
                                            fontSize: width / 28,
                                            lineHeight: 18
                                        }}>{`Step ${step} of 3`}</Text>
                                    </View>
                            }
                        </HeaderTitle>
                        <HeaderRight onPress={() => !pro ? onSave() : step != 3 && changed ? handleNext() : onSave()}>
                            {
                                !pro ?
                                    <Text style={{
                                        color: changed ? '#007aff' : '#b9d9f6',
                                        ...styles.navigationText,
                                    }}>Save</Text>
                                    :
                                    <>
                                        {
                                            step != 3 ?
                                                <Text style={{
                                                    ...styles.navigationText,
                                                    color: changed ? '#007aff' : '#b9d9f6',
                                                }}>Next</Text>
                                                :
                                                <Text style={{
                                                    color: changed ? '#007aff' : '#b9d9f6',
                                                    ...styles.navigationText,
                                                }}>Save</Text>
                                        }
                                    </>
                            }
                        </HeaderRight>
                    </View>
                    <ScrollView style={[{ backgroundColor: '#f9f9f9' }]}>
                        {
                            step == 1 ?
                                <>
                                    <View style={{ width: '100%' }}>
                                        <Text style={{
                                            ...styles.label
                                        }}>Basic Information</Text>
                                    </View>
                                    <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                                        <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: .5, borderBottomColor: '#c6c6c8' }}>
                                            <Text style={GlobalStyles.labelText}>Vessel name</Text>
                                            <TextInput
                                                placeholder='Enter name'
                                                value={vesselName}
                                                style={GlobalStyles.inputBox}
                                                placeholderTextColor={Colors.colorGrey3}
                                                onChangeText={async (value) => {
                                                    await setVesselName(value);
                                                    checkSaveable();
                                                }}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                                        <View style={{ ...GlobalStyles.inputForm, paddingVertical: 4, paddingLeft: 0, borderBottomWidth: .5, borderBottomColor: '#c6c6c8' }}>
                                            <Text style={GlobalStyles.labelText}>Length overall</Text>
                                            <LengthUnit value={lengthUnit == 'ft'} toggleSwitch={() => lengthUnit == 'm' ? setLengthUnit('ft') : setLengthUnit('m')} />
                                        </View>
                                    </View>
                                    <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                                        <View style={{ ...GlobalStyles.inputForm, marginLeft: 10 }}>
                                            <Text style={GlobalStyles.labelText}></Text>
                                            <TextInput
                                                placeholder='Enter length'
                                                value={vesselLength}
                                                style={GlobalStyles.inputBox}
                                                keyboardType='numeric'
                                                placeholderTextColor={Colors.colorGrey3}
                                                onChangeText={async (value) => {
                                                    await setVesselLength(value);
                                                    checkSaveable();
                                                }}
                                            />
                                        </View>
                                    </View>
                                    {
                                        !pro ? (
                                            <>
                                                <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                                                    <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: .5, borderBottomColor: '#c6c6c8' }}>
                                                        <Text style={GlobalStyles.labelText}>Vessel make</Text>
                                                        <TextInput
                                                            placeholder='Enter make'
                                                            value={vesselMake}
                                                            style={GlobalStyles.inputBox}
                                                            placeholderTextColor={Colors.colorGrey3}
                                                            onChangeText={async (value) => {
                                                                await setVesselMake(value);
                                                                checkSaveable();
                                                            }}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={GlobalStyles.spaceH}></View>
                                                <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                                                    <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: .5, borderBottomColor: '#c6c6c8' }}>
                                                        <Text style={GlobalStyles.labelText}>Default vessel</Text>
                                                        <CustomSwitch value={isDefault} toggleSwitch={toggleSwitch} />
                                                    </View>
                                                </View>
                                                {
                                                    isDefault && (
                                                        <View style={{ flexDirection: 'column', justifyContent: 'center', backgroundColor: '#f9f9f9', alignItems: 'center', paddingVertical: 30 }}>
                                                            <View style={{ backgroundColor: '#fff', width: 80, height: 80, borderRadius: 80, alignItems: 'center', justifyContent: 'center' }}>
                                                                <View style={{ ...styles.vesselDetailIcon, shadowColor: '#52bb00', backgroundColor: '#52bb00', width: 40, height: 40, }}>
                                                                    <RadixIcon />
                                                                </View>
                                                            </View>
                                                            <View style={{ paddingHorizontal: 50, paddingTop: 20 }}>
                                                                <Text style={{ textAlign: 'center', fontSize: width / 23, lineHeight: 25.5, color: '#646464', fontWeight: '300', fontFamily: 'Roboto-Light', letterSpacing: -0.3 }}>
                                                                    All trips detected will be logged under this vessel
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    )
                                                }
                                            </>
                                        ) : (
                                            <>
                                                <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                                                    <View style={[{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: .5, borderBottomColor: '#c6c6c8' }]}>
                                                        <Text style={GlobalStyles.labelText}>Vessel type</Text>
                                                        <Text
                                                            style={[GlobalStyles.inputBox, { color: vesselType ? '#000' : Colors.colorGrey3, paddingTop: 10 }]}
                                                            onPress={() => setVisibleTypeModal(true)}
                                                        >{vesselType ? vesselType : 'Select type'}</Text>
                                                    </View>
                                                </View>
                                                {
                                                    vesselType && (
                                                        <View style={{ width: '100%', backgroundColor: '#eee' }}>
                                                            <TouchableOpacity style={{ ...GlobalStyles.inputForm }} onPress={() => setVisibleDetailedTypeModal(true)}>
                                                                {
                                                                    !detailedType && <Text style={[GlobalStyles.labelText, { marginLeft: 10 }]}>Select detailed type</Text>
                                                                }
                                                                {
                                                                    detailedType ?
                                                                        <Text
                                                                            style={[GlobalStyles.inputBox, { color: detailedType ? '#000' : '#b0b0b7e0', paddingTop: 10, textAlign: 'right', width: Dimensions.get('screen').width - 32 }]}
                                                                            onPress={() => setVisibleDetailedTypeModal(true)}
                                                                        >{detailedType}</Text>
                                                                        :
                                                                        <Ionicons name={'chevron-down-outline'} size={20} color={'#b0b0b7e0'} onPress={() => setVisibleDetailedTypeModal(true)} />
                                                                }
                                                            </TouchableOpacity>
                                                        </View>
                                                    )
                                                }
                                                <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                                                    <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: .5, borderBottomColor: '#c6c6c8' }}>
                                                        <Text style={GlobalStyles.labelText}>Gross tonnage (GT)</Text>
                                                        <TextInput
                                                            placeholder='Enter GT'
                                                            value={grossTonnage}
                                                            style={[GlobalStyles.inputBox, { width: width * 0.3 }]}
                                                            keyboardType='numeric'
                                                            placeholderTextColor={Colors.colorGrey3}
                                                            onChangeText={async (value) => {
                                                                await setGrossTonnage(value);
                                                                checkSaveable();
                                                            }}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                                                    <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0 }}>
                                                        <Text style={GlobalStyles.labelText}>Flag</Text>
                                                        <TextInput
                                                            placeholder='Enter Flag'
                                                            value={flag}
                                                            style={GlobalStyles.inputBox}
                                                            placeholderTextColor={Colors.colorGrey3}
                                                            onChangeText={async (value) => {
                                                                await setFlag(value);
                                                                checkSaveable();
                                                            }}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={{ width: '100%' }}>
                                                    <Text style={{
                                                        ...styles.label
                                                    }}>AIS information</Text>
                                                </View>
                                                <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                                                    <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: .5, borderBottomColor: '#c6c6c8' }}>
                                                        <Text style={GlobalStyles.labelText}>MMSI number</Text>
                                                        <TextInput
                                                            placeholder='Enter number'
                                                            value={mmsi}
                                                            style={GlobalStyles.inputBox}
                                                            keyboardType='numeric'
                                                            placeholderTextColor={Colors.colorGrey3}
                                                            onChangeText={async (value) => {
                                                                await setMMSI(value);
                                                                checkSaveable();
                                                            }}
                                                            maxLength={9}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                                                    <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0 }}>
                                                        <Text style={GlobalStyles.labelText}>IMO number</Text>
                                                        <TextInput
                                                            placeholder='Enter number'
                                                            value={imo}
                                                            style={GlobalStyles.inputBox}
                                                            keyboardType='numeric'
                                                            placeholderTextColor={Colors.colorGrey3}
                                                            onChangeText={async (value) => {
                                                                await setIMO(value);
                                                                checkSaveable();
                                                            }}
                                                            maxLength={7}
                                                        />
                                                    </View>
                                                </View>
                                            </>
                                        )
                                    }

                                </>
                                :
                                step == 2 ?
                                    <>
                                        <View style={{ width: '100%' }}>
                                            <Text style={{
                                                ...styles.label
                                            }}>Onboard Service</Text>
                                        </View>
                                        <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                                            <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0 }}>
                                                <Text style={GlobalStyles.labelText} numberOfLines={1}>Start date (if known)</Text>
                                                <Text
                                                    style={[GlobalStyles.inputBox, { color: sdate ? '#000' : '#b0b0b7e0', paddingTop: 10 }]}
                                                    onPress={() => {
                                                        sdate && setCurrentDate(sdate);
                                                        setDateType('sdate')
                                                        setVisibleDatePicker(true);
                                                    }}
                                                >{sdate ? moment(sdate).utc().format(DateFormat) : 'Enter date'}</Text>
                                            </View>
                                        </View>
                                        <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                                            <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0 }}>
                                                <Text style={GlobalStyles.labelText} numberOfLines={1}>End date (if known)</Text>
                                                <Text
                                                    style={[GlobalStyles.inputBox, { color: edate ? '#000' : '#b0b0b7e0', paddingTop: 10 }]}
                                                    onPress={() => {
                                                        edate && setCurrentDate(edate);
                                                        setDateType('edate')
                                                        setVisibleDatePicker(true);
                                                    }}
                                                >{edate ? moment(edate).utc().format(DateFormat) : sdate ? 'N/A' : 'Enter date'}</Text>
                                            </View>
                                        </View>
                                    </>
                                    :
                                    <>
                                        <View style={[styles.sectionTitle, {}]}>
                                            <Text style={{
                                                ...styles.label,
                                                paddingTop: 0
                                            }}>Watchkeeping Service</Text>
                                            <TouchableOpacity
                                                style={styles.infoMark}
                                                onPress={() => {
                                                    setAlertTitle('watchkeeping')
                                                    setVisibleNotice(true)
                                                }}
                                            >
                                                <FontAwesome5
                                                    name="exclamation"
                                                    size={10}
                                                    color={Colors.colorWhite}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ backgroundColor: '#fff', flexDirection: 'row', paddingHorizontal: 16, alignItems: 'center' }}>
                                            <Text
                                                style={{
                                                    ...GlobalStyles.labelText,
                                                    width: Dimensions.get('screen').width - 80,
                                                }}
                                            >Include watchkeeping service on trip cards</Text>
                                            <CustomSwitch value={showWatchkeeping} toggleSwitch={() => setShowWatchkeeping(!showWatchkeeping)} />
                                        </View>
                                        {
                                            showWatchkeeping && (
                                                <View style={{ backgroundColor: '#f2f2f2', flexDirection: 'row', paddingLeft: 26, paddingRight: 16, alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Text style={{ ...GlobalStyles.labelText, width: Dimensions.get('screen').width - 80, }}>Auto-log ALL days underway as watchkeeping</Text>
                                                    <CustomSwitch value={autologWatchkeeping} toggleSwitch={() => setAutologWatchkeeping(!autologWatchkeeping)} />
                                                </View>
                                            )
                                        }
                                        <View style={{ ...styles.sectionTitle }}>
                                            <Text style={{
                                                ...styles.label,
                                                paddingTop: 0
                                            }}>Standby Service</Text>
                                            <TouchableOpacity
                                                style={styles.infoMark}
                                                onPress={() => {
                                                    setAlertTitle('standby')
                                                    setVisibleNotice(true)
                                                }}
                                            >
                                                <FontAwesome5
                                                    name="exclamation"
                                                    size={10}
                                                    color={Colors.colorWhite}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ backgroundColor: '#fff', flexDirection: 'row', paddingHorizontal: 16, alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={{ ...GlobalStyles.labelText, width: Dimensions.get('screen').width - 80, }}>Include standby service on trip cards</Text>
                                            <CustomSwitch value={showStandbyService} toggleSwitch={() => setShowStandbyService(!showStandbyService)} />
                                        </View>
                                        <View style={{ ...styles.sectionTitle }}>
                                            <Text style={{
                                                ...styles.label,
                                                paddingTop: 0
                                            }}>USCG Stats</Text>
                                            <TouchableOpacity
                                                style={styles.infoMark}
                                                onPress={() => {
                                                    setAlertTitle('uscg')
                                                    setVisibleNotice(true)
                                                }}
                                            >
                                                <FontAwesome5
                                                    name="exclamation"
                                                    size={10}
                                                    color={Colors.colorWhite}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ backgroundColor: '#fff', flexDirection: 'row', paddingHorizontal: 16, alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={{ ...GlobalStyles.labelText, width: Dimensions.get('screen').width - 80, }}>Include USCG stats on trip cards</Text>
                                            <CustomSwitch value={showUscgStatistics} toggleSwitch={() => setShowUscgStatistics(!showUscgStatistics)} />
                                        </View>
                                    </>
                        }
                    </ScrollView>
                </SafeAreaView>
                <Modal
                    isOpen={visibleTypeModal}
                    onClosed={() => setVisibleTypeModal(false)}
                    style={[styles.modal, styles.modal0]}
                    position={"center"}
                    swipeArea={50}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalHeaderText}>Vessel type</Text>
                        </View>
                        {
                            types && (
                                types.map((item, index) =>
                                    <TouchableOpacity key={index} style={styles.listItem} onPress={() => { onSetVesselType(item) }}>
                                        <Text style={styles.listItemText} onPress={() => { onSetVesselType(item) }}>{item}</Text>
                                    </TouchableOpacity>
                                )
                            )
                        }
                    </View>
                </Modal>
                <Modal
                    isOpen={visibleDetailedTypeModal}
                    onClosed={() => setVisibleDetailedTypeModal(false)}
                    style={[styles.modal, styles.modal0]}
                    position={"center"}
                    swipeArea={50}
                >
                    <View style={{ ...styles.centeredView, height: 550 }}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalHeaderText}>Vessel Detailed type</Text>
                        </View>
                        <ScrollView>
                            {
                                detailedTypes && (
                                    detailedTypes.map((item, index) =>
                                        <TouchableOpacity key={index} style={styles.listItem} onPress={() => { onSetDetailedType(item) }}>
                                            <Text style={styles.listItemText} onPress={() => { onSetDetailedType(item) }}>{item}</Text>
                                        </TouchableOpacity>
                                    )
                                )
                            }
                        </ScrollView>
                    </View>
                </Modal>
                <Modal
                    isOpen={visibleNotice}
                    onClosed={() => setVisibleNotice(false)}
                    style={{ ...styles.modal, width: '80%', height: modalHeight, position: 'relative' }}
                    position={'center'}
                >
                    <View style={{ ...styles.centeredView }} onLayout={(e) => onLayoutModal(e)}>
                        <View style={styles.modalHeader}>
                            <Text style={{ ...styles.modalHeaderText, textAlign: 'center' }}>
                                {
                                    alertTitle == 'watchkeeping' && (
                                        'Helpful hints:\nWatchkeeping service'
                                    )
                                }
                                {
                                    alertTitle == 'standby' && (
                                        'Helpful hints:\nStandby service'
                                    )
                                }
                                {
                                    alertTitle == 'uscg' && (
                                        'Helpful hints:\nUSCG Stats'
                                    )
                                }
                            </Text>
                        </View>
                        <View style={{ ...styles.modalBody }}>
                            {
                                alertTitle == 'watchkeeping' && (
                                    <>
                                        <Text style={{ ...styles.modalBodyText }}>Watchkeeping service is NOT required to be logged by all crew</Text>
                                        <Text style={{ ...styles.modalBodyText }}>Watchkeeping service completed in the deck department should be logged by holders of MCA OOW3000 or higher</Text>
                                    </>
                                )
                            }
                            {
                                alertTitle == 'standby' && (
                                    <>
                                        <Text style={{ ...styles.modalBodyText }}>Standby service does not need to be logged by all crew. Deckhands in the yachting industry should add this to their trip cards</Text>
                                        <Text style={{ ...styles.modalBodyText }}>Standby service describes time spent waiting for an owner, uniformed and ready to depart</Text>
                                    </>
                                )
                            }
                            {
                                alertTitle == 'uscg' && (
                                    <>
                                        <Text style={{ ...styles.modalBodyText, fontFamily: 'Roboto-Bold' }}>Trip cards will display:</Text>
                                        <Text style={{ ...styles.modalBodyText }}>The number of days underway, in US waters, that are spent seaward of the USCG boundary line and days spent shoreward of the USCG boundary line (CFR46 part 7)</Text>
                                        <Text style={{ ...styles.modalBodyText }}>Number of days, if any, spent on the Great Lakes</Text>
                                    </>
                                )
                            }
                        </View>
                        <View style={{ ...styles.modalFooter }}>
                            <Text style={{ ...styles.footerActionText }} onPress={() => setVisibleNotice(false)}>Close</Text>
                        </View>
                    </View>
                </Modal>
                {visibleDatePicker && (
                    <DatePicker
                        onClose={() => setVisibleDatePicker(false)}
                        startDate={sdate}
                        endDate={edate}
                        onSave={(s, e) => handleSelectDates(s, e)}
                    />
                )}
            </KeyboardAvoidingView>
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
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 16
    },
    modalFooter: {
        height: 50,
        width: Dimensions.get('screen').width * 0.8,
        bottom: 0,
        // position: 'absolute',
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
        fontSize: width / 24.5,
        lineHeight: 19.92,
        letterSpacing: -0.3,
        fontWeight: '400',
        marginRight: 20,
        // width: 55,
        textAlign: 'right',
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(AddVesselScreen);
