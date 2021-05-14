import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

import { Spin, openModal, FlexTabs } from '../../src/components';
import * as rest from '../../src/lib/rest';
import * as listener from '../../src/lib/listener';
import * as cache from '../../src/lib/cache';
import * as permission from '../lib/permission';

export const propsCompose = (Com, context) => {
  /* eslint-disable */
  if (context) {
    Com.childContextTypes = context;
  }
  class ComposeCom extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        tabWidth:0,
      };
      this.permission = permission.getCurrentPermission();
      this.hasPermit = permission.hasPermit;
    }
    // 获取真实的组件
    getCurrentComponent = () => {
      return this.instance;
    };
    _open = (name, url, param) => {
      const flexTabs = cache.getCache('flexTabs');
      const pageType = cache.getItem('pageType');
      if (pageType === 'tabs' || pageType === 'spa') {
        return flexTabs && flexTabs.createTab(name, url, param);
      }
      return FlexTabs.openNewTab(name, url, param);
    };
    _openIframe = (name, url, param) => {
      const flexTabs = cache.getCache('flexTabs');
      const pageType = cache.getItem('pageType');
      if (pageType === 'tabs' || pageType === 'spa') {
        return flexTabs && flexTabs.createIframeTab(name, url, param);
      }
      return FlexTabs.createIframeWindow(name, url, param);
    };
    _close = (id) => {
      const flexTabs = cache.getCache('flexTabs');
      const pageType = cache.getItem('pageType');
      if (pageType === 'tabs' || pageType === 'spa') {
        return flexTabs && flexTabs.closeTab(id);
      }
      return FlexTabs.closeWindow(id);
    };
    _getTabs = () => {
      const flexTabs = cache.getCache('flexTabs');
      const pageType = cache.getItem('pageType');
      if (pageType === 'tabs' || pageType === 'spa') {
        return flexTabs && flexTabs.getTabs();
      }
      return FlexTabs.getWindows();
    };
    _goToTab = (id) => {
      const flexTabs = cache.getCache('flexTabs');
      const pageType = cache.getItem('pageType');
      if (pageType === 'tabs' || pageType === 'spa') {
        return flexTabs && flexTabs.goToTab(id);
      }
      return FlexTabs.goToWindow(id);
    };
    _refresh = (id) => {
      const flexTabs = cache.getCache('flexTabs');
      const pageType = cache.getItem('pageType');
      if (pageType === 'tabs' || pageType === 'spa') {
        return flexTabs && flexTabs._refreshTab(id);
      }
      return FlexTabs._refreshWindow(id);
    };
    widthChange = (a) => {
      this.setState({tabWidth:a});
    };
    _getTabComponent = (id) => {
      // 暂时不支持浏览器的tab之间的获取
      return cache.getCache(id || this.id) || {};
    };
    _enlarge = (id, isDomId, isFullScreen, showCloseIcon) => {
      const flexTabs = cache.getCache('flexTabs');
      const pageType = cache.getItem('pageType');
      if (pageType === 'tabs' || pageType === 'spa') {
        return flexTabs && flexTabs._enlarge(id, isDomId, isFullScreen, showCloseIcon);
      }
    };
    _getPreOpener = (index) => {
      const flexTabs = cache.getCache('flexTabs');
      const pageType = cache.getItem('pageType');
      if (pageType === 'tabs' || pageType === 'spa') {
        return flexTabs && flexTabs._getPreOpener(index);
      }
    };
    _getNavNames = () => {
      const flexTabs = cache.getCache('flexTabs');
      const pageType = cache.getItem('pageType');
      if (pageType === 'tabs' || pageType === 'spa') {
        return flexTabs && flexTabs._getNavNames();
      }
    };
    render() {
      return (
        <Spin spinning={false}>
          <Com
            flexTabs={{
              open: this._open,
              openIframe: this._openIframe,
              close: this._close,
              getTabs: this._getTabs,
              goToTab: this._goToTab,
              refresh: this._refresh,
              getTabComponent: this._getTabComponent,
              enlarge: this._enlarge,
              getPreOpener: this._getPreOpener,
              getNavNames: this._getNavNames
            }}
            ref={instance => this.instance = instance}
            rest={rest}
            listener={listener}
            openModal={openModal}
            tabWidth={this.state.tabWidth}
            permission={this.permission}
            hasPermit={this.hasPermit}
            {...this.props}
          />
        </Spin>
      );
    }
  }
  hoistNonReactStatics(ComposeCom, Com);
  return ComposeCom;
};

export const propsComposeWidthContext = context => (Com) => {
  return propsCompose(Com, context);
};
