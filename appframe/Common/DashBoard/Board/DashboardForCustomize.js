import React from "react";

import {DataTable, Message} from '../../../../src/components/index';
import {getUser} from '../../../../src/lib/cache';


export default class DashboardForCustomize extends React.Component {


    constructor(props) {
        super(props);
    }

    formReady = (voList) => {
        this.voList = voList;
    };

    dataReady = () => {
        let allData = this.voList.getData();
        const codeArr = this.props.data.map((item) => item.code);
        const result = allData.filter(value => codeArr.indexOf(value.code) != -1);
        this.voList.setSelectedRows(result);
    };

    customize = (cb) => {
        let rows = this.voList.getSelectedRows();
        let err = "error";
        if (!rows || rows.length == 0) {
            Message.info("请选择工作台组件");
            cb && cb(err);
            return;
        }
        const userId = getUser().id;
        const codeArr = rows.map((item) => item.code);
        this.props.rest.post(`/common/dashboard/${userId}`, {value: codeArr.toString(), ObjectType: 'DASHBOARD'})
            .then(res => {
                cb && cb();
            }).catch((error) => {
            cb && cb(error);
        });

    };


    render() {
        return (
            <div>
                <DataTable
                    dataFormId="system-DashboardForCustomize"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                    selectionType='multiple'
                    pageSize={10}
                    majorKey="code"
                />
            </div>
        );
    }
}