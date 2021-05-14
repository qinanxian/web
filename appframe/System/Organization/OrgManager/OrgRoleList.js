import React from 'react';
import {Row, Col, DataTable, Message, openModal, Modal, Notify} from '../../../../src/components';
import UnRelatedUserList from './UnRelatedUserList';

export default class OrgRoleList extends React.Component {
    constructor(props) {
        super();
        this.orgId = props.orgId;
    }

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '关联用户',
            type: 'primary',
            onClick: this.showRelateUserModal
        },
        // {
        //     name: '解除关联',
        //     type: 'primary',
        //     selectBind: true,
        //     onClick: this.deleteOrgUser
        // }
        ]);
    };

    showRelateUserModal = () => {
        const that = this;
        openModal(<UnRelatedUserList/>, {
            title: '关联用户',
            ...that.props,
            orgId: that.orgId,
            defaultButton: true,
            refresh: that.tableRefresh,
            onOk(a, b) {
                b.relateUser(null, () => {
                    a.close();
                });
            },
            onCancel(a, b) {
            }
        });
    };

    deleteOrgUser = () => {
        const that = this;
        const selectedRows = that.voList.getSelectedRows();
        if (selectedRows.length < 1) {
            Notify.info('请先选择一行！');
            return;
        }

        Modal.confirm({
            title: '解除确认',
            content: `您确定解除[${selectedRows[0].name}]用户关联吗？解除后数据不可恢复！`,
            onOk() {
                const userId = that.voList.getSelectedRows()[0].id;
                const {rest} = that.props;
                const url = `/auth/admin/org/deleteUser/${that.orgId}/${userId}`;
                rest.post(url).then(() => {
                    that.tableRefresh();
                    Notify.info('解除成功！');
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
                            dataFormId="system-SimpleUserListForOrgManage"
                            params={{orgId: this.orgId}}
                            formReady={this.formReady}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

