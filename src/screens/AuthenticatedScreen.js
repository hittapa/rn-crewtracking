import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import Drawer from '../components/Drawer';
import { get, has } from 'lodash';
import { bindActionCreators } from 'redux';
import getRequestActions from '_actions/RequestActions';
import RequestReducer from '../reducers/RequestReducer';
import { injectReducer } from '../core/ReduxInjector';
import { ActivityIndicator, View } from 'react-native';

function AuthenticatedScreen(props) {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!mounted) {
            props.actions.get('/users');
            setMounted(true);
        }
        setLoading(props.loading)
    }, [mounted, props.actions, props.loading]);

    return (
        <View style={{ flex: 1 }}>
            <NavigationContainer>
                <Drawer />
                {
                    loading && (
                        <View style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            right: 0,
                            bottom: 0,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#00000055'
                        }}>
                            <ActivityIndicator size={'large'} color={'#ffffff'} />
                        </View>
                    )
                }
            </NavigationContainer>
        </View>
    );
}


const STATE_KEY = 'AUTHENTICATED_SCREEN';
const mapStateToProps = state => {
    if (!has(state, STATE_KEY)) {
        return { retrieved: null };
    }
    const { retrieved } = get(state, STATE_KEY);

    return { retrieved: retrieved, loading: state.APP.loading };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(getRequestActions(STATE_KEY), dispatch),
    };
};

const Container = props => {
    const requestReducer = new RequestReducer(STATE_KEY);
    injectReducer(requestReducer);

    return <AuthenticatedScreen {...props} />;
};

export default connect(mapStateToProps, mapDispatchToProps)(Container);
