import React from 'react'
import { DataTable} from '../../../src/components';
import {getUser} from '../../../src/lib/cache';

export default class CheckAllList extends React.Component {

    constructor(props){
        super(props);
        this.state = {};
        this.userOrg = getUser().orgId;
    }
    componentDidMount = () => {

    }
    dataReady = (voList) => {
        this.voList = voList;
    };

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([
        {
            name: '导出EXCEL',
            type: 'default',
            onClick: () => this.exportExcel(true)
        }
        ]);

    };

    exportExcel = (isAll) => {
        this.voList.exportExcel(isAll, `保险公司-网点-保险产品关系数据.xlsx`);
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    render(){
        return (
            <div>
                <DataTable
                    dataFormId="insure-CheckAllList"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                    labelWidth={158}
                />
            </div>
        );
    }
}