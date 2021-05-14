/**
 * Created by hjtu (hjtu@amarsoft.com) on 2017/12/19.
 */

// import mockData from '../../../public/mock/json/dataList';
import React from 'react';
import { Table } from 'antd';

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  render: text => <a href="#">{text}</a>,
}, {
  title: 'Age',
  dataIndex: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
}];

const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '4',
  name: 'Disabled User',
  age: 99,
  address: 'Sidney No. 1 Lake Park',
}];

export default class DataListObject {
  constructor(id) {
    this.gridOptions = {
      selectionMode: 'single',
      id,
      searchRenderOnly: false,
      loading: false,
    };

    this.paginationConf = {
      pagination: true,
      currentPage: 1,
      totalItems: 0,
      itemsPerPage: 15,
      pagesLength: 10,
      noItemText: '',
      perPageOptions: [10, 20, 30, 40, 50, 150, 300],
      onChange(currentPage, itemsPerPage) {
        console.log(currentPage + itemsPerPage);
      },
    };

    // 事件监听注册
    this.on = {
      // 行选中监听（多行状态
      // 'selectRow': null,
      // ***单行选中监听（单行状态）***
      // 'selectionChange': null,
      // ***数据查询成功后的监听***
      // 'beforeRenderData': null,
      // ***分页切换监听***
      // 'pageChanged': null,
      // ***单页数据条数监听***,
      // 'itemPerPageChange': null
    };

    this.lastQuery = {};
    console.log(this.lastQuery);

    this.rows = [];
    this.columns = [];
    this.listData = [];
    this.tplData = [];
  }

  // 事件监听方法
  onSelectRow(callback) {
    this.on.selectRow = callback;
  }

  onSelectionChange(callback) {
    this.on.selectionChange = callback;
  }

  onBeforeRenderData(callback) {
    this.on.beforeRenderData = callback;
  }

  onPageChanged(callback) {
    this.on.pageChanged = callback;
  }

  onItemPerPageChange(callback) {
    this.on.itemPerPageChange = callback;
  }

  // 数据查询方法
  queryDataDefault() {
    if (this.gridOptions.searchRenderOnly) {
      return null;
    }

    this.gridOptions.loading = true;
    this.paginationConf.pagination = this.paginationConf.pagination !== false;
    if (!this.paginationConf.pagination) {
      this.paginationConf.itemsPerPage = 0;
    }
    // listService.queryListData(
    // p.dono,
    // p.owArgs,
    // vm.paginationConf.currentPage,
    // vm.paginationConf.itemsPerPage,
    // hasCodeMap, _hasCodeParam,
    // {url:vm.gridOptions.URLs.queryData}
    // ).then(res => {
    //
    // })
    // 暂时用setTimeout替代从服务端请求数据
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
        // this.rows = data;
      }, 2000);
    });

    return promise;
  }


  static queryTplData() {
    // listService.queryListTpl(
    // dono,
    // _hasCodeParam,
    // owArgs,
    // {url:vm.gridOptions.URLs.queryTemplate}
    // ).then((res) => {
    // })

    // 暂时用setTimeout替代从服务端请求数据
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve(columns);
        // this.columns = columns;
      }, 2000);
    });

    return promise;
  }

  // queryDataByFilter(p) {
  //   console.log(p);
  //   return null;
  // }

  queryData(type, p) {
    let promise = null;
    if (type.trim() === 'default') {
      promise = this.queryDataDefault(p);
    }
    if (type.trim() === 'filter') {
      // promise = this.queryDataByFilter(p);
    }

    if (promise && promise.then) {
      promise.then(() => {
        if (this.on.beforeRenderData) {
          this.on.beforeRenderData(this);
        }
        // console.log(11);
        // scope.$broadcast(objectId + 'dataQueried');
        // scope.$emit(objectId + 'dataQueried');
      });
    }
    return promise;
  }

  render() {
    // this.renderUI();
    // this.fillData();
    this.columns = columns;
    this.rows = data;
  }

  renderUI() {
    this.columns.length = 0;
    this.tplData.forEach((col) => {
      this.columns.push(col);
    });
  }

  fillData() {
    this.rows.length = 0;
    this.listData.forEach((row) => {
      this.rows.push(row);
    });
  }

  run() {
    const tplPromise = this.queryData('default').then((res) => {
      this.listData = res;
    });

    const DataPromise = DataListObject.queryTplData().then((res) => {
      this.tplData = res;
    });

    const prms = new Promise((resolve) => {
      Promise.all([tplPromise, DataPromise]).then(() => {
        resolve(this.render());
      });
    });

    return prms;
  }

  getData() {
    return this.rows;
  }

  getTable() {
    console.log(this.columns, this.rows);
    return (
      <Table
        columns={this.columns}
        dataSource={this.rows}
      />
    );
  }

  enableSearchOnly(bool) {
    this.gridOptions.searchRenderOnly = bool !== false;
  }
}

