import React from "react";
import { DataTable, Message,Col,Row,Fieldset,openModal} from '../../../../src/components';
import VoucherInfo from './VoucherInfo'
import VoucherEntryInfo from './VoucherEntryInfo'
import VoucherAssistInfo from './VoucherAssistInfo'

export default class VoucherList extends React.Component {

    constructor(props){
        super();
        this.state = {
            entryDisplayType: 'none',
            assistDisplayType: 'none',
            voucherId:null,
            voucherEntryId:null

        };
        this.bookCode = props.param?props.param.bookCode:'';
    }

    voucherFormReady = (voList) => {
        this.voucherVoList = voList;
        this.voucherVoList.addButton([{
            name: '详情',
            type: 'primary',
            selectBind: true,
            onClick: this.openVoucherInfo
        }]);


        this.voucherVoList.setColumnTemplate('wordNo', (text, record, index) => {
            if (record.voucherWord && record.voucherNo) {
                return (`${record.voucherWord}-${record.voucherNo}`);
            }
        });
    };

    openVoucherInfo = () => {
        const row = this.voucherVoList.getSelectedRows()[0];
        openModal(<VoucherInfo voucherId={row.voucherId} refresh={this.tableRefresh}/>, {
            title: "凭证详情",
            defaultButton: true,
            onOk:(modal, compnent,but) => {
                compnent.voucherEntryInfoSave((err, value) => {
                    if (!err) {
                        modal.close();
                        this.voucherTableRefresh && this.voucherTableRefresh();
                    } else {
                        but.setDisabled(false)
                    }
                });
            },
            onCancel(a, b) {
            }
        });
    };

    entryFormReady = (voList) => {
        this.entryVoList = voList;
        this.entryVoList.addButton([{
            name: '详情',
            type: 'primary',
            selectBind: true,
            onClick: this.openVoucherEntryInfo
        }]);


        this.entryVoList.setColumnTemplate('subject', (text, record, index) => {
            if (record.assistName) {
                return (`${record.entryName}--${record.assistName}`);
            } else {
                return (`${record.entryName}`);
            }
            
        });
    };

    openVoucherEntryInfo = () => {
        const row = this.entryVoList.getSelectedRows()[0];
        openModal(<VoucherEntryInfo voucherEntryId={row.voucherEntryId}/>, {
            title: "凭证科目详情",
            defaultButton: true,
            onOk:(modal, compnent,but) => {
                compnent.voucherEntryInfoSave((err, value) => {
                    if (!err) {
                        modal.close();
                        this.voucherEntryTableRefresh && this.voucherEntryTableRefresh();
                    } else {
                        but.setDisabled(false)
                    }
                });
            },
            onCancel(a, b) {
            }
        });
    };


    assistFormReady = (voList) => {
        this.assistVoList = voList;
        this.assistVoList.addButton([{
            name: '详情',
            type: 'primary',
            selectBind: true,
            onClick: this.openVoucherAssistInfo
        }]);

    };

    openVoucherAssistInfo = () => {
        const row = this.assistVoList.getSelectedRows()[0];
        openModal(<VoucherAssistInfo entryAssistId={row.entryAssistId}/>, {
            title: "凭证辅助详情",
            defaultButton: true,
            onOk:(modal, compnent,but) => {
                compnent.voucherAssistInfoSave((err, value) => {
                    if (!err) {
                        modal.close();
                        this.voucherAssistTableRefresh && this.voucherAssistTableRefresh();
                    } else {
                        but.setDisabled(false)
                    }
                });
            },
            onCancel(a, b) {
            }
        });
    };

    voucherTableRefresh = () => {
        this.voucherVoList.refresh();
    };

    voucherEntryTableRefresh = () => {
        this.entryVoList.refresh();
    };

    voucherAssistTableRefresh = () => {
        this.assistVoList.refresh();
    };

    voucherSelectRow = (key, rows) => {
        if(rows.length > 0) {
            this.setState({voucherId: rows[0].voucherId, entryDisplayType: ''});
        }else {
            this.setState({voucherId: null , entryDisplayType: 'none',assistDisplayType: 'none'});
        }
    };

    entrySelectRow = (key, rows) => {
        if(rows.length > 0) {
            this.setState({voucherEntryId: rows[0].voucherEntryId, assistDisplayType: ''});
        }else {
            this.setState({voucherEntryId: null , assistDisplayType: 'none'});
        }
    };

    render() {
        return (
            <div>
                <Col span={13}>
                    <Row>
                        <DataTable
                            dataFormId="demo-VoucherList"
                            formReady={this.voucherFormReady}
                            params={{bookCode:this.bookCode}}
                            onSelectRow={this.voucherSelectRow}
                        />
                    </Row>
                </Col>
                <Col span={11}>
                    <Row>
                        <div style={{display: this.state.entryDisplayType}}>
                            <Fieldset legend="科目" toggle={true}>
                                <DataTable
                                    dataFormId="demo-VoucherEntryList"
                                    formReady={this.entryFormReady}
                                    params={{voucherId: this.state.voucherId}}
                                    showPagination={false}
                                    pageSize={999}
                                    onSelectRow={this.entrySelectRow}
                                    nowrap
                                />
                            </Fieldset>
                        </div>
                        <div style={{display: this.state.assistDisplayType}}>
                            <Fieldset legend="辅助核算" toggle={true}>
                                <DataTable
                                    dataFormId="demo-VoucherAssistList"
                                    formReady={this.assistFormReady}
                                    showPagination={false}
                                    pageSize={999}
                                    params={{voucherEntryId: this.state.voucherEntryId}}
                                    nowrap
                                />
                            </Fieldset>
                        </div>
                    </Row>
                </Col>

            </div>
        );
    }
}