import React from 'react';
import {
  Tree,
  Row,
  Col,
  DataTable,
  Modal,
  Notify,
  Tag,
  LinkButton,
  openModal,
  Icon,
  CellRef, Avatar, List, Card, Button, Menu, Download, rest
} from '../../../../src/components';
import UserTab from './UserTab';
import UserInfo from './UserInfo';
import UserSummary from "./UserSummary"
import './index.less';
import {Dropdown} from "antd";
import {getUser} from '../../../../src/lib/cache';

export default class UserManager extends React.Component {

    static UserTab = UserTab;
    static UserInfo = UserInfo;

    constructor(props) {
        super();
        this.state = {
            dataSource: [],
            treeSelectedOrgId: getUser().orgId
        };

        const {rest, openLoading, closeLoading} = props;
        openLoading();
        rest.get('/auth/admin/org/allOrgTree')
            .then((data) => {
                this.setState({dataSource: data});
                closeLoading();
            });

        // this.initBodyRender();
    }

    // initBodyRender = () => {
    //     this.bodyRender = (dataList) => {
    //         const CardItemTitle = ({row, index}) => (
    //             <Row>
    //                 <Col span={10}><CellRef name={'name'} rowIndex={index}/></Col>
    //                 <Col span={8}><CellRef name={'id'} rowIndex={index}/></Col>
    //                 <Col span={6}><Tag color={['red','green'][row.status]}><CellRef name={'status'} rowIndex={index}/></Tag></Col>
    //             </Row>
    //         );
    //         const CardItemContent = ({row, index}) => (
    //             <div className={'data-list-card-item-content'}>
    //                 <div><CellRef name={'email'} rowIndex={index}/></div>
    //                 <div><CellRef name={'orgFullName'} rowIndex={index}/></div>
    //             </div>
    //         );
    //
    //         const ActionButton = ({row}) => (
    //             [<LinkButton size={'small'} icon="fa-commenting-o"/>,
    //                 <LinkButton icon={'fa-pencil'} size={'small'}/>,
    //                 <LinkButton icon={'fa-qrcode'} size={'small'}/>]
    //         );
    //
    //         return (
    //             <tbody style={{"border": "none"}}>
    //             <tr>
    //                 <td>
    //                     <div className={'data-list-card'}>
    //                         <List
    //                             rowKey="id"
    //                             grid={{gutter: 4, lg: 4, md: 3, sm: 2, xs: 1}}
    //                             dataSource={['', ...dataList]}
    //                             renderItem={(row, index) => {
    //                                 const colIndex = index - 1;
    //                                 return row ? (
    //                                     <List.Item key={row.id}>
    //                                         <Card hoverable className={'data-list-card-item'}
    //                                               actions={[<LinkButton size={'small'} icon="fa-pencil"
    //                                                                     onClick={() => this.clickName(row)}>编辑</LinkButton>,
    //                                                   <Dropdown overlay={<Menu>
    //                                                       <Menu.Item key="0"><a onClick={() => this.enableUser(row)}>启用</a></Menu.Item>
    //                                                       <Menu.Item key="1"><a onClick={() => this.disableUser(row)}>禁用</a></Menu.Item>
    //                                                       <Menu.Item key="1"><a onClick={() => this.initUserPassword(row)}>初始化密码</a></Menu.Item>
    //                                                       <Menu.Divider/>
    //                                                       <Menu.Item key="3"><a onClick={() => this.deleteUser(row)}>删除</a></Menu.Item>
    //                                                   </Menu>} trigger={['click']}>
    //                                                       <LinkButton size={'small'}
    //                                                                   icon="fa-ellipsis-h">操作</LinkButton>
    //                                                   </Dropdown>]}
    //                                         >
    //                                             <Card.Meta
    //                                                 title={<CardItemTitle row={row} index={colIndex}/>}
    //                                                 description={<CardItemContent row={row} index={colIndex}/>}
    //                                             />
    //                                         </Card>
    //                                     </List.Item>
    //                                 ) : (
    //                                     <List.Item onClick={this.openUserInfo}>
    //                                         <Button type="dashed" className={'data-list-card-newbtn'}>
    //                                             <Icon type="plus"/> 新建
    //                                         </Button>
    //                                     </List.Item>
    //                                 );
    //                             }}
    //                         />
    //                     </div>
    //
    //                 </td>
    //             </tr>
    //             </tbody>
    //         );
    //     }
    // }

    treeOnSelect = (selectedKeys, info) => {
        const that = this;
        if (!selectedKeys[0]) {
            that.setState({treeSelectedOrgId: getUser().orgId});
        } else {
            that.setState({treeSelectedOrgId: selectedKeys[0]});
        }
    };

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '新增',
            onClick: this.openUserInfo
        }, {
            name: '删除',
            onClick: this.deleteUser,
            selectBind: true
        }]);
      this.voList.setColumnTemplate('name', (text, record, i) => {
        return (<a onClick={() => this.clickName(record)}>{text}</a>);
      });
      this.voList.setColumnTemplate('operator', (text, record, i ) => {
        return (
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
            <Button onClick={() => this.enableUser(record)}><Icon type="plus"/>启用</Button>
            <Button onClick={() => this.disableUser(record)}><Icon type="close"/>禁用</Button>
            <Button onClick={() => this.initUserPassword(record)}><Icon type="reload"/>初始化密码</Button>
          </div>);
      });
    };

    dataReady = (voList) => {
      this.voList = voList;
    };

    openUserInfo = (row) => {
        const that = this;
        openModal(<UserSummary/>, {
            title: '新增用户',
            defaultButton: true,
            width: '35%',
            refresh: () => this.tableRefresh(that.state.treeSelectedOrgId),
            onOk(modal, compnent, btn) {
                compnent.userInfoSave((err, value) => {
                    if (!err) {
                        modal.close();
                    } else {
                        btn.setDisabled(false);
                    }
                });
            },
            onCancel(modal, compnent) {
            }
        });
    };

    clickName = (row) => {
        const curId = row.id ? row.id : null;
        const curName = row.name ? row.name : '用户';

        const {flexTabs} = this.props;
        flexTabs.open(`${curName}-基本信息`, 'System/Organization/UserManager/UserTab', {
            userId: curId,
        });
    };

    enableUser = (row) => {
        this.voList.invoke('enableUser', {"userId": row.id})
            .then(() => {
                Notify.success("启用成功！");
                this.tableRefresh();
            }).catch((err) => {
            Notify.error(err);
        });
    };

    disableUser = (row) => {
        this.voList.invoke('disableUser', {"userId": row.id})
            .then(() => {
                Notify.success("禁用成功！");
                this.tableRefresh();
            }).catch((err) => {
            Notify.error(err);
        });
    };

    initUserPassword = (row) => {
        this.voList.invoke('initUserPassword', {"userId": row.id})
            .then(() => {
                Notify.success("初始化密码成功！");
                this.tableRefresh();
            }).catch((err) => {
            Notify.error(err);
        });
    };

    deleteUser = (row) => {
        const selectedRow = this.voList.getSelectedRow();
        if (!selectedRow) return;

        Modal.confirm({
            title: '删除确认',
            content: `您确定删除[${selectedRow.name}]吗？删除后数据不可恢复！`,
            onOk:() => {
                this.voList.deleteRows([selectedRow]);
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
                    <Col span={4} style={{"padding": "10px"}}>
                        <LinkButton onClick={this.viewAll}> <Icon type="profile"/>所有用户</LinkButton>
                        <Tree
                            showLine
                            defaultExpandedKeys={['0001', '0002']}
                            onSelect={this.treeOnSelect}
                            dataSource={this.state.dataSource}
                            nodeTitle="value.name" nodeKey="value.id" childrenKey="children"
                        >
                        </Tree>
                    </Col>
                    <Col span={20}>
                        <div className={'table-as-card'}>
                            <DataTable
                                dataFormId="system-UserList"
                                params={{orgId: this.state.treeSelectedOrgId}}
                                formReady={this.formReady}
                                dataReady={this.dataReady}
                                // viewModel={'ListView'}
                                // bordered={false}
                                // lineNumber={false}
                                // bodyRender={this.bodyRender}
                                pageSize={20}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

