import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, KeyboardAvoidingView, ScrollView, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SecurityActions from '../../actions/SecurityActions';
import { width } from '../../components/Carousel/Carousel';
import CustomButton from '../../components/CustomButton';
import { HeaderLeft } from '../../components/Header/HeaderLeft';
import { HeaderRight } from '../../components/Header/HeaderRight';
import { HeaderTitle } from '../../components/Header/HeaderTitle';
import { Colors } from '../../styles';
import * as GlobalStyles from '../../styles/styles';

function EndorseStep1(props) {

    const [vessel, setVessel] = useState(null);
    const [period, setPeriod] = useState(null);
    const [trips, setTrips] = useState(null);
    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        if (props.route.params.period) setPeriod(props.route.params.period);
        if (props.route.params.vessel) {
            let _ves = props.route.params.vessel;
            setVessel(_ves);
            let _trips = [];
            if (_ves.onboardServices && _ves.onboardServices.length > 0) {
                for (let i = 0; i < _ves.onboardServices.length; i++) {
                    const item = _ves.onboardServices[i];
                    if (item.ended_at && item.started_at > props.route.params.period?.start && item.ended_at < props.route.params.period?.end) {
                        if (item.type == 'trip' && item.trip != null) {
                            var trip = item.trip;
                            console.log(trip);
                            props.route.params.locodes?.map((loc) => {
                                if (trip.start_location == loc.objectid) {
                                    trip.departure = loc;
                                }
                                if (trip.end_location != null && trip.end_location == loc.objectid) {
                                    trip.destination = loc;
                                }
                            })
                            const getRoutes = async (trip) => {
                                var _routes = await props.actions.getRoutes({ trip_id: trip.id });
                                for (let j = 0; j < _routes.length; j++) {
                                    const ele = _routes[j];
                                    let routesArr = [...routes];
                                    if (!routesArr.includes(ele.geo_name)) routesArr.push(ele.geo_name);
                                    setRoutes(routesArr);
                                }
                            }
                            getRoutes(trip);
                            _trips.push(trip)
                        }
                    }
                }
            }
            setTrips(_trips);
        };
    }, [props]);

    const getStartLoc = () => {
        if (trips && trips.length > 0) {
            if (trips[trips.length - 1].customStartLocode) return trips[trips.length - 1].customStartLocode;
            if (trips[trips.length - 1].departure) {
                var loc = trips[trips.length - 1].departure.locode;
                var cc = trips[trips.length - 1].departure.country_code;
                return cc + ' ' + loc;
            };
        }
        return '';
    }

    const getEndLoc = () => {
        if (trips && trips.length > 0) {
            if (trips[0].customEndLocode) return trips[0].customEndLocode;
            if (trips[0].destination) {
                var loc = trips[0].destination.locode
                var cc = trips[trips.length - 1].destination.country_code;
                return cc + ' ' + loc;
            };
        }
        return '';
    }

    const handleNext = () => {
        var startLoc = getStartLoc();
        var endLoc = getEndLoc();
        const data = {
            ...props.route.params,
            startLoc,
            endLoc,
            routes,
            trips
        }
        props.navigation.navigate('EndorseStep2', data);
    }

    return (
        <View style={GlobalStyles.FlexContainer}>
            <SafeAreaView style={[GlobalStyles.safeView]}>
                <View style={[GlobalStyles.header]}>
                    <HeaderLeft onPress={() => props.navigation.goBack()}>
                        <Text style={{
                            color: '#ababab',
                            marginLeft: 20,
                            fontSize: width / 23,
                            lineHeight: 21.09,
                            letterSpacing: -0.3,
                            fontWeight: '400',
                            width: 55,
                        }} numberOfLines={1}>{"Cancel"}</Text>
                    </HeaderLeft>
                    <HeaderTitle>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={{
                                ...GlobalStyles.headerTitle
                            }}>Endorse sea service</Text>
                            <Text style={{
                                color: '#888',
                                fontSize: width / 28,
                                lineHeight: 18
                            }}>{`Step 1 of 4`}</Text>
                        </View>
                    </HeaderTitle>
                    <HeaderRight>
                        <View style={{ width: 55, marginRight: 20 }}></View>
                    </HeaderRight>
                </View>
                <ScrollView style={[{ backgroundColor: '#f9f9f9' }]}>
                    <View style={{ width: '100%' }}>
                        <Text style={{
                            ...styles.label
                        }}>Confirm onboard service dates</Text>
                    </View>
                    <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                        <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: .5, borderBottomColor: '#c6c6c8' }}>
                            <Text style={GlobalStyles.labelText}>Start date</Text>
                            <Text style={{ ...GlobalStyles.labelText, color: Colors.colorGrey4 }}>{period && moment(period.start).utc().format('DD-MMM YYYY')}</Text>
                        </View>
                    </View>
                    <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                        <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: 0 }}>
                            <Text style={GlobalStyles.labelText}>End date</Text>
                            <Text style={{ ...GlobalStyles.labelText, color: Colors.colorGrey4 }}>{period && moment(period.end).utc().format('DD-MMM YYYY')}</Text>
                        </View>
                    </View>
                    <View style={{ width: '100%' }}>
                        <Text style={{
                            ...styles.label
                        }}>Confirm onboard service locations</Text>
                    </View>
                    <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                        <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: .5, borderBottomColor: '#c6c6c8' }}>
                            <Text style={GlobalStyles.labelText}>Start location</Text>
                            <Text style={{ ...GlobalStyles.labelText, color: Colors.colorGrey4 }}>{getStartLoc()}</Text>
                        </View>
                    </View>
                    <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                        <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: 0 }}>
                            <Text style={GlobalStyles.labelText}>End location</Text>
                            <Text style={{ ...GlobalStyles.labelText, color: Colors.colorGrey4 }}>{getEndLoc()}</Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={{ position: 'absolute', backgroundColor: '#ffffff', bottom: 0, width: '100%', height: 100, padding: 20, flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <CustomButton
                        title={'Next'}
                        containerStyle={{ backgroundColor: '#ffffff', height: 50, width: '80%' }}
                        textStyle={{ color: '#7FC542ee' }}
                        onPress={() => handleNext()}
                    />
                </View>
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
});

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(SecurityActions(), dispatch)
    }
}

export default connect(null, mapDispatchToProps)(EndorseStep1);