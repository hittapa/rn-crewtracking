import securityConstants from '../constants/security';
import SecurityService from '../core/services/auth/SecurityService';
import LocalStorageService from '../core/services/auth/LocalStorageService';
import { isNil, get } from 'lodash';
import getAppActions from '../actions/AppActions';

const SecurityActions = () => {
    let actions = {};

    actions.handleAuthorization = token => {
        return dispatch => {
            if (!isNil(token)) {
                dispatch(actions.storeToken(token));
            } else {
                dispatch(actions.removeToken());
            }
        };
    };

    /**
     *
     * @param {String} username
     * @param {String} password
     * @return {Promise<void>}
     */
    actions.login = (username, password) => {
        return async dispatch => {
            const appActions = getAppActions();

            dispatch(appActions.startLoading());

            const SecurityClient = SecurityService.getSecurityClient();
            const token: any = await SecurityClient.requestAccessToken(
                username,
                password
            )
                // eslint-disable-next-line no-shadow
                .then((res) => {
                    LocalStorageService.storeToken(res.token);
                    return SecurityClient.getLoggedInUser().then(
                        data => [res.token, data]
                    );
                })
                // eslint-disable-next-line no-shadow
                .then(([token, data]) => {
                    const appActions = getAppActions();
                    dispatch(appActions.stopLoading());
                    if (data.err) {
                        return Promise.reject("Something went wrong");
                    }
                    dispatch(actions.storeUser(data.user));
                    dispatch(appActions.storeVessels(data.vessels))
                    dispatch(appActions.storeTrips(data.trips))
                    dispatch(appActions.storeLocodes(data.locodes))
                    dispatch(appActions.storeEndorsement(data.endorsements));
                    dispatch(actions.storeToken(token));
                    dispatch(appActions.stopLoading());
                    return token;
                })
                .catch(e => {
                    dispatch(appActions.stopLoading());
                    return Promise.reject(e);
                });

            return token;
        };
    };

    /**
     * @param {String} data.username
     * @param {String} data.password
     * @param {String} data.firstName
     * @param {String} data.lastName
     * @param {String} data.plan
     * @param {String} data.isUsCitizen
     *
     * @return {function(*): Promise<void>}
     */
    actions.register = data => {
        return async dispatch => {
            const appActions = getAppActions();

            dispatch(appActions.startLoading());
            const SecurityClient = SecurityService.getSecurityClient();
            const promise = await SecurityClient.register(data)
                .then(() => {
                    return SecurityClient.requestAccessToken(
                        data.username,
                        data.password
                    ).then((res) => {
                        dispatch(actions.storeToken(res.token));
                        dispatch(actions.storeUser(res.user));
                        dispatch(appActions.stopLoading());
                    });
                })
                .catch(e => {
                    dispatch(appActions.stopLoading());
                    return Promise.reject(e);
                });

            return promise;
        };
    };

    actions.registerStepOneCheck = data => {
        return async dispatch => {
            const appActions = getAppActions();

            dispatch(appActions.startLoading());

            const SecurityClient = SecurityService.getSecurityClient();
            const promise = await SecurityClient.register(data, 1)
                .then(user => {
                    dispatch(appActions.stopLoading());
                    return user;
                })
                .catch(e => {
                    dispatch(appActions.stopLoading());
                    return Promise.reject(e);
                });
            return promise;
        };
    };

    actions.forgotPasswordRequest = email => {
        return async dispatch => {
            const appActions = getAppActions();

            dispatch(appActions.startLoading());

            const SecurityClient = SecurityService.getSecurityClient();
            const promise = await SecurityClient.forgotPasswordRequest(email)
                .then(res => {
                    dispatch(appActions.stopLoading());
                    return Promise.resolve(res.data)
                })
                .catch(e => {
                    dispatch(appActions.stopLoading());
                    return Promise.reject(e);
                });
            return promise;
        };
    };

    actions.verifyCode = (email, code) => {
        return async dispatch => {
            const appActions = getAppActions();

            dispatch(appActions.startLoading());

            const SecurityClient = SecurityService.getSecurityClient();
            const promise = await SecurityClient.verifyCode(email, code)
                .then(res => {
                    dispatch(appActions.stopLoading());
                    return Promise.resolve(res.data)
                })
                .catch(e => {
                    dispatch(appActions.stopLoading());
                    return Promise.reject(e);
                });
            return promise;
        };
    };

    actions.resetpassword = (email, code, password) => {
        return async dispatch => {
            const appActions = getAppActions();

            dispatch(appActions.startLoading());

            const SecurityClient = SecurityService.getSecurityClient();
            const promise = await SecurityClient.resetpassword(email, code, password)
                .then(res => {
                    dispatch(appActions.stopLoading());
                    return Promise.resolve(res.data)
                })
                .catch(e => {
                    dispatch(appActions.stopLoading());
                    return Promise.reject(e);
                });
            return promise;
        };
    };

    actions.onLoginFail = () => {
        return {
            type: `${securityConstants.STATE_KEY}/${securityConstants.LOGIN_FAIL_ACTION_KEY}`,
        };
    };

    actions.onLoginSuccess = token => {
        return {
            token: token,
            type: `${securityConstants.STATE_KEY}/${securityConstants.LOGIN_SUCCESS_ACTION_KEY}`,
        };
    };

    actions.storeToken = token => {
        LocalStorageService.storeToken(token);

        return {
            type: `${securityConstants.STATE_KEY}/${securityConstants.STORE_TOKEN_ACTION_KEY}`,
            data: token,
        };
    };

    actions.removeToken = () => {
        LocalStorageService.removeToken();

        return {
            type: `${securityConstants.STATE_KEY}/${securityConstants.REMOVE_TOKEN_ACTION_KEY}`,
        };
    };

    actions.storeUser = user => {
        return async dispatch => {
            const appActions = getAppActions();

            LocalStorageService.storeUser(user);
            dispatch(appActions.storeUser(user));
        };
    };

    actions.removeUser = () => {
        return async dispatch => {
            const appActions = getAppActions();
            LocalStorageService.removeUser();
            dispatch(appActions.removeUser());
        };
    };

    actions.getVesselType = () => {
        return async dispatch => {
            const SecurityClient = SecurityService.getSecurityClient();
            const appActions = getAppActions();
            const promise = await SecurityClient.getVesselType()
                .then(types => {
                    dispatch(appActions.stopLoading());
                    return types;
                })
                .catch(e => {
                    dispatch(appActions.stopLoading());
                    return Promise.reject(e);
                });
            return promise;
        }
    }

    actions.saveNewVessel = (data) => {
        return async dispatch => {
            const SecurityClient = SecurityService.getSecurityClient();
            const appActions = getAppActions();
            dispatch(appActions.startLoading());
            const promise = await SecurityClient.saveNewVessel(data)
                .then(result => {
                    dispatch(appActions.stopLoading());
                    dispatch(appActions.storeVessels(result.vessels));
                    dispatch(appActions.storeUser(result.user));
                    return result;
                })
                .catch(e => {
                    dispatch(appActions.stopLoading());
                    return Promise.reject(e);
                });
            return promise;
        }
    }

    actions.getDetailedType = (data) => {
        return async dispatch => {
            const SecurityClient = SecurityService.getSecurityClient();
            const appActions = getAppActions();
            const promise = await SecurityClient.getDetailedType(data)
                .then(types => {
                    dispatch(appActions.stopLoading());
                    return types;
                })
                .catch(e => {
                    dispatch(appActions.stopLoading());
                    return Promise.reject(e);
                });
            return promise;
        }
    }

    actions.validateNewVessel = (data) => {
        return async dispatch => {
            const SecurityClient = SecurityService.getSecurityClient();
            const appActions = getAppActions();
            const promise = await SecurityClient.validateNewVessel(data)
                .then(types => {
                    dispatch(appActions.stopLoading());
                    return types;
                })
                .catch(e => {
                    dispatch(appActions.stopLoading());
                    return Promise.reject(e);
                });
            return promise;
        }
    }

    actions.getVessels = (data) => {
        return async dispatch => {
            const SecurityClient = SecurityService.getSecurityClient();
            const appActions = getAppActions();
            const promise = await SecurityClient.getVessels(data)
                .then(vessels => {
                    dispatch(appActions.stopLoading());
                    dispatch(appActions.storeVessels(vessels))
                    return vessels;
                })
                .catch(e => {
                    dispatch(appActions.stopLoading());
                    return Promise.reject(e);
                });
            return promise;
        }
    }

    actions.deleteVessel = (data) => {
        return async dispatch => {
            const SecurityClient = SecurityService.getSecurityClient();
            const appActions = getAppActions();
            dispatch(appActions.startLoading());
            const promise = await SecurityClient.deleteVessel(data)
                .then(vessels => {
                    dispatch(appActions.stopLoading());
                    dispatch(appActions.storeVessels(vessels))
                    return vessels;
                })
                .catch(e => {
                    dispatch(appActions.stopLoading());
                    return Promise.reject(e);
                });
            return promise;
        }
    }

    actions.updateVessel = (data) => {
        return async dispatch => {
            const SecurityClient = SecurityService.getSecurityClient();
            const appActions = getAppActions();
            if (data.loading == undefined)
                dispatch(appActions.startLoading());
            const promise = await SecurityClient.updateVessel(data)
                .then(vessels => {
                    dispatch(appActions.stopLoading());
                    dispatch(appActions.storeVessels(vessels))
                    return vessels;
                })
                .catch(e => {
                    dispatch(appActions.stopLoading());
                    return Promise.reject(e);
                });
            return promise;
        }
    }
    actions.updateUser = (data) => {
        return async dispatch => {
            const SecurityClient = SecurityService.getSecurityClient();
            const appActions = getAppActions();
            dispatch(appActions.startLoading());
            const promise = await SecurityClient.updateUser(data)
                .then(user => {
                    dispatch(appActions.stopLoading());
                    user && dispatch(appActions.storeUser(user))
                    return user;
                })
                .catch(e => {
                    dispatch(appActions.stopLoading());
                    return Promise.reject(e);
                });
            return promise;
        }
    }

    actions.getTrips = (data) => {
        return async dispatch => {
            const SecurityClient = SecurityService.getSecurityClient();
            const appActions = getAppActions();
            const promise = await SecurityClient.getTrips(data)
                .then(res => {
                    dispatch(appActions.stopLoading());
                    dispatch(appActions.storeTrips(res.trips))
                    dispatch(appActions.storeLocodes(res.locodes))
                    return res.trips;
                })
                .catch(e => {
                    dispatch(appActions.stopLoading());
                    return Promise.reject(e);
                });
            return promise;
        }
    }

    actions.updateTrip = (data) => {
        return async dispatch => {
            const SecurityClient = SecurityService.getSecurityClient();
            const appActions = getAppActions();
            dispatch(appActions.startLoading());
            const promise = await SecurityClient.updateTrip(data)
                .then(({ trips, vessels }) => {
                    dispatch(appActions.stopLoading());
                    dispatch(appActions.storeVessels(vessels))
                    dispatch(appActions.storeTrips(trips))
                    return trips;
                })
                .catch(e => {
                    dispatch(appActions.stopLoading());
                    return Promise.reject(e);
                });
            return promise;
        }
    }

    actions.getRoutes = (data) => {
        return async dispatch => {
            const SecurityClient = SecurityService.getSecurityClient();
            const appActions = getAppActions();
            const promise = await SecurityClient.getRoutes(data)
                .then(routes => {
                    dispatch(appActions.stopLoading());
                    return routes;
                })
                .catch(e => {
                    dispatch(appActions.stopLoading());
                    return Promise.reject(e);
                });
            return promise;
        }
    }

    actions.deleteTrip = (data) => {
        return async dispatch => {
            const SecurityClient = SecurityService.getSecurityClient();
            const appActions = getAppActions();
            dispatch(appActions.startLoading());
            const promise = await SecurityClient.deleteTrip(data)
                .then(({ vessels }) => {
                    dispatch(appActions.stopLoading());
                    dispatch(appActions.storeVessels(vessels));
                })
                .catch(e => {
                    dispatch(appActions.stopLoading());
                    return Promise.reject(e);
                });
            return promise;
        }
    }

    actions.submitEndorsementData = (data) => {
        return async dispatch => {
            const SecurityClient = SecurityService.getSecurityClient();
            const appActions = getAppActions();
            dispatch(appActions.startLoading());
            const promise = await SecurityClient.submitEndorsementData(data)
                .then((res) => {
                    if (res.endorsements)
                        dispatch(appActions.storeEndorsement(res.endorsements));
                    dispatch(appActions.stopLoading());
                    return res;
                })
                .catch(e => {
                    dispatch(appActions.stopLoading());
                    return Promise.reject(e);
                });
            return promise;
        }
    }
    actions.getEndorsements = (data) => {
        return async dispatch => {
            const SecurityClient = SecurityService.getSecurityClient();
            const appActions = getAppActions();
            const promise = await SecurityClient.getEndorsements(data)
                .then((res) => {
                    return res;
                })
                .catch(e => {
                    return Promise.reject(e);
                });
            return promise;
        }
    }
    actions.storeEndorsements = (data) => {
        return dispatch => {
            const appActions = getAppActions();
            dispatch(appActions.storeEndorsement(data));
        }
    }
    actions.deleteEndorsement = (data) => {
        return async dispatch => {
            const SecurityClient = SecurityService.getSecurityClient();
            const appActions = getAppActions();
            dispatch(appActions.startLoading());
            const promise = await SecurityClient.deleteEndorsement(data)
                .then((res) => {
                    if (res.endorsements)
                        dispatch(appActions.storeEndorsement(res.endorsements));
                    dispatch(appActions.stopLoading());
                    return res;
                })
                .catch(e => {
                    dispatch(appActions.stopLoading());
                    return Promise.reject(e);
                });
            return promise;
        }
    }

    actions.checkCurrentLocation = (data) => {
        return async dispatch => {
            const SecurityClient = SecurityService.getSecurityClient();
            const appActions = getAppActions();
            dispatch(appActions.startLoading());
            const promise = await SecurityClient.checkCurrentLocation(data)
                .then((res) => {
                    dispatch(appActions.stopLoading());
                    return res;
                })
                .catch(e => {
                    dispatch(appActions.stopLoading());
                    return Promise.reject(e);
                });
            return promise;
        }
    }

    actions.createTripCard = (data) => {
        return async dispatch => {
            const SecurityClient = SecurityService.getSecurityClient();
            const appActions = getAppActions();
            dispatch(appActions.startLoading());
            const promise = await SecurityClient.createTripCard(data)
                .then((res) => {
                    dispatch(appActions.stopLoading());
                    dispatch(appActions.storeVessels(res.vessels))
                    return res;
                })
                .catch(e => {
                    dispatch(appActions.stopLoading());
                    return Promise.reject(e);
                });
            return promise;
        }
    }

    actions.endTrip = (data) => {
        return async dispatch => {
            const SecurityClient = SecurityService.getSecurityClient();
            const appActions = getAppActions();
            dispatch(appActions.startLoading());
            const promise = await SecurityClient.endTrip(data)
                .then((res) => {
                    dispatch(appActions.stopLoading());
                    dispatch(appActions.storeVessels(res.vessels))
                    return res;
                })
                .catch(e => {
                    dispatch(appActions.stopLoading());
                    return Promise.reject(e);
                });
            return promise;
        }
    }

    return actions;
};

export default SecurityActions;
