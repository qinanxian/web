import React from 'react';

import {DataTable, Row,TreeDetail, Col, Button, Modal, Dropdown, Menu, Icon, Upload,Message,Notify} from '../../../../src/components';

import * as rest from '../../../../src/lib/rest';

import {getParamItemsTree} from '../../../../src/lib/base';
import EditableParamItemTree from '../../../Common/EditableParamItemTree';
export default class WorkflowModelList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRows: [],
            selectedNode: null,
            nodeValue: null,
            category: '_ALL_',
            id: props.param.id ? props.param.id : null,
        };
    }

    componentDidMount() {
        getParamItemsTree('WorkflowDefinitionCategoriesTree').then((data) => {
            this.setState({dataSource: data});
        });
    }

    treeOnSelect = (nodeCtx, node) => {
        const selectedNode = node.selectedNodes[0];
        if (!selectedNode || selectedNode.key === '_ALL_') return;
        const nodeValue = selectedNode.props && selectedNode.props.value || selectedNode.value;
        nodeCtx.openDetail(nodeValue.value, {id: this.state.id});
        this.setState({
            selectedNode,
            nodeValue,
            category: nodeValue.code
        });
    };

    dataReady = (dataTable) => {
        const vm = dataTable;
        this.listVM = dataTable;
        const props = {
            name: 'file',
            action: rest.getRequestURL(`/workflow/fileUpload`),
            headers: {
                authorization: 'authorization-text',
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    console.log(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    console.log(`${info.file.name} file upload failed.`);
                }
            },
        };

    };


    formReady = (dataTable) => {
        this.dataTable = dataTable;
        this.dataTable.addButton([{
            name: '新增模型',
            onClick: this.addModel
        }, {
            name: '批量导出',
            onClick: this.downloadBatch
        }]);

        dataTable.setColumnTemplate('button', (text, record, i) => {
            return (<div><Button onClick={() => this.openWorkflowEditor(record)}><Icon type="edit"/>流程设计</Button>
                <Dropdown overlay={
                    <Menu>
                        <Menu.Item><Button onClick={() => this.deploy(dataTable,record)}><Icon type="rightcircle"/>部署</Button></Menu.Item>
                        <Menu.Item><Button onClick={() => this.deployUpgrade(dataTable,record)}><Icon type="rightcircle"/>强制更新部署</Button></Menu.Item>
                        <Menu.Item><Button onClick={() => this.start(record)}><Icon type="stepforward"/>测试启动</Button></Menu.Item>
                        <Menu.Item><Upload action={"/workflow/design/fileUploadUpdate/" + record.id} onChange={this.upload} name={"导入"}/></Menu.Item>
                        <Menu.Item><Button onClick={() => this.download(record)}><Icon type="download"/>导出</Button></Menu.Item>
                        <Menu.Item><Button onClick={() => this.deleteModel(record)}><Icon type="delete"/>删除</Button></Menu.Item>
                    </Menu>
                }>
                    <Button><Icon type="tool"/>操作</Button>
                </Dropdown>
            </div>);
        });
    }

    deploy = (dataTable,row) => {
        rest.post("/workflow/design/model/"+row.id+"/deploy")
            .then((res) => {
                if(null!==res){
                    Notify.success("部署成功")
                }
            }).catch ((res) =>{
            Notify.error(res.message)
        });

    };

    deployUpgrade = (dataTable,row) => {
        const doDeployUpgrade = this.doDeployUpgrade;

        Modal.confirm({
            title: '谨慎操作(生产环境请屏蔽此功能)',
            content: '此操作会将“所有存活流程实例”强制使用“最新版流程设计”,确定进行操作？',
            onOk() {
                Modal.confirm({
                    title: '再次确认',
                    content: '特别是新版本的流程设计对已走过的任务节点定义进行修改后,流程退回可能会存在问题,是否进行操作？',
                    onOk() {
                        doDeployUpgrade(row.id);
                    },
                    onCancel() {
                    },
                });
            },
            onCancel() {
            },
        });



    };

    doDeployUpgrade = (id) => {
        rest.post("/workflow/design/model/"+id+"/deployUpgrade")
            .then((res) => {
                if(null!==res){
                    Notify.success("强制更新部署成功")
                }
            }).catch ((res) =>{
            Notify.error(res.message)
        });
    }


    start = (row) => {
        rest.get("/workflow/demo/model/start/" + row.id).then((res) => {
            if(null!==res){
                Notify.success("启动成功")
            }else {
                Notify.error("启动失败")
            }
        });
    }


    upload = (fileStatus) => {
        if (fileStatus === "done") {
            Modal.info({
                title: '上传结果',
                content: '上传成功'
            })
            this.listRefresh()
        } else if (fileStatus === "uploading") {

        } else {
            Modal.info({
                title: '上传结果',
                content: '上传失败'
            })
        }

    };


    download = (row) => {
        let url = rest.getRequestURL(`/workflow/design/export/${row.id}`);
        window.open(url);
    };

    downloadBatch = () => {
        let preDownModelIds = [];
        console.log(this.state.selectedRows);
        this.state.selectedRows.forEach((pd) => {
            preDownModelIds.push(pd.id);
        });

        let fullURL = rest.getRequestURL(`/workflow/design/exportBatch?`);
        let queryStr = preDownModelIds.map(item => "modelIds=" + item).join("&")
        window.open(fullURL + queryStr);
    };

    addModel = () => {
        if (!this.state.nodeValue && !this.state.selectedNode) {
            Message.info('请先选择要操作的菜单！');
            return;
        } else if (this.state.nodeValue && this.state.selectedNode) {
            const level = this.state.nodeValue.code.length;
            // if (level === 3) {
            //     Message.info('请选择二级菜单！');
            //     return;
            // }
            rest.post(`/workflow/design/model/addModel/${this.state.nodeValue.code}`).then(() => {
                this.setState({
                    selectedNode: null,
                    nodeValue: null,
                }, () => {
                    this.listRefresh();
                });
            })
        }

    };

    deleteModel = (row) => {
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除[${row.name}]吗？删除后数据不可恢复！`,
            onOk: () => {
                rest.post(`/workflow/design/deleteModel/${row.id}`).then(() => {
                    Message.info("模型删除成功!")
                }).then(() => {
                    this.listRefresh();
                });
            },
            onCancel: () => {
                return;
            },
        });
    }

    openWorkflowEditor = (row) => {
        let url = rest.getRequestURL(`/modeler.html?modelId=${row.id}`, true);
        window.open(url);
    };

    refresh = () => {
        const {refresh} = this.props;
        refresh && refresh();
    };

    listRefresh = () => {
        this.listVM && this.listVM.refresh();
    };

    render() {

        return (
            <div>
                <Row>
                    <Col span={4}>
                        <EditableParamItemTree
                            title={'流程设计树图管理'}
                            paramCode={'WorkflowDefinitionCategoriesTree'}
                            reloadTree={this.reloadTree}
                        />
                        <div>
                            <TreeDetail
                                showLine
                                defaultExpandedKeys={['_ALL_']}
                                defaultSelectedKeys={['_ALL_']}
                                onSelect={this.treeOnSelect}
                                dataSource={this.state.dataSource}
                                nodeTitle="value.name" nodeKey="value.code" childrenKey="children">
                            </TreeDetail>
                        </div>
                    </Col>
                    <Col span={20}>
                        <div>
                            <Upload
                                action={`/workflow/design/fileUploadAdd/${this.state.nodeValue ? this.state.nodeValue.code : null }`}
                                onChange={this.listRefresh} multiple={true} name={"批量导入"}/>
                            <DataTable
                                dataFormId="workflow-DesignerModelList"
                                dataReady={this.dataReady}
                                formReady={this.formReady}
                                params={{category: this.state.category}}
                                selectionType="multiple"
                                onSelectRow={(k, rows) => this.setState({selectedRows: rows})}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}
