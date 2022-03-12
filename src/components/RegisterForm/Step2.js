import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Modal,
    TouchableHighlight,
    FlatList,
} from 'react-native';
import * as GlobalStyles from '../../styles/styles';
import { ModalStyles, Colors, Buttons } from '../../styles/index';
import { AntDesign, Feather, FontAwesome5 } from '@expo/vector-icons';
import CustomButton from '../CustomButton';
import { width } from '../Carousel/Carousel';

const FlatListFeatures = props => {
    const data = props.data || [];

    return (
        <FlatList
            style={styles.flatList}
            data={data}
            renderItem={({ item }) => (
                <View style={styles.item}>
                    {item.feature === 'active'
                        ? (
                            <Feather
                                name="check"
                                style={[
                                    { color: Colors.colorGreen },
                                    styles.flatListIcon,
                                ]}
                                size={25}
                                color="green"
                            />
                        )
                        : (
                            <AntDesign
                                name="close"
                                style={[
                                    { color: Colors.colorGrey1 },
                                    styles.flatListIcon,
                                ]}
                                size={20}
                                color="white"
                            />
                        )}
                    <Text style={styles.itemText}>{item.key}</Text>
                </View>
            )}
        />
    );
};

const ModalFeatures = props => {
    const modalName = props.modalName || 'modal';
    const setModalName = props.setModalName || 'setModal';
    const flatListData = props.flatListData;

    return (
        <Modal animationType="slide" transparent={true} visible={modalName}>
            <View style={ModalStyles.centeredView}>
                <View style={{...ModalStyles.modalView, width: '85%', height: 360 }}>
                    <FlatListFeatures data={flatListData} />
                    <CustomButton
                        title={'Close'}
                        onPress={() => {
                            setModalName(!modalName);
                        }}
                        containerStyle={{
                            width: '100%',
                            height: 50,
                            marginTop: 10
                        }}
                        textStyle={{ color: '#fff' }}
                    />
                </View>
            </View>
        </Modal>
    );
};

const Step2 = formikProps => {
    const { setFieldValue, values } = formikProps;
    const [modalBasicVisible, setModalBasicVisible] = useState(false);
    const [modalProVisible, setModalProVisible] = useState(false);

    return (
        <>
            <ModalFeatures
                modalName={modalBasicVisible}
                setModalName={setModalBasicVisible}
                flatListData={[
                    {
                        key: 'Create an online logbook',
                        feature: 'active',
                    },
                    { key: 'Detect and track your trips at sea', feature: 'active' },
                    {
                        key: 'Calculate eligible days underway',
                        feature: 'active',
                    },
                    {
                        key: 'Record onboard service',
                        feature: 'inactive',
                    },
                    {
                        key: 'Endorse sea service forms',
                        feature: 'inactive',
                    },
                ]}
            />
            <ModalFeatures
                modalName={modalProVisible}
                setModalName={setModalProVisible}
                flatListData={[
                    {
                        key: 'Create an online logbook',
                        feature: 'active',
                    },
                    { key: 'Detect and track your trips at sea', feature: 'active' },
                    {
                        key: 'Calculate eligible days underway',
                        feature: 'active',
                    },
                    {
                        key: 'Record onboard service',
                        feature: 'active',
                    },
                    {
                        key: 'Endorse sea service forms',
                        feature: 'active',
                    },
                ]}
            />

            <View style={styles.subscriptionContainer}>
                <View style={[styles.memberShipCard, values.plan === 'basic'
                    ? styles.planActive
                    : null,]}>
                    <TouchableOpacity
                        onPress={() => {
                            setFieldValue('plan', 'basic');
                        }}
                        activeOpacity={1}
                    >
                        <View
                            style={[
                                styles.subscription,
                            ]}
                        >
                            <Text style={styles.subHeaderLine}>Crewlog BASIC</Text>
                            <Text style={styles.subtext}>Always</Text>
                            <Text style={styles.subtext}>FREE</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setModalBasicVisible(true);
                        }}
                    >
                        <Text style={styles.viewFeatures}>
                            View features
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.memberShipCard, values.plan === 'pro'
                    ? styles.planActive
                    : null,]}>
                    <TouchableOpacity
                        onPress={() => {
                            setFieldValue('plan', 'pro');
                        }}
                        activeOpacity={1}
                    >
                        <View
                            style={[
                                styles.subscription,
                            ]}
                        >
                            <Text style={styles.subHeaderLine}>Crewlog PRO</Text>
                            <Text style={styles.subtext}>5 FREE trips</Text>
                            <Text style={{ ...styles.subtext, fontFamily: 'Roboto-Thin' }}>then only</Text>
                            <Text style={styles.subtext}>$4.99/mo</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setModalProVisible(true);
                        }}
                    >
                        <Text style={styles.viewFeatures}>
                            View features
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    signInBtn: {
        width: 238,
        ...Buttons.greenBtn,
    },
    headline: {
        fontSize: width / 19,
        color: '#FFF',
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'SourceSansPro-SemiBold',
    },
    headlineText: {
        fontSize: width / 28,
        color: '#FFF',
        marginBottom: 20,
        fontFamily: 'SourceSansPro-Regular',
    },
    subscriptionContainer: {
        flex: 1,
        flexDirection: 'row',
        // marginBottom: 30,
        height: 160
    },
    subscription: {
        margin: 5,
        color: '#333',
        backgroundColor: '#FFF',
    },
    subHeaderLine: {
        fontSize: width / 26,
        color: Colors.colorBlue3,
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'Roboto-Bold',
    },
    subtext: {
        fontSize: width / 28,
        color: Colors.colorGrey2,
        marginBottom: 3,
        textAlign: 'center',
        fontFamily: 'Roboto-Bold',
    },
    viewFeatures: {
        fontSize: width / 28,
        color: Colors.colorCyan,
        marginBottom: 3,
        textAlign: 'center',
        fontFamily: 'Roboto-Regular',
    },
    planActive: {
        borderColor: Colors.colorBlue3,
        borderWidth: 3
    },
    flatList: {
        width: 260,
        flexGrow: 0,
        height: 250,
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        height: 45
    },
    flatListIcon: {
        flex: 20,
        marginRight: 10,
        textAlign: 'center',
    },
    itemText: {
        flex: 180,
        marginBottom: 15,
        fontSize: width/27,
        lineHeight: 22,
        letterSpacing: -0.41,
        fontFamily: 'Roboto-Regular'
    },
    memberShipCard: {
        width: '50%',
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: .5,
        borderColor: '#d7d7d7',
        borderRadius: 11,
        marginHorizontal: 5,
        paddingVertical: 15
    }
});

export default Step2;
