import { applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createInjectStore, injectReducer } from './ReduxInjector';
import client from './axios/client';
import axiosMiddleware from 'redux-axios-middleware';
import { composeWithDevTools } from 'redux-devtools-extension';
import SecurityReducer from '../reducers/SecurityReducer';
import thunk from 'redux-thunk';
import AppReducer from '../reducers/AppReducer';
import AppMiddleware from '../middlewares/AppMiddleware';

export default class AbstractEntry {
    middlewares = [];
    store;

    constructor() {
        // thunk middleware
        this.middlewares.push(thunk);
        // axios middleware
        this.middlewares.push(axiosMiddleware(client));

        // loading middleware
        this.middlewares.push(AppMiddleware);

        // if (__DEV__) {
        //     const { logger } = require('redux-logger');
        //     this.middlewares.push(logger);
        // }
    }

    addMiddleware(middleware) {
        this.middlewares.push(middleware);
    }

    createStore() {
        const sagaMiddleware = createSagaMiddleware();
        const appReducer = AppReducer.getInstance();
        const securityReducer = SecurityReducer.getInstance();

        const store = createInjectStore({}, composeWithDevTools(applyMiddleware(...this.middlewares, sagaMiddleware)));
        injectReducer(appReducer);
        injectReducer(securityReducer);

        return store;
    }
}
