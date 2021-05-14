var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ScriptExtHtmlPlugin = require('script-ext-html-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
var resolveConfig = require('./inject');
var defaultConfig = require('./default.config');
// 获取所有注入的配置文件
var config = resolveConfig();

// 获取加载配置文件的类型
var tempArgv = [].concat(process.argv);
var evn = tempArgv.splice(2, process.argv.length).filter(function (p) {
    return !p.includes('=');
})[0] || '';

// 给当前环境加上前缀
if (evn) {
    evn = '-' + evn;
}

// 给index.js文件注入参数
var data = fs.readFileSync(path.resolve(__dirname, '../public/asset/index.js'));
var tempData = 'var fileSize=' + config.fileSize + ';\n' + data.toString();
fs.writeFileSync(path.resolve(__dirname, '../public/loadIndex.js'), tempData);

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: {
      app:[
        path.resolve(__dirname, '../src/lib/string'),
        path.resolve(__dirname, '../src/lib/Math'),
        path.resolve(__dirname, '../src/index')],
      vendor: [require.resolve('babel-polyfill'), 'react', 'react-dom', 'antd', 'react-router-dom']
    },
    output: {
        path: path.resolve(__dirname, '../static'),
        filename: "[name].[chunkhash:8].js"
    },
    resolve: {
      alias: {
        'roface': path.resolve(__dirname, '../index')
      }
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({name: 'vendor',  filename: '[name].[chunkhash:8].js'}),
        new InterpolateHtmlPlugin({
          baseUrl: config.path
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(__dirname, `../public/template/main${evn}.html`),
            filename: 'main.html',
            chunks: ['vendor','app'],
            minify: {
              // 压缩html
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true
            },
        }),
        new HtmlWebpackPlugin({
            inject: false,
            template: path.resolve(__dirname, `../public/template/index${evn}.html`),
            filename: 'index.html',
        }),
        new ScriptExtHtmlPlugin({
          defaultAttribute: 'defer'
        }),
        new OptimizeCssAssetsPlugin({
          // 压缩css
          assetNameRegExp: /\.css$/g,
          cssProcessor: require('cssnano'),
          cssProcessorOptions: { discardComments: { removeAll: true } },
          canPrint: true
        }),
        new ExtractTextPlugin('style.[chunkhash:8].css'),
        new webpack.optimize.UglifyJsPlugin({
          // 使用webpack自带的文件压缩插件
          compress: {
            // 去除console.log
            drop_console: true
          },
          // 如果启用了压缩无法生成map文件，需要在此处开启
          //sourceMap: true,
        }),
        new CopyWebpackPlugin([
          {
            from: path.resolve(__dirname, '../public'),
            to: path.resolve(__dirname, '../static'),
            ignore: ['asset/index.js', 'template/*.html'],
            copyUnmodified: true
          },
        ])
    ],
    resolveLoader:{
        modules: ['node_modules','config']
    },
    externals: {
      jquery: 'jQuery'
    },
    module: {
        loaders: [
          {
            test: /\.bpmn$/,
            use: 'raw-loader'
          },
            {
                test: /\.(js|tsx|jsx)$/,
                exclude: /node_modules/,
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
                    }, { loader: "postcss-loader", options: { plugins: () => [ require('autoprefixer')({
                        browsers: [
                          '>1%',
                          'last 4 versions',
                          'Firefox ESR',
                          'not ie < 9', // React doesn't support IE8 anyway
                        ]
                      }) ]}}]
                })
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader',
                      { loader: "postcss-loader", options: { plugins: () => [ require('autoprefixer')({
                          browsers: [
                            '>1%',
                            'last 4 versions',
                            'Firefox ESR',
                            'not ie < 9', // React doesn't support IE8 anyway
                          ]
                        }) ]}},
                      { loader: 'less-loader', options: {
                        "modifyVars":{ '@icon-url': "'"+ config.staticUrl + defaultConfig.icon + "'",'@font-size-base':config.fontSize,
                          '@tableCellPadding':config.tableCellPadding,'@tableHeadFontSize':config.tableHeadFontSize,
                          '@font-size-text':config.cusFontSizeText,'@input-height-base':config.inputHeightBase,
                          '@padding-md':config.btnPadding,'@btn-height-base':config.btnHeight,
                          '@menuHeight':config.menuHeight,'@formItemBottom':config.formItemBottom,
                          '@inputHeightBase':config.inputHeightBase,'@legendBottom':config.legendBottom, '@font-family': config.fontFamily}
                      }}]
                })
            },
            {
              test: /\.(png|jpg|svg|gif)$/,
              loader: 'url-loader',
              options: {
                limit: 8192
              }
            },
            {
                test: require.resolve('../src/lib/config'),
                loader: "RofaceConfigLoader?evn=" + evn + ""
            },
            {
                test: require.resolve('../src/lib/config'),
                loader: "imports-loader?evn=>'" + evn + "',baseUrl=>'" + config.path
                + "'" + ",staticUrl=>'" + config.staticUrl + "',customPage=>'" + config.customPage + "'"
            }
        ]
    }
}
