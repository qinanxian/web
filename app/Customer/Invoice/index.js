import React from "react";

import { DataTable, Message, Modal, openModal, propsCompose} from '../../../src/components';
import InvoiceInfo from "./InvoiceInfo";

@propsCompose
export default class InvoiceList extends React.Component {
    static InvoiceInfo = InvoiceInfo;

    constructor(props) {
        super(props);
    }

    formReady = (voList) => {
        this.voList = voList;
        if(!this.props.readonly) {
            this.voList.addButton([{
                name: '新增',
                onClick: this.openInvoiceInfo
            }, {
                name: '删除',
                selectBind: true,
                onClick: this.deleteInvoice
            }]);
        }
    };

    openInvoiceInfo = (row) => {
        openModal(<InvoiceInfo readonly = {this.props.readonly}/>, {
            title:row.id ? "开票对象信息详情":"新增开票对象信息",
            defaultButton: !this.props.isReadOnly,
            onOk: (modal, compnent) => {
                compnent.invoiceInfo((err, value) => {
                    if (!err) {
                        modal.close();
                    }
                });
            },
            refresh: this.tableRefresh,
            custId:this.props.custId,
            id:row.id ? row.id:null,
         });
    };

    deleteInvoice = () => {
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
            return (<a onClick={() => this.openInvoiceInfo(record)}>{text}</a>);
        });
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="customer-InvoiceList"
                    formReady={this.formReady}
                    params={{custId: this.props.custId}}
                    dataReady={this.dataReady}
                    showPagination={false}
                />
            </div>
        );
    }
}