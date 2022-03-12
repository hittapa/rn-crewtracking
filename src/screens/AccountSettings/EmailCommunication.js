import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    SafeAreaView,
    Text,
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
import { CustomSwitch } from '../../components/CustomSwitch';
import { width } from '../../components/Carousel/Carousel';

function EmailCommunication(props) {
    const [user, setUser] = useState(null);
    const [pro, setPro] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [vesselName, setVesselName] = useState('');
    const [vesselLength, setVesselLength] = useState(null);
    const [isWeekly, setIsWeekly] = useState(false);
    const [isMonthly, setIsMonthly] = useState(false);
    const [otherEmail, setOtherEmail] = useState(false);
    const [promotionalEmail, setPromotionalEmail] = useState(false);

    useEffect(() => {
        if (!mounted) {
            console.log('props.user')
            console.log(props.user)
            setUser(props.user);
            setIsWeekly(props.user.weekly_email == null ? false : props.user.weekly_email)
            setIsMonthly(props.user.monthly_email == null ? false : props.user.monthly_email)
            setOtherEmail(props.user.other_email == null ? false : props.user.other_email)
            setPromotionalEmail(props.user.promotional_email == null ? false : props.user.promotional_email)
            if (props.user?.plan.includes('pro')) setPro(true);
            setMounted(true);
        }
    }, [props, mounted])

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
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={{
                                ...GlobalStyles.headerTitle
                            }}>Email Communications</Text>
                        </View>
                    </HeaderTitle>
                    <HeaderRight onPress={() => { }}>
                        <View style={{ width: 40 }}></View>
                    </HeaderRight>
                </View>
                <ScrollView style={[{ backgroundColor: '#f9f9f9' }]}>
                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        backgroundColor: '#f9f9f9',
                        alignItems: 'center',
                        paddingVertical: 26,
                        paddingHorizontal: 23,
                        borderBottomWidth: .5,
                        borderBottomColor: '#ebebeb'
                    }}>
                        <Text style={{
                            textAlign: 'center',
                            color: '#646464',
                            fontSize: width / 23,
                            lineHeight: 25.5,
                            fontWeight: '300'
                        }}>Reminders make it easy to stay on top of your sea service</Text>
                    </View>
                    <>
                        <View style={{ width: '100%', paddingLeft: 16, backgroundColor: '#fff' }}>
                            <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: 0 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ ...GlobalStyles.labelText, }}>Weekly email</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <CustomSwitch value={isWeekly} toggleSwitch={async () => {
                                        setIsWeekly(!isWeekly)
                                        if(!isWeekly) setIsMonthly(false)
                                        const data = {
                                            id: user.id,
                                            weekly_email: !isWeekly,
                                            monthly_email: !isWeekly ? false : isMonthly
                                        };
                                        await props.actions.updateUser(data).then(res => setUser(res));
                                    }} />
                                </View>
                            </View>
                        </View>
                        <View style={{ width: '100%' }}>
                            <Text style={{
                                ...styles.label
                            }}>Summary, details &amp; stats for last weeks trips and/or service</Text>
                        </View>
                    </>
                    <>
                        <View style={{ width: '100%', paddingLeft: 16, backgroundColor: '#fff' }}>
                            <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: 0 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ ...GlobalStyles.labelText, }}>Month-end email</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <CustomSwitch value={isMonthly} toggleSwitch={async () => {
                                        setIsMonthly(!isMonthly)
                                        if(!isMonthly) setIsWeekly(false)
                                        const data = {
                                            id: user.id,
                                            weekly_email: !isMonthly ? false : isWeekly,
                                            monthly_email: !isMonthly
                                        };
                                        await props.actions.updateUser(data).then(res => setUser(res));
                                    }} />
                                </View>
                            </View>
                        </View>
                        <View style={{ width: '100%' }}>
                            <Text style={{
                                ...styles.label
                            }}>Last month at a glance - great for filling in sea service forms</Text>
                        </View>
                    </>
                    <>
                        <View style={{ width: '100%', paddingLeft: 16, backgroundColor: '#fff' }}>
                            <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: 0 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ ...GlobalStyles.labelText, }}>Other email</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <CustomSwitch value={otherEmail} toggleSwitch={async () => {
                                        setOtherEmail(!otherEmail)
                                        const data = {
                                            id: user.id,
                                            other_email: !otherEmail
                                        };
                                        await props.actions.updateUser(data).then(res => setUser(res));
                                    }} />
                                </View>
                            </View>
                        </View>
                        <View style={{ width: '100%' }}>
                            <Text style={{
                                ...styles.label
                            }}>Product updates, company news, resources you can use to help make logging sea time easier</Text>
                        </View>
                    </>
                    <>
                        <View style={{ width: '100%', paddingLeft: 16, backgroundColor: '#fff' }}>
                            <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: 0 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ ...GlobalStyles.labelText, }}>Promotional email</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <CustomSwitch value={promotionalEmail} toggleSwitch={async () => {
                                        setPromotionalEmail(!promotionalEmail)
                                        const data = {
                                            id: user.id,
                                            promotional_email: !promotionalEmail
                                        };
                                        await props.actions.updateUser(data).then(res => setUser(res));
                                    }} />
                                </View>
                            </View>
                        </View>
                        <View style={{ width: '100%' }}>
                            <Text style={{
                                ...styles.label
                            }}>Receive special discounts and promotions from Crewlog</Text>
                        </View>
                    </>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: 38,
        textAlign: 'left',
        color: '#8e8e93',
        fontFamily: 'Roboto-Regular',
        fontWeight: '400',
        fontSize: width / 32,
        lineHeight: 18,
        letterSpacing: -0.08
    }
})

const mapStateToProps = state => {
    return { user: state.APP.USER };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(SecurityActions(), dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailCommunication);
