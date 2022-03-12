import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    SafeAreaView,
    Text,
    Dimensions,
    TouchableOpacity,
    Platform
} from 'react-native';
import * as GlobalStyles from '../styles/styles';
import { Colors } from '../styles/index';
import { HeaderLeft } from '../components/Header/HeaderLeft';
import { HeaderRight } from '../components/Header/HeaderRight';
import { HeaderTitle } from '../components/Header/HeaderTitle';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SecurityActions from '../actions/SecurityActions';
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons, Ionicons, Fontisto } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';
import { VesselIcon } from '../components/Icons/VesselIcon';
import { height, width } from '../components/Carousel/Carousel';
import Constants from 'expo-constants';
import { ActivityIndicator } from 'react-native';

function VesselsScreen(props) {
    const [user, setUser] = useState(null);
    const [pro, setPro] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [vessels, setVessels] = useState([]);
    const [onBoardVessels, setOnBoardVessels] = useState([]);
    const [noOnBoardVessels, setNoOnBoardVessels] = useState([]);
    const [listHeight, setListHeight] = useState(Dimensions.get('screen').height - 400);
    const [reload, setReload] = useState(false);
    const [noDateAmount, setNoDateAmount] = useState(false);

    useEffect(() => {
        setUser(props.user);
        if (props.user.plan.includes('pro')) setPro(true);
        if (!props.vessels && !mounted)
            getVessels(props.user.id)
        else {
            console.log(props.vessels)
            filterVessels(props.vessels);
        }
        setMounted(true);
    }, [props, mounted])

    getVessels = async (user) => {
        const result = await props.actions.getVessels({ user: user });
        filterVessels(result);
    }

    filterVessels = (data) => {
        let _temp = [];
        let _on = [];
        let _noon = [];
        data?.map((i) => {
            if (i.service_periods && i.service_periods != '[]') {
                if (i.is_signedon) {
                    _on.unshift(i);
                } else {
                    _on.push(i);
                }
            } else {
                _noon.push(i);
            }
        });
        setOnBoardVessels(_on);
        setNoOnBoardVessels(_noon);
    }

    const Vessel = ({ data, index }) => {
        return (
            <>
                <View style={{ flex: 1, flexDirection: 'row', borderBottomWidth: .5, borderBottomColor: '#c6c6c8', marginLeft: 16, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: .5, borderBottomColor: '#c8c8c8', paddingTop: 26 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Text
                            style={{ color: '#007aff', fontSize: width/21, lineHeight: 22, letterSpacing: -0.41, fontWeight: '400', fontFamily: 'Roboto-Regular' }}
                            onPress={() => props.navigation.navigate('Dashboard', { vessel: data })}
                        >{data.name ? data.name : " -- "}</Text>
                        {
                            ((pro && data.is_signedon) || (!pro && data.isDefault)) && (
                                <Ionicons
                                    name={'checkmark-done-circle'}
                                    size={16}
                                    color={'#007aff'}
                                    style={{ paddingHorizontal: 8 }}
                                />
                            )
                        }
                    </View>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
                        onPress={() => props.navigation.navigate('VesselDetail', { vessel: data })}
                    >
                        <Text style={{ color: '#ababab', fontSize: width/27, fontFamily: 'Roboto-Light', lineHeight: 22, letterSpacing: -0.41, fontWeight: '300' }}>{data.detailedType ? data.detailedType : data.type}</Text>
                        <MaterialIcons
                            name={'arrow-forward-ios'}
                            size={15}
                            color={'#ababab'}
                            style={{ paddingRight: 16, paddingLeft: 8 }}
                        />
                    </TouchableOpacity>
                </View>
            </>
        )
    }

    const onLayout = (e) => {
        let _hi = height - 150 - e.nativeEvent.layout.height;
        console.log(e.nativeEvent.layout.height)
        console.log(_hi)
        setListHeight(_hi)
    }

    return (
        <View style={GlobalStyles.FlexContainer}>
            <SafeAreaView style={[GlobalStyles.safeView]}>
                <View style={[{ height: 50, top: 0, left: 0, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }]}>
                    <HeaderLeft onPress={() => props.navigation.openDrawer()}>
                        <View
                            style={{
                                borderRadius: 50,
                                alignItems: 'center',
                            }}
                        >
                            <FontAwesome5
                                name="bars"
                                style={{ marginLeft: 20 }}
                                size={28}
                                color={'#000'}
                            />
                        </View>
                    </HeaderLeft>
                    <HeaderTitle>
                        <Text style={{
                            color: 'black',
                            fontSize: width / 18,
                            fontWeight: 'bold',
                        }}>Vessels</Text>
                    </HeaderTitle>
                    <HeaderRight onPress={() => props.navigation.navigate('AddVessel', { type: 'Vessels' })}>
                        <View
                            style={{
                                backgroundColor: Colors.colorWhite,
                                borderRadius: 50,
                                alignItems: 'center',
                                marginRight: 20
                            }}
                        >
                            <MaterialCommunityIcons
                                name="plus"
                                size={28}
                                color={Colors.colorGreen}
                            />
                        </View>
                    </HeaderRight>
                </View>
                <View style={[{ width: '100%', height: Dimensions.get('screen').height - 50 - Constants.statusBarHeight, backgroundColor: '#fff', paddingBottom: 30 }]}>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', backgroundColor: '#f9f9f9', alignItems: 'center', paddingVertical: 30, borderTopWidth: .5, borderTopColor: '#c8c8c8' }} onLayout={(e) => onLayout(e)}>
                        <View style={{ backgroundColor: '#fff', width: 80, height: 80, borderRadius: 80, alignItems: 'center', justifyContent: 'center' }}>
                            <VesselIcon />
                        </View>
                        <View style={{ paddingHorizontal: 50, paddingTop: 20 }}>
                            <Text style={{ textAlign: 'center', fontSize: width / 23, lineHeight: 25.5, color: '#646464', fontWeight: '300', fontFamily: 'Roboto-Light', letterSpacing: -0.3 }}>
                                These are the vessels you have traveled aboard or will travel aboard. Add vessels to this list and easily track your time at sea.
                            </Text>
                        </View>
                    </View>
                    {
                        reload && (
                            <ActivityIndicator size={'large'} color={'#799797'} />
                        )
                    }
                    <ScrollView
                        style={{ paddingTop: 16, paddingLeft: 0, height: listHeight }}
                        scrollEventThrottle={16}
                        onScroll={async (e) => {
                            if (e.nativeEvent.contentOffset.y < -100 && reload == false) {
                                setReload(true)
                                props.actions.getVessels({ user: user.id }).then(ves => {
                                    setVessels(ves)
                                    setReload(false)
                                }).catch(err => {
                                    console.log(err);
                                    setReload(false)
                                });                                
                            }
                        }}
                    >
                        {
                            pro && (<Text style={styles.label}>Onboard service dates entered</Text>)
                        }
                        {
                            pro && (
                                onBoardVessels.length > 0 ? (
                                    <FlatList
                                        data={onBoardVessels}
                                        renderItem={({ item, index }) => (
                                            <Vessel data={item} index={index} />
                                        )}
                                        keyExtractor={(item, index) => index.toString()}
                                        bounces={false}
                                    />
                                ) : (
                                    <View style={{ flex: 1, flexDirection: 'row', borderBottomWidth: .5, borderBottomColor: '#c6c6c8', marginLeft: 16, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: .5, borderBottomColor: '#c8c8c8', paddingTop: 26 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                            <Text
                                                style={{ color: '#007aff', fontSize: width / 21, lineHeight: 22, letterSpacing: -0.41, fontWeight: '400', fontFamily: 'Roboto-Regular' }}
                                            ></Text>
                                        </View>
                                        <TouchableOpacity
                                            style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
                                            onPress={() => props.navigation.navigate('VesselDetail', { vessel: data })}
                                        >
                                            <Text style={{ color: '#ababab', fontSize: width/27, fontFamily: 'Roboto-Light', lineHeight: 22, letterSpacing: -0.41, fontWeight: '300' }}></Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            )
                        }
                        {
                            pro && (<Text style={styles.label}>No Onboard service dates entered</Text>)
                        }
                        {
                            noOnBoardVessels.length > 0 ? (
                                <FlatList
                                    data={noOnBoardVessels}
                                    renderItem={({ item, index }) => (
                                        <Vessel data={item} index={index} />
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                    bounces={false}
                                />
                            ) : (
                                <View style={{ flex: 1, flexDirection: 'row', borderBottomWidth: .5, borderBottomColor: '#c6c6c8', marginLeft: 16, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: .5, borderBottomColor: '#c8c8c8', paddingTop: 26 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                        <Text
                                            style={{ color: '#007aff', fontSize: width / 21, lineHeight: 22, letterSpacing: -0.41, fontWeight: '400', fontFamily: 'Roboto-Regular' }}
                                        ></Text>
                                    </View>
                                    <TouchableOpacity
                                        style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
                                        onPress={() => props.navigation.navigate('VesselDetail', { vessel: data })}
                                    >
                                        <Text style={{ color: '#ababab', fontSize: width/27, fontFamily: 'Roboto-Light', lineHeight: 22, letterSpacing: -0.41, fontWeight: '300' }}></Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: width / 32,
        color: '#3c3c43',
        textTransform: 'uppercase',
        lineHeight: 18,
        paddingTop: 34,
        paddingLeft: 12,
        fontFamily: 'Roboto-Light',
        fontWeight: '400',
        letterSpacing: -0.08
    },
});

const mapStateToProps = state => {
    return {
        user: state.APP.USER,
        vessels: state.APP.VESSELS
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(SecurityActions(), dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VesselsScreen);
