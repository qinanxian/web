/**
 * Created by dpcui on 09/01/2018.
 */

import React from 'react';
import ReactDom from 'react-dom';
import Sortable from 'sortablejs';
import PropTypes from 'prop-types';
import { EditableCell, RoEasyTable } from './easyTable';
import { AdSearch, QuickSearch, Modal, Button, Notify,EmebedButton, Resizeable, Tooltip, Icon } from '../index';
import * as dataInovker from '../../lib/dataform';
import * as assistTool from './assistTool';
import './style/index.less';
import { developComposeWidthContext } from '../developcompose/developCompose';
import config from '../../lib/config';

const ResizeableTitle = (props) => {
  const { onResize, viewModel, isLast, ...restProps } = props;
  const TagName = viewModel === 'ListView' ? 'span' : 'th';
  if (isLast) {
    return <TagName {...restProps} />;
  }
  return (
    <Resizeable onResize={onResize}>
      <TagName {...restProps} />
    </Resizeable>
  );
};

const ReplaceTableCell = (props) => {
  const { viewModel, type, ...restProps } = props;
  const cellType = type === 'header' ? 'th' : 'td';
  const TagName = viewModel === 'ListView' ? 'span' : cellType;
  return (<TagName {...restProps} />);
};

const composeRender = (Com) => {
  class Render extends React.Component{
    getChildContext(){
      const { rowComponent } = this.props;
      return {
        tableRowComponent: rowComponent,
      };
    }
    render() {
      return Com;
    }
  }
  Render.childContextTypes = {
    tableRowComponent: PropTypes.object,
  };
  return Render;
};

const composeBodyRender = (Com) => {
  class Render extends React.Component{
    getChildContext(){
      const { dataSource, columns } = this.props;
      return {
        dataSource,
        columns,
      };
    }
    render() {
      return Com;
    }
  }
  Render.childContextTypes = {
    dataSource: PropTypes.array,
    columns: PropTypes.array,
  };
  return Render;
};


@developComposeWidthContext({ widthChangeAddListen: PropTypes.func,
  widthChangeRemoveListen: PropTypes.func,
  param: PropTypes.object,
  comDataChange: PropTypes.func,
  permission: PropTypes.object,
})
class DataList extends React.Component {
  static defaultProps = {
    selectionType: 'single',
    editMode: false,
    showPagination: true,
    closeSelection: false,
    enableButtonBar: true,
    requestData: true,
    majorKey: '__key',
    nowrap: config.dataTableNowrap,
    searchMultiple: false,
    viewModel: 'DataGrid',
    lineNumber: config.dataTableLineNumber,
  };
  constructor(props) {
    super(props);
    this.dataInovker = dataInovker;
    this.flag = true;
    this.filterItemFlag = true;
    this.filterItems = {};
    this.colElements = [];
    this.cols = null;
    this.selectedRowsStore = props.searchMultiple ? [] : new Map();
    this.dataset = {
      dataFormId: props.dataFormId,
      params: props.params,
    };
    this.noValidateChanges = [];
    this.state = {
      pageIndex: 0,
      pageSize: this._checkInter(props.pageSize) ? props.pageSize : 10,
      totalCount: 10,
      dataSource: [],
      columns: [],
      loading: false,
      dict: {},
      filters: [],
      adSearchTerm: {},
      selectedRowKeys: [],
      selectedRows: [],
      editModeRows: [],
      readonlyModeRows: [],
      editMode: props.editMode,
      editModeColumns: [],
      openAdSearch: false,
      filterFootVisible: true,
      headerComponents: [],
      validateResult: [],
      sorter: {},
      cellEdit:new Map(),
      cellReadyOnly:new Map(),
      code:'',
    };
    this.tableId = Math.uuid();
  }
  componentDidMount() {
    const { didMount, formReady, requestData } = this.props;
    const { pageIndex, pageSize} = this.state;
    const { dataFormId, params } = this.dataset;
    this.dataInovker = this.props.dataInovker || dataInovker;
    this.validates = {};
    /* eslint-disable */
    this.table = {
      setColumnTemplate: this.setColumnTemplate,
      setRowTemplate: this.setRowTemplate,
      addButton: this.addButton,
      addTemplate: this.addTemplate,
      addRow: this.addRow,
      addRows: this.addRows,
      addColumnButton: this.addColumnButton,
      addColumn: this.addColumn,
      removeRows: this.removeRows,
      removeColumn: this.removeColumn,
      deleteRow: this.deleteRow,
      deleteRows: this.deleteRows,
      refresh: this.refresh,
      getData: this.getData,
      getDataBody: this.getDataBody,
      removeData: this.removeData,
      saveData: this.saveData,
      saveWithoutValidate: this.saveWithoutValidate,
      addValidate: this.addValidate,
      getColumnDict: this.getColumnDict,
      setColumnDict: this.setColumnDict,
      setColumnVisible: this.setColumnVisible,
      setColumnTips: this.setColumnTips,
      setSelectedRows: this.setSelectedRows,
      getSelectedRows: this.getSelectedRows,
      getAllSelectedRows: this.getAllSelectedRows,
      getSelectedRow: this.getSelectedRow,
      getSelectedValue: this.getSelectedValue,
      getPagination: this.getPagination,
      setRowsEditMode: this.setRowsEditMode,
      setRowsReadOnly: this.setRowsReadOnly,
      setColumnsEditMode: this.setColumnsEditMode,
      setColumnsReadOnly: this.setColumnsReadOnly,
      setData: this.setData,
      getColumns: this.getColumns,
      setColumns: this.setColumns,
      hiddenRows: this.hiddenRows,
      showRows: this.showRows,
      setFilterTemplate: this.setFilterTemplate,
      setFilterItemTemplate: this.setFilterItemTemplate,
      setFilterValue: this.setFilterValue,
      setFilterFooterVisible: this.setFilterFooterVisible,
      getFilter: this.getFilter,
      setFilterExpanded: this.setFilterExpanded,
      doSearch: this.doSearch,
      setDataFormId: this.setDataFormId,
      setParams: this.setParams,
      getDictItem: this.getDictItem,
      getColumnMeta: this.getColumnMeta,
      invoke: this.invoke,
      setFooter: this.setFooter,
      setTableFooter: this.setTableFooter,
      setTitle: this.setTitle,
      setRowFixed: this.setRowFixed,//固定列，add this function at 20180524 by zhulifeng
      exportExcel: this.exportExcel,
      setColFixed:this.setColFixed,
      setEmbedButton:this.setEmbedButton,
      setDataRow:this.setDataRow,
      setEditMode:this.setEditMode,
      setCellData:this.setCellData,
      setCellEdit:this.setCellEdit,
      setCellReadOnly:this.setCellReadOnly,
      setMergeColumns:this.setMergeColumns,
      getStartPath: this.getStartPath,
    };
    this._getMeta(dataFormId, params).then(() => {
      formReady && formReady(this.table);
      requestData && this._getDataList(dataFormId, params, pageIndex, pageSize).then(() => {
        didMount && didMount(this.table);
      });
    });
    const { buttonFixed = false } = this.props;
    if (buttonFixed) {
      const id = (this.context.param || {}).__id;
      this.tab = document.getElementById(id);
      this.context.widthChangeAddListen && this.context.widthChangeAddListen(this.tableId, this.calcTableHeader)
    }
  }
  componentWillReceiveProps(nextProps) {
    const { requestData } = this.props;
    //const { pageSize } = this.state;
    const { params, dataFormId } = this.dataset;
    const nextParams = nextProps.params && assistTool.serializeParam(nextProps.params);
    const thisParams = params && assistTool.serializeParam(params);
    if (nextProps.dataFormId !== dataFormId ) {
      this._getMeta(nextProps.dataFormId, nextProps.params)
        .then(() => {
          nextProps.formReady && nextProps.formReady(this.table);
          this.dataset.dataFormId = nextProps.dataFormId;
          requestData && this._getDataList(nextProps.dataFormId, nextProps.params, 0, nextProps.pageSize)
            .then(() => this.dataset.params = nextProps.params);
        });
    } else if ((nextParams !== thisParams) ||
      (this._checkInter(nextProps.pageSize) ? nextProps.pageSize !== this.props.pageSize : false)) {
      requestData && this._getDataList(nextProps.dataFormId, nextProps.params, 0, nextProps.pageSize)
        .then(() => this.dataset.params = nextProps.params);
    }
    if (nextProps.editMode !== this.props.editMode) {
      this.setState({
        editMode: nextProps.editMode,
      });
    }
  }

    componentWillUnmount() {
        const { buttonFixed } = this.props;
        this.flag = false;
        buttonFixed && this.context.widthChangeRemoveListen
        && this.context.widthChangeRemoveListen(this.tableId);
        const { comDataChange } = this.context;
        comDataChange && comDataChange(this.tableId, false);
    }
    _checkInter = (num) => {
        if (!num) {
            return num === 0;
        }
        return true;
    };
    addValidate = (name, fuc) => {
        this.validates[name] = fuc;
    };
    calcTableHeader = () => {
        if (this.tableHeader && this.tableInstance) {
            setTimeout(() => {
                const top = this.tableHeader.offsetHeight - 45;
                this.tableInstance.style.paddingTop = `${top < 0 ? 0 : top}px`;
            }, 150);
        }
    };
    addButton = (button) => {
        const { headerComponents } = this.state;
        const buttons = [].concat(button).map((item, i)=> {
            return (
                <Button
                    permitCode={item.permitCode}
                    title={item.title}
                    key={item.name}
                    style={{ margin: 2, ...item.style }}
                    icon={item.icon}
                    onClick={item.onClick}
                    type={item.type}
                    selectbind={item.selectBind}
                    disabled={item.disabled}
                >
                    {item.name}
                </Button>
            );
        });
        this.setState({ headerComponents: headerComponents.concat(buttons)});
    };
    setEmbedButton = (cols,callback,rows) => {
        const { dataSource } = this.state;
        const { majorKey } = this.props;
        this.cols = cols;
        if (dataSource.length === 0 ) return rows;
        const rowsTemplate = new Map();
        if(!rows){
            dataSource.forEach(item => {
                const keys = Object.keys(item);
                cols.forEach(col => {
                    if(keys.includes(col)){
                        rowsTemplate.set(item[majorKey], callback);
                    }
                });
            });
        }else{
            rows.map(item => {
                if (!isNaN(item)) {
                    rowsTemplate.set(dataSource[item][majorKey], callback);
                    return dataSource[item][majorKey];
                } else if (typeof item === 'object') {
                    const compareKey = Object.keys(item)[0];
                    const accordItem = dataSource.filter(rowItem =>
                        rowItem[compareKey] === item[compareKey] || rowItem[majorKey] === item[majorKey])[0];
                    accordItem && rowsTemplate.set(accordItem[majorKey], callback);
                    return accordItem && accordItem[majorKey];
                }
                return item;
            });
        }
        this.setState({ rowsTemplate: rowsTemplate });
    };
    addTemplate = (template) => {
        const { headerComponents } = this.state;
        if (typeof template === 'function') {
            this.setState({ headerComponents: headerComponents.concat(template()) });
        } else {
            this.setState({ headerComponents: headerComponents.concat(template) })
        }
    };

    setColumnTemplate = (field, callback) => this._updateColumnsHandler(field, callback);

    setFilterTemplate = (filterJsx) => this.setState({ filterTemplate: filterJsx });

    getFilter = () => Object.assign({}, this.state.adSearchTerm);

    getData = () => Object.assign([], this.state.dataSource);

    getDataBody = () => Object.assign({}, this.state.dataBody);

    removeData = () => this.setState({ dataSource: [] });

  setCellData = (row,col,value) => {
    this.setState((state) => ({
      dataSource:state.dataSource.map(item => {
        if(row === item[this.props.majorKey]){
          return {
            ...item,
            [col]:value,
          };
        }
        return item;
      })
    }));
  };
  setCellEditKey = (row,col) => {
      // row:字符串，col：数组
      const {cellEdit,cellReadyOnly} = this.state;
      if (cellEdit.size > 0 && cellEdit.has(row)) {
          let itemMap = cellEdit.get(row);
          if (Array.isArray(col)) {
              cellEdit.set(row,[...new Set(itemMap.concat(col))]);
          } else {
              !(itemMap.includes(col)) && cellEdit.set(row,itemMap.concat(col))
          }
      } else {
          cellEdit.set(row,[].concat(col));
      }
      if (cellReadyOnly.size > 0 && cellReadyOnly.has(row)) {
          let itemMap1 = cellReadyOnly.get(row);
          if (Array.isArray(col)) {
              cellReadyOnly.set(row,itemMap1.filter(fit => !col.includes(fit)));
          } else {
              (itemMap1.includes(col)) && cellReadyOnly.set(row,itemMap1.filter(fit => fit !== col))
          }
      }
      return {cellEdit,cellReadyOnly};
  };
  setCellEdit = (row,col) => {
      let result = null;
      if (typeof row === 'string') {
          result = this.setCellEditKey(row,col);
      } else if (Array.isArray(row)) {
          row.forEach((rowItem,index,arrs) => {
              if (arrs.length === index + 1)
                 result = this.setCellEditKey(rowItem, col);
              this.setCellEditKey(rowItem, col);
          });
      } else {
          Notify.warn('setCellEdit方法传入的参数有误');
      }
      result && this.setState({
          cellEdit:result['cellEdit'],
          cellReadyOnly:result['cellReadyOnly'],
      });
  };
  setCellReadOnlyKey = (row,col) => {
      const {cellReadyOnly,cellEdit} = this.state;
      if (cellReadyOnly.size > 0 && cellReadyOnly.has(row)) {
          let itemMap = cellReadyOnly.get(row);
          if (Array.isArray(col)) {
              cellReadyOnly.set(row,[...new Set(itemMap.concat(col))]);
          } else {
              !(itemMap.includes(col)) && cellReadyOnly.set(row,itemMap.concat(col))
          }
      } else {
          cellReadyOnly.set(row,[].concat(col));
      }
      if (cellEdit.size > 0 && cellEdit.has(row)) {
          let itemMap1 = cellEdit.get(row);
          if (Array.isArray(col)) {
              cellEdit.set(row,itemMap1.filter(fit => !col.includes(fit)));
          } else {
              (itemMap1.includes(col)) && cellEdit.set(row,itemMap1.filter(fit => fit !== col))
          }
      }
      return {cellEdit,cellReadyOnly};
  };
  setCellReadOnly = (row,col) => {
      let result = null;
      if (typeof row === 'string') {
          result = this.setCellReadOnlyKey(row,col);
      } else if (Array.isArray(row)) {
          row.forEach((rowItem,index,arrs) => {
              if (arrs.length === index + 1)
                  result = this.setCellReadOnlyKey(rowItem, col);
              this.setCellReadOnlyKey(rowItem, col);
          });
      } else {
          Notify.warn('setCellReadOnly方法传入的参数有误');
      }
      result && this.setState({
          cellEdit:result['cellEdit'],
          cellReadyOnly:result['cellReadyOnly'],
      });
  };
  calcMergeData = (d, data, key) => {
    let count = 0;
    for (let i = 0; i < data.length; i ++){
      if (data[i][key] === d[key]) {
        // 计算重复数据的条数
        count +=1;
        if (i === data.length - 1) {
          // 如果是最后一条则需要返回数据
          return {
            rowSpan: count,
          };
        }
      } else {
        return {
          rowSpan: count,
        };
      }
    }
  };
  calcMerge = (data, key) => {
    let count = 0;
    return data.map((d, index) => {
      count += 1;
      // 跳过重复的数据
      if (count > 0) {
        count = 1;
        const result = this.calcMergeData(d, [...data].splice(index, [...data].length - index), key);
        // 设置跳过的数量
        count -= result.rowSpan;
        return result
      }
      return {
        rowSpan: 0,
      }
    })
  };
  mergeColumns = (render, key) => {
    return (value, row, index) => {
      const { dataSource } = this.state;
      const tempData = this.calcMerge([...dataSource], key);
      const result = (render && render(value, row, index)) || value;
      const rowSpan = tempData[index].rowSpan;
      return {
        children: (result && result.children) || result,
        props: {
          rowSpan,
        },
      };
    };
  };
  setMergeColumns = (cols) => {
    this.setState({
      columns: this.state.columns.map(ele => {
        if ([].concat(cols).includes(ele.key)) {
          return {
            ...ele,
            render: (value, row, index) => {
              return this.mergeColumns(ele.render, ele.key)(value, row, index);
            }
          }
        }
        return ele;
      })
    });
  };
  getStartPath = () => {
    return this.context.permission.startPath;
  };
  getColumnDict = (field) => this.state.dict[field];

    setColumnDict = (field, dict) => this.setState({ dict: { ...this.state.dict, [field]: dict } });

    getSelectedRows = () => Object.assign([], this.state.selectedRows);

    getSelectedRow = () => this.state.selectedRows[0] ? Object.assign({}, this.state.selectedRows[0]) : undefined;

    getSelectedValue = (field) => this.state.selectedRows[0] ? this.state.selectedRows[0][field] : undefined;

    setFilterExpanded = (bool) => this.setState({ openAdSearch: bool });

    setFilterFooterVisible = (bool) => this.setState({ filterFootVisible: bool });

    doSearch = () => this._adSearchRequest();

    setDataFormId = (dataFormId) => this.dataset.dataFormId = dataFormId;

    setParams = (params) => this.dataset.params = params;

    getDictItem = (field, itemCode) => assistTool.getDictItem(this.state.dict, field, itemCode);

    getColumnMeta = (field) => this.colElements.filter(ob => ob.code === field);

    invoke = (methodName, param) => this.dataInovker.invokeMethod(this.dataset.dataFormId, methodName, param);

    setFooter = (jsx) => {
        this.setState({
            footer: () => {
                return typeof jsx === 'function' ? jsx(this.state.dataBody) : jsx;
            }
        })
    };

    setTableFooter = (jsx) => {
        this.setState({
            tableFooter: () => {
                return typeof jsx === 'function' ? jsx(this.state.dataBody) : jsx;
            }
        })
    };

    setTitle = (jsx) => {
        this.setState({
            title:  () => {
                return typeof jsx === 'function' ? jsx(this.state.dataBody) : jsx;
            }
        })
    };

    setRowFixed = (field, fixedType) => {
        this.setState({
            columns: this.state.columns.map(ele => {
                if (ele.key === field && fixedType) {
                    return {
                        ...ele,
                        fixed: fixedType
                    }
                }
                return ele;
            })
        });
    };

    setColFixed = (cols,position = 'left') => {
        const {columns} = this.state;
        let retColumns;
        if (position !== 'right') {
            retColumns = columns.map(item => {
                if(([].concat(cols)).includes(item.dataIndex) || item.dataIndex === '__i'){
                    return {
                        ...item,
                        fixed:'left'
                    };
                }
                return item;
            });
        } else {
            retColumns = columns.map(item => {
                if(([].concat(cols)).includes(item.dataIndex)){
                    return {
                        ...item,
                        fixed:'right'
                    };
                }
                return item;
            });
        }

        this.setState({
            columns:retColumns
        });
    };

    exportConfirm = (size, filename) => {
        const { adSearchTerm, pageIndex } = this.state;
        const { dataFormId, params } = this.dataset;
        let tempParams = {};
        if (this.searchType === 'quick') {
            tempParams = {
                __quick: this.quickParam,
            };
        } else {
            tempParams = {
                ...adSearchTerm,
            };
        }
        if (filename) {
            tempParams = {
                ...tempParams,
                filename
            };
        }
        this.dataInovker.exportExcel(dataFormId, assistTool.serializeParam(params || '1=1'),
            assistTool.updateSorterParam(this.state.sorter) || '1=1', pageIndex, size, tempParams);
    };

    exportExcel = (flag, filename) => {
        const { pageSize, totalCount, code } = this.state;
        const tempSize = flag ? totalCount : pageSize;
        const curFileName = filename || code + '-' + new Date().getTime();
        this.exportConfirm(tempSize, curFileName);
    };

    setRowTemplate = (rows, callback) => {
        const { dataSource } = this.state;
        const { majorKey } = this.props;
        if (!Array.isArray(rows) || dataSource.length === 0 ) return rows;
        let keyArr = rows || [];
        const rowsTemplate = new Map();
        keyArr.map(item => {
            if (!isNaN(item)) {
                rowsTemplate.set(dataSource[item][majorKey], callback);
                return dataSource[item][majorKey];
            } else if (typeof item === 'object') {
                const compareKey = Object.keys(item)[0];
                const accordItem = dataSource.filter(rowItem =>
                    rowItem[compareKey] === item[compareKey] || rowItem[majorKey] === item[majorKey])[0];
                accordItem && rowsTemplate.set(accordItem[majorKey], callback);
                return accordItem && accordItem[majorKey];
            }
            return item;
        });
        this.setState({ rowsTemplate: rowsTemplate });
    };

    getAllSelectedRows = () => {
        if (this.props.majorKey !== '__key' && this.props.selectionType === 'multiple') {
            if (this.props.searchMultiple) {
                return [...this.selectedRowsStore];
            } else {
                let rowsArray = [];
                for (let pageRows of this.selectedRowsStore.values()) {
                    rowsArray = rowsArray.concat(pageRows);
                }
                return rowsArray;
            }
        }
        return Object.assign([], this.state.selectedRows);
    };

    setFilterValue = (term, cb) => {
        this.setState({
                adSearchTerm: Object.assign({}, this.state.adSearchTerm, term) },
            () => {
                cb && typeof cb === 'function' && cb(this.state.adSearchTerm);
            });
    };

    getPagination = () => {
        const { pageIndex, pageSize, totalCount, closeSelection } = this.state;
        return {
            current: pageIndex + 1,
            pageIndex: pageIndex,
            pageSize: pageSize,
            totalCount: totalCount,
            closeSelection: closeSelection,
        }
    };

    addRow = (row, i=0) => {
        const { dataSource } = this.state;
        if (i > dataSource.length) {
            dataSource.push(row);
        } else {
            dataSource.splice(i, 0, row);
        }
        this.setState({ dataSource: assistTool.addUUID(dataSource) });
    };

    addRows = (rows, i = 0) => {
        const { dataSource } = this.state;
        let tempDataSource = [...dataSource];
        if (i > dataSource.length) {
            tempDataSource = tempDataSource.concat(rows);
        } else {
            tempDataSource.splice(i, 0, ...rows);
        }
        this.setState({ dataSource: assistTool.addUUID(tempDataSource) });
    };

    setDataRow = (resetData,rowId) => {
        this.setState({
            dataSource:this.state.dataSource.map(item => {
                if(rowId === item[this.props.majorKey]){
                    return {
                        ...item,
                        ...resetData
                    };
                }
                return item;
            })
        });
    };

    setEditMode = (editMode) => {
        this.setState({
            editMode,
        })
    };

    removeRows = (rows, callback) => {
        const { dataSource } = this.state;
        const { majorKey } = this.props;
        if (Array.isArray(rows)) {
            const tempRows = rows.map(row => row[majorKey]);
            this.setState({ dataSource: dataSource.filter(item => !tempRows.includes(item[majorKey])) }, callback);
        } else {
            this.setState({ dataSource: dataSource.filter(item => rows[majorKey] !== item[majorKey]) }, callback);
        }
    };

    deleteRow = (row) => {
        const { dataFormId, } = this.props;
        this.setState({ loading: true });
        const { dataSource } = this.state;
        return new Promise((resolve, reject) => {
            if (!row) {
                reject(new Error('无可用数据删除'));
                return Modal.error({
                    title: '删除失败',
                    content: '无可用数据删除'
                });
            }
            return this.dataInovker.deleteDataItem(dataFormId, row)
                .then((res) => {
                    resolve(res);
                    this.refresh(null, null, dataSource.length === 1 ? 0 : null);
                    Notify.success(`删除成功`);
                }).catch(e => {
                    Modal.error({
                        title: '删除失败',
                        content: e.message
                    });
                    reject(e);
                    this.setState({ loading: false });
                })
        });
    };

    deleteRows = (rows) => {
        const { dataFormId, } = this.props;
        this.setState({ loading: true });
        const { dataSource } = this.state;
        return new Promise((resolve, reject) => {
            if (!rows || rows.length === 0) {
                reject(new Error('无可用数据删除'));
                return Modal.error({
                    title: '删除失败',
                    content: '无可用数据删除'
                });
            }
            return this.dataInovker.deleteDataList(dataFormId, rows)
                .then((res) => {
                    resolve(res);
                    this.refresh(null, null, dataSource.length === 1 ? 0 : null);
                    Notify.success(`删除成功`);
                }).catch(e => {
                    Modal.error({
                        title: '删除失败',
                        content: e.message
                    });
                    reject(e);
                    this.setState({ loading: false });
                })
        });
    };

    hiddenRows = (rows) => {
        const tempRows = [].concat(rows).map(row => row.__key);
        this.setState({
            dataSource: this.state.dataSource.map(item => {
                if (tempRows.includes(item.__key)) {
                    return ({
                        ...item,
                        __hidden: true
                    })
                }
                return item;
            })
        })
    };

    showRows = (rows) => {
        const tempRows = [].concat(rows).map(row => row.__key);
        this.setState({
            dataSource: this.state.dataSource.map(item => {
                if (tempRows.includes(item.__key)) {
                    return ({
                        ...item,
                        __hidden: false
                    })
                }
                return item;
            })
        })
    };

    refresh = (paramsX, pageIndexX) => {
        const { params, dataFormId } = this.dataset;
        const { pageIndex, pageSize } = this.state;
        this.setSelectedRows([]);
        return this._getDataList(dataFormId, paramsX || params, pageIndexX || pageIndex, pageSize);
    };
    _validateClient = (data, record, tempData) => {
        const elements = this.colElements;
        return Promise.all(Object.keys(data)
            .filter(d => elements.map(e => e.code)
                .includes(d)).map(d => {
                return new Promise((res) => {
                    // 根据字段名获取字段的校验数据
                    const field = elements
                        .filter(ele => ele.code === d)
                        .filter(ele => ele.elementUIHint.visible)[0];
                    // 初始化字段的校验信息
                    let errors = [];
                    if (!field) {
                        res({ [d]: errors })
                    } else {
                        // 1.检查必须
                        if (field.elementUIHint.required && !data[d]) {
                            errors.push({ validateType: 'Required', message: `${field.name}是必输字段`, passed: false });
                            res({ [d]: errors })
                        }
                        // 2.正则和方法校验
                        const validates = (field.validatorList || []).filter(va => va.runAt !== 'Server')
                            .sort((a, b) => a.code - b.code);
                        if (validates.length > 0) {
                            Promise.all(validates.map(v => {
                                return new Promise((resolve) => {
                                    if (v.mode === 'RegExp') {
                                        const reg = new RegExp(v.expr);
                                        if (!reg.test(data[d])) {
                                            errors.push({ message: v.defaultMessage, passed: false });
                                        }
                                        resolve();
                                    } else if (v.mode === 'JSFunction') {
                                        if (this.validates[v.expr]) {
                                            this.validates[v.expr](data[d], record, tempData).then(res => {
                                                if (res.passed === false) {
                                                    errors.push({ message: res.message || v.defaultMessage, ...res });
                                                    resolve();
                                                }
                                            });
                                        }
                                        resolve();
                                    }
                                })
                            })).then(() => {
                                res({ [d]: errors });
                            })
                        } else {
                            res({ [d]: errors });
                        }
                    }
                })
            }))
    };
    _validate = (dataFormId, tempData, cb) => {
        // 校验方法
        // 1.前端校验
        Promise.all(tempData.map(data => {
            return this._validateClient(data, data, tempData)
        })).then((errors) => {
            // 过滤多余的数据，构造数据
            const tempErrors = errors.map(error => {
                return error.reduce((a, b) => {
                    const name = Object.keys(b)[0];
                    a[name] = b[name];
                    return a;
                }, {});
            }).map(err => {
                const tempError = {};
                Object.keys(err).forEach((n) => {
                    if (err[n].length > 0) {
                        tempError[n] = err[n];
                    }
                });
                return {
                    passed: Object.keys(tempError).length === 0,
                    records: tempError,
                }
            });
            // 校验结果合并
            // 2.后端校验
            this.dataInovker.validateDataList(dataFormId, tempData).then(res => {
                this.setState({
                    validateResult: res.map((err, index) => {
                        if (tempErrors[index] && tempErrors[index].passed === false) {
                            // 合并校验信息
                            const tempRecords = {...err.records};
                            Object.keys(tempErrors[index].records).forEach(record => {
                                if (!tempRecords[record]) {
                                    // 如果后端校验没有，则需要增加上去
                                    tempRecords[record] = tempErrors[index].records[record];
                                } else {
                                    // 如果后端校验已经存在，则以后端为主
                                    const tempRecord = [...tempRecords[record]];
                                    // 检查后端的必输项是否已经校验
                                    const requireChecked = tempRecord.some(err => err.validateType === 'Required');
                                    tempErrors[index].records[record]
                                        .filter(err => !(requireChecked && err.validateType === 'Required'))
                                        .forEach(err => {
                                            if (!tempRecord.map(re => re.message).includes(err.message)) {
                                                tempRecord.push(err);
                                            }
                                        });
                                    tempRecords[record] = tempRecord;
                                }
                            });
                            return {
                                ...err,
                                records: tempRecords
                            }
                        }
                        return err;
                    }),
                }, () => {
                    cb && cb(res.some(v => v.passed !== true) && '校验不通过');
                });
            }).catch(err => {
                cb && cb(err);
            });
        });
    };
    _save = (dataFormId,  tempData, resolve, reject) => {
        const { sortName } = this.props;
        return this.dataInovker.saveDataList(dataFormId,
            sortName ? tempData.map((r, index) => ({...r, [sortName]: index})) : tempData)
            .then((res) => {
                this.setState({ loading: false });
                resolve(res);
                const { comDataChange } = this.context;
                comDataChange && comDataChange(this.tableId, false);
            }).catch(e => {
                Modal.error({
                    title: '保存失败',
                    content: e.message
                });
                this.setState({ loading: false });
                reject(e);
            })
    };
    saveWithoutValidate = (rows) => {
        return this.saveData(rows, true);
    };
    saveData = (rows, flag) => {
        const { dataFormId } = this.dataset;
        const { dataSource } = this.state;
        const tempData = (rows || dataSource || []).filter(item => !item.__temp);
        return new Promise((resolve, reject) =>{
            if (tempData.length === 0) {
                reject(new Error('无可用数据保存'));
                return Modal.error({
                    title: '保存失败',
                    content: '无可用数据保存'
                });
            }
            this.setState({ loading: true });
            if (!flag) {
                this._validate(dataFormId, tempData, (errors) => {
                    if (!errors) {
                        this._save(dataFormId, tempData, resolve, reject);
                    } else {
                        this.setState({ loading: false });
                        reject(errors);
                    }
                });
            } else {
                this._save(dataFormId,  tempData, resolve, reject);
            }
        });
    };

    setSelectedRows = (rows) => {
        const { dataSource } = this.state;
        const { selectionType, closeSelection, majorKey } = this.props;
        if (!Array.isArray(rows) || closeSelection || dataSource.length === 0 ) return rows;
        let keyArr = rows || [];
        let rowArr = [];
        if (selectionType === 'single') keyArr = keyArr.slice(0, 1);
        keyArr = keyArr.map(item => {
            const compareData = typeof item === 'object' ? item[majorKey] : item;
            const accordItem = dataSource.filter(rowItem => rowItem[majorKey] === compareData)[0];
            accordItem && rowArr.push(accordItem);
            return accordItem && accordItem[majorKey];
        }).filter(k => !!k);
        this.setState({ selectedRowKeys: keyArr, selectedRows: rowArr }, () => {
            this.props.selectionType === 'multiple' &&
            this.props.majorKey !== '__key' && this._calcSelectedRowsStore(rows, true);
            this.props.onSelectRow && this.props.onSelectRow(keyArr, rowArr)
        });
    };
    setColumnTips = (tips, cb) => {
      const { lineNumber } = this.props;
        const eles = this.colElements.map(item => {
            return {
                ...item,
                elementUIHint: {
                    ...item.elementUIHint,
                    tips,
                }
            }
        });
        this.setState({
            columns: assistTool.columnsHandler(eles, this._renderColumns, lineNumber)
        }, () => {
            cb && cb();
        });
    };
    setColumnVisible = (field, bool) => {
      const { lineNumber } = this.props;
        const eles = this.colElements.map(item => {
            if (item.code === field) {
                return {
                    ...item,
                    elementUIHint: {
                        ...item.elementUIHint,
                        visible: bool,
                    }
                }
            }
            return item;
        });
        this.colElements = eles;
        this.setState({
            columns: assistTool.columnsHandler(eles, this._renderColumns, lineNumber)
        });
    };

    addColumnButton = (btns,width,position = 'suffix',title = '操作') => {
        const column = {
            title:title,
            key: Math.uuid(),
            sortCode:Math.uuid(),
            width: width,
            render:(text,record,index) => {
                return (
                    <div style={{textAlign:'center'}}>
                        {btns.map((item,index) =>
                            <EmebedButton style={{marginRight:'2px'}} key={index} onClick={() => item.onClick(record)}>{item.name}</EmebedButton>
                        )}
                    </div>
                );
            }
        };
        this.addColumn(column,'',position);
    };

    addColumn = (column, sortCode,position) => {
        const uuid = Math.uuid();
        const defaultColumn = {
            title: column.title || '未定义',
            dataIndex: column.key || uuid,
            key:  column.key || uuid,
            sortCode: sortCode || column.sortCode || '99999999',
            render: (text, record, index) => (column.render && column.render(text, record, index)) || index,
        };
        const columnObj = Object.assign({}, column, defaultColumn);
        if (position && position !== 'suffix') {
            assistTool.useSortCode(this.state.columns);
            this.state.columns.splice(1,0,columnObj);
        } else {
            assistTool.useSortCode(this.state.columns);
            this.state.columns.push(columnObj);
        }
        this.setState({ columns: this.state.columns });
    };

    removeColumn = (column, callback) => {
        if (typeof column === 'string') {
            return this.setState({ columns: this.state.columns.filter(item => item.key !== column) }, callback);
        }
        column && this.setState({ columns: this.state.columns.filter(item => item.key !== column.key) }, callback);
    };

    setRowsEditMode = (rows) => {
        const { editModeRows,readonlyModeRows } = this.state;
        if (!Array.isArray(rows)) return;
        this.setState({
            editModeRows: rows.filter(item => !editModeRows.includes(item)),
            readonlyModeRows: readonlyModeRows.filter(fit => !rows.includes(fit))
        });
    };

    setRowsReadOnly = (rows) => {
        const { editModeRows,readonlyModeRows } = this.state;
        if (!Array.isArray(rows)) return;
        this.setState({
            editModeRows: editModeRows.filter(item => !rows.includes(item)),
            readonlyModeRows:rows.filter(fit => !readonlyModeRows.includes(fit))
        });
    };

    setColumnsEditMode = (cols) => {
        const {editModeColumns} = this.state;
        if (!Array.isArray(cols) && !editModeColumns.includes(cols)) {
            editModeColumns.push(cols);
            this.setState({editModeColumns});
        }
        if (Array.isArray(cols)) {
            this.setState({editModeColumns:editModeColumns.concat(cols.filter(item => !editModeColumns.includes(item)))});
        }
    };

    setColumnsReadOnly = (cols) => {
        const {editModeColumns} = this.state;
        if (!Array.isArray(cols) && editModeColumns.includes(cols)) {
            this.setState({editModeColumns:editModeColumns.filter(item => item !== cols)});
        }
        if (Array.isArray(cols)) {
            this.setState({editModeColumns:editModeColumns.filter(item => !cols.includes(item))});
        }
    };

    setData = (data, cb) => {
        this.setState({
            dataSource: assistTool.addUUID(data)
        }, cb);
    };

    getColumns = () => {
        return this.state.columns;
    };

    setColumns = (columns, cb) => {
        this.setState({
            columns
        }, cb)
    };

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

    _getMeta = (dataFormId, params) => {
        this.setState({ loading: true });
        const { sorter } = this.state;
        const { lineNumber } = this.props;
        return new Promise((resolve) => {
            this.dataInovker.getMeta(dataFormId, assistTool.serializeParam(params || '1=1'))
                .then((res) => {
                    this.meta = res.meta;
                    this.colElements = (res.meta && res.meta.elements) || [];
                    const filters = (res.meta && res.meta.filters) || [];
                    assistTool.useSortCode(filters);
                    assistTool.useSortCode(this.colElements);
                    this.setState({
                        dict: res.dict || {},
                        columns: assistTool.columnsHandler(this.colElements, this._renderColumns, lineNumber),
                        filters: filters,
                        loading: false
                    }, () => {
                        resolve(res);
                    });
                }).catch(e => {
                Modal.error({
                    title: '获取列表模版失败',
                    content: e.message
                });
                this.setState({ loading: false });
            })
        });
    };

    formatDate = (value) => {
        return value.map((item) => {
            return {
                ...item,
                //createdTime:item.createdTime&&item.createdTime.split(' ')[0],
            };
        });
    };

    _getDataList = (dataFormId, params, index = this.state.pageIndex, size = this.state.pageSize, scParam) => {
        const { permission: { startPath } } = this.context;
        const {majorKey} = this.props;
        this.setState({ loading: true });
        let tempScParam = {...(scParam || {})};
        if (this.searchType === 'quick') {
            tempScParam = {
                __quick: this.quickParam
            }
        }
        return this.dataInovker.getDataList(dataFormId, assistTool.serializeParam(params || '1=1') || '1=1',
            assistTool.updateSorterParam(this.state.sorter) || '1=1', index, size, {...tempScParam, startPath})
            .then((res) => {
                const selectItems = this.getAllSelectedRows();
                const dataList = res.body && this.formatDate(res.body.dataList) || [];
                const rowsTemp = dataList.map((itemR) => Object.assign({},selectItems.find(itemS => itemS[majorKey] === itemR[majorKey])))
                    .filter(item => Object.keys(item).length !== 0);
                // const dataList = res.body && res.body.dataList || [];
                // const rowsTemp = this.selectedRowsStore.get(res.body && res.body.index) || [];
                const rowKeysTemp = rowsTemp.map((item) => item[majorKey]) || [];
                this.flag && this.setState({
                    dict: res.dict || {},
                    dataBody: res.body || {},
                    dataSource: assistTool.addUUID(dataList),
                    pageIndex: res.body && res.body.index,
                    pageSize: res.body && res.body.size,
                    totalCount: res.body && res.body.totalRowCount,
                    loading: false,
                    selectedRowKeys: rowKeysTemp,
                    selectedRows: rowsTemp,
                    validateResult: [],
                    code: res.meta.code,
                    columns: this.state.columns.map(ele => {
                        if ([].concat(this.props.mergeColumns || []).includes(ele.key)) {
                            return {
                                ...ele,
                                render: (value, row, index) => {
                                    return this.mergeColumns(ele.render, ele.key)(value, row, index);
                                }
                            }
                        }
                        return ele;
                    }),
                }, () =>{
                    this.props.onBeforeRenderData &&
                    this.props.onBeforeRenderData(this.state.dataSource);
                    this.props.dataReady && this.props.dataReady(this.table);
                });
            }).catch(e => {
                Modal.error({
                    title: '获取列表数据失败',
                    content: e.message
                });
                this.setState({ loading: false });
            });
    };

    _updateColumnsHandler = (field, callback) => {
        const { columns } = this.state;
        columns.forEach(ele => {
            if (ele.key === field && callback) {
                const eleInitFuc = ele.render;
                ele.render = (text, record, index) => {
                    if (!record.__temp) {
                        return callback(
                            assistTool.getDictName(this.state.dict, ele.key, text),
                            record, index, ele
                        ) || eleInitFuc(
                            assistTool.getDictName(this.state.dict, ele.key, text),
                            record, index, ele
                        )
                    }
                    return eleInitFuc(
                        assistTool.getDictName(this.state.dict, ele.key, text),
                        record, index, ele
                    )
                }
            }
        });
        this.setState({ columns });
    };

    _onNoValidateChange = (value, record, index, column) => {
        const { onChange } = this.props;
        this.noValidateChanges = [...new Set(this.noValidateChanges.concat(column.code))];
        if (value !== record[column.code]) {
            onChange && onChange({...record,...value},column.code);
        }
    };
    _updateRowsHandler = (value, record, index, column) => {
        // onchange 校验
        const { dataSource, validateResult,selectedRows } = this.state;
        const { majorKey,onChange } = this.props;
        // 1.比较value
        if (value !== record[column.code]) {
            const newSelectedRows = selectedRows.map(sel => {
                if (sel[majorKey] === record[majorKey]) {
                    return {
                        ...sel,
                        [column.code]:value,
                    }
                }
                return sel;
            });
            const newData = dataSource.map(ele => {
                if (ele[majorKey] === record[majorKey]) {
                    return {
                        ...ele,
                        [column.code]: value,
                    }
                }
                return ele;
            });
            this._updateSelectedRowsStore(record, column.code, value);
            this.setState({
                dataSource: newData,
                selectedRows:newSelectedRows,
            }, () => {
                if (value !== record[column.code] && !this.noValidateChanges.includes(column.code)) {
                    onChange && onChange({...record,[column.code]:value},column.code);
                }
                // 开始校验
                this._validateClient({[column.code]: value}, record, dataSource).then(res => {
                    const tempArray = [...validateResult];
                    if (res && res[0] && res[0][column.code].length > 0) {
                        if (!tempArray[index]) {
                            for (let i = 0; i < index + 1; i++) {
                                if (!tempArray[i]) {
                                    tempArray.push({ passed: true, records: {} })
                                }
                            }
                        }
                        this.setState({
                            validateResult: tempArray.map((validate, dex) => {
                                if (dex === index) {
                                    return {
                                        ...validate,
                                        passed: false,
                                        records: {
                                            ...validate.records,
                                            [column.code]: res[0][column.code]
                                        }
                                    }
                                }
                                return validate;
                            })
                        })
                    } else {
                        this.setState({
                            validateResult: tempArray.map((validate, dex) => {
                                if (dex === index) {
                                    const tempRecords = {...validate.records};
                                    delete tempRecords[column.code];
                                    return {
                                        ...validate,
                                        passed: true,
                                        records: tempRecords
                                    }
                                }
                                return validate;
                            })
                        })
                    }
                })
            });
            const { comDataChange } = this.context;
            comDataChange && comDataChange(this.tableId, true);
        }
    };

    _rowOnClick = (e, record) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        if (!record.__temp) {
            const { selectionType, majorKey, dataTableType } = this.props;
            const { selectedRowKeys, selectedRows } = this.state;
            const tempRows = [...selectedRows];
            const tempKeys = [...selectedRowKeys];
            const __key = record[majorKey];
            if (selectionType === 'multiple') {
                if (dataTableType !== 'group') {
                    // 关闭分组表格多选
                    if (tempKeys.includes(__key)) {
                        const index = tempKeys.findIndex(value => value === __key);
                        tempKeys.splice(index, 1);
                        tempRows.splice(index, 1);
                    } else {
                        tempKeys.push(__key);
                        tempRows.push(record);
                    }
                    this.props.majorKey !== '__key' && this._calcSelectedRowsStore(tempRows);
                    this.setState({ selectedRowKeys: tempKeys, selectedRows: tempRows });
                    this.props.onSelectRow && this.props.onSelectRow(tempKeys, tempRows)
                }
            } else {
                if (selectedRowKeys.includes(__key)) {
                    this.setState({ selectedRowKeys: [], selectedRows: [] });
                    this.props.onSelectRow && this.props.onSelectRow([], []);
                } else {
                    this.setState({ selectedRowKeys: [__key], selectedRows: [record] });
                    this.props.onSelectRow && this.props.onSelectRow([__key], [record]);
                }
            }
        }
    };

    // 增加对分组表格的支持
    _updateRowChange = (keys = [], rows = []) => {
        let tempSelectedRowKeys = [...keys];
        let tempSelectedRows = [...rows];
        const { dataSource, selectedRowKeys } = this.state;
        const { dataTableType, groupIdField, majorKey = '__key' } = this.props;
        if (dataTableType === 'group') {
            // 如果是分组列表则需要对选中的数据进行特殊处理
            // 判断当前点击的是哪一个多选框
            const addRowKeyCount = tempSelectedRowKeys.length - selectedRowKeys.length;
            // 去除全选和反选
            if (addRowKeyCount ===  1 || addRowKeyCount === -1) {
                // 获取变化的key
                let rowKey = '';
                if (addRowKeyCount === 1) {
                    rowKey = tempSelectedRowKeys.filter(k => !selectedRowKeys.includes(k))[0];
                } else {
                    rowKey = selectedRowKeys.filter(k => !tempSelectedRowKeys.includes(k))[0];
                }
                const rowData = dataSource.filter(d => d[majorKey] === rowKey)[0];
                if (rowData) {
                    // 1.点击的是分组的标题头
                    if (rowData.__group) {
                        if (addRowKeyCount === -1) {
                            // 1.1.取消当前的分组
                            const removeSelectedKeys = dataSource
                                .filter(d => d[groupIdField] && (rowData.__group === d[groupIdField]))
                                .map(d => d[majorKey]);
                            tempSelectedRowKeys = tempSelectedRowKeys.filter(k => !removeSelectedKeys.includes(k));
                            tempSelectedRows = tempSelectedRows.filter(r => !removeSelectedKeys.includes(r[majorKey]));
                        } else {
                            // 1.2.选中当前的分组
                            const newSelectedRows = dataSource.filter(d => d[groupIdField]
                                && (rowData.__group === d[groupIdField]) && !selectedRowKeys.includes(d[majorKey]));
                            tempSelectedRowKeys = tempSelectedRowKeys.concat(newSelectedRows.map(d => d[majorKey]));
                            tempSelectedRows = tempSelectedRows.concat(newSelectedRows);
                        }
                    } else {
                        const groupId = rowData[groupIdField];
                        const groupHeaderData = dataSource.filter(d => d.__temp && d.__group && d.__group === groupId)[0];
                        if (groupHeaderData) {
                            // 2.点击普通的多选框
                            if (addRowKeyCount === 1) {
                                // 2.1.将当前的标题头增加到选中的数据中
                                const allRows = dataSource.filter(d => groupHeaderData.__group === d[groupIdField]).map(d => d[majorKey]);
                                const checkedFlag = allRows.every(k => tempSelectedRowKeys.includes(k));
                                if (!tempSelectedRowKeys.includes(groupHeaderData[majorKey]) && checkedFlag) {
                                    tempSelectedRowKeys = tempSelectedRowKeys.concat(groupHeaderData[majorKey]);
                                    tempSelectedRows = tempSelectedRows.concat(groupHeaderData);
                                }
                            } else {
                                // 2.2.清除未选中的标题头
                                if (tempSelectedRowKeys.includes(groupHeaderData[majorKey])) {
                                    tempSelectedRowKeys = tempSelectedRowKeys.filter(k => k !== groupHeaderData[majorKey]);
                                    tempSelectedRows = tempSelectedRows.filter(r => r[majorKey] !== groupHeaderData[majorKey]);
                                }
                            }
                        }
                    }
                }
            }
        }
        return {
            selectedRowKeys: tempSelectedRowKeys,
            selectedRows: tempSelectedRows,
        }
    };

    _updateSelectedRowsStore = (row, key, value) => {
        const { majorKey = '__key', searchMultiple } = this.props;
        let tempSelectedRowsStore = null;
        if (searchMultiple) {
            tempSelectedRowsStore = [...this.selectedRowsStore];
            tempSelectedRowsStore = tempSelectedRowsStore.map(r => {
                if (r[majorKey] === row[majorKey]) {
                    return {
                        ...r,
                        [key]: value,
                    };
                }
                return r;
            })
        } else {
            tempSelectedRowsStore = this.selectedRowsStore;
            tempSelectedRowsStore.forEach((a, b) => {
                tempSelectedRowsStore.set(b, a.map(d => {
                    if (d[majorKey] === row[majorKey]) {
                        return {
                            ...d,
                            [key]: value,
                        };
                    }
                    return d;
                }));
            });
        }
        this.selectedRowsStore = tempSelectedRowsStore;
    };

    _calcSelectedRowsStore = (keys, setSelected) => {
        if (this.props.searchMultiple) {
            const { majorKey = '__key' } = this.props;
            const tempKeys = keys.map(k => k[majorKey] || k);
            const { selectedRowKeys, dataSource } = this.state;
            if (setSelected){
                this.addSelectedRowsStore(keys);
            } else if (tempKeys.length > selectedRowKeys.length) {
                this.addSelectedRowsStore(tempKeys
                    .filter(r => !selectedRowKeys.includes(r))
                    .map(r => dataSource.filter(d => d[majorKey] === r)));
            } else {
                this.removeSelectedRowsStore(selectedRowKeys.filter(r => !tempKeys.includes(r)));
            }
        } else {
            this.selectedRowsStore.set(this.state.pageIndex, keys)
        }
    };

    removeSelectedRowsStore = (rows) => {
        const { majorKey = '__key' } = this.props;
        const temps = [...rows];
        let tempSelectedRowsStore = [...this.selectedRowsStore];
        temps.forEach(t => {
            tempSelectedRowsStore = tempSelectedRowsStore.filter(r => r[majorKey] !== t);
        });
        this.selectedRowsStore = tempSelectedRowsStore;
    };
    addSelectedRowsStore = (rows) => {
        const temps = [...rows];
        let tempSelectedRowsStore = [...this.selectedRowsStore];
        const { majorKey = '__key' } = this.props;
        temps.forEach(t => {
            const index = tempSelectedRowsStore.findIndex(r => r[majorKey] === t[majorKey]);
            if (index > -1) {
                tempSelectedRowsStore[index] = t;
            } else {
                tempSelectedRowsStore = tempSelectedRowsStore.concat(t);
            }
        });
        this.selectedRowsStore = tempSelectedRowsStore;
    };

    _rowOnChange = (keys, rows) => {
        const { selectedRowKeys, selectedRows } = this._updateRowChange(keys, rows);
        this.props.selectionType === 'multiple' &&
        this.props.majorKey !== '__key' && this._calcSelectedRowsStore(selectedRows);
        this.setState({ selectedRowKeys: selectedRowKeys, selectedRows: selectedRows });
        this.props.onSelectRow && this.props.onSelectRow(selectedRowKeys, selectedRows)
    };

    _adSearchRequest = () => {
        const { dataFormId, params } = this.dataset;
        const { pageSize, dict, adSearchTerm } = this.state;
        const reducedTerm = assistTool.reduceObj(adSearchTerm, dict);
        this.searchType = 'ad';
        return this._getDataList(dataFormId, params, 0, pageSize, reducedTerm)
            .then(() => {
                this.setState({ adSearchTerm: reducedTerm });
            });
    };

    _adSearchTermOnChange = (adSearchTerm) => {
        this.setState({ adSearchTerm: adSearchTerm });
    };

    _quickSearchRequest = (value) => {
        const { dataFormId, params } = this.dataset;
        const { pageSize } = this.state;
        this.searchType = 'quick';
        this.quickParam = value;
        this._getDataList(dataFormId, params, 0, pageSize, null, value);
    };

    _checkSelectBind = (item) => {
        const { selectedRows, dataSource } = this.state;
        const { closeSelection } = this.props;
        if (item.props.disabled) {
            return true;
        } else if (item.props.selectbind) {
            if (typeof item.props.selectbind === 'function') {
                return item.props.selectbind(selectedRows, dataSource);
            } else {
                return (closeSelection || selectedRows.length === 0)
            }
        } else {
            return false;
        }
    };

    _renderBtnContainer = () => {
        const { headerComponents } = this.state;
        const { enableButtonBar } = this.props;
        if (!enableButtonBar) return null;
        return headerComponents.map((item) =>
            React.cloneElement(item, { disabled: this._checkSelectBind(item) }));
    };

    _renderColumns = (text, comp, record, index, column) => {
        const { params, dataFormId } = this.props;
        const { editModeRows, dict,editModeColumns,readonlyModeRows,cellEdit,cellReadyOnly } = this.state;
        const keyArr = editModeRows.map(item => item[this.props.majorKey]);
        const keyArrRead = readonlyModeRows.map(item => item[this.props.majorKey]);
        let editMode = this.state.editMode;
        if (column.code === this.props.majorKey || column.elementUIHint.readonly) editMode = false;
        else {
            if (keyArr.includes(record[this.props.majorKey])) editMode = true;
            else if (editModeColumns.includes(column.code)) editMode = true;
            if (keyArrRead.includes(record[this.props.majorKey])) editMode = false;
            else if (readonlyModeRows.includes(column.code)) editMode = false;
        }
        if (cellEdit.has(record[this.props.majorKey]) && cellEdit.get(record[this.props.majorKey]).includes(column.code)) editMode = true;
        if (cellReadyOnly.has(record[this.props.majorKey]) && cellReadyOnly.get(record[this.props.majorKey]).includes(column.code)) editMode = false;
        const elementUIHint = {
            ...column.elementUIHint,
            decimalDigits: column.decimalDigits,
            multiplier: column.multiplier
        };
        //const value = editMode ? text : assistTool.getDictName(dict, column.code, text, comp);
        return (
            <EditableCell
                key={column.code}
                record={record}
                elementUIHint={elementUIHint}
                comp={comp}
                column={column}
                editable={editMode}
                value={text}
                onChange={value => this._updateRowsHandler(value, record, index, column)}
                options={dict[column.code]}
                help={
                    this.state.validateResult[index]
                    && this.state.validateResult[index].records
                    && this.state.validateResult[index].records[column.code]
                }
                item={{
                    ...column,
                    onNoValidateChange: value => this._onNoValidateChange(value, record, index, column)
                }}
                param={{params,dataFormId}}
            />
        );
    };

    _renderTableRow = (row) => {
        const { rowsTemplate, selectedRowKeys } = this.state;
        const { closeSelection, prefix = 'ro', selectionType, majorKey = '__key', bodyRowRender, viewModel } = this.props;
        const children = row.children;
        const record = children[0].props.record;
        const index = children[0].props.index;
        const item = children[index + 1] && children[index + 1].props;
        const selected = selectedRowKeys.includes(record && record[majorKey]);
        let className = selected ? `ant-table-row  ant-table-row-level-0 ${prefix}-data-table-row-selected`
            : 'ant-table-row  ant-table-row-level-0';
        if (selectionType === 'multiple') className = 'ant-table-row  ant-table-row-level-0';
        const newRow = (
            <tr
                {...row}
                style={{display: record.__hidden ? 'none' : ''}}
                className={className}
                onClick={closeSelection ? null : (e) => this._rowOnClick(e, record)}
            >
                { rowsTemplate && rowsTemplate.has(record[majorKey]) ?
                    children.map((cell, i) => {
                        const template = rowsTemplate.get(record[majorKey]);
                        if(this.cols !== null){
                            if (template && cell.key !== '__i' && cell.key !== 'selection-column' && this.cols.includes(cell.key)) {
                                const ele = cell.props.column.colSource.elementUIHint;
                                return (
                                    <td key={cell.key}>
                                        <div>
                                            <div className={ele.required && !ele.reading ? 'ro-data-table-td-required' : ''}>
                                                {React.cloneElement(template(record[cell.key], record, index + 1),
                                                    {value:record[cell.key],item,rowId:record[majorKey]})}
                                            </div>
                                        </div>
                                    </td>
                                );
                            }
                            return this._renderCheckBox(cell, record);
                        } else {
                            if (template && cell.key !== '__i' && cell.key !== 'selection-column') {
                                return (
                                    <td key={cell.key}>
                                        {template && template(record[cell.key], record, index + 1)}
                                    </td>
                                );
                            }
                            return this._renderCheckBox(cell, record);
                        }
                    }) : children.map(c => this._renderCheckBox(c, record)) }
            </tr>
        );
        if (bodyRowRender && viewModel === 'ListView') {
            const Com = composeRender(bodyRowRender(record, index, newRow));
            return <Com rowComponent={newRow}/>;
        }
        return newRow;
    };

    _renderCheckBox = (cell, record) => {
        const { dataTableType, selectionType  } = this.props;
        const key = cell.key || '';
        if (selectionType === 'multiple' && dataTableType === 'group' &&
            key === 'selection-column' &&
            record && record.__temp) {
            // 如果是分组的多选并且是分组信息那条数据的多选框单元格才需要处理
            // 将行数据传递到多选框的单元格中
            return {
                ...cell,
                props: {
                    ...cell.props,
                    component: (c) => {
                        return this._renderTableCell(c, record);
                    },
                }
            };
        }
        return cell;
    };

    _checkGroupIndeterminate = (recordData) => {
        // ant-checkbox-indeterminate
        const { majorKey, groupIdField } = this.props;
        const { selectedRowKeys, dataSource } = this.state;
        // 获取当前分组下的所有数据
        const allRows = dataSource.filter(d => recordData.__group === d[groupIdField]).map(d => d[majorKey]);
        // 判断是否为半选状态
        const checkedFlag = allRows.every(k => selectedRowKeys.includes(k));
        const indeterminateFlag = allRows.some(k => selectedRowKeys.includes(k)) && !checkedFlag;
        // 该方法用来校验分组是否需要半选
        return indeterminateFlag ? 'ant-checkbox-indeterminate' : '';
    };

    _renderTableCell = (cell, recordData) => {
        let flag = false;
        const { editMode } = this.state;
        const { closeSelection } = this.props;
        const realCell = cell.children[2];
        const cellProps = realCell.props;
        const elementUIHint = cellProps && cellProps.elementUIHint;
        const readonly = (elementUIHint && elementUIHint.readonly) || (cellProps && cellProps.readOnly);
        const record = cellProps && cellProps.record;
        const enableClick = !closeSelection && editMode && record && readonly;
        if (cell.className.includes('ant-table-selection-column') && recordData && recordData.__temp) {
            // 判断该单元格是否是多选框
            flag = true;
        }
        return (
            <td {...cell} onClick={ enableClick ? (e) => this._rowOnClick(e, record) : null}>
                {
                    flag ? cell.children.map((c, index) => {
                        // 如果是多选列表并且是分组列表
                        if (index === 2) {
                            // 提取出多选框，重新设置全选和半选以及
                            return {
                                ...c,
                                props: {
                                    ...c.props,
                                    children: {
                                        ...c.props.children,
                                        props: {
                                            ...c.props.children.props,
                                            className: this._checkGroupIndeterminate(recordData)
                                        }
                                    }
                                }
                            };
                        }
                        return c;
                    }) : cell.children}
            </td>
        );
    };
    _sorterChange = (value) => {
        const { sorter } = this.state;
        const tempSorter = {...sorter};
        delete tempSorter[value.name];
        this.setState({
            sorter: {
                [value.name]: value,
                ...tempSorter
            }
        }, () => {
            const { adSearchTerm } = this.state;
            const { dataFormId, params } = this.dataset;
            this._getDataList(dataFormId, params, undefined, undefined, adSearchTerm);
        });

  };
  _renderTableHeaderRow = (row) => {
    const { headerRender, viewModel, resizeable = true } = this.props;
    const TagName = viewModel === 'ListView' ? 'span' : 'th';
    const { sorter, columns } = this.state;
    let children = row.children;
    const newRow = (
      <tr className={row.className} style={row.style}>
        {
          children.map((child, index) => {
            const column = columns.filter(c => c.key === child.key)[0] || columns[index];
            if (column) {
              column.align = column.colSource && column.colSource.elementUIHint.textAlign;
            }
            if (column && column.sorter) {
              // children = <span>有筛选</span>;
              let off = '';
              if (sorter[column.key]) {
                off = sorter[column.key].sortType;
              }
              const com = <TagName key={column.key + index} rowSpan={child.props.rowSpan} style={child.props.style}>
                <span className="ant-table-header-column">
                  <div className="ant-table-column-sorters">
                    <span className="ant-table-column-title">{column.title}</span>
                    <span className="ant-table-column-sorter">
                      <div title="排序" className="ant-table-column-sorter-inner ant-table-column-sorter-inner-full">
                        <Icon
                          className={`ant-table-column-sorter-up off ${off === 'ASC' ? 'on' : 'off'}`}
                          type="caret-up"
                          title="↑"
                          onClick={() => this._sorterChange({name: column.key, sortType: off === 'ASC' ? '' : 'ASC'})}
                        />
                        <Icon
                          className={`ant-table-column-sorter-up off ${off === 'DESC' ? 'on' : 'off'}`}
                          type="caret-down"
                          title="↓"
                          onClick={() => this._sorterChange({name: column.key, sortType: off === 'DESC' ? '' : 'DESC'})}
                        />
                      </div>
                    </span>
                  </div>
                </span>
              </TagName>;
              return (
                <Tooltip
                  name={column && column.key}
                  title={column.colSource && column.colSource.elementUIHint && column.colSource.elementUIHint.tips}
                  key={column.key + index}
                >
                  {resizeable ? (<Resizeable onResize={child.props.onResize}>{com}</Resizeable>) : com}
                </Tooltip>
              );
            }
            return <Tooltip
              name={column && column.key || index}
              title={column && column.colSource && column.colSource.elementUIHint && column.colSource.elementUIHint.tips}
              key={column && column.key + index || index}>{child}
            </Tooltip>;
          })
        }
      </tr>
    );
    if (headerRender && viewModel === 'ListView') {
      const Com = composeRender(headerRender(this.meta, this.state.dict, newRow));
      return <Com rowComponent={newRow}/>;
    }
    return newRow;
  };

    _renderAdSearch = (params) => {
        const { adSearchColumn } = this.props;
        const { filters, adSearchTerm, dict, openAdSearch, prefix='ro',
            filterTemplate, filterItemTemplate, filterFootVisible } = this.state;
        return (
            <div className={`${prefix}-data-table-adSearch-container`}>
                <AdSearch
                    adSearchColumn={adSearchColumn}
                    filters={filters}
                    adSearchTerm={adSearchTerm}
                    dict={dict}
                    open={openAdSearch}
                    adSearchRequest={this._adSearchRequest}
                    adSearchTermOnChange={this._adSearchTermOnChange}
                    colElements={this.colElements}
                    filterTemplate={filterTemplate}
                    filterItemTemplate={filterItemTemplate}
                    footVisible = {filterFootVisible}
                    clearBtn={this.props.clearBtn}
                    params={params}
                />
            </div>
        );
    };

    _handleTableChange = (pagination) => {
        const { onPageChanged } = this.props;
        const { adSearchTerm } = this.state;
        const { dataFormId, params } = this.dataset;
        onPageChanged && onPageChanged(pagination);
        this._getDataList(dataFormId, params, pagination.current - 1, pagination.pageSize, adSearchTerm);
    };
    _getClassName = (editMode, filters, headerComponents, prefix) => {
        const { buttonFixed = false, nowrap,viewModel } = this.props;
        let tableName = `${prefix}-data-table`;
        if (editMode) {
            tableName = `${prefix}-edit-table`;
        }
        let name = '';
        if (filters && filters.length === 0 && headerComponents && headerComponents.length === 0) {
            name = `${prefix}-data-table-no-buttons-filters`
        }
        let common = `${prefix}-data-table-common`;
        if (buttonFixed) {
            common = '';
        }
        let wrap = '';
        if (nowrap) {
            wrap = `${prefix}-data-table-nowrap`;
        }
        let listType='';
        if(viewModel === 'ListView'){
            listType = `${prefix}-data-list`;
        }
        return `${tableName} ${listType} ${name} ${common} ${wrap}`;
    };
    _renderTable = (table) => {
        return (
            <table
                style={table.style}
                className={table.className}
            >
                {table.children}
                {this.state.tableFooter && this.state.tableFooter()}
            </table>
        );
    };
    // _pageSizeChange = (current,size) => {
    //   const {selectedRowKeys,dataSource} = this.state;
    // };
    handleResize = (index, size) => {
        this.setState(({ columns }) => {
            const nextColumns = [...columns];
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width,
            };
            return { columns: nextColumns };
        });
    };
    getButtonWidth = (buttonOffsetLeft) => {
        if (typeof buttonOffsetLeft === 'string') {
            const tempOffset = parseFloat(buttonOffsetLeft.split('%')[0] || 0);
            return `calc(${100 - tempOffset - 3}% - 35px)`;
        }
        return `calc(100% - ${buttonOffsetLeft + 35}px)`;
    };
    renderHeader = (openAdSearch, hideAdBtn, buttonFixed, params, prefix, filters, size) => {
        const { buttonOffsetTop = 0, buttonOffsetLeft = 0, hiddenSearch = false } = this.props;
        const element = <div
            ref={(instance) => this.tableHeader = instance}
            className={buttonFixed ? `${prefix}-data-table-buttons-fixed ${prefix}-data-table-buttons-fixed${hiddenSearch}`
              : `${prefix}-data-table-buttons-common ${prefix}-data-table-buttons-common${hiddenSearch}`}
            style={{
                top: buttonFixed ? 45 + buttonOffsetTop : 0,
                left: buttonFixed ? 9 + buttonOffsetLeft : 0,
                width: buttonFixed ? this.getButtonWidth(buttonOffsetLeft) : '100%'
            }}
        >
            <div className={`${prefix}-data-table-buttons`}>
                <div>
                    <div className={`${prefix}-data-table-btn-container`}>
                        {this._renderBtnContainer()}
                    </div>
                </div>
                <QuickSearch
                    filters={filters}
                    size={size}
                    quickSearch={this._quickSearchRequest}
                    adBtnState={openAdSearch}
                    hideAdBtn={hideAdBtn}
                    adBtnOnChange={state => this.setState({ openAdSearch: state })}
                />
            </div>
            {this._renderAdSearch(params)}
        </div>;
        if (this.tab && buttonFixed) {
            return ReactDom.createPortal(element, this.tab);
        }
        return React.cloneElement(element);
    };
    _sortableGroupDecorator = (componentBackingInstance) => {
        if (componentBackingInstance) {
            const options = {
                animation: 150,
                draggable: '.ant-table-row',
                onUpdate: (evt) => {
                    const moveArrayPosition = (array = [], moveIndex = 0, toIndex = 0) => {
                        // 数组移动位置
                        const data1 = array[moveIndex];
                        const data2 = array[toIndex];
                        if (data1 && data2) {
                            const tempArray = [...array];
                            // 先将移动的项删除
                            tempArray.splice(moveIndex, 1);
                            // 将移动的项放置
                            tempArray.splice(toIndex, 0, data1);
                            return tempArray;
                        }
                        return array;
                    };
                    const { dataSource } = this.state;
                    const { newIndex, oldIndex } = evt;
                    this.setState({
                        dataSource: moveArrayPosition(dataSource, oldIndex, newIndex)
                    });
                },
            };
            Sortable.create(componentBackingInstance, options);
        }
    };
    _getBodyWrapper = (body) => {
      const { dataSource, columns } = this.state;
      const { bodyRender, viewModel, sortName } = this.props;
      const attribs = {
        ref: sortName && this._sortableGroupDecorator,
        className: `${body.className}${sortName ? ' rc-draggable-attribute' : ''}`
      };
      if (viewModel === 'ListView' && bodyRender) {
        const Com = composeBodyRender(React.cloneElement(bodyRender(dataSource), attribs));
        return <Com dataSource={dataSource} columns={columns}/>;
      }
      return (
          <tbody {...attribs}>
            {body.children}
          </tbody>
      );
    };
    render() {
        const { filters, pageIndex, pageSize, totalCount, loading,
            columns, dataSource, selectedRowKeys, openAdSearch, headerComponents, editMode } = this.state;
        const { size, prefix = 'ro', containerStyle, showPagination, resizeable,
            closeSelection, selectionType, majorKey, hideAdBtn, type, buttonFixed = false,
            params, pageSizeOptions, simpleTable = false,viewModel, headerRender } = this.props;
        return (
            <div style={{...containerStyle, position: 'relative'}} ref={instance => this.tableInstance = instance}>
                {this.renderHeader(openAdSearch, hideAdBtn, buttonFixed, params, prefix, filters, size)}
                <RoEasyTable
                    {...this.props}
                    showHeader={!(viewModel === 'ListView' && !headerRender)}
                    ref={(instance) => this.tableInstance = instance}
                    className={this._getClassName(editMode, filters, headerComponents, prefix)}
                    size={size || 'small'}
                    loading={loading}
                    columns={columns.map((col, index) => ({
                        ...col,
                        onHeaderCell: column => {
                            const props = {
                                type: 'header',
                                viewModel,
                            };
                            if (resizeable) {
                                props.onResize = size => this.handleResize(index, size);
                                props.isLast = columns.length === index + 1;
                            }
                            return props;
                        },
                        onCell: record => ({viewModel, type: 'body'}),
                    })) || columns}
                    dataSource={dataSource}
                    rowKey={record => record[majorKey]}
                    components={{
                        table: this._renderTable ,
                        body: {  wrapper: this._getBodyWrapper,
                            row: (simpleTable || dataSource.length === 0) ? undefined : this._renderTableRow, cell: ReplaceTableCell },
                        header: { row: this._renderTableHeaderRow, cell: resizeable ? ResizeableTitle : ReplaceTableCell}
                    }}
                    pagination={showPagination && pageSize !== 0 ? {
                        pageSizeOptions: pageSizeOptions,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        defaultCurrent: 1,
                        total: totalCount,
                        pageSize: pageSize,
                        current: pageIndex + 1,
                        // onShowSizeChange:this._pageSizeChange
                    } : false}
                    rowSelection={!closeSelection && selectionType === 'multiple' ? {
                        type: type ? type : 'checkbox',
                        selections: true,
                        selectedRowKeys: selectedRowKeys,
                        onChange: this._rowOnChange,
                    }: null}
                    onChange={this._handleTableChange}
                    title={this.state.title}
                    footer={this.state.footer}
                    scroll={{x: this.props.nowrap,...(this.props.scroll || {})}}
                />
            </div>
        )
    }
}

export default DataList;
