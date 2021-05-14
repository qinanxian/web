import React from 'react'

import {DataTable, Message, Notify, openModal, Modal, rest} from '../../../src/components';

import AppraiseRecordInfo from './AppraiseRecordInfo';
import {getUser} from "../../../src/lib/cache";

export default class AppraiseRecordList extends React.Component {
    static AppraiseRecordInfo = AppraiseRecordInfo

    constructor(props) {
        super(props);
        this.state = {};
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
        this.voList.addButton([{
            name: '详情',
            selectBind: true,
            onClick: this.openAppraiseRecordInfo
        }
        ]);

    };

    exportExcel = (isAll) => {
        this.voList.exportExcel(isAll, `评价记录.xlsx`);
    };

    openAppraiseRecordInfo = (voList) => {
        const selectedRows = this.voList.getSelectedRows();
        const id = this.voList.getSelectedRows()[0].id;
        this.openAppraiseRecordModal(id, "查看评价详情");
    }

    openAppraiseRecordModal = (id, title) => {
        openModal(<AppraiseRecordInfo readonly={this.props.readonly}/>, {
            title: title,
            appraiseRecordId: id,
            defaultButton: !this.props.readonly,
            refresh: this.tableRefresh,
            onOk: (a, b) => {

                a.close();

            },
            onCancel: (a, b) => {
            }
        });
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="codetodo-AppraiseRecordList"
                    labelWidth={158}
                    formReady={this.formReady}
                    params = {{userOrg:this.userOrg}}
                />
            </div>
        );
    }

}