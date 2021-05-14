import React from 'react';

import {DetailInfo, Message} from '../../../src/components';

export default class ProductDefinitionInfo extends React.Component{
  dataReady = (voInfo) => {
    this.voInfo = voInfo;
  };
  saveProductDefinition = (cb) => {
    this.voInfo.saveData((err, values) => {
      if (err) {
        Message.error('保存失败！');
      }
      cb && cb(err, values);
    });
  };
  render(){
    const { policyId } = this.props;
    return (<DetailInfo
      dataFormId="configuration-PolcDefinitionInfo"
      params={{policyId:this.props.policyId}}
      dataReady={this.dataReady}
    />);
  };
}