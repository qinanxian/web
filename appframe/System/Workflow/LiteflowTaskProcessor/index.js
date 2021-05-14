import React from 'react';
import {Button, EmbedBlock, Fieldset, Icon, Message, Modal, propsCompose, Spin,Divider} from '../../../../src/components';
import * as rest from '../../../../src/lib/rest';
import './style/index.less';
import $ from "jquery";
import LiteFlowCommit from './LiteFlowCommit';
import {post} from "../../../../src/lib/rest";

@propsCompose
export default class LiteflowTaskProcessor extends React.Component {
  static LiteFlowCommit = LiteFlowCommit;
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
      [rest.get('/workflow/liteFlow/procInst/'+this.props.param.record.taskId),
      rest.get('/workflow/liteFlow/resources/group/'+this.props.param.record.procDefKey)]).then(res => {
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
      taskId: this.props.param.record.taskId,
      comment: this.getSubRegionComponent().value
    };
    if (this.getSubRegionComponent().value) {
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
    }
  };
  
  handleSubmit = () => {
    const { param, refresh, flexTabs } = this.props;
    const re = this.getSubRegionComponent().value;
    const params = {
      taskId: this.props.param.record.taskId,
      comment: this.getSubRegionComponent().value
    };
    if (this.getSubRegionComponent().value) {
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
        <div className={`${prefix}-workflow-proc`}>
          <Divider style={{background:'#c8cacc',width:'98%',margin:'32px 0 0 20px'}}/>
          <div className={`${prefix}-workflow-proc-desc`}>
            <div className={`${prefix}-workflow-proc-links`}>
              {
                this.state.links.sort((a, b) => a.sortCode - b.sortCode).map(link => {
                  return (
                    <a
                      key={link.resourceId}
                      style={link.style}
                    >
                      <Icon type={link.icon || ''}/>
                      {link.name}
                    </a>
                  );
                })
              }
            </div>
            <div className={`${prefix}-workflow-proc-desc-header`}>
              <div className={`${prefix}-workflow-proc-desc-header-title`}>
                流程启动
              </div>
              <div className={`${prefix}-workflow-proc-desc-header-value`}>
                <span className={`${prefix}-workflow-proc-desc-header-value-label`}>审批号：<span>{desc.procId}</span></span>
                <span className={`${prefix}-workflow-proc-desc-header-value-label`}>流程发起人：<span>{desc.sponsorName+' ('+desc.createdBy+')'}</span></span>
                <span className={`${prefix}-workflow-proc-desc-header-value-label`}>发起时间：<span>{desc.startTime}</span></span>
              </div>
            </div>
          </div>
          <div className={`${prefix}-workflow-proc-blocks`}>
            {
              this.state.fieldSets.sort((a, b) => a.sortCode - b.sortCode).map(fieldSet => {
                return (
                  <Fieldset
                    key={fieldSet.resourceId}
                    legend={fieldSet.name}
                    icon={fieldSet.icon || ''}
                    style={fieldSet.style}
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
          <div className={`${prefix}-workflow-proc-operators`}>
            <div>
              <Button disabled={submitState} onClick={this.handleSubmit} type='primary'>同意</Button>
              <Button disabled={abandonState} onClick={this.voeDown} type='danger'>否决</Button>
            </div>
          </div>
        </div>
      </Spin>
    );
  }
}