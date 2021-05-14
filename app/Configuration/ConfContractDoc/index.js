import React from "react";
import ConfInquire from '../ConfInquire'

export default class ConfContractDoc extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        return (<ConfInquire {...this.props} title={'合同模板'} dossierType={'CONTRACT_DOC'}/>);
    }

}