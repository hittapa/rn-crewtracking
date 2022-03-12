import { get, set, has, isEmpty } from 'lodash';
import { normalize } from '../utils/dataAccess';

export default class DataModel {
    data = null;

    constructor(data = {}) {
        this.setData(data);
    }

    getData() {
        return this.data;
    }

    setData(data = {}) {
        this.data = Object.assign({}, data);

        return this;
    }

    get(path, defaultValue = null) {
        return get(this.data, path, defaultValue);
    }

    set(path, value) {
        set(this.data, path, value);

        return this;
    }

    has(path) {
        return has(this.data, path);
    }

    getDataType() {
        return this.get('@type');
    }

    getIRI() {
        return this.get('@id');
    }

    getId() {
        return this.get('id');
    }

    isEmpty() {
        return isEmpty(this.data);
    }

    normalize() {
        return normalize(this.getData());
    }

    toString() {
        return this.getIRI();
    }
}
