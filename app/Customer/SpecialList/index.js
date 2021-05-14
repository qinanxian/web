/**
 * 特殊名单
 * 左晓敏 <xmzuo@amarsoft.com>
 * 2018-05-15
 */
import React from 'react';

import {Collapse, Col, Tabs, DataTable, Button, Message} from '../../../src/components';

const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane;

export default class SpecialList extends React.Component {

    initFunc = (volist,specType) => {
        volist.addButton([{
            name: '新增',
            icon: 'fa-plus',
            onClick: () => {
                volist.addRow({'specType': specType});
            }
        }, {
            name: '编辑',
            icon: 'fa-edit',
            selectBind: true,
            onClick: () => {
                this.enableEditable(volist);
            }
        }, {
            name: '保存',
            icon: 'fa-save',
            type: 'success',
            selectBind: true,
            onClick: () => {
                volist.saveData()
                    .then(() => {
                        volist.refresh();
                    }).then(() => {
                    Message.success('保存成功');
                });
            }
        }]);
    }

    formReady1 = (volist) => {
        this.initFunc(volist,'RiskMonitorBlackList');
    }
    formReady2 = (volist) => {
        this.initFunc(volist,'BankRelated');
    }
    formReady3 = (volist) => {
        this.initFunc(volist,'BankStockHolder');
    }
    formReady4 = (volist) => {
        this.initFunc(volist,'KeyMinorEnterprise');
    }

    enableEditable = (volist) => {
        const rows = volist.getSelectedRows();
        volist.setRowsEditMode(rows);
    };


    render() {
        return (
            <div>
                <Col span={24}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="风险监控名单" key="1">
                            <DataTable
                                dataFormId="customer-SpecialList"
                                formReady={this.formReady1}
                                params={{specTye: 'RiskMonitorBlackList'}}
                                editMode={false}
                                selectionType="multiple"
                            />
                        </TabPane>
                        <TabPane tab="银行关联方" key="2">
                            <DataTable
                                dataFormId="customer-SpecialList"
                                formReady={this.formReady2}
                                params={{specTye: 'BankRelated'}}
                                editMode={false}
                                selectionType="multiple"
                            />
                        </TabPane>
                        <TabPane tab="银行股东" key="3">
                            <DataTable
                                dataFormId="customer-SpecialList"
                                formReady={this.formReady3}
                                params={{specTye: 'BankStockHolder'}}
                                editMode={false}
                                selectionType="multiple"
                            />
                        </TabPane>
                        <TabPane tab="重点中小企业" key="4">
                            <DataTable
                                dataFormId="customer-SpecialList"
                                formReady={this.formReady4}
                                params={{specTye: 'KeyMinorEnterprise'}}
                                editMode={false}
                                selectionType="multiple"
                            />
                        </TabPane>
                    </Tabs>
                </Col>
            </div>
        );
    }
}
