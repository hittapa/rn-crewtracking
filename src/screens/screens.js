import React from 'react';
import Animated from 'react-native-reanimated';
import { FontAwesome5 } from '@expo/vector-icons';
import {
    DashboardScreen,
    AddVesselScreen,
    AccountSettingsScreen
} from './index';
import { CardStyleInterpolators, createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import VesselsScreen from './VesselsScreen';
import VesselDetailScreen from './VesselDetail/index';
import ServiceDetailScreen from './VesselDetail/ServiceDetailScreen';
import { Easing } from 'react-native';
import PushNotification from './AccountSettings/PushNotification';
import SignedIn from './AccountSettings/SignedIn';
import EmailCommunication from './AccountSettings/EmailCommunication';
import ServiceSummary from './ServiceSummary';
import EditVesselBasic from './VesselDetail/EditVesselBasic';
import TrackingScreen from './TrackingScreen';
import TripMapView from '../components/Dashboard/components/TripMapView';
import UpdateAccount from './AccountSettings/UpdateAccount';
import TripDetermine from './Troubleshooting/TripDetermine';
import BestPractices from './Troubleshooting/BestPractices';
import Privacy from './AccountSettings/Privacy';
import Terms from './AccountSettings/Terms';
import Subscription from './AccountSettings/Subscription';
import EndorseStep1 from './Endorsement/Step1';
import EndorseStep2 from './Endorsement/Step2';
import EndorseStep3 from './Endorsement/Step3';
import EndorseStep4 from './Endorsement/Step4';
import SeaTimeTestimonial from './Endorsement/SeaTimeTestimonial';
import DischargeCertificate from './Endorsement/DischargeCertificate';
import SmallVesselFormUSCG from './Endorsement/SmallVesselFormUSCG';
import Endorsement from './Endorsement';
import EndorsementDetails from './Endorsement/details'
// import ViewPrintform from './Endorsement/ViewPrintform';

const Stack = createStackNavigator();

const config = {
    animation: 'spring',
    config: {
        stiffness: 1000,
        damping: 50,
        mass: 3,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
    },
};

const closeConfig = {
    animation: 'timing',
    config: {
        duration: 500,
        easing: Easing.linear
    },
};

export const Screens = ({ navigation, style }) => {
    return (
        <Animated.View
            style={[
                { flex: 1, borderColor: 'transparent', overflow: 'hidden' },
                style,
            ]}
        >
            <Stack.Navigator
                screenOptions={{
                    headerTransparent: true,
                    headerTitle: null,
                    headerShown: false,
                    gestureEnabled: true,
                    gestureDirection: 'horizontal',
                    // transitionSpec: {
                    //     open: config,
                    //     close: closeConfig
                    // },
                    cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid
                }}
                headerMode='float'
                initialRouteName="Dashboard"
            >
                <Stack.Screen
                    name="Dashboard"
                    component={DashboardScreen}
                    options={{
                        gestureEnabled: false
                    }}
                />
                <Stack.Screen
                    name="AddVessel"
                    component={AddVesselScreen}
                    options={{
                        gestureEnabled: false
                    }}
                />
                <Stack.Screen
                    name="Vessels"
                    component={VesselsScreen}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }}
                />
                <Stack.Screen
                    name="VesselDetail"
                    component={VesselDetailScreen}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }}
                />
                <Stack.Screen
                    name="ServiceDetail"
                    component={ServiceDetailScreen}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }}
                />
                <Stack.Screen
                    name="Settings"
                    component={AccountSettingsScreen}
                />
                <Stack.Screen
                    name="SignedIn"
                    component={SignedIn}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }}
                />
                <Stack.Screen
                    name="Push Notifications"
                    component={PushNotification}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }}
                />
                <Stack.Screen
                    name="Email Communications"
                    component={EmailCommunication}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }}
                />
                <Stack.Screen
                    name="ServiceSummary"
                    component={ServiceSummary}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }}
                />
                <Stack.Screen
                    name="EditVesselBasic"
                    component={EditVesselBasic}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS
                    }}
                />
                <Stack.Screen
                    name="Tracking"
                    component={TrackingScreen}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }}
                />
                <Stack.Screen
                    name="TripMapView"
                    component={TripMapView}
                    options={{
                        gestureEnabled: true,
                        cardOverlayEnabled: true,
                        ...TransitionPresets.ModalPresentationIOS
                    }}
                />
                <Stack.Screen
                    name="UpdateAccount"
                    component={UpdateAccount}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }}
                />
                <Stack.Screen
                    name="TripDetermine"
                    component={TripDetermine}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }}
                />
                <Stack.Screen
                    name="BestPractices"
                    component={BestPractices}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }}
                />
                <Stack.Screen
                    name="Subscription"
                    component={Subscription}
                    options={{
                        cqqardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }}
                />
                <Stack.Screen
                    name="Privacy"
                    component={Privacy}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }}
                />
                <Stack.Screen
                    name="Terms"
                    component={Terms}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }}
                />
                <Stack.Screen
                    name="EndorseStart"
                    component={EndorseStep1}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }}
                />
                <Stack.Screen
                    name="EndorseStep2"
                    component={EndorseStep2}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }}
                />
                <Stack.Screen
                    name="EndorseStep3"
                    component={EndorseStep3}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }}
                />
                <Stack.Screen
                    name="EndorseStep4"
                    component={EndorseStep4}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }}
                />
                <Stack.Screen
                    name="SeaTimeTestimonial"
                    component={SeaTimeTestimonial}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }}
                />
                <Stack.Screen
                    name="DischargeCertificate"
                    component={DischargeCertificate}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }}
                />
                <Stack.Screen
                    name="SmallVesselFormUSCG"
                    component={SmallVesselFormUSCG}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }}
                />
                <Stack.Screen
                    name="Endorsement"
                    component={Endorsement}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }}
                />
                <Stack.Screen
                    name="EndorsementDetails"
                    component={EndorsementDetails}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }}
                />
                {/* <Stack.Screen
                    name="ViewPrintform"
                    component={ViewPrintform}
                    options={{
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                    }}
                /> */}
            </Stack.Navigator>
        </Animated.View>
    );
};
