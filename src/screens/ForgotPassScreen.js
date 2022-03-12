import React from 'react';
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
import { Input } from '../components/Form/Fields/Input';
import * as yup from 'yup';
import { get } from 'lodash';
import appConstants from '../constants/app';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SecurityActions from '../actions/SecurityActions';
import CustomButton from '../components/CustomButton';
import { HeaderLeft } from '../components/Header/HeaderLeft';
import { Entypo } from '@expo/vector-icons';
import { width } from '../components/Carousel/Carousel';

/**
 * @param navigation
 * @param {function} actions.forgotPasswordRequest
 * @param {boolean} loading
 * @return {JSX.Element}
 * @constructor
 */
function ForgotPassScreen({ navigation, actions, loading }) {
    const [emailSent, setEmailSent] = React.useState(false);
    const [codeVerified, setCodeVerified] = React.useState(false);

    const validationSchema = yup.object({
        email: yup
            .string()
            .required('Please add your email address')
            .email('Email must be a valid one'),
    });

    const handleSubmit = (values, formikBag) => {
        if (!emailSent) {
            actions
                .forgotPasswordRequest(get(values, 'email'))
                .then(res => {
                    setEmailSent(true);
                })
                .catch(e => {
                    formikBag.setFieldError(
                        'email',
                        'Sorry, we have no account associated with this email'
                    );
                });
        } else {
            console.log(values)
            actions
                .verifyCode(get(values, 'email'), get(values, 'code'))
                .then(res => {
                    console.log("Code verification")
                    console.log(res)
                    setCodeVerified(true);
                })
                .catch(e => {
                    console.log('e')
                    console.log(e)
                    formikBag.setFieldError(
                        'code',
                        'Sorry, we have detected an invalid verification code. Please try again with the correct code.'
                    );
                });
        }

    };

    const resetPassword = (values, formikBag) => {
        console.log(get(values, 'password'))
        console.log(get(values, 'password_confirm'))
        if (get(values, 'password').length < 8) {
            formikBag.setFieldError(
                'password',
                'Password should be ore than 8 characters.'
            );
            return;
        }
        if (get(values, 'password') == undefined) {
            formikBag.setFieldError(
                'password',
                'Please input new password'
            );
            return;
        }
        if (get(values, 'password') && get(values, 'password_confirm') == undefined) {
            formikBag.setFieldError(
                'password_confirm',
                'Please input new password again'
            );
            return;
        }
        if (get(values, 'password') != get(values, 'password_confirm')) {
            formikBag.setFieldError(
                'password_confirm',
                'Please confirm new password correctly'
            );
            return;
        }

        actions
            .resetpassword(get(values, 'email'), get(values, 'code'), get(values, 'password'))
            .then(res => {
                setEmailSent(false);
                setCodeVerified(false);
                navigation.goBack();
            })
            .catch(e => {
                formikBag.setFieldError(
                    'password',
                    'Sorry, something went wrong to reset new password. Please try again later'
                );
            });

    };



    return (
        <View style={GlobalStyles.FlexContainer}>
            <ImageBackground
                source={require('../assets/images/app_bg.jpg')}
                style={styles.bgImage}
            >
                <SafeAreaView style={GlobalStyles.safeView}>
                    <View style={[{ height: 50, top: 0, left: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }]}>
                        <HeaderLeft onPress={() => {
                            setEmailSent(false);
                            setCodeVerified(false);
                            navigation.goBack();
                        }}>
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
                    <KeyboardAvoidingView
                        behavior={
                            Platform.OS === 'ios' ? 'height' : 'height'
                        }
                    // style={styles.container}
                    >
                        <ScrollView style={GlobalStyles.scrollView}>
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
                                        Reset your password
                                    </Text>
                                    <Formik
                                        initialValues={{
                                            email: '',
                                        }}
                                        validationSchema={validationSchema}
                                        validateOnChange={false}
                                        validateOnBlur={false}
                                        onSubmit={(values, formikBag) => {
                                            if (codeVerified && emailSent)
                                                resetPassword(values, formikBag)
                                            else
                                                handleSubmit(values, formikBag);
                                        }}
                                    >
                                        {({
                                            values,
                                            errors,
                                            handleChange,
                                            handleBlur,
                                            handleSubmit,
                                        }) => (
                                            <View style={styles.resetContainer}>
                                                {!emailSent ? (
                                                    <>
                                                        <Input
                                                            icon={'email'}
                                                            placeholder="Email"
                                                            onChangeText={handleChange(
                                                                'email'
                                                            )}
                                                            onBlur={handleBlur(
                                                                'email'
                                                            )}
                                                            value={values.email}
                                                            keyboardType={
                                                                'email-address'
                                                            }
                                                            error={errors.email}
                                                            name="email"
                                                            type="email"
                                                        />
                                                        <CustomButton
                                                            title={'Reset password'}
                                                            onPress={handleSubmit}
                                                            containerStyle={{
                                                                width: '100%',
                                                                height: 50,
                                                                marginTop: 10
                                                            }}
                                                            textStyle={{ color: '#fff' }}
                                                        />
                                                    </>
                                                ) : (
                                                    !codeVerified ? (
                                                        <>
                                                            <Text
                                                                style={
                                                                    GlobalStyles
                                                                        .textLines
                                                                        .defaultText
                                                                }
                                                            >
                                                                Email has been sent!
                                                            </Text>
                                                            <Text
                                                                style={
                                                                    {
                                                                        ...GlobalStyles
                                                                            .textLines
                                                                            .defaultText,
                                                                        fontSize: width / 27,
                                                                        paddingBottom: 10
                                                                    }
                                                                }
                                                            >
                                                                Check your email to retrieve the verification code.
                                                            </Text>
                                                            <Input
                                                                placeholder="Enter Verification Code"
                                                                onChangeText={handleChange(
                                                                    'code'
                                                                )}
                                                                onBlur={handleBlur(
                                                                    'code'
                                                                )}
                                                                value={values.code}
                                                                keyboardType={'default'}
                                                                error={errors.code}
                                                                name="code"
                                                                type="code"
                                                            />
                                                            <CustomButton
                                                                title={'Verify Code'}
                                                                onPress={handleSubmit}
                                                                containerStyle={{
                                                                    width: '100%',
                                                                    height: 50,
                                                                    marginTop: 10
                                                                }}
                                                                textStyle={{ color: '#fff' }}
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Text
                                                                style={
                                                                    GlobalStyles
                                                                        .textLines
                                                                        .defaultText
                                                                }
                                                            >
                                                                Verification Code is Correct.
                                                            </Text>
                                                            <Text
                                                                style={
                                                                    {
                                                                        ...GlobalStyles
                                                                            .textLines
                                                                            .defaultText,
                                                                        fontSize: width / 27,
                                                                        paddingBottom: 10
                                                                    }
                                                                }
                                                            >
                                                                Please reset your password.
                                                            </Text>
                                                            <Input
                                                                placeholder="New Password"
                                                                onChangeText={handleChange(
                                                                    'password'
                                                                )}
                                                                onBlur={handleBlur(
                                                                    'password'
                                                                )}
                                                                value={values.password}
                                                                keyboardType={'default'}
                                                                error={errors.password}
                                                                name="password"
                                                                type="password"
                                                                secureTextEntry={true}
                                                            />
                                                            <Input
                                                                placeholder="Confirm Password"
                                                                onChangeText={handleChange(
                                                                    'password_confirm'
                                                                )}
                                                                onBlur={handleBlur(
                                                                    'password_confirm'
                                                                )}
                                                                value={values.password_confirm}
                                                                keyboardType={'default'}
                                                                error={errors.password_confirm}
                                                                name="password_confirm"
                                                                type="password_confirm"
                                                                secureTextEntry={true}
                                                            />
                                                            <CustomButton
                                                                title={'Submit Password'}
                                                                onPress={handleSubmit}
                                                                containerStyle={{
                                                                    width: '100%',
                                                                    height: 50,
                                                                    marginTop: 10
                                                                }}
                                                                textStyle={{ color: '#fff' }}
                                                            />
                                                        </>
                                                    )
                                                )}
                                            </View>
                                        )}
                                    </Formik>
                                </View>
                            </TouchableWithoutFeedback>
                        </ScrollView>
                    </KeyboardAvoidingView>
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
    resetContainer: {
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
    resetBtn: {
        ...Buttons.greenBtn,
        width: 238,
        marginTop: 30,
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

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(SecurityActions(), dispatch),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(props => <ForgotPassScreen {...props} />);
