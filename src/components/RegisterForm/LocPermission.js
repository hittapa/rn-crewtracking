import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Modal,
    TouchableHighlight,
    FlatList,
    Image
} from 'react-native';
import * as GlobalStyles from '../../styles/styles';
import { ModalStyles, Colors, Buttons } from '../../styles/index';
import { AntDesign, Feather, FontAwesome5 } from '@expo/vector-icons';
import CustomButton from '../CustomButton';
import { width } from '../Carousel/Carousel';


const LocPermission = formikProps => {
    const { setFieldValue, values } = formikProps;

    return (
        <View style={styles.subscriptionContainer}>
            <Image source={require("../../assets/images/location-permission.png")} style={{width: 119, height: 112, resizeMode: 'contain', marginVertical: 20}} />
            <Text style={styles.headerText1}>Location Settings</Text>
            <Text style={styles.headerText2}>2 Steps REQUIRED.. Select Allow While Using App and then update your settings for Crewlog to Always</Text>
            <Text style={styles.description}>
                This allows us to detect your movement on the water, so we can help remind you to log your trip before it gets missed
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    subscriptionContainer: {
        flex: 1,
        alignItems: 'center',
        // height: 160
    },
    headerText1: {
        fontSize: width/21,
        letterSpacing: -0.3,
        color: Colors.colorGrey1,
        marginBottom: 3,
        textAlign: 'center',
        fontFamily: 'Roboto-Bold',
    },
    headerText2: {
        fontSize: width / 27,
        letterSpacing: -0.3,
        color: Colors.colorGrey1,
        marginBottom: 3,
        textAlign: 'center',
        fontFamily: 'Roboto-Regular',
    },
    description: {
        fontSize: width / 26,
        letterSpacing: -0.3,
        color: "#767676",
        marginBottom: 3,
        textAlign: 'center',
        fontFamily: 'Roboto-Thin',
        paddingVertical: 20
    },
});

export default LocPermission;
