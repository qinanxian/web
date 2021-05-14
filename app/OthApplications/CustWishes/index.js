import React from 'react'
import CustWishesInfoDetail from "./CustWishesInfoDetail";

import {DataTable, Modal, openModal} from '../../../src/components';

import {getUser} from '../../../src/lib/cache';

export default class CustWishesList extends React.Component {

    constructor(props){
        super(props);
        this.state = {};
        this.userOrg = getUser().orgId;
    }

    dataReady = (voList) => {
        this.voList = voList;
    };

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([
        {
            name: '详情',
            selectBind: true,
            onClick: this.custWishesInfo
        },
        {
            name: '删除',
            selectBind: true,
            onClick: this.deleteCustWishes
        },
        {
            name: '导出EXCEL',
            type: 'default',
            onClick: () => this.exportExcel(true)
        }
        ]);
    };

    exportExcel = (isAll) => {
        this.voList.exportExcel(isAll, `客户意愿.xlsx`);
    };
    deleteCustWishes = (voList) => {
        const row = this.voList.getSelectedRow();
        Modal.confirm({
            title: '删除确认',
            content: '是否确认删除',
            onOk: () => {
                this.voList.deleteRows([row]);
            },
            onCancel: () => {
                return;
            },
        });
    };
    custWishesInfo = (voList) => {
        const selectedRows = this.voList.getSelectedRows();
        const custId = this.voList.getSelectedRows()[0].id;
        this.openCustWishesInfoModal(custId, '客户意愿详情');
    }

    openCustWishesInfoModal = (custId, title) => {
        openModal(<CustWishesInfoDetail readonly={this.props.readonly}/>, {
            title: title,
            custId: custId,
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

    render(){
        return (
            <div>
                <DataTable
                    dataFormId="othapplications-CustWishesList"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                    params = {{userOrg : this.userOrg}}
                />
            </div>
        );
    }

}