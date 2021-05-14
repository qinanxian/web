import React from 'react';
import {Row, Col, DataTable, Message, openModal} from '../../../../src/components';
import RoleList from '../RoleManager';

export default class UnRelatedRoleList extends React.Component {
    constructor(props) {
        super();
        this.userId = props.userId;
    }

    formReady = (voList) => {
        this.voList = voList;
    };

    relateRole = (e, cb) => {
        const that = this;
        const selectedRows = that.voList.getSelectedRows();
        if (selectedRows.length < 1) {
            Message.info('请先选择一行！');
            return;
        }

        const roleIds = selectedRows.map((row) => row.id);
        const {rest, refresh} = this.props;
        const url = `/auth/admin/user/relateRoles/${that.userId}`;
        rest.post(url, roleIds).then(() => {
            refresh && refresh();
            Message.info('关联成功！');
        });
        cb && cb();
    };

    render() {
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <DataTable
                            dataFormId="system-UnrelatedRoleListForUserManage"
                            selectionType="multiple"
                            params={{userId: this.userId}}
                            formReady={this.formReady}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

