/**
 *  * 已完成任务列表
 * Created by apachechen on 2018/1/23.
 */
import React from 'react';

import {
    DataTable,EmebedButton, Modal, Icon, openModal, TextArea,
} from '../../../../src/components';
import * as rest from "../../../../src/lib/rest";

export default class PendingTaskList extends React.Component {

    dataReady = (dataTable) =>{
        dataTable.setColumnTemplate('opreate', (text, record, i ) => {
            return (<div>
                        <EmebedButton.Group style={{margin:0}}>
                            <EmebedButton onClick={()=>this.openWorkflowEditor(record)}><Icon type="fa-list-alt"/>业务信息</EmebedButton>
                            <EmebedButton onClick={()=>this.taskRetrieve(record)}><Icon type="fa-hand-lizard-o"/>撤回</EmebedButton>
                        </EmebedButton.Group>
                    </div>);
        });
    };

    formReady = (dataTable) => {
        this.volist = dataTable;
        dataTable.addButton([{
            name: '刷新',
            onClick: this.refresh
        }]);
    };

    refresh = () => {
        this.volist.refresh();
    };

    openWorkflowEditor = (record) => {
        const { flexTabs } = this.props;
        const { close } = flexTabs;
        const defKey = record.procDefKey;
        const taskDefKey = record.taskDefKey;
        flexTabs.open(`${record.summary}`,'Common/Workflow/TaskList/HistTaskPage',{record: record, preId: this.props.param.__id });
    };

    _change = (v) => {
        this.comment = v;
    };

    doTaskRetrieve = (taskId, comment) =>{
        rest.post("/workflow/process/retrieve",
            {taskId: taskId, comment: comment}).then((result) => {
                console.log(result);
                Modal.info({
                    title: '流程追回',
                    content: '任务追回成功,请刷新待办理任务列表!',
                    onOk: () => {
                        this.refresh();
                    }
                })
        });
    };

    taskRetrieveModal = (taskId) => {
        openModal(<TextArea onChange={this._change}/>, {
            title: "输入签署意见",
            defaultButton: true,
            onOk: (modal) => {
                this.doTaskRetrieve(taskId, this.comment);
                modal.close();
            },
        });
    };

    taskRetrieve = (record) => {
        const taskId = record.taskId;
        rest.get("/workflow/process/retrieveCondition/"+taskId).then((data) => {
            if(data.status === '0') {
                Modal.info({
                    title: <span
                        style={{fontSize: '14px', color: '#0000FF'}}>无法进行任务追回操作</span>,
                    content: <div style={{fontSize: '18px', color: '#FF0000'}}>{data.msg}</div>,
                    okText: '确定',
                    okType: 'danger',
                });
                return;
            }
            this.taskRetrieveModal(taskId);
        });
    };
    
    render() {
        // console.log(this.props.isReload);
        return (
            <DataTable
                 dataFormId="workflow-DoneTaskList"
                 dataReady={this.dataReady}
                 formReady={this.formReady}
            />

        );
    }
}
