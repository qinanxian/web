import React from 'react';
import * as config from '../../src/lib/config';

export default class ErrorPage extends React.Component{
  componentDidMount() {
    const { setHeight } = this.props;
    setHeight && setHeight();
  }

  _refresh = () => {
    const { refresh } = this.props;
    if (refresh) {
      refresh();
    } else {
      window.location.reload();
    }
  };
  _back = () => {
    const { getLocationURL, back } = this.props;
    if (back) {
      back();
    } else {
      window.location.href = getLocationURL(`/main.html`);
    }
  };
  render() {
    const { prefix = 'ro', style } = this.props;
    return (<div className={`${prefix}-error-page-container`} style={style}>
      <div className={`${prefix}-error-page-container-img`}>{}</div>
      <div className={`${prefix}-error-page-container-content`}>
        <div className={`${prefix}-error-page-container-content-message`}>
          <span>可能原因：</span>
          <ul>
            <li>网络不好</li>
            <li>找不到请求的界面</li>
            <li>输入的网址不正确</li>
            <li>页面出错</li>
          </ul>
        </div>
        <div className={`${prefix}-error-page-container-content-opt`}>
          <span onClick={this._refresh}>刷新</span><span onClick={this._back}>返回</span>
        </div>
      </div>
    </div>);
  }
}
