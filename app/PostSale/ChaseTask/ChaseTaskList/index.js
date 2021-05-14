import React from "react";
import {DataTable, Modal, Notify, openModal} from "../../../../src/components";
import ChaseTaskCreationInfo from "../ChaseTaskCreationInfo";
import ChaseTaskInfo from "../ChaseTaskInfo";


export default class ChaseTaskList extends React.Component {
    constructor(props) {
        super(props);
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([
            {name: '分派', type: 'primary', icon: 'fa-plus', onClick: () => this.createAssign()},
            {name: '删除', icon: 'fa-trash-o', onClick: () => this.deleteRow(), selectBind: true},
        ]);
        this.voList.setColumnTemplate('chaseTaskId', (text, record, i) => {
            return <a onClick={() => this.viewTaskInfo(record.chaseTaskId)}>{text}</a>
        });
    };

    dataReady = (voList) => {

    };

    viewTaskInfo = (chaseTaskId) => {
        openModal(<ChaseTaskInfo chaseTaskId={chaseTaskId} disabledContainer/>, {
            defaultButton: true,
            title: "查看催收任务",
            onOk: (modal, component, btn) => {
                component.saveInfo((err, value) => {
                    if (!err) {
                        modal.close();
                    }
                }, btn);
            },
            refresh: this.refreshList,
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

    refreshList = () => {
        this.voList.refresh();
    }

    createAssign = () => {
        openModal(<ChaseTaskCreationInfo chaseId={this.props.chaseId} disabledContainer/>, {
            defaultButton: true,
            title: "分配催收任务",
            onOk: (modal, component, btn) => {
                component.saveInfo((err, value) => {
                    if (!err) {
                        modal.close();
                    }
                }, btn);
            },
            refresh: this.refreshList,
        });
    }










    render() {
        let chaseId = this.props.chaseId||this.props.param.chaseId
        return (
            <DataTable
                majorKey="chaseTaskId"
                params={{chaseId:chaseId}}
                dataFormId="obiz-ChaseTaskList"
                dataReady={this.dataReady}
                formReady={this.formReady}
                showPagination={false}
                pageSize={0}
            />
        );
    }
}
