import React from "react";
import Formatdoc from "../../Common/Formatdoc";

/**
 * 调查报告
 */
export default class ApplicationFormatdoc extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inquireDocId: props.param.inquireDocId,
        };
    }


    render() {
        return (<Formatdoc formatdocId={this.state.inquireDocId}/>);
    }
}
