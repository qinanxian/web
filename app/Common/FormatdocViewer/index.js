import React from "react";
import {rest,Iframe} from '../../../src/components/index';


export default class FormatdocViewer extends React.Component {
    render() {
        const{param} = this.props;
        const {url} = param;
        return (<Iframe {...this.props} allowNewWindow={false} url={rest.getRequestURL(url)}/>);
        // return (<div>Hello</div>);
    }
}
