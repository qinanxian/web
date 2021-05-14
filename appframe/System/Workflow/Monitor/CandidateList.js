/**
 * Created by apachechen on 2018/3/20.
 */
import React from 'react';
import * as rest from '../../../../src/lib/rest';

import {DataTable,openModal,Modal,Button,Icon,Upload, Message,Row} from '../../../../src/components/index';

export default class CandidateList extends React.Component {

    constructor(props){
        super(props);
        this.state ={
            taskId: this.props.param.taskId,
        }
        this.common = null
    }

    formReady = (dataTable) => {
        this.dataTable = dataTable;
        this.dataTable.setColumnTemplate('operate', (text, record, i) => {
            return (
                <div>
                    <Button onClick={() => this.deleteCandidate(record)}><Icon type="delete"/>删除</Button>
                </div>
            );
        });
    };

    formReady2 = (dataTable) => {
        this.dataTable2 = dataTable;
        this.dataTable2.setColumnTemplate('operate', (text, record, i) => {
            return (
                <div>
                    <Button onClick={() => this.deleteCandidateGroup(record)}><Icon type="delete"/>删除</Button>
                </div>
            );
        });
    }

    formReady3 = (dataTable) => {
        this.dataTable3 = dataTable;
        this.dataTable3.setColumnTemplate('operate', (text, record, i) => {
            return (
                <div>
                    <Button onClick={() => this.updateAssignee(record)}><Icon type="delete"/>修改</Button>
                </div>
            );
        });
    }

    dataReady = (a) =>{
        this.common = a;
    }

    listRefresh = () => {
        this.dataTable && this.dataTable.refresh();
        this.dataTable2 && this.dataTable2.refresh();
        this.dataTable3 && this.dataTable3.refresh();
    };

    updateAssignee = (record) => {
        const refresh = this.listRefresh;
        console.log(this.common);
        this.openUsersModel({dataFormId: "workflow-WorkflowUsersList"}, (modal, data) => {
            modal.close();
            rest.post("/workflow/process/changeAssignee", {taskId: this.state.taskId,userId: data[0].id}).then(() => {

                Modal.info({
                    title: '返回信息提示',
                    content: '处理成功',
                    onOk: () => {
                        refresh && refresh();
                    }
                })
            });
        }, "修改受理人选择框");
    }

    deleteCandidateGroup = (record) => {
        let param = {
            ...record,
            taskId: this.state.taskId,
        };
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除该候选组吗？删除后数据不可恢复！`,
            onOk: () => {
                rest.post(`/workflow/process/deleteCandidateGroup`,{taskId: this.state.taskId,orgId: record.id},{
                    data: $.param(param),
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                }).then(() => {
                    Message.info("删除成功!");
                    this.listRefresh();
                }).catch((e) => {
                    console.log(e);
                });
            },
            onCancel: () => {
                return;
            },
        });
    }

    deleteCandidate = (record) => {
        let param = {
            ...record,
            taskId: this.state.taskId,
        };
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除该候选人吗？删除后数据不可恢复！`,
            onOk: () => {
                rest.post(`/workflow/process/deleteCandidateUser`,{taskId: this.state.taskId,userId: record.id},{
                    data: $.param(param),
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    },
                }).then(() => {
                    Message.info("删除成功!");
                    this.listRefresh();
                }).catch((e) => {
                   console.log(e);
                });
            },
            onCancel: () => {
                return;
            },
        });
    }

    _selectRow = (keys, rows) => {
        this.rows = rows;
    };

    openUsersModel = (data, cb, title) => {
        openModal(<DataTable dataFormId={data.dataFormId} onSelectRow={this._selectRow}/>, {
            onOk: (modal) => cb(modal, this.rows),
            defaultButton: true,
            title
        })
    }

    openSubmitDialog = (data, cb, title) => {
        // 打开弹出框
        if (data.dataFormId) {
            // 弹出列表
            openModal(<DataTable selectionType="multiple" dataFormId={data.dataFormId} onSelectRow={this._selectRow}/>, {
                onOk: (modal) => cb(modal, this.rows),
                defaultButton: true,
                title
            })
        } else {
            // 弹出接口请求
            const { rest } = this.props;
            openModal(<TaskSelect onSelectRow={this._selectRow} procInstId={data.procInstId} rest={rest}/>, {
                onOk: (modal) => cb(modal, this.rows),
                defaultButton: true,
                title
            });
        }
    };

    addCandidate = (res) => {
        console.log(this.common);
        const refresh = this.listRefresh;
        this.openSubmitDialog({dataFormId: "workflow-WorkflowUsersList"}, (modal, data) => {
            let ids = [];
            ids = data.map( (item) => item.id);
            modal.close();
            rest.post("/workflow/process/addCandidateUsers",
                {taskId: res.taskId,userIds: ids}).then(() => {
                Modal.info({
                    title: '返回信息提示',
                    content: '处理成功',
                    onOk() {
                        refresh && refresh();
                    }
                })
            });
        }, "添加候选人选择框");
    };

    addCandidateGroup = (res) => {
        const refresh = this.listRefresh;
        this.openSubmitDialog({dataFormId: "workflow-WorkflowOrgList"}, (modal, data) => {
            let ids = [];
            ids = data.map( (item) => item.id);
            modal.close();
            rest.post("/workflow/process/addCandidateGroup",
                {taskId: res.taskId,orgIds: ids}).then(() => {
                Modal.info({
                    title: '返回信息提示',
                    content: '处理成功',
                    onOk() {
                        refresh && refresh();
                    }
                })
            });
        }, "添加候选组选择框");
    }

    render() {
        const { param } = this.props;
        return (
            <div>
                <Row>
                    <DataTable
                        dataFormId="workflow-TaskOwnerList"
                        params={{taskId: param.taskId}}
                        formReady={this.formReady3}
                    />
                </Row>
                <Row>
                    <DataTable
                        dataFormId="workflow-TaskCandidateList"
                        params={{taskId: param.taskId}}
                        dataReady={this.dataReady}
                        formReady={this.formReady}
                    />
                    <Button onClick={() => this.addCandidate({taskId: this.state.taskId})}><Icon type="edit"/>增加</Button>
                </Row>
                <Row>
                    <DataTable
                        dataFormId="workflow-TaskCandidateGroupList"
                        params={{taskId: param.taskId}}
                        formReady={this.formReady2}
                    />
                    <Button onClick={() => this.addCandidateGroup({taskId: this.state.taskId})}><Icon type="edit"/>增加</Button>
                </Row>
            </div>
        );
    }
}
