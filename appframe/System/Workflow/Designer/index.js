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
            name: '????????????',
            onClick: this.addModel
        }, {
            name: '????????????',
            onClick: this.downloadBatch
        }]);

        dataTable.setColumnTemplate('button', (text, record, i) => {
            return (<div><Button onClick={() => this.openWorkflowEditor(record)}><Icon type="edit"/>????????????</Button>
                <Dropdown overlay={
                    <Menu>
                        <Menu.Item><Button onClick={() => this.deploy(dataTable,record)}><Icon type="rightcircle"/>??????</Button></Menu.Item>
                        <Menu.Item><Button onClick={() => this.deployUpgrade(dataTable,record)}><Icon type="rightcircle"/>??????????????????</Button></Menu.Item>
                        <Menu.Item><Button onClick={() => this.start(record)}><Icon type="stepforward"/>????????????</Button></Menu.Item>
                        <Menu.Item><Upload action={"/workflow/design/fileUploadUpdate/" + record.id} onChange={this.upload} name={"??????"}/></Menu.Item>
                        <Menu.Item><Button onClick={() => this.download(record)}><Icon type="download"/>??????</Button></Menu.Item>
                        <Menu.Item><Button onClick={() => this.deleteModel(record)}><Icon type="delete"/>??????</Button></Menu.Item>
                    </Menu>
                }>
                    <Button><Icon type="tool"/>??????</Button>
                </Dropdown>
            </div>);
        });
    }

    deploy = (dataTable,row) => {
        rest.post("/workflow/design/model/"+row.id+"/deploy")
            .then((res) => {
                if(null!==res){
                    Notify.success("????????????")
                }
            }).catch ((res) =>{
            Notify.error(res.message)
        });

    };

    deployUpgrade = (dataTable,row) => {
        const doDeployUpgrade = this.doDeployUpgrade;

        Modal.confirm({
            title: '????????????(??????????????????????????????)',
            content: '????????????????????????????????????????????????????????????????????????????????????,?????????????????????',
            onOk() {
                Modal.confirm({
                    title: '????????????',
                    content: '?????????????????????????????????????????????????????????????????????????????????,?????????????????????????????????,?????????????????????',
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
                    Notify.success("????????????????????????")
                }
            }).catch ((res) =>{
            Notify.error(res.message)
        });
    }


    start = (row) => {
        rest.get("/workflow/demo/model/start/" + row.id).then((res) => {
            if(null!==res){
                Notify.success("????????????")
            }else {
                Notify.error("????????????")
            }
        });
    }


    upload = (fileStatus) => {
        if (fileStatus === "done") {
            Modal.info({
                title: '????????????',
                content: '????????????'
            })
            this.listRefresh()
        } else if (fileStatus === "uploading") {

        } else {
            Modal.info({
                title: '????????????',
                content: '????????????'
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
            Message.info('?????????????????????????????????');
            return;
        } else if (this.state.nodeValue && this.state.selectedNode) {
            const level = this.state.nodeValue.code.length;
            // if (level === 3) {
            //     Message.info('????????????????????????');
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
            title: '????????????',
            content: `???????????????[${row.name}]????????????????????????????????????`,
            onOk: () => {
                rest.post(`/workflow/design/deleteModel/${row.id}`).then(() => {
                    Message.info("??????????????????!")
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
                            title={'????????????????????????'}
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
                                onChange={this.listRefresh} multiple={true} name={"????????????"}/>
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
