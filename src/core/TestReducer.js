import AbstractReducer from 'core/AbstractReducer';

export default class TestReducer extends AbstractReducer {
    initialState = {
        count: 2,
    };
    constructor(prefix) {
        super(prefix);
    }

    getInitialState() {
        return this.initialState;
    }

    getReducers() {
        return [
            {
                type: 'TEST',
                callback: (state, action) => {
                    return {
                        count2: state.count + 1,
                    };
                },
            },
        ];
    }
}
