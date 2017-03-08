var webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'), //模板插件
    OpenBrowserPlugin=require('open-browser-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"), //Css分割插件
    CleanWebpackPlugin = require('clean-webpack-plugin'), // 删除插件
    NgAnnotatePlugin = require('ng-annotate-webpack-plugin'), //自动注入注解插件
    autoprefixer = require('autoprefixer'),
    path = require('path'),
    buildPath = path.resolve(__dirname, "webapp"), //发布目录
    __DEV__ = process.env.NODE_ENV == 'dev', //发布环境
    publicPath = '', //资源引用统一前缀
    devtool = '', //source-map模式
    CompressionWebpackPlugin=require('compression-webpack-plugin'),// 开启gzip压缩
    plugins = [
        new HtmlWebpackPlugin({
            inject: true, // 自动注入
            minify: {
                removeComments: true,        //去注释
                collapseWhitespace: true,    //压缩空格
                removeAttributeQuotes: true  //去除属性引用
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            //必须通过上面的 CommonsChunkPlugin 的依赖关系自动添加 js，css 等
            chunksSortMode: 'dependency'
        }),
        // new OpenBrowserPlugin({  //打开地址
        //     url: 'http://localhost:8080'
        // }),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'static/dist/vendor.[hash:6].js'),
        new HtmlWebpackPlugin({
            chunks: ['app', 'vendor'],
            template: __dirname + '/www/template/index.html',//读取的模板文件,这个路径是相对于当前这个配置文件的
            filename: './index.html',//生成的文件，从 output.path 开始 output.path + "/index.html"
            inject: true, // 自动注入
            minify: {
                removeComments: true,        //去注释
                collapseWhitespace: true,    //压缩空格
                removeAttributeQuotes: true  //去除属性引用
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            //必须通过上面的 CommonsChunkPlugin 的依赖关系自动添加 js，css 等
            chunksSortMode: 'dependency'
        }),
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
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new CompressionWebpackPlugin({
            asset:'[path].gz[query]',
            algorithm:'gzip',
            test: new RegExp(
                '\\.(js|css)$'    //压缩 js 与 css
            ),
            threshold: 10240,
            minRatio: 0.8
        }),
        new webpack.HotModuleReplacementPlugin() //webpack 打包生成的文件 出现 [HMR] Hot Module Replacement is disabled.fa
    ];
if (!__DEV__) {

    //压缩
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        comments: false,        //false为去掉注释我问问
        compress: {
            warnings: false//忽略警告,要不然会有一大堆的黄色字体出现……
        }
    }));

    // publicPath = process.env.NODE_ENV == 'test' ? 'test.domain.com' : 'www.domain.com';
    devtool = 'source-map';
}

var config = {
    //入口文件配置
    entry: {
        app:['webpack/hot/only-dev-server', path.resolve(__dirname, 'www/app/app.js')],
        vendor: ["angular","angular-animate", 'angular-ui-router', 'oclazyload','jquery','bootstrap']
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
        loaders: [
            {test: /\.json$/,loader: 'json-loader'},
            {
            test: /\.html$/,
            loader: 'raw'
        },
            {
            test: /\.(png|jpg|gif)$/,
            loader: 'url?limit=8192,name=/static/img/[name].[hash:6].[ext]'
        }, {
            test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,
            loader: 'url-loader?importLoaders=1&limit=1000&name=static/fonts/[name].[ext]'
        }, {
            test: /\.css$/,
            loaders: ['style', 'css'],
        }, { //外链  //去除注释
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader!postcss-loader")
        }
            ,
            {test:/\.(eot|ttf|woff|woff2|svg)$/,loader:'file?name=static/fonts/[name].[ext]'}
            // ,
            // {test: /\.eot/,loader : 'file?name=static/fonts/[name].[ext]'},
            // {test: /\.woff/,loader : 'file?name=static/fonts/[name].[ext]&limit=10000&mimetype=application/font-woff'},
            // {test: /\.ttf/, loader : 'file?name=static/fonts/[name].[ext]'},
            // {test: /\.svg/, loader : 'file?name=static/fonts/[name].[ext]'}

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
