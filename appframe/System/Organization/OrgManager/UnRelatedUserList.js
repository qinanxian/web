import React from 'react';
import {Row, Col, DataTable, Message, openModal, Notify} from '../../../../src/components';

export default class UnRelatedUserList extends React.Component {
    constructor(props) {
        super();
        this.orgId = props.orgId;
    }

    formReady = (voList) => {
        this.voList = voList;
    };

    relateUser = (e, cb) => {
        const selectedRows = this.voList.getSelectedRows();
        if (selectedRows.length < 1) {
            Notify.info('请先选择一行！');
            return;
        }

        const userIds = selectedRows.map((row) => row.id);
        const {rest, refresh} = this.props;
        const url = `/auth/admin/org/relateUsers/${this.orgId}`;
        rest.post(url, userIds).then(() => {
            refresh && refresh();
            Notify.info('关联成功！');
        });
        cb && cb();
    };

    render() {
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <DataTable
                            dataFormId="system-UnrelatedUserListForOrgManage"
                            selectionType="multiple"
                            params={{orgId: this.orgId}}
                            formReady={this.formReady}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

