var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var RofaceInterpolateHtmlPlugin = require('./RofaceInterpolateHtmlPlugin');
var ScriptExtHtmlPlugin = require('script-ext-html-webpack-plugin');
var defaultConfig = require('./default.config');
var resolveConfig = require('./inject');
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

const getBaseUrl = () => {
  var fileName = '../profile'+evn+'.js';
  return eval(fs.readFileSync(path.resolve(__dirname, fileName)).toString()).baseUrl;
};

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: {
        app: [
          path.resolve(__dirname, '../src/lib/string'),
          path.resolve(__dirname, '../src/lib/Math'),
          path.resolve(__dirname, '../src/index')
        ],
        vendor: [require.resolve('babel-polyfill'), 'react', 'react-dom', 'antd', 'react-router-dom']
    },
    output: {
        path: path.resolve(__dirname, '../static'),
        filename: "[name].js",
        //publicPath: "http://localhost:3004/"
    },
    resolve: {
      alias: {
        'roface': path.resolve(__dirname, '../index')
      }
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({name: 'vendor',  filename: 'vendor.js'}),
        new RofaceInterpolateHtmlPlugin({
          baseUrl: getBaseUrl
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(__dirname, `../public/template/main${evn}.html`),
            filename: 'main.html',
            chunks: ['vendor','app']
        }),
        new HtmlWebpackPlugin({
            inject: false,
            template: path.resolve(__dirname, `../public/template/index${evn}.html`),
            filename: 'index.html',
        }),
        new ScriptExtHtmlPlugin({
            defaultAttribute: 'defer'
        }),
        new OpenBrowserPlugin({ url: `${defaultConfig.protocol}${evn === '-szc' ? 's' : ''}://${defaultConfig.host}:${defaultConfig.port}/index.html`}),
        new ExtractTextPlugin('style.css')
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
                test: /\.(js|tsx|jsx)$/,
                exclude: /node_modules/,
                loader: "eslint-loader"
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [ "css-loader",
                      { loader: "postcss-loader", options: { plugins: () => [ require('autoprefixer')({
                            browsers: [
                              '>1%',
                              'last 4 versions',
                              'Firefox ESR',
                              'not ie < 9', // React doesn't support IE8 anyway
                            ]
                          }) ]}}
                     ]
                })
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ["css-loader", { loader: "postcss-loader", options: { plugins: () => [ require('autoprefixer')({
                          browsers: [
                            '>1%',
                            'last 4 versions',
                            'Firefox ESR',
                            'not ie < 9', // React doesn't support IE8 anyway
                          ]
                        }) ]}},
                      { loader: 'less-loader', options: {
                        "modifyVars":{ '@icon-url': "'"+ defaultConfig.icon + "'",'@font-size-base':config.fontSize,
                          '@tableCellPadding':config.tableCellPadding,'@tableHeadFontSize':config.tableHeadFontSize,
                          '@font-size-text':config.cusFontSizeText,'@input-height-base':config.inputHeightBase,
                          '@padding-md':config.btnPadding,'@btn-height-base':config.btnHeight,
                          '@menuHeight':config.menuHeight,'@formItemBottom':config.formItemBottom,
                          '@inputHeightBase':config.inputHeightBase,'@legendBottom':config.legendBottom,
                          '@font-family': config.fontFamily,'@primary-color':config.primaryColor
                        }
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
                loader: "imports-loader?evn=>'" + evn + "',baseUrl=>'',staticUrl=>'" + config.staticUrl + "',customPage=>'" + config.customPage + "'"
            }
        ]
    }
}
