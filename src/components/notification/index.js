import {notification} from 'antd';

const isConfig = (obj) => {
    //看看是不是React元素节点
    if(obj && obj.$$typeof === Symbol.for('react.element')){
        return false;
    }
    let isjson =
        typeof obj === 'object'
        && Object.prototype.toString.call(obj).toLowerCase() === '[object object]'
        && !obj.length;
    return isjson;
};
const notifyInvoke = (type,content,title,duration,style) => {
    let config = {};
    if(isConfig(content)){ //如果content是json表示它的是一config
        config = content;
    }else{
        config = {
            message: title,
            description: content,
        };
        if(duration >= 0){
            config.duration = duration;
        }
        if(style){
            config.style = style;
        }
    }
    if(!config.message){
        config.message = '提示信息';
    }
    return notification[type](config);

};

export const open = (content,title,duration,style) => {
    return notifyInvoke('open',content,title,duration,style);
};
export const success = (content,title,duration,style) => {
    return notifyInvoke('success',content,title,duration,style);
};
export const error = (content,title,duration,style) => {
    return notifyInvoke('error',content,title,duration,style);
};
export const info = (content,title,duration,style) => {
    return notifyInvoke('info',content,title,duration,style);
};
export const warning = (content,title,duration,style) => {
    return notifyInvoke('warning',content,title,duration,style);
};
export const warn = (content,title,duration,style) => {
    return notifyInvoke('warn',content,title,duration,style);
};
export const close = (key) => {
    return notification.close(key);
};
export const destroy = () => {
    return notification.destroy();
};
export const config = (options) => {
    return notification.config(options);
};
