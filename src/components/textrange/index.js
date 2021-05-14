/**
 * Created by dpcui on 09/02/2018.
 */

import React from 'react';
import { Input } from 'antd';
import {compose} from '../compose';

const InputGroup = Input.Group;
@compose
class RoTextRange extends React.Component {
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

  handleChange0 = (e) => {
    const value = e.target.value || '';
    this.setState({ v0: value });
    this.props.onChange && this.props.onChange([value, this.state.v1]);
  };

  handleChange1 = (e) => {
    const value = e.target.value || '';
    this.setState({ v1: value });
    this.props.onChange && this.props.onChange([this.state.v0, value]);
  };

  render() {
    const { prefix, suffix, placeholder, InputStyle, item } = this.props;
    const limitedLength = item && item.limitedLength > 0 ? item.limitedLength : '';
    return (
      <InputGroup
        {...this.props}
        compact
      >
        <Input
          style={{ width: 150, textAlign: 'center', ...InputStyle }}
          placeholder={placeholder && placeholder[0] || placeholder}
          onChange={this.handleChange0}
          value={this.state.v0}
          addonBefore={prefix}
          addonAfter={suffix}
          prefix=''
          suffix=''
          maxLength={limitedLength}
        />
        <Input
          style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }}
          placeholder="~"
          disabled
          maxLength={limitedLength}
        />
        <Input
          style={{ width: 150, textAlign: 'center', ...InputStyle, borderLeft: 0}}
          placeholder={placeholder && placeholder[1] || placeholder}
          onChange={this.handleChange1}
          value={this.state.v1}
          addonBefore={prefix}
          addonAfter={suffix}
          prefix=''
          suffix=''
          maxLength={limitedLength}
        />
      </InputGroup>
    );
  }
}

export default RoTextRange;
