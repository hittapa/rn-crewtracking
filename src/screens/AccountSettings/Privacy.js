import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    SafeAreaView,
    Text,
    Linking,
    TouchableOpacity
} from 'react-native';
import * as GlobalStyles from '../../styles/styles';
import { HeaderLeft } from '../../components/Header/HeaderLeft';
import { HeaderRight } from '../../components/Header/HeaderRight';
import { HeaderTitle } from '../../components/Header/HeaderTitle';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SecurityActions from '../../actions/SecurityActions';
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { width } from '../../components/Carousel/Carousel';


function Privacy(props) {

    useEffect(() => {
    }, [])

    return (
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
                            color='#007aff'
                        />
                    </View>
                </HeaderLeft>
                <HeaderTitle>
                    <Text style={{
                        color: 'black',
                        fontSize: width / 19,
                        fontFamily: 'Roboto-Regular',
                        lineHeight: 22,
                        letterSpacing: -0.41
                    }}>Privacy Policy</Text>
                </HeaderTitle>
                <HeaderRight>
                    <View style={{ width: 40 }}></View>
                </HeaderRight>
            </View>
            <ScrollView>
                <View style={{ paddingHorizontal: 17.5, paddingVertical: 28.5 }}>
                    <Text style={{ ...styles.subTitle }}>Last Revised: May 25, 2021</Text>
                    <Text style={{ ...styles.title, paddingTop: 20 }}>Crewlog Principles</Text>
                    <Text style={{ ...styles.text }}>{`Crewlog respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use Crewlog. We recognize the importance of protecting personally identifiable information (“Personal Information” or “PII”) collected about you and other visitors (collectively, “Users”) to our website and mobile application (the “Services”) while delivering the sea time logging you enjoy. Crewlog recognizes that using our service is a choice you make, and you can change your mind at any time. If you need assistance with cancelling your subscription or deleting your account, please reach out to support@crewlog.com This Policy applies to the Service, which includes the Crewlog mobile application, the website located at`} <Text onPress={() => Linking.openURL('https://www.crewlog.com')} style={{ textDecorationLine: 'underline', color: '#4455ff' }}>{`www.crewlog.com`}</Text> {`its subdomains, and all of the websites and internet properties owned or operated by us, regardless of the medium by which the Site is accessed by Users (e.g., via a web or mobile browser).`}</Text>

                    <Text style={{ ...styles.title }}>How the Service works</Text>
                    <Text style={{ ...styles.text }}>When you create an account, the onboarding screens provide guidance around collecting location data and optimizing your device for trip detection. The app runs in the background to detect trips based on the movement of your mobile device, so there is no need to press a start or stop button.</Text>
                    <Text style={{ ...styles.text }}>Automatic trip detection is dependent on factors you control (such as location services and battery usage) as well as factors outside of your control (such as no cellular reception). Best practices include enabling <Text style={{ textDecorationLine: 'underline', color: '#4455ff' }}>location services</Text>, avoiding force-quitting the app or <Text style={{ textDecorationLine: 'underline', color: '#4455ff' }}>pausing trip detection</Text>, staying up-to-date with the latest OS on your device, <Text style={{ textDecorationLine: 'underline', color: '#4455ff' }}>optimizing low battery settings</Text> and staying logged in to the app. </Text>

                    <Text style={{ ...styles.title }}>What Data Is Collected</Text>
                    <Text style={{ ...styles.text }}>Crewlog collects location information to provide you with trip data whenever you are logged in to the app and have location services turned on and available. Additional telemetry around how you interact with the app (what buttons are/aren't pushed, etc.) is collected to provide troubleshooting and improve the user experience. If you do not want trip data collected, you can <Text style={{ textDecorationLine: 'underline', color: '#4455ff' }}>pause</Text>, log out of or delete the app. Logging out or deleting the app also stops additional telemetry from being collected.
While you must input an email address and password to create an account and use Crewlog, providing the following information is optional:</Text>
                    <Text style={{ ...styles.text, fontFamily: 'Roboto-Bold' }}>• Trip-related:</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}>1. <Text style={{ textDecorationLine: 'underline', color: '#4455ff' }}>Vessel</Text> information</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}>2. <Text style={{ textDecorationLine: 'underline', color: '#4455ff' }}>Locaiton names</Text> for easier start and end point identification</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}>3. Statistics you wish to collect such as watchkeeping, standby or USCG boundary line days spent seaward or shoreward</Text>
                    <Text style={{ ...styles.text, fontFamily: 'Roboto-Bold' }}>• Other:</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}>1. Subscription and payment information (via Google Play, iTunes)</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}>2. <Text style={{ textDecorationLine: 'underline', color: '#4455ff' }}>Notifications</Text></Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}>Emails to support (<Text style={{ textDecorationLine: 'underline', color: '#4455ff' }}>support@crewlog.com</Text>)</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}>We do not offer our Service or promote the Service to, nor do we intentionally collect or retain PII from, children who are younger than 13 years of age. If we discover that we have inadvertently collected information from a child under 13 years of age, we will promptly take all reasonable measures to delete such information from our systems.</Text>

                    <Text style={{ ...styles.title }}>How We Use Information</Text>
                    <Text style={{ ...styles.text }}>We may use Users’ PII for various general, lawful purposes to help enhance their experience. These purposes include:</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}><Text style={{ textDecorationLine: 'underline' }}>Lawful Purposes:</Text> {`
(i) as necessary for the performance of our contract with Users (such as our Terms of Use), 
(ii) for our legitimate interests, so long as they are not overridden by Users’ own rights and interests, or 
(iii) as required by law. These purposes include:`}</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}><Text style={{ textDecorationLine: 'underline' }}>Direct Marketing:</Text> We may use your PII to send you promotional materials. You have the right to opt-out of receiving direct marketing.</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}><Text style={{ textDecorationLine: 'underline' }}>Customer Service and User Communications: </Text> We may use your PII to help us respond to your inquiries, questions, requests, and support needs more efficiently.</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}><Text style={{ textDecorationLine: 'underline' }}>User Experience Personalization:</Text> We may use Users’ PII and/or deidentified Information in the aggregate to analyze Users’ browsing and usage activities and patterns in order to understand Users’ interests and preferences with respect to the Service and our services. This will help us optimize your experience on the Service.</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}><Text style={{ textDecorationLine: 'underline' }}>Business Optimization:</Text> We may use your PII and/or deidentified Information to improve the content on our web pages, to customize the content and layout of our web pages, and in managing our everyday business needs. We may also use your feedback to improve the Service and our other products and services. All of this is done with the intention of making the Service more useful for you.</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}>Company will not collect additional categories of PII or use PII we collect for materially different, unrelated, or incompatible purposes without providing you notice.</Text>

                    <Text style={{ ...styles.title }}>How We Disclose Information</Text>
                    <Text style={{ ...styles.text }}>We may disclose Users’ PII to third parties as described below. Otherwise, we do not sell PII and will not disclose Users’ PII to third parties without your permission.</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}><Text style={{ textDecorationLine: 'underline' }}>To Our Affiliates:</Text> We may disclose your PII to affiliates, including companies within the Crewlog network of connected applications.</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}><Text style={{ textDecorationLine: 'underline' }}>To Service Providers and Trusted Third Parties: </Text> We may disclose your PII to third party service providers and trusted third parties (including sponsors and marketing partners) that assist us in providing user support, communicating with Users, and promoting our services, as well as third party service providers that provide other services to us relating to our services and/or the Service.</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}><Text style={{ textDecorationLine: 'underline' }}>Law Enforcement, Safety, and Legal Processes:</Text> We may disclose your PII to law enforcement or other government officials if it relates to a criminal investigation or alleged criminal activity. We may also disclose your PII: (i) if required or permitted to do so by law; (ii) for fraud protection and credit risk reduction purposes; (iii) in the good-faith belief that such action is necessary to protect our rights, interests, or property; (iv) in the good-faith belief that such action is necessary to protect your safety or the safety of others; or (v) to comply with a judicial proceeding, court order, subpoena, or other similar legal or administrative process.</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}><Text style={{ textDecorationLine: 'underline' }}>Sale or Acquisition of Assets:</Text> If we become involved in a transaction involving the sale of our assets, such as a merger or acquisition, or if we are transferred to another company, we may disclose and/or transfer your PII as part of the transaction. If the surviving entity in that transaction is not us, the surviving company may use your PII pursuant to its own privacy policies, and those policies may be different from this Policy.</Text>

                    <Text style={{ ...styles.title }}>Security</Text>
                    <Text style={{ ...styles.text }}>The security and confidentiality of your PII is very important to us. We use commercially reasonable security measures to protect your PII on the Service. However, no data transmitted over or accessible through the internet can be guaranteed to be 100% secure. As a result, while we attempt to protect your PII, we cannot guarantee or warrant that your PII will be completely secure (i) from misappropriation by hackers or from other nefarious or criminal activities, or (ii) in the event of a failure of computer hardware, software, or a telecommunications networks.</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}>If you choose to report and share your trip data with a third party, it is no longer under our control or subject to our data security. This includes choosing to report via integrations on the <Text style={{ textDecorationLine: 'underline', color: '#4455ff' }}>web dashboard</Text> sending a report via email or any time a report is downloaded.</Text>

                    <Text style={{ ...styles.title }}>Legal Rights</Text>
                    <Text style={{ ...styles.subTitle, paddingTop: 20 }}>GDPR Data Subject Rights</Text>
                    <Text style={{ ...styles.text }}>If you are a data subject located in the European Economic Area (“EEA”), the GDPR grants you certain data privacy rights. Your rights include the:</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}> • Right to Access: You have the right to request a copy of your PII.</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}> • Right to Rectification: You have the right to request that we correct any mistakes in your PII.</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}> • Right to Erasure: You have the right request that we delete your PII.</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}> • Right to Restrict Processing: You have the right to restrict processing of your PII.</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}> • Right to Object to Processing: You have the right to object to our processing of your PII.</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}> • Right to Data Portability: You have the right to receive your PII in a structured, commonly used and machine-readable format.</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}> • Right to Not be Subject to Automated Individual Decision Making: You have the right not to be subject to a decision based solely on automated processing.</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}>To exercise your rights, please contact us at the Contact Information provided below. Please be aware that your rights are limited to the extent permitted by the GDPR.</Text>

                    <Text style={{ ...styles.subTitle, paddingTop: 20 }}>Withdraw Consent</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}>In the event that we process your PII pursuant to your consent, you have the right to withdraw your consent at any time, without affecting the lawfulness of the processing based on said consent before its withdrawal. If you would like to withdraw your consent, please contact us at the Contact Information provided below</Text>

                    <Text style={{ ...styles.subTitle, paddingTop: 20 }}>File a Complaint</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}>{`If you would like to file a complaint with us about our privacy practices, please contact us at the Contact Information provided below. If you are a data subject located in the EEA, the GDPR grants you the right to lodge a complaint with a competent supervisory authority as well. To find a competent supervisory authority, please use the following resource:`} <Text onPress={() => Linking.openURL('https://edpb.europa.eu/about-edpb/board/members_en')} style={{ textDecorationLine: 'underline', color: '#4455ff' }}>{`https://edpb.europa.eu/about-edpb/board/members_en`}</Text>{`.`}</Text>

                    <Text style={{ ...styles.subTitle, paddingTop: 20 }}>California Privacy Rights</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}>California’s “Shine the Light” law permits users of the Application that are California residents to request certain information regarding our disclosure of PII to third parties for their direct marketing purposes. To make such a request, please contact us at the Contact Information provided below.</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}>Under the California Consumer Privacy Act (“CCPA”) signed into law June 28, 2018 and entering into effect Jan. 1, 2020, California residents have certain rights and privileges. These rights include the:</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}> ・ Right to Know: the right to request disclosure of PII collected or sold.</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}> ・ Right to Deletion: the right to request deletion of PII collected from you.</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}> ・ *“Do Not Sell Right”: the right to opt-out of the sale of PII (if applicable).</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}> ・ Right to Sue for Security Breaches.</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}>*We do not sell your PII to third parties and have no plans to do so in the future.
We reserve the right to ask for information verifying your identity and residency prior to disclosing any information to you or acting on your request.  Should we ask for verification, the information you provide to verify your identity and residency will be used only for that purpose, and all copies of this information in our possession will be destroyed when the process is complete. We strive to respond to your request within 45 days of receiving a verifiable consumer request however, we reserve the right to respond within 90 days when reasonably necessary.</Text>

                    <Text style={{ ...styles.title }}>Data Storage - International Transfer</Text>
                    <Text style={{ ...styles.text }}>Your information, including PII, may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.
                    If you are located outside the United States and choose to provide information to us, please note we transfer your information, including PII, to the United States and process it there. Please note the EU has not adopted an adequacy decision with respect to data transfers to the United States; however, we value your privacy and protect your data using reasonable information security practices.
Upon transfer to the United States, any PII would then be subject to United States laws, and may be subject to disclosure to the United State’s government authorities, courts, law enforcement, or regulatory agencies of that country, pursuant to United States laws.</Text>

                    <Text style={{ ...styles.title }}>Retention</Text>
                    <Text style={{ ...styles.text }}>Crewlog is intended to help you organize your sea time and miles.. we will store your trips for seven (7) years to help you with your obligations. You can request deletion of your data at any time by contacting <Text style={{ textDecorationLine: 'underline', color: '#4455ff' }}>support@crewlog.com</Text>.</Text>

                    <Text style={{ ...styles.title }}>Do Not Track Disclosure</Text>
                    <Text style={{ ...styles.text }}>Some internet browsers may transmit “do-not-track” signals to websites with which the browser communicates. The Service does not currently respond to these “do-not-track” signals.</Text>

                    <Text style={{ ...styles.title }}>SPAM</Text>
                    <Text style={{ ...styles.text }}>We do not participate in bulk email solicitations that you have not consented to receiving. We do not sell or disclose customer lists or email address lists to unrelated third parties. Except as otherwise provided herein, we do not share PII with any third party advertisers.</Text>

                    <Text style={{ ...styles.title }}>Third Party Links</Text>
                    <Text style={{ ...styles.text }}>The Service may contain links to other websites or applications (“Linked Sites”) that we do not own. We do not control the collection or use of any information, including PII, which occurs while you visit Linked Sites. Therefore, we make no representations or warranties for—and will not in any way be liable for—any content, products, services, software, or other materials available on Linked Sites, even if one or more pages of the Linked Sites are framed within a page of the Service.
Furthermore, we make no representations or warranties about the privacy policies or practices of the Linked Sites, and the Company is not responsible for the privacy practices of those Linked Sites. We encourage you to be aware of when you leave the Service and read the privacy policies of Linked Services.</Text>

                    <Text style={{ ...styles.title }}>Modifications</Text>
                    <Text style={{ ...styles.text }}>We reserve the right to update this Policy from time-to-time in our sole discretion. If our privacy practices change materially in the future, we will post an updated version of the privacy policy to the Service. It is your responsibility to review this Policy for any changes each time you use the Service. We will not lessen your rights under this Policy without your explicit consent. If you do not agree with the changes made, we will honor any opt-out requests made after the Effective Date of a new privacy policy.</Text>

                    <Text style={{ ...styles.title }}>Accessing, Updating, and Controlling Information</Text>
                    <Text style={{ ...styles.text }}>All trips, can be viewed at the mobile app by logging in and selecting which vessels’ trips you’d like to view.
                    Account  deletions can be requested via support at support@crewlog.com. Deletion requests will be honored within 30 days of receipt acknowledgement by our support team. Trips, Stats, summaries, notes, can be deleted via the mobile app.
Otherwise, if you ever wish to access, update, change, or delete any other PII, or cancel your user account (if applicable), you may make such changes through your user account or by contacting us at the Contact Information provided below. To help us process your request, please provide sufficient information to allow us to identify you in our records. We reserve the right to ask for additional information verifying your identity prior to disclosing any PII to you. Should we ask for verification, the information you provide will be used only for verification purposes, and all copies of the information will be destroyed when the process is complete.</Text>
                    <Text style={{ ...styles.text, }}>Crewlog App Inc.</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}>110A Center Ave</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}>Middletown RI 02842</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}>Attn: Privacy Shannon</Text>
                    <Text style={{ ...styles.text, paddingTop: 0, textDecorationLine: 'underline', color: '#4455ff' }}>support@crewlog.com</Text>
                    <Text style={{ ...styles.text }}>If you do not wish to receive update messages and/or direct marketing communications from us, you may opt-out by making such changes through your user account, following any instructions included in the communication, or by contacting us at the Contact Information provided below. To help us process your request, please include sufficient information for us to identify you in our records. Please be aware that although you may opt-out of update messages and/or direct marketing communications, we reserve the right to email you administrative notices regarding the Service, as permitted under the CAN-SPAM Act.
We will make commercially reasonable efforts to respond to opt-out requests, respond to account cancellation requests, and handle requests to access, update, change, or delete PII as quickly as possible.</Text>

                    <Text style={{ ...styles.title }}>Contact Information</Text>
                    <Text style={{ ...styles.text }}>If you have questions about this Policy or wish to contact us with questions or comments, please contact us at:</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}>Crewlog App Inc.</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}>110A Center Ave</Text>
                    <Text style={{ ...styles.text, paddingTop: 0 }}>Middletown RI 02842</Text>
                    <Text style={{ ...styles.text, textDecorationLine: 'underline', color: '#4455ff' }}>support@crewlog.com</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: width / 18,
        color: '#000',
        lineHeight: 25.5,
        fontFamily: 'Roboto-Bold',
        letterSpacing: -0.3,
        fontWeight: '400',
        paddingTop: 50
    },
    subTitle: {
        fontSize: width/27,
        fontFamily: 'Roboto-Bold',
        color: '#000',
        lineHeight: 22,
        letterSpacing: -0.41,
        fontWeight: '400'
    },
    label: {
        fontSize: width / 32,
        color: '#3c3c43',
        textTransform: 'uppercase',
        lineHeight: 18,
        paddingTop: 34,
        paddingLeft: 12,
        fontFamily: 'Roboto-Light',
        fontWeight: '400',
        letterSpacing: -0.08
    },
    text: {
        fontSize: width / 23,
        color: '#3c3c43',
        lineHeight: 25.5,
        fontFamily: 'Roboto-Light',
        fontWeight: '400',
        letterSpacing: -0.3,
        paddingTop: 16
    }
});

const mapStateToProps = state => {
    return {
        user: state.APP.USER,
        vessels: state.APP.VESSELS
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(SecurityActions(), dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Privacy);
