import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    SafeAreaView,
    Text,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modalbox';
import * as GlobalStyles from '../../styles/styles';
import { Colors } from '../../styles/index';
import { HeaderLeft } from '../../components/Header/HeaderLeft';
import { HeaderRight } from '../../components/Header/HeaderRight';
import { HeaderTitle } from '../../components/Header/HeaderTitle';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SecurityActions from '../../actions/SecurityActions';
import { FontAwesome, MaterialCommunityIcons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { CustomSwitch } from '../../components/CustomSwitch';
import { WatchkeepingIcon } from '../../components/Icons/WatchkeepingIcon';
import { StandbyIcon } from '../../components/Icons/StandbyIcon';
import { UscgIcon } from '../../components/Icons/UscgIcon';
import { width } from '../../components/Carousel/Carousel';

const AlertMessages = [
    "All trip cards created going forward will no longer show USCG stats",
    "All trip cards created going forward will now show USCG stats",
    "All trip cards created going forward will no longer show standby service",
    "All trip cards created going forward will now show Standby service",
    "All trip cards created going forward will no longer show watchkeeping service",
    "All trip cards created going forward will  now show Watchkeeping service",
];

function ServiceDetailScreen(props) {
    const [mounted, setMounted] = useState(false);
    const [vesselID, setVesselID] = useState(null);
    const [title, setTitle] = useState(null);
    const [state, setState] = useState(null);
    const [openAlert, setOpenAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");

    useEffect(() => {
        if (!mounted) {
            setVesselID(props.route.params.id)
            setTitle(props.route.params.title)
            setState(props.route.params.serviceState)
            setMounted(true);
        }
    }, [props, mounted])

    const updateVessel = (data) => {
        props.actions.updateVessel({ id: vesselID, ...data }).then(res => {
            if (title && data.autologWatchkeeping === undefined) {
                if (title == 'Watchkeeping Service') {
                    if (data.showWatchkeeping === true) {
                        setAlertMsg(AlertMessages[5]);
                    } else {
                        setAlertMsg(AlertMessages[4]);
                    }
                } else if (title === 'Standby Service') {
                    if (data.showStandbyService === true) {
                        setAlertMsg(AlertMessages[3]);
                    } else {
                        setAlertMsg(AlertMessages[2]);
                    }
                } else {
                    if (data.showUscgStatistics === true) {
                        setAlertMsg(AlertMessages[1]);
                    } else {
                        setAlertMsg(AlertMessages[0]);
                    }
                }
                setOpenAlert(true);
            }
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <View style={GlobalStyles.FlexContainer}>
            <SafeAreaView style={[GlobalStyles.safeView]}>
                <View style={[{ height: 50, top: 0, left: 0, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', borderBottomWidth: .5, borderBottomColor: '#c8c8c8' }]}>
                    <HeaderLeft onPress={() => props.navigation.goBack()}>
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
                                color='#18f'
                            />
                        </View>
                    </HeaderLeft>
                    <HeaderTitle>
                        <Text style={{
                            color: 'black',
                            fontSize: width / 18,
                            fontWeight: 'bold',
                        }}>Vessel Details</Text>
                    </HeaderTitle>
                    <HeaderRight>
                        <View style={{ width: 40 }}></View>
                    </HeaderRight>
                </View>
                {
                    state ? (
                        <ScrollView style={[{ width: '100%', height: Dimensions.get('screen').height - 50, backgroundColor: '#fff' }]}>
                            <View style={{borderBottomWidth: .5, borderBottomColor: '#c6c6c8'}}>
                                <Text style={{ ...styles.label }}>{`${title} settings`}</Text>
                            </View>
                            {
                                title == 'Watchkeeping Service' && (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16 }}>
                                        <Text style={{ ...styles.title, fontSize: width / 26 }}>Include watchkeeping service on trip cards</Text>
                                        <CustomSwitch value={state.watch}
                                            toggleSwitch={() => {
                                                updateVessel({ showWatchkeeping: !state.watch });
                                                let _state = state;
                                                _state.watch = !state.watch;
                                                setState(_state);
                                            }} />
                                    </View>
                                )
                            }
                            {
                                title == 'Watchkeeping Service' && state.watch && (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#f2f2f2' }}>
                                        <Text style={{ ...styles.title, fontSize: width / 26 }}>Auto-log ALL days underway as watchkeeping</Text>
                                        <CustomSwitch value={state.autolog}
                                            toggleSwitch={() => {
                                                updateVessel({ autologWatchkeeping: !state.autolog });
                                                let _state = state;
                                                _state.autolog = !state.autolog;
                                                setState(_state);
                                            }} />
                                    </View>
                                )
                            }
                            {
                                title == 'Standby Service' && (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16 }}>
                                        <Text style={{ ...styles.title, fontSize: width / 26 }}>Include standby service on trip cards</Text>
                                        <CustomSwitch value={state.standby}
                                            toggleSwitch={() => {
                                                updateVessel({ showStandbyService: !state.standby });
                                                let _state = state;
                                                _state.standby = !state.standby;
                                                setState(_state);
                                            }} />
                                    </View>
                                )
                            }
                            {
                                title == 'USCG Stats' && (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16 }}>
                                        <Text style={{ ...styles.title, fontSize: width / 26 }}>Include USCG stats on trip cards</Text>
                                        <CustomSwitch value={state.uscg}
                                            toggleSwitch={() => {
                                                updateVessel({ showUscgStatistics: !state.uscg });
                                                let _state = state;
                                                _state.uscg = !state.uscg;
                                                setState(_state);
                                            }} />
                                    </View>
                                )
                            }
                            <View style={{ flexDirection: 'column', justifyContent: 'center', backgroundColor: '#f9f9f9', alignItems: 'center', paddingVertical: 30 }}>
                                <View style={{ backgroundColor: '#fff', width: 80, height: 80, borderRadius: 80, alignItems: 'center', justifyContent: 'center' }}>
                                    {
                                        title == 'Watchkeeping Service' && (
                                            <View style={{ ...styles.vesselDetailIcon, shadowColor: '#6AABFF', backgroundColor: '#6AABFF', }}>
                                                <WatchkeepingIcon />
                                            </View>
                                        )
                                    }
                                    {
                                        title == 'Standby Service' && (
                                            <View style={{ ...styles.vesselDetailIcon, shadowColor: '#875EDC', backgroundColor: '#875EDC', }}>
                                                <StandbyIcon />
                                            </View>
                                        )
                                    }
                                    {
                                        title == 'USCG Stats' && (
                                            <View style={{ ...styles.vesselDetailIcon, shadowColor: '#7FC542', backgroundColor: '#7FC542', }}>
                                                <UscgIcon />
                                            </View>
                                        )
                                    }
                                </View>
                                <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
                                    {
                                        title == 'Watchkeeping Service' && (
                                            <>
                                                <Text style={{ ...styles.detailText }}>Watchkeeping service does not need to be logged by all crew</Text>
                                                <Text style={{ ...styles.detailText }}>Watchkeeping service in the deck department should be logged by holders of MCA OOW3000 or higher</Text>
                                                <Text style={{ ...styles.detailText }}>Watchkeeping service is the total number of days, out of your days spent underway, what you were in full charge of a navigational or
                                                    engineering watch for not less than 4hrs while the vessel was engaged on a voyage of at least 24hrs</Text>
                                            </>
                                        )
                                    }
                                    {
                                        title == 'Standby Service' && (
                                            <>
                                                <Text style={{ ...styles.detailText }}>Standby service does not need to be logged by all crew. Deckhands in the yachting industry should add this to their trip cards</Text>
                                                <Text style={{ ...styles.detailText }}>Standby service describes time spent waiting for an owner, uniformed and ready to depart</Text>
                                                <Text style={{ ...styles.detailHeader, textTransform: 'uppercase' }}>Rules:</Text>
                                                <Text style={{ ...styles.detailText }}>Standby service CANNOT exceed 14 consecutive days for a single trip</Text>
                                                <Text style={{ ...styles.detailText }}>Standby service CANNOT exceed days at sea</Text>
                                            </>
                                        )
                                    }
                                    {
                                        title == 'USCG Stats' && (
                                            <>
                                                <Text style={{ ...styles.detailHeader }}>Trip cards will display:</Text>
                                                <Text style={{ ...styles.detailText }}>The number of days underway, in US waters, that are spent seaward of the USCG boundary line and days spent shoreward of the USCG boundary line (CFR46 part 7)</Text>
                                                <Text style={{ ...styles.detailText }}>Number of days, if any, spent on the Great Lakes</Text>
                                            </>
                                        )
                                    }
                                </View>
                            </View>
                        </ScrollView>
                    ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                            <ActivityIndicator color={'gray'} size={24} />
                        </View>
                    )
                }
            </SafeAreaView>
            
            <Modal
                isOpen={openAlert}
                style={{backgroundColor: "transparent", alignItems: "center", justifyContent: "center", width: 326, height: 220}}
                swipeToClose={false}
                backdrop={true}
                onClosed={() => openAlert && setOpenAlert(false)}
                position={"center"}
            >
                <View style={styles.modalContainer} pointerEvents={"box-none"}>
                    <Text style={styles.modalTitle}>
                        {"Trip card stats update"}
                    </Text>
                    <Text style={styles.modalContent}>
                        {alertMsg}
                    </Text>
                    <View style={styles.modalSeparator} />
                    <TouchableOpacity style={styles.modalBtn}
                        onPress={() => setOpenAlert(false)}>
                        <Text style={styles.modalBtnText}>{"Continue"}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: width/24.5,
        color: '#000',
        lineHeight: 22,
        width: Dimensions.get('screen').width - 83,
        fontFamily: 'Roboto-Regular',
        letterSpacing: -0.41
    },
    subTitle: {
        fontSize: width / 28,
        color: 'grey',
    },
    label: {
        fontSize: width / 32,
        color: 'gray',
        textTransform: 'uppercase',
        lineHeight: 18,
        paddingTop: 34,
        paddingLeft: 12,
        paddingBottom: 8.5,
        fontFamily: 'Roboto-Regular',
        letterSpacing: -0.08,
        fontWeight: '400',
        borderBottomColor: '#c6c6c8',
        borderBottomWidth: .5
    },
    detailText: {
        textAlign: 'left',
        fontSize: width / 23,
        lineHeight: 25.5,
        color: '#646464',
        fontWeight: '300',
        paddingVertical: 8,
        fontFamily: 'Roboto-Light',
        fontWeight: '300',
        letterSpacing: -0.3
    },
    detailHeader: {
        fontSize: width / 23,
        color: '#646464',
        fontWeight: '700',
        lineHeight: 30
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

    modalContainer: {
        width: 326,
        backgroundColor: "#1E1E1EBF",
        alignItems: "center",
        borderRadius: 14,
    },
    modalTitle: {
        fontFamily: "Roboto-Regular",
        fontWeight: "500",
        fontSize: width / 19,
        letterSpacing: -0.41,
        color: "white",
        marginTop: 20,
        marginBottom: 10,
    },
    modalContent: {
        fontFamily: "Roboto-Light",
        fontWeight: "300",
        fontSize: width / 23,
        lineHeight: 25,
        textAlign: "center",
        letterSpacing: -0.3,
        color: "white",
        marginHorizontal: 20,
        marginBottom: 20,
    },
    modalSeparator: {
        width: "100%",
        height: 0.5,
        backgroundColor: "rgba(84, 84, 88, 0.65)"
    },
    modalBtn: {
        width: "100%",
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },
    modalBtnText: {
        fontFamily: "Roboto-Bold",
        fontSize: width/24.5,
        letterSpacing: -0.3,
        color: "#0A84FF"
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(ServiceDetailScreen);
