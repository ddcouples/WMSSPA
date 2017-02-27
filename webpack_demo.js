var webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'), //模板插件
    OpenBrowserPlugin=require('open-browser-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"), //Css分割插件
    CleanWebpackPlugin = require('clean-webpack-plugin'), // 删除插件
    NgAnnotatePlugin = require('ng-annotate-webpack-plugin'), //自动注入注解插件
    autoprefixer = require('autoprefixer'),
    path = require('path'),
    buildPath = path.resolve(__dirname, "webapp"), //发布目录
    __DEV__ = process.env.NODE_ENV === 'dev', //发布环境
    publicPath = '', //资源引用统一前缀
    devtool = '', //source-map模式

    plugins = [
        new HtmlWebpackPlugin({
            chunks: ['app', 'vendor'],
            template: __dirname + '/www/template/index.html',
            filename: './index.html'
        }),
        // new HtmlWebpackPlugin({
        //     chunks: ['app', 'vendor'],
        //     template: __dirname + '/www/template/mobile.html',
        //     filename: './mobile.html'
        // }),
        new OpenBrowserPlugin({  //打开地址
            url: 'http://localhost:8080'
        }),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'static/dist/vendor.[hash:6].js'),
        new webpack.ProvidePlugin({
            $:"jquery",
            jQuery:'jquery',
            'window.jQuery':'jquery'
        }),
        new ExtractTextPlugin("static/css/styles.[hash:6].css"),
        new CleanWebpackPlugin('webapp', {
            verbose: true,
            dry: false
        }),
        new NgAnnotatePlugin({
            add: true
        }),
        new webpack.HotModuleReplacementPlugin() //webpack 打包生成的文件 出现 [HMR] Hot Module Replacement is disabled.fa
    ];
console.log(!__DEV__);
if (!__DEV__) {

    //压缩
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));

    publicPath = process.env.NODE_ENV == 'test' ? 'test.domain.com' : 'www.domain.com';
    devtool = 'source-map';
}

var config = {
    //入口文件配置
    entry: {
        app:['webpack/hot/only-dev-server', path.resolve(__dirname, 'www/app/app.js')],
        vendor: ["angular", 'angular-ui-router', 'oclazyload','jquery','bootstrap']
    },
    //文件导出的配置
    output: {
        path: buildPath,
        filename: "static/js/[name].[hash:6].js",
        publicPath: publicPath,
        chunkFilename: "static/js/chunks/[name].chunk.[chunkhash].js"
    },
    //本地服务器配置
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        grogress: true
    },
    //模块配置
    module: {
        loaders: [{
            test: /\.html$/,
            loader: 'raw'
        }, {
            test: /\.(png|jpg|gif)$/,
            loader: 'url?limit=8192,name=static/img/[name].[hash:6].[ext]'
        }, {
            test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,
            loader: 'url-loader?importLoaders=1&limit=1000&name=static/fonts/[name].[ext]'
        }, {
            test: /\.css$/,
            loaders: ['style', 'css'],
        }, { //外链
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader!postcss-loader")
        }
            ,
            {test:/\.(eot|ttf|woff|woff2|svg)$/,loader:'file?name=static/fonts/[name].[ext]'}
            // ,
            // {test: /\.eot/,loader : 'file?prefix=font/'},
            // {test: /\.woff/,loader : 'file?prefix=font/&limit=10000&mimetype=application/font-woff'},
            // {test: /\.ttf/, loader : 'file?prefix=font/'},
            // {test: /\.svg/, loader : 'file?prefix=font/'}
            // ,{  //内联
            //     test: /\.scss$/,
            //     loaders: ['style', 'css', 'sass','postcss']
            // }
        ]
    },
    postcss: function() {
        // return [autoprefixer(
        //     {
        //         browsers: ['last 3 versions', '> 1%']
        //     }
        // )];
    },
    //插件配置
    plugins: plugins,
    //调试配置
    devtool: devtool
}

module.exports = config;
