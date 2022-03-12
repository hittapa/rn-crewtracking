import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    ImageBackground,
} from 'react-native';
import * as GlobalStyles from '../styles/styles';
import { Colors, Buttons, Inputs } from '../styles/index';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Input } from '../components/Form/Fields/Input';
import { get } from 'lodash';
import { bindActionCreators } from 'redux';
import SecurityActions from '../actions/SecurityActions';
import { connect } from 'react-redux';
import appConstants from '../constants/app';
import { HeaderLeft } from '../components/Header/HeaderLeft';
import { Entypo, FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';

const validationSchema = yup.object({
    email: yup
        .string()
        .required('Please add your email address')
        .email('Email must be a valid one'),
    password: yup
        .string()
        .required('Please set a password')
        .min(4, 'Password must be at least 4 characters'),
});

/**
 *
 * @param navigation
 * @param {Function} actions.login
 * @param {Function} actions.storeToken
 * @return {JSX.Element}
 * @constructor
 */
function LoginScreen({ navigation, actions, loading }) {
    const [enableSubmit, setEnableSubmit] = useState(true);
    const [time, setTimer] = useState(30);
    // let time = 30;

    useEffect(() => {
        if (!enableSubmit) {
            const timeInterval = setInterval(() => {
                updateRemainingTime();
            }, 1000);
            return () => {
                clearInterval(timeInterval);
            }
            // let timeout = setTimeout(() => {
            //     let tt = time - 1;
            //     console.log(tt);
            //     setTimer(tt);
            //     if (tt == 0) {
            //         setEnableSubmit(true);
            //     }
            // }, 1000);
            // return () => {
            //     clearTimeout(timeout);
            // }
        }
    }, [enableSubmit]);

    useEffect(() => {
        if (time == 0 && !enableSubmit) {
            setEnableSubmit(true);
            setTimer(10);
        }
    }, [time]);

    const updateRemainingTime = () => {
        setTimer((timer) => timer - 1);
    }

    return (
        <View style={GlobalStyles.FlexContainer}>
            <ImageBackground
                source={require('../assets/images/app_bg.jpg')}
                style={styles.bgImage}
            >
                <SafeAreaView style={GlobalStyles.safeView}>
                    <View style={[{ height: 50, top: 0, left: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }]}>
                        <HeaderLeft onPress={() => navigation.goBack()}>
                            <View
                                style={{
                                    borderRadius: 50,
                                    alignItems: 'center',
                                }}
                            >
                                <Entypo
                                    name="chevron-thin-left"
                                    size={28}
                                    style={{ margin: 10 }}
                                    color={'#fff'}
                                />
                            </View>
                        </HeaderLeft>
                    </View>
                    <ScrollView style={{ marginBottom: 0 }}>
                        <KeyboardAvoidingView
                            behavior={
                                Platform.OS === 'ios' ? 'position' : 'height'
                            }
                            style={[{ paddingBottom: 50 }]}
                        >
                            <TouchableWithoutFeedback
                                onPress={Keyboard.dismiss}
                            >
                                <View style={styles.container}>
                                    <Image
                                        source={require('../assets/images/crewlog-logo.png')}
                                        resizeMode={'contain'}
                                        style={GlobalStyles.Logo236}
                                    />
                                    <Text
                                        style={GlobalStyles.headLines.headLine1}
                                    >
                                        Log into your Crewlog account
                                    </Text>
                                    <Formik
                                        initialValues={{
                                            email: '',
                                            password: '',
                                        }}
                                        validationSchema={validationSchema}
                                        validateOnChange={false}
                                        validateOnBlur={false}
                                        onSubmit={(values, formikBag) => {
                                            console.log(values);
                                            if (!enableSubmit) return;
                                            actions.login(
                                                get(values, 'email'),
                                                get(values, 'password')
                                            )
                                                .then()
                                                .catch(e => {
                                                    console.log("Login failed.....");
                                                    console.log(e.message.includes('429'));
                                                    if (e.message.includes('429')) {
                                                        setEnableSubmit(false);
                                                    }
                                                    formikBag.setFieldError(
                                                        'email',
                                                        'Invalid username or password'
                                                    )
                                                    // formikBag.resetForm({ values: { email: get(values, 'email'), password: get(values, 'password') } })
                                                });
                                        }}
                                    >
                                        {({
                                            handleChange,
                                            handleBlur,
                                            handleSubmit,
                                            values,
                                            errors,
                                            setFieldError,
                                        }) => (
                                            <View style={styles.loginContainer}>
                                                {
                                                    !enableSubmit && (
                                                        <Text>There were so many login attempts. Please try again after {time} seconds</Text>
                                                    )
                                                }
                                                <Input
                                                    icon={'email'}
                                                    placeholder="Email"
                                                    onChangeText={handleChange(
                                                        'email'
                                                    )}
                                                    onBlur={handleBlur('email')}
                                                    value={values.email}
                                                    keyboardType={
                                                        'email-address'
                                                    }
                                                    error={errors.email}
                                                    name="email"
                                                    type="email"
                                                />
                                                <Input
                                                    icon="lock"
                                                    placeholder="Password"
                                                    onChangeText={handleChange(
                                                        'password'
                                                    )}
                                                    onBlur={handleBlur(
                                                        'password'
                                                    )}
                                                    value={values.password}
                                                    error={errors.password}
                                                    name="password"
                                                    type="password"
                                                    secureTextEntry={true}
                                                />
                                                <CustomButton
                                                    title={'Login'}
                                                    onPress={handleSubmit}
                                                    containerStyle={{
                                                        width: '100%',
                                                        height: 50,
                                                        marginTop: 10
                                                    }}
                                                    textStyle={{ color: '#fff' }}
                                                />
                                                <CustomButton
                                                    title={'Forgot password'}
                                                    onPress={() =>
                                                        navigation.navigate(
                                                            'ForgotPassScreen'
                                                        )}
                                                    containerStyle={{
                                                        width: '100%',
                                                        height: 50,
                                                        backgroundColor: 'white',
                                                        borderColor: '#e9e9e9',
                                                        borderWidth: .5,
                                                        marginTop: 15
                                                    }}
                                                    textStyle={{ color: '#767676' }}
                                                />
                                            </View>
                                        )}
                                    </Formik>
                                </View>
                            </TouchableWithoutFeedback>
                        </KeyboardAvoidingView>
                    </ScrollView>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...GlobalStyles.FlexContainer,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginContainer: {
        width: '90%',
        height: 'auto',
        backgroundColor: '#fff',
        borderRadius: 11,
        padding: 20,
        marginTop: 30,
        alignItems: 'center',
    },
    textInput: {
        ...Inputs.defaultInput,
        width: '100%',
        color: Colors.colorGrey3,
    },
    loginBtn: {
        ...Buttons.greenBtn,
        width: 238,
        marginTop: 30,
    },
    forgotBtn: {
        ...Buttons.defaultBtn,
        width: 238,
    },
    bgImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
});

const mapStateToProps = (state, ownProps) => {
    const { loading } = get(state, appConstants.STATE_KEY);

    return { loading };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(SecurityActions(), dispatch),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(props => <LoginScreen {...props} />);
