import React from "react";
import {Row, Col, DetailInfo, Message, openModal, Modal, Icon, DataTable} from '../../../src/components';

export default class GetCompanyInfo extends React.Component {


    constructor(props) {
        super(props);
        const {netorgNo} = props;
        this.netorgNo = netorgNo;
    }

    dataReady = (v) =>{
        const { dataReady } = this.props;
        dataReady && dataReady(v)
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="insure-GetCompanyInfo"
                    params={{netorgNo: this.netorgNo}}
                    dataReady={this.dataReady}
                />
            </div>
        );
    }
}
