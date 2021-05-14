import React from "react";

import { DataTable, Message, Modal, openModal, propsCompose, Fieldset, Notify} from '../../../src/components';
import KeymanInfo from "./KeymanInfo";

@propsCompose
export default class KeymanList extends React.Component {
    static KeymanInfo = KeymanInfo;

    constructor(props) {
        super(props);
    }

    validFormReady = (voList) => {
        this.voValidList = voList;
        if(!this.props.readonly) {
            this.voValidList.addButton([{
                name: '新增',
                onClick: this.openKeymanInfo
            }, {
                name: '删除',
                selectBind: true,
                onClick: () => this.deleteKeyman(this.voValidList)
            }, {
                name: '置为无效',
                selectBind: true,
                onClick: () => this.doInvokeSetInvalid(this.voValidList,1),
            }]);
        }

    };

    doInvokeSetInvalid = (component,type) => {
        const row = component.getSelectedRow();
        component.invoke(type ? 'setKeymanInvalid' : 'setKeymanValid', row)
            .then((data) => {
                Notify.info(data && `设置成功`);
                this.tableRefresh();
                this.invalidTableRefresh();
            })
            .catch((error) => {
                Modal.info({
                    content: error.message,
                });

            });
    }

    invalidFormReady = (voList) => {
        this.voInValidList = voList;
        if(!this.props.readonly) {
            this.voInValidList.addButton([{
                name: '删除',
                selectBind: true,
                onClick: () => this.deleteKeyman(this.voInValidList)
            }, {
                name: '置为有效',
                selectBind: true,
                onClick: () => this.doInvokeSetInvalid(this.voInValidList, 0),
            }]);
        }
    };

    openKeymanInfo = (row) => {
        openModal(<KeymanInfo  readonly = {this.props.readonly} />, {
            title:row.id ? "关键人信息详情":"新增关键人信息",
            defaultButton: !this.props.readonly,
            onOk: (modal, compnent, but) => {
                compnent.infoSave((err, value) => {
                    if (!err) {
                        modal.close();
                    } else {
                        but.setDisabled(false);
                    }
                });
            },
            onCancel: (a, b) => {},
            refresh: this.tableRefresh,
            custId:this.props.custId,
            id:row.id ? row.id:null,
         });
    };

    deleteKeyman = (component) => {
        const selectedRows = component.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: '您确定删除吗？删除后数据不可恢复！',
            onOk: () => {
                component.deleteRows(selectedRows);
            },
            onCancel: () => {
                return;
            },
        });
    };

    validDataReady = (voList) => {
        this.voValidList.setColumnTemplate('id', (text, record, i) => {
            return (<a onClick={() => this.openKeymanInfo(record)}>{text}</a>);
        });
    };

    invalidDataReady = (voList) => {
        this.voValidList.setColumnTemplate('id', (text, record, i) => {
            return (<a onClick={() => this.openKeymanInfo(record)}>{text}</a>);
        });
    };

    tableRefresh = () => {
        this.voValidList.refresh();
    };

    invalidTableRefresh = () => {
        this.voInValidList.refresh();
    };

    render() {
        return (
            <div>
                <Fieldset legend="有效关键人" showArrow={true} expanded={true}>
                    <DataTable
                        dataFormId="customer-KeymanList"
                        formReady={this.validFormReady}
                        params={{custId: this.props.custId, status:'VALID'}}
                        dataReady={this.validDataReady}
                    />
                </Fieldset>
                <Fieldset legend="无效关键人" showArrow={true} expanded={true}>
                    <DataTable
                        dataFormId="customer-KeymanList"
                        formReady={this.invalidFormReady}
                        params={{custId: this.props.custId, status:'INVALID'}}
                        dataReady={this.invalidDataReady}
                    />
                </Fieldset>


            </div>
        );
    }
}