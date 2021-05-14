var loaderUtils = require("loader-utils");
module.exports = function(content) {
    if(this.cacheable) this.cacheable();
    var query = loaderUtils.getOptions(this) || {};
    var value = query.evn;
    var importFile = `import profileCustomize from '../../profile${value}';`;
    return importFile + '\n' + content;
};
