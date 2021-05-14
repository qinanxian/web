process.env.NODE_ENV = 'development';
var webpack = require('webpack');
var path = require('path');
var config = require('../config/webpack.dev.config.js');
var defaultConfig = require('../config/default.config');
var host = defaultConfig.host;
var port = defaultConfig.port;
var protocol = defaultConfig.protocol;

var WebpackDevServer = require('webpack-dev-server');
var formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

config.entry.app.unshift(`webpack-dev-server/client?${protocol}://${host}:${port}/`);

// 获取加载配置文件的类型
var tempArgv = [].concat(process.argv);
var evn = tempArgv.splice(2, process.argv.length).filter(function (p) {
    return !p.includes('=');
})[0] || '';

var compiler = webpack(config);

compiler.plugin('invalid', function () {
    console.log('Compiling...');
});

compiler.plugin('done', function (stats) {
    var messages = formatWebpackMessages(stats.toJson({}, true));
    if (!messages.errors.length && !messages.warnings.length) {
        console.log('Compiled successfully!');
    }
    if (messages.errors.length) {
        console.log('Failed to compile.');
        return;
    }
    if (messages.warnings.length) {
        console.log('Compiled with warnings.');
        console.log('You may use special comments to disable some warnings.');
    }
});

var devServer = new WebpackDevServer(compiler, {
    //historyApiFallback: true, // 所有的跳转都指向index.html
    stats: {colors: true},
    headers: {
        "Access-Control-Allow-Origin": "http://localhost:8081",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "x-requested-with,content-type"
    },
    hot: false,     //关闭自动刷新
    inline: false,  //关闭自动刷新
    https: evn === 'szc',
    contentBase: path.resolve(__dirname, '../public'),
    proxy: evn === 'szc' ? {
        '/face/*': {
            target: 'https://api.ai.qq.com/fcgi-bin/face',
            changeOrigin: true,
            pathRewrite: {
                '/face/*': ''
            }
        }
    } : {},
});

devServer.listen(port);
