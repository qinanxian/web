import React from "react";
import {DataTable, Notify, Modal, openModal, propsCompose} from "../../../src/components";
import AddNewContractInfo from "./AddNewContractInfo"

@propsCompose
export default class ContractList extends React.Component {
    static AddNewContractInfo = AddNewContractInfo;

    constructor(props) {
        super(props);
    }

    formReady = (voList) => {
        this.voList = voList;
        voList.addButton([
            {name: '登记新合同', type: 'primary', icon: 'fa-wpforms', onClick: () => this.addNewContract()},
            {name: '生效', type: 'success', icon: 'fa-gavel', onClick: () => this.startContract(), selectBind: true},
            {name: '中止', type: 'warning', icon: 'fa-power-off', onClick: () => this.stopContract(), selectBind: true},
            {name: '取消', type: 'default', icon: 'fa-trash', onClick: () => this.deleteContract(), selectBind: true},
            {name: '发起放款', type: 'primary', onClick: () => this.makeDuebill(), selectBind: true},
            {name: '初始化', type: 'default', onClick: () => this.readyContract(), selectBind: true},
        ]);
        this.voList.setColumnTemplate('contractId', (text, record, i) => {
            return (<a onClick={() => this.openContractView(record)}>{text}</a>);
        });
    }

    dataReady = (voList) => {
        this.voList = voList;
    }

    dataListRefresh = () => {
        this.voList.refresh();
    };

    openContractView = (contract) => {
        const {flexTabs} = this.props;
        flexTabs.open(`[${contract.custName}]-合同`, 'Contract/ContractInfoView', {
            contractId: contract.contractId,
            editable: contract.contractStatus === 'READY'
        });
        // flexTabs.open(`[${contract.custName}]-合同`, 'Contract/ContractInfo', {contractId: contract.contractId});
    }

    addNewContract = () => {
        openModal(<AddNewContractInfo disabledContainer/>, {
            defaultButton: true,
            title: "登记新合同",
            width: '80%',
            onOk: (modal, component, btn) => {
                component.summarySave((err, value) => {
                    if (!err) {
                        modal.close();
                    }
                }, btn);
            },
            refresh: this.dataListRefresh,
        });
    }

    readyContract = () => {

        Modal.confirm({
            title: '操作确认',
            content: `这是一个数据测试功能，会把合同还原为初始状态，你确定要这样操作吗？`,
            onOk: () => {
                const selectedRow = this.voList.getSelectedRow();
                this.voList.invoke('ready', selectedRow)
                    .then(() => {
                        Notify.success("已设置为初始状态！");
                        this.dataListRefresh();
                    }).catch((err) => {
                    Notify.error(err.message);
                });
            }
        });

    }

    startContract = () => {
        const selectedRow = this.voList.getSelectedRow();
        this.voList.invoke('start', selectedRow)
            .then(() => {
                Notify.success("已生效！");
                this.dataListRefresh();
            }).catch((err) => {
            Notify.error(err.message);
        });
    }

    stopContract = () => {
        const selectedRow = this.voList.getSelectedRow();
        this.voList.invoke('stop', selectedRow)
            .then(() => {
                Notify.success("已失效！");
                this.dataListRefresh();
            }).catch((err) => {
            Notify.error(err.message);
        });
    }

    deleteContract = () => {
        const selectedRow = this.voList.getSelectedRow();
        const {contractStatus} = selectedRow;
        if (contractStatus === 'READY') {
            Modal.confirm({
                title: '操作确认',
                content: '您确定取消合同吗',
                onOk: () => {
                    this.voList.deleteRows([selectedRow]);
                },
            });
        } else {
            Notify.warning('当前合同不是新增状态的合同，不能作取消操作');
        }
    }

    makeDuebill = () => {
        const selectedRow = this.voList.getSelectedRow();
        const {contractStatus} = selectedRow;
        if (contractStatus === 'ENABLE') {
            Modal.confirm({
                title: '操作确认',
                content: '您确定发起放款吗？',
                onOk: () => {
                    this.voList.invoke('makeDuebill', selectedRow)
                        .then(() => {
                            Notify.success("发起放款成功");
                            this.dataListRefresh();
                        }).catch((err) => {
                        Notify.error(err.message);
                    });
                },
            });
        } else {
            Notify.warning('当前合同不是新增状态的合同，不能发起放款操作');
        }
    }

    render() {
        return (
            <DataTable
                majorKey="contractId"
                dataFormId="obiz-ContractList"
                dataReady={this.dataReady}
                formReady={this.formReady}
            />
        );
    }

}
