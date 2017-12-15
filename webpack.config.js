module.exports = {
    entry: ['babel-polyfill', './content.js'],
    output: {
        filename: './src/options/js/options.js'
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader'
        }]
    }
};