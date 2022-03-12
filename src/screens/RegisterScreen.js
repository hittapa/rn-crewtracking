import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    ScrollView,
    SafeAreaView,
    ImageBackground,
} from 'react-native';
import * as GlobalStyles from '../styles/styles';
import RegisterWizard from '../components/RegisterForm/RegisterWizard';
import { Entypo } from '@expo/vector-icons';
import { HeaderLeft } from '../components/Header/HeaderLeft';

function RegisterScreen({ navigation }) {
    return (
        <View style={GlobalStyles.FlexContainer}>
            <ImageBackground
                source={require('../assets/images/app_bg.jpg')}
                style={styles.bgImage}
            >
                <SafeAreaView style={GlobalStyles.safeView}>
                    <View style={[{ height: 50, top: 0, left: 0, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }]}>
                        <HeaderLeft onPress={() => navigation.goBack()}>
                            <View
                                style={{
                                    borderRadius: 50,
                                    alignItems: 'center',
                                }}
                            >
                                <Entypo
                                    name="chevron-thin-left"
                                    size={28}
                                    style={{ margin: 10 }}
                                    color={'#fff'}
                                />
                            </View>
                        </HeaderLeft>
                    </View>
                    <KeyboardAvoidingView
                        behavior={
                            Platform.OS === 'ios' ? 'position' : 'height'
                        }
                        // style={styles.container}
                    >
                        <ScrollView style={{ marginBottom: 0 }} showsVerticalScrollIndicator={false}>
                            <TouchableWithoutFeedback
                                onPress={Keyboard.dismiss}
                            >
                                <View style={styles.container}>
                                    <Image
                                        source={require('../assets/images/crewlog-logo.png')}
                                        resizeMode={'contain'}
                                        style={GlobalStyles.Logo236}
                                    />
                                    <RegisterWizard />
                                </View>
                            </TouchableWithoutFeedback>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...GlobalStyles.FlexContainer,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bgImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
});

export default RegisterScreen;
