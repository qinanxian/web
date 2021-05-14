import React from 'react';
import ReactDom from 'react-dom';
import Sortable from 'sortablejs';
import md5 from 'md5';
import { Icon, Notify, Iframe, Modal, openMask } from '../index';
import TabPanel from './TabPanel';
import TabContent from './TabContent';
import { depthFirstSearch } from '../../lib/menutransform';
import { addOnResize } from '../../lib/listener';
import config from '../../lib/config';
import * as cache from '../../lib/cache';

import './mega-tabcontent.css';
import * as rest from '../../lib/rest';

let menusData = [];
const pageStyle = config.surface.defaultOptions.pageStyle;
const tabLeaveConfirm = config.tabLeaveConfirm;

export default class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.dom = null;
    this.tabStack = [];
    this.state = {
      refreshStatus: false,
      tabs: [],
      tabsCollapse: [],
      showTabsCollapse: 'none',
      showOperateCollapse: 'none',
      activeTabId: null,
      isCollapse: false,
      dashButton:{
        collapse:false,
        refresh:true,
      },
      navCollapse:true,
      menuWidth:parseInt(config.surface.defaultOptions.menuWidth,0) + 15 || 265,
    };
    this.tabMargin = 20;
    this.firstMenu = JSON.parse(cache.getItem('menu'))[0];
  }

  componentDidMount() {
    /* eslint-disable */
    const { prefix = 'ro' } = this.props;
    this.dom = ReactDom.findDOMNode(this);
    const operateCollapse = document.querySelectorAll(`.${prefix}-nav-operate-collapse`);
    const tabsCollapse = document.querySelectorAll(`.${prefix}-nav-tabs-collapse`);
    if (operateCollapse.length > 0) {
      this.operateCollapseTag = operateCollapse[0];
      this.tabsCollapseTag = tabsCollapse[0];
      window.addEventListener('click', this._executeCb);
    }
    // tab的固定长度
    this.tabWidth = 110 + this.tabMargin * 2;

    this.checkWidth();
    addOnResize(this.checkWidth);
  }

  _updateQueueStack = (id, isDelete) => {
    let tempStack = [...this.tabStack];
    tempStack = tempStack.filter(tabId => tabId !== id); // 过滤掉当前的tab
    if (!isDelete) {
      // 如果不是删除则需要重新push进去
      tempStack.push(id);
    }
    this.tabStack = tempStack;
  };

  componentWillUnmount() {
    window.removeEventListener('click', this._executeCb);
  }

  _executeCb = (e) => {
    if ((this.operateCollapseTag && this.operateCollapseTag.compareDocumentPosition(e.target) !== 20)
    || (this.tabsCollapseTag && this.tabsCollapseTag.compareDocumentPosition(e.target) !== 20)) {
      this.setState({
        showOperateCollapse: 'none',
        showTabsCollapse: 'none',
      });
    }
  };

  componentWillReceiveProps(nextProps) {
    const { history, data } = this.props;
    menusData = data;
    const pathname = history.location && history.location.pathname;
    let paramStr = '';
    let param = '';
    let flag = false;
    try {
      paramStr = decodeURIComponent(atob(history.location.search.replace(/^\?/g, '')));
      param = (paramStr && JSON.parse(paramStr)) || {};
    } catch (e) {
      flag = true;
      Notify.error({ message: 'url地址不合法，已为您重新跳转到首页' });
      param = {
        __id: this.firstMenu.path,
        __name: this.firstMenu.topic
      }
    }
    if (data && nextProps.data) {
      if (data.length !== nextProps.data.length || flag) {
        flag = false;
        if (!this.props.data.length && !this.state.tabs.length && nextProps.data.length && pathname && param && param.__id) {
          let allMenus = [];
          depthFirstSearch(nextProps.data, (menuItem) => {
            allMenus.push(menuItem);
          });
          let initTab = allMenus.filter(menuItem => menuItem.path === param.__id)[0];
          if (initTab) {
            initTab = {
              ...initTab,
              param
            }
          } else {
            initTab = {
              ...param,
              url: pathname.replace(/^\//g, ''),
              param
            };
          }
          if (param.container && param.container === 'iframe') {
            this.createIframeTab(param.__name, param.url, param)
          } else {
            this.createTab(initTab);
          }
        } else {
          let allMenus = [];
          depthFirstSearch(nextProps.data, (menuItem) => {
            allMenus.push(menuItem);
          });
          const indexMenu = allMenus.filter(menuItem => (menuItem.path === this.firstMenu.path))[0];
          this.createTab(indexMenu);
        }
      }
    }
    if ((this.props.menuWidth !== nextProps.menuWidth) || (this.props.pageType !== nextProps.pageType)) {
      setTimeout(() => {
        this.checkWidth(true); // 取消菜单收起的动画的影响
      }, 500);
    }
  }
  _initCom = (tab, props, c) => {
    const { renderComponent } = this.props;
    const param = {
      ...(props.param || {}),
      __id: tab.__id,
      __name: tab.topic,
    };
    return renderComponent({...props, param}, tab, c);
  };

  checkWidth = (flag) => {
    const rightIconDom = document.querySelector('.li-right-icon');
    const leftIconDom = document.querySelector('.li-left-icon');
    if (!this._isExistSpaceIfAdd()) {
      let isExsitTabsItemIndex = this.state.tabs && this.state.tabs
        .findIndex(tabsItem => tabsItem.__id === this.state.activeTabId);
      if (rightIconDom) {
        rightIconDom.style.display = 'inline';
      }
      !flag && this._calcOffset(isExsitTabsItemIndex);
    } else {
      if (rightIconDom) {
        rightIconDom.style.display = 'none';
      }
    }
    if (this.ulInstance && leftIconDom) {
      if (this.ulInstance.scrollLeft !== 0) {
        leftIconDom.style.display = 'inline';
      } else {
        leftIconDom.style.display = 'none';
      }
    }
  };
  resetTimb(originParam,getParam,curId){
    let flag = false,result = originParam;
    originParam.forEach(item => {
        if (Object.keys(item).includes(curId)) {
          flag = true;
        }
        flag = false;
    });
    if (!flag) {
      result.push({[curId]:getParam});
      return result;
    }
    return result;
  }
  replace = (item) => {
    const { history, location } = this.props;
    let url = item.url || 'NotFound';
    const getParam = item.param && typeof item.param === 'string' ? JSON.parse(item.param) : item.param;
    if (url) {
      let tempUrl = '';
      let param = {
        ...(getParam || {}),
        __id: item.__id,
        __name: item.__name || item.name,
      };
      param =  encodeURIComponent(JSON.stringify(param));
      tempUrl = url + '?' + btoa(param);
      if(tempUrl.length > 2000){
        url = url + '?' + btoa(encodeURIComponent(JSON.stringify({__id: item.__id,__name: item.__name || item.name,})));
        const timb = JSON.parse(cache.getItem('timb'));
        let exist = false;
        timb.forEach(each => {
          if(Object.keys(each).includes(item['__id'])){
            exist = true;
          }
        });
        !exist && cache.setItem('timb',JSON.stringify(this.resetTimb(timb,getParam,item.__id)));
      }else{
        url = tempUrl;
      }
    }
    // 每一次tab的变化都需要记录在tab的更新栈中

    if (location.pathname + location.search !== `/${url}`) {
      try {
        history.push(`/${url}`);
      } catch (e){
        console.log(e);
        console.log('异常:history.push');
      }
    }
  };
  static _checkTabItem = (name, url, param) => {
    let tab = {};
    if (typeof name === 'object' && !React.isValidElement(name)) {
      const __id =  name.path || md5(name.url + JSON.stringify(name.param));
      tab = {
        __id,
        name: name.__name || name.topic,
        ...name,
      }
    } else {
      const __id = md5(url + JSON.stringify(param));
      tab = {
        __id,
        name,
        url,
        param
      }
    }
    return tab;
  };
  _refresh = (id) => {
    this.setState({
      refreshId: id
    })
  };
  static _refreshWindow = (id) => {
    window.location.reload();
  };
  createIframeTab = (name, url, param) => {
    const item = Tab._checkTabItem(name, url, param);
    const tempItem = {
      ...item,
      container: 'iframe',
      url: 'Iframe/',
      param: {
        ...param,
        url,
        container: 'iframe'
      }
    };
    this.replace(tempItem);
    //const Com = React.cloneElement(<Iframe />, { url });
    //const TempCom = this.props.compose(Iframe, this, this.props, item, this.props.menuType);
    const Com = this._initCom(item, {...this.props, param}, Iframe);
    this._updateTab(tempItem, Com);
    return {
      ...item,
      refresh: this._refresh
    };
  };
  static createIframeWindow = (name, url, param) => {
    const item = Tab._checkTabItem(name, url, param);
    //const paramStr =  btoa(encodeURIComponent(JSON.stringify(itemParam)));
    return window.open(`${item.url}`);
  };
  createTab = (name, url, param) => {
    const item = Tab._checkTabItem(name, url, param);
    this._updateQueueStack(item.__id);
    this.replace(item);
    const Com = this._initCom(item, {...this.props, param});
    this._updateTab(item, Com);
    return {
      ...item,
      refresh: this._refresh
    };
  };
  static openNewTab = (name, url, param) => {
    const item = Tab._checkTabItem(name, url, param);
    const itemParam = {
      ...item,
      ...item.param,
      flag: false,
      noMenu: true,
    };
    const paramStr =  btoa(encodeURIComponent(JSON.stringify(itemParam)));
    return window.open(rest.getLocationURL(`/main.html#/${item.url}/?${paramStr}`));
  };
  closeTab = (id) => {
    this._deleteTab(null , { __id: id });
  };
  static closeWindow = () => {
    window.close();
  };
  getTabs = () => {
    return this.state.tabs;
  };
  static getWindows = () => {
    return [];
  };
  goToTab = (id = this.firstMenu.path) => {
    const tab = this.state.tabs && this.state.tabs.filter(activeTab => activeTab.__id === id)[0];
    if (tab) {
      this._clickTab(tab);
    } else {
      const { data = [] } = this.props;
      let allMenus = [];
      depthFirstSearch(data, (menuItem) => {
        allMenus.push(menuItem);
      });
      this.createTab(allMenus.filter(menuItem => menuItem.path === id)[0]);
    }
  };
  static goToWindow = (id) => {
    // 直接打开新的Tab
    let allMenus = [];
    depthFirstSearch(menusData, (menuItem) => {
      allMenus.push(menuItem);
    });
    const menu = allMenus.filter(menuItem => menuItem.path === id)[0];
    menu && Tab.openNewTab(menu.topic, menu.url, menu.param);
    //window.open()
  };
  _calcOffset = (isExsitTabsItemIndex) => {
    if (this.ulInstance) {
      const ulInstanceRect = this.ulInstance.getBoundingClientRect();
      const containerLeft = ulInstanceRect.left;
      const containerRight = ulInstanceRect.right;
      Array.from(this.ulInstance.querySelectorAll('li')).forEach((li, index) => {
        // 计算偏移量
        const liRect = li.getBoundingClientRect();
        const offsetRight = liRect.right - containerRight;
        const offsetLeft = containerLeft - liRect.left;
        if (isExsitTabsItemIndex === index) {
          if (offsetLeft > 0){
            this._leftIconClick(offsetLeft);
          }
          if (offsetRight > 0) {
            this._rightIconClick(offsetRight);
          }
        }
      });
    }
  };
  _updateTab = (item, Com) => {
    let isExsitTabsItemIndex = this.state.tabs && this.state.tabs
      .findIndex(tabsItem => tabsItem.__id === item.__id);
    const isExsitCollapseItem = this.state.tabsCollapse && this.state.tabsCollapse
      .find(collapseItem => collapseItem.__id === item.__id);
    if (isExsitTabsItemIndex > -1 && !isExsitCollapseItem) {
      // 如果已经存在了则需要滚动到视野内
      this.setState({
        activeTabId: item.__id,
      }, () => {
        this._calcOffset(isExsitTabsItemIndex)
      });
    } else if (isExsitCollapseItem && isExsitTabsItemIndex === -1 ) {
      this._selectTabCollapse({...item, Com: Com});
    } else {
      this.setState({
        tabs: this.state.tabs.concat({...item, Com: Com}),
        activeTabId: item.__id,
        dashButton:{
          collapse:false,
          refresh:true,
        }
      }, () => {
        if (!this._isExistSpaceIfAdd()) {
          isExsitTabsItemIndex = this.state.tabs.length - 1;
          this._calcOffset(isExsitTabsItemIndex)
        }
      });
    }
  };
  _isExistSpaceIfAdd = () => {
    if (this.ulInstance) {
      const tabsLength = this.state.tabs.length * this.tabWidth;
      return this.ulInstance.offsetWidth + this.ulInstance.scrollLeft + 20 >= tabsLength;
    }
  };

  _closeAllTabs = () => {
    let allMenus = [];
    depthFirstSearch(this.props.data, (menuItem) => {
      allMenus.push(menuItem);
    });
    const indexMenu = allMenus.filter(menuItem => (menuItem.path === this.firstMenu.path))[0];
    // 置空并且重新生成默认页
    this.tabStack = [this.firstMenu.path];
    this.setState({ tabs: [], showOperateCollapse: 'none', tabsCollapse: [] }, () => {
      this.createTab(indexMenu);
    });
    cache.setItem('timb',[]);
  };
  _closeCurrentTab = () => {
    this.closeTab(this.state.activeTabId);
  };
  _closeOtherTabs = () => {
    if (!this.state.activeTabId) {
      Notify.info({
        description: '当前没有可用的tab',
        duration: 3,
      });
    }
    const finalTabs = this.state.tabs && this.state.tabs.filter(tabItems => tabItems.__id === this.state.activeTabId);
    this.tabStack = [finalTabs[0].__id];
    this.setState({
      tabs: finalTabs,
      activeTabId: finalTabs[0].__id,
      showOperateCollapse: 'none',
      tabsCollapse: [],
    }, this._clickTab(finalTabs[0]));
    const timbP = JSON.parse(cache.getItem('timb')).filter(fit => Object.keys(fit).includes(finalTabs[0]['__id']));
    if (timbP.length > 0) {
      cache.setItem('timb',JSON.stringify(timbP));
    } else {
      cache.setItem('timb',[]);
    }
  };

  _deleteTab = (e, isDeteleTab) => {
    this._tabLeave((result) => {
    if (result) {
      e && e.preventDefault();    // 阻止默认事件
      e && e.stopPropagation();   // 阻止事件冒泡
      const finalTabs =  this.state.tabs && this.state.tabs.filter(tabItems => tabItems.__id !== isDeteleTab.__id);
      this._updateQueueStack(isDeteleTab.__id, true);
      if (this.state.activeTabId === isDeteleTab.__id) {
        // 删除的是当前显示的tab,并且没有折叠起来的tab
        // 获取当前删除tab页的索引
        const nextId = this.tabStack[this.tabStack.length - 1];
        const nextTab = this.state.tabs && this.state.tabs.filter(item => item.__id === nextId)[0];
        this.setState({
          tabs: finalTabs,
        }, () => {
          finalTabs.length > 0 ? this._clickTab(nextTab) : this._closeAllTabs();
          this.checkWidth();
        });
      } else {
        // 删除的不是当前显示的tab,并且没有折叠起来的tab
        this.setState({
          tabs: finalTabs,
        }, () => {
          this.checkWidth();
        });
      }
      const updateTimbP = JSON.parse(cache.getItem('timb')).filter(fit => !Object.keys(fit).includes(isDeteleTab['__id']));
      cache.setItem('timb',JSON.stringify(updateTimbP));
      }
    }, isDeteleTab.__id);
  };

  _refreshTab = (id = this.state.activeTabId) => {
    this._tabLeave((result) => {
      if (result) {
        this.setState({
          refreshStatus: !this.state.refreshStatus,
          refreshId: id || this.state.activeTabId,
        })
      }
    }, id);
  };

  // 当tab页刷新的时候或者关闭得时候是否需要再次确认
  _tabLeave = (cb, id) => {
    const instance = cache.getCache(id);
    const leaveFuc = instance && instance.tabLeave;
    const comData = (instance && instance.getComData && instance.getComData()) || {};
    const showTab = this.state.tabs && this.state.tabs.filter(activeTab => activeTab.__id === id);
    const param = showTab.param || {};
    let result = tabLeaveConfirm || false;
    if (param._tabLeaveConfirm !== undefined) {
      result = param._tabLeaveConfirm;
    }
    result = this._checkShouldConfirm(result, comData);
    if (leaveFuc && typeof leaveFuc === 'function') {
      result = leaveFuc();
    }
    if (result) {
      Modal.confirm({
        title: '离开确认',
        content: '当前页面有改动，但是尚未保存是否离开？',
        onOk: () => {
          cb(true);
        },
        onCancel: () => {
          cb(false);
        }
      })
    } else {
      cb(true);
    }
  };
  _checkShouldConfirm = (status, comData) => {
    return status && Object.keys(comData).some(c => comData[c]);
  };
  _clickTab = (currentTabItem) => {
    const { activeTabId } = this.state;
    if (activeTabId !== currentTabItem.__id) {
     this._updateQueueStack(currentTabItem.__id);
     this.replace(currentTabItem);
     if (currentTabItem.__id === this.firstMenu.path) {
       this.setState({
         activeTabId: currentTabItem.__id,
         isCollapse: false,
         dashButton:{
           collapse:this.state.dashButton.collapse,
           refresh:true,
         }
       });
     }
      this.setState({
        activeTabId: currentTabItem.__id,
        isCollapse: false,
      });
    }
  };

/*  _dropHiddenDown = (e) => {
    if (!this.state.tabsCollapse.length) {
      Notify.info({
        description: '没有折叠起来的tab页',
        duration: 3,
      });
      return;
    }
    this.setState({
      showTabsCollapse: this.state.showTabsCollapse === 'list-item' ? '' : 'list-item',
      showOperateCollapse: this.state.showOperateCollapse === 'list-item' ? 'none' : 'none'
    });
    e.nativeEvent.stopImmediatePropagation();
  };*/

  _selectTabCollapse = (collapseItem) => {
    const tempTab = this.state.tabs.shift();
    const tempCollapse = this.state.tabsCollapse
      .filter(tabsCollapseItem => collapseItem.__id !== tabsCollapseItem.__id);
    this.replace(collapseItem);
    this.setState({
      tabs: this.state.tabs.concat(collapseItem),
      activeTabId: collapseItem.__id,
      tabsCollapse: [...tempCollapse, tempTab],
      isCollapse: true,
      showTabsCollapse: 'none'
    });
  };

  _deleteTabCollapse = (e, collapseItem) => {
    e.preventDefault();    // 阻止默认事件
    e.stopPropagation();   // 阻止事件冒泡
    this.setState({
      tabsCollapse: this.state.tabsCollapse
        .filter(tabsCollapseItem => collapseItem.__id !== tabsCollapseItem.__id),
    });
    return false;
  };

  _sortableGroupDecorator = (componentBackingInstance) => {
    this.ulInstance = componentBackingInstance;
    // check if backing instance not null
    if (componentBackingInstance) {
      // const ghostClass = ;
      const options = {
        animation: 150,
        draggable: 'li', // Specifies which items inside the element should be sortable
        // group: "shared",
        ghostClass: 'rc-draggable-attribute-ghost', // Class name for the drop placeholder
        chosenClass: 'rc-draggable-attribute-chosen',  // Class name for the chosen item
        dragClass: 'rc-draggable-attribute-drag',  // Class name for the dragging item
        onUpdate: (evt) => {
          console.log('onUpdate');
          // 处理拖动后的页面
        },
      };
      Sortable.create(componentBackingInstance, options);
    }
  };

  _changesOperateCollapse = (e) => {
    this.setState({
      showOperateCollapse: this.state.showOperateCollapse === 'list-item' ? 'none' : 'list-item',
      showTabsCollapse: this.state.showTabsCollapse === 'list-item' ? 'none' : 'none',
    });
    e.nativeEvent.stopImmediatePropagation();
  };
  _resetDashButton = (value) => {
    this.setState({dashButton:{
        collapse:value,
        refresh:false,
      }});
  };
  handleNavTreeToggle = () => {
    this.setState({
      navCollapse:!this.state.navCollapse,
      menuWidth:!this.state.navCollapse ? parseInt(config.surface.defaultOptions.menuWidth,0) + 15 || 265 : 105,
    },() => {
      this.props.navTreeCollapse && this.props.navTreeCollapse(this.state.navCollapse);
    });
  };
  resetPageMode = (value,flag) => {
    this.props.resetPageMode && this.props.resetPageMode(value,flag);
  };
  _leftIconClick = (offset) => {
    const target = document.querySelector('.li-left-icon');
    if(this.ulInstance) {
      const offsetValue = - (offset === undefined ? this.tabWidth : offset);
      // 计算是否需要继续显示向左滚动的图标，以便于下一次的滚动
      if (this.ulInstance.scrollLeft + offsetValue <= 0) {
        target.style.display = 'none';
      } else {
        target.style.display = 'inline';
      }
      document.querySelector('.li-right-icon').style.display = 'inline';
      this.scrollFuc(this.ulInstance, offsetValue);
    }
  };
  _rightIconClick = (offsetValue) => {
    const target = document.querySelector('.li-right-icon');
    if(this.ulInstance) {
      // 如果向左滚动的距离加上ul的宽度大于或等于ul实际的宽度时则图标需要隐藏
      const offset = this.ulInstance.scrollWidth - this.ulInstance.offsetWidth;
      const tempWidth = offsetValue !== undefined ? offsetValue : this.tabWidth;
      if (this.ulInstance.scrollLeft + tempWidth >= offset){
        // 不在支持向左滚动，直接滚动到最左边
        this.scrollFuc(this.ulInstance, offset - this.ulInstance.scrollLeft);
        target.style.display = 'none';
      } else {
        this.scrollFuc(this.ulInstance, tempWidth);
        target.style.display = 'inline';
      }
      document.querySelector('.li-left-icon').style.display = 'inline';
    }
  };
  scrollFuc = (dom, offset) => {
    if (this.interval) {
      clearInterval(this.interval);
    }
    const count = Math.ceil(Math.abs(offset) / 110);
    let execOffset = 0;
    this.interval = setInterval(() => {
      if (offset > 0) {
        execOffset += count;
        dom.scrollLeft += count;
      } else {
        execOffset -= count;
        dom.scrollLeft -= count;
      }
      if (Math.abs(execOffset) >= Math.abs(offset)) {
        clearInterval(this.interval);
      }
    }, 1);
  };
  _enlarge = (id = this.state.activeTabId, isDomId, isFullScreen, showCloseIcon = true) => {
    let mask = null;
    const style = { background: '#FFFFFF', width: '100%', height: '100%'};
    const closeStyle = { color: '#000000', top: 0 };
    let com = '';
    if (isDomId) {
       const dom = document.getElementById(id);
       if (dom) {
         com = <div
           dangerouslySetInnerHTML={{__html: dom.innerHTML || '未找到该节点'}}
           style={style}>
           {}
         </div>;
       }
    } else {
      const tab = this.state.tabs.filter(t => t.__id === id)[0];
      if (tab) {
        com = <div style={style}>
          {React.cloneElement(tab.Com, {
            ...this.props,
            dashButton: this.state.dashButton,
            enlarge: true,
          })}
        </div>;
      }
    }
    if (com) {
      mask = openMask(com, {
        closeStyle,
        isFullScreen,
        showCloseIcon,
        needClose: true,
        needSetWidth: true
      });
    } else {
      Modal.error({title: '页面放大失败！', content: '该页面不存在'})
    }
    return mask;
  };
  _getShowTab = () => {
    return this.state.tabs && this.state.tabs.filter(activeTab => activeTab.__id ===
      this.state.activeTabId);
  };
  _getTabName = (value) => {
    return this._getTabParent(value).map(v => (v.topic || v.name || v.__name));
  };
  _getTabParent = (value, tab = []) => {
    if (value.parent) {
      return this._getTabParent(value.parent, tab.concat(value));
    }
    return tab.concat(value);
  };
  _getPreOpener = (index = 1) => {
    const showTab = this._getShowTab();
    return this._getTabParent(showTab[0])[index];
  };
  _getNavNames = () => {
    const showTab = this._getShowTab();
    return this._getTabName(showTab[0]).reverse();
  };
  render() {
    const showTab = this._getShowTab();
    let tabPath = [];
    let showTabRefresh = true;
    let background = '#ffffff';
    let getParam = {};
    if (showTab && showTab[0]) {
      getParam = showTab.length > 0 ? (showTab[0].param && typeof showTab[0].param === 'string' ? JSON.parse(showTab[0].param) : showTab[0].param) : {};
      tabPath = this._getTabName(showTab[0]).reverse();
      background = showTab[0] && showTab[0].id === this.firstMenu.path && pageStyle === 'v2' && '#eff3f4';
      if ('showRefresh' in (getParam || {})) {
        showTabRefresh = showTab[0].param.showRefresh;
      }
    }
    const { pageType,themeColor,layout,fold,colorV3 } = this.props;
    const { navCollapse } = this.state;
    return (
      <div className={`flex-tabs flex-tabs${pageStyle} flex-tabs${fold}`} style={{background:background }}>
        <div className="ro-page-content-wrapper" id="ro-main-content">
          <div className="ro-page-content" id="ro-main-content-container">
            <div className="ro-main-tabs-container" style={{overflow:layout === 'HA' ? 'auto' : 'visible'}}>
              {
                <div className={`ro-main-tabs-container ro-main-tabs-container-header${pageStyle}`}>
                  {pageStyle === 'v2' ? <Icon className='ro-main-tabs-container-headerv2-icon' type={navCollapse ? 'menu-unfold' : 'menu-fold'} onClick={this.handleNavTreeToggle}/> : ''}
                  <Icon onClick={() => this._leftIconClick()} type="left" className="li-left-icon"/>
                    <ul
                      className={`nav-tabs${pageStyle}`}
                      id="nav-tabs"
                      ref={this._sortableGroupDecorator}
                    >
                      {
                        pageType === 'tabs' ?
                          this.state.tabs && this.state.tabs.map((tabItem) => {
                            let className = '';
                            if (this.state.activeTabId === tabItem.__id) {
                              className = `li-active${pageStyle}`;
                            }
                            return (
                              <TabPanel
                                key={tabItem.__id}
                                tabItem={tabItem}
                                activeTabId={this.state.activeTabId}
                                className={className}
                                themeColor={this.props.themeColor}
                                deleteTab={this._deleteTab}
                                clickTab={this._clickTab}
                                isCollapse={this.state.isCollapse}
                              />
                            );
                          }) : <span className='ro-spa-tab-header'>
                          <span
                            className='ro-spa-tab-header-back'
                            onClick={(e) => this._deleteTab(e, showTab[0])}
                          >
                            <Icon type="arrow-left" />
                          </span>
                          <span
                            className='ro-spa-tab-header-nav'
                          >
                            {tabPath.join(' / ')}
                          </span>
                        </span>
                        }
                    </ul>
                  <Icon
                    onClick={() => this._rightIconClick()}
                    type="right"
                    className="li-right-icon"
                  />
                  <li
                    className={`dropdown pull-right ro-tabs-collapse ro-tabs-collapse${pageStyle} `}
                  >
                    <span className={`roic-right-operate roic-right-operate${pageStyle}`}>
                       {/*<Icon type="doubleright" className="" onClick={this._dropHiddenDown} />*/}
                      <Icon
                        type="reload"
                        style={{display: tabPath.length > 0 && showTabRefresh ? '' : 'none'}}
                        className="reload"
                        onClick={() => this._refreshTab()}
                      />
                       <Icon
                         style={{display: pageType === 'tabs' ? '' : 'none'}}
                         type="fa-ellipsis-v"
                         className="roic-more"
                         onClick={this._changesOperateCollapse}
                       />
                    </span>
                    <ul
                      style={{ display: this.state.tabsCollapse.length ? this.state.showTabsCollapse : 'none' }}
                      id="ro-nav-tabs-collapse"
                      className="ro-nav-tabs-collapse"
                    >
                      {
                        this.state.tabsCollapse.length &&
                        this.state.tabsCollapse && this.state.tabsCollapse.map((collapseItems) => {
                          return(
                            <span className="span-no-wrap" key={`span${collapseItems.__id}`}>
                          <li
                            key={collapseItems.__id}
                            onClick={() => this._selectTabCollapse(collapseItems)}
                          >{collapseItems.name}
                          </li>
                          <Icon type="close" className="close-collapse" onClick={e => this._deleteTabCollapse(e, collapseItems)} />
                        </span>
                          );
                        })
                      }
                    </ul>
                    <ul
                      style={{ display: this.state.showOperateCollapse }}
                      id="ro-nav-operate-collapse"
                      className="ro-nav-operate-collapse"
                    > <span className="operate-item" onClick={this._closeCurrentTab}>关闭当前</span>
                      <span className="operate-item" onClick={this._closeOtherTabs}>关闭其他</span>
                      <span className="operate-item" onClick={this._closeAllTabs}>关闭所有</span>
                    </ul>
                  </li>
                </div>
              }
              <div>
                <TabContent
                    pageType={pageType}
                    themeColor={themeColor}
                    colorV3={colorV3}
                    layout={layout}
                    menuWidth={pageStyle === 'v2' ? this.state.menuWidth : this.props.menuWidth}
                    refreshStatus={this.state.refreshStatus}
                    refreshId={this.state.refreshId}
                    refresh={this._refreshTab}
                    activeTabId={this.state.activeTabId}
                    tabs={this.state.tabs}
                    dashButton={this.state.dashButton}
                    handleDashButton={this._resetDashButton}
                    resetPageMode={this.resetPageMode}
                  />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
