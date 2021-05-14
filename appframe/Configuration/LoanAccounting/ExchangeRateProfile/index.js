import React from "react";
import {DataTable} from '../../../../src/components';
export default class ExchangeRateProfile extends React.Component {
    constructor(props) {
        super(props);
    }
    /**
     * 表格源数据（表头信息）加载完成后，调用
     * @param volist
     */
    formReady = (volist) => {
        this.volist = volist;
    };
    render() {
        return (
            <DataTable
                dataFormId="configuration-ExchangeRateList"
                params={{k: 'v'}}
                formReady={this.formReady}
            />
        );
    }
}