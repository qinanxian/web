import React from 'react';
import { DataTable, Button, Icon, Message, rest } from '../../../src/components';
export default class ApplicationApproveTaskList extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            finishTime:null,
            taskKey:(props.params&&props.params.taskKey)?props.params.taskKey:null,
        };
    }
    formReady = (dataTable) =>{
        this.volist = dataTable;
        dataTable.addButton([{
            name: '刷新',
            onClick: ()=>dataTable.refresh()
        }]);
        dataTable.setColumnTemplate('opreate', (text, record, i ) => {
            // return (<Button type="link" size="small" onClick={()=>this.openWorkflowEditor(record)}><Icon type="roic-approve-reply"/>办理</Button>);
            return (
                <a onClick={()=>this.openWorkflowEditor(record)}>
                    <Icon type="roic-approve-reply"/>办理
                </a>
            );
        });
    };

    openWorkflowEditor = (record) => {
        const {flexTabs} = this.props;

        const taskId = record.taskId;
        rest.get(`/workflow/process/workflowTask/${taskId}`).then((data) =>{
            if (data.finishTime) {
                Message.info("该任务已处理,请刷新页面")
                return "";
            } else {
                flexTabs.open(`${record.taskName}`,'BizApplication/ApplicationWorkflow/ApplicationProcessor',{...record, preId: this.props.param.__id });
            }
        })
    };


    taskIsFinished =(record) =>{
        const {rest} = this.props;
        const taskId = record.taskId;
        rest.get(`/workflow/process/workflowTask/${taskId}`).then((data) =>{
            this.state.finishTime= data.finishTime;
        })
    }


    render() {
        return (
            <div>
                <DataTable dataFormId="obiz-ApplicationPendingTaskList"
                           formReady={this.formReady}
                           params={{taskKey: this.state.taskKey}}
                />
            </div>
        );
    }
}
