import React from "react";

import { DataTable, Message, openModal, Modal,Icon} from '../../../src/components';
import EnterpriseSummary from "./EnterpriseSummary";
import EnterpriseTree from "./EnterpriseTree";
import EnterpriseInfo from "./EnterpriseInfo";
import UserForShareCustomerAllow from "../Base/UserForShareCustomerAllow";
import HoldAllowSelectUserList from "../Base/HoldAllowSelectUserList";

export default class EnterpriseCustomerList extends React.Component {

    static EnterpriseSummary = EnterpriseSummary;
    static EnterpriseTree = EnterpriseTree;
    static EnterpriseInfo = EnterpriseInfo;
    static UserForShareCustomerAllow = UserForShareCustomerAllow;
    static HoldAllowSelectUserList = HoldAllowSelectUserList;

    constructor(props) {
        super(props);
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '新增',
            onClick: this.createEnterpriseSummary
        }, {
            name: '删除',
            selectBind: true,
            onClick: this.deleteEnterprise
        }, {
            name: '移交主办权',
            selectBind: (rows) => this.isBtnDisabled(rows),
            onClick: this.turnOverAllowHold
        }, {
            name: '共享',
            selectBind: true,
            onClick: this.shareCustomerAllow
            }
        ]);

        this.voList.setColumnTemplate('allowHold', (text, record, i) => {
            return this.getIcon(record.allowHold);
        });
        this.voList.setColumnTemplate('allowBusiness', (text, record, i) => {
            return this.getIcon(record.allowBusiness);
        });
        this.voList.setColumnTemplate('allowEdit', (text, record, i) => {
            return this.getIcon(record.allowEdit);
        });
        this.voList.setColumnTemplate('allowView', (text, record, i) => {
            return this.getIcon(record.allowView);
        });
    };

    getIcon = (value) => {
        if (value === 'Y')
            return <Icon type="check" />
        return <Icon type="close" />
    };

    isBtnDisabled = (rows) => {
        if (rows.length != 1) {
            return true;
        }
        const row = rows[0];
        if (row.allowHold !== 'Y') {
            return true;
        }
        return false;
    };

    turnOverAllowHold = (row) => {
        const selectedRows = this.voList.getSelectedRows();
        openModal(<HoldAllowSelectUserList custId={selectedRows[0].custId} refresh={this.tableRefresh}/>,{
            defaultButton: true,
            title:"移交主办权" ,
            onOk: (modal, compnent ,but) => {
                compnent.saveInfo((err, value) => {
                    if (!err) {
                        modal.close();
                    } else {
                        but.setDisabled(false);
                    }
                });
            },
        });
    };

    shareCustomerAllow = (row) => {
        const selectedRows = this.voList.getSelectedRows();
        openModal(<UserForShareCustomerAllow  custId={selectedRows[0].custId}/>,{
            defaultButton: true,
            title:"客户共享" ,
            onOk: (modal, compnent,but) => {
                compnent.saveInfo((err, value) => {
                    if (!err) {
                        modal.close();
                    } else {
                        but.setDisabled(false);
                    }
                });
            },
            refresh: this.tableRefresh,
        });
    };

    createEnterpriseSummary = () => {
        openModal(<EnterpriseSummary disabledContainer/>,{
            defaultButton: true,
            title:"新增法人客户" ,
            width:'34%',
            onOk: (modal, component,btn) => {
                component.summarySave((err, value) => {
                    if (!err) {
                        modal.close();
                    }
                },btn);
            },
            refresh: this.tableRefresh,
        });
    };

    deleteEnterprise = (voList) => {
        const row = this.voList.getSelectedRow();
        this.voList.invoke("checkBusinessExists",row).then((res) => {
            if(res){
                this.voList.deleteRows(selectedRows);
            }else {
                Modal.confirm({
                    title: '删除确认',
                    content: '该客户下有项目，是否确认删除',
                    onOk: () => {
                        this.voList.deleteRows([row]);
                    },
                    onCancel: () => {
                        return;
                    },
                });
            }
        })
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    dataReady = (voList) => {
        this.voList.setColumnTemplate('custName', (text, record, i) => {
            return (<a onClick={() => this.clickName(record)}>{text}</a>);
        });
    };

    clickName = (row) => {
        const custId = row.custId ? row.custId : null;
        const custName = row.custName ? row.custName : '法人客户';
        const readonly = row.allowEdit === 'Y' ? false: true;
        const {flexTabs} = this.props;
        flexTabs.open(`客户：${custName}`, 'Customer/Enterprise/EnterpriseTree', {
            custId: custId,
            readonly
        });
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="customer-EnterpriseCustomerList"
                    formReady={this.formReady}
                    params={{code: 'EnterpriseCustomerList'}}
                    dataReady={this.dataReady}
                />
            </div>
        );
    }
}