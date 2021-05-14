/**
 * Created by hjtu (hjtu@amarsoft.com) on 2018/1/3.
 */
import React from 'react';
import { Switch } from 'antd';

class DetailToggle extends React.Component {
  render() {
    return (
      <span>
        <span style={{ fontSize: 'small', color: '#1890ff', fontWeight: 'bold' }}>高级搜索</span>&nbsp;
        <Switch checkedChildren="开" unCheckedChildren="关" onChange={this.props.onChange} />
      </span>
    );
  }
}
export default DetailToggle;
