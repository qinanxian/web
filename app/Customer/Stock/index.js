import React from "react";

import {Row, Col, DataTable, Message, openModal, Modal} from '../../../src/components';
import CustStockInfo from "./StockInfo";

export default class CustStockList extends React.Component {

    static CustStockInfo = CustStockInfo;

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
                onClick: this.openStockInfo
            }, {
                selectBind: true,
                name: '删除',
                onClick: this.deleteStock
            }]);
        }
        this.voList.addButton([{
            selectBind: true,
            name: '详情',
            onClick: this.editStockInfo
        }]);
    };

    openStockInfo = () => {
        this.openStockInfoModal(null, '新增股票发行信息');
    };

    editStockInfo = () => {
        const selectedRows = this.voList.getSelectedRows();
        const stockId = this.voList.getSelectedRows()[0].id;
        this.openStockInfoModal(stockId, '查看股票发行信息');
    };

    openStockInfoModal = (stockId, title) => {
        openModal(<CustStockInfo readonly = {this.props.readonly}/>, {
            title: title,
            custId: this.custId,
            stockId: stockId,
            defaultButton: !this.props.readonly,
            refresh: this.tableRefresh,
            onOk: (a, b) => {
                b.stockInfoSave((err, value) => {
                    if (!err) {
                        a.close();
                    }
                });
            },
            onCancel: (a, b) => {
            }
        });
    };

    deleteStock = () => {
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
                    dataFormId="customer-CustStockList"
                    params={{custId: this.custId}}
                    formReady={this.formReady}
                    showPagination={false}
                />
            </div>
        );
    }
}