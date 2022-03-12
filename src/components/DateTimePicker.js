import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    Platform,
    TouchableOpacity
} from 'react-native';
import Modal from 'react-native-modalbox';
import { Calendar, Arrow, CalendarList } from 'react-native-calendars';
import { useEffect } from 'react';
import { dateStringToDate, dateStringToMilli, dateStringToMonth, dateStringToYear, getDateString } from '../utils/dateTimeHelper';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from './CustomButton';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { width } from './Carousel/Carousel';


function DateTimePicker(props) {

    const [current, setCurrent] = useState(new Date());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (!mounted) {
            // console.log(props.resumeDate)
            setCurrent(new Date(props.value));
            setMounted(true)
        }
    }, [props])

    return (
        <Modal
            isOpen={true}
            position={'center'}
            style={{ ...styles.modal, width: 343, height: 360, borderRadius: 13, overflow: 'hidden', padding: 8 }}
            onClosed={() => {
                if (typeof current == 'number')
                    props.setResumeDate(current)
                else
                    props.setResumeDate(current.getTime())
                props.onClose()
            }}
        >
            <RNDateTimePicker
                mode={'datetime'}
                value={current}
                display={'inline'}
                onChange={(event, date) => {
                    setCurrent(date);
                }}
            />
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: "flex-start",
        backgroundColor: '#f6f6f9'
    },
    centeredView: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        padding: 10
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 100,
    },
    title: {
        color: '#000',
        fontFamily: 'Roboto-Bold',
        fontWeight: '500',
        fontSize: width / 19,
        lineHeight: 22,
        letterSpacing: -0.41
    },
    cancel: {
        width: 45,
        paddingLeft: 16
    },
    dateLabel: {
        color: '#000',
        fontFamily: 'SourceSansPro-Regular',
        fontWeight: '600',
        fontSize: width / 26,
        lineHeight: 24,
        letterSpacing: 0.38,
        textAlign: 'left',
        width: '100%'
    },
    date: {
        width: 43,
        height: 36,
        borderRadius: 6,
        backgroundColor: '#76768064',
        paddingHorizontal: 8,
        paddingVertical: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    month: {
        width: 106,
        height: 36,
        borderRadius: 6,
        backgroundColor: '#76768064',
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginLeft: 9.9,
        justifyContent: 'center',
        alignItems: 'center'
    },
    dateText: {
        color: '#000',
        fontFamily: 'SourceSansPro-SemiBold',
        fontWeight: '400',
        fontSize: width / 17,
        lineHeight: 28,
        letterSpacing: 0.35,
        textAlign: 'left',
        width: '100%'
    },
    monthText: {
        color: '#fff',
        fontFamily: 'SourceSansPro-Regular',
        fontWeight: '500',
        fontSize: width/27,
        lineHeight: 20,
        letterSpacing: -0.24,
    },
    weekday: {
        fontSize: width / 26,
        color: 'gray',
        fontFamily: 'Roboto-Regular',
        fontWeight: '500',
        textAlign: 'center',
        width: 35
    }
})

export default DateTimePicker;