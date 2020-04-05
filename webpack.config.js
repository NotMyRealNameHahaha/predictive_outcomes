process.traceDeprecation = true
// Docs: https://webpack.js.org/guides/asset-management/
const path = require('path');
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const VueLoaderPlugin = require('vue-loader/lib/plugin')



const isDev = process.env.NODE_ENV !== 'production'

const outputDirectory = 'dist'
const outputPath = path.resolve(__dirname, outputDirectory)
const sourcePath = path.resolve(__dirname, 'src')


// Module export
module.exports = {
    context: __dirname,
    mode: isDev ? 'development': 'production',

    //-- App entry-points (bundles)
    // entry: {
    //     predictive_outcomes: './src/predictive_outcomes/app.js'
    // },
    
    entry: './src/index.js',

    //-- Compilation destination resolution
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].[hash].bundle.js',
        path: outputPath,
        publicPath: '/'
    },

    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                sideEffects: true
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // only enable hot in development
                            hmr: isDev,
                            // if hmr does not work, this is a forceful method.
                            reloadAll: true
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            [
                                '@babel/plugin-proposal-class-properties',
                                {
                                    'loose': true
                                }
                            ],
                            [
                                '@babel/plugin-proposal-pipeline-operator',
                                {
                                    'proposal': 'fsharp'
                                }
                            ]
                        ],

                        presets: [
                            '@babel/preset-env'
                        ]
                    }
                },
                sideEffects: true
            },
            {

                test: /\.(jpe?g|png|gif|svg|eot|woff|ttf|svg|woff2)$/,
                use: {
                    loader: 'file-loader',
                }
            },
            {
                // Use url-loader for tiny files
                test: /\.(png|jpg|gif)$/i,
                use: [{
                    loader: 'urlloader',
                    options: {
                        limit: 8192
                    }
                }]
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].bundle.css',
            chunkFilename: '[id].bundle.css',
        }),
        new CleanWebpackPlugin(),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin()
    ],
    
    devServer: {
        port: 3000,
        open: true,
        contentBase: path.join(__dirname, 'dist'),
        hot: true,
        // publicPath: _publicPath,
        proxy: {
            '/api': 'http://localhost:8080'
        },
    },

    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'common': path.resolve(sourcePath, 'common'),
            'styles': path.resolve(sourcePath, 'styles'),
            'shared': path.resolve(sourcePath, 'shared')
        }
    },
    devtool: 'source-map'
};
