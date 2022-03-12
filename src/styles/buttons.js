import { width } from '../components/Carousel/Carousel';
import Colors from './colors';

// Buttons

const Buttons = {
    defaultBtn: {
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        paddingTop: 10,
        marginTop: 5,
        marginBottom: 5,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: Colors.colorGrey5,
    },
    defaultBtnText: {
        fontFamily: 'SourceSansPro-Regular',
        fontSize: width / 26,
        fontStyle: 'normal',
        letterSpacing: 0,
        textAlign: 'center',
        color: Colors.colorGrey2,
    },
    greenBtn: {
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.colorGreen,
        paddingTop: 10,
        marginTop: 5,
        marginBottom: 5,
    },
    greenBtnText: {
        fontFamily: 'SourceSansPro-Regular',
        fontSize: width / 26,
        fontStyle: 'normal',
        letterSpacing: 0,
        textAlign: 'center',
        color: '#FFF',
    },
    noBgBtn: {
        height: 40,
        borderRadius: 20,
        backgroundColor: 'transparent',
        paddingTop: 10,
        marginTop: 5,
        marginBottom: 5,
    },
};

export default Buttons;
