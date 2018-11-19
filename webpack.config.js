process.traceDeprecation = true
// Docs: https://webpack.js.org/guides/asset-management/
const path = require('path');
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');

const _PORT = 3000

function tryResolve_(url, sourceFilename) {
    // Put require.resolve in a try/catch to avoid node-sass failing with cryptic libsass errors
    // when the importer throws
    try {
        return require.resolve(url, {
            paths: [path.dirname(sourceFilename)]
        });
    } catch (e) {
        return '';
    }
}

function tryResolveScss(url, sourceFilename) {
    // Support omission of .scss and leading _
    const normalizedUrl = url.endsWith('.scss') ? url : `${url}.scss`
    return tryResolve_(normalizedUrl, sourceFilename) ||
        tryResolve_(path.join(path.dirname(normalizedUrl), `_${path.basename(normalizedUrl)}`),
            sourceFilename)
}

function materialImporter(url, prev) {
    if (url.startsWith('@material')) {
        const resolved = tryResolveScss(url, prev)
        return {
            file: resolved || url
        }
    }
    return {
        file: url
    }
}


module.exports = {
    context: __dirname,
    mode: 'development',
    
    //-- App entry-points (bundles)
    entry: {
        outcomes_component: './src/outcomes_component/app.js',
        app_styles: './src/app_styles.scss'
    },

    //-- Compilation destination resolution
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },

    //-- Hot-Reload config
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: _PORT,
        hot: true,
        // publicPath: _publicPath,
        https: true,
        index: '.dist/index.html',
    },

    plugins: [
        new BundleTracker({
            filename: './dist/webpack-stats.json'
        }),
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Predictive Outcomes'
        })
    ],

    watchOptions: {
        ignored: ['/node_modules/']
    },

    module: {
        rules: [{
                test: /\.scss$/,
                use: [{
                        loader: 'file-loader',
                        options: {
                            name: 'bundle.css',
                        },
                    },
                    {
                        loader: 'extract-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                autoprefixer()
                            ]
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            includePaths: ['./node_modules'],
                            importer: materialImporter
                        }
                    },
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                // use: ['babel-loader'],
                loader: 'babel-loader',
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-object-assign']
                },
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
                    loader: 'url-loader',
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
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['.js']
    },
    devtool: 'inline-source-map'
};
