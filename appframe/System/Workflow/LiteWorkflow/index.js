import React from 'react';
import $ from 'jquery';
import {openModal, Input, Button, Icon, DataTable,Modal, Select, TextArea} from '../../../../src/components';
import { Form } from '@ant-design/compatible';
import {post,get} from "../../../../src/lib/rest";
import {getUser} from "../../../../src/lib/cache";
import './style/index.less';
const FormItem = Form.Item;
export default Form.create()(class LiteApply extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      expr: getUser().id + '->',
      applySate:false,
      selecteData: [],
    };
  }
  componentDidMount() {
    this.props.form.setFieldsValue({
      expr: getUser().name.replace(/\s+/g,"") + '->',
    });
    get('/workflow/liteFlow/liteForm/').then(res => {
      console.log(res);
      this.setState({
        selecteData:res
      });
    }).catch(e => {
      Modal.error({
        title: '获取数据失败',
        content: e.message,
      });
    });
  }
  _selectRow = (keys, rows) => {
    this.rows = rows;
  };
  openModal = (value, num) => {
    openModal(<DataTable dataFormId={value} onSelectRow={this._selectRow}/>, {
      onOk: (modal) => {
        const ids = this.rows.map( (item) => num ? item.id : item.roleId);

        const names =  this.rows.map( (item) => num ? item.name : item.name);
        const itemValue = this.props.form.getFieldValue('expr') || '';
        this.props.form.setFieldsValue({
          expr: itemValue + names,
        });
        this.setState({
          expr: num ? this.state.expr + ids : this.state.expr + 'r:' + ids,
        });
        modal.close();
      },
      defaultButton: true,
      title: '选择人列表'
    })
  };
  addOperator = (value) => {
    const itemValue = this.props.form.getFieldValue('expr') || '';
    if (value !== '-') {
      this.props.form.setFieldsValue({
        expr: itemValue+value,
      });
      this.setState({
        expr: this.state.expr + value,
      });
    }
  };
  validateLength = (rule, value, callback) => {
    switch (rule.field) {
      case 'expr':
        let result = value.split('->').slice(1);
        result = result[0].replace(/\s+/g,"");
        if (result==='')
          callback('请选择流程表达式');
        break;
      case 'summary':
        if (value === undefined) {
          callback('请输入流程简述');
        }else if(value&&value.length > 50) {
          callback('不能超过50个字');
        }
        break;
    }
    callback();
  };
  handleSubmit = (e) => {
    const { param, refresh, flexTabs } = this.props;
    const {selecteData} = this.state;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const params = {
        Expr: this.state.expr,
        Summary: values.summary,
        ProcDefKey:selecteData.filter(item => item.name === values.select)[0].procDefKey || 'liteSimple',
        ObjectId:'001',
        ObjectType:'objectType',
      };
      if (!err) {
        this.setState({
          applySate:false,
        });
        post('/workflow/liteFlow/start', {}, {
          data: $.param(params),
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
          headers: {
            "X-Requested-With": "XMLHttpRequest"
          },
        })
          .then(result => {
              if (result.latestTasks[0]) {
                flexTabs.open('流程审批', 'System/Workflow/LiteflowTaskProcessor/LiteFlowCommit', {
                  ...this.props,
                  procId:result.procId,
                  ProcDefKey:'liteSimple',
                  ObjectId:'001',
                  ObjectType:'objectType',
                  result:result.latestTasks[0],
                });
              } else {
                Modal.error({
                  title: '申请失败',
                  content: '申请失败，请检查表达式后重新填写'
                });
                refresh(param.__id);
              }
          })
      }
    });
  };
  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 17, offset: 1},
    };
    return (
      <div className="liteApply-container">
        <div className="liteApply-container-text">
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label='     '
              colon={false}
            >
              {getFieldDecorator('button')(
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  height:'35px'
                }}>
                  <div className="liteApply-container-button">
                    <span><Button type='primary' onClick={() => this.openModal('workflow-WorkflowUsersList', 1)}>选择人</Button></span>
                    <span><Button onClick={() => this.openModal('workflow-WorkflowRoleList')}>选择岗位</Button></span>
                    <span><Icon type='roic-array' onClick={() => this.addOperator('->')}/></span>
                    <span><Icon type='roic-or' onClick={() => this.addOperator('|')}/></span>
                    <span><Icon type='roic-and' onClick={() => this.addOperator('&')}/></span>
                  </div>
                  <span className="liteApply-container-delete"><Icon type='arrowleft' onClick={() => this.addOperator('-')}/></span>
                </div>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label='流程表达式'
            >
              {getFieldDecorator('expr',{
                rules: [{
                  required:true,
                  validator: this.validateLength,
                }],
              })(<TextArea
                autosize={true}
                disabled={true}
              />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label='流程简述'
            >
              {getFieldDecorator('summary', {
                rules: [{
                  required:true,
                  validator: this.validateLength,
                }],
              })(<Input placeholder='xx客户-xx合同-xx流程'/>)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label='选择框'
            >
              {getFieldDecorator('select')(<Select
                options={this.state.selecteData.map(item => item.name)}
                onChange={(value) =>{
                  this.setState({ decimalMiss: value !== 'Double' });
                }}
              />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label=' '
              colon={false}
            >
              {getFieldDecorator('submit')(<div style={{ textAlign:'right' }}><Button disabled={this.state.applySate} htmlType="submit">发起申请</Button></div>)}
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
})


