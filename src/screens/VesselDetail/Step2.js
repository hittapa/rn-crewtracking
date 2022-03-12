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
import { FontAwesome5 } from '@expo/vector-icons';
import { width } from '../../components/Carousel/Carousel';

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
                            <FontAwesome5
                                name="check"
                                style={[
                                    { color: Colors.colorGreen },
                                    styles.flatListIcon,
                                ]}
                                size={20}
                                color="green"
                            />
                        )
                        : (
                            <FontAwesome5
                                name="times"
                                style={[
                                    { color: Colors.colorGrey2 },
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
                <View style={ModalStyles.modalView}>
                    <FlatListFeatures data={flatListData} />

                    <TouchableHighlight
                        style={styles.signInBtn}
                        onPress={() => {
                            setModalName(!modalName);
                        }}
                    >
                        <Text style={Buttons.greenBtnText}>Close</Text>
                    </TouchableHighlight>
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
                        key: 'Create and online logbook',
                        feature: 'active',
                    },
                    { key: 'Track your trips', feature: 'active' },
                    {
                        key: 'Share your journey',
                        feature: 'active',
                    },
                    {
                        key: 'Record your sea service',
                        feature: 'inactive',
                    },
                    {
                        key: 'Download MCA forms',
                        feature: 'inactive',
                    },
                ]}
            />
            <ModalFeatures
                modalName={modalProVisible}
                setModalName={setModalProVisible}
                flatListData={[
                    {
                        key: 'Create and online logbook',
                        feature: 'active',
                    },
                    { key: 'Track your trips', feature: 'active' },
                    {
                        key: 'Share your journey',
                        feature: 'active',
                    },
                    {
                        key: 'Record your sea service',
                        feature: 'active',
                    },
                    {
                        key: 'Download MCA forms',
                        feature: 'active',
                    },
                ]}
            />

            <Text style={[GlobalStyles.headLines.headLine1, styles.headline]}>
                Choose your subscription plan
            </Text>
            <Text
                style={styles.headlineText}
            >
                Get your 10 Free trips now No credit card required
            </Text>
            <View style={styles.subscriptionContainer}>
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            setFieldValue('plan', 'basic');
                        }}
                        activeOpacity={1}
                    >
                        <View
                            style={[
                                styles.subscription,
                                values.plan === 'basic'
                                    ? styles.planActive
                                    : null,
                            ]}
                        >
                            <Text style={styles.subHeaderLine}>Crewlog BASIC</Text>
                            <Text style={styles.subtext}>10 FREE trips</Text>
                            <Text style={styles.subtext}>$2.99/mo unlimited</Text>

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
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            setFieldValue('plan', 'pro');
                        }}
                        activeOpacity={1}
                    >
                        <View
                            style={[
                                styles.subscription,
                                values.plan === 'pro'
                                    ? styles.planActive
                                    : null,
                            ]}
                        >
                            <Text style={styles.subHeaderLine}>Crewlog PRO</Text>
                            <Text style={styles.subtext}>10 FREE trips</Text>
                            <Text style={styles.subtext}>$5.99/mo unlimited</Text>
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
        marginBottom: 30,
    },
    subscription: {
        flex: 50,
        margin: 5,
        paddingTop: 15,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 35,
        color: '#333',
        backgroundColor: '#FFF',
        borderStyle: 'solid',
        borderWidth: 4,
        borderColor: Colors.colorGrey5,
        borderRadius: 15,
    },
    subHeaderLine: {
        fontSize: width / 26,
        color: Colors.colorGreen,
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'SourceSansPro-SemiBold',
    },
    subtext: {
        fontSize: width / 28,
        color: Colors.colorGrey2,
        marginBottom: 3,
        textAlign: 'center',
        fontFamily: 'SourceSansPro-Regular',
    },
    viewFeatures: {
        position: 'absolute',
        zIndex: 5,
        top: -38,
        left: '-50%',
        transform: [{ translateX: 125 }],
        fontSize: width / 28,
        color: Colors.colorCyan,
        marginBottom: 3,
        textAlign: 'center',
        fontFamily: 'SourceSansPro-SemiBold',
    },
    planActive: {
        borderColor: Colors.colorGreen,
    },
    flatList: {
        width: 200,
        flexGrow: 0,
        height: 250,
    },
    item: {
        flex: 1,
        flexDirection: 'row',
    },
    flatListIcon: {
        flex: 20,
        marginRight: 10,
        textAlign: 'center',
    },
    itemText: {
        flex: 180,
        marginBottom: 15,
    },
});

export default Step2;
