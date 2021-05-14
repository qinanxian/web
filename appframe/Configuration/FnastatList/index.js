import React from 'react';

import {DataTable, Row, Col, openModal, Modal, Message} from '../../../src/components';
import FnastatListInfo from "./FnastatListInfo"

export default class FnastatList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRows: [],
            fnastatDefId: null
        };
    }


    formReady = (vm) => {
        const {flexTabs} = this.props;
        const {open} = flexTabs;
        this.dateTable = vm;
        vm.setColumnTemplate('fnastatDefId', (text, record, i) => {
            return (<a onClick={() => this.openFnastatSubject(record)}>{text}</a>);
        });
        this.dateTable.addButton([{
            name: '新增',
            onClick: this.openFnastatListInfo
        }, {
            selectBind: true,
            name: '编辑',
            onClick: this.editFnastatListInfo
        }, {
            selectBind: true,
            name: '删除',
            onClick: this.deleteFnastatList
        }, {
            selectBind: true,
            name: '保存列表',
            onClick: this.saveFnastatList
        }]);
    };


    openFnastatListInfo = () => {
        this.openInfoModal(null, '新增财务报表模型');
    };

    editFnastatListInfo = () => {
        const fnastatDefId = this.rowIsSelected();
        if (null !== fnastatDefId) {
            this.openInfoModal(fnastatDefId, '编辑财务报表模型');
        }
    };

    deleteFnastatList = () => {
        const that = this;
        const {selectedRows} = this.state;
        const fnastatDefId = this.rowIsSelected();
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除[${fnastatDefId}]吗？删除后数据不可恢复！`,
            onOk: () => {
                that.dateTable.deleteRows(selectedRows).then(() => {
                    Message.info("删除成功!")
                });
            },
            onCancel: () => {
                return;
            },
        });
    };


    saveFnastatList = () => {
        const that = this;
        const fnastatDefId = this.rowIsSelected();
        if (null !== fnastatDefId) {
            const {selectedRows} = this.state;
            that.dateTable.saveData(selectedRows).then(() => {
                Message.info("保存成功!")
            });
        }
    }

    rowIsSelected = () => {
        const {selectedRows} = this.state;
        const fnastatDefId = selectedRows && selectedRows[0] && selectedRows[0].fnastatDefId || null;
        return fnastatDefId;
    }


    openInfoModal = (fnastatDefId, title) => {
        const {selectedRows} = this.state;
        openModal(<FnastatListInfo/>, {
            title: title,
            fnastatDefId: fnastatDefId,
            defaultButton: true,
            selectedRows,
            refresh: this.tableRefresh,
            onOk: (a, b) => {
                b.FnastatListInfoSave((err) => {
                    if (!err) {
                        a.close();
                        this.setState({
                            selectedRows: []
                        })
                    }
                });
            },
            onCancel: (a, b) => {
            }
        });
    };


    openFnastatSubject = (row) => {
        const {flexTabs} = this.props;
        flexTabs.open(`科目信息:${row.fnastatDefName}`, `/Configuration/FnastatSubjectList/`, {
            fnastatDefId: row.fnastatDefId,
        });
    };


    tableRefresh = () => {
        this.dataTable.refresh();
    }

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="configuration-FnastatList"
                    formReady={this.formReady}
                    onSelectRow={(k, row) => this.setState({selectedRows: row})}
                    editMode
                />
            </div>
        );
    }
}



