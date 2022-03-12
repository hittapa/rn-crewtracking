import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    Text,
    View,
} from 'react-native';
// import { View } from 'moti';
import * as GlobalStyles from '../../../styles/styles';
import { Textarea } from '../../Form/Fields';
import { Buttons, Colors } from '../../../styles/index';
import { Formik } from 'formik';
import * as yup from 'yup';
import { width } from '../../Carousel/Carousel';

const validationSchema = yup.object({
    notes: yup.string(),
});

export const TripNotes = ({ tr, user, handleSubmit }) => {

    const [trip, setTrip] = useState(null);

    useEffect(() => {
        setTrip(tr)
    }, [tr, user]);

    const handleChange = (txt) => {
        let _trip = {...trip};
        _trip.trip_note = txt;
        setTrip(_trip);
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'position' : 'height'}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View
                    style={{
                        borderRadius: 5,
                        textAlign: 'center',
                        marginBottom: 20,
                        height: 342,
                        paddingHorizontal: 3
                    }}
                >
                    <View
                        style={[
                            styles.container,
                            {
                                paddingTop: 10,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                {
                                    fontSize: width/24.5,
                                    color: '#8e8e8e',
                                    fontFamily: 'Roboto-Regular',
                                    fontWeight: '400',
                                    // lineHeight: width/20,
                                    letterSpacing: -0.3,
                                    textTransform: 'uppercase'
                                },
                            ]}
                        >
                            Notes
                        </Text>
                    </View>
                    <Textarea
                        height={'70%'}
                        onChangeText={(txt) => handleChange(txt)}
                        value={trip?.trip_note ? trip.trip_note : ''}
                        name="notes"
                        type="notes"
                        style={{width: '100%'}}
                    />
                    <TouchableOpacity
                        onPress={() => handleSubmit(trip)}
                        style={styles.saveBtn}
                    >
                        <Text style={styles.greenBtnText}>
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};
const styles = StyleSheet.create({
    container: {
        ...GlobalStyles.FlexContainer,
        flex: 1,
    },
    saveBtn: {
        ...Buttons.noBgBtn,
        alignSelf: 'center',
        marginTop: 0,
        marginBottom: 0,
        height: 30,
        paddingTop: 0,
    },
    greenBtnText: {
        ...Buttons.greenBtnText,
        color: Colors.colorCyan,
    },
});

export default TripNotes;
