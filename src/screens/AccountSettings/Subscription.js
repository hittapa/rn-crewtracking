import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    SafeAreaView,
    Text,
    Platform,
} from 'react-native';
import * as GlobalStyles from '../../styles/styles';
import { HeaderLeft } from '../../components/Header/HeaderLeft';
import { HeaderRight } from '../../components/Header/HeaderRight';
import { HeaderTitle } from '../../components/Header/HeaderTitle';
import { TextInput } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SecurityActions from '../../actions/SecurityActions';
import { FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import SubscriptionCarousel, { height } from '../../components/Carousel/SubscriptionCarousel';
import CustomButton from '../../components/CustomButton';
import { width } from '../../components/Carousel/Carousel';
import * as RNIap from 'react-native-iap';

const itemSkus = Platform.select({
    ios: [
        'monthly_subscription'
    ],
    android: [
        'monthly_subscription'
    ]
})

export const onUpgradePlan = async () => {
    try {
        const connect = await RNIap.initConnection();
        console.log('Initial connecting to IAP');
        console.log(connect);
        const products = await RNIap.getSubscriptions(itemSkus);
        console.log("Subscription==============================");
        console.log(products);
        await RNIap.requestSubscription(itemSkus[0]);
        await RNIap.endConnection();
    } catch (err) {
        console.log(err);
    }
}

function Subscription(props) {
    const [user, setUser] = useState(null);
    const [pro, setPro] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [vesselName, setVesselName] = useState('');
    const [vesselLength, setVesselLength] = useState(null);
    const [tripRemain, setTripRemain] = useState(0);

    useEffect(() => {
        if (!mounted) {
            console.log(props.user)
            setUser(props.user);
            if (props.user.plan.includes('pro')) setPro(true);
            setMounted(true);

            if (props.vessels) {
                var vessels = props.vessels;
                let amount = 0;
                for (let i = 0; i < vessels.length; i++) {
                    const vessel = vessels[i];
                    if (vessel.onboardServices && vessel.onboardServices.length > 0) {
                        for (let i = 0; i < vessel.onboardServices.length; i++) {
                            const item = vessel.onboardServices[i];
                            if (item.type == 'trip' && item.trip != null) {
                                amount += 1;
                            }
                        }
                    }
                }
                setTripRemain(Math.max(0, 5 - amount));
            }
        }

        const listener = RNIap.purchaseUpdatedListener(purchase => {
            console.log("PurchaseUpdatedListener", purchase);
            const receipt = purchase.transactionReceipt;
            if (receipt) {
                // Should update subscription information in our backend
                // then 
                if (user?.transactionDate != purchase.transactionDate) {
                    const data = {
                        id: user?.id,
                        plan: 'pro',
                        transactionDate: purchase.transactionDate,
                        receipt: receipt,
                        transactionId: purchase.transactionId,
                    };
                    props.actions.updateUser(data);
                    RNIap.finishTransaction(purchase.transactionId, false);
                    props.navigation.navigate('Settings');
                }
            }
        });
        // listener.remove();
    }, [props, mounted])

    return (
        <View style={GlobalStyles.FlexContainer}>
            <SafeAreaView style={[GlobalStyles.safeView]}>
                <View style={[GlobalStyles.header]}>
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
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={{
                                ...GlobalStyles.headerTitle
                            }}>Subscription Management</Text>
                        </View>
                    </HeaderTitle>
                    <HeaderRight onPress={() => { }}>
                        <View style={{ width: 40 }}></View>
                    </HeaderRight>
                </View>
                <ScrollView style={[{ backgroundColor: '#ffffff' }]} bounces={false}>
                    <View style={{ width: '100%', alignItems: 'center', paddingVertical: 12, backgroundColor: '#c6c6c8', height: 95.99 }}>
                        <Text style={{
                            fontFamily: 'Roboto-Bold',
                            fontSize: width/11.5,
                            lineHeight: 41.02,
                            letterSpacing: -0.3,
                            color: 'white'
                        }}>{tripRemain}</Text>
                        <Text style={{
                            fontFamily: 'Roboto-Regular',
                            fontSize: width / 23,
                            lineHeight: 25,
                            letterSpacing: -0.3,
                            color: 'white'
                        }}>Trips remaining</Text>
                    </View>
                    <View style={{ backgroundColor: 'white', width: '100%', alignItems: 'center', height: 71.14, justifyContent: 'center' }}>
                        <Text style={{ fontFamily: 'Roboto-Bold', fontSize: width / 18, lineHeight: 35, letterSpacing: -0.41, color: '#505050', textTransform: 'uppercase' }}>{"Go with pro"}</Text>
                    </View>
                    <View style={{ width: '100%', backgroundColor: '#fff', height: height * .45 }}>
                        <SubscriptionCarousel />
                    </View>

                    <Text style={{ fontFamily: 'Roboto-Regular', fontSize: width / 32, lineHeight: 18, letterSpacing: -0.08, textAlign: 'center', color: '#000' }}>$4.99 MONTHLY PAYMENT</Text>

                    <View style={{
                        alignItems: 'center',
                        paddingVertical: 10
                    }}>
                        <CustomButton
                            title='Upgrade to Crewlog PRO'
                            onPress={() => onUpgradePlan()}
                            containerStyle={{ borderRadius: 7, width: width * .8, alignItems: 'center' }}
                            textStyle={{ color: 'white', paddingVertical: 12, fontWeight: '700' }}
                        />
                    </View>

                    <Text style={{
                        fontFamily: 'Roboto-Regular', fontSize: width / 36, lineHeight: 11.72, letterSpacing: -0.3, textAlign: 'center', color: '#b0b0b790', width: '100%', paddingHorizontal: 30
                    }}>
                        Use of Crewlog is subject to Crewlogs Terms of Service and Privacy Policy. Upgrading to Crewlog Pro, an unlimited trips plan with additional features for recording sea service, will charge your iTunes/Google play account $4.99 a month, renewing automatically. To cancel, turn off auto-renew at least 24 hours before renewal date in iTunes account settings.
                    </Text>

                    <View style={GlobalStyles.spaceH}></View>
                </ScrollView>
            </SafeAreaView>
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
        height: 150,
        width: 250,
        alignItems: 'center',
    },
    modalFooter: {
        height: 50,
        width: 250,
        bottom: 0,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: .5,
        borderTopColor: '#8e8e8e'
    },
    modalHeaderText: {
        fontSize: width / 26,
        lineHeight: 24,
        color: '#f3f3f3',
        fontWeight: '700'
    },
    footerActionText: {
        color: '#09e',
        fontSize: width / 26,
        lineHeight: 24,
        fontWeight: 'bold'
    },
    modalBodyText: {
        fontSize: width / 28,
        lineHeight: 21,
        color: '#fefefe',
        textAlign: 'center',
    },
    sectionTitle: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center'
    },
    infoMark: {
        width: 16,
        height: 16,
        backgroundColor: '#3a0',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
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
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(Subscription);
