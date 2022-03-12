import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Animated from 'react-native-reanimated';
import { Screens } from '../screens/screens';
import { Colors } from '../styles/index';
import { View, Text } from 'react-native';
import DrawerContentContainer from '../components/DrawerContent';
import moment from 'moment';
import * as GlobalStyles from '../styles/styles';
import { get } from 'lodash';
import { bindActionCreators } from 'redux';
import SecurityActions from '../actions/SecurityActions';
import { connect } from 'react-redux';
import appConstants from '../constants/app';
import { width } from './Carousel/Carousel';

const Drawer = createDrawerNavigator();

function MyDrawer(props) {
    const [progress, setProgress] = React.useState(new Animated.Value(0));
    const [user, setUser] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [logbookNo, setLogbookNo] = useState(null);

    useEffect(() => {
        setUser(props.user);
        let createdTime = new Date(props.user?.created_at);
        setLogbookNo(createdTime.getTime() / 1000)
    }, [props])
    const scale = Animated.interpolate(progress, {
        inputRange: [0, 1],
        outputRange: [1, 0.8],
    });

    const borderRadius = Animated.interpolate(progress, {
        inputRange: [0, 1],
        outputRange: [1, 10],
    });

    const screensStyles = { borderRadius, transform: [{ scale }] };

    return (
        <Drawer.Navigator
            drawerType="slide"
            overlayColor="transparent"
            drawerContentStyle={{
                activeBackgroundColor: 'transparent',
                activeTintColor: 'green',
                inactiveTintColor: 'green',
            }}
            sceneContentStyle={{
                backgroundColor: 'transparent',
                borderColor: 'transparent',
            }}
            drawerStyle={{
                width: '80%',
                elevation: 50,
                shadowBox: { width: 50, height: 5 },
                shadowColor: '#000',
                shadowOpacity: .3
            }}
            contentContainerStyle={{
                flex: 1,
            }}
            drawerContent={props => {
                return (
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <DrawerContentContainer {...props} />
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                alignSelf: 'center',
                                width: '100%',
                                height: 141
                            }}
                        >
                            <View
                                style={{
                                    alignSelf: 'center',
                                    paddingVertical: 16,
                                    borderBottomWidth: .5,
                                    borderBottomColor: Colors.colorGrey3,
                                    width: '100%'
                                }}
                            >
                                <Text
                                    style={[
                                        GlobalStyles.textLines.defaultText2,
                                        {
                                            marginTop: 22,
                                            color: '#616667',
                                            textAlign: 'center',
                                            fontFamily: 'Roboto-Regular',
                                            fontSize: width / 28,
                                            fontWeight: '500'
                                        },
                                    ]}
                                >
                                    {user?.firstName}{' '}
                                    {user?.lastName}
                                </Text>
                                <Text
                                    style={[
                                        GlobalStyles.textLines.defaultText4,
                                        {
                                            marginTop: 3,
                                            opacity: 0.7,
                                            color: '#afaeae',
                                            textAlign: 'center',
                                            fontFamily: 'Roboto-Regular',
                                            fontSize: width / 28,
                                        },
                                    ]}
                                >
                                    Logbook no: {logbookNo}
                                </Text>
                            </View>
                            <Text
                                style={[
                                    GlobalStyles.textLines.defaultText3,
                                    {
                                        color: '#afaeae',
                                        textAlign: 'center',
                                        paddingVertical: 16
                                    },
                                ]}
                            >
                                {moment().utc().year()}&copy; Crewlog
                            </Text>
                        </View>
                    </View>
                );
            }}
        >
            <Drawer.Screen name="Screens">
                {props => <Screens {...props} style={screensStyles} />}
            </Drawer.Screen>
        </Drawer.Navigator>
    );
}

const mapStateToProps = state => {
    const user = get(
        state,
        `${appConstants.STATE_KEY}.${appConstants.REDUCER_USER_KEY}`
    );
    return { user };
};

const mapDispatchToProps = dispatch => {
    return {
        securityActions: bindActionCreators(SecurityActions(), dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyDrawer);
