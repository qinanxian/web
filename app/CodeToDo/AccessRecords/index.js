import React from "react";


import { DataTable, Message, openModal, Modal,Icon} from '../../../src/components/index';
import {getUser} from '../../../src/lib/cache';
export default class AccessRecordList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.recordType = '0001';
        this.userOrg = getUser().orgId;
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([
            {
                name: '导出EXCEL',
                type: 'default',
                onClick: () => this.exportExcel(true)
            }
        ]);
    };

    exportExcel = (isAll) => {
        this.voList.exportExcel(isAll, `立即取号记录表.xlsx`);
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="codetodo-AccessRecordList"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                    params = {{userOrg:this.userOrg,recordType:this.recordType}}
                />
            </div>
        );
    }
}