import React from 'react'

import { DataTable} from '../../../src/components';

import {getUser} from '../../../src/lib/cache';


export default class AttentionList extends React.Component {


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
        this.voList.exportExcel(isAll, `关注用户.xlsx`);
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    render(){
        return (
            <div>
                <DataTable
                    dataFormId="codetodo-AttentionList"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                    params = {{userOrg : this.userOrg}}
                    labelWidth={158}
                />
            </div>
        );
    }

}