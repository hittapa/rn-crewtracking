import { merge, isEmpty } from 'lodash';

export default class ActionPayload {
    type = null;
    url = null;
    data = null;
    method = 'get';
    headers = {};

    payload = {};
    options = {};

    constructor(type, url) {
        this.type = type;
        this.url = url;
    }

    setData(data = {}) {
        this.data = data;

        return this;
    }

    setHeaders(headers = {}) {
        this.headers = { ...this.headers, ...headers };

        return this;
    }

    addPayload(payload = {}) {
        this.payload = merge({}, this.payload, payload || {});

        return this;
    }

    setOptions(options = {}) {
        const { method, headers, ...remain } = options;

        this.options = remain;

        if (typeof method !== 'undefined') {
            this.setMethod(method);
        }

        if (typeof headers !== 'undefined') {
            this.setHeaders(headers);
        }

        return this;
    }

    setClient(client) {
        return this.addPayload({
            client: client,
        });
    }

    setMethod(method) {
        this.method = method.toUpperCase();

        return this;
    }

    addDataToPayloadRequest() {
        if (this.method.toUpperCase() === 'GET') {
            return this.addPayload({
                request: {
                    params: this.data,
                },
            });
        }

        return this.addPayload({
            request: {
                data: this.data,
            },
        });
    }

    addHeadersToPayloadRequest() {
        return this.addPayload({
            request: {
                headers: this.headers,
            },
        });
    }

    buildRequest() {
        if (this.data !== null) {
            this.addDataToPayloadRequest();
        }

        if (!isEmpty(this.headers)) {
            this.addHeadersToPayloadRequest();
        }

        this.addPayload({
            request: {
                url: this.url,
                method: this.method,
            },
        });

        return {
            type: this.type,
            payload: this.payload,
            ...this.options,
        };
    }

    build() {
        return this.buildRequest();
    }

    static getInstance(type, url, data, options) {
        const instance = new this(type, url);
        return instance.setData(data).setOptions(options);
    }
}
