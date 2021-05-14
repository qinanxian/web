import React from "react";
import {Rate} from 'antd';
import {DataTable, Notify, Message, DetailInfo, Icon, CellRef} from '../../../../src/components';
import "./index.less"

/**
 * 个人信息详情组件
 */
export default class DataListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {viewModel: 'ListView'};//DataGrid,ListView
        this.headerRender = (meta, dict) => {
            return (
                <tr>
                    <th><CellRef name="id"/></th>
                    <th>
                        <div><CellRef name="code"/></div>
                        <div><CellRef name="name"/></div>
                        <div><CellRef name="engName"/></div>
                    </th>
                    <th>
                        <div><CellRef name="gender"/></div>
                        <div><CellRef name="birth"/></div>
                        <div><CellRef name="domicilePlaceCity"/></div>
                    </th>
                    <th>
                        <div><CellRef name="height"/></div>
                        <div><CellRef name="weight"/></div>
                    </th>
                    <th>体重参考</th>
                    <th><CellRef name="companyIndustry"/></th>
                    <th>
                        <div><CellRef name="monthIncome"/></div>
                        <div><CellRef name="familyYearIncome"/></div>
                    </th>
                    <th>
                        <div><CellRef name="familyMonthIncome"/></div>
                        <div><CellRef name="familyMonthCost"/></div>
                    </th>
                    <th>等级</th>
                    <th><CellRef name="remark"/></th>
                    <th>
                        <div><CellRef name="createdByVirName"/></div>
                        <div><CellRef name="createdTime"/></div>
                    </th>
                    <th>
                        <div><CellRef name="updatedByVirName"/></div>
                        <div><CellRef name="updatedTime"/></div>
                    </th>
                    <th>操作</th>
                </tr>
            );
        };
        this.bodyRowRender = (row, index) => {
            const operateCell = (row, index) => {
                if (row.height >= 170) {
                    return <a onClick={() => this.clickName('', row, index)}>查看</a>
                } else {
                    return '';
                }
            };
            return (
                <tr>
                    <td><CellRef name="id"/></td>
                    <td>
                        <span><CellRef name="code"/></span>
                        <span><CellRef name="name"/></span>
                        <span><CellRef name="engName"/></span>
                    </td>
                    <td>
                        <span><CellRef name="gender"/></span>
                        <span><CellRef name="birth"/></span>
                        <span><CellRef name="domicilePlaceCity"/></span>
                    </td>
                    <td>
                        <span><CellRef name="height"/></span>
                        <span><CellRef name="weight"/></span>
                    </td>
                    <td>{row.weight >= 80 ?
                        <Icon type="up-square" theme="twoTone" twoToneColor="#F00"/> : row.weight <= 60 ?
                            <Icon type="down-square" theme="twoTone" twoToneColor="#00F"/> : ''}</td>
                    <td><CellRef name="companyIndustry"/></td>
                    <td>
                        <span><CellRef name="monthIncome"/></span>
                        <span><CellRef name="familyYearIncome"/></span>
                    </td>
                    <td>
                        <span><CellRef name="familyMonthIncome"/></span>
                        <span><CellRef name="familyMonthCost"/></span>
                    </td>
                    {/*<td>{row.familyYearIncome>1000000?:''}</td>*/}
                    <td>{(() => {
                        if (row.familyYearIncome > 1000000) {
                            return <Rate disabled count={3} defaultValue={3}/>
                        } else if (row.familyYearIncome > 600000) {
                            return <Rate disabled count={3} defaultValue={2}/>
                        } else {
                            return <Rate disabled count={3} defaultValue={1}/>
                        }
                    })()}</td>
                    <td><CellRef name="remark"/></td>
                    <td>
                        <span><CellRef name="createdByVirName"/></span>
                        <span><CellRef name="createdTime"/></span>
                    </td>
                    <td>
                        <span><CellRef name="updatedByVirName"/></span>
                        <span><CellRef name="updatedTime"/></span>
                    </td>
                    <td>
                        {operateCell(row, index)}
                    </td>
                </tr>
            );
        }
    }


    formReady = (voList) => {
        this.voList = voList;
        this.voList.setColumnTemplate('name', (text, record, i) => {
            return <a onClick={() => this.clickName(text, record, i)}>{text}</a>
        });
        //添加按钮
        this.voList.addButton([
            {name: '表格模式', type: 'primary', onClick: () => this.setModel('DataGrid')},
            {name: '列表视图', type: 'primary', onClick: () => this.setModel('ListView')},
            {name: '导出EXCEL', type: 'default', onClick: () => this.exportExcel(false), icon: 'fa-file-excel-o'},
        ]);
    }

    dataReady = (voList) => {
    }

    /**
     * 导出EXCEL
     * @param allData 是否导出所有数据
     */
    exportExcel = (isAll) => {
        this.voList.exportExcel(isAll, `个人客户信息.xlsx`);
    };

    setModel = (model) => {
        this.setState({viewModel: model});
    }

    clickName = (text, record, i) => {
        const {flexTabs} = this.props;
        flexTabs.open(`${record.name}的详情`, 'ShowCase/DataTable/BaseSimpleTable/PersonInfo', {personId: record.id});
    };


    render() {
        return (
            <DataTable
                majorKey="code"
                resizeable={false}
                dataFormId="demo-BeanPersonCustomizeList"
                params={{code: 'BeanPersonList'}}
                dataReady={this.dataReady}
                formReady={this.formReady}
                viewModel={this.state.viewModel || 'DataGrid'}
                bordered={true}
                lineNumber={false}
                headerRender={this.headerRender}
                bodyRowRender={this.bodyRowRender}
                onSelectRow={(k, rows) => this.onSelectRow(k, rows)}
            />
        );
    }

}
