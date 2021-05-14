import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
// import { addOnResize } from '../../../../src/lib/listener';
import config from '../../../../src/lib/config';
import {Button, EmbedBlock, openModal, Icon, Spin, Modal, DataTable,Divider,Collapse} from '../../../../src/components';
import './style/default.less';
import TaskSelect from './TaskSelect';
import { propsComposeWidthContext } from '../../../../src/components/propscompose';

const Panel = Collapse.Panel;
const pageStyle = config.surface.defaultOptions.pageStyle;

@propsComposeWidthContext({ navigationLeft: PropTypes.bool, navigationRight: PropTypes.bool })
class DefaultProcessor extends React.Component {
    static defaultProps = {
        navigationLeft: true,
    };
    constructor(props) {
        super(props);
        this.instance = {};
        this.rows = [];
        this.WorkflowId = Math.uuid();
        this.state = {
            spinning: true,
            resourceUrl: props.resourceUrl,
            summaryUrl: props.summaryUrl,
            feedbackStatusUrl: props.feedbackStatusUrl,
            param: props.param,
            buttons: [],
            links: [],
            fieldSets: [],
            desc: {},
            showButtons : false,
            expend:[]
        }
    }
    getChildContext(){
        return {
            navigationLeft: this.props.navigationLeft,
            navigationRight: this.props.navigationRight,
        }
    }
    componentDidMount() {
        // debugger
        this._getTaskResource();
        const id = this.parseUrl();
        const tab = document.getElementById(id);
        this.tab = tab;
        const fucArray = tab.fucArray || {};
        this.scrollHeight = 0;
        fucArray[this.WorkflowId] = this.scrollFunc;
        tab.fucArray = fucArray;
        tab.onscroll = (e) => {
            Object.keys(tab.fucArray).forEach((id, index) => {
                tab.fucArray[id](index, e);
            });
        };
        //tab.style.overflow = 'hidden';
        // addOnResize(this.checkHeight,true);
        // setTimeout(this.checkHeight(),500);
    }
    componentWillUnmount() {
        if (this.tab && this.tab.fucArray) {
            delete this.tab.fucArray[this.WorkflowId]
        }
    }
    // checkHeight = () => {
    //   const blockDom = ReactDom.findDOMNode(this.blockInstance);
    //   console.log('height:',blockDom.getBoundingClientRect());
    // };
    scrollFunc = (index, e) => {
        const workFlowDom = ReactDom.findDOMNode(this.workFlowInstance);
        const blockDom = ReactDom.findDOMNode(this.blockInstance);
        const rect = workFlowDom.getBoundingClientRect();
        if (rect.top <= 107 + index * 36) {
            if (index !== 0) {
                //blockDom.style.top =  parseFloat(blockDom.style.top.split('px')[0])
                + e.currentTarget.scrollTop - this.scrollHeight + 'px';
            } else {
                //blockDom.style.top = e.currentTarget.scrollTop + 'px';
            }
        } else {
            //blockDom.style.top = 0 + 'px';
        }
        this.scrollHeight = e.currentTarget.scrollTop;
    };
    parseUrl = () => {
        const hash = window.location.hash;
        let paramStr = '';
        let param = {};
        try {
            paramStr = decodeURIComponent(atob(hash.split('?')[1]));
            param = (paramStr && JSON.parse(paramStr)) || {};
        } catch (e) {
            console.log('浏览器参数异常', e)
        }
        return param.__id;
    };
    _getTaskResource = () => {
        const { ready } = this.props;
        const { resourceUrl, summaryUrl, feedbackStatusUrl } = this.state;
        // 获取流程资源
        const { rest } = this.props;
        feedbackStatusUrl && rest.get(feedbackStatusUrl).then(res => {
            this.setState({
                showButtons: res
            })
        });
        Promise.all([rest.get(resourceUrl), rest.get(summaryUrl)]).then(res => {
            this.setState({
                buttons: res[0] && res[0].button,
                links: res[0] && res[0].link,
                fieldSets: res[0] && res[0].fieldSet,
                desc: res[1],
                spinning: false,
                expend: this.getExpendKeys(res[0] && res[0].fieldSet)
            }, () => {
                ready && ready({
                    openSubmitDialog: this.openSubmitDialog,
                    getSubRegionComponent: this.getSubRegionComponent,
                    asyncRun: this.asyncRun,
                    updateFieldSets: this.updateFieldSets,
                    getFieldSets: this.getFieldSets,
                });
            })
        }).catch(e => {
            Modal.error({
                title: '获取流程数据失败',
                content: e.message,
            });
        })
    };
    getExpendKeys = (value = []) => {
        const defaultExpend = value.map(item => item.isExpanded === 'Y' && item.id).filter(pre => pre);
        return defaultExpend;
    };
    _linkClick = (link) => {
        const { param, desc } = this.state;
        const { flexTabs, linkClick } = this.props;
        const pageParam = JSON.parse(desc.workflowProc.pageParam);
        const tempParam = {...param,
            workflowTask: {
                ...desc,
                workflowProc:{
                    ...desc.workflowProc,
                    pageParam:JSON.parse(desc.workflowProc.pageParam)
                }
            },
            pageParam:{...param,...pageParam,readonly: link.right === 'Readonly'},
            readonly: link.right === 'Readonly'
        };
        const tempLink = (linkClick && linkClick(link, tempParam)) || link;
        tempLink.action && flexTabs.open(tempLink.name, tempLink.action, tempParam.pageParam)
    };
    _buttonClick = (data, btn) => {
        const { buttonClick } = this.props;
        const { param, desc } = this.state;
        const { workflowProc } = desc;

        buttonClick && buttonClick(data, {...param, workflowTask: {
                ...desc,
                workflowProc:{
                    ...desc.workflowProc,
                    pageParam:JSON.parse(desc.workflowProc.pageParam)
                }
            },
            ...JSON.parse((workflowProc && workflowProc.pageParam) || '{}')
        }, btn);
    };
    _fieldSetReady = (id, instance) => {
        this.instance[id] = instance;
    };
    _getSummaryTemplate = () => {
        // function or reactNode
        const { desc } = this.state;
        const { summaryTemplate } = this.props;
        if (typeof summaryTemplate === 'function') {
            return summaryTemplate(desc);
        }
        return React.cloneElement(summaryTemplate, { summary: desc })
    };
    _selectRow = (keys, rows) => {
        this.rows = rows;
    };
    openSubmitDialog = (data, cb, title,flag) => {
        const selectionType = flag ? data.selectionType ||'single': data.selectionType || "multiple";
        // 打开弹出框
        if (data.dataFormId) {
            // 弹出列表
            openModal(
                <DataTable
                    params={data.params}
                    selectionType={selectionType}
                    dataFormId={data.dataFormId}
                    majorKey='id'
                    onSelectRow={this._selectRow}/>, {
                    onOk: (modal, c,btn) => {
                        cb(modal, this.rows, 'ok');
                        if (this.rows) {
                            btn.setDisabled(false);
                        }
                    },
                    defaultButton: true,
                    title,
                    onCancel: (modal) => cb(modal, this.rows, 'cancel')})
        } else {
            // 弹出接口请求
            const { rest } = this.props;
            openModal(<TaskSelect onSelectRow={this._selectRow} procInstId={data.procInstId} rest={rest}/>, {
                onOk: (modal) => cb(modal, this.rows, 'ok'),
                defaultButton: true,
                title,
                onCancel: (modal) => cb(modal, this.rows, 'cancel')
            });
        }
    };
    getFieldSets = () => {
        return this.state.fieldSets;
    };
    updateFieldSets = (fieldSets) => {
        this.setState({
            fieldSets,
        });
    };
    getSubRegionComponent = (id) => {
        return this.instance[id];
    };
    asyncRun = (events = []) => {
        // 顺序执行方法，方法返回的必须是promise
        const asyncRunEvents = async () => {
            for (let i = 0; i< events.length; i++) {
                await events[i]();
            }
        };
        return asyncRunEvents();
    };
    _switchPanel = (value) => {
        this.setState({
            expend:value
        });
    };
    _getTitleHeight = (a,b) => {
        if (a && b) {
            return 63;
        } else if(!a && b || a && !b){
            return 110;
        }else {
            return 133;
        }
    };
    render() {
        const { prefix = 'ro', summaryTemplate, reading, readOnly, navigationRight, navigationLeft, offsetTop, offsetLeft } = this.props;
        const { param, showButtons,buttons,links,fieldSets,desc,expend } = this.state;
        const tempButtons = showButtons ? [
            {
                id: "WBSaveComment",
                icon: 'edit',
                name: '反馈意见',
                action: 'TaskResolve.feedback(param)'
            },
            {
                id: "WBViewFlowGraph",
                icon: 'fa-eye',
                name: '查看流程',
                action: 'TaskResolve.lookWorkflow(param)'
            }] : buttons;
        const linkState = links.length > 0 ? '' : 'none';
        const btnState = buttons.length > 0 ? '' : 'none';
        const titleHeight = this._getTitleHeight(linkState,btnState);
        const closeStyle = {border: '1px solid transparent'};
        const openStyle = {borderTop: 'transparent solid 1px',borderLeft: '#EAEAEA solid 1px',borderRight: '#EAEAEA solid 1px',borderBottom: '#EAEAEA solid 1px'};
        return (
            <Spin spinning={this.state.spinning}>
                <div
                    className={`${prefix}-workflow-proc`}
                    ref={(instance) => this.workFlowInstance = instance}
                >
                    <div className={`${prefix}-workflow-proc-blocks`} ref = {(instance) => this.blockInstance = instance}>
                        <div className={`${prefix}-workflow-proc-blocks-desc`}>
                            {
                                summaryTemplate ? this._getSummaryTemplate() : (
                                    <div className={`${prefix}-workflow-proc-blocks-desc-header`}>
                                        <div className={`${prefix}-workflow-proc-blocks-desc-header-title`}>
                                            {this.state.desc.workflowProc && this.state.desc.workflowProc.summary}
                                        </div>
                                        <div className={`${prefix}-workflow-proc-blocks-desc-header-value`}>
                                            <span className={`${prefix}-workflow-proc-blocks-desc-header-value-label`}>审批号：<span>{this.state.desc.workflowProc && this.state.desc.workflowProc.procId}</span></span>
                                            <span className={`${prefix}-workflow-proc-blocks-desc-header-value-label`}>流程发起人：<span>{this.state.desc.workflowProc && this.state.desc.workflowProc.sponsorName}
                                                ({this.state.desc.workflowProc && this.state.desc.workflowProc.sponsor})</span></span>
                                            <span className={`${prefix}-workflow-proc-blocks-desc-header-value-label`}>发起时间：<span>{this.state.desc.workflowProc && this.state.desc.workflowProc.startTime}</span></span>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <div
                            style={{display:btnState}}
                            className={`${prefix}-workflow-proc-blocks-buttons`}
                        >
                            {
                                tempButtons.sort((a, b) => a.sortCode - b.sortCode).map((but) => {
                                    return (<Button
                                        disabled={(but.id !== 'WBViewFlowGraph') && (reading || readOnly)}
                                        key={but.id}
                                        style={but.style}
                                        // type={type}
                                        icon={but.icon || ''}
                                        onClick={(e, btn) => this._buttonClick(but, btn)}
                                    >
                                        {but.name}
                                    </Button>);
                                })
                            }
                        </div>
                        <Divider dashed className={`${prefix}-workflow-proc-blocks-${linkState}divider`}/>
                        <div style={{display:linkState}} className={`${prefix}-workflow-proc-blocks-links`}>
                            {
                                links.sort((a, b) => a.sortCode - b.sortCode).map((link,index) => {
                                    return (
                                        <a
                                            key={link.id}
                                            style={link.style}
                                            onClick={() => this._linkClick(link)}>
                                            <Icon type={link.icon || ''}/>
                                            {link.name}
                                        </a>
                                    );
                                })
                            }
                        </div>
                    </div>
                    <div className={`${prefix}-workflow-proc-collapse`} style={{marginTop: 10,overflow: pageStyle === 'v3' ? 'visible' : 'auto'}}>
                        <Collapse
                            activeKey={expend}
                            style={{border: 0,background: '#ffffff'}}
                            onChange={this._switchPanel}
                            isWorkflow
                            fieldSets={fieldSets}
                            navigationRight={navigationRight}
                            navigationLeft={navigationLeft}
                            offsetTop={offsetTop}
                            offsetLeft={offsetLeft}
                        >
                            {
                                fieldSets.sort((a, b) => a.sortCode - b.sortCode).map(fieldSet => {
                                    const retStyle = expend.filter(item => item === fieldSet.id).length ? openStyle : closeStyle;
                                    return (
                                        <Panel
                                            blockId={fieldSet.id}
                                            key={fieldSet.id}
                                            header={fieldSet.name}
                                            style={{...retStyle,marginBottom:'12px',borderTopLeftRadius:'8px',borderBottomLeftRadius:'8px',background:'#fafafa'}}
                                        >
                                            <EmbedBlock
                                                {...this.props}
                                                readOnly={fieldSet.right === 'Readonly' || reading}
                                                icon={fieldSet.icon || ''}
                                                style={fieldSet.style}
                                                getSubRegionComponent={this.getSubRegionComponent}
                                                url={fieldSet.action}
                                                param={{...param,
                                                    ...JSON.parse((desc.workflowProc && desc.workflowProc.pageParam) || '{}'),
                                                    workflowTask: desc
                                                }}
                                                ready={(instance) => this._fieldSetReady(fieldSet.id, instance)}
                                            />
                                        </Panel>
                                    );
                                })
                            }
                        </Collapse>
                    </div>
                </div>
            </Spin>
        );
    }
}

/*WorkflowTaskProcessor.childContextTypes = {
  navigation: PropTypes.bool,
};*/

export default DefaultProcessor;
