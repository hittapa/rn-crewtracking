import React from 'react';
import { View, Text } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export function HeaderTitle(props) {
    return (
        <>
            <TouchableWithoutFeedback
                onPress={props.onPress}
            >
                <View style={{ paddingHorizontal: 0, paddingVertical: 0 }}>
                    {props.children}
                </View>
            </TouchableWithoutFeedback>
        </>
    )
}