import React from 'react';
import {Row, Col, DataTable, Message, openModal, Notify, Modal} from '../../../../src/components';
import {get,post} from '../../../../src/lib/rest';

export default class UserList extends React.Component {
    constructor(props) {
        super();
        this.roleId = props.roleId;
    }

    formReady = (voList) => {
        this.voList = voList;
    };

    dataReady = (voList) => {
        this.voList= voList;
    };

    relateUser = (e, cb) => {
        const that = this;
        const selectedRows = that.voList.getSelectedRows();
        if (selectedRows.length < 1) {
            Message.info('请先选择一行！');
            return;
        }

        const userIds = selectedRows.map((row) => row.id);
        const {refresh} = that.props;
        const url = `/auth/admin/user/relateUsers/${that.roleId}`;
        post(url, userIds).then(() => {
            refresh && refresh();
            Message.info('关联成功！');
        });
        cb && cb();
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="system-UserListForRole"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                    params={{roleId: this.roleId}}
                    selectionType='multiple'
                    pageSize={10}
                />
            </div>
        );
    }
}

