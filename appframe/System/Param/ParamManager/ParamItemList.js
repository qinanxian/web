import React from "react";

import {Row, Col, DataTable, Button, Message, Modal, openModal} from '../../../../src/components';
import ParamItemInfo from "./ParamItemInfo";

export default class ParamItemList extends React.Component {

    static ParamItemInfo = ParamItemInfo;

    constructor(props) {
        super();
        this.state = {
            paramItemCode: null
        };
        this.paramCode = null;
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '新增',
            onClick: this.openParamItemInfo
        }, {
            selectBind: true,
            name: '删除',
            onClick: this.deleteParamItem
        }]);
    };

    dataReady = (api) => {
        this.voList = api;
        this.voList.setColumnTemplate('name', (text, record, i) => {
            return (<a onClick={() => this.editParamItemInfo(record)}>{text}</a>);
        });
    };

    selectRow = (key, rows) => {
        this.setState({paramItemCode: rows[0].code});
    };

    openParamItemInfo = () => {
        this.openParamItemInfoModal(null, '新增参数条目');
    };

    editParamItemInfo = (row) => {
        const paramItemCode = row.code;
        this.openParamItemInfoModal(paramItemCode, '查看参数条目');
    };


    openParamItemInfoModal = (paramItemCode, title) => {
        openModal(<ParamItemInfo/>, {
            title: title,
            paramItemCode: paramItemCode,
            paramCode: this.paramCode,
            defaultButton: true,
            refresh: this.tableRefresh,
            onOk: (a, b) => {
                b.paramItemInfoSave((err, value) => {
                    if (!err) {
                        a.close();
                    }
                });
            },
            onCancel: (a, b) => {
            }
        });
    };

    deleteParamItem = () => {
        const selectedRows = this.voList.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除[${selectedRows[0].name}]吗？删除后数据不可恢复！`,
            onOk: () => {
                this.voList.deleteRows(selectedRows);
            },
            onCancel: () => {
                return;
            },
        });
    };

    tableRefresh = () => {
        this.setState({paramItemCode: this.state.paramItemCode});
        this.voList.refresh();
    };

    render() {
        const {paramCode} = this.props;
        this.paramCode = paramCode;
        return (
            <div>
                <DataTable
                    dataFormId="system-ParamItemList"
                    params={{paramCode: this.paramCode}}
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                    onSelectRow={this.selectRow}
                />
            </div>
        );
    }
}