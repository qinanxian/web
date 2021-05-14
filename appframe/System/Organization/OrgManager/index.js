import React from 'react';
import {Tree, Row, Col, DataTable, Message, Modal, openModal, Icon, CellRef,LinkButton} from '../../../../src/components';
import OrgInfo from './OrgInfo';
import OrgTab from './OrgTab';
import {getUser} from '../../../../src/lib/cache';

export default class OrgManager extends React.Component {

    static OrgInfo = OrgInfo;
    static OrgTab = OrgTab;

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            treeSelectedOrgId: getUser().orgId
        };
        this.reloadTree();


    }

    reloadTree = () => {
        const {rest, openLoading, closeLoading} = this.props;
        openLoading();
        rest.get('/auth/admin/org/allOrgTree')
            .then((data) => {
                this.setState({dataSource: data});
                closeLoading();
            });
    };

    treeOnSelect = (selectedKeys, info) => {
        const that = this;
        if (!selectedKeys || !selectedKeys[0]) {
            that.setState({treeSelectedOrgId: getUser().orgId});
        } else {
            that.setState({treeSelectedOrgId: selectedKeys[0]});
        }
    };

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '新增',
            onClick: this.openOrgInfo
        }]);
    };

    dataReady = (voList) => {
        this.voList.setColumnTemplate('name', (text, record, i) => {
            return (<a onClick={() => this.editOrgInfo(record)}>{text}</a>);
        });
    };

    openOrgInfo = () => {
        this.openOrgInfoModal(null,this.state.treeSelectedOrgId, '新增机构信息');
    };

    editOrgInfo = (row) => {
        const curId = row.id ? row.id : null;
        const curName = row.name ? row.name : '机构';
        //this.openOrgInfoModal(curId, `查看机构信息-${curName}`);

        const {flexTabs} = this.props;
        flexTabs.open(`查看机构信息-${curName}`, 'System/Organization/OrgManager/OrgTab', {
            orgId: curId,
            parentId: row.parentId
        });
    };

    openOrgInfoModal = (orgId,parentId, title) => {
        const that = this;
        openModal(<OrgInfo/>, {
            title: title,
            orgId: orgId,
            width: '80%',
            parentId: parentId,
            defaultButton: true,
            refresh: () => that.tableRefresh(that.state.treeSelectedOrgId),
            onOk(a, b) {
                b.orgInfoSave((err, value) => {
                    if (!err) {
                        a.close();
                    }
                });
            },
            onCancel(a, b) {
            }
        });
    };

    deleteOrg = (row) => {
        const that = this;
        // const selectedRows = that.voList.getSelectedRows();
        const selectedRows = [row];
        if (selectedRows.length < 1) {
            Message.info('请先选择一行！');
            return;
        }

        Modal.confirm({
            title: '删除确认',
            content: `您确定删除[${selectedRows[0].name}]吗？删除后数据不可恢复！`,
            onOk() {
                that.voList.deleteRows(selectedRows);
            },
            onCancel() {
                return;
            },
        });
    };

    viewAll = () => {
        const {refresh} = this.props;
        refresh && refresh();
    };

    tableRefresh = (orgId) => {
        if (!orgId) {
            orgId = getUser().orgId;
        }
        this.setState({treeSelectedOrgId: orgId});
        this.voList.refresh();
    };

    render() {
        return (
            <div>
                <Row>
                    <Col span={6}>
                        <a onClick={this.viewAll}> <Icon type="profile"/>所有机构</a>
                        <Tree
                            showLine
                            onSelect={this.treeOnSelect}
                            dataSource={this.state.dataSource}
                            nodeTitle="value.name" nodeKey="value.id" childrenKey="children"
                        >
                        </Tree>
                    </Col>
                    <Col span={18}>
                        <div>
                            <DataTable
                                dataFormId="system-OrgList"
                                params={{orgId: this.state.treeSelectedOrgId}}
                                formReady={this.formReady}
                                dataReady={this.dataReady}
                            />
                        </div>
                    </Col>
                </Row>
            </div>

        );
    }
}

