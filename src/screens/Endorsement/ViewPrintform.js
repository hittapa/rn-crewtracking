import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    SafeAreaView,
    Text,
    TouchableOpacity,
    Image,
    Linking,
} from 'react-native';
import * as GlobalStyles from '../../styles/styles';
import { HeaderLeft } from '../../components/Header/HeaderLeft';
import { HeaderRight } from '../../components/Header/HeaderRight';
import { HeaderTitle } from '../../components/Header/HeaderTitle';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SecurityActions from '../../actions/SecurityActions';
import { FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import appConstants from '../../constants/app';
import { height, width } from '../../components/Carousel/Carousel';
import CustomButton from '../../components/CustomButton';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'rn-fetch-blob';

function ViewPrintform(props) {
    const [user, setUser] = useState(null);
    const [pdf, setPdf] = useState(null);

    useEffect(() => {
        if (props.user) {
            setUser(props.user);
        }
        if (props.route.params?.uri) {
            let uri = appConstants.MAINURL + props.route.params.uri;
            setPdf(uri.trim());
        }
    }, [props]);

    const handleDownload = () => {
        const { config, fs } = RNFetchBlob
        let date = new Date();
        let PictureDir = fs.dirs.PictureDir // this is the pictures directory. You can check the available directories in the wiki.
        let options = {
            fileCache: true,
            path: PictureDir + "/me_" + Math.floor(date.getTime() + date.getSeconds() / 2),
            addAndroidDownloads: {
                useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
                notification: false,
                path: PictureDir + "/me_" + Math.floor(date.getTime() + date.getSeconds() / 2), // this is the path where your downloaded file will live in
                description: 'Downloading image.'
            }
        }
        config(options).fetch('GET', pdf).then((res) => {
            console.log("The file saved to ", res.path());
            alert("Successfully downloaded");
        })

    }

    const openURL = () => {
        Linking.openURL(pdf)
    }

    return (
        <View style={GlobalStyles.FlexContainer}>
            <SafeAreaView style={[GlobalStyles.safeView]}>
                <View style={[GlobalStyles.header]}>
                    <HeaderLeft onPress={() => props.navigation.goBack()}>
                        <View
                            style={{
                                borderRadius: 50,
                                alignItems: 'center',
                                marginLeft: 20
                            }}
                        >
                            <MaterialIcons
                                name="arrow-back-ios"
                                size={28}
                                color='#18f'
                            />
                        </View>
                    </HeaderLeft>
                    <HeaderTitle>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={{
                                ...GlobalStyles.headerTitle, textAlign: 'center'
                            }}>Print form</Text>
                        </View>
                    </HeaderTitle>
                    <HeaderRight onPress={() => openURL()}>
                        <View style={{ width: 40 }}>
                            <MaterialIcons
                                name="cloud-download"
                                size={28}
                                color='#18f'
                            />
                        </View>
                    </HeaderRight>
                </View>
                <ScrollView style={[{ backgroundColor: '#f9f9f9' }]}>
                    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 16 }}>
                        <Pdf
                            source={{ uri: pdf, cache: true }}
                            style={{ flex: 1, width: width, height: height }}
                            onLoadComplete={(numberOfPages, filePath) => {
                                console.log(`number of pages: ${numberOfPages}`);
                            }}
                            onPageChanged={(page, numberOfPages) => {
                                console.log(`current page: ${page}`);
                            }}
                            onError={(error) => {
                                console.log(error);
                            }}
                            onPressLink={(uri) => {
                                console.log(`Link presse: ${uri}`)
                            }}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...GlobalStyles.FlexContainer,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        justifyContent: "flex-start",
        borderRadius: 16,
        backgroundColor: '#3e3e3e'
    },
    modal0: {
        width: 250,
        height: 550,
    },
    centeredView: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center'
    },
    listItemText: {
        textAlign: 'center',
        fontSize: width / 26,
        lineHeight: 24,
        color: '#09e',
    },
    listItem: {
        width: 250,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        borderTopColor: '#909090',
        borderTopWidth: .5
    },
    modalHeader: {
        paddingVertical: 15,
        alignItems: 'center'
    },
    modalBody: {
        height: 150,
        width: 280,
        alignItems: 'center',
    },
    modalFooter: {
        height: 50,
        width: 300,
        bottom: 0,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: .5,
        borderTopColor: '#8e8e8e'
    },
    modalHeaderText: {
        fontSize: width/21,
        lineHeight: 24,
        color: '#f3f3f3',
        fontWeight: '700'
    },
    footerActionText: {
        color: '#09e',
        fontSize: width / 26,
        lineHeight: 24,
        fontWeight: 'bold'
    },
    modalBodyText: {
        fontSize: width / 23,
        lineHeight: 26,
        color: '#fefefe',
        textAlign: 'center',
        fontWeight: '300'
    },
    sectionTitle: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center'
    },
    infoMark: {
        width: 16,
        height: 16,
        backgroundColor: '#3a0',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
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
    }
});

const mapStateToProps = state => {
    return {
        user: state.APP.USER,
        vessels: state.APP.VESSELS,
        endorsements: state.APP.endorsements
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(SecurityActions(), dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewPrintform);
