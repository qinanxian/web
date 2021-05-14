import React from "react";
import {Row, Col, DetailInfo, Message, openModal, Modal, Icon, DataTable} from '../../../src/components';

export default class EditDetailInfo extends React.Component {


    constructor(props) {
        super(props);
        const {dataAuditId} = props;
        this.dataAuditId = dataAuditId;
    }

    dataReady = (v) =>{
        const { dataReady } = this.props;
        dataReady && dataReady(v)
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="insure-EditDetailInfo"
                    params={{dataAuditId: this.dataAuditId}}
                    dataReady={this.dataReady}
                />
            </div>
        );
    }
}
