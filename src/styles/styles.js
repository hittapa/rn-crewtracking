import Constants from 'expo-constants';
import { Dimensions, Platform } from 'react-native';
import { width } from '../components/Carousel/Carousel';
import Colors from './colors';

export const Gradient = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
};

// Containers

export const FlexContainer = {
    flex: 1,
};

export const safeView = {
    flex: 1,
    marginTop: Platform.select({
        ios: Constants.statusBarHeight,
        android: 0
    }),
};

export const scrollView = {
    marginVertical: 50,
};

// Logo

export const Logo236 = {
    width: 236,
    height: 89,
};

// Headlines & texts

export const headLines = {
    headLine1: {
        fontFamily: 'Roboto-Thin',
        fontSize: width / 17,
        color: '#FFF',
        marginTop: 40,
    },
};

export const textLines = {
    defaultText: {
        fontFamily: 'SourceSansPro-Light',
        fontSize: width/20.5,
        color: Colors.colorGrey2,
    },
    defaultText2: {
        fontFamily: 'SourceSansPro-Regular',
        fontSize: width / 26,
        color: '#FFF',
    },
    defaultText3: {
        fontFamily: 'SourceSansPro-Regular',
        fontSize: width / 28,
        color: '#FFF',
    },
    defaultText4: {
        fontFamily: 'SourceSansPro-Regular',
        fontSize: width / 33,
        color: '#FFF',
    },
};

export const errorMessage = {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: width / 26,
    color: Colors.colorRed,
    textAlign: 'left',
    flex: 1,
    alignSelf: 'flex-start',
};

export const inputForm = {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: .5,
    borderBottomColor: '#c6c6c8',
    // elevation: 1,
    paddingHorizontal: 16,
    height: 44,
    alignItems: 'center'
}

export const inputBox = {
    textAlign: 'right',
    width: Dimensions.get('screen').width * .5 - 16,
    fontSize: width / 26,
    height: 40,
}

export const labelText = {
    fontSize: width/24,
    color: '#000',
    paddingVertical: 11,
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
    letterSpacing: -0.41,
    flexShrink: 1,
}

export const headerTitle = {
    color: 'black',
    fontSize: width / 19,
    fontFamily: 'Roboto-Bold',
    fontWeight: '900',
    letterSpacing: -0.41
}

export const spaceH = {
    height: 24
}

export const header = {
    height: 50,
    top: 0,
    left: 0,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: .5,
    borderBottomColor: '#c8c8c8'
}