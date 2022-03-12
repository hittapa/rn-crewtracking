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
import { dateStringToDate, dateStringToMilli, dateStringToMonth, dateStringToYear, getDateString, getTotalDays } from '../utils/dateTimeHelper';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from './CustomButton';
import { width } from './Carousel/Carousel';

function DatePicker(props) {

    const [title, setTitle] = useState(null)
    const [startDate, setStartDate] = useState(undefined)
    const [endDate, setEndDate] = useState(undefined)
    const [start, setStart] = useState(true);
    const [end, setEnd] = useState(false);
    const [current, setCurrent] = useState(undefined);
    const [totalDays, setTotalDays] = useState(0);

    useEffect(() => {
        let currentD = new Object();
        let today = new Date();
        currentD.dateString = getDateString(today);
        currentD.day = dateStringToDate(today);
        currentD.month = dateStringToMonth(today);
        currentD.year = dateStringToYear(today);
        currentD.timestamp = dateStringToMilli(today);
        setCurrent(currentD)
        setStartDate(currentD)
        if (props.startDate) {
            let _startD = new Object();
            _startD.dateString = getDateString(parseInt(props.startDate));
            _startD.day = dateStringToDate(parseInt(props.startDate));
            _startD.month = dateStringToMonth(parseInt(props.startDate));
            _startD.year = dateStringToYear(parseInt(props.startDate));
            _startD.timestamp = parseInt(props.startDate);
            setStartDate(_startD)
        }
        if (props.endDate) {
            let _endD = new Object();
            _endD.dateString = getDateString(parseInt(props.endDate));
            _endD.day = dateStringToDate(parseInt(props.endDate));
            _endD.month = dateStringToMonth(parseInt(props.endDate));
            _endD.year = dateStringToYear(parseInt(props.endDate));
            _endD.timestamp = parseInt(props.endDate);
            setEndDate(_endD)
        }
        if (props.title) {
            setTitle(props.title);
            if (props.startDate && props.endDate) {
                calcTotalDays(props.startDate, props.endDate)
            }
        }
    }, [props])

    const calcTotalDays = (sdate, edate) => {
        let totD = 0;
        totD = getTotalDays(sdate, edate);
        setTotalDays(totD);
    }

    const onSetDay = (day) => {
        if (startDate && endDate) {
            setStartDate(day)
            // if(props.title == 'Onboard service' && props.is_signedon){
            //     setStartDate(startDate);
            // }
            setEndDate(null)
            setTotalDays(0)
        } else {
            if (day.timestamp < startDate.timestamp) {
                setStartDate(day)
            } else {
                setEndDate(day)
                calcTotalDays(startDate, day)
            }
        }
    }

    const getMonth = (month) => {
        const monthStrings = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        if (month) {
            return monthStrings[month - 1];
        }
    }

    const onSave = () => {
        props.title == 'Underway' && props.updateTrip(totalDays, startDate?.timestamp, endDate?.timestamp);
        props.title == 'Onboard service' && props.updateVessel((moment(startDate.dateString).diff(new Date(), 'hours') <= 0) ? true : false, startDate?.timestamp, endDate?.timestamp);
        (props.title != 'Underway' && props.title != 'Onboard service') && props.onSave(startDate, endDate);
    }

    const markingDates = () => {
        let dates = {
            [startDate?.dateString]: {
                customStyles: {
                    container: {
                        backgroundColor: '#81c34a64',
                        borderRadius: 7,
                        textAlign: 'center',
                        justifyContent: 'center',
                        marginTop: 2,
                        marginBottom: -2
                    },
                    text: {
                        color: '#81c34a'
                    }
                }
            },
            [endDate?.dateString]: {
                customStyles: {
                    container: {
                        backgroundColor: '#81c34a64',
                        borderRadius: 7,
                        textAlign: 'center',
                        justifyContent: 'center',
                        marginTop: 2,
                        marginBottom: -2
                    },
                    text: {
                        color: '#81c34a'
                    }
                }
            },
        }
        if (startDate && endDate) {
            let _st = moment([startDate.year, startDate.month - 1, startDate.day]).utc();
            let _ed = moment([endDate.year, endDate.month - 1, endDate.day]).utc();
            let duration = Math.abs(_st.diff(_ed, 'days'));
            let _d = _st;
            for (var i = 0; i < duration; i++) {
                _d = _d.add(1, 'day');
                let _dateString = getDateString(_d);
                dates[_dateString] = {
                    customStyles: {
                        container: {
                            backgroundColor: 'transparent',
                        },
                        text: {
                            color: '#81c34a'
                        }
                    }
                }
            }
        }
        return dates;
    }

    return (
        <Modal
            isOpen={true}
            position={'center'}
            style={{ ...styles.modal, width: '100%', height: '100%' }}
            onClosed={() => props.onClose()}
            swipeArea={1}
        >
            <View style={{}}>
                <View style={{ ...styles.header, paddingTop: Platform.select({ios: 50, android: 0}), paddingBottom: 16, paddingHorizontal: 16 }}>
                    <TouchableOpacity style={{ width: 69 }} onPress={() => props.onClose()}>
                        <Ionicons
                            name='close'
                            color='#000000'
                            size={24}
                            style={{ ...styles.cancel }}
                        />
                    </TouchableOpacity>
                    {
                        (title == null || title == 'Onboard service') ?
                            <Text style={{ ...styles.title }}>Onboard service</Text>
                            :
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ ...styles.title }}>{title}</Text>
                                <Text style={{ ...styles.subTitle }}>total days</Text>
                            </View>
                    }
                    {
                        (title == null || title == 'Onboard service') ?
                            <View style={{ width: 69, height: 48 }}></View>
                            :
                            <View style={{ width: 69, height: 48, borderRadius: 11, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                                <Text style={{ ...styles.title }}>{totalDays}</Text>
                            </View>
                    }
                </View>
                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    height: 30,
                    justifyContent: 'space-around',
                    paddingHorizontal: 16,
                    borderBottomWidth: .5,
                    borderBottomColor: '#ebebeb'
                }}>
                    <Text style={{ ...styles.weekday }}>Sun</Text>
                    <Text style={{ ...styles.weekday }}>Mon</Text>
                    <Text style={{ ...styles.weekday }}>Tue</Text>
                    <Text style={{ ...styles.weekday }}>Wed</Text>
                    <Text style={{ ...styles.weekday }}>Thu</Text>
                    <Text style={{ ...styles.weekday }}>Fri</Text>
                    <Text style={{ ...styles.weekday }}>Sat</Text>
                </View>
                <CalendarList
                    onVisibleMonthsChange={(months) => { }}
                    pastScrollRange={50}
                    futureScrollRange={50}
                    scrollEnabled={true}
                    showScrollIndicator={true}
                    style={{
                        height: Platform.select({
                            ios: Dimensions.get('screen').height - 400,
                            android: Dimensions.get('screen').height - 430
                        })
                    }}
                    current={startDate}
                    // minDate={((props.title != 'Onboard service') && (props.title != 'Underway')) && current?.dateString}
                    onDayPress={(day) => onSetDay(day)}
                    hideDayNames={true}

                    theme={{
                        backgroundColor: '#fff',
                        calendarBackground: '#fff',
                        textSectionTitleColor: '#ababab',
                        textSectionTitleDisabledColor: '#ebebf580',
                        selectedDayBackgroundColor: '#81c34a64',
                        selectedDayTextColor: '#fff',
                        todayTextColor: '#81c34a',
                        dayTextColor: '#000',
                        textDisabledColor: '#ebebf590',
                        dotColor: '#feeffb',
                        selectedDotColor: '#ffffff',
                        arrowColor: '#fff',
                        disabledArrowColor: '#ebebf550',
                        monthTextColor: '#000',
                        indicatorColor: 'blue',
                        textDayFontFamily: 'SourceSansPro-Regular',
                        textMonthFontFamily: 'SourceSansPro-Regular',
                        textDayHeaderFontFamily: 'SourceSansPro-Regular',
                        textDayFontWeight: '300',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '300',
                        textDayFontSize: 20,
                        textMonthFontSize: 24,
                        textDayHeaderFontSize: 16
                    }}
                    markingType='custom'
                    markedDates={markingDates()}
                />
                <View style={{
                    padding: 16,
                    height: 250,
                }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            paddingVertical: 12
                        }}
                    >
                        <View style={{
                            width: '50%',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRightWidth: .5,
                            borderRightColor: '#ebebeb',
                            paddingVertical: 10,
                            paddingHorizontal: width/40
                        }}>
                            <Text style={[{ ...styles.dateLabel }]}>Start date</Text>
                            {
                                startDate ?
                                    <Text style={{ ...styles.dateText }} numberOfLines={1}>{moment(startDate.timestamp).utc().format('ddd, MMM DD')}</Text>
                                    :
                                    <Text style={{ ...styles.dateText }}>N/A</Text>
                            }
                        </View>
                        <View style={{
                            width: '50%',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingVertical: 10,
                            paddingHorizontal: width/40
                        }}>
                            <Text style={[{ ...styles.dateLabel }]}>End date</Text>
                            {
                                endDate ?
                                    <Text style={{ ...styles.dateText }} numberOfLines={1}>{moment(endDate.timestamp).utc().format('ddd, MMM DD')}</Text>
                                    :
                                    <Text style={{ ...styles.dateText }}>N/A</Text>
                            }
                        </View>
                    </View>
                    <View style={{
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 12
                    }}>
                        <CustomButton
                            title={props.buttonText ? props.buttonText : 'Select date(s)'}
                            containerStyle={{
                                height: 50,
                                width: Dimensions.get('screen').width - 64
                            }}
                            textStyle={{
                                color: '#fff'
                            }}
                            onPress={() => onSave()}
                        />
                        {
                            title && title == 'Leave of absence' && (
                                <CustomButton
                                    title={'Delete leave'}
                                    containerStyle={{
                                        height: 50,
                                        width: Dimensions.get('screen').width - 64,
                                        borderColor: 'transparent',
                                        backgroundColor: 'transparent'
                                    }}
                                    textStyle={{
                                        color: '#c21717'
                                    }}
                                    onPress={() => props.deleteLeave()}
                                />
                            )
                        }
                        {
                            title && title == 'Yard service' && (
                                <CustomButton
                                    title={'Delete yard service'}
                                    containerStyle={{
                                        height: 50,
                                        width: Dimensions.get('screen').width - 64,
                                        borderColor: 'transparent',
                                        backgroundColor: 'transparent'
                                    }}
                                    textStyle={{
                                        color: '#c21717'
                                    }}
                                    onPress={() => props.deleteYard()}
                                />
                            )
                        }{
                            title && title == 'Onboard service' && props.deleteService != null && (
                                <CustomButton
                                    title={'Delete period'}
                                    containerStyle={{
                                        height: 50,
                                        width: Dimensions.get('screen').width - 64,
                                        borderColor: 'transparent',
                                        backgroundColor: 'transparent'
                                    }}
                                    textStyle={{
                                        color: '#c21717'
                                    }}
                                    onPress={() => props.deleteService()}
                                />
                            )
                        }
                    </View>
                </View>
            </View>

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
        height: 110,
    },
    title: {
        color: '#000',
        fontFamily: 'Roboto-Bold',
        fontWeight: '500',
        fontSize: width / 19,
        lineHeight: 22,
        letterSpacing: -0.41
    },
    subTitle: {
        color: '#000',
        fontFamily: 'Roboto-Light',
        fontWeight: '300',
        fontSize: width/27,
        lineHeight: 22,
        letterSpacing: -0.41,
        textTransform: 'uppercase'
    },
    cancel: {
        width: 45,
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
        fontSize: width / 18,
        // lineHeight: 28,
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
        fontSize: width / 30,
        color: 'gray',
        fontFamily: 'Roboto-Regular',
        fontWeight: '500',
        textAlign: 'center',
        width: 35
    }
})

export default DatePicker;