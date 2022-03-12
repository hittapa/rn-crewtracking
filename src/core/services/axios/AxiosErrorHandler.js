import { has, get, forEach } from 'lodash';

function AxiosErrorHandler(errorObject = {}) {
    this.errors = {};
    this.errorObject = errorObject;
}

AxiosErrorHandler.prototype.getErrors = function () {
    if (has(this.errorObject, 'response.status')) {
        if (get(this.errorObject, 'response.status') === 400) {
            if (
                get(this.errorObject, 'response.data.@type') === 'hydra:Error'
            ) {
                this.errors = Object.assign(this.errors, {
                    error: get(
                        this.errorObject,
                        'response.data.hydra:description'
                    ),
                });
            } else if (
                get(this.errorObject, 'response.data.@type') ===
                'ConstraintViolationList'
            ) {
                forEach(
                    get(this.errorObject, 'response.data.violations', []),
                    value => {
                        this.errors = Object.assign(this.errors, {
                            [get(value, 'propertyPath')]: get(value, 'message'),
                        });
                    }
                );
            }
        } else if (get(this.errorObject, 'response.status') === 404) {
            if (
                get(this.errorObject, 'response.data.@type') === 'hydra:Error'
            ) {
                this.errors = Object.assign(this.errors, {
                    error: get(
                        this.errorObject,
                        'response.data.hydra:description'
                    ),
                });
            }
        }
    }

    return this.errors;
};

export default AxiosErrorHandler;
