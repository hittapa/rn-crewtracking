import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Dimensions,
    ImageBackground,
    Linking,
    Platform,
    FlatList,
    AppState,
} from 'react-native';
import * as GlobalStyles from '../styles/styles';
import { Colors, Buttons } from '../styles/index';
import { AntDesign, EvilIcons, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Trip } from '../components/Dashboard/Trip';
import { DashboardStats } from '../components/Dashboard/components';
import { HeaderLeft } from '../components/Header/HeaderLeft';
import { HeaderRight } from '../components/Header/HeaderRight';
import CustomButton from '../components/CustomButton';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SecurityActions from '../actions/SecurityActions';
import moment from 'moment';
import LocalStorageService from '../core/services/auth/LocalStorageService';
import { CompassIcon } from '../components/Icons/CompassIcon';
import Modal from 'react-native-modalbox';
import { first, min } from 'lodash-es';
import { LongRightArrowIcon } from '../components/Icons/LongRightArrowIcon';
import TripDetectionCard from '../components/Dashboard/components/TripDetectionCard';
import Animated, { color, not } from 'react-native-reanimated';
import { width } from '../components/Carousel/Carousel';
import DatePicker from 'react-native-date-picker'
import CustomDatePicker from '../components/DatePicker';
import * as Location from 'expo-location';
import * as Application from 'expo-application';
import * as IntentLauncher from 'expo-intent-launcher';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import { ActivityIndicator } from 'react-native';
import { sampleDeparture, sampleDestination, sampleTrip, sampleVessel } from '../utils/sample';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import messaging from '@react-native-firebase/messaging';
import Axios from 'axios';
import appConstants from '../constants/app';
import securityConstants from '../constants/security';
import * as ExpoLocation from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Alert } from 'react-native';
import { isBetterLocation, validateService, validateServicePeriod } from '../utils/validate';
import { DateFormat } from './AddVesselScreen';
import { KeyboardAvoidingView } from 'react-native';
import FutureService from '../components/Dashboard/components/FutureService';
import { isInyard } from '../utils/service_helper';
import { dateStringToMilli, getTotalDays } from '../utils/dateTimeHelper';
import { useInterval } from '../utils/hooks';
import { CheckBox } from 'react-native-elements';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import DateTimePicker from '../components/DateTimePicker';
import getAppActions from '../actions/AppActions';

let screenWidth = Dimensions.get('window').width; //full width
let screenHeight = Dimensions.get('window').height;
let localStorage = new Map();

export const TASK_FETCH_LOCATION = 'TASK_FETCH_LOCATION';

export const loadLocation = async (timeInterval, distanceInterval) => {
    try {
        await ExpoLocation.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
            accuracy: ExpoLocation.Accuracy.BestForNavigation,
            showsBackgroundLocationIndicator: false,
            defferedUpdatesInterval: 0,
            timeInterval: Platform.select({
                android: 60000
            })
        })
    } catch (err) {
        console.log(err);
    }
}

const updateLocation = async (data) => {
    const user_id = parseInt(await AsyncStorage.getItem('currenctUser'));
    const postData = {
        lat: data.coords.latitude,
        lon: data.coords.longitude,
        speed: data.coords.speed,
        timestamp: data.timestamp,
        user_id: user_id,
    }

    let url = appConstants.BASEURL + securityConstants.UPDATE_LOCATION;

    console.log("Location information: ", postData);

    let locations = JSON.parse(await AsyncStorage.getItem("Locations")) || [];

    locations.push(postData);
    console.log(locations.length);

    await Axios.post(url, locations)
        .then(async res => {
            let _data = res.data.message;
            console.log("Response: ", res.data);
            if (res.data.status == 'success') {
                await AsyncStorage.removeItem("Locations");
            }
            if (_data && _data != [] && typeof _data == 'object') {
                if (_data.trip_detected != undefined && _data.trip_detected == true) {
                    await AsyncStorage.setItem('trip_detected', 'true');
                }
                if (_data.trackingInterval != undefined && _data.trackingInterval != null) {
                    let currentTrackingInterval = parseInt(await AsyncStorage.getItem('trackingInterval'));
                    let tInterval = _data.trackingInterval * 60 * 1000;
                    let distInterval = data.coords.speed * _data.trackingInterval * 60;
                    if (currentTrackingInterval != tInterval) {
                        try {
                            await ExpoLocation.stopLocationUpdatesAsync(TASK_FETCH_LOCATION)
                        } catch (err) {
                            console.log(err);
                        }
                        console.log(`timeInterval: ${tInterval}, distInterval: ${distInterval}`)
                        loadLocation(tInterval, distInterval)
                        await AsyncStorage.setItem('trackingInterval', tInterval.toString());
                    }
                }
                if (_data.trip != undefined && _data.trip != null) {
                    await AsyncStorage.setItem('trip_card_created', 'true');
                }
            }
        })
        .catch(async err => {
            AsyncStorage.setItem('Locations', JSON.stringify(locations));
            console.log(err);
            if (err.toString().includes("Network Error") || err.toString().includes("timeout")) {
                let alerted = await AsyncStorage.getItem("networkErrorAlert");
                if (alerted == 'true') return;
                alert("You don't have the internet.");
                await AsyncStorage.setItem("networkErrorAlert", 'true');
            }
        })
}

TaskManager.defineTask(TASK_FETCH_LOCATION, async ({ data: data, error }) => {
    let { locations } = data;
    if (error) {
        console.error(error)
        return;
    }
    const [location] = locations;
    try {
        if (Platform.OS == 'android') {
            await updateLocation(location);
        } else {
            var providerInfo = await ExpoLocation.getProviderStatusAsync({
                locationServicesEnabled: true,
            })
            var currentProvider = await AsyncStorage.getItem('currentProvider');
            if (currentProvider == undefined)
                currentProvider = null;
            else currentProvider = JSON.parse(currentProvider);

            var currentBestLocation = await AsyncStorage.getItem('currentBestLocation');
            if (currentBestLocation == undefined)
                currentBestLocation = null;
            else currentBestLocation = JSON.parse(currentBestLocation);

            if (location)
                location.provider = providerInfo;
            if (currentBestLocation)
                currentBestLocation.provider = currentProvider;
            if (isBetterLocation(location, currentBestLocation)) {
                console.log("is Better Location")
                await AsyncStorage.setItem('currentBestLocation', JSON.stringify(location));
                await updateLocation(location);
                GLOBAL_TRIP_DETECTION = true;
            } else {
                console.log("Not good location")
            }
        }
    } catch (err) {
        console.error(err);
    }
})

function DashboardScreen(props) {
    const [minimizedStats, setMinimizedStats] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [locationGranted, setLocationGranted] = useState(null);
    const [user, setUser] = useState(null);
    const [pro, setPro] = useState(false);
    const [currentVessel, setCurrentVessel] = useState(null);
    const [vessels, setVessels] = useState(null);
    const [trips, setTrips] = useState([]);
    const [locodes, setLocodes] = useState([]);
    const [totalNMiles, setTotalNMiles] = useState(0);
    const [daysUnderway, setDaysUnderway] = useState(0);

    const [signedOnVessel, setSignedOnVessel] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [showVesselBasicDetail, setShowVesselBasicDetail] = useState(false);
    const [showVesselServiceDetail, setShowVesselServiceDetail] = useState(false);
    const [showVesselTotals, setShowVesselTotals] = useState(false);
    const [scrollDistance] = useState(new Animated.Value(0))
    const [titlePosition] = useState(new Animated.divide(scrollDistance, width));
    const [headerWidth, setHeaderWidth] = useState(0);
    const [nmileTextWidth, setMileTextWidth] = useState(0);
    const [showAbsence, setShowAbsence] = useState(false);
    const [showYardPeriod, setShowYardPeriod] = useState(false);
    const [showServicePeriod, setShowServicePeriod] = useState(false);
    const [showUnderway, setShowUnderway] = useState(false);
    const [absenceStart, setAbsenceStart] = useState(null);
    const [absenceEnd, setAbsenceEnd] = useState(null);
    const [yardStart, setYardStart] = useState(null);
    const [yardEnd, setYardEnd] = useState(null);
    const [serviceStart, setServiceStart] = useState(null);
    const [serviceEnd, setServiceEnd] = useState(null);
    const [underwayStart, setUnderwayStart] = useState(null);
    const [underwayEnd, setUnderwayEnd] = useState(null);

    const [showStatsModal, setShowStatsModal] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [statsName, setStatsName] = useState('');
    const [statsKey, setStatsKey] = useState('');
    const [modalHeight, setModalHeight] = useState(100);

    const [tripUpdateAlert, setTripUpdateAlert] = useState(false);
    const [tripDetected, setTripDetected] = useState(null);
    const [reload, setReload] = useState(false);
    const [currentTrip, setCurrentTrip] = useState(null);
    const [tripHistory, setTripHistory] = useState([]);
    const [serviceIndex, setServiceIndex] = useState(0);
    const [servicePeriods, setServicePeriods] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [serviceTotals, setServiceTotals] = useState(null);

    const [animationEnd, setAnimationEnd] = useState(false);
    const [scrollViewHeight, setScrollViewHeight] = useState(ScreenHeight - 100);
    const [uptodateHeight, setUptodateHeight] = useState(305);
    const [deviceToken, setDeviceToken] = useState(null);
    const [noTrip, setNoTrip] = useState(true);
    const [tripAmount, setTripAmount] = useState(0);
    const [tripTotalAmount, setTripTotalAmount] = useState(0);
    const [pid, setPeriodId] = useState(null);
    const [hasFutureService, setHasFutureService] = useState(false);
    const [futureService, setFutureService] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [showSampleTrip, setShowSampleTrip] = useState(false);
    const [tripRemain, setTripRemain] = useState(5);
    const [endorseSignedonAlert, setEndorseSignedonAlert] = useState(false);
    const [editFutureService, setEditFutureService] = useState(false);
    const [endorsements, setEndorsements] = useState([]);
    const [openLocationSettingsModal, setOpenLocationSettingsModal] = useState(false);
    const [isOverLand, setIsOverLand] = useState(true);
    const [tripConfirmAlert, setTripConfirmAlert] = useState(false);
    const [dontShowMessage, setDontShowMessage] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [openEndTripModal, setOpenEndTripModal] = useState(false);
    const [tripEndDate, setTripEndDate] = useState(new Date());
    const [endLocation, setEndLocation] = useState(null);
    const [component, setComponent] = useState(null);
    const [clickedStartTrip, setClickedStartTrip] = useState(false);
    const [endTripModalWithoutStart, setEndTripModalWithoutStart] = useState(false);

    useEffect(() => {
        if (!mounted) {
            (async () => {
                try {
                    let { status } = await ExpoLocation.requestPermissionsAsync();
                    console.log('Loading permission status')
                    console.log(status)
                    if (status !== 'granted') {
                        setLocationGranted(false);
                    } else {
                        setLocationGranted(true);
                        /**
                         * Disabling auto trip tracking ....
                         */
                        // loadLocation(60000, 1000);
                    }
                } catch (err) {
                    console.log(err);
                }

                props.user && await AsyncStorage.setItem('currenctUser', props.user.id.toString());
                // await AsyncStorage.setItem('trackingInterval', '30000');

                // await messaging().registerDeviceForRemoteMessages();
                await messaging().getToken().then((token) => {
                    if (deviceToken == null && props.user) {
                        updateDeviceToken(token);
                    }
                })
                await messaging().onMessage(async message => {
                    showMessage({
                        message: message.data?.title || message.notification?.title,
                        description: message.data?.body || message.notification?.body,
                        type: 'success',
                    })
                });
            })();

            if (props.vessels == null) {
                setCurrentVessel(null);
                setSignedOnVessel(null);
                setVessels(null);
                setServicePeriods([])
                setTrips(null);
                props?.actions?.getTrips({ user_id: props.user?.id });
                props?.actions?.getVessels({ user: props.user?.id });
            }
            // checkLocationPermission();
            setMounted(true);
        }
        // const loadCurrentVessel = async () => {
        //     await LocalStorageService.getCurrentVessel().then(vessel => {
        //         if (vessel && !currentVessel) {
        //             setCurrentVessel(vessel)
        //             vessel.service_periods && setServicePeriods(JSON.parse(vessel.service_periods));
        //             _setTripHistory(props.trips, vessel)
        //         }
        //     })
        // }
        if (props.user) {
            AsyncStorage.setItem('currenctUser', props.user.id.toString());
            setUser(props.user);
            const isPro = props.user.plan.includes('pro') === true;
            setPro(isPro);
            setDontShowMessage(props.user.dont_show_start_trip_message)
            // if (props.user.is_first == false) loadCurrentVessel();
            try {
                // var istask = false;
                // (async () => {
                //     istask = await isTaskRunning();
                // })()

                //// Disabling auto trip tracking.......
                // if (props.user?.trip_detection) {
                //     console.log("Tracking starting------   1");
                //     startTracking()
                // } else {
                //     if (props.user?.trip_detection == false) {
                //         endTracking();
                //     }
                // }

                // if (!props.user?.trip_in_progress) {
                //     endTracking();
                // } else {
                //     startTracking();
                // }
            } catch (err) {
                console.log(err.message);
            }
            if (props.user.is_first == true && isPro) setShowAlert(true);
        };

        let vessel = props.route?.params?.vessel;

        if (props.vessels) {
            console.log("Vessels updated ==========================");

            ///// For autotracking ....
            // if (props.vessels.length == 0 && user?.trip_detection == true) {
            //     const userid = props.user?.id;
            //     if (!userid) return;
            //     const data = {
            //         id: userid,
            //         trip_detection: false
            //     };
            //     props.actions.updateUser(data).then(res => setUser(res));
            // }
            let _vess = props.vessels;
            setTripDetected(false);
            setVessels(_vess);

            if (serviceIndex != 0 && vessel?.id == currentVessel.id && pro) {
                for (let i = 0; i < _vess.length; i++) {
                    const vess = _vess[i];
                    if (vess.id == currentVessel.id) setCurrentVessel(vess);
                }
                setServiceIndex(serviceIndex);
                setSelectedPeriod(servicePeriods[serviceIndex]);
                getTripAmount(currentVessel, servicePeriods[serviceIndex]);
                setShowVesselServiceDetail(false);
                // setShowVesselTotals(false);
                _setTripHistory(trips, currentVessel, servicePeriods[serviceIndex]);
                calculateServiceTotals(servicePeriods[serviceIndex]);
                return;
            }

            let _curr = false;
            for (let i = 0; i < _vess.length; i++) {
                const item = _vess[i];
                if (item.is_signedon && pro) {
                    if (user?.trip_detection == false && !isInyard(_vess)) {
                        updateTripDetection()
                    }

                    ///// Disabling auto trip tracking .....
                    // if (user?.trip_detection) {
                    //     console.log("Tracking starting------   2");
                    //     startTracking();
                    // }
                    setSignedOnVessel(item);
                    setCurrentVessel(item);
                    setHasFutureService(false);
                    setFutureService(null);
                    if (item.service_periods) {
                        let sp = JSON.parse(item.service_periods);
                        setServicePeriods(sp);
                        if (sp.length > 0) {
                            setSelectedPeriod(sp[serviceIndex]);
                        } else {
                            setSelectedPeriod(0);
                        }
                    }
                    getTripAmount(item)
                    getTotalTripAmount(item);
                    _setTripHistory(props.trips, item);
                    _curr = true;
                    break;
                }
            }
            if (_curr == false) {
                ///// For autotracking...
                // if (user?.trip_detection == true) {
                //     const userid = props.user?.id;
                //     if (!userid) return;
                //     const data = {
                //         id: userid,
                //         trip_detection: false
                //     };
                //     props.actions.updateUser(data).then(res => setUser(res));
                // }
                setSignedOnVessel(null);
                for (let i = 0; i < _vess.length; i++) {
                    const item = _vess[i];
                    if (item.isDefault) {
                        setCurrentVessel(item);
                        setSignedOnVessel(item)
                        if (item.service_periods) {
                            let sp = JSON.parse(item.service_periods);
                            if (sp.length > 0) {
                                if (moment(sp[0].start).diff(new Date(), 'hours') > 0) {
                                    setHasFutureService(true);
                                    setFutureService(sp[0]);
                                    sp.splice(0, 1);
                                    if (sp.length > 0)
                                        setSelectedPeriod(sp[serviceIndex]);
                                    else
                                        setSelectedPeriod(null);
                                } else {
                                    setHasFutureService(false);
                                    setFutureService(null);
                                    setSelectedPeriod(sp[serviceIndex]);
                                }
                            } else {
                                setHasFutureService(false);
                                setFutureService(null);
                            }
                            setServicePeriods(sp);
                        }
                        getTripAmount(item)
                        getTotalTripAmount(item);
                        _setTripHistory(props.trips, item);
                        _curr = true;
                        break;
                    }
                }
                if (_curr == false) {
                    if (_vess.length > 0) {
                        var item = _vess[0];
                        setCurrentVessel(item);
                        if (item.service_periods) {
                            let sp = JSON.parse(item.service_periods);
                            if (sp.length > 0) {
                                if (moment(sp[0].start).diff(new Date(), 'hours') > 0) {
                                    setHasFutureService(true);
                                    setFutureService(sp[0]);
                                    sp.splice(0, 1);
                                    if (sp.length > 0)
                                        setSelectedPeriod(sp[serviceIndex]);
                                    else
                                        setSelectedPeriod(null);
                                } else {
                                    setHasFutureService(false);
                                    setSelectedPeriod(sp[serviceIndex]);
                                }
                            } else {
                                setHasFutureService(false);
                                setFutureService(null);
                            }
                            setServicePeriods(sp);
                        }
                        getTripAmount(item)
                        getTotalTripAmount(item);
                        _setTripHistory(props.trips, item);
                    } else {
                        setCurrentVessel(null);
                        setServicePeriods(null);
                        setHasFutureService(false);
                        setFutureService(null);
                        setSelectedPeriod(null);
                        setTotalNMiles(0);
                        setDaysUnderway(0);
                        calculateServiceTotals(null);
                    }
                }
            }
            if (isInyard(props.vessels)) {
                if (user?.trip_detection == true) updateTripDetection();
            }
            if (props.user?.transactionId == null && props.user?.plan?.includes('pro')) {
                let amount = 0;
                for (let i = 0; i < _vess.length; i++) {
                    const vessel = _vess[i];
                    if (vessel.onboardServices && vessel.onboardServices.length > 0) {
                        for (let i = 0; i < vessel.onboardServices.length; i++) {
                            const item = vessel.onboardServices[i];
                            if (item.type == 'trip' && item.trip != null) {
                                amount += 1;
                            }
                        }
                    }
                }
                setTripRemain(Math.max(0, 5 - amount));
                if (amount == 5 && user?.trip_detection) {
                    const data = {
                        id: user?.id,
                        trip_detection: false
                    };
                    props.actions.updateUser(data).then(res => { });
                }
            }
        }
        if (vessel) {
            var _signedon = null;
            setTripDetected(false);
            props.vessels?.map((item) => {
                if (vessel.id == item.id) {
                    setCurrentVessel(item);
                    if (item.service_periods) {
                        let sp = JSON.parse(item.service_periods);
                        if (sp.length > 0) {
                            if (!item.is_signedon && moment(sp[0].start).diff(new Date(), 'hours') > 0) {
                                setHasFutureService(true);
                                setFutureService(sp[0])
                                sp.splice(0, 1);
                                if (sp.length > 0)
                                    setSelectedPeriod(sp[0]);
                                else
                                    setSelectedPeriod(null);
                            } else {
                                setHasFutureService(false);
                                setFutureService(null);
                                setSelectedPeriod(sp[0]);
                            }
                        } else {
                            setHasFutureService(false);
                            setFutureService(null);
                            setSelectedPeriod(null);
                        }
                        setServicePeriods(sp);
                    } else {
                        setServicePeriods([]);
                        setSelectedPeriod(null);
                        setHasFutureService(false);
                        setFutureService(null);
                    }
                    getTripAmount(item);
                    getTotalTripAmount(item);
                    _setTripHistory(props.trips, item);
                    setServiceIndex(0);
                }
                if (item.is_signedon)
                    _signedon = item;
            });
            setSignedOnVessel(_signedon);
        }
        // if (props.trips) {
        //     setTrips(props.trips);
        // }
        // else {
        //     (async () => {
        //         let trs = await props.actions.getTrips({ user_id: props.user.id });
        //         setTrips(trs);
        //         _setTripHistory(trs, currentVessel)
        //     })();
        // }
        if (props.locodes) {
            setLocodes(props.locodes)
        }
        if (props.route?.params?.serviceIndex) {
            let srvInd = props.route?.params?.serviceIndex;
            setServiceIndex(srvInd);
            setSelectedPeriod(servicePeriods[srvInd]);
            getTripAmount(currentVessel, servicePeriods[srvInd]);
            setShowVesselServiceDetail(false);
            // setShowVesselTotals(false);
            _setTripHistory(trips, currentVessel, servicePeriods[srvInd]);
            calculateServiceTotals(servicePeriods[srvInd]);
        }
        onLayoutScrollView();

        AppState.addEventListener('change', checkLocationPermission)
        return (() => {
            AppState.removeEventListener('change', checkLocationPermission)
        })
    }, [props, currentVessel, vessels, trips])

    useEffect(() => {
        (async () => {
            let td = await AsyncStorage.getItem('trip_card_created');
            let _td = (td === 'true')
            if (_td) {
                setTripDetected(false);
                await props.actions.getVessels({ user: user?.id });
                await AsyncStorage.removeItem('trip_detected');
                await AsyncStorage.removeItem('trip_card_created');
            }
        })();
    }, []);

    useEffect(() => {
        if (props.endorsements) {
            setEndorsements(props.endorsements);
        };
    })

    useInterval(() => {
        user && props.actions.getVessels({ user: user?.id });
    }, 120000);

    useEffect(() => {
        if (tripDetected) {
            startTracking();
        } else {
            endTracking();
        }
    }, [tripDetected])

    const endTracking = async () => {
        try {
            TaskManager.getRegisteredTasksAsync().then((res) => {
                res?.map(async (task) => {
                    if (task.taskName === 'TASK_FETCH_LOCATION') {
                        await ExpoLocation.stopLocationUpdatesAsync(TASK_FETCH_LOCATION);
                    }
                })
            })
        } catch (err) {
            console.log(err);
        }
    };

    const onStartTracking = async () => {
        let startClicked = await AsyncStorage.getItem('ClickStartTrip');
        if (startClicked == 'true') {
            props.startLoading();
            AsyncStorage.removeItem('ClickStartTrip')
            ExpoLocation.getCurrentPositionAsync({
                accuracy: ExpoLocation.Accuracy.BestForNavigation,
                mayShowUserSettingsDialog: true
            }).then((position) => {
                setCurrentLocation(position);
                const params = {
                    user_id: user?.id,
                    location: position,
                    vessel: currentVessel?.id,
                    dontShowMessage: dontShowMessage
                }
                props.actions.createTripCard(params).then(res => {
                    setTripConfirmAlert(false);
                    if (res.message == 'success') {
                        loadLocation(60000, 100);
                        let _user = { ...user };
                        _user.trip_in_progress = true;
                        setUser(_user);
                        props.updateUser({ ..._user });
                        props.actions.checkCurrentLocation(position).then((res => {
                            if (res.message?.geo_type.toUpperCase().includes('LAND')) {
                                setIsOverLand(true);
                            } else {
                                setIsOverLand(false);
                            }
                            setTimeout(() => {
                                setTripConfirmAlert(true);
                            }, 1000)
                        }))
                    } else {

                    }
                }).catch(err => {
                    setTripConfirmAlert(false);
                    console.log(err);
                    alert(err.message)
                })
            }).catch(err => {
                props.stopLoading();
            })
        }
    }

    const startTracking = () => {
        try {
            TaskManager.getRegisteredTasksAsync().then((res) => {
                let enable = true;
                res?.map(async (task) => {
                    if (task.taskName === 'TASK_FETCH_LOCATION') {
                        enable = false;
                    }
                })
                console.log("Tracking enable +-+-+-+-+-+-");
                console.log(enable);
                if (enable) {
                    loadLocation(60000, 100);
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    const updateTripDetection = () => {
        const userid = props.user?.id;
        if (!userid) return;
        const data = {
            id: userid,
            trip_detection: !user?.trip_detection
        };
        props.actions.updateUser(data).then(res => setUser(res));
    }

    const updateDeviceToken = async (token) => {
        console.log('Device Token')
        console.log(token)
        const data = {
            id: props.user.id,
            device_token: token
        }
        setDeviceToken(token);
        await Axios.post(appConstants.BASEURL + securityConstants.UPDATE_TOKEN, data)
            .then(async res => {
            })
    }

    const getTripAmount = (vessel = currentVessel, period = null) => {
        let start = period ? period.start : selectedPeriod?.start;
        let end = period ? period.end : selectedPeriod?.end;
        let amount = 0;
        if (vessel.onboardServices && vessel.onboardServices.length > 0) {
            for (let i = 0; i < vessel.onboardServices.length; i++) {
                const item = vessel.onboardServices[i];
                if (start) {
                    if (end) {
                        if (item?.ended_at < start || item?.started_at > end) {
                            continue;
                        } else {

                        }
                    } else {
                        if (item?.ended_at < start) {
                            continue;
                        }
                    }
                }
                if (item.type == 'trip' && item.trip != null) {
                    amount += 1;
                }
            }
        }

        setTripAmount(amount)
        if (amount > 0) {
            setNoTrip(false);
        } else {
            setNoTrip(true);
        }
    }

    const getTotalTripAmount = (vessel = currentVessel, period = null) => {
        let amount = 0;
        if (vessel.onboardServices && vessel.onboardServices.length > 0) {
            for (let i = 0; i < vessel.onboardServices.length; i++) {
                const item = vessel.onboardServices[i];
                if (item.type == 'trip' && item.trip != null) {
                    amount += 1;
                }
            }
        }

        setTripTotalAmount(amount);
    }

    const _setTripHistory = (trips, vessel, period = null) => {
        let th = [];
        let tn = 0;
        let du = 0;
        let start = period ? period.start : selectedPeriod?.start;
        let end = period ? period.end : selectedPeriod?.end;
        if (vessel.onboardServices && vessel.onboardServices.length > 0) {
            for (let i = 0; i < vessel.onboardServices.length; i++) {
                const item = vessel.onboardServices[i];
                // if (start) {
                //     if (end) {
                //         if (item?.ended_at < start || item?.started_at > end) {
                //             continue;
                //         } else {

                //         }
                //     } else {
                //         if (item?.ended_at < start) {
                //             continue;
                //         }
                //     }
                // }
                if (item.type == 'trip' && item.trip != null) {
                    let i = item.trip;
                    if (typeof i != 'object') continue;
                    if (i.total_nmiles) tn += i.total_nmiles;
                    if (i.underway) du += i.underway;
                }
            }
        }
        setTotalNMiles(Math.round(tn / 1852));
        setDaysUnderway(du);
        calculateServiceTotals(th);
    }


    const checkLocationPermission = async () => {
        try {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                setLocationGranted(false);
                endTracking();
            } else {
                /**
                 * Disabling auto trip tracking....
                 */
                // if (pro && signedOnVessel && user?.trip_detection && !locationGranted) {
                //     loadLocation(60000, 100);
                // } else if (!pro && !locationGranted && currentVessel) {
                //     loadLocation(60000, 100);
                // }
                setLocationGranted(true);
                setOpenLocationSettingsModal(false);
                onStartTracking();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const calculateServiceTotals = (_period = selectedPeriod) => {
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
        let start = _period?.start;
        let end = _period?.end;
        st.onboard_service = getTotalDays(start, end);

        if (currentVessel?.onboardServices && currentVessel?.onboardServices.length > 0) {
            for (let i = 0; i < currentVessel?.onboardServices.length; i++) {
                const item = currentVessel?.onboardServices[i];
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

    const Item = ({ title, value, textStyle = {}, containerStyle = {} }) => {
        return (
            <View key={title} style={{ flexDirection: 'row', borderBottomWidth: .5, borderBottomColor: '#c6c6c8', justifyContent: 'space-between', alignItems: 'center', paddingVertical: width / 40, width: '100%', ...containerStyle }}>
                <View style={{ flexDirection: 'row', maxWidth: '80%', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Text style={[{ ...styles.title }, textStyle]}>{title}</Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        paddingRight: width / 30
                    }}
                >
                    <Text style={[{ ...styles.subTitle }, textStyle]}>{value}</Text>
                </View>
            </View>
        )
    }

    const position = Animated.interpolate(titlePosition, {
        inputRange: [0, 0.05],
        outputRange: [0, ((width - 100) / 2 - (headerWidth + 20) / 2)],
        extrapolate: 'clamp'
    })

    const screensStyles = { right: position };

    const opacity = Animated.interpolate(titlePosition, {
        inputRange: [0, 0.05],
        outputRange: [1, 0],
        extrapolate: 'clamp'
    });

    const marginTop = Animated.interpolate(titlePosition, {
        inputRange: [0, 0.05],
        outputRange: [20, -60],
        extrapolate: 'clamp'
    });

    const height = Animated.interpolate(titlePosition, {
        inputRange: [0, 0.05],
        outputRange: [80, 80],
        extrapolate: 'clamp'
    });

    const top = Animated.interpolate(titlePosition, {
        inputRange: [0, 0.05],
        outputRange: [0, showVesselBasicDetail ? (screenHeight < 668 ? -180 : -161) : (screenHeight < 668 ? 20 : 42)],
        extrapolate: 'clamp'
    });

    const left = Animated.interpolate(titlePosition, {
        inputRange: [0, 0.05],
        outputRange: [0, (width - 100) / 2 - (nmileTextWidth + 80) / 2],
        extrapolate: 'clamp'
    });
    const nmPosition = { top: top, left: left }

    const nm_unit_opacity = Animated.interpolate(titlePosition, {
        inputRange: [0, 0.05],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    });

    const nm_unit_width = Animated.interpolate(titlePosition, {
        inputRange: [0, 0.05],
        outputRange: [0, 40],
        extrapolate: 'clamp'
    });

    const mileFontSize = Animated.interpolate(titlePosition, {
        inputRange: [0, 0.05],
        outputRange: [width / 15, width / 22],
        extrapolate: 'clamp'
    });

    const onLoadTitle = (e) => {
        setHeaderWidth(e.nativeEvent.layout.width);
    }

    const onLoadMileText = (e) => {
        setMileTextWidth(e.nativeEvent.layout.width)
    }

    const onLoadModal = (e) => {
        const { height } = e.nativeEvent.layout;
        setModalHeight(height);
    }

    const fixLocation = async () => {
        if (Platform.OS == 'ios') {
            await Linking.openURL('app-settings:')
        } else {
            const bundleIdentifier = Application.applicationId;
            await IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS, {
                data: `package:${bundleIdentifier}`
            })
        }
    }

    const onSetFirstTripAlert = async () => {
        const userid = user.id;
        const data = {
            id: userid,
            first_trip_alert: true
        };
        await props.actions.updateUser(data).then(res => setUser(res));
    }

    const onMainScroll = async (e) => {
        if (e.nativeEvent.contentOffset.y < -100 && reload == false) {
            setReload(true)
            let ves = await props.actions.getVessels({ user: user.id });
            setVessels(ves)
            let trs = await props.actions.getTrips({ user_id: user.id });
            setTrips(trs)
            _setTripHistory(trs, currentVessel)
            setReload(false)
        }
        // Animated.event(
        //     [{ nativeEvent: { contentOffset: { y: scrollDistance } } }],
        //     { onScroll: props.onScroll , useNativeDriver: false},
        // )(e);
    }

    const onLayoutScrollView = (
        _showVesselServiceDetail = showVesselServiceDetail,
        _showVesselTotals = showVesselTotals,
        _showVesselBasicDetail = showVesselBasicDetail
    ) => {
        let sh = ScreenHeight - 180;
        // if (_showVesselServiceDetail) sh = sh - 230;
        // // if (_showVesselTotals && serviceTotals) sh = sh - 500;
        // if (_showVesselBasicDetail == true) sh = sh - 300; else sh = sh - 100;
        // if (!pro) sh = sh + 50;
        // if (!locationGranted) sh = sh - 10;
        // if (!(currentVessel?.is_signedon && serviceIndex == 0) && showVesselServiceDetail) sh = sh - 30
        // if (hasFutureService) sh = sh - 30
        // setScrollViewHeight(sh);
    }

    const onDeleteServicePeriod = () => {
        const mess = "Delete service period\n" + moment(selectedPeriod?.start).utc().format(DateFormat) + " ~ " + moment(selectedPeriod?.end).utc().format(DateFormat) + "\n"
        Alert.alert(
            "Are you sure?",
            mess,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => { console.log('Cancelled') }
                },
                {
                    text: "Delete",
                    style: 'default',
                    onPress: () => handleDelete()
                }
            ]
        )
    }

    const handleDelete = async () => {
        let services = currentVessel?.onboardServices;
        if (services && services.length > 0) {
            for (let i = 0; i < services.length; i++) {
                const srv = services[i];
                if (srv?.started_at >= selectedPeriod?.start && srv?.ended_at <= selectedPeriod?.end) {
                    const data = {
                        id: currentVessel?.id,
                        service_id: srv.id,
                        started_at: null,
                        ended_at: null,
                        loading: false,
                    };
                    await props.actions.updateVessel(data)
                }
            }
        }

        let service_periods = [...servicePeriods]
        service_periods.splice(serviceIndex, 1);
        if (hasFutureService && futureService) {
            service_periods.unshift(futureService);
        }

        let data = {
            id: currentVessel?.id,
            onBoardStartDate: null,
            onBoardEndDate: null,
            is_signedon: serviceIndex == 0 && currentVessel?.is_signedon ? false : currentVessel?.is_signedon,
            service_periods: JSON.stringify(service_periods)
        };
        setSelectedPeriod(null);
        setServiceIndex(0);
        await props.actions.updateVessel(data);
    }

    const handleSelectServicePeriod = async (s, e = null, is_signedon) => {
        let lastService = currentVessel?.onboardServices?.length > 0 ? currentVessel?.onboardServices[0] : null;
        let firstService = currentVessel?.onboardServices?.length > 0 ? currentVessel?.onboardServices[currentVessel?.onboardServices.length - 1] : null;
        if (((lastService && (e < lastService.ended_at)) || firstService && (s > firstService.started_at)) && isEdit) {
            let alert = false;
            for (let i = 0; i < currentVessel?.onboardServices.length; i++) {
                const item = currentVessel?.onboardServices[i];
                if (!editFutureService && item.started_at > selectedPeriod?.start && item.ended_at < selectedPeriod?.end) {
                    if (s > item.started_at || e < item.ended_at) {
                        alert = true;
                        break;
                    }
                }
            }
            if (alert) {
                Alert.alert(
                    "Warning!",
                    "You will lose previously logged service as a result of this date change.\nAre you sure you would like to continue?",
                    [
                        {
                            text: 'No',
                            style: "cancel",
                            onPress: () => { }
                        },
                        {
                            text: 'Yes, I am sure',
                            style: "default",
                            onPress: () => handleRemoveLoggedServices(s, e, is_signedon),
                        },
                    ]
                )
            } else {
                onChangeServicePeriod(s, e, is_signedon);
            }
        } else {
            onChangeServicePeriod(s, e, is_signedon);
        }
    }

    const handleRemoveLoggedServices = async (s, e, is_signedon) => {
        if (validateServicePeriod(s, e, vessels, currentVessel?.id)) {
            let services = currentVessel?.onboardServices;
            if (services && services.length > 0) {
                for (let i = 0; i < services.length; i++) {
                    const srv = services[i];
                    if (srv.started_at > selectedPeriod?.start && srv.ended_at < selectedPeriod?.end) {
                        if (srv.ended_at > e || srv.started_at < s) {
                            const data = {
                                id: currentVessel?.id,
                                service_id: srv.id,
                                started_at: null,
                                ended_at: null,
                                loading: false,
                            };
                            await props.actions.updateVessel(data)
                        }
                    }
                }
            }
            onChangeServicePeriod(s, e, is_signedon);
        } else {
            changeServicePeriodAlert();
        }
    }

    const onChangeServicePeriod = async (s, e = null, is_signedon) => {
        if (validateServicePeriod(s, e, vessels, currentVessel?.id, serviceIndex, isEdit, hasFutureService)) {
            let service_periods = servicePeriods || [];
            if (editFutureService) {
                let _futurePeriod = { ...futureService };
                _futurePeriod.start = parseInt(s);
                _futurePeriod.end = e ? parseInt(e) : null;
                service_periods.unshift(_futurePeriod);
            } else {
                if (service_periods.length > 0 && isEdit) {
                    service_periods[serviceIndex].start = parseInt(s);
                    service_periods[serviceIndex].end = e ? parseInt(e) : null;
                } else {
                    var newPid = { start: parseInt(s), end: parseInt(e) };
                    service_periods.push(newPid);
                    service_periods.sort((a, b) => (a.start >= b.end) ? -1 : ((b.end > a.start) ? 1 : 0));
                }
                if (currentVessel?.is_signedon && serviceIndex != 0) {
                    is_signedon = currentVessel.is_signedon;
                }
                if (hasFutureService && futureService) {
                    service_periods.unshift(futureService);
                }
            }
            let data = {
                id: currentVessel?.id,
                onBoardStartDate: parseInt(s),
                onBoardEndDate: parseInt(e),
                is_signedon: is_signedon,
                service_periods: JSON.stringify(service_periods)
            };
            console.log(data)
            await props.actions.updateVessel(data);
            setShowServicePeriod(false);
            if (is_signedon) setHasFutureService(false);
            setIsEdit(false);
            setEditFutureService(false);
            setServiceIndex(0);
        } else {
            changeServicePeriodAlert();
        }
    }

    const changeServicePeriodAlert = () => {
        let currentServicePeriods = 'Onboard service periods cannot be overlapped. Please re-select dates.\n\nExisting Service Periods\n';
        var allPeriods = [];
        vessels.reverse().map((vessel) => {
            var periods = JSON.parse(vessel.service_periods) || null;
            if (periods && periods.length > 0) {
                for (let i = 0; i < periods.length; i++) {
                    const pid = periods[i];
                    allPeriods.push(pid);
                }
            }
        });
        allPeriods.sort((a, b) => (a.start > b.end) ? -1 : ((a.start < b.end) ? 1 : 0));
        for (let i = 0; i < allPeriods.length; i++) {
            const pid = allPeriods[i];
            if (pid) {
                if (pid.end) {
                    currentServicePeriods += moment(pid.start).utc().format(DateFormat) + " ~ " + moment(pid.end).utc().format(DateFormat) + "\n";
                } else {
                    currentServicePeriods += moment(pid.start).utc().format(DateFormat) + " ~ \n";
                }
            }
        }
        Alert.alert(
            "Invalid Service Period",
            currentServicePeriods.trim(),
        )
    }
    const handleSaveAbsence = async (s, e) => {
        if (!e) {
            alert("Please select the end date of this period");
            return;
        }
        if (validateService(s, e, currentVessel, pid, selectedPeriod)) {
            let data = {
                id: currentVessel?.id,
                leave_start: s?.timestamp,
                leave_end: e?.timestamp,
                service_id: pid
            };
            setAbsenceStart(s?.timestamp);
            setAbsenceEnd(e?.timestamp);
            await props.actions.updateVessel(data);
            setShowAbsence(false);
        } else {
            alert("Service periods cannot be overlapped. Please re-select dates.")
        }
    }

    const handleSaveYard = async (s, e) => {
        if (!e) {
            alert("Please select the end date of this period");
            return;
        }
        if (validateService(s, e, currentVessel, pid, selectedPeriod)) {
            let data = {
                id: currentVessel?.id,
                yard_start: s?.timestamp,
                yard_end: e?.timestamp,
                service_id: pid
            };
            setYardStart(s?.timestamp);
            setYardEnd(e?.timestamp);
            await props.actions.updateVessel(data);
            setShowYardPeriod(false);
        } else {
            alert("Service periods cannot be overlapped. Please re-select dates.")
        }
    }

    const handleDeleteYard = async () => {
        Alert.alert(
            "Are you sure?",
            "You are about to delete yard service.\n",
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => { }
                },
                {
                    text: 'Delete',
                    style: 'default',
                    onPress: () => onDeleteYard()
                }
            ]
        )
    }

    const onDeleteYard = async () => {
        setYardStart(null);
        setYardEnd(null);
        let data = {
            id: currentVessel?.id,
            yard_start: null,
            yard_end: null,
            service_id: pid,
        };
        console.log("Update Vessel: ", data);
        await props.actions.updateVessel(data);
        setPeriodId(null);
        setShowYardPeriod(false);
    }

    const handleDeleteAbsence = () => {
        Alert.alert(
            "Are you sure?",
            "You are about to delete leave of absence.\n",
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => { }
                },
                {
                    text: 'Delete',
                    style: 'default',
                    onPress: () => onDeleteAbsence()
                }
            ]
        )
    }

    const onDeleteAbsence = async () => {
        console.log(pid)
        setAbsenceStart(null)
        setAbsenceEnd(null)
        let data = {
            id: currentVessel?.id,
            leave_start: null,
            leave_end: null,
            service_id: pid
        };
        await props.actions.updateVessel(data);
        setPeriodId(null);
        setServiceIndex(0);
        setShowAbsence(false);
    }

    const serviceOptionHeight = () => {
        if (showVesselServiceDetail && showVesselTotals && serviceTotals) {
            return ScreenHeight * .7;
        } else {
            if (showVesselServiceDetail) {
                if (currentVessel?.is_signedon && serviceIndex == 0) {
                    return 230;
                } else return 268;
            } else {
                if (showVesselTotals && serviceTotals) {
                    return ScreenHeight * 0.7;
                } else return 0;
            }
        }
    }

    const onDeleteFutureService = async () => {
        const mess = "Delete service period\n" + moment(futureService.start).utc().format(DateFormat) + " ~ " + moment(futureService.end).utc().format(DateFormat) + "\n"
        Alert.alert(
            "Are you sure?",
            mess,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => { console.log('Cancelled') }
                },
                {
                    text: "Delete",
                    style: 'default',
                    onPress: () => handleDeleteFutureService()
                }
            ]
        )
    }

    const handleDeleteFutureService = async () => {
        let service_periods = [...servicePeriods]
        let data = {
            id: currentVessel?.id,
            onBoardStartDate: null,
            onBoardEndDate: null,
            is_signedon: false,
            service_periods: JSON.stringify(service_periods)
        };
        setSelectedPeriod(null);
        setServiceIndex(0);
        setHasFutureService(false);
        await props.actions.updateVessel(data);
        setShowServicePeriod(false);
    }

    const onDeleteTrip = (data) => {
        Alert.alert(
            'Are you sure?',
            'You are about to delete a trip. You will lose all of the tracking information for the trip.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => { console.log("Trip Deleting cancelled"); }
                },
                {
                    text: 'Delete',
                    style: 'default',
                    onPress: () => handleDeleteTrip(data)
                },
            ]
        )
    }

    const handleDeleteTrip = async (data) => {
        console.log(data);
        if (data) {
            endTracking();
            await props.actions.deleteTrip(data).then(res => { });
        }
    }

    const onEndorse = () => {
        if (currentVessel?.is_signedon && serviceIndex == 0) {
            setEndorseSignedonAlert(true);
        } else {
            handleEndorse(0);
        }
    }

    const handleEndorse = async (type) => {
        let service_periods = [...servicePeriods];
        // setShowVesselTotals(false);
        if (type == 0) {
            props.navigation.navigate('EndorseStart', { vessel: currentVessel, period: selectedPeriod, locodes, serviceIndex: serviceIndex, serviceTotals: serviceTotals });
        }
        if (type == 1) {
            let currentTimestamp = dateStringToMilli(new Date());
            service_periods[serviceIndex] = {
                start: servicePeriods[serviceIndex].start,
                end: currentTimestamp
            }
            let newPeriod = {
                start: currentTimestamp + 1,
                end: servicePeriods[serviceIndex].end
            }
            service_periods.splice(serviceIndex, 0, newPeriod);
            if (hasFutureService && futureService) {
                service_periods.unshift(futureService);
            }
            let data = {
                id: currentVessel?.id,
                service_periods: JSON.stringify(service_periods)
            };
            await props.actions.updateVessel(data).then(res => {
                props.navigation.navigate('EndorseStart', { vessel: currentVessel, period: selectedPeriod, locodes, serviceIndex: serviceIndex });
            });
        }
        if (type == 2) {
            let currentTimestamp = dateStringToMilli(new Date());
            service_periods[serviceIndex] = {
                start: servicePeriods[serviceIndex].start,
                end: currentTimestamp
            }
            if (hasFutureService && futureService) {
                service_periods.unshift(futureService);
            }
            let data = {
                id: currentVessel?.id,
                is_signedon: false,
                service_periods: JSON.stringify(service_periods)
            };
            await props.actions.updateVessel(data).then(res => {
                props.navigation.navigate('EndorseStart', { vessel: currentVessel, period: selectedPeriod, locodes, serviceIndex: serviceIndex });
            });
        }
    }

    const enableEndorse = () => {
        let enable = true;
        if (endorsements) {
            for (let i = 0; i < endorsements?.length; i++) {
                const endo = endorsements[i];
                let pid = JSON.parse(endo.period);
                if (pid.start == selectedPeriod.start && pid.end == selectedPeriod.end && (endo.approved == true)) {
                    enable = false;
                    break;
                }
            }
        }
        return enable;
    }

    const ispending = () => {
        let pending = false;
        if (endorsements) {
            for (let i = 0; i < endorsements?.length; i++) {
                const endo = endorsements[i];
                let pid = JSON.parse(endo.period);
                if (pid.start == selectedPeriod.start && pid.end == selectedPeriod.end && (endo.approved == null && endo.denied == null)) {
                    pending = true;
                    break;
                }
            }
        }
        return pending;
    }

    const onStartEndTrip = async () => {
        setComponent(null);
        setTripEndDate(new Date());
        if (!tripDetected)
            await AsyncStorage.setItem('ClickStartTrip', 'true');
        if (locationGranted == false) {
            setOpenLocationSettingsModal(true);
        } else {
            if (!tripDetected) {
                onStartTracking();
            } else {
                if (currentTrip?.start_date) {
                    ExpoLocation.getCurrentPositionAsync({
                        accuracy: ExpoLocation.Accuracy.BestForNavigation,
                        mayShowUserSettingsDialog: true
                    }).then((position) => {
                        setCurrentLocation(position);
                        props.actions.checkCurrentLocation(position).then((res => {
                            if (res.status == 'success') {
                                setEndLocation(res.message.locode)
                                setTripEndDate(new Date());
                                setOpenEndTripModal(true);
                            }
                        }))
                    }).catch((err) => {
                    })
                } else {
                    setEndTripModalWithoutStart(true)
                }
            }
        }
    }

    const saveEndTrip = () => {
        setOpenEndTripModal(false);
        setTripDetected(false);
        endTracking();
        const params = {
            user_id: user.id,
            vessel: currentVessel.id,
            end_location: endLocation,
            end_date: tripEndDate.getTime()
        }
        props.actions.endTrip(params);
        setComponent('tripStats');
        setTimeout(() => {
            setTripEndDate(new Date());
        }, 1000)
        const _user = {
            id: user.id,
            trip_in_progress: false
        }
        props.actions.updateUser(_user);
    }

    return (
        <View style={GlobalStyles.FlexContainer}>
            <ImageBackground
                source={require('../assets/images/app_bg.jpg')}
                style={styles.bgImage}
            >
                <SafeAreaView
                    style={[
                        GlobalStyles.safeView,
                    ]}
                >
                    <View style={[{ top: 10, left: 0, justifyContent: 'space-between', flexDirection: 'row', zIndex: 1 }]}>
                        <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
                            <FontAwesome5
                                name="bars"
                                style={{ marginLeft: 20, }}
                                size={28}
                                color={Colors.colorWhite}
                            />
                        </TouchableOpacity>
                        <View style={{
                            width: Dimensions.get('screen').width - 120,
                            justifyContent: 'center',
                            flexDirection: 'row',
                            alignContent: 'center'
                        }}>
                            {
                                currentVessel && (
                                    <Animated.View style={screensStyles}>
                                        <TouchableOpacity style={[{ flexDirection: 'row', alignItems: 'center' },]}
                                            onPress={async () => {
                                                await setShowVesselBasicDetail(!showVesselBasicDetail);
                                                onLayoutScrollView(showVesselServiceDetail, showVesselTotals, !showVesselBasicDetail)
                                            }}
                                            onLayout={(e) => onLoadTitle(e)}
                                        >
                                            {
                                                !pro && currentVessel?.isDefault && (
                                                    <TouchableOpacity style={{ backgroundColor: '#ffffff', width: 20, height: 20, marginRight: 5, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                                                        <Ionicons name={"ios-checkmark-done-sharp"} color={"#0044ff"} size={16} />
                                                    </TouchableOpacity>
                                                )
                                            }
                                            <Text style={{
                                                fontSize: width / 19,
                                                fontFamily: 'SourceSansPro-Regular',
                                                letterSpacing: -0.3,
                                                textAlign: 'center',
                                                fontWeight: '600',
                                                color: '#ffffff',
                                                textTransform: 'capitalize',
                                                marginTop: -4
                                            }}
                                            >{currentVessel?.name}</Text>
                                            <View style={{ paddingLeft: 5 }}>
                                                <FontAwesome5 name={showVesselBasicDetail ? 'chevron-up' : 'chevron-down'} color={'#ffffff'} size={14} />
                                            </View>
                                        </TouchableOpacity>
                                    </Animated.View>
                                )
                            }
                        </View>
                        <TouchableOpacity onPress={() => props.navigation.navigate('AddVessel')}>
                            <View
                                style={{
                                    backgroundColor: Colors.colorWhite,
                                    borderRadius: 50,
                                    alignItems: 'center',
                                    marginRight: 20
                                }}
                            >
                                <MaterialCommunityIcons
                                    name="plus"
                                    size={28}
                                    color={Colors.colorGreen}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    {
                        showVesselBasicDetail && (
                            <View style={{
                                // backgroundColor: '#f999ee66',
                                paddingHorizontal: 25,
                                paddingTop: 30,
                                paddingBottom: 20
                            }}>
                                <View style={styles.vesselDetailListItem}>
                                    <Text style={styles.vesselDetailLabel}>Vessel type</Text>
                                    <Text style={styles.vesselDetail}>{currentVessel?.type}</Text>
                                </View>
                                <View style={styles.vesselDetailListItem}>
                                    <Text style={styles.vesselDetailLabel}>LOA</Text>
                                    <Text style={styles.vesselDetail}>{currentVessel?.length}</Text>
                                </View>
                                {
                                    currentVessel?.grossTonnage && (
                                        <View style={styles.vesselDetailListItem}>
                                            <Text style={styles.vesselDetailLabel}>Gross tonnage (GT)</Text>
                                            <Text style={styles.vesselDetail}>{currentVessel?.grossTonnage}</Text>
                                        </View>
                                    )
                                }
                                {
                                    currentVessel?.flag && (
                                        <View style={{ ...styles.vesselDetailListItem, borderBottomWidth: 0 }}>
                                            <Text style={styles.vesselDetailLabel}>Flag</Text>
                                            <Text style={styles.vesselDetail}>{currentVessel?.flag}</Text>
                                        </View>
                                    )
                                }
                            </View>
                        )
                    }
                    <Animated.View
                        style={[
                            {
                                marginTop: marginTop,
                                flexDirection: 'row',
                                borderBottomWidth: 1,
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                // height: height
                            },
                        ]}
                    >
                        <Animated.View
                            opacity={opacity}
                            style={{
                                flex: 1,
                                // height: 60,
                                marginBottom: 16,
                                alignItems: 'center',
                                borderRightWidth: 2,
                                borderRightColor: 'rgba(255, 255, 255, 0.3)',
                            }}
                        >
                            <Text
                                style={[
                                    styles.counterText,
                                    {
                                        fontSize: width / 15,
                                    },
                                ]}
                            >
                                {tripTotalAmount}
                            </Text>
                            <Text style={styles.counterSubText}>TRIPS</Text>
                        </Animated.View>
                        <Animated.View
                            style={{
                                flex: 1,
                                height: 60,
                                marginBottom: 16,
                                alignItems: 'center',
                            }}
                        >
                            <View style={{ flexDirection: 'row', flexWrap: 'nowrap' }}>
                                <Animated.Text
                                    style={[
                                        styles.counterText,
                                        {
                                            fontSize: mileFontSize,
                                        },
                                        nmPosition
                                    ]}
                                    onLayout={(e) => onLoadMileText(e)}
                                    onPress={async () => {
                                        // setShowAlert(true)
                                        // setReload(true)
                                        // let ves = await props.actions.getVessels({ user: user.id });
                                        // console.log('vessels')
                                        // console.log(ves)
                                        // setVessels(ves)
                                        // let trs = await props.actions.getTrips({ user_id: user.id });
                                        // setTrips(trs)
                                        // _setTripHistory(trs, currentVessel)
                                        // setReload(false)
                                        console.log('setting ....');
                                        // await AsyncStorage.setItem('trip_detected', 'true');
                                        localStorage.set('trip_detected', 'true');
                                    }}
                                >
                                    {totalNMiles}
                                </Animated.Text>
                                <Animated.Text
                                    opacity={nm_unit_opacity}
                                    style={[
                                        styles.counterText,
                                        {
                                            fontSize: mileFontSize,
                                            marginRight: -45
                                        },
                                        nmPosition
                                    ]}
                                >
                                    nm
                                </Animated.Text>
                            </View>
                            <Animated.Text opacity={opacity} style={styles.counterSubText}>
                                TOTAL NMILES
                            </Animated.Text>
                        </Animated.View>
                        <Animated.View
                            opacity={opacity}
                            style={{
                                flex: 1,
                                height: 60,
                                marginBottom: 16,
                                alignItems: 'center',
                                borderLeftWidth: 2,
                                borderLeftColor: `rgba(255, 255, 255, .3)`,
                            }}
                        >
                            <Text
                                style={[
                                    styles.counterText,
                                    {
                                        fontSize: width / 15,
                                    },
                                ]}
                            >
                                {daysUnderway}
                            </Text>
                            <Text style={styles.counterSubText}>DAYS UNDERWAY</Text>
                        </Animated.View>
                    </Animated.View>
                    <View
                        style={[
                            // styles.container,
                            {
                                width: screenWidth,
                                paddingHorizontal: 20,
                                paddingBottom: 47.5
                            },
                        ]}
                    >
                        {
                            reload && (
                                <View style={{
                                    width: '100%',
                                    height: '90%',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <ActivityIndicator size="large" color="#fff" />
                                </View>
                            )
                        }
                        {
                            !reload && (
                                <>
                                    {
                                        currentVessel && pro && (
                                            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', paddingTop: 20 }}>
                                                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                                                        onPress={() => {
                                                            setShowVesselServiceDetail(!showVesselServiceDetail);
                                                            onLayoutScrollView(!showVesselServiceDetail, showVesselTotals, showVesselBasicDetail)
                                                        }}
                                                    >
                                                        <Text style={{
                                                            fontSize: width / 22.5, fontFamily: 'Roboto-Regular', fontWeight: '500', letterSpacing: -0.3, textAlign: 'center', color: '#97d3ff', textTransform: 'uppercase', paddingHorizontal: 5
                                                        }}
                                                        >
                                                            {serviceIndex != 0 ? "Signed off" : currentVessel?.is_signedon ? 'Signed on' : 'Signed off'}
                                                        </Text>
                                                        <FontAwesome5 name={showVesselServiceDetail ? 'chevron-up' : 'chevron-down'} color={'#ffffff'} size={19} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={{ paddingTop: 6, height: 24 }} onPress={() => {
                                                        selectedPeriod && setShowVesselTotals(!showVesselTotals);
                                                        selectedPeriod && calculateServiceTotals();
                                                    }}>
                                                        {
                                                            selectedPeriod && (
                                                                <Text style={{ fontSize: width / 33, fontWeight: '400', letterSpacing: -0.3, textAlign: 'center', fontFamily: 'Roboto-Regular', color: '#ffffff' }}>
                                                                    {moment(Math.round(selectedPeriod?.start)).utc().format('DD-MMM YYYY')}
                                                                    {' to '}
                                                                    {selectedPeriod?.end ? moment(Math.round(selectedPeriod?.end)).utc().format('DD-MMM YYYY ...') : "(End date N/A)"}
                                                                </Text>
                                                            )
                                                        }
                                                    </TouchableOpacity>
                                                </View>
                                                {
                                                    servicePeriods?.length > 1 && serviceIndex > 0 && (
                                                        <TouchableOpacity style={{
                                                            position: 'absolute',
                                                            left: 0,
                                                            top: 40,
                                                            transform: [{ rotate: '180deg' }]
                                                        }}
                                                            onPress={() => {
                                                                setReload(true);
                                                                setTripDetected(false);
                                                                onLayoutScrollView(false, false, false);
                                                                let ti = Math.max(serviceIndex - 1, 0);
                                                                setSelectedPeriod(servicePeriods[ti]);
                                                                getTripAmount(currentVessel, servicePeriods[ti]);
                                                                setShowVesselServiceDetail(false);
                                                                setShowVesselTotals(false);
                                                                _setTripHistory(trips, currentVessel, servicePeriods[ti]);
                                                                setServiceIndex(ti);
                                                                setTimeout(() => {
                                                                    setReload(false);
                                                                }, 1000)
                                                            }}
                                                        >
                                                            <LongRightArrowIcon />
                                                        </TouchableOpacity>
                                                    )
                                                }
                                                {
                                                    servicePeriods?.length > 1 && serviceIndex < servicePeriods?.length - 1 && (
                                                        <TouchableOpacity style={{
                                                            position: 'absolute',
                                                            right: 0,
                                                            top: 40
                                                        }}
                                                            onPress={() => {
                                                                setReload(true);
                                                                setTripDetected(false);
                                                                onLayoutScrollView(false, false, false);
                                                                let ti = Math.min(serviceIndex + 1, servicePeriods?.length - 1);
                                                                setServiceIndex(ti);
                                                                setSelectedPeriod(servicePeriods[ti]);
                                                                getTripAmount(currentVessel, servicePeriods[ti]);
                                                                setShowVesselServiceDetail(false);
                                                                setShowVesselTotals(false);
                                                                _setTripHistory(trips, currentVessel, servicePeriods[ti]);
                                                                setTimeout(() => {
                                                                    setReload(false);
                                                                }, 1000)
                                                            }}
                                                        >
                                                            <LongRightArrowIcon />
                                                        </TouchableOpacity>
                                                    )
                                                }
                                            </View>
                                        )
                                    }
                                    <ScrollView
                                        style={{
                                            height: serviceOptionHeight()
                                        }}
                                        bounces={false}
                                        showsVerticalScrollIndicator={false}
                                    >
                                        <View style={{ flex: 1 }}>
                                            {
                                                showVesselServiceDetail && (
                                                    <View style={{
                                                        width: '100%',
                                                        marginTop: 20
                                                    }}>
                                                        <TouchableOpacity style={{ ...styles.vesselDetailListItem, paddingVertical: 12 }}
                                                            disabled={!selectedPeriod}
                                                            onPress={() => {
                                                                if (!enableEndorse() || ispending()) return;
                                                                setAbsenceStart(null);
                                                                setAbsenceEnd(null);
                                                                setPeriodId(null);
                                                                setShowAbsence(true);
                                                            }}
                                                        >
                                                            <Text style={[{ ...styles.vesselDetailLabel, fontSize: width / 21 }, (!selectedPeriod) && { color: '#b0b0b799' }]}>Take leave of absence</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{ ...styles.vesselDetailListItem, paddingVertical: 12 }}
                                                            disabled={!selectedPeriod}
                                                            onPress={() => {
                                                                if (!enableEndorse() || ispending()) return;
                                                                setYardStart(null);
                                                                setYardEnd(null);
                                                                setPeriodId(null);
                                                                setShowYardPeriod(true);
                                                            }}
                                                        >
                                                            <Text style={[{ ...styles.vesselDetailLabel, fontSize: width / 21 }, (!selectedPeriod) && { color: '#b0b0b799' }]}>Enter yard period</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{ ...styles.vesselDetailListItem, paddingVertical: 12 }} onPress={() => {
                                                            if (!enableEndorse() || ispending()) return;
                                                            if (selectedPeriod)
                                                                setServiceStart(selectedPeriod?.start)
                                                            else setServiceStart(new Date());
                                                            if (selectedPeriod)
                                                                setServiceEnd(selectedPeriod?.end);
                                                            setIsEdit(true);
                                                            setShowServicePeriod(true);
                                                        }}
                                                            disabled={!selectedPeriod || tripDetected}
                                                        >
                                                            <Text style={[{ ...styles.vesselDetailLabel, fontSize: width / 21 }, !selectedPeriod && { color: '#b0b0b799' }]}>Edit service period</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            style={[{ ...styles.vesselDetailListItem, paddingVertical: 15 }, (currentVessel?.is_signedon && serviceIndex == 0) && { borderBottomWidth: 0 }]}
                                                            onPress={() => {
                                                                if (ispending()) return;
                                                                currentVessel?.service_periods != null && onDeleteServicePeriod()
                                                            }}
                                                            disabled={!selectedPeriod}
                                                        >
                                                            <Text style={[{ ...styles.vesselDetailLabel, fontSize: width / 21 }, !selectedPeriod && { color: '#b0b0b799' }]}>Delete service period</Text>
                                                        </TouchableOpacity>
                                                        {
                                                            (!(currentVessel?.is_signedon && serviceIndex == 0)) && (
                                                                <TouchableOpacity style={{ ...styles.vesselDetailListItem, borderBottomWidth: 0, paddingVertical: 12 }}
                                                                    onPress={() => {
                                                                        if (!enableEndorse() || ispending()) return;
                                                                        setIsEdit(false);
                                                                        setShowServicePeriod(true);
                                                                    }}
                                                                    disabled={signedOnVessel || (!signedOnVessel && hasFutureService)}
                                                                >
                                                                    <Text
                                                                        style={[
                                                                            { ...styles.vesselDetailLabel, fontSize: width / 21 },
                                                                            (signedOnVessel || (!signedOnVessel && hasFutureService)) && { color: '#b0b0b799' }
                                                                        ]}>Sign on to {currentVessel?.name.toUpperCase()}</Text>
                                                                </TouchableOpacity>
                                                            )
                                                        }
                                                    </View>
                                                )
                                            }
                                            {
                                                showVesselTotals && serviceTotals && (
                                                    <View style={{
                                                        width: ScreenWidth - 40,
                                                        marginBottom: 20,
                                                    }}>
                                                        <View style={{ ...styles.newVesselContainer, padding: 0, paddingBottom: 20, marginTop: 10 }}>
                                                            {
                                                                (enableEndorse()) && (
                                                                    <CustomButton
                                                                        title={ispending() ? "Endorsement pending.." : 'Endorse sea service'}
                                                                        containerStyle={[{ height: 52, width: '85%', borderRadius: 7, marginTop: 20 }, noTrip && { backgroundColor: Colors.colorGrey4, borderColor: Colors.colorGrey3 }, ispending() && { backgroundColor: Colors.colorWhite, borderColor: Colors.colorGreen }]}
                                                                        textStyle={{ color: ispending() ? Colors.colorGreen : 'white' }}
                                                                        onPress={() => !ispending() && onEndorse()}
                                                                        disable={noTrip}
                                                                    />
                                                                )
                                                            }
                                                            <View style={{ padding: width / 30, paddingRight: 0, paddingBottom: 0, width: '100%' }}>
                                                                {pro && <Item title={'Onboard service'} value={serviceTotals.onboard_service != null ? `${serviceTotals.onboard_service} days` : '--'} textStyle={{ fontWeight: '700' }} />}
                                                                {pro && <Item title={'On leave'} value={serviceTotals.leave != null ? `${serviceTotals.leave} days` : '--'} textStyle={{ paddingLeft: width / 35, fontSize: width / 25 }} />}
                                                                {pro && <Item title={'Yard service'} value={serviceTotals.yard != null ? `${serviceTotals.yard} days` : '--'} textStyle={{ paddingLeft: width / 35, fontSize: width / 25 }} />}
                                                                <Item title={'Underway'} value={serviceTotals.underway != null ? `${serviceTotals.underway} days` : '--'} textStyle={{ fontWeight: '700' }} />
                                                                {pro && <Item title={'Watchkeeping'} value={serviceTotals.watchkeeping != null ? `${serviceTotals.watchkeeping} days` : '--'} textStyle={{ paddingLeft: width / 35, fontSize: width / 25 }} />}
                                                                {pro && <Item title={'Standby'} value={serviceTotals.standby != null ? `${serviceTotals.standby} days` : '--'} textStyle={{ paddingLeft: width / 35, fontSize: width / 25 }} />}
                                                                <Item title={'Average hours underway per day'} value={serviceTotals.av_hours_underway_per_day != null ? `${serviceTotals.av_hours_underway_per_day} hrs` : '--'} textStyle={{ paddingLeft: width / 35, fontSize: width / 25 }} />
                                                                <Item title={'Average distance offshore'} value={serviceTotals.av_distance_offshore != null ? `${serviceTotals.av_distance_offshore} nm` : '--'} textStyle={{ paddingLeft: width / 35, fontSize: width / 25 }} />
                                                                {pro && <Item title={'USCG Stats'} value={''} textStyle={{ fontWeight: '700' }} />}
                                                                {pro && <Item title={'Seaward of boundary line'} value={serviceTotals.seaward != null ? `${serviceTotals.seaward} days` : '--'} textStyle={{ paddingLeft: width / 35, fontSize: width / 25 }} />}
                                                                {pro && <Item title={'Shoreward of boundary line'} value={serviceTotals.shoreward != null ? `${serviceTotals.shoreward} days` : '--'} textStyle={{ paddingLeft: width / 35, fontSize: width / 25 }} />}
                                                                {pro && <Item title={'On great lakes'} value={serviceTotals.lakes != null ? `${serviceTotals.lakes} days` : '--'} textStyle={{ paddingLeft: width / 35, fontSize: width / 25 }} containerStyle={{ borderBottomWidth: 0, paddingBottom: 0 }} />}
                                                            </View>
                                                        </View>
                                                    </View>
                                                )
                                            }
                                        </View>
                                    </ScrollView>
                                    <View
                                        style={[
                                            // styles.container,
                                            {
                                                marginTop: 20,
                                                borderRadius: 7,
                                                position: 'relative',
                                                // overflow: 'hidden',
                                                paddingBottom: screenHeight * 0.2,
                                                height: screenHeight,
                                            },
                                        ]}
                                    >
                                        <Animated.ScrollView
                                            showsVerticalScrollIndicator={false}
                                            onScroll={
                                                Animated.event(
                                                    [{ nativeEvent: { contentOffset: { y: scrollDistance } } }],
                                                    {
                                                        useNativeDriver: true
                                                    }
                                                )}
                                            scrollEventThrottle={Platform.select({ ios: 16, android: 100 })}
                                            directionalLockEnabled={false}
                                            scrollEnabled={true}
                                            bounces={false}
                                            onLayout={() => onLayoutScrollView()}
                                            style={{
                                                // height: scrollViewHeight,
                                                paddingBottom: screenHeight * 0.5,
                                            }}
                                        >
                                            {/* {
                                                locationGranted !== null && locationGranted == false && (
                                                    <View style={{ ...styles.newVesselContainer, marginTop: 0 }}>
                                                        <Text style={{
                                                            fontSize: width / 26,
                                                            fontFamily: 'Roboto-Bold',
                                                            lineHeight: 22,
                                                            color: '#ff5555',

                                                        }}>Location Permission is not granted.</Text>
                                                        <View style={{
                                                            justifyContent: 'flex-start',
                                                            alignItems: 'flex-start',
                                                            marginVertical: 10
                                                        }}>
                                                            <Text style={{ ...styles.alertText }}>1. Go to <Text style={{ fontFamily: 'SourceSansPro-Bold' }}>Settings&#8594;Crewlog</Text></Text>
                                                            <Text style={{ ...styles.alertText }}>2. Select <Text style={{ fontFamily: 'SourceSansPro-Bold' }}>Location</Text></Text>
                                                            <Text style={{ ...styles.alertText }}>3. Select <Text style={{ fontFamily: 'SourceSansPro-Bold' }}>Always</Text></Text>
                                                            <Text style={{ ...styles.alertText }}>4. Ensure <Text style={{ fontFamily: 'SourceSansPro-Bold' }}>Precise Location</Text> is switched ON</Text>
                                                        </View>
                                                    </View>
                                                )
                                            } */}
                                            {
                                                serviceIndex == 0 && ((pro && currentVessel?.is_signedon) || (!pro && currentVessel?.isDefault)) && (
                                                    <CustomButton
                                                        title={!tripDetected ? 'Start a trip' : 'End trip'}
                                                        containerStyle={[{ height: 52, borderRadius: 7, marginTop: 10, width: '100%' }, tripDetected && { backgroundColor: '#d43434', borderColor: '#d43434' }, isInyard(vessels) && { backgroundColor: '#c6c6c8', borderColor: '#c6c6c8' }]}
                                                        textStyle={{ color: 'white' }}
                                                        disable={isInyard(vessels)}
                                                        onPress={() => onStartEndTrip()}
                                                    />
                                                )
                                            }
                                            {
                                                user?.is_first == null && (
                                                    <View style={styles.newVesselContainer}>
                                                        <Text
                                                            style={{
                                                                flex: 1,
                                                                alignItems: 'center',
                                                                fontFamily: 'Roboto-Regular',
                                                                fontSize: width / 19,
                                                                color: Colors.colorWhite,
                                                                textAlign: 'center',
                                                                marginBottom: 15,
                                                                letterSpacing: -0.41,
                                                                fontWeight: '500',
                                                            }}
                                                        >
                                                            Get started by adding your first vessel now..
                                                        </Text>
                                                        <Text style={{
                                                            fontFamily: 'Roboto-Regular',
                                                            fontSize: width / 23,
                                                            color: Colors.colorWhite,
                                                            textAlign: 'center',
                                                            fontWeight: '300',
                                                            width: 270
                                                        }}>
                                                            You must enter a vessel in order to track time at sea
                                                        </Text>
                                                        <CustomButton
                                                            title={'Add vessel now'}
                                                            containerStyle={{ height: 52, borderRadius: 7, marginTop: 10 }}
                                                            textStyle={{ color: 'white' }}
                                                            onPress={() =>
                                                                props.navigation.navigate('AddVessel')
                                                            }
                                                        />
                                                    </View>
                                                )
                                            }
                                            {
                                                pro && user?.transactionId == null && tripRemain == 0 && (
                                                    <View style={styles.newVesselContainer}>
                                                        <Text
                                                            style={{
                                                                flex: 1,
                                                                alignItems: 'center',
                                                                fontFamily: 'Roboto-Regular',
                                                                fontSize: width / 19,
                                                                color: Colors.colorWhite,
                                                                textAlign: 'center',
                                                                marginBottom: 15,
                                                                letterSpacing: -0.41,
                                                                fontWeight: '500',
                                                            }}
                                                        >Your free trips are almost over</Text>
                                                        <Text style={{
                                                            flex: 1,
                                                            alignItems: 'center',
                                                            fontFamily: 'Roboto-Regular',
                                                            fontSize: width / 24.5,
                                                            color: Colors.colorWhite,
                                                            textAlign: 'center',
                                                            marginBottom: 15,
                                                            letterSpacing: -0.3,
                                                            fontWeight: '500',
                                                        }}>Upgrade now and get unlimited trips so you can keep logging your time at sea</Text>
                                                        <CustomButton
                                                            title={'Upgrade now'}
                                                            containerStyle={{ height: 52, borderRadius: 7, marginTop: 10 }}
                                                            textStyle={{ color: 'white' }}
                                                            onPress={() => { }}
                                                        />
                                                    </View>
                                                )
                                            }
                                            {
                                                (hasFutureService && serviceIndex == 0) && (
                                                    <FutureService
                                                        start={futureService?.start}
                                                        end={futureService?.end}
                                                        user={user}
                                                        vessel={currentVessel}
                                                        editLeave={() => {
                                                            if (futureService?.start)
                                                                setServiceStart(futureService?.start)
                                                            else setServiceStart(new Date());
                                                            if (futureService?.end)
                                                                setServiceEnd(futureService?.end);
                                                            setIsEdit(true);
                                                            setEditFutureService(true);
                                                            setShowServicePeriod(true);
                                                        }}
                                                    />
                                                )
                                            }
                                            {/* {
                                                currentVessel && user && tripDetected && (
                                                    <TripDetectionCard
                                                        key={'trip_detected'}
                                                        vessel={currentVessel}
                                                        user={user}
                                                        tripDetected={true}
                                                    />
                                                )
                                            } */}
                                            {
                                                currentVessel && (
                                                    currentVessel?.onboardServices?.length > 0 && (
                                                        currentVessel?.onboardServices.map((item, key) => {
                                                            let start = selectedPeriod ? parseInt(selectedPeriod.start) : null;
                                                            let end = selectedPeriod ? parseInt(selectedPeriod.end) : null;
                                                            if (start && pro) {
                                                                if (end) {
                                                                    if (parseInt(item?.ended_at) < start || parseInt(item?.started_at) > end) {
                                                                        return;
                                                                    }
                                                                    if (parseInt(item?.ended_at) > end) {
                                                                        return;
                                                                    }
                                                                } else {
                                                                    if (parseInt(item?.started_at) < start) {
                                                                        return;
                                                                    }
                                                                }
                                                            }
                                                            if (!selectedPeriod && pro) return;
                                                            if (item.type == 'onleave') {
                                                                var onleave_key = `onleave_${key}`;
                                                                return (
                                                                    <TripDetectionCard
                                                                        key={onleave_key}
                                                                        vessel={currentVessel}
                                                                        user={user}
                                                                        leaveStart={item.started_at ? parseInt(item.started_at) : null}
                                                                        leaveEnd={item.ended_at ? parseInt(item.ended_at) : null}
                                                                        editLeave={() => {
                                                                            if (!enableEndorse() || ispending()) return;
                                                                            setAbsenceStart(item.started_at);
                                                                            setAbsenceEnd(item.ended_at);
                                                                            setPeriodId(item.id);
                                                                            setShowAbsence(true);
                                                                        }}
                                                                        tripDetected={false}
                                                                    />
                                                                )
                                                            }
                                                            if (item.type == 'inyard') {
                                                                var inyard_key = `inyard_${key}`;
                                                                return (
                                                                    <TripDetectionCard
                                                                        key={inyard_key}
                                                                        vessel={currentVessel}
                                                                        user={user}
                                                                        yardStart={item.started_at ? parseInt(item.started_at) : null}
                                                                        yardEnd={item.ended_at ? parseInt(item.ended_at) : null}
                                                                        editYard={() => {
                                                                            if (!enableEndorse() || ispending()) return;
                                                                            setYardStart(item.started_at);
                                                                            setYardEnd(item.ended_at);
                                                                            setPeriodId(item.id);
                                                                            setShowYardPeriod(true);
                                                                        }}
                                                                        tripDetected={false}
                                                                    />
                                                                )
                                                            }
                                                            if (item.type == 'trip') {
                                                                let tps = item.trip;
                                                                if (tps == null) return;
                                                                let departure, destination = null;
                                                                locodes.map((loc) => {
                                                                    if (tps.start_location == loc.objectid) {
                                                                        departure = loc;
                                                                    }
                                                                    if (tps.end_location != null && tps.end_location == loc.objectid) {
                                                                        destination = loc;
                                                                    }
                                                                })
                                                                let watchkeeping = false;
                                                                let showWatchkeeping = false, showStandbyService = false, showUscgStatistics = false;
                                                                let vessel;
                                                                for (let i = 0; i < vessels.length; i++) {
                                                                    const vess = vessels[i];
                                                                    if (vess.id == tps.vessel) {
                                                                        watchkeeping = vess.autologWatchkeeping;
                                                                        showWatchkeeping = vess.showWatchkeeping;
                                                                        showStandbyService = vess.showStandbyService;
                                                                        showUscgStatistics = vess.showUscgStatistics
                                                                        vessel = vess;
                                                                        break;
                                                                    }
                                                                }
                                                                if (tps.end_date == null && !tripDetected) {
                                                                    setTripDetected(true);
                                                                    setCurrentTrip(tps);
                                                                }

                                                                return (
                                                                    <Trip
                                                                        key={key}
                                                                        editUnderway={() => {
                                                                            if (!enableEndorse() || ispending()) return;
                                                                            setSelectedTrip(tps)
                                                                            setUnderwayStart(tps.start_date);
                                                                            setUnderwayEnd(tps.end_date);
                                                                            setShowUnderway(true)
                                                                        }}
                                                                        component={tripEndDate.getTime() == tps.end_date ? component : null}
                                                                        showStatsModal={(trip, name, key) => {
                                                                            if (!enableEndorse() || ispending()) return;
                                                                            setShowStatsModal(true)
                                                                            setSelectedTrip(trip)
                                                                            setStatsName(name)
                                                                            setStatsKey(key)
                                                                        }}
                                                                        trip={tps}
                                                                        departure={departure}
                                                                        destination={destination}
                                                                        navigation={props.navigation}
                                                                        user={user}
                                                                        watchkeeping={watchkeeping}
                                                                        vessel={vessel}
                                                                        updateTrip={async (trip) => {
                                                                            if (!enableEndorse() || ispending()) return;
                                                                            let data = {
                                                                                id: trip.id,
                                                                                vessel: trip.vessel,
                                                                                trip_note: trip.trip_note
                                                                            };
                                                                            let _trips = await props.actions.updateTrip(data)
                                                                            setTrips(_trips)
                                                                        }}
                                                                        setFirstTripAlert={() => onSetFirstTripAlert()}
                                                                        deleteTrip={async (data) => {
                                                                            if (!enableEndorse() || ispending()) return;
                                                                            onDeleteTrip(data)
                                                                        }}
                                                                    />
                                                                )
                                                            }
                                                        })
                                                    )
                                                )
                                            }
                                            {
                                                noTrip && currentVessel && !tripDetected && (
                                                    <View
                                                        style={[
                                                            styles.container,
                                                            {
                                                                flexDirection: 'row',
                                                                paddingTop: 25,
                                                                flexDirection: 'column',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                borderStyle: 'dashed',
                                                                borderWidth: 1,
                                                                borderColor: Colors.colorWhite,
                                                                borderRadius: 7,
                                                                backgroundColor: '#ffffff36',
                                                                paddingBottom: 0,
                                                                marginBottom: 0,
                                                                marginTop: 20
                                                            },
                                                        ]}
                                                    >
                                                        <View style={{
                                                            ...styles.container,
                                                            paddingHorizontal: 26,
                                                            paddingTop: 19
                                                        }}>
                                                            <Text
                                                                style={{
                                                                    flex: 1,
                                                                    alignItems: 'center',
                                                                    fontFamily: 'Roboto-Regular',
                                                                    fontSize: width / 23,
                                                                    letterSpacing: -0.3,
                                                                    color: Colors.colorWhite,
                                                                    textAlign: 'center',
                                                                    fontWeight: '300'
                                                                }}
                                                            >Trips cards will appear here for this vessel when we track your time at sea</Text>

                                                        </View>
                                                        <View style={{
                                                            ...styles.container,
                                                            paddingHorizontal: 26,
                                                            paddingVertical: 25,
                                                            width: '80%',
                                                            height: 'auto'
                                                        }}>
                                                            <ImageBackground
                                                                source={require('../../assets/trip_card.png')}
                                                                resizeMode={'contain'}
                                                                style={{ width: width, height: 400, justifyContent: 'center', alignItems: 'center' }}
                                                                imageStyle={{ width: '100%', height: '100%' }}
                                                            >
                                                                <View style={{ backgroundColor: '#fff', width: 79.5, height: 79.5, borderRadius: 79.5, alignItems: 'center', justifyContent: 'center' }}>
                                                                    <View style={{ ...styles.vesselDetailIcon, shadowColor: '#5AC8FA', backgroundColor: '#5AC8FA', }}>
                                                                        <FontAwesome5
                                                                            name="map-marked-alt"
                                                                            size={18}
                                                                            color={Colors.colorWhite}
                                                                        />
                                                                    </View>
                                                                </View>
                                                                <CustomButton
                                                                    title={'View sample trip card'}
                                                                    containerStyle={{ height: 52, borderRadius: 7, marginTop: 10, marginBottom: 10, backgroundColor: 'transparent', borderWidth: 0 }}
                                                                    textStyle={{ color: 'white' }}
                                                                    onPress={() => setShowSampleTrip(true)}
                                                                />
                                                            </ImageBackground>

                                                        </View>
                                                        {/* <Trip
                                                            key={0}
                                                            editUnderway={() => { }}
                                                            showStatsModal={(trip, name, key) => { }}
                                                            trip={sampleTrip}
                                                            departure={sampleDeparture}
                                                            destination={sampleDestination}
                                                            navigation={props.navigation}
                                                            user={{ ...user }}
                                                            watchkeeping={null}
                                                            vessel={sampleVessel}
                                                            updateTrip={async (trip) => { }}
                                                            setFirstTripAlert={() => onSetFirstTripAlert()}
                                                            style={{
                                                                marginBottom: 0,
                                                            }}
                                                            deleteTrip={() => { }}
                                                        /> */}
                                                    </View>
                                                )
                                            }
                                            <View style={{ height: screenHeight * .1 }}></View>
                                        </Animated.ScrollView>
                                    </View>
                                </>
                            )
                        }

                    </View>
                </SafeAreaView>
                {
                    showAbsence && (
                        <CustomDatePicker
                            title={'Leave of absence'}
                            onClose={() => {
                                setShowAbsence(false);
                            }}
                            onSave={(s, e) => handleSaveAbsence(s, e)}
                            startDate={absenceStart}
                            endDate={absenceEnd}
                            buttonText={'Save'}
                            deleteLeave={() => handleDeleteAbsence()}
                        />
                    )
                }
                {
                    showYardPeriod && (
                        <CustomDatePicker
                            title={'Yard service'}
                            onClose={() => {
                                setShowYardPeriod(false);
                            }}
                            onSave={(s, e) => handleSaveYard(s, e)}
                            startDate={yardStart}
                            endDate={yardEnd}
                            buttonText={'Save'}
                            deleteYard={() => handleDeleteYard()}
                        />
                    )
                }
                {
                    showServicePeriod && (
                        <CustomDatePicker
                            title={"Onboard service"}
                            onClose={() => {
                                setIsEdit(false);
                                setEditFutureService(false);
                                setShowServicePeriod(false);
                            }}
                            startDate={editFutureService ? futureService?.start : selectedPeriod?.start || serviceStart}
                            endDate={editFutureService ? futureService?.end : selectedPeriod?.end || serviceEnd}
                            setStartDate={(date) => setServiceStart(date)}
                            setEndDate={(date) => setServiceEnd(date)}
                            buttonText={'Save'}
                            is_signedon={currentVessel?.is_signedon}
                            updateVessel={(is_signedon, s, e) => handleSelectServicePeriod(s, e, is_signedon)}
                            deleteService={(hasFutureService && serviceIndex == 0) ? () => onDeleteFutureService() : null}
                        />
                    )
                }
                {
                    showUnderway && (
                        <CustomDatePicker
                            title={'Underway'}
                            onClose={() => setShowUnderway(false)}
                            startDate={underwayStart}
                            endDate={underwayEnd}
                            setStartDate={(date) => setUnderwayStart(date)}
                            setEndDate={(date) => setUnderwayEnd(date)}
                            buttonText={'Save'}
                            updateTrip={async (d, s, e) => {
                                let _tr = { ...selectedTrip }
                                _tr.underway = d;
                                _tr.start_date = s;
                                _tr.end_date = e;
                                setSelectedTrip(_tr);
                                setTripUpdateAlert(true);
                            }}
                        />
                    )
                }
                <Modal
                    isOpen={showSampleTrip}
                    onClosed={() => setShowSampleTrip(false)}
                    style={{ ...styles.modal, backgroundColor: 'transparent', height: 200 }}
                    position={'center'}
                >
                    <View style={{ ...styles.centeredView, marginHorizontal: 14 }}>
                        <View style={{ backgroundColor: Colors.colorGreen, borderRadius: 11 }}>
                            <View style={{ flexDirection: 'row', width: '100%', padding: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ ...styles.modalBodyText, fontWeight: '400', width: '100%', textAlign: 'center' }}>Sample Trip Card</Text>
                                <View style={{ position: 'absolute', right: 14 }}>
                                    <EvilIcons name="close" size={30} color="#ffffff" onPress={() => setShowSampleTrip(false)} />
                                </View>
                            </View>
                            <Trip
                                key={0}
                                showStatsModal={(trip, name, key) => { }}
                                trip={sampleTrip}
                                departure={sampleDeparture}
                                destination={sampleDestination}
                                navigation={props.navigation}
                                user={{ ...user }}
                                watchkeeping={null}
                                vessel={sampleVessel}
                                updateTrip={async (trip) => { }}
                                setFirstTripAlert={() => onSetFirstTripAlert()}
                                style={{
                                    marginBottom: 0,
                                    marginTop: 0
                                }}
                                deleteTrip={() => { }}
                            />
                        </View>
                    </View>
                </Modal>
                <Modal
                    isOpen={tripUpdateAlert}
                    onClosed={() => setTripUpdateAlert(false)}
                    style={{ ...styles.modal, width: 300, height: 200 }}
                    position={'center'}
                >
                    <View style={{ ...styles.centeredView }}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalHeaderText}>Trip Alert</Text>
                        </View>
                        <View style={{ ...styles.modalBody, }}>
                            <Text style={{ ...styles.modalBodyText }}>You are changing the days underway that we detected. Are you sure you want to do that?</Text>
                        </View>
                        <View style={{ ...styles.modalFooter, flexDirection: 'row' }}>
                            <TouchableOpacity style={{ width: '50%', borderRightColor: '#8e8e8e', borderRightWidth: .5, justifyContent: 'center', alignItems: 'center' }} onPress={() => setTripUpdateAlert(false)}>
                                <Text style={{ ...styles.footerActionText }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}
                                onPress={async () => {
                                    let data = {
                                        id: selectedTrip.id,
                                        vessel: selectedTrip.vessel,
                                        underway: selectedTrip.underway,
                                        start_date: selectedTrip.start_date,
                                        end_date: selectedTrip.end_date,
                                        watchkeeping: currentVessel?.autologWatchkeeping ? selectedTrip.underway : 0
                                    }
                                    let _trips = await props.actions.updateTrip(data)
                                    setTrips(_trips)
                                    setTripUpdateAlert(false);
                                    setShowUnderway(false)
                                }}
                            >
                                <Text style={{ ...styles.footerActionText }}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    isOpen={endorseSignedonAlert}
                    onClosed={() => setEndorseSignedonAlert(false)}
                    style={{ ...styles.modal, backgroundColor: '#ffffff', width: 300, height: 270 }}
                    position={'center'}
                >
                    <View style={{ ...styles.centeredView }}>
                        <View style={{ flexDirection: 'row', width: '100%', padding: 20, justifyContent: 'flex-end', alignItems: 'center' }}>
                            <View style={{ position: 'absolute', right: 0 }}>
                                <EvilIcons name="close" size={30} color="#000000" onPress={() => setEndorseSignedonAlert(false)} />
                            </View>
                        </View>
                        <View style={styles.modalHeader}>
                            <Text style={{ ...styles.modalHeaderText, color: '#001662', textTransform: 'uppercase', fontSize: width / 23 }}>You are signed on to:</Text>
                            <Text style={{ ...styles.modalHeaderText, color: '#001662', textTransform: 'uppercase', fontSize: width / 23 }}>{currentVessel?.name}</Text>
                        </View>
                        <View style={{ ...styles.modalBody, }}>
                            <Text style={{ ...styles.modalBodyText, color: '#000', fontSize: width / 26 }}>Continue with this endorsement and remain signed ON with NO gap in service</Text>
                        </View>
                        <View style={{ ...styles.modalFooter }}>
                            <CustomButton
                                title='Continue'
                                containerStyle={{ borderRadius: 7, width: 200, height: 53 }}
                                textStyle={{ color: '#fff', fontSize: width / 27, letterSpacing: -0.3, fontFamily: 'Roboto-Regular', textAlign: 'center' }}
                                onPress={() => handleEndorse(1)}
                            />
                            <CustomButton
                                title='Sign OFF and Continue'
                                containerStyle={{ backgroundColor: '#ffffff', borderColor: '#ffffff', borderRadius: 7, width: 200, height: 53 }}
                                textStyle={{ color: Colors.colorBlue2, fontSize: width / 27, letterSpacing: -0.3, fontFamily: 'Roboto-Regular', textAlign: 'center' }}
                                onPress={() => handleEndorse(2)}
                            />
                        </View>
                    </View>
                </Modal>
                <Modal
                    isOpen={openLocationSettingsModal}
                    onClosed={() => setOpenLocationSettingsModal(false)}
                    style={{ ...styles.modal, backgroundColor: '#000', width: 325, height: 209 }}
                    position={'center'}
                >
                    <View style={{ ...styles.centeredView, paddingTop: 30 }}>
                        <View style={{ ...styles.modalHeader, paddingHorizontal: 30 }}>
                            <Text style={{ ...styles.modalHeaderText, textTransform: 'uppercase', fontSize: width / 23 }}>Required:</Text>
                            <Text style={{ ...styles.modalHeaderText, fontSize: width / 23, textAlign: 'center' }}>Turn app location settings to "ALWAYS"</Text>
                        </View>
                        <View style={{ ...styles.modalBody, paddingHorizontal: 30 }}>
                            <Text style={{ ...styles.modalBodyText, fontSize: width / 26 }}>We can't track your trip without doing this first..</Text>
                        </View>
                        <View style={{ ...styles.modalFooter }}>
                            <CustomButton
                                title='Go to settings'
                                containerStyle={{ borderRadius: 7, width: 200, height: 53, backgroundColor: 'transparent', borderColor: 'transparent' }}
                                textStyle={{ color: '#0a84ff', fontSize: width / 27, letterSpacing: -0.3, fontFamily: 'Roboto-Regular', textAlign: 'center' }}
                                onPress={() => fixLocation()}
                            />
                        </View>
                    </View>
                </Modal>
                <Modal
                    isOpen={endTripModalWithoutStart}
                    onClosed={() => setEndTripModalWithoutStart(false)}
                    style={{ ...styles.modal, backgroundColor: '#000', width: 325, height: modalHeight }}
                    position={'center'}
                >
                    <View style={{ ...styles.centeredView, paddingTop: 30 }} onLayout={(e) => onLoadModal(e)}>
                        <View style={{ ...styles.modalHeader, paddingHorizontal: 30, paddingBottom: 20 }}>
                            <Text style={{ ...styles.modalHeaderText, fontSize: width / 23, textAlign: 'center' }}>Ending your trip now will delete this trip card</Text>
                        </View>
                        <View style={{ ...styles.modalFooter, flexDirection: 'row', paddingVertical: 0, bottom: 0 }}>
                            <CustomButton
                                title='Cancel'
                                containerStyle={{ borderRadius: 7, width: '50%', height: 53, backgroundColor: 'transparent', borderColor: 'transparent' }}
                                textStyle={{ color: '#0a84ff', fontSize: width / 27, letterSpacing: -0.3, fontFamily: 'Roboto-Bold', textAlign: 'center' }}
                                onPress={() => {
                                    setEndTripModalWithoutStart(false);
                                }}
                            />
                            <CustomButton
                                title='Continue'
                                containerStyle={{ borderRadius: 7, width: '50%', height: 53, backgroundColor: 'transparent', borderColor: 'transparent' }}
                                textStyle={{ color: '#0a84ff', fontSize: width / 27, letterSpacing: -0.3, fontFamily: 'Roboto-Regular', textAlign: 'center' }}
                                onPress={() => {
                                    const data = { id: currentTrip?.id, user: user?.id };
                                    handleDeleteTrip(data);
                                    setEndTripModalWithoutStart(false);
                                }}
                            />
                        </View>
                    </View>
                </Modal>
                <Modal
                    isOpen={tripConfirmAlert}
                    // onClosed={() => setTripConfirmAlert(false)}
                    style={{ ...styles.modal, backgroundColor: '#000', width: 325, height: modalHeight }}
                    position={'center'}
                >
                    <View style={{ ...styles.centeredView, paddingTop: 30 }} onLayout={(e) => onLoadModal(e)}>
                        <View style={{ ...styles.modalHeader, paddingHorizontal: 30 }}>
                            <Text style={{ ...styles.modalHeaderText, fontSize: width / 23, textAlign: 'center' }}>
                                {
                                    isOverLand ? "We see you aren't on the water yet..." : "We see you're already on the water..."
                                }
                            </Text>
                        </View>
                        <View style={{ ...styles.modalBody, paddingHorizontal: 30 }}>
                            <Text style={{ ...styles.modalBodyText, fontSize: width / 26 }}>
                                {`You've got 4 hours to get moving on your trip.`}
                            </Text>
                            <Text style={{ ...styles.modalBodyText, fontSize: width / 26 }}>
                                {`If not, this trip card will be deleted and you will have to start again`}
                            </Text>
                            {
                                !props?.user?.dont_show_start_trip_message && (
                                    <TouchableOpacity onPress={() => setDontShowMessage(!dontShowMessage)} style={{ flexDirection: 'row', paddingTop: 30, alignItems: 'center' }}>
                                        <MaterialCommunityIcons name={dontShowMessage ? 'check-circle-outline' : 'checkbox-blank-circle-outline'} size={24} color={!dontShowMessage ? Colors.colorGrey2 : Colors.colorGreen} style={{ marginRight: 10 }} />
                                        <Text style={{ ...styles.modalBodyText, fontSize: width / 26, }}>
                                            Don't show me this message again
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                        <View style={{ ...styles.modalFooter, flexDirection: 'row', paddingVertical: 0 }}>
                            {/* <CustomButton
                                title='Cancel trip start'
                                containerStyle={{ borderRadius: 7, width: '50%', height: 53, backgroundColor: 'transparent', borderColor: 'transparent' }}
                                textStyle={{ color: '#0a84ff', fontSize: width / 27, letterSpacing: -0.3, fontFamily: 'Roboto-Regular', textAlign: 'center' }}
                                onPress={() => {
                                    setTripConfirmAlert(false);
                                    endTracking();
                                }}
                            /> */}
                            <CustomButton
                                title='Got it'
                                containerStyle={{ borderRadius: 7, width: '100%', height: 53, backgroundColor: 'transparent', borderColor: 'transparent' }}
                                textStyle={{ color: '#0a84ff', fontSize: width / 27, letterSpacing: -0.3, fontFamily: 'Roboto-Bold', textAlign: 'center' }}
                                onPress={() => {
                                    let _user = { ...user };
                                    _user.dont_show_start_trip_message = dontShowMessage;
                                    props.updateUser(_user);
                                    const data = {
                                        id: user.id,
                                        dont_show_start_trip_message: dontShowMessage
                                    };
                                    props.actions.updateUser(data);
                                    setTripConfirmAlert(false);
                                }}
                            />
                        </View>
                    </View>
                </Modal>
                <Modal
                    isOpen={openEndTripModal}
                    onClosed={() => setOpenEndTripModal(false)}
                    style={{ ...styles.modal, backgroundColor: '#000', width: 352, height: modalHeight }}
                    position={'center'}
                    swipeArea={10}
                >
                    <View style={{ ...styles.centeredView, paddingTop: 30 }} onLayout={(e) => onLoadModal(e)}>
                        <View style={{ ...styles.modalHeader, paddingHorizontal: 30 }}>
                            <Text style={{ ...styles.modalHeaderText, fontSize: width / 23 }}>End trip</Text>
                        </View>
                        <View style={{ ...styles.modalBody, paddingHorizontal: 30 }}>
                            <View style={{ width: 292, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ ...styles.modalBodyText, fontSize: width / 26 }}>End date</Text>
                                <View style={{ height: 35, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
                                    <DatePicker
                                        mode={'date'}
                                        date={tripEndDate}
                                        onDateChange={setTripEndDate}
                                        // display={'spinner'}
                                        textColor={"#ffffff"}
                                        style={{ width: 250, justifyContent: 'space-evenly' }}
                                    />
                                </View>
                            </View>
                            <View style={{ width: 292, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ ...styles.modalBodyText, fontSize: width / 26 }}>End time</Text>
                                <View style={{ height: 35, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
                                    <DatePicker
                                        mode={'time'}
                                        date={tripEndDate}
                                        onDateChange={setTripEndDate}
                                        // display={'spinner'}
                                        textColor={"#ffffff"}
                                        style={{ width: 250, backgroundColor: '#000000', justifyContent: 'space-evenly' }}
                                    />
                                </View>
                            </View>
                            <View style={{ width: 292, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ ...styles.modalBodyText, fontSize: width / 26 }}>End location</Text>
                                <Text style={{ ...styles.modalBodyText, fontSize: width / 26 }}>{endLocation ? endLocation.locode : '---'}</Text>
                            </View>
                        </View>
                        <View style={{ ...styles.modalFooter }}>
                            <CustomButton
                                title='Save'
                                containerStyle={{ borderRadius: 7, width: 200, height: 53, backgroundColor: '#ffffff', borderColor: '#ffffff' }}
                                textStyle={{ color: '#000000', fontSize: width / 27, letterSpacing: -0.3, fontFamily: 'Roboto-Regular', textAlign: 'center' }}
                                onPress={() => saveEndTrip()}
                            />
                        </View>
                    </View>
                </Modal>
                <Modal
                    isOpen={showAlert}
                    onClosed={() => setShowAlert(false)}
                    style={[styles.modal, styles.modal0]}
                    position={"center"}
                    swipeArea={50}
                >
                    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                        <View style={styles.centeredView} onLayout={(e) => {
                            const { width, height } = e.nativeEvent.layout;
                            console.log("First Vessel Alert");
                            console.log(width, height);
                            setUptodateHeight(height)
                        }}>
                            <View style={{ ...styles.modalHeader, paddingTop: 30 }}>
                                <Text style={{ ...styles.modalHeaderText, textAlign: 'center' }}>
                                    {'Keep your status\nup-to-date'}
                                </Text>
                            </View>
                            <View style={styles.modalBody}>
                                <View style={{ flexDirection: 'column', width: width - 120, padding: 20, margin: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ffffff', borderStyle: 'dashed', borderRadius: 16 }}>
                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} >
                                        <CompassIcon width={19} height={19} />
                                        <Text style={{
                                            fontSize: width / 22.5, fontFamily: 'Roboto-Regular', fontWeight: '500', letterSpacing: -0.3, textAlign: 'center', color: '#97d3ff', textTransform: 'uppercase', paddingHorizontal: 5
                                        }}
                                        >
                                            Signed On
                                        </Text>
                                        <FontAwesome5 name={'chevron-down'} color={'#ffffff'} size={19} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ paddingTop: 6 }} >
                                        <Text style={{ fontSize: width / 33, fontWeight: '400', letterSpacing: -0.3, textAlign: 'center', fontFamily: 'Roboto-Regular', color: '#ffffff' }}>
                                            {moment(new Date()).utc().format('DD-MMM YYYY')}
                                            {' to '}
                                            {'(End date N/A)'}
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={styles.horizontalBar}></View>
                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} >
                                        <Text style={{
                                            fontSize: width / 22.5, fontFamily: 'Roboto-Regular', fontWeight: '500', letterSpacing: -0.3, textAlign: 'center', color: '#97d3ff', textTransform: 'uppercase', paddingHorizontal: 5
                                        }}
                                        >
                                            Signed Off
                                        </Text>
                                        <FontAwesome5 name={'chevron-down'} color={'#ffffff'} size={19} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ paddingTop: 6 }} >
                                        <Text style={{ fontSize: width / 33, fontWeight: '400', letterSpacing: -0.3, textAlign: 'center', fontFamily: 'Roboto-Regular', color: '#ffffff' }}>
                                            {moment(new Date()).utc().format('DD-MMM YYYY')}
                                            {' to '}
                                            {moment(new Date()).utc().format('DD-MMM YYYY')}
                                        </Text>
                                    </TouchableOpacity>
                                    <Image
                                        source={require('../assets/images/arrow_semicircle.png')}
                                        style={{
                                            position: 'absolute',
                                            top: 20,
                                            right: 0,
                                            width: 100,
                                            height: 100,
                                            resizeMode: 'contain'
                                        }} ></Image>
                                </View>
                                <Text style={styles.modalBodyText}>
                                    That way we can automatically turn trip detection on and off according to your dates and calculate your total days onboard, underway, on leave and in the yard as your status changes
                                </Text>
                            </View>
                            <View style={styles.modalFooter}>
                                <CustomButton
                                    title='Got it'
                                    containerStyle={{ backgroundColor: '#ffffff', borderColor: '#ffffff', borderRadius: 7, width: 237, height: 53 }}
                                    textStyle={{ color: '#000', fontSize: width / 27, letterSpacing: -0.3, fontFamily: 'Roboto-Regular', textAlign: 'center' }}
                                    onPress={() => {
                                        const data = {
                                            id: user?.id,
                                            is_first: false
                                        };
                                        props.actions.updateUser(data).then(res => setUser(res));
                                        setShowAlert(false)
                                    }}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </Modal>
                <Modal
                    isOpen={showStatsModal}
                    onClosed={() => setShowStatsModal(false)}
                    style={[styles.modal, { backgroundColor: 'transparent', width: 352 }]}
                    position={"center"}
                // swipeArea={50}
                >
                    <View style={[styles.centeredView, { width: "100%", backgroundColor: "white", borderRadius: 11 }]}
                    // onLayout={(event) => onLoadModal(event)}
                    >
                        <TouchableOpacity style={{ position: "absolute", right: 15, top: 15 }} onPress={() => setShowStatsModal(false)}>
                            <Ionicons
                                name='close'
                                color='#000000'
                                size={24}
                            />
                        </TouchableOpacity>
                        <ScrollView
                            bounces={false}
                            style={{ width: '100%', backgroundColor: 'transparent', marginTop: 40, zIndex: 1 }}
                        // style={styles.container}
                        // behavior={Platform.OS == 'ios' ? "position" : 'height'}
                        >

                            <View style={styles.modalHeader}>
                                <Text style={{ ...styles.modalHeaderText, color: '#8e8e8e', fontSize: width / 24.5, textAlign: 'center', textTransform: 'uppercase' }}>
                                    {statsName}
                                </Text>
                                <Text style={{ ...styles.modalHeaderText, color: '#ababab', fontSize: width / 33, textAlign: 'center' }}>
                                    {statsName === 'AV. HRS Underway' ? 'Hours' : statsName === 'AV. Distance offshore' ? 'NM' : 'Days'}
                                </Text>
                                <View style={{
                                    paddingVertical: 20,
                                    width: 175,
                                    borderRadius: 11,
                                    borderWidth: 1,
                                    borderColor: '#f1f1f1',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: 10
                                }}>
                                    {/* <Text style={{ ...styles.value }}>{selectedTrip[statsKey]}</Text> */}
                                    <TextInput
                                        defaultValue={selectedTrip ? selectedTrip[statsKey] == null ? '0' : (selectedTrip[statsKey]).toString() : '0'}
                                        style={{
                                            width: '100%',
                                            textAlign: 'center',
                                            paddingHorizontal: 10,
                                            ...styles.value
                                        }}
                                        keyboardType={'numeric'}
                                        onChangeText={(txt) => {
                                            let _trip = { ...selectedTrip };
                                            _trip[statsKey] = txt == '' ? '' : parseFloat(txt);
                                            setSelectedTrip(_trip)
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={{ ...styles.modalBody, alignItems: 'flex-start', paddingHorizontal: 24 }}>
                                {
                                    (statsName == 'Watchkeeping' || statsName == 'Standby') && (
                                        <Text style={{ ...styles.modalBodyText, color: '#000', textAlign: 'left', textTransform: 'uppercase' }}>
                                            Definition:
                                        </Text>
                                    )
                                }
                                <Text style={{ ...styles.modalBodyText, color: '#000', textAlign: 'left' }}>
                                    {
                                        statsName == 'Watchkeeping' &&
                                        'ONLY FOR MCA OOW3000 or higher...   Watchkeeping Service is your actual sea service (days spent at sea including time spent at anchor, canals and river transits) spent as a watchkeeping officer in full charge of a navigational or engineering watch for at least 4 out of every 24 hours while the vessel is engeged on a voyage'
                                    }
                                    {
                                        statsName == 'Standby' &&
                                        'Standby service describes time spent waiting for an owner, uniformed and ready to depart'
                                    }
                                </Text>
                                {
                                    statsName == 'Standby' && (
                                        <>
                                            <Text style={{ ...styles.modalBodyText, color: '#000', textAlign: 'left', textTransform: 'uppercase', marginTop: 20 }}>
                                                Rules:
                                            </Text>
                                            <Text style={{ ...styles.modalBodyText, color: '#000', textAlign: 'left' }}>
                                                Standby service CANNOT exceed 14 consecutive days for a single trip
                                            </Text>
                                            <Text style={{ ...styles.modalBodyText, color: '#000', textAlign: 'left', marginTop: 20 }}>
                                                Standby service CANNOT exceed days at sea
                                            </Text>
                                        </>
                                    )
                                }
                            </View>
                            <View style={styles.modalFooter}>
                                <CustomButton
                                    title='Save'
                                    containerStyle={{ borderRadius: 7, width: 170, height: 53 }}
                                    textStyle={{ color: '#fff', fontSize: width / 27, letterSpacing: -0.3, fontFamily: 'Roboto-Regular', textAlign: 'center' }}
                                    onPress={async () => {
                                        if (selectedTrip[statsKey] == '') {
                                            alert('Please input valid value.');
                                            return;
                                        }
                                        let data = {
                                            id: selectedTrip.id,
                                            vessel: selectedTrip.vessel,
                                            [statsKey]: selectedTrip[statsKey]
                                        }
                                        await props.actions.updateTrip(data)
                                        setShowStatsModal(false)
                                    }}
                                />
                            </View>
                        </ScrollView>
                    </View>

                </Modal>
                <FlashMessage position={'top'} animated={true} autoHide={true} duration={9000} />
            </ImageBackground>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        ...GlobalStyles.FlexContainer,
        justifyContent: 'center',
        alignItems: 'center',
    },
    newVesselContainer: {
        width: '100%',
        height: 'auto',
        borderRadius: 7,
        padding: 20,
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    addVesselBtn: {
        width: 138,
        ...Buttons.greenBtn,
    },
    bgImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
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
    modal: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 11,
        backgroundColor: '#000000cc',
        // height: Dimensions.get('screen').height
    },
    modal0: {
        width: 360,
        height: 530,
    },
    centeredView: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center'
    },
    modalHeader: {
        paddingTop: 5,
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
        color: '#fff',
        fontWeight: '500',
        fontFamily: 'Roboto-Regular',
        letterSpacing: -0.41
    },
    footerActionText: {
        color: '#09e',
        fontSize: width / 26,
        fontWeight: 'bold'
    },
    modalBodyText: {
        fontSize: width / 23,
        color: '#fff',
        textAlign: 'center',
        letterSpacing: -0.3,
        fontWeight: '300',
        fontFamily: 'Roboto-Light',
    },
    vesselDetailListItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#ffffff33',
        borderBottomWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 14
    },
    vesselDetailLabel: {
        fontSize: width / 24.5,
        letterSpacing: -0.3,
        fontFamily: 'Roboto-Regular',
        fontWeight: '400',
        textAlign: 'center',
        color: '#ffffff'
    },
    vesselDetail: {
        fontSize: width / 23,
        letterSpacing: -0.3,
        fontFamily: 'Roboto-Regular',
        fontWeight: '700',
        textAlign: 'center',
        textTransform: 'uppercase',
        color: '#ffffff'
    },
    title: {
        fontSize: width / 21,
        color: '#ffffff',
        fontFamily: 'Roboto-Regular',
        letterSpacing: -0.41,
        fontWeight: '400',
    },
    subTitle: {
        fontSize: width / 27,
        fontFamily: 'Roboto-Light',
        color: '#ffffff',
        letterSpacing: -0.41,
        fontWeight: '400'
    },
    counterText: {
        fontFamily: 'SourceSansPro-SemiBold',
        color: Colors.colorWhite,
        textAlign: 'center',
        fontWeight: '900'
    },
    counterSubText: {
        fontFamily: 'SourceSansPro-Bold',
        fontSize: width / 38,
        color: Colors.colorWhite,
        marginTop: 3,
        textAlign: 'center',
    },
    value: {
        fontFamily: 'Roboto-Bold',
        fontSize: width / 21,
        letterSpacing: -0.41,
        color: '#6aabff'
    },
    alertText: {
        fontSize: width / 28,
        fontFamily: 'SourceSansPro-Regular',
        color: '#fff',
    },
    horizontalBar: {
        height: 0,
        width: '100%',
        borderBottomColor: '#565656',
        borderBottomWidth: 2,
        marginVertical: 20
    }
});

const mapStateToProps = state => {
    return {
        user: state.APP.USER,
        vessels: state.APP.VESSELS,
        trips: state.APP.trips,
        locodes: state.APP.locodes,
        endorsements: state.APP.endorsements
    };
};

const mapDispatchToProps = dispatch => {
    const appActions = getAppActions();
    return {
        actions: bindActionCreators(SecurityActions(), dispatch),
        updateUser: (user) => {
            return dispatch(appActions.storeUser(user));
        },
        startLoading: () => {
            return dispatch(appActions.startLoading());
        },
        stopLoading: () => {
            return dispatch(appActions.stopLoading());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);
