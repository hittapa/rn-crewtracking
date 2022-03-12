import AsyncStorage from '@react-native-community/async-storage';
import securityConstants from '../../../constants/security';
import { isNil } from 'lodash';
import AuthToken from '../../auth/AuthToken';

class LocalStorageService {
    static async loadToken(): Promise {
        const token = await AsyncStorage.getItem(
            securityConstants.TOKEN_STORAGE_KEY
        )
            .then(data => {
                if (!isNil(data)) {
                    data = JSON.parse(data);
                    // eslint-disable-next-line no-shadow
                    const token = new AuthToken(data);
                    return Promise.resolve(token);
                } else {
                    return null;
                }
            })
            .catch(e => Promise.reject(e));

        return token;
    }

    static storeToken(token) {
        
        AsyncStorage.setItem(
            securityConstants.TOKEN_STORAGE_KEY,
            JSON.stringify(token)
        )
            .then()
            .catch(e => console.warn(e));
    }

    static removeToken() {
        AsyncStorage.removeItem(securityConstants.TOKEN_STORAGE_KEY);
    }

    static async loadUser(): Promise {
        const user = await AsyncStorage.getItem(
            securityConstants.USER_STORAGE_KEY
        )
            .then(data => {
                if (!isNil(data)) {
                    data = JSON.parse(data);
                    return Promise.resolve(data);
                }
                return null;
            })
            .catch(e => Promise.reject(e));

        return user;
    }

    static storeUser(user) {
        AsyncStorage.setItem(
            securityConstants.USER_STORAGE_KEY,
            JSON.stringify(user)
        )
            .then()
            .catch(e => console.warn(e));
    }

    static removeUser() {
        AsyncStorage.removeItem(securityConstants.USER_STORAGE_KEY);
    }

    static storeCurrentVessel(vessel) {
        AsyncStorage.setItem(
            'currentVessel',
            JSON.stringify(vessel)
        )
            .then()
            .catch(e => console.warn(e));
    }

    static async getCurrentVessel(): Promise {
        const vessel = await AsyncStorage.getItem('currentVessel')
            .then(data => {
                if (!isNil(data)) {
                    data = JSON.parse(data);
                    return Promise.resolve(data);
                }
                return null;
            })
            .catch(e => Promise.reject(e));

        return vessel;
    }

    static removeCurrentVessel() {
        AsyncStorage.removeItem('currentVessel');
    }
}

export default LocalStorageService;
