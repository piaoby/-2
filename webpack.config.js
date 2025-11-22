const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')

let webpackConf = {}
const baseConf = {
    mode: process.env.NODE_ENV,
    entry: {
        index: './src/index.js'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            vue: 'vue/dist/vue.esm.js',
            '@': path.resolve(__dirname, './src')
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                include: [
                    path.resolve(__dirname, './src'),
                    path.resolve(__dirname, './lib')
                ]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(css|scss|sass)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {}
                    }
                ]
            },
            {
                test: /\.md$/,
                loader: 'raw-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    // 3.0.0 版本默认使用 esModule，导致 css 中使用 url 的地方编译后错误输出 [object Module]
                    // 参考 https://github.com/vuejs/vue-loader/issues/1612
                    esModule: false,
                    limit: 10000,
                    name: path.posix.join('images/[name].[hash:7].[ext]'),
                    publicPath: './'
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    esModule: false,
                    limit: 10000,
                    name: path.posix.join('media/[name].[hash:7].[ext]'),
                    publicPath: './'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    esModule: false,
                    limit: 10000,
                    name: path.posix.join('fonts/[name].[hash:7].[ext]'),
                    publicPath: './'
                }
            }
        ]
    },
    plugins: [
        new CaseSensitivePathsPlugin(),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './index.html',
            inject: true
        })
    ]
}

webpackConf = merge(baseConf, {
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.posix.join(__dirname, './static'),
        host: 'localhost',
        port: 8082,
        https: false,
        hot: true,
        open: false,
        overlay: true,
        proxy: {},
        stats: {
            children: false,
            entrypoints: false,
            modules: false
        }
    }
})

module.exports = webpackConf
