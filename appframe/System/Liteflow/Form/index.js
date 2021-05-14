import React from 'react';

import {DataTable, Row, Col, Collapse, Message} from '../../../../src/components';
const Panel = Collapse.Panel;

/**
 * 简式流程审批表单配置
 * @Auther 左晓敏<xmzuoi@amarsoft.com>
 * @Date 2018-03-30
 */
export default class LiteflowForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            procDefKey: null,
        };
    }

    formReady = (voList) =>{
        this.voList = voList;
        //添加按钮
        voList.addButton([
            {name: '添加', type: 'primary',icon:'fa-pencil-square-o', onClick: () => this.addRows()},
            {name: '保存所有', icon: 'save', onClick: () => this.savePage()},
            {name: '保存选中', icon: 'save', onClick: () => this.saveSelectedRows(), selectBind: true},
            {name: '删除选中', icon: 'delete', onClick: () => this.deleteSelectedRows(), selectBind: true},
        ]);
    };

    dataReady = (voList) =>{
        this.voList = voList;
        voList.setSelectedRows([0]);
    };

    selectOneForm = (key, rows) =>{
        if (rows[0]) {
            this.setState({
                procDefKey: rows[0].procDefKey,
            });
        }
    }

    addRows = () => {
        this.voList.addRow({});
    };

    savePage = () => {
        this.voList.saveData()
            .then(()=>{
                Message.success('表单列表保存成功');
            });
    };
    saveSelectedRows = () => {
        const dataList = this.voList.getSelectedRows();
        this.voList.saveData(dataList)
            .then(()=>{
                Message.success('表单列表保存成功');
            });
    };
    deleteSelectedRows = () => {
        const dataList = this.voList.getSelectedRows();
        this.voList.deleteRows(dataList);
    };


    //---------------------------------------------------------资源列表Start--------------------------------------------------//
    resFormReady = (voList) =>{
        this.resVoList = voList;
        //添加按钮
        voList.addButton([
            {name: '添加', type: 'primary',icon:'fa-pencil-square-o', onClick: () => this.resAddRows()},
            {name: '保存所有', icon: 'save', onClick: () => this.resSavePage()},
            {name: '保存选中', icon: 'save', onClick: () => this.resSaveSelectedRows(), selectBind: true},
            {name: '删除选中', icon: 'delete', onClick: () => this.resDeleteSelectedRows(), selectBind: true},
        ]);
    };

    resDataReady = (voList) =>{
        this.resVoList = voList;
    };

    resAddRows = () => {
        this.resVoList.addRow({});
    };

    resSavePage = () => {
        this.resVoList.saveData()
            .then(()=>{
                Message.success('资源列表保存成功');
            });
    };
    resSaveSelectedRows = () => {
        const dataList = this.resVoList.getSelectedRows();
        this.resVoList.saveData(dataList)
            .then(()=>{
                Message.success('资源列表保存成功');
            });
    };
    resDeleteSelectedRows = () => {
        const dataList = this.resVoList.getSelectedRows();
        this.resVoList.deleteRows(dataList);
    };

        //---------------------------------------------------------资源列表End--------------------------------------------------//

    render() {
        return (
            <div style={{ margin: '10px 10px 0 10px' }}>
                <Collapse defaultActiveKey={['1']}>
                    <Panel header="简式流程审批表单" key="1" showArrow={false}>
                        <Row >
                            <Col span={16}>
                                <DataTable
                                    dataFormId="workflow-LiteflowFormList"
                                    dataReady={this.dataReady}
                                    formReady={this.formReady}
                                    onSelectRow={this.selectOneForm}
                                    editMode={true}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <DataTable
                                    dataFormId="workflow-LiteflowResourceList"
                                    params={{
                                        procDefKey: this.state.procDefKey,
                                    }}
                                    dataReady={this.resDataReady}
                                    formReady={this.resFormReady}
                                    editMode={true}
                                />
                            </Col>
                        </Row>
                    </Panel>
                </Collapse>




            </div>
        );
    }
}