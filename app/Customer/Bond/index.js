import React from "react";

import {Row, Col, DataTable, Message, openModal, Modal} from '../../../src/components';
import CustBondInfo from "./BondInfo";

export default class CustBondList extends React.Component {

    static CustBondInfo = CustBondInfo;

    constructor(props) {
        super(props);
        const {custId} = props;
        this.custId = custId;
    }

    formReady = (voList) => {
        this.voList = voList;
        if (!this.props.readonly) {
            this.voList.addButton([{
                name: '新增',
                onClick: this.openBondInfo
            }, {
                selectBind: true,
                name: '删除',
                onClick: this.deleteBond
            }]);
        }
        this.voList.addButton([{
            selectBind: true,
            name: '详情',
            onClick: this.editBondInfo
        }]);
    };

    openBondInfo = () => {
        this.openBondInfoModal(null, '新增债券发行信息');
    };

    editBondInfo = () => {
        const selectedRows = this.voList.getSelectedRows();
        const bondId = this.voList.getSelectedRows()[0].id;
        this.openBondInfoModal(bondId, '查看债券发行信息');
    };

    openBondInfoModal = (bondId, title) => {
        openModal(<CustBondInfo readonly={this.props.readonly}/>, {
            title: title,
            custId: this.custId,
            bondId: bondId,
            defaultButton: !this.props.readonly,
            refresh: this.tableRefresh,
            onOk: (a, b) => {
                b.bondInfoSave((err, value) => {
                    if (!err) {
                        a.close();
                    }
                });
            },
            onCancel: (a, b) => {
            }
        });
    };

    deleteBond = () => {
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
                    dataFormId="customer-CustBondList"
                    params={{custId: this.custId}}
                    formReady={this.formReady}
                    showPagination={false}
                />
            </div>
        );
    }
}