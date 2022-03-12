// import * as fb from 'firebase';
import firebase from '@react-native-firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyCsl2GdtLFVLMROlqUB5QDFXYjNnFNU_wM",
    authDomain: "crewlog-app.appspot.com",
    databaseURL: "https://crewlog-app.firebaseio.com",
    projectId: "campushead-app",
    storageBucket: "campushead-app.appspot.com",
    messagingSenderId: "296660376052",
    appId: "1:296660376052:ios:5578e62020341d935641a1"
};

const FirebaseApp = firebase.initializeApp(firebaseConfig)

export default FirebaseApp;