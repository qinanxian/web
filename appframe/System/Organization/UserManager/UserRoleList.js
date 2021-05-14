import React from 'react';
import {Row, Col, DataTable, Message, openModal, Modal} from '../../../../src/components';
import UnRelatedRoleList from './UnRelatedRoleList';

export default class UserRoleList extends React.Component {
    constructor(props) {
        super();
        this.userId = props.userId;
    }

    formReady = (volist) => {
        this.volist = volist;
        this.volist.addButton([{
            name: '关联角色',
            onClick: this.showRelateRoleModal
        }, {
            name: '删除角色',
            onClick: this.deleteRole
        }]);
    };

    showRelateRoleModal = () => {
        const that = this;
        openModal(<UnRelatedRoleList/>, {
            title: '关联角色',
            ...that.props,
            userId: that.userId,
            defaultButton: true,
            refresh: that.tableRefresh,
            onOk(a, b) {
                b.relateRole(null, () => {
                    a.close();
                });
            },
            onCancel(a, b) {
            }
        });
    };

    deleteRole = () => {
        const that = this;
        const selectedRows = that.volist.getSelectedRows();
        if (selectedRows.length < 1) {
            Message.info('请先选择一行！');
            return;
        }

        Modal.confirm({
            title: '删除确认',
            content: `您确定删除角色[${selectedRows[0].name}]吗？删除后数据不可恢复！`,
            onOk() {
                const roleId = that.volist.getSelectedRows()[0].id;
                const {rest} = that.props;
                const url = `/auth/admin/user/deleteRole/${that.userId}/${roleId}`;
                rest.post(url).then(() => {
                    that.tableRefresh();
                    Message.info('删除成功！');
                });
            },
            onCancel() {
                return;
            },
        });
    };

    tableRefresh = () => {
        this.volist.refresh();
    };

    render() {
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <DataTable
                            dataFormId="system-SimpleRoleListForUserManage"
                            params={{userId: this.userId}}
                            formReady={this.formReady}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

