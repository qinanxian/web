import React from "react";

import {DataTable, Message, openModal, Modal} from '../../../src/components';
import DossierItemInfo from "./DossierItemInfo";

export default class DossierItemList extends React.Component {

    static DossierItemInfo = DossierItemInfo;

    constructor(props) {
        super();
        this.dossierDefKey = props.dossierDefKey;
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '新增',
            onClick: this.addItemRow
        }, {
            name: '保存',
            onClick: this.saveListInfo
        }, {
            selectBind: true,
            name: '删除',
            onClick: this.deleteItem
        }, {
            selectBind: true,
            name: '详情',
            onClick: this.viewItemInfo
        }]);
    };

    dataReady = (api) => {
        // this.voList.setColumnTemplate('itemName', (text, record, i) => {
        //     return (<a onClick={() => this.editItemInfo(record)}>{text}</a>);
        // });
    };

    addItemRow = () => {
        const UUID = Math.ceil(Math.random() * 10e5).toString(10);
        const dataList = this.voList.getData();
        let defaultRow = {
            dossierDefKey: this.props.dossierDefKey,
            importance: 'OPTIONAL',
            itemDefKey: `itemDefKey${UUID}`,
            uniqueCode: `uniqueCode${UUID}`,
            itemStatus: 'VALID',
            sortCode: '10',
        };
        if (dataList.length > 0) {
            const lastItem = dataList[dataList.length - 1];
            defaultRow = {
                ...lastItem,
                itemDefId: '',
                itemDefKey: `${lastItem.itemDefKey}Cp`,
                uniqueCode: `${lastItem.uniqueCode}Cp`,
                __key: null,
            }
        }
        this.voList.addRow(defaultRow, 50);
    };

    viewItemInfo = () => {
        const row = this.voList.getSelectedRow();
        const itemDefKey = row.itemDefKey;
        this.openItemInfoModal(itemDefKey, '查看文档清单模板明细项', 'edit');
    };

    saveListInfo = () => {
        this.voList.saveData()
            .then(() => {
                Message.success('保存成功');
                this.voList.refresh();
            });
    };

    openItemInfoModal = (itemDefKey, title, operation) => {
        openModal(<DossierItemInfo/>, {
            title: title,
            dossierDefKey: this.dossierDefKey,
            itemDefKey: itemDefKey,
            defaultButton: true,
            width: '768px',
            operation: operation,
            refresh: this.tableRefresh,
            onOk: (a, b) => {
                b.docListItemInfoSave((err, value) => {
                    if (!err) {
                        a.close();
                    }
                });
            },
            onCancel: (a, b) => {
            }
        });
    };

    deleteItem = () => {
        const selectedRow = this.voList.getSelectedRow();
        const itemName = selectedRow.itemName || `默认项${selectedRow.itemDefKey}`;
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除[${itemName}]吗？删除后数据不可恢复！`,
            onOk: () => {
                this.voList.deleteRows([selectedRow]);
            },
            onCancel: () => {
            },
        });
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    render() {
        this.dossierDefKey = this.props.dossierDefKey;
        return (
            <DataTable
                editMode
                dataFormId="configuration-DossierItemList"
                params={{dossierDefKey: this.dossierDefKey}}
                formReady={this.formReady}
                dataReady={this.dataReady}
                showPagination={false}
                pageSize={50}
            />
        );
    }
}