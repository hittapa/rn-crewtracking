import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
} from 'react-native';
import { Formik, yupToFormErrors } from 'formik';
import * as yup from 'yup';
import Step1 from './Step1';
import LocPermission from './LocPermission';
import * as GlobalStyles from '../../styles/styles';
import { Buttons } from '../../styles/index';
import { bindActionCreators } from 'redux';
import SecurityActions from '../../actions/SecurityActions';
import { connect } from 'react-redux';
import { isEmpty, forEach, first, clone, get } from 'lodash';
import appConstants from '../../constants/app';
import CustomButton from '../CustomButton';
import NotiPermission from './NotiPermission';
import Step3 from './Step3';
import Step2 from './Step2';
import { checkNotifications, requestNotifications } from 'react-native-permissions';
import * as Location from 'expo-location';
import { width } from '../Carousel/Carousel';

const renderStep = (
    step,
    handleChange,
    setFieldValue,
    handleBlur,
    handleSubmit,
    values,
    errors
) => {
    switch (step) {
        case 1:
            return (
                <Step1
                    values={values}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                />
            );
        case 2:
            return (
                <LocPermission
                    values={values}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                />
            );
        case 3:
            return (
                <NotiPermission
                    values={values}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                />
            );
        case 4:
            return (
                <Step2
                    values={values}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                />
            );
        case 5:
            return (
                <Step3
                    values={values}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                />
            );
        default:
            return (
                <Step1
                    values={values}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                />
            );
    }
};

const renderTitle = (step) => {
    switch (step) {
        case 5:
            return (
                <Text style={GlobalStyles.headLines.headLine1}>
                    Create your Crewlog account
                </Text>
            )
        case 4:
            return null;
        case 3:
            return null;
        case 2:
            return (
                <Text style={GlobalStyles.headLines.headLine1}>
                    Select your subscription
                </Text>
            );
        case 1:
            return (
                <Text style={GlobalStyles.headLines.headLine1}>
                    Enter some helpful details
                </Text>
            );
        default:
            break;
    }
}

const RegisterStep = ({ actions, loading }) => {
    const [steps, setSteps] = useState([1, 2, 3, 4, 5]);

    const formInitialValues = [
        {
            username: '',
            password: '',
            firstName: '',
            lastName: '',
        },
        {
            plan: '',
            isUsCitizen: false,
        },
    ];

    const validationSchema = yup.object({
        username: yup
            .string()
            .required('Email is required.')
            .nullable(true)
            .when('$step', (step, schema) => {
                return step === 1
                    ? schema.min(1, 'Please add your email').email()
                    : schema;
            }),
        password: yup
            .string()
            .required('Password is required.')
            .nullable(true)
            .when('$step', (step, schema) => {
                return step === 1
                    ? schema.min(
                        8,
                        'Password is too short - should be 8 chars minimum.'
                    )
                    : schema;
            }),
    });

    /**
     * 
     * @returns Validate birthDate and nationality
     */
    const validationBirthDateNationality = yup.object({
        birthDate: yup
            .string()
            .required('Please add your birth date')
            .nullable(true)
            .when('$step', (step, schema) => {
                return schema.min(10, 'Please add your birth date');
            }),
    });

    /**
     * Get the initial values of the form for all steps
     * @return {{}}
     */
    const buildInitialValues = () => {
        let initialValues = {};
        forEach(formInitialValues, function (value) {
            initialValues = Object.assign(initialValues, value);
        });
        return initialValues;
    };

    const handleStepChange = (value = []) => {
        if (!value.length) {
            value = clone(steps);
            value.splice(0, 1);
            console.log('Step', JSON.stringify(value))
            setSteps(value);
        }
        // setSteps(value);
    };

    /**
     * Get the steps with errors
     * @param errors
     * @return {number}
     */
    const getStepsByErrors = (errors = {}) => {
        const stepsByError = [];
        forEach(formInitialValues, function (value, key) {
            forEach(Object.keys(errors), function (errorValue) {
                const step = key + 1;
                if (
                    stepsByError.indexOf(step) === -1 &&
                    Object.keys(value).includes(errorValue)
                ) {
                    stepsByError.push(step);
                }
            });
        });
        return stepsByError;
    };

    const renderButton = (
        step,
        handleSubmit,
        setFieldValue
    ) => {
        switch (step) {
            case 2:
                return (
                    <CustomButton
                        title={'Set up location'}
                        onPress={async () => {
                            let { status } = await Location.requestPermissionsAsync();
                            console.log(status);
                            if (status !== 'granted') {
                                setFieldValue('trip_detection', false);
                            } else {
                                setFieldValue('trip_detection', true);
                            }
                            handleStepChange();
                        }}
                        containerStyle={{
                            width: '100%',
                            height: 50,
                            marginTop: 10
                        }}
                        textStyle={{ color: '#fff' }}
                    />
                )

            case 3:
                return (
                    <>
                        <CustomButton
                            title={'Allow'}
                            onPress={async () => {
                                setFieldValue('push_notification', false);
                                const { status } = await checkNotifications();
                                if (status != 'granted') {
                                    const { status } = await requestNotifications(['alert', 'sound']);
                                    if (status === 'granted') {
                                        setFieldValue('push_notification', true);
                                    }
                                }
                                handleStepChange();
                            }}
                            containerStyle={{
                                width: '100%',
                                height: 50,
                                marginTop: 10
                            }}
                            textStyle={{ color: '#fff' }}
                        />
                        <CustomButton
                            title={'Not now'}
                            onPress={() => {
                                setFieldValue('push_notification', false);
                                handleStepChange();
                            }}
                            containerStyle={{
                                width: '100%',
                                height: 50,
                                marginTop: 10,
                                backgroundColor: '#ffffffc7',
                                borderColor: '#e9e9e9'
                            }}
                            textStyle={{ color: '#767676' }}
                        />
                    </>
                )

            case 4:
                return (
                    <>
                        <CustomButton
                            title={'Next'}
                            onPress={handleSubmit}
                            containerStyle={{
                                width: '100%',
                                height: 50,
                                marginTop: 10
                            }}
                            textStyle={{ color: '#fff' }}
                        />
                        <Text style={{
                            paddingTop: 10,
                            fontSize: width / 33,
                            color: "#767676",
                            fontFamily: 'Roboto-Italic',
                            fontStyle: "italic",
                        }}>
                            {"The Crewlog app is a deductible business expense"}
                        </Text>
                    </>
                )

            case 5:
                return (
                    <CustomButton
                        title={'Register'}
                        onPress={handleSubmit}
                        containerStyle={{
                            width: '100%',
                            height: 50,
                            marginTop: 10
                        }}
                        textStyle={{ color: '#fff' }}
                    />
                )

            default:
                return (
                    <CustomButton
                        title={'Next'}
                        onPress={handleSubmit}
                        containerStyle={{
                            width: '100%',
                            height: 50,
                            marginTop: 10
                        }}
                        textStyle={{ color: '#fff' }}
                    />
                )
        }
    }

    return (
        <>
            {renderTitle(steps.length)}
            <View style={styles.registerContainer}>
                <Formik
                    initialValues={buildInitialValues()}
                    validate={(values, props) => {
                        if (steps.length == 5) {
                            return validationSchema
                                .validate(values, {
                                    abortEarly: false,
                                    context: {
                                        step: first(steps),
                                    },
                                })
                                .then(values => { })
                                .catch(err => {
                                    return new Promise(function (resolve) {
                                        resolve(yupToFormErrors(err));
                                    });
                                });
                        }
                        if (steps.length == 1) {
                            return validationBirthDateNationality
                                .validate(values, {
                                    abortEarly: false,
                                    context: {
                                        step: first(steps),
                                    },
                                })
                                .then(values => { })
                                .catch(err => {
                                    return new Promise(function (resolve) {
                                        resolve(yupToFormErrors(err));
                                    });
                                });
                        }
                    }}
                    validateOnBlur={false}
                    validateOnChange={false}
                    onSubmit={(values, formikBag, resetForm) => {
                        if (steps.length === 1) {
                            console.log('register values =================')
                            console.log(values)
                            actions.register(values).catch(e => {
                                if (!isEmpty(e)) {
                                    formikBag.setErrors(e);
                                    const stepsByErrors = getStepsByErrors(e);
                                    handleStepChange(stepsByErrors);
                                }
                            });
                        } else if (steps.length === 2) {
                            if (values.plan === undefined || values.plan == null) {
                                Alert.alert('Warning!', 'Please select a plan');
                                return;
                            } else {
                                handleStepChange();
                            }
                            // } else if (steps.length === 3) {
                            //     console.log('Step', steps.length)
                            //     // if (values.plan === undefined || values.plan == null) {
                            //     //     Alert.alert('Warning!', 'Please select a plan');
                            //     //     return;
                            //     // } else {
                            //     handleStepChange();
                            //     // }
                            // } else if (steps.length === 4) {
                            //     console.log('Step', steps.length)
                            //     if (values.plan === undefined || values.plan == null) {
                            //         Alert.alert('Warning!', 'Please select a plan');
                            //         return;
                            //     } else {
                            //         handleStepChange();
                            //     }
                        } else {
                            delete values.plan;
                            actions
                                .registerStepOneCheck(values)
                                .then(user => handleStepChange())
                                .catch(e => {
                                    if (!isEmpty(e)) {
                                        formikBag.setErrors(e);
                                        resetForm()
                                    }
                                });
                        }
                    }}
                >
                    {({
                        handleChange,
                        setFieldValue,
                        handleSubmit,
                        handleBlur,
                        resetForm,
                        values,
                        errors,
                    }) => (
                        <>
                            {renderStep(
                                first(steps),
                                handleChange,
                                setFieldValue,
                                handleBlur,
                                handleSubmit,
                                values,
                                errors
                            )}
                            {
                                renderButton(
                                    first(steps),
                                    handleSubmit,
                                    setFieldValue
                                )
                            }
                        </>
                    )}
                </Formik>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    signInBtn: {
        width: 238,
        ...Buttons.greenBtn,
    },
    headLine1: {
        fontSize: width / 20.5,
        color: '#FFF',
        marginTop: 10,
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    registerContainer: {
        width: '90%',
        height: 'auto',
        borderRadius: 11,
        padding: 20,
        marginTop: 30,
        marginBottom: 80,
        alignItems: 'center',
        backgroundColor: '#FFF',
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
)(props => <RegisterStep {...props} />);
