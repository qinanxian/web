import React from "react";

import {DataTable, Message, Modal, Notify, openModal} from '../../src/components';
import NewCreditLimitInfo from './NewCreditLimitInfo'
import CreditLimitView from './CreditLimitView'

export default class BizApplicationList extends React.Component {
    static CreditLimitInfo = NewCreditLimitInfo;
    static CreditLimitView = CreditLimitView;

    constructor(props) {
        super(props);
    }

    formReady = (voList) => {
        this.voList = voList;
        //添加按钮
        voList.addButton([
            {name: '创建额度', icon: 'fa-file-o', type: 'primary', onClick: () => this.openCreditLimit()},
            {name: '额度生效', icon: 'fa-play', type: 'success', selectBind: true, onClick: () => this.startAction()},
            {name: '冻结/解冻', icon: 'fa-pause', type: 'default', selectBind: true, onClick: () => this.frozeAction()},
            {name: '删除额度', icon: 'fa-trash-o', type: 'default', selectBind: true, onClick: () => this.deleteAction()},
        ]);

        this.voList.setColumnTemplate('limitId', (text, record, i) => {
            return (<a onClick={() => this.openCreditLimitView(record)}>{text}</a>);
        });
        this.voList.setColumnTemplate('limitStatus', (text, record, i) => {
            if(record.limitStatus === "NORMAL"){
                return (<span style={{"color":"green"}}>{text}</span>);
            }else if(record.limitStatus === "FORZEN"){
                return (<span style={{"color":"#F00"}}>{text}</span>);
            }else if(record.limitStatus === "EXPIRED"){
                return (<span style={{"color":"#DCDCDC"}}>{text}</span>);
            }
        });
    };

    dataReady = (voList) => {
    }

    dataListRefresh = () => {
        this.voList.refresh();
    };

    openCreditLimit = (limitId) => {

        openModal(<NewCreditLimitInfo disabledContainer/>, {
            defaultButton: true,
            title: "创建额度",
            isDragact: true,
            onOk: (modal, component, btn) => {
                component.saveCreditLimitInfo((err, value) => {
                    if (!err) {
                        modal.close();
                    }
                }, btn);
            },
            refresh: this.dataListRefresh,
        });

    }

    openCreditLimitView = (record) => {
        const {flexTabs} = this.props;
        flexTabs.open(`${record.custName}-的额度`, 'CreditLimit/CreditLimitView', {limitId: record.limitId});
    }

    startAction = () => {
        const that = this;
        const selectedRow = this.voList.getSelectedRow();
        if(!selectedRow.beginDate || !selectedRow.expiryDate){
            Message.error("开始日期和结束日期不能为空");
            return;
        }
        this.voList.invoke('startAction', selectedRow)
            .then((ret) => {
                if (ret == 1) Message.success("操作成功");
                else Message.error("操作失败");
                that.voList.refresh();
            }).catch((err) => {
            Message.error(err);
        });
    }

    frozeAction = () => {
        const that = this;
        const selectedRow = this.voList.getSelectedRow();
        this.voList.invoke('toggleFrozeAction', selectedRow)
            .then((ret) => {
                if (ret == 1) Message.success("操作成功");
                else Message.error("操作失败");
                that.voList.refresh();
            }).catch((err) => {
            Message.error(err);
        });

    }

    deleteAction = () => {
        const that = this;
        const row = that.voList.getSelectedRow();
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除吗？删除后数据不可恢复！`,
            onOk() {
                that.voList.deleteRows([row]);
            },
            onCancel() {
                return;
            },
        });
    }

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="obiz-CreditLimitList"
                    dataReady={this.dataReady}
                    formReady={this.formReady}
                />
            </div>
        );
    }

}