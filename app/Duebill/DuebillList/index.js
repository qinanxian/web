import {DataTable, Modal, Notify, propsCompose} from "../../../src/components";
import React from "react";

@propsCompose
export default class DuebillList extends React.Component {

    formReady = (voList) => {
        this.voList = voList;
        this.voList.setColumnTemplate('leaseStatus', (text, record, i) => {
            const leaseStatus = record.leaseStatus || "";
            if (leaseStatus === "STARTED") {                                  //发起放款
                return (<span style={{"color": "#FFD700"}}>{text}</span>);
            } else if (leaseStatus === "SUCCESS") {                           //放款成功
                return (<span style={{"color": "#008000"}}>{text}</span>);
            } else if (leaseStatus === "FAILED") {                            //放款失败
                return (<span style={{"color": "#FF0000"}}>{text}</span>);
            } else {
                return (<span>{text}</span>);
            }
        });

        this.voList.setColumnTemplate('contractId', (text, record, i) => {
            return (<a onClick={() => this.openContractView(record.custName,record.contractId)}>{text}</a>);
        });
        this.voList.setColumnTemplate('duebillId', (text, record, i) => {
            return (<a onClick={() => this.openDuebillTabs(record.custName,record.duebillId)}>{text}</a>);
        });

        voList.addButton([
            {name: '放款入账', type: 'success', icon: 'fa-gavel', onClick: () => this.makeLoanCharge(), selectBind: true},
            {name: '入账反冲', type: 'default', icon: 'fa-history', onClick: () => this.reverseLoanCharge(), selectBind: true},
            {name: '取消放贷', type: 'default', icon: 'fa-trash', onClick: () => this.deleteDuebill(), selectBind: true},
        ]);
    }

    dataReady = (voList) => {
    }


    openContractView = (custName,contractId) => {
        const {flexTabs} = this.props;
        flexTabs.open(`[${custName}]-合同`, 'Contract/ContractInfoView', {
            contractId: contractId,
            editable: false
        });
    }
    openDuebillTabs = (custName,duebillId) => {
        const {flexTabs} = this.props;
        flexTabs.open(`[${custName}]-借据`, 'Duebill/DuebillInfoTabs', {duebillId});
    }


    makeLoanCharge = () => {
        Modal.confirm({
            title: '确认放款入账',
            content: `执行该操作后，联机放款，并记录会计账务，请确认`,
            onOk: () => {
                const selectedRow = this.voList.getSelectedRow();
                this.voList.invoke('makeLoanCharge', selectedRow)
                    .then(() => {
                        Notify.success("放款入账成功");
                        this.voList.refresh();
                    }).catch((err) => {
                    Notify.error(err.message);
                });
            }
        });
    }

    reverseLoanCharge = () => {
        const selectedRow = this.voList.getSelectedRow();
        const {leaseStatus} = selectedRow;
        if (leaseStatus === 'SUCCESS') {
            Modal.confirm({
                title: '操作确认',
                content: '您确定反冲放款吗',
                onOk: () => {
                    this.voList.invoke('reverseLoanCharge', selectedRow)
                        .then(() => {
                            Notify.success("反冲成功");
                            this.voList.refresh();
                        }).catch((err) => {
                        Notify.error(err.message);
                    });
                },
            });
        } else {
            Notify.warning('当前放款没有成功，不需要反冲');
        }
    }

    deleteDuebill = () => {
        const selectedRow = this.voList.getSelectedRow();
        const {duebillStatus} = selectedRow;
        if (duebillStatus === 'READY') {
            Modal.confirm({
                title: '操作确认',
                content: '您确定取消放款吗',
                onOk: () => {
                    this.voList.deleteRows([selectedRow]);
                    Notify.success("取消放款成功");
                },
            });
        } else {
            Notify.warning('当前合同不是新增状态的合同，不能作取消操作');
        }
    }


    render() {
        return (
            <DataTable
                majorKey="duebillId"
                dataFormId="obiz-LeaseOutDuebillList"
                dataReady={this.dataReady}
                formReady={this.formReady}
            />
        );
    }

}
