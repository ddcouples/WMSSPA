/**
 * Created by yangl on 2017/4/14.
 */
var path=require('path'),
    webpack=require('webpack'),
    buildPath = path.resolve(__dirname, "build"),//发布目录;
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    NgAnnotatePlugin = require('ng-annotate-webpack-plugin'); //自动注入注解插件;
module.exports={
   entry:{
       app:['webpack/hot/only-dev-server', path.resolve(__dirname, 'src/index.js')]
   },
    output:{
        path: buildPath,
        filename:'static/js/bundle.js',
        publicPath:''
    },
    //本地服务器配置
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        grogress: true
    },
    module: {
        loaders: [
            {test: /\.json$/,loader: 'json-loader'},
            {
                test: /\.html$/,
                loader: 'raw'
            },
            {
              test:require.resolve('zepto'),
              loader:'exports-loader?window.Zepto!script-loader'//处理zepto不支持export的问题
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
                // loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
                loader:'style-loader!css-loader!sass-loader'
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
    plugins:[
        new NgAnnotatePlugin({
            add: true
        }),
        new ExtractTextPlugin("css/styles.[hash:6].css"),
        new webpack.HotModuleReplacementPlugin()
    ]
};