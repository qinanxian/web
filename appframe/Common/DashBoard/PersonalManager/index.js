import React from 'react';
import {Icon, Modal, Spin, Radio, Menu, Button, CheckBoxItem} from 'roface';
import * as cache from '../../../../src/lib/cache';
import {post} from "../../../../src/lib/rest";
import config from "../../../../src/lib/config";
import './style/index.less';

const RadioGroup = Radio.Group;
const CheckGroup = CheckBoxItem.Group;
const pageStyle = config.surface.defaultOptions.pageStyle;

/* eslint-disable */
class RoPersonalManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            como:{
                mode:cache.getItem('pageType') || this._getModel(config.surface.defaultOptions.openModel),
                color:props.themeColor,
                layout:pageStyle === 'v3' && this.splitLayout(props.layout) || [],
                leftColor:props.colorV3
            },
            btnHover:false
        };
    }
    splitLayout(value){
        if (value === 'N') {return [];}
        if (value.length > 1) {
            return ['H','A'];
        }
        return [].concat(value);
    }
    _getModel = (defaultConfig) => {
        let model = 'tabs';
        if (defaultConfig === 'SPA') {
            model = 'spa';
        } else if (defaultConfig === 'MultiTab') {
            model = 'tabs';
        } else if (defaultConfig === 'BrowserTab') {
            model = 'btab';
        }
        return model;
    };
    handleSetupClick = () => {
        post('/logout', {}, {
            headers: {
                "X-Requested-With":"XMLHttpRequest"
            },
        }).finally(() => {
            cache.setUser({});
            cache.setSessionId('');
            cache.setItem('menuId',[]);
            window.location.reload();
        })
    };
    pageModeClick = (e,flag) => {
        if (flag === 'page') {
            this.setState({como:{...this.state.como,mode:e.target.value}},() => {
                post('/auth/user/my/saveBehavior', {id:cache.getItem('pageId'),objectId:e.target.value,objectType:'MyPageType'});
                cache.setItem('pageType', e.target.value);
                this.props.resetPageMode && this.props.resetPageMode(e.target.value,flag);
            });
        } else if (flag === 'layout') {
            this.setState({como:{...this.state.como,layout:e}},() => {
                this.props.resetPageMode && this.props.resetPageMode(e,flag);
            });
        } else if (flag === 'color') {
            window.less.modifyVars({
                '@primary-color': e.target.value
            });
            this.setState({como:{...this.state.como,color:e.target.value}},() => {
                this.props.resetPageMode && this.props.resetPageMode(e.target.value,flag);
            });
        } else {
            this.setState({como:{...this.state.como,leftColor:e.target.value}},() => {
                this.props.resetPageMode && this.props.resetPageMode(e.target.value,flag);
            });
        }
    };
    render() {
        const {prefix = 'ro'} = this.props;
        const {name,orgName,email,phone} = cache.getUser();
        return (
            <div className={`${prefix}-personal`}>
                <Spin spinning={this.state.loading}>
                    <div className={`${prefix}-personal-container`}>
                        <div className={`${prefix}-personal-container-left`}>
                            <span className={`${prefix}-personal-container-left-head`}/>
                            <span
                                className={`${prefix}-personal-container-left-setup`}
                                onClick={this.handleSetupClick}
                            >退出</span>
                        </div>
                        <div className={`${prefix}-personal-container-right`}>
                            <span className={`${prefix}-personal-container-right-user`}>{name}</span>
                            <span>部门：{orgName}</span>
                            <span className={`${prefix}-personal-container-right-role`}>
                                <span className={`${prefix}-personal-container-right-role-label`}>邮件：</span>
                                <span>{email}</span>
                            </span>
                            <span>电话：{phone}</span>
                        </div>
                        <div className={`${prefix}-personal-container-append`}>
                            <span className={`${prefix}-personal-container-append-mode`}>
                                <span>页面模式：</span>
                                <RadioGroup buttonStyle="solid" onChange={(e) => this.pageModeClick(e,'page')} value={this.state.como.mode}>
                                    <Radio.Button value="spa">SPA</Radio.Button>
                                    <Radio.Button value="tabs">页面内多tab</Radio.Button>
                                    {pageStyle !== 'v3' ? <Radio.Button value='btab'>浏览器tab</Radio.Button> : null}
                                </RadioGroup>
                            </span>
                            {
                                pageStyle ?
                                    <span className={`setup-container-append-theme`}>
                                        <span>主题颜色：</span>
                                        <RadioGroup onChange={(e) => this.pageModeClick(e,'color')} value={this.state.como.color}>
                                            <Radio value="#3078d7">
                                                <span style={{display: 'inline-block',width: 50,height: 20,background: '#3078d7'}}>{}</span>
                                            </Radio>
                                            <Radio value="#ff8712">
                                                <span style={{display: 'inline-block',width: 50,height: 20,background: '#ff8712'}}>{}</span>
                                            </Radio>
                                            <Radio value="#8362d6">
                                                <span style={{display: 'inline-block',width: 50,height: 20,background: '#8362d6'}}>{}</span>
                                            </Radio>
                                            <Radio value="#008080">
                                                <span style={{display: 'inline-block',width: 50,height: 20,background: '#008080'}}>{}</span>
                                            </Radio>
                                        </RadioGroup>
                                    </span>
                                    :
                                    null
                            }
                            {
                                pageStyle === 'v3' ?
                                    <span className={`${prefix}-personal-container-append-theme`}>
                                        <span>菜单颜色：</span>
                                        <RadioGroup onChange={(e) => this.pageModeClick(e,'leftColor')} value={this.state.como.leftColor}>
                                            <Radio value="dark">Dark</Radio>
                                            <Radio value="light">Light</Radio>
                                        </RadioGroup>
                                    </span>
                                    :
                                    null
                            }
                        </div>
                    </div>
                </Spin>
            </div>
        );
    }
}

export default RoPersonalManager;
