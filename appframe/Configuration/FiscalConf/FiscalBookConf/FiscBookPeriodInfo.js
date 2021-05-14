import React from 'react';
import {DataTable, Message, Col,Row, Divider, Tree,propsCompose, Notify,Modal,EmebedButton,Button} from '../../../../src/components';

@propsCompose
export default class FiscBookPeriodInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            periodYear:1000,
            bookCode:props.param ? props.param.bookCode:props.bookCode,
            openLoading:props.param ? props.param.openLoading:props.openLoading,
            closeLoading:props.param ? props.param.closeLoading:props.closeLoading,
        };
        this.reloadTree();
    }

    reloadTree = () => {
        const {rest} = this.props;
        this.state.openLoading && this.state.openLoading();
        rest.get(`/configuration/fiscalBook/peroid/${this.state.bookCode}`)
            .then((data) => {
                let result = data.map(item => {
                    if (item.status === 'N') {
                        return {
                            ...item,
                            style:{color:'#ccc'}
                        }
                    }
                    return item
                });
                this.setState({dataSource: result});
                this.state.closeLoading && this.state.closeLoading();
            });
    };

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '默认初始化',
            type: 'primary',
            onClick: this.initPeriodTerm
        },{
            name: '保存',
            type: 'primary',
            onClick: this.savePeriodTerm
        },{
            name: '删除',
            selectBind: true,
            type: 'primary',
            onClick: this.deletePeriodTerm
        }
        ]);

        this.voList.setColumnTemplate('isInUse', (text, record, i) => {
            return this.getInUseButton(record);
        });
    };

    getInUseButton = (record) => {
        if ('Y' === record.isInUse) {
            return (<EmebedButton.Group style={{margin:0}}>
                <EmebedButton type={"primary"} onClick={()=>this.updatePeriodInUse(record,'N')}>关闭</EmebedButton>
            </EmebedButton.Group>)
        } else {
            return (<EmebedButton.Group style={{margin:0}}>
                <EmebedButton  onClick={()=>this.updatePeriodInUse(record,'Y')}>打开</EmebedButton>
            </EmebedButton.Group>)
        }
    };

    updatePeriodInUse = (record,status) => {
        const data = this.voList.getData();
        if (!data[0].periodId) {
            Message.info("请先保存会计期间！")
            return;
        }
        record.isInUse = status;
        this.voList.invoke('updatePeriodInUse', record)
            .then((data) => {
                Notify.success(data && `变更成功`);
                this.voList.refresh();
            }).catch((error) => {
            Modal.info({
                content: error.message,
            });
        })
    };

    deletePeriodTerm = () => {
        const selectedRows = this.voList.getSelectedRows();
        Modal.confirm({
            title: '删除确认',
            content: '您确定删除吗？删除后数据不可恢复！',
            onOk: () => {
                this.voList.deleteRows(selectedRows);
            }
        });
    };

    initPeriodTerm = () => {
        if (1000 === this.state.periodYear) {
            Message.info('请先选择年份！');
            return ;
        }
        let param ={bookCode:this.state.bookCode,periodYear:this.state.periodYear};
        this.voList.invoke('initPeriodTerm', param)
            .then((data) => {
                Notify.success(data && `初始化成功`);
                this.voList.refresh();
            })
            .catch((error) => {
                Modal.info({
                    content: error.message,
                });
            });
    };

    savePeriodTerm = () => {
        this.voList.saveData()
            .then(()=>{
                Notify.success('保存成功');
                this.voList.refresh();
            });
    };

    treeOnSelect = (selectedKeys) => {
        this.setState({periodYear: selectedKeys[0]});
    };

    widthChange(width,height) {
        this.setState({width,height});
    };

    addPeriodYear = () => {
        this.state.openLoading && this.state.openLoading();
        this.voList.invoke('addPeriodYear',{bookCode:this.state.bookCode})
            .then((data) => {
                let result = data.map(item => {
                    if (item.status === 'N') {
                        return {
                            ...item,
                            style:{color:'#ccc'}
                        }
                    }
                    return item
                });
                this.setState({dataSource: result});
                this.state.closeLoading && this.state.closeLoading();
            })
            .catch((error) => {
                Modal.info({
                    content: error.message,
                });
            });
    };


    render() {
        const height = this.state.height - 100 || 500;
        return (
            <div>
                <Row>
                    <Col span={3}>
                        <div style={{textAlign:"center"}}>年份</div>
                        <Divider/>
                        <Button type = "primary" onClick={this.addPeriodYear}>增加年份</Button>
                        <div style={{overflow:'auto',height:height}}>
                            <Tree
                                showLine
                                onSelect={this.treeOnSelect}
                                dataSource={this.state.dataSource}
                                nodeTitle="name" nodeKey="code" childrenKey="children">
                            </Tree>
                        </div>
                    </Col>
                    <Col span={21}>
                        <DataTable
                            dataFormId="configuration-FiscBookPeriodList"
                            formReady={this.formReady}
                            params={{bookCode:this.state.bookCode,periodYear:this.state.periodYear}}
                            editMode={true}
                            showPagination={false}
                            pageSize={20}
                        />
                    </Col>
                </Row>
            </div>

        );
    }
}


