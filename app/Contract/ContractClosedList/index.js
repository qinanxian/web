import React from "react";
import {DataTable, propsCompose} from "../../../src/components";


@propsCompose
export default class ContractClosedList extends React.Component {

    formReady = (voList) => {
        this.voList = voList;
        this.voList.setColumnTemplate('contractId', (text, record, i) => {
            return (<a onClick={() => this.openContractView(record)}>{text}</a>);
        });
    }

    dataReady = (voList) => {
        this.voList = voList;
    }

    openContractView = (contract) => {
        const {flexTabs} = this.props;
        flexTabs.open(`[${contract.custName}]-合同`, 'Contract/ContractInfoView', {contractId: contract.contractId,editable:false});
        // flexTabs.open(`[${contract.custName}]-合同`, 'Contract/ContractInfo', {contractId: contract.contractId});
    }

    render() {
        return (
            <DataTable
                majorKey="code"
                sortName="test"
                dataFormId="obiz-ClosedContractList"
                dataReady={this.dataReady}
                formReady={this.formReady}
            />
        );
    }

}
