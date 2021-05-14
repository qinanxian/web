/**
 * Created by apachechen on 2018/2/28.
 */
import React from 'react';
import * as rest from '../../../../src/lib/rest';
import {post} from "../../../../src/lib/rest";
import $ from "jquery";
import {Message, Modal, Icon, Button, Notify} from "../../../../src/components";

/**
 * 异常消息统一处理
 * @param title
 * @param content
 */
const errorPrompt = (title, content) => {
    Modal.error({
        title: title,
        content: content
    });
};

/**
 * 使用任务池模式提交模态框
 */
const useTaskPoolCommitModal = (title, content, taskId, comment, param) => {
    Modal.confirm({
        title: title,
        content: content,
        cancelText: '取消',
        okText: '确定',
        onOk() {
            doCommit(taskId, comment, param)
        },
        onCancel() {
            const {closeLoading} = param;
            closeLoading && closeLoading();
        },
    });
};

/**
 * 任务池模式提交
 * @param taskId
 */
const doCommit = (taskId, comment, param) => {
    const {callBack, closeLoading} = param;

    const params = {
        taskId: taskId,
        comment: comment,
    };
    rest.post("/workflow/process/commit", {}, {
        data: $.param(params),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        },
    }).then(() => {
        closeLoading && closeLoading();
        callBack && callBack();
        Modal.info({
            title: '返回信息提示',
            content: "提交成功",
        })
    }).catch((error) => {
        closeLoading && closeLoading();
        errorPrompt('任务提交出错', error.message);
    });
};

const doCommitForManager = (taskId, comment, param) => {
    const {callBack, closeLoading, refresh} = param;

    const params = {
        taskId: taskId,
        comment: comment,
    };
    rest.post("/workflow/manage/commit", {}, {
        data: $.param(params),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        },
    }).then(() => {
        closeLoading && closeLoading();
        callBack && callBack();
        Modal.info({
            title: '返回信息提示',
            content: "提交成功",
        })
        refresh && refresh();
    }).catch((error) => {
        closeLoading && closeLoading();
        errorPrompt('任务提交出错', error.message);
    });
};

/**
 * 指定人模式提交
 * @param taskId
 */
const doCommitAssignee = (taskId, comment, assignee, param) => {
    const {callBack, openLoading, closeLoading} = param;

    const params = {
        taskId: taskId,
        comment: comment,
        assignee: assignee,
    };
    rest.post("/workflow/process/commitAssignee", {}, {
        data: $.param(params),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        },
    }).then(() => {
        closeLoading && closeLoading();
        callBack && callBack();
        Modal.info({
            title: '任务提交',
            content: "任务提交成功",
        })
    }).catch((error) => {
        errorPrompt('任务提交出错', error.message);
        closeLoading && closeLoading();
    });
};

/**
 * 任务退回
 * @param taskId
 */
const doBackFront = (taskId, dscTaskKey, comment, param) => {
    const {callBack, openLoading, closeLoading} = param;

    const params = {
        taskId: taskId,
        dscTaskKey: dscTaskKey,
        comment: comment,
    };
    rest.post("/workflow/process/backFront", {}, {
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
        errorPrompt('任务退回出错', error.message);
        closeLoading && closeLoading();
    });
};

/**
 * 任务退回指定受理人
 * @param taskId
 */
const doBackFrontAssignee = (taskId, dscTaskKey, comment, assignee, param) => {
    const {callBack, openLoading, closeLoading} = param;

    const params = {
        taskId: taskId,
        dscTaskKey: dscTaskKey,
        comment: comment,
        assignee: assignee
    };
    rest.post("/workflow/process/backFrontAssignee", {}, {
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
            content: '任务退回成功',
        })
    }).catch((error) => {
        errorPrompt('任务退回出错', error.message);
        closeLoading && closeLoading();
    });
};

/**
 * 任务驳回
 * @param taskId
 */
const doBackOrigin = (taskId, comment, param) => {
    const {callBack, openLoading, closeLoading} = param;

    const params = {
        taskId: taskId,
        comment: comment,
    };
    rest.post("/workflow/process/backOrigin", {}, {
        data: $.param(params),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        },
    }).then(() => {
        closeLoading && closeLoading();
        callBack && callBack();
        Modal.info({
            title: '流程驳回',
            content: '流程驳回成功',
        })
    }).catch((error) => {
        errorPrompt('流程驳回出错', error.message);
        closeLoading && closeLoading();
    });
};


/**
 * 任务退回修改
 * @param taskId
 */
const doBackTrack = (taskId, dscTaskKey, comment, param) => {
    const {callBack, openLoading, closeLoading} = param;

    const params = {
        taskId: taskId,
        dscTaskKey: dscTaskKey,
        comment: comment,
    };
    rest.post("/workflow/process/backTrack", {}, {
        data: $.param(params),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        },
    }).then(() => {
        closeLoading && closeLoading();
        callBack && callBack();
        closeLoading && closeLoading();
        Modal.info({
            title: '任务退回修改',
            content: '任务退回修改成功',
        })
    }).catch((error) => {
        errorPrompt('任务退回修改出错', error.message);
        closeLoading && closeLoading();
    });
};

/**
 * 任务退回修改指定受理人
 * @param taskId
 */
const doBackTrackAssignee = (taskId, dscTaskKey, comment, assignee, param) => {
    const {callBack, openLoading, closeLoading} = param;

    const params = {
        taskId: taskId,
        dscTaskKey: dscTaskKey,
        comment: comment,
        assignee: assignee
    };
    rest.post("/workflow/process/backTrackAssignee", {}, {
        data: $.param(params),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        },
    }).then(() => {
        closeLoading && closeLoading();
        callBack && callBack();
        Modal.info({
            title: '任务退回修改',
            content: '任务退回修改成功',
        })
    }).catch((error) => {
        errorPrompt('任务退回修改出错', error.message);
        closeLoading && closeLoading();
    });
};


/**
 * 流程退回上一步
 * @param taskId
 * @param comment
 * @param param
 */
const doBackToPrev = (taskId, comment, param) => {
    const {callBack, openLoading, closeLoading} = param;

    const params = {
        taskId: taskId,
        comment: comment,
    };
    rest.post("/workflow/process/backToPrev", {}, {
        data: $.param(params),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        },
    }).then(() => {
        closeLoading && closeLoading();
        callBack && callBack();
        Modal.info({
            title: '流程退回上一步',
            content: '流程退回上一步成功',
        })
    }).catch((error) => {
        errorPrompt('流程退回上一步出错', error.message);
        closeLoading && closeLoading();
    });
};

/**
 * 流程作废
 * @param taskId
 */
const doAbolish = (taskId, comment, param) => {
    const {callBack, openLoading, closeLoading, refresh} = param;

    const params = {
        taskId: taskId,
        comment: comment
    };
    rest.post("/workflow/process/abolish", {}, {
        data: $.param(params),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        },
    }).then(() => {
        closeLoading && closeLoading();
        callBack && callBack();
        Modal.info({
            title: '流程作废',
            content: '作废成功',
        })
        refresh && refresh();
    }).catch((error) => {
        errorPrompt('流程作废出错', error.message);
        closeLoading && closeLoading();
    });
};


/**
 * 流程否决
 * @param taskId
 */
const doReject = (taskId, comment, param) => {
    const {callBack, openLoading, closeLoading} = param;

    const params = {
        taskId: taskId,
        comment: comment
    };
    rest.post("/workflow/process/reject", {}, {
        data: $.param(params),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        },
    }).then(() => {
        closeLoading && closeLoading();
        callBack && callBack();
        Modal.info({
            title: '返回信息提示',
            content: "否决成功",
        })
    }).catch((error) => {
        errorPrompt('任务否决出错', error.message);
        closeLoading && closeLoading();
    });
};

/**
 * 选择受理人模态框
 * @param taskDef
 * @param cb
 * @param param
 */
const selectAssigneeModel = (assigneeExpr, cb, param) => {
    if (!assigneeExpr.users || !assigneeExpr.roles) {
        errorPrompt('选择受理人列表', '受理人列表为空!');
        return;
    }
    let users = assigneeExpr.users, roles = assigneeExpr.roles;
    if (!roles && users.length == 0 && roles.length == 0) {
        errorPrompt('选择受理人列表', '受理人列表为空!');
        return;
    }

    let title = "请选择受理人";
    if (assigneeExpr.nextTaskName && '' != assigneeExpr.nextTaskName) {
        title = "请为任务节点[" + assigneeExpr.nextTaskName + "]选择受理人";
    }

    param.common.openSubmitDialog({
        dataFormId: "workflow-WorkflowTaskAssigneeUsers", selectionType: 'single', params: {
            users: users.length > 0 ? users : '0',
            roles: roles.length > 0 ? roles : '0'
        }
    }, cb, title);
};


//-------------------------------------------以下是数据库中配置的流程扭转触发的方法------------------------------------------//
//提交
export const commit = (param) => {
    const {callBack, openLoading, closeLoading} = param;

    let comment = param.comment;
    let firstComment = param.firstComment;
    if (!comment && firstComment !== null) {
        comment = '同意';
        Notify.warn('流程意见未填写,使用默认意见"同意"', "流程意见");
    }
    if (firstComment === null&&comment===null) {
        Modal.error({
            title: '提交失败',
            content: '请输入意见!'
        });
        return;
    }

    openLoading && openLoading();
    doCommit(param.taskId, comment, param);
};
//系统管理员提交
export const commitForManager = (param) => {
    const {callBack, openLoading, closeLoading} = param;

    let comment = param.comment;
    let firstComment = param.firstComment;
    if (!comment && firstComment === null) {
        comment = '同意';
        Notify.warn('流程意见未填写,使用默认意见"同意"', "流程意见");
    }
    if (comment === null) {
        Modal.error({
            title: '提交失败',
            content: '请输入意见!'
        });
        return;
    }
    openLoading && openLoading();
    doCommitForManager(param.taskId, comment, param);
};

//提交指定签收人
export const commitAssignee = (param) => {
    const {callBack, openLoading, closeLoading} = param;

    let taskId = param.taskId;
    let comment = param.comment;
    let firstComment = param.firstComment;
    if (!comment && firstComment) {
        comment = '同意';
        Notify.warn('流程意见未填写,使用默认意见"同意"', "流程意见");
    }
    if (comment === null) {
        Modal.error({
            title: '提交失败',
            content: '请输入意见!'
        });
        return;
    }

    /**
     * 流程“提交指定受理人”不适用的场景
     * 1. 下一节点是结束节点
     * 2. 下一阶段为并行任务
     * 3. 下一阶段为多实例任务(会签)
     * 4. 下一节点为判断网关(参数不存在时,无法解析)
     * 5. 下一节点为“退回修改发起节点”则受理人只能是该发起人
     * 6. 多实例任务中,只有最后一个任务才能弹出指定受理人选择框
     */
    openLoading && openLoading();
    rest.get("/workflow/process/commitTaskAssignee/" + taskId).then((res) => {
        if (res.status == 1) {
            let title = '指定任务受理人操作异常';
            let content = '流程节点为结束节点或无法解析的判断网关,是否使用任务池的模式提交任务?';
            useTaskPoolCommitModal(title, content, taskId, comment, param);
        } else if (res.status == 2) {
            let title = '指定任务受理人操作异常';
            let content = '流程节点为并行节点,是否使用任务池的模式提交任务?';
            useTaskPoolCommitModal(title, content, taskId, comment, param);
        } else if (res.status == 6) {
            doCommit(taskId, comment, param);
        } else {
            selectAssigneeModel(res, (modal, data, type) => {
                if (type === 'ok') {
                    let user = data[0];
                    if (!user) {
                        errorPrompt('选择受理人出错', '请选择受理人!');
                        return;
                    }
                    modal.close();
                    /**
                     * 此处是否增加确认框
                     */
                    openLoading && openLoading();
                    doCommitAssignee(taskId, comment, user.id, param);
                } else {
                    closeLoading && closeLoading();
                }

            }, param);
        }
    }).catch((error) => {
        errorPrompt('获取"提交指定受理人列表"出错', error.message);
    });
};

// 驳回
export const backOrigin = (param) => {
    const {callBack, openLoading, closeLoading} = param;

    let procInstId = param.procInstId;
    let taskId = param.taskId;
    let comment = param.comment;
    if (!comment) {
        Modal.error({
            title: '操作失败',
            content: '请输入意见!'
        });
        return;
    }
    openLoading && openLoading();
    Modal.confirm({
        title: '流程驳回',
        content: '是否确定进行流程驳回',
        cancelText: '取消',
        okText: '确定',
        onOk() {
            doBackOrigin(taskId, comment, param);
        },
        onCancel() {
            const {closeLoading} = param;
            closeLoading && closeLoading();
        },
    });

};

//退回
export const backFront = (param) => {
    const {callBack, openLoading, closeLoading} = param;

    let procInstId = param.procInstId;
    let taskId = param.taskId;
    let comment = param.comment;
    if (!comment) {
        Modal.error({
            title: '操作失败',
            content: '请输入意见!'
        });
        return;
    }
    openLoading && openLoading();
    param.common.openSubmitDialog({procInstId: procInstId}, (modal, data, type) => {
        if (type === 'ok') {
            let dscTask = data[0];
            if (!dscTask) {
                errorPrompt('选择退回节点出错', '请选择退回节点!');
                return;
            }
            modal.close();
            let dscTaskKey = dscTask.activityId;

            doBackFront(taskId, dscTaskKey, comment, param);
        } else {
            closeLoading && closeLoading();
        }
    }, "退回选择框");
};

//退回指定受理人
export const backFrontAssignee = (param) => {
    const {callBack, openLoading, closeLoading} = param;

    let procInstId = param.procInstId;
    let taskId = param.taskId;
    let comment = param.comment;
    if (!comment) {
        Modal.error({
            title: '提交失败',
            content: '请输入意见!'
        });
        return;
    }

    openLoading && openLoading();
    param.common.openSubmitDialog({procInstId: procInstId}, (modal, data, type) => {
        if (type === 'ok') {
            let dscTask = data[0];
            if (!dscTask) {
                errorPrompt('选择退回节点出错', '请选择退回节点!');
                return;
            }
            modal.close();
            let dscTaskKey = dscTask.activityId;

            rest.get("/workflow/process/backTaskAssignee/" + procInstId + "/" + dscTaskKey).then(res => {
                selectAssigneeModel(res, (modal, data, type) => {
                    if (type === 'ok') {
                        let user = data[0];
                        if (!user) {
                            errorPrompt('选择受理人出错', '请选择的受理人!');
                            return;
                        }
                        modal.close();
                        doBackFrontAssignee(taskId, dscTaskKey, comment, user.id, param);

                    } else {
                        closeLoading && closeLoading();
                    }

                }, param);

            }).catch((error) => {
                errorPrompt('获取"退回指定受理人列表"出错', error.message);
            });

        } else {
            closeLoading && closeLoading();
        }

    }, "请选择任务退回节点");
};

//退回修改
export const backTrack = (param) => {
    const {callBack, openLoading, closeLoading} = param;

    let taskId = param.taskId;
    let procInstId = param.procInstId;
    let comment = param.comment;
    if (!comment) {
        Modal.error({
            title: '操作失败',
            content: '请输入意见!'
        });
        return;
    }
    openLoading && openLoading();
    param.common.openSubmitDialog({procInstId: procInstId}, (modal, data, type) => {
        if (type === 'ok') {
            let dscTask = data[0];
            if (!dscTask) {
                errorPrompt('选择退回节点出错', '请选择退回节点!');
                return;
            }
            modal.close();
            let dscTaskKey = dscTask.activityId;

            doBackTrack(taskId, dscTaskKey, comment, param);
        } else {
            closeLoading && closeLoading();
        }

    }, "请选择退回修改任务阶段");
};

//退回修改指定受理人
export const backTrackAssignee = (param) => {
    const {callBack, openLoading, closeLoading} = param;

    let taskId = param.taskId;
    let procInstId = param.procInstId;
    let comment = param.comment;
    if (!comment) {
        Modal.error({
            title: '提交失败',
            content: '请输入意见!'
        });
        return;
    }
    openLoading && openLoading();

    param.common.openSubmitDialog({procInstId: procInstId}, (modal, data, type) => {
        if (type === 'ok') {
            let dscTask = data[0];
            if (!dscTask) {
                errorPrompt('选择退回节点出错', '请选择退回节点!');
                return;
            }
            modal.close();
            let dscTaskKey = dscTask.activityId;

            rest.get("/workflow/process/backTaskAssignee/" + procInstId + "/" + dscTaskKey).then(res => {
                selectAssigneeModel(res, (modal, data, type) => {
                    if (type === 'ok') {
                        let user = data[0];
                        if (!user) {
                            errorPrompt('选择受理人出错', '请选择的受理人!');
                            return;
                        }
                        modal.close();
                        doBackTrackAssignee(taskId, dscTaskKey, comment, user.id, param);

                    } else {
                        closeLoading && closeLoading();
                    }

                }, param);

            }).catch((error) => {
                errorPrompt('获取"退回指定受理人列表"出错', error.message);
            });

        } else {
            closeLoading && closeLoading();
        }

    }, "请选择退回修改任务阶段");
};


//作废
export const backToPrev = (param) => {
    const {callBack, openLoading, closeLoading} = param;

    let taskId = param.taskId;
    let comment = param.comment;
    if (!comment) {
        Modal.error({
            title: '操作失败',
            content: '请输入意见!'
        });
        return;
    }
    openLoading && openLoading();

    Modal.confirm({
        title: '流程退回上一步',
        content: '是否确定进行流程退回上一步',
        cancelText: '取消',
        okText: '确定',
        onOk() {
            doBackToPrev(taskId, comment, param);
        },
        onCancel() {
            const {closeLoading} = param;
            closeLoading && closeLoading();
        },
    });


};

//作废
export const abolish = (param) => {
    const {callBack, openLoading, closeLoading} = param;

    let taskId = param.taskId;
    let comment = param.comment;
    if (!comment) {
        Modal.error({
            title: '操作失败',
            content: '请输入意见!'
        });
        return;
    }
    openLoading && openLoading();

    Modal.confirm({
        title: '流程作废',
        content: '是否确定进行流程作废',
        cancelText: '取消',
        okText: '确定',
        onOk() {
            doAbolish(taskId, comment, param);
        },
        onCancel() {
            const {closeLoading} = param;
            closeLoading && closeLoading();
        },
    });


};


//转他人处理
export const deliverTo = (param) => {
    const {callBack, openLoading, closeLoading} = param;

    let taskId = param.taskId;
    let comment = param.comment;
    if (!comment) {
        Modal.error({
            title: '操作失败',
            content: '请输入意见!'
        });
        return;
    }

    openLoading && openLoading();
    param.common.openSubmitDialog({dataFormId: "workflow-WorkflowUsersList"}, (modal, data, type) => {
        if (type === 'ok') {
            let user = data[0];
            if (!user) {
                errorPrompt('选择受理人出错', '请选择的受理人!');
                return;
            }
            modal.close();

            let params = {
                taskId: taskId,
                userId: user.id,
                comment: comment
            };

            rest.post("/workflow/process/deliverTo", {}, {
                data: $.param(params),
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
            }).then(() => {
                Modal.info({
                    title: '任务转他人处理',
                    content: '转他人处理成功',
                    onOk() {
                        callBack && callBack();
                        closeLoading && closeLoading();
                    }
                })

            }).catch((error) => {
                errorPrompt('任务转他人处理出错', error.message);
            });

        } else {
            closeLoading && closeLoading();
        }
    }, "转他人处理选择框", true);
};


//否决
export const reject = (param) => {
    const {callBack, openLoading, closeLoading} = param;

    let taskId = param.taskId;
    const comment = param.comment;
    if (!comment) {
        Modal.error({
            title: '操作失败',
            content: '请输入意见!'
        });
        return;
    }
    const params = {
        taskId: param.taskId,
        comment: param.comment
    };
    openLoading && openLoading();

    Modal.confirm({
        title: '流程否决',
        content: '是否确定进行流程否决',
        cancelText: '取消',
        okText: '确定',
        onOk() {
            doReject(taskId, comment, param);
        },
        onCancel() {
            const {closeLoading} = param;
            closeLoading && closeLoading();
        },
    });


};

//查看流程
export const lookWorkflow = (param) => {
    const {flexTabs} = param;
    let procInstId = param.procInstId || param.procId;
    let procDefId = param.procDefId;
    let taskId = param.taskId;

    if(procInstId&&procDefId){
        const url = "/diagram-viewer/index.html?processInstanceId="
            + procInstId + "&processDefinitionId=" + procDefId;
        flexTabs.openIframe('查看流程进度图', url);
    } else if((!procInstId||!procDefId)&&taskId){
        rest.get("/workflow/process/workflowTask/"+taskId, {}, {
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            },
        }).then((rst) => {
            procInstId = rst.procId;
            procDefId = rst.workflowProc.procDefId;
            if(!procInstId||!procDefId) {errorPrompt('获取任务对象信息出错');return;}
            const url = "/diagram-viewer/index.html?processInstanceId="
                + procInstId + "&processDefinitionId=" + procDefId;
            flexTabs.openIframe('查看流程进度图', url);
        }).catch((error) => {
            errorPrompt('获取任务对象信息出错', error.message);
        });
    } else {
        errorPrompt('流程查看条件信息不存在');
    }

};

//征求他人意见
export const takeAdvice = (param) => {

    const {callBack, openLoading, closeLoading} = param;
    let taskId = param.taskId;
    const comment = param.comment;
    if (!comment) {
        Modal.error({
            title: '操作失败',
            content: '请输入意见!'
        });
        return;
    }

    openLoading && openLoading();
    // dataFormId:目标模板Id
    param.common.openSubmitDialog({dataFormId: "workflow-WorkflowUsersList"}, (modal, data, type) => {
        if (type === "ok") {
            let user = data[0];
            if (!user) {
                errorPrompt('选择受理人出错', '请选择需要征求意见的受理人!');
                return;
            }
            modal.close();

            let ids = data.map((user) => user.id);
            let params = {
                taskId: taskId,
                userIds: ids,
                comment: comment
            };

            rest.post("/workflow/process/takeAdvice", {}, {
                data: $.param(params),
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
            }).then(() => {
                Modal.info({
                    title: '征求他人意见',
                    content: '征求他人意见操作成功',
                    onOk() {
                        callBack && callBack();
                        closeLoading && closeLoading();
                    }
                })

            }).catch((error) => {
                errorPrompt('任务征求他人意见出错', error.message);
            });
        } else {
            closeLoading && closeLoading();
        }
    }, "征求他人意见选择框");
};

//征求他人意见-反馈意见
export const feedback = (param) => {
    const {callBack, openLoading, closeLoading} = param;

    const comment = param.comment;
    if (!comment) {
        Modal.error({
            title: '操作失败',
            content: '请输入意见!'
        });
        return;
    }
    openLoading && openLoading();
    post('/workflow/process/feedback', {}, {
        data: {taskId: param.taskId, comment: param.comment},
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        },
    })
        .then(() => {
            Modal.info({
                title: '反馈意见',
                content: "反馈意见操作成功",
                onOk() {
                    callBack && callBack();
                    closeLoading && closeLoading();
                }
            })
        }).catch((error) => {
        errorPrompt('意见反馈出错', error.message);
        closeLoading && closeLoading();
    });
};

export const refresh = () => {
    const {refresh} = this.props;
    refresh && refresh();
};

export const buttonClick = (but, prop) => {
    let commentMessage = "";
    if (prop.common.getSubRegionComponent("SRSignApplyComment")) {
        commentMessage = prop.common.getSubRegionComponent("SRSignApplyComment").getComment();
    }
    if (prop.common.getSubRegionComponent("SRSignComment")) {
        commentMessage = prop.common.getSubRegionComponent("SRSignComment").getComment();
    }
    let param = prop.properties;
    const pa = param.param;
    param = {
        ...pa,
        comment: commentMessage,
        openLoading: param.openLoading,
        closeLoading: param.closeLoading,
        flexTabs: param.flexTabs,
        common: param.common,
        callBack: () => {
            param.flexTabs.close(pa.__id);
            // refresh(pa.preId);
        }
    };
    but.action.includes('=>') ? eval(but.action)() : eval(but.action);
};

export const getValueByKey = (key) => {
    switch (key) {
        case 'dueDiligenceAndDecisionFlow':
            return 'DueDiligenceProcessor';
        case 'ivstPlanEstablishment':
            return 'EstablishmentProcessor';
    }
};
