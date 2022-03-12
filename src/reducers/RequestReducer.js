import AbstractReducer from '../core/AbstractReducer';
import actionType from '../core/constants';
import { get } from 'lodash';
import AxiosErrorHandler from '../core/services/axios/AxiosErrorHandler';

export default class RequestReducer extends AbstractReducer {
    constructor(prefix) {
        super(prefix);
    }

    getInitialState() {
        return {
            retrieved: null,
            affectedItem: null,
            error: null,
            loading: false,
        };
    }

    getReducers() {
        return [
            {
                type: actionType.GET,
                callback: (state, action) => {
                    return this.constructor.get(state, action);
                },
            },
            {
                type: actionType.GET_SUCCESS,
                callback: (state, action) => {
                    return this.constructor.getSuccess(state, action);
                },
            },
            {
                type: actionType.GET_FAIL,
                callback: (state, action) => {
                    return this.constructor.getFail(state, action);
                },
            },

            {
                type: actionType.POST,
                callback: (state, action) => {
                    return this.constructor.post(state, action);
                },
            },
            {
                type: actionType.POST_SUCCESS,
                callback: (state, action) => {
                    return this.constructor.postSuccess(state, action);
                },
            },
            {
                type: actionType.POST_FAIL,
                callback: (state, action) => {
                    return this.constructor.postFail(state, action);
                },
            },
            {
                type: actionType.PUT,
                callback: (state, action) => {
                    return this.constructor.put(state, action);
                },
            },
            {
                type: actionType.PUT_SUCCESS,
                callback: (state, action) => {
                    return this.constructor.putSuccess(state, action);
                },
            },
            {
                type: actionType.PUT_FAIL,
                callback: (state, action) => {
                    return this.constructor.postFail(state, action);
                },
            },

            {
                type: actionType.DELETE,
                callback: (state, action) => {
                    return this.constructor.delete(state, action);
                },
            },
            {
                type: actionType.DELETE_SUCCESS,
                callback: (state, action) => {
                    return this.constructor.deleteSuccess(state, action);
                },
            },
            {
                type: actionType.DELETE_FAIL,
                callback: (state, action) => {
                    return this.constructor.deleteFail(state, action);
                },
            },
        ];
    }

    static parseErrorDescription(errorDescription) {
        return errorDescription.split(':').pop().trimLeft();
    }

    static get(state, action) {
        if (
            action.payload !== undefined &&
            action.payload.request !== undefined
        ) {
            state = {
                ...state,
                affectedItem: null,
                error: null,
                loading: true,
            };
        }

        return state;
    }

    static getSuccess(state, action) {
        if (action.payload !== undefined && action.payload.data !== undefined) {
            state = {
                ...state,
                retrieved: action.payload.data,
                error: null,
                loading: false,
            };

            return state;
        }

        throw new Error('Success response data is not defined');
    }

    static getFail(state, action) {
        if (action.error !== undefined) {
            state = {
                ...state,
                error: action.error,
                loading: false,
            };

            return state;
        }

        throw new Error('Fail response data is not defined');
    }

    static post(state) {
        state = {
            ...state,
            affectedItem: null,
            error: null,
            loading: true,
        };

        return state;
    }

    static postSuccess(state, action) {
        if (action.payload !== undefined && action.payload.data !== undefined) {
            return {
                ...state,
                retrieved: action.payload.data,
                affectedItem: action.payload.data,
                error: null,
                loading: false,
            };
        }

        throw new Error('Success response data is not defined');
    }

    /**
     * @param state
     * @param {Object} action.error
     * @return {{error: *, loading: boolean}}
     */
    static postFail(state, action) {
        if (action.error !== undefined) {
            // handles errors from backend
            let axiosErrorHandler = new AxiosErrorHandler(action.error);
            const errors = axiosErrorHandler.getErrors();

            return {
                ...state,
                error: errors,
                loading: false,
            };
        }

        throw new Error('Fail response data is not defined');
    }

    static put(state) {
        state = {
            ...state,
            affectedItem: null,
            error: null,
            loading: true,
        };

        return state;
    }

    static putSuccess(state, action) {
        if (action.payload !== undefined && action.payload.data !== undefined) {
            return {
                ...state,
                retrieved: action.payload.data,
                affectedItem: action.payload.data,
                error: null,
                loading: false,
            };
        }

        throw new Error('Success response data is not defined');
    }

    static delete(state, action) {
        state = { ...state, affectedItem: null, loading: true };
        return state;
    }

    static deleteSuccess(state, action) {
        const affectedItem = get(action, 'meta.previousAction.item', null);

        if (affectedItem !== null) {
            return { ...state, affectedItem: affectedItem, loading: false };
        }

        throw new Error('Deleted item is not defined');
    }

    static deleteFail(state, action) {
        if (action.error !== undefined) {
            const status = get(action, 'errorObject.response.status');

            if (status === 404) {
                return {
                    ...state,
                    error: get(action, 'errorObject.response.data.hydra:description'),
                    loading: false,
                };
            }

            return {
                ...state,
                error: action.error.message,
                loading: false,
            };
        }

        throw new Error('Fail response data is not defined');
    }
}
