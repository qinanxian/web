import React from 'react';
import {Iframe,rest} from "../../../src/components";
import * as cache from "../../../src/lib/cache";


export default class PDFViewer extends React.Component {
    calcUrl = (url) => {
        if (url.startsWith('.')){
            const tempUrl = url.replace(/^./g, '');
            return window.location.origin + tempUrl;
        }
        return url;
    };
    render() {
        const {param} = this.props;
        const session = 'X-SESSION-TOKEN';

        const tokenId = cache.getSessionId(session);
        const url = encodeURIComponent(`${this.calcUrl(param.url)}?${session}=${tokenId}`);
        const fullURL = `${rest.getRequestURL('/pdfjs-1.7.225/web/viewer.html')}?file=${url}`;
        return (<Iframe url={fullURL}></Iframe>);
    }
}

