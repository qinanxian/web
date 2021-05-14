import React from 'react';
import { Icon, Button } from '../../../src/components/index';
import $ from 'jquery';
import './style/index.less';
import {getLocationURL, post} from "../../../src/lib/rest";
import * as cache from "../../../src/lib/cache";
import config from "../../../src/lib/config";

/* eslint-disable */

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadState: false,
    }
  }
  componentDidMount() {
    window.location.hash = '';
    $(document).keyup((e) => {
      if (e.keyCode === 13) {
        $('#submit').trigger('click');
      }
    });
  }
  _submit = () => {
    this.setState({
      loadState: true
    });
    const inputSelector = $(':input');
    const rememberMe = false;
    const param = {
      username: inputSelector[0].value,
      password: inputSelector[1].value,
      rememberMe: rememberMe,
    };
    if (param.username && param.password) {
      post('/public/logon', {}, {
        data: $.param(param),
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        headers: {
          "X-Requested-With":"XMLHttpRequest"
        },
      })
        .then((result) => {
          if (result.code === 'Success') {
            const session = 'X-SESSION-TOKEN';
            if (result[session]) {
              cache.setUser(result.user || {});
              cache.setSessionId(result[session]);
              window.location.reload();
            }
            this.setState({
              loadState: true
            });
          } else {
            $('#resultlog').css("display", "inline-block").text("账号或密码有误");
            $('#submit').attr('class', 'loginBtn-active');
            this.setState({
              loadState: false
            });
          }
        })
        .catch((reason) => {
          $('#submit').attr('class', 'loginBtn-active');
          $('#resultlog').css("display", "inline-block").text("账号或密码有误");
          this.setState({
            loadState: false
          });
        });
    } else {
      $('#submit').attr('class', 'loginBtn-active');
      $('#resultlog').css("display", "inline-block").text("账户或密码不能为空");
      this.setState({
        loadState: false
      });
    }
  };
  _openNewPage = () => {
    const param = {
      noMenu: true,
      noLogin: true
    };
    const paramStr = btoa(encodeURIComponent(JSON.stringify(param)));
    window.open(getLocationURL(`/main.html#/Person/ModifyPassword/?${paramStr}`));
  };
  _loginPage = (value) => {
    this.props.loginPage&&this.props.loginPage(value);
  };
  _pageItems() {
    return [{value:1,key:'app_1'},{value:2,key:'app_2'},{value:3,key:'app_3'}]
      .map(item => <span key={item.key} onClick={() => this._loginPage(item.key)}>{item.value}</span>);
  }
  render() {
    const { logo, slogan } = config['app_1'];
    return (
      <div className="container">
        <div className="container-box">
          <div className="box-left">
            <div>{slogan.split('&')[0]}</div>
            <div>{slogan.split('&')[1]}</div>
          </div>
          <div className="box-right">
            <div className="right-icon">
              <Icon type={logo}/>
            </div>
            <div className="right-bottom">
              <div className="accountbox">
                <span className="accountIcon" />
                <input className="account" type="text" name="account" placeholder="请输入账号" />
              </div>
              <div className="passwordbox">
                <span className="passwordIcon" />
                <input defaultValue='000000' className="password" type="password" name="password" placeholder="请输入密码" />
              </div>
              <span id="resultlog" />
              <div className="switchbox">
                <div className="switchgroup">
                  <input type="checkbox" name="remember" id="switch" className="switchBtn" />
                  <label htmlFor="switch" className="state" />
                  <span style={{ marginLeft: '5px' }}>记住密码</span>
                </div>
                <span className='forgetPassword' onClick={this._openNewPage}>忘记密码</span>
              </div>
              <Button type='primary' id='submit' className='loginBtn-active' onClick={this._submit} loading={this.state.loadState}>
                <Icon type='arrowright' style={{ display: this.state.loadState ? 'none' : '' }}/>
              </Button>
            </div>
          </div>
        </div>
        <div className='container-menu'>
          {this._pageItems()}
        </div>
      </div>
    );
  }
}
