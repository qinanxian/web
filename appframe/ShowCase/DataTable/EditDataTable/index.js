import React from "react";

import {DataTable, DetailInfo,Message,EmbedModal} from '../../../../src/components';

/**
 * 个人信息详情组件
 */
export class PersonInfo extends React.Component {
  render() {
    const {param} = this.props;
    return (
      <DetailInfo dataFormId="demo-PersonTwoColInfo" params={{id: param.personId}}/>
    );
  }
}

export default class EditDataTable extends React.Component {
  constructor(props) {
    super(props);
  }

  static PersonInfo = PersonInfo;

  /**
   * 表格源数据（表头信息）加载完成后，调用
   * @param formList
   */
  formReady = (formList) => {
    formList.addButton([
      {name: '详情', type: 'primary', icon: 'file-text', onClick: () => this.openPersonInfo()},
      {name: '保存所有', type: 'primary', icon: 'save', onClick: () => this.savePage()},
      {name: '保存选中', type: 'primary', icon: 'save', onClick: () => this.saveSelectedRows(), selectBind: true},
      {name: '删除选中', type: 'primary', icon: 'delete', onClick: () => this.deleteSelectedRows(), selectBind: true},
      {name: '添加', type: 'primary', icon: 'delete', onClick: () => this.addRows()}
    ]);
  };
  /**
   * 表格数据加载完成后，调用
   * @param dataList
   */
  dataReady = (dataList) => {
    this.dataList = dataList;
    dataList.setSelectedRows(dataList.getSelectedRows().concat(["0901"]));
    //设置列表中的内置按钮，
    // 参数一是列属性名，
    // 参数三是在当前列的第几行添加内置按钮(属性名与majorKey保持一直)，如果不传表示整列都添加
    dataList.setEmbedButton(['name'],() => {
      return (
        <EmbedModal
          dataTable={{
            dataFormId:'demo-BeanPersonList',
            params:{code: 'BeanPersonList'}
          }}
          modal={{
            title: '内置按钮对话框',
            onOk: (e,row,rowId) => {
              if(row[0]){
                //构造要替换的列表属性及属性值
                const resetData = {name:row[0].name,gender:row[0].gender};
                dataList.setDataRow(resetData,rowId);
              }else{
                Message.error('请选择一行');
              }
            }
          }}
        />
      );
    },[{id:'04'},{id:'07'}]);
  };

  savePage = () => {
    this.dataList.saveData()
      .then(()=>{
        Message.success('保存成功');
      });
  };
  saveSelectedRows = () => {
    //const allData = this.volist.getData();
    //const selectedData = this.volist.getAllSelectedRows();
    //const selectIds = selectedData.map((item) => item.id);
    //console.log(JSON.stringify(selectIds));
    //const realData = allData.filter((item) => selectIds.find((value, index, arr) => {
    //    return value === item.id;
    //}));
    //console.log(JSON.stringify(realData));

    const dataList = this.dataList.getSelectedRows();
    this.dataList.saveData(dataList)
      .then(()=>{
        Message.success('保存成功');
      });
  };
  deleteSelectedRows = () => {
    const dataList = this.dataList.getSelectedRows();
    this.dataList.deleteRows(dataList);
  };
  openPersonInfo = () => {
    const record = this.dataList.getSelectedRow();
    if(!record){
      Message.error('请选择一行')
    }
    const {flexTabs} = this.props;
    flexTabs.open(`${record.name}的详情`, 'ShowCase/DataTable/BaseSimpleTable/PersonInfo', {personId: record.id});
  };
  addRows = () => {
    this.dataList.addRow({});
  };
    handleChange = (a,b,c) => {
      console.log('rkxir',a,b,c);
    }
  render() {
    return (
      <DataTable
        dataFormId="demo-EditBeanPersonList"
        dataReady={this.dataReady}
        formReady={this.formReady}
        selectionType="multiple"
        editMode={true}
        // majorKey='id'
        onChange={this.handleChange}
      />
    );
  }
}
