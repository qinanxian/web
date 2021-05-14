import React from "react";

import {Row, Col, DataTable, Message, openModal, Modal} from '../../../src/components';
import CustDebtInfo from "./DebtInfo";

export default class CustDebtList extends React.Component {

    static CustDebtInfo = CustDebtInfo;

    constructor(props) {
        super(props);
        const {custId} = props;
        this.custId = custId;
    }

    formReady = (voList) => {
        this.voList = voList;
        if(!this.props.readonly) {
            this.voList.addButton([{
                name: '新增',
                onClick: this.openDebtInfo
            }, {
                selectBind: true,
                name: '删除',
                onClick: this.deleteDebt
            }]);
        }
        this.voList.addButton([{
            selectBind: true,
            name: '详情',
            onClick: this.editDebtInfo
        }]);
    };

    openDebtInfo = () => {
        this.openDebtInfoModal(null, '新增相关负债信息');
    };

    editDebtInfo = () => {
        const selectedRows = this.voList.getSelectedRows();
        const debtId = this.voList.getSelectedRows()[0].id;
        this.openDebtInfoModal(debtId, '查看相关负债信息');
    };

    openDebtInfoModal = (debtId, title) => {
        openModal(<CustDebtInfo readonly={this.props.readonly}/>, {
            title: title,
            custId: this.custId,
            debtId: debtId,
            width:'883px',
            defaultButton: !this.props.readonly,
            refresh: this.tableRefresh,
            onOk: (a, b) => {
                b.debtInfoSave((err, value) => {
                    if (!err) {
                        a.close();
                    }
                });
            },
            onCancel: (a, b) => {
            }
        });
    };

    deleteDebt = () => {
        const selectedRows = this.voList.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: '您确定删除吗？删除后数据不可恢复！',
            okText:'确定',
            cancelText:'取消',
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
                    dataFormId="customer-CustDebtList"
                    params={{custId: this.custId}}
                    formReady={this.formReady}
                />
            </div>
        );
    }
}