import React from "react";

import {DataTable, Notify, Message, openModal, Modal,rest} from '../../../src/components/index';
import IndHouseInfo from "./IndHouseInfo";

export default class IndHouseList extends React.Component {
    static IndHouseInfo=IndHouseInfo;

    constructor(props) {
        super(props);
        this.state = {
            custId: props.param.custId ? props.param.custId : null,
        };
    }

    dataReady = (voList) => {
        this.voList.setColumnTemplate('houseOwner', (text, record, i) => {
            return (<a onClick={() => this.openDetail(record)}>{text}</a>);
        });
    };


    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([
            {
                name: '新增',
                icon:'fa-plus',
                onClick: this.addModal
            }, {
                selectBind: true,
                name: '删除',
                icon: 'delete',
                onClick: this.deleteRow
            }]);
    };

    addModal = (row) => {
        openModal(<IndHouseInfo params={{custId:this.state.custId}}/>, {
            title:'新增房屋信息',
            defaultButton: true,
            onOk: (a, b, c) => {
                b.addSave((errors, values) => {
                    if (!errors) {
                        a.close();
                    }
                    this.voList.refresh();
                    c.setLoading(false);
                });
            }
        });
    };


    openDetail = (row) => {
        const serialNo = row.serialNo ? row.serialNo : null;

        openModal(<IndHouseInfo params={{serialNo:serialNo,custId:this.state.custId}}/>, {
            title:'编辑房屋信息',
            defaultButton: true,
            onOk: (a, b, c) => {
                b.addSave((errors, values) => {
                    if (!errors) {
                        a.close();
                    }
                    this.voList.refresh();
                    c.setLoading(false);
                });
            }
        });
    };

    deleteRow = () => {
        const selectedRows = this.voList.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: '您确定删除吗？删除后数据不可恢复！',
            onOk: () => {
                this.voList.deleteRows(selectedRows);
            },
            onCancel: () => {
                return;
            },
        });
    };


    render() {
        return (
            <DataTable
                dataFormId="customer-IndCustomerHouseList"
                dataReady={this.dataReady}
                formReady={this.formReady}
                params={{custId: this.state.custId}}
                showPagination={false}
                pageSize={100}
            />
        );
    }
}
