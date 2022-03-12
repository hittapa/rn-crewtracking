import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../styles/index';
import { FontAwesome5 } from '@expo/vector-icons';

export const TripFooterContainer = () => {
    return (
        <View style={styles.footerContainer}>
            <View
                style={{
                    flex: 1,
                    width: 30,
                }}
            >
                <FontAwesome5
                    name="map-marker-alt"
                    size={26}
                    color={Colors.colorGrey4}
                    style={{
                        alignSelf: 'center',
                    }}
                />
            </View>
            <View
                style={{
                    flex: 1,
                    width: 30,
                }}
            >
                <FontAwesome5
                    name="book"
                    size={26}
                    color={Colors.colorGrey4}
                    style={{
                        alignSelf: 'center',
                    }}
                />
            </View>
            <View
                style={{
                    flex: 1,
                    width: 30,
                }}
            >
                <FontAwesome5
                    name="trash-alt"
                    size={26}
                    color={Colors.colorGrey4}
                    style={{
                        alignSelf: 'center',
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    footerContainer: {
        width: 350,
        position: 'absolute',
        left: -20,
        bottom: -80,
        backgroundColor: Colors.colorGrey7,
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        flexGrow: 1,
        flexDirection: 'row',
    },
});

export default TripFooterContainer;
