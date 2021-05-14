import React from "react";

import {Iframe} from "../../../src/components";

export default class ReportThree extends React.Component {
    render() {
        return (
            <div>
                <Iframe {...this.props} offsetTop={175} allowNewWindow={true}
                                     url='http://cloud.enjoyqb.com:8888/h5/reportThree.html?applyId=CQ20181119095949921856229'/>
            </div>
        );
    }
}