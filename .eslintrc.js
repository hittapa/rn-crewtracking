module.exports = {
    env: {
        browser: true,
        es2020: true,
    },
    plugins: ['prettier', 'import'],
    extends: ['eslint:recommended', '@react-native-community', 'prettier'],
    settings: {
        'import/resolver': {
            node: {
                paths: ['src'],
                alias: {
                    _assets: './src/assets',
                    _components: './src/components',
                    _scenes: './src/scenes',
                    _screens: './src/screens',
                    _styles: './src/styles',
                    _utils: './src/utils',
                },
            },
        },
    },
    parserOptions: {
        ecmaVersion: 11,
        sourceType: 'module',
    },
    rules: {
        'prettier/prettier': [
            'error',
            {
                singleQuote: true,
                tabWidth: 4,
                arrowParens: 'avoid',
            },
            {
                usePrettierrc: false,
            },
        ],
    },
};
