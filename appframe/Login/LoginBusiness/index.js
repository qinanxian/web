import React from 'react';
import $ from 'jquery';
import { Icon, Input,Button, CheckBoxItem, Modal} from '../../../src/components';
import { Form } from '@ant-design/compatible';
import './style/index.less';
import {post} from "../../../src/lib/rest";
import * as cache from "../../../src/lib/cache";
import * as rest from '../../../src/lib/rest';
import config from "../../../src/lib/config";
const FormItem = Form.Item;
/* eslint-disable */

export default Form.create()(class Login extends React.Component {
  componentDidMount() {
    window.location.hash = '';
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, param) => {
      if (!err) {
        post('/public/logon', {}, {
          data: $.param(param),
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
          headers: {
            "X-Requested-With":"XMLHttpRequest"
          },
        }).then(result => {
          if (result.code === 'Success') {
            const session = 'X-SESSION-TOKEN';
            if (result[session]) {
              cache.setUser(result.user || {});
              cache.setSessionId(result[session]);
              window.location.reload();
            }
          } else {
            Modal.error({
              content: '请输入正确的用户名或密码',
            });
          }
        })
      }
    });
  };
  _forgetPw = () =>{
    const param = {
      noMenu: true,
      noLogin:true
    };
    const paramStr =  btoa(encodeURIComponent(JSON.stringify(param)));
    window.open(rest.getLocationURL(`/main.html#/Person/ModifyPassword/?${paramStr}`));
  };
  _changeVerifyCode=()=>{
    let dom = $('#imgVerify');
    dom[0].src = rest.getRequestURL("/public/getValidateCode")+'?d='+new Date()*1;
  };
  _loginPage = (value) => {
    this.props.loginPage&&this.props.loginPage(value);
  };
  _pageItems() {
    return [{value:1,key:'app_1'},{value:2,key:'app_2'},{value:3,key:'app_3'}]
      .map(item => <span key={item.key} onClick={() => this._loginPage(item.key)}>{item.value}</span>);
  }

  render() {
    const {name,owner,slogan} = config['app_2'];
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      wrapperCol: {
        span: 20,
        offset: 0
      }
    };
    return (
      <div className='login-busin'>
        <div className='login-busin-block'>
          <div className='login-busin-block-left'>
            <div className='login-busin-block-left-top'>
              <span>{slogan.split('&')[0]}</span>
              <span>{slogan.split('&')[1]}</span>
              <span>{slogan.split('&')[2]}</span>
            </div>
            <div className='login-busin-block-left-bottom'>
              <span>{owner.split('&')[0]}</span>
              <span>{owner.split('&')[1]}</span>
            </div>
          </div>
          <div className='login-busin-block-right'>
            <div className='login-busin-block-right-title'>{name}</div>
            <div className='login-busin-block-right-form'>
              <Form onSubmit={this.handleSubmit}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('username', {
                    rules: [{ required: true, message: '请输入账户名' }],
                  })(
                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入账户" />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入账户密码' }],
                  })(
                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入密码" />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('rememberMe', {
                    valuePropName: 'checked',
                    initialValue: false,
                  })(
                    <CheckBoxItem>记住密码</CheckBoxItem>
                  )}
                  <a className="login-form-forgotbs" href="">忘记密码</a>
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    登录
                  </Button>
                </FormItem>
              </Form>

            </div>
            {/*<div style={{display:this.state.result}} className='login-container-block-right-server'>请输入正确的用户名或密码</div>*/}
          </div>
        </div>
        <div className='login-busin-menu'>
          {this._pageItems()}
        </div>
      </div>
    );
  }
})
