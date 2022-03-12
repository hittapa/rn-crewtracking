import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { getTotalDays } from '../../../utils/dateTimeHelper';
import { width } from '../../Carousel/Carousel';
import CustomButton from '../../CustomButton';
import { CompassIconRed } from '../../Icons/CompassIconRed';

function TripDetectionCard(props) {
    const [user, setUser] = useState(null);
    const [vessel, setVessel] = useState(null);
    const [onleave, setOnLeave] = useState(false);
    const [tripStart, setTripStart] = useState(null);
    const [tripEnd, setTripEnd] = useState(null);
    const [leaveStart, setLeaveStart] = useState(null);
    const [leaveEnd, setLeaveEnd] = useState(null);
    const [inyard, setInYard] = useState(false);
    const [yardStart, setYardStart] = useState(null);
    const [yardEnd, setYardEnd] = useState(null);
    const [tripDetected, setTripDetected] = useState(null);

    useEffect(() => {
        setUser(props.user);;
        setVessel(props.vessel);
        setYardStart(props.yardStart);
        setYardEnd(props.yardEnd);
        setLeaveStart(props.leaveStart);
        setLeaveEnd(props.leaveEnd);
        setTripDetected(props.tripDetected);
        if (props.yardStart && props.yardEnd) setInYard(true); else setInYard(false)
        if (props.leaveStart && props.leaveEnd) setOnLeave(true); else setOnLeave(false)
    }, [props])
    if (user == null) {
        return (
            <View></View>
        )
    }
    return (
        <View style={{ width: '100%' }}>
            {
                // tripDetected == true ? (
                //     <View style={{ width: '100%', height: 'auto', padding: 20, alignItems: 'center', backgroundColor: '#fff', marginTop: 20, borderRadius: 7 }}>
                //         <Text style={{ ...styles.title, color: '#000', fontWeight: '500', fontSize: width / 19 }}>Trip detected...</Text>
                //         <Text style={{ ...styles.subTitle, color: '#777777', fontWeight: '400', textAlign: 'center' }}>
                //             A trip card will be created approximately 15mins after we detect no movement and you are in service range
                //         </Text>
                //     </View>
                // ) : (
                <>
                    {
                        // !leaveStart && !yardStart && vessel.trip_detection == false ? (
                        //     <View style={{ width: '100%', height: 'auto', padding: 20, alignItems: 'center', backgroundColor: '#fff', marginTop: 20, borderRadius: 7 }}>
                        //         <Text style={{
                        //             fontFamily: 'SourceSansPro-Regular',
                        //             fontSize: width / 18,
                        //             lineHeight: 25,
                        //             letterSpacing: -0.41,
                        //             color: '#000',
                        //             fontWeight: '700',
                        //             textAlign: 'center'
                        //         }}
                        //         >Trip detection OFF</Text>
                        //         <Text style={{
                        //             fontFamily: 'SourceSansPro-Regular',
                        //             fontSize: width / 24.5,
                        //             lineHeight: 22,
                        //             letterSpacing: -0.3,
                        //             color: '#696969',
                        //             fontWeight: '400',
                        //             textAlign: 'center'
                        //         }}>
                        //             Resumes: {moment().utc().format('DD MMM YYYY hh:mm')}
                        //         </Text>
                        //         <CustomButton
                        //             title={'Resume detection now'}
                        //             containerStyle={{ height: 52, borderRadius: 7, marginTop: 10 }}
                        //             textStyle={{ color: 'white' }}
                        //             onPress={() => { }}
                        //         />
                        //     </View>
                        // ) : (
                        <View>
                            {
                                leaveStart && (
                                    <View style={{ width: '100%', height: 'auto', padding: 14, alignItems: 'center', backgroundColor: '#fff', marginTop: 20, borderRadius: 7 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{
                                                    fontSize: width / 32, fontFamily: 'Roboto-Bold', lineHeight: 22, letterSpacing: -0.41, fontWeight: '800', color: '#000000'
                                                }}>{moment(leaveStart).utc().format('MMM DD')}</Text>
                                                <Text style={{
                                                    fontSize: width / 32, fontFamily: 'Roboto-Italic', lineHeight: 22, letterSpacing: -0.41, fontWeight: '300', fontStyle: 'italic', color: '#000000'
                                                }}> to </Text>
                                                <Text style={{
                                                    fontSize: width / 32, fontFamily: 'Roboto-Bold', lineHeight: 22, letterSpacing: -0.41, fontWeight: '800', color: '#000000'
                                                }}>{leaveEnd ? moment(leaveEnd).utc().format('MMM DD') : '(End date N/A)'}</Text>
                                                <Text style={{
                                                    fontSize: width / 32, fontFamily: 'Roboto-Italic', lineHeight: 22, letterSpacing: -0.41, fontWeight: '300', fontStyle: 'italic', color: '#000000'
                                                }}>  {moment(leaveStart).utc().diff(new Date()) < 0 ? leaveEnd ? `${getTotalDays(leaveStart, leaveEnd)} days` : 'Undefined' : 'Upcoming'}
                                                </Text>
                                            </View>
                                            <Text style={{
                                                fontSize: width / 28, fontFamily: 'Roboto-Bold', lineHeight: 22, letterSpacing: -0.41, color: '#1781CD', textTransform: 'uppercase'
                                            }}
                                                onPress={() => props.editLeave()}
                                            >{(moment(leaveStart).utc().diff(new Date()) < 0 && moment(leaveEnd).utc().diff(new Date()) > 0) ? "on leave" : "leave of absence"}</Text>
                                        </View>
                                        {/* {
                                            moment(leaveEnd).utc().diff(new Date()) > 0 && moment(leaveStart).utc().diff(new Date()) < 0 && (
                                                <>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 30 }}>
                                                        <CompassIconRed width={19} height={19} />
                                                        <Text style={{
                                                            fontFamily: 'SourceSansPro-Bold',
                                                            fontSize: width / 18,
                                                            lineHeight: 25,
                                                            letterSpacing: -0.41,
                                                            color: '#000',
                                                            fontWeight: '700',
                                                            textAlign: 'center',
                                                            paddingTop: 5,
                                                            paddingLeft: 5
                                                        }}
                                                        >
                                                            Trip detection will turn ON
                                                        </Text>
                                                    </View>
                                                    {
                                                        leaveEnd != null ? (
                                                            <Text style={{
                                                                fontFamily: 'SourceSansPro-Regular',
                                                                fontSize: width / 24.5,
                                                                lineHeight: 22,
                                                                letterSpacing: -0.3,
                                                                color: '#696969',
                                                                fontWeight: '400',
                                                                textAlign: 'center'
                                                            }}>
                                                                Resumes: {moment(leaveEnd).utc().format('DD MMM YYYY hh:mm')}
                                                            </Text>
                                                        ) : (
                                                            moment(leaveStart).utc().diff(new Date()) < 0 ? (
                                                                <>
                                                                    <Text style={{
                                                                        fontFamily: 'SourceSansPro-Regular',
                                                                        fontSize: width / 24.5,
                                                                        lineHeight: 22,
                                                                        letterSpacing: -0.3,
                                                                        color: '#696969',
                                                                        fontWeight: '400',
                                                                        textAlign: 'center'
                                                                    }}>
                                                                        {'Enter your end date, if you know it, to resume trip detection automatically..\nYou can also end your leave of absence below which will resume trip detection now'}
                                                                    </Text>
                                                                    <CustomButton
                                                                        title={'End leave of absence now'}
                                                                        containerStyle={{ height: 52, borderRadius: 7, marginTop: 10 }}
                                                                        textStyle={{ color: 'white' }}
                                                                        onPress={() => { }}
                                                                    />
                                                                </>
                                                            ) : (
                                                                <Text style={{
                                                                    fontFamily: 'SourceSansPro-Regular',
                                                                    fontSize: width / 24.5,
                                                                    lineHeight: 22,
                                                                    letterSpacing: -0.3,
                                                                    color: '#696969',
                                                                    fontWeight: '400',
                                                                    textAlign: 'center'
                                                                }}>
                                                                    {'Enter your end date, if you know it, to resume trip detection automatically..'}
                                                                </Text>
                                                            )
                                                        )
                                                    }
                                                </>
                                            )
                                        } */}
                                    </View>
                                )
                            }
                            {
                                yardStart && (
                                    <View style={{ width: '100%', height: 'auto', padding: 14, alignItems: 'center', backgroundColor: '#fff', marginTop: 20, borderRadius: 7 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={{
                                                    fontSize: width / 32, fontFamily: 'Roboto-Bold', lineHeight: 22, letterSpacing: -0.41, fontWeight: '800', color: '#000000'
                                                }}>{moment(yardStart).utc().format('MMM DD')}</Text>
                                                <Text style={{
                                                    fontSize: width / 32, fontFamily: 'Roboto-Italic', lineHeight: 22, letterSpacing: -0.41, fontWeight: '300', fontStyle: 'italic', color: '#000000'
                                                }}> to </Text>
                                                <Text style={{
                                                    fontSize: width / 32, fontFamily: 'Roboto-Bold', lineHeight: 22, letterSpacing: -0.41, fontWeight: '800', color: '#000000'
                                                }}>{yardEnd ? moment(yardEnd).utc().format('MMM DD') : '(End date N/A)'}</Text>
                                                <Text style={{
                                                    fontSize: width / 32, fontFamily: 'Roboto-Italic', lineHeight: 22, letterSpacing: -0.41, fontWeight: '300', fontStyle: 'italic', color: '#000000'
                                                }}>  {moment(yardStart).utc().diff(new Date()) < 0 ? yardEnd ? `${getTotalDays(yardStart, yardEnd)} days` : 'Undefined' : 'Upcoming'}</Text>
                                            </View>
                                            <Text style={{
                                                fontSize: width / 28, fontFamily: 'Roboto-Bold', lineHeight: 22, letterSpacing: -0.41, color: '#1781CD', textTransform: 'uppercase'
                                            }}
                                                onPress={() => props.editYard()}
                                            >{(moment(yardStart).utc().diff(new Date()) < 0 && moment(yardEnd).utc().diff(new Date()) > 0) ? "in yard" : "yard service"}</Text>
                                        </View>
                                        {/* {
                                            moment(yardEnd).utc().diff(new Date()) > 0 && moment(yardStart).utc().diff(new Date()) < 0 && (
                                                <>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 30 }}>
                                                        <CompassIconRed width={19} height={19} />
                                                        <Text style={{
                                                            fontFamily: 'SourceSansPro-Bold',
                                                            fontSize: width / 18,
                                                            lineHeight: 25,
                                                            letterSpacing: -0.41,
                                                            color: '#000',
                                                            fontWeight: '700',
                                                            textAlign: 'center',
                                                            paddingTop: 5,
                                                            paddingLeft: 5
                                                        }}
                                                        >
                                                            Trip detection will turn ON
                                                        </Text>
                                                    </View>
                                                    {
                                                        yardEnd != null ? (
                                                            <Text style={{
                                                                fontFamily: 'SourceSansPro-Regular',
                                                                fontSize: width / 24.5,
                                                                lineHeight: 22,
                                                                letterSpacing: -0.3,
                                                                color: '#696969',
                                                                fontWeight: '400',
                                                                textAlign: 'center'
                                                            }}>
                                                                Resumes: {moment(yardEnd).utc().format('DD MMM YYYY hh:mm')}
                                                            </Text>
                                                        ) : (
                                                            moment(yardStart).utc().diff(new Date()) < 0 ? (
                                                                <>
                                                                    <Text style={{
                                                                        fontFamily: 'SourceSansPro-Regular',
                                                                        fontSize: width / 24.5,
                                                                        lineHeight: 22,
                                                                        letterSpacing: -0.3,
                                                                        color: '#696969',
                                                                        fontWeight: '400',
                                                                        textAlign: 'center'
                                                                    }}>
                                                                        {'Enter your end date, if you know it, to resume trip detection automatically..\nYou can also end your leave of absence below which will resume trip detection now'}
                                                                    </Text>
                                                                    <CustomButton
                                                                        title={'End leave of absence now'}
                                                                        containerStyle={{ height: 52, borderRadius: 7, marginTop: 10 }}
                                                                        textStyle={{ color: 'white' }}
                                                                        onPress={() => { }}
                                                                    />
                                                                </>
                                                            ) : (
                                                                <Text style={{
                                                                    fontFamily: 'SourceSansPro-Regular',
                                                                    fontSize: width / 24.5,
                                                                    lineHeight: 22,
                                                                    letterSpacing: -0.3,
                                                                    color: '#696969',
                                                                    fontWeight: '400',
                                                                    textAlign: 'center'
                                                                }}>
                                                                    {'Enter your end date, if you know it, to resume trip detection automatically..'}
                                                                </Text>
                                                            )
                                                        )
                                                    }
                                                </>
                                            )
                                        } */}
                                    </View>
                                )
                            }
                        </View>
                        // )
                    }
                </>
                // )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: width / 21,
        color: '#ffffff',
        lineHeight: 22,
        fontFamily: 'Roboto-Regular',
        letterSpacing: -0.41,
        fontWeight: '400',
    },
    subTitle: {
        fontSize: width / 27,
        fontFamily: 'Roboto-Light',
        color: '#ffffff',
        lineHeight: 22,
        letterSpacing: -0.41,
        fontWeight: '400'
    },
})

export default TripDetectionCard;