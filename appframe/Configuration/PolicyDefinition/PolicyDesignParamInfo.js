import React from 'react';

import './style/index.less';
import { Text, RadioBox, Select, AutoComplete, NumberInput, CheckBoxItem, TextArea } from 'roface';
import { Form } from '@ant-design/compatible';
const FormItem = Form.Item;

export default Form.create()(class PolicyDesignParamInfo extends React.Component{
  _getPlaceholder = () => {
    const mode = this.props.form.getFieldValue('editorSourceMode');
    if (mode === 'Dict') {
      return '参考：Gender';
    } else if (mode === 'SQL') {
      return '参考：SELECT CODE_COL as CODE,NAME_COL as NAME FROM TABLE_NAME WHERE COL1=V1';
    } else if (mode === 'CodeTable') {
      return '参考：1:男,2:女';
    }
    return '';
  };
  render(){
    const formItemLayout = {
      labelCol: { span: 3},
      wrapperCol: { span: 13 },
    };
    const { getFieldDecorator } = this.props.form;
    const { param = {}, groups = {}, policyParams = [] } = this.props;
    const codes = policyParams.map(p => p.paramCode);
    const groupDataSource = Object.keys(groups)
      .filter(a => !a.startsWith('__noGroup:'))
      .sort((a, b) => a.split(':')[0] - b.split(':')[0]);
    const itemClass = 'ro-policy-design-param-info-item';
    return (<Form className='ro-policy-design-param-info-form'>
      <div className='ro-policy-design-param-info'>
        <div
          className='ro-policy-design-param-info-left'
        >
          <div
            className='ro-policy-design-param-info-left-header'
          >
            <span>参数基本信息</span>
          </div>
          <div className='ro-policy-design-param-info-left-body'>
            <FormItem
              {...formItemLayout}
              labelWidth={150}
              label='输入输出'

              className={itemClass}
            >
              {getFieldDecorator('inOut', {
                rules: [{ required: true, message: '请输入输入输出' }],
                initialValue: param.inOut || 'Out',
              })(<RadioBox options={[{code: 'In', name: '输入'}, {code: 'Out', name: '输出'}]}/>)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label='参数代码'
              labelWidth={150}
              className={itemClass}
            >
              {getFieldDecorator('paramCode', {
                rules: [{
                  required: true,
                  validator: (rule, value, callback) => {
                    const errors = [];
                    if (!value) {
                      errors.push('请输入参数代码');
                    } else if(codes.includes(value) && (value !== param.paramCode)){
                      errors.push('参数代码已经存在了');
                    }
                    callback(errors);
                  }
                }],
                initialValue: param.paramCode,
              })(<Text/>)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              labelWidth={150}
              label='参数名'

              className={itemClass}
            >
              {getFieldDecorator('paramName', {
                rules: [{ required: true, message: '请输入参数名' }],
                initialValue: param.paramName,
              })(<Text/>)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              labelWidth={150}
              label='数据类型'

              className={itemClass}
            >
              {getFieldDecorator('dataType', {
                rules: [{ required: true, message: '请输入数据类型' }],
                initialValue: param.dataType || 'String',
              })(<Select
                options={[
                  {code: 'String', name: 'String'},
                  {code: 'Double', name: 'Double'},
                  {code: 'Integer', name: 'Integer'},
                  {code: 'Date', name: 'Date'}]}
              />)}
            </FormItem>
            {
              this.props.form.getFieldValue('inOut') === 'Out' ? (
                <div>
                  <FormItem
                    {...formItemLayout}
                    labelWidth={150}
                    label='参数值控制模式'

                    className={itemClass}
                  >
                    {getFieldDecorator('dataValueMode', {
                      rules: [{ required: true, message: '请输入参数值控制模式' }],
                      initialValue: param.dataValueMode || 'Single',
                    })(<Select
                      options={[
                        {code: 'Single', name: '单值'},
                        {code: 'Multi', name: '多值'},
                        {code: 'Range', name: '数字范围'}]}
                    />)}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    labelWidth={150}
                    label='公式计算'

                    className={itemClass}
                  >
                    {getFieldDecorator('isExpression', {
                      rules: [{ required: false, message: '请输入公式计算' }],
                      initialValue: param.isExpression && param.isExpression === 'Y',
                    })(<CheckBoxItem/>)}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    labelWidth={150}
                    label='界面编辑方式'

                    className={itemClass}
                  >
                    {getFieldDecorator('editorMode', {
                      rules: [{ required: true, message: '请输入界面编辑方式' }],
                      initialValue: param.editorMode || 'Text',
                    })(<Select
                      options={[
                        {code: 'Text', name: '文本框'},
                        {code: 'Select', name: '下拉框'},
                        {code: 'RadioBox', name: '单选框'},
                        {code: 'CheckBox', name: '多选框'},
                        {code: 'TextArea', name: '多行文本框'},
                        {code: 'Label', name: '无编辑'},
                        {code: 'ReferComponent', name: '引用组件'}
                      ]}
                    />)}
                  </FormItem>
                  {
                    this.props.form.getFieldValue('editorMode') === 'ReferComponent' ? (
                      <div>
                        <FormItem
                          {...formItemLayout}
                          labelWidth={150}
                          label='引用组件URL'

                          className={itemClass}
                        >
                          {getFieldDecorator('referUrl', {
                            rules: [{
                              required: true,
                              message: '请输入引用组件URL'
                            }],
                            initialValue: param.referUrl,
                          })(<Text/>)}
                        </FormItem>
                        <FormItem
                          {...formItemLayout}
                          labelWidth={150}
                          label='引用组件关键字'

                          className={itemClass}
                        >
                          {getFieldDecorator('referKey', {
                            rules: [{
                              required: true,
                              message: '请输入引用组件关键字'
                            }],
                            initialValue: param.referKey,
                          })(<Text/>)}
                        </FormItem>
                      </div>
                    ) : null
                  }
                  {
                    (this.props.form.getFieldValue('editorMode') === 'Select'
                      || this.props.form.getFieldValue('editorMode') === 'CheckBox'
                      || this.props.form.getFieldValue('editorMode') === 'RadioBox') ? (
                      <div>
                        <FormItem
                          {...formItemLayout}
                          labelWidth={150}
                          label='界面选项来源方式'

                          className={itemClass}
                        >
                          {getFieldDecorator('editorSourceMode', {
                            rules: [{
                              required: true,
                              message: '请输入界面选项来源方式'
                            }],
                            initialValue: param.editorSourceMode,
                          })(<RadioBox
                            options={[
                              {code: 'Dict', name: '数据字典'},
                              {code: 'SQL', name: 'SQL语句'},
                              {code: 'CodeTable', name: '代码表'}
                              ]
                            }/>)}
                        </FormItem>
                        <FormItem
                          {...formItemLayout}
                          labelWidth={150}
                          label='界面选项数据源'

                          className={itemClass}
                        >
                          {getFieldDecorator('editorSourceData', {
                            rules: [{
                              required: true,
                              message: '请输入界面选项数据源'
                            }],
                            initialValue: param.editorSourceData,
                          })(<TextArea
                            placeholder={this._getPlaceholder()}
                          />)}
                        </FormItem>
                      </div>
                    ) : null
                  }
                </div>
              ) : (
                <FormItem
                  {...formItemLayout}
                  labelWidth={150}
                  label='测试值'

                  className={itemClass}
                >
                  {getFieldDecorator('defaultValue', {
                    rules: [{ required: true, message: '测试值不能空' }],
                    initialValue: param.valueExpr,
                  })(<Text/>)}
                </FormItem>
              )
            }
          </div>
        </div>
        <div
          className='ro-policy-design-param-info-right'
        >
          <div
            className='ro-policy-design-param-info-right-header'
          >
            <span>配置界面布局</span>
          </div>
          <div className='ro-policy-design-param-info-right-body'>
            <FormItem
              {...formItemLayout}
              label='所在分组'
              labelWidth={100}

              className={itemClass}
            >
              {getFieldDecorator('groupName', {
                initialValue: param.groupName || groupDataSource[groupDataSource.length - 1],
              })(<AutoComplete dataSource={groupDataSource}/>)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              labelWidth={100}
              label='所占行数'

              className={itemClass}
            >
              {getFieldDecorator('spanRows', {
                initialValue: param.spanRows,
              })(<NumberInput item={{dataType: 'Integer'}}/>)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label='所占列数'
              labelWidth={100}

              className={itemClass}
            >
              {getFieldDecorator('spanCols', {
                initialValue: param.spanCols,
              })(<NumberInput item={{dataType: 'Integer'}} placeholder="总列数为2"/>)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label='标题内容布局'
              labelWidth={100}

              className={itemClass}
            >
              {getFieldDecorator('layoutMode', {
                initialValue: param.layoutMode || 'Horizontal',
              })(<RadioBox
                options={[
                  {code: 'Horizontal', name: '水平结构'},
                  {code: 'Vertical', name: '上下结构'}]}/>)}
            </FormItem>
          </div>
        </div>
      </div>
    </Form>);
  };
});
