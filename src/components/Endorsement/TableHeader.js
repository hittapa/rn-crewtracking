import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { width } from "../Carousel/Carousel";

function TableHeader(props) {
    
    return (
        <View style={[styles.tableHeaderContainer, props.containerStyle && {...props.containerStyle}]}>
            <Text style={[styles.tableHeaderText, props.textStyle && {...props.textStyle}]}>
                {props.children}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    tableHeaderContainer: {
        justifyContent: 'flex-start',
        padding: 16,
        borderWidth: 1,
        borderColor: '#c4c4c4',
        borderBottomWidth: 0
    },
    tableHeaderText: {
        color: '#333333',
        fontFamily: 'Roboto-Bold',
        fontWeight: '700',
        fontSize: width / 21,
        lineHeight: 23.44,
        letterSpacing: -0.3
    },
});

export default TableHeader;