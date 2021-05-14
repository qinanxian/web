import React from "react";
import {Radio, CheckBoxItem} from 'roface';
import {post} from "../../../src/lib/rest";
import * as cache from "../../../src/lib/cache";
import config from "../../../src/lib/config";
import './style/index.less';

const RadioGroup = Radio.Group;
const CheckGroup = CheckBoxItem.Group;

export default class Setup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            como:{
                mode:cache.getItem('pageType') || this._getModel(config.surface.defaultOptions.openModel),
                color:props.themeColor,
                layout:this.splitLayout(props.layout) || [],
                leftColor:props.colorV3
            },
        };
    }
    splitLayout(value){
        if (value === 'N') {return [];}
        if (value.length > 1) {
            return ['H','A'];
        }
        return [].concat(value);
    }
    render() {
        return (
            <div className={`setup-container`}>
                <div className={`setup-container-append`}>
                    <span className={`setup-container-append-mode`}>
                        <span>页面模式：</span>
                        <RadioGroup buttonStyle="solid" onChange={(e) => this.pageModeClick(e,'page')} value={this.state.como.mode}>
                            <Radio.Button value="spa">SPA</Radio.Button>
                            <Radio.Button value="tabs">页面内多tab</Radio.Button>
                        </RadioGroup>
                    </span>
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
                    <span className={`setup-container-append-theme`}>
                        <span>菜单主题：</span>
                        <RadioGroup onChange={(e) => this.pageModeClick(e,'leftColor')} value={this.state.como.leftColor}>
                            <Radio value="dark">Dark</Radio>
                            <Radio value="light">Light</Radio>
                        </RadioGroup>
                    </span>
                </div>
            </div>
        );
    }
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
}
