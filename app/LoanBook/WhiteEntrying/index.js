import React from "react";

import { DataTable, Message,Notify, openModal, Modal,Icon} from '../../../src/components';


export default class WhiteEntrying extends React.Component {


    constructor(props) {
        super(props);
        this.state = {enterStatus:'0'}
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([
            {
                name: '导出EXCEL',
                type: 'default',
                onClick: () => this.exportExcel(true)
            },{
                name: '录入',
                type: 'primary',
                selectBind: true,
                onClick: () => this.entrySelectedRows()
            }
        ]);
    };

    exportExcel = (isAll) => {
        this.voList.exportExcel(isAll, `白名单待录入.xlsx`);
    };

    entrySelectedRows = () => {

        const {rest} = this.props;

        const selectedList = this.voList.getSelectedRows();
        const list = selectedList.map((row)=>{
            return (
                row.id
            )
        });

        rest.post(`/loanBook/whiteEntrying`,{list:list}).then(
            (data) => {
                if(data.code == "1"){
                    Notify.success(data.msg);
                    this.tableRefresh();
                }else{
                    Notify.error(data.msg)
                }

            }
        );

        // this.voList.saveData(list)
        // .then(()=>{
        //     Message.success('录入成功');
        // });
        
    }

    getIcon = (value) => {
        if (value === 'Y')
            return <Icon type="check" />
        return <Icon type="close" />
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    dataReady = (voList) => {

        this.voList = voList;

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
                    selectionType="multiple"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                />
            </div>
        );
    }
}