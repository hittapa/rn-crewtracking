import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../styles';
import { width } from '../Carousel/Carousel';

export const Switch = (props) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={props.type == 'merchant' ? styles.selected : styles.unSelected} onPress={() => props.changeType('merchant')}>
                <Text style={styles.text}>Merchant</Text>
            </TouchableOpacity>
            <TouchableOpacity style={props.type == 'yachting' ? styles.selected : styles.unSelected} onPress={() => props.changeType('yachting')}>
                <Text style={styles.text}>Yachting</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.colorGrey5,
        borderRadius: 9,
        height: 32,
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    selected: {
        backgroundColor: '#ffffff',
        borderWidth: .5,
        borderColor: 'rgba(0,0,0,0.4)',
        borderRadius: 7,
        height: 28,
        width: '49.5%',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowColor: 'rgba(0,0,0,0.4)',
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unSelected: {
        height: 28,
        width: '49.5%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: width/27,
        lineHeight: 20,
        letterSpacing: -0.24,
        fontWeight: '500',
        fontFamily: 'Roboto-Regular'
    }
})