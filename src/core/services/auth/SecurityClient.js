import securityConstants from '../../../constants/security';
import querystring from 'querystring';
import AuthToken from '../../auth/AuthToken';
import { get, isNil } from 'lodash';
import AxiosErrorHandler from '../../services/axios/AxiosErrorHandler';
import { route } from '../../../utils/router';

function SecurityClient(client) {
    this.accessTokenUri = securityConstants.AUTH_ACCESS_TOKEN_URI;
    this.registerStepOneUri = securityConstants.REGISTER_STEP_ONE_CHECK_URI;
    this.registerUri = securityConstants.REGISTER_URI;
    this.getMeUri = securityConstants.GET_ME_URI;
    this.forgotPasswordRequestUri =
        securityConstants.FORGOT_PASSWORD_REQUEST_URI;
    this.verifyCodeUri =
        securityConstants.VERIFYCODE;
    this.resetpasswordUri =
        securityConstants.RESET_PASSWORD;
    this.VesselType = securityConstants.GET_VESSEL_TYPE;
    this.saveVessel = securityConstants.SAVE_NEW_VESSEL;
    this.vesselDetailedType = securityConstants.VESSEL_DETAILED_TYPE;
    this.vesselValidateUrl = securityConstants.VALIDATE_NEW_VESSEL;
    this.vesselsGetUrl = securityConstants.VESSELS_GET_URL;
    this.vesselDeleteUrl = securityConstants.VESSEL_DELETE_URL;
    this.vesselUpdateUrl = securityConstants.VESSEL_UPDATE;
    this.userUpdateUrl = securityConstants.USER_UPDATE;
    this.getTripsUrl = securityConstants.GET_TRIPS;
    this.updateTripUrl = securityConstants.UPDATE_TRIP;
    this.getRoutesUrl = securityConstants.GET_ROUTES;
    this.deleteTripUrl = securityConstants.DELETE_TRIP;
    this.submitEndorsementDataUrl = securityConstants.SUBMIT_ENDORSEMENT;
    this.getEndorsementDataUrl = securityConstants.GET_ENDORSEMENT;
    this.deleteEndorsementUrl = securityConstants.DELETE_ENDORSEMENT;
    this.checkCurrentLocationUrl = securityConstants.CHECK_CURRENT_LOCATION;
    this.createTripCardUrl = securityConstants.CREATE_TRIP_CARD;
    this.endTripUrl = securityConstants.END_TRIP;
    this.client = client;
}

SecurityClient.prototype.requestAccessToken = function (username, password) {
    const createExpiresAt = expiresIn => {
        const now = new Date();
        now.setSeconds(now.getSeconds() + expiresIn);
        return now.getTime();
    };

    return this.client
        .post(
            this.accessTokenUri,
            querystring.stringify({
                grant_type: 'username_password',
                username: username,
                password: password,
            })
        )
        .then(function (response) {
            const expiresAt = createExpiresAt(get(response.data, 'expires_in'));

            const data = {
                tokenType: get(response.data, 'token_type'),
                accessToken: get(response.data, 'access_token'),
                refreshToken: get(response.data, 'refresh_token'),
                expiresIn: get(response.data, 'expires_in'),
                expiresAt: expiresAt,
            };
            const user = get(response.data, 'user');
            return {
                token: new AuthToken(data),
                user: user
            };
        })
        .catch(function (error) {
            console.log('----------------------- token getting error ----------------------------')
            console.log(JSON.stringify(error))
            return Promise.reject(new Error(error));
        });
};

SecurityClient.prototype.refreshAccessToken = function (refreshToken) {
    return this.client
        .post(
            this.accessTokenUri,
            querystring.stringify({
                grant_type: 'crewlog_refresh_token',
                refresh_token: refreshToken,
            })
        )
        .then(function (response) {
            const expiresAt = createExpiresAt(get(response.data, 'expires_in'));
            const data = {
                tokenType: get(response.data, 'token_type'),
                accessToken: get(response.data, 'access_token'),
                refreshToken: get(response.data, 'refresh_token'),
                expiresIn: get(response.data, 'expires_in'),
                expiresAt: expiresAt,
            };
            return Promise.resolve(new AuthToken(data));
        })
        .catch(function (error) {
            return Promise.reject(new Error(error));
        });
};

SecurityClient.prototype.register = function (data, step = 2) {
    let url = this.registerUri;
    if (step === 1) {
        url = this.registerStepOneUri;
    }
    
    return this.client
        .post(url, data)
        .then(function (response) {
            console.log("============> Registration step : " + step);
            console.log(response)
            return true;
        })
        .catch(function (error) {
            // handles errors from backend
            console.log('registering erro _+_+_+_+_++_')
            console.log(JSON.stringify(error))
            let axiosErrorHandler = new AxiosErrorHandler(error);
            const errors = axiosErrorHandler.getErrors();
            console.log(error.message)
            return Promise.reject(error.message);
        });
};

SecurityClient.prototype.forgotPasswordRequest = function (email) {

    return this.client
        .post(this.forgotPasswordRequestUri, { email: email })
        .then(function (response) {
            return true;
        })
        .catch(error => {
            // handles errors from backend
            let axiosErrorHandler = new AxiosErrorHandler(error);
            const errors = axiosErrorHandler.getErrors();

            return Promise.reject(errors);
        });
};

SecurityClient.prototype.verifyCode = function (email, code) {

    return this.client
        .post(this.verifyCodeUri, { email: email, code: code })
        .then(function (response) {
            return Promise.resolve(response);
        })
        .catch(error => {
            // handles errors from backend
            let axiosErrorHandler = new AxiosErrorHandler(error);
            const errors = axiosErrorHandler.getErrors();

            return Promise.reject(errors);
        });
};

SecurityClient.prototype.resetpassword = function (email, code, password) {

    return this.client
        .post(this.resetpasswordUri, { email: email, code: code, password: password })
        .then(function (response) {
            return Promise.resolve(response);
        })
        .catch(error => {
            // handles errors from backend
            let axiosErrorHandler = new AxiosErrorHandler(error);
            const errors = axiosErrorHandler.getErrors();

            return Promise.reject(errors);
        });
};

SecurityClient.prototype.getLoggedInUser = function () {
    return this.client
        .get(this.getMeUri)
        .then(function (response) {
            console.log('------------------ getting logged in user -----------------')
            console.log(JSON.stringify(response.data))
            return Promise.resolve(response.data);
        })
        .catch(function (error) {
            console.log('------------------ getting ERROR #&@(#$#@&(*)@#@) -----------------')
            console.log(error)
            return Promise.reject(error);
        });
};

SecurityClient.prototype.getVesselType = function () {
    return this.client
        .get(this.VesselType)
        .then(function (response) {
            console.log('===================== Vessel types ===================')
            false && console.log(response)
            return Promise.resolve(response.data);
        })
        .catch(function (error) {
            return Promise.reject(error);
        })
}

SecurityClient.prototype.saveNewVessel = function (data) {
    return this.client
        .post(this.saveVessel, data)
        .then(function (response) {
            console.log('===================== Saved Successfully ===================')
            false && console.log(response)
            return Promise.resolve(response.data);
        })
        .catch(function (error) {
            return Promise.reject(error);
        })
}

SecurityClient.prototype.getDetailedType = function (data) {
    return this.client
        .post(this.vesselDetailedType, data)
        .then(function (response) {
            console.log('===================== Vessel Detailed Types ===================')
            false && console.log(response)
            return Promise.resolve(response.data);
        })
        .catch(function (error) {
            console.log('-----------============= Post error =============--------------')
            console.log(error)
            return Promise.reject(error);
        })
}

SecurityClient.prototype.validateNewVessel = function (data) {
    return this.client
        .post(this.vesselValidateUrl, data)
        .then(function (response) {
            console.log('===================== Vessel Detailed Types ===================')
            false && console.log(response)
            return Promise.resolve(response.data);
        })
        .catch(function (error) {
            console.log('-----------============= Post error =============--------------')
            console.log(error)
            return Promise.reject(error);
        })
}


SecurityClient.prototype.getVessels = function (data) {
    return this.client
        .post(this.vesselsGetUrl, data)
        .then(function (response) {
            console.log('===================== Getting Vessels ===================')
            false && console.log(response)
            return Promise.resolve(response.data.vessels);
        })
        .catch(function (error) {
            console.log('-----------============= Getting Vessels Post error =============--------------')
            console.log(error.message)
            return Promise.reject(error);
        })
}

SecurityClient.prototype.deleteVessel = function (data) {
    return this.client
        .post(this.vesselDeleteUrl, data)
        .then(function (response) {
            console.log('===================== Deleting Vessel ===================')
            false && console.log(response)
            return Promise.resolve(response.data.vessels);
        })
        .catch(function (error) {
            console.log('-----------============= Post error =============--------------')
            console.log(error)
            return Promise.reject(error);
        })
}

SecurityClient.prototype.updateVessel = function (data) {
    return this.client
        .post(this.vesselUpdateUrl, data)
        .then(function (response) {
            console.log('===================== Updating Vessel ===================')
            false && console.log(response.data)
            return Promise.resolve(response.data.vessels);
        })
        .catch(function (error) {
            console.log('-----------============= Post error =============--------------')
            console.log(error)
            return Promise.reject(error);
        })
}

SecurityClient.prototype.updateUser = function (data) {
    return this.client
        .post(this.userUpdateUrl, data)
        .then(function (response) {
            console.log('===================== Updating User ===================')
            true && console.log(response.data)
            return Promise.resolve(response.data.user);
        })
        .catch(function (error) {
            console.log('-----------============= Post error =============--------------')
            console.log(error)
            return Promise.reject(error);
        })
}

SecurityClient.prototype.getTrips = function (data) {
    return this.client.post(this.getTripsUrl, data)
        .then(function (response) {
            return Promise.resolve({
                trips: response.data.trips,
                locodes: response.data.locodes
            });
        })
        .catch(function (error) {
            console.log('-----------============= Getting Trips Post error =============--------------')
            console.log(error.message)
            return Promise.reject(error);
        })
}

SecurityClient.prototype.updateTrip = function (data) {
    return this.client.post(this.updateTripUrl, data)
        .then(function (response) {
            console.log('===================== Getting Trips ===================')
            false && console.log(response)
            return Promise.resolve(response.data);
        })
        .catch(function (error) {
            console.log('-----------============= Getting Trips Post error =============--------------')
            console.log(error.message)
            return Promise.reject(error);
        })
}

SecurityClient.prototype.getRoutes = function (data) {
    return this.client.post(this.getRoutesUrl, data)
        .then(function (response) {
            console.log('===================== Getting Routes ===================')
            false && console.log(response)
            return Promise.resolve(response.data.routes);
        })
        .catch(function (error) {
            console.log('-----------============= Post error =============--------------')
            console.log(error)
            return Promise.reject(error);
        })
}

SecurityClient.prototype.deleteTrip = function (data) {
    return this.client.post(this.deleteTripUrl, data)
        .then(function (response) {
            return Promise.resolve(response.data);
        })
        .catch(function (error) {
            console.log('-----------============= Post error =============--------------')
            console.log(error)
            return Promise.reject(error);
        })
}

SecurityClient.prototype.submitEndorsementData = function (data) {
    return this.client.post(this.submitEndorsementDataUrl, data)
        .then(function (response) {
            return Promise.resolve(response.data);
        })
        .catch(function (error) {
            console.log('-----------============= Post error =============--------------')
            console.log(error)
            return Promise.reject(error);
        })
}

SecurityClient.prototype.getEndorsements = function (data) {
    return this.client.post(this.getEndorsementDataUrl, data)
        .then(function (response) {
            return Promise.resolve(response.data);
        })
        .catch(function (error) {
            console.log('-----------============= Post error =============--------------')
            console.log(error)
            return Promise.reject(error);
        })
}

SecurityClient.prototype.deleteEndorsement = function (data) {
    return this.client.post(this.deleteEndorsementUrl, data)
        .then(function (response) {
            return Promise.resolve(response.data);
        })
        .catch(function (error) {
            console.log('-----------============= Post error =============--------------')
            console.log(error)
            return Promise.reject(error);
        })
}

SecurityClient.prototype.checkCurrentLocation = function (data) {
    return this.client.post(this.checkCurrentLocationUrl, data)
        .then(function (response) {
            return Promise.resolve(response.data);
        })
        .catch(function (error) {
            return Promise.reject(error);
        })
}

SecurityClient.prototype.createTripCard = function (data) {
    console.log("Creating trip card .............................");
    return this.client.post(this.createTripCardUrl, data)
        .then(function (response) {
            return Promise.resolve(response.data);
        })
        .catch(function (error) {
            return Promise.reject(error);
        })
}

SecurityClient.prototype.endTrip = function (data) {
    return this.client.post(this.endTripUrl, data)
        .then(function (response) {
            console.log(response.data);
            return Promise.resolve(response.data);
        })
        .catch(function (error) {
            return Promise.reject(error);
        })
}

const createExpiresAt = expiresIn => {
    const now = new Date();
    now.setSeconds(now.getSeconds() + expiresIn);
    return now.getTime();
};

export default SecurityClient;
