import React from 'react';

import { DetailInfo, Input } from '../../../../src/components';

class Test extends React.Component {
  render() {
    const { value } = this.props;
    return <div>{value}</div>;
  }
}

export default class Group extends React.Component {
    dataReady = (dataInfo) => {
    dataInfo.setValue('chnName', 'test');
    // 方式 1
    dataInfo.setItemTemplate('chnName', (value, item) => {
      // 这种方式的赋值使用defaultValue防止警告
      return (<div><Input defaultValue={value}/></div>)
    });
    // 方式 2
    dataInfo.setItemTemplate('engName', <div>这是一个被替换的列</div>);
    // 方式 3
    dataInfo.setItemTemplate('height', <Test />);
  };
  render() {
    return (
      <DetailInfo dataFormId="demo-PersonGroupInfo"  params={{id: 1}} dataReady={this.dataReady} navigationLeft/>
    );
  }
}

