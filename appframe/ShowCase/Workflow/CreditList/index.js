import React from "react";

import {DataTable, Notify, Message, DetailInfo, openModal, Modal,rest} from '../../../../src/components/index';

import CreditInfoAdd from '../CreditInfoAdd';
import $ from "jquery";



export default class InvestPlanList extends React.Component {
    static CreditInfoAdd = CreditInfoAdd;

    dataReady = (dataList) => {
        this.formList.setColumnTemplate('planName', (text, record, i) => {
            return (<a onClick={() => this.openDetail(record)}>{text}</a>);
        });
    };

    formReady = (formList) => {
        this.formList = formList;
        this.formList.addButton([{
            name: '发起新业务',
            icon:'fa-file-o',
            type:'success',
            onClick: this.openInvestPlanInfoAdd
        }, {
            selectBind: true,
            name: '删除',
            icon:'fa-file-o',
            onClick: this.deleteInvestPlan
        }]);
    };

    openInvestPlanInfoAdd = (row) => {
        const { refresh } = this.props;
        openModal(<CreditInfoAdd refresh={refresh}/>, {
            title:'发起新业务',
            defaultButton: true,
            onOk: (a, b) => {
                b.addSave((errors, values) => {
                    if (!errors) {
                        a.close();
                    }
                });
            }
        });
        refresh: this.tableRefresh
    };

    deleteInvestPlan = () => {
        const selectedRows = this.formList.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: '您确定删除吗？删除后数据不可恢复！',
            onOk: () => {
                this.deletePlan(selectedRows[0].planId);
            },
            onCancel: () => {
                return;
            },
        });
    };

    deletePlan = (planId) => {
        const params = {
            planId: planId,
        };

        rest.post("/investplan/deletePlan",{},{
            data: $.param(params),
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            },
        }).then((data) => {
            this.formList.refresh();
        }).catch((error) => {
            console.error(error);
            Modal.error({
                title: "业务删除",
                content: "业务删除出错"
            });
        });
    };

    openDetail = (row) => {
        const planId = row.planId ? row.planId : null;

        const {flexTabs} = this.props;

        rest.get("/showcase/WKFLCreditControllerDemo/workflowProc/planId/"+planId,{}).then((data) => {
            if(!data) {
                console.error("获取流程实例出错");
                return;
            }
            if(data.latestTasks&&data.latestTasks.length>0){
                var task = data.latestTasks[0];
                if(task.taskDefKey=='sponsor'){
                    // 发起岗位任务-打开处理
                    flexTabs.open(`${task.taskName}`,'Common/Workflow/TaskList/TaskProcessPage',{record: {taskId: task.taskId}, preId: this.props.param.__id });
                    return;
                }
            }
            flexTabs.open(`${data.summary}`,'Common/Workflow/ProcInstResource',{record: data, preId: this.props.param.__id });

        }).catch((error) => {
            console.error(error);
            Modal.error({
                title: "提交申请",
                content: "提交申请出错"
            });
        });
    };


    render() {
        return (
          <DataTable
            dataFormId="demo-WKFLCreditList"
            params={{code: 'BeanPersonList'}}
            dataReady={this.dataReady}
            formReady={this.formReady}
          />
        );
    }
}