import AbstractReducer from '../core/AbstractReducer';
import appConstants from '../constants/app';

export default class AppReducer extends AbstractReducer {
    constructor(prefix) {
        super(appConstants.STATE_KEY);
    }

    getInitialState() {
        return {
            loading: false,
            [appConstants.REDUCER_USER_KEY]: null,
            [appConstants.STORE_VESSELS]: null,
            trips: [],
            locodes: [],
            tripDetected: false,
            endorsements: []
        };
    }

    getReducers() {
        return [
            {
                type: appConstants.START_LOADING_ACTION_KEY,
                callback: (state, action) => {
                    return this.constructor.startLoading(state, action);
                },
            },
            {
                type: appConstants.STOP_LOADING_ACTION_KEY,
                callback: (state, action) => {
                    return this.constructor.stopLoading(state, action);
                },
            },
            {
                type: appConstants.STORE_USER,
                callback: (state, action) => {
                    return this.constructor.storeUser(state, action);
                },
            },
            {
                type: appConstants.REMOVE_USER,
                callback: (state, action) => {
                    return this.constructor.removeUser(state, action);
                },
            },
            {
                type: appConstants.GET_VESSELS,
                callback: (state, action) => {
                    return this.constructor.getVessels(state, action);
                },
            },
            {
                type: appConstants.STORE_VESSELS,
                callback: (state, action) => {
                    return this.constructor.storeVessels(state, action);
                },
            },
            {
                type: appConstants.STORE_TRIPS,
                callback: (state, action) => {
                    return this.constructor.storeTrips(state, action);
                },
            },
            {
                type: appConstants.STORE_LOCODES,
                callback: (state, action) => {
                    return this.constructor.storeLocodes(state, action);
                },
            },
            {
                type: appConstants.TRIP_DETECTION,
                callback: (state, action) => {
                    return this.constructor.setTripDetection(state, action)
                }
            },
            {
                type: appConstants.STORE_ENDORSEMENT,
                callback: (state, action) => {
                    return this.constructor.setEndorsements(state, action)
                }
            }
        ];
    }

    static startLoading(state, action) {
        state = {
            ...state,
            loading: true,
        };
        return state;
    }

    static stopLoading(state, action) {
        state = {
            ...state,
            loading: false,
        };
        return state;
    }

    static storeUser(state, action) {
        state = {
            ...state,
            [appConstants.REDUCER_USER_KEY]: action.user,
        };
        return state;
    }

    static removeUser(state, action) {
        state = {
            ...state,
            user: null,
        };
        return state;
    }

    static getVessels(state, action) {
        state = {
            ...state,
            [appConstants.GET_VESSELS]: action.vessels,
        };
        return state;
    }

    static storeVessels(state, action) {
        state = {
            ...state,
            [appConstants.STORE_VESSELS]: action.vessels,
        };
        return state;
    }

    static storeTrips(state, action) {
        state = {
            ...state,
            trips: action.trips,
        };
        return state;
    }

    static storeLocodes(state, action) {
        state = {
            ...state,
            locodes: action.locodes,
        };
        return state;
    }

    static setTripDetection(state, action) {
        state = {
            ...state,
            tripDetected: action.detection
        }
        return state;
    }

    static setEndorsements(state, action) {
        state = {
            ...state,
            endorsements: action.endorsements
        };
        return state;
    }
}
