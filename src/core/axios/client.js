import axios from 'axios';
import LocalStorageService from '../services/auth/LocalStorageService';
import SecurityClient from '../services/auth/SecurityClient';
import { isNil, has, get } from 'lodash';
import AxiosResponseHandler from '../services/axios/AxiosResponseHandler';
import appConstants from '../../constants/app';

const client = axios.create({
    baseURL: appConstants.BASEURL,
    timeout: 10000,
});

client.interceptors.request.use(
    async config => {
        await LocalStorageService.loadToken().then(token => {
            if (!isNil(token)) {
                config.headers.Authorization = 'Bearer ' + token.accessToken;
            }
        });
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

client.interceptors.response.use(
    response => {
        const axiosResponseHandler = new AxiosResponseHandler(response);
        return axiosResponseHandler.getData();
    },
    error => {
        const originalRequest = error.config;
        if (has(error, 'response.status')) {
            if (get(error, 'response.status') === 401) {
                // not authorised
                originalRequest._retry = true;
                // get token from local storage
                return LocalStorageService.loadToken()
                    .then(tokenFromStorage => {
                        const securityClient = new SecurityClient(client);
                        const token = get(tokenFromStorage, 'refreshToken');

                        // refresh the token
                        return securityClient
                            .refreshAccessToken(token)
                            .then(token => token);
                    })
                    .then(token => {
                        LocalStorageService.storeToken(token);
                        originalRequest.headers.Authorization =
                            'Bearer ' + token.accessToken;

                        return client(originalRequest);
                    })
                    .catch(error => Promise.reject(error));
            }

            return Promise.reject(error);
        }
    }
);

export default client;
