import React,{Fragment} from 'react';
import { HashRouter, Route } from 'react-router-dom';
import * as appframe from '../.rof.index';
import * as app from '../../app/.rof.index';
import { getUserPilot } from '../../src/lib/base';
import Header from './NavbarComponents/Header';
import NavTree from './NavbarComponents/NavTree';
import {FlexTabs, Notify, Spin} from '../../src/components';
import NotFound from './NotFound';
import ErrorPage from './ErrorPage';
import { compose } from './compose';
import config from '../../src/lib/config';
import * as cache from '../../src/lib/cache';
import {get, post, getLocationURL} from "../../src/lib/rest";
import { getModel } from "./utils";
import { depthFirstSearch } from "../../src/lib/menutransform";
import './style/index.less';
import formatdata from "../Components/jsmind/formatdata";

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
      themeColor: null,
      themeColorB: null,
      pageType: '',
      error: false,
      status: false,
      navTreeCollapse:true,
      layout:'N',
      fold:'',
      colorV3:'dark'
    };
    this.cache = {};
    // 将业务数据放入缓存
    cache.setCache('app', app);
  }
  componentDidMount() {
    const {menuLayout,skin,openModel} = config.surface.defaultOptions;
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

          const childData = res[0].children;
          //const childData = formatdata.children;
          cache.setItem('menu', childData);
          this.menu = childData;
          const menuId = JSON.parse(cache.getItem('menuId'));

          const layoutV3 = res[1].filter(item => item.objectType === 'MySkinLayoutV3');
          const colorValue = res[1].filter(item => item.objectType === 'MySkinColor');
          const pageValue = res[1].filter(item => item.objectType === 'MyPageType');
          const myLayoutV3 = layoutV3.length > 0 ? layoutV3[0].objectId : 'N';
          const mySkinColor =  (colorValue.length > 0 ? colorValue[0].objectId : skin).split('&');
          const myPageType =  pageValue.length > 0 ? pageValue[0].objectId : getModel(openModel);

          cache.setItem('layoutV3', layoutV3.length > 0 ? layoutV3[0].id : '');
          cache.setItem('colorId', colorValue.length > 0 ? colorValue[0].id : '');
          window.less.modifyVars({
            '@primary-color': mySkinColor[0],
          });
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
              themeColor: mySkinColor[0],
              themeColorB: mySkinColor[1],
              colorV3:mySkinColor.length > 2 ? mySkinColor[2] : 'dark',
              layout:myLayoutV3,
              pageType: myPageType,
              menuWidth: 256,
              status: true,
            });
          } else {
            cache.setItem('menuId', []);
            this.setState({
              themeColor: mySkinColor[0],
              themeColorB: mySkinColor[1],
              layout:myLayoutV3,
              colorV3:mySkinColor.length > 2 ? mySkinColor[2] : 'dark',
              pageType: myPageType,
              menuWidth: 256,
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
              menuWidth: this.configMenuWidth || 265,
            })
          }
        });
    }
  }
  componentDidCatch(){
    this.setState({ error: true });
  }
  _menuClick = (item) => {
    if (this.flexTabs) {
      if (item.container && item.container === 'iframe') {
        this.flexTabs.createIframeTab({ ...item });
      } else {
        this.flexTabs.createTab({...item});
      }
    }
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
  handleNavTreeCollapse = (value) => {
    this.setState({navTreeCollapse:value});
  };
  resetPageMode = (value,flag) => {
    if (flag === 'page') {
      this.setState({
        pageType:value
      });
      cache.setItem('pageType', value);
    } else if (flag === 'layout') {
      let lay = 'N';
      if (value.length < 1) {
        lay = 'N';
      } else if (value.length > 1) {
        lay = 'HA';
      } else {
        if (value[0] === 'H') {
          lay = 'H';
        } else {
          lay = 'A';
        }
      }
      this.setState({
        layout:lay
      });
      post('/auth/user/my/saveBehavior',
          {id:cache.getItem('layoutV3'),objectId:lay,objectType:'MySkinLayoutV3'});
    } else if (flag === 'color') {
      this.setState({
        themeColor: value,
      });
      post('/auth/user/my/saveBehavior',
        {id:cache.getItem('colorId'),objectId:value+'&'+this.state.themeColorB+'&'+this.state.colorV3,objectType:'MySkinColor'});
    } else {
      this.setState({
          colorV3:value,
      });
      post('/auth/user/my/saveBehavior',
        {id:cache.getItem('colorId'),objectId:this.state.themeColor+'&'+this.state.themeColorB+'&'+value,objectType:'MySkinColor'});
    }
  };
  handleFold = (value,foldRun) => {
    this.setState({fold:foldRun && value,menuWidth:value === 'fold' ? '66' : '265'});
  };
  _menuPage = (props, param) => {
    const { themeColor, loading, pageType, layout, fold, colorV3 } = this.state;
      return (
        <Fragment>
          <Spin spinning={loading} tip="正在获取系统菜单，请稍后..." />
          <div style={{ position:'relative' }}>
            <Header
              {...props}
              themeColor={themeColor}
              layout={layout}
              onFold={this.handleFold}
            />
            <div className='tree-tab-container'>
              <NavTree
                {...props}
                selectedKey={param.__id}
                menuClick={this._menuClick}
                dataMount={this._dataMount}
                layout={layout}
                fold={fold}
                colorV3={colorV3}
              />
              <FlexTabs
                {...props}
                menuWidth={this.state.menuWidth}
                data={this.state.menuData}
                themeColor={themeColor}
                colorV3={colorV3}
                pageType={pageType}
                ref={this._getInstance}
                renderComponent={this._renderComponent}
                navTreeCollapse={this.handleNavTreeCollapse}
                resetPageMode={this.resetPageMode}
                layout={layout}
                fold={fold}
              />
            </div>
          </div>
        </Fragment>
      );
  };
  render() {
    const { error } = this.state;
    let Water = '';
    if (config.waterMark && config.waterMark.path) {
      Water = this._getCom({}, {url: config.waterMark.path, __id: config.waterMark.path})
    }
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
                __id: this.menu[0] && this.menu[0].path,
                __name: this.menu[0] && this.menu[0].topic,
              }
            }
            if (param.noMenu) {
              const ComPage = this._renderComponent(props, {
                __id: Math.uuid(),
                url: props.history.location.pathname,
                param
              });
              return <Fragment>
                {Water && <Water/> }
                {ComPage}
              </Fragment>;
            }
            if (!this.state.status) {
              return null;
            }
            return (
              <Fragment>
                {Water && <Water/> }
                {this._menuPage(props, param)}
              </Fragment>
            );
          }}
          />
      </HashRouter>
    );
  }
}
