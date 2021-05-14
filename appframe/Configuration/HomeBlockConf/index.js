import React from 'react';

import {DataTable, openModal, Modal, Message} from '../../../src/components';
import HomeBlockInfo from './HomeBlockInfo';

export default class HomeBlockConf extends React.Component {
    constructor(props) {
        super(props);
    }


    formReady = (volist) => {
        this.volist = volist;
        this.volist.addButton([{
            name: '新增',
            type: 'primary',
            onClick: this.addNewRecord
        },{
            selectBind: true,
            name: '删除',
            onClick: this.deleteRecord
        }]);

        this.volist.setColumnTemplate('name', (text, record, i) => {
            return (<a onClick={() => this.openBlockConfInfo(record)}>{text}</a>);
        });
    };

    openBlockConfInfo = (record) => {
        openModal(<HomeBlockInfo boardKey={record.boardKey} refresh={this.tableRefresh}/>, {
            title: "小组件详情",
            width:'50%',
            defaultButton: true,
            onOk: (modal, compnent,but) => {
                compnent.saveInfo((err, value) => {
                    if (!err) {
                        modal.close();
                    } else {
                        but.setDisabled(false);
                    }
                });
            }
        });
    };


    addNewRecord = ()=>{
        openModal(<HomeBlockInfo refresh={this.tableRefresh}/>, {
            title: "新增小组件",
            width:'50%',
            defaultButton: true,
            onOk: (modal, compnent,but) => {
                compnent.saveInfo((err, value) => {
                    if (!err) {
                        modal.close();
                    } else {
                        but.setDisabled(false);
                    }
                });
            }
        });
    };


    deleteRecord =() =>{
        const selectedRows = this.volist.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: '您确定删除吗？删除后数据不可恢复！',
            onOk: () => {
                this.volist.deleteRows(selectedRows);
            },
        });
    };

    tableRefresh = () => {
        this.volist.refresh();
    };


    render() {
        return (
            <DataTable
                dataFormId='configuration-HomeBlockList'
                formReady={this.formReady}
            />
        );
    }
}



