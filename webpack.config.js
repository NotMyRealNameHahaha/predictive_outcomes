process.traceDeprecation = true
// Docs: https://webpack.js.org/guides/asset-management/
const path = require('path');
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');


const _PORT = 3000


module.exports = {
    context: __dirname,
    mode: 'development',
    //entry: './static_assets/src/index.js',
    
    //-- App entry-points (bundles)
    entry: {
        // site: './static_assets/src/site/app.js',
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
        // new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Development'
        })
    ],

    watchOptions: {
        ignored: ['/node_modules/']
    },

    module: {
        rules: [{
            test: [
                /\.scss$/,
                /\.css$/
            ],
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: 'bundle.css',
                    },
                },
                { loader: 'extract-loader' },
                { loader: 'css-loader' },
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => [autoprefixer()]
                    }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true,
                        includePaths: ['./node_modules']
                    }
                },
            ]
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            // use: ['babel-loader'],
            loader: 'babel-loader',
            query: {
                presets: ['es2015'],
                plugins: ['transform-object-assign']
            },
        }]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['.js']
    },
    devtool: 'inline-source-map'
};
