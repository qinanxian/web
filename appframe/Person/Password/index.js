import React from "react";
import { Message, Notify, openModal } from '../../../src/components';
import { Form, Input, Button, Checkbox } from 'antd';
import './style/index.less'
import {post} from "../../../src/lib/rest";
import * as cache from "../../../src/lib/cache";

export default class Password extends React.Component {
  constructor(props) {
    super(props);
    this.form;
    this.prompt = '请填写包括0-9、a-z、A-Z组成的8位以上密码';
  }

  onFinish = (evt) => {
    const {rest, openLoading, closeLoading, onSuccess } = this.props;
    const { oldPwd, pwd, verifyPwd } = evt;
    if (!oldPwd || (oldPwd && oldPwd.length === 0)) {
      return Message.warn("请先填写旧密码");
    } else if (!pwd || (pwd && pwd.length === 0)) {
      return Message.warn("请填写新密码");
    }else if (pwd && pwd.length < 8) {
      return Message.warn(this.prompt);
    }  else if (oldPwd === pwd) {
      return Message.warn("不允许新密码与旧密码一致");
    } else if (pwd !== verifyPwd) {
      return Message.warn("确认密码与新密码填写不一致");
    }

    openLoading();
    const params = { oldPwd, newPwd: pwd };
    rest.post("/auth/user/updatePassword", params)
      .then((data) => {
        closeLoading();
        if (data == 1) {
          const that = this;
          onSuccess && onSuccess();
          openModal(<div>修改密码成功，关闭弹窗后将会重新登录！</div>, {
            title: '密码修改成功',
            defaultButton: true,
            onOk: (a, b, c) => { c.setLoading(false); that.quitApp(); a.close() },
            onCancel: (a, b) => that.quitApp(),
          });
        } else {
          Message.error('旧密码错误，请重新填写');
        }
      }).catch((error) => {
        closeLoading();
        Message.error(error.message);
      });
  }

  quitApp = () => {
    post('/logout', {}, {headers: { "X-Requested-With":"XMLHttpRequest" } })
      .finally(() => {
        cache.setUser({});
        cache.setSessionId('');
        cache.setItem('menuId',[]);
        window.location.reload();
      })
  }

  onFinishFailed = (evt) => {
    console.log('error', evt);
  }

  onReset = () => {
    this.form && this.form.resetFields();
  }

  render() {
    const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
    const { hideBtn } = this.props;
    return (
      <Form
        {...layout}
        ref={instance => this.form = instance}
        className="password-box"
        colon={true}
        labelAlign="right"
        name="basic"
        onFinish={this.onFinish}
        onFinishFailed={this.onFinishFailed}
      >
        <div className="password-box-info">提示：{this.prompt}</div>
        <Form.Item
          className="password-box-item"
          label="旧密码"
          name="oldPwd"
          colon={true}
        >
          <Input.Password className="password-box-item-input" placeholder="输入旧密码" size="large"/>
        </Form.Item>

        <Form.Item
          className="password-box-item"
          label="新密码"
          name="pwd"
        >
          <Input.Password className="password-box-item-input" placeholder="输入新密码" size="large"/>
        </Form.Item>

        <Form.Item
          className="password-box-item"
          label="再次输入密码"
          name="verifyPwd"
        >
          <Input.Password className="password-box-item-input" placeholder="请再次确认您的新密码" size="large"/>
        </Form.Item>
        { !hideBtn && <Form.Item>
          <Button className="password-box-btn" type="primary" htmlType="submit" size="large">
            提交
          </Button>
          <Button className="password-box-btn" htmlType="button" onClick={this.onReset} size="large">
            重置
          </Button>
        </Form.Item>
        }

      </Form>
    );
  }
}