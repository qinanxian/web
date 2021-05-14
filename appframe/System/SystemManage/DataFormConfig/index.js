import React from "react";

import TemplateDetail from '../DisplayTemplate/TemplateDetail';
import ElementDetail from '../DisplayTemplate/ElementDetail';
import * as dataform from '../../../../src/lib/dataform';
import {
    Row,
    Col,
    Tree,
    DataTable,
    Message,
    Modal,
    openModal,
    Icon,
    Button,
    Notify,
    Text
} from '../../../../src/components';
import EditableParamItemTree from '../../../Common/EditableParamItemTree';
import {getParamItemsTree} from '../../../../src/lib/base';

const comSize = 'small';
const ButtonGroup = Button.Group;
export default class DataFormConfig extends React.Component {

    static TemplateDetail = TemplateDetail;
    static ElementDetail = ElementDetail;

    constructor(props) {
        super(props);
        this.state = {
            dataFromPack: '_ALL_',
            dataSource: [],
        };

        this.reloadTree();
    }

    reloadTree = () => {
        getParamItemsTree('DataFromPackTree').then((data) => {
            this.setState({dataSource: data});
        });
    };

    formReady = (voList) => {
        this.voList = voList;
        this.voList.setColumnTemplate('id', (text, record, i) => {
            return (<a onClick={() => this.createTab(record)}>{text}</a>);
        });
        const column = {
            title: '操作',
            key: 'buttonComponent',
            sortCode: '0010',
            width: 150,
            render: (text, record, index) => {
                return (<div style={{'textAlign': 'center'}}>
                    <ButtonGroup>
                        <Button onClick={() => this.addTemplate(record, index)} icon="fa-plus" type="primary"
                                size={comSize}/>
                        <Button onClick={() => this.deleteTemplate(record, index)} icon="fa-minus" type="primary"
                                size={comSize}/>
                        <Button onClick={() => this.cloneTableData(record, index)} icon="fa-copy" type="primary"
                                size={comSize}/>
                    </ButtonGroup>
                </div>)
            }
        };
        this.voList.addColumn(column);
    };


    cloneTableData = (record, index) => {
      Modal.info({
        title: '温馨提示',
        content: '显示模版的配置已经移动到工具AmixBuilder，如果您没有该工具，请联系研发部',
      });
        /*const {openLoading, closeLoading} = this.props;
        const tempArray = [...(this.state.data || [])];
        const that = this;
        that.pack = record.pack;
        that.code = record.code + 'copy';
        Modal.confirm({
            title: `将会复制模版${record.id}`,
            content: (
                <div>
                    新模版包:<Text value={that.pack} onChange={value => this.pack = value}/>
                    新模版编号:<Text value={that.code} onChange={value => this.code = value}/>
                </div>
            ),
            onOk: () => {
                openLoading && openLoading();
                dataform.postAdmin('/dataform/clone', {
                    newDataFormId: `${that.pack && that.pack.trim()}-${that.code && that.code.trim()}`,
                    oldDataFormId: record.id
                }).then((res) => {
                    tempArray.splice(index + 1, 0, res);
                    that.setState({data: tempArray}, () => {
                        closeLoading && closeLoading();
                        Notify.success({
                            message: '克隆成功',
                        });
                        this.refreshSelf();
                    });
                }).catch((e) => {
                    closeLoading && closeLoading();
                    Modal.error({
                        title: '克隆失败',
                        content: JSON.stringify(e),
                    });
                });
            },
        });*/
    };

    refreshSelf = () => {
        console.log("组件刷新");
        this.voList.refresh();
    };

    createTab = (record) => {
        const {flexTabs} = this.props;
        let dataFromPackValue = this.state.dataFromPack;
        if (!this.state.dataFromPack || this.state.dataFromPack == '_ALL_') {
            dataFromPackValue = 'demo';
        }
        flexTabs.open(`模板:${record.name}`, `System/SystemManage/DisplayTemplate/TemplateDetail/`, {
            dataId: record.id,
            dataFromPack: dataFromPackValue,
            flag: record.flag || false,
        });
    };

    addTemplate = (record, index) => {
      Modal.info({
        title: '温馨提示',
        content: '显示模版的配置已经移动到工具AmixBuilder，如果您没有该工具，请联系研发部',
      });
        /*const newT = {name: '新增模板', id: `newTemplateDetail${new Date().getTime()}`, flag: true}
        const tempArray = [...(this.state.data || [])];
        if (!record) {
            tempArray.push(newT)
        } else {
            tempArray.splice(index + 1, 0, newT);
        }
        this.setState({data: tempArray});
        this.createTab(newT);*/
    };
    deleteTemplate = (record) => {
      Modal.info({
        title: '温馨提示',
        content: '显示模版的配置已经移动到工具AmixBuilder，如果您没有该工具，请联系研发部',
      });
        /*const {closeLoading, openLoading} = this.props;
        const that = this;
        Modal.confirm({
            title: '删除模板',
            content: (
                <div>您确定要删除模板:{record.name || record.id} 吗？</div>
            ),
            onOk: () => {
                openLoading && openLoading();
                dataform.deleteAdmin(`/dataform/${record.id}`)
                    .then(() => {
                        that.setState({
                            data: that.state.data.filter(ele => ele.code !== record.code)
                        }, () => {
                            closeLoading && closeLoading();
                            Notify.success({
                                message: '删除模板' + (record.name || record.id) + '成功',
                            });
                            this.refreshSelf();
                        });
                    }).catch((e) => {
                    closeLoading && closeLoading();
                    Modal.error({
                        title: '删除模板失败',
                        content: JSON.stringify(e),
                    });
                });
            },
        });*/
    };

    treeOnSelect = (selectedKeys, info) => {
        if (!selectedKeys[0]) {
            this.setState({dataFromPack: '_ALL_'});
        } else {
            this.setState({dataFromPack: selectedKeys[0]});
        }
    };

    render() {
        return (
            <div>
                <Row>
                    <Col span={3}>
                        <EditableParamItemTree
                            title={'显示模板树图管理'}
                            paramCode={'DataFromPackTree'}
                            reloadTree={this.reloadTree}
                        />
                        <div>
                            <Tree
                                showLine
                                defaultExpandedKeys={['_ALL_']}
                                defaultSelectedKeys={['_ALL_']}
                                onSelect={this.treeOnSelect}
                                dataSource={this.state.dataSource}
                                nodeTitle="value.name" nodeKey="value.code" childrenKey="children">
                            </Tree>
                        </div>
                    </Col>

                    <Col span={20}>
                        <DataTable
                            dataFormId="system-DataFormConfigList"
                            params={{dataFromPack: this.state.dataFromPack}}
                            formReady={this.formReady}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}