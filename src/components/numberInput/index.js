/**
 * Created by dpcui on 18/12/2017.
 */

import React from 'react';
import { Input } from 'antd';
import numeral  from 'numeral';
import { compose } from '../compose';
import { filterProps } from '../../lib/object';
import config from '../../lib/config';
import classnames from '../../../src/lib/classnames';

const numReg = /(?!^[-\d\.][\d\.]*)[^\d\.]/g;

@compose
class RoNumber extends React.Component {
  static defaultProps = {
    decimalDigits: 0,
    multiplier: 1,
  };
  constructor(props) {
    super(props);
    /* eslint-disable */
    this.decimalDigits = props.decimalDigits < 0 ? 2 : props.decimalDigits;
    this.multiplier = props.multiplier < 0 ? 1 : props.multiplier;
      // numeral.zeroFormat('N/A');
    numeral.nullFormat('N/A');
    // const value = NumberOpt.accDiv(props.value || 0, this.multiplier);
    // const valueStr = NumberOpt.formatNumber(value || '', this.decimalDigits);
    const showValue = (props.value === null || props.value === '') ?
      'N/A' : numeral(props.value / this.multiplier).format('0.' + this.getDecimalDigits(this.decimalDigits));
    this.state = {
      value: showValue !== 'N/A' ? showValue : '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.decimalDigits = nextProps.decimalDigits < 0 ? 2 : nextProps.decimalDigits;
    this.multiplier = nextProps.multiplier < 0 ? 1 : nextProps.multiplier;
    // const value = NumberOpt.accDiv(nextProps.value || 0, this.multiplier);
    // const showValue = NumberOpt.formatNumber(value || '', this.decimalDigits);
    const showValue = (nextProps.value === null || nextProps.value === '') ?
      'N/A' : numeral(nextProps.value / this.multiplier).format('0.' + this.getDecimalDigits(this.decimalDigits));
    this.setState({ value: showValue !== 'N/A' ? showValue : '' });
  }
  getDecimalDigits(value) {
      const newValue = value ? value : (this.props.item.dataType === 'Double' ? 2 : 0);
      let result = '';
      for (let i = 0; i < newValue; i ++) {
          result = result + '0';
      }
      return result;
  };
  handleNumberChange = (e) => {
    const numStr = e.target.value.toString().replace(numReg, '');
    this.setState({ value: numStr });
  };

  handleNumberBlur = (e) => {
    const { onBlur, onChange, onValueChange } = this.props;
    if (e.target.value === '') {
      onBlur && onBlur(null);
      onChange && onChange(null);
      onValueChange && onValueChange(null);
    } else {
      // const showValue = NumberOpt.formatNumber(e.target.value, this.decimalDigits);
      const showValue = numeral(e.target.value).format('0.' + this.getDecimalDigits(this.decimalDigits));
      this.setState({ value: showValue !== 'N/A' ? showValue : '' });
      // let numberValue = Number(showValue.replace(numReg, ''));
      // numberValue = NumberOpt.accMul(numberValue, this.multiplier);
      const numberValue = numeral(showValue).multiply(this.multiplier).value();
      onBlur && onBlur(numberValue);
      onChange && onChange(numberValue);
      onValueChange && onValueChange(numberValue);
      // console.log({ event: e, text: showValue, value: textValue });
    }
  };

  render() {
    const { readOnly, reading, compPrefix, suffix, style, prefix = 'ro', item,isTable,valuenullholder,customer=false } = this.props;
    const valueHolder = valuenullholder ? valuenullholder : config.valueNullHolder;
      const {value} = this.state;
    const limitedLength = item && item.limitedLength > 0 ? (this.getCharNum(value,item.limitedLength)).toString() : '';
    const align = item && item.elementUIHint && item.elementUIHint.textAlign;
    const classes = classnames({
      [`${prefix}-readonly-input`]:readOnly,
      [`${prefix}-input-${align ? align.toLowerCase() : 'left'}`]:true
    });
    if (reading) {
      return (
        !isTable && (value === '' || value === null) ?
          <div className={`${prefix}-under-line-${config.readingInfoUnderLine}`}>
            <span style={{color:'rgba(150,150,150,0.4)'}}>{`${compPrefix || ''}${valueHolder}`}</span>
            <span style={{ paddingLeft:'8px',color:'rgba(0,0,0,0.7)' }}>{`${suffix || ''}`}</span>
          </div>
          :
          <div style={{display:customer ? 'inline-block' : 'block',textDecoration:customer ? 'underline' : 'unset'}} className={`${prefix}-under-line-${!isTable && config.readingInfoUnderLine}`}>
            {`${compPrefix || ''}${(item && item.dataType && item.dataType === 'Integer') ? value.toString().split('.')[0] : value}`}
            <span style={{color:'rgba(0,0,0,0.7)',marginLeft:'10px' }}>{suffix || ''}</span>
          </div>
      );
    }
    return (
      <Input
        {...filterProps(this.props, ['compPrefix', 'decimalDigits', 'dictCodeTreeLeafOnly','reading', 'isTable'])}
        style={style || null}
        className={classes}
        onChange={this.handleNumberChange}
        value={this.state.value}
        onBlur={this.handleNumberBlur}
        addonBefore={compPrefix}
        addonAfter={suffix}
        prefix=''
        suffix=''
        maxLength={parseInt(limitedLength || -1)}
        autoComplete='off'
      />
    );
  }
  getCharNum = (value,length) => {
    return value&&value.indexOf('.') !== -1 ? length + 1 : length;
  };
}

export default RoNumber;
