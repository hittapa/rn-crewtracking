import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { Formik, yupToFormErrors } from 'formik';
import * as yup from 'yup';
import Step1 from './Step1';
import Step2 from './Step2';
import * as GlobalStyles from '../../styles/styles';
import { Buttons } from '../../styles/index';
import { bindActionCreators } from 'redux';
import SecurityActions from '../../actions/SecurityActions';
import { connect } from 'react-redux';
import { isEmpty, forEach, first, clone, get } from 'lodash';
import appConstants from '../../constants/app';
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
                <Step2
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

const AddVesselStep = ({ actions, loading }) => {
    const [steps, setSteps] = useState([1, 2]);

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
        // plan: yup
        //     .string()
        //     .required('Please select a plan.')
        //     .nullable(true)
        //     .when('$step', (step, schema) => {
        //         return true;
        //     }),
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
            setSteps(value);
        }
        setSteps(value);
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

    return (
        <>
            <Text style={GlobalStyles.headLines.headLine1}>
                Add vessel wizard WIP!!!
            </Text>
        </>
    );
};

const styles = StyleSheet.create({
    signInBtn: {
        width: 238,
        ...Buttons.greenBtn,
    },
    headLine1: {
        fontSize: width/20.5,
        color: '#FFF',
        marginTop: 10,
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    registerContainer: {
        width: 350,
        height: 'auto',
        borderRadius: 20,
        padding: 20,
        marginTop: 30,
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
)(props => <AddVesselStep {...props} />);
