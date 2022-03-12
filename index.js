import { registerRootComponent } from 'expo';
import React from 'react';
import App from './App';

import { Provider } from 'react-redux';
import AbstractEntry from './src/core/AbstractEntry';
import { RequestMiddleware } from './src/middlewares/RequestMiddleware';

const entry = new AbstractEntry();
entry.addMiddleware(RequestMiddleware);
const store = entry.createStore();

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(() => (
    <Provider store={store}>
        <App />
    </Provider>
));
