import React, { useState } from 'react';
import {
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    View,
    Text,
} from 'react-native';
// import { View, Text } from 'moti';
import { Buttons, Colors } from '../../../styles/index';
import { Formik } from 'formik';
import * as yup from 'yup';
import * as GlobalStyles from '../../../styles/styles';
import { Input } from '../../Form/Fields';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { width } from '../../Carousel/Carousel';

export const TripStats = (props) => {

    const [modalTitle, setModalTitle] = useState('');

    const Card = ({ name, subname, ki, value, handlePress }) => {
        return (
            <TouchableOpacity style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '47%',
                height: 75,
                margin: 4,
                borderWidth: 1,
                borderColor: '#f1f1f1',
                borderRadius: 7,
                paddingVertical: 10
            }}
                onPress={() => handlePress ? handlePress(props.trip, name, ki) : null}
            >
                <Text style={{
                    ...styles.name
                }} numberOfLines={1}>{name}</Text>
                <Text style={{
                    ...styles.subname
                }}>{subname}</Text>
                <Text style={{
                    ...styles.value
                }}>{value}</Text>
            </TouchableOpacity>
        )
    }

    const onShowModal = (trip, name, key) => {
        props.showStatsModal(trip, name, key);
    }
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'position' : 'height'}
            style={[styles.container]}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View
                    style={{
                        borderRadius: 5,
                        textAlign: 'center',
                        width: '100%'
                    }}
                >
                    <View
                        style={[
                            {
                                paddingTop: 10,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                {
                                    fontSize: width/24.5,
                                    color: '#8e8e8e',
                                    fontFamily: 'Roboto-Regular',
                                    fontWeight: '400',
                                    lineHeight: width/20,
                                    letterSpacing: -0.3,
                                    textTransform: 'uppercase'
                                },
                            ]}
                        >
                            Trip stats
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                        {props.vessel?.showWatchkeeping && Card({name: "Watchkeeping", subname: 'Days', ki: 'watchkeeping', value: props.trip.watchkeeping ? props.trip.watchkeeping : 0, handlePress: (trip, name, key) => onShowModal(trip, name, key)})}
                        {props.vessel?.showStandbyService && Card({name: "Standby", subname: 'Days', ki: 'standby', value: props.trip.standby ? props.trip.standby : 0, handlePress: (trip, name, key) => onShowModal(trip, name, key)})}
                        {props.vessel?.showStandbyService && Card({name: "AV. HRS Underway", subname: 'Hours', ki: 'av_hours_underway_per_day', value: props.trip.av_hours_underway_per_day ? props.trip.av_hours_underway_per_day : 0, handlePress: (trip, name, key) => onShowModal(trip, name, key)})}
                        {props.vessel?.showStandbyService && Card({name: "AV.Distance offshore", subname: 'NM', ki: 'av_distance_offshore', value: props.trip.av_distance_offshore ? props.trip.av_distance_offshore : 0, handlePress: (trip, name, key) => onShowModal(trip, name, key)})}
                        {props.vessel?.showUscgStatistics && Card({name: "Seaward", subname: 'USCG Boundary line', ki: 'seaward', value: props.trip.seaward ? props.trip.seaward : 0, handlePress: (trip, name, key) => onShowModal(trip, name, key)})}
                        {props.vessel?.showUscgStatistics && Card({name: "Shoreward", subname: 'USCG Boundary line', ki: 'shoreward', value: props.trip.shoreward ? props.trip.shoreward : 0, handlePress: (trip, name, key) => onShowModal(trip, name, key)})}
                        {props.vessel?.showUscgStatistics && Card({name: "On Great Lakes", subname: 'Days', ki: 'lakes', value: props.trip.lakes ? props.trip.lakes : 0, handlePress: (trip, name, key) => onShowModal(trip, name, key)})}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};
const styles = StyleSheet.create({
    container: {
        ...GlobalStyles.FlexContainer,
    },
    name: {
        fontFamily: 'Roboto-Regular',
        fontWeight: '500',
        fontSize: width / 35,
        // lineHeight: width / 20,
        letterSpacing: -0.41,
        color: '#808080',
        textTransform: 'uppercase'
    },
    subname: {
        fontFamily: 'Roboto-Regular',
        fontWeight: '500',
        fontSize: width/37,
        // lineHeight: width/30,
        letterSpacing: -0.41,
        color: '#ababab'
    },
    value: {
        fontFamily: 'Roboto-Bold',
        fontSize: width/23,
        // lineHeight: width/18,
        letterSpacing: -0.41,
        color: '#6aabff'
    }
});

export default TripStats;
