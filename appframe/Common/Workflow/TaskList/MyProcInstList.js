/**
 * 我参与的流程列表
 * 左晓敏 <xmzuo@amarsoft.com>
 * 2018-03-15
 */
import React from 'react';
import {DataTable,Button,EmebedButton,Icon} from '../../../../src/components';
import * as rest from '../../../../src/lib/rest';
import ProcInstInfo from "../../../System/Workflow/Monitor/ProcInstInfo";
import ProcInstResource from "../ProcInstResource";

const ButtonGroup = Button.Group;
export default class WorkflowProcInstList extends React.Component {

    static ProcInstInfo = ProcInstInfo;
    static ProcInstResource = ProcInstResource;

    constructor(props){
        super(props);
        this.state ={
            processInstanceId:null
        }
    }

    formReady = (dataTable) => {
        const { flexTabs } = this.props;
        const { open } = flexTabs;
        dataTable.addButton([{
            name: '刷新',
            onClick: this.refresh
        }]);

        dataTable.setColumnTemplate('summary',(text, record, index) => {
            return (<a onClick={() => this.openWorkflowEditor(record)}>{text}</a>);
        });

        dataTable.setColumnTemplate('button',(text,record) =>{
            return (<div>
                <EmebedButton.Group style={{width:'100%',display:'flex'}}>
                    <EmebedButton onClick={()=>this.openProcInstResource(record)}><Icon type="fa-list-alt"/>业务信息</EmebedButton>
                    <EmebedButton onClick={() =>this.openProcInstSchedule(record)}><Icon type="roic-workflow"/>流程进度</EmebedButton>
                </EmebedButton.Group>
            </div>)
        })
        this.volist = dataTable;
    };

    openProcInstResource = (record) => {
        const { flexTabs } = this.props;
        const { close } = flexTabs;
        flexTabs.open(`${record.summary}`,'Common/Workflow/ProcInstResource',{record: record, preId: this.props.param.__id });
    };

    openProcInstSchedule =(record) => {
        const { flexTabs } = this.props;
        let url = "/diagram-viewer/index.html?processInstanceId="
            +record.procId+"&processDefinitionId="+record.procDefId;
        flexTabs.openIframe('查看流程进度图', url);
    };


    openWorkflowEditor =(row) =>{
        const {flexTabs} = this.props;
        flexTabs.open(`流程实例详情:${row.procName}`, `System/Workflow/Monitor/ProcInstInfo`, {
            procId: row.procId,
        });
    };

    refresh = () => {
        this.volist.refresh();
    }


    render(){
        return (
           <DataTable
             dataFormId="workflow-MyProcInstList"
             formReady={this.formReady}
           />
        );
    }
}