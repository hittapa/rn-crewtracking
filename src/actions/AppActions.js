import actionType from '../core/constants';
import appConstants from '../constants/app';

const getAppActions = () => {
    let actions = {};

    actions.startLoading = () => {
        return {
            type: `APP/${appConstants.START_LOADING_ACTION_KEY}`,
        };
    };

    actions.stopLoading = () => {
        return {
            type: `${appConstants.STATE_KEY}/${appConstants.STOP_LOADING_ACTION_KEY}`,
        };
    };

    actions.setError = (error = '') => {
        return {
            type: `APP/${actionType.SET_APP_ERROR}`,
            error: error,
        };
    };

    actions.clearError = () => {
        return {
            type: `APP/${actionType.CLEAR_APP_ERROR}`,
        };
    };

    actions.storeUser = user => {
        return {
            type: `APP/${appConstants.STORE_USER}`,
            user: user,
        };
    };

    actions.removeUser = () => {
        return {
            type: `APP/${appConstants.REMOVE_USER}`,
        };
    };

    actions.storeVessels = vessels => {
        return {
            type: `APP/${appConstants.STORE_VESSELS}`,
            vessels: vessels
        };
    };

    actions.storeTrips = trips => {
        return {
            type: `APP/${appConstants.STORE_TRIPS}`,
            trips: trips
        };
    };

    actions.storeLocodes = locodes => {
        return {
            type: `APP/${appConstants.STORE_LOCODES}`,
            locodes: locodes
        };
    };

    actions.setTripDetection = (detection) => {
        return {
            type: `APP/${appConstants.TRIP_DETECTION}`,
            detection: detection
        }
    }

    actions.storeEndorsement = endorsements => {
        return {
            type: `APP/${appConstants.STORE_ENDORSEMENT}`,
            endorsements: endorsements
        }
    }

    return actions;
};

export default getAppActions;
