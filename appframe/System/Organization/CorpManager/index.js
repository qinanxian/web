import React from 'react';
import {
    Row,
    Col,
    DataTable,
    Message,
    Modal,
    openModal,
    List,
    Button,
    CellRef,
    Progress, LinkButton, Avatar
} from '../../../../src/components';
import CorpInfo from './CorpInfo';
import './index.less'

export default class CorpManager extends React.Component {

    static CorpInfo = CorpInfo;

    constructor(props) {
        super(props);
        this.bodyRender = (dataList) => {
            return (
                <tbody style={{"border": "none"}}>
                <tr>
                    <td style={{"border": "none"}}>
                        <List
                            header={<div><Button type="dashed" icon={'fa-plus'} block onClick={this.openCorpDetail}>添加</Button></div>}
                            bordered={false}
                            dataSource={dataList}
                            renderItem={(row, index) => {
                                const ListContent = ({rowIndex, data}) => (
                                    <div className={'data-list-content'}>
                                        <div className={'data-list-content-item data-list-content-data-cell'}>
                                            <div>统一社会信用代码</div>
                                            <div><CellRef name={'creditCode'} rowIndex={index}/></div>
                                        </div>
                                        <div className={'data-list-content-item data-list-content-data-cell'}>
                                            <div>纳税性质</div>
                                            <div><CellRef name={'taxNature'} rowIndex={index}/></div>
                                        </div>
                                        <div className={'data-list-content-item data-list-content-data-cell'}>
                                            <span>电话</span>
                                            <CellRef name={'telephone'} rowIndex={index}/>
                                        </div>
                                        <div className={'data-list-content-item data-list-content-data-cell'}>
                                        </div>
                                    </div>
                                );

                                return (
                                    <List.Item actions={[<LinkButton onClick={()=>this.editCorpInfo(row)} icon={'fa-pencil'}></LinkButton>, <LinkButton onClick={()=>this.deleteCorp(row)} icon={'fa-trash-o'}></LinkButton>]}>
                                        <List.Item.Meta
                                            avatar={<Avatar size={'large'} shape={'square'} style={{
                                                color: '#f56a00',
                                                backgroundColor: '#fde3cf'
                                            }}>{row.corpShortName}</Avatar>}
                                            title={<CellRef name={'corpName'} rowIndex={index}/>}
                                            description={<CellRef name={'address'} rowIndex={index}/>}
                                        />
                                        <ListContent rowIndex={index} data={row}/>
                                    </List.Item>
                                );
                            }}/>
                    </td>
                </tr>
                </tbody>
            );
        }
    }


    formReady = (voList) => {
        this.voList = voList;
        // this.voList.addButton([{
        //     name: '新增',
        //     onClick: this.openCorpDetail
        // }, {
        //     selectBind: true,
        //     name: '编辑',
        //     onClick: this.editCorpInfo
        // }, {
        //     selectBind: true,
        //     name: '删除',
        //     onClick: this.deleteCorp
        // }]);
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    openCorpDetail = () => {
        this.openInfoModal('新增公司信息', 'add');
    };

    editCorpInfo = (row) => {
        this.openInfoModal('编辑公司信息', 'edit',row);
    };


    deleteCorp = (row) => {
        const corpName = row.corpName;
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除[${corpName}]吗？删除后数据不可恢复！`,
            onOk: () => {
                this.voList.deleteRows([row]);
            },
            onCancel: () => {
                return;
            },
        });
    };

    openInfoModal = (title, operation,row) => {
        const selectedRows = this.voList.getSelectedRows();
        const selectedRow = row || selectedRows[0];
        const corpId = selectedRow && selectedRow.corpId;
        openModal(<CorpInfo corpId={corpId}/>, {
            title: title,
            defaultButton: true,
            operation: operation,
            corpId: 'edit' === operation ? corpId : null,
            refresh: this.tableRefresh,
            onOk: (modal, component, but) => {
                component.corpInfoSave((err, value) => {
                    if (!err) {
                        modal.close();
                    } else {
                        but.setDisabled(false)
                    }
                });
            },
            onCancel: (modal, component) => {
            }
        });
    };

    render() {
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <DataTable
                            dataFormId="system-CorpList"
                            formReady={this.formReady}
                            onSelectRow={this.props.getSelected}
                            viewModel={'ListView'}
                            bodyRender={this.bodyRender}
                            bordered={false}
                            pageSize={0}
                        />
                    </Col>>
                </Row>

            </div>
        );
    }
}


