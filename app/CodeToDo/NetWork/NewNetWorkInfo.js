import React, { Component } from "react";
import { Tree } from 'antd';
import { Message, Spin } from '../../../src/components';
import { getUser } from '../../../src/lib/cache';
import './index.less';

class NewNetWorkInfo extends Component {
  static defaultProps = {
    checkable: false
  }
  constructor(props) {
    super(props);
    this.orgId = getUser().orgId;
    this.allData = [];
    this.state = {
      dataSource: [],
      expandedKeys: [],
      checkedKeys: props.checkedKeys || [],
      selectedKeys: props.selectedKeys || [],
      autoExpandParent: true,
      loading: false
    };
  }

  componentDidMount() {
    this.fetchTreeData();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      checkedKeys: nextProps.checkedKeys || [],
      selectedKeys: nextProps.selectedKeys || [],
    })
  }

  arrayToTree = (array, parentId) => {
    //  array 是返回的数据  parendId 父id
    let temp = [];
    let treeArr = array;
    treeArr.forEach((item, index) => {
      if (item.parentId === parentId) {
        if (this.arrayToTree(treeArr, treeArr[index].id).length > 0) {
          // 递归调用此函数
          treeArr[index].children = this.arrayToTree(treeArr, treeArr[index].id);
        }
        const refactorAntdTreeNode = {
          ...treeArr[index],
          title: item.name,
          key: item.id
        }
        temp.push(refactorAntdTreeNode);
      }
    });
    return temp;
  }

  fetchTreeData = () => {
    const { rest, dataReady } = this.props;
    this.setState({ loading: true });
    rest.get(`/dataform/data/list/system-OrgList/orgId=${this.orgId}/1=1/0-1000`)
      .then((data) => {
        const dataList = data.body.dataList || [];
        this.allData = dataList;
        const root = dataList.filter(item => item.id === this.orgId)[0];
        let treeData = this.arrayToTree(dataList, this.orgId);
        const expandedKeys = [this.orgId];
        if (root) {
          treeData = this.arrayToTree(dataList, root.parentId);
        }
        this.setState({ dataSource: treeData, expandedKeys, loading: false });
        dataReady && dataReady(this);
      }).catch((error) => {
      this.setState({ loading: false });
        Message.error('获取机构树图失败！');
      });
  }

  onExpand = (expandedKeys) => {
    this.setState({ expandedKeys, autoExpandParent: false });
  };

  onCheck = (checkedKeys) => {
    this.setState({ checkedKeys });
  };

  onSelect = (selectedKeys, info) => {
    this.setState({ selectedKeys });
  };

  getSelectedKeys = () => {
    if (this.props.checkable) {
      return this.state.checkedKeys.filter(item => {
        const dataItem = this.allData.filter(o => o.id === item)[0];
        return dataItem && !dataItem.children;
      });
    }
    return this.state.selectedKeys.filter(item => {
      const dataItem = this.allData.filter(o => o.id === item)[0];
      return  dataItem && !dataItem.children;
    });
  }
  getSelectedItem = () => {
    if (this.state.checkable) {
      return this.state.checkedKeys.map((item) => {
        return this.allData.filter(o => o.id === item)[0];
      })
    }
    return this.state.selectedKeys.map((item) => {
      return this.allData.filter(o => o.id === item)[0];
    })
  }

  render() {
    const { expandedKeys, autoExpandParent, checkedKeys, dataSource,
      selectedKeys, loading } = this.state;
    const { checkable } = this.props;
    return (
      <div className="ro-modal-tree-container">
        {loading ? <Spin />
            : <Tree
                checkable={checkable}
                onExpand={this.onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onCheck={this.onCheck}
                checkedKeys={checkedKeys}
                onSelect={this.onSelect}
                selectedKeys={selectedKeys}
                treeData={dataSource}
            />
        }
      </div>
    );
  }
}

export default NewNetWorkInfo;
