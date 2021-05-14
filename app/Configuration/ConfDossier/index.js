import React from "react";

import {Row, Col, DataTable, Message, openModal, Modal, Tree, Text, Notify} from '../../../src/components';
import DossierInfo from "./DossierInfo";
import DossierItemList from "./DossierItemList";
import EditableParamItemTree from '../../../appframe/Common/EditableParamItemTree';
import {getParamItemsTree} from '../../../src/lib/base';

export default class Dossier extends React.Component {

    static DossierInfo = DossierInfo;
    static DossierItemList = DossierItemList;

    constructor(props) {
        super(props);
        this.state = {
            dossierDefKey: null,
            classification: '_ALL_',
            rightColDisplayType: 'none'
        };

        this.reloadTree();
    }

    reloadTree = () => {
        const {openLoading, closeLoading} = this.props;
        openLoading();
        getParamItemsTree('DocListClassificationTree').then((data) => {
            this.setState({dataSource: data});
            closeLoading();
        });
    };

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '新增',
            onClick: this.openDossierModal
        }, {
            selectBind: true,
            name: '删除',
            onClick: this.deleteDossier
        }, {
            selectBind: true,
            name: '克隆',
            onClick: this.copyDossierObject
        }]);
        this.voList.setColumnTemplate('dossierDefKey', (text, record, i) => {
            return (<a onClick={() => this.openDossierInfo(record.dossierDefKey,'编辑文档清单信息')}>{text}</a>);
        });
    };

    selectRow = (key, rows) => {
        if (rows.length > 0) {
            this.setState({rightColDisplayType: ''});
            this.setState({dossierDefKey: rows[0].dossierDefKey});
        } else {
            this.setState({rightColDisplayType: 'none'});
        }
    };

    openDossierModal = () => {
        this.openDossierInfo(null, '新增文档清单模板');
    };

    openDossierInfo = (dossierDefKey, title) => {
        openModal(<DossierInfo/>, {
            title: title,
            dossierDefKey: dossierDefKey,
            width: '35%',
            classification: this.state.classification == '_ALL_' ? null : this.state.classification,
            defaultButton: true,
            refresh: this.tableRefresh,
            onOk: (modal, component, btn) => {
                component.docListInfoSave((err, value) => {
                    if (!err) {
                        modal.close();
                    }
                }, btn);
            },
            onCancel: (a, b) => {
            }
        });
    };

    deleteDossier = () => {
        const selectedRows = this.voList.getSelectedRows();
        const dossierName = selectedRows[0].dossierName;
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除[${dossierName}]吗？删除后数据不可恢复！`,
            onOk: () => {
                this.voList.deleteRows(selectedRows);
            },
            onCancel: () => {
                return;
            },
        });
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    treeOnSelect = (selectedKeys, info) => {
        if (!selectedKeys[0]) {
            this.setState({classification: '_ALL_'});
        } else {
            this.setState({classification: selectedKeys[0], rightColDisplayType: 'none'});
        }
    };

    copyDossierObject = () => {
        const row = this.voList.getSelectedRow();
        const newRow = {...row, dossierDefKey: row.dossierDefKey + 'Copy'};
        const that = this;
        Modal.confirm({
            title: `将会复制${newRow.dossierDefKey}`,
            content: (
                <div>
                    新清单代码:<Text value={newRow.dossierDefKey} onChange={value => newRow.dossierDefKey = value}/>
                </div>
            ),
            onOk() {
                const params = {
                    tplDossierDefKey: row.dossierDefKey,
                    newDossierDefKey: newRow.dossierDefKey,
                };
                that.voList.invoke('clone', params)
                    .then((data) => {
                        console.log(data);
                        that.voList.refresh();
                        Notify.success({
                            message: '复制成功',
                        });
                    }).catch((error) => {
                    Modal.info({
                        content: error.message,
                    });
                });
            },
        });
    };

    render() {
        return (
            <div>
                <Row>
                    <Col span={3}>
                        <EditableParamItemTree
                            title={'文档资料清单分类树图管理'}
                            paramCode={'DocListClassificationTree'}
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
                        <Row span={10}>
                            <DataTable
                                dataFormId="configuration-DossierList"
                                params={{classification: this.state.classification}}
                                formReady={this.formReady}
                                dataReady={this.dataReady}
                                onSelectRow={this.selectRow}
                            />
                        </Row>
                        <Row span={10}>
                            <div style={{display: this.state.rightColDisplayType}}>
                                <DossierItemList dossierDefKey={this.state.dossierDefKey}/>
                            </div>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}