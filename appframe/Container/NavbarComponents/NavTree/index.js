import React from 'react';
import { Menu, Icon, propsCompose } from 'roface';
import { getItem, setItem } from '../../../../src/lib/cache';
import { reCoverSurround, findMenuItem } from '../../../../src/lib/menutransform';
import { addOnResize } from '../../../../src/lib/listener';
import './index.less';

const { SubMenu } = Menu;
const actionsType = ['datascope', 'action'];

export default class NavTree extends React.Component{
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
        const {dataMount} = this.props;
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
        this.calcMenuHeight();
        addOnResize(this.calcMenuHeight);
    }
    calcMenuHeight = () => {
        if (this.instance) {
            this.instance.style.height = `${document.body.clientHeight - 50}px`;
        }
    };
    componentWillUnmount() {
        this.flag = false;
    }
    renderSencondMenu = (menu) => {
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
                      {menu.children.filter(menu => menu.enabled === 'Y').map(item => this.renderSencondMenu(item))}
                  </SubMenu>
                );
            }
            return (
              <Menu.Item
                key={menu.path}
                disabled={!menu.url}
              >
                  <span>{menu.topic}</span>
              </Menu.Item>
            );
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
    renderMenu = (menu,fold) => {
        if (menu && actionsType.includes(menu.type)) return null;
        if (menu.children && menu.children.length) {
            // 过滤掉权限项
            const tempMenuChildren = menu.children.filter(childItem => !actionsType.includes(childItem.type));
            if (tempMenuChildren.length) {
                return (
                  <SubMenu
                    key={menu.path}
                    title={
                        <span className={`custom-menu-cta${fold}`}>
                            <Icon type={menu.icon || 'windowso'}/>
                            <span className={`custom-menu-item${fold}`}>{menu.topic}</span>
                        </span>
                    }
                  >
                      {menu.children.filter(menu => menu.enabled === 'Y').map(item => this.renderSencondMenu(item))}
                  </SubMenu>
                );
            }
            return (
              <Menu.Item
                key={menu.path}
                disabled={!menu.url}
              >
                <span className={`custom-menu-cta${fold}`}>
                    <Icon type={menu.icon || 'windowso'}/>
                    <span className={`custom-menu-item${fold}`}>{menu.topic}</span>
                </span>
              </Menu.Item>
            );
        }
        return (
            <Menu.Item
                key={menu.path}
                disabled={!menu.url}
                title={menu.topic}
            >
                <span className={`custom-menu-cta${fold}`}>
                    <Icon type={menu.icon || 'windowso'}/>
                    <span className={`custom-menu-item${fold}`} style={{marginLeft: 5}}>{menu.topic}</span>
                </span>
            </Menu.Item>
        );
    };
    handleMenuClick = (e) => {
        if (e && e.key) {
            const { menuClick, history } = this.props;
            const item = this.state.flatMenuData.length && findMenuItem(this.state.flatMenuData,e.key);
            menuClick && menuClick(item, history);
        }
    };
    render() {
        const {selectedKey,layout,fold,colorV3} = this.props;
        const {menuData} = this.state;
        let treeArray = [];
        if (selectedKey && selectedKey.split(':').length < 6) {
            selectedKey.split(':').forEach((item, index, array) => {
                treeArray.push(array.slice(0, index + 1).join(':'));
            });
            setItem('menuId', treeArray.slice(1));
        } else {
            treeArray = JSON.parse(getItem('menuId'));
        }
        return (
          <div className={`navtree-container navtree-container${fold}`}>
              <div className={`navtree-container-mock navtree-container${fold}-mock${fold} navtree-container-mock${colorV3}`}/>
              <div className={`navtree-container-body navtree-container${fold}-body${fold} navtree-container-body${fold}${layout}`}>
                  <Menu
                    defaultOpenKeys={treeArray}
                    selectedKeys={treeArray}
                    mode='inline'
                    theme={colorV3}
                    inlineCollapsed={fold === 'fold'}
                    onClick={e => this.handleMenuClick(e)}
                  >
                      {menuData.filter(menu => menu.enabled === 'Y').map(menu => this.renderMenu(menu,fold === 'fold'))}
                  </Menu>
              </div>
          </div>
        );
    }
}
