import React from "react";

import {DataTable, Detector, Message, Modal, Notify, openModal, rest} from '../../../src/components';
import NewApplicationInfo from "./NewApplicationInfo";
import * as Workflow from "../../Common/Workflow";

export default class BizApplicationList extends React.Component {
    static NewApplicationInfo = NewApplicationInfo;

    constructor(props) {
        super(props);
    }

    formReady = (voList) => {
        this.voList = voList;
        //添加按钮
        voList.addButton([
            {
                name: '创建申请',
                icon: 'fa-file-o',
                type: 'primary',
                permitCode: "Editable",
                onClick: () => this.createNewApplication()
            },
            {
                name: '提交审批',
                icon: 'fa-send-o',
                type: 'primary',
                permitCode: "Operateable",
                selectBind: true,
                onClick: () => this.submitForApproval()
            },
            {
                name: '删除申请',
                icon: 'fa-trash-o',
                type: 'default',
                permitCode: "Editable",
                selectBind: true,
                onClick: () => this.deleteApplication()
            },
        ]);

        this.voList.setColumnTemplate('applicationId', (text, record, i) => {
            return (<a onClick={() => this.openApplicationView(record)}>{text}</a>);
        });
        this.voList.setColumnTemplate('appStatus', (text, record, i) => {
            const appStatus = record.appStatus || "";
            if (appStatus === "CREATED") {                                  //申请状态
                return (<span style={{"color": "#FFD700"}}>{text}</span>);
            } else if (appStatus === "IN_PROCESS") {                              //审批状态
                return (<span style={{"color": "#191970"}}>{text}</span>);
            } else if (appStatus === "ENABLED") {                                  //审批通过
                return (<span style={{"color": "#008000"}}>{text}</span>);
            } else if (appStatus === "DISABLED") {                                  //审批拒绝
                return (<span>{text}</span>);
            }
        });
        this.voList.setColumnTemplate('appMilestone', (text, record, i) => {
            const appMilestone = record.appMilestone || '';
            if (!appMilestone.startsWith('App1010')) {  //录入时，没有流程
                return (<a onClick={() => this.openExecWorkflow(record.applicationId)}>{text}</a>);
            }
            return <span>{text}</span>
        });
    };

    openApplicationView = (record) => {
        const {flexTabs} = this.props;
        flexTabs.open(`[${record.custName}]-业务`, 'BizApplication/ApplicationView', {applicationId: record.applicationId});
    }

    dataListRefresh = () => {
        this.voList.refresh();
    };

    createNewApplication = () => {
        openModal(<NewApplicationInfo disabledContainer/>, {
            defaultButton: true,
            title: "创建业务申请",
            isDragact: true,
            onOk: (modal, component, btn) => {
                component.newApplicationSave((err, value) => {
                    if (!err) {
                        modal.close();
                    }
                }, btn);
            },
            refresh: this.dataListRefresh,
        });

    }

    detcReady = (detc) => {
        this.detc = detc;
    };

    submitForApproval = () => {
        const that = this;
        const row = that.voList.getSelectedRow();
        const applicationId = row.applicationId;


        openModal(<Detector code={"ApplicationDefaultDector"} param={{"applicationId": applicationId}}
                            detcReady={this.detcReady}/>, {
            defaultButton: true,
            title: '数据检查',
            onOk(modal, compnent) {
                modal.close();
                if (that.detc.getResult() === true) {
                    that.openExecWorkflow(applicationId);
                }
            }
        });


    }

    /**
     * 处理流程，
     * 1.如果没有发起，则发起
     * 2.如果已经发起了，没提交则使用提交页面
     * 3.如果已经发起了，提交了则使用查看页面
     * 4.如果都不是，则这笔业务与当前用户无关（这种情况基本不存在）
     * @param applicationId
     */
    openExecWorkflow = (applicationId) => {
        const {flexTabs, openLoading, closeLoading} = this.props;
        openLoading();
        rest.get(`/application/workflow/taskStateDescription/${applicationId}`)
            .then((ret) => {
                const {taskState} = ret;
                if (taskState === 'NotYet') {     //还没有发起流程
                    //发起流程
                    rest.post(`/application/workflow/start/${applicationId}`)
                        .then((workflowTask) => {
                            if (!workflowTask) {
                                Notify.error("获取任务信息出错!");
                                return;
                            }
                            //打开流程处理页面
                            const taskBrief = {
                                taskId: workflowTask.taskId,
                                procId: workflowTask.procId,
                                taskName: workflowTask.taskName,
                                procDefKey: workflowTask.workflowProc.procDefKey
                            };
                            Workflow.openProcessTab(this.props, taskBrief);
                        }).catch((error) => {
                        console.error(error);
                        Modal.error({
                            title: "提交申请",
                            content: "提交申请出错,请联系系统管理员"
                        });

                    }).finally(() => {
                    });
                } else if (taskState === 'FirstUnSubmit') {     //首岗未提交
                    Workflow.openProcessTab(this.props, ret);
                } else if (taskState === 'FirstSubmitted') {     //首岗已提交
                    Workflow.openProcessTab(this.props, ret);
                } else {     //这笔业务目前与我无关
                    Message.error('数据错误，该笔业务目前与您无逻辑关联');
                    return;
                }
            }).finally(() => {
            closeLoading();
        });
    }

    startWorkflow = (applicationId) => {

    }

    deleteApplication = () => {
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
                    dataFormId="obiz-ApplicationList"
                    formReady={this.formReady}
                />
            </div>
        );
    }
}
