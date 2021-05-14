import React from 'react';
import {Row, Col, DataTable, Message, openModal, Modal} from '../../../../src/components';
import UserList from './UserList';
import {get,post} from '../../../../src/lib/rest';

export default class RoleToRoleList extends React.Component {

    static UserList = UserList;

    constructor(props) {
        super();
        this.roleId = props.roleId;
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '关联用户',
            type:'primary',
            onClick: this.openUserList
        },{
            name: '解除用户关联',
            type:'primary',
            selectBind: true,
            onClick: this.deleteUser
        }]);
    };

    dataReady = (voList) => {
        this.voList= voList;
    };

    openUserList = (row) => {
        const that = this;
        openModal(<UserList />, {
            title:'角色下关联用户',
            ...that.props,
            defaultButton: true,
            roleId: this.roleId,
            refresh: this.tableRefresh,
            onOk(a, b) {
                b.relateUser(null, () => {
                    a.close();
                });
            },
            onCancel(a, b) {
            }
        });
    };

    deleteUser = () => {
        const that = this;
        const selectedRows = that.voList.getSelectedRows();
        if (selectedRows.length < 1) {
            Message.info('请先选择一行！');
            return;
        }

        Modal.confirm({
            title: '解除用户确认',
            content: `您确定解除用户[${selectedRows[0].name}]吗？解除后数据不可恢复！`,
            onOk() {
                const userId = that.voList.getSelectedRows()[0].id;
                const {rest} = that.props;
                const url = `/auth/admin/user/deleteRole/${userId}/${that.roleId}`;
                post(url).then(() => {
                    that.tableRefresh();
                    Message.info('解除成功！');
                });
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
                            dataFormId="system-UserListForRoleManage"
                            params={{roleId: this.roleId}}
                            formReady={this.formReady}
                            dataReady={this.dataReady}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

