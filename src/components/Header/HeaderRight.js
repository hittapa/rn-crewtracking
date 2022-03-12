import React from 'react';
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export function HeaderRight(props) {
    return (
        <>
            <TouchableOpacity
                onPress={props.onPress}
            >
                <View style={{ paddingHorizontal: 0, paddingVertical: 0 }}>
                    {props.children}
                </View>
            </TouchableOpacity>
        </>
    )
}