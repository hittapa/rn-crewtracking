import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { nth, get, has } from 'lodash';
import AnonymousScreen from './src/screens/AnonymousScreen';
import AuthenticatedScreen from './src/screens/AuthenticatedScreen';
import * as Font from 'expo-font';
import * as GlobalFonts from './src/styles/fonts';
import * as SplashScreen from 'expo-splash-screen';
import SecurityActions from './src/actions/SecurityActions';
import securityConstants from './src/constants/security';
import appConstants from './src/constants/app';
import LocalStorageService from './src/core/services/auth/LocalStorageService';

export class App extends Component {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
    };

    state = {
        appIsReady: false,
    };

    async componentDidMount() {
        await this.loadResourcesAsync();
    }

    componentWillUnmount() {
    }

    onLocation(location) {
        console.log('[location] -', location);
    }
    onError(error) {
        console.warn('[location] ERROR -', error);
    }
    onActivityChange(event) {
        console.log('[activitychange] -', event);  // eg: 'on_foot', 'still', 'in_vehicle'
    }
    onProviderChange(provider) {
        console.log('[providerchange] -', provider.enabled, provider.status);
    }
    onMotionChange(event) {
        console.log('[motionchange] -', event.isMoving, event.location);
    }

    loadResourcesAsync = async () => {
        await Promise.all([
            Font.loadAsync(GlobalFonts.Fonts),
            LocalStorageService.loadToken(),
            LocalStorageService.loadUser(),
        ])
            .then(array => {
                this.props.actions.storeUser(nth(array, 2));
                this.props.actions.handleAuthorization(nth(array, 1));
            })
            .catch(e => console.warn(e))
            .finally(() => {
                this.setState({ appIsReady: true }, async () => {
                    await SplashScreen.hideAsync().catch(e => console.warn(e));
                });
            });
    };

    render() {
        if (!this.state.appIsReady) {
            return null;
        }

        // if (this.props.token) {
        //     return <AuthenticatedScreen />;
        // } else {
        //     return <AnonymousScreen />;
        // }
        return <>
            {
                this.props.token ?
                    <AuthenticatedScreen />
                    :
                    <AnonymousScreen />
            }
        </>
    }
}

const mapStateToProps = (state, ownProps) => {
    if (!has(state, securityConstants.STATE_KEY)) {
        return { token: null, loading: falses };
    }

    const { loading } = get(state, appConstants.STATE_KEY);
    if (loading == undefined) loading = false;
    const { token } = get(state, securityConstants.STATE_KEY);
    return { token, loading, user: state.APP.USER, };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(SecurityActions(), dispatch),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(props => <App {...props} />);
