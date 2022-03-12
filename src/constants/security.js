const prefix = '/auth';
// const prefix = '';

const securityConstants = {
    STATE_KEY: 'SECURITY',
    TOKEN_STORAGE_KEY: 'CREWLOG_TOKEN_STORAGE_KEY',
    USER_STORAGE_KEY: 'CREWLOG_USER_STORAGE_KEY',
    AUTH_ACCESS_TOKEN_URI: prefix + '/token',
    REGISTER_STEP_ONE_CHECK_URI: prefix + '/register/step-one/check',
    REGISTER_URI: prefix + '/register',
    GET_ME_URI: prefix + '/me',
    FORGOT_PASSWORD_REQUEST_URI: prefix + '/forgotpassword',
    VERIFYCODE: prefix + '/verifyCode',
    RESET_PASSWORD: prefix + '/resetpassword',
    FORGOT_PASSWORD_REQUEST_ACTION_STATE_KEY: 'FORGOT_PASSWORD_REQUEST',
    LOGIN_ACTION_KEY: 'LOGIN',
    LOGIN_FAIL_ACTION_KEY: 'LOGIN_FAIL',
    LOGIN_SUCCESS_ACTION_KEY: 'LOGIN_SUCCESS',
    STORE_TOKEN_ACTION_KEY: 'STORE_TOKEN',
    REMOVE_TOKEN_ACTION_KEY: 'REMOVE_TOKEN',
    GET_VESSEL_TYPE: prefix + '/getVesselType',
    SAVE_NEW_VESSEL: prefix + '/saveVessel',
    VESSEL_DETAILED_TYPE: prefix + '/detailedType',
    VALIDATE_NEW_VESSEL: prefix + '/validateNewVessel',
    VESSELS_GET_URL: prefix + '/getVessels',
    VESSEL_DELETE_URL: prefix + '/deleteVessel',
    VESSEL_UPDATE: prefix + '/updateVessel',
    USER_UPDATE: prefix + '/updateUser',
    UPDATE_LOCATION: prefix + '/updateLocation',
    GET_TRIPS: prefix + '/getTrips',
    UPDATE_TRIP: prefix + '/updateTrip',
    GET_ROUTES: prefix + '/getRoutes',
    DELETE_TRIP: prefix + '/deleteTrip',
    SUBMIT_ENDORSEMENT: prefix + '/submitEndorsement',
    GET_ENDORSEMENT: prefix + '/getEndorsement',
    DELETE_ENDORSEMENT: prefix + '/deleteEndorsement',
    CHECK_CURRENT_LOCATION: prefix + '/checkCurrentLocation',
    CREATE_TRIP_CARD: prefix + '/createTripCard',
    END_TRIP: prefix + '/endTrip',
    UPDATE_TOKEN: prefix + '/updateDeviceToken',
};

export default securityConstants;
