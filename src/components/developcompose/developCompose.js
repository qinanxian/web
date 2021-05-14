import React from 'react';
import ReactDom from 'react-dom';

import * as rest from '../../lib/rest';
import * as config from '../../lib/config';
import {openModal, Icon, Notify, AutoTooltip, Divider, Modal, Message} from '../index';

import './style/index.less';
import {propsCompose} from '../propscompose';

/* eslint-disable */
@propsCompose
class DevelopConsole extends React.Component {
    _openNewTab = (id) => {
        const param = {
            dataId: id,
            flag: false,
            noMenu: true,
            windowTab: true
        };
        const paramStr = btoa(encodeURIComponent(JSON.stringify(param)));
        window.open(rest.getLocationURL(`/main.html#/System/SystemManage/DisplayTemplate/TemplateDetail/?${paramStr}`));
    };

    _clearDataFormCache = () => {
        const {rest} = this.props;
        rest.post("/devtool/dataform/clearDataformCache")
            .then((res) => {
                if (null !== res) {
                    Message.info("清除模版缓存成功");
                }
            }).catch((res) => {
            Notify.error(res.message)
        });
    };

    _clearDictCache = () => {
        const {rest} = this.props;
        rest.post("/devtool/dict/clearDictCache")
            .then((res) => {
                if (null !== res) {
                    Message.info("清除数据字典缓存成功");
                }
            }).catch((res) => {
            Notify.error(res.message)
        });
    };

    _clearAllCache = () => {
        // 清空所有缓存
        this._isBeingDeveloped('清空所有缓存');
    };

    _showCommonIcons = () => {
        // 常用图标
        // this._isBeingDeveloped('常用图标');
        const param = {
            noMenu: true,
        };
        const paramStr = btoa(encodeURIComponent(JSON.stringify(param)));
        window.open(rest.getLocationURL(`/main.html#/ShowCase/Layout/Icon/CommonIconList/?${paramStr}`));
    };

    _showIconsLibrary = () => {
        // 常用图标
        // this._isBeingDeveloped('常用图标');
        const param = {
            noMenu: true,
        };
        const paramStr = btoa(encodeURIComponent(JSON.stringify(param)));
        window.open(rest.getLocationURL(`/main.html#/ShowCase/Layout/Icon?${paramStr}`));
    };

    _openNewWindow = () => {
        // 新窗口打开
        this._isBeingDeveloped('新窗口打开');
    };

    _openFlexNewTab = (id) => {
        const {flexTabs, onCancel} = this.props;
        flexTabs && flexTabs.goToTab && flexTabs.goToTab(id);
        onCancel && onCancel();
    };

    _isBeingDeveloped = (name = '') => {
        Notify.info({
            description: `${name}功能正在开发中...`,
            duration: 3,
        });
    };

    _exportDataFormToJson = () => {
        const {rest} = this.props;
        rest.post("/devtool/dataform/dbTransferToJsonFile")
            .then((res) => {
                if (null !== res) {
                    Modal.info({
                        content: `导出成功，文件路径: ${res}`,
                    });
                }
            }).catch((res) => {
            Notify.error(res.message)
        });
    };

    _exportDictToJson = () => {
        const {rest} = this.props;
        rest.post("/devtool/dict/dbTransferFile")
            .then((res) => {
                if (null !== res) {
                    Modal.info({
                        content: `导出成功，文件路径: ${res}`,
                    });
                }
            }).catch((res) => {
            Notify.error(res.message)
        });
    };

    _importDictToDB = () => {
        const {rest} = this.props;
        rest.post("/devtool/dict/fileTransferDb")
            .then((res) => {
                if (null !== res) {
                    Modal.info({
                        content: `导入数据字典成功，导入数目: ${res}`,
                    });
                }
            }).catch((res) => {
            Notify.error(res.message)
        });
    };


    render() {
        return (
            <div className='ro-develop-console'>
                <div className='ro-develop-console-left'>
                    <Divider dashed>缓存处理</Divider>
                    <ul>
                        <li onClick={() => this._clearDataFormCache()}><Icon type="laptop"/>&nbsp;<a>清空显示模板缓存</a></li>
                        <li onClick={() => this._clearDictCache()}><Icon type="laptop"/>&nbsp;<a>清空代码表缓存</a></li>
                    </ul>
                    <Divider dashed>导入</Divider>
                    <ul>
                        <li onClick={() => this._importDictToDB()}><Icon type="profile"/>&nbsp;<a>数据字典导入</a></li>
                    </ul>
                    <Divider dashed>导出</Divider>
                    <ul>
                        <li onClick={() => this._exportDataFormToJson()}><Icon type="profile"/>&nbsp;<a>显示模版导出</a></li>
                        <li onClick={() => this._exportDictToJson()}><Icon type="profile"/>&nbsp;<a>数据字典导出</a></li>
                    </ul>
                    <Divider dashed>开发工具</Divider>
                    <ul>
                        <li onClick={() => this._openNewWindow()}><Icon type="link"/>&nbsp;<a>新窗口打开</a></li>
                    </ul>
                    {
                        this.props.dataFormId ? <div>
                                <Divider dashed>显示模板</Divider>
                                <ul>
                                    <li onClick={() => this._openNewTab(this.props.dataFormId)}>
                                        <AutoTooltip placement="bottom" title={this.props.dataFormId}>
                                            <div>
                                                <Icon type="edit"/>&nbsp;
                                                <a>{this.props.dataFormId}</a>
                                            </div>
                                        </AutoTooltip>
                                    </li>
                                    {/*<li onClick={() => this._openFlexNewTab('C10-10-22')}>*/}
                                        {/*<AutoTooltip placement="bottom" title={'显示模板列表'}>*/}
                                            {/*<div>*/}
                                                {/*<Icon type="edit"/>&nbsp;*/}
                                                {/*<a>显示模板列表</a>*/}
                                            {/*</div>*/}
                                        {/*</AutoTooltip>*/}
                                    {/*</li>*/}
                                </ul>
                            </div> : null
                    }
                    <Divider dashed>图标</Divider>
                    <ul>
                        <li onClick={() => this._showCommonIcons()}><Icon type="fa-image"/><a>常用图标</a></li>
                        <li onClick={() => this._showIconsLibrary()}><Icon type="fa-diamond"/><a>图标库</a></li>
                    </ul>
                </div>
                <div className='ro-develop-console-right'>
                    <Divider dashed>页面参数</Divider>
                    <div className='ro-develop-console-right-border'>
            <pre className="ro-develop-console-right-bash">
            {JSON.stringify({
                dataFormId: this.props.dataFormId,
                url: this.props.tabItem && this.props.tabItem.url,
                params: this.props.params || {}
            }, null, 2)}
          </pre>
                    </div>
                </div>
            </div>
        );
    }
}

export const developCompose = (Com, context) => {
      if (context) {
        Com.contextTypes = context;
      }
    class DevelopCompose extends React.Component {
        componentDidMount() {
            this.dom = ReactDom.findDOMNode(this);
            this.dom.setAttribute('tabindex', '0');
            this._addOnKeyDown(this._onKeyDown);
        }

        componentWillUnmount() {
            this._removeOnKeyDown();
        }

        _onKeyDown = (e) => {
            e.stopPropagation();
            //e.preventDefault();
            if (e.altKey && e.keyCode === 49) {
                openModal(<DevelopConsole {...this.props} />,
                    {
                        title: <span><Icon type="API"/>开发控制台</span>,
                        width: '61.8%',
                    });
            } else if (e.keyCode === 113) {
              // 增加f2快捷导出功能 导出列表所有数据
              if (this.instance && this.instance.exportExcel) {
                this.instance.exportExcel(config.default.exportExcel);
              }
            }
        };
        _addOnKeyDown = (fuc) => {
            this.dom.onkeydown = fuc;
        };
        _removeOnKeyDown = () => {
            this.dom.onkeydown = null;
        };

        render() {
            /* eslint-disable */
            return (
                <div
                    style={{outline: 'none'}}
                >
                    <Com {...this.props} ref={instance => this.instance = instance}/>
                </div>
            );
        }
    }
    return DevelopCompose;
};

export const developComposeWidthContext = context => (Com) => {
  return developCompose(Com, context);
};
