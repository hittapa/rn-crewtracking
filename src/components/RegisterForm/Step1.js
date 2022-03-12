import React from 'react';
import { Input } from '../../components/Form/Fields/Input';

const Step1 = formikProps => {
    const { handleChange, handleBlur, values, errors } = formikProps;

    return (
        <>
            <Input
                placeholder="First name"
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                value={values.firstName}
                error={errors.firstName}
                name="firstName"
                type="text"
                autoCapitalize={'sentences'}
            />
            <Input
                placeholder="Last name"
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                value={values.lastName}
                error={errors.lastName}
                name="lastName"
                type="text"
                autoCapitalize={'sentences'}
            />
            <Input
                placeholder="Email"
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
                keyboardType={'email-address'}
                error={errors == 'Request failed with status code 422' ? "This email was already used. Please try again with another email" : ''}
                name="username"
                type="email"
            />
            <Input
                placeholder="Password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                error={errors.password}
                name="password"
                type="password"
                secureTextEntry={true}
            />
        </>
    );
};

export default Step1;
