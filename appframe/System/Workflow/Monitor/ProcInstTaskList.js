import React from 'react';

import {DataTable,openModal,Dropdown,Menu,Button,Icon,Upload, Message,Row,TextArea} from '../../../../src/components/index';
import {Modal} from "../../../../src/components";
import * as TaskResolve from '../../../Common/Workflow/TaskProcess/TaskResolve';
import TaskSelect from '../../../Common/Workflow/WorkflowTaskProcessor/TaskSelect';

export default class ProcInstTaskList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            message:'系统管理员代为提交任务',
            selectData:{}
        };
    }
    dataReady(info,meta,dom){
    }

    formReady = (dataTable) => {
        this.volist = dataTable;
        dataTable.setColumnTemplate('operate', (text, record, i) => {
            // 判断任务是否结束
            if(!record.finishTime){
                return (
                    <div>
                        <Dropdown overlay={
                            <Menu>
                                <Menu.Item><Button onClick={() => this.taskProcess(record)}><Icon type="stepforward"/>任务提交</Button></Menu.Item>
                                <Menu.Item><Button onClick={() => this.taskForward(record)}><Icon type="forward"/>节点向前</Button></Menu.Item>
                                <Menu.Item><Button onClick={() => this.taskBackward(record)}><Icon type="banckward"/>节点后退</Button></Menu.Item>
                                <Menu.Item><Button onClick={() => this.taskAbolish(record)}><Icon type="delete"/>流程作废</Button></Menu.Item>
                            </Menu>
                        }>
                            <Button><Icon type="tool"/>任务处理</Button>
                        </Dropdown>
                        <Button onClick={() => this.queryCandidate(record)}><Icon type="edit"/>权限变更</Button>
                    </div>
                );
            } else {
                return (<div></div>)
            }


        });
    };

    /**
     * 异常消息统一处理
     * @param title
     * @param content
     */
    errorPrompt  = (title, content) => {
        Modal.error({
            title: title,
            content: content
        });
    };
    handleChange = (value) => {
        this.setState({
            message:value
        });
    };
    commentModal = (record,flag) =>{
        const cancel = (modal) => {
            Message.error('你点击了取消');
            modal.close();
        };
        const confirm = (modal) => {
            if (flag ==='taskCommit'){
                TaskResolve.commitForManager({record:record,comment:this.state.message,refresh:this.props.refresh,closeLoading:this.props.closeLoading,openLoading:this.props.openLoading});
            }
            if (flag ==='taskForward'){
                TaskResolve.taskForward({record:record,comment:this.state.message,refresh:this.props.refresh,closeLoading:this.props.closeLoading,openLoading:this.props.openLoading});
            }
            if (flag ==='taskBackward'){
                this.backFront({record:record,comment:this.state.message});
            }
            if (flag ==='taskAbolish'){
                TaskResolve.abolish({record:record,comment:this.state.message,refresh:this.props.refresh,closeLoading:this.props.closeLoading,openLoading:this.props.openLoading});
            }
            modal.close();
        };

        const ref = openModal(
            <TextArea onChange={this.handleChange} value={this.state.message}/>
            , {
                title:<div><span style={{fontSize: '18px', color: '#000'}}>请输入意见</span></div>,
                footer:[
                    <Button key="back" onClick={()=>cancel(ref)}>取消</Button>,
                    <Button key="submit" onClick={()=>confirm(ref)} type="primary" >确定</Button>,
                ]
            });
    };

    taskProcess =(record) => {
        record = {
            ...record,
            procDefId: this.props.param.procDefId,
            procInstId: this.props.param.procInstId,
            procId: this.props.param.procId,
        };
        this.commentModal(record,'taskCommit');
    };

    taskForward =(record) => {
        record ={
            ...record,
            procDefId: this.props.param.procDefId,
            procInstId: this.props.param.procInstId,
            procId: this.props.param.procId,
        };

        this.commentModal(record,'taskForward')
    };


    taskBackward =(record) => {
        record ={
            ...record,
            procDefId: this.props.param.procDefId,
            procInstId: this.props.param.procInstId,
            procId: this.props.param.procId,
        };

        this.commentModal(record,'taskBackward')
    };

    taskAbolish = (record) => {
        record = {
            ...record,
            procDefId: this.props.param.procDefId,
            procInstId: this.props.param.procInstId,
            procId: this.props.param.procId,
        };
        this.commentModal(record,'taskAbolish');
    };

    _selectRow = (rows) => {
        console.log('record:',rows);
        this.setState({
            selectData:rows
        })
    };
    backFront = (param) => {
        const {callBack, openLoading, closeLoading} = this.props;

        let procInstId = param.record.procInstId;
        let taskId = param.record.taskId;
        let comment = param.comment;
        if (!comment) {
            Modal.error({
                title: '操作失败',
                content: '请输入意见!'
            });
            return;
        }
        openLoading && openLoading();
        const { rest } = this.props;
        openModal(<TaskSelect autoConfig={true} onSelectRow={this._selectRow} procInstId={this.props.param.procInstId} rest={rest}/>, {
            defaultButton: true,
            title:'请选择任务退回节点',
            onOk: (modal) => {
                const param = {
                    taskId:this.state.selectData[0].taskId,
                    dscTaskKey:this.state.selectData[0].dscTaskKey,
                    comment:comment,
                };
                this.doBackFront(param);
            },
            onCancel: (modal) => {
                closeLoading && closeLoading();
            },
        });
        // param.common.openSubmitDialog({procInstId: procInstId}, (modal, data, type) => {
        //     if (type === 'ok') {
        //         let dscTask = data[0];
        //         if (!dscTask) {
        //             errorPrompt('选择退回节点出错', '请选择退回节点!');
        //             return;
        //         }
        //         modal.close();
        //         let dscTaskKey = dscTask.activityId;
        //
        //         this.doBackFront(taskId, dscTaskKey, comment, param);
        //     } else {
        //         closeLoading && closeLoading();
        //     }
        // }, "退回选择框");
    };


    doBackFront = (params) => {
        const {callBack, openLoading, closeLoading,rest} = this.props;
        rest.post("/workflow/process/backFront", {
            data: $.param(params),
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            },
        }).then(() => {
            closeLoading && closeLoading();
            callBack && callBack();
            Modal.info({
                title: '任务退回',
                content: '退回成功',
            })
        }).catch((error) => {
            Modal.error({
                title: '任务退回出错',
                content: error.message
            });
            closeLoading && closeLoading();
        });
    };




    queryCandidate = (record) => {
        const { flexTabs } = this.props;
        flexTabs.open(`候选人列表`,'System/Workflow/Monitor/CandidateList',{procId: record.procId,taskId: record.taskId,common: this.props.param.common});
    };

    render() {
        const { param } = this.props;
        return (
            <div>
                <Row>
                    <DataTable
                        dataFormId="workflow-ProcInstTaskList"
                        dataReady={this.dataReady}
                        formReady={this.formReady}
                        params={{procId: param.procId}}
                    />
                </Row>
                <Row>
                    <DataTable
                        dataFormId="workflow-WorkflowCommentList"
                        params={{procId: param.procId}}
                    />
                </Row>
            </div>
        );
    }
}