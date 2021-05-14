import React from  'react';
import { Form } from '@ant-design/compatible';
import * as components from '../../../../../src/components';
import './style/index.less';
import * as dataform from '../../../../../src/lib/dataform';
import * as rest from "../../../../../src/lib/rest";
import * as config from '../../../../../src/lib/config';

const {
  Collapse, Text, RadioBox, TextArea, Table,
  Button, Icon, Modal, Notify, Select, Switch
} = components;

const Panel = Collapse.Panel;
const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const comSize = 'small';

const EditableCell = ({value, com, onChange, options, reading}) => {
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
        reading={reading}
        isTable
      />
    );
  }
  return (
    <Com
      size={comSize}
      value={value}
      onChange={onChange}
      reading={reading}
      isTable
    />
  );
};

export default Form.create()(class TemplateDetail extends React.Component {
  constructor(props){
    super(props);
    this.filterLWidth = 200;
    this.filterMWidth = 150;
    this.filterSWidth = 50;
    this.state = {
      reading: true,
      data: {},
      columns: [{
        title: '#',
        dataIndex: 'number',
        key: 'number',
        width: this.filterSWidth,
        render: (text, record, index) => <span>{index}</span>,
      },
      {
        title: '操作',
        dataIndex: 'opt',
        key: 'opt',
        width: '160px',
        render: (text, record, index) => this._createButton(record, index),
      },
      {
      title: '排序号',
      dataIndex: 'sortCode',
      key: 'sortCode',
      render: (text, record, index) => this._renderColumns('sortCode', 'Text', text, record, index),
      },
      {
        title: '显示名',
        dataIndex: 'name',
        key: 'name',
        render: (text, record, index) => this._renderColumns('name', 'Text', text, record, index),
      },
      {
        title: '英文代码',
        dataIndex: 'code',
        key: 'code',
        render: (text, record, index) => this._renderColumns('code', 'Text', text, record, index),
      },
      {
        title: '列名',
        dataIndex: 'column',
        key: 'column',
        render: (text, record, index) => this._renderColumns('column', 'Text', text, record, index),
      },
      {
        title: '数据表',
        dataIndex: 'table',
        key: 'table',
        render: (text, record, index) => this._renderColumns('table', 'Text', text, record, index),
      },
      {
        title: '可见',
        dataIndex: 'elementUIHint',
        key: 'elementUIHint.visible',
        render: (text, record, index) =>
          this._renderColumns('elementUIHint.visible', 'CheckBoxItem',
            text === undefined || text.visible === undefined ? true : text && text.visible,
            record, index, []),
      },
      {
        title: '只读',
        dataIndex: 'elementUIHint',
        key: 'elementUIHint.readonly',
        render: (text, record, index) =>
          this._renderColumns('elementUIHint.readonly', 'CheckBoxItem', text && text.readonly, record, index, [])
      },
      {
        title: '必须',
        dataIndex: 'elementUIHint',
        key: 'elementUIHint.required',
        render: (text, record, index) =>
          this._renderColumns('elementUIHint.required', 'CheckBoxItem', text && text.required, record, index, []),
      },
      {
        title: '栏位数',
        dataIndex: 'elementUIHint',
        key: 'elementUIHint.colspan',
        render: (text, record, index) =>
          this._renderColumns('elementUIHint.colspan', 'Select', (text && text.colspan) || 1, record, index,
            [
              {code: 1, name: '1'},
              {code: 2, name: '2'},
              {code: 3, name: '3'},
              {code: 4, name: '4'},
            ]),
      },
      {
        title: '数据类型',
        dataIndex: 'dataType',
        key: 'dataType',
        render: (text, record, index) => this._renderColumns('dataType', 'Select',
          text || 'String', record, index,
          ['String', 'Integer', 'Double', 'Date', 'StringArray', 'Boolean']),
      },
      {
        title: '编辑形式',
        width: 150,
        dataIndex: 'elementUIHint',
        key: 'elementUIHint.editStyle',
        render: (text, record, index) =>
          this._renderColumns('elementUIHint.editStyle', 'Select', text && text.editStyle || 'Text', record, index,
            [
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
              // {code: 'DateTimePicker', name: '*****'},
              {code: 'DateRange', name: '区间日期'},
              {code: 'Password', name: '密码框'},
              {code: 'AddressPicker', name: '地址'},
              {code: 'StarRating', name: '五星评分'},
            ]),
      },
      {
        title: '字典形式',
        dataIndex: 'elementUIHint',
        key: 'elementUIHint.dictCodeMode',
        render: (text, record, index) =>
          this._renderColumns('elementUIHint.dictCodeMode', 'Select', text && text.dictCodeMode, record, index,
          ['SQLQuery', 'DictCode', 'JSON']),
      },
      {
        title: '字典表达式',
        dataIndex: 'elementUIHint',
        key: 'elementUIHint.dictCodeExpr',
        render: (text, record, index) =>
          this._renderColumns('elementUIHint.dictCodeExpr', 'Text', text && text.dictCodeExpr, record, index),
      },
      {
        title: '一级分组信息',
        dataIndex: 'group',
        key: 'group',
        render: (text, record, index) =>
          this._renderColumns('group', 'Text', text && text, record, index),
      }],
      filterColumns: [
        {
          title: '#',
          dataIndex: 'number',
          key: 'number',
          width: '20px',
          render: (text, record, index) => <span style={{ width: this.filterSWidth }}>{index}</span>,
        },
        {
          title: '操作',
          dataIndex: 'opt',
          key: 'opt',
          width: '120px',
          render: (text, record, index) => this._createFilterButton(record, index),
        },
        {
          title: '排序号',
          dataIndex: 'sortCode',
          key: 'sortCode',
          width: this.filterMWidth,
          render: (text, record, index) => this._renderFiltersColumns('sortCode', 'Text', text && text, record, index),
        },
        {
          title: '过滤器代码',
          dataIndex: 'code',
          key: 'code',
          width: this.filterMWidth,
          render: (text, record, index) =>
            this._renderFiltersColumns('code', 'Text', text && text, record, index),
        },
        {
          title: '绑定目标',
          dataIndex: 'bindFor',
          key: 'bindFor',
          width: this.filterMWidth,
          render: (text, record, index) =>
            this._renderFiltersColumns('bindFor', 'Text', text && text, record, index),
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          width: this.filterMWidth,
          render: (text, record, index) =>
            this._renderFiltersColumns('name', 'Text', text && text, record, index),
        },
        {
          title: '启用',
          dataIndex: 'enable',
          key: 'enable',
          width: 60,
          render: (text, record, index) =>
            this._renderFiltersColumns('enable', 'CheckBoxItem',
              text === undefined ? true : text, record, index, []),
        },
        {
          title: '快速查询',
          dataIndex: 'quick',
          key: 'quick',
          width: this.filterMWidth,
          render: (text, record, index) =>
            this._renderFiltersColumns('quick', 'CheckBoxItem', (text && text) || false, record, index,
              [
                {code: true, name: '是'},
                {code: false, name: '否'},
              ]),
        },
        {
          title: '匹配模式',
          dataIndex: 'comparePattern',
          key: 'comparePattern',
          width: this.filterLWidth,
          render: (text, record, index) =>
            this._renderFiltersColumns('comparePattern', 'Select', (text && text) || 'Equal', record, index,
              [
                {code: 'StartWith', name: '以...开始'},
                {code: 'EndWith', name: '以...结束'},
                {code: 'Equal', name: '等于'},
                {code: 'NotEqual', name: '不等于'},
                {code: 'Contain', name: '包含'},
                {code: 'Range', name: '在...范围之内'},
                {code: 'GreaterThan', name: '大于'},
                {code: 'LessThan', name: '小于'},
              ]),
        }
      ]
    };
  }
  componentDidMount(){
   this.requestDataForm();
  }

  sortCompare = (v1, v2) => {
    if (v1.sortCode && v2.sortCode) {
      return v1.sortCode.valueOf() - v2.sortCode.valueOf();
    }
    return 0;
  };

  requestDataForm = () => {
    const { closeLoading, openLoading, param } = this.props;
    if (param && param.dataId && !param.flag) {
      openLoading && openLoading();
      dataform.getAdmin(`/dataform/${param.dataId}`).then((res) => {
        const elements = (res.elements || []).map(ele => ({ ...ele, key: Math.uuid() }));
        const filters = (res.filters || []).map(ele => ({ ...ele, key: Math.uuid() }));
        filters.sort((v1, v2) => this.sortCompare(v1, v2));
        elements.sort((v1, v2) => this.sortCompare(v1, v2));
        this.setState({
          formStyle: res.formUIHint.formStyle,
          data: {
            ...res,
            elements: elements,
            filters: filters
          },
        }, () => {
          closeLoading && closeLoading();
        });
      });
    }
  };

  _dataChange = (name, value, key, colType) => {
    this.setState({
      data: {
        ...this.state.data,
        [colType]: this.state.data[colType].map((ele) => {
          if (ele.key === key) {
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
  _renderColumns = (name, com, text, record, index, options) => (
    <EditableCell
      value={text}
      com={com}
      onChange={value => this._dataChange(name, value, record.key, 'elements')}
      options={options}
      reading={this.state.reading}
    />
  );

  _renderFiltersColumns = (name, com, text, record, index, options) => (
    <EditableCell
      value={text}
      com={com}
      onChange={value => this._dataChange(name, value, record.key, 'filters')}
      options={options}
      reading={this.state.reading}
    />
  );

  _createButton = (record, index) => {
    return (
      <ButtonGroup>
        <Button onClick={() => this._checkDataId(record)} icon="edit" type="primary" size={comSize}/>
        <Button onClick={() => this._addTableData(record, index)} icon="plus" type="primary" size={comSize}/>
        <Button onClick={() => this._deleteTableData(record)} icon="minus" type="primary" size={comSize}/>
      </ButtonGroup>
    );
  };

  _createFilterButton = (record, index) => {
    return (
      <ButtonGroup>
        <Button onClick={() => this._addFilterData(record, index)} icon="plus" type="primary" size={comSize}/>
        <Button onClick={() => this._deleteFilterData(record)} icon="minus" type="primary" size={comSize}/>
      </ButtonGroup>
    );
  };

  _checkDataId = (record) => {
    const { data } = this.state;
    if (!data.id) {
      const that = this;
      Modal.confirm({
        okText: '确认',
        cancelText: '取消',
        title: '是否保存当前模板?',
        content: '当前模板为新增模板，请先保存。',
        onOk() {
          that._saveData().then(res => {
            that.setState({
              data: res
            }, () => that.createTab(record))
          })
        },
      })
    } else {
      this.createTab(record);
    }
  }
  createTab = (record) => {
    const { flexTabs, param } = this.props;
    const { data } = this.state;
    const tab = {
      name: `字段:${record.name}`,
      url: 'System/SystemManage/DisplayTemplate/ElementDetail',
    };
    if (flexTabs && flexTabs.open && !param.windowTab) {
      flexTabs.open({
        ...tab,
        param: {
          dataId: data.id,
          dataCode: record.code,
          tabId: param.__id
        },
      });
    } else {
      const paramStr =  btoa(encodeURIComponent(JSON.stringify({
        dataId: data.id,
        dataCode: record.code,
        noMenu: true,
        tabId: param.__id
      })));
      window.open(rest.getLocationURL(`/main.html#/${tab.url}/?${paramStr}`));
    }
  };
  _addTableData = (record, index) => {
    const { formUIHint } = this.props.param;
    const { length } = this.state.data.elements || [];
    const tempArray = [...(this.state.data.elements || [])];
    const nextElement = tempArray[index + 1];
    let sortC = parseInt(record.sortCode) || 1000;
    sortC = parseInt(nextElement ? (parseInt(nextElement.sortCode) + sortC) / 2 : sortC + 10);
    const newField = { name: `新字段${length}`, code: `新字段${length}`, key: Math.uuid(), sortCode: sortC, group: record.group };
    if (!record) {
      tempArray.push(newField)
    } else {
      tempArray.splice(index + 1, 0, newField);
    }
    this.setState({
      data: {
        ...this.state.data,
        elements: tempArray,
      },
    });
  };

  _addFilterData = (record, index) => {
    // 添加筛选条件
    const { length } = this.state.data.filters || [];
    const tempArray = [...(this.state.data.filters || [])];
    const nextElement = tempArray[index + 1];
    let sortC = parseInt(record.sortCode) || 1000;
    sortC = parseInt(nextElement ? (parseInt(nextElement.sortCode) + sortC) / 2 : sortC + 10);
    const newField = { name: `新条件${length}`, code: `新条件${length}`, key: Math.uuid(), sortCode: sortC, bindFor: `新条件${length}`,
      enable: true, quick: false, comparePattern: 'Equal' };
    if (!record) {
      tempArray.push(newField)
    } else {
      tempArray.splice(index + 1, 0, newField);
    }
    this.setState({
      data: {
        ...this.state.data,
        filters: tempArray,
      },
    });
  };

  _filterField = (obj, field) => {
    const tempObj = {};
    Object.keys(obj).filter(f => f !== field).forEach((f) => {
      tempObj[f] = obj[f];
    });
    return tempObj;
  };
  _saveData = () => {
    Modal.info({
      title: '温馨提示',
      content: '显示模版的配置已经移动到工具AmixBuilder，如果您没有该工具，请联系研发部',
    });
   /* return new Promise((resovle, reject) => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.setState({
            loading: true,
          });
          const param = {
            ...this.state.data,
            ...this._filterField(values, 'columnNumber'),
            ...this._filterField(values, 'formStyle'),
            formUIHint: {
              ...this.state.data.formUIHint,
              columnNumber: values.columnNumber,
              formStyle: values.formStyle,
            },
            query: {
              ...this.state.data.query,
              select: values.select,
              where: values.where,
              from: values.from,
              groupBy: values.groupBy,
              orderBy: values.orderBy,
              having: values.having,
            }
          };
          Object.keys(param).map((item) => {
            if (typeof param[item] === 'string') param[item] = param[item].trim();
          });
          const url = this.state.data.id ? `/dataform/${this.state.data.id}` : '/dataform';
          dataform.postAdmin(url, param).then((res) => {
            resovle(res);
            Notify.success({
              message: '保存成功',
            });
            this.setState({
              loading: false,
            });
          }).catch((e) => {
            reject(e);
            Modal.error({
              title: '保存失败',
              content: JSON.stringify(e),
            });
            this.setState({
              loading: false,
            });
          });
        }
      });
    })*/
  }
  _deleteTableData = (record) => {
    this.setState({
      data: {
        ...this.state.data,
        elements: this.state.data.elements.filter(ele => ele.code !== record.code),
      },
    });
  }

  _deleteFilterData = (record) => {
    this.setState({
      data: {
        ...this.state.data,
        filters: this.state.data.filters.filter(filtersItem => filtersItem.code !== record.code),
      },
    });
  };

  widthChange = (width, height) => {
    this.setState({width, height});
  };

  _getElements = (type) => {
    const { form } = this.props;
    const { data } = this.state;
    dataform.devtoolDataform(form.getFieldValue('code'), form.getFieldValue('from')).then((res) => {
      if (type === 'all') {
        this.setState({
          data: {
            ...data,
            elements: (res || [])
              .map(ele => ({ ...ele, key: Math.uuid() }))
              .sort((v1, v2) => this.sortCompare(v1, v2))
          }
        })
      } else {
        // 找出当前elements中没有的属性
        const tempElements = [...(res || [])];
        const dataElementCodes = [...(data && data.elements || [])].map(ele => ele.code);
        const incElements = tempElements.filter(ele => !dataElementCodes.includes(ele.code));
        this.setState({
          data: {
            ...data,
            elements: (data.elements || []).concat(incElements)
              .map(ele => ({ ...ele, key: ele.key || Math.uuid() }))
              .sort((v1, v2) => this.sortCompare(v1, v2))
          }
        })
      }
    })
  };
  _editTypeChange = (value) => {
    this.setState({
      reading: value,
    });
  };
  render() {
    const formItemLayout = {
      labelCol: { span: 8},
      wrapperCol: { span: 16 },
    };
    const { getFieldDecorator, prefix = 'ro' } = this.props.form;
    const style = { width: '100%', display: 'flex', minWidth: 200 };
    const defaultPackValue = this.props.param ? this.props.param.dataFromPack : '';
    return (
      <div>
        <div className={`${prefix}-template-detail-all-save`} style={{width: 'calc(100% - 30px)'}}>
          <Button
            onClick={this._saveData}
            className={`${prefix}-template-detail-all-save-button`}
            loading={this.state.loading}
            type="primary"
            icon={"save"}
          >保存</Button>&nbsp;
          <Switch checkedChildren="查看模式" unCheckedChildren="编辑模式" defaultChecked onChange={this._editTypeChange}/>
        </div>
        <div className={`${prefix}-template-detail`}
             style={{
               overflow: 'auto',
               height: (this.state.height && this.state.height - 10),
               width: (this.state.width && this.state.width - 10)
             }}>
          <div className={`${prefix}-template-detail-collapse`}>
            <Collapse defaultActiveKey={['1', '2', '3']} onChange={this._panelChange}>
              <Panel header="基本信息" key="1">
                <Form className={`${prefix}-template-detail-info-layout`}>
                  <FormItem
                    style={{ ...style, width: '30%' }}
                    {...formItemLayout}
                    label="包"
                    colon={false}
                    wrapperCol={{ span: 13 }}
                  >
                    <div>
                      {getFieldDecorator('pack', {
                        rules: [{required: true}],
                        initialValue: this.state.data.pack ? this.state.data.pack : defaultPackValue,
                      })(<Text reading={this.state.reading}/>)}
                    </div>
                  </FormItem>
                  <FormItem
                    style={{ ...style, width: '65%' }}
                    {...formItemLayout}
                    label="模版代码"
                    colon={false}
                    wrapperCol={{ span: 12 }}
                  >
                    <div>
                      {getFieldDecorator('code', {
                        rules: [{ required: true }],
                        initialValue: this.state.data.code,
                      })(<Text reading={this.state.reading}/>)}
                    </div>
                  </FormItem>
                  <FormItem
                    style={{ ...style, width: '50%' }}
                    {...formItemLayout}
                    label="名称"
                    colon={false}
                    wrapperCol={{ span: 18 }}
                  >
                    {getFieldDecorator('name', {
                      rules: [{ required: true }],
                      initialValue: this.state.data.name,
                    })(<Text reading={this.state.reading}/>)}
                  </FormItem>
                  <FormItem
                    style={{ ...style, width: '50%' }}
                    {...formItemLayout}
                    label="排序码"
                    colon={false}
                    wrapperCol={{ span: 8 }}
                  >
                    {getFieldDecorator('sortCode', {
                      rules: [{ required: false }],
                      initialValue: this.state.data.sortCode,
                    })(<Text reading={this.state.reading}/>)}
                  </FormItem>
                  <FormItem
                    style={{ ...style, width: '50%' }}
                    {...formItemLayout}
                    label="显示方式"
                    colon={false}
                    wrapperCol={{ span: 18 }}
                  >
                    {getFieldDecorator('formStyle', {
                      rules: [{ required: true }],
                      initialValue: (this.state.data.formUIHint
                        && this.state.data.formUIHint.formStyle) || 'DataTable',
                    })(<Select reading={this.state.reading} options={[
                        {code: 'DataTable', name: 'DataTable'},
                        {code: 'DetailInfo', name: 'DetailInfo'},
                        {code: 'TreeTable', name: 'TreeTable'},
                        {code: 'ListItem', name: 'ListItem'},
                        {code: 'ListCard', name: 'ListCard'},
                      ]}
                               optionName="name"
                               optionField="code"
                      />
                    )}
                  </FormItem>
                  <FormItem
                    style={{ ...style, width: '45%' }}
                    {...formItemLayout}
                    label="栏数"
                    colon={false}
                    wrapperCol={{ span: 18 }}
                  >
                    {getFieldDecorator('columnNumber', {
                      rules: [{ required: false }],
                      initialValue: (this.state.data.formUIHint
                        && this.state.data.formUIHint.columnNumber) || 1,
                    })(<RadioBox reading={this.state.reading} options={[
                      {code: 1, name: '1'},
                      {code: 2, name: '2'},
                      {code: 3, name: '3'},
                      {code: 4, name: '4'},
                    ]}
                    />)}
                  </FormItem>
                  <FormItem
                    style={style}
                    {...formItemLayout}
                    label="关键字"
                    colon={false}
                    wrapperCol={{ span: 12 }}
                  >
                    {getFieldDecorator('tags', {
                      rules: [{ required: false }],
                      initialValue: this.state.data.tags,
                    })(<Text reading={this.state.reading}/>)}
                  </FormItem>
                  <FormItem
                    style={style}
                    {...formItemLayout}
                    label="模版说明"
                    colon={false}
                  >
                    {getFieldDecorator('description', {
                      rules: [{ required: false }],
                      initialValue: this.state.data.description,
                    })(<Text reading={this.state.reading}/>)}
                  </FormItem>
                  <FormItem
                    style={style}
                    {...formItemLayout}
                    label="数据模型"
                    colon={false}
                    wrapperCol={{ span: 12 }}
                  >
                    {getFieldDecorator('dataModelType', {
                      rules: [{ required: true }],
                      initialValue: this.state.data.dataModelType || 'JavaBean',
                    })(<RadioBox reading={this.state.reading} options={[
                      {code: 'JavaBean', name: 'JavaBean'},
                      {code: 'DataMap', name: 'DataMap'},
                    ]}/>)}
                  </FormItem>
                  <FormItem
                    style={style}
                    {...formItemLayout}
                    label="数据实体"
                    colon={false}
                    wrapperCol={{ span: 8 }}
                  >
                    {getFieldDecorator('dataModel', {
                      rules: [{ required: false }],
                      initialValue: this.state.data.dataModel,
                    })(<Text reading={this.state.reading}/>)}
                  </FormItem>
                  <FormItem
                    style={style}
                    {...formItemLayout}
                    label="处理Handler"
                    colon={false}
                    wrapperCol={{ span: 12 }}
                  >
                    {getFieldDecorator('handler', {
                      rules: [{ required: false }],
                      initialValue: this.state.data.handler,
                    })(<Text reading={this.state.reading}/>)}
                  </FormItem>
                  <FormItem
                    style={style}
                    {...formItemLayout}
                    label="SELECT"
                    colon={false}
                    wrapperCol={{ span: 6 }}
                  >
                    {getFieldDecorator('select', {
                      rules: [{ required: false }],
                      initialValue: (this.state.data.query
                        && this.state.data.query.select) || 'select',
                    })(<Text reading={this.state.reading}/>)}
                  </FormItem>
                  <FormItem
                    style={style}
                    {...formItemLayout}
                    label="字段明细"
                    colon={false}
                  >
                    <code>[自动计算]</code>
                  </FormItem>
                  <FormItem
                    style={style}
                    {...formItemLayout}
                    label="FROM"
                    colon={false}
                  >
                    {getFieldDecorator('from', {
                      rules: [{ required: true }],
                      initialValue: this.state.data.query
                      && this.state.data.query.from,
                    })(<TextArea reading={this.state.reading}/>)}
                  </FormItem>
                  <FormItem
                    style={style}
                    {...formItemLayout}
                    label="WHERE"
                    colon={false}
                  >
                    {getFieldDecorator('where', {
                      rules: [{ required: false }],
                      initialValue: this.state.data.query
                      && this.state.data.query.where,
                    })(<TextArea reading={this.state.reading}/>)}
                  </FormItem>
                  <FormItem
                    style={style}
                    {...formItemLayout}
                    label="GROUP BY"
                    colon={false}
                  >
                    {getFieldDecorator('groupBy', {
                      rules: [{ required: false }],
                      initialValue: this.state.data.query
                      && this.state.data.query.groupBy,
                    })(<TextArea reading={this.state.reading}/>)}
                  </FormItem>
                  <FormItem
                    style={style}
                    {...formItemLayout}
                    label="ORDER BY"
                    colon={false}
                  >
                    {getFieldDecorator('orderBy', {
                      rules: [{ required: false }],
                      initialValue: this.state.data.query
                      && this.state.data.query.orderBy,
                    })(<TextArea reading={this.state.reading}/>)}
                  </FormItem>
                  <FormItem
                    style={style}
                    {...formItemLayout}
                    label="HAVING"
                    colon={false}
                  >
                    {getFieldDecorator('having', {
                      rules: [{ required: false }],
                      initialValue: this.state.data.query
                      && this.state.data.query.having,
                    })(<TextArea reading={this.state.reading}/>)}
                  </FormItem>
                </Form>
              </Panel>
              <Panel header="筛选条件配置" key="2">
                <div>
                  <Table
                    className={`${prefix}-template-field-table`}
                    rowKey={record => record.key}
                    columns={this.state.filterColumns}
                    dataSource={this.state.data.filters || []}
                    pagination={false}
                    scroll={{ x: 1500 }}
                    size={comSize}
                    locale={{
                      emptyText: <Button onClick={this._addFilterData}>添加一个筛选条件</Button>
                    }}
                    style={{ width: this.state.width && this.state.width - 80 }}
                  />
                </div>
              </Panel>
              <Panel header="字段信息" key="3">
                <div>
                  <div className={`${prefix}-template-field-buttons`}>
                    <Button onClick={() => this._getElements('all')}>全量提取</Button>
                    <Button onClick={() => this._getElements('inc')}>增量提取</Button>
                  </div>
                  <Table
                    className={`${prefix}-template-field-table`}
                    rowKey={record => record.key}
                    columns={this.state.columns && this.state.columns
                      .filter(columnItems => ((this.state.formStyle) && (this.state.formStyle === 'DetailInfo') ?
                        columnItems.dataIndex !== '' : columnItems.dataIndex !== 'group')
                      )}
                    dataSource={this.state.data.elements || []}
                    pagination={false}
                    scroll={{ x: 2000 }}
                    locale={{
                      emptyText: <Button onClick={this._addTableData}>添加一个字段</Button>
                    }}
                    style={{ width: this.state.width && this.state.width - 80 }}
                  />
                </div>
              </Panel>
            </Collapse>
          </div>
      </div>
      </div>
    );
  }
});
