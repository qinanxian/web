import React from "react";

import { DataTable, Message, Modal, openModal, propsCompose} from '../../../src/components';
import AccountInfo from "./AccountInfo";

@propsCompose
export default class AccountList extends React.Component {
    static AccountInfo = AccountInfo;

    constructor(props) {
        super(props);
    }

    formReady = (voList) => {
        this.voList = voList;
        if(!this.props.readonly) {
            this.voList.addButton([{
                name: '新增',
                onClick: this.openAccountInfo
            }, {
                name: '删除',
                selectBind: true,
                onClick: this.deleteAccount
            }]);
        }
    };

    openAccountInfo = (row) => {
        openModal(<AccountInfo readonly={this.props.readonly}/>, {
            title: row.id ? "开票对象信息详情":"新增账号信息",
            defaultButton: !this.props.readonly,
            onOk: (modal, compnent) => {
                compnent.accountInfo((err, value) => {
                    if (!err) {
                        modal.close();
                    }
                });
            },
            onCancel: (a, b) => {
            },
            refresh: this.tableRefresh,
            id:row.id ? row.id:null,
            custId:this.props.custId
         });
    };

    deleteAccount = () => {
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

    dataReady = (voList) => {
        this.voList.setColumnTemplate('id', (text, record, i) => {
            return (<a onClick={() => this.openAccountInfo(record)}>{text}</a>);
        });
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="customer-AccountList"
                    formReady={this.formReady}
                    params={{custId: this.props.custId}}
                    dataReady={this.dataReady}
                />
            </div>
        );
    }
}