import React from 'react';
import PropTypes from 'prop-types';
import * as component from '../index';
import { addOnResize } from '../../../src/lib/listener';
import config from '../../../src/lib/config';
import FormItemGroupTemplateCom from './FormItemGroupTemplateCom';
import FormItemCom from './FormItemCom';

const { Form, Descriptions } = component;

/* eslint-disable */

class Forms extends React.Component {
  constructor(props) {
    super(props);
    this.flag = true;
    this.widthFlag = true;
    this.state = {
      width: '',
    };
  }
  componentDidMount() {
    // 将当前的详情以及分组信息传递到最上层组件的tab组件，由tab去渲染详情的分组界面）
    this._renderAnchor(this.props.dataForm);
    this._checkWidth();
    addOnResize(this._checkWidth);
  }
  getChildContext(){
    return {
      infoParent: true,
    }
  }
  componentWillReceiveProps(props) {
    this._checkWidth();
    if (this.props.dataForm !== props.dataForm) {
      this._renderAnchor(props.dataForm);
    }
  }
  componentWillUnmount() {
    this.flag = false;
  }
  _getAnchorType = () => {
    const { navigationRight, navigationLeft } = this.props;
    if (navigationRight || this.context.navigationRight) {
      return 'right';
    } else if (navigationLeft || this.context.navigationLeft) {
      return 'left';
    }
    return '';
  };
  _renderAnchor = (data) => {
    const type = this._getAnchorType();
    const { infoParent } = this.context;
    if (type && !infoParent) {
      const { offsetTop, offsetLeft } = this.props;
      const { renderAnchor, blockId } = this.context;
      const groups = this._calculateGroup(data);
      // 详情界面则传递详情分组信息
      renderAnchor && renderAnchor('info', groups, blockId, this.instance, type, offsetTop, offsetLeft);
    }
  };
  _getWidthCheck = (colNumber) => {
    const baseWidth = 320;
    const tempColNumber = parseInt(colNumber, 10);
    const tempArray = [];
    for (let i = 0; i< tempColNumber; i ++){
      tempArray.push(baseWidth * (i + 1));
    }
    return tempArray;
  };
  _getWidthByCol = (colNumber, col) => {
    const tempColNumber = parseInt(colNumber, 10);
    let width = 100 / tempColNumber;
    return `${width * col}%`;
  };
  _checkWidth = () => {
    const { tableBorder, type } = this.props;
    if ((!tableBorder) && (type !== 'Descriptions')) {
      this.widthFlag && setTimeout(() => {
        if (this.flag) {
          const { dataForm } = this.props;
          const { formUIHint = {} } = dataForm;
          const instanceWidth = this.instance && this.instance.offsetWidth;
          if (instanceWidth) {
            const widths = this._getWidthCheck(formUIHint.columnNumber || 1);
            let allWidth = '';
            widths.forEach((w, index) => {
              if (index === 0 && instanceWidth < w) {
                allWidth = '100%';
              } else if (index !==0 && instanceWidth > widths[index - 1] && instanceWidth < w) {
                allWidth = `${100 * (1 / index)}%`
              }
            });
            this.setState({
              width: allWidth,
            }, () => {
              this.widthFlag = true;
            });
          } else {
            this.widthFlag = true;
          }
        }
      }, 150);
      this.widthFlag = false;
    }
  };
  _calculateGroup = (data) => {
    const groups = {};
    if (Object.keys(data).length > 0) {
      let { elements = [] } = data;
      // elements = elements.filter(item => item.elementUIHint.visible);
      if (elements.some(ele => ele.group)) {
        // 如果有分组存在，根据分组进行过滤
        elements.forEach((ele) => {
          if (groups[ele.group || '10000: ']) {
            groups[ele.group || '10000: '].push(ele);
          } else {
            groups[ele.group || '10000: '] = [].concat(ele);
          }
        });
      } else {
        groups.noGroup = elements;
      }
    }
    return groups;
  };
  _getLabelWidth = (item) => {
    const { labelWidth } = this.props;
    let width = '';
    if (item.elementUIHint && item.elementUIHint.__editStyleFlag) {
      width = '0px';
    } else if(item.elementUIHint && item.elementUIHint.label){
      width = item.elementUIHint.label;
    } else {
      width = labelWidth || config.labelWidth;
    }
    return width;
  };
  _setLabelAlign = (align,prefix) => {
    switch (align) {
      case 'left':
        return prefix + '-align';
      case 'right':
        return prefix + '-right';
      case 'spaceBetween':
        return prefix + '-between';
      default:
        return '';
    }
  };
  /* eslint-disable */
  _renderFormItem = (items, data, prefix) => {
    const { formUIHint = {} } = data;
    const { dataValue,tableBorder,labelAlign,
      reading, params, dataFormId, form, valuenullholder, validateResult, onNoValidateChange, type } = this.props;
    const { getFieldDecorator } = form;
    const labelPre = this._setLabelAlign(labelAlign || config.labelAlign,prefix);
    const columnNumber = formUIHint.columnNumber || 1;
    if (tableBorder || type === 'Descriptions') {
      return (<Descriptions
        bordered
        column={{
          xxl: columnNumber,
          xl: columnNumber - 1 <= 0 ? 1 : columnNumber - 1,
          lg: columnNumber - 1 <= 0 ? 1 : columnNumber - 1,
          md: columnNumber - 1 <= 0 ? 1 : columnNumber - 1,
          sm: columnNumber - 2 <= 0 ? 1 : columnNumber - 2,
          xs: columnNumber - 3 <= 0 ? 1 : columnNumber - 3 }}
      >
        {
          (items.map((item) => {
            const key = item.code;
            return (
              <Descriptions.Item
                span={item.elementUIHint.colspan || 1}
                label={item.name}
                key={key}
                style={{display: item.elementUIHint.visible ? '' : 'none' }}
              >
                <FormItemCom
                  {...this.props}
                  reading={reading}
                  params={params}
                  dataFormId={dataFormId}
                  valuenullholder={valuenullholder}
                  validateResult={validateResult}
                  item={item}
                  dataValue={dataValue}
                  labelPre={labelPre}
                  getFieldDecorator={getFieldDecorator}
                  form={form}
                  onNoValidateChange={onNoValidateChange}
                  hiddenLabel
                  type={type}
                />
              </Descriptions.Item>
            );
          }))
        }
      </Descriptions>);
    }
    return (items.map((item) => {
      const key = item.code;
      const labelWidth = this._getLabelWidth(item);
      return (
        <div
          key={key}
          className={`${prefix}-item-container`}
          style={{
            width: this.state.width || this._getWidthByCol(formUIHint.columnNumber || 1, item.elementUIHint.colspan || 1),
            display: item.elementUIHint.visible ? '' : 'none' }}
        >
          <FormItemCom
            {...this.props}
            reading={reading}
            params={params}
            dataFormId={dataFormId}
            valuenullholder={valuenullholder}
            validateResult={validateResult}
            labelWidth={labelWidth}
            item={item}
            dataValue={dataValue}
            labelPre={labelPre}
            getFieldDecorator={getFieldDecorator}
            form={form}
            onNoValidateChange={onNoValidateChange}
          />
        </div>
      );
    }));
  };
  _renderFormGroup = (groups, group, dataForm, prefix) => {
    const { infoParent } = this.context;
    const { groupTemplates, dataValue } = this.props;
    const display =
      groups[group].filter(item => item.elementUIHint.visible).length !== 0 ? '' : 'none';
    const template = groupTemplates[group] || groupTemplates[group.split(':')[0]];
    if (template) {
      return (
        <FormItemGroupTemplateCom
          dataValue={dataValue}
          groups={groups}
          group={group}
          groupTemplates={groupTemplates}
          key={group}
        />
      );
    }
    return (
      <component.Fieldset
        headerType='lite'
        showArrow
        className={infoParent ? 'infoParent' : ''}
        legend={group.split(':')[1] || group}
        expanded={true}
        id={group}
        key={group}
        style={{ display: display }}
      >
        <div className={`${prefix}-info-container`}>
          {this._renderFormItem(groups[group], dataForm, `${prefix}-info`)}
        </div>
      </component.Fieldset>
    );
  };
  shouldComponentUpdate(nextProps, nextState){
    // 1.dataValue发生变化
    // 2.validateResult发生变化
    // 3.详情宽度发生变化
    // 4.dataForm发生变化
    // 5.groupTemplates发生变化
    // 6.dict发生变化
    // 7.顶部按钮发生变化
    const { dataForm, dataValue, validateResult, groupTemplates, dict, reading } = this.props;
    const { width } = this.state;
    return (nextProps.dataForm !== dataForm)
      || (nextProps.dataValue !== dataValue)
      || (nextProps.validateResult !== validateResult)
      || (nextProps.groupTemplates !== groupTemplates)
      || (nextProps.dict !== dict)
      || (nextState.width !== width)
      || (nextProps.reading !== reading)
  }
  render() {
    const { dataForm, prefix,tableBorder } = this.props;
    const table = tableBorder ? 'table' : '';
    const groups = this._calculateGroup(dataForm);
    return (
      <div className={`${prefix}-info`} ref={instance => this.instance = instance}>
        <Form>
          {
            !groups.noGroup ?
              Object.keys(groups).sort((a, b) => {
                return a.split(':')[0] - b.split(':')[0];
              }).map(group =>
                this._renderFormGroup(groups, group, dataForm, prefix))
              : (
                <div className={`${prefix}-info-container ${prefix}-info-cta${table}`}>
                  {this._renderFormItem(groups.noGroup, dataForm, `${prefix}-info`)}
                </div>)
          }
        </Form>
      </div>
    );
  }
}

Forms.contextTypes = {
  renderAnchor: PropTypes.func,
  blockId: PropTypes.string,
  navigationLeft: PropTypes.bool,
  navigationRight: PropTypes.bool,
  infoParent: PropTypes.bool, // 判断是否是info嵌套的info
};

Forms.childContextTypes = {
  infoParent: PropTypes.bool,
};

export default Form.create({
  onValuesChange: (props, values, allValues) => {
    const { onValuesChange } = props;
    onValuesChange && onValuesChange(props, values, allValues);
  },
  onFieldsChange: (props, values) => {
    const { onFieldsChange } = props;
    onFieldsChange && onFieldsChange(values);
  },
})(Forms);
