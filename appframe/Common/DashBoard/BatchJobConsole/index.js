import React from "react";
import BatchJobConsole from "../../../BatchJobConsole";

export default class PublicNoticeList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <BatchJobConsole {...this.props}/>
    }
}