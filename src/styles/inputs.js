import { width } from '../components/Carousel/Carousel';
import Colors from './colors';

// Inputs

const Inputs = {
    defaultInput: {
        height: 55,
        padding: 15,
        marginTop: 4,
        marginBottom: 4,
        borderRadius: 10,
        backgroundColor: '#FFF',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: Colors.colorGrey5,
        fontFamily: 'SourceSansPro-Regular',
        fontSize: width/24.5,
    },
    defaultTextarea: {
        height: 'auto',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#FFF',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: Colors.colorGrey5,
        fontFamily: 'SourceSansPro-Regular',
        fontSize: width/24.5,
    },
};

export default Inputs;
