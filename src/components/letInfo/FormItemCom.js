import React, { Fragment } from 'react';
import * as component from '../index';

const { Form, Tooltip} = component;
const { Item } = Form;

// 详情item组件
export default class FormItemCom extends React.Component{
  shouldComponentUpdate(nextProps){
    // reading, params, dataFormId, valuenullholder, validateResult, labelWidth, item,
    // dataValue, labelPre, getFieldDecorator, form, onNoValidateChange, dict
    // 判断条件1：item是否发生变化
    // 判断条件2：校验结果是否发生变化
    // 判断条件3：全局的reading是否发生变化
    // 判断条件4：全局的labelWidth是否发生变化
    // 判断条件5：value是否发生变化
    // 判断条件6：dict是否发生变化
    const { item, validateResult, reading, labelWidth, dataValue, dict } = this.props;
    return (nextProps.item !== item)
      || (nextProps.reading !== reading)
      || (nextProps.labelWidth !== labelWidth)
      || this._checkValidateResult(validateResult, nextProps.validateResult, nextProps.item)
      || this._checkDataValue(dataValue, nextProps.dataValue, nextProps.item)
      || this._checkDict(dict, nextProps.dict, nextProps.item);
  }
  _checkValidateResult = (preResult = {}, nextResult = {}, item) => {
    const code = item.code;
    const preRecords = preResult.records;
    const nexRecords = nextResult.records;
    return this._checkSimpleData(preRecords, nexRecords, code);
  };
  _checkDataValue = (preDataValue, nextDataValue, item) => {
    const code = item.code;
    return this._checkSimpleData(preDataValue, nextDataValue, code);
  };
  _checkDict = (preDict, nextDict, item) => {
    const code = item.code;
    return this._checkSimpleData(preDict, nextDict, code);
  };
  _checkSimpleData = (data1, data2, key) => {
    return data1[key] !== data2[key];
  };
  _filterDict = (item) => {
    const { dict } = this.props;
    let tempDict = (dict[item.code] || []);
    if (item.elementUIHint.dict && typeof item.elementUIHint.dict === 'function') {
      tempDict = item.elementUIHint.dict(tempDict);
    }
    return tempDict;
  };
  _getDefaultStyle = (item) => {
    if(item.dataType !== 'String') {
      switch (item.dataType) {
        case 'Date':
          return {
            width:'200px',
          };
        case 'Integer':
          return {
            width:'100px',
            color:'red',
          };
        case 'Double':
          return {
            width:'200px',
            color:'red',
          };
        default:
          return {};
      }
    }
    return {};
  };
  _getElementUIHint = (item) => {
    const { reading, params, dataFormId, valuenullholder, type } = this.props;
    let htmlStyle = {};
    try {
      htmlStyle = item.elementUIHint.htmlStyle && JSON.parse(item.elementUIHint.htmlStyle)
        || this._getDefaultStyle(item);
      if (htmlStyle.width && htmlStyle.width.includes('%') && type === 'Descriptions') {
        // 此处需要对某些超出的宽度进行特殊处理
        const tempWidth = parseInt(htmlStyle.width.split('%')[0] || 0, 10);
        if (tempWidth > 100) {
          htmlStyle.width = '100%';
        }
      }
      // htmlStyle = this._getDefaultStyle(item)
    } catch (e) {
      component.Modal.error({
        title: '字段htmlStyle格式出错，请填写正确的JSON数据，检查是否有中文字符',
        content: `${item.name}[${item.code}]${item.elementUIHint.htmlStyle}`,
      });
    }
    return {
      placeholder: item.elementUIHint && item.elementUIHint.placeholder,
      reading: item.elementUIHint.reading || reading,
      readOnly: item.elementUIHint.readonly,
      compPrefix: item.elementUIHint.prefix,
      suffix: typeof item.elementUIHint.suffix === 'function' ?
        item.elementUIHint.suffix({...item, ...this.props}) : item.elementUIHint.suffix,
      options: this._filterDict(item),
      style: htmlStyle,
      dictCodeTreeLeafOnly: item.elementUIHint.dictCodeTreeLeafOnly,
      item: {
        ...item,
        onNoValidateChange: this._onNoValidateChange,
      },
      param: {
        params,
        dataFormId,
      },
      valuenullholder,
    };
  };
  _onNoValidateChange = (value) => {
    const { onNoValidateChange, form } = this.props;
    onNoValidateChange && onNoValidateChange(this.props, value, {
      ...form.getFieldsValue(),
      ...value,
    });
  };
  _getComponent = (editStyle, value, item) => {
    let com = component.Text;
    if (typeof editStyle === 'string') {
      com = component[editStyle] || component.Text;
    } else if (typeof editStyle === 'function') {
      com = editStyle(value, item);
    } else {
      com = editStyle;
    }
    return com;
  };
  _getValidateStatus = (fieldName) => {
    const { validateResult = {} } = this.props;
    const { records = {} } = validateResult;
    let errors = [];
    errors = errors.concat((records[fieldName] || []).map(field => field.message));
    return {
      validateStatus: errors.length > 0 ? 'error' : 'success',
      help: ([...new Set(errors)].map(item => <div key={item}>{item}</div>)),
    };
  };
  _calcNodeMargin = (value) => {
    let nodeMar = '';
    const htmlStyle = value && value.htmlStyle && JSON.parse(value.htmlStyle).width;
    if (htmlStyle) {
      const percentage = htmlStyle.search('%');
      const pixel = htmlStyle.search('px');
      const ret = Object.prototype.toString.call(htmlStyle.width).slice(8,-1);
      const numValue = ret === Number ? htmlStyle : parseInt(htmlStyle.replace(/[^0-9]/ig,''), 10);
      switch (value.editStyle) {
        case 'Text':
          if (pixel > -1) {
            nodeMar = value.suffix ? numValue - 170 + 60 : numValue - 170;
          }
          if (percentage > -1) {
            nodeMar = value.suffix ? (numValue - 100) * 1.7 + 60 : (numValue - 100) * 1.7;
          }
          break;
        case 'Select':
          if (pixel > -1) {
            nodeMar = numValue - 110;
          }
          if (percentage > -1) {
            nodeMar = (numValue - 100) * 1.1;
          }
          break;
        case 'DatePicker':
          if (pixel > -1) {
            nodeMar = numValue - 200;
          }
          if (percentage > -1) {
            nodeMar = (numValue - 100) * 2;
          }
          break;
        case 'TreeSelect':
          if (pixel > -1) {
            nodeMar = numValue - 165;
          }
          if (percentage > -1) {
            nodeMar = (numValue - 100) * 1.65;
          }
          break;
        case 'YearMonthPicker':
          if (pixel > -1) {
            nodeMar = numValue - 200;
          }
          if (percentage > -1) {
            nodeMar = (numValue - 100) * 2;
          }
          break;
        case 'CheckBox':
          break;
        default:
          break;
      }
      return `${nodeMar}px`;
    }
    return nodeMar;
  };
  _getDefaultValue = (item,dataValue) => {
    if (dataValue[item.code] === 0) {
      return 0;
    } else if (dataValue[item.code]) {
      return dataValue[item.code];
    }
    return item.defaultValue;
  };
  _dataType = (type) => {
    let dataType = 'string';
    switch (type) {
      case 'String':
      case 'StringArray': dataType = 'string'; break;
      case 'Integer': dataType = 'integer'; break;
      case 'Double': dataType = 'number'; break;
      case 'Boolean': dataType = 'boolean';break;
      case 'Currency':
      case 'Date':
      case 'DateTime':
      case 'Time': dataType = 'string'; break;
      default: dataType = 'string';
    }
    return dataType;
  };
  _renderFormItem = () => {
    const { item, prefix = 'ro', dataValue, labelPre, hiddenLabel, getFieldDecorator, form, labelWidth,disabledContainer } = this.props;
    const textArea = item.elementUIHint.editStyle === 'TextArea' ? 'Area' : '';
    const nodeMarLeft = this._calcNodeMargin(item.elementUIHint);
    const Com = this._getComponent(item.elementUIHint.editStyle,
      form.getFieldValue(item.code)
      || dataValue[item.code] || item.defaultValue, item);
    const comProps = {
      ...(this._getElementUIHint(item)),
      decimalDigits: item.decimalDigits,
      multiplier: item.multiplier,
      disabledcontainer:disabledContainer.toString(),
    };
    const key = item.code;
    const validate = this._getValidateStatus(key);
    return (
      <Fragment>
        <Item
          style={{marginBottom: '0px'}}
          className={`${prefix}-item ${labelPre} ${prefix}-itemTd ${prefix}-item${textArea}`}
          labelWidth={labelWidth}
          hiddenLabel={hiddenLabel}
          label={<span>{item.elementUIHint.__editStyleFlag ? '' : `${item.name}:`}</span>}
          colon={false}
          {
            ...validate
          }
        >
          <Tooltip title={item.elementUIHint.tips}>
            <div>
              {getFieldDecorator(item.code, {
                initialValue: this._getDefaultValue(item,dataValue),
                rules: [{
                  required: item.elementUIHint.required,
                  type: this._dataType(item.dataType),
                }],
              })(
                typeof Com === 'object' ? React.cloneElement(Com, typeof Com.type === 'string' ? {} : comProps)
                  : <Com {...(typeof Com.type === 'string' ? {} : comProps)} />)}
            </div>
          </Tooltip>
        </Item>
        {
          item.elementUIHint &&
          item.elementUIHint.note ?
            <div
              style={{marginLeft:nodeMarLeft}}
              className={`${validate.validateStatus === 'error'
                ? `${prefix}-info-item-container-err-note` : `${prefix}-info-item-container-note`}`}
            >
              {item.elementUIHint.note}
            </div> : null
        }
      </Fragment>
    );
  };
  render() {
    return this._renderFormItem();
  }
}
