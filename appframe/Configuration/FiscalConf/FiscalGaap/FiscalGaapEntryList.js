import React from "react";

import {Row, Col, DataTable, Button, Message, Modal, openModal} from '../../../../src/components/index';

import FiscalGaapEntryInfo from './FiscalGaapEntryInfo'

export default class FiscalGaapEntryList extends React.Component {

    static FiscalGaapEntryInfo = FiscalGaapEntryInfo;

    constructor(props) {
        super();

        const {gaapDef} = props.param;
        this.gaapDef = gaapDef;
        const {closeLoading,openLoading} = props;

        this.state = {
            gaapEntryDef: null,
            assistDisplayType: 'none'
        };

    }

    entryFormReady = (voList) => {
        this.entryVoList = voList;
        this.entryVoList.addButton([{
            name: '新增',
            onClick: this.addGaapEntryRows
        }, {
            selectBind: true,
            name: '删除',
            onClick: this.deleteGaapEntry
        }, {
            selectBind: true,
            name: '详情',
            onClick: this.openGaapEntryInfo
        }, {
            name: '保存',
            onClick: this.saveGaapEntry
        }]);

    };

    saveGaapEntry = () => {
        this.entryVoList.saveData()
            .then(()=>{
                Message.success('保存成功');
                this.entryRefresh();
            });
    };

    addGaapEntryRows = () => {
        this.entryVoList.addRow({gaapDef: this.gaapDef});
    };

    openGaapEntryInfo = () => {
        const selectedRows = this.entryVoList.getSelectedRows();
        const gaapEntryDef = selectedRows[0].gaapEntryDef;
        openModal(<FiscalGaapEntryInfo/>, {
            title: '新增会计准则科目',
            gaapEntryDef: gaapEntryDef,
            defaultButton: true,
            onOk: (a, b) => {
                b.paramItemInfoSave((err, value) => {
                    if (!err) {
                        a.close();
                    }
                });
            },
            onCancel: (a, b) => {
            },
            refresh: this.entryRefresh,
        });
    };

    deleteGaapEntry = () => {
        const selectedRows = this.entryVoList.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除[${selectedRows[0].entryCode}]吗？删除后数据不可恢复！`,
            onOk: () => {
                this.entryVoList.deleteRows(selectedRows);
                this.assistRefresh();
            },
            onCancel: () => {
                return;
            },
        });
    };

    selectRow = (key, rows) => {
        if(rows.length > 0 && rows[0].gaapEntryDef != null) {
            this.setState({gaapEntryDef: rows[0].gaapEntryDef , entryDisplayType: ''});
        }else {
            this.setState({gaapEntryDef: null , entryDisplayType: 'none'});
        }
    };

    assistFormReady = (voList) => {
        this.assistVoList = voList;

        this.assistVoList.addButton([{
            name: '新增',
            onClick: this.addAssistRows
        }, {
            selectBind: true,
            name: '删除',
            onClick: this.deleteAssistRows
        }, {
            name: '保存',
            onClick: this.saveAssistInfo
        }]);
    };

    saveAssistInfo = () => {
        this.assistVoList.saveData()
            .then(()=>{
                Message.success('保存成功');
                this.assistRefresh();
            });
    };

    addAssistRows = () => {
        this.assistVoList.addRow({gaapEntryDef: this.state.gaapEntryDef,status: 'VALID'});
    };

    deleteAssistRows = () => {
        const selectedRows = this.assistVoList.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除[${selectedRows[0].itemName}]吗？删除后数据不可恢复！`,
            onOk: () => {
                this.assistVoList.deleteRows(selectedRows);
            },
            onCancel: () => {
                return;
            },
        });
    };


    assistRefresh = () => {
        this.assistVoList.refresh();
    };

    entryRefresh = () => {
        this.entryVoList.refresh();
    };

    render() {
        return (
            <div>
                <Col span={12}>
                    <Row>
                        <DataTable
                            dataFormId="configuration-FiscalGaapEntryList"
                            params={{gaapDef: this.gaapDef}}
                            formReady={this.entryFormReady}
                            editMode={true}
                            showPagination={true}
                            onSelectRow={this.selectRow}
                        />
                    </Row>
                </Col>

                <Col span={12}>
                    <Row>
                        <div style={{display: this.state.entryDisplayType}}>
                            <DataTable
                                dataFormId="configuration-FiscalGaapAssistSummary"
                                formReady={this.assistFormReady}
                                editMode={true}
                                params={{gaapEntryDef: this.state.gaapEntryDef}}
                                showPagination={false}
                                pageSize={999}
                            />
                        </div>
                    </Row>
                </Col>
            </div>
        );
    }
}