import React from 'react';
import * as dataform from '../../../../../src/lib/dataform';
import { Form } from '@ant-design/compatible';
import {
  Button, Icon, Collapse, Text, Modal, Notify, Select, RadioBox,
  CheckBoxItem, Table
} from '../../../../../src/components';
import * as components from '../../../../../src/components';
import * as rest from "../../../../../src/lib/rest";
import * as config from '../../../../../src/lib/config';
import ExprList from './ExprList';

import './style/index.less';

const Panel = Collapse.Panel;
const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const comSize = 'small';

const EditableCell = ({value, com, onChange, options}) => {
    const Com = components[com];
    if (com === 'Select' || com === 'RadioBox' || com === 'CheckBoxItem') {
        return (
            <Com
                size={comSize}
                value={value}
                onChange={onChange}
                options={options}
                optionName="name"
                optionField="code"
                isTable
            />
        );
    }
    return (
        <Com
            size={comSize}
            value={value}
            onChange={onChange}
            isTable
        />
    );
};

export default Form.create()(class ElementDetail extends React.Component {
    static ExprList = ExprList;
  constructor(props){
    super(props);
      this.filterLWidth = 200;
      this.filterMWidth = 150;
      this.filterSWidth = 50;
    this.state = {
      data: {},
      loading: false,
      decimalMiss: false,
      validatorColumns: [
          {
              title: '#',
              dataIndex: 'number',
              key: 'number',
              width: this.filterSWidth,
              render: (text, record, index) => <span style={{ width: this.filterSWidth }}>{index}</span>,
          },
          {
              title: '操作',
              dataIndex: 'opt',
              key: 'opt',
              width: this.filterMWidth,
              render: (text, record, index) => this._createValidatorButton(record, index),
          },
          {
              title: '标识码',
              dataIndex: 'code',
              key: 'code',
              width: this.filterMWidth,
              render: (text, record, index) => this._renderValidatorColumns('code', 'Text', text, record, index),
          },
          {
              title: '执行方式',
              dataIndex: 'runAt',
              key: 'runAt',
              width: this.filterLWidth,
              render: (text, record, index) =>
                  this._renderValidatorColumns('runAt', 'Select', text && text || 'Server', record, index,
                      [
                          {code: 'Server', name: '服务端'},
                          {code: 'Client', name: '客户端'},
                      ]),
          },
          {
              title: '执行类型',
              dataIndex: 'mode',
              key: 'mode',
              width: this.filterLWidth,
              render: (text, record, index) =>
                  this._renderValidatorColumns('mode', 'Select', text && text || 'HandlerMethod', record, index,
                      [
                          {code: 'HandlerMethod', name: 'Handler方法'},
                          {code: 'RegExp', name: '正则表达式'},
                          {code: 'JSFunction', name: 'JS函数'},
                      ]),
          },
          {
              title: '执行脚本',
              dataIndex: 'expr',
              key: 'expr',
              width: this.filterLWidth,
              render: (text, record, index) =>
                  this._renderValidatorColumns('expr', 'Text', text && text, record, index),
          },
          {
              title: '默认消息',
              dataIndex: 'defaultMessage',
              key: 'defaultMessage',
              width: this.filterLWidth,
              render: (text, record, index) =>
                  this._renderValidatorColumns('defaultMessage', 'Text', (text && text), record, index),
          },
          {
              title: '默认消息国际化代码',
              dataIndex: 'defaultMessageI18nCode',
              key: 'defaultMessageI18nCode',

              render: (text, record, index) =>
                  this._renderValidatorColumns('defaultMessageI18nCode', 'Text', (text && text), record, index),
          }
      ]
    };
  }

  componentDidMount(){
    const { history, closeLoading, openLoading, param } = this.props;
    if (param) {
      openLoading && openLoading();
      dataform.getAdmin(`/dataform/${param.dataId}/${param.dataCode}`).then((res) => {
        this.setState({
          data: res,
          decimalMiss: res.dataType !== 'Double'
        }, () => {
          closeLoading && closeLoading();
        });
      });
    }
  }

  widthChange = (width, height) => {
    this.setState({width, height});
  };

  _filterField = (obj, field) => {
    const tempObj = {};
    Object.keys(obj).filter((f) => {
      if (field.includes(f)) {
        if (!tempObj.elementUIHint) {
          tempObj.elementUIHint = {};
        }
        tempObj.elementUIHint[f] = obj[f];
        return false;
      }
      return true;
    }).forEach((f) => {
      tempObj[f] = obj[f];
    });
    return tempObj;
  };

  _saveData = () => {
    Modal.info({
      title: '温馨提示',
      content: '显示模版的配置已经移动到工具AmixBuilder，如果您没有该工具，请联系研发部',
    });
    /*const { param, refresh } = this.props;
    console.log(this.state.data);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          loading: true,
        });
        Object.keys(values).map((item) => {
          if (typeof values[item] === 'string') values[item] = values[item].trim();
        });
        dataform.postAdmin(`/dataform/${param && param.dataId}/element`,
          {
            ...this.state.data,
            ...this._filterField(values,
              ['readonly', 'required', 'dataFormat', 'maskFormat', 'textAlign', 'editStyle', 'note',
                'dictCodeMode', 'dictCodeExpr', 'prefix', 'suffix', 'tips', 'tipsI18nCode',
                'noteI18nCode', 'visible', 'rank', 'mediaQuery', 'htmlStyle', 'colspan',
                'eventExpr', 'dictCodeLazy', 'dictCodeTreeLeafOnly', 'dictCodeTreeFull', 'placeholder']),
          }).then(() => {
          Notify.success({
            message: '保存成功',
          });
          refresh && refresh(param.tabId);
          this.setState({
            loading: false,
          });
        }).catch((e) => {
          Modal.error({
            title: '保存失败',
            content: JSON.stringify(e),
          });
          this.setState({
            loading: false,
          });
        });
      }
    });*/
  };

    _addValidatorData = (record, index) => {
        // 添加校验条件
        const { length } = this.state.data.validatorList || [];
        const tempArray = [...(this.state.data.validatorList || [])];
        const nextElement = tempArray[index + 1];
        let code = parseInt(record.code) || 1000;
        code = parseInt(nextElement ? (parseInt(nextElement.code) + code) / 2 : code + 10);
        const newField = { expr: ``, runAt: `Server`, mode: `HandlerMethod`, key: Math.uuid(), code: code,
            defaultMessage: ``, defaultMessageI18nCode: `` };
        if (!record) {
            tempArray.push(newField)
        } else {
            tempArray.splice(index + 1, 0, newField);
        }
        this.setState({
            data: {
                ...this.state.data,
                validatorList: tempArray,
            },
        });
    };

    _openExprHelp = () => {
        const { flexTabs } = this.props;

        const param = {
            windowTab: true
        };
        const tab = {
            name: `常用正则表达式参考页面`,
            url: 'System/SystemManage/DisplayTemplate/ElementDetail/ExprList',
        };

        if (flexTabs && flexTabs.open && !param.windowTab) {
            flexTabs.open(tab.name, tab.url, {
                dataId: 'exprid',
                flag: false,
            });
        } else {
            const paramStr =  btoa(encodeURIComponent(JSON.stringify({
                dataId: 'exprid',
                noMenu: true,
            })));
            window.open(rest.getLocationURL(`/main.html#/${tab.url}/?${paramStr}`));
        }

    };

    _renderValidatorColumns = (name, com, text, record, index, options) => {
        if ('mode' === name && text === 'RegExp') {
            return (
                <div
                    style={{
                        whiteSpace: 'nowrap',
                        justifyContent: 'space-between'
                    }}
                >
                    <EditableCell
                        value={text}
                        com={com}
                        onChange={value => this._dataChange(name, value, record.code, 'validatorList')}
                        options={options}
                    />
                    <Icon
                        type="questioncircleo"
                        style={{ marginLeft: '5px' }}
                        onClick={this._openExprHelp}
                    />
                </div>
            )
        }
       return <EditableCell
            value={text}
            com={com}
            onChange={value => this._dataChange(name, value, record.code, 'validatorList')}
            options={options}
        />
    };

    _createValidatorButton = (record, index) => {
        return (
            <ButtonGroup>
              <Button onClick={() => this._addValidatorData(record, index)} icon="plus" type="primary" size={comSize}/>
              <Button onClick={() => this._deleteValidatorData(record)} icon="minus" type="primary" size={comSize}/>
            </ButtonGroup>
        );
    };

    _deleteValidatorData = (record) => {
        this.setState({
            data: {
                ...this.state.data,
                validatorList: this.state.data.validatorList.filter(filtersItem => filtersItem.code !== record.code),
            },
        });
    };

    _dataChange = (name, value, code, colType) => {
        this.setState({
            data: {
                ...this.state.data,
                [colType]: this.state.data[colType].map((ele) => {
                    if (ele.code === code) {
                        if (name.includes('.')) {
                            const arrays = name.split('.');
                            return {
                                ...ele,
                                [arrays[0]]: {
                                    ...ele[arrays[0]],
                                    [arrays[1]]: typeof value === 'string' ? value.trim() : value,
                                }
                            }
                        }
                        return {
                            ...ele,
                            [name]: typeof value === 'string' ? value.trim() : value,
                        };
                    }
                    return ele;
                }),
            },
        });
    };
  _getDataType = (e) => {
    const { form } = this.props;
    let tempValue = form.getFieldValue('dataType');
    switch (e) {
      case 'Double':
      case 'Currency': tempValue = 'Double'; break;
      case 'Integer': tempValue = 'Integer'; break;
      case 'CheckBox': tempValue = 'StringArray'; break;
      case 'DatePicker':
      case 'YearMonthPicker':
        tempValue = 'Date'; break;
    }
    form.setFieldsValue({dataType: tempValue})
  };
  _getDataFormat = (e) => {
    const { form } = this.props;
    let tempValue = form.getFieldValue('dataFormat');
    switch (e) {
      case 'Double': tempValue = 'Double'; break;
      case 'Currency': tempValue = 'Currency'; break;
      case 'Integer': tempValue = 'Integer'; break;
      case 'DatePicker':
      case 'YearMonthPicker':
        tempValue = 'Date'; break;
    }
    form.setFieldsValue({dataFormat: tempValue})
  };
  render() {
    const formItemLayout = {
      labelCol: { span: 4},
      wrapperCol: { span: 19 },
      colon: false,
    };
    const style = { width: '49%', display: 'flex', minWidth: 200 };
    const { getFieldDecorator } = this.props.form;
    const { prefix = 'ro', param } = this.props;
    return (
      <div>
        <div className={`${prefix}-element-detail-header`}>
          <Button
            className={`${prefix}-element-detail-header-button`}
            loading={this.state.loading}
            onClick={this._saveData}
            type="primary"
          >
            <Icon type="check" />保存
          </Button>
        </div>
        <div className={`${prefix}-element-detail`} style={{
          overflow: 'auto',
          height: (this.state.height && this.state.height - 10),
          width: (this.state.width ? this.state.width - 10 : 'auto')
        }}>
          <Form className={`${prefix}-element-detail-form`}>
          <Collapse defaultActiveKey={['1', '3', '4']} onChange={this._panelChange}>
            <Panel header="基本信息" key="1">
              <div className={`${prefix}-element-detail-body-panel`}>
                <FormItem
                  style={style}
                  {...formItemLayout}
                  label="模板ID"
                  wrapperCol={{ span: 18 }}
                >
                  {getFieldDecorator('dataFormId', {
                    rules: [{ required: true }],
                    initialValue: this.state.data.dataFormId
                    || (param && param.dataId),
                  })(<Text reading />)}
                </FormItem>
                <FormItem
                  style={style}
                  {...formItemLayout}
                  label="排序号"
                  wrapperCol={{ span: 8 }}
                >
                  {getFieldDecorator('sortCode', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.sortCode,
                  })(<Text />)}
                </FormItem>
                <FormItem
                  style={style}
                  {...formItemLayout}
                  label="显示名"
                  wrapperCol={{span: 12}}
                >
                  {getFieldDecorator('name', {
                    rules: [{ required: true }],
                    initialValue: this.state.data.name,
                  })(<Text />)}
                </FormItem>
                <FormItem
                  style={style}
                  {...formItemLayout}
                  label="国际化代码"
                >
                  {getFieldDecorator('nameI18nCode', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.nameI18nCode,
                  })(<Text />)}
                </FormItem>
                <FormItem
                  style={{...style, width: '33%'}}
                  {...formItemLayout}
                  wrapperCol={{span: 16}}
                  label="英文代码"
                >
                  {getFieldDecorator('code', {
                    rules: [{ required: true }],
                    initialValue: this.state.data.code,
                  })(<Text reading/>)}
                </FormItem>
                <FormItem
                  style={{...style, width: '33%'}}
                  {...formItemLayout}
                  wrapperCol={{span: 16}}
                  label="列名"
                >
                  {getFieldDecorator('column', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.column,
                  })(<Text />)}
                </FormItem>
                <FormItem
                  style={{...style, width: '33%'}}
                  {...formItemLayout}
                  wrapperCol={{span: 16}}
                  label="数据表"
                >
                  {getFieldDecorator('table', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.table,
                  })(<Text />)}
                </FormItem>
                <FormItem style={{...style, width: '33%'}}
                          {...formItemLayout}
                          wrapperCol={{span: 14}}
                          label="编辑形式"
                >
                  {getFieldDecorator('editStyle', {
                    rules: [{ required: true }],
                    initialValue: (this.state.data.elementUIHint
                      && this.state.data.elementUIHint.editStyle) || 'Text',
                  })(<Select
                    options={[
                      {code: 'Label', name: '文本'},
                      {code: 'Text', name: '文本框'},
                      {code: 'Double', name: '小数输入框'},
                      {code: 'Integer', name: '整数输入框'},
                      {code: 'Currency', name: '金额输入框'},
                      {code: 'TextArea', name: '多行文本框'},
                      {code: 'RichText', name: '富文本'},
                      {code: 'Select', name: '下拉框'},
                      {code: 'Cascader', name: '级联选择器'},
                      {code: 'TreeSelect', name: '树选择器'},
                      {code: 'CheckBox', name: '复选框'},
                      {code: 'RadioBox', name: '单选框'},
                      {code: 'DatePicker', name: '日期选择'},
                      {code: 'YearMonthPicker', name: '月份选择'},
                      {code: 'DateRange', name: '区间日期'},
                      {code: 'Password', name: '密码框'},
                      {code: 'AddressPicker', name: '地址'},
                      {code: 'StarRating', name: '五星评分'},
                    ]}
                    optionName="name"
                    optionField="code"
                    onChange={(e) => {
                      this._getDataType(e);
                      this._getDataFormat(e);
                    }}
                  />)}
                </FormItem>
                <FormItem
                  style={{...style, width: '33%'}}
                  {...formItemLayout}
                  label="数据类型"
                  wrapperCol={{span: 16}}
                >
                  {getFieldDecorator('dataType', {
                    rules: [{ required: true }],
                    initialValue: this.state.data.dataType,
                  })(<Select
                    options={['String', 'Integer', 'Double', 'Date', 'StringArray', 'Boolean']}
                    onChange={(value) =>{
                      this.setState({ decimalMiss: value !== 'Double' });
                    }}
                  />)}
                </FormItem>
                <FormItem
                  style={{...style, width: '33%'}}
                  {...formItemLayout}
                  label="数据格式"
                  wrapperCol={{span: 16}}
                >
                  {getFieldDecorator('dataFormat', {
                    rules: [{ required: true }],
                    initialValue: this.state.data.elementUIHint
                    && this.state.data.elementUIHint.dataFormat,
                  })(<Select options={['String', 'Integer', 'Double', 'Currency', 'Date', 'DateTime', 'Time']} />)}
                </FormItem>
                <FormItem
                  style={{...style, width: '33%'}}
                  {...formItemLayout}
                  wrapperCol={{span: 16}}
                  label="默认值"
                >
                  {getFieldDecorator('defaultValue', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.defaultValue,
                  })(<Text />)}
                </FormItem>
                <FormItem
                  style={{...style, width: '33%'}}
                  {...formItemLayout}
                  wrapperCol={{span: 16}}
                  label="可更新"
                >
                  {getFieldDecorator('updateable', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.updateable,
                  })(<CheckBoxItem />)}
                </FormItem>
                <FormItem
                  style={{...style, width: '33%'}}
                  {...formItemLayout}
                  wrapperCol={{span: 16}}
                  label="持久化"
                >
                  {getFieldDecorator('persist', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.persist,
                  })(<CheckBoxItem />)}
                </FormItem>
                <FormItem
                  style={{...style, width: '33%'}}
                  {...formItemLayout}
                  wrapperCol={{span: 16}}
                  label="启用"
                >
                  {getFieldDecorator('enable', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.enable,
                  })(<CheckBoxItem/>)}
                </FormItem>
                <FormItem
                  style={{...style, width: '25%'}}
                  {...formItemLayout}
                  wrapperCol={{span: 10}}
                  label="是否主键"
                >
                  {getFieldDecorator('primaryKey', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.primaryKey,
                  })(<CheckBoxItem />)}
                </FormItem>
                <FormItem
                  style={{...style, width: '75%'}}
                  {...formItemLayout}
                  label="主键生成器"
                  wrapperCol={{span: 16}}
                >
                  {getFieldDecorator('primaryKeyGenerator', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.primaryKeyGenerator,
                  })(<Text />)}
                </FormItem>
                <FormItem
                  style={{...style, width: '15%'}}
                  {...formItemLayout}
                  wrapperCol={{span: 6}}
                  label="倍数"
                >
                  {getFieldDecorator('multiplier', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.multiplier || 1,
                  })(<Text />)}
                </FormItem>
                <FormItem
                  style={{...style, width: '15%'}}
                  {...formItemLayout}
                  wrapperCol={{span: 6}}
                  label="最大长度"
                >
                  {getFieldDecorator('limitedLength', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.limitedLength || 0,
                  })(<Text />)}
                </FormItem>
                <FormItem
                  style={{...style, width: '15%'}}
                  {...formItemLayout}
                  wrapperCol={{span: 6}}
                  label="小数位数"
                >
                  {getFieldDecorator('decimalDigits', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.decimalDigits || 0,
                  })(<Text/>)}
                </FormItem>
                <FormItem
                  style={{...style, width: '50%'}}
                  {...formItemLayout}
                  label="统计表达式"
                >
                  {getFieldDecorator('summaryExpression', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.summaryExpression,
                  })(<Text />)}
                </FormItem>
              </div>
            </Panel>
            <Panel header="分组信息" key="2">
              <div className={`${prefix}-element-detail-body-panel`}>
                <FormItem
                  style={style}
                  {...formItemLayout}
                  wrapperCol={{span: 16}}
                  label="一级分组"
                >
                  {getFieldDecorator('group', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.group,
                  })(<Text placeholder='分组ID:分组名称（例如：B10:客户基本信息）' />)}
                </FormItem>
                <FormItem
                  style={style}
                  {...formItemLayout}
                  wrapperCol={{span: 16}}
                  label="一级分组国际化"
                >
                  {getFieldDecorator('groupI18nCode', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.groupI18nCode,
                  })(<Text placeholder='分组ID:分组名称（例如：B10:客户基本信息）' />)}
                </FormItem>
                <FormItem
                  style={style}
                  {...formItemLayout}
                  wrapperCol={{span: 16}}
                  label="二级分组"
                >
                  {getFieldDecorator('subGroup', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.subGroup,
                  })(<Text placeholder='分组ID:分组名称（例如：B10:客户基本信息）' />)}
                </FormItem>
                <FormItem
                  style={style}
                  {...formItemLayout}
                  wrapperCol={{span: 16}}
                  label="二级分组国际化"
                >
                  {getFieldDecorator('subGroupI18nCode', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.subGroupI18nCode,
                  })(<Text placeholder='分组ID:分组名称（例如：B10:客户基本信息）' />)}
                </FormItem>
              </div>
            </Panel>
            <Panel header="展示界面控制" key="3">
              <div className={`${prefix}-element-detail-body-panel`}>
                <FormItem
                  style={{...style, width: '25%'}}
                  {...formItemLayout}
                  wrapperCol={{span: 10}}
                  label="可见"
                >
                  {getFieldDecorator('visible', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.elementUIHint
                    && this.state.data.elementUIHint.visible,
                  })(<CheckBoxItem />)}
                </FormItem>
                <FormItem
                  style={{...style, width: '25%'}}
                  {...formItemLayout}
                  wrapperCol={{span: 10}}
                  label="只读"
                >
                  {getFieldDecorator('readonly', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.elementUIHint
                    && this.state.data.elementUIHint.readonly,
                  })(<CheckBoxItem />)}
                </FormItem>
                <FormItem
                  style={{...style, width: '25%'}}
                  {...formItemLayout}
                  wrapperCol={{span: 10}}
                  label="必需"
                >
                  {getFieldDecorator('required', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.elementUIHint
                    && this.state.data.elementUIHint.required,
                  })(<CheckBoxItem />)}
                </FormItem>
                <FormItem
                  style={{...style, width: '25%'}}
                  {...formItemLayout}
                  label="可排序"
                >
                  {getFieldDecorator('sortable', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.sortable,
                  })(<CheckBoxItem />)}
                </FormItem>
                <FormItem
                  style={{...style, width: '33%'}}
                  {...formItemLayout}
                  wrapperCol={{span: 15}}
                  label="栏位数"
                >
                  {getFieldDecorator('colspan', {
                    rules: [{ required: false }],
                    initialValue: (this.state.data.elementUIHint
                      && this.state.data.elementUIHint.colspan) || 1,
                  })(<RadioBox options={[
                    {code: 1, name: '1'},
                    {code: 2, name: '2'},
                    {code: 3, name: '3'},
                    {code: 4, name: '4'},
                  ]}
                               optionName="name"
                               optionField="code"
                  />)}
                </FormItem>
                <FormItem
                  style={{...style, width: '33%'}}
                  {...formItemLayout}
                  label="对齐"
                >
                  {getFieldDecorator('textAlign', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.elementUIHint
                    && this.state.data.elementUIHint.textAlign,
                  })(<RadioBox options={[{code: 'Left', name: '左'}, {code: 'Center', name: '中'}, {code: 'Right', name: '右'}]} />)}
                </FormItem>
                <FormItem
                  style={{...style, width: '33%'}}
                  {...formItemLayout}
                  wrapperCol={{span: 6}}
                  label="占位符"
                >
                  {getFieldDecorator('placeholder', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.elementUIHint
                    && this.state.data.elementUIHint.placeholder,
                  })(<Text />)}
                </FormItem>
                <FormItem style={{...style, width: '50%'}}
                          {...formItemLayout}
                          wrapperCol={{span: 14}}
                          label="字典模式"
                >
                  {getFieldDecorator('dictCodeMode', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.elementUIHint
                    && this.state.data.elementUIHint.dictCodeMode,
                  })(<Select options={['SQLQuery', 'DictCode', 'JSON']} />)}
                </FormItem>
                <FormItem
                  style={{...style, width: '50%'}}
                  {...formItemLayout}
                  wrapperCol={{span: 14}}
                  label="字典表达式"
                >
                  {getFieldDecorator('dictCodeExpr', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.elementUIHint
                    && this.state.data.elementUIHint.dictCodeExpr,
                  })(<Text />)}
                </FormItem>
                <FormItem
                  style={{...style, width: '33%'}}
                  {...formItemLayout}
                  label="字典延迟加载"
                >
                  {getFieldDecorator('dictCodeLazy', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.elementUIHint && this.state.data.elementUIHint.dictCodeLazy,
                  })(<CheckBoxItem />)}
                </FormItem>
                <FormItem
                  style={{...style, width: '33%'}}
                  {...formItemLayout}
                  label="仅能选叶节点"
                >
                  {getFieldDecorator('dictCodeTreeLeafOnly', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.elementUIHint && this.state.data.elementUIHint.dictCodeTreeLeafOnly,
                  })(<CheckBoxItem />)}
                </FormItem>
                <FormItem
                  style={{...style, width: '33%'}}
                  {...formItemLayout}
                  label="显示树图层级"
                >
                  {getFieldDecorator('dictCodeTreeFull', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.elementUIHint && this.state.data.elementUIHint.dictCodeTreeFull,
                  })(<CheckBoxItem />)}
                </FormItem>
                <FormItem
                  style={style}
                  {...formItemLayout}
                  label="前缀"
                >
                  {getFieldDecorator('prefix', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.elementUIHint
                    && this.state.data.elementUIHint.prefix,
                  })(<Text />)}
                </FormItem>
                <FormItem
                  style={style}
                  {...formItemLayout}
                  label="后缀"
                >
                  {getFieldDecorator('suffix', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.elementUIHint
                    && this.state.data.elementUIHint.suffix,
                  })(<Text />)}
                </FormItem>
                <FormItem
                  style={style}
                  {...formItemLayout}
                  label="TIPS"
                >
                  {getFieldDecorator('tips', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.elementUIHint
                    && this.state.data.elementUIHint.tips,
                  })(<Text />)}
                </FormItem>
                <FormItem
                  style={style}
                  {...formItemLayout}
                  label="TIPS国际化"
                >
                  {getFieldDecorator('tipsI18nCode', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.elementUIHint
                    && this.state.data.elementUIHint.tipsI18nCode,
                  })(<Text />)}
                </FormItem>

                <FormItem
                  style={style}
                  {...formItemLayout}
                  label="备注"
                >
                  {getFieldDecorator('note', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.elementUIHint
                    && this.state.data.elementUIHint.note,
                  })(<Text />)}
                </FormItem>
                <FormItem
                  style={style}
                  {...formItemLayout}
                  label="备注国际化"
                >
                  {getFieldDecorator('noteI18nCode', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.elementUIHint
                    && this.state.data.elementUIHint.noteI18nCode,
                  })(<Text />)}
                </FormItem>

                <FormItem
                  style={style}
                  {...formItemLayout}
                  label="层级权重值"
                  wrapperCol={{span: 6}}
                >
                  {getFieldDecorator('rank', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.elementUIHint && this.state.data.elementUIHint.rank,
                  })(<Text />)}
                </FormItem>
                <FormItem
                  style={style}
                  {...formItemLayout}
                  label="媒体查询"
                  wrapperCol={{span: 6}}
                >
                  {getFieldDecorator('mediaQuery', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.elementUIHint && this.state.data.elementUIHint.mediaQuery,
                  })(<Text />)}
                </FormItem>
                <FormItem
                  style={style}
                  {...formItemLayout}
                  label="事件表达式"
                >
                  {getFieldDecorator('eventExpr', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.elementUIHint && this.state.data.elementUIHint.eventExpr,
                  })(<Text />)}
                </FormItem>
                <FormItem
                  style={style}
                  {...formItemLayout}
                  label="HTML样式"
                >
                  {getFieldDecorator('htmlStyle', {
                    rules: [{ required: false }],
                    initialValue: this.state.data.elementUIHint && this.state.data.elementUIHint.htmlStyle,
                  })(<Text placeholder='例如：{"minWidth":"280px"}'/>)}
                </FormItem>
              </div>
            </Panel>
            <Panel header="检验条件配置" key="4">
              <div>
                <Table
                    className={`${prefix}-template-field-table`}
                    rowKey={record => record.key}
                    columns={this.state.validatorColumns}
                    dataSource={this.state.data.validatorList || []}
                    pagination={false}
                    scroll={{ x: 1500 }}
                    size={comSize}
                    locale={{
                        emptyText: <Button onClick={this._addValidatorData}>添加一个校验条件</Button>
                    }}
                    style={{ width: this.state.width && this.state.width - 80 }}
                />
              </div>
            </Panel>
          </Collapse>
        </Form>
      </div>
      </div>
      );
  }
});
//
// <Panel header="输入界面控制" key="3">
//   <div className={`${prefix}-element-detail-body-panel`}>
//     <FormItem
//       style={style}
//       {...formItemLayout}
//       label="缺省值"
//     >
//       {getFieldDecorator('defaultValue', {
//         rules: [{ required: false }],
//         initialValue: this.state.data.defaultValue,
//       })(<Text />)}
//     </FormItem>
//     <FormItem
//       style={style}
//       {...formItemLayout}
//       label="内置按钮事件"
//     >
//       {getFieldDecorator('eventExpr', {
//         rules: [{ required: false }],
//         initialValue: this.state.data.elementUIHint
//         && this.state.data.elementUIHint.eventExpr,
//       })(<Text />)}
//     </FormItem>
//     <FormItem
//       style={style}
//       {...formItemLayout}
//       label="长度"
//     >
//       {getFieldDecorator('limitedLength', {
//         rules: [{ required: false }],
//         initialValue: this.state.data.limitedLength,
//       })(<Text note="中文汉字长度为3，英文字母长度为1" />)}
//     </FormItem>
//     <FormItem
//       style={style}
//       {...formItemLayout}
//       label="检查格式"
//     >
//       {getFieldDecorator('maskFormat', {
//         rules: [{ required: false }],
//         initialValue: this.state.data.elementUIHint
//         && this.state.data.elementUIHint.maskFormat,
//       })(<Select
//         options={[
//           {code: 'Currency', name: '金额'},
//           {code: 'Date', name: '日期'},
//           {code: 'DateTime', name: '日期时间'},
//           {code: 'Float2', name: '小数点后2位'},
//           {code: 'Float4', name: '小数点后4位'},
//           {code: 'Float6', name: 'float6'},
//           {code: 'Integer', name: '整数'},
//           {code: 'String', name: '字符串'},
//           {code: 'Time', name: '时间'},
//         ]}
//         optionName="name"
//         optionField="code"
//       />)}
//     </FormItem>
//   </div>
// </Panel>
// <Panel header="列表展现补充" key="4">
//   <div className={`${prefix}-element-detail-body-panel`}>
// <FormItem
// style={style}
// {...formItemLayout}
// label="查询"
//   >
//   {getFieldDecorator('enable', {
//   rules: [{ required: false }],
//     initialValue: this.state.data.enable,
// })(<RadioBox options={[{code: false, name: '否'}, {code: true, name: '是'}]} />)}
// </FormItem>
// <FormItem
//   style={style}
//   {...formItemLayout}
//   label="查询选项"
// >
//   {getFieldDecorator('comparePattern', {
//     rules: [{ required: false }],
//     initialValue: this.state.data.comparePattern,
//   })(<CheckBox
//     options={[{code: 'Quick', name: '快速搜索'},
//       {code: 'Equal', name: '等于'},
//       {code: 'StartWith', name: '开始于'},
//       {code: 'EndWith', name: '结束于'},
//       {code: 'BigThan', name: '大于'},
//       {code: 'LessThan', name: '小于'},
//       {code: 'Contain', name: '包含'},
//       {code: 'Range', name: '在...之间'}]}
//   />)}
// </FormItem>
// <FormItem
//   style={style}
//   {...formItemLayout}
//   label="聚合表达式"
// >
//   {getFieldDecorator('summaryExpression', {
//     rules: [{ required: false }],
//     initialValue: this.state.data.summaryExpression,
//   })(<Text />)}
// </FormItem>
// <FormItem
//   style={style}
//   {...formItemLayout}
//   label="可排序"
// >
//   {getFieldDecorator('sortable', {
//     rules: [{ required: false }],
//     initialValue: this.state.data.sortable,
//   })(<RadioBox options={[{code: false, name: '否'}, {code: true, name: '是'}]} />)}
// </FormItem>
// <FormItem
//   style={style}
//   {...formItemLayout}
//   label="提示"
// >
//   {getFieldDecorator('tips', {
//     rules: [{ required: false }],
//     initialValue: this.state.data.elementUIHint
//     && this.state.data.elementUIHint.tips,
//   })(<Text />)}
// </FormItem>
// </div>
// </Panel>
// <Panel header="字段校验" key="5">
//   <div className={`${prefix}-element-detail-body-panel`}>
//     <FormItem
//       style={style}
//       {...formItemLayout}
//       label="校验执行位置"
//     >
//       {getFieldDecorator('runAt', {
//         rules: [{ required: true }],
//         initialValue: this.state.data.runAt,
//       })(<RadioBox options={[{code: 'Client', name: '客户端'}, {code: 'Server', name: '服务端'}]} />)}
//     </FormItem>
//     <FormItem
//       style={style}
//       {...formItemLayout}
//       label="表达式"
//     >
//       {getFieldDecorator('expr', {
//         rules: [{ required: false }],
//         initialValue: this.state.data.expr,
//       })(<Text />)}
//     </FormItem>
//     <FormItem
//       style={style}
//       {...formItemLayout}
//       label="校验方式"
//     >
//       {getFieldDecorator('mode', {
//         rules: [{ required: true }],
//         initialValue: this.state.data.mode,
//       })(<RadioBox
//         options={[
//           {code: 'jsFunction', name: 'JS函数'},
//           {code: 'owHandler', name: 'owHandler方法'},
//           {code: 'regexp', name: 'owHandler方法'},
//         ]}
//       />)}
//     </FormItem>
//     <FormItem
//       style={style}
//       {...formItemLayout}
//       label="校验不通过提示"
//     >
//       {getFieldDecorator('defaultMessage', {
//         rules: [{ required: false }],
//         initialValue: this.state.data.defaultMessage,
//       })(<Text />)}
//     </FormItem>
//   </div>
// </Panel>
