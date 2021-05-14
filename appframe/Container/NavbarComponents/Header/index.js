import React from 'react';
import ReactDom from 'react-dom';
import {Icon,propsCompose,FlexTabs} from 'roface';
import config from '../../../../src/lib/config';
import * as cache from '../../../../src/lib/cache';
import {post} from "../../../../src/lib/rest";
import { addBodyEventListener, removeBodyEventListener } from '../../../../src/lib/listener';
import './index.less';
import * as appframe from '../../../.rof.index';

const list = config.surface.userHeaderNavMenuAddons;

@propsCompose
export default class Header extends React.Component{
    constructor(props){
        super(props);
        this.id = Math.uuid();
        this.state = {
            menuFold:'unfold',
            foldRun:'',
            isFullScreen:false,
            down:true,
            dropRun:''
        };
    }
    componentDidMount(){
        addBodyEventListener(this.id,this.click,'click');
    }
    componentWillUnmount(){
        removeBodyEventListener(this.id);
    }
    _getObject = (obj, fields) => {
        return fields.filter(field => !!field).reduce((a, b) => {
            const tempB = b.replace(/\W/g, '');
            return a && a[tempB];
        }, obj);
    };
    getCom = (url) => {
        if (!url) {
            return null;
        }
        return this._getObject(cache.getCache('app') || {}, url.split('/'))
            || this._getObject(appframe, url.split('/'));
    };
    render() {
        const {layout,themeColor} = this.props;
        const {menuFold,foldRun,down,dropRun,isFullScreen} = this.state;
        const personalObj = cache.getUser();
        // 展开组件
        let LogoFull = this.getCom(config.brand.banner.logoFull);
        if (LogoFull) {
            LogoFull = <LogoFull/>;
        } else {
            LogoFull = <span>未配置</span>
        }
        // 收起组件
        let LogoShort = this.getCom(config.brand.banner.logoShort);
        if (LogoShort) {
            LogoShort = <LogoShort/>;
        } else {
            LogoShort = <span>未配置</span>;
        }
        // 标题
        let Title = this.getCom(config.brand.banner.title);
        if (Title) {
            Title = <Title/>;
        } else {
            Title = <span>未配置</span>;
        }
        return (
            <div className={`header-container`}>
                <div style={{background:themeColor}} className={`header-container-left${layout} header-container-left${foldRun && menuFold}`}>
                    {
                        menuFold !== 'fold' ? LogoFull: LogoShort
                    }
                </div>
                <div style={{background:themeColor}} className={`header-container-right header-container-right${layout} header-container-right${foldRun && menuFold}`}>
                    <div className={`header-container-right-icon`}>
                        <Icon onClick={this.handleFoldClick} type={menuFold === 'unfold' ? 'menu-fold' : 'menu-unfold'}/>
                    </div>
                    <div>{Title}</div>
                    <div className={`header-container-right-setup`}>
                        <Icon onClick={this.handleScreenClick} type={isFullScreen&&'shrink' || 'arrowsalt'}/>
                        <div
                            ref={instance => this.instance = instance}
                            className={`header-container-right-setup-personal`}
                            onMouseEnter={(e) => this.handleMouseOver(e)}
                            onMouseLeave={(e) => this.handleMouseOut(e)}
                        >
                            <span className={`header-container-right-setup-personal-header`}/>
                            <span className={`header-container-right-setup-personal-text`}>{personalObj.name}</span>
                            <span className={`header-container-right-setup-personal-down header-container-right-setup-personal-down${dropRun}${down}`}><Icon type='down'/></span>
                            <span className={`header-container-right-setup-personal-bg${dropRun}${down}`}/>
                            <span
                                onClick={this.childClick}
                                style={{background:themeColor}}
                                className={`header-container-right-setup-personal-box header-container-right-setup-personal-box${dropRun}${down}`}
                            >
                                <span data-key='home'>个人信息</span>
                                <span data-key='setup'>个人设置</span>
                                <span data-key='password'>修改密码</span>
                                {list.map((item,index) => {
                                    return <span key={`cst${index}`} data-key={item.key}>{item.name}</span>;
                                })}
                                <span data-key='quit'>退出</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    handleMouseOver = (e) => {
        e.stopPropagation();
        this.setState({
            down:false,
            dropRun:'run'
        })
    };
    handleMouseOut = (e) => {
        e.stopPropagation();
        this.setState({
            down:true,
            dropRun:'run'
        })
    };
    childClick = (e) => {
        e.stopPropagation();
        const ret = e.target.getAttribute('data-key');
        if (ret === 'quit') {
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
        } else if (ret === 'home') {
            this.props.flexTabs.open(`个人主页`, `Person/Information`);
        } else if (ret === 'setup') {
            this.props.flexTabs.open(`个人设置`, `Person/Setup`);
        } else if (ret === 'password') {
          this.props.flexTabs.open(`修改密码`, `Person/Password`);
        }else {
            const fit = list.filter(item => item.key === ret);
            fit.length > 0 && this.props.flexTabs.open(fit[0].name,fit[0].component);
        }
    };
    click = (e) => {
        const dom = ReactDom.findDOMNode(this.instance);
        if (!this.state.down && dom.compareDocumentPosition(e.target) !== 20) {
            this.setState({
                down:true,
            });
        }
    };
    handleScreenClick = () => {
        this.setState({isFullScreen:!this.state.isFullScreen},() => {
            this.state.isFullScreen ? this.requestFullScreen() : this.exitFullScreen();
        });
    };
    requestFullScreen = () => {
        const element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        }
        else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        }
        else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
        else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    };
    exitFullScreen = () => {
        const element = document;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        }
        else if (element.mozCancelFullScreen) {
            element.mozCancelFullScreen();
        }
        else if (element.webkitCancelFullScreen) {
            element.webkitCancelFullScreen();
        } else if (element.msExitFullscreen) {
            element.msExitFullscreen()
        }
        else if (element.exitFullscreen) {
            element.exitFullscreen();
        }
    };
    handleHomeClick = () => {
        this.props.flexTabs.goToTab && this.props.flexTabs.goToTab();
    };
    handleFoldClick = () => {
        this.setState({
            menuFold:this.state.menuFold === 'unfold' ? 'fold' : 'unfold',
            foldRun:'run'
        },() => {
            this.props.onFold && this.props.onFold(this.state.menuFold,'run');
        });
    };
}
