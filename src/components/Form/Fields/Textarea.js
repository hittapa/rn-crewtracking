import React from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import * as GlobalStyles from '../../../styles/styles';
import { Colors, Inputs } from '../../../styles/index';

export const Textarea = ({ label, icon, numberOfLines = 4, placeholder='', ...props }) => {
    const styles = StyleSheet.create({
        textarea: {
            ...Inputs.defaultTextarea,
            width: '100%',
            color: Colors.colorGrey3,
            textTransform: 'lowercase',
            height: props.height,
            backgroundColor: Colors.colorWhite,
        },
    });

    return (
        <>
            {label ? (
                <>
                    <Text>{label}</Text>
                </>
            ) : null}
            <TextInput
                {...props}
                icon={icon}
                style={styles.textarea}
                autoCapitalize="none"
                autoCorrect={false}
                numberOfLines={numberOfLines}
                multiline={true}
                placeholder={placeholder}
            />
            <Text style={GlobalStyles.errorMessage}>{props.error}</Text>
        </>
    );
};
