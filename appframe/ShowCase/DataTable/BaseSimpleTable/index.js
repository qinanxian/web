import React from "react";

import {DataTable, Notify, Message, DetailInfo} from '../../../../src/components';

/**
 * 个人信息详情组件
 */
export class PersonInfo extends React.Component {
    render() {
        const {param} = this.props;
        return (
            <DetailInfo dataFormId="demo-PersonTwoColInfo" params={{id: param.personId}} />
        );
    }
}

export default class BaseSimpleTable extends React.Component {
    static PersonInfo = PersonInfo;

    /**
     * 表格源数据（表头信息）加载完成后，调用
     * @param formList
     */
    dataReady = (formList) => {
        this.formList = formList;

        //让名称列变成可打开的文字链接
        formList.setColumnTemplate('name', (text, record, i) => {
            return <a onClick={() => this.clickName(text, record, i)}>{text}</a>
        });
        formList.setColumnTemplate('code', (text, record, i) => {
            return <a onClick={() => this.clickName(text, record, i)}>{text}</a>
        });
        //添加按钮
        formList.addButton([
            {name: '获取列表所有数据', onClick: () => this.getAllData(formList)},
            {name: '获取选中行', onClick: () => this.getSelectedRow(formList)}
        ]);
    };

    getAllData = (formList) =>{
        const rows = formList.getData();
        Notify.info(JSON.stringify(rows))
    };

    getSelectedRow = (formList) =>{
        const rows = formList.getSelectedRow();
        Notify.info(JSON.stringify(rows))
    };
    /**
     * 表格数据加载完成后，调用
     * @param dataList
     */
    formReady = (dataList) => {
        // console.log(dataList);
        // console.log(dataList.getData());
        dataList.setCellEdit('0013','name');
        dataList.setCellReadOnly('0016',['name']);
        dataList.setCellEdit('0016',['gender','name']);
    };

    clickName = (text, record, i) => {
        const {flexTabs} = this.props;
        flexTabs.open(`${record.name}的详情`,'ShowCase/DataTable/BaseSimpleTable/PersonInfo',
            {
                personId:record.id,
                testData:'name=向日葵%谢荣康'
            });
    };

    onSelectRow  = (__key, rows) => {
        let row = rows[0];
        row && Message.info(row.name);

        console.log('filter:',this.formList.getFilter());
    };

    render() {
        return (
          <DataTable
            majorKey="code"
            sortName="test"
            dataFormId="demo-BeanPersonList"
            params={{code: 'BeanPersonList'}}
            dataReady={this.dataReady}
            formReady={this.formReady}
            onSelectRow={(k, rows) => this.onSelectRow(k, rows) }
          />
        );
    }
}
