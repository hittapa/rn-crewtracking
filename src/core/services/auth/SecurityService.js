'use strict';

import client from "../../axios/client";
import SecurityClient from '../../services/auth/SecurityClient';

class SecurityService {
    /**
     * @returns {SecurityClient}
     */
    static getSecurityClient() {
        if (typeof SecurityService.client !== 'undefined') {
            return SecurityService.client;
        }

        SecurityService.client = new SecurityClient(client);

        return SecurityService.client;
    }
}

export default SecurityService;
