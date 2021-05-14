import React from 'react';
import {Tree, Button, Spin, Notify} from '../../../../src/components';
import { get, post } from '../../../../src/lib/rest';

export default class RoleToPrivilegeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.getData() || [],
      selectedData: [],
      selectedTreeNode: [],
      defaultExpandedKeys: [],
      loading: true,
    }
  }
  getData = () => {
    const { roleId, roleCode } = this.props;
    get('/auth/PermissionTree/viewRoleOwnedPermissions', {roleId, roleCode}).then(data => {
      this.setState({
        dataSource: [data],
        selectedData: this.getSelectedData([data]),
        defaultExpandedKeys: [data.value.sortCode],
      }, () => {
        if (data) {
          this.setState({
            loading: false,
          });
        }
      });
    });
  };
  onCheck = (value, e) => {
    this.setState({
      selectedData: value,
      selectedTreeNode: e.checkedNodes.map(item => item.props.value)
    });
  };
  getSelectedData = (data, selectedKeys = []) => {
    data.map(item => {
      if(item.value && item.value.rw){
        selectedKeys.push(item.value.sortCode);
      } else if (item.children && item.children.length > 0) {
        this.getSelectedData(item.children, selectedKeys);
      }
    });
    return selectedKeys;
  };
  // structureReplyData = (data) => {
  //   console.log(data);
  // };
  saveData = () => {
    const { roleId, roleCode } = this.props;
    const { selectedTreeNode } = this.state;
    // this.structureReplyData(selectedData);
    const newData = {
      roleId,
      roleCode,
      permits: selectedTreeNode
    };
    const {openLoading, closeLoading} = this.props;
    openLoading();
    post('/auth/PermissionTree/relateRoleWithPermissions', newData).then(result => {
        Notify.success(`保存成功`);
        closeLoading();
    });
  };
  render() {
    const { dataSource, selectedData, defaultExpandedKeys, loading } = this.state;
    return (
      loading ?
        (
          <div
            style={{ textAlign: 'center' }}
          >
            <Spin
              spinning={loading}
              tip="正在获取数据，请稍后..."
            />
          </div>
        )
        :
        (
          <div style={{ display: 'flex',justifyContent:'space-between' }}>
            <Tree
              checkable
              defaultExpandedKeys={defaultExpandedKeys}
              dataSource={dataSource}
              checkedKeys={selectedData}
              onCheck={this.onCheck}
              nodeTitle="value.name"
              nodeKey="value.sortCode"
              childrenKey="children"
            />
            <Button
              type="primary"
              onClick={this.saveData}
            >
              保存数据
            </Button>
          </div>
        )
    );
  }
}