import React from 'react';
import { Icon, Input, CheckBoxItem,Button, Modal} from '../../../src/components';
import { Form } from '@ant-design/compatible';
import './style/index.less';
import config from "../../../src/lib/config";
import $ from "jquery";
import * as cache from "../../../src/lib/cache";
import {post} from "../../../src/lib/rest";

const FormItem = Form.Item;

/* eslint-disable */
export default Form.create()(class LoginCase extends React.Component {
  componentDidMount() {
    window.location.hash = '';
  }
  _loginPage = (value) => {
    this.props.loginPage&&this.props.loginPage(value);
  };
  _pageItems() {
    return [{value:1,key:'app_1'},{value:2,key:'app_2'},{value:3,key:'app_3'}]
      .map(item => <span key={item.key} onClick={() => this._loginPage(item.key)}>{item.value}</span>);
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
  render() {
    const { getFieldDecorator } = this.props.form;
    const {name} = config['app_3'];
    return (
      <div className='loginCase-container'>
        <div className='loginCase-container-box'>
          <div className='loginCase-container-box-title'>
            {name}
          </div>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入账户名' }],
              })(
                <Input suffix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="账户名称" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }],
              })(
                <Input suffix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="账户密码" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('rememberMe', {
                valuePropName: 'checked',
                initialValue: false,
              })(
                <CheckBoxItem>这台电脑30天内免登录</CheckBoxItem>
              )}
              <a className="login-form-forgot" href="">忘记密码</a>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </FormItem>
          </Form>
          {/*<div style={{display:this.state.result}} className='loginCase-container-box-server'>请输入正确的用户名或密码</div>*/}
        </div>
        <div className='loginCase-container-menu'>
          {this._pageItems()}
        </div>
      </div>
    );
  }
})
