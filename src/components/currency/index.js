/**
 * Created by dpcui on 19/12/2017.
 */

import React from 'react';
import { Input } from 'antd';
import numeral from 'numeral';
import { compose } from '../compose';
import { filterProps } from '../../lib/object';
import config from '../../lib/config';
import './style/index.less';

const currencyReg = /(?!^[-\d\.][\d,\.]*)[^\d\.,]/g;
// const numReg = /(?!^[-\d\.][\d\.]*)[^\d\.]/g;

@compose
class RoCurrency extends React.Component {
    static defaultProps = {
        decimalDigits: 2,
        multiplier: 1,
    };
    constructor(props) {
        super(props);
        /* eslint-disable */
        // const value = NumberOpt.accDiv(props.value || 0, this.multiplier);
        // const valueStr = NumberOpt.formatCurrency(value || '', this.decimalDigits);
        this.decimalDigits = props.decimalDigits < 0 ? 2 : props.decimalDigits;
        this.multiplier = props.multiplier < 0 ? 1 : props.multiplier;
        // numeral.zeroFormat('N/A');
        numeral.nullFormat('N/A');
        const showValue = (props.value === null || props.value === '')
            ? 'N/A' : numeral(props.value / this.multiplier).format('0,0.' + this.getDecimalDigits(this.decimalDigits));
        this.state = {
            value: showValue !== 'N/A' ? showValue : null,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.decimalDigits = nextProps.decimalDigits < 0 ? 2 : nextProps.decimalDigits;
        this.multiplier = nextProps.multiplier < 0 ? 1 : nextProps.multiplier;
        // const value = NumberOpt.accDiv(nextProps.value || 0, this.multiplier);
        // const showValue = NumberOpt.formatCurrency(value || '', this.decimalDigits);
        // numeral.zeroFormat('N/A');
        numeral.nullFormat('N/A');
        const showValue = (nextProps.value === null || nextProps.value === '') ?
            'N/A' : numeral(nextProps.value / this.multiplier).format('0,0.' + this.getDecimalDigits(this.decimalDigits));
        this.setState({
            value: showValue !== 'N/A' ? showValue : null,
        });
    }

    getDecimalDigits(value) {
        const newValue = value ? value : 2;
        let result = '';
        for (let i = 0; i < newValue; i ++) {
            result = result + '0';
        }
        return result;
    };
    getDecimalDigitsFocus(value,flag) {
        const newValue = value ? value : 2;
        let result = '';
        if (parseInt(flag)) {
            for (let i = 0; i < newValue; i ++) {
                result = result + '0';
            }
        }
        return result;
    };
    handleCurrencyChange = (e) => {
        let textValue = e.target.value.toString().replace(currencyReg, '');
        this.setState({ value: textValue });
    };

    handleCurrencyBlur = (e) => {
        const { onBlur, onChange, onValueChange } = this.props;
        if (e.target.value === '' || e.target.value === 'N/A') {
            onBlur && onBlur(null);
            onChange && onChange(null);
            onValueChange && onValueChange(null);
        } else {
            // const showValue = NumberOpt.formatCurrency(e.target.value, this.decimalDigits);
            const showValue = numeral(e.target.value).format('0,0.' + this.getDecimalDigits(this.decimalDigits));
            this.setState({ value: showValue !== 'N/A' ? showValue : '' });
            // let numberValue = Number(showValue.replace(numReg, ''));
            // numberValue = NumberOpt.accMul(numberValue, this.multiplier);
            const numberValue = numeral(showValue).multiply(this.multiplier).value();
            onBlur && onBlur(numberValue);
            onChange && onChange(numberValue);
            onValueChange && onValueChange(numberValue);
        }
    };

    handleCurrencyFocus = (e) => {
        this.setState({
            value:(e.target.value !== 'N/A' && e.target.value !== '') ? numeral(e.target.value).format('0.' + this.getDecimalDigitsFocus(this.decimalDigits,e.target.value.split('.')[1])) : null
        });
    };

    render() {
        const { reading, readOnly, compPrefix, suffix, style, prefix = 'ro', item,isTable,valuenullholder,customer=false } = this.props;
        const valueHolder = valuenullholder ? valuenullholder : config.valueNullHolder;
        const limitedLength = item && item.limitedLength > 0 ? (item.limitedLength).toString() : '';
        const readStyle = readOnly ? prefix + '-readonly-input' : null;
        const { value } = this.state;
        if (reading) {
            return (
                !isTable && !value ?
                    <div className={`${prefix}-under-line-${config.readingInfoUnderLine}`}>
                        <span style={{color:'rgba(150,150,150,0.5)'}}>{`${compPrefix || ''}${valueHolder}`}</span>
                        <span style={{ paddingLeft:'8px',color:'rgba(0,0,0,0.7)' }}>{suffix || ''}</span>
                    </div>
                    :
                    <div className={`${prefix}-under-line-${!isTable && config.readingInfoUnderLine}`} style={{display:customer ? 'inline-block' : 'block',textDecoration:customer ? 'underline' : 'unset'}}>
                        {`${compPrefix || ''}${value ? value : ''}`}<span style={{color:'rgba(0,0,0,0.7)',marginLeft:'10px' }}>{suffix || ''}</span>
                    </div>
            );
        }
        return (
            <Input
                {...filterProps(this.props, ['compPrefix', 'decimalDigits', 'dictCodeTreeLeafOnly','reading', 'isTable'])}
                style={style || null}
                className={`${prefix}-input-align ${readStyle}`}
                value={value}
                onChange={this.handleCurrencyChange}
                onBlur={this.handleCurrencyBlur}
                onFocus={this.handleCurrencyFocus}
                addonBefore={compPrefix}
                addonAfter={suffix}
                prefix=''
                suffix=''
                maxLength={parseInt(limitedLength || -1)}
                autoComplete='off'
            />
        );
    }
}

export default RoCurrency;
