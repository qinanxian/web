import React from 'react';
import ReactDom from 'react-dom';
import { Radio } from 'antd';
import { compose } from '../compose';
import config from '../../lib/config';

const RadioGroup = Radio.Group;
/* eslint-disable */
@compose
export default class RadioBox extends React.Component{
  static defaultProps = {
    optionField: 'code',
    optionName: 'name',
    enableCancel: false,
  };
  constructor(props) {
    super(props);
    this.state = { value: props.value };
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }
  getDictName = (options, value) => {
    const { optionField, optionName } = this.props;
    const dic = options && options.filter(ob => ob[optionField] === value)[0];
    return dic && dic[optionName];
  };

  dataFormat = (data) => {
    const { optionField, optionName, optionDisabled } = this.props;
    let newData = [];
    if (data && data[0] instanceof Object) {
      data.forEach((item) => {
        const newItem = {
          label: item[optionName],
          value: item[optionField],
        };
        if(optionDisabled && optionDisabled.includes(item[optionField])) {
          newItem.disabled = true;
        }
        newData.push(newItem);
      });
    } else {
      newData = [...(data || [])];
    }
    return newData;
  };

  handleGroupChange = (e) => {
    const { item = {} } = this.props;
    this.flag = true;
    let tempValue = null;
    if (this.props.enableCancel && e.target.value === this.state.value) {
      tempValue = null;
      this.props.onChange && this.props.onChange(null);
    } else {
      tempValue = e.target.value;
      this.props.onChange && this.props.onChange(e.target.value);
    }
    this.setState({ value:  tempValue });
    item.onNoValidateChange && item.onNoValidateChange({[item.code]: tempValue});
  };
  render() {
    const {reading,prefix = 'ro',isTable,valuenullholder } = this.props;
    const valueHolder = valuenullholder ? valuenullholder : config.valueNullHolder;
    if (reading) {
      return (
        !isTable && !this.state.value ?
          <div className={`${prefix}-under-line-${config.readingInfoUnderLine}`} style={{color:'rgba(150,150,150,0.4)'}}>{valueHolder}</div>
          :
          <div className={`${prefix}-under-line-${!isTable && config.readingInfoUnderLine}`}>{this.getDictName(this.props.options, this.state.value) || ''}</div>
      );
    }
    return(
      <RadioGroup
        {...this.props}
        ref={instance => this.instance = instance}
        style={this.props.style || null}
        value={this.state.value}
        options={this.dataFormat(this.props.options)}
        onChange={this.handleGroupChange}
        disabled={this.props.readOnly || this.props.disabled}
      />
    );
  }
}
