import { has, get } from 'lodash';

function AxiosResponseHandler(response = {}) {
    this.response = response;
}

AxiosResponseHandler.prototype.getData = function () {
    if (has(this.response, 'data')) {
        const data = get(this.response, 'data');
        if (get(data, '@type') === 'hydra:Collection') {
            this.response = {
                data: data['hydra:member'],
            };
        }
    }
    return this.response;
};

export default AxiosResponseHandler;
