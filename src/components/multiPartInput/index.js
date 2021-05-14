import React, { Component } from 'react';
import { Input } from 'antd';
import Icon from '../icon';
import './index.less';

class MultiPartInput extends Component {
  constructor(props) {
    super(props);
    const value = props.value || '';
    console.log(value, value.split(' '));
    this.state = {
      inputArr: value.split(' '),
    };
  }

  _onClick = (evt, i) => {
    const { inputArr } = this.state;
    if (i === 0) {
      inputArr.push('');
    } else {
      inputArr.splice(i, 1);
    }
    this.setState({ inputArr: inputArr });
  }

  _onChange = (evt, i) => {
    const { value } = evt.target;
    const { inputArr } = this.state;
    const { onChange, onValueChange } = this.props;
    inputArr[i] = value;
    this.setState({ inputArr: inputArr });
    const str = inputArr.join(' ');
    onChange && onChange(str, inputArr, value, i);
    onValueChange && onValueChange(str, inputArr, value, i);
  }

  _renderInput = (item, index) => {
    const { className, inputClass } = this.props;
    return (
      <div className='fisok-multi-input' key={index}>
        <Input
          className={inputClass}
          onChange={value => this._onChange(value, index)}
          value={item}
        />
        <Icon
          type={index === 0 ? 'plus-circle' : 'minus-circle'}
          className={`fisok-multi-input-i ${className}`}
          onClick={() => this._onClick(item, index)}
        />
      </div>
    );
  }

  render() {
    const { inputArr } = this.state;
    return (
      <div className='fisok-multi-wrapper'>
        {inputArr.map((item, index) => {
          return this._renderInput(item, index);
        })}
      </div>
    );
  }
}

export default MultiPartInput;
