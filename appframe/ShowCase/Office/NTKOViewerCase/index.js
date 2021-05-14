import React from 'react';
import {Iframe, rest} from '../../../../src/components';


export default class NTKOViewerCase extends React.Component {
    render() {
        const {param} = this.props;
        //const fullURL = `${rest.getRequestURL('/pdfjs-1.7.225/web/viewer.html')}?file=${param.url}`;
        //return (<Iframe url={param.url}></Iframe>);
      //ntkoBrowser.openWindow("officecontrol/editindex.html");
      rest.get(param.url);
       //window.open(param.url, '_self','');
    }
}
