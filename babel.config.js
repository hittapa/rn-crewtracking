module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module-resolver',
                {
                    root: ['./src'],
                    extensions: ['.js', '.jsx', '.ios.js', '.android.js'],
                    alias: {
                        _core: './src/core',
                        _constants: './src/constants',
                        _actions: './src/actions',
                        _reducers: './src/reducers',
                        _middlewares: './src/middlewares',
                        _assets: './src/assets',
                        _components: './src/components',
                        _scenes: './src/scenes',
                        _screens: './src/screens',
                        _styles: './src/styles',
                        _utils: './src/utils',
                    },
                },
            ],
        ],
    };
};
