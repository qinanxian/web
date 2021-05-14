import React from "react";

import {DataTable, Button, Message, Modal, openModal} from '../../../../src/components/index';
import DashboardInfo from './DashboardInfo'

export default class DashboardManager extends React.Component {

    constructor(props) {
        super();

    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '新增',
            onClick: this.openDashboardSummary
        }, {
            selectBind: true,
            name: '删除',
            onClick: this.deleteDashboard
        }, {
            selectBind: true,
            name: '详情',
            onClick: this.openDashboardInfo
        }]);
    };

    openDashboardInfoModal = (id, title) => {
        openModal(<DashboardInfo refresh={this.tableRefresh} />, {
            title: title,
            id: id,
            width:'35%',
            defaultButton: true,
            onOk: (a, b,but) => {
                b.infoSave((err, value) => {
                    if (!err) {
                        a.close();
                    } else {
                        but.setDisabled(false);
                    }
                });
            },
            onCancel: (a, b) => {
            }
        });
    };

    openDashboardSummary = () => {
        this.openDashboardInfoModal(null,"新增Dashboard")
    };

    openDashboardInfo = () => {
        const selectedRows = this.voList.getSelectedRows();
        const id = selectedRows[0].id;
        this.openDashboardInfoModal(id, '查看Dashboard');
    };

    deleteDashboard = () => {
        const selectedRows = this.voList.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除[${selectedRows[0].code}]吗？删除后数据不可恢复！`,
            onOk: () => {
                this.voList.deleteRows(selectedRows);
            },
            onCancel: () => {
                return;
            },
        });
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="system-DashboardList"
                    formReady={this.formReady}
                />
            </div>
        );
    }
}