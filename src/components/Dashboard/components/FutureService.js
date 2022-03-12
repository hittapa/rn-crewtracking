import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { getTotalDays } from '../../../utils/dateTimeHelper';
import { width } from '../../Carousel/Carousel';
import CustomButton from '../../CustomButton';
import { CompassIconRed } from '../../Icons/CompassIconRed';

function FutureService(props) {
    const [user, setUser] = useState(null);
    const [vessel, setVessel] = useState(null);
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);

    useEffect(() => {
        setUser(props.user);;
        setVessel(props.vessel);
        setStart(props.start);
        setEnd(props.end);
    }, [props])
    if (user == null) {
        return (
            <View></View>
        )
    }
    return (
        <View style={{ width: '100%' }}>
            <View style={{ width: '100%', height: 'auto', padding: 14, alignItems: 'center', backgroundColor: '#fff', marginTop: 20, borderRadius: 7 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{
                            fontSize: width / 32, fontFamily: 'Roboto-Bold', lineHeight: 22, letterSpacing: -0.41, fontWeight: '800', color: '#000000'
                        }}>{moment(start).utc().format('MMM DD')}</Text>
                        <Text style={{
                            fontSize: width / 32, fontFamily: 'Roboto-Italic', lineHeight: 22, letterSpacing: -0.41, fontWeight: '300', fontStyle: 'italic', color: '#000000'
                        }}> to </Text>
                        <Text style={{
                            fontSize: width / 32, fontFamily: 'Roboto-Bold', lineHeight: 22, letterSpacing: -0.41, fontWeight: '800', color: '#000000'
                        }}>{end ? moment(end).utc().format('MMM DD') : '(Date N/A)'}</Text>
                        <Text style={{
                            fontSize: width / 32, fontFamily: 'Roboto-Italic', lineHeight: 22, letterSpacing: -0.41, fontWeight: '300', fontStyle: 'italic', color: '#000000'
                        }}>  {'Upcoming'}
                        </Text>
                    </View>
                    <Text style={{
                        fontSize: width / 28, fontFamily: 'Roboto-Bold', lineHeight: 22, letterSpacing: -0.41, color: '#1781CD', textTransform: 'uppercase'
                    }}
                        onPress={() => props.editLeave()}
                    >{"Onboard Service"}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: width/21,
        color: '#ffffff',
        lineHeight: 22,
        fontFamily: 'Roboto-Regular',
        letterSpacing: -0.41,
        fontWeight: '400',
    },
    subTitle: {
        fontSize: width/27,
        fontFamily: 'Roboto-Light',
        color: '#ffffff',
        lineHeight: 22,
        letterSpacing: -0.41,
        fontWeight: '400'
    },
})

export default FutureService;