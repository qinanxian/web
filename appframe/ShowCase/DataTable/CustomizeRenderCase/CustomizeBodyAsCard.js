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
    List,
    Card,
    Row,
    Col,
    Progress,
    CellRef,
    Avatar
} from '../../../../src/components';
import './CustomizeBodyAsCard.less';

export default class CustomizeBodyAsCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {viewModel: 'ListView'};//DataGrid,ListView
        this.bodyRender = (dataList) => {
            const CardItemTitle = ({row, index}) => (
                <Row>
                    <Col span={10}><CellRef name={'name'} rowIndex={index}/></Col>
                    <Col span={14}><CellRef name={'gender'} rowIndex={index}/></Col>
                </Row>
            );
            const CardItemAvatar = ({row}) => (
                <Avatar size={'large'} shape={'circle'} style={{
                    color: '#f56a00',
                    backgroundColor: '#fde3cf'
                }}>{'111'}
                </Avatar>
            );
            const ActionButton = ({row}) => (
                [<LinkButton size={'small'} icon="fa-commenting-o"/>,
                    <LinkButton icon={'fa-pencil'} size={'small'}/>,
                    <LinkButton icon={'fa-qrcode'} size={'small'}/>]
            );

            return (
                <tbody style={{"border": "none"}}>
                <tr>
                    <td style={{"height": "500px"}}>
                        <div className={'data-list-card'}>
                            <List
                                rowKey="id"
                                grid={{gutter: 4, lg: 4, md: 3, sm: 2, xs: 1}}
                                dataSource={['', ...dataList]}
                                renderItem={(row, index) => {
                                    const colIndex = index - 1;
                                    return row ? (
                                        <List.Item key={row.id}>
                                            <Card hoverable className={'data-list-card-item'}
                                                  actions={[<LinkButton size={'small'} icon="fa-commenting-o"/>,
                                                      <LinkButton icon={'fa-pencil'} size={'small'}/>,
                                                      <LinkButton icon={'fa-qrcode'} size={'small'}/>]}>
                                                <Card.Meta
                                                    avatar={<CardItemAvatar row={row}/>}
                                                    title={<CardItemTitle row={row} index={colIndex}/>}
                                                    description={
                                                        <div className={'data-list-card-item-content'}>
                                                            <div><CellRef name={'mobilePhone'} rowIndex={colIndex}/>
                                                            </div>
                                                            <div><CellRef name={'domicilePlaceCity'}
                                                                          rowIndex={colIndex}/></div>
                                                        </div>
                                                    }
                                                />
                                            </Card>
                                        </List.Item>
                                    ) : (
                                        <List.Item>
                                            <Button type="dashed" className={'data-list-card-newbtn'}>
                                                <Icon type="plus"/> 新建
                                            </Button>
                                        </List.Item>
                                    );
                                }}
                            />
                        </div>

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
            {name: '卡片视图', type: 'primary', onClick: () => this.setModel('ListView')},
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
                bodyRender={this.bodyRender}
                pageSize={11}
                onSelectRow={(k, rows) => this.onSelectRow(k, rows)}
            />
        );
    }

}
