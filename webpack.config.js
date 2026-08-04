const webpack = require('webpack');
const packagejson = require("./package.json");
const path = require('path');

module.exports = {
    entry: './src/index.js',

    // Keep ES5 output: the vendored webworkify shim reconstructs worker source
    // from Function.prototype.toString() of the module wrappers, which requires
    // classic function expressions rather than arrow functions.
    target: ['web', 'es5'],

    output: {
        filename: 'mpegts.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            name: 'mpegts',
            type: 'umd'
        },
        globalObject: 'this'
    },

    devtool: 'source-map',

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        fallback: {
            // webpack 5 no longer polyfills node core modules automatically
            'events': require.resolve('events')
        }
    },

    plugins: [
        new webpack.DefinePlugin({
          __VERSION__: JSON.stringify(packagejson.version)
        })
    ],

    module: {
        rules: [
            {
                test: /\.(ts|js)$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                use: 'source-map-loader',
                exclude: /node_modules/
            }
        ]
    },

    devServer: {
        static: ['demo'],
        proxy: [
            {
                context: ['/dist'],
                target: 'http://localhost:8080',
                pathRewrite: {'^/dist' : ''}
            }
        ]
    }
};
