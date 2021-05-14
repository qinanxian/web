import React from 'react';
import {DetailInfo, Message,DataTablePicker} from '../../../src/components';

export default class DossierItemInfo extends React.Component {
  constructor(props) {
    super(props);
    this.dossierDefKey = props.dossierDefKey;
    this.itemDefKey = props.itemDefKey;
  }


  dataReady = (voinfo) => {
    this.voinfo = voinfo;
    if (!this.itemDefKey) {
      this.voinfo.setValueReadonly('itemDefKey', false);
      this.voinfo.setValue('importance', 'MUST');
      this.voinfo.setValue('itemStatus', 'VALID');
    }
    this.voinfo.setValue('dossierDefKey', this.dossierDefKey);
    // this.voinfo.setItemSuffix('itemGroup', (value, item) => {
    //   return this.appendModalInput();
    // });
  };

  appendModalInput = () => {
    return (
      <DataTablePicker
        dataFormId= "configuration-DocListGroupList"
        params={{dossierDefKey: this.dossierDefKey}}
        title= '选择文档清单分组'
        onOk={(e, row) => {
          row && this.voinfo.setData({
            itemGroup:row.itemGroup
          });
        }}
      />);
  };

  docListItemInfoSave = (cb) => {
    this.voinfo.saveData((err, values) => {
      if (err) {
        Message.error('保存失败！');
      } else {
        const {refresh} = this.props;
        refresh && refresh();
      }
      cb(err, values);
    });
  };

  render() {
    return (
        <DetailInfo
          dataFormId="configuration-DossierItemInfo"
          dataReady={this.dataReady}
          params={{dossierDefKey: this.dossierDefKey, itemDefKey: this.itemDefKey,operation:this.props.operation}}
          labelWidth={100}
        />
    );
  }
}
