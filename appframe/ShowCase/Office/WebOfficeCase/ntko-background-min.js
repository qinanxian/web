"use strict";
var varNtkoGUID = Math.random().toString(36);
var ntkoGloablValue = document.createElement("ntko-element");
ntkoGloablValue.setAttribute("id", "ntko-extensions");
document.documentElement.appendChild(ntkoGloablValue);
var userAgent = navigator.userAgent, rMsie = /(msie\s|trident.*rv:)([\w.]+)/, rFirefox = /(firefox)\/([\w.]+)/, rOpera = /(opera).+version\/([\w.]+)/, rChrome = /(chrome)\/([\w.]+)/, rSafari = /version\/([\w.]+).*(safari)/;
var browser;
var version;
var ua = userAgent.toLowerCase();
function uaMatch(ua) {
  var match = rMsie.exec(ua);
  if (match != null) {
    return {browser: "IE", version: match[2] || "0"}
  }
  var match = rFirefox.exec(ua);
  if (match != null) {
    return {browser: match[1] || "", version: match[2] || "0"}
  }
  var match = rOpera.exec(ua);
  if (match != null) {
    return {browser: match[1] || "", version: match[2] || "0"}
  }
  var match = rChrome.exec(ua);
  if (match != null) {
    return {browser: match[1] || "", version: match[2] || "0"}
  }
  var match = rSafari.exec(ua);
  if (match != null) {
    return {browser: match[2] || "", version: match[1] || "0"}
  }
  if (match != null) {
    return {browser: "", version: "0"}
  }
}
var browserMatch = uaMatch(userAgent.toLowerCase());
if (browserMatch.browser) {
  browser = browserMatch.browser;
  version = browserMatch.version
}
var ntkoBrowser = {
  init: function () {
    if (browser == "IE") {
      return true
    }
    var varTitle = ntkoGloablValue.title.toLowerCase();
    if ((null === varTitle) || ("" === varTitle) || ("ntko-extension-title" !== varTitle)) {
      return false
    } else {
      return true
    }
  }, sendmessage: function (strSendMessage) {
    window.sendMessage(strSendMessage)
  }, openWindow: function (strURL, strSessionURL, strOptions) {
    if ((null === strURL) || ("" === strURL)) {
      alert(" The Param strURL of openWindow() is NULL or empty. ");
      return
    }
    if ("/" != strURL.charAt(0)) {
      var strLowser = strURL.toLowerCase();
      if (("http://" === strLowser.substr(0, 7)) || ("https://" === strLowser.substr(0, 8))) {
      } else {
        var pathName = window.location.href;
        var varLength = pathName.lastIndexOf("/");
        strURL = pathName.substr(0, varLength + 1) + strURL
      }
    } else {
      var pathName = window.location.href;
      var varLength = pathName.lastIndexOf("/");
      strURL = pathName.substr(0, varLength + 1) + strURL
    }
    var jsonValue = '{"OpenWindow":1,"URL":"';
    jsonValue += strURL;
    jsonValue += '","GUID":"';
    jsonValue += varNtkoGUID;
    jsonValue += '","URLMD5":"';
    jsonValue += strURL;
    jsonValue += '"';
    if (typeof strSessionURL != "undefined" && ((null != strSessionURL) || ("" != strSessionURL))) {
      var pathName = window.location.href;
      var varLength = pathName.lastIndexOf("/");
      strSessionURL = pathName.substr(0, varLength + 1) + strSessionURL;
      jsonValue += ',"SessionURL":"';
      jsonValue += strSessionURL;
      jsonValue += '"'
    }
    if (typeof strOptions != "undefined" && ((null != strOptions) || ("" != strOptions))) {
      jsonValue += ',"Options":"';
      jsonValue += strOptions;
      jsonValue += '"'
    }
    jsonValue += "}";
    if (browser == "IE") {
      window.open(strURL, "", "height=759, width=1440, toolbar =no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no")
    }
    if (browser == "firefox") {
      if (version >= "50") {
        window.postMessage({type: "FROM_NTKO_PAGE", text: jsonValue}, "*")
      } else {
        window.open(strURL, "", "height=759, width=1440, toolbar =no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no")
      }
    }
    if (browser == "chrome") {
      if (version >= "45") {
        window.postMessage({type: "FROM_NTKO_PAGE", text: jsonValue}, "*")
      } else {
        window.open(strURL, "", "height=759, width=1440, toolbar =no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no")
      }
    }
  }
};
export default ntkoBrowser;