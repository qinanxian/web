import React from "react";

import {DataTable, Button, Message, Modal, openModal,Col,Row,Fieldset} from '../../../../src/components/index';
import FiscEventInfo from './FiscEventInfo'
import FiscEventEntryInfo from './FiscEventEntryInfo'
import FieldSet from "../../../../src/components/fieldset";


export default class FiscEventList extends React.Component {


    constructor(props) {
        super();
        this.state = {
            fiscEventEntryDisplayType: 'none',
            eventDef: null
        }
    }

    eventFormReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '新增',
            type: 'primary',
            onClick: this.openFiscEventSummary
        }, {
            selectBind: true,
            name: '删除',
            type: 'primary',
            onClick: this.deleteFiscEvent
        }]);

        this.voList.setColumnTemplate('eventName', (text, record, i) => {
            return (<a onClick={() => this.openFiscEventInfo(record)}>{text}</a>);
        });
    };

    openFiscEvent = (eventDef, title) => {
        openModal(<FiscEventInfo eventDef={eventDef}/>, {
            title: title,
            defaultButton: true,
            onOk: (modal, compnent, but) => {
                compnent.fiscEventSave((err, value) => {
                    if (!err) {
                        modal.close();
                        this.tableRefresh && this.tableRefresh();
                    } else {
                        but.setDisabled(false)
                    }
                });
            },
            onCancel(a, b) {
            }
        });
    };

    openFiscEventInfo = () => {
        const dataList = this.voList.getSelectedRows();
        this.openFiscEvent(dataList[0].eventDef, '记账事件详情');
    };

    openFiscEventSummary = () => {
        this.openFiscEvent(null, '新增记账事件');
    };

    deleteFiscEvent = () => {
        const selectedRows = this.voList.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除吗？删除后数据不可恢复！`,
            onOk: () => {
                this.voList.deleteRows(selectedRows);
            },
            onCancel: () => {
                return;
            },
        });
    };

    eventEntryFormReady = (voList) => {
        this.eventEntryVoList = voList;
        this.eventEntryVoList.addButton([{
            name: '新增',
            type: 'primary',
            onClick: this.openFiscEventEntrySummary
        }, {
            selectBind: true,
            name: '删除',
            type: 'primary',
            onClick: this.deleteFiscEventEntry
        }, {
            selectBind: true,
            name: '详情',
            type: 'primary',
            onClick: this.openFiscEventEntryInfo
        }]);
    };

    deleteFiscEventEntry = () => {
        const selectedRows = this.eventEntryVoList.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除吗？删除后数据不可恢复！`,
            onOk: () => {
                this.eventEntryVoList.deleteRows(selectedRows);
            },
            onCancel: () => {
                return;
            },
        });
    };

    openFiscEventEntrySummary = () => {
        this.openFiscEventEntry(undefined, '新增记账分录');
    };

    openFiscEventEntryInfo = () => {
        const selectedRows = this.eventEntryVoList.getSelectedRows();
        this.openFiscEventEntry(selectedRows[0].eventEntryDef, '记账分录详情');
    };

    openFiscEventEntry = (eventEntryDef, title) => {
        openModal(<FiscEventEntryInfo eventDef={this.state.eventDef} eventEntryDef={eventEntryDef}/>, {
            title: title,
            defaultButton: true,
            onOk: (modal, compnent, but) => {
                compnent.fiscEventEntrySave((err, value) => {
                    if (!err) {
                        modal.close();
                        this.entryTableRefresh && this.entryTableRefresh();
                    } else {
                        but.setDisabled(false)
                    }
                });
            },
            onCancel(a, b) {
            }
        });
    };


    eventParamFormReady = (voList) => {
        this.eventParamVoList = voList;
        this.eventParamVoList.addButton([{
            name: '新增',
            type: 'primary',
            onClick: this.addFiscEventParam
        }, {
            name: '保存',
            type: 'primary',
            onClick: this.saveFiscEventParam
        }, {
            selectBind: true,
            name: '删除',
            type: 'primary',
            onClick: this.deleteFiscEventParam
        }]);
    };


    saveFiscEventParam = () => {
        const dataList = this.eventParamVoList.getData().map(item => {
            return {
                ...item,
                "eventDef": this.state.eventDef,
            };
        });

        this.eventParamVoList.saveData(dataList)
            .then(() => {
                Message.success('保存成功');
                this.paramTableRefresh && this.paramTableRefresh();
            });
    };

    addFiscEventParam = () => {
        this.eventParamVoList.addRow([{"eventDef": this.state.eventDef}]);
    };

    deleteFiscEventParam = () => {
        const selectedRows = this.eventParamVoList.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除吗？删除后数据不可恢复！`,
            onOk: () => {
                this.eventParamVoList.deleteRows(selectedRows);
            },
            onCancel: () => {
                return;
            },
        });
    };


    tableRefresh = () => {
        this.voList.refresh();
    };

    entryTableRefresh = () => {
        this.eventEntryVoList.refresh();
    };

    paramTableRefresh = () => {
        this.eventParamVoList.refresh();
    };


    eventSelectRow = (key, rows) => {
        if (rows.length > 0 && rows[0].eventDef != null) {
            this.setState({eventDef: rows[0].eventDef, fiscEventEntryDisplayType: ''});
        } else {
            this.setState({eventDef: null, fiscEventEntryDisplayType: 'none'});
        }
    };

    render() {
        return (
            <div>
                <Col span={12}>
                    <Row>
                        <FieldSet legend="交易事件" showArrow={false}>
                            <div>
                                <DataTable
                                    dataFormId="configuration-FiscEventList"
                                    formReady={this.eventFormReady}
                                    onSelectRow={this.eventSelectRow}
                                />
                            </div>
                        </FieldSet>
                    </Row>
                </Col>

                <Col span={12}>
                    <Row>
                        <div style={{display: this.state.fiscEventEntryDisplayType}}>
                            <Fieldset legend="事件参数" toggle={true} expanded={true} >
                                <DataTable
                                    dataFormId="configuration-FiscEventParamList"
                                    formReady={this.eventParamFormReady}
                                    params={{eventDef: this.state.eventDef}}
                                    editMode={true}
                                    showPagination={false}
                                    pageSize={999}
                                />
                            </Fieldset>
                        </div>
                    </Row>
                    <Row>
                        <div style={{display: this.state.fiscEventEntryDisplayType}}>
                            <Fieldset legend="事件科目" toggle={true} expanded={true} >
                                <DataTable
                                    dataFormId="configuration-FiscEventEntryList"
                                    formReady={this.eventEntryFormReady}
                                    params={{eventDef: this.state.eventDef}}
                                    showPagination={false}
                                    pageSize={999}
                                />
                            </Fieldset>
                        </div>
                    </Row>
                </Col>
            </div>
        );
    }
}