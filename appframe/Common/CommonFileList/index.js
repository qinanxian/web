/**
 * 资料清单列表，带分组，带批量
 */
import React from "react";

import {
  Message, DataTable, Modal, Download, Icon, propsCompose, Notify,
} from '../../../src/components';

@propsCompose
export default class CommonFileList extends React.Component {

  constructor(props) {
    super(props);
  }
  formReady = (voList) => {
    this.voList = voList;
  };

  dataReady = (voList) => {
    const column = {
      title: '操作',
      key: 'buttonComponent',
      sortCode: '0000',
      width: 80,
      render: (text, record, index) =>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
          <Download
            action={`/common/FileOperateController/downloadFile/${record.fileId}`}
            disable={record.fileId ? 'false' : 'true'}
            beforeDownload={() => this.beforeDownloadFile(record)}
            buttonType={'a'}
          />
          <Icon
            type="delete"
            disable={(record.itemCode) || (this.readOnly) || (record.itemReading && record.itemReading === 'true') ? 'true' : 'false'}
            onClick={() => this.deleteItem(record)}/>
        </div>
    };
    voList.addColumn(column);
    voList.setColumnTemplate('fileSize', (text, record) => {
      return <div>{(text / 1024).toFixed(2)}kb</div>;
    });
    voList.setColumnTemplate('fileId', (text, record) => {
      return <a onClick={() => this.showFile(record)}>{text}</a>;
    });
  };

  beforeDownloadFile = (record) => {

  };

  showFile = (record) => {

  };

  deleteItem = (record) => {
    const that = this;
    Modal.confirm({
      title: '删除确认',
      content: `确定删除文件[${record.name}]吗？删除不可恢复！`,
      onOk: () => {
        that.voList.deleteRows([record]);
      },
    })
  };

  render() {
    return (
      <DataTable
        dataFormId={'common-CmonFileList'}
        formReady={this.formReady}
        dataReady={this.dataReady}
      />
    );
  }
}