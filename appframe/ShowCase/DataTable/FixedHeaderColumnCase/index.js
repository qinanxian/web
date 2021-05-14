import React from "react";

import {DataTable, Notify, Message, DetailInf,LinkButton} from '../../../../src/components';

export default class FixedHeaderColumnCase extends React.Component {

    /**
     * 表格源数据（表头信息）加载完成后，调用
     * @param voList
     */
    dataReady = (voList) => {
        this.voList = voList;
    };

    /**
     * 表格数据加载完成后，调用
     * @param dataList
     */
    formReady = (voList) => {
        this.voList = voList;
        // this.voList.setHeaderFixed(true);
        // 1.需要制定scroll={{ x: 1500 }}
        // 2.需要给固定的列设置列宽 【在显示模板设置】
        this.voList.setColFixed(['id','code'], 'left');
        // this.voList.setColFixed(['oper'], 'right');
        this.voList.setColumnTemplate('id', (text, record, i) => {
            return <LinkButton>{text}</LinkButton>
        });
        this.voList.setColumnTemplate('oper', (text, record, i) => {
            return <LinkButton>查看</LinkButton>
        });
    };

    render() {
        return (
          <DataTable
            majorKey="code"
            dataFormId="demo-BeanPersonFixedHeaderColumnList"
            params={{code: 'BeanPersonList'}}
            dataReady={this.dataReady}
            formReady={this.formReady}
            nowrap={false}
            scroll={{y: 440,x:1900 }}
            pageSize={100}
          />
        );
    }
}
