import AbstractReducer from '../core/AbstractReducer';
import securityConstants from '../constants/security';

export default class SecurityReducer extends AbstractReducer {
    constructor(prefix) {
        super(securityConstants.STATE_KEY);
    }

    getInitialState() {
        return {
            token: null,
        };
    }

    getReducers() {
        return [
            {
                type: securityConstants.STORE_TOKEN_ACTION_KEY,
                callback: (state, action) => {
                    return this.constructor.storeToken(state, action);
                },
            },
            {
                type: securityConstants.REMOVE_TOKEN_ACTION_KEY,
                callback: (state, action) => {
                    return this.constructor.removeToken(state, action);
                },
            },
        ];
    }

    static storeToken(state, action) {
        state = {
            ...state,
            token: action.data,
        };
        return state;
    }

    static removeToken(state, action) {
        state = {
            token: null,
        };
        return state;
    }
}
