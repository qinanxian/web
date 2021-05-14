import React from "react";

import {DataTable, Message,Notify,Modal} from '../../../src/components';

export default class HoldAllowSelectUserList extends React.Component {
    constructor(props) {
        super(props);
        this.custId = props.param ? props.param.custId : props.custId,
        this.refresh = props.param ? props.param.refresh : props.refresh,
        this.isAdmin = props.param ? props.param.isAdmin : props.isAdmin
    }


    formReady = (volist) => {
        this.volist = volist;
    };

    saveInfo = (cb) => {
        let err;
        const selectedRows = this.volist.getAllSelectedRows();
        let paramData = selectedRows.length > 0 && selectedRows[0];
        paramData.custId = this.custId;
        paramData.isAdmin = this.isAdmin || "N";
        Modal.confirm({
            title: '移交主办权确认',
            content: '您确定移交客户主办权吗？移交后您本身不再对该客户有权限！',
            onOk: () => {
                this.volist.invoke('turnOver', paramData)
                    .then((data) => {
                        Notify.success({
                            message: `移交主办权成功`,
                        });
                        this.refresh && this.refresh();
                        cb && cb(err);
                    })
                    .catch((error) => {
                        Notify.error({
                            message: `移交主办权失败`,
                        });
                        cb && cb(error);
                    });
            },
            onCancel: () => {
                return;
            },
        });


    };

    render() {
        return (
            <div>
                <DataTable
                    dataFormId="customer-HoldAllowSelectUserList"
                    formReady={this.formReady}
                />
            </div>
        );
    }
}