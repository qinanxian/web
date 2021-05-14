import React from 'react';
import { Menu, Icon, propsCompose } from '../index';
import { reCoverSurround, findMenuItem } from '../../lib/menutransform';
import { getItem, setItem } from '../../lib/cache';
import config from '../../lib/config';
import './style/index.less';

const { SubMenu } = Menu;
const pageStyle = config.surface.defaultOptions.pageStyle;
const actionsType = ['datascope', 'action'];

@propsCompose
export default class NavTree extends React.Component {
  constructor(props) {
    super(props);
    this.dom = null;
    this.flag = true;
    this.state = {
      menuData: [],
      flatMenuData: [],
      collapsed: false,
    };
  }
  componentDidMount() {
    /* eslint-disable */
    const { dataMount } = this.props;
    const menu = JSON.parse(getItem('menu'));
    if (menu){
      const res = reCoverSurround(menu);
      const dataSource = res;
      dataMount && dataMount(dataSource);
      this.flag && this.setState({
        flatMenuData: res,
        menuData: dataSource,
      });
    }
  }
  componentWillUnmount() {
    this.flag = false;
  }
  _menuClick = (e) => {
    if (e && e.key) {
      const { menuClick, history } = this.props;
      const item = this.state.flatMenuData.length && findMenuItem(this.state.flatMenuData,e.key);
      menuClick && menuClick(item, history);
    }
  };
  _renderSencondMenu = (menu) => {
      if (menu && actionsType.includes(menu.type)) return null;
      if (menu.children && menu.children.length) {
        // 过滤掉权限项
        const tempMenuChildren = menu.children.filter(childItem => !actionsType.includes(childItem.type));
        if (tempMenuChildren.length) {
          return (
            <SubMenu
              key={menu.path}
              title={<span><span>{menu.topic}</span></span>}
            >
              {tempMenuChildren.map(item => this._renderSencondMenu(item))}
            </SubMenu>
          );
        } else {
          return (
            <Menu.Item
              key={menu.path}
              disabled={!menu.url}
            >
              <span>{menu.topic}</span>
            </Menu.Item>
          );
        }
      }
      return (
        <Menu.Item
          key={menu.path}
          disabled={!menu.url}
        >
            <span>{menu.topic}</span>
        </Menu.Item>
      );
    };
  _renderMenu = (menu) => {
    const { collapsed } = this.state;
    const { prefix = 'ro', menuType, navTreeCollapsed } = this.props;
    if (menu && actionsType.includes(menu.type)) return null;
    if (menuType !== 'megaTree') {
      if (menu.children && menu.children.length) {
        // 过滤掉权限项
        const tempMenuChildren = menu.children.filter(childItem => !actionsType.includes(childItem.type));
        const coll = pageStyle ? !navTreeCollapsed : collapsed;
        if (tempMenuChildren.length) {
          return (
            <SubMenu
              key={menu.path}
              title={
                <span>
                <Icon style={{ marginRight: '10px' }} type={menu.icon || 'windowso'} />
                <span
                  style={coll ? {maxWidth: 0, display: 'inline-block', opacity: 0} : {}}
                >{menu.topic}</span>
              </span>
              }
            >
              {menu.children.map(item => this._renderSencondMenu(item, prefix))}
            </SubMenu>
          );
        } else {
          return (
            <Menu.Item
              key={menu.path}
            >
              <Icon style={{ marginRight: '10px' }} type={menu.icon || 'windowso'} />
              <span>{menu.topic}</span>
            </Menu.Item>
          );
        }
      }
      return (
        <Menu.Item
          key={menu.path}
        >
          <Icon style={{ marginRight: '10px' }} type={menu.icon || 'windowso'} />
          <span>{menu.topic}</span>
        </Menu.Item>
      );
    }
    if (menu.children && menu.children.length) {
      // 过滤掉权限项
      const tempMenuChildren = menu.children.filter(childItem => !actionsType.includes(childItem.type));
      if (tempMenuChildren.length) {
        return (
          <SubMenu
            key={menu.path}
            title={<span><span>{menu.topic}</span></span>}
          >
            {menu.children.map(item => this._renderSencondMenu(item, prefix, menuType))}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item
            key={menu.path}
            // disabled={!!menu.url}
          >
            <span>{menu.topic}</span>
          </Menu.Item>
        );
      }
    }
    return (
      <Menu.Item
        key={menu.path}
        // disabled={!!menu.url}
      >
          <span>{menu.topic}</span>
      </Menu.Item>
    );
  };
  _toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
    this.props.menuWidth && this.props.menuWidth(!this.state.collapsed ? 105 : parseInt(config.surface.defaultOptions.menuWidth) + 15 || 265);
  };
  _goBackHome = () => {
    this.props.flexTabs.goToTab && this.props.flexTabs.goToTab();
  };
  _menuTree = (prefix, menuType) => {
    const { menuData, collapsed } = this.state;
    const { selectedKey, themeColor, LogoIcon, navTreeCollapsed } = this.props;
    const coll = !pageStyle ? this.state.collapsed : !navTreeCollapsed;
    let treeArray = [];
    if (selectedKey && selectedKey.split('.').length < 6) {
      selectedKey.split('.').forEach((item, index, array) => {
        treeArray.push(array.slice(0, index + 1).join('.'));
      });
      setItem('menuId', treeArray.slice(1));
    } else {
      treeArray = JSON.parse(getItem('menuId'));
    }
    if (menuType !== 'megaTree') {
      return (
        <div>
          <div className={`${prefix}-leftTree-container-logo`} style={{ background:themeColor,height:pageStyle ? '50px' : '41px' }}>
            <span
              onClick={this._goBackHome}
              style={{ display: !pageStyle && collapsed ? 'none' : 'inline-block' }}
            >
              <LogoIcon
                menuType={menuType}
                collapse={coll}
              />
            </span>
            <Icon
              style={{ display: pageStyle ? 'none' : 'inline-block' }}
              className={`${prefix}-leftTree-container-logo-collapsed`}
              type={coll ? 'menu-fold' : 'menu-unfold'}
              onClick={this._toggleCollapsed}
            />
          </div>
          <div className={`${prefix}-leftTree-container-menu`}>
            <Menu
              defaultOpenKeys={treeArray}
              selectedKeys={treeArray}
              mode='inline'
              theme='light'
              inlineCollapsed={pageStyle ? coll : collapsed}
              onClick={e => this._menuClick(e)}
              className={`cust-menu${this.props.themeColorB}`}
            >
              {menuData.map(menu => this._renderMenu(menu))}
            </Menu>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className={`${prefix}-container-menu`}>
          <Menu
            defaultOpenKeys={treeArray}
            selectedKeys={treeArray}
            mode='inline'
            theme='light'
            inlineCollapsed={pageStyle ? coll : collapsed}
            onClick={e => this._menuClick(e)}
            className={`cust-menu${this.props.themeColorB}`}
          >
            {this.props.treeData.map(menu => this._renderMenu(menu))}
          </Menu>
        </div>
      </div>
    );
  };
  _navTree = () => {
    const { prefix = 'ro', menuType, treeState, navTreeCollapsed } = this.props;
    const coll = !pageStyle ? this.state.collapsed : !navTreeCollapsed;
    if (menuType !== 'megaTree') {
      return (
        <div className={`${prefix}-leftTree-container`} style={{ width: coll ? '85px' : config.surface.defaultOptions.menuWidth || '250px' }}>
          {this._menuTree(prefix, menuType)}
        </div>
      );
    }
    return (
      <div className={`${prefix}-container`} style={{ display: treeState, width: config.surface.menuWidth || '250px' }}>
        {this._menuTree(prefix, menuType)}
      </div>
    );
  };
  render() {
    return (
      <div>
        {this._navTree()}
      </div>
    );
  }
}
