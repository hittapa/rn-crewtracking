import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { Input } from '../Form/Fields/Input';
import countries from '../../assets/jsons/countries.json'
import { Colors } from '../../styles';
import { Text } from 'react-native';
import { width } from '../Carousel/Carousel';

const Step3 = formikProps => {
    const { handleChange, handleBlur, setFieldValue, values, errors } = formikProps;

    const [open, setOpen] = useState(false);

    return (
        <>
            <Text style={{
                marginTop: 10,
                textAlign: 'left',
                width: '100%',
                // marginBottom: 20,
                paddingLeft: 10,
                color: "#c7c7cd",
                fontFamily: 'Roboto-Regular',
                fontSize: width / 33,
                lineHeight: 14.06,
                letterSpacing: -0.3
            }}
            >Example: (MM/DD/YYYY)</Text>
            <Input
                placeholder="Birth date"
                onChangeText={handleChange('birthDate')}
                onBlur={handleBlur('birthDate')}
                value={values.birthDate}
                error={errors.birthDate}
                name="birthDate"
                type="text"
            />
            <DropDownPicker
                open={open}
                value={values.nationality}
                items={countries.records}
                setOpen={setOpen}
                multiple={false}
                placeholder={'Nationality'}
                placeholderStyle={{
                    color: '#c7c7cd',
                    fontSize: width / 26,
                    marginLeft: 5
                }}
                style={{ borderColor: '#c7c7cd' }}
                textStyle={{ color: Colors.colorGrey2, fontSize: width / 28 }}
                searchable={true}
                searchContainerStyle={{ borderColor: '#d7d7d7', borderBottomColor: '#d7d7d7' }}
                searchTextInputStyle={{ borderColor: '#d7d7d7' }}
                searchPlaceholder={'Other'}
                dropDownContainerStyle={{ borderColor: '#d7d7d7' }}
                setValue={(callback) => setFieldValue('nationality', callback(values.nationality))}
                name="nationality"
            />
        </>
    );
};

export default Step3;
