import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../../styles/index';
import { FontAwesome5 } from '@expo/vector-icons';
import * as GlobalStyles from '../../../styles/styles';
import { ArrowForwardIcon } from '../../Icons/ArrowForwardIcon';
import EditIcon from '../../Icons/EditIcon';
import moment from 'moment';
import { width } from '../../Carousel/Carousel';

export const TripHeaderContainer = (props) => {
    const monthFormat = (d) => {
        if (!d) return '--';
        return moment(parseInt(d)).utc().format('MMM');
    }
    const dateFormat = (d) => {
        if (!d) return '--';
        return moment(parseInt(d)).utc().format('DD');
    }

    const getNMiles = () => {
        let n = props.totalNMiles;
        if (!n) return '--';
        let mile = n / 1852;
        return Math.round(mile);
    }

    return (
        <View
            style={[
                {
                    flexDirection: 'row',
                    paddingBottom: 10,
                    justifyContent: 'space-between',
                },
            ]}
        >
            <View
                style={[
                    {
                        flexDirection: 'row',
                        paddingBottom: 2,
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                    },
                ]}
            >
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: '#d2d2d2',
                        borderRadius: 7,
                        overflow: 'hidden',
                        flexDirection: 'column',
                        width: 50
                    }}
                >
                    <View
                        style={{
                            backgroundColor: '#f2f2f2',
                            alignItems: 'center',
                            borderBottomWidth: 1,
                            borderBottomColor: '#d2d2d2',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'SourceSansPro-SemiBold',
                                fontSize: width / 32,
                                color: '#000',
                                lineHeight: 19.94,
                                letterSpacing: -0.3,
                                paddingTop: 10,
                                paddingBottom: 7,
                                textTransform: 'uppercase'
                            }}
                        >
                            {monthFormat(props.startDate)}
                        </Text>
                    </View>
                    <View
                        style={{
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'SourceSansPro-SemiBold',
                                fontSize: width / 28,
                                color: '#000',
                                lineHeight: 19.94,
                                letterSpacing: -0.3,
                                paddingHorizontal: 11,
                                paddingBottom: 7,
                                paddingTop: 9,
                                textTransform: 'uppercase'
                            }}
                        >
                            {dateFormat(props.startDate)}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        marginLeft: 2,
                        marginRight: 2,
                    }}
                >
                    <ArrowForwardIcon />
                </View>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: '#d2d2d2',
                        borderRadius: 7,
                        overflow: 'hidden',
                        width: 50
                    }}
                >
                    <View
                        style={{
                            backgroundColor: '#f2f2f2',
                            alignItems: 'center',
                            borderBottomWidth: 1,
                            borderBottomColor: '#d2d2d2',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'SourceSansPro-SemiBold',
                                fontSize: width / 32,
                                color: '#000',
                                lineHeight: 19.94,
                                letterSpacing: -0.3,
                                paddingTop: 10,
                                paddingBottom: 7,
                                textTransform: 'uppercase'
                            }}
                        >
                            {monthFormat(props.endDate)}
                        </Text>
                    </View>
                    <View
                        style={{
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontFamily: 'SourceSansPro-SemiBold',
                                fontSize: width / 28,
                                color: '#000',
                                lineHeight: 19.94,
                                letterSpacing: -0.3,
                                paddingHorizontal: 11,
                                paddingBottom: 7,
                                paddingTop: 9,
                                textTransform: 'uppercase'
                            }}
                        >
                            {dateFormat(props.endDate)}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={{ flexDirection: 'row', position: 'relative' }}>
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#b6b6b654', paddingRight: width / 50 }}>
                    <Text style={{
                        color: '#333333',
                        fontFamily: 'SourceSansPro-SemiBold',
                        fontSize: width / 17,
                        textAlign: 'center',
                        // lineHeight: 38.45,
                        letterSpacing: -0.3,
                        paddingLeft: 3
                    }}>{getNMiles()}</Text>
                    <Text
                        style={{
                            color: Colors.colorGrey1,
                            fontFamily: 'SourceSansPro-SemiBold',
                            fontSize: width/39,
                            textTransform: 'uppercase'
                        }}
                        numberOfLines={1}
                    >Total NMiles</Text>
                </View>
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingLeft: width / 50, paddingRight: 5.5 }}>
                    <Text style={{
                        color: '#333333',
                        fontFamily: 'SourceSansPro-SemiBold',
                        fontSize: width / 17,
                        textAlign: 'center',
                        // lineHeight: 38.45,
                        letterSpacing: -0.3
                    }}>{props.underway ? props.underway : '--'}</Text>
                    <Text
                        style={{
                            color: Colors.colorGrey1,
                            fontFamily: 'SourceSansPro-SemiBold',
                            fontSize: width/39,
                            textTransform: 'uppercase'
                        }}
                        numberOfLines={1}
                    >Days underway</Text>
                </View>
                {
                    props.endDate && props.editUnderway && (
                        <TouchableOpacity
                            onPress={props.editUnderway}
                            style={{ position: 'absolute', right: -9, top: -2, width: 26, height: 26, backgroundColor: '#f2f2f2', borderRadius: 13, justifyContent: 'center', alignItems: 'center' }}>
                            <EditIcon width={12.5} height={12.5} />
                        </TouchableOpacity>
                    )
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...GlobalStyles.FlexContainer,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TripHeaderContainer;
