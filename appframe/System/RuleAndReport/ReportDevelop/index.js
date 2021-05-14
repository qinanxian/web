import React from "react";
import {rest,Iframe} from "roface";

export default class ReportDevelop extends React.Component {

    render() {
        return (<Iframe {...this.props} allowNewWindow={true} url={rest.getRequestURL('/ureport/designer')}></Iframe>);
    }
}