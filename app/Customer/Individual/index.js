import React from "react";

import { DataTable, Message, openModal, Modal, Icon} from '../../../src/components/index';
import IndividualSummary from "./IndividualSummary";
import IndHouseList from "./IndHouseList";
import IndividualInfo from "./IndividualInfo";
import UserForShareCustomerAllow from "../Base/UserForShareCustomerAllow";
import HoldAllowSelectUserList from "../Base/HoldAllowSelectUserList";
import IndividualTabs from "./IndividualTabs";

export default class IndividualCustomerList extends React.Component {
    static IndividualSummary = IndividualSummary;
    static IndHouseList = IndHouseList;
    static IndividualInfo = IndividualInfo;
    static UserForShareCustomerAllow = UserForShareCustomerAllow;
    static HoldAllowSelectUserList = HoldAllowSelectUserList;
    static IndividualTabs = IndividualTabs;

    constructor(props) {
        super(props);
        this.state = {
            individualCustomer: null
        };
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            type:'primary',
            icon:'fa-plus',
            name: '新增',
            onClick: this.openIndividualSummary
        }, {
            name: '移交主办权',
            icon:'fa-share',
            selectBind: (rows) => this.isBtnDisabled(rows),
            onClick: this.turnOverAllowHold
        }, {
            name: '共享',
            icon:'fa-share-alt',
            selectBind: true,
            onClick: this.shareCustomerAllow
        }, {
            selectBind: true,
            name: '删除',
            icon:'fa-trash-o',
            onClick: this.deleteIndividual
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
            width:'34%',
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

    openIndividualSummary = (row) => {
        const { refresh } = this.props;
        openModal(<IndividualSummary refresh={refresh}/>, {
            title:'新增自然人客户',
            width:'34%',
            defaultButton: true,
            onOk: (currentModal, currentCom,button) => {
                currentCom.individualSummarySave((errors, values) => {
                    if (!errors) {
                        currentModal.close();
                    }
                    button.setLoading(false);
                });
            }
        });
        refresh: this.tableRefresh
    };

    deleteIndividual = () => {
        const selectedRows = this.voList.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: '您确定删除吗？删除后数据不可恢复！',
            onOk: () => {
                this.voList.deleteRows(selectedRows);
            },
            onCancel: () => {
                return;
            },
        });
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    dataReady = (api) => {
        this.voList.setColumnTemplate('custName', (text, record, i) => {
            return (<a onClick={() => this.clickName(record)}>{text}</a>);
        });
    };

    clickName = (row) => {
        const custId = row.custId ? row.custId : null;
        const curName = row.custName ? row.custName : '自然人客户';
        const readonly = row.allowEdit === 'Y' ? false: true;
        const {flexTabs} = this.props;
        flexTabs.open(`客户详细信息：${curName}`, 'Customer/Individual/IndividualTabs', {
            custId: custId,
            readonly
        });
    };

    render() {
        return (
            <DataTable
                dataFormId="customer-IndividualCustomerList"
                formReady={this.formReady}
                dataReady={this.dataReady}
                params={{code: 'IndividualCustomerList'}}
            />
        );
    }
}
