import React from 'react';
import {Button, EmbedBlock, Fieldset, Icon, Message, Modal, propsCompose, Spin} from '../../../../src/components';
import * as rest from '../../../../src/lib/rest';
import './style/index.less';
import $ from "jquery";
import {post} from "../../../../src/lib/rest";

@propsCompose
export default class LiteFlowCommit extends React.Component {
    constructor(props) {
        super(props);
        this.instance = {};
        this.state={
            spinning:false,
            links:[],
            fieldSets: [],
            desc: {},
            submitState: false,
            abandonState: false,
        }
    }
    componentDidMount(){
        Promise.all(
            [rest.get('/workflow/liteFlow/procInst/'+this.props.param.result.taskId),
                rest.get('/workflow/liteFlow/resources/group/'+this.props.param.ProcDefKey)]).then(res => {
            this.setState({
                links: res&&res[1].Link,
                fieldSets: res&&res[1].Fieldset,
                desc:res[0]
            });
        }).catch(e => {
            Modal.error({
                title: '获取流程数据失败',
                content: e.message,
            });
        });
    }
    voeDown = () => {
        const { param, refresh, flexTabs } = this.props;
        const params = {
            taskId: this.props.param.result.taskId,
            comment: this.getSubRegionComponent().value
        };
        if (this.getSubRegionComponent().value) {
          this.setState({
            abandonState:true,
          });
            post('/workflow/liteFlow/reject', {}, {
                data: $.param(params),
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
            })
                .then(() => {
                    Modal.success({
                        message: '流程已否决',
                    });
                    flexTabs.close(param.__id);
                    refresh(param.param.__id);
                });
        } else {
            Message.error('请填写签署意见');
          this.setState({
            abandonState:false,
          });
        }
    };

    handleSubmit = () => {
        const { param, refresh, flexTabs } = this.props;
        const re = this.getSubRegionComponent().value;
        const params = {
            taskId: this.props.param.result.taskId,
            comment: this.getSubRegionComponent().value
        };
        if (this.getSubRegionComponent().value) {
            this.setState({
              submitState:true,
            });
            post('/workflow/liteFlow/commit', {}, {
                data: $.param(params),
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
            })
                .then(result => {
                    if (null!==result){
                        Modal.info({
                            title: '提交结果',
                            content: "提交成功"
                        });
                    }else {
                        Modal.info({
                            title: '提交结果',
                            content: "提交失败"
                        });
                    }
                    flexTabs.close(param.__id);
                    refresh(param.param.__id);
                });
        } else {
            Message.error('请填写签署意见');
          this.setState({
            submitState:false,
          });
        }
    };
    _fieldSetReady = (id, instance) => {
        this.instance[id] = instance;
    };
    getSubRegionComponent = (id) => {
        return this.instance[id];
    };
    render() {
        const { prefix = 'ro' } = this.props;
        const { desc,submitState,abandonState } = this.state;
        return (
            <Spin spinning={this.state.spinning}>
                <div className={`${prefix}-workflow-procd`}>
                    <div className={`${prefix}-workflow-procd-desc`}>
                        <div className={`${prefix}-workflow-procd-border`}>{}</div>
                        <div className={`${prefix}-workflow-procd-links`}>
                            {
                                this.state.links.sort((a, b) => a.sortCode - b.sortCode).map(link => {
                                    return (
                                        <a
                                            key={link.resourceId}
                                            style={{style:link.style}}
                                        >
                                            <Icon type={link.icon || ''}/>
                                            {link.name}
                                        </a>
                                    );
                                })
                            }
                        </div>
                        <div className={`${prefix}-workflow-procd-desc-header`}>
                            <div className={`${prefix}-workflow-procd-desc-header-title`}>
                                流程启动
                            </div>
                            <div className={`${prefix}-workflow-procd-desc-header-value`}>
                                <span>审批号：{desc.procId}</span>
                                <span>流程发起人：{desc.sponsorName+' ('+desc.createdBy+')'}</span>
                                <span>发起时间：{desc.startTime}</span>
                            </div>
                        </div>
                    </div>
                    <div className={`${prefix}-workflow-procd-blocks`}>
                        {
                            this.state.fieldSets.sort((a, b) => a.sortCode - b.sortCode).map(fieldSet => {
                                return (
                                    <Fieldset
                                        key={fieldSet.resourceId}
                                        legend={fieldSet.name}
                                        icon={fieldSet.icon || ''}
                                        style={{style:fieldSet.style}}
                                        expanded={fieldSet.isExpanded === 'Y'}
                                    >
                                        <EmbedBlock
                                            {...this.props}
                                            readOnly={fieldSet.right === 'Readonly'}
                                            url={fieldSet.action}
                                            getSubRegionComponent={this.getSubRegionComponent}
                                            ready={(instance) => this._fieldSetReady(fieldSet.id, instance)}
                                        />
                                    </Fieldset>
                                );
                            })
                        }
                    </div>
                    <div className={`${prefix}-workflow-procd-operators`}>
                        <div>
                            <Button disabled={submitState} onClick={this.handleSubmit} type='primary'>提交申请</Button>
                            <Button disabled={abandonState} onClick={this.voeDown} type='danger'>流程废弃</Button>
                        </div>
                    </div>
                </div>
            </Spin>
        );
    }
}