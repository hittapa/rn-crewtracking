import React from "react";
import { StyleSheet, Text, View } from "react-native";

function TableRow(props) {
    
    return (
        <View style={[styles.tableRow, props.containerStyle && {...props.containerStyle}]}>
            {props.children}
        </View>
    )
}

const styles = StyleSheet.create({
    tableRow: {
        flex: 1,
        flexDirection: 'row',
        width: '100%'
    },
});

export default TableRow;