import ActionPayload from '../core/services/ActionPayload';
import actionType from '../core/constants';

const getRequestActions = (prefix, options = {}) => {
    let actions = {};

    actions.get = (url, data, options = {}) => {
        const type = `${prefix}/${actionType.GET}`;
        options = { method: 'GET', ...options };

        return ActionPayload.getInstance(type, url, data, options).build();
    };

    actions.post = (url, data, options = {}) => {
        const type = `${prefix}/${actionType.POST}`;
        options = { method: 'POST', ...options };

        return ActionPayload.getInstance(type, url, data, options).build();
    };

    actions.put = (item, data, options = {}) => {
        const type = `${prefix}/${actionType.PUT}`;
        const url = item.getIRI();
        options = { method: 'PUT', ...options };

        return ActionPayload.getInstance(type, url, data, options).build();
    };

    actions.delete = (item, options) => {
        const type = `${prefix}/${actionType.DELETE}`;
        const url = item.getIRI();
        options = { item: item, method: 'DELETE', ...options };

        return ActionPayload.getInstance(type, url, {}, options).build();
    };

    return actions;
};

export default getRequestActions;
