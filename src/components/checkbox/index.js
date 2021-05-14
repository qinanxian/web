import React from 'react';
import ReactDom from 'react-dom';
import {Checkbox} from 'antd';
import {compose} from '../compose';
import config from '../../lib/config';
import {filterProps} from '../../lib/object';

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
    let value = props.value || [];
    if (typeof props.value === 'string') value = props.value.split(',').filter(v => !!v);
    this.state = {
      value: value,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.value === 'string') {
      this.setState({ value: nextProps.value.split(',') });
    } else {
      this.setState({ value: nextProps.value || [] });
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
  handleGroupChange = (value) => {
    const { item = {} } = this.props;
    this.setState({ value: value });
    this.props.onChange && this.props.onChange((value || []).filter(v => !!v).join(','));
    item.onNoValidateChange && item.onNoValidateChange({[item.code]: (value || []).filter(v => !!v).join(',')});
  };
  render() {
    const {reading, prefix = 'ro',isTable,valuenullholder } = this.props;
    const valueHolder = valuenullholder ? valuenullholder : config.valueNullHolder;
    if (reading) {
      const nameArr = this.state.value
        .map(item => this.getDictName(this.props.options, item)).filter(value => !!value);
      return (
        !isTable && !nameArr.length ?
          <div className={`${prefix}-under-line-${config.readingInfoUnderLine}`} style={{color:'rgba(150,150,150,0.4)'}}>{valueHolder}</div>
          :
          <div className={`${prefix}-under-line-${!isTable && config.readingInfoUnderLine}`}>{nameArr && nameArr.toString()}</div>
      );
    }
    return (
      <CheckboxGroup
        {...filterProps(this.props, ['compPrefix', 'dictCodeTreeLeafOnly', 'decimalDigits', 'optionField', 'optionName', 'reading'])}
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

export default RoCheckBoxGroup;
