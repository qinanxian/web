import React from "react";
import {Rate} from 'antd';
import {
    DataTable,
    Notify,
    Message,
    DetailInfo,
    Icon,
    Typography,
    Button,
    LinkButton,
    CellRef,
    List,
    Row,
    Col,
    Progress,
    Avatar
} from '../../../../src/components';
import './CustomizeBodyAsList.less';

export default class CustomizeBodyAsList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {viewModel: 'ListView'};//DataGrid,ListView
        this.headerRender = (meta, dict) => {
            return <tr>
                <th>这是一个表格转变的列表</th>
            </tr>;
        };
        this.bodyRender = (dataList) => {
            return (
                <tbody style={{"border": "none"}}>
                <tr>
                    <td style={{"border": "none"}}>
                        <List
                            header={<div><Button type="dashed" icon={'fa-plus'} block>添加</Button></div>}
                            bordered={false}
                            dataSource={dataList}
                            renderItem={(row, index) => {
                                const ListContent = ({rowIndex, data}) => (
                                    <div className={'data-list-content'}>
                                        <div className={'data-list-content-item data-list-content-data-cell'}>
                                            <span>出生日期</span>
                                            <CellRef name={'birth'} rowIndex={index}/>
                                        </div>
                                        <div className={'data-list-content-item data-list-content-data-cell'}>
                                            <span>单位所属行业</span>
                                            <CellRef name={'companyIndustry'} rowIndex={index}/>
                                        </div>
                                        <div className={'data-list-content-item data-list-content-data-cell'}>
                                            <span>家庭年收入</span>
                                            <CellRef name={'familyYearIncome'} rowIndex={index}/>
                                        </div>
                                        <div className={'data-list-content-item'}>
                                            {(() => {
                                                let percent = 10;
                                                if (row.familyYearIncome > 1000000) {
                                                    percent = 80;
                                                } else if (row.familyYearIncome > 600000) {
                                                    percent = 60;
                                                } else {
                                                    percent = 30;
                                                }
                                                return <Progress percent={percent} strokeWidth={6}
                                                                 style={{width: 180}}/>
                                            })()}
                                        </div>
                                    </div>
                                );

                                return (
                                    <List.Item actions={[<LinkButton>查看</LinkButton>, <LinkButton>编辑</LinkButton>]}>
                                        <List.Item.Meta
                                            avatar={<Avatar size={'large'} shape={'square'} style={{
                                                color: '#f56a00',
                                                backgroundColor: '#fde3cf'
                                            }}>{row.name.substring(0, 1)}</Avatar>}
                                            title={<span><CellRef name={'name'}
                                                                  rowIndex={index}/>&nbsp;&nbsp;&nbsp;<CellRef
                                                name={'mobilePhone'} rowIndex={index}/></span>}
                                            description={<CellRef name={'domicilePlaceCity'} rowIndex={index}/>}
                                        />
                                        <ListContent rowIndex={index} data={row}/>
                                    </List.Item>
                                );
                            }}
                        />
                    </td>
                </tr>
                </tbody>
            );
        }
    }


    formReady = (voList) => {
        this.voList = voList;
        this.voList.setColumnTemplate('name', (text, record, i) => {
            return <a onClick={() => this.clickName(text, record, i)}>{text}</a>
        });
        this.voList.setColumnTemplate('mobilePhone', (text, record, i) => {
            return <span><Icon type={'fa-phone'}/>{text}</span>
        });
        this.voList.setColumnTemplate('domicilePlaceCity', (text, record, i) => {
            return <span><Icon type={'fa-location-arrow'}/>{text}</span>
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
                bordered={false}
                lineNumber={false}
                // headerRender={this.headerRender}
                bodyRender={this.bodyRender}
                onSelectRow={(k, rows) => this.onSelectRow(k, rows)}
            />
        );
    }

}
