import React from 'react';
import ReactDom from 'react-dom';
import { Icon,propsCompose } from '../index';
import MenuChildren from './MenuChildren';
import config from '../../lib/config';
import { addOnResize } from '../../lib/listener';
import * as cache from '../../lib/cache';
import './style/index.less';

const pageStyle = config.surface.defaultOptions.pageStyle;
const actionsType = ['datascope', 'action'];

@propsCompose
export default class MegaMenu extends React.Component {
  constructor(props) {
    super(props);
    this.logo = null;
    this.dom = null;
    this.wrapper = null;
    this.menuWrapper = null;
    this.right = null;
    this.left = null;
    this.offsetWidth = 0;
    this.moveWidth = 210;
    this.flag = true;
    this.state = {
      menuData: [],
      currentMenu: 'root.home',
    };
  }
  componentDidMount() {
    /* eslint-disable */
    const { prefix = 'ro', dataMount, menuType } = this.props;
    if (menuType && menuType !== 'navTree') {
      this.dom = ReactDom.findDOMNode(this);
      this.logo = Array.from(Array.from(this.dom.children).filter(d => d.className === `${prefix}-navbar-logo`)[0].children).filter(item => item.className === `${prefix}-navbar-icon`);
      this.right = Array.from(this.dom.children).filter(d => d.className === `${prefix}-nav-arrow-right`)[0];
      this.wrapper = Array.from(this.dom.children).filter(d => d.className === `${prefix}-nav-wrapper`)[0];
      this.left = Array.from(this.dom.children).filter(d => d.className === `${prefix}-nav-arrow-left`)[0];
      this.menuWrapper = Array.from(this.wrapper.children).filter(d => d.className === `${prefix}-nav-menu-wrapper`)[0];
      this.offsetWidth = this.wrapper.offsetWidth;
      addOnResize(this.checkWidth, true);
      const menu = JSON.parse(cache.getItem('menu'));
      if (menu) {
        const dataSource = menu;
        dataMount && dataMount(dataSource);
        this.flag && this.setState({
          menuData: dataSource,
        },()=>{
          this.checkWidth();
        });
      }
    }
  }
  componentWillUnmount() {
    this.flag = false;
  }
  _menuClick = (e, item, menuType) => {
    this.setState({
      currentMenu:item.path,
    });
    e.stopPropagation();
    if (menuType !== 'megaTree') {
      // 过滤掉权限项
      const tempMenuChildren = item.children && item.children.filter(childItem => !actionsType.includes(childItem.type));
      if (!tempMenuChildren || tempMenuChildren.length === 0) {
        const { menuClick, prefix = 'ro', history } = this.props;
        menuClick && menuClick(item, history);
        // this.changeSecondChildrenMenu(e, `${prefix}-menu-children`, 'none')
        const childrenMenu = document.getElementsByClassName(`${prefix}-menu-children`);
        Array.from(childrenMenu).forEach(menu => {
          if (menu.style.display !== 'none') {
            menu.style.display = 'none';
          }
        })
      }
    } else {
      this.props.menuTree && this.props.menuTree(item.path);
    }
  };
  checkWidth = () => {
    if (this.wrapper) {
      if (this.wrapper.offsetWidth < this.wrapper.scrollWidth) {
        this.right.children[0].style.display = 'block';
      } else {
        this.right.children[0].style.display = 'none';
        const marginLeft = this._getValue(this.menuWrapper.style.marginLeft);
        if (marginLeft >= 0) {
          this.left.children[0].style.display = 'none';
        }
        if (this.left.children[0].style.display !== 'none' && this.offsetWidth < this.wrapper.offsetWidth) {
          const dValue = (marginLeft + (this.wrapper.offsetWidth - this.offsetWidth));
          if (dValue >= 0) {
            this.left.children[0].style.display = 'none';
          }
          this.menuWrapper.style.marginLeft = (dValue >= 0 ? 0 : dValue) + 'px';
        }
      }
      this.offsetWidth = this.wrapper.offsetWidth;
    }
  };
  thirdChildrenMenuShow = (e, prefix) => {
    const dom = e.currentTarget.parentNode;
    const ul = Array.from(dom.children).filter(item => item.className === prefix)[0];
    const icon = Array.from(dom.children).filter(item => item.className === prefix + '-icon')[0];
    if (ul) {
      const display = getComputedStyle(ul).display;
      ul.style.display = display === 'none' ? 'block' : 'none';
      icon.style.transform = display === 'none' ? 'rotate(90deg)' : 'rotate(0deg)';
    }
  };
  changeSecondChildrenMenu = (e, prefix, status) => {
    const menu = e.currentTarget;
    const secondMenu = Array.from(menu.children).filter(dom => dom.className === prefix)[0];
    if (secondMenu) {
      secondMenu.style.display = status;
      secondMenu.style.width = this.menuWrapper.clientWidth + 'px';
    }
  };
  renderMenu = (prefix, menuType) => {
    const { menuData } = this.state;
    const menuItemLay = config.surface.defaultOptions.menuItemLayout;
    if (menuType !== 'megaTree') {
      return (
        <div className={`${prefix}-menu-container`}>
          {menuData.map((menu) => {
            return (
              <div
                onClick={(e) => this._menuClick(e, menu)}
                className={`${prefix}-menu`}
                key={menu.path}
                onMouseOver={(e) => this.changeSecondChildrenMenu(e, `${prefix}-menu-children`, 'block')}
                onMouseLeave={(e) => this.changeSecondChildrenMenu(e, `${prefix}-menu-children`, 'none')}
              >
                <span className={`${prefix}-menu-${menuItemLay}`}>
                  <span className={`${prefix}-menu-${menuItemLay}-icon`}><Icon type={menu.icon || 'windowso'} /></span>
                  <span className={`${prefix}-menu-${menuItemLay}-name`}>{menu.topic}</span>
                </span>
                <div className={`${prefix}-menu-children`} style={{top:menuItemLay === 'vertical' ? '50px' : '40px'}}>
                  <MenuChildren themeColor={this.props.themeColor} prefix={prefix} menu={menu} menuClick={this._menuClick}/>
                </div>
              </div>);
          })}
        </div>
      );
    }
    return (
      <div className={`${prefix}-menu-container`}>
        {menuData.map((menu) => {
          return (
            <div
              onClick={(e) => this._menuClick(e, menu, menuType)}
              className={`${prefix}-menu ${prefix}-${menu.path !== this.state.currentMenu ? 'unmenu' : 'inmenu'}`}
              key={menu.path}
            >
              <span className={`${prefix}-menu-${menuItemLay}`}>
                <span className={`${prefix}-menu-${menuItemLay}-icon`}><Icon type={menu.icon || 'windowso'} /></span>
                <span className={`${prefix}-menu-${menuItemLay}-name`}>{menu.topic}</span>
              </span>
            </div>);
        })}
      </div>
    );
  };
  _getValue = (data) => {
    return parseFloat(data.split('px')[0] || 0, 10);
  };
  _moveRight = () => {
    this.rightWidth = this.wrapper.scrollWidth - this.wrapper.offsetWidth;
    const marginLeft = this._getValue(this.menuWrapper.style.marginLeft);
    const dValue = - this.rightWidth + this.moveWidth;
    if (dValue < 0) {
      this.menuWrapper.style.marginLeft = marginLeft - this.moveWidth + 'px';
    } else {
      this.menuWrapper.style.marginLeft = - this.rightWidth + marginLeft + 'px';
      this.right.children[0].style.display = 'none';
    }
    this.left.children[0].style.display = 'block';
  };
  _moveLeft = () => {
    const marginLeft = this._getValue(this.menuWrapper.style.marginLeft);
    this.rightWidth = this.wrapper.scrollWidth - this.wrapper.offsetWidth;
    const dValue = this.moveWidth + marginLeft;
    if (dValue <= 0) {
      this.menuWrapper.style.marginLeft = (marginLeft + this.moveWidth) + 'px';
    } else {
      this.menuWrapper.style.marginLeft = '0px';
      this.left.children[0].style.display = 'none';
    }
    this.right.children[0].style.display = 'block';
  };
  _goBackHome = () => {
    this.props.flexTabs.goToTab && this.props.flexTabs.goToTab();
  };
  _transMenuType = (value) => {
    this.props.transMenuType && this.props.transMenuType(value);
  };
  _themeColor = (a, b) => {
    this.props.transThemeColor && this.props.transThemeColor(a, b);
  };
  switchPage = (value) => {
    this.props.switchPageType && this.props.switchPageType(value);
  };
  _treeNavBar = (prefix, NavRight, menuType) => (
    <div style={{background:this.props.themeColor}} className={`${prefix}-navTree-container ${prefix}-navTree-container${pageStyle}`}>
      <div className={`${prefix}-navTree-container-left`}>
        <span className={`${prefix}-navTree-container-left-icon`}>
          <Icon type='windowso'/>
        </span>
        <span className={`${prefix}-navTree-container-left-text`}>{config.brand.banner.logoText + config.brand.banner.title}</span>
      </div>
      <div className={`${prefix}-navTree-container-right`}>
        <NavRight
          switchMenu={this._transMenuType}
          menuType={menuType}
          themeColor={this._themeColor}
          pageType={this.props.pageType}
          bgColor={this.props.themeColor}
          changePageType={this.switchPage}
          openDetail={this.openMsgDetail}
          openReadedMsg={this.openMsgReaded}
        />
      </div>
    </div>
  );
  openMsgDetail = (title,link,param) => {
      this.props.openDetailMsg && this.props.openDetailMsg(title,link,param);
  };
  openMsgReaded = () => {
      this.props.openReaded && this.props.openReaded();
  };
  _navBarGroup = (prefix, LogoIcon, NavRight, menuType) => (
    <div className={`${prefix}-nav-container`} style={{ background: this.props.themeColor,height:config.surface.defaultOptions.menuItemLayout === 'vertical' ? '50px' : '40px'}}>
      <LogoIcon
        menuType={menuType}
        backHome={this._goBackHome}
      />
      <div className={`${prefix}-nav-arrow-left`}><Icon type="left" onClick={this._moveLeft} /></div>
      <div className={`${prefix}-nav-wrapper`}>
        <div className={`${prefix}-nav-menu-wrapper`}>
          {this.renderMenu(prefix, menuType)}
        </div>
      </div>
      <div className={`${prefix}-nav-arrow-right`}><Icon type="right" onClick={this._moveRight}/></div>
      <NavRight
        switchMenu={this._transMenuType}
        menuType={menuType}
        themeColor={this._themeColor}
        bgColor={this.props.themeColor}
        pageType={this.props.pageType}
        changePageType={this.switchPage}
        openDetail={this.openMsgDetail}
        openReadedMsg={this.openMsgReaded}
      />
    </div>
  );
  _navBarItem = (prefix, LogoIcon, NavRight, menuType) => (
    <div className={`${prefix}-nav-container`} style={{ background: this.props.themeColor,height:config.surface.defaultOptions.menuItemLayout === 'vertical' ? '50px' : '40px' }}>
      <LogoIcon
        menuType={menuType}
        backHome={this._goBackHome}
      />
      <div className={`${prefix}-nav-arrow-left`}><Icon type="left" onClick={this._moveLeft} /></div>
      <div className={`${prefix}-nav-wrapper`}>
        <div className={`${prefix}-nav-menu-wrapper`}>
          {this.renderMenu(prefix, menuType)}
        </div>
      </div>
      <div className={`${prefix}-nav-arrow-right`}><Icon type="right" onClick={this._moveRight}/></div>
      <NavRight
        switchMenu={this._transMenuType}
        menuType={menuType}
        themeColor={this._themeColor}
        pageType={this.props.pageType}
        bgColor={this.props.themeColor}
        changePageType={this.switchPage}
        openDetail={this.openMsgDetail}
        openReadedMsg={this.openMsgReaded}
      />
    </div>
  );
  _navBarStyle = () => {
    const { prefix = 'ro', NavRight, LogoIcon, menuType } = this.props;
    switch(menuType) {
      case 'megaMenu':
        return this._navBarGroup(prefix, LogoIcon, NavRight, menuType);
      case 'megaTree':
        return this._navBarItem(prefix, LogoIcon, NavRight, menuType);
      case 'navTree':
        return this._treeNavBar(prefix, NavRight, menuType);
      default:
        return this._treeNavBar(prefix, NavRight, menuType);
    }
  };
  render() {
    return (
      this._navBarStyle()
    );
  }
}
