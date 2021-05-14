import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import * as appframe from '../.rof.index';
import * as app from '../../app/.rof.index';
import { getUserPilot } from '../../src/lib/base';
import { NavTree, NavMega, FlexTabs, Notify, Spin } from '../../src/components';
import PersonalManager from './NavbarComponents/personalmanager';
import Logo from './NavbarComponents/logo';
import NotFound from './NotFound';
import ErrorPage from './ErrorPage';
import { compose } from './compose';
import config from '../../src/lib/config';
import * as cache from '../../src/lib/cache';
import { get, post, getLocationURL } from "../../src/lib/rest";
import { depthFirstSearch } from "../../src/lib/menutransform";
import { getModel } from "./utils";
import './style/index.less';
import formatdata from '../Components/jsmind/formatdata.json';

const pageStyle = config.surface.defaultOptions.pageStyle;

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.flexTabs = null;
        this.menu = [];
        this.configMenuWidth = parseInt(config.surface.defaultOptions.menuWidth) + 15;
        this.state = {
            menuData: [],
            treeData: [],
            loading: true,
            menuWidth: '',
            treeState: 'none',
            menuType: '',
            themeColor: null,
            themeColorB: null,
            pageType: '',
            error: false,
            status: false,
            navTreeCollapse:true
        };
        this.cache = {};
        // 将业务数据放入缓存
        cache.setCache('app', app);
    }
    componentDidMount() {
        const {layout,skin,openModel} = config.surface.defaultOptions;
        const hash = window.location.hash;
        let paramStr = '';
        let param = {};
        try {
            paramStr = decodeURIComponent(atob(hash.split('?')[1]));
            param = (paramStr && JSON.parse(paramStr)) || {};
        } catch (e) {
            // console.log('浏览器参数异常', e)
        }
        if (!param.noMenu) {
            Promise.all([getUserPilot(),get('/auth/user/my/behaviors')])
                .then(res => {

                    // const childData = res[0].children;
                    const childData = formatdata.children;
                    cache.setItem('menu', childData);
                    this.menu = childData;
                    const menuId = JSON.parse(cache.getItem('menuId'));

                    const layoutValue = res[1].filter(item => item.objectType === 'MySkinLayout');
                    const colorValue = res[1].filter(item => item.objectType === 'MySkinColor');
                    const pageValue = res[1].filter(item => item.objectType === 'MyPageType');
                    const mySkinLayout =  layoutValue.length > 0 ? layoutValue[0].objectId : layout;
                    const mySkinColor =  (colorValue.length > 0 ? colorValue[0].objectId : skin).split('&');
                    const myPageType =  pageValue.length > 0 ? pageValue[0].objectId : getModel(openModel);

                    cache.setItem('layoutId', layoutValue.length > 0 ? layoutValue[0].id : '');
                    cache.setItem('colorId', colorValue.length > 0 ? colorValue[0].id : '');
                    cache.setItem('pageId', pageValue.length > 0 ? pageValue[0].id : '');
                    cache.setItem('pageType', myPageType);
                    let allMenus = [];
                    if (menuId && menuId.length > 0) {
                        depthFirstSearch(childData, (menuItem) => {
                            allMenus.push(menuItem);
                        });
                        const child = allMenus.filter(item => item.path === menuId[0]);
                        const childArray = child[0].children;
                        this.setState({
                            treeData: childArray ? childArray : [],
                            treeState: childArray ? '' : 'none',
                            menuType: !pageStyle && mySkinLayout || 'navTree',
                            themeColor: mySkinColor[0],
                            themeColorB: mySkinColor[1],
                            pageType: myPageType,
                            menuWidth: this._initMenuWidth(mySkinLayout),
                            status: true,
                        });
                    } else {
                        cache.setItem('menuId', []);
                        this.setState({
                            menuType: !pageStyle && mySkinLayout || 'navTree',
                            themeColor: mySkinColor[0],
                            themeColorB: mySkinColor[1],
                            pageType: myPageType,
                            menuWidth: this._initMenuWidth(mySkinLayout),
                            status: true,
                        });
                    }
                })
                .catch((err) => {
                    if (err === 'error') {
                        cache.clear();
                        window.location.reload();
                    } else {
                        this._dataMount([]);
                        this.setState({
                            menuType: 'navTree',
                            menuWidth: this.configMenuWidth || 265,
                        })
                    }
                });
        }
    }
    componentDidCatch(){
        this.setState({ error: true });
    }
    _initMenuWidth = (value) => {
        let result;
        const menuId = JSON.parse(cache.getItem('menuId'));
        if (value) {
            switch (value) {
                case 'navTree':
                    result = this.configMenuWidth || 265;
                    break;
                case 'megaMenu':
                    result = 15;
                    break;
                case 'megaTree':
                    result = menuId&&menuId.length > 1 ? this.configMenuWidth || 265 : 15;
                    break;
                default:
                    result = this.configMenuWidth || 265;
            }
        }
        return !pageStyle && result || 265;
    };
    _menuClick = (item) => {
        if (this.flexTabs) {
            if (item.container && item.container === 'iframe') {
                this.flexTabs.createIframeTab({ ...item });
            } else {
                this.flexTabs.createTab({...item});
            }
        }
    };
    linkMsgPage = (title,link,param) => {
        this.flexTabs.createTab(title,link,JSON.parse(param));
    };

    openReadedMsg = () => {
        this.flexTabs.createTab('历史信息','Person/Messages');
    };
    _getObject = (obj, fields) => {
        return fields.filter(field => !!field).reduce((a, b) => {
            const tempB = b.replace(/\W/g, '');
            return a && a[tempB];
        }, obj);
    };
    _getCom = (props, tab) => {
        if (tab && tab.url) {
            if (!this.cache[tab.__id]) {
                this.cache[tab.__id] = this._getObject(app, tab.url.split('/')) || this._getObject(appframe, tab.url.split('/')) || NotFound;
            }
            return this.cache[tab.__id];
        }
        return NotFound;
    };
    _renderComponent = (props, tab, c) => {
        const Com = compose(c || this._getCom(props, tab), this.flexTabs, props, tab);
        return <Com />;
    };
    _getInstance = (instance) => {
        if (instance) {
            cache.setCache('flexTabs', instance);
            this.flexTabs = instance;
        }
    };
    _dataMount = (data) => {
        this.setState({
            menuData: data,
        }, () => {
            this.setState({
                loading: false
            });
        });
    };
    _menuTreeReset = (value) => {
        const childData = this.menu.filter(item => item.path === value);
        const childArray = childData[0].children;
        this.setState({
            treeData: childArray ? childArray : [],
            treeState: childArray ? '' : 'none',
            menuWidth: childArray ? this.configMenuWidth || 265 : 15,
        });
        // 如果是没有子菜单的菜单，并且该菜单有URL
        if ((!childArray || childArray.length === 0) && childData[0] && childData[0].url) {
            this._menuClick(childData[0]);
        }
    };
    _switchMenu = (value) => {
        const menuId = JSON.parse(cache.getItem('menuId'));
        let menuType;
        if (value === 2) {
            menuType = 'navTree';
            this.setState({
                menuWidth: this.configMenuWidth || 265
            });
        } else if (value === 3) {
            menuType = 'megaTree';
            if (menuId && menuId.length > 1) {
                const childData = this.menu.filter(item => item.path === menuId[0]);
                const childArray = childData[0].children;
                this.setState({
                    treeData: childArray ? childArray : [],
                    treeState: childArray ? '' : 'none',
                    menuWidth: childArray ? this.configMenuWidth || 265 : 15,
                });
            }
        } else {
            menuType = 'megaMenu';
            this.setState({
                menuWidth: 15
            });
        }
        this.setState({
            menuType: menuType
        }, () => {
            this.flexTabs.goToTab && this.flexTabs.goToTab(menuId[menuId.length -1]);
        });
        post('/auth/user/my/saveBehavior', {id:cache.getItem('layoutId'),objectId:menuType,objectType:'MySkinLayout'});
    };
    _getNavTreeColor = (value) => {
        switch (value) {
            case 'item1':
                return '#3A3D48';
            case 'item2':
                return '#70ca63';
            case 'item3':
                return '#007676';
            case 'item6':
                return '#e9573f';
            case 'item5':
                return '#4a89dc';
            case 'item4':
                return '#967adc';
            case 'item9':
                return '#ff8c30';
            case 'item8':
                return '#37bc9b';
            case 'item7':
                return '#F7C55E';
        }
    };
    colorRGB2Hex(color) {
        const rgb = color.split(',');
        const r = parseInt(rgb[0].split('(')[1]);
        const g = parseInt(rgb[1]);
        const b = parseInt(rgb[2].split(')')[0]);

        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    _changeThemeColor = (a, b) => {
        const menuColor = this.colorRGB2Hex(a);
        // const treeColor = this._getNavTreeColor(b);
        this.setState({
            themeColor: menuColor,
            themeColorB: b,
        });
        post('/auth/user/my/saveBehavior',
            {id:cache.getItem('colorId'),objectId:menuColor+'&'+b,objectType:'MySkinColor'});
    };
    _setMenuWidth = (num) => {
        this.setState({
            menuWidth: num
        });
    };
    _switchPage = (value) => {
        this.setState({
            pageType: value
        });
    };
    handleNavTreeCollapse = (value) => {
        this.setState({navTreeCollapse:value});
    };
    resetPageMode = (value,flag) => {
        if (flag === 'page') {
            this.setState({
                pageType:value
            });
        }
        if (flag === 'color') {
            this.setState({
                themeColor: value,
            });
            post('/auth/user/my/saveBehavior',
                {id:cache.getItem('colorId'),objectId:value+'&'+this.state.themeColorB,objectType:'MySkinColor'});
        }
    };
    _menuPage = (props, param) => {
        const { themeColor, themeColorB, menuType, loading, pageType, navTreeCollapse } = this.state;
        if (menuType !== 'megaTree') {
            if (menuType !== 'megaMenu') {
                return (
                    <Spin spinning={loading} tip="正在获取系统菜单，请稍后...">
                        <div className='ro-container-display'>
                            <NavTree
                                {...props}
                                selectedKey={param.__id}
                                LogoIcon={Logo}
                                menuClick={this._menuClick}
                                menuType={menuType}
                                dataMount={this._dataMount}
                                menuWidth={this._setMenuWidth}
                                themeColor={themeColor}
                                themeColorB={themeColorB}
                                navTreeCollapsed={navTreeCollapse}
                            />
                            <div className='ro-container-other'>
                                <NavMega
                                    {...props}
                                    selectedKey={param.__id}
                                    menuClick={this._menuClick}
                                    dataMount={this._dataMount}
                                    LogoIcon={Logo}
                                    menuType={menuType}
                                    pageType={pageType}
                                    NavRight={PersonalManager}
                                    transMenuType={this._switchMenu}
                                    transThemeColor={this._changeThemeColor}
                                    themeColor={themeColor}
                                    switchPageType={this._switchPage}
                                    openDetailMsg={this.linkMsgPage}
                                    openReaded={this.openReadedMsg}
                                />
                                <FlexTabs
                                    {...props}
                                    menuWidth={this.state.menuWidth}
                                    menuType={menuType}
                                    data={this.state.menuData}
                                    themeColor={themeColor}
                                    pageType={pageType}
                                    ref={this._getInstance}
                                    renderComponent={this._renderComponent}
                                    navTreeCollapse={this.handleNavTreeCollapse}
                                    resetPageMode={this.resetPageMode}
                                />
                            </div>
                        </div>
                    </Spin>
                );
            }
            return (
                <Spin spinning={loading} tip="正在获取系统菜单，请稍后...">
                    <div className='ro-container-display'>
                        <div className='ro-container-other'>
                            <NavMega
                                {...props}
                                selectedKey={param.__id}
                                menuClick={this._menuClick}
                                dataMount={this._dataMount}
                                LogoIcon={Logo}
                                menuType={menuType}
                                pageType={pageType}
                                NavRight={PersonalManager}
                                switchPageType={this._switchPage}
                                transMenuType={this._switchMenu}
                                transThemeColor={this._changeThemeColor}
                                themeColor={themeColor}
                                openDetailMsg={this.linkMsgPage}
                                openReaded={this.openReadedMsg}
                            />
                            <FlexTabs
                                {...props}
                                menuWidth={this.state.menuWidth}
                                menuType={menuType}
                                themeColor={themeColor}
                                data={this.state.menuData}
                                pageType={pageType}
                                ref={this._getInstance}
                                renderComponent={this._renderComponent}
                            />
                        </div>
                    </div>
                </Spin>
            );
        }
        return (
            <Spin spinning={loading} tip="正在获取系统菜单，请稍后...">
                <div>
                    <NavMega
                        {...props}
                        selectedKey={param.__id}
                        menuClick={this._menuClick}
                        dataMount={this._dataMount}
                        LogoIcon={Logo}
                        menuType={menuType}
                        switchPageType={this._switchPage}
                        pageType={pageType}
                        NavRight={PersonalManager}
                        transMenuType={this._switchMenu}
                        menuTree={this._menuTreeReset}
                        transThemeColor={this._changeThemeColor}
                        themeColor={themeColor}
                        openDetailMsg={this.linkMsgPage}
                        openReaded={this.openReadedMsg}
                    />
                    <div className='ro-container-other-nav-tree'>
                        <NavTree
                            {...props}
                            selectedKey={param.__id}
                            LogoIcon={Logo}
                            menuClick={this._menuClick}
                            menuType={menuType}
                            dataMount={this._dataMount}
                            treeData={this.state.treeData}
                            treeState={this.state.treeState}
                            themeColor={themeColor}
                            themeColorB={themeColorB}
                        />
                        <FlexTabs
                            {...props}
                            menuWidth={this.state.menuWidth}
                            menuType={menuType}
                            data={this.state.menuData}
                            pageType={pageType}
                            ref={this._getInstance}
                            themeColor={themeColor}
                            renderComponent={this._renderComponent}
                        />
                    </div>
                </div>
            </Spin>
        );
    };
    render() {
        const { error } = this.state;
        return error ? <ErrorPage getLocationURL={getLocationURL}/> : (
            <HashRouter>
                <Route
                    path="/"
                    render={(props) => {
                        // 将请求的后端地址放入全局的window方便iframe使用
                        window.baseUrl = config.baseUrl;
                        let paramStr = '';
                        let param = {};
                        try {
                            paramStr = decodeURIComponent(atob(props.history.location.search.replace(/^\?/g, '')));
                            param = (paramStr && JSON.parse(paramStr)) || {};
                        } catch (e) {
                            param = {
                                __id: 'root.home',
                                __name: '首页'
                            }
                        }
                        if (param.noMenu) {
                            const ComPage = this._renderComponent(props, {
                                __id: Math.uuid(),
                                url: props.history.location.pathname,
                                param
                            });
                            return ComPage;
                        }
                        if (!this.state.status) {
                            return null;
                        }
                        return (
                            this.state.menuType&&this._menuPage(props, param)
                        );
                    }}
                />
            </HashRouter>
        );
    }
}
