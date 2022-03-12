import React, { Component, useEffect, useState } from 'react';
import { Animated, Easing, Platform, View } from 'react-native';

export default class Blink extends Component {

    constructor(props) {
        super(props);
        this.opacity = new Animated.Value(0);
        this.animatedValue = new Animated.Value(0);
    }

    componentDidMount() {
        Animated.loop(
            Animated.sequence([
                Animated.timing(this.opacity, {
                    toValue: 0.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(this.opacity, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(this.opacity, {
                    toValue: 0.3,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
        Platform.select({
            ios: (
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(this.animatedValue, {
                            toValue: .5,
                            duration: 1000,
                            easing: Easing.ease,
                            useNativeDriver: true
                        }),
                        Animated.timing(this.animatedValue, {
                            toValue: 1,
                            duration: 1000,
                            easing: Easing.ease,
                            useNativeDriver: true
                        }),
                        Animated.timing(this.animatedValue, {
                            toValue: 1.5,
                            duration: 1000,
                            easing: Easing.ease,
                            useNativeDriver: true
                        }),
                    ])
                ).start()
            ),
            android: (
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(this.animatedValue, {
                            toValue: .3,
                            duration: 1000,
                            easing: Easing.ease,
                            useNativeDriver: true
                        }),
                        Animated.timing(this.animatedValue, {
                            toValue: .6,
                            duration: 1000,
                            easing: Easing.ease,
                            useNativeDriver: true
                        }),
                        Animated.timing(this.animatedValue, {
                            toValue: 1,
                            duration: 1000,
                            easing: Easing.ease,
                            useNativeDriver: true
                        }),
                    ])
                ).start()
            )
        })
    }

    render() {
        return (
            <View style={this.props.style}>
                <Animated.View style={{ opacity: this.opacity, transform: [{ scaleX: this.animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) }, { scaleY: this.animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) }] }}>
                    {this.props.children}
                </Animated.View>
                <View style={{ position: 'absolute', top: 10, left: 10 }}>
                    {this.props.icon}
                </View>
            </View>
        )
    }
}
