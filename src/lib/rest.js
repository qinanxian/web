import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import config from './config';
import * as cache from '../../src/lib/cache';
import { RestDownLoad, Modal, CountDown } from '../../src/components';

/**
 * 拼接上配置的基础路径，最终计算出一个可以直接访问的URL地址，
 * 是整个rest异步访问非常重要的一项基础功能
 * @param url
 * @returns {string}
 */
export const jQuery = $;
export const getRequestURL = (url,containSession) => {
  let fullURL = url;
    if (config.evn === '-szc' && url.startsWith('/face')) {
      // 如果是苏州中心的环境则需要开启人脸登录功能，此处是为了解决浏览器的跨域问题，与webpack的配置一起对所有人脸验证的请求进行转发
      fullURL = url;
    } else if (!url.startsWith('http') && !url.startsWith(config.baseUrl)) {
      fullURL = `${config.baseUrl}${url}`;
    }
    if(containSession){
        if(fullURL.indexOf('?') > 0){
            fullURL = `${fullURL}&`;
        }else{
            fullURL = `${fullURL}?`;
        }
        fullURL = `${fullURL}X-SESSION-TOKEN=${cache.getSessionId()}`;
    }
    return fullURL;
};

export const getLocationURL = (url) => {
    return `${config.staticUrl}${url}`;
};

/**
 * 把URL参数中序列化对象转为JSON对象
 * 如:a=1&b=2&b=3&c=4 转为 {a:1,b:[2,3],c:4}
 * @param str
 */
export const unserializeURLParam = (strPara) => {
    let regResult;
    const ret = {};
    const regPara = /([^&=]+)=([\w\W]*?)(&|$|#)/g;
    while ((regResult = regPara.exec(strPara)) != null) {
        const k = regResult[1], v = regResult[2];
        if (!ret[k]) {
            ret[k] = v;
        } else if (Object.prototype.toString.call(ret[k]) === '[object Array]') {
            ret[k].push(v); //如果是数组，则直接把参值放进去
        } else {
            ret[k] = [ret[k]];  //如果之前的值，则转换成数组，把值放进去
            ret[k].push(v);
        }
    }
    return ret;
};

/**
 * 把URL中的URL地址和参数部分分解出来
 * http://www.amasoft.com/abc?a=1&b=2&b=3&c=4 {url:'http://www.amasoft.com/abc',param:{a:1,b[2,3],c:4}}
 * @param url
 * @returns {{url: string, param: {}}}
 */
export const parseURL = (url) => {
    const ret = {url: url, param: {}};

    const regUrl = /^([^\?]+)\?([\w\W]+)$/;
    const arrUrl = regUrl.exec(url);

    if (arrUrl && arrUrl[2]) {
        ret.url = arrUrl[1];
        ret.param = unserializeURLParam(arrUrl[2]);
    } else {
        return ret;
    }

    return ret;
};

export const serializeParam = (params, field) => {
  let str = '';
  if (typeof params === 'string') {
    str = params;
  } else if(Array.isArray(params) && field) {
      params.forEach((p) => {
        if (typeof p === 'string' || typeof p === 'number') {
          str = `${str}&${field}=${p}`;
        }
      });
  } else {
    Object.keys(params).forEach((p) => {
      if (Array.isArray(params[p])) {
        str = `${str}&${serializeParam(params[p], p)}`;
      } else {
        str = `${str}&${p}=${params[p]}`;
      }
    });
  }
  return encodeURIComponent(str.replace(/^&/g, ''));
};

const authorityCheck = (status, rej) => {
  if (status === 'session invalid') {
    cache.clear();
    window.location.reload();
  } else if (status === 'kick out') {
    const countEnd = () => {
      cache.clear();
      window.location.reload();
    };
    Modal.error({
      title: '该账户已经在其他设备登陆！',
      content: <span>该账户已经在其他设备登陆，请确定你的密码没有泄露！
        <CountDown count={30} countEnd={countEnd}/>s后将自动跳转至登陆页面！</span>,
      okText: '立即跳转',
      onOk: () => {
        cache.clear();
        window.location.reload();
      },
    });
  } else {
    rej && rej();
    Modal.error({
      title: '无权访问',
      content: '无权访问访问该页面',
    });
  }
};

export const restAjax = (url, type, data, request) => {
    // 网络请求
    const urlObject = parseURL(url);
    const reqURL = url.startsWith('http') ? urlObject.url : getRequestURL(urlObject.url);
    let paramObject = {};
    if (data) {
        if (typeof data !== 'object') {
            paramObject = unserializeURLParam(data);    //如果传的参数是字串，则对字串进行解析处理
        } else {
            paramObject = data;
        }
    }

    // 未考虑到数组？做了数据为数组时的兼容，时间紧急，如有问题请自行修改
    let reqData = urlObject.param || {};    //默认URL中参数填充，如果参数列表中有更新的，则使用更新的
    if (paramObject instanceof Object && !(paramObject instanceof Array)) {
      $.extend(reqData, paramObject);
    } else {
      reqData = paramObject;
    }
    // console.log('url-param:',reqData,$.param(reqData));
    if (type.toLowerCase() === 'get' || type.toLowerCase() === 'delete') {
        reqData = $.param(reqData, true);
    }

    return new Promise((resolve, reject) => {
        $.ajax({
            contentType: 'application/json;charset=utf-8',
            url: reqURL,
            data: typeof reqData === 'string' ? reqData : JSON.stringify(reqData),
            cache: false,
            xhrFields: {
              withCredentials: true,
            },
            ...request,
            beforeSend: (xhr) => {
              xhr.setRequestHeader('X-SESSION-TOKEN', cache.getSessionId());
            },
            type,
            error: (xhr, status, err) => {
              if (xhr.getResponseHeader('WWW-Authenticate') && xhr.status === 401) {
                authorityCheck(xhr.getResponseHeader('WWW-Authenticate'), () => {
                  reject(xhr.responseJSON || err || status);
                });
                //cache.clear();
                //window.location.reload();
              } else {
                reject(xhr.responseJSON || err || status);
              }
            },
            success: (result, status, xhr) => {
              if (xhr.getResponseHeader('WWW-Authenticate') && xhr.status === 401) {
                authorityCheck(xhr.getResponseHeader('WWW-Authenticate'));
                //cache.clear();
                //window.location.reload();
                //reject();
              } else {
                resolve(result);
              }
            },
        });
    });
};

export const get = (url, param, request) => {
    return restAjax(url, 'get', param, request);
};
export const post = (url, param, request) => {
    return restAjax(url, 'post', param, request);
};
export const put = (url, param, request) => {
    return restAjax(url, 'put', param, request);
};
export const del = (url, param, request) => {
    return restAjax(url, 'delete', param, request);
};

export const download = (url, type = 'get', param) => {
  // 下载操作
  // 创建
  let div = document.getElementById('download_div');
  if (!div) {
    div = document.createElement('div');
    div.setAttribute('id', 'download_div');
    document.body.appendChild(div);
  }
  let divChild = document.createElement('div');
  div.appendChild(divChild);
  const removeDom = () => {
    div.removeChild(divChild);
  };
  // 渲染执行
  ReactDOM.render(
    <RestDownLoad url={url} type={type} param={param} removeDom={removeDom}/>,
    divChild,
  );
};
