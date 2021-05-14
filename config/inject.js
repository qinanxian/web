var profile = require('../profile');
var config = require('./default.config');

function getParam(name, params) {
  var param = (params || []).filter(item => item.startsWith(name + '='))[0];
  return param && param.split('=')[1];
}

module.exports = function () {
  const argv = process.argv;
  var path = profile.baseUrl;
  var legendBottom = profile.layoutLevel[profile.layoutLevelDefault].legendBottom;
  var formItemBottom = profile.layoutLevel[profile.layoutLevelDefault].formItemBottom;
  var menuHeight = profile.layoutLevel[profile.layoutLevelDefault].menuHeight;
  var lineHeight = profile.layoutLevel[profile.layoutLevelDefault].lineHeight;
  var btnHeight = profile.layoutLevel[profile.layoutLevelDefault].btnHeight;
  var btnPadding = profile.layoutLevel[profile.layoutLevelDefault].btnPadding;
  var inputHeightBase = profile.layoutLevel[profile.layoutLevelDefault].inputHeightBase;
  var cusFontSizeText = profile.layoutLevel[profile.layoutLevelDefault].cusFontSizeText;
  var fontSize = profile.layoutLevel[profile.layoutLevelDefault].fontSize;
  var tableCellPadding = profile.layoutLevel[profile.layoutLevelDefault].tableCellPadding;
  var tableHeadFontSize = profile.layoutLevel[profile.layoutLevelDefault].tableHeadFontSize;
  var primaryColor = profile.surface.primaryColor;
  var staticUrl = `${config.protocol}://${config.host}:${config.port}`;
  var fileSize = 4;
  var customPage = 'true';
  var loginPage = 1;
  var fontFamily = profile.fontFamily || config.fontFamily;
  if (process.env.NODE_ENV === 'production') {
    // 截取参数数组 一共四个参数
    var tempArgv = [].concat(argv);
    var params = tempArgv.splice(2, argv.length);
    legendBottom = getParam('legendBottom',params) || legendBottom;
    formItemBottom = getParam('formItemBottom',params) || formItemBottom;
    menuHeight = getParam('menuHeight',params) || menuHeight;
    lineHeight = getParam('lineHeight',params) || lineHeight;
    fontSize = getParam('fontSize',params) || fontSize;
    btnHeight = getParam('btnHeight',params) || btnHeight;
    btnPadding = getParam('btnPadding',params) || btnPadding;
    inputHeightBase = getParam('inputHeightBase',params) || inputHeightBase;
    cusFontSizeText = getParam('cusFontSizeText',params) || cusFontSizeText;
    tableCellPadding = getParam('tableCellPadding',params) || tableCellPadding;
    tableHeadFontSize = getParam('tableHeadFontSize',params) || tableHeadFontSize;
    primaryColor = getParam('primaryColor',params) || primaryColor;
    path = getParam('host', params) || '';
    staticUrl = getParam('static', params) || '';
    fileSize = getParam('fileSize', params) || fileSize;
    customPage = getParam('customPage', params) || 'false';
    fontFamily = getParam('fontFamily', params) || fontFamily;
  }
  return {
    path,
    staticUrl,
    menuHeight,
    lineHeight,
    btnHeight,
    btnPadding,
    legendBottom,
    formItemBottom,
    fileSize,
    customPage,
    fontSize,
    tableCellPadding,
    tableHeadFontSize,
    cusFontSizeText,
    inputHeightBase,
    fontFamily,
    primaryColor
  };
};
