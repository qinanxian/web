import React from 'react';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import * as dataForm from '../../lib/dataform';
import * as rest from '../../lib/rest';
import { Modal, Spin, Pagination, ConfigProvider, Button, AdSearch, QuickSearch } from '../index';
import { developCompose } from '../developcompose/developCompose';
import * as assistTool from '../datalist/assistTool';

import './style/index.less';

@developCompose
export default class ListItem extends React.Component {
  static defaultProps = {
    showPagination: true,
  };
  constructor(props) {
    super(props);
    this.flag = true;
    this.buttons = [];
    this.buttonFlag = true;
    this.colElements = [];
    this.state = {
      selectedRows: [],
      buttons: [],
      dataBody: {},
      totalCount: 0,
      pageIndex: 0,
      pageSize: props.pageSize || 10,
      dataSource: [],
      loading: false,
      adSearch: false,
      meta: {},
      dict: {},
      filters: [],
      adSearchTerm: {},
      rowTemplate: props.rowTemplate || '',
      filterFootVisible: true,
    };
  }
  componentDidMount() {
    const { dataReady, dataFormId, params } = this.props;
    const { pageIndex, pageSize } = this.state;
    // /* eslint-disable */
    this.table = {
      addButton: this.addButton,
      removeRows: this.removeRows,
      deleteRows: this.deleteRows,
      refresh: this.refresh,
      getData: this.getData,
      removeData: this.removeData,
      saveData: this.saveData,
      setFilterTemplate: this.setFilterTemplate,
      setFilterItemTemplate: this.setFilterItemTemplate,
      setFilterValue: this.setFilterValue,
      getFilter: this.getFilter,
      setFilterExpanded: this.setFilterExpanded,
      setFilterFooterVisible: this.setFilterFooterVisible,
      doSearch: this.doSearch,
      getDictItem: this.getDictItem,
      getColumnMeta: this.getColumnMeta,
      setRowTemplate: this.setRowTemplate,
    };
    this._getDataList(dataFormId, params, pageIndex, pageSize).then(() => {
      dataReady && dataReady(this.table);
    });
  }
  componentWillReceiveProps(nextProps) {
    const { params, dataFormId } = this.props;
    const { pageIndex, pageSize } = this.state;
    const nextParams = nextProps.params && rest.serializeParam(nextProps.params);
    const thisParams = params && rest.serializeParam(params);
    if ((nextParams !== thisParams) || (nextProps.dataFormId !== dataFormId)) {
      this._getDataList(nextProps.dataFormId, nextProps.params, pageIndex, pageSize);
    }
  }
  componentWillUnmount() {
    this.flag = false;
  }
  getDictItem = (dictCode, itemCode) => {
    const item = this.state.dict[dictCode] || [];
    return item.filter(d => d.code === itemCode)[0];
  };
  getColumnMeta = (fieldCode) => {
    const fields = this.state.meta.elements || [];
    return fields.filter(field => field.code === fieldCode)[0];
  };
  setFilterTemplate = filterJsx => this.setState({ filterTemplate: filterJsx });
  getFilter = () => Object.assign({}, this.state.adSearchTerm);
  setFilterItemTemplate = (field, itemTemplate) => {
    this.filterItems[field] = itemTemplate;
    if(field && itemTemplate && this.filterItemFlag) {
      setTimeout(() =>
          this.setState({ filterItemTemplate: {...this.filterItems} },
            () => this.filterItemFlag = true),
        300);
      this.filterItemFlag = false;
    }
  };
  setFilterValue = (term, cb) => {
    this.setState({
        adSearchTerm: Object.assign({}, this.state.adSearchTerm, term) },
      () => {
        cb && typeof cb === 'function' && cb(this.state.adSearchTerm);
      });
  };
  setFilterExpanded = bool => this.setState({ adSearch: bool });
  setFilterFooterVisible = bool => this.setState({ filterFootVisible: bool });
  setRowTemplate = (rowTemplate) => {
    this.setState({
      rowTemplate,
    });
  };
  getData = () => Object.assign([], this.state.dataSource);
  addButton = (button) => {
    this.buttons = this.buttons.concat(button);
    if (this.buttonFlag) {
      setTimeout(() => {
        this.setState({
          buttons: [...this.buttons],
        }, () => {
          this.buttonFlag = true;
        });
      }, 300);
    }
    this.buttonFlag = false;
  };
  removeData = () => this.setState({ dataSource: [] });
  saveData = (rows) => {
    const { dataFormId } = this.props;
    const { dataSource } = this.state;
    return new Promise((resolve, reject) => {
      if ((!rows || rows.length === 0) && (!dataSource || dataSource.length === 0)) {
        reject(new Error('无可用数据保存'));
        return Modal.error({
          title: '保存失败',
          content: '无可用数据保存',
        });
      }
      this.setState({ loading: true });
      return dataForm.saveDataList(dataFormId,  rows || dataSource)
        .then((res) => {
          this.setState({ loading: false });
          resolve(res);
        }).catch((e) => {
          Modal.error({
            title: '保存失败',
            content: e.message,
          });
          this.setState({ loading: false });
          reject(e);
        });
    });
  };
  deleteRows = (rows) => {
    const { dataFormId } = this.props;
    this.setState({ loading: true });
    const { dataSource } = this.state;
    return new Promise((resolve, reject) => {
      if (!rows || rows.length === 0) {
        reject(new Error('无可用数据删除'));
        return Modal.error({
          title: '删除失败',
          content: '无可用数据删除',
        });
      }
      return dataForm.deleteDataList(dataFormId, rows)
        .then((res) => {
          resolve(res);
          this.refresh(null, null, dataSource.length === 1 ? 0 : null);
        }).catch((e) => {
          Modal.error({
            title: '删除失败',
            content: e.message,
          });
          reject(e);
          this.setState({ loading: false });
        });
    });
  };
  removeRows = (rows, callback) => {
    const { dataSource } = this.state;
    if (Array.isArray(rows)) {
      this.setState({ dataSource: dataSource.filter(item => !rows.includes(item)) }, callback);
    } else {
      this.setState({ dataSource: dataSource.filter(item => rows.__key !== item.__key) }, callback);
    }
  };
  refresh = (dataFormIdX, paramsX, pageIndexX) => {
    const { params, dataFormId } = this.props;
    const { pageIndex, pageSize } = this.state;
    return this._getDataList(dataFormIdX || dataFormId, paramsX || params,
      pageIndexX || pageIndex, pageSize)
      .then(() => this.setState({ selectedRows: [] }));
  };
  doSearch = () => this._adSearchRequest();
  _getDataList = (dataFormId, params, index, size, scParam) => {
    this.setState({ loading: true });
    return dataForm.getDataList(dataFormId, rest.serializeParam(params || '1=1'),
      'sort_code=ASC', index, size, scParam)
      .then((res) => {
        this.colElements = (res.meta && res.meta.elements) || [];
        this.flag && this.setState({
          dataBody: res.body || {},
          dataSource: (res.body && this._addUUID(res.body.dataList)) || [],
          pageIndex: res.body && res.body.index,
          pageSize: res.body && res.body.size,
          totalCount: res.body && res.body.totalRowCount,
          meta: res.meta,
          loading: false,
          dict: res.dict,
          filters: (res.meta && res.meta.filters) || [],
        });
      }).catch((e) => {
        Modal.error({
          title: '获取列表数据失败',
          content: e.message,
        });
        this.setState({ loading: false });
      });
  };
  _addUUID = (dataSource) => {
    return dataSource.map((item) => {
      return {
        ...item,
        __key: item.__key || Math.uuid(),
      };
    });
  };
  _getRowTemplate = (data, row) => {
    const { rowTemplate } = this.state;
    if (typeof rowTemplate === 'string') {
      return (<div>{data.code}</div>);
    } else if (typeof rowTemplate === 'function') {
      return rowTemplate(data, row);
    }
    return rowTemplate;
  };
  _onChange = (page, pageSize) => {
    const { dataReady, dataFormId, params } = this.props;
    const { dict, adSearchTerm } = this.state;
    const reducedTerm = assistTool.reduceObj(adSearchTerm, dict);
    this.setState({
      pageIndex: page - 1,
      pageSize,
    }, () => {
      this._getDataList(dataFormId, params, page - 1, pageSize, reducedTerm).then(() => {
        dataReady && dataReady(this.table);
      });
    });
  };
  _onShowSizeChange = (current, pageSize) => {
    const { dataReady, dataFormId, params } = this.props;
    const { dict, adSearchTerm } = this.state;
    const reducedTerm = assistTool.reduceObj(adSearchTerm, dict);
    this.setState({
      pageSize,
      pageIndex: current - 1,
    }, () => {
      this._getDataList(dataFormId, params, this.state.pageIndex, pageSize, reducedTerm)
        .then(() => {
        dataReady && dataReady(this.table);
      });
    });
  };
  _rowClick = (e, key) => {
    if (this.state.selectedRows[0] === key) {
      this.setState({
        selectedRows: [],
      });
    } else {
      this.setState({
        selectedRows: [key],
      });
    }
  };
  _adBtnState = (value) => {
    this.setState({
      adSearch: value,
    });
  };
  _quickSearchRequest = (value) => {
    const { dataFormId, params } = this.props;
    const { pageSize } = this.state;
    this._getDataList(dataFormId, params, 0, pageSize, { __quick: value });
  };
  _adSearchRequest = () => {
    const { dataFormId, params } = this.props;
    const { pageSize, dict, adSearchTerm } = this.state;
    const reducedTerm = assistTool.reduceObj(adSearchTerm, dict);
    return this._getDataList(dataFormId, params, 0, pageSize, reducedTerm)
      .then(() => {
        this.setState({ adSearchTerm: reducedTerm });
      });
  };
  render() {
    const { prefix = 'ro', closeSelection, size, hideAdBtn, showPagination  } = this.props;
    const { buttons, selectedRows, adSearch, dict, filters, adSearchTerm,
      filterTemplate, filterItemTemplate, filterFootVisible } = this.state;
    return (
      <Spin spinning={this.state.loading}>
        <div>
          <div>
            {buttons && buttons.map(item =>
              (<Button
                key={item.name}
                style={{ margin: 2, ...item.style }}
                icon={item.icon}
                onClick={item.onClick}
                type={item.type}
                disabled={item.selectBind && (closeSelection || selectedRows.length === 0)}>
                {item.name}
              </Button>))
            }
          </div>
          <div>
            <QuickSearch
              filters={filters}
              size={size}
              quickSearch={this._quickSearchRequest}
              adBtnState={adSearch}
              hideAdBtn={hideAdBtn}
              adBtnOnChange={this._adBtnState}
            />
            <AdSearch
              filters={filters}
              adSearchTerm={adSearchTerm}
              open={adSearch}
              dict={dict}
              colElements={this.colElements}
              adSearchRequest={this._adSearchRequest}
              filterTemplate={filterTemplate}
              filterItemTemplate={filterItemTemplate}
              footVisible={filterFootVisible}
            />
            <div className={`${prefix}-listitem`}>
              {
                this.state.dataSource.map((item) => {
                  return (
                    <div
                      className={`${prefix}-listitem-item`}
                      key={item.__key}
                      style={{ background: selectedRows[0] === item.__key ? '#fff6e5' : '' }}
                    >
                      <div className={`${prefix}-listitem-item-line`}>{}</div>
                      <div className={`${prefix}-listitem-item-content`} onClick={e => this._rowClick(e, item.__key)}>
                        {
                          React.cloneElement(
                            this._getRowTemplate(this.state.dataBody, item),
                            { data: this.state.dataBody, item })
                        }
                      </div>
                    </div>
                  );
                })
              }
            </div>
            <div
              style={showPagination ? null : { display: 'none' }}
              className={`${prefix}-listitem-pagination`}
            >
              <ConfigProvider locale={zhCN}>
                <Pagination
                  total={this.state.totalCount}
                  current={this.state.pageIndex + 1}
                  onChange={this._onChange}
                  onShowSizeChange={this._onShowSizeChange}
                  showSizeChanger
                  showQuickJumper
                />
              </ConfigProvider>
            </div>
          </div>
        </div>
      </Spin>
    );
  }
}
