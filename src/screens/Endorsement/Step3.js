import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, KeyboardAvoidingView, ScrollView, StyleSheet, Text, Image, TouchableOpacity, FlatList, TextInput, Platform } from 'react-native';
import { width } from '../../components/Carousel/Carousel';
import CustomButton from '../../components/CustomButton';
import { HeaderLeft } from '../../components/Header/HeaderLeft';
import { HeaderRight } from '../../components/Header/HeaderRight';
import { HeaderTitle } from '../../components/Header/HeaderTitle';
import { Colors } from '../../styles';
import * as GlobalStyles from '../../styles/styles';

function EndorseStep3(props) {

    const [vessel, setVessel] = useState(null);
    const [period, setPeriod] = useState(null);
    const [departments, setDepartments] = useState(null);
    const [forms, setForms] = useState(null);
    const [roles, setRoles] = useState(null);
    const [type, setType] = useState('merchant');
    const [completedForms, setCompletedForms] = useState([]);
    const [startLoc, setStartLoc] = useState('');
    const [endLoc, setEndLoc] = useState('');

    useEffect(() => {
        if (props.route.params.vessel) setVessel(props.route.params.vessel);
        if (props.route.params.period) setPeriod(props.route.params.period);
        if (props.route.params.departments) setDepartments(props.route.params.departments);
        if (props.route.params.forms) setForms(props.route.params.forms);
        if (props.route.params.roles) setRoles(props.route.params.roles);
        if (props.route.params.type) setType(props.route.params.type);
        if (props.route.params.startLoc) setStartLoc(props.route.params.startLoc);
        if (props.route.params.endLoc) setEndLoc(props.route.params.endLoc);
        if (props.route.params.testimonial) {
            if (!completedForms.includes('Sea time testimonial')) {
                let _forms = [...completedForms];
                _forms.push('Sea time testimonial');
                setCompletedForms(_forms);
            }
        };
        if (props.route.params.certificate) {
            if (!completedForms.includes('Certificate of discharge')) {
                let _forms = [...completedForms];
                _forms.push('Certificate of discharge');
                setCompletedForms(_forms);
            }
        };
        if (props.route.params.uscg) {
            if (!completedForms.includes('USCG Small vessel form')) {
                let _forms = [...completedForms];
                _forms.push('USCG Small vessel form');
                setCompletedForms(_forms);
            }
        };
    }, [props]);

    const enableNext = () => {
        let enable = true;
        for (let i = 0; i < forms?.length; i++) {
            const form = forms[i];
            if (form == 'Discharge certificate') form = 'Certificate of discharge';
            if (form == 'Small vessel sea service form USCG') form = 'USCG Small vessel form';
            if (!completedForms.includes(form)) {
                enable = false;
                break;
            }
        }
        return enable;
    }

    const handleReview = (item) => {
        const data = {
            ...props.route.params
        };
        if (item == 'Sea time testimonial') {
            props.navigation.navigate('SeaTimeTestimonial', data)
        }
        if (item == 'Certificate of discharge') {
            props.navigation.navigate('DischargeCertificate', data)
        }
        if (item == 'USCG Small vessel form') {
            props.navigation.navigate('SmallVesselFormUSCG', data)
        }
    }

    return (
        <View style={GlobalStyles.FlexContainer}>
            <SafeAreaView style={[GlobalStyles.safeView]}>
                <View style={[GlobalStyles.header]}>
                    <HeaderLeft onPress={() => props.navigation.goBack()}>
                        <Text style={{
                            color: '#ababab',
                            marginLeft: 20,
                            fontSize: width / 23,
                            lineHeight: 21.09,
                            letterSpacing: -0.3,
                            fontWeight: '400',
                            width: 55,
                        }} numberOfLines={1}>{"Back"}</Text>
                    </HeaderLeft>
                    <HeaderTitle>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={{
                                ...GlobalStyles.headerTitle
                            }}>Endorse sea service</Text>
                            <Text style={{
                                color: '#888',
                                fontSize: width / 28,
                                lineHeight: 18,
                                textTransform: 'uppercase'
                            }}>{`Step 3 of 4`}</Text>
                        </View>
                    </HeaderTitle>
                    <HeaderRight>
                        <View style={{ width: 55, marginRight: 20 }}></View>
                    </HeaderRight>
                </View>
                <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'position' : 'height'}>
                    <ScrollView style={[{ backgroundColor: '#f9f9f9', marginBottom: 120 }]} nestedScrollEnabled bounces={false}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', paddingHorizontal: 16, backgroundColor: '#ffffff' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', maxWidth: '50%' }}>
                                <Text style={{ fontSize: width/24.5, lineHeight: 20, letterSpacing: -0.3 }}>Place of joining</Text>
                                <Text style={{ fontSize: width/21, lineHeight: 22, letterSpacing: -0.408, color: '#6aabff', textTransform: 'uppercase', paddingTop: 7 }}>{period && moment(period.start).utc().format('DD MMM YYYY')}</Text>
                                <Text style={{ ...GlobalStyles.labelText, color: Colors.colorGrey4 }}>{startLoc}</Text>
                            </View>
                            <Image source={require('../../../assets/large_arrow.png')} style={{ height: 157, width: 28, resizeMode: 'contain' }} />
                            <View style={{ justifyContent: 'center', alignItems: 'center', maxWidth: '50%' }}>
                                <Text style={{ fontSize: width/24.5, lineHeight: 20, letterSpacing: -0.3 }}>Place of discharge</Text>
                                <Text style={{ fontSize: width/21, lineHeight: 22, letterSpacing: -0.408, color: '#6aabff', textTransform: 'uppercase', paddingTop: 7 }}>{period && moment(period.end).utc().format('DD MMM YYYY')}</Text>
                                <Text style={{ ...GlobalStyles.labelText, color: Colors.colorGrey4 }}>{endLoc}</Text>
                            </View>
                        </View>

                        <View style={{ width: '100%' }}>
                            <Text style={{
                                ...styles.label
                            }}>Review forms</Text>
                        </View>
                        <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                            {
                                forms && forms.map((item, key) => {
                                    if (item == 'Discharge certificate') item = 'Certificate of discharge';
                                    if (item == 'Small vessel sea service form USCG') item = 'USCG Small vessel form';
                                    return (
                                        <View key={"forms_" + key} style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: .5, borderBottomColor: '#c6c6c8' }}>
                                            <Text style={{ ...GlobalStyles.labelText, width: '80%' }} numberOfLines={1}>{item}</Text>
                                            <TouchableOpacity onPress={() => handleReview(item)}>
                                                <Text style={{ ...styles.review, color: completedForms.includes(item) ? "#81c34a" : '#6aabff' }}>{completedForms.includes(item) ? "Complete" : "Review"}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <View style={{ position: 'absolute', backgroundColor: '#ffffff', bottom: 0, width: '100%', height: 100, padding: 20, flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <CustomButton
                        title={'Next'}
                        containerStyle={{ backgroundColor: '#ffffff', height: 50, width: '80%', borderColor: enableNext() ? '#7FC542' : Colors.colorGrey5 }}
                        textStyle={{ color: enableNext() ? '#7FC542ee' : Colors.colorGrey5 }}
                        onPress={() => enableNext() && props.navigation.navigate('EndorseStep4', { ...props.route.params })}
                    />
                </View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
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
    tagItem: {
        height: 32,
        // width: 150,
        borderRadius: 7,
        paddingHorizontal: 8,
        paddingVertical: 6,
        backgroundColor: '#636363',
        borderWidth: .5,
        borderColor: "rgba(0,0,0,0.04)",
        alignItems: 'center',
        flexDirection: 'row',
        margin: 3,
        justifyContent: 'space-between'
    },
    review: {
        fontFamily: 'Roboto-Regular',
        fontSize: width / 23,
        lineHeight: 22,
        letterSpacing: -0.408,
    }
})

export default EndorseStep3;