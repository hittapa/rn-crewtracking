import Colors from './colors';

// Modal styles

const ModalStyles = {
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        height: 359
    },
    modalView: {
        margin: 20,
        backgroundColor: '#FFF',
        borderRadius: 11,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    openButton: {
        backgroundColor: Colors.colorCyan,
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: '#FFF',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
};

export default ModalStyles;
