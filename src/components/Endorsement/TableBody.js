import React from "react";
import { StyleSheet, Text, View } from "react-native";

function TableBody(props) {
    
    return (
        <View style={[styles.tableBody, props.containerStyle && {...props.containerStyle}]}>
            {props.children}
        </View>
    )
}

const styles = StyleSheet.create({
    tableBody: {
        borderTopWidth: 1,
        borderTopColor: '#c4c4c4',
        borderLeftWidth: 1,
        borderLeftColor: '#c4c4c4'
    },
});

export default TableBody;