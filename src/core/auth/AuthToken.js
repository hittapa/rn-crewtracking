export default class AuthToken {
    /**
     * @param {String} data.tokenType
     * @param {String} data.accessToken
     * @param {String} data.refreshToken
     * @param {Number} data.expiresIn
     * @param {Date} data.expiresAt
     */
    constructor(data) {
        this.tokenType = data.tokenType;
        this.accessToken = data.accessToken;
        this.refreshToken = data.refreshToken;
        this.expiresIn = parseInt(data.expiresIn);
        this.expiresAt = parseInt(data.expiresAt);
    }
}

AuthToken.prototype.isValid = function () {
    const now = new Date();
    return this.expiresAt > now.getTime();
};
