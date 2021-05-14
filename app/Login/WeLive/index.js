import React from 'react';
import $ from 'jquery';
import {post} from '../../../src/lib/rest';
import * as cache from '../../../src/lib/cache';
import './style/index.less';

/* eslint-disable */
export default class LoginSQ extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            remember: false,
            account: false,
            password: false,
            passtext: '',
            loginState: true,
        }
    }

    componentDidMount() {
        window.location.hash = '';
        $(document).keyup((e) => {
            if (e.keyCode === 13) {
                $('#submitBtnsq').trigger('click');
            }
        });
    }

    handleSubmit = () => {
        const inputSelector = $(':input');
        const param = {
            username: inputSelector[0].value,
            password: inputSelector[1].value,
        };
        if (param.username && param.password) {
            this.setState({loginState: false});
            post('/public/logon', {}, {
                data: $.param(param),
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
            }).then(ret => {
                if (ret.code === 'Success') {
                    const session = 'X-SESSION-TOKEN';
                    if (ret[session]) {
                        cache.setUser(ret.user || {});
                        cache.setSessionId(ret[session]);
                        sessionStorage.setItem("userPwd", inputSelector[1].value)
                        window.location.reload();
                    }
                } else {
                    this.setState({account: false, password: true, passtext: ret.message, loginState: true});
                }
            }).catch(() => {
                this.setState({account: false, password: true, passtext: '连接超时', loginState: true});
            });
        } else if (!param.username && param.password) {
            this.setState({account: true, password: false});
        } else if (param.username && !param.password) {
            this.setState({account: false, password: true, passtext: '请输入密码'});
        } else {
            this.setState({account: true, password: true, passtext: '请输入密码'});
        }
    };
    handleCheckBox = () => {
        this.setState({remember: true});
    };

    render() {
        const {remember, account, password, passtext, loginState} = this.state;
        return (
            <div className='sq-container'>
                <div className='sq-container-content'>
                  <div className='sq-container-content-view' />
                    <div className='sq-container-content-form'>
                        <div className='sq-container-content-form-box'>
                            <div className='sq-container-content-form-box-title'><span>信贷工厂后管平台</span></div>
                            <div className='sq-container-content-form-box-body'>
                                <div
                                    className='sq-container-content-form-box-body-input sq-container-content-form-box-body-account'>
                                    <span className='sq-container-content-form-box-body-input-label'>用户名</span><input
                                    type='text'/>
                                    <span className='sq-container-content-form-box-body-input-line'/>
                                    <span
                                        className={`sq-container-content-form-box-body-input-tip sq-container-content-form-box-body-input-tip${account}`}>请输入用户名</span>
                                </div>
                                <div
                                    className='sq-container-content-form-box-body-input sq-container-content-form-box-body-passw'>
                                    <span
                                        className='sq-container-content-form-box-body-input-label'>密&nbsp;&nbsp;&nbsp;码</span><input
                                    type='password'/>
                                    <span className='sq-container-content-form-box-body-input-line'/>
                                    <span
                                        className={`sq-container-content-form-box-body-input-tip sq-container-content-form-box-body-input-tip${password}`}>{passtext}</span>
                                </div>
                            </div>
                            <div id='submitBtnsq'
                                 className={`sq-container-content-form-box-btn sq-container-content-form-box-btn${loginState}`}
                                 onClick={loginState ? this.handleSubmit : undefined}>登录
                            </div>
                        </div>
                        <div className='sq-container-content-form-block'/>
                    </div>
                </div>
            </div>
        );
    }
}
