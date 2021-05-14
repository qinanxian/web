import React from 'react';
import { Radio } from 'antd';
import { compose } from '../compose';

@compose
export default class RoRadio extends React.Component{
  static Group = Radio.Group;
  static defaultProps = {
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
  handleChange = () => {
    if (this.props.enableCancel) {
      this.setState({ value: !this.state.value });
      this.props.onChange && this.props.onChange(!this.state.value);
    } else {
      this.setState({ value: true });
      this.props.onChange && this.props.onChange(true);
    }
  };
  render() {
    return (
      <Radio
        {...this.props}
        style={this.props.style || null}
        onClick={this.handleChange}
        value={this.state.value}
        disabled={this.props.readOnly || this.props.disabled}
      >
        {this.props.label}
      </Radio>
    );
  }
}
