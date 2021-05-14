import React from "react";
import {DataTable, Modal, openModal} from "../../../src/components";
import OpporIntentInfo from "./OpporIntentInfo"


export default class OpporIntent extends React.Component {
    static OpporIntentInfo = OpporIntentInfo;

    constructor(props) {
        super(props);
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            type: 'primary',
            name: '新增',
            icon: "fa-plus",
            onClick: this.createOpporIdent
        }, {
            type: 'default',
            selectBind: true,
            name: '删除',
            icon: "fa-trash-o",
            onClick: this.deleteRows
        }]);
    };

    dataReady = (voList) => {
        this.voList.setColumnTemplate('custName', (text, record, i) => {
            return (<a onClick={() => this.clickName(record)}>{text}</a>);
        });
    };

    clickName = (row) => {
        const {flexTabs} = this.props;
        flexTabs.open(`商机-${row.custName}`, 'Market/OpporIntent/OpporIntentInfo', {
            opporId: row.opporId,
            preComponentId: this.props.param.__id
        });
    };

    createOpporIdent = () => {

        const {flexTabs} = this.props;
        flexTabs.open(`新增商机`, 'Market/OpporIntent/OpporIntentInfo', {
            opporId: 'none',
            preComponentId: this.props.param.__id
        });

        // const that = this;
        // openModal(<OpporIntentInfo/>, {
        //     title:'新增商机',
        //     defaultButton: true,
        //     opporId: 'none',
        //     ...that.props,
        //     onOk: (modal, component,btn) => {
        //         component.saveInfoInModal((errors, values) =>{
        //             if (!errors) {
        //                 modal.close();
        //                 that.voList.refresh();
        //             }
        //         },btn);
        //     },
        // });

    };

    deleteRows = () => {
        const selectedRows = this.voList.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除吗？删除后数据不可恢复！`,
            onOk: () => {
                this.voList.deleteRows(selectedRows);
            },
            onCancel: () => {
                return;
            },
        });
    };


    render() {
        return (
            <div>
                <DataTable
                    dataFormId="obiz-OpporIntentList"
                    formReady={this.formReady}
                    params={{p: 'none'}}
                    dataReady={this.dataReady}
                    buttonFixed = {true}
                />
            </div>
        );
    }
}