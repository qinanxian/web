/**
 * 待办理任务列表
 */
import React from 'react';
import {CellRef, DataTable, EmebedButton, Icon, LinkButton, Progress, Message} from '../../../../src/components';
import * as Workflow from '../../../../app/Common/Workflow';

export default class PendingTaskList extends React.Component {

    constructor(props) {
        super(props);
        this.finishTime = null;

        this.headerRender = (meta, dict) => {
            return (
                <tr>
                    <th>操作</th>
                    <th>
                        <div><CellRef name="taskId"/></div>
                        <div><CellRef name="procId"/></div>
                    </th>
                    <th>
                        <div><CellRef name="taskName"/></div>
                        <div><CellRef name="summary"/></div>
                    </th>
                    <th>
                        <div><CellRef name="sponsorVirName"/></div>
                        <div><CellRef name="arrivalTime"/></div>
                    </th>
                </tr>
            );
        };

        this.bodyRowRender = (row, index) => {
            return (
                <tr>
                    <td><LinkButton onClick={() => this.openWorkflowEditor(row)}>处理</LinkButton></td>
                    <td>
                        <div><CellRef name="taskId"/></div>
                        <div><CellRef name="procId"/></div>
                    </td>
                    <td>
                        <div><CellRef name="taskName"/></div>
                        <div><CellRef name="summary"/></div>
                    </td>
                    <td>
                        <div><CellRef name="sponsorVirName"/></div>
                        <div><CellRef name="arrivalTime"/></div>
                    </td>
                </tr>
            );
        };
    }

    formReady = (dataTable) => {
        this.volist = dataTable;
        dataTable.addButton([{
            name: '刷新',
            onClick: () => dataTable.refresh()
        }]);
        dataTable.setColumnTemplate('opreate', (text, record, i) => {
            return (<EmebedButton type="primary" icon={"roic-approve-reply"}
                                  onClick={() => this.openWorkflowEditor(record)}>办理</EmebedButton>);
        });
    };

    dataReady = (dlist) => {
        dlist.setColumnTemplate('summary', (value, record, index) => {
            const ret = parseInt(record.curMaxDepth / record.maxDepth * 100);
            return (
                <div className='progress-container'>
                    <div className='progress-container-value'>{value}</div>
                    <div style={{"width":"90%"}}>
                        <Progress
                            strokeWidth={3}
                            size="small"
                            showInfo={false}
                            percent={ret}
                        />
                    </div>
                </div>
            );
        });
    };

    openWorkflowEditor = (record) => {
        const {flexTabs, param, rest} = this.props;
        const {close} = flexTabs;
        const defKey = record.procDefKey;
        const taskName = record.taskName;
        const taskId = record.taskId;
        rest.get(`/workflow/process/workflowTask/${taskId}`).then((data) => {
            if (data.finishTime) {
                Message.info("该任务已处理,请刷新页面")
                return "";
            } else {
                Workflow.openProcessTab(this.props, record);
            }
        })
    };

    taskIsFinished = (record) => {
        const {rest} = this.props;
        const taskId = record.taskId;
        rest.get(`/workflow/process/workflowTask/${taskId}`).then((data) => {
            this.finishTime = data.finishTime;
        })
    };

    render() {
        return (
            <DataTable
                viewModel={'ListView'}
                bordered={false}
                headerRender={this.headerRender}
                bodyRowRender={this.bodyRowRender}
                dataFormId="workflow-PendingTaskList"
                formReady={this.formReady}
                dataReady={this.dataReady}
            />
        );
    }
}
