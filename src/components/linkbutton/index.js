import React from 'react';

import { Button } from '../index';
import './style/index.less';

export default class LinkButton extends React.Component{
  render() {
    const { prefix = 'ro', className, ...restProps } = this.props;
    // 此处需要修改按钮的样式
    let tempClassName = `${prefix}-link-button`;
    if (className) {
      tempClassName += ` ${className}`;
    }
    return <Button {...restProps} prefix={prefix} type="link" className={tempClassName}/>;
  }
}
