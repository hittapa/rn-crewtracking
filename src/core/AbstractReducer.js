import { merge } from 'lodash';

export default class AbstractReducer {
    initialState = {
        endorsements: []
    };
    constructor(prefix = 'APP') {
        this.prefix = prefix;
        this.initialState = merge(
            {},
            this.constructor.initialState,
            this.getInitialState()
        );
    }

    static getInstance(prefix = 'APP') {
        return new this(prefix);
    }

    getPrefix() {
        return this.prefix;
    }

    getState(state = this.initialState, action = {}) {
        if (action.type.indexOf(this.prefix) === -1) {
            return state;
        }

        let newState = {},
            self = this;
        const pass = this.getReducers().some(reducer => {
            if (action.type === `${self.prefix}/${reducer.type}`) {
                newState = reducer.callback(state, action);
                return true;
            }
            return false;
        });

        return pass ? newState : state;
    }

    getReducers() {
        throw new Error(
            `You have to implement getReducers in ${this.constructor.name}`
        );
    }

    getInitialState() {
        throw new Error(
            `Implement getInitialState in ${this.constructor.name}`
        );
    }
}
