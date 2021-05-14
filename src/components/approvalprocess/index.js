import React from 'react';
import moment from 'moment';
import jq from 'jquery';
import {Divider} from '../index';
import {get} from '../../lib/rest';
import './style/index.less';
/* eslint-disable */
export default class ApprovalProcess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource:[],
      params:props.params,
    };
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.params && nextProps.params !== this.state.params){
      Promise.all(
        [get(`/workflow/process/procInstComments/${nextProps.params}`),get('/base/dicts/WorkflowTaskStatus')])
        .then((ret) => {
          this.setState({
            dataSource:this._replaceDict(ret),
          });
        });
    }
    
  }
  componentDidMount(){
    const {params} = this.state;
    if(params){
      Promise.all(
        [get(`/workflow/process/procInstComments/${params}`),get('/base/dicts/WorkflowTaskStatus')])
        .then((ret) => {
          this.setState({
            dataSource:this._replaceDict(ret),
          });
        });
    }
  }
  
  _replaceDict = (value) => {
    const approvalObj = value[0].taskStage || {};
    const reverseKeys = Object.keys(approvalObj).reverse();
    const preResult = reverseKeys.filter(sorted => approvalObj[sorted].length > 0).map((itemObj) => {
      const message = jq.parseJSON(itemObj);
      const divideGroup =  approvalObj[itemObj].map((items,index) => {
        const temp = approvalObj[itemObj];
        if (items.type) {
          const dictValue = value[1].items.filter((filItem) => filItem.code === items.type);
          return {
            ...items,
            typeDesc:dictValue[0] && dictValue[0].name,
            assignee:temp[index + 1] && temp[index + 1]['userName'] || message.owner,
          };
        }
        return {...items,assignee:message.owner};
      });
      return {
        groups:divideGroup,
        title: message.taskName || '',
        createdTime: message.createdTime || ''
      };
    });
    return preResult.map(items => {
      return {
        ...items,
        groups:this.sortData(items.groups)
      };
    });
  };
  sortData = (values) => {
    if (values.length > 1) {
      return values.sort((a, b) => new Date(a.createdTime) - new Date(b.createdTime));
    }
    return values;
  };
  structData = (value) => {
    const deliverToArr = [];
    let transUser;
    value.map((item,index) => {
      transUser = item.assignee;
      if (item.type === 'deliverTo') {
        if (value.length > index + 1) {
          deliverToArr.push({
            ...item,
            deliverToUser:item.assignee || null,
            takeAdvice:[]
          });
        } else {
          deliverToArr.push({
            ...item,
            deliverToUser:item.assignee || null,
          });
        }
      }
      if (item.type && item.type !== 'deliverTo') {
        if (value.length > index + 1) {
          deliverToArr.push({
            ...item,
            takeAdvice:[]
          });
        } else {
          deliverToArr.push(item);
        }
      }
      if (item.type === null) {
        if (deliverToArr.length > 0) {
          const lastItem = deliverToArr.slice(-1)[0];
          if (lastItem.takeAdvice) {
            const newItem = lastItem.takeAdvice.push(item);
            console.log(newItem);
            deliverToArr.splice(deliverToArr.length - 1,1,lastItem);
          } else {
            deliverToArr.push(item);
          }
        } else {
          deliverToArr.push(item);
        }
      }
    });
    return deliverToArr;
  };
  renderTakeAdvice = (prefix,value) => {
    return value.reverse().map((item,index) => {
      return (
        <div key={index} className={`${prefix}-approval-container-box-body-right-head-advice`}>
          <Divider className={`${prefix}-approval-container-box-body-right-head-advice-line`} dashed/>
          <div className={`${prefix}-approval-container-box-body-right-head-advice-title`}>
            <span>{item.solicitorSummary}</span>
            <span>{item.createdTime}</span>
          </div>
          <div className={`${prefix}-approval-container-box-body-right-head-advice-note`}>
            {item.solicitComment}
          </div>
          <div className={`${prefix}-approval-container-box-body-right-head-advice-reply`}>
            <div className={`${prefix}-approval-container-box-body-right-head-advice-reply-title`}>
              <span>{item.userName} 反馈意见：</span>
              <span>{item.updatedTime}</span>
            </div>
            <div className={`${prefix}-approval-container-box-body-right-head-advice-reply-result ${prefix}-font-${item.solicitReply ? '' : 'null'}`}>
              {item.solicitReply ? item.solicitReply : item.userName + '尚未回复'}
            </div>
          </div>
        </div>
      );
    });
  };
  renderContent = (prefix,value,index,flag) => {
    if (value.type === 'deliverTo') {
      return (
        <div key={index} className={`${prefix}-approval-container-box-body-right-head`}>
          <div className={`${prefix}-approval-container-box-body-right-head-title`}>
            <span>{value.userName} 转 {value.assignee} 处理 【{value.typeDesc}】</span>
            <span>{value.createdTime}</span>
          </div>
          <div className={`${prefix}-approval-container-box-body-right-head-content`}>{value.content}</div>
          {!value.takeAdvice ? '' : this.renderTakeAdvice(prefix,value.takeAdvice)}
        </div>
      );
    } else if (value.type) {
      return (
        <div key={index} className={`${prefix}-approval-container-box-body-right-head`}>
          <div className={`${prefix}-approval-container-box-body-right-head-title`}>
            <span>{value.userName}<span>【{value.typeDesc}】</span></span>
            <span>{value.createdTime}</span>
          </div>
          <div className={`${prefix}-approval-container-box-body-right-head-content`}>{value.content}</div>
          {!value.takeAdvice ? '' : this.renderTakeAdvice(prefix,value.takeAdvice)}
        </div>
      );
    }
    return (
      <div key={index}>
        <div className={`${prefix}-approval-container-box-body-right-head`}>
          <div className={`${prefix}-approval-container-box-body-right-head-title`}>
            <span>{value.solicitorSummary}</span>
            <span>{value.createdTime}</span>
          </div>
          <div className={`${prefix}-approval-container-box-body-right-head-content`}>
            {value.solicitComment}
          </div>
          <div style={{paddingLeft:'30px'}} className={`${prefix}-approval-container-box-body-right-head-title`}>
            <span>{value.userName} 反馈意见：</span>
            <span>{value.updatedTime}</span>
          </div>
          <div style={{paddingLeft:'30px'}} className={`${prefix}-approval-container-box-body-right-head-content ${prefix}-font-${value.solicitReply ? '' : 'null'}`}>
            {value.solicitReply ? value.solicitReply : value.userName  + '尚未回复'}
          </div>
        </div>
        <Divider className={`${prefix}-approval-container-box-body-right-head-${flag ? 'line' : 'adline'}`} dashed/>
      </div>
    );
  };
  render() {
    const { dataSource } = this.state;
    const { prefix = 'ro' } = this.props;
    return (
      <div className={`${prefix}-approval`}>
        <ul className={`${prefix}-approval-container`}>
          {
            dataSource.map((items,indexArr)=>{
              return (
                <li key={indexArr} className={`${prefix}-approval-container-box`}>
                  <div className={`${prefix}-approval-container-box-left`}>
                    <div className={`${prefix}-approval-container-box-left-time`}>
                      <span>{moment(items.createdTime).format('YYYY-MM-DD')}</span>
                      <span>{moment(items.createdTime).format('HH:mm')}</span>
                    </div>
                    <div className={`${prefix}-approval-container-box-left-header`}>
                      <span className={`${prefix}-approval-container-box-left-header-circle`}/>
                      <img className={`${prefix}-approval-container-box-left-header-icon`} src='http://bpic.588ku.com/element_origin_min_pic/01/55/09/4557474d965eb71.jpg!r650'/>
                    </div>
                  </div>
                  <div className={`${prefix}-approval-container-box-body`}>
                    <div className={`${prefix}-approval-container-box-body-title`}>{items.title}</div>
                    <div className={`${prefix}-approval-container-box-body-right`}>
                      {items.groups.map((item,index) => this.renderContent(prefix,item,index,index+1<items.groups.length))}
                    </div>
                  </div>
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }
}
