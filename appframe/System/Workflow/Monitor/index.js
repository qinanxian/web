import React from 'react';
import {DataTable,Button,Icon} from '../../../../src/components';
import * as rest from '../../../../src/lib/rest';
import ProcInstInfo from "./ProcInstInfo";
import ProcInstTaskList from "./ProcInstTaskList";
import CandidateList from "./CandidateList";
export default class WorkflowProcInstList extends React.Component {

    static ProcInstInfo = ProcInstInfo;
    static ProcInstTaskList = ProcInstTaskList;
    static CandidateList = CandidateList;

    constructor(props){
        super(props);
        this.state ={
            processInstanceId:null
        }
    }

    formReady = (dataTable) => {
        const { flexTabs } = this.props;
        const { open } = flexTabs;

        dataTable.setColumnTemplate('summary',(text, record, index) => {
            return (<a onClick={() => this.openWorkflowEditor(record)}>{text}</a>);
        });

        dataTable.setColumnTemplate('button',(text,record) =>{
            return (<div>
                <Button  onClick={() =>this.openProcInstSchedule(record)}><Icon type="search" />流程进度</Button>
                <Button  onClick={() =>this.openTaskList(record)}><Icon type="search" />任务列表</Button>
            </div>)
        })
    };

    openProcInstSchedule =(row) => {
        const { flexTabs } = this.props;
        let url =rest.getRequestURL(`/diagram-viewer/index.html?processInstanceId=${row.procId}&processDefinitionId=${row.procDefId}`)
        flexTabs.openIframe('查看流程进度图', url);
    };


    openWorkflowEditor =(row) =>{
        const {flexTabs} = this.props;
        flexTabs.open(`流程实例详情:${row.procName}`, `System/Workflow/Monitor/ProcInstInfo`, {
            procId: row.procId,
        });
    };

    openTaskList =(row) =>{
        const {flexTabs} = this.props;
        flexTabs.open(`流程实例:[${row.procName}]任务列表`, `System/Workflow/Monitor/ProcInstTaskList`, {
            procId: row.procId,
            procDefId: row.procDefId,
            procInstId: row.procInstId,
        });
    };

    render(){
        return (
            <DataTable
                dataFormId="workflow-ProcInstList"
                formReady={this.formReady}
            />
        );
    }
}