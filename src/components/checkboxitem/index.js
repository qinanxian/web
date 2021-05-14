/**
 * Created by dpcui on 20/01/2018.
 */

import React from 'react';
import {Checkbox} from 'antd';
import {compose} from '../compose';
import config from '../../lib/config';

const CheckboxGroup = Checkbox.Group;
/* eslint-disable */
@compose
class RoCheckBoxGroup extends React.Component {
  static defaultProps = {
    optionField: 'code',
    optionName: 'name',
  };
  constructor(props) {
    super(props);
    this.options = this.dataFormat(props.options);
    this.state = {
      value: props.value,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }
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
  handleGroupChange = (value) => {
    this.setState({ value: value });
    this.props.onChange && this.props.onChange(value);
  };
  render() {
    if (this.props.reading) {
      return (
        <div>{this.state.value && this.state.value.toString()}</div>
      );
    }
    return (
      <CheckboxGroup
        {...this.props}
        value={this.state.value}
        options={this.options}
        onChange={this.handleGroupChange}
      />
    );
  }
}

export default class RoCheckBox extends React.Component {
  static Group = RoCheckBoxGroup;
  constructor(props) {
    super(props);
    this.state = { value: props.value };
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }
  handleChange = (e) => {
    this.setState({ value: e.target.checked });
    this.props.onChange && this.props.onChange(e.target.checked);
  };
  render() {
    const {reading, prefix = 'ro',isTable,valuenullholder } = this.props;
    const valueHolder = valuenullholder ? valuenullholder : config.valueNullHolder;
    if (reading) {
      return (
        !isTable && !this.state.value ?
          <div className={`${prefix}-under-line-${config.readingInfoUnderLine}`} style={{color:'rgba(150,150,150,0.4)'}}>{valueHolder}</div>
          :
          <div className={`${prefix}-under-line-${!isTable && config.readingInfoUnderLine}`}>{this.state.value ? '是' : '否'}</div>
      );
    }
    return (
      <Checkbox
        {...this.props}
        style={this.props.style || null}
        onChange={this.handleChange}
        checked={this.state.value}
        disabled={this.props.readOnly || this.props.disabled}
      />
    );
  }
}
