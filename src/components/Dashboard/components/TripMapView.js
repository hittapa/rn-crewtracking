import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import MapView, { Callout, Marker, Polyline } from 'react-native-maps';
import { bindActionCreators } from 'redux';
import SecurityActions from '../../../actions/SecurityActions';
import { connect } from 'react-redux';
import EditIcon from '../../Icons/EditIcon';
import moment from 'moment';
import Modal from 'react-native-modalbox';
import CustomButton from '../../CustomButton';
import { capitalize } from 'lodash-es';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { width } from '../../Carousel/Carousel';
import Blink from '../../Blink';

function TripMapView(props) {
    const [trip, setTrip] = useState(null)
    const [departure, setDeparture] = useState(null);
    const [destination, setDestination] = useState(null);
    const [routes, setRoutes] = useState(null);
    const [editable, setEditable] = useState(false);
    const [editingData, setEditingData] = useState(null);
    const [updatedData, setUpdatedData] = useState(null);
    const [showFlag, setShowFlag] = useState(false);
    const [initialRegion, setInitialRegion] = useState(null);
    const departureRef = useRef(null);
    const destinationRef = useRef(null);
    const mapRef = useRef(null);
    const { trip: propsTrip, departure: propsDeparture, destination: propsDestination } = props.route.params;
    const [markRotation, setMarkRotation] = useState(0);

    useEffect(() => {
        if (propsTrip) {
            setTrip(propsTrip);
            getRoutesForTrip(propsTrip.id)
        }
        // if (propsDeparture) {
        //     setDeparture(propsDeparture);
        // }
        // if (propsDestination) {
        //     setDestination(propsDestination);
        // }
        if (propsDestination && propsDeparture && mapRef.current && propsTrip?.end_date) {
            mapRef.current.fitToSuppliedMarkers(["marker0", "marker1"], {
                edgePadding: {
                    top: 20,
                    right: 30,
                    bottom: 20,
                    left: 30
                }, animated: true
            })
        }
    }, [mapRef.current, propsTrip, propsDeparture, propsDestination])

    const getRoutesForTrip = async (id) => {
        const routes = await props.actions.getRoutes({ trip_id: id });
        setRoutes(routes);
        if (!routes || routes?.length == 0) return;
        var refresh = false;
        if (!departure) {
            let _dep = {};
            _dep.lat = parseFloat(routes[0].lat);
            _dep.long = parseFloat(routes[0].lon);
            _dep.country_code = '';
            _dep.locode = '';
            console.log("start Location: ", routes[0]);
            setDeparture(_dep);
            refresh = true;
        }
        if (!destination) {
            let _des = {};
            _des.lat = parseFloat(routes[routes.length - 1].lat);
            _des.long = parseFloat(routes[routes.length - 1].lon);
            _des.country_code = '';
            _des.locode = '';
            setDestination(_des);
            console.log("end Location: ", routes[routes.length - 1]);
            refresh = true;
        }
        calculateOrientation({ start: routes[routes.length - 1], end: routes[routes.length - 2] });
        let latitudes = [];
        let longitudes = [];
        for (let i = 0; i < routes?.length; i++) {
            const ele = routes[i];
            if (ele.lat && ele.lon) {
                latitudes.push(parseFloat(ele.lat));
                longitudes.push(parseFloat(ele.lon));
            }

        }

        let cor1 = {
            longitude: Math.min(...longitudes),
            latitude: Math.min(...latitudes)
        };
        let cor2 = {
            longitude: Math.max(...longitudes),
            latitude: Math.max(...latitudes)
        }
        if (trip?.end_date) {
            mapRef?.current?.fitToCoordinates([cor1, cor2], {
                edgePadding: {
                    top: 20,
                    right: 30,
                    bottom: 20,
                    left: 50
                }, animated: true
            });
        } else {
            mapRef?.current?.fitToSuppliedMarkers(['marker1'], {
                edgePadding: {
                    top: 20,
                    right: 30,
                    bottom: 20,
                    left: 50
                }, animated: true
            });
        }
    }

    const calculateOrientation = ({ start, end }) => {
        if(!end) return;
        let deltaLat = start.lat - end.lat;
        let deltaLon = start.lon - end.lon;
        console.log(deltaLat, deltaLon);
        let alpha = Math.atan(deltaLat / deltaLon);
        console.log(alpha);
        let radian = alpha / Math.PI * 180;
        console.log('origin: ', markRotation);
        console.log(radian);
        setMarkRotation(-radian)
    }

    if (!trip) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>
                    <ActivityIndicator />
                </Text>
            </View>
        )
    }

    const getCoords = () => {
        if (!routes) return [];
        let coords = [];
        if (departure) {
            coords.push({
                latitude: parseFloat(departure?.lat),
                longitude: parseFloat(departure?.long)
            })
        }
        routes.map((item) => {
            let coord = {};
            coord.latitude = parseFloat(item.lat);
            coord.longitude = parseFloat(item.lon);
            coords.push(coord);
        });
        if (destination) {
            coords.push({
                latitude: parseFloat(destination?.lat),
                longitude: parseFloat(destination?.long)
            })
        }
        return coords;
    }
    const onSetEditable = (loc) => {
        setEditable(true)
        setEditingData(loc)
    }

    const getDateTime = (d) => {
        if (!d) return ''
        var dt = moment.utc(parseInt(d)).format('DD MMM hh:mm z');
        return dt;
    }

    const onChangeText = (t) => {
        if (editingData == 'start') {
            let data = {
                customStartLocode: t
            };
            setUpdatedData(data)
        }
        if (editingData == 'end') {
            let data = {
                customEndLocode: t
            };
            setUpdatedData(data)
        }
    }

    const onUpdateTripData = async () => {
        if (!updatedData) {
            setEditable(false);
            return;
        }
        let data = { id: trip.id, vessel: trip.vessel, ...updatedData };
        const trips = await props.actions.updateTrip(data);
        trips.map((item) => {
            if (item.id == trip.id) {
                console.log('tripstripstripstripstrips')
                console.log(item)
                setTrip(item)
            }
        })
        setEditable(false)
        if (editingData === 'start' && departureRef.current) {
            departureRef.current.hideCallout();
            setTimeout(() => {
                departureRef.current.showCallout();
            }, 500);
        }
        if (editingData === 'end' && destinationRef.current) {
            destinationRef.current.hideCallout();
            setTimeout(() => {
                destinationRef.current.showCallout();
            }, 500);
        }
    }

    const onRateTrip = async (t) => {
        let data = {
            id: trip.id,
            vessel: trip.vessel,
            flag: t
        };
        await props.actions.updateTrip(data);
        setShowFlag(false)
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{
                ...styles.header
            }}>
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <Text style={styles.text1}>Close</Text>
                </TouchableOpacity>
                <Text style={styles.text2}>Map</Text>
                <TouchableOpacity onPress={() => setShowFlag(true)}>
                    <Text style={styles.text1}>Flag</Text>
                </TouchableOpacity>
            </View>
            <MapView
                ref={mapRef}
                style={styles.map}
            // initialRegion={initialRegion}
            >
                {
                    departure && trip?.end_date && (
                        <Marker
                            identifier={`marker0`}
                            coordinate={{
                                latitude: parseFloat(departure?.lat),
                                longitude: parseFloat(departure?.long)
                            }}
                            centerOffset={{ x: 0, y: -20 }}
                            calloutOffset={{ x: 0, y: 21 }}
                            ref={(ref) => departureRef.current = ref}
                        >
                            <Image
                                source={require('../../../assets/images/departure.png')}
                                style={{ width: 34, height: 42, resizeMode: 'contain' }}
                            />
                            <Callout onPress={(e) => {
                                let point;
                                if (Platform.OS == 'ios') {
                                    point = e.nativeEvent.point;
                                    if (point.x > 185 && point.x < 202 && point.y > 8 && point.y < 26) {
                                        onSetEditable('start')
                                    }
                                }
                                if (Platform.OS == 'android') {
                                    point = e.nativeEvent.position;
                                    onSetEditable('start');
                                }
                                console.log(point);
                            }} >
                                <View style={{ width: 210, }}>
                                    <View style={{ width: '100%', height: 30, justifyContent: "flex-end", padding: 8, flexDirection: 'row' }}>
                                        <EditIcon style={{ tinycolor: '#fff' }} />
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 2, paddingHorizontal: 15 }}>
                                        <Text style={[
                                            { ...styles.text3, fontFamily: 'Roboto-Bold', paddingBottom: 5 },
                                            trip?.customStartLocode && trip?.customStartLocode.length > 8 && { fontSize: width / 28 }]}>
                                            Start: {trip?.customStartLocode ? trip.customStartLocode : departure?.country_code + " " + departure?.locode}
                                        </Text>
                                        <Text style={{ ...styles.text3, fontSize: width / 27, color: '#000' }}>{getDateTime(trip?.start_date)}</Text>
                                    </View>
                                    <View style={{ height: 33 }} />
                                </View>
                            </Callout>
                        </Marker>
                    )
                }

                {
                    destination && (
                        <Marker
                            identifier={`marker1`}
                            coordinate={{
                                latitude: parseFloat(destination?.lat),
                                longitude: parseFloat(destination?.long)
                            }}
                            centerOffset={{ x: 0, y: -20 }}
                            calloutOffset={{ x: 0, y: 21 }}
                            ref={(ref) => destinationRef.current = ref}
                        >
                            {
                                trip?.end_date === null ? (
                                    <Blink style={{ bottom: -20 }} icon={
                                        (<Image
                                            source={require('../../../assets/images/tracking_arrow.png')}
                                            style={{
                                                width: 10,
                                                height: 10,
                                                resizeMode: 'contain',
                                                transform: [{ rotate: `${markRotation}deg` }]
                                            }}
                                        />)
                                    }>
                                        <View style={{ width: 30, height: 30, backgroundColor: '#ffffff', borderRadius: 15 }}></View>
                                    </Blink>
                                ) : (
                                    <Image
                                        source={require('../../../assets/images/destination.png')}
                                        style={{ width: 34, height: 42, resizeMode: 'contain' }}
                                    />
                                )
                            }
                            <Callout onPress={(e) => {
                                let point;
                                if (Platform.OS == 'ios') {
                                    point = e.nativeEvent.point;
                                    if (point.x > 185 && point.x < 202 && point.y > 8 && point.y < 26) {
                                        onSetEditable('end')
                                    }
                                }
                                if (Platform.OS == 'android') {
                                    point = e.nativeEvent.position;
                                    onSetEditable('end');
                                }
                                console.log(point);
                            }} >
                                <View style={{ width: 210 }}>
                                    <View style={{ width: '100%', height: 30, justifyContent: "flex-end", padding: 8, flexDirection: 'row' }}>
                                        <EditIcon style={{ tinycolor: '#fff' }} />
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 2, paddingHorizontal: 15 }}>
                                        <Text style={[
                                            { ...styles.text3, fontFamily: 'Roboto-Bold', paddingBottom: 5 },
                                            trip?.customEndLocode && trip?.customEndLocode.length > 8 && { fontSize: width / 28 }]}>
                                            End: {trip?.customEndLocode ? trip.customEndLocode : destination?.country_code + " " + destination?.locode}
                                        </Text>
                                        <Text style={{ ...styles.text3, fontSize: width / 27, color: '#000' }}>{getDateTime(trip?.end_date)}</Text>
                                    </View>
                                    <View style={{ height: 33 }} />
                                </View>
                            </Callout>
                        </Marker>
                    )
                }
                {
                    trip?.start_date && (
                        <Polyline
                            coordinates={getCoords()}
                            strokeColor="#000"
                            strokeWidth={3}
                        />
                    )
                }
            </MapView>
            <Modal
                isOpen={editable}
                onClosed={() => setEditable(false)}
                style={[styles.modal, styles.modal0, { backgroundColor: 'white' }]}
                position={"center"}
                swipeArea={50}
            >
                <View style={{ ...styles.centeredView }}>
                    <View style={[styles.modalHeader, { paddingBottom: 0 }]}>
                        <Text style={{ ...styles.modalHeaderText, color: '#000', fontSize: width / 24.5, lineHeight: 19.92, textAlign: 'center' }}>
                            Edit {capitalize(editingData)} Location Code
                        </Text>
                        <TextInput
                            defaultValue={
                                editingData == 'start' ?
                                    trip?.customStartLocode ? trip.customStartLocode : departure?.country_code + " " + departure?.locode
                                    :
                                    editingData == 'end' ?
                                        trip?.customEndLocode ? trip.customEndLocode : destination?.country_code + " " + destination?.locode
                                        : ''
                            }
                            multiline={false}
                            style={{
                                width: 240,
                                padding: 10,
                                marginTop: 20,
                                borderRadius: 11,
                                borderWidth: 1,
                                borderColor: '#e5e5e5',
                                backgroundColor: '#fff',
                                color: Colors.Grey1,
                                textTransform: 'lowercase'
                            }}
                            onChangeText={(t) => onChangeText(t)}
                        />
                    </View>
                    <View style={styles.modalFooter}>
                        <CustomButton
                            title='Save'
                            containerStyle={{ borderRadius: 7, width: 150, height: 44 }}
                            textStyle={{ color: '#fff', fontSize: width / 27, lineHeight: 20, letterSpacing: -0.3, fontFamily: 'Roboto-Regular', textAlign: 'center' }}
                            onPress={() => onUpdateTripData()}
                        />
                    </View>
                </View>
            </Modal>
            <Modal
                isOpen={showFlag}
                onClosed={() => setShowFlag(false)}
                style={[styles.modal, { backgroundColor: '#1e1e1e', width: 270, height: 349 }]}
                position={"center"}
                swipeArea={50}
            >
                <View style={{ ...styles.centeredView }}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalHeaderText}>Flag this Trip</Text>
                        <Text style={{ ...styles.modalHeaderText, fontSize: width / 24.5, lineHeight: 19.92, paddingTop: 5 }}>Please tell us what is wrong</Text>
                    </View>
                    <ScrollView>
                        <TouchableOpacity style={styles.listItem} onPress={() => onRateTrip('Inaccurate days underway')}>
                            <Text style={{ ...styles.listItemText }}>Inaccurate days underway</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listItem} onPress={() => onRateTrip('Start location inaccurate')}>
                            <Text style={{ ...styles.listItemText }}>Start location inaccurate</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listItem} onPress={() => onRateTrip('Stop location inaccurate')}>
                            <Text style={{ ...styles.listItemText }}>Stop location inaccurate</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listItem} onPress={() => onRateTrip('Track inaccurate')}>
                            <Text style={{ ...styles.listItemText }}>Track inaccurate</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listItem} onPress={() => onRateTrip('Other')}>
                            <Text style={{ ...styles.listItemText }}>Other</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.listItem} onPress={() => setShowFlag(false)}>
                            <Text style={{ ...styles.listItemText, fontFamily: 'Roboto-Bold' }}>Cancel</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
    },
    map: {
        flex: 1,
    },
    text1: {
        fontFamily: 'Roboto-Regular',
        fontSize: width / 24.5,
        lineHeight: 19.92,
        letterSpacing: -0.3,
        color: '#767676'
    },
    text2: {
        fontFamily: 'SourceSansPro-Bold',
        fontWeight: '600',
        fontSize: width / 24.5,
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
        color: '#5c5c5e'
    },
    modal: {
        justifyContent: "flex-start",
        borderRadius: 11,
        backgroundColor: '#000000cc'
    },
    modal0: {
        width: 300,
        height: 195,
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
        fontSize: width / 24.5,
        lineHeight: 19.92,
        color: '#0a84ff',
        fontFamily: 'Roboto-Regular',
        letterSpacing: -0.3,
    },
})

const mapStateToProps = (state) => {
    return {
        user: state.APP.USER,
        vessels: state.APP.VESSELS,
        trips: state.APP.trips,
        locodes: state.APP.locodes
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(SecurityActions(), dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TripMapView)