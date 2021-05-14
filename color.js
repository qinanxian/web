/* eslint-disable */
const path = require('path');
const { generateTheme } = require('antd-theme-generator');

const options = {
  antDir: path.join(__dirname, './node_modules/antd'),
  stylesDir: path.join(__dirname, './src/style'),
  themeVariables: ['@primary-color'],
  varFile: path.join(__dirname, './src/style/vars.less'),
  mainLessFile: path.join(__dirname, './src/style/main.less'),
  outputFilePath: path.join(__dirname, './public/color.less') // if provided, file will be created with generated less/styles
};

generateTheme(options).then(less => {
  console.log('Theme generated successfully');
})
  .catch(error => {
    console.log('Error', error);
  });
