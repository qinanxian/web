import React from "react";
import {DataTable, Modal, Notify, openModal} from "../../../src/components";
import ChaseCreationInfo from "../ChaseCreationInfo"
import ChaseInfo from "../ChaseInfo"


export default class ChaseList extends React.Component {

    formReady = (voList) => {
        this.voList = voList;
        //添加按钮
        this.voList.addButton([
            {name: '登记催收对象', type: 'primary', icon: 'fa-plus', onClick: () => this.createNewInfo()},
            {name: '编辑催收对象', type: 'primary', icon: 'fa-pencil', onClick: () => this.openChaseInfo(), selectBind: true},
            {name: '删除', icon: 'fa-trash-o', onClick: () => this.deleteRow(), selectBind: true}
        ]);
        //
        this.voList.setColumnTemplate('chaseId', (text, record, i) => {
            return <a onClick={() => this.openChaseView(record.chaseId,record.custName)}>{text}</a>
        });
        this.voList.setColumnTemplate('objectId', (text, record, i) => {
            return (<a onClick={() => this.openContractView(record.custName,record.objectId)}>{text}</a>);
        });
    };

    dataReady = (voList) => {

    };

    dataListRefresh = () => {
        this.voList.refresh();
    }

    createNewInfo = () => {

        openModal(<ChaseCreationInfo disabledContainer/>, {
            defaultButton: true,
            title: "登记催收对象",
            onOk: (modal, component, btn) => {
                component.saveInfo((err, value) => {
                    if (!err) {
                        modal.close();
                    }
                }, btn);
            },
            refresh: this.dataListRefresh,
        });

    }

    openChaseInfo = () => {
        const selectedRow = this.voList.getSelectedRow();
        const {chaseId} = selectedRow;
        openModal(<ChaseInfo hideOperate={true} chaseId = {chaseId} disabledContainer/>, {
            defaultButton: true,
            title: "编辑催收对象",
            onOk: (modal, component, btn) => {
                component.saveInfo((err, value) => {
                    if (!err) {
                        modal.close();
                    }
                }, btn);
            },
            refresh: this.dataListRefresh,
        });
    }

    deleteRow = () => {
        const selectedRow = this.voList.getSelectedRow();
        Modal.confirm({
            title: '操作确认',
            content: '您确定删除吗',
            onOk: () => {
                this.voList.deleteRows([selectedRow]);
            },
        });
    }

    openContractView = (custName,contractId) => {
        const {flexTabs} = this.props;
        flexTabs.open(`[${custName}]-合同`, 'Contract/ContractInfoView', {
            contractId: contractId,
            editable: false
        });
    }

    openChaseView = (chaseId,custName) => {
        const {flexTabs} = this.props;
        flexTabs.open(`[${custName}]-合同`, 'PostSale/ChaseView', {chaseId});
    }


    render() {
        return (
            <DataTable
                majorKey="chaseId"
                dataFormId="obiz-ChaseList"
                dataReady={this.dataReady}
                formReady={this.formReady}
            />
        );
    }
}
