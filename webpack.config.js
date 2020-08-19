//@ts-check

'use strict';

const path = require('path');

/**@type {import('webpack').Configuration}*/
const config = {
    //? VSCode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
    target: 'node',

    //? The entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
    entry: {
        extension: './src/extension.ts',
    },

    output: {
        //? The bundle is stored in the 'out' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
        path: path.resolve(__dirname, 'out'),
        filename: '[name].js',
        libraryTarget: 'commonjs2',
        devtoolModuleFilenameTemplate: '../[resource-path]',
    },

    devtool: 'source-map',

    // optimization: {
    //     splitChunks: {
    //         chunks: 'all',
    //         name: 'vendors',
    //     },
    // },

    externals: {
        //? The vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
        vscode: 'commonjs vscode',
    },

    resolve: {
        alias: {
            '~': path.join(__dirname, './src'),
        },
        //? Support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
        extensions: ['.ts', '.js'],
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                    },
                ],
            },
        ],
    },
};

module.exports = config;
