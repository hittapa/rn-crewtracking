import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    KeyboardAvoidingView,
    ScrollView,
    SafeAreaView,
    Dimensions,
    Text,
} from 'react-native';
import * as GlobalStyles from '../../styles/styles';
import { HeaderLeft } from '../../components/Header/HeaderLeft';
import { HeaderRight } from '../../components/Header/HeaderRight';
import { HeaderTitle } from '../../components/Header/HeaderTitle';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { CustomSwitch } from '../../components/CustomSwitch';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SecurityActions from '../../actions/SecurityActions';
import Modal from "react-native-modalbox";
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { RadixIcon } from '../../components/Icons/RadixIcon';
import { LengthUnit } from '../../components/LengthUnit';
import { width } from '../../components/Carousel/Carousel';

const vTypes = [
    "Cargo",
    "Dive Vessel",
    "Dredger",
    "Fishing",
    "Military Ops",
    "Medical Trans",
    "Passenger",
    "Pleasure Craft",
    "Port Tender",
    "Sailing Vessel",
    "Search and Rescue",
    "Special Craft",
    "Tanker",
    "Tug",
]

function EditVesselBasic(props) {
    const [user, setUser] = useState(null);
    const [pro, setPro] = useState(null);
    const [types, setTypes] = useState(vTypes);
    const [detailedTypes, setDetailedTypes] = useState(vTypes);
    const [changed, setChanged] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [visibleTypeModal, setVisibleTypeModal] = useState(false);
    const [visibleDetailedTypeModal, setVisibleDetailedTypeModal] = useState(false);

    const [vessel, setVessel] = useState(null);
    const [id, setId] = useState(0);
    const [isDefault, setIsDefault] = useState(true);
    const [vesselName, setVesselName] = useState('');
    const [vesselLength, setVesselLength] = useState(null);
    const [lengthUnit, setLengthUnit] = useState('m');
    const [vesselMake, setVesselMake] = useState('');
    const [vesselType, setVesselType] = useState(null);
    const [detailedType, setDetailedType] = useState(null);
    const [grossTonnage, setGrossTonnage] = useState(null);
    const [flag, setFlag] = useState(null);
    const [mmsi, setMMSI] = useState(null);
    const [imo, setIMO] = useState(null);

    const toggleSwitch = () => setIsDefault(previousState => !previousState);

    useEffect(() => {
        if (!mounted) {
            console.log(props.route.params)
            setUser(props.user);
            if (props.user.plan.includes('pro')) setPro(true);
            let vessel = props.route.params.vessel;
            setVessel(vessel);
            setId(vessel.id);
            setIsDefault(vessel.isDefault);
            setVesselName(vessel.name);
            setVesselLength(vessel.length?.toString());
            setLengthUnit(vessel.ol_unit);
            setVesselMake(vessel.type);
            setVesselType(vessel.type);
            setDetailedType(vessel.detailedType);
            setGrossTonnage(vessel.grossTonnage?.toString());
            setFlag(vessel.flag);
            setMMSI(vessel.mmsiNumber?.toString());
            setIMO(vessel.imoNumber?.toString());
            // props.actions.getVesselType()
            //     .then(result => {
            //         console.log(result)
            //         setTypes(result)
            //     })
            //     .catch(err => {
            //         console.log(err)
            //     })
            setMounted(true);
        }
    }, [props, mounted])

    const onSetVesselType = async (item) => {
        setVesselType(item);
        setDetailedType(null);
        const detailedType = await props.actions.getDetailedType({ type: item });
        setDetailedTypes(detailedType)
        setVisibleTypeModal(false);
    }
    const onSetDetailedType = (item) => {
        console.log(item)
        setDetailedType(item);
        setVisibleDetailedTypeModal(false);
    }

    const validate = (type) => {
        if (type == 0) {
            if (vesselName != '' && parseInt(vesselLength) != 0 && typeof parseInt(vesselLength) == 'number' && vesselType && detailedType && grossTonnage && parseInt(grossTonnage) != 0 && flag) {
                return true;
            } else {
                return false;
            }
        }
        if (type == 1) {
            if (vesselName == '' || vesselLength == 0 || typeof parseInt(vesselLength) != 'number' || !vesselType || !detailedType || !grossTonnage || grossTonnage == 0 || !flag) {
                return false;
            } else {
                return true;
            }
        }
    }

    const onSave = () => {
        if (pro) {
            if (!validate(1)) {
                alert('Please complete fields.')
                return;
            }
        } else {
            if (vesselName == '' || !vesselLength || vesselMake == '') {
                alert('Please complete fields.')
                return;
            }
        }

        let _vessel = { ...vessel };
        _vessel.name = vesselName;
        _vessel.length = parseFloat(vesselLength);
        _vessel.ol_unit = lengthUnit;
        _vessel.type = pro ? vesselType : vesselMake;
        _vessel.detailedType = detailedType;
        _vessel.isDefault = isDefault;
        _vessel.mmsiNumber = mmsi && parseInt(mmsi);
        _vessel.imoNumber = imo && parseInt(imo);
        _vessel.grossTonnage = grossTonnage && parseInt(grossTonnage);
        _vessel.flag = flag;
        console.log('_vessel')
        console.log(_vessel)

        props.actions.updateVessel(_vessel).then(res => {
            props.navigation.navigate('VesselDetail', { vessel: _vessel })
        }).catch(err => {
            alert('Something went wrong')
        })
    }

    const onBack = () => {
        props.navigation.goBack()
    }
    return (
        <View style={GlobalStyles.FlexContainer}>
            <KeyboardAvoidingView
                behavior={'padding'}
                style={{ width: '100%', height: '100%' }}
            >
                <SafeAreaView style={[GlobalStyles.safeView]}>
                    <View style={[GlobalStyles.header]}>
                        <HeaderLeft onPress={() => onBack()}>
                            <Text style={{
                                color: '#ababab',
                                marginLeft: 20,
                                fontSize: width / 23,
                                lineHeight: 21.09,
                                letterSpacing: -0.3,
                                fontWeight: '400',
                                width: 55
                            }}>{"Cancel"}</Text>
                        </HeaderLeft>
                        <HeaderTitle>
                            <Text style={{
                                ...GlobalStyles.headerTitle
                            }}>Edit vessel details</Text>
                        </HeaderTitle>
                        <HeaderRight onPress={() => onSave()}>
                            <Text style={{
                                color: '#007aff',
                                ...styles.navigationText,
                            }}>Save</Text>
                        </HeaderRight>
                    </View>
                    <ScrollView style={[{ backgroundColor: '#f9f9f9' }]} bounces={false}>
                        <>
                            <View style={{ width: '100%' }}>
                                <Text style={{
                                    ...styles.label
                                }}>Basic Information</Text>
                            </View>
                            <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                                <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0 }}>
                                    <Text style={GlobalStyles.labelText}>Vessel name</Text>
                                    <TextInput
                                        placeholder='Enter name'
                                        value={vesselName}
                                        style={GlobalStyles.inputBox}
                                        onChangeText={async (value) => {
                                            await setVesselName(value);
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                                <View style={{ ...GlobalStyles.inputForm, paddingVertical: 4, paddingLeft: 0, borderBottomWidth: 0 }}>
                                    <Text style={GlobalStyles.labelText}>Length overall</Text>
                                    <LengthUnit value={lengthUnit == 'ft'} toggleSwitch={() => lengthUnit == 'm' ? setLengthUnit('ft') : setLengthUnit('m')} />
                                </View>
                            </View>
                            <View style={{ width: '100%', backgroundColor: '#eee', paddingLeft: 16 }}>
                                <View style={{ ...GlobalStyles.inputForm, marginLeft: 10, borderBottomWidth: 0 }}>
                                    <Text style={GlobalStyles.labelText}></Text>
                                    <TextInput
                                        placeholder='Enter length'
                                        value={vesselLength}
                                        style={GlobalStyles.inputBox}
                                        keyboardType='numeric'
                                        onChangeText={async (value) => {
                                            await setVesselLength(value);
                                        }}
                                    />
                                </View>
                            </View>
                            {
                                pro == false && (
                                    <>
                                        <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                                            <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0 }}>
                                                <Text style={GlobalStyles.labelText}>Vessel make</Text>
                                                <TextInput
                                                    placeholder='Enter make'
                                                    value={vesselMake}
                                                    style={GlobalStyles.inputBox}
                                                    onChangeText={async (value) => {
                                                        await setVesselMake(value);
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        <View style={GlobalStyles.spaceH}></View>
                                        <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                                            <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0 }}>
                                                <Text style={GlobalStyles.labelText}>Default vessel</Text>
                                                <CustomSwitch value={isDefault} toggleSwitch={toggleSwitch} />
                                            </View>
                                        </View>
                                        {
                                            isDefault && (
                                                <View style={{ flexDirection: 'column', justifyContent: 'center', backgroundColor: '#f9f9f9', alignItems: 'center', paddingVertical: 30 }}>
                                                    <View style={{ backgroundColor: '#fff', width: 80, height: 80, borderRadius: 80, alignItems: 'center', justifyContent: 'center' }}>
                                                        <View style={{ ...styles.vesselDetailIcon, shadowColor: '#52bb00', backgroundColor: '#52bb00', width: 40, height: 40, }}>
                                                            <RadixIcon />
                                                        </View>
                                                    </View>
                                                    <View style={{ paddingHorizontal: 50, paddingTop: 20 }}>
                                                        <Text style={{ textAlign: 'center', fontSize: width / 23, lineHeight: 25.5, color: '#646464', fontWeight: '300', fontFamily: 'Roboto-Light', letterSpacing: -0.3 }}>
                                                            All trips detected will be logged under this vessel
                                                                </Text>
                                                    </View>
                                                </View>
                                            )
                                        }
                                    </>
                                )
                            }
                            {
                                pro && (
                                    <>
                                        <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                                            <View style={[{ ...GlobalStyles.inputForm, paddingLeft: 0 }, vesselType && { borderBottomWidth: 0 }]}>
                                                <Text style={GlobalStyles.labelText}>Vessel type</Text>
                                                <Text
                                                    style={[GlobalStyles.inputBox, { color: vesselType ? '#000' : '#b0b0b7e0', paddingTop: 10 }]}
                                                    onPress={() => setVisibleTypeModal(true)}
                                                >{vesselType ? vesselType : 'Select type'}</Text>
                                            </View>
                                        </View>
                                        {
                                            vesselType && (
                                                <View style={{ width: '100%', backgroundColor: '#eee' }}>
                                                    <View style={{ ...GlobalStyles.inputForm }}>
                                                        <Text style={[GlobalStyles.labelText, { marginLeft: 10 }]}>{detailedType ? '' : 'Select detailed type'}</Text>
                                                        {
                                                            detailedType ?
                                                                <Text
                                                                    style={[GlobalStyles.inputBox, { color: detailedType ? '#000' : '#b0b0b7e0', paddingTop: 10, width: Dimensions.get('screen').width * .5 - 20 }]}
                                                                    onPress={() => setVisibleDetailedTypeModal(true)}
                                                                >{detailedType}</Text>
                                                                :
                                                                <Ionicons name={'chevron-down-outline'} size={20} color={'#b0b0b7e0'} onPress={() => setVisibleDetailedTypeModal(true)} />
                                                        }
                                                    </View>
                                                </View>
                                            )
                                        }
                                        <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                                            <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0 }}>
                                                <Text style={GlobalStyles.labelText}>Gross tonnage (GT)</Text>
                                                <TextInput
                                                    placeholder='Enter GT'
                                                    value={grossTonnage}
                                                    style={[GlobalStyles.inputBox, {width: width * 0.3}]}
                                                    keyboardType='numeric'
                                                    onChangeText={async (value) => {
                                                        await setGrossTonnage(value);
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                                            <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0 }}>
                                                <Text style={GlobalStyles.labelText}>Flag</Text>
                                                <TextInput
                                                    placeholder='Enter Flag'
                                                    value={flag}
                                                    style={GlobalStyles.inputBox}
                                                    onChangeText={async (value) => {
                                                        await setFlag(value);
                                                    }}
                                                />
                                            </View>
                                        </View>
                                        <View style={{ width: '100%' }}>
                                            <Text style={{
                                                ...styles.label
                                            }}>AIS information</Text>
                                        </View>
                                        <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                                            <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0 }}>
                                                <Text style={GlobalStyles.labelText}>MMSI number</Text>
                                                <TextInput
                                                    placeholder='Enter number'
                                                    value={mmsi}
                                                    style={GlobalStyles.inputBox}
                                                    keyboardType='numeric'
                                                    onChangeText={async (value) => {
                                                        await setMMSI(value);
                                                    }}
                                                    maxLength={9}
                                                />
                                            </View>
                                        </View>
                                        <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                                            <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0 }}>
                                                <Text style={GlobalStyles.labelText}>IMO number</Text>
                                                <TextInput
                                                    placeholder='Enter number'
                                                    value={imo}
                                                    style={GlobalStyles.inputBox}
                                                    keyboardType='numeric'
                                                    onChangeText={async (value) => {
                                                        await setIMO(value);
                                                    }}
                                                    maxLength={7}
                                                />
                                            </View>
                                        </View>
                                    </>
                                )
                            }
                        </>
                    </ScrollView>
                </SafeAreaView>
                <Modal
                    isOpen={visibleTypeModal}
                    onClosed={() => setVisibleTypeModal(false)}
                    style={[styles.modal, styles.modal0]}
                    position={"center"}
                    swipeArea={50}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalHeaderText}>Vessel type</Text>
                        </View>
                        {
                            types && (
                                types.map((item, index) =>
                                    <TouchableOpacity key={index} style={styles.listItem} onPress={() => { onSetVesselType(item) }}>
                                        <Text style={styles.listItemText} onPress={() => { onSetVesselType(item) }}>{item}</Text>
                                    </TouchableOpacity>
                                )
                            )
                        }
                    </View>
                </Modal>
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
                                detailedTypes && (
                                    detailedTypes.map((item, index) =>
                                        <TouchableOpacity key={index} style={styles.listItem} onPress={() => { onSetDetailedType(item) }}>
                                            <Text style={styles.listItemText} onPress={() => { onSetDetailedType(item) }}>{item}</Text>
                                        </TouchableOpacity>
                                    )
                                )
                            }
                        </ScrollView>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...GlobalStyles.FlexContainer,
        justifyContent: 'center',
        alignItems: 'center',
    },
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
    modalHeader: {
        paddingVertical: 15,
        alignItems: 'center'
    },
    modalBody: {
        height: '85%',
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
    sectionTitle: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 31,
        paddingBottom: 8
    },
    infoMark: {
        width: 16,
        height: 16,
        backgroundColor: '#3a0',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginLeft: 10,
        marginTop: -8
    },
    label: {
        paddingLeft: 12,
        paddingTop: 34,
        paddingBottom: 8,
        textAlign: 'left',
        color: '#8e8e93',
        textTransform: 'uppercase',
        fontFamily: 'Roboto-Regular',
        fontWeight: '400',
        fontSize: width / 32,
        lineHeight: 18,
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
    navigationText: {
        fontFamily: 'Roboto-Regular',
        fontSize: width/24.5,
        lineHeight: 19.92,
        letterSpacing: -0.3,
        fontWeight: '400',
        marginRight: 20,
        width: 55,
        textAlign: 'right'
    }
});

const mapStateToProps = state => {
    return { user: state.APP.USER };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(SecurityActions(), dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditVesselBasic);
