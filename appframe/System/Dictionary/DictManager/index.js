import React from "react";

import {Row, Col, Tree, DataTable, Message, Modal, openModal} from '../../../../src/components';
import DictInfo from "./DictInfo";
import DictItemList from "./DictItemList";
import EditableParamItemTree from '../../../Common/EditableParamItemTree';
import {getParamItemsTree} from '../../../../src/lib/base';

export default class DictManager extends React.Component {

  static DictInfo = DictInfo;
  static DictItemList = DictItemList;

  constructor(props) {
    super(props);
    this.state = {
      dictCode: null,
      dictCategory: '_ALL_',
      dataSource: [],
      dictTabDisplayType: 'none'
    };

    this.reloadTree();
  }

  reloadTree = () => {
    const {openLoading, closeLoading} = this.props;
    openLoading();
    getParamItemsTree('DictCategoryTree').then((data) => {
      this.setState({dataSource: data});
      closeLoading();
    });
  };

  formReady = (voList) => {
    this.voList = voList;
    this.voList.addButton([{
      name: '新增',
      onClick: () => this.openDictInfoModal(null, '新增数据字典')
    }, {
      selectBind: true,
      name: '删除',
      onClick: this.deleteDict
    }]);
    this.voList.setColumnTemplate('name', (text, record, i) => {
      return (<a onClick={() => this.openDictInfoModal(record.code, '查看数据字典')}>{text}</a>);
    });
  };


  selectRow = (key, rows) => {
    if(rows!=''){
      this.setState({dictCode: rows[0].code, dictTabDisplayType: ''});
    }
  };

  openDictInfoModal = (dictCode, title) => {
    // Modal.info({
    //   title: '温馨提示',
    //   content: '数据字典的配置已经移动到工具AmixBuilder，如果您没有该工具，请联系研发部',
    // });
    openModal(<DictInfo/>, {
      title: title,
      dictCode: dictCode,
      width: '35%',
      dictCategory: this.state.dictCategory,
      defaultButton: true,
      refresh: this.tableRefresh,
      onOk: (a, b) => {
        b.dictInfoSave((err, value) => {
          if (!err) {
            a.close();
          }
        });
      }
    });
  };

  deleteDict = () => {
    // Modal.info({
    //   title: '温馨提示',
    //   content: '数据字典的配置已经移动到工具AmixBuilder，如果您没有该工具，请联系研发部',
    // });
    const selectedRows = this.voList.getSelectedRows();
    Modal.confirm({
      title: '删除确认',
      content: `您确定删除[${selectedRows[0].name}]吗？删除后数据不可恢复！`,
      onOk: () => {
        this.voList.deleteRows(selectedRows);
      }
    });
  };

  tableRefresh = () => {
    this.setState({dictCode: null, dictTabDisplayType: 'none'});
    this.voList.refresh();
  };

  treeOnSelect = (selectedKeys, info) => {
    if (!selectedKeys[0]) {
      this.setState({dictCategory: '_ALL_'});
    } else {
      this.setState({dictCategory: selectedKeys[0], dictCode: null, dictTabDisplayType: 'none'});
    }
  };

  render() {
    return (
        <div>
          <Row>
            <Col span={3}>
              <EditableParamItemTree
                  title={'数据字典树图管理'}
                  paramCode={'DictCategoryTree'}
                  reloadTree={this.reloadTree}
              />
              <div>
                <Tree
                    showLine
                    defaultExpandedKeys={['_ALL_']}
                    defaultSelectedKeys={['_ALL_']}
                    onSelect={this.treeOnSelect}
                    dataSource={this.state.dataSource}
                    nodeTitle="value.name" nodeKey="value.code" childrenKey="children">
                </Tree>
              </div>
            </Col>

            <Col span={20}>
              <Row>
                <DataTable
                    dataFormId="system-DictList"
                    params={{dictCategory: this.state.dictCategory}}
                    formReady={this.formReady}
                    onSelectRow={this.selectRow}
                    pageSize={5}
                />
              </Row>
              <Row>
                <div style={{display: this.state.dictTabDisplayType}}>
                  <DictItemList dictCode={this.state.dictCode}/>
                </div>
              </Row>
            </Col>
          </Row>
        </div>
    );
  }
}