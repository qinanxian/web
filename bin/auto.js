var fs = require('fs');
var path = require ('path');

var defaultConfig = require('../config/default.config');

// 检查app目录下的文件
var fileObj = {};

function checkFirstUp(str) {
  var firstStr = str.substr(0, 1);
  return firstStr.toLocaleUpperCase() === firstStr;
}

function isDir (dir, file) {
  var pathname = path.join(dir, file);
  if (fs.lstatSync(pathname).isDirectory()) {
    return true;
  }
  return false;
}

function checkIsCom(dir, ignore) {
  var files = fs.readdirSync(dir).filter(f => !f.startsWith('.') || f.startsWith('.rof.index.js'));
  var filterFiles = files
    .filter(file => !ignore.includes(file) && checkFirstUp(file) && isDir(dir, file));
  if (filterFiles.length === 0) {
    return false
  }
  if (files.some((file) => !checkFirstUp(file) && file !== 'index.js' && file !== '.rof.index.js')
    || (files.length === 1 && files[0] === 'index.js' && files[0] !== '.rof.index.js')) {
    return false;
  }
  return true;
}

function checkDir(dir, ignore) {
  // 刪除autoIndex文件
  if (fs.existsSync(dir + '/autoIndex.js')) {
    fs.unlinkSync(dir + '/autoIndex.js');
  }
  var files = fs.readdirSync(dir);
  if (!files.some((file) => !checkFirstUp(file) && file !== 'index.js' && file !== '.rof.index.js')) {
    files.forEach(function (file) {
      var pathname = path.join(dir, file);
      if (fs.lstatSync(pathname).isDirectory()) {
        if(!pathname.includes('.') && !ignore.includes(file) && checkFirstUp(file)){
          var tempFiles = fs.readdirSync(pathname);
          // 过滤掉空目录或者含有特殊文件的目录
          if (tempFiles.filter(file => !file.startsWith('.')).length !== 0) {
            if (!fileObj[dir]) {
              fileObj[dir] = [];
            }
            fileObj[dir].push({
              name: file,
              isDir: checkIsCom(dir + '/' + file, ignore)
            });
            checkDir(pathname, ignore);
          }
        }
      }
    });
  }
}

function autoJs(fileObj) {
  console.log('开始生成文件');
  Object.keys(fileObj).forEach(function (field) {
    var data = '// 该文件为自动生成，手动修改无效\n';
    data = data + fileObj[field].map(function (file) {
      if (file.isDir) {
        return 'export * as ' + file.name + ' from \'./' + file.name + '/.rof.index\';'
      } else {
        return 'export ' + file.name + ' from \'./' + file.name + '\';'
      }
    }).join('\n');
    //console.log(fileObj);z
    fs.writeFileSync(field + '/.rof.index.js', data);
    console.log(field + '/.rof.index.js 文件生成');
  })
  console.log('app,appframe 所有索引文件已经成功生成');
}

// 过滤掉Container目录
// 自动生成app索引文件 该目录下文件无需过滤
checkDir(path.resolve(__dirname, '../app'), []);
// 自动生成appframe索引文件
checkDir(path.resolve(__dirname, '../appframe'), defaultConfig.autoJsIgnore);

autoJs(fileObj);
