import * as rest from './rest';
import {Modal} from '../components';

export const open = (path, style) => {
    const url = rest.getRequestURL(path, true);
    //POBrowser在打开过文件关闭后，取不到文件是否关闭，如果不刷新窗口，就打不开文件，因此这里放弃这种形式，依然使用Link形式打开
    const usePOBrowser = true;
    console.log('window.POBrowser:', window.POBrowser);
    if (usePOBrowser) {
        if (window.POBrowser) {
            // const pob = window.POBrowser;
            // pob.openWindowModeless(url, style);
            // pob.openWindow(url, style);
            window.POBrowser.openWindowModeless(path,'width=1200px;height=800px;');
        } else {
            Modal.error({
                title: 'WebOffice出错',
                content: '请先安装WebOffice控件,该控件对应的JS资源未加载成功！',
            });
        }
    } else {
        const fullURL = `PageOffice://|${url}|||`;
        window.open(fullURL, '_self',style || '');
        // rest
        //     .jQuery
        //     .ajax({
        //         url: fullURL,
        //         type: 'GET',
        //         async: false,
        //         dataType: 'jsonp',
        //         success: () => {},
        //         complete: (xhr,status) => {
        //             console.log(xhr,status);
        //         },
        //     });
    }

};

export const ntkoOpen = (path, style) => {
    const url = rest.getRequestURL(path, true);
    //POBrowser在打开过文件关闭后，取不到文件是否关闭，如果不刷新窗口，就打不开文件，因此这里放弃这种形式，依然使用Link形式打开
    const usePOBrowser = false;
    console.log('window.POBrowser:', window.POBrowser);
    if (usePOBrowser) {
        if (window.POBrowser) {
            window.POBrowser.openWindowModeless(path,'width=1200px;height=800px;');
        } else {
            Modal.error({
                title: 'WebOffice出错',
                content: '请先安装WebOffice控件,该控件对应的JS资源未加载成功！',
            });
        }
    } else {
        //const fullURL = `PageOffice://|${url}|||`;
        window.open(url, '_self',style || '');

    }

};

export const openInstall = () => {
    window.POBrowser && window.POBrowser.openWindowModeless('about:blank');
};

