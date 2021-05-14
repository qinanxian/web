import React, { Fragment } from 'react';
import App from './App';
import Appv3 from './Appv3';
import LoginFrame from '../Login/LoginFrame/index';
import LoginBusiness from '../Login/LoginBusiness/index';
import LoginCase from '../Login/LoginCase/index';
import ModifyPassword from '../Person/ModifyPassword';
import * as cache from '../../src/lib/cache';
import * as config from '../../src/lib/config';
import * as app from '../../app/.rof.index';

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.initTimb();
    this.state = {
      loading: true,
      loginItem: config.default.loginDefault
    };
  }
  initTimb(){
    const timbP = cache.getItem('timb');
    if (!timbP) {
      cache.setItem('timb',[]);
    }
  }
  parseUrl = () => {
    const hash = window.location.hash;
    let paramStr = '';
    let param = {};
    let flag = false;
    try {
      paramStr = decodeURIComponent(atob(hash.split('?')[1]));
      param = (paramStr && JSON.parse(paramStr)) || {};
      flag = param.noLogin;
    } catch (e) {
      flag = false;
    }
    return flag;
  };
  handleLoginPage = (value) => {
    this.setState({
      loginItem:value
    });
  };
  _getObject = (obj, fields) => {
    return fields.filter(field => !!field).reduce((a, b) => {
      const tempB = b.replace(/\W/g, '');
      return a && a[tempB];
    }, obj);
  };
  getDefaultLoginPage = () => {
    switch(this.state.loginItem){
      case 'app_1':
        return (
          <LoginFrame
            loginPage={this.handleLoginPage}
          />
        );
      case 'app_2':
        return (
          <LoginBusiness
            loginPage={this.handleLoginPage}
          />
        );
      case 'app_3':
        return (
          <LoginCase
            loginPage={this.handleLoginPage}
          />
        );
      default:
        return (
          <LoginFrame
            loginPage={this.handleLoginPage}
          />
        ) ;
    }
  };
  setLoginPage = () => {
    let Water = '';
    if (config.default.waterMark && config.default.waterMark.path) {
      Water = this._getObject(app, config.default.waterMark.path.split('/'));
    }
    // 增加自定义登录页面的入口
    if (config.default.loginPage) {
      // 如果在配置文件中配置了登录页面则使用配置的登录界面
      const fields = config.default.loginPage.split('/');
      const Com = this._getObject(app, fields);
      if (Com) {
        return <Fragment>
          {Water && <Water/>}
          <Com/>
        </Fragment>;
      }
      return this.getDefaultLoginPage();
    }
    return this.getDefaultLoginPage();
  };
  render() {
    const mainpage = config.default.surface.defaultOptions.pageStyle === 'v3' ? <Appv3/> : <App/>;
    return (
      cache.getSessionId() ?
        mainpage
        :
        (!this.parseUrl() ?
          this.setLoginPage()
        :
        <ModifyPassword/>)
    );
  }
}
