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
import CustomButton from '../../components/CustomButton';
import { width } from '../../components/Carousel/Carousel';

function SignedIn(props) {
    const [user, setUser] = useState(null);
    const [pro, setPro] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [vesselName, setVesselName] = useState('');
    const [vesselLength, setVesselLength] = useState(null);

    useEffect(() => {
        if (!mounted) {
            console.log(props.user)
            setUser(props.user);
            if (props.user.plan.includes('pro')) setPro(true);
            setMounted(true);
        }
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
                            }}>Account Settings</Text>
                        </View>
                    </HeaderTitle>
                    <HeaderRight onPress={() => { }}>
                        <View style={{ width: 40 }}></View>
                    </HeaderRight>
                </View>
                <ScrollView style={[{ backgroundColor: '#f9f9f9' }]}>
                    {/* <View style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        backgroundColor: '#f9f9f9',
                        alignItems: 'center',
                        paddingVertical: 36.5,
                        paddingHorizontal: 55.5
                    }}>
                        <Text style={{
                            textAlign: 'center',
                            color: '#646464',
                            fontSize: width / 23,
                            lineHeight: 25.5,
                            fontWeight: '300',
                        }}>The signed in email address is the one we use for communication and subscription.</Text>
                    </View> */}
                    <View style={{ width: '100%', paddingLeft: 16, backgroundColor: '#fff' }}>
                        <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {/* <MaterialCommunityIcons
                                    name="account-circle-outline"
                                    size={22}
                                    color={'#000'}
                                /> */}
                                <Text style={{ ...GlobalStyles.labelText}}>Signed in</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ ...GlobalStyles.labelText, fontSize: width / 26, lineHeight: 22, color: '#ababab' }}>{user?.username}</Text>
                            </View>
                        </View>
                        <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ ...GlobalStyles.labelText}}>First name</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ ...GlobalStyles.labelText, fontSize: width / 26, lineHeight: 22, color: '#ababab' }}>{user?.firstName}</Text>
                            </View>
                        </View>
                        <View style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: 0 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ ...GlobalStyles.labelText}}>Last name</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ ...GlobalStyles.labelText, fontSize: width / 26, lineHeight: 22, color: '#ababab' }}>{user?.lastName}</Text>
                            </View>
                        </View>
                    </View>

                </ScrollView>
                <View style={{ paddingHorizontal: 40, paddingTop: 35, position: 'absolute', bottom: 76, width: '100%' }}>
                    <CustomButton
                        title='Log out'
                        onPress={() => {
                            props?.actions.removeToken();
                            props?.actions.removeUser();
                        }}
                        containerStyle={{ borderRadius: 7 }}
                        textStyle={{ color: 'white', paddingVertical: 12, fontWeight: '700' }}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
}

const mapStateToProps = state => {
    return { user: state.APP.USER };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(SecurityActions(), dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignedIn);
