import React from 'react';

import { DetailInfo } from 'roface';
import {Message} from "../../../src/components";

export default class PolcDefinitionBaseInfoEditor extends React.Component{
  formReady = (voInfo) => {
   this.voInfo = voInfo;
  };
  savePolcInfo = (cb) => {
    this.voInfo.saveData((err, values) => {
      if (err) {
        Message.info('保存失败！');
      }
      cb(err, values);
    });
  };
  render(){
    return (
      <DetailInfo
        dataFormId="configuration-PolcDefinitionBaseDetailInfo"
        params={{policyId: this.props.policyId}}
        formReady={this.formReady}
      />
    );
  }
}