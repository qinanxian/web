import React from 'react';
import nzhcn from 'nzh/cn';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import scrollIntoView from 'dom-scroll-into-view';

import * as dataForm from '../../lib/dataform';
import * as rest from '../../lib/rest';
import Form from './Form';
import './style/index.less';
import { Modal, Message, Button, Spin } from '../index';
import { developComposeWidthContext } from '../developcompose/developCompose';
import config from '../../lib/config';

const showBreadcrumb = config.showBreadcrumb;
@developComposeWidthContext({ widthChangeAddListen: PropTypes.func,
  widthChangeRemoveListen: PropTypes.func,
  param: PropTypes.object,
  modalId: PropTypes.string,
  comDataChange: PropTypes.func,
})
export default class Forms extends React.Component {
  static defaultProps = {
    infoType: config.infoType || 'DetailInfo',
  };
  constructor(props) {
    super(props);
    this.buttons = [];
    this.buttonFlag = true;
    this.groupTemplatesFlag = true;
    this.setStateFlag = true;
    this.itemChange = {};
    this.groupTemplates = {};
    this.dataForm = {};
    this.validates = {};
    this.infoId = Math.uuid();
    this.noValidateChanges = [];
    this.defaultValue = {};
    this.state = {
      dataForm: {},
      dataValue: {},
      dict: {},
      buttons: [],
      spinning: false,
      groupTemplates: {},
      validateResult: { records: {} },
    };
  }
  componentDidMount() {
    const { didMount, formReady, dataReady } = this.props;
    /* eslint-disable */
    this.info = {
      setValue: this.setValue,
      setDefaultValue: this.setDefaultValue, // 不会触发onValuesChange方法
      getValue: this.getValue,
      setData: this.setData,
      setDefaultData: this.setDefaultData, // 不会触发onValuesChange方法
      getData: this.getData,
      setItemVisible: this.setItemVisible,
      setItemRequired: this.setItemRequired,
      setValueReadonly: this.setValueReadonly,
      setReadingMode: this.setReadingMode,
      setGroupVisible: this.setGroupVisible,
      setGroupReadonly: this.setGroupReadonly,
      setGroupReadingMode: this.setGroupReadingMode,
      setAllReadingMode: this.setAllReadingMode,
      setItemTemplate: this.setItemTemplate,
      setItemPrefix: this.setItemPrefix,
      setItemSuffix: this.setItemSuffix,
      setItemTips: this.setItemTips,
      setItemNotes: this.setItemNotes,
      validate: this.validate,
      validateItem: this.validateItem,
      saveData: this.saveData,
      refresh: this.refresh,
      addButton: this.addButton,
      setItemOnChange: this.setItemOnChange,
      setGroupTemplate: this.setGroupTemplate,
      setLabelWidth: this.setLabelWidth,
      setItemLabelItemWidth: this.setItemLabelItemWidth,
      invoke: this.invoke,
      getDictItem: this.getDictItem,
      getDictItems: this.getDictItems,
      getDictItemName: this.getDictItemName,
      setItemDict: this.setItemDict,
      setItemValueToMoney: this.setItemValueToMoney,
      saveWithoutValidate: this.saveWithoutValidate,
      addValidate: this.addValidate,
    };
    this._initialTemplate(didMount, formReady, dataReady, this.props);
    const { buttonFixed = false } = this.props;
    if (buttonFixed) {
      const id = (this.context.param || {}).__id;
      this.tab = document.getElementById(id);
      this.context.widthChangeAddListen && this.context.widthChangeAddListen(this.infoId, this.calcInfoHeader)
    }

  }
  componentWillReceiveProps(nextProps) {
    // 只适合对象的浅比较，否则会造成性能问题
    const nextParams = nextProps.params && rest.serializeParam(nextProps.params);
    const thisParams = this.props.params && rest.serializeParam(this.props.params);
    if ((nextParams !== thisParams) || (nextProps.dataFormId !== this.props.dataFormId)) {
      this._initialTemplate(nextProps.didMount, nextProps.formReady, nextProps.dataReady, nextProps);
    }
  }
  componentWillUnmount() {
    const { buttonFixed } = this.props;
    buttonFixed && this.context.widthChangeRemoveListen && this.context.widthChangeRemoveListen(this.infoId);
    const { comDataChange } = this.context;
    comDataChange && comDataChange(this.infoId, false);
  }
  calcInfoHeader = () => {
    const { buttonFixed } = this.props;
    if (this.infoHeader && this.infoInstance && buttonFixed) {
      setTimeout(() => {
        const top = this.infoHeader.offsetHeight - 36;
        this.infoInstance.style.paddingTop = `${top < 0 ? 0 : this.infoHeader.offsetHeight}px`;
      }, 150);
    }
  };
  refresh = (params) => {
    this._updateFormData({ ...this.props, ...(params || {}) });
  };
  scrollToError = () => {
    // 滚动到校验失败的内容
    // ant-form-item-control has-error
    const id = (this.context.param || {}).__id || this.context.modalId;
    const tab = document.getElementById(id);
    const errorField = tab && tab.querySelector('.has-error');
    if (errorField) {
      scrollIntoView(errorField, tab);
    }
  };
  _updateFormData = (props) => {
    this.setState({
      spinning: true
    });
    this._getData(props).then((res) => {
      this.setState({
        dataValue: res.body || {},
        spinning: false,
      });
    }).catch(e => {
      this.setState({
        spinning: false
      });
      Modal.error({
        title: '获取详情数据失败',
        content: e.message
      })
    });
  };
  _initialTemplate = (didMount, formReady, dataReady, props, cd) => {
    const { params } = props;
    this.setState({
      spinning: true
    });
    // this.form.resetFields();
    this._getData(props).then((res) => {
      this.dataForm = res.meta || res;
      this.setState({
        dataForm: res.meta || res,
        dataValue: res.body || {},
        dict: res.dict || {},
        spinning: false,
      }, () => {
        cd && cd();
        if (params) {
          formReady && formReady(this.info);
          dataReady && dataReady(this.info);
          didMount && didMount(this.info);
        } else {
          formReady && formReady(this.info);
        }
      });
    }).catch(e => {
      this.setState({
        spinning: false
      });
      Modal.error({
        title: '获取详情数据失败',
        content: e.message
      })
    });
  };
  _getData = (props) => {
    const { dataFormId, params } = props;
    if (params) {
      return dataForm.getDataOne(dataFormId, this._serializeParam(params))
    }
    return dataForm.getMeta(dataFormId)
  };
  _serializeParam = (params, field) => {
    let str = '';
    if (typeof params === 'string') {
      str = params;
    } else {
      if (Array.isArray(params) && field) {
        params.forEach(p => {
          if (typeof p === 'string' || typeof p === 'number') {
            str = `${str};${field}=${p}`;
          }
        })
      } else {
        Object.keys(params).forEach(p => {
          if (Array.isArray(params[p])) {
            str = `${str};${this._serializeParam(params[p], p)}`;
          } else {
            str = `${str};${p}=${params[p]}`;
          }
        })
      }
    }
    return encodeURIComponent(str.replace(/^;/g, ''));
  };
  setValue = (itemId, value) => {
    this.form.setFieldsValue({ [itemId]: value });
  };
  setDefaultValue = (itemId, value) => {
    this.defaultValue[itemId] = value;
    this.setValue(itemId, value);
  };
  getValue = (itemId) => {
    return this.form.getFieldValue(itemId);
  };
  setData = (data) => {
    const {dataForm} = this.state;
    const eleNames = dataForm && dataForm.elements.map(item => item.code);
    const propNames = Object.keys(data);
    propNames.forEach(item => {
      if (!eleNames.includes(item)) {
        delete data[item];
      }
    });
    this.form.setFieldsValue(data);
  };
  setDefaultData = (data) => {
    this.defaultValue = {
      ...this.defaultValue,
      ...data,
    };
    this.setData(data);
  };
  getData = (data) => {
    return this.form.getFieldsValue(data);
  };
  getDictItem = (dictCode, itemCode) => {
    const item = this.state.dict[dictCode] || [];
    const tempItemCode = itemCode || this.getValue(dictCode);
    return item.filter(d => d.code === tempItemCode)[0];
  };
  getDictItems = (dictCode) => {
    return this.state.dict[dictCode] || [];
  };
  getDictItemName = (dictCode, itemCode) => {
    const item = this.getDictItem(dictCode, itemCode);
    return item && item.name;
  };
  setItemDict = (itemId, cb) => {
    this._updateElementUIHint(itemId, cb, 'dict', ele => ele.code === itemId);
  };
  setItemValueToMoney = (itemId, value) => {
    // 不显示前缀
    this.form.setFieldsValue({ [itemId]: nzhcn.toMoney(value, {outSymbol:false}) });
  };
  setItemVisible = (itemId, status) => {
    this._updateElementUIHint(itemId, status, 'visible', ele => ele.code === itemId);
  };
  setItemRequired = (itemId, status) => {
    this._updateElementUIHint(itemId, status, 'required', ele => ele.code === itemId);
  };
  setValueReadonly = (itemId, status) => {
    this._updateElementUIHint(itemId, status, 'readonly', ele => ele.code === itemId);
  };
  setReadingMode = (itemId, status) => {
    this._updateElementUIHint(itemId, status, 'reading', ele => ele.code === itemId);
  };
  setAllReadingMode = (status) => {
    this._updateElementUIHint(true, status, 'reading', ele => true);
  };
  setGroupVisible = (groupId, status) => {
    this._updateElementUIHint(groupId, status, 'visible', ele =>
      ele.group === groupId || (ele.group && ele.group.split(':')[0] === groupId));
  };
  setGroupReadonly = (groupId, status) => {
    this._updateElementUIHint(groupId, status, 'readonly', ele =>
      ele.group === groupId || (ele.group && ele.group.split(':')[0] === groupId));
  };
  setGroupReadingMode = (groupId, status) => {
    this._updateElementUIHint(groupId, status, 'reading', ele =>
      ele.group === groupId || (ele.group && ele.group.split(':')[0] === groupId));
  };
  setItemTemplate = (itemId, template, status) => {
    this._updateElementUIHint(itemId, template, 'editStyle', ele => ele.code === itemId, status);
  };
  setItemPrefix = (itemId, prefix) => {
    this._updateElementUIHint(itemId, prefix, 'prefix', ele => ele.code === itemId);
  };
  setItemSuffix = (itemId, suffix) => {
    this._updateElementUIHint(itemId, suffix, 'suffix', ele => ele.code === itemId);
  };
  setItemTips = (itemId, tips) => {
    this._updateElementUIHint(itemId, tips, 'tips', ele => ele.code === itemId);
  };
  setItemNotes = (itemId, notes) => {
    this._updateElementUIHint(itemId, notes, 'note', ele => ele.code === itemId);
  };
  invoke = (methodName, param) => {
    return dataForm.invokeMethod(this.props.dataFormId, methodName, param);
  };
  setItemOnChange = (itemId, cb) => {
    this.itemChange[itemId] = cb;
  };
  setGroupTemplate = (groupId, template) => {
    this.groupTemplates[groupId] = template;
    if (this.groupTemplatesFlag) {
      setTimeout(() => {
        this.setState({
          groupTemplates: {
            ...this.groupTemplates,
          }
        }, () => {
          this.groupTemplatesFlag = true;
        })
      }, 300)
    }
    this.groupTemplatesFlag = false;
  };
  setLabelWidth = (width) => {
    this._updateElementUIHint(null, width, 'label', () => true);
  };
  setItemLabelItemWidth = (itemId, width) => {
    this._updateElementUIHint(itemId, width, 'label', ele => ele.code === itemId);
  };
  _updateElementUIHint = (itemId, status, name, match, flag) => {
    this.dataForm = {
      ...this.dataForm,
      elements: this.dataForm.elements.map((ele) => {
        if (match(ele)) {
          return {
            ...ele,
            elementUIHint: {
              ...ele.elementUIHint,
              [name]: status,
              [`__${name}Flag`]: flag
            },
          };
        }
        return ele;
      }),
    };
    if (this.setStateFlag) {
      setTimeout(() => {
        this.setState({
          dataForm: {
            ...this.dataForm
          },
        }, () => this.setStateFlag = true);
      }, 300)
    }
    this.setStateFlag = false;
  };
  saveWithoutValidate = (cb, data = {}) => {
    // 关闭校验，直接保存
    this.saveData(cb, data, true);
  };
  addValidate = (name, fuc) => {
    this.validates[name] = fuc;
  };
  validateClient = (values, cb) => {
    // 前端校验
    Promise.all(Object.keys(values).map((value) => {
      return this._validateValues({
        [value]: {
          name: value,
          value: values[value]
        }
      });
    })).then((errors) => {
      const errorResult = errors.reduce((a, b) => {
        const fieldName = Object.keys(b)[0];
        a[fieldName] = [...b[fieldName]];
        return a;
      }, {});
      cb({
        records: {
          ...this.state.validateResult.records,
          ...errorResult,
        }
      });
    }).catch(err => {
      console.log(err);
    });
  };
  validate = (cb, data) => {
    // 先执行客户端的校验方法，在执行服务端的校验方法
    // 顺序执行前端校验方法
    const values = this.form.getFieldsValue();
    this.validateClient(values, (validateResult) => {
      const { dataFormId, params } = this.props;
      Object.keys(values).map((item) => {
        if (typeof values[item] === 'string') values[item] = values[item].trim();
      });
      dataForm.validateDataOne(dataFormId, {...params, ...values, ...data}).then(res => {
        // 合并校验结果
        const tempResult = {...res};
        const allValuesRecords = Object.keys(validateResult.records);
        if (allValuesRecords.some(r => validateResult.records[r].length !== 0)) {
          tempResult.passed = false;
          allValuesRecords.forEach(record => {
            if (!tempResult.records[record]) {
              // 如果后端校验没有，则需要增加上去
              tempResult.records[record] = validateResult.records[record];
            } else {
              // 如果后端校验已经存在，则以后端为主
              const tempRecord = [...tempResult.records[record]];
              // 检查后端的必输项是否已经校验
              const requireChecked = tempRecord.some(err => err.validateType === 'Required');
              validateResult.records[record].filter(err => !(requireChecked && err.validateType === 'Required'))
                .forEach(err => {
                if (!tempRecord.map(re => re.message).includes(err.message)) {
                  tempRecord.push(err);
                }
              });
              tempResult.records[record] = tempRecord;
            }
          });
        }
        this.setState({
          validateResult: tempResult
        }, () => {
          cb && cb(tempResult.passed === false && '校验不通过');
          if (tempResult.passed === false) {
            this.scrollToError();
          }
        });
      }).catch((e) => {
        cb && cb(e);
        Modal.error({
          title: '保存失败，数据校验异常',
          content: e.message,
        });
      });
    });
  };
  validateItem = (itemId, cb) => {
    this.form.validateFieldsAndScroll([itemId], { force: true }, cb);
  };
  dataFormSaveData = (cb, data = {}, resolve, reject) => {
    const { dataFormId, params, saveMessageEnable = true, name = '' } = this.props;
    const values = this.form.getFieldsValue();
    Object.keys(values).map((item) => {
      if (typeof values[item] === 'string') values[item] = values[item].trim();
    });
    dataForm.saveDataOne(dataFormId, {...params, ...values, ...data}).then((res) => {
      cb && cb(null, res);
      const { comDataChange } = this.context;
      comDataChange && comDataChange(this.infoId, false);
      saveMessageEnable && (Message.success({
        message: name + '保存成功',
      }));
      resolve(res);
    }).catch((e) => {
      cb && cb(e);
      saveMessageEnable && (Modal.error({
        title: name + '保存失败',
        content: e.message,
      }));
      reject(e);
    });
  };
  saveData = (cb, data = {}, flag) => {
    return new Promise((resolve, reject) => {
      if (flag) {
        this.dataFormSaveData(cb, data, resolve, reject);
      } else {
        //cb && cb();
        this.validate((errors) => {
          if (!errors) {
            this.dataFormSaveData(cb, data, resolve, reject)
          } else {
            setTimeout(() => {
              reject(errors);
              cb && cb(errors)
            });
          }
        }, data);
      }
    });
  };
  _save = () => {
    this.setState({
      spinning: true
    });
    this.saveData(() => {
      this.setState({
        spinning: false
      });
    })
  };
  addButton = (button) => {
    // this.buttons = [...this.state.buttons];
    this.buttons = this.buttons.concat(button);
    if (this.buttonFlag) {
      setTimeout(() => {
        this.setState({
          buttons: [...this.buttons]
        }, () => {
          this.buttonFlag = true;
          this.calcInfoHeader();
        })
      }, 300)
    }
    this.buttonFlag = false;
  };
  _validateValues = (values) => {
    return new Promise((validateRes => {
      const { dataForm } = this.state;
      const value = values[Object.keys(values)[0]];
      const fieldData = dataForm
        .elements
        .filter(e => e.code === value.name && e.elementUIHint.visible)
        .map(e => ({
          required: e.elementUIHint.required,
          name: e.name,
          validatorList: e.validatorList
            .filter(va => va.runAt !== 'Server')
            .sort((a, b) => a.code - b.code)
        }))[0];
      let errors = [];
      const val = value.value === 0 ? '0' : value.value;
      if (!fieldData) {
        validateRes({[value.name]: errors});
      } else {
        if (fieldData.required && !val) {
          errors = [{
            validateType: 'Required',
            message: `${fieldData.name}不能为空`
          }];
          validateRes({[value.name]: errors});
        } else {
          const validatorList = fieldData.validatorList;
          if (validatorList && validatorList.length > 0) {
            return Promise.all(validatorList.map(v => {
              return new Promise((resolve) => {
                if (v.mode === 'RegExp') {
                  const reg = new RegExp(v.expr);
                  //console.log(this.form.getFieldValue(value.name))
                  if (!reg.test(value.value)) {
                    if (errors) {
                      errors.push({ message: v.defaultMessage });
                    } else {
                      errors = [{ message: v.defaultMessage }];
                    }
                  } else {
                    resolve();
                  }

                } else if (v.mode === 'JSFunction') {
                  if (this.validates[v.expr]) {
                    this.validates[v.expr](value.value, {
                      ...this.form.getFieldsValue(),
                      [value.name]: value.value,
                    }).then(res => {
                      if (res.passed === false) {
                        if (errors) {
                          errors.push({ message: res.message || v.defaultMessage, ...res });
                        } else {
                          errors = [{ message: res.message || v.defaultMessage, ...res }];
                        }
                        resolve();
                      } else {
                        resolve();
                      }
                    });
                  } else {
                      resolve();
                  }

                }
              })
            })).then(() => {
              validateRes({[value.name]: errors});
            });
          }
          validateRes({[value.name]: errors});
        }
      }
    }));
  };
  onNoValidateChange = (props, values, allValues) => {
    const { onValuesChange } = this.props;
    onValuesChange && onValuesChange(props, values, allValues);
    this.noValidateChanges = [...new Set(this.noValidateChanges.concat(Object.keys(values)))];
    const tempValue = Object.keys(values).reduce((a, b) => {
      a[b] = {
        name: b,
        value: allValues[b]
      };
      return a;
    }, {});
    Object.keys(tempValue).forEach(item => {
      this.itemChange[item] && this.itemChange[item](tempValue[item].value);
    });
  };
  checkDefaultValue = (values) => {
    // 如果变化的数据包含其他的字段则需要触发onChange
    const defaultValues = Object.keys(this.defaultValue);
    const valuesFields = Object.keys(values);
    return valuesFields.some(v => !defaultValues.includes(v))
      || valuesFields.some(v => values[v] !== this.defaultValue[v]);
  };
  onValuesChange = (props, values, allValues) => {
    if (this.checkDefaultValue(values)) {
      const { onValuesChange } = this.props;
      onValuesChange && onValuesChange(props, values, allValues);
      const { comDataChange } = this.context;
      comDataChange && comDataChange(this.infoId, true);
    }
    // 1.组装value
    const tempValue = Object.keys(values).reduce((a, b) => {
      a[b] = {
        name: b,
        value: allValues[b]
      };
      return a;
    }, {});
    Promise.all(Object.keys(tempValue).map(v => {
      return this._validateValues({
        [v]: {
          name: v,
          value: allValues[v]
        }
      })
    })).then((errors) => {
      const errorResult = errors.reduce((a, b) => {
          const fieldName = Object.keys(b)[0];
          a[fieldName] = [...b[fieldName]];
          return a;
        }, {});
      this.setState((preState) => {
        return {
          validateResult: {
            ...preState.validateResult,
            records: {
              ...preState.validateResult.records,
              ...errorResult,
            }
          }
        }
      }, () => {
        //console.log(lastResult, current, this.state.validateResult.records)
      });
    }).catch(err => {
      console.log(err);
    });
    // 1.过滤无校验的change事件，防止执行多次
    Object.keys(tempValue).filter(item => !this.noValidateChanges.includes(item)).forEach(item => {
      this.itemChange[item] && this.itemChange[item](tempValue[item].value);
    });
  };
  getButtonWidth = (buttonOffsetLeft) => {
    if (typeof buttonOffsetLeft === 'string') {
      const tempOffset = parseFloat(buttonOffsetLeft.split('%')[0] || 0);
      return `calc(${100 - tempOffset - 3}% - 35px)`;
    }
    return `calc(100% - ${buttonOffsetLeft + 35}px)`;
  };
  renderHeader = (prefix, defaultButton, buttonFixed) => {
    const { buttonOffsetTop = 0, buttonOffsetLeft = 0 } = this.props;
    const height = showBreadcrumb ? 56 : 45;
    const element = <div
      ref={(instance) => this.infoHeader = instance}
      className={`${prefix}-info-button`}
      style={{
        display: (defaultButton || this.state.buttons.length > 0) ? '' : 'none',
        position: buttonFixed ? 'absolute' : 'relative',
        top: buttonFixed ? height + buttonOffsetTop : 0,
        zIndex: buttonFixed ? 2 : 0,
        left: buttonFixed ? buttonOffsetLeft : 0,
        width: buttonFixed ? this.getButtonWidth(buttonOffsetLeft) : '100%'
      }}
    >
      <Button type="primary" onClick={this._save} style={{ display: defaultButton ? '' : 'none' }}>
        保存
      </Button>
      {this.state.buttons.map(but => {
        return (<Button key={but.name} type={but.type} onClick={but.onClick} icon={but.icon}>{but.name}</Button>);
      })}
    </div>;
    if (this.tab && buttonFixed) {
      return ReactDom.createPortal(element, this.tab);
    }
    return React.cloneElement(element);
  };
  render() {
    const {
      prefix = 'ro',
      defaultKeys = [],
      defaultButton = false,
      reading,
      labelWidth,
      params,
      dataFormId,
      tableBorder,
      valueNullHolder,
      labelAlign,
      buttonFixed,
      disabledContainer = false,
      navigationRight,
      navigationLeft,
      offsetTop,
      offsetLeft,
      infoType
    } = this.props;
    return (
      <Spin spinning={this.state.spinning}>
        <div style={{ position: 'relative' }} ref={instance => this.infoInstance = instance}>
          {this.renderHeader(prefix, defaultButton, buttonFixed)}
          <Form
            wrappedComponentRef={form => {
              if (form) {
                this.form = form.props.form;
              }
            }}
            {...this.state}
            disabledContainer={disabledContainer}
            reading={reading}
            prefix={prefix}
            defaultKeys={defaultKeys}
            onValuesChange={this.onValuesChange}
            onNoValidateChange={this.onNoValidateChange}
            groupTemplates={this.state.groupTemplates}
            labelWidth={labelWidth}
            params={params}
            dataFormId={dataFormId}
            tableBorder={tableBorder}
            valuenullholder={valueNullHolder}
            labelAlign={labelAlign}
            navigationRight={navigationRight}
            navigationLeft={navigationLeft}
            offsetTop={offsetTop}
            offsetLeft={offsetLeft}
            type={infoType}
          />
        </div>
      </Spin>
    );
  }
}
