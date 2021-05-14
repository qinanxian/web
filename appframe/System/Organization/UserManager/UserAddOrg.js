import React from "react";
import {Message, DataTable, Notify} from '../../../../src/components';
import {post} from '../../../../src/lib/rest';

export default class UserAddOrg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.params ? props.params.userId : null,
        };
    }

    formReady = (voList) => {
        this.voList = voList;
    }

    relateUser = (cb) => {
        const selectedRows = this.voList.getSelectedRows();
        if (selectedRows.length < 1) {
            Notify.error("请先选择机构！", "错误提示");
            cb(false)
        }
        selectedRows[0].userId = this.state.userId;
        post(`/User/addOrg`,selectedRows)
            .then((data) => {
                cb && cb(data);
            });
    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="system-Orgs"
                    formReady={this.formReady}
                    params={{userId: this.state.userId}}
                />
            </div>
        );
    }


}
