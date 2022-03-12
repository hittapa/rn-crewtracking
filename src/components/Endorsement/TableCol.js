import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { width } from "../Carousel/Carousel";

function TableCol(props) {

    return (
        <View style={[styles.tableCol, props.containerStyle && { ...props.containerStyle }]}>
            {
                props.edit ? props.children
                    : (
                        <Text style={[props.value ? styles.tableColTextValue : styles.textStyle, props.textStyle && { ...props.textStyle }]}>
                            {props.children}
                        </Text>
                    )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    tableCol: {
        padding: 10,
        justifyContent: 'flex-start',
        borderRightWidth: 1,
        borderRightColor: '#c4c4c4',
        borderBottomWidth: 1,
        borderBottomColor: '#c4c4c4',
        width: '50%',
        justifyContent: 'center'
    },
    textStyle: {
        color: '#a0a0a0',
        fontFamily: 'Roboto-Thin',
        fontWeight: '300',
        fontSize: width / 23,
        lineHeight: 23.44,
        letterSpacing: -0.3
    },
    tableColTextValue: {
        color: '#333333',
        fontFamily: 'Roboto-Thin',
        fontWeight: '400',
        fontSize: width / 23,
        lineHeight: 23.44,
        letterSpacing: -0.3
    },
});

export default TableCol;