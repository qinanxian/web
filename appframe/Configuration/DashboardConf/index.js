import React from 'react';

import {DataTable, Row, Col, openModal, Modal, Message} from '../../../src/components';
import HomeBlockPickList from './HomeBlockPickList';

export default class LandmarkList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRoleId: '0000',
            dashboardRoleDisplayType: 'none'
        };
    }

    dashboardRoleFormReady = (voList) => {
        this.dashboardRoleVoList = voList;
        this.dashboardRoleVoList.setColumnTemplate('action',this.appendActionHref);
        this.dashboardRoleVoList.addButton([{
            name: '关联',
            onClick: this.addNewRelativetoRole
        }]);
    };

    dataReady = (dvolit) => {
        this.pickedKey = [];
        let rows = dvolit.getData();
        rows && rows.forEach(row => {
            this.pickedKey.push(row.boardKey);
        });
    };

    appendActionHref =(text, record, i)=>{
        return <a href="javascript:void(0)" onClick={() => this.deleteListRow(record)}>删除</a>;
    };

    deleteListRow = (record) =>{
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除[${record.boardName}]吗？删除后数据不可恢复！`,
            onOk: () => {
                this.dashboardRoleVoList.deleteRows([record]);
            },
            onCancel: () => {
                return;
            },
        });


       /* if(record){
            rest.post(`/conf/dashboard/${record.id}`).then((res)=>{
                if(res && res > 0){
                    Message.success('删除成功!');
                    this.dataTable.refresh();
                }else{
                    Message.error('删除失败!');
                }
            });
        }*/
    }

    roleFormReady = (voList) => {
        this.roleVoList = voList;
    };

    addNewRelativetoRole = ()=>{
        console.log(this.pickedKey);
        openModal(<HomeBlockPickList  roleId = {this.state.selectedRoleId} pickedKey={this.pickedKey}/>, {
            title: "新增关联组件",
            defaultButton: true,
            onOk:(modal, compnent,but) => {
                compnent.infoSave((err, value) => {
                    if (!err) {
                        modal.close();
                        this.tableRefresh && this.tableRefresh();
                    } else {
                        but.setDisabled(false)
                    }
                });
            },
            onCancel(a, b) {
            }
        });
    };

    rowSelected = (k, row) => {
        this.setState({selectedRoleId: row[0] && row[0].id, dashboardRoleDisplayType:''});
    };

    tableRefresh = () => {
        this.dashboardRoleVoList.refresh();
    };

    render() {
        return (
            <div>
                <Col span={12}>
                    <Row>
                        <DataTable
                            dataFormId="system-RoleListForDashboard"
                            formReady={this.roleFormReady}
                            onSelectRow={this.rowSelected}
                        />
                    </Row>
                </Col>

                <Col span={12}>
                    <Row>
                        <div style={{display: this.state.dashboardRoleDisplayType}}>
                            <DataTable
                                dataFormId="configuration-DashboardRoleList"
                                formReady={this.dashboardRoleFormReady}
                                params={{roleId: this.state.selectedRoleId}}
                                showPagination={false}
                                pageSize={999}
                                dataReady={this.dataReady}
                            />
                        </div>
                    </Row>
                </Col>
            </div>
        );
    }
}



