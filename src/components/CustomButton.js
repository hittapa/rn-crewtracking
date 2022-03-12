import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { width } from './Carousel/Carousel';

const CustomButton = ({
    title,
    onPress=null,
    containerStyle = {},
    textStyle = {},
    disable=null,
}) => {
    return (
        <TouchableOpacity disabled={disable} style={[{ ...styles.containerStyle }, containerStyle]} onPress={() => onPress()}>
            {
                typeof title == 'string' ? (
                    <Text style={[{...styles.textStyle}, textStyle]}>{title ? title : 'Default Button'}</Text>
                ) : (
                    title
                )
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    containerStyle: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#7FC542ee',
        borderWidth: 1.5,
        borderColor: '#4EA801',
        borderRadius: 10
    },
    textStyle: {
        fontSize: width / 26,
        lineHeight: 27,
        textAlign: 'center',
        fontFamily: 'Roboto-Bold',
        fontWeight: '700'
    }
})

export default CustomButton;