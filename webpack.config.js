const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
    return [
        {
            entry: __dirname + '/src/background/script.js',
            output: {
                path: __dirname + '/dist/',
                filename: 'background_script.js'
            },
            watch: argv.mode === 'development' ? true : false,
            plugins: [
                new CopyPlugin([
                    {
                        from: __dirname + '/src/manifest.json',
                    },
                    {
                        from: __dirname + '/src/imgs/*',
                        to: __dirname + '/dist/imgs/',
                        flatten: true
                    }
                ]),
            ]
        },
        {
            entry: __dirname + '/src/options/options.js',
            output: {
                path: __dirname + '/dist/',
                filename: 'options.js'
            },
            watch: argv.mode === 'development' ? true : false,
            module: {
                rules: [
                    {
                        test: /\.html$/,
                        use: 'ejs-loader'
                    },
                    {
                        test: /\.png$/, 
                        use: [
                            {
                                loader: 'file-loader',
                                options: {
                                    outputPath: 'imgs',
                                    name: '[name].[ext]'
                                }
                            }
                        ],
                    },
                    {
                        test: /\.css$/,
                        use: ['style-loader', 'css-loader']
                    }
                ]
            },
            plugins: [
                new HtmlWebpackPlugin({
                    filename: 'options.html',
                    template: __dirname + '/src/options/options.html',
                    templateParameters: {
                        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                    }
                })
            ]
        },
        {
            entry: __dirname + '/src/forbidden/forbidden.js',
            output: {
                path: __dirname + '/dist/',
                filename: 'forbidden.js'
            },
            module: {
                rules: [
                    {
                        test: /\.html$/,
                        use: 'html-loader'
                    },
                    {
                        test: /\.gif$/, 
                        use: [
                            {
                                loader: 'file-loader',
                                options: {
                                    outputPath: 'imgs',
                                    name: '[name].[ext]'
                                }
                            }
                        ],
                    },
                    {
                        test: /\.css$/,
                        use: ['style-loader', 'css-loader']
                    }
                ]
            },
            plugins: [
                new HtmlWebpackPlugin({
                    filename: 'forbidden.html',
                    template: __dirname + '/src/forbidden/forbidden.html',
                    files: {
                        css: ["forbidden.css"]
                    }
                })
            ],
        }
    ]
}