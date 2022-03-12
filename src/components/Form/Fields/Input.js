import React from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import * as GlobalStyles from '../../../styles/styles';
import { Colors, Inputs } from '../../../styles/index';

export const Input = ({ label, icon, size, textAlign = 'left', autoCapitalize="none", ...props }) => {
    const styles = StyleSheet.create({
        textInput: {
            ...Inputs.defaultInput,
            width: '100%',
            color: Colors.colorGrey1,
            textTransform: 'lowercase',
            height: size === 'small' ? 40 : 55,
            padding: size === 'small' ? 7 : 15,
            textAlign: textAlign,
            ...props.styles,
        },
        labelInput: {
            ...GlobalStyles.textLines.defaultText2,
            color: Colors.colorGrey1,
            fontSize: size === 'small' ? 12 : 14,
        },
    });

    return (
        <>
            {label ? <Text style={styles.labelInput}>{label}</Text> : null}
            <TextInput
                {...props}
                icon={icon}
                style={styles.textInput}
                autoCapitalize={autoCapitalize}
                autoCorrect={false}
                placeholderTextColor={Colors.colorGrey3}
            />
            <Text style={GlobalStyles.errorMessage}>{props.error}</Text>
        </>
    );
};

