import { has } from 'lodash';
import getAppActions from '../actions/AppActions';

const AppMiddleware = store => next => action => {
    if (has(action, 'payload') || has(action, 'error')) {
        const appActions = getAppActions();
        if (
            action.type.indexOf('_FAIL') !== -1 ||
            action.type.indexOf('_SUCCESS') !== -1
        ) {
            store.dispatch(appActions.stopLoading());
        } else {
            store.dispatch(appActions.startLoading());
        }
    }
    return next(action);
};

export default AppMiddleware;
