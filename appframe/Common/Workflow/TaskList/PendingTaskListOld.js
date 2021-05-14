/**
 * 待办理任务列表
 * Created by apachechen on 2018/1/23.
 */
import React from 'react';
import { DataTable, EmebedButton, Icon,Message } from '../../../../src/components';
import * as TaskCmonFunction from  '../TaskProcess/TaskCmonFunction';
import * as Workflow from '../../../../app/Common/Workflow';

export default class PendingTaskList extends React.Component {

    constructor(props){
        super(props);
        this.finishTime =null;
    }
    formReady = (dataTable) =>{
        this.volist = dataTable;
        dataTable.addButton([{
            name: '刷新',
            onClick: ()=>dataTable.refresh()
        }]);
        dataTable.setColumnTemplate('opreate', (text, record, i ) => {
            return (<EmebedButton type="primary" icon={"roic-approve-reply"} onClick={()=>this.openWorkflowEditor(record)}>办理</EmebedButton>);
        });
    };

    dataReady = (dlist) =>{
        dlist.setColumnTemplate('summary',(value,record,index) => {
            const ret = record.curMaxDepth / record.maxDepth * 100;
            return (
                <div className='progress-container'>
                    <div className='progress-container-value'>{value}</div>
                    <div className='progress-container-bar'>
                        <div
                            style={{width:ret > 100 ? '100%' : ret + '%'}}
                            className='progress-container-bar-inner'/>
                    </div>
                </div>
            );
        });
    };

    openWorkflowEditor = (record) => {
        const { flexTabs,param,rest } = this.props;
        const { close } = flexTabs;
        const defKey = record.procDefKey;
        const taskName = record.taskName;
        const taskId = record.taskId;
        rest.get(`/workflow/process/workflowTask/${taskId}`).then((data) =>{
            if (data.finishTime) {
                Message.info("该任务已处理,请刷新页面")
                return "";
            } else {
                Workflow.openProcessTab(this.props, record);
            }
        })
    };

    taskIsFinished =(record) =>{
        const {rest} = this.props;
        const taskId = record.taskId;
        rest.get(`/workflow/process/workflowTask/${taskId}`).then((data) =>{
            this.finishTime= data.finishTime;
        })
    };

    render() {
        return (
            <DataTable
                dataFormId="workflow-PendingTaskList"
                formReady={this.formReady}
                dataReady={this.dataReady}
            />
        );
    }
}
