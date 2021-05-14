import React from "react";

import {DataTable, Message, Modal, openModal, Col, Row} from '../../../src/components/index';
import {propsCompose} from "../../../src/components";

@propsCompose
export default class ContractFiscalEventLogView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            eventParamDisplayType: 'none',
            eventId: null
        }
    }

    eventFormReady = (voList) => {
        this.voList = voList;
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
        const dataList = this.voList.getData();
        this.openFiscEvent(dataList[0].eventId, '记账事件详情');
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
        const dataList = this.eventEntryVoList.getData();
        this.openFiscEventEntry(dataList[0].eventEntryDef, '记账分录详情');
    };

    openFiscEventEntry = (eventEntryDef, title) => {
        openModal(<FiscEventEntryInfo eventDef={this.state.eventId} eventEntryDef={eventEntryDef}/>, {
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
    };

    saveFiscEventParam = () => {
        const dataList = this.eventParamVoList.getData().map(item => {
            return {
                ...item,
                "eventId": this.state.eventId,
            };
        });

        this.eventParamVoList.saveData(dataList)
            .then(() => {
                Message.success('保存成功');
                this.paramTableRefresh && this.paramTableRefresh();
            });
    };

    addFiscEventParam = () => {
        this.eventParamVoList.addRow([{"eventId": this.state.eventId}]);
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
        if (rows.length > 0 && rows[0].eventId != null) {
            this.setState({eventId: rows[0].eventId, eventParamDisplayType: ''});
        } else {
            this.setState({eventId: null, eventParamDisplayType: 'none'});
        }
    };

    render() {
        let contractId = this.props.contractId;
        return (
            <div>
                <Row>
                    <DataTable
                        dataFormId="fiscal-EventLogList"
                        formReady={this.eventFormReady}
                        onSelectRow={this.eventSelectRow}
                        params={{contractId: contractId}}
                    />
                </Row>
                {this.state.eventParamDisplayType !== 'none' ? (
                    <Row>
                        <Col span={14}>
                            <DataTable
                                dataFormId="fiscal-EventEntryList"
                                formReady={this.eventEntryFormReady}
                                params={{eventId: this.state.eventId}}
                                showPagination={false}
                                pageSize={0}
                            />
                        </Col>
                        <Col span={8}>
                            <DataTable
                                dataFormId="fiscal-EventParamList"
                                formReady={this.eventParamFormReady}
                                params={{eventId: this.state.eventId}}
                                showPagination={false}
                                pageSize={0}
                            />
                        </Col>
                    </Row>
                ) : <span>请选择记录</span>}
            </div>
        );
    }
}
