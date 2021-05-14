import React from 'react';
import PropTypes from 'prop-types';
import {Spin,Button,Icon,Message,EmbedBlock,Collapse,Tooltip,openModal,DataTable,Modal} from '../../../../src/components/index';
import classnames from '../../../../src/lib/classnames';
import TaskSelect from './TaskSelect';
import { addBodyEventListener, removeBodyEventListener } from '../../../../src/lib/listener';
import { propsComposeWidthContext } from '../../../../src/components/propscompose';
import './style/area.less';
import ReactDom from "react-dom";

const Panel = Collapse.Panel;

@propsComposeWidthContext({ navigationLeft: PropTypes.bool, navigationRight: PropTypes.bool })
class  AreaProcessor extends React.Component {
    static defaultProps = {
        navigationLeft: true,
    };
    constructor(props){
        super(props);
        this.instance = {};
        this.rows = [];
        this.WorkflowId = Math.uuid();
        this.id = Math.uuid();
        this.state = {
            spinning:true,
            toggle:null,
            foldStatus:false,
            isAnimation:false,
            resourceUrl: props.resourceUrl,
            summaryUrl: props.summaryUrl,
            feedbackStatusUrl: props.feedbackStatusUrl,
            param: props.param,
            buttons: [],
            links: [],
            fieldSets: [],
            desc: {},
            showButtons : false,
            expend:[],
            commonComment:[],
            commonprompts:'init',
            commonvalue:''
        };
    }
    getChildContext(){
        return {
            navigationLeft: this.props.navigationLeft,
            navigationRight: this.props.navigationRight,
        }
    }
    componentDidMount(){
        this._getTaskResource();
        addBodyEventListener(this.id,this.mouseenter,'mouseenter');
    }
    componentWillUnmount(){
        removeBodyEventListener(this.id);
    }
    _getTaskResource(){
        const { ready, rest } = this.props;
        const { resourceUrl, summaryUrl, feedbackStatusUrl } = this.state;
        // 获取流程资源
        feedbackStatusUrl && rest.get(feedbackStatusUrl).then(res => {
            this.setState({
                showButtons: res
            })
        });
        Promise.all([rest.get(resourceUrl), rest.get(summaryUrl),rest.get('/workflow/resource/comment/list')]).then(res => {
            this.setState({
                buttons: res[0] && res[0].button,
                links: res[0] && res[0].link,
                fieldSets: res[0] && res[0].fieldSet,
                desc: res[1],
                spinning: false,
                expend: this.getExpendKeys(res[0] && res[0].fieldSet),
                commonComment:res[2] && res[2]
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
    }
    mouseenter = (e) => {
        const dom = ReactDom.findDOMNode(this.instanceDom);
        if (this.state.commonprompts !== 'init' && dom.compareDocumentPosition(e.target) !== 20) {
            this.setState({
                commonprompts:'stop',
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
    asyncRun = (events = []) => {
        // 顺序执行方法，方法返回的必须是promise
        const asyncRunEvents = async () => {
            for (let i = 0; i< events.length; i++) {
                await events[i]();
            }
        };
        return asyncRunEvents();
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
    _selectRow = (keys, rows) => {
        this.rows = rows;
    };
    getSubRegionComponent = (id) => {
        return this.instance[id];
    };
    _fieldSetReady = (id, instance) => {
        this.instance[id] = instance;
    };
    getExpendKeys = (value = []) => {
        const defaultExpend = value.map(item => item.isExpanded === 'Y' && item.id).filter(pre => pre);
        return defaultExpend;
    };
    _handleClick = () => {
        const toggleStatus = this.state.toggle;
        this.setState({
            toggle:toggleStatus === null ? true : !toggleStatus,
            isAnimation: true
        }, () => {
            setTimeout(() => {
                this.setState({
                    foldStatus:true,
                    isAnimation:false
                })
            },320)
        });
    };
    _switchPanel = (value) => {
        this.setState({
            expend:value
        });
    };
    _handleLeftIcon = () => {
        this.setState({
            toggle:!this.state.toggle,
            foldStatus:false,
            isAnimation: true
        },() => {
            setTimeout(() => {
                this.setState({isAnimation:false})
            },400)
        });
    };
    _handleLinks = (link) => {
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
    _getSummaryTemplate = () => {
        // function or reactNode
        const { desc } = this.state;
        const { summaryTemplate } = this.props;
        if (typeof summaryTemplate === 'function') {
            return summaryTemplate(desc);
        }
        return React.cloneElement(summaryTemplate, { summary: desc })
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
    _handleMouseEnter = (e) => {
       e.stopPropagation();
       this.setState({
          commonprompts:'run'
       });
    };
    _handleMouseLeave = (e) => {
       e.stopPropagation();
       this.setState({
          commonprompts:'stop'
       });
    };
    getCommon = (value) => {
       this.setState({
          commonvalue:value,
          commonprompts:'stop'
       });
    };
    render() {
        const { summaryTemplate, reading=false, readOnly=false, navigationRight, navigationLeft, offsetTop, offsetLeft, saveBtnPostion = 'bottom' } = this.props;
        const {spinning,toggle,foldStatus,isAnimation,param, showButtons,buttons,links,fieldSets,desc,expend,commonComment,commonprompts,commonvalue} = this.state;
        const classes_content = classnames({
            'areaworkflow-container-content':true,
            'areaworkflow-container-content-spread':foldStatus,
            'areaworkflow-container-content-active':isAnimation&&(toggle !== null ? toggle : false) || false,
            'areaworkflow-container-content-inactive':isAnimation&&(toggle !== null ? !toggle : false) || false
        });
        const classes_quickbox = classnames({
            'areaworkflow-container-quickbox':true,
            'areaworkflow-container-quickbox-fold':foldStatus,
            'areaworkflow-container-quickbox-active':isAnimation&&(toggle !== null ? toggle : false) || false,
            'areaworkflow-container-quickbox-inactive':isAnimation&&(toggle !== null ? !toggle : false) || false
        });
        const classes_quickbox_btncta = classnames({
            'areaworkflow-container-quickbox-btncta':true,
            'areaworkflow-container-quickbox-btncta-fold':foldStatus,
            'areaworkflow-container-quickbox-btncta-active':isAnimation&&(toggle !== null ? toggle : false) || false,
            'areaworkflow-container-quickbox-btncta-inactive':isAnimation&&(toggle !== null ? !toggle : false) || false
        });
        const classes_quickbox_fieldset = classnames({
            'areaworkflow-container-quickbox-fieldset':true,
            'areaworkflow-container-quickbox-fieldset-fold':foldStatus,
            'areaworkflow-container-quickbox-fieldset-active':isAnimation&&(toggle !== null ? toggle : false) || false,
            'areaworkflow-container-quickbox-fieldset-inactive':isAnimation&&(toggle !== null ? !toggle : false) || false
        });
        const classes_quickbox_submit = classnames({
            'areaworkflow-container-quickbox-submit':true,
            'areaworkflow-container-quickbox-submit-fold':foldStatus,
            'areaworkflow-container-quickbox-submit-active':isAnimation&&(toggle !== null ? toggle : false) || false,
            'areaworkflow-container-quickbox-submit-inactive':isAnimation&&(toggle !== null ? !toggle : false) || false
        });
        const leftIcon = toggle ? 'show' : 'hidden';
        const closeStyle = {border: '1px solid transparent'};
        const openStyle = {borderTop: 'transparent solid 1px',borderLeft: '#EAEAEA solid 1px',borderRight: '#EAEAEA solid 1px',borderBottom: '#EAEAEA solid 1px'};
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
        const workflowBtns = tempButtons.filter(item => item.resourceLocation === 'R_Flow_Button');
        return (
            <Spin spinning={spinning}>
                <div className='areaworkflow-container'>
                    <div className={classes_content}>
                        <div className='areaworkflow-container-content-header'>
                            <div className='areaworkflow-container-content-header-top'>
                                <div className='areaworkflow-container-content-header-top-title'>
                                    {desc.workflowProc && desc.workflowProc.summary}
                                </div>
                                {
                                    summaryTemplate ? this._getSummaryTemplate() : (
                                        <div className='areaworkflow-container-content-header-top-info'>
                                            <span>审批号：{desc.workflowProc && desc.workflowProc.procId}</span>
                                            <span>流程发起人：{desc.workflowProc && desc.workflowProc.sponsorName}
                                                ({desc.workflowProc && desc.workflowProc.sponsor})</span>
                                            <span>发起时间：{desc.workflowProc && desc.workflowProc.startTime}</span>
                                        </div>
                                    )
                                }
                            </div>
                            <div className={`areaworkflow-container-content-header-bottom areaworkflow-container-content-header-bottom${saveBtnPostion}`}>
                                <div style={{display:saveBtnPostion === 'top' ? 'inline-flex' : 'none'}} className={`areaworkflow-container-content-header-bottom${saveBtnPostion}-btns`}>
                                    {tempButtons.filter(item => item.id === 'WBTempSave_205_1' || item.id === 'WBSave_205_1').map(but => {
                                        return <span className={`areaworkflow-container-content-header-bottom${saveBtnPostion}-btns-item`}><Button
                                            key={but.id}
                                            icon={but.icon || ''}
                                            disabled={(reading || readOnly)}
                                            style={but.style}
                                            onClick={(e, btn) => this._buttonClick(but, btn)}>
                                            {but.name}
                                        </Button></span>;
                                    })}
                                </div>
                                <div className='areaworkflow-container-content-header-bottom-links'>
                                    {
                                        links.sort((a, b) => a.sortCode - b.sortCode).map((link,index) => {
                                            return (
                                                <span style={{paddingRight:'8px'}}>
                                                    <a
                                                        key={link.id}
                                                        style={link.style}
                                                        onClick={() => this._linkClick(link)}>
                                                        <Icon type={link.icon || ''}/>
                                                        {link.name}
                                                    </a>
                                                </span>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='areaworkflow-container-content-body'>
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
                                    fieldSets.filter(item => item.resourceLocation === 'L_Fieldset').sort((a, b) => a.sortCode - b.sortCode).map(fieldSet => {
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
                        <span style={{display:saveBtnPostion === 'top' ? 'none' : 'inline-block'}} className='areaworkflow-container-content-savebtn'>
               {
                   !(reading && readOnly) && tempButtons.filter(item => (item.resourceLocation === 'L_Button')).map(item => {
                       return <span key={item.id} onClick={() => this._buttonClick(item)} className='areaworkflow-container-content-savebtn-done'>
                             <Tooltip title={item.name}><Icon className='areaworkflow-container-content-savebtn-done-icon' type={item.icon || 'fa-save'}/></Tooltip>
                            </span>
                   })
               }
            </span>
                    </div>
                    <div className={classes_quickbox}>
                        <Icon className={`areaworkflow-container-quickbox-rightIcon${leftIcon}`} type="fa-angle-double-right" onClick={this._handleClick}>审批处理</Icon>
                        <div className={classes_quickbox_btncta} style={{display:workflowBtns.length > 0 ? '' : 'none'}}>
                            {
                                !(reading || readOnly) ?
                                    workflowBtns.sort((a, b) => a.sortCode - b.sortCode).map((but) => {
                                        return (
                                            <span
                                                key={but.id}
                                                className={`areaworkflow-container-quickbox-btncta-item`}
                                                onClick={() => this._buttonClick(but)}>
                                  <span className={`areaworkflow-container-quickbox-btncta-item-icon`}><Icon type={but.icon || ''}/></span>
                                  <span className={`areaworkflow-container-quickbox-btncta-item-text`}>{but.name}</span>
                              </span>
                                        );
                                    })
                                    :
                                    workflowBtns.filter(fit => fit.id === 'WBViewFlowGraph').sort((a, b) => a.sortCode - b.sortCode).map((but) => {
                                        return (
                                            <span
                                                key={but.id}
                                                className={`areaworkflow-container-quickbox-btncta-item`}
                                                onClick={() => this._buttonClick(but)}>
                                  <span className={`areaworkflow-container-quickbox-btncta-item-icon`}><Icon style={but.style} type={but.icon || ''}/></span>
                                  <span className={`areaworkflow-container-quickbox-btncta-item-text`}>{but.name}</span>
                              </span>
                                        );
                                    })
                            }
                        </div>
                        <div className={classes_quickbox_fieldset}>
                            {
                                fieldSets.filter(item => item.resourceLocation === 'R_Sign_Fieldset').sort((a, b) => a.sortCode - b.sortCode).map(fieldSet => {
                                    return (
                                        <div key={fieldSet.id} className={`areaworkflow-container-quickbox-fieldset-collapse`}>
                                            <span className={`areaworkflow-container-quickbox-fieldset-collapse-text`} style={{display:fieldSet.id === 'SRSignComment' ? '' : 'none'}}>
                                               <span ref={instance => this.instanceDom = instance} onMouseEnter={(e) => this._handleMouseEnter(e)} onMouseLeave={(e) => this._handleMouseLeave(e)} className={`areaworkflow-container-quickbox-fieldset-collapse-text-title`}>
                                                  常用语
                                                   <span
                                                       style={{display:commonComment.length > 0 ? '' : 'none'}}
                                                       className={`areaworkflow-container-quickbox-fieldset-collapse-text-title-list areaworkflow-container-quickbox-fieldset-collapse-text-title-list${commonprompts}`}>
                                                       {commonComment.map(item => <span key={item.id} onClick={() => this.getCommon(item.commonComment)}>{item.commonComment}</span>)}
                                                   </span>
                                               </span>
                                            </span>
                                            <EmbedBlock
                                                {...this.props}
                                                readOnly={fieldSet.right === 'Readonly' || reading}
                                                icon={fieldSet.icon || ''}
                                                style={fieldSet.style}
                                                getSubRegionComponent={this.getSubRegionComponent}
                                                url={fieldSet.action}
                                                commonvalue={commonvalue}
                                                param={{...param,
                                                    ...JSON.parse((desc.workflowProc && desc.workflowProc.pageParam) || '{}'),
                                                    workflowTask: desc
                                                }}
                                                ready={(instance) => this._fieldSetReady(fieldSet.id, instance)}
                                            />
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <div className={classes_quickbox_submit}>
                            {tempButtons.filter(item => item.resourceLocation === 'R_Sign_Button').map(but => {
                                return <Button
                                    key={but.id}
                                    icon={but.icon || ''}
                                    disabled={(reading || readOnly)}
                                    style={but.style}
                                    onClick={(e, btn) => this._buttonClick(but, btn)}>
                                    {but.name}
                                </Button>;
                            })}
                        </div>
                    </div>
                    <Icon onClick={this._handleLeftIcon} className={`areaworkflow-container-leftIcon${leftIcon}`} type="fa-angle-double-left"/>
                </div>
            </Spin>
        );
    }
}

export default AreaProcessor;

