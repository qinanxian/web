import React from "react";

import { DataTable, Message, Notify, Upload, Download, propsCompose } from '../../../../src/components';

@propsCompose
export default class FileList extends React.Component {
  formReady = (formList) => {
    this.formList = formList;
    this.formList.setColumnTemplate('operator', (text, record, i ) => {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
          <Upload
            style={{ whiteSpace: 'nowrap', margin: '2px' }}
            action={`/showcase/FileOperateControllerDemo/updatePersonFile/${record.id}/${record.fileId}`}
            onChange={this.upload}
            name={"上传"}
            buttonType={'a'}
            multiple={true}
          />
          <Upload
            style={{ whiteSpace: 'nowrap', margin: '2px' }}
            action={`/showcase/FileOperateControllerDemo/updatePersonFile/${record.id}/${record.fileId}`}
            onChange={this.upload}
            name={"更新"}
            buttonType={'a'}
          />
          <Download
            style={{ whiteSpace: 'nowrap', margin: '2px' }}
            action={`/showcase/FileOperateControllerDemo/downloadPersonFile/${record.fileId}`}
            onChange={this.upload}
            name={"下载"}
            buttonType={'a'}
          />
      </div>);
    });
  };

  upload = (fileStatus) => {
    if (fileStatus === "done"){
      Notify.info('上传成功');
      this.tableRefresh();
    }else if(fileStatus === "uploading"){

    } else {
      Notify.info('上传失败');
    }

  };

  tableRefresh = () => {
    this.volist && this.volist.refresh();
  };

  render() {
    return (
      <div>
        <DataTable
          dataFormId="demo-PersonListFile"
          formReady={this.formReady}
        />
      </div>
    );
  }
}