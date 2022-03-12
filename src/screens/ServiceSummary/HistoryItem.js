import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { width } from '../../components/Carousel/Carousel';

function HistoryItem(props) {
    const [summary, setSummary] = useState(null)
    const [showItem, setShowItem] = useState(false)

    const { data, showSummary, itemID } = props;

    useEffect(() => {
        setSummary(data)
    }, [data])

    useEffect(() => {
        if (showSummary === itemID) {
            setShowItem(true)
        }
    }, [showSummary, itemID])

    const ListItem = ({ title, value, border = false }) => {
        return (
            <View style={[{
                ...styles.listItem,
            }, border && { borderBottomWidth: 0 }]}>
                <Text style={{
                    ...styles.subTitle
                }}>
                    {title}
                </Text>
                <Text style={{
                    ...styles.label
                }}>{value}</Text>
            </View>
        )
    }

    return (
        <View
            style={{
                flexDirection: 'column',
                borderBottomWidth: .5,
                borderBottomColor: '#f1f1f1',
                padding: 8,
                backgroundColor: '#fff'
            }}
            key={props.itemID}
        >
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    padding: 14
                }}
                onPress={() => {
                    props.setShowSummary(props.itemID);
                    setShowItem(!showItem)
                }}
            >
                <View
                    style={{
                        flexDirection: 'column',
                        justifyContent: 'space-evenly',
                    }}
                >
                    {props.title}
                    {props.subtitle}
                </View>
                <View
                    style={{
                        flexDirection: 'column',
                        justifyContent: 'space-evenly',
                    }}
                >
                    <Text
                        style={{
                            ...styles.title,
                            textAlign: 'right'
                        }}
                    >
                        {props.day}
                    </Text>
                    <Text
                        style={{
                            ...styles.label,
                            textAlign: 'right'
                        }}
                    >
                        {'Days underway'}
                    </Text>
                </View>
            </TouchableOpacity>
            {
                props.showSummary === props.itemID && summary && showItem && (
                    <View style={{
                        flexDirection: 'row',
                        width: '100%',
                        borderRadius: 11,
                        backgroundColor: '#f0f0f0',
                        justifyContent: 'space-between',
                        paddingLeft: 13,
                        overflow: 'hidden',
                    }}>
                        <View style={{
                            flexDirection: 'column'
                        }}>
                            {
                                summary.av_hours != undefined && ListItem({ title: 'Average hours underway per day', value: summary.av_hours + ' hrs' })
                            }
                            {
                                summary.av_distance != undefined && ListItem({ title: 'Average distance offshore', value: summary.av_distance + ' nm', border: true })
                            }
                            {
                                props.pro && summary.onboard != undefined && (
                                    <View style={{
                                        ...styles.listItem,
                                        borderBottomWidth: 0,
                                    }}>
                                        <Text style={{
                                            ...styles.title
                                        }}>
                                            Days onboard
                                                    </Text>
                                        <Text style={{
                                            ...styles.title
                                        }}>{summary.onboard}</Text>
                                    </View>
                                )
                            }
                            {
                                props.pro && summary.onleave != undefined && ListItem({ title: 'On leave', value: summary.onleave + ' days' })
                            }
                            {
                                props.pro && summary.yard_service != undefined && ListItem({ title: 'Yard service', value: summary.yard_service + ' days', border: true })
                            }
                        </View>
                    </View>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: width / 19,
        color: '#000',
        lineHeight: 22,
        fontFamily: 'Roboto-Regular',
        letterSpacing: -0.41,
        fontWeight: '500',
    },
    subTitle: {
        fontSize: width/24.5,
        lineHeight: 19.92,
        letterSpacing: -0.3,
        fontWeight: '400',
        fontFamily: 'Roboto-Regular',
        color: '#000'
    },
    label: {
        fontSize: width/27,
        color: '#3c3c43',
        lineHeight: 22,
        fontFamily: 'Roboto-Light',
        fontWeight: '300',
        letterSpacing: -0.41
    },
    listItem: {
        height: 44,
        width: Dimensions.get('screen').width - 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 13,
        paddingTop: 11.5,
        paddingBottom: 10.5,
        alignItems: 'center',
        borderBottomWidth: .5,
        borderBottomColor: '#999'
    },
})

export default HistoryItem;