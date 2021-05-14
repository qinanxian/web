import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';

import { Spin, FlexTabs, AdditionalNavigation } from '../../src/components';
import ErrorPage from './ErrorPage';
import * as rest from '../../src/lib/rest';
import { addOnResize } from '../../src/lib/listener';
import { developCompose } from "../../src/components/developcompose/developCompose";
import * as cache from '../../src/lib/cache';
import config from '../../src/lib/config';
import * as permission from '../../src/lib/permission';
import './style/index.less';

const showBreadcrumb = config.showBreadcrumb;
const pageStyle = config.surface.defaultOptions.pageStyle;

export const compose = (Com, flexTabs, comProps, tab) => {
  class ComposeCom extends React.Component {
    constructor(props){
      super(props);
      this.flag = true;
      this.update = false;
      const { history, param = {} } = comProps;
      const { location } = history;
      const paramStr = decodeURIComponent(atob(location.search.replace(/^\?/g, '')));
      this.param = this.obtainParam(param,paramStr && JSON.parse(paramStr));
      this.state = {
        spinning: false,
        refresh: false,
        error: false,
      };
      this.fucs = {};
      this.comData = {};
      this.permission = permission.getCurrentPermission();
      this.hasPermit = permission.hasPermit;
    }
    componentDidMount(){
      /* eslint-disable */
      this.dom = ReactDom.findDOMNode(this);
      this._setComHeight();
      addOnResize(this._checkWidth);

      // 将tab内的组件放到内存中
      // 提供下次根据id去获取
      const instance = this.getInstance();
      // 需要判断instance还是高阶组件的ref
      cache.setCache(this.id, this._getRealInstance(instance));
    };
    obtainParam(param,paramStr){
      const timbP = JSON.parse(cache.getItem('timb'));
      if(!paramStr){
        return param;
      }
      let paramData = {};
      timbP.forEach(fit => {
          if (fit[paramStr['__id']]) {
              paramData = fit[paramStr['__id']];
          }
      });
      if (Object.keys(paramData).length !== 0) {
        return {...paramData,...paramStr,...param};
      }
      if (Object.keys(paramData).length === 0) {
        return {...paramStr,...param};
      }
    }
    renderAnchor = (type, groups, blockId, dom, position, offsetTop, offsetLeft) => {
      // 获取到各个层级的数据绘制导航界面
      // 不使用state防止整个tab进行无意义的渲染，通过附加导航的内部渲染优化处理
      this.navigation &&
      this.navigation.update && this.navigation.update(type, groups, blockId, dom, this.param.__id, position, offsetTop, offsetLeft);
    };
    widthChangeAddListen = (name, fuc) => {
      // 接收方法名和方法作为监听
      // 方法名必须唯一
      this.fucs[name] = fuc;
    };
    widthChangeRemoveListen = (name) => {
      this.fucs[name] = null;
    };
    comDataChange = (comId, status) => {
      if (!status) {
        delete this.comData[comId];
      } else {
        this.comData[comId] = status;
      }
    };
    execWidthChange = (width, height) => {
      Object.keys(this.fucs).forEach(name => {
        if (this.fucs[name]) {
          this.fucs[name](width, height);
        }
      })
    };
    getChildContext(){
      return {
        flexTabs:{
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
        },
        rest: rest,
        closeLoading: this.closeLoading,
        openLoading: this.openLoading,
        param: this.param,
        params: this.param,
        refresh: this.props.refresh,
        renderAnchor: this.renderAnchor,
        widthChangeAddListen: this.widthChangeAddListen,
        widthChangeRemoveListen: this.widthChangeRemoveListen,
        comDataChange: this.comDataChange,
        permission: this.permission,
        hasPermit: this.hasPermit,
      };
    }
    componentDidCatch(){
      this.update = true;
      this.setState({
        error: true,
      });
    }
    shouldComponentUpdate(){
      return this.update;
    }
    componentWillReceiveProps(nextProps) {
      if (this.props.refreshStatus !== nextProps.refreshStatus && !this.state.spinning) {
        // 点击了刷新按钮
        if (this._checkRefreshId(nextProps.tabItem.__id, nextProps.refreshId)) {
          this.refresh();
        }
      }
      if (this.props.menuWidth !== nextProps.menuWidth) {
        // 菜单宽度发生变化需要触发组件的widthChange方法
        const comWidth = document.documentElement.clientWidth - nextProps.menuWidth - 14;
        const instance = this.getInstance();
        instance && instance.widthChange
        && instance.widthChange(comWidth);
        if (this.dom) {
          this.dom.style.width = comWidth + 'px';
        }
        // 触发全局的宽度变化监听方法
        this.execWidthChange(comWidth);
      }
      if (nextProps.dashButton.collapse !== this.props.dashButton.collapse || nextProps.dashButton.refresh) {
        if (nextProps.activeTabId === nextProps.tabItem.__id) {
          const instance = this.getInstance();
          instance && instance.resetState && instance.resetState(nextProps.dashButton);
        }
      }
      if ((nextProps.activeTabId === nextProps.tabItem.__id) && (this.props.activeTabId !== nextProps.activeTabId)) {
        this.execWidthChange();
      }
      if (this.props.pageType !== nextProps.pageType) {
        this._setComHeight();
      }
    }
    componentWillUnmount() {
      this.unMount = true;
      if (this.dom) {
        this.dom.onscroll = null;
      }
      cache.deleteCache(this.id);
    }
    componentDidUpdate(){
      this._setComHeight();
      // 界面重新渲染后组件需要重新更新，不能使用缓存
      const instance = this.getInstance();
      instance && cache.setCache(this.id, this._getRealInstance(instance));
    }
    _getRealInstance = (instance) => {
      if (instance.getCurrentComponent) {
        return this._getRealInstance(instance.getCurrentComponent());
      }
      return instance;
    };
    _checkRefreshId = (id, refreshId) => {
      if (refreshId) {
        if (Array.isArray(refreshId)) {
          return refreshId.includes(id);
        }
        return id === refreshId;
      }
      return false;
    };
    refresh = () => {
      if (this.dom) {
        this.dom.onscroll = null;
      }
      this.update = true;
      this.setState({
        refresh: true,
        spinning: true
      }, () => {
        this.setState({
          refresh: false,
          spinning: false
        }, () => {
          this.update = false;
        })
      })
    };
    _checkWidth = () => {
      if (this.flag) {
        this.flag = false;
        setTimeout(() => {
          this._setComHeight();
          this.flag = true;
        }, 100)
      }
    };
    _setComHeight = () => {
      // 获取最新的DOM节点
      if (!this.unMount) {
        this.dom = ReactDom.findDOMNode(this);
        const instance = this.getInstance();
        if (this.props.enlarge) {
          const height = document.documentElement.clientHeight;
          const width = document.documentElement.clientWidth;
          this.dom.style.height = height + 'px';
          this.dom.style.width = width + 'px';
          instance && instance.widthChange &&
          instance.widthChange(width, height);
          // 触发全局的宽度变化监听方法
          this.execWidthChange(width, height);
        } else {
          // 设置flextabs中tabContent组件内容的显示高度
          const subNum = pageStyle === 'v3' ? '20' : 0;
          const showBreadcrumbHeight = showBreadcrumb ? 0 : 32;
          const height = (document.documentElement.clientHeight - ((tab && tab.param && tab.param.noMenu) ? 0 : 100)) - subNum
            - 14;
          if (this.dom) {
            this.dom.style.height = height + showBreadcrumbHeight + 'px';
          }
          // 浏览器宽度变化需要触发组件宽度变化的方法
          const { menuWidth = 0 } = this.props;
          const comWidth = document.documentElement.clientWidth - menuWidth - 14;
          instance && instance.widthChange &&
          instance.widthChange(comWidth, height);
          if (this.dom) {
            this.dom.style.width = (comWidth) + 'px';
          }
          // 触发全局的宽度变化监听方法
          this.execWidthChange(comWidth, height);
        }
      }
    };
    getInstance = () => {
      const instance = this.form || this.instance;
      if (instance) {
        instance.getComData = this.getComData;
      }
      return instance;
    };
    getComData = () => {
      return this.comData;
    };
    closeLoading = () => {
      this.update = true;
      this.setState({
        spinning: false
      }, () => {
        this.update = false;
      })
    };
    openLoading = (tip) => {
      this.update = true;
      this.setState({
        tip,
        spinning: true
      }, () => {
        this.update = false;
      })
    };
    _open = (name, url, param) => {
      const pageType = cache.getItem('pageType');
      if (pageType === 'tabs' || pageType === 'spa') {
        return flexTabs && flexTabs.createTab(name, url, param);
      }
      return FlexTabs.openNewTab(name, url, param);
    };
    _openIframe = (name, url, param) => {
      const pageType = cache.getItem('pageType');
      if (pageType === 'tabs' || pageType === 'spa') {
        return flexTabs && flexTabs.createIframeTab(name, url, param);
      }
      return FlexTabs.createIframeWindow(name, url, param);
    };
    _close = (id) => {
      const pageType = cache.getItem('pageType');
      if (pageType === 'tabs' || pageType === 'spa') {
        return flexTabs && flexTabs.closeTab(id);
      }
      return FlexTabs.closeWindow(id);
    };
    _openNewWindow = (name, url, param) => {
      return FlexTabs.openNewTab(name, url, param);
    };
    _openNewWindowIframe = (name, url, param) => {
      return FlexTabs.createIframeWindow(name, url, param);
    };
    _getTabs = () => {
      const pageType = cache.getItem('pageType');
      if (pageType === 'tabs' || pageType === 'spa') {
        return flexTabs && flexTabs.getTabs();
      }
      return FlexTabs.getWindows();
    };
    _goToTab = (id) => {
      const pageType = cache.getItem('pageType');
      if (pageType === 'tabs' || pageType === 'spa') {
        return flexTabs && flexTabs.goToTab(id);
      }
      return FlexTabs.goToWindow(id);
    };
    _refresh = (id) => {
      const pageType = cache.getItem('pageType');
      if (pageType === 'tabs' || pageType === 'spa') {
        return flexTabs && flexTabs._refreshTab(id);
      }
      return FlexTabs._refreshWindow(id);
    };
    _getTabComponent = (id) => {
      // 暂时不支持浏览器的tab之间的获取
      // 增加空对象，防止实例不存在时报错
      return cache.getCache(id || this.id) || {};
    };
    _enlarge = (id, isDomId, isFullScreen, showCloseIcon) => {
      const pageType = cache.getItem('pageType');
      if (pageType === 'tabs' || pageType === 'spa') {
        return flexTabs && flexTabs._enlarge(id, isDomId, isFullScreen, showCloseIcon);
      }
    };
    _getPreOpener = (index) => {
      const pageType = cache.getItem('pageType');
      if (pageType === 'tabs' || pageType === 'spa') {
        return flexTabs && flexTabs._getPreOpener(index);
      }
    };
    _getNavNames = () => {
      const pageType = cache.getItem('pageType');
      if (pageType === 'tabs' || pageType === 'spa') {
        return flexTabs && flexTabs._getNavNames();
      }
    };
    _back = () => {
      this._goToTab();
    };
    _resetDashBtn = (value) => {
      this.props.resetDashBtn && this.props.resetDashBtn(value);
    };
    resetPageMode = (value,flag) => {
        this._setComHeight();
        this.props.resetPageMode && this.props.resetPageMode(value,flag);
    };
    render() {
      const { error } = this.state;
      const { refresh,dashButton,themeColor,colorV3,layout } = this.props;
      return (
        <div className={`compose-container${pageStyle}`} id={this.param.__id}>
          {
            <Spin spinning={this.state.spinning} tip={this.state.tip}>
              {this.state.refresh ? null :
                (error && <ErrorPage setHeight={this._setComHeight} refresh={this.refresh} back={this._back}/> || <Com
                  ref={instance => {
                    this.id = this.param.__id;
                    this.instance = instance;
                  }}
                  wrappedComponentRef={form => {
                    if (form) {
                      this.id = this.param.__id;
                      this.form = form
                    }
                  }}
                  flexTabs={{
                    open: this._open,
                    openIframe: this._openIframe,
                    close: this._close,
                    openNewWindow:this._openNewWindow,
                    openNewWindowIframe:this._openNewWindowIframe,
                    getTabs: this._getTabs,
                    goToTab: this._goToTab,
                    refresh: this._refresh,
                    getTabComponent: this._getTabComponent,
                    enlarge: this._enlarge,
                    getPreOpener: this._getPreOpener,
                    getNavNames: this._getNavNames
                  }}
                  rest={rest}
                  closeLoading={this.closeLoading}
                  openLoading={this.openLoading}
                  param={this.param}
                  params={this.param}
                  refresh={refresh}
                  themeColor={themeColor}
                  colorV3={colorV3}
                  layout={layout}
                  dashButton={dashButton}
                  resetDashButton={this._resetDashBtn}
                  resetPageMode={this.resetPageMode}
                  permission={this.permission}
                  hasPermit={this.hasPermit}
                />)}
            </Spin>
          }
          {
            this.state.refresh ? null : <AdditionalNavigation
              ref={instance => this.navigation = instance}
            />
          }
        </div>
      );
    }
  }
  ComposeCom.childContextTypes = {
    flexTabs: PropTypes.object,
    rest: PropTypes.object,
    closeLoading: PropTypes.func,
    openLoading: PropTypes.func,
    param: PropTypes.object,
    params: PropTypes.object,
    refresh: PropTypes.func,
    // 该方法是详情渲染锚点导航专用方法
    renderAnchor: PropTypes.func,
    // 该方法是传递给任何组件的宽度变化方法
    widthChangeAddListen: PropTypes.func,
    widthChangeRemoveListen: PropTypes.func,
    // 该方法是判断tab页的内容是否已经被修改
    comDataChange: PropTypes.func,
    // 该对象时权限对象
    permission: PropTypes.object,
    hasPermit: PropTypes.func
  };
  return developCompose(ComposeCom);
};
