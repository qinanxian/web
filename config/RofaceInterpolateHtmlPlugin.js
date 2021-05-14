'use strict';
const escapeStringRegexp = require('escape-string-regexp');

class RofaceInterpolateHtmlPlugin {
  constructor(replacements) {
    this.replacements = replacements;
  }

  apply(compiler) {
    compiler.plugin('compilation', compilation => {
      compilation.plugin(
        'html-webpack-plugin-before-html-processing',
        (data, callback) => {
          Object.keys(this.replacements).forEach(key => {
            const value = typeof this.replacements[key] === 'function' ? this.replacements[key]() : this.replacements[key];
            data.html = data.html.replace(
              new RegExp('%' + escapeStringRegexp(key) + '%', 'g'),
              value
            );
          });
          callback(null, data);
        }
      );
    });
  }
}

module.exports = RofaceInterpolateHtmlPlugin;
