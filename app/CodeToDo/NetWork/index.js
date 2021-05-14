import React from 'react'

import { DataTable, openModal, Modal, Message } from '../../../src/components';

import NetWorkInfo from './NetWorkInfo';
import NewNetWorkInfo from './NewNetWorkInfo';
import {getUser} from '../../../src/lib/cache';

export default class NetWorkList extends React.Component {

    static NetWorkInfo = NetWorkInfo;

    constructor(props){
        super(props);
      this.state = {};
      this.treeHandler;
        this.userOrg = getUser().orgId;
        console.log(this.userOrg);
    }

    componentDidMount = () => {

    }

    dataReady = (voList) => {
        this.voList.setColumnTemplate('name', (text, record, i) => {
            return (<a onClick={() => this.clickName(record)}>{text}</a>);
        });
    };

    formReady = (voList) => {
        this.voList = voList;
        this.voList.addButton([{
            name: '新增',
            onClick: this.createNetWork
        },
        {
            name: '删除',
            selectBind: true,
            onClick: this.deleteNetWork
        },
        {
            name: '导出EXCEL',
            type: 'default',
            onClick: () => this.exportExcel(true)
        }
        ]);

    };

    exportExcel = (isAll) => {
        this.voList.exportExcel(isAll, `网点信息.xlsx`);
    };

    createNetWork = () => {
        this.openNetWorkInfoModal("新增网点");
    }

    clickName = (row) => {
        //NETWORK_INFO表中的主键id
        const netWorkId = row.id;
        const netName = row.name;
        //NETWORK_INFO表中的字段ORG_ID，该字段与AUTH_ORG表中的ID进行关联
        // const orgId = row.orgId;
        // const readonly = row.allowEdit === 'Y' ? false: true;
        const {flexTabs} = this.props;
        flexTabs.open(`网点：${netName}`, 'CodeToDo/NetWork/NetWorkInfo', {
            netWorkId: netWorkId,
            netWorkNo: netWorkId
        });
    };

  refreshTable = () => {
    this.voList.refresh();
  }

  openNetWorkInfoModal = (name) => {
    const { rest, openLoading, closeLoading } = this.props;
    openLoading();
    rest.get(`/api/network/getExistedNetwork/${this.userOrg}`)
      .then((response) => {
        closeLoading();
        const selectedKeys = response && response.map((item) => item.code);
        openModal(
          <NewNetWorkInfo
            {...this.props}
            checkable={true}
            checkedKeys={selectedKeys}
            dataReady={handler => {
              this.treeHandler = handler
            }}
          />,
          {
            title: name,
            defaultButton: true,
            onOk: (a, b, c) => {
              a.close()
              this.saveNewNetWorkInfo();
            },
            onCancel: (a, b) => {
              console.log(a, b);
            }
          }
        );
      }).catch((error) => {
        closeLoading();
        Message.error("获取错误：未能获取当前关联机构！");
      })
    };

  saveNewNetWorkInfo = () => {
    const selectedKeys = this.treeHandler.getSelectedKeys();
    const { rest } = this.props;
    if (selectedKeys && selectedKeys.length > 0) {
      rest.post('/api/network/addNetWork', { orgIdArray: selectedKeys })
        .then((response) => {
          this.refreshTable();
        }).catch(error => {
          Message.error("保存错误！");
      })
    }
  }

    deleteNetWork = (voList) => {
        const row = this.voList.getSelectedRow();
      const { rest } = this.props;
        Modal.confirm({
            title: '删除确认',
            content: '是否确认删除',
            onOk: () => {
                rest.get(`/api/network/deleteNetById/${row.id}`)
                  .then((res) => {
                    if(res>=0){
                      Message.success("删除网点成功");
                      this.refreshTable();
                    }
                  }).catch(error => {
                  Message.error("删除失败！");
                })
            },
            onCancel: () => {
                return;
            },
        });
    };

    tableRefresh = () => {
        this.voList.refresh();
    };

    render(){
        return (
            <div>
                <DataTable
                    dataFormId="codetodo-NetWorkList"
                    formReady={this.formReady}
                    dataReady={this.dataReady}
                    params = {{userOrg : this.userOrg}}
                    labelWidth={158}
                />
            </div>
        );
    }

}
