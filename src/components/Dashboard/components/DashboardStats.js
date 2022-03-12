import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../styles/index';
import * as GlobalStyles from '../../../styles/styles';
import { width } from '../../Carousel/Carousel';

const DashboardStats = props => {
    const {
        trips = 0,
        totalMiles = 0,
        daysUnderway = 0,
        minimizedStats = false,
    } = props;

    return (
        <View
            style={[
                styles.container,
                {
                    marginTop: 20,
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                },
            ]}
        >
            <View
                style={{
                    flex: 1,
                    height: minimizedStats ? 30 : 60,
                    marginBottom: 16,
                    alignItems: 'center',
                    borderRightWidth: 2,
                    borderRightColor: 'rgba(255, 255, 255, 0.3)',
                }}
            >
                <Text
                    style={[
                        styles.counterText,
                        {
                            fontSize: minimizedStats ? 16 : 26,
                        },
                    ]}
                >
                    {trips}
                </Text>
                <Text style={styles.counterSubText}>TRIPS</Text>
            </View>
            <View
                style={{
                    flex: 1,
                    height: minimizedStats ? 30 : 60,
                    marginBottom: 16,
                    alignItems: 'center',
                    borderRightWidth: 2,
                    borderRightColor: 'rgba(255, 255, 255, 0.3)',
                }}
            >
                <Text
                    style={[
                        styles.counterText,
                        {
                            fontSize: minimizedStats ? 16 : 26,
                        },
                    ]}
                >
                    {totalMiles}
                </Text>
                <Text style={styles.counterSubText}>TOTAL NMILES</Text>
            </View>
            <View
                style={{
                    flex: 1,
                    height: minimizedStats ? 30 : 60,
                    marginBottom: 16,
                    alignItems: 'center',
                }}
            >
                <Text
                    style={[
                        styles.counterText,
                        {
                            fontSize: minimizedStats ? 16 : 26,
                        },
                    ]}
                >
                    {daysUnderway}
                </Text>
                <Text style={styles.counterSubText}>DAYS UNDERWAY</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // ...GlobalStyles.FlexContainer,
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterText: {
        fontFamily: 'SourceSansPro-SemiBold',
        color: Colors.colorWhite,
        textAlign: 'center',
    },
    counterSubText: {
        fontFamily: 'SourceSansPro-SemiBold',
        fontSize: width / 36,
        color: Colors.colorWhite,
        marginTop: 3,
        textAlign: 'center',
    },
});

export default DashboardStats;
