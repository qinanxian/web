import React from 'react';

import { DataTable, Icon } from '../index';
import './style/index.less';

export default class GroupDataTable extends React.Component {
  constructor(props) {
    super(props);
    this.groups = {};
    this.index = -1;
    this.state = {
      openKeys: props.defaultOpenKeys || [],
    };
  }
  _dataReady = (table) => {
    const { openKeys } = this.state;
    const { defaultOpenAllKeys } = this.props;
    this.table = table;
    const { groupIdField, groupName, dataReady } = this.props;
    const data = table.getData().filter(item => !item.__temp);
    // console.log(data);
    let tempData = [];
    let groupData = [];
    this.groups = {};
    // 处理数据，对数据进行分组
    data.forEach((item) => {
      if (!item[groupIdField]) {
        if (!this.groups.__ungroup) {
          this.groups.__ungroup = [];
        }
        this.groups.__ungroup.push(item);
      } else {
          if (!this.groups[item[groupIdField]]) {
            this.groups[item[groupIdField]] = [];
          }
            this.groups[item[groupIdField]].push(item);
        }
    });
    // 构造新的dataSource
    const groups = Object.keys(this.groups);
    groups.forEach((group) => {
      const firstRow = this.groups[group][0];
      const tempGroupName = typeof groupName === 'string' ? firstRow[groupName] : groupName(table, data, this.groups[group]);
      this.groups[group].splice(0, 0, {__tempValue: tempGroupName, __temp: true, __group: group});
    });

    groups.forEach((group) => {
      if (group !== '__ungroup') {
        groupData = groupData.concat(this.groups[group].map((item) => {
          if (openKeys.includes(group)) {
            return ({
              ...item,
              __hidden: false,
            });
          }
          return ({
            ...item,
            __hidden: !item.__temp && !defaultOpenAllKeys,
          });
        }));
      }
    });
    // 将未分组放在最后
    if (this.groups.__ungroup && this.groups.__ungroup.length > 0) {
      tempData = groupData.concat(this.groups.__ungroup.map((item) => {
        if (openKeys.includes('__ungroup')) {
          return ({
            ...item,
            __hidden: false,
          });
        }
        return ({
          ...item,
          __hidden: !item.__temp && !defaultOpenAllKeys,
        });
      }));
    } else {
      tempData = [].concat(groupData);
    }

    const columns = table.getColumns();
    table.setData(tempData.filter(item => !item.__temp || (item.__temp && groupData.length > 0)),
      () => {
      this.indexData = {};
      this.index = -1;
      table.setColumns(columns.map((column) => {
        return ({
          ...column,
          render: (a, b, c) => {
            if (b.__temp) {
              if (column.key === '__i') {
                this.index += 1;
                return {
                  children: this._renderGroup(b.__tempValue || '无分组', b.__group),
                  props: {
                    colSpan: columns.length,
                  },
                };
              }
              return ({
                children: a,
                props: {
                  colSpan: 0,
                },
              });
            } else if (column.key === '__i') {
              if (c - this.index < 0) {
                this.index = 0;
              }
              if (!this.indexData[c]) {
                this.indexData[c] = c - this.index;
              }
              return this.indexData[c];
            }
            return column.render(a, b, c);
          },
        });
      }), () => {
        dataReady && dataReady({
          ...table,
          getData: this._getData,
          getSelectedRows: this._getSelectedRows,
          getAllSelectedRows: this._getAllSelectedRows,
        });
      });
    });
  };
  _formReady = (table) => {
    this.table = table;
    const { formReady } = this.props;
    formReady && formReady({
      ...table,
      getData: this._getData,
      getSelectedRows: this._getSelectedRows,
      getAllSelectedRows: this._getAllSelectedRows,
    });
  };
  _removeRows = (e, group) => {
    const target = e.currentTarget.children[0];
    this.index = -1;
    if (target.style.transform === 'rotate(180deg)') {
      this.table.hiddenRows(this.groups[group].filter(row => !row.__temp));
      target.style.transform = 'rotate(0deg)';
    } else {
      this.table.showRows(this.groups[group].filter(row => !row.__temp));
      target.style.transform = 'rotate(180deg)';
    }
  };
  _renderGroup = (name, group) => {
    const { openKeys = [] } = this.state;
    const { defaultOpenAllKeys, prefix = 'ro' } = this.props;
    return (<div className={`${prefix}-group-data-table-name`} onClick={e => this._removeRows(e, group)}>
      <Icon
        className={`${prefix}-group-data-table-name-icon`}
        style={{transform: openKeys.includes(group) || defaultOpenAllKeys ? 'rotate(180deg)' : 'rotate(0deg)'}}
        type='down'
      />
      {name}
    </div>);
  };
  _onSelectRow = (keyArr, rowArr) => {
    const { majorKey = '__key' } = this.props;
    this.index = -1;
    // 1.过滤无效的数据
    const noUseKey = rowArr.filter(r => r.__temp).map(r => r[majorKey]);
    const { onSelectRow } = this.props;
    onSelectRow && onSelectRow(
      keyArr.filter(k => !noUseKey.includes(k)), rowArr.filter(r => !r.__temp), keyArr, rowArr);
  };
  _getData = () => {
    return this.table.getData().filter(r => !r.__temp);
  };
  _getSelectedRows = () => {
    return this.table.getSelectedRows().filter(r => !r.__temp);
  };
  _getAllSelectedRows = () => {
    return this.table.getAllSelectedRows().filter(r => !r.__temp);
  };
  render() {
    return (
      <DataTable
        {...this.props}
        dataTableType='group'
        dataReady={this._dataReady}
        formReady={this._formReady}
        onSelectRow={this._onSelectRow}
      />
    );
  }
}
