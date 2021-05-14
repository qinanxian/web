import React from 'react';

import {
    DataTable,
    Notify,
    Message,
    openModal,
    Modal,
    DetailInfo,
    EmebedButton,
    Icon,
    Row, Col, Slider, DataTablePicker
} from '../../../../src/components';

/**
 * 查看修改详情组件
 */
export class ActionTypeInfo extends React.Component {
    render() {
        const {param} = this.props;
        return (
            <DataTable
                dataFormId="workflow-AuditMonitorActionTypeList"
                        params={{dataAuditId: param.auditActionType}}
                showPagination={false}

            />
        );
    }
}

/*
数据审计监控 组件
 */
export class AuditMonitorInfo extends React.Component {
    render() {
        const {param} = this.props;
        return (
            <Row>
                <Col span={12}>
                    <DataTable
                        dataFormId="workflow-AuditMonitorActionTypeList"
                        params={{dataAuditId: param.auditActionType}}
                        showPagination={false}/>
                </Col>
                <Col span={12}>
                    <DetailInfo
                        dataFormId="workflow-AuditMonitorInfo"
                        params={{dataAuditId: param.auditId}} />
                </Col>
            </Row>
        );
    }
}
/**
 * 请求标识详情组件
 */
export class RequestIdInfo extends React.Component {
    formReady = (formList) => {
        this.formList = formList;

        formList.setColumnTemplate('operation', (text, record, i) => {
            return (<EmebedButton.Group style={{margin:0}}  >
                <a type={"primary"}  onClick={() => this.openAuditInfo(record)}>详情</a>
            </EmebedButton.Group>);
        });

    };
    clickActionType=(record)=>{
        const {flexTabs} = this.props;
        flexTabs.open(`查看明细`,'System/Workflow/AuditMonitor/ActionTypeInfo',{auditActionType:record.dataAuditId});
    };

    openAuditInfo=(record)=>{
        const {flexTabs} = this.props;
        flexTabs.open(`详情`,'System/Workflow/AuditMonitor/AuditMonitorInfo',{auditActionType:record.dataAuditId ,auditId:record.dataAuditId});
    };

    render() {
        const {param} = this.props;


        return (
            <DataTable
                dataFormId="workflow-AuditMonitorRequestIdList"
                params={{requestId: param.auditRequestId}}
                formReady={this.formReady}/>


        );
    }
}

/*
会话标识详情组件
 */
export class SessionIdInfo extends React.Component {
    formReady = (formList) => {
        this.formList = formList;


        formList.setColumnTemplate('operation', (text, record, i) => {
            return (<EmebedButton.Group style={{margin:0}}  >
                <a type={"primary"}  onClick={() => this.openAuditInfo(record)}>详情</a>
            </EmebedButton.Group>);
        });

    };
    clickActionType=(record)=>{
        const {flexTabs} = this.props;
        flexTabs.open(`查看明细`,'System/Workflow/AuditMonitor/ActionTypeInfo',{auditActionType:record.dataAuditId});
    };

    openAuditInfo=(record)=>{
        const {flexTabs} = this.props;
        flexTabs.open(`详情`,'System/Workflow/AuditMonitor/AuditMonitorInfo',{auditActionType:record.dataAuditId ,auditId:record.dataAuditId});
    };
    render() {
        const {param} = this.props;
        return (
            <DataTable
                dataFormId="workflow-AuditMonitorSessionIdList"
                params={{sessionId: param.auditSessionId}}
                formReady={this.formReady}/>
        );
    }
}


export default class AuditMonitor extends React.Component {
    static ActionTypeInfo = ActionTypeInfo;
    static AuditMonitorInfo = AuditMonitorInfo;
    static RequestIdInfo = RequestIdInfo;
    static SessionIdInfo = SessionIdInfo;


    constructor(props) {
        super(props);
    }


    formReady = (formList) => {
        this.formList = formList;

        //让请求标识列变成可打开的文字链接
        formList.setColumnTemplate('requestId', (text, record, i) => {
            return <a onClick={() => this.clickRequestId(text, record, i)}>{text}</a>
        });


        //让会话标识列变成可打开的文字链接
        formList.setColumnTemplate('sessionId', (text, record, i) => {
            return <a onClick={() => this.clickSessionId(text, record, i)}>{text}</a>
        });

        formList.setColumnTemplate('operation', (text, record, i) => {
            return (<EmebedButton.Group style={{margin:0}}  >
                <a type={"primary"}  onClick={() => this.openAuditInfo(record)}>详情</a>
            </EmebedButton.Group>);
        });


    };

    dataReady=(dataList)=>{

}

    // clickActionType=(record)=>{
    //
    //     // const selectedRow = this.formList.getSelectedRow();
    //     // console.log(selectedRow);
    //     const {flexTabs} = this.props;
    //     flexTabs.open(`查看明细`,'System/Workflow/AuditMonitor/ActionTypeInfo',{auditActionType:record.dataAuditId});
    // };

    openAuditInfo=(record)=>{
        // const selectedRow = this.formList.getSelectedRow();
        const {flexTabs} = this.props;
        flexTabs.open(`详情`,'System/Workflow/AuditMonitor/AuditMonitorInfo',{auditActionType:record.dataAuditId ,auditId:record.dataAuditId});
    };



    clickRequestId = (text, record, i) => {
        const {flexTabs} = this.props;

        flexTabs.open(`${record.requestId}的详情`,'System/Workflow/AuditMonitor/RequestIdInfo',{auditRequestId:record.requestId});
    };

    clickSessionId = (text, record, i) => {
        const {flexTabs} = this.props;
        flexTabs.open(`${record.sessionId}的详情`,'System/Workflow/AuditMonitor/SessionIdInfo',{auditSessionId:record.sessionId});
    };


    render() {
        return (
            <DataTable
                dataFormId="workflow-AuditMonitorList"
                formReady={this.formReady}
                dataReady={this.dataReady}
            />
        );
    }

}
