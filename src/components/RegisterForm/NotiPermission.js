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


const NotiPermission = formikProps => {
    const { setFieldValue, values } = formikProps;

    return (
        <View style={styles.subscriptionContainer}>
            <Image source={require("../../assets/images/pushnoti-permission.png")} style={{width: 119, height: 112, resizeMode: 'contain', marginVertical: 20}} />
            <Text style={styles.description}>
                This allows us to send you a reminder to start or end a trip when we detect you moving or not out on the water.
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
        lineHeight: 23.44,
        letterSpacing: -0.3,
        color: Colors.colorGrey1,
        marginBottom: 3,
        textAlign: 'center',
        fontFamily: 'Roboto-Bold',
    },
    headerText2: {
        fontSize: width / 23,
        lineHeight: 21.09,
        letterSpacing: -0.3,
        color: Colors.colorGrey1,
        marginBottom: 3,
        textAlign: 'center',
        fontFamily: 'Roboto-Regular',
    },
    description: {
        fontSize: width / 26,
        letterSpacing: -0.3,
        color: "#333333",
        marginBottom: 3,
        textAlign: 'center',
        fontFamily: 'Roboto-Thin',
        paddingVertical: 20
    },
});

export default NotiPermission;
