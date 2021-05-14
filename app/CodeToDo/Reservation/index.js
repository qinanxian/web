import React from "react";


import { DataTable, Message, openModal, Modal,Icon} from '../../../src/components/index';
import {getUser} from "../../../src/lib/cache";

export default class ReservationRecord extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.recordType = '0002';
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
        this.voList.exportExcel(isAll, `预约取号记录表.xlsx`);
    };


    render() {
        return (
            <div>
                <DataTable
                    dataFormId="codetodo-ReservationRecord"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                    params = {{userOrg:this.userOrg,recordType:this.recordType}}
                />
            </div>
        );
    }
}