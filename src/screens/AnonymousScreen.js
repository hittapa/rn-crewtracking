import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
    ForgotPassScreen,
    LoginScreen,
    RegisterScreen,
    WelcomeScreen,
} from './index';
import { Colors } from '../styles/index';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import { connect } from 'react-redux';

const Stack = createStackNavigator();

function AnonymousScreen(props) {

    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setLoading(props.loading)
    }, [props, mounted])

    return (
        <View style={{ flex: 1 }}>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerTransparent: true,
                        headerTitle: null,
                        headerShown: false,
                        headerTintColor: Colors.colorWhite,
                    }}
                    initialRouteName="Home"
                >
                    <Stack.Screen name="Home" component={WelcomeScreen} />
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen
                        name="RegisterScreen"
                        component={RegisterScreen}
                    />
                    <Stack.Screen
                        name="ForgotPassScreen"
                        component={ForgotPassScreen}
                    />
                </Stack.Navigator>
            </NavigationContainer>
            {
                loading && (
                    <View style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#00000055'
                    }}>
                        <ActivityIndicator size={'large'} color={'#ffffff'} />
                    </View>
                )
            }
        </View>
    );
}

const mapStateToProps = state => {
    return { loading: state.APP.loading };
}


export default connect(mapStateToProps, {})(AnonymousScreen)