import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, Image, TouchableOpacity, Platform } from 'react-native';
// import { View, Text } from 'moti';
import { Colors } from '_styles/index';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as GlobalStyles from '_styles/styles';
import { BlurView } from '@react-native-community/blur';
import { CloseIcon } from '../../Icons/CloseIcon';
import { bindActionCreators } from 'redux';
import SecurityActions from '../../../actions/SecurityActions';
import { connect } from 'react-redux';
import CustomButton from '../../CustomButton';
import { width } from '../../Carousel/Carousel';
import Blink from '../../Blink';

export const TripMap = (props) => {

    const [departure, setDeparture] = useState(null);
    const [destination, setDestination] = useState(null);
    const mapRef = useRef(null);
    const departureRef = useRef(null);
    const destinationRef = useRef(null);
    const [mounted, setMounted] = useState(false);
    const [markRotation, setMarkRotation] = useState(0);
    const [trackingRoutes, setTrackingRoutes] = useState([]);

    useEffect(() => {
        if (mounted == false) {
            if (props.departure) {
                setDeparture(props.departure);
            }
            if (props.destination) {
                setDestination(props.destination);
            }
            if (departure && destination && mapRef.current) {
                mapRef.current.fitToSuppliedMarkers(["marker0"], {
                    edgePadding: {
                        top: 20,
                        right: 30,
                        bottom: 20,
                        left: 30
                    }, animated: true
                })
                mapRef.current.fitToSuppliedMarkers(["marker1"], {
                    edgePadding: {
                        top: 20,
                        right: 30,
                        bottom: 20,
                        left: 30
                    }, animated: true
                })
            }
            if ((!departure || !destination) && props.trip && !mounted) {
            }
            getRoutesForTrip(props.trip.id);
            setMounted(true);
        }
    }, [mapRef.current, props])

    const getRoutesForTrip = async (id) => {
        const routes = await props.actions.getRoutes({ trip_id: id });
        if (routes?.length == 0) return;
        setTrackingRoutes(routes);
        var refresh = false;
        if (!departure) {
            let _dep = {};
            _dep.lat = parseFloat(routes[0].lat);
            _dep.long = parseFloat(routes[0].lon);
            _dep.country_code = '';
            _dep.locode = '';
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
            refresh = true;
        }
        calculateOrientation({ start: routes[routes.length - 1], end: routes[routes.length - 2] });
        if (refresh) {
            if (mapRef.current) {
                mapRef.current.fitToSuppliedMarkers(["marker0"], {
                    edgePadding: {
                        top: 20,
                        right: 30,
                        bottom: 20,
                        left: 30
                    }, animated: true
                });
                mapRef.current.fitToSuppliedMarkers(["marker1"], {
                    edgePadding: {
                        top: 20,
                        right: 30,
                        bottom: 20,
                        left: 30
                    }, animated: true
                });
            }
        }
    }

    const calculateOrientation = ({ start, end }) => {
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

    const getCoords = () => {
        if (!trackingRoutes) return [];
        let coords = [];
        if (departure) {
            coords.push({
                latitude: parseFloat(departure?.lat),
                longitude: parseFloat(departure?.long)
            })
        }
        trackingRoutes.map((item) => {
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

    return (
        <View
            style={styles.container}
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor: Colors.colorGrey6,
                    height: 279,
                    borderRadius: 11,
                    textAlign: 'center',
                    marginBottom: 22,
                    overflow: 'hidden',
                    flexDirection: 'row'
                }}
            >
                {
                    props.trip.end_date != null && (

                        <View style={{
                            width: '50%'
                        }}>
                            <MapView
                                style={styles.map}
                                region={{
                                    latitude: departure ? parseFloat(departure?.lat) : -74,
                                    longitude: departure ? parseFloat(departure?.long) : 34,
                                    latitudeDelta: 0.1,
                                    longitudeDelta: 0.2
                                }}
                                onPress={() => props.navigation.navigate('TripMapView', { trip: props.trip, departure: departure, destination: destination })}
                                zoomEnabled={false}
                                zoomTapEnabled={false}
                                scrollEnabled={false}
                                pitchEnabled={false}
                                rotateEnabled={false}
                            >
                                <Marker
                                    identifier={`marker0`}
                                    coordinate={{
                                        latitude: departure ? parseFloat(departure?.lat) : -74,
                                        longitude: departure ? parseFloat(departure?.long) : 34
                                    }}
                                    ref={(ref) => departureRef.current = ref}
                                >
                                    <Image
                                        source={require('../../../assets/images/departure.png')}
                                        style={{ width: 45, height: 54, resizeMode: 'contain' }}
                                    />
                                </Marker>
                            </MapView>
                        </View>
                    )
                }
                <View style={{
                    width: props.trip.end_date ? '50%' : '100%',
                    borderLeftWidth: 2,
                    borderLeftColor: 'gray'
                }}>
                    <MapView
                        style={styles.map}
                        // provider={PROVIDER_GOOGLE}
                        region={{
                            latitude: destination ? parseFloat(destination?.lat) : -74,
                            longitude: destination ? parseFloat(destination?.long) : 34,
                            latitudeDelta: 0.1,
                            longitudeDelta: 0.2
                        }}
                        onPress={() => props.navigation.navigate('TripMapView', { trip: props.trip, departure: departure, destination: destination })}
                        zoomEnabled={false}
                        zoomTapEnabled={false}
                        scrollEnabled={false}
                        pitchEnabled={false}
                        rotateEnabled={false}
                    >
                        {
                            destination != null && (
                                <Marker
                                    identifier={`marker1`}
                                    coordinate={{
                                        latitude: destination ? parseFloat(destination?.lat) : -74,
                                        longitude: destination ? parseFloat(destination?.long) : 34
                                    }}
                                    ref={(ref) => destinationRef.current = ref}
                                >
                                    {
                                        props.trip?.end_date === null ? (
                                            <Blink style={{ bottom: Platform.select({ ios: 0, android: 0 }) }} icon={
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
                                                style={{ width: 45, height: 54, resizeMode: 'contain' }}
                                            />
                                        )
                                    }
                                </Marker>
                            )
                        }
                        {
                            (props.trip?.start_date && props.trip?.end_date === null) && (
                                <Polyline
                                    coordinates={getCoords()}
                                    strokeColor="#000"
                                    strokeWidth={3}
                                />
                            )
                        }
                    </MapView>
                </View>
            </View>
            {
                props.user.first_trip_alert != true && (
                    <View style={styles.alertCont}>
                        <BlurView
                            style={styles.firstTripAlert}
                            blurRadius={1}
                            blurType={'light'}
                        >
                            <TouchableOpacity onPress={props.setFirstTripAlert} style={{ height: 20, width: '100%', alignSelf: 'flex-start', flexDirection: 'row-reverse', marginTop: -20, marginRight: 20 }}>
                                <CloseIcon style={{ padding: 5 }} />
                            </TouchableOpacity>
                            <Text style={styles.firstTripAlertTxt}>
                                Touch anywhere on this map thumbnail to view your full trip
                            </Text>
                        </BlurView>
                    </View>
                )
            }
            {
                props.trip.end_date == null && (
                    <View style={styles.alert}>
                        <Text style={[styles.alertText]}>*Trip progress unavailable when out of service</Text>
                    </View>
                )
            }
            {/* {
                props.trip.end_date == null && (
                    <View style={styles.alertCont}>
                        <BlurView
                            style={styles.tripDetected}
                            blurRadius={1}
                            blurType={'light'}
                        >
                            <Text style={[styles.firstTripAlertTxt, { fontSize: width / 21, fontWeight: '700' }]}>Trip Detected...</Text>
                            <Text style={styles.firstTripAlertTxt}>
                                An official trip card with your stats will be available approximately 15 mins after we detect no movement and you are within service range
                            </Text>
                            <CustomButton
                                title='View current map'
                                containerStyle={{ backgroundColor: 'white', width: '100%', height: 50, marginTop: 30, borderWidth: .5 }}
                                textStyle={{ color: '#7FC542ee' }}
                                onPress={() => props.navigation.navigate('TripMapView', { trip: props.trip, departure: departure, destination: destination })}
                            />
                        </BlurView>
                    </View>
                )
            } */}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        ...GlobalStyles.FlexContainer,
    },
    map: {
        width: '100%',
        height: 279,
    },
    firstTripAlert: {
        width: '80%',
        height: 'auto',
        borderRadius: 11,
        padding: 30,
        marginTop: 20,
        borderWidth: 1,
        borderColor: 'rgb(255, 255, 255)',
        justifyContent: 'center'
    },
    alertCont: {
        position: 'absolute',
        width: '100%',
        height: 281,
        backgroundColor: '#00000055',
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center'
    },
    firstTripAlertTxt: {
        color: 'white',
        fontSize: width / 23,
        lineHeight: 25.5,
        letterSpacing: -0.3,
        textAlign: 'center',
        fontFamily: 'Roboto-Regular'
    },
    tripDetected: {
        width: '100%',
        height: '100%',
        borderRadius: 11,
        padding: 30,
        borderWidth: 1,
        borderColor: 'rgb(255, 255, 255)',
        justifyContent: 'center'
    },
    alert: {
        position: 'absolute',
        width: '100%',
        bottom: 10,
        left: 0
    },
    alertText: {
        fontSize: width / 35,
        letterSpacing: -0.3,
        color: "#f22000",
        marginBottom: 3,
        textAlign: 'center',
        fontFamily: 'Roboto-Italic',
        paddingVertical: 20,
        paddingLeft: 15
    }
});
const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(SecurityActions(), dispatch)
    }
}

export default connect(null, mapDispatchToProps)(TripMap)
// export default TripMap;
