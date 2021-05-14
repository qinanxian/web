import React from "react";

import { DataTable, Message, openModal, Modal,Icon} from '../../../src/components';


export default class WhiteEntryed extends React.Component {


    constructor(props) {
        super(props);
        this.state = {enterStatus:'1'}
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([
            {
                name: '导出EXCEL',
                type: 'default',
                onClick: () => this.exportExcel(true)
            }
        ]);
    };

    exportExcel = (isAll) => {
        this.voList.exportExcel(isAll, `白名单已录入.xlsx`);
    };

    getIcon = (value) => {
        if (value === 'Y')
            return <Icon type="check" />
        return <Icon type="close" />
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    dataReady = (voList) => {
        this.voList.setColumnTemplate('certName', (text, record, i) => {
            return (<a onClick={() => this.clickName(record)}>{text}</a>);
        });
    };

    clickName = (row) => {
        const applyId = row.id ? row.id : null;
        const custId = row.custId ? row.custId : null;
        const certName = row.certName;
        const readonly = row.allowEdit === 'Y' ? false: true;
        const {flexTabs} = this.props;
        flexTabs.open(`业务申请者：${certName}`, 'LoanBook/BusinessApply/BusinessApplyTree', {
            applyId: applyId,
            custId : custId,
            readonly
        });
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="business-WhiteEntry"
                    params = {{enterStatus: this.state.enterStatus}}
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                />
            </div>
        );
    }
}