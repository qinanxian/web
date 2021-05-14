import React from 'react';

import {DataTable, Modal, Notify, propsCompose, rest, Message, openModal} from '../../../../src/components';
import ResourceInfo from "./ResourceInfo"
import {refresh} from "../../../Common/Workflow/TaskProcess/TaskResolve";

@propsCompose
export default class ResourceList extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            procDefKey: null,
            resourceId: null,
        };
    }

    dataReady = (resourceVoList) => {
        const {activeTab, procDefKey} = this.props;
        if (activeTab === 'resourceList' && resourceVoList.getData() && !resourceVoList.getData().length && procDefKey) {
            Modal.confirm({
                title: '资源初始化',
                content: '该流程下没有基础资源，是否进行资源初始化？',
                onOk: () => {
                    rest.post(`/workflow/resource/initResource/${procDefKey}`)
                        .then((res) => {
                            Message.info("初始化资源成功");
                            this.resourceListRefresh();
                        });
                },
                onCancel: () =>  {
                    Notify.info('初始资源未加载,请在数据库中手动配置数据', '取消成功');
                },
            })
        }
    };


    selectOneRow = (key, rows) => {
        if (rows[0]) {
            this.setState({
                procDefKey: rows[0].procDefKey,
                resourceId: rows[0].resourceId,
            });
        }
    };

    resourceFormReady = (resourceVoList) => {
        this.resourceVoList = resourceVoList;
        this.resourceVoList.addButton([{
            type: 'primary',
            name: '新增',
            onClick: this.addResource
        }, {
            type: 'primary',
            name: '详情',
            selectBind: true,
            onClick: this.updateResource
        }, {
            type: 'primary',
            name: '删除',
            selectBind: true,
            onClick: this.deleteResource
        }]);
    };

    resourceListRefresh = () => {
        this.resourceVoList && this.resourceVoList.refresh();
    };

    addResource = () => {
        openModal(<ResourceInfo/>, {
            title: "资源信息新增",
            defaultButton: true,
            onOk: (modal, component) => {
                component.saveInfo((err, value) => {
                    if (!err) {
                        modal.close();
                    }
                });
            },
            resourceListRefresh: this.resourceListRefresh,
            procDefKey: this.props.procDefKey,
        });
    };

    updateResource = () => {
        const selectRow = this.resourceVoList.getSelectedRow();
        openModal(<ResourceInfo/>, {
            title: "资源信息详情",
            defaultButton: true,
            onOk: (modal, compnent) => {
                compnent.saveInfo((err, value) => {
                    if (!err) {
                        modal.close();
                    }
                });
            },
            resourceListRefresh: this.resourceListRefresh,
            procDefKey: this.props.procDefKey,
            resourceId: selectRow && selectRow.resourceId
        });
    };

    deleteResource = () => {
        const selectedRows = this.resourceVoList.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除吗？删除后数据不可恢复！`,
            onOk: () => {
                this.resourceVoList.deleteRows(selectedRows);
            }
        });
    };

    render() {
        return (
            <DataTable dataFormId="workflow-WorkflowResourceList"
                       dataReady={this.dataReady}
                       formReady={this.resourceFormReady}
                       onSelectRow={this.selectOneRow}
                       params={{procDefKey: this.props.procDefKey}}
            />
        );
    }
}