import React from 'react';
import {Iframe, rest} from '../../../../src/components';


export default class PDFViewerCase extends React.Component {
    render() {
        const {param} = this.props;
        const fullURL = `${rest.getRequestURL('/pdfjs-1.7.225/web/viewer.html')}?file=${param.url}`;
        return (<Iframe url={fullURL}></Iframe>);
    }
}

