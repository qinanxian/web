import React from 'react';
import {Tree, Row, Col, DataTable, Modal, Message, openModal, Button} from '../../../../src/components';
import RoleTab from './RoleTab';
import RoleInfo from './RoleInfo';

export default class RoleManager extends React.Component {

    static RoleTab = RoleTab;
    static RoleInfo = RoleInfo;

    constructor() {
        super();
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '新增',
            onClick: this.openRoleInfo
        }, {
            name: '删除',
            onClick: this.deleteRole
        }]);
    };

    dataReady = (voList) => {
        this.voList.setColumnTemplate('name', (text, record, i) => {
            return (<a onClick={() => this.clickName(record)}>{text}</a>);
        });
    };

    clickName = (row) => {
        const curId = row.id ? row.id : null;
        const curName = row.name ? row.name : '角色';
        const {flexTabs} = this.props;
        flexTabs.open(`${curName}-详细信息`, 'System/Organization/RoleManager/RoleTab', {
            roleId: curId,
            roleCode: row.code || null,
            openLoading: this.props.openLoading,
            closeLoading: this.props.closeLoading
        });
    };

    openRoleInfo = (row) => {
        const that = this;
        openModal(<RoleInfo/>, {
            title:'新增角色',
            defaultButton: true,
            width:'35%',
            refresh: this.tableRefresh,
            onOk(a, b) {
                b.roleInfoSave(null, (err, value) => {
                    if (!err) {
                        a.close();
                    }
                });
            },
            onCancel(a, b) {
            }
        });
    };

    deleteRole = () => {
        const that = this;
        const selectedRows = that.voList.getSelectedRows();
        if (selectedRows.length < 1) {
            Message.info('请先选择一行！');
            return;
        }

        Modal.confirm({
            title: '删除确认',
            content: '您确定删除吗？删除后数据不可恢复！',
            onOk() {
                that.voList.deleteRows(selectedRows);
            },
            onCancel() {
                return;
            },
        });
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    render() {
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <DataTable
                            dataFormId="system-RoleList"
                            formReady={this.formReady}
                            dataReady={this.dataReady}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

