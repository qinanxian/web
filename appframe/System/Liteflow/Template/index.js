import React from "react";

import {DataTable, Modal, openModal, Collapse} from '../../../../src/components';
import TemplateInfo from './TemplateInfo'
const Panel = Collapse.Panel;

/**
 * 简式流程预设模板配置
 * @Auther 左晓敏<xmzuoi@amarsoft.com>
 * @Date 2018-03-30
 */
export default class LiteflowTemplateList extends React.Component {
    static TemplateInfo =TemplateInfo;

    constructor(props) {
        super(props);
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '新增',
            onClick: this.openTemplateDetail
        },{
            selectBind:true,
            name:'编辑',
            onClick:this.editTemplateInfo
        }, {
            selectBind: true,
            name: '删除',
            onClick: this.deleteTemplate
        }]);
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    openTemplateDetail = () => {
        this.openInfoModal('新增审批链', 'add');
    };

    editTemplateInfo = () => {
        this.openInfoModal('编辑审批链','edit');
    };

    deleteTemplate = () => {
        const selectedRows = this.voList.getSelectedRows();
        const templateName = selectedRows[0].name;
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除[${templateName}]吗？删除后数据不可恢复！`,
            onOk: () => {
                this.voList.deleteRows(selectedRows);
            },
            onCancel: () => {
                return;
            },
        });
    };


    openInfoModal = (title, operation) => {
        const selectedRows = this.voList.getSelectedRows();
        const templateId = selectedRows[0] && selectedRows[0].templateId;
        const defExplicit = selectedRows[0] && selectedRows[0].defExplicit;
        openModal(<TemplateInfo templateId ={templateId} defExplicit ={defExplicit}/>, {
            title: title,
            defaultButton: true,
            width:'35%',
            operation: operation,
            templateId: 'edit' === operation ? templateId : null,
            refresh: this.tableRefresh,
            onOk: (modal, component,but) => {
                component.templateInfoSave((err, value) => {
                    if (!err) {
                        modal.close();
                    }else {
                        but.setDisabled(false)
                    }
                });
            },
            onCancel: (modal, component) => {
            }
        });
    };


    render() {
        return (
           <div style={{ margin: '10px 10px 0 10px' }}>
               <Collapse defaultActiveKey={['1']}>
                   <Panel header="简式流程审批表单" key="1" showArrow={false}>
                        <DataTable
                            dataFormId="workflow-LiteflowTemplateList"
                            formReady={this.formReady}
                            onSelectRow={this.props.getSelected}
                        />
                   </Panel>
               </Collapse>
            </div>
        );
    }
}