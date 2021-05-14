import React from 'react';

import './style/index.less';

export default class NotFound extends React.Component {
  goBack = () => {
    const { flexTabs } = this.props;
    flexTabs.goToTab();
  };
  render() {
    const { prefix = 'ro' } = this.props;
    return (
      <div className={`${prefix}-not-found-container`}>
        <div className={`${prefix}-not-found-container-img`}>{}</div>
        <div className={`${prefix}-not-found-container-content`}>
          <div className={`${prefix}-not-found-container-content-header`}><h1>找不到你要找的页面</h1></div>
          <div className={`${prefix}-not-found-container-content-back`} onClick={this.goBack}>返回首页</div>
        </div>
      </div>
    );
  }
}

