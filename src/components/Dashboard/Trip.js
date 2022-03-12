import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Colors } from '../../styles/index';
import * as GlobalStyles from '../../styles/styles';
import {
    TripHeaderContainer,
    TripMap,
    TripStats,
    TripNotes, TripLocationContainer,
} from '../../components/Dashboard/components';
import { AntDesign, Feather, FontAwesome5 } from '@expo/vector-icons';
import moment from 'moment';

export const Trip = (props) => {
    const [componentName, setComponentName] = useState('tripMap');
    const [footerWidth, setFooterWidth] = useState(300);

    useEffect(() => {
        if(props.component) setComponentName(props.component);
    }, [props])
    const onLayout = event => {
        const { width } = event.nativeEvent.layout;
        setFooterWidth(width);
    };

    const renderComponents = _componentName => {
        switch (_componentName) {
            case 'tripMap':
                return <TripMap navigation={props.navigation} trip={props.trip} departure={props.departure} destination={props.destination} trip={props.trip} user={props.user} setFirstTripAlert={props.setFirstTripAlert} />;
            case 'tripStats':
                return <TripStats showStatsModal={props.showStatsModal} trip={props.trip} user={props.user} watchkeeping={props.watchkeeping} vessel={props.vessel} />;
            case 'tripNotes':
                return <TripNotes tr={props.trip} user={props.user} handleSubmit={props.updateTrip} />;
        }
    };

    const getTime = (d) => {
        if (!d) return '--:-- --';
        return moment(parseInt(d)).format('h:mm A')
    }

    return (
        <View
            style={[
                styles.tripContainer,
                {
                    // flex: 1,
                    alignItems: 'center',
                    // marginTop: -7,
                    borderRadius: 11,
                    paddingTop: 16,
                    height: 587,
                    // marginBottom: 20
                },
                props.style
            ]}
            onLayout={event => onLayout(event)}
        >
            <View style={{
                justifyContent: 'space-between',
            }}>
                <TripHeaderContainer
                    startDate={props.trip.start_date}
                    endDate={props.trip.end_date}
                    totalNMiles={props.trip.total_nmiles}
                    underway={props.trip.underway}
                    editUnderway={props.editUnderway}
                />

                {renderComponents(componentName)}

                <TripLocationContainer
                    trip={props.trip}
                    placeOf={'joining'}
                    countryCode={props.departure ? props.departure?.country_code : '--'}
                    portName={props.departure ? props.departure?.locode : '--'}
                    fullName={props.departure ? props.departure.name : '--'}
                    portCode={'ATD'}
                    time={getTime(props.trip.start_date)}
                    componentName={componentName}
                />
                <TripLocationContainer
                    trip={props.trip}
                    placeOf={'discharge'}
                    countryCode={props.destination ? props.destination?.country_code : '--'}
                    portName={props.destination ? props.destination?.locode : '--'}
                    fullName={props.destination ? props.destination.name : '--'}
                    portCode={'ATA'}
                    time={getTime(props.trip.end_date)}
                    componentName={componentName}
                />

                <View style={[styles.footerContainer, { width: footerWidth, height: 53 }]}>
                    <View
                        style={{
                            flexDirection: 'row',
                            width: 200,
                            justifyContent: 'flex-start'
                        }}
                    >
                        <View
                            style={{
                                width: 49.96,
                                paddingVertical: 5,
                                borderColor: Colors.colorGrey1,
                                borderBottomWidth:
                                    componentName === 'tripMap' ? 2 : 0,
                            }}
                        >
                            <Pressable
                                onPress={() => setComponentName('tripMap')}
                            >
                                <Feather
                                    name="map-pin"
                                    size={26}
                                    color={
                                        componentName === 'tripMap'
                                            ? Colors.colorGrey1
                                            : Colors.colorGrey4
                                    }
                                    style={{
                                        alignSelf: 'center',
                                    }}
                                />
                            </Pressable>
                        </View>

                        {
                            props.trip.end_date && props.user?.plan.includes('pro') && (
                                <View
                                    style={{
                                        width: 49.96,
                                        paddingVertical: 5,
                                        borderColor: Colors.colorGrey1,
                                        borderBottomWidth:
                                            componentName === 'tripStats' ? 2 : 0,
                                    }}
                                >
                                    <Pressable
                                        onPress={() => setComponentName('tripStats')}
                                    >
                                        <AntDesign
                                            name="barschart"
                                            size={26}
                                            color={
                                                componentName === 'tripStats'
                                                    ? Colors.colorGrey1
                                                    : Colors.colorGrey4
                                            }
                                            style={{
                                                alignSelf: 'center',
                                            }}
                                        />
                                    </Pressable>
                                </View>
                            )
                        }

                        <View
                            style={{
                                width: 49.96,
                                paddingVertical: 5,
                                borderColor: Colors.colorGrey1,
                                borderBottomWidth:
                                    componentName === 'tripNotes' ? 2 : 0,
                            }}
                        >
                            <Pressable
                                onPress={() => setComponentName('tripNotes')}
                            >
                                <Feather
                                    name="edit"
                                    size={26}
                                    color={
                                        componentName === 'tripNotes'
                                            ? Colors.colorGrey1
                                            : Colors.colorGrey4
                                    }
                                    style={{
                                        alignSelf: 'center',
                                    }}
                                />
                            </Pressable>
                        </View>
                    </View>

                    <View
                        style={{
                            width: 30,
                            paddingVertical: 5,
                            borderColor: Colors.colorGrey3,
                        }}
                    >
                        <Pressable
                            onPress={() => props.deleteTrip({ id: props.trip?.id, user: props.user?.id })}
                        >
                            {({ pressed }) => (
                                <FontAwesome5
                                    name="trash-alt"
                                    size={26}
                                    color={
                                        pressed
                                            ? Colors.colorGrey1
                                            : Colors.colorRed
                                    }
                                    style={{
                                        alignSelf: 'flex-end',
                                    }}
                                />
                            )}
                        </Pressable>
                    </View>
                </View>
            </View>
            <View style={{ flex: 1 }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...GlobalStyles.FlexContainer,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tripContainer: {
        height: 'auto',
        position: 'relative',
        paddingBottom: 70,
        paddingTop: 12,
        paddingHorizontal: 14,
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: Colors.colorWhite,
        width: '100%'
    },
    footerContainer: {
        position: 'absolute',
        left: -14,
        bottom: -69.5,
        backgroundColor: Colors.colorGrey6,
        paddingHorizontal: 20,
        paddingTop: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
});

export default Trip;
