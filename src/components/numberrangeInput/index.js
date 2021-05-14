/**
 * Created by dpcui on 28/02/2018.
 */

import React from 'react';
import { Input } from 'antd';
import { NumberInput } from '../index';
import { compose } from '../compose';
import './style/index.less';

const InputGroup = Input.Group;
@compose
class RoNumberRangeInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      v0: props.value && props.value[0],
      v1: props.value && props.value[1],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value && (this.state.v0 !== nextProps.value[0]
      || this.state.v1 !== nextProps.value[1])) {
      this.setState({
        v0: nextProps.value && nextProps.value[0],
        v1: nextProps.value && nextProps.value[1],
      });
    }
  }

  handleChange0 = (value) => {
    this.setState({ v0: value });
    const tempArray = [value, this.state.v1].some(v => !v) ? [] : [value, this.state.v1];
    this.props.onChange && this.props.onChange(tempArray);
  };

  handleChange1 = (value) => {
    this.setState({ v1: value });
    const tempArray = [this.state.v0, value].some(v => !v) ? [] : [this.state.v0, value];
    this.props.onChange && this.props.onChange(tempArray);
  };

  render() {
    const { prefix = 'ro', suffix, placeholder, InputStyle, decimalDigits, item, readOnly } = this.props;
    const limitedLength = item && item.limitedLength > 0 ? (item.limitedLength).toString() : '';
    return (
      <InputGroup
        {...this.props}
        compact
        className={`${prefix}-number-range-input`}
      >
        <NumberInput
          readOnly={readOnly}
          style={{ width: 150, textAlign: 'center', ...InputStyle }}
          placeholder={placeholder && placeholder[0] || placeholder}
          onChange={this.handleChange0}
          value={this.state.v0}
          addonBefore={prefix}
          addonAfter={suffix}
          decimalDigits={decimalDigits}
          item={item}
        />
        <Input
          style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }}
          placeholder="~"
          disabled
          maxLength={limitedLength}
        />
        <NumberInput
          readOnly={readOnly}
          style={{ width: 150, textAlign: 'center', ...InputStyle, borderLeft: 0}}
          placeholder={placeholder && placeholder[1] || placeholder}
          onChange={this.handleChange1}
          value={this.state.v1}
          addonBefore={prefix}
          addonAfter={suffix}
          decimalDigits={decimalDigits}
          item={item}
        />
      </InputGroup>
    );
  }
}

export default RoNumberRangeInput;
