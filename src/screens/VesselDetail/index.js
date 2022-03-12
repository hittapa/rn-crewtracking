import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    SafeAreaView,
    Text,
    Dimensions,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView
} from 'react-native';
import * as GlobalStyles from '../../styles/styles';
import { Colors } from '../../styles/index';
import { HeaderLeft } from '../../components/Header/HeaderLeft';
import { HeaderRight } from '../../components/Header/HeaderRight';
import { HeaderTitle } from '../../components/Header/HeaderTitle';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SecurityActions from '../../actions/SecurityActions';
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { FlatList, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { CustomSwitch } from '../../components/CustomSwitch';
import CustomButton from '../../components/CustomButton';
import Modal from "react-native-modalbox";

import { SignedOnIcon } from '../../components/Icons/SignedOnIcon';
import EditIcon from '../../components/Icons/EditIcon';
import { width } from '../../components/Carousel/Carousel';
import { getTotalDays } from '../../utils/dateTimeHelper';

function VesselDetailScreen(props) {
    const [user, setUser] = useState(null);
    const [pro, setPro] = useState(false);
    const [isSignedOn, setIsSignedOn] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [vessel, setVessel] = useState(null);
    const [state, setState] = useState(null);
    const [visibleNotice, setVisibleNotice] = useState(false);
    const [edit, setEdit] = useState(false);

    const [detailedTypes, setDetailedTypes] = useState(null);
    const [visibleDetailedTypeModal, setVisibleDetailedTypeModal] = useState(false);
    const [vesselTotal, setVesselTotal] = useState(null);

    useEffect(() => {
        if (!mounted) {
            const vessel = props.route.params.vessel;
            setVessel(vessel)
            setUser(props.user);
            if (props.user?.plan?.includes('pro')) setPro(true);

            const state = {
                watch: vessel?.showWatchkeeping,
                autolog: vessel?.autologWatchkeeping,
                standby: vessel?.showStandbyService,
                uscg: vessel?.showUscgStatistics
            }
            if (vessel) {
                getDetailedTypes(vessel.type);
            }
            calculateServiceTotals(vessel);
            setIsSignedOn(vessel.is_signedon)
            setState(state)
            setMounted(true);
        }
    }, [props, mounted]);

    const calculateServiceTotals = (vess) => {
        let vt = {};
        vt.onboard_service = 0;
        vt.leave = 0;
        vt.yard = 0;
        vt.underway = 0;
        vt.watchkeeping = 0;
        vt.standby = 0;
        vt.av_hours_underway_per_day = 0;
        vt.av_distance_offshore = 0;
        vt.seaward = 0;
        vt.shoreward = 0;
        vt.lakes = 0;

        const onboardPeriods = JSON.parse(vess.service_periods);
        for (let index = 0; index < onboardPeriods?.length; index++) {
            const element = onboardPeriods[index];
            const start = element.start;
            const end = element.end;
            vt.onboard_service += getTotalDays(start, end);
        }

        if (vess?.onboardServices && vess?.onboardServices.length > 0) {
            for (let i = 0; i < vess?.onboardServices.length; i++) {
                const item = vess?.onboardServices[i];
                if (item?.type == 'onleave') {
                    vt.leave += item.ended_at ? getTotalDays(item.started_at, item.ended_at) : 0;
                }
                if (item?.type == 'inyard') {
                    vt.yard += item.ended_at ? getTotalDays(item.started_at, item.ended_at) : 0;
                }
                if (item?.type == 'trip' && item?.trip != null) {
                    vt.underway += item.trip.underway;
                    vt.watchkeeping += item.trip.watchkeeping;
                    vt.standby += item.trip.standby;
                    vt.av_hours_underway_per_day = Math.round((vt.av_hours_underway_per_day + item.trip.av_hours_underway_per_day) / i);
                    vt.av_distance_offshore = Math.round((vt.av_distance_offshore + item.trip.av_distance_offshore) / i);
                    vt.seaward += item.trip.seaward;
                    vt.shoreward += item.trip.shoreward;
                    vt.lakes += item.trip.lakes;
                }
            }
        }
        setVesselTotal(vt);
    }

    const getDetailedTypes = async (type) => {
        const _detailedType = await props.actions.getDetailedType({ type: type });
        console.log('detailed types')
        console.log(_detailedType)
        _detailedType && setDetailedTypes(_detailedType)
    }

    const updateVessel = (name, value) => {
        let _vessel = { ...vessel };
        _vessel[name] = value;
        console.log(name, value)
        console.log(_vessel)
        setVessel(_vessel);
        setVisibleDetailedTypeModal(false)
    }

    const Item = ({ title, value, name = null, textStyle = {}, detailScreen = null }) => {
        return (
            <View key={title} style={{ flexDirection: 'row', borderBottomWidth: .5, borderBottomColor: '#c6c6c8', justifyContent: 'space-between', marginLeft: 16, alignItems: 'center', paddingVertical: 11 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Text style={[{ ...styles.title }, textStyle]}>{title}</Text>
                    {
                        title == 'Underway' && (
                            <TouchableOpacity
                                style={styles.infoMark}
                                onPress={() => {
                                    setVisibleNotice(true)
                                }}
                            >
                                <FontAwesome5
                                    name="exclamation"
                                    size={10}
                                    color={Colors.colorWhite}
                                />
                            </TouchableOpacity>
                        )
                    }
                </View>
                {
                    detailScreen ? (
                        <TouchableOpacity onPress={() => props.navigation.navigate('ServiceDetail', { id: vessel?.id, title: detailScreen, serviceState: state })} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingRight: 16 }}>
                            <Text style={{ ...styles.subTitle, color: '#ababab', fontSize: width / 27 }}>{value}</Text>
                            <MaterialCommunityIcons
                                name={'chevron-right'}
                                size={24}
                                color={'#ababab'}
                                style={{ marginRight: -6 }}
                            />
                        </TouchableOpacity>
                    ) : (
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                paddingRight: 16
                            }}
                        >
                            <Text style={{ ...styles.subTitle, color: '#ababab', fontSize: width / 27 }}>{value}</Text>
                            {
                                title == 'Vessel name' && isSignedOn && (
                                    <Ionicons
                                        name={'checkmark-done-circle'}
                                        size={24}
                                        color={'#007aff'}
                                        style={{ paddingLeft: 8 }}
                                    />
                                )
                            }
                        </View>
                    )
                }
            </View>
        )
    }

    const onDeleteVessel = async () => {
        Alert.alert(
            "Are you sure you want to delete this vessel?",
            "You are about to delete this vessel and ALL its stats permanently.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => _delete() }
            ]
        );
    }

    const _delete = async () => {
        const result = await props.actions.deleteVessel({ vessel: vessel.id, user: user.id });
        props.navigation.navigate('Vessels', { reload: true });
    }

    const onSaveUpdate = () => {
        console.log('saving ..............')
        console.log(vessel)
        props.actions.updateVessel({ id: vessel.id, ...vessel }).then(res => {
            alert('Saved successfully')
            setEdit(false);
        }).catch(err => {
            alert('Something went wrong')
            setEdit(false);
        })
    }

    const onEditBasicInfo = () => {
        props.navigation.navigate('EditVesselBasic', { vessel: vessel });
    }

    const gotoLogbook = () => {
        props.navigation.navigate('Dashboard', { vessel: vessel });
    }

    const toggleDefault = (e) => {
        console.log(e);
        let _ves = { ...vessel };
        _ves.isDefault = e;
        setVessel(_ves);
        props.actions.updateVessel({ ..._ves })
            .then(res => {
                setVessel(_ves);
            }).catch(err => {
                _ves = { ...vessel };
                _ves.isDefault = !e;
                alert(err.message);
                setVessel(_ves);
            })
    }

    return (
        <KeyboardAvoidingView
            style={GlobalStyles.FlexContainer}
            behavior={Platform.OS === 'ios' ? 'position' : 'height'}
        >
            <SafeAreaView style={[GlobalStyles.safeView]}>
                <View style={[GlobalStyles.header]}>
                    <HeaderLeft onPress={() => edit ? setEdit(false) : props.navigation.goBack()}>
                        {
                            edit ?
                                <Text style={{
                                    color: '#ababab',
                                    ...styles.navigationText,
                                    marginLeft: 16,
                                }}>Cancel</Text>
                                :
                                <View
                                    style={{
                                        borderRadius: 50,
                                        alignItems: 'center',
                                        marginLeft: 20
                                    }}
                                >
                                    <MaterialIcons
                                        name="arrow-back-ios"
                                        size={28}
                                        color='#007aff'
                                    />
                                </View>
                        }

                    </HeaderLeft>
                    <HeaderTitle>
                        <Text style={{
                            color: 'black',
                            fontSize: width / 18,
                            fontWeight: 'bold',
                        }}>Vessel Details</Text>
                    </HeaderTitle>
                    <HeaderRight onPress={() => onSaveUpdate()}>
                        {
                            edit ?
                                <Text style={{
                                    color: '#007aff',
                                    ...styles.navigationText,
                                    textAlign: 'right'
                                }}>Save</Text>
                                :
                                <View style={{ width: 40 }}></View>
                        }
                    </HeaderRight>
                </View>
                {
                    vessel ? (
                        <View style={[{ width: '100%', height: Dimensions.get('screen').height - 50, backgroundColor: '#fff' }]}>
                            {
                                user && (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 11, paddingHorizontal: 16 }}>
                                        <Text style={{ ...styles.title, fontSize: width / 24.5, lineHeight: 22 }}>{pro ? 'Status' : 'Default vessel'}</Text>
                                        <>
                                            {
                                                pro ?
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <Text style={{ ...styles.subTitle, textTransform: 'uppercase' }}>{isSignedOn ? 'Signed On' : 'Signed Off'}</Text>
                                                    </View>
                                                    :
                                                    <CustomSwitch value={vessel?.isDefault} toggleSwitch={(e) => toggleDefault(e)} />
                                            }
                                        </>
                                    </View>
                                )
                            }
                            <View style={{ flexDirection: 'column', justifyContent: 'center', backgroundColor: '#f9f9f9', alignItems: 'center', paddingVertical: 30 }}>
                                <View style={{ backgroundColor: '#fff', width: 80, height: 80, borderRadius: 80, alignItems: 'center', justifyContent: 'center' }}>
                                    {
                                        (isSignedOn || vessel.isDefault) ?
                                            <View style={{ ...styles.vesselDetailIcon, shadowColor: '#12f', backgroundColor: '#18f', }}>
                                                <SignedOnIcon />
                                            </View>
                                            :
                                            <View style={{ ...styles.vesselDetailIcon, shadowColor: '#Efaf00', backgroundColor: '#E7A600', }}>
                                                <MaterialCommunityIcons
                                                    name={'minus'}
                                                    size={28}
                                                    color={'#fff'}
                                                    style={{}}
                                                />
                                            </View>
                                    }
                                </View>
                                <View style={{ paddingHorizontal: 50, paddingTop: 20 }}>
                                    <Text style={{ textAlign: 'center', fontSize: width / 23, lineHeight: 25.5, color: '#646464', fontWeight: '300', fontFamily: 'Roboto-Light', letterSpacing: -0.3 }}>
                                        {
                                            pro && (
                                                isSignedOn ?
                                                    `You are currently signed on to ${vessel?.name.toUpperCase()}.`
                                                    :
                                                    `You are signed off of ${vessel?.name.toUpperCase()}. Simply sign on to this vessel in order to track your time and miles onboard.`
                                            )
                                        }
                                        {
                                            !pro && (
                                                vessel.isDefault ?
                                                    `${vessel?.name.toUpperCase()} is your default vessel.`
                                                    :
                                                    `${vessel?.name.toUpperCase()} is not your default vessel.`
                                            )
                                        }
                                    </Text>
                                </View>
                            </View>
                            <ScrollView>
                                <View style={{ paddingTop: 0, paddingRight: 0, paddingBottom: 100 }}>
                                    {
                                        vessel && (
                                            <>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ ...styles.label }}>Basic Information</Text>
                                                    <TouchableOpacity style={{ ...styles.label }} onPress={() => onEditBasicInfo()}>
                                                        <EditIcon width={17} height={17} />
                                                    </TouchableOpacity>
                                                </View>
                                                {vessel?.name && Item({ title: 'Vessel name', value: vessel.name, name: 'name' })}
                                                {vessel?.length && Item({ title: 'Length overall', value: vessel.length + ' ' + vessel.ol_unit, name: 'length' })}
                                                {vessel?.detailedType && <Item title={pro ? 'Vessel type' : 'Vessel make'} value={vessel.detailedType} name={'detailedType'} />}
                                                {vessel?.grossTonnage && Item({ title: 'Gross tonnage (GT)', value: vessel.grossTonnage, name: 'grossTonnage' })}
                                                {vessel?.flag && Item({ title: 'Flag', value: vessel.flag, name: 'flag' })}
                                                {vessel?.mmsiNumber && Item({ title: 'MMSI number', value: vessel.mmsiNumber, name: 'mmsiNumber' })}
                                                {vessel?.imoNumber && Item({ title: 'IMO number', value: vessel.imoNumber, name: 'imoNumber' })}

                                                {vesselTotal && <Text style={{ ...styles.label }}>Vessel totals</Text>}
                                                {pro && vesselTotal && <Item title={'Onboard service'} value={vesselTotal.onboard_service + ' days'} />}
                                                {pro && vesselTotal && <Item title={'On leave'} value={vesselTotal.leave + ' days'} textStyle={{ paddingLeft: 14, fontSize: width / 24.5 }} />}
                                                {pro && vesselTotal && <Item title={'Yard service'} value={vesselTotal.yard + ' days'} textStyle={{ paddingLeft: 14, fontSize: width / 24.5 }} />}
                                                {vesselTotal && <Item title={'Underway'} value={vesselTotal.underway + ' days'} />}
                                                {pro && vesselTotal && <Item title={'Watchkeeping'} value={vesselTotal.watchkeeping + ' days'} textStyle={{ paddingLeft: 14, fontSize: width / 24.5 }} detailScreen={'Watchkeeping Service'} />}
                                                {pro && vesselTotal && <Item title={'Standby'} value={vesselTotal.standby + ' days'} textStyle={{ paddingLeft: 14, fontSize: width / 24.5 }} detailScreen={'Standby Service'} />}
                                                {vesselTotal && <Item title={'Average hours underway per day'} value={vesselTotal.av_hours_underway_per_day + ' hrs'} textStyle={{ paddingLeft: 14, fontSize: width / 24.5 }} />}
                                                {vesselTotal && <Item title={'Average distance offshore'} value={vesselTotal.av_distance_offshore + ' nm'} textStyle={{ paddingLeft: 14, fontSize: width / 24.5 }} />}
                                                {pro && vesselTotal && <Item title={'USCG Stats'} value={''} detailScreen={'USCG Stats'} />}
                                                {pro && vesselTotal && <Item title={'Seaward of boundary line'} value={vesselTotal.seaward + ' days'} textStyle={{ paddingLeft: 14, fontSize: width / 24.5 }} />}
                                                {pro && vesselTotal && <Item title={'Shoreward of boundary line'} value={vesselTotal.shoreward + ' days'} textStyle={{ paddingLeft: 14, fontSize: width / 24.5 }} />}
                                                {pro && vesselTotal && <Item title={'On great lakes'} value={vesselTotal.lakes + ' days'} textStyle={{ paddingLeft: 14, fontSize: width / 24.5 }} />}
                                            </>
                                        )
                                    }

                                    {
                                        vessel && (
                                            <>
                                                <View style={{ paddingHorizontal: 42, paddingTop: 35 }}>
                                                    <CustomButton
                                                        title='View vessel in logbook'
                                                        onPress={() => gotoLogbook()}
                                                        containerStyle={{}}
                                                        textStyle={{ color: 'white', paddingVertical: 18, fontSize: width / 28, lineHeight: 16.41, letterSpacing: -0.3, fontWeight: '700' }}
                                                    />
                                                </View>
                                                <View style={{ paddingHorizontal: 40, paddingTop: 10 }}>
                                                    <CustomButton
                                                        title='Delete vessel'
                                                        onPress={() => onDeleteVessel()}
                                                        containerStyle={{ backgroundColor: 'white', borderColor: 'white' }}
                                                        textStyle={{ color: '#c21717', paddingVertical: 18, fontWeight: 'bold' }}
                                                    />
                                                </View>
                                            </>
                                        )
                                    }
                                </View>
                            </ScrollView>
                        </View>
                    ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                            <ActivityIndicator color={'gray'} size={24} />
                        </View>
                    )
                }
                <Modal
                    isOpen={visibleDetailedTypeModal}
                    onClosed={() => setVisibleDetailedTypeModal(false)}
                    style={[styles.modal, styles.modal0]}
                    position={"center"}
                    swipeArea={50}
                >
                    <View style={{ ...styles.centeredView, height: 550 }}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalHeaderText}>Vessel Detailed type</Text>
                        </View>
                        <ScrollView>
                            {
                                detailedTypes != null && detailedTypes != undefined && (
                                    detailedTypes.map((item, index) =>
                                        <TouchableOpacity key={index} style={styles.listItem} onPress={() => { updateVessel('detailedType', item) }}>
                                            <Text style={styles.listItemText} onPress={() => { updateVessel('detailedType', item) }}>{item}</Text>
                                        </TouchableOpacity>
                                    )
                                )
                            }
                        </ScrollView>
                    </View>
                </Modal>
                <Modal
                    isOpen={visibleNotice}
                    onClosed={() => setVisibleNotice(false)}
                    style={{ ...styles.modal, width: '80%', height: 350, position: 'relative' }}
                    position={'center'}
                >
                    <View style={{ ...styles.centeredView }}>
                        <View style={styles.modalHeader}>
                            <Text style={{ ...styles.modalHeaderText, textAlign: 'center', paddingTop: 16 }}>
                                {'Helpful hints:\nUnderway'}
                            </Text>
                        </View>
                        <View style={{ ...styles.modalBody }}>
                            <Text style={{ ...styles.modalBodyText, fontFamily: 'Roboto-Bold' }}>Also called actual sea service</Text>
                            <Text style={{ ...styles.modalBodyText }}>Time spent at sea, which may include time at anchor or river and canal transits, associated with a 24hrs passage (minimum), with engines running for at least 4hrs out of 24hrs</Text>
                        </View>
                        <View style={{ ...styles.modalFooter }}>
                            <Text style={{ ...styles.footerActionText }} onPress={() => setVisibleNotice(false)}>Close</Text>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: "flex-start",
        borderRadius: 16,
        backgroundColor: '#3e3e3e'
    },
    modal0: {
        width: 250,
        height: 550,
    },
    centeredView: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: width / 21,
        color: '#000',
        lineHeight: 22,
        fontFamily: 'Roboto-Regular',
        letterSpacing: -0.41,
        fontWeight: '400',
    },
    subTitle: {
        fontSize: width / 27,
        fontFamily: 'Roboto-Light',
        color: '#ababab',
        lineHeight: 22,
        letterSpacing: -0.41,
        fontWeight: '400'
    },
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
    vesselDetailIcon: {
        width: 46,
        height: 46,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: .5,
        shadowRadius: 5,
        elevation: 20
    },
    infoMark: {
        width: 16,
        height: 16,
        backgroundColor: '#3a0',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginLeft: 10,
        marginTop: 0
    },

    modalHeader: {
        paddingVertical: 15,
        alignItems: 'center'
    },
    modalBody: {
        height: '75%',
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 16
    },
    modalFooter: {
        height: 50,
        width: '100%',
        bottom: 0,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: .5,
        borderTopColor: '#8e8e8e'
    },
    modalHeaderText: {
        fontSize: width / 19,
        lineHeight: 22,
        color: '#fff',
        fontWeight: '500',
        fontFamily: 'Roboto-Regular',
        letterSpacing: -0.41
    },
    footerActionText: {
        color: '#09e',
        fontSize: width / 26,
        lineHeight: 24,
        fontWeight: 'bold'
    },
    modalBodyText: {
        fontSize: width / 23,
        lineHeight: 25.5,
        color: '#fff',
        textAlign: 'center',
        letterSpacing: -0.3,
        fontWeight: '300',
        fontFamily: 'Roboto-Light',
        paddingVertical: 10
    },
    navigationText: {
        fontFamily: 'Roboto-Regular',
        fontSize: width / 24.5,
        lineHeight: 19.92,
        letterSpacing: -0.3,
        fontWeight: '400',
        marginRight: 20,
        width: 55
    },
    listItemText: {
        textAlign: 'center',
        fontSize: width / 26,
        lineHeight: 24,
        color: '#09e',
    },
    listItem: {
        width: 250,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        borderTopColor: '#909090',
        borderTopWidth: .5
    },
});

const mapStateToProps = state => {
    return {
        user: state.APP.USER,
        vessels: state.APP.VESSELS,
        trips: state.APP.trips,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(SecurityActions(), dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VesselDetailScreen);
