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


function Terms(props) {

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
                    }}>Terms of Service</Text>
                </HeaderTitle>
                <HeaderRight>
                    <View style={{ width: 40 }}></View>
                </HeaderRight>
            </View>
            <ScrollView>
                <View style={{ paddingHorizontal: 17.5, paddingVertical: 28.5 }}>
                    <Text style={{ ...styles.subTitle }}>Last Revised: May 29, 2021</Text>

                    <Text style={{ ...styles.text, textTransform: 'uppercase' }}>THESE TERMS OF SERVICE AND USE FOUND HERE ARE (THE “TERMS”) APPLY TO YOUR USE OF THE CREWLOG AND OR VISITS MOBILE APPLICATION, THE WEBSITE LOCATED AT www.crewlog.com AND THE SERVICES RELATED TO THE FOREGOING (COLLECTIVELY, “CREWLOG”) PROVIDED BY CREWLOG APP, INC. (“CREWLOG APP,” “WE” OR “US”).</Text>
                    <Text style={{ ...styles.text, textTransform: 'uppercase' }}>PLEASE READ ALL OF THE TERMS AND CONDITIONS OF THE TERMS CAREFULLY. BY USING CREWLOG AND OR VISITS, YOU ACKNOWLEDGE AND AGREE THAT: (I) YOU HAVE READ ALL OF THE TERMS AND CONDITIONS OF THE TERMS; (II) YOU UNDERSTAND ALL OF THE TERMS AND CONDITIONS OF THE TERMS; AND (III) YOU AGREE TO BE LEGALLY BOUND BY ALL OF THE TERMS AND CONDITIONS SET FORTH IN THE TERMS.</Text>
                    <Text style={{ ...styles.text, textTransform: 'uppercase' }}>IF YOU DO NOT AGREE WITH ANY OF THE TERMS OR CONDITIONS OF THE TERMS, YOU MAY NOT ACCESS OR USE CREWLOG.</Text>

                    <Text style={{ ...styles.subTitle, paddingTop: 40 }}>Crewlog Service and Features</Text>
                    <Text style={{ ...styles.text }}>{`Crewlog is a mobile application that automatically tracks sea time, using your device’s location data, to assist you in the creation of a sea time logbook. You can use your logbook to organize your trips at sea according to the vessels traveled, record statistics while onboard in addition to the statistics we automatically log for you such as average hours spent underway per day, average distance offshore, days spent underway and with our PRO features- create sea time testimonial forms, discharge certificates and for US citizens, the small vessel sea service form. Crewlog asks you to opt-in to certain features, like daily notifications and weekly/monthly trip summaries. If you decide you no longer want to access an opt-in feature, you may opt-out by contacting Crewlog App `} <Text style={{ textDecorationLine: 'underline', color: '#4455ff' }}>{`support@crewlog.com`}</Text> {` or via the settings menu in Crewlog.`}</Text>

                    <Text style={{ ...styles.subTitle, paddingTop: 40 }}>Privacy</Text>
                    <Text style={{ ...styles.text }}>{`Your privacy is important to us. Please review our Privacy Policy, which also governs your use of Crewlog, to understand Company’s privacy practices. By visiting or using Crewlog, you consent to all actions taken by us with respect to your information in compliance with the Privacy Policy, which is hereby incorporated by reference into these `}</Text>

                    <Text style={{ ...styles.subTitle, paddingTop: 40 }}>Terms</Text>
                    <Text style={{ ...styles.text }}>{`A copy of our Privacy Policy can be accessed at `}<Text onPress={() => Linking.openURL('https://www.crewlog.com/privacy')} style={{ textDecorationLine: 'underline', color: '#4455ff' }}>{`https://www.crewlog.com/privacy`}</Text></Text>
                    <Text style={{ ...styles.subTitle, paddingTop: 40 }}>License</Text>
                    <Text style={{ ...styles.text }}>{`Subject to the terms, conditions and limitations set forth in the Terms, Crewlog App grants you a nonexclusive, non-transferable and revocable license to use Crewlog on any mobile device that you own or control. The terms of the license will also govern any upgrades provided by Crewlog App that replace and/or supplement the original Crewlog, unless such upgrade is accompanied by a separate license, in which case the terms of that license will govern.`}</Text>
                    <Text style={{ ...styles.subTitle, paddingTop: 40 }}>Restrictions</Text>
                    <Text style={{ ...styles.text }}>{`You agree not to do, or authorize or permit any third-party to do, any of the following: (i) distribute or make Crewlog available over a network where it could be used by multiple devices at the same time; (ii) rent, lease, lend, sell, redistribute or sublicense Crewlog; (iii) copy, decompile, reverse engineer, disassemble, attempt to derive the source code of, modify or create derivative works of Crewlog, or any updates or any part thereof (except as and only to the extent any of these restrictions are prohibited by applicable law); or (iv) remove, alter or obscure any copyright, trademark or other proprietary rights notice on or in Crewlog. If you violate any of the restrictions set forth in the Terms, your use of Crewlog will immediately cease, and you will have infringed the copyright and other rights of Crewlog App, which may subject you to prosecution and damages. Crewlog App reserves all rights not expressly granted to you in the Terms.`}</Text>
                    <Text style={{ ...styles.subTitle, paddingTop: 40 }}>Subscription Terms</Text>
                    <Text style={{ ...styles.text }}>{`Use of Crewlog BASIC is free and are granted unlimited trips. Subscriptions for unlimited trips using Crewlog PRO are available for $4.99 per month for monthly subscriptions or as otherwise agreed to in writing by Crewlog App. Crewlog subscriptions renew automatically for successive subscription periods (as applicable) until cancelled. If you initiated your Crewlog subscription through Apple, see `} <Text onPress={() => Linking.openURL('https://support.apple.com/en-us/HT202039')} style={{ textDecorationLine: 'underline', color: '#4455ff' }}>{`https://support.apple.com/en-us/HT202039`}</Text> {` (or its successor website) for information about managing your auto-renewing subscription. If you initiated your Crewlog subscription through Google Play, see `} <Text onPress={() => Linking.openURL('https://support.google.com/googleplay/answer/2476088?vid=1-635770230184706449-3000457038')} style={{ textDecorationLine: 'underline', color: '#4455ff' }}>{`https://support.google.com/googleplay/answer/2476088?vid=1-635770230184706449-3000457038`}</Text> {` (or its successor website) for information about managing your auto-renewing subscription. If you initiated your Crewlog subscription via an order from Crewlog App, contact Crewlog support@crewlog.com with your formal request for cancellation. Cancellations received with at least 10 days prior notice are effective at the end of the then-current subscription period; cancellations received fewer than 10 days before the end the then-current subscription period are effective at the end of the next subscription period. Crewlog App may cancel your subscription with or without cause at any time. If Crewlog App cancels your subscription without cause before the end of your subscription period, you may be entitled to a refund (prorated for the time remaining on your subscription period). Otherwise, subscriptions are non-refundable except as expressly set forth in writing by Crewlog App. Termination of your Crewlog subscription will automatically terminate these Terms. By using Crewlog, you agree to be bound by and accept the subscription terms set forth in this section and any other terms set forth in an order with Crewlog App.
Refund Policy – Only Applicable if you are resident in an EU Member State. Where you are resident in an EU Member State, the provisions of this section entitled Refund Policy are applicable to you. When you purchase a Paid Subscription from Crewlog App, you acknowledge that you expressly consent to the commencement of such Paid Subscription immediately, and within the 14 day cooling-off period provided by law. You have the right to cancel your Paid Subscription within 14 days without giving any reason. This cancellation period will expire after 14 days from the day Crewlog App sends you an email confirming the purchase of your Paid Subscription. If you are resident in an EU Member State and cancel your Paid Subscription within this 14 day cooling-off period, you will be liable to pay Crewlog App for your use of your Paid Subscription up to the time you informed us of your decision to cancel your Paid Subscription. This amount will be calculated as a proportion of the total price payable for your Paid Subscription. You may inform Crewlog App of your decision to cancel this contract by a clear statement sent to `} <Text style={{ textDecorationLine: 'underline', color: '#4455ff' }}>{`support@crewlog.com`}</Text> {` with the subject line marked as ‘cancel subscription’. Where you are purchasing a Paid Subscription from Crewlog App, payment will be debited from your account or your credit or debit card account (as applicable) upon or shortly after you have confirmed your order by clicking on the “BUY” button, or in the case of a recurring payment on the date on which your Paid Subscription is renewed. Shortly after confirming your order, you will receive a confirmation email, which attaches these terms and conditions and details of the relevant transaction, which indicates formation of a valid contract between you and us, and that by consenting to such supply. This confirmation email indicates our acceptance of your offer to purchase your Paid Subscription (as applicable).`}</Text>
                    <Text style={{ ...styles.subTitle, paddingTop: 40 }}>Service Codes</Text>
                    <Text style={{ ...styles.text }}>{`Service codes may allow you to receive a discount off Crewlog or other benefits, depending on the type of service code. Service codes must be redeemed at the time you order a subscription to Crewlog and cannot be combined with any other discounts, promotions or offers without Crewlog Apps’ express consent. Redemption of service codes is subject to Crewlog Apps’ approval and valid registration with Crewlog. Service codes are not transferable except with Crewlog App’s express consent. You are solely responsible for the payment of any taxes that you incur as a result of using any service code. Additional services code terms may apply.

Refund Policy – Only Applicable if you are resident in an EU Member State. Where you are resident in an EU Member State, the provisions of this section entitled Refund Policy are applicable to you. When you purchase a Paid Subscription from Crewlog App, you acknowledge that you expressly consent to the commencement of such Paid Subscription immediately, and within the 14 day cooling-off period provided by law. You have the right to cancel your Paid Subscription within 14 days without giving any reason. This cancellation period will expire after 14 days from the day Crewlog App sends you an email confirming the purchase of your Paid Subscription. If you are resident in an EU Member State and cancel your Paid Subscription within this 14 day cooling-off period, you will be liable to pay Crewlog App for your use of your Paid Subscription up to the time you informed us of your decision to cancel your Paid Subscription. This amount will be calculated as a proportion of the total price payable for your Paid Subscription. You may inform Crewlog App of your decision to cancel this contract by a clear statement sent to support@crewlog.com with the subject line marked as ‘cancel subscription’. Where you are purchasing a Paid Subscription from Crewlog App, payment will be debited from your account or your credit or debit card account (as applicable) upon or shortly after you have confirmed your order by clicking on the “BUY” button, or in the case of a recurring payment on the date on which your Paid Subscription is renewed. Shortly after confirming your order, you will receive a confirmation email, which attaches these terms and conditions and details of the relevant transaction, which indicates formation of a valid contract between you and us, and that by consenting to such supply. This confirmation email indicates our acceptance of your offer to purchase your Paid Subscription (as applicable).`}</Text>
                    <Text style={{ ...styles.subTitle, paddingTop: 40 }}>Registration Data &amp; Account Information</Text>
                    <Text style={{ ...styles.text }}>{`You agree to: (i) provide accurate, current and complete information about you as may be prompted by the Crewlog registration process (“Registration Data”); (ii) maintain the security of your password and identification; (iii) maintain and promptly update the Registration Data, and any other information you provide to Crewlog App, in order to keep it accurate, current and complete; and (iv) accept all risk of unauthorized access to the Registration Data and any other information you provide to Crewlog App. You represent and warrant that all Registration Data is accurate, current and complete. You may update your information via Crewlog Mobile App. Crewlog is intended solely for users who are 13 years of age or older. In addition, if you are under 18 years old, you may use Crewlog only with the approval of your parent or guardian.`}</Text>
                    <Text style={{ ...styles.subTitle, paddingTop: 40 }}>Third-Party Sites and Services; Third-Party Materials</Text>
                    <Text style={{ ...styles.text }}>{`Crewlog may provide links to third- party websites, applications, mobile services or other third-party services (“Third-Party Services”) and may also display, link to or otherwise make available third-party content, data, information, events, applications or materials (“Third-Party Materials”).  Crewlog App does not endorse or control, and makes no representations or warranties of any kind regarding, any Third-Party Services or Third-Party Materials, including, but not limited to, the content, accuracy, quality, nature, appropriateness, decency, functionality, performance, reliability, completeness, timeliness, validity, safety, legality or any other aspect thereof. If you access or use any third-party website or application, you should be aware that  Crewlog Apps’ terms and policies, including the Terms, no longer govern. You should review the applicable terms and policies, including, but not limited to, privacy and data gathering practices, of any third-party website or application to which you navigate from Crewlog.`}</Text>
                    <Text style={{ ...styles.subTitle, paddingTop: 40 }}>Third-Party Interactions</Text>
                    <Text style={{ ...styles.text }}>{`The following provisions do not limit the application of the Quebec Consumer Protection Act, if such legislation otherwise applies. Your use of Crewlog and your contact, interaction or dealings with any third-parties arising out of your use of Crewlog is solely at your own risk. You acknowledge and agree that Crewlog App is not responsible or liable in any manner for any loss, damage or harm of any sort incurred as a result of your use of Crewlog.`}</Text>
                    <Text style={{ ...styles.subTitle, paddingTop: 40 }}>User Content and Conduct</Text>
                    <Text style={{ ...styles.text }}>{`You are solely responsible for all content you upload to or use with Crewlog, as well as your conduct and the conduct of anyone using your account. The content you upload to or use with Crewlog must comply with the user content and conduct rules below. Enforcement of the user content and conduct rules set forth in the Terms is solely at Crewlog Apps’ discretion, and failure to enforce such rules in some instances does not constitute a waiver of our right to enforce such rules in other instances. In addition, these rules do not create any private right of action on the part of any third-party or any reasonable expectation that Crewlog will not contain any content that is prohibited by such rules.`}</Text>
                    <Text style={{ ...styles.subTitle, paddingTop: 40 }}>Correction of Errors and Inaccuracies; Limitations on Services.</Text>
                    <Text style={{ ...styles.text }}>{`The information on Crewlog may contain typographical errors or inaccuracies, and may not be complete or current. Company therefore reserves the right to correct any errors, inaccuracies, or omissions, and to change or update information at any time without prior notice. Please note that such errors, inaccuracies, or omissions may relate to service descriptions, pricing, and availability. Company also reserves the right to limit the scope of services (including after you have submitted your request). Company apologizes for any inconvenience this may cause you.You agree not to upload to, transmit, distribute, store, create or otherwise publish through Crewlog any of the following:

 •  User content that is illegal or unlawful, that would constitute, encourage or provide instructions for a criminal offense, or otherwise create liability or violate any local, state, national or international law;

 •  User content that may infringe or violate any patent, trademark, trade secret, copyright, right of privacy, right of publicity or other intellectual or other right of any party; 

 •  Viruses, corrupted data or other harmful, disruptive or destructive files or code, script or other software designed to automate any functionality on Crewlog

 •  You further agree that you are solely responsible for your conduct with respect to Crewlog and you agree that you will not do any of the following in connection with Crewlog:

 •  Use Crewlog for any illegal or unauthorized purpose or engage in, encourage, or promote any illegal activity, or any activity that violates the Terms or any other rules or polices established from time-to-time by Crewlog App;

 •  Modify, adapt or hack Crewlog;

 •  Circumvent or attempt to circumvent any filtering, security measures or other features designed to protect Crewlog; 

and
•  Infringe upon or violate the rights of Crewlog App.

The following provisions do not limit the application of the Quebec Consumer Protection Act, if such legislation otherwise applies. Crewlog App takes no responsibility and assumes no liability for any user conduct or for any user content posted or uploaded on (or otherwise made available via) Crewlog nor is Crewlog App liable for any mistakes, defamation, slander, libel, omissions, or other material you may encounter while using Crewlog. Your use of Crewlog is at your own risk.
Although Crewlog App does not control and has no obligation to screen, edit or monitor any of the user content posted or uploaded on (or otherwise made available via) Crewlog, Crewlog App reserves the right, and has absolute discretion, to remove, screen or edit any user content posted or uploaded on Crewlog at any time and for any reason without notice. Any use of Crewlog in violation of the foregoing violates the Terms and may result in, among other things, termination or suspension of your rights to use Crewlog.
Except for any feedback you provide with respect to Crewlog or any of Crewlog App products and services or as specifically provided otherwise in the Terms or in a separate agreement between you and Crewlog App, you retain ownership of the user content you post or upload on (or otherwise make available via) Crewlog. However, if you post or upload user content on (or otherwise make available via) Crewlog, you grant Crewlog App and its affiliates a non-exclusive, royalty-free, perpetual, irrevocable and fully sublicensable right to use, reproduce, modify, adapt, and distribute such user content solely to enable Crewlog App to operate Crewlog. You represent and warrant that: (i) you own and control all of the rights to the user content that you post or upload on (or otherwise make available via) Crewlog or you otherwise have the right to make available such user content via Crewlog and grant the rights granted in the Terms; and (ii) Crewlog App use and making available the user content you supply does not violate the Terms and will not violate any rights of or cause injury to any person or entity.`}</Text>

                    <Text style={{ ...styles.subTitle, paddingTop: 40 }}>Location Information</Text>
                    <Text style={{ ...styles.text }}>{`Crewlog collects location information and it will be used and disclosed as set forth in the Privacy Policy.
You acknowledge and agree that by accepting the Terms or using Crewlog you affirmatively consent to Crewlog Apps’ collection, use, disclosure and storage of your location information.
You may revoke your consent with respect to Crewlog Apps’ collection, use, disclosure and storage of your location information at any time by contacting `} <Text style={{ textDecorationLine: 'underline', color: '#4455ff' }}>{`support@crewlog.com`}</Text> {` and deleting the app from your mobile device. Please know that if you revoke your consent by doing one of the foregoing or you delete or deactivate your account, we may retain certain information as required by law or for legitimate business purposes. We may also retain cached or archived copies of information about you for a certain period.
If you consent to our collection of location information and you do not subsequently stop the collection of this location information, Crewlog App will continue to collect this location information.
If you consent to our collection of location information, subsequently stop the collection of this location information and later consent to the collection of this location information, Crewlog will resume the collection of location information.
Crewlog App takes reasonable measures to protect your location information from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
Crewlog is for your use and to collect your location information. You may not use Crewlog to collect another individual's location information. If you violate any of this restriction or any other restriction, you will have breached the Terms, which may subject you to prosecution and damages.`}</Text>

                    <Text style={{ ...styles.subTitle, paddingTop: 40 }}>Ownershiop and Suppliers</Text>
                    <Text style={{ ...styles.text }}>{`Crewlog contains the valuable proprietary content of Crewlog App and its licensors and is protected by copyright and other intellectual property laws and treaties. You agree not to use Crewlog except in its intended manner in accordance with the terms and conditions of the Terms`}</Text>
                    <Text style={{ ...styles.subTitle, paddingTop: 40 }}>Modification of Terms</Text>
                    <Text style={{ ...styles.text }}>{`Crewlog App reserves the right to change any of the terms and conditions contained in the Terms, or any policy or guideline of Crewlog App, at any time and in its sole discretion by posting the revisions via Crewlog. Additionally, notice may be provided by sending an email, by posting the revised Terms on the Site or by such other form of notice as determined by Crewlog App. Changes will only become effective at the end of the 30 day period commencing upon the posting of the changes via Crewlog (“Notice Period”). If you disagree with any changes, you may terminate your use of Crewlog within the Notice Period and, if termination is effective prior to the end of your current subscription period, you may be entitled to a prorated refund. Please contact `} <Text style={{ textDecorationLine: 'underline', color: '#4455ff' }}>{`support@crewlog.com`}</Text> {` for refund information. You should review the Terms on a regular basis and read the notices Crewlog App sends to you. Use of Crewlog after the Notice Period will constitute your acceptance of the changes/modifications.`}</Text>
                    <Text style={{ ...styles.subTitle, paddingTop: 40 }}>Termination</Text>
                    <Text style={{ ...styles.text }}>{`The Terms are effective on the date that you first access or use Crewlog, or as otherwise set forth in an order with Crewlog App, and continue for the length of your subscription period. You may terminate these Terms (a) if Crewlog App does not cure any breaches its obligations under these Terms within 30 days of your written notice of such breach; (b) by canceling your Crewlog subscription as set forth above; or (c) as otherwise consented to in writing by Crewlog App. Crewlog App may terminate these Terms if you breach any of the terms and conditions of these Terms. In the event of any termination of the Terms: (i) all licenses granted under the Terms will immediately terminate; and (ii) you must immediately cease all use of Crewlog and destroy or erase all copies of Crewlog in your possession or control. All of the sections of the Terms will survive any termination except the “License” section. Any use of Crewlog after termination is unlicensed and is in violation of the copyright and other rights of Crewlog App`}</Text>
                    <Text style={{ ...styles.subTitle, paddingTop: 40 }}>Disclaimers</Text>
                    <Text style={{ ...styles.text }}>{`THE LAWS OF CERTAIN JURISDICTIONS, INCLUDING QUEBEC'S CONSUMER PROTECTION ACT, DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR CONDITIONS OR THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE BELOW DISCLAIMERS, EXCLUSIONS, OR LIMITATIONS MIGHT NOT APPLY TO YOU, AND YOU MIGHT HAVE ADDITIONAL RIGHTS. YOU EXPRESSLY ACKNOWLEDGE AND AGREE THAT YOUR USE OF CREWLOG IS AT YOUR SOLE RISK AND THAT THE ENTIRE RISK AS TO SATISFACTORY QUALITY, PERFORMANCE, SAFETY, ACCURACY AND EFFORT IS WITH YOU. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, CREWLOG IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS. CREWLOG APP DISCLAIMS ANY AND ALL WARRANTIES AND REPRESENTATIONS (EXPRESS OR IMPLIED, ORAL OR WRITTEN) WITH RESPECT TO THE TERMS, CREWLOG, ALL RELATED PRODUCTS AND SERVICES, USER CONTENT, THIRD-PARTY SERVICES OR THIRD-PARTY MATERIALS, WHETHER ALLEGED TO ARISE BY OPERATION OF LAW, BY REASON OF CUSTOM OR USAGE IN THE TRADE, BY COURSE OF DEALING OR OTHERWISE, INCLUDING ANY AND ALL: (I) WARRANTIES OF MERCHANTABILITY; (II) WARRANTIES OF FITNESS OR SUITABILITY FOR ANY PURPOSE (WHETHER OR NOT CREWLOG APP KNOWS, HAS REASON TO KNOW, HAS BEEN ADVISED OR IS OTHERWISE AWARE OF ANY SUCH PURPOSE); AND (III) WARRANTIES OF NON-INFRINGEMENT OR CONDITION OF TITLE. CREWLOG APP DOES NOT WARRANT THAT THE FUNCTIONS CONTAINED IN CREWLOG WILL BE ACCURATE OR MEET YOUR REQUIREMENTS, THAT THE OPERATION OF CREWLOG WILL BE UNINTERRUPTED OR ERROR-FREE, OR THAT ANY DEFECTS IN CREWLOG WILL BE CORRECTED. NO ORAL OR WRITTEN INFORMATION, GUIDELINES OR ADVICE GIVEN BY CREWLOG OR ITS AUTHORIZED REPRESENTATIVE WILL CREATE A WARRANTY.`}</Text>
                    <Text style={{ ...styles.subTitle, paddingTop: 40 }}>Indemnification</Text>
                    <Text style={{ ...styles.text }}>{`You agree, at your sole expense, to defend, indemnify and hold CREWLOG APP, our service providers and consultants, and their respective directors, employees and agents, harmless from and against any and all actual or threatened suits, actions, proceedings (at law or in equity), claims, damages, payments, deficiencies, fines, judgments, settlements, liabilities, losses, costs and expenses (including, but not limited to, reasonable attorney fees, costs, penalties, interest and disbursements) caused by, arising out of, resulting from, attributable to or in any way incidental to: (i) your conduct; (ii) your violation of the Terms or the rights of any third-party; or (iii) any user content.`}</Text>
                    <Text style={{ ...styles.subTitle, paddingTop: 40 }}>Limitation of Liability</Text>
                    <Text style={{ ...styles.text }}>{`The following provision does not limit the application of the Quebec Consumer Protection Act, if such legislation otherwise applies. TO THE EXTENT NOT PROHIBITED BY LAW, IN NO EVENT WILL CREWLOG APP BE LIABLE TO YOU OR ANY THIRD-PARTY FOR ANY DIRECT, INCIDENTAL, SPECIAL, INDIRECT, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES WHATSOEVER INCLUDING, BUT NOT LIMITED TO, DAMAGES FOR LOSS OF PROFITS, LOSS OF DATA, BUSINESS INTERRUPTION OR ANY OTHER COMMERCIAL DAMAGES OR LOSSES, ARISING OUT OF OR RELATED TO CREWLOG, RELATED PRODUCTS AND SERVICES, USER CONTENT, THIRD-PARTY SERVICES OR THIRD-PARTY MATERIALS, HOWEVER CAUSED, REGARDLESS OF THE THEORY OF LIABILITY (CONTRACT, WARRANTY, TORT (INCLUDING NEGLIGENCE, WHETHER ACTIVE, PASSIVE OR IMPUTED), PRODUCT LIABILITY, STRICT LIABILITY OR OTHER THEORY) AND EVEN IF CREWLOG APP HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. SOME STATES DO NOT ALLOW THE EXCLUSION OR LIMITATION OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THIS LIMITATION MAY NOT APPLY TO YOU. IN NO EVENT WILL CREWLOG APPS TOTAL LIABILITY, WHETHER IN CONTRACT, WARRANTY, TORT (INCLUDING NEGLIGENCE, WHETHER ACTIVE, PASSIVE OR IMPUTED), PRODUCT LIABILITY, STRICT LIABILITY OR OTHER THEORY, ARISING OUT OF OR RELATING TO THE USE OF OR INABILITY TO USE THE SERVICE EXCEED THE FEE FOR THE SERVICE (AS OPPOSED TO ANY OTHER FEES/COSTS INCLUDING, BUT NOT LIMITED TO, ANY FEES ASSOCIATED WITH YOUR DEVICE).`}</Text>
                    <Text style={{ ...styles.subTitle, paddingTop: 40 }}>Copyright Complaints</Text>
                    <Text style={{ ...styles.text }}>{`CREWLOG APP takes intellectual property rights seriously. In accordance with the Digital Millennium Copyright Act (DMCA) and other applicable law, CREWLOG APP has adopted a policy of terminating, in appropriate circumstances and at CREWLOG APP’S sole discretion, subscribers or account holders who are deemed to be repeat infringers. If you believe in good faith that any content on CREWLOG infringes your copyright, you (or your agent) may send us a notice requesting that the content be removed, or access to it blocked. Notices and counter-notices must meet the then current statutory requirements imposed by the DMCA (see `} <Text onPress={() => Linking.openURL('www.loc.gov/copyright')} style={{ textDecorationLine: 'underline', color: '#4455ff' }}>{`www.loc.gov/copyright`}</Text> {` for details). Notices and counter notices should be sent to our designated agent at:

CREWLOG APP INC.
Attn: Copyright Complaints
110A Center Ave
Middletown, RI 02842
`} <Text style={{ textDecorationLine: 'underline', color: '#4455ff' }}>{`support@crewlog.com`}</Text> {``}</Text>
                    <Text style={{ ...styles.subTitle, paddingTop: 40 }}>Electronic Communications</Text>
                    <Text style={{ ...styles.text }}>{`Notwithstanding any terms to the contrary in the Terms, CREWLOG APP may choose to electronically deliver all communications with you, which may include: (i) email to your email address listed in your Registration Data; or (ii) posting messages that are displayed to you when you log into or access your account. CREWLOG APP electronic communications to you may transmit or convey information about action taken as a result of your request, portions of your requests that may be incomplete or require additional explanation, any notices required under applicable Law and any other notices. You agree to do business electronically with Crewlog App, and to receive, electronically, all current and future notices, disclosures, communications and information, and that the aforementioned provided electronically satisfies any legal requirement that such communications be in writing. An electronic notice will be deemed to have been received the day of receipt as evidenced by such email.`}</Text>
                    <Text style={{ ...styles.subTitle, paddingTop: 40 }}>Governing Law; Arbitration</Text>
                    <Text style={{ ...styles.text }}>{`(Not applicable to Quebec consumers) PLEASE READ THE FOLLOWING PARAGRAPH CAREFULLY BECAUSE IT REQUIRES YOU TO ARBITRATE DISPUTES WITH CREWLOG APP AND IT LIMITS THE MANNER IN WHICH YOU CAN SEEK RELIEF FROM CREWLOG APP.
You and Crewlog App agree to arbitrate any dispute arising from the Terms or relating to Crewlog except that you and Crewlog App are not required to arbitrate any dispute in which either party seeks equitable or other relief for the alleged unlawful use of copyrights, trademarks, trade names, logos, trade secrets or patents.

ARBITRATION PREVENTS YOU FROM SUING IN COURT OR FROM HAVING A JURY TRIAL.

You and Crewlog App agree that you will notify each other of any dispute within 30 days of when it arises, that you will attempt informal resolution prior to any demand for arbitration, that any arbitration will occur in the state of Florida and that arbitration will be conducted confidentially by a single arbitrator in accordance with the Rules of the American Arbitration Association. You and Crewlog App also agree that the state or federal courts in Florida have exclusive jurisdiction over any appeals of an arbitration award and over any suit between the parties not subject to arbitration and that such appeals or suit will be governed by applicable U.S. federal law. Other than class procedures and remedies discussed below, the arbitrator has the authority to grant any remedy that would otherwise be available in court. WHETHER THE DISPUTE IS HEARD IN ARBITRATION OR IN COURT, YOU AND CREWLOG APP WILL NOT COMMENCE AGAINST THE OTHER A CLASS ACTION, CLASS ARBITRATION OR OTHER REPRESENTATIVE ACTION OR PROCEEDING.

For Quebec consumers: These Terms and any dispute of any sort that might arise between you and Crewlog shall be governed by the laws of the Province of Quebec, without reference to its conflict of laws provisions, and the laws of Canada applicable therein, and any disputes will be submitted to the courts of competent jurisdiction of the District of Montreal (Quebec).`}</Text>
                    <Text style={{ ...styles.subTitle, paddingTop: 40 }}>Users of iPhone, iPod Touch or iPad</Text>
                    <Text style={{ ...styles.text }}>{`Notwithstanding any terms to the contrary in the Terms, the following additional terms will apply to the download of Crewlog for use on the iPhone, iPod Touch or iPad:
 
  •  Acknowledgement. You and Crewlog App acknowledge that the terms are solely between you and Crewlog App, and not with Apple, Inc. (“Apple”), and Crewlog App, not Apple, is solely responsible for Crewlog and the content contained within Crewlog. You further acknowledge that the usage rules for Crewlog are subject to any additional restrictions set forth in the Usage Rules for the Apple App Store Terms of Service as of the date you download Crewlog. In the event of any conflict between the terms and conditions of the Usage Rules for the Apple App Store Terms of Service and the terms and conditions of the Terms, the terms and conditions of the Usage Rules for the Apple App Store Terms of Service will govern if they are more restrictive.

  •  Scope of License. The license granted to you is limited to a non-transferable license to use Crewlog on any iPhone, iPod touch or iPad that you own or control as permitted by the Usage Rules set forth in the Apple App Store Terms of Service.

  •  Maintenance and Support. Crewlog App is solely responsible for providing maintenance and support services with respect to Crewlog. You acknowledge and agree that Apple has no obligation whatsoever to furnish any maintenance and support services with respect to Crewlog.

  •  Warranty. You acknowledge and agree that Apple is not responsible for any product warranties, whether express or implied by law, with respect to Crewlog. In the event of any failure of Crewlog to conform to any applicable warranty, you may notify Apple, and Apple will refund the purchase price, if any, paid to Apple for Crewlog by you; and to the maximum extent permitted by applicable law, Apple will have no other warranty obligation whatsoever with respect to Crewlog. You also acknowledge and agree that to the extent that there are any applicable warranties, or any other claims, losses, liabilities, damages, costs or expenses attributable to any failure to conform to any such applicable warranty, such will be the sole responsibility of Crewlog App. However, you understand and agree that in accordance with the Terms, Crewlog App has disclaimed all warranties of any kind with respect to Crewlog, and therefore, there are no warranties applicable to Crewlog, except those implied by law.

  •  Product Claims. You and Crewlog App acknowledge and agree that as between Apple and Crewlog App, Crewlog App, not Apple, is responsible for addressing any of your claims or any third-party claims relating to Crewlog or your possession and/or use of Crewlog, including, but not limited to: (i) product liability claims; (ii) any claim that Crewlog fails to conform to any applicable legal or regulatory requirement; and (iii) claims arising under consumer protection or similar legislation.

  •  Intellectual Property Rights. You and Crewlog App acknowledge and agree that, in the event of any third-party claim that Crewlog or your possession and use of Crewlog infringes that third-party’s intellectual property rights, Crewlog App, and not Apple, will be solely responsible for the investigation, defense, settlement and discharge of any such intellectual property infringement claim to the extent required under the Terms.

  •  Legal Compliance. You represent and warrant that: (i) you are not located in a country that is subject to a U.S. Government embargo, or that has been designated by the U.S. Government as a “terrorist supporting” country; and (ii) you are not listed on any U.S. Government list of prohibited or restricted parties.

  •  Developer Name and Address. Any end-user questions, complaints or claims with respect to Crewlog should be directed to: CREWLOG APP, Inc.
110A Center Ave
Middletown, RI 02842
support@crewlog.com

  •  Third-Party Beneficiary. The parties acknowledge and agree that Apple, and Apple’s subsidiaries, are third-party beneficiaries of the Terms, and that, upon your acceptance of the terms and conditions of the Terms, Apple will have the right (and will be deemed to have accepted the right) to enforce any of the terms and conditions of the Terms against you as a third-party beneficiary thereof.`}</Text>
                    <Text style={{ ...styles.subTitle, paddingTop: 40 }}>Contact Us</Text>
                    <Text style={{ ...styles.text }}>{`If you have any questions, comments, or concerns regarding these Terms, please contact us at `} <Text style={{ textDecorationLine: 'underline', color: '#4455ff' }}>{`support@crewlog.com`}</Text></Text>

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
        fontWeight: '400',
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

export default connect(mapStateToProps, mapDispatchToProps)(Terms);
