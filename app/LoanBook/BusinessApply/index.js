import React from "react";

import { DataTable, Message, openModal, Modal,Icon} from '../../../src/components';

import BusinessApplyTree from './BusinessApplyTree';

export default class BusinessApply extends React.Component {

    static BusinessApplyTree = BusinessApplyTree;

    constructor(props) {
        super(props);
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
        this.voList.exportExcel(isAll, `业务列表信息.xlsx`);
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
                    dataFormId="business-BusinessApplyList"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                />
            </div>
        );
    }
}