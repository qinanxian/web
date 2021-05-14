import React from 'react';
import { DataTable, Icon } from '../index';
import './style/index.less';

export default class TreeTable extends React.Component{
  static defaultProps = {
    toggleAttributeCell: true,
    expandAll: false,
  };
  constructor(props){
    super(props);
    this.state = {
      showKeys: [],
    };
    this.allParentKeys = [];
    this.index = 0;
    this.parents = {};
    this.children = {};
    this.simpleChildren = {};
  }
  _formReady = (table) => {
    const { toggleAttribute } = this.props;
    this.table = table;
    const tempTable = table;
    const columns = tempTable.getColumns();
    table.setColumns(columns.map((column) => {
      return {
        ...column,
        render: (text, record, cIndex) => {
          if (column.key === toggleAttribute) {
            return this._renderColumn(text, record, this.newData);
          } else if (column.key === '__i') {
            if (record.__hidden === true) {
              this.index += 1;
            }
            if (cIndex - this.index < 0) {
              this.index = 0;
            }
            return cIndex - this.index + 1;
          }
          return column.render(text, record, cIndex);
        },
      };
    }), () => {
      const { formReady } = this.props;
      formReady && formReady({...tempTable, expand: this._expand, collapse: this._collapse});
    });
  };
  _getChildrenData = (key, newData) => {
    const { keyAttribute = '__key', parentAttribute } = this.props;
    const childrenArray = [];
    const getChildren = (parentKey, dataList) => {
      let children = dataList.filter(d => d[parentAttribute] === parentKey);
      const childrenKey = children.map(c => c[keyAttribute]);
      const isParent = childrenKey.filter(c => this.allParentKeys.includes(c));
      if (isParent.length > 0) {
        children = children.concat(isParent.reduce((a, b) => {
          return a.concat(getChildren(b, dataList));
        }, []));
      }
      return children;
    };
    if (!key) {
      return childrenArray;
    }
    return getChildren(key, newData);
  };
  _cellClick = (e, key) => {
    const { toggleAttributeCell } = this.props;
    if (toggleAttributeCell) {
      this._iconClick(e, key);
    }
  };
  _iconClick = (e, key) => {
    //const { parentAttribute } = this.props;
    const { showKeys } = this.state;
    //e.stopPropagation();
    //e.preventDefault();
    let tempShowKeys = [...showKeys];
    if (tempShowKeys.includes(key)) {
      tempShowKeys = tempShowKeys.filter(showKey => key !== showKey);
      this.table.hiddenRows(this.children[key] || []);
    } else {
      tempShowKeys.push(key);
      const rows = tempShowKeys
        .filter(k => this.allParentKeys.includes(k) && this.parents[k].includes(key))
        .reduce((a, b) => {
          return a.concat(this.simpleChildren[b]);
        }, []);
      this.table.showRows(rows);
    }
    this.setState({
      showKeys: tempShowKeys,
    });
  };
  _renderColumn = (text, record) => {
    const { keyAttribute = '__key', parentAttribute } = this.props;
    const { showKeys } = this.state;
    const padding = (this.parents[record[parentAttribute]] || []).length * 10;
    const iconDisplay = this.allParentKeys.includes(record[keyAttribute])
    && this.children[record[keyAttribute]]
    && this.children[record[keyAttribute]].length > 0 ? '' : 'none';
    return (<span
      className='ro-treetable-cell'
      style={{paddingLeft: padding}}
      onClick={e => this._cellClick(e, record[keyAttribute])}
    >
      <Icon
        onClick={e => this._iconClick(e, record[keyAttribute])}
        type='fa-caret-right'
        style={{
          display: iconDisplay,
          transform: showKeys.includes(record[keyAttribute]) ? 'rotate(90deg)' : 'rotate(0deg)',
        }}
      />
      <span>{text}</span>
    </span>);
  };
  _calcDataParent = (dataList) => {
    //const { showKeys } = this.state;
    const { keyAttribute = '__key', parentAttribute, expandAll } = this.props;
    // 1.将所有没有父节点的数据提取出来
    const newData = [];
    const children = {};
    dataList.forEach((d) => {
      if (d[parentAttribute] && dataList.map(dl => dl[keyAttribute]).includes(d[parentAttribute])) {
        this.allParentKeys.push(d[parentAttribute]);
        if (!children[d[parentAttribute]]) {
          children[d[parentAttribute]] = [];
        }
        children[d[parentAttribute]].push(d);
      } else {
        newData.push(d);
      }
    });
    dataList.forEach((d, index) => {
      if (children[d[keyAttribute]]){
        newData.splice(index + 1, 0, ...children[d[keyAttribute]]);
      }
    });
    return newData.map(d => ({
      ...d,
      __hidden: !expandAll && (this.parents[d[keyAttribute]] || []).length !== 1,
    }));
  };
  _getParentsData = (key, newData) => {
    const { keyAttribute = '__key', parentAttribute } = this.props;
    const keyArray = [];
    const getParent = (parentKey, keyarray, dataList) => {
      const parent = dataList.filter(d => d[keyAttribute] === parentKey)[0];
      if (parent && parent[parentAttribute]) {
        return getParent(parent[parentAttribute],
          keyarray.concat(parent[parentAttribute]), dataList);
      }
      return keyarray;
    };
    if (key) {
      keyArray.push(key);
    }
    return getParent(key, keyArray, newData);
  };
  _expand = (keys) => {
    const tempKeys = (keys && [].concat(keys)) || [];
    if (tempKeys.length === 0) {
      // 展开所有
      this.table.showRows(this.newData);
      this.setState({
        showKeys: [...this.allParentKeys],
      });
    } else {
      // 计算需要展开的数据
      const { showKeys } = this.state;
      const allShowKeys = tempKeys
        .reduce((a, b) => a.concat(this.parents[b]), tempKeys)
        .filter(k => this.allParentKeys.includes(k));
      const rows = allShowKeys.reduce((a, b) => {
          return a.concat((this.simpleChildren[b] || []));
        }, []);
      this.table.showRows(rows);
      this.setState({
        showKeys: [...new Set(showKeys.concat(allShowKeys))],
      });
    }
  };
  _collapse = (keys) => {
    const { keyAttribute = '__key' } = this.props;
    const tempKeys = (keys && [].concat(keys)) || [];
    if (tempKeys.length === 0) {
      // 收起所有
      this.table.hiddenRows(this.newData
        .filter(d => (this.parents[d[keyAttribute]] || []).length !== 1));
      this.setState({
        showKeys: [],
      });
    } else {
      const { showKeys } = this.state;
      const tempHiddenKeys = showKeys.filter(k => tempKeys.includes(k));
      const rows = tempHiddenKeys.reduce((a, b) => {
        return a.concat((this.children[b] || []));
      }, []);
      this.table.hiddenRows(rows);
      this.setState({
        showKeys: showKeys.filter(k => !tempKeys.includes(k)),
      });
    }
  };
  _setDefaultData = (cb) => {
    const { expandAll } = this.props;
    if (expandAll) {
      this.setState({
        showKeys: [...this.allParentKeys],
      }, () => {
        cb && cb();
      });
    } else {
      this.setState({
        showKeys: [],
      }, () => {
        cb && cb();
      });
    }
  };
  _dataReady = (table) => {
    const { keyAttribute = '__key', parentAttribute } = this.props;
    this.table = table;
    // 重置数据
    this.simpleChildren = {};
    this.children = {};
    this.parents = {};
    const tempTable = table;
    // 获取列表数据
    // 给列表的第一列增加图标
    const dataList = table.getData();
    // 计算所有节点的父节点
    dataList.forEach((d) => {
      this.parents[d[keyAttribute]]
          = this._clearParentData(this._getParentsData(d[keyAttribute], dataList), dataList);
    });
    this.newData = this._calcDataParent(dataList);
    // 计算数据的层级关系
    // 计算所有节点的子节点
    dataList.forEach((d) => {
      this.simpleChildren[d[keyAttribute]]
        = dataList.filter(data => data[parentAttribute] === d[keyAttribute]);
      this.children[d[keyAttribute]] = this._getChildrenData(d[keyAttribute], dataList);
    });
    this._setDefaultData(() => {
      tempTable.setData(this.newData, () => {
        const { dataReady } = this.props;
        dataReady && dataReady({...tempTable, expand: this._expand, collapse: this._collapse});
      });
    });
  };
  _clearParentData = (clearData, dataList) => {
    const { keyAttribute } = this.props;
    // 1.清除无效的父节点数据
    const allKeys = dataList.map(d => d[keyAttribute]);
    //console.log(clearData, dataList, clearData.filter(d => allKeys.includes(d)));
    return clearData.filter(d => allKeys.includes(d));
  };
  render(){
    return (<div>
      <DataTable
        {...this.props}
        dataReady={this._dataReady}
        formReady={this._formReady}
      />
    </div>);
  }
}
