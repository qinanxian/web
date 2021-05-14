/**
 * Created by dpcui on 06/01/2018.
 */

import React from 'react';
import { Tree } from 'antd';
import './style/index.less';

const TreeNode = Tree.TreeNode;

class RoTree extends React.Component {
  static TreeNode = TreeNode;
  static defaultProps = {
    nodeTitle: 'title',
    nodeKey: 'key',
    childrenKey: 'children',
  };
  constructor(props) {
    super(props);
    this.launchFlag = true;
    this.state = {};
  }
  componentWillReceiveProps(nextProps) {
    const { defaultSelectedKeys, dataSource, onSelect } = nextProps;
    if (this.launchFlag && dataSource && defaultSelectedKeys && defaultSelectedKeys.length > 0) {
      const defaultSelectNode = this._returnSelectedNodes(defaultSelectedKeys[0], dataSource);
      const nodeStruct = {
        event: 'select',
        selected: true,
        selectedNodes:[{
          key: defaultSelectedKeys[0],
          props: defaultSelectNode,
        }],
      };
      onSelect && onSelect(defaultSelectedKeys, nodeStruct);
      this.launchFlag = false;
    }
  }

  /* eslint-disable */
  _returnSelectedNodes = (selectedKey, dataS) => {
    const { nodeKey, childrenKey } = this.props;
    const keyRef = nodeKey.includes('.') ? nodeKey.split('.') : nodeKey;
    for  (let i = 0; i < dataS.length ; i++) {
      const item = dataS[i];
      const key = keyRef instanceof Array ? item[keyRef[0]][keyRef[1]] : item[keyRef];
      if (key === selectedKey) {
        return item;
      } else if (item[childrenKey]) {
        return this._returnSelectedNodes(selectedKey, item[childrenKey])
      }
    }
  };
  /* eslint-disable */

  _renderTreeNode = (dataS) => {
    const { nodeTitle, nodeKey, childrenKey,prefix = 'ro' } = this.props;
    const titleRef = nodeTitle.includes('.') ? nodeTitle.split('.') : nodeTitle;
    const keyRef = nodeKey.includes('.') ? nodeKey.split('.') : nodeKey;
    return dataS && dataS.map((item) => {
      const style = item.style ? item.style.color.split('#')[1] : 'unset';
      if (item[childrenKey] && item[childrenKey].length > 0) {
        return (
          <TreeNode
            {...item}
              title={titleRef instanceof Array ? item[titleRef[0]][titleRef[1]] : item[titleRef]}
            key={keyRef instanceof Array ? item[keyRef[0]][keyRef[1]] : item[keyRef]}
            dataRef={item}
          >
            {this._renderTreeNode(item[childrenKey])}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          {...item}
          children={undefined}  // eslint-disable-line
          title={titleRef instanceof Array ? item[titleRef[0]][titleRef[1]] : item[titleRef]}
          key={keyRef instanceof Array ? item[keyRef[0]][keyRef[1]] : item[keyRef]}
          dataRef={item}
          className={`${prefix}-tree-treeNode-set${style}`}
        />
      );
    });
  };

  render() {
    const { children, dataSource, size = 'default' } = this.props;
    // medium  large   default
    return (
      dataSource && dataSource.length > 0 ?
      <div className={`custom-tree-${size}`}>
        <Tree {...this.props} ref="Tree">
          { children || this._renderTreeNode(dataSource)}
        </Tree>
      </div>
      :
      null
    );
  }
}

export default RoTree;
