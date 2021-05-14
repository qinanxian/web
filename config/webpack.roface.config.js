var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: [path.resolve(__dirname, '../index')],
    output: {
        library: 'Roface',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        path: path.resolve(__dirname, '../roface'),
        filename: "index.js"
    },
    plugins: [
      new ExtractTextPlugin('style.css'),
      new webpack.optimize.UglifyJsPlugin({
        // 使用webpack自带的文件压缩插件
        compress: {
          // 去除console.log
          drop_console: true
        },
        // 如果启用了压缩无法生成map文件，需要在此处开启
        sourceMap: true,
      })
    ],
    module: {
        loaders: [
            {
                test: /\.bpmn$/,
                use: 'raw-loader'
            },
            {
                test: /\.(js|tsx|jsx)$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader", use: [{
                        loader: "css-loader",
                        options:{
                          minimize: true //css压缩
                        }
                    }, { loader: "postcss-loader", options: { plugins: () => [ require('autoprefixer') ]}}]
                })
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'less-loader']
                })
            },
            {
                test: /\.(png|jpg|svg)$/,
                loader: 'url-loader'
            }
        ]
    }
}