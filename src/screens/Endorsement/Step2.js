import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, KeyboardAvoidingView, ScrollView, StyleSheet, Text, Image, TouchableOpacity, FlatList, TextInput, Platform, Alert } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { Switch } from '../../components/Endorsement/Switch';
import { HeaderLeft } from '../../components/Header/HeaderLeft';
import { HeaderRight } from '../../components/Header/HeaderRight';
import { HeaderTitle } from '../../components/Header/HeaderTitle';
import { Colors } from '../../styles';
import * as GlobalStyles from '../../styles/styles';
import { FontAwesome, FontAwesome5, Ionicons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { height, width } from '../../components/Carousel/Carousel';

const departmentList = [
    'Deck department', 'Engineering department', 'Interior department'
];

const formsList = [
    'Sea time testimonial', 'Discharge certificate', 'Small vessel sea service form USCG'
];

const roles = {
    yachting: {
        engineer: [
            'Chief engineer', 'Second engineer', 'Engineer Watchkeeper'
        ],
        deck: [
            'Master', 'Chief Mate', 'OOW', 'Deckhand',
        ],
        interior: [
            'Junior Steward/ess', 'Senior Steward/ess', 'Chief Steward/ess', 'Chef', 'Cook'
        ],
        deck_interior: [
            'Master', 'Chief mate', 'Rating', 'Deckhand', 'Junior Steward/ess', 'Senior Steward/ess', 'Chief Steward/ess', 'Chef', 'Cook'
        ],
        deck_engineer: [
            'Master', 'Chief Mate', 'OOW', 'Rating', 'Deckhand', 'Engineer watchkeeper', 'Second engineer', 'Chief engineer'
        ]
    },
    merchant: {
        deck: [
            'Officer', 'Cadet/rating/junior'
        ],
        engineer: [
            'Officer', 'Cadet/rating/junior'
        ],
        interior: []
    }
}

function EndorseStep2(props) {

    const [vessel, setVessel] = useState(null);
    const [period, setPeriod] = useState(null);
    const [endorseType, setEndorseType] = useState('merchant');
    const [openDepartment, setOpenDepartment] = useState(false);
    const [openRole, setOpenRole] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [departmentsMerchant, setDepartmentsMerchant] = useState([]);
    const [rolesMerchant, setRolesMerchant] = useState([]);
    const [formsMerchant, setFormsMerchant] = useState([]);
    const [departmentsYachting, setDepartmentsYachting] = useState([]);
    const [rolesYachting, setRolesYachting] = useState([]);
    const [formsYachting, setFormsYachting] = useState([]);
    const [startLoc, setStartLoc] = useState('');
    const [endLoc, setEndLoc] = useState('');

    useEffect(() => {
        if (props.route.params.vessel) setVessel(props.route.params.vessel);
        if (props.route.params.period) setPeriod(props.route.params.period);
        if (props.route.params.startLoc) setStartLoc(props.route.params.startLoc);
        if (props.route.params.endLoc) setEndLoc(props.route.params.endLoc);
    }, [props]);

    const addItem = (item, type, sort) => {
        let data;
        if (endorseType == 'merchant') {
            if (type == 'department') {
                if (item == 'Interior department'){
                    Alert.alert(
                        'Warning!',
                        "Interior crew are not required to endorse sea service. Press quit to quit endorsement service or press edit to edit department selection.",
                        [
                            {
                                text: 'Edit',
                                style: 'cancel',
                                onPress: () => console.log('Cancel')
                            },
                            {
                                text: 'Quit',
                                style: 'default',
                                onPress: () => props.navigation.navigate('Dashboard')
                            }
                        ]
                    )
                    return;
                }
                
                data = [...departmentsMerchant];
                if (data.includes(item)) {
                    data.splice(data.indexOf(item), 1)
                } else
                    data[0] = item;
                setDepartmentsMerchant(data);
            }
            if (type == 'roles') {
                data = [...rolesMerchant];
                if (item == 'Other') {
                    data[0] = ''
                } else {
                    if (data.includes(item)) {
                        data.splice(data.indexOf(item), 1)
                    } else
                        data[0] = item;
                }
                setRolesMerchant(data);
            }
            if (type == 'form') {
                data = [...formsMerchant];
                if (data.includes(item)) {
                    data.splice(data.indexOf(item), 1)
                } else if (!data.includes(item))
                    data.push(item);
                setFormsMerchant(data);
            }
        } else {
            if (type == 'department') {
                data = [...departmentsYachting];
                if (data.includes(item)) {
                    data.splice(data.indexOf(item), 1)
                } else {
                    if (data.length == 0)
                        data.push(item);
                    if (data.includes('Deck department') && !data.includes('Engineering department') && !data.includes('Interior department') && item == 'Engineering department') {
                        data.push(item);
                    }
                    if (data.includes('Deck department') && !data.includes('Interior department') && !data.includes('Engineering department') && item == 'Interior department') {
                        data.push(item);
                    }
                    if (data.includes('Engineering department') && !data.includes('Deck department') && !data.includes('Interior department') && item == 'Deck department') {
                        data.unshift(item);
                    }
                    if (data.includes('Interior department') && !data.includes('Deck department') && !data.includes('Engineering department') && item == 'Deck department') {
                        data.unshift(item);
                    }
                }
                setDepartmentsYachting(data);
            }
            if (type == 'roles') {
                data = [...rolesYachting];
                if (sort == 1 && data.length == 0) {
                    data[0] = undefined;
                }
                if (item == 'Other') {
                    data[sort] = ''
                } else {
                    data[sort] = item;
                }
                setRolesYachting(data);
            }
            if (type == 'form') {
                data = [...formsYachting];
                if (data.includes(item)) {
                    data.splice(data.indexOf(item), 1)
                } else if (!data.includes(item))
                    data.push(item);
                setFormsYachting(data);
            }
        }
    }

    const checkSelected = (type, item, sort = null, list = null) => {
        if (type == 'department' && endorseType == 'merchant' && departmentsMerchant.includes(item)) return true;
        if (type == 'department' && endorseType == 'yachting' && departmentsYachting.includes(item)) return true;
        if (type == 'roles' && endorseType == 'merchant' && rolesMerchant.includes(item)) return true;
        if (type == 'roles' && endorseType == 'yachting' && rolesYachting.includes(item)) return true;
        if (type == 'roles' && item == 'Other' && rolesMerchant.length > 0 && endorseType == 'merchant' && !list.includes(rolesMerchant[0])) return true;
        if (type == 'roles' && item == 'Other' && rolesYachting.length > 0 && endorseType == 'yachting' && rolesYachting[sort] != undefined && !list.includes(rolesYachting[sort])) return true;
        if (type == 'form' && endorseType == 'merchant' && formsMerchant.includes(item)) return true;
        if (type == 'form' && endorseType == 'yachting' && formsYachting.includes(item)) return true;
        return false;
    }

    const ListItem = (item, type, sort = null, list = null) => {
        return (
            <TouchableOpacity onPress={() => addItem(item, type, sort)} style={{ ...GlobalStyles.inputForm, paddingLeft: 24, borderBottomWidth: .5, borderBottomColor: '#ffffff', backgroundColor: '#f0f0f0' }}>
                <Text style={[GlobalStyles.labelText, checkSelected(type, item, sort, list) && { color: Colors.colorGrey3 }]} numberOfLines={1}>{item}</Text>
                {
                    type == 'department' && endorseType == 'merchant' && departmentsMerchant.includes(item) && (
                        <MaterialIcons name="check" size={24} color={Colors.colorGreen} />
                    )
                }
                {
                    type == 'department' && endorseType == 'yachting' && departmentsYachting.includes(item) && (
                        <MaterialIcons name="check" size={24} color={Colors.colorGreen} />
                    )
                }
                {
                    type == 'roles' && endorseType == 'merchant' && rolesMerchant.includes(item) && (
                        <MaterialIcons name="check" size={24} color={Colors.colorGreen} />
                    )
                }
                {
                    type == 'roles' && endorseType == 'yachting' && rolesYachting.includes(item) && (
                        <MaterialIcons name="check" size={24} color={Colors.colorGreen} />
                    )
                }
                {
                    type == 'roles' && item == 'Other' && rolesYachting.length > 0 && endorseType == 'yachting' && rolesYachting[sort] != undefined && !list.includes(rolesYachting[sort]) && (
                        <MaterialIcons name="check" size={24} color={Colors.colorGreen} />
                    )
                }
                {
                    type == 'roles' && item == 'Other' && rolesMerchant.length > 0 && endorseType == 'merchant' && !list.includes(rolesMerchant[0]) && (
                        <MaterialIcons name="check" size={24} color={Colors.colorGreen} />
                    )
                }
                {
                    type == 'form' && endorseType == 'merchant' && formsMerchant.length > 0 && formsMerchant.includes(item) && (
                        <MaterialIcons name="check" size={24} color={Colors.colorGreen} />
                    )
                }
                {
                    type == 'form' && endorseType == 'yachting' && formsYachting.length > 0 && formsYachting.includes(item) && (
                        <MaterialIcons name="check" size={24} color={Colors.colorGreen} />
                    )
                }
            </TouchableOpacity>
        )
    }

    const handleRemoveItem = (index, type) => {
        let data;
        if (endorseType == 'merchant') {
            if (type == 'department') data = [...departmentsMerchant];
            if (type == 'roles') data = [...rolesMerchant];
            if (type == 'form') data = [...formsMerchant];
        } else {
            if (type == 'department') data = [...departmentsYachting];
            if (type == 'roles') data = [...rolesYachting];
            if (type == 'form') data = [...formsYachting];
        }
        data.splice(index, 1);
        if (endorseType == 'merchant') {
            if (type == 'department') setDepartmentsMerchant(data);
            if (type == 'roles') setRolesMerchant(data);
            if (type == 'form') setFormsMerchant(data);
        } else {
            if (type == 'department') {
                setDepartmentsYachting(data);
                if (rolesYachting.length == 2) {
                    let rol = [...rolesYachting];
                    rol.splice(index, 1);
                    setRolesYachting(rol);
                }
            };
            if (type == 'roles') {
                if (rolesYachting.length == 2) {
                    data.splice(index, 0, '');
                }
                setRolesYachting(data)
            };
            if (type == 'form') setFormsYachting(data);
        }
    }

    const TagItem = (item, index, type) => {
        return (
            <View style={styles.tagItem}>
                <Text style={styles.tagText}>{item}</Text>
                <TouchableOpacity onPress={() => handleRemoveItem(index, type)}>
                    <Ionicons name='close' size={20} color={"#aeaeae"} />
                </TouchableOpacity>
            </View>
        )
    }

    const getRoles = () => {
        let _roles = [];
        if (endorseType == 'yachting') {
            if (departmentsYachting.includes('Deck department')) {
                _roles.push(roles.yachting.deck);
            }
            if (departmentsYachting.includes('Engineering department')) {
                _roles.push(roles.yachting.engineer);
            }
            if (departmentsYachting.includes('Interior department')) {
                _roles.push(roles.yachting.interior);
            }
        } else {
            if (departmentsMerchant.includes('Deck department')) {
                _roles.push(roles.merchant.deck);
            }
            if (departmentsMerchant.includes('Engineering department')) {
                _roles.push(roles.merchant.engineer);
            }
            if (departmentsMerchant.includes('Interior department')) {
                _roles.push(roles.merchant.interior);
            }
        }
        return _roles;
    }

    const roleDesabled = () => {
        if ((endorseType == 'merchant' && departmentsMerchant.length == 0) || endorseType == 'yachting' && departmentsYachting.length == 0) {
            if (openRole) setOpenRole(false);
            if (departmentsMerchant.length == 0 && rolesMerchant.length != 0) setRolesMerchant([]);
            if (departmentsYachting.length == 0 && rolesYachting.length != 0) setRolesYachting([]);
            return true;
        }
        else return false;
    }

    const inputOtherRole = (text, key) => {
        if (endorseType == 'yachting') {
            let data = [...rolesYachting];
            data[key] = text;
            setRolesYachting(data);
        }
        if (endorseType == 'merchant') {
            let data = [...rolesMerchant];
            data[key] = text;
            setRolesMerchant(data);
        }
    }

    const enableNext = () => {
        let enable = false;
        if (endorseType == 'yachting') {
            if (
                departmentsYachting.length > 0
                && rolesYachting.length > 0
                && formsYachting.length > 0
                && rolesYachting.includes("") == false
                && departmentsYachting.length == rolesYachting.length
            ) enable = true;
        }
        if (endorseType == 'merchant') {
            if (
                departmentsMerchant.length > 0
                && rolesMerchant.length > 0
                && formsMerchant.length > 0
                && rolesMerchant.includes("") == false
            ) enable = true;
        }
        return enable;
    }

    const handleNext = () => {
        if (endorseType == 'merchant' && departmentsMerchant[0] == 'Interior department') {
            Alert.alert(
                'Warning!',
                "There's no need to endorse sea service as interior crew. Press 'Cancel' if you want to proceed with other options. If you want to stop endorsement, please press 'Stop'.",
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: () => console.log('Cancel')
                    },
                    {
                        text: 'Stop',
                        style: 'default',
                        onPress: () => props.navigation.navigate('Dashboard')
                    }
                ]
            )
            return;
        }
        const data = {
            ...props.route.params,
            departments: endorseType == 'yachting' ? departmentsYachting : departmentsMerchant,
            roles: endorseType == 'yachting' ? rolesYachting : rolesMerchant,
            forms: endorseType == 'yachting' ? formsYachting : formsMerchant,
            type: endorseType
        };
        props.navigation.navigate('EndorseStep3', data);
    }

    return (
        <View style={GlobalStyles.FlexContainer}>
            <SafeAreaView style={[GlobalStyles.safeView]}>
                <View style={[GlobalStyles.header]}>
                    <HeaderLeft onPress={() => props.navigation.goBack()}>
                        <Text style={{
                            color: '#ababab',
                            marginLeft: 20,
                            fontSize: width / 23,
                            lineHeight: 21.09,
                            letterSpacing: -0.3,
                            fontWeight: '400',
                            width: 55,
                        }} numberOfLines={1}>{"Back"}</Text>
                    </HeaderLeft>
                    <HeaderTitle>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={{
                                ...GlobalStyles.headerTitle
                            }}>Endorse sea service</Text>
                            <Text style={{
                                color: '#888',
                                fontSize: width / 28,
                                lineHeight: 18,
                                textTransform: 'uppercase'
                            }}>{`Step 2 of 4`}</Text>
                        </View>
                    </HeaderTitle>
                    <HeaderRight>
                        <View style={{ width: 55, marginRight: 20 }}></View>
                    </HeaderRight>
                </View>
                <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'position' : 'height'}>
                    <ScrollView style={[{ backgroundColor: '#f9f9f9', marginBottom: 155 }]} nestedScrollEnabled bounces={false}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', paddingHorizontal: 16, backgroundColor: '#ffffff' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', maxWidth: '50%' }}>
                                <Text style={{ fontSize: width/24.5, lineHeight: 20, letterSpacing: -0.3 }}>Place of joining</Text>
                                <Text style={{ fontSize: width/21, lineHeight: 22, letterSpacing: -0.408, color: '#6aabff', textTransform: 'uppercase', paddingTop: 7 }}>{period && moment(period.start).utc().format('DD MMM YYYY')}</Text>
                                <Text style={{ ...GlobalStyles.labelText, color: Colors.colorGrey4 }}>{startLoc}</Text>
                            </View>
                            <Image source={require('../../../assets/large_arrow.png')} style={{ height: 157, width: 28, resizeMode: 'contain' }} />
                            <View style={{ justifyContent: 'center', alignItems: 'center', maxWidth: '50%' }}>
                                <Text style={{ fontSize: width/24.5, lineHeight: 20, letterSpacing: -0.3 }}>Place of discharge</Text>
                                <Text style={{ fontSize: width/21, lineHeight: 22, letterSpacing: -0.408, color: '#6aabff', textTransform: 'uppercase', paddingTop: 7 }}>{period && moment(period.end).utc().format('DD MMM YYYY')}</Text>
                                <Text style={{ ...GlobalStyles.labelText, color: Colors.colorGrey4 }}>{endLoc}</Text>
                            </View>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', padding: 20, justifyContent: 'center' }}>
                            <Switch
                                type={endorseType}
                                changeType={(type) => {
                                    setEndorseType(type);
                                }}
                            />
                        </View>

                        <View style={{ width: '100%' }}>
                            <Text style={{
                                ...styles.label
                            }}>Department selection <Text style={{ textTransform: 'lowercase', fontFamily: 'Roboto-Italic', fontWeight: '200' }}>(up to 2)</Text></Text>
                        </View>
                        <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                            <TouchableOpacity onPress={() => setOpenDepartment(!openDepartment)} style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: .5, borderBottomColor: '#c6c6c8' }}>
                                <Text style={GlobalStyles.labelText} numberOfLines={1}>Select department(s) served</Text>
                                <SimpleLineIcons name={openDepartment ? 'arrow-up' : 'arrow-down'} size={14} color={Colors.colorGrey3} />
                            </TouchableOpacity>
                        </View>
                        {
                            openDepartment && (
                                <View style={{ width: '100%', paddingLeft: 0 }}>
                                    <FlatList
                                        data={departmentList}
                                        renderItem={({ item }) => ListItem(item, 'department')}
                                        keyExtractor={(item) => item}
                                    />
                                    <View style={{ ...GlobalStyles.inputForm, paddingLeft: 24, borderBottomWidth: .5, borderBottomColor: '#ffffff', backgroundColor: '#f0f0f0' }}>
                                        <CustomButton
                                            title={'Done'}
                                            containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, height: 50 }}
                                            textStyle={{ color: Colors.colorBlue3 }}
                                            onPress={() => setOpenDepartment(false)}
                                        />
                                    </View>
                                </View>
                            )
                        }
                        {
                            !openDepartment && endorseType == 'merchant' && departmentsMerchant.length != 0 && (
                                <View style={{ width: '100%', paddingLeft: 24, flex: 1, flexDirection: 'row', flexWrap: 'wrap', paddingTop: 10, paddingBottom: 20 }}>
                                    {
                                        departmentsMerchant.map((item, index) => {
                                            return TagItem(item, index, 'department')
                                        })
                                    }
                                </View>
                            )
                        }
                        {
                            !openDepartment && endorseType == 'yachting' && departmentsYachting.length != 0 && (
                                <View style={{ width: '100%', paddingLeft: 24, flex: 1, flexDirection: 'row', flexWrap: 'wrap', paddingTop: 10, paddingBottom: 20 }}>
                                    {
                                        departmentsYachting.map((item, index) => {
                                            return TagItem(item, index, 'department')
                                        })
                                    }
                                </View>
                            )
                        }
                        <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                            <TouchableOpacity onPress={() => setOpenRole(!openRole)} style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: .5, borderBottomColor: '#c6c6c8' }} disabled={roleDesabled()}>
                                <Text style={[GlobalStyles.labelText, roleDesabled() && { color: Colors.colorGrey4 }]} numberOfLines={1}>Select role(s) served</Text>
                                <SimpleLineIcons name={openRole ? 'arrow-up' : 'arrow-down'} size={14} color={roleDesabled() ? Colors.colorGrey4 : Colors.colorGrey3} />
                            </TouchableOpacity>
                        </View>
                        {
                            openRole && (
                                <View style={{ width: '100%', backgroundColor: '#ffffff' }}>
                                    {
                                        getRoles().map((list, key) => {
                                            return (
                                                <View style={{ marginBottom: 10, backgroundColor: Colors.grey3 }}>
                                                    <FlatList
                                                        data={list}
                                                        renderItem={({ item }) => ListItem(item, 'roles', key)}
                                                        keyExtractor={(item) => 'roles_' + item}
                                                    />
                                                    {
                                                        ListItem('Other', 'roles', key, list)
                                                    }
                                                    {
                                                        rolesMerchant.length > 0 && endorseType == 'merchant' && !list.includes(rolesMerchant[key]) && (
                                                            <View style={{ width: '100%', paddingHorizontal: 20, paddingVertical: 5, justifyContent: 'center', alignItems: 'center', marginHorizontal: 10 }}>
                                                                <TextInput
                                                                    style={{ width: '80%', height: 60, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.028)', borderRadius: 7, paddingHorizontal: 20, fontSize: width/21, lineHeight: 23.44, letterSpacing: -0.3, color: Colors.colorGrey2, textAlign: 'center' }}
                                                                    placeholder="Enter role"
                                                                    value={rolesMerchant[key]}
                                                                    placeholderTextColor={Colors.colorGrey4}
                                                                    onChangeText={(text) => inputOtherRole(text, key)}
                                                                />
                                                            </View>
                                                        )
                                                    }
                                                    {
                                                        rolesYachting.length > 0 && endorseType == 'yachting' && rolesYachting[key] != undefined && !list.includes(rolesYachting[key]) && (
                                                            <View style={{ width: '100%', paddingHorizontal: 20, paddingVertical: 5, justifyContent: 'center', alignItems: 'center' }}>
                                                                <TextInput
                                                                    style={{ width: '80%', height: 60, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.028)', borderRadius: 7, paddingHorizontal: 20, fontSize: width/21, lineHeight: 23.44, letterSpacing: -0.3, color: Colors.colorGrey2, textAlign: 'center' }}
                                                                    placeholder="Enter role"
                                                                    value={rolesYachting[key]}
                                                                    placeholderTextColor={Colors.colorGrey4}
                                                                    onChangeText={(text) => inputOtherRole(text, key)}
                                                                />
                                                            </View>
                                                        )
                                                    }
                                                </View>
                                            )
                                        })
                                    }
                                    <View onPress={() => addItem(item, type)} style={{ ...GlobalStyles.inputForm, paddingLeft: 24, borderBottomWidth: .5, borderBottomColor: '#ffffff', backgroundColor: '#f0f0f0' }}>
                                        <CustomButton
                                            title={'Done'}
                                            containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, height: 50 }}
                                            textStyle={{ color: Colors.colorBlue3 }}
                                            onPress={() => setOpenRole(false)}
                                        />
                                    </View>
                                </View>
                            )
                        }
                        {
                            !openRole && endorseType == 'merchant' && rolesMerchant.length != 0 && (
                                <View style={{ width: '100%', paddingLeft: 24, flex: 1, flexDirection: 'row', flexWrap: 'wrap', paddingTop: 10, paddingBottom: 20 }}>
                                    {
                                        rolesMerchant.map((item, index) => {
                                            if (item != '')
                                                return TagItem(item, index, 'roles')
                                        })
                                    }
                                </View>
                            )
                        }
                        {
                            !openRole && endorseType == 'yachting' && rolesYachting.length != 0 && (
                                <View style={{ width: '100%', paddingLeft: 24, flex: 1, flexDirection: 'row', flexWrap: 'wrap', paddingTop: 10, paddingBottom: 20 }}>
                                    {
                                        rolesYachting.map((item, index) => {
                                            if (item != '')
                                                return TagItem(item, index, 'roles')
                                        })
                                    }
                                </View>
                            )
                        }
                        <View style={{ width: '100%' }}>
                            <Text style={{
                                ...styles.label
                            }}>Sea service form selection</Text>
                        </View>
                        <View style={{ width: '100%', backgroundColor: '#fff', paddingLeft: 16 }}>
                            <TouchableOpacity onPress={() => setOpenForm(!openForm)} style={{ ...GlobalStyles.inputForm, paddingLeft: 0, borderBottomWidth: .5, borderBottomColor: '#c6c6c8' }}>
                                <Text style={[GlobalStyles.labelText]} numberOfLines={1}>Select forms for endorsement</Text>
                                <SimpleLineIcons name={openForm ? 'arrow-up' : 'arrow-down'} size={14} color={Colors.colorGrey3} />
                            </TouchableOpacity>
                        </View>
                        {
                            openForm && (
                                <View style={{ width: '100%', paddingLeft: 0 }}>
                                    <FlatList
                                        data={formsList}
                                        renderItem={({ item }) => ListItem(item, 'form')}
                                        keyExtractor={(item) => 'forms_' + item}
                                        bounces={false}
                                    />
                                    <View style={{ ...GlobalStyles.inputForm, paddingLeft: 24, borderBottomWidth: .5, borderBottomColor: '#ffffff', backgroundColor: '#f0f0f0' }}>
                                        <CustomButton
                                            title={'Done'}
                                            containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, height: 50 }}
                                            textStyle={{ color: Colors.colorBlue3 }}
                                            onPress={() => setOpenForm(false)}
                                        />
                                    </View>
                                </View>
                            )
                        }
                        {
                            !openForm && endorseType == 'merchant' && formsMerchant.length != 0 && (
                                <View style={{ width: '100%', paddingLeft: 24, flex: 1, flexDirection: 'row', flexWrap: 'wrap', paddingTop: 10, paddingBottom: 20 }}>
                                    {
                                        formsMerchant.map((item, index) => {
                                            return TagItem(item, index, 'form')
                                        })
                                    }
                                </View>
                            )
                        }
                        {
                            !openForm && endorseType == 'yachting' && formsYachting.length != 0 && (
                                <View style={{ width: '100%', paddingLeft: 24, flex: 1, flexDirection: 'row', flexWrap: 'wrap', paddingTop: 10, paddingBottom: 20 }}>
                                    {
                                        formsYachting.map((item, index) => {
                                            return TagItem(item, index, 'form')
                                        })
                                    }
                                </View>
                            )
                        }
                    </ScrollView>
                </KeyboardAvoidingView>
                <View style={{ position: 'absolute', backgroundColor: '#ffffff', bottom: 0, width: '100%', height: 100, padding: 20, flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <CustomButton
                        title={'Next'}
                        containerStyle={{ backgroundColor: '#ffffff', height: 50, width: '80%', borderColor: enableNext() ? '#7FC542' : Colors.colorGrey5 }}
                        textStyle={{ color: enableNext() ? '#7FC542ee' : Colors.colorGrey5 }}
                        onPress={() => enableNext() && handleNext()}
                    />
                </View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        paddingLeft: 12,
        paddingTop: 34,
        paddingBottom: 8,
        textAlign: 'left',
        color: '#8e8e93',
        textTransform: 'uppercase',
        fontFamily: 'Roboto-Regular',
        fontWeight: '400',
        fontSize: width / 32,
        lineHeight: 18,
        letterSpacing: -0.08
    },
    tagItem: {
        height: 32,
        // width: 150,
        borderRadius: 7,
        paddingHorizontal: 8,
        paddingVertical: 6,
        backgroundColor: '#636363',
        borderWidth: .5,
        borderColor: "rgba(0,0,0,0.04)",
        alignItems: 'center',
        flexDirection: 'row',
        margin: 3,
        justifyContent: 'space-between'
    },
    tagText: {
        fontFamily: 'Roboto-Regular',
        fontSize: width / 28,
        lineHeight: 20,
        letterSpacing: -0.24,
        color: '#ffffff'
    }
})

export default EndorseStep2;